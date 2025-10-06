import express from "express";
import pool from "../models/db.js";
import multer from "multer";
import { authenticateJWT, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.get("/", async (req, res) => {
  try {
    const [rooms] = await pool.query(`
      SELECT 
        r.id, 
        r.name,
        c.capacity,          
        r.capacity_id, 
        r.available_from, 
        r.image,
        r.location,
        r.price,
        JSON_ARRAYAGG(f.name) AS features,
        GREATEST(
          r.available_from,
          DATE_ADD(
            IFNULL(
              (SELECT MAX(end_date) FROM bookings b WHERE b.room_id = r.id AND b.status = 'approved'),
              '1900-01-01'
            ),
            INTERVAL 1 DAY
          )
        ) AS dynamic_available_from
      FROM rooms r
      LEFT JOIN capacities c ON r.capacity_id = c.id
      LEFT JOIN room_features rf ON r.id = rf.room_id
      LEFT JOIN features f ON rf.feature_id = f.id AND f.hidden = FALSE
      GROUP BY r.id
    `);
    res.json(rooms);
  } catch (error) {
    console.error("Failed to get rooms:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const [[room]] = await pool.query("SELECT * FROM rooms WHERE id = ?", [id]);

  if (!room) return res.status(404).json({ error: "Room not found" });

  const [features] = await pool.query(
    `SELECT f.id, f.name 
     FROM features f 
     JOIN room_features rf ON f.id = rf.feature_id 
     WHERE rf.room_id = ? AND f.hidden = FALSE`,
    [id]
  );

  res.json({
    ...room,
    features,
    feature_ids: features.map((f) => f.id),
  });
});


router.get("/:roomId/feedbacks", async (req, res) => {
  const { roomId } = req.params;

  try {
    const [rows] = await pool.query(
      `SELECT b.feedback, u.name AS username 
       FROM bookings b
       JOIN users u ON b.user_id = u.id
       WHERE b.room_id = ? AND b.feedback IS NOT NULL AND b.feedback != ''`,
      [roomId]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error fetching feedbacks:", err);
    res.status(500).json({ error: "Failed to fetch feedbacks" });
  }
});


router.post(
  "/",
  authenticateJWT,
  isAdmin,
  upload.single("image"),
  async (req, res) => {
    const { name, capacity_id, available_from, location, price } = req.body;

    let { feature_ids = [] } = req.body;

    // Parse feature_ids from string if needed
    if (typeof feature_ids === "string") {
      try {
        feature_ids = JSON.parse(feature_ids);
      } catch (err) {
        return res.status(400).json({ error: "Invalid feature_ids format" });
      }
    }

    const image = req.file?.filename || "OIP.webp";

    const formatDateForMySQL = (dateInput) => {
      if (!dateInput) return null;
      const d = new Date(dateInput);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    };

    const foermattedDate = formatDateForMySQL(available_from);

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
 
      const [roomResult] = await conn.query(
        "INSERT INTO rooms (name, capacity_id, available_from, image, location, price) VALUES (?, ?, ?, ?, ?, ?)",
        [name, capacity_id, foermattedDate, image, location, price]
      );

      const roomId = roomResult.insertId;

      for (const fid of feature_ids) {
        await conn.query(
          "INSERT INTO room_features (room_id, feature_id) VALUES (?, ?)",
          [roomId, fid]
        );
      }

      await conn.commit();
      res.status(201).json({ message: "Room created", roomId });
    } catch (error) {
      await conn.rollback();

      if (error.code === "ER_DUP_ENTRY") {
        return res
          .status(400)
          .json({
            error: "Room name already exists. Please choose a unique name.",
          });
      }

      console.error("CREATE ERROR:", error);
      res.status(500).json({ error: "Failed to create room" });
    } finally {
      conn.release();
    }
  }
);

router.patch(
  "/:id",
  authenticateJWT,
  isAdmin,
  upload.single("image"),
  async (req, res) => {
    const { id } = req.params;
    const { name, capacity_id, available_from, location, price } = req.body;

    let { feature_ids = [] } = req.body;

    // console.log("feature_ids type:", typeof feature_ids);
    // console.log("feature_ids value:", feature_ids);

    if (typeof feature_ids === "string") {
      try {
        feature_ids = JSON.parse(feature_ids);
        if (!Array.isArray(feature_ids)) {
          throw new Error("Parsed feature_ids is not an array");
        }
      } catch (error) {
        console.error("Invalid feature_ids format:", feature_ids);
        return res.status(400).json({ error: "Invalid feature_ids format" });
      }
    } else if (!Array.isArray(feature_ids)) {
      return res
        .status(400)
        .json({ error: "feature_ids must be an array or JSON string" });
    }

    if (!name || !capacity_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const formatDateForMySQL = (dateInput) => {
      if (!dateInput) return null;
      const d = new Date(dateInput);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    };

    const formattedDate = formatDateForMySQL(available_from);

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

     
      let image = null;

      if (req.file?.filename) {
        image = req.file.filename;
      } else if (req.body.image && typeof req.body.image === "string") {
        image = req.body.image;
      } else {
        const [[roomBefore]] = await conn.query(
          "SELECT image FROM rooms WHERE id = ?",
          [id]
        );
        image = roomBefore?.image || "OIP.webp";
      }

      await conn.query(
        `UPDATE rooms SET name = ?, capacity_id = ?, available_from = ?, image = ?, location = ?, price = ? WHERE id = ?`,
        [name, capacity_id, formattedDate, image, location, price, id]
      );

      await conn.query(`DELETE FROM room_features WHERE room_id = ?`, [id]);

      for (const fid of feature_ids) {
        await conn.query(
          `INSERT INTO room_features (room_id, feature_id) VALUES (?, ?)`,
          [id, fid]
        );
      }

      const [[updatedRoom]] = await conn.query(
        "SELECT * FROM rooms WHERE id = ?",
        [id]
      );
      const [features] = await conn.query(
        `SELECT f.id, f.name 
   FROM features f 
   JOIN room_features rf ON f.id = rf.feature_id 
   WHERE rf.room_id = ? AND f.hidden = FALSE`,
        [id]
      );

      await conn.commit();
      res.json({
        message: "Room updated successfully",
        room: { ...updatedRoom, features },
      });
    } catch (error) {
      await conn.rollback();
      console.error("UPDATE ERROR:", error);
      res.status(500).json({ error: "Failed to update room" });
    } finally {
      conn.release();
    }
  }
);

router.delete("/:id", authenticateJWT, isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Check for approved bookings in the future
    const [[{ count }]] = await pool.query(
      `SELECT COUNT(*) AS count FROM bookings
       WHERE room_id = ? AND status = 'approved' AND end_date >= CURDATE()`,
      [id]
    );

    if (count > 0) {
      return res.status(400).json({
        error: "Cannot delete room with active or future approved bookings.",
      });
    }

    await pool.query("DELETE FROM rooms WHERE id = ?", [id]);

    res.json({ message: "Room deleted successfully" });
  } catch (err) {
    console.error("Error deleting room:", err);
    res.status(500).json({ err: "Failed to delete room" });
  }
});




export default router;
