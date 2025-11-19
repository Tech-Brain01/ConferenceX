import express from "express";
import pool from "../models/db.js";
import multer from "multer";
import { authenticateJWT, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        r.id, 
        r.name,
        c.capacity,          
        r.capacity_id, 
        r.available_from, 
        r.image,
        r.location,
        r.price,
        JSON_AGG(f.name) AS features,
        GREATEST(
          r.available_from,
          COALESCE(
            (SELECT MAX(end_date) + INTERVAL '1 day' FROM bookings b WHERE b.room_id = r.id AND b.status = 'approved'),
            DATE '1900-01-01'
          )
        ) AS dynamic_available_from
      FROM rooms r
      LEFT JOIN capacities c ON r.capacity_id = c.id
      LEFT JOIN room_features rf ON r.id = rf.room_id
      LEFT JOIN features f ON rf.feature_id = f.id AND f.hidden = FALSE
      GROUP BY r.id, r.name, c.capacity, r.capacity_id, r.available_from, r.image, r.location, r.price
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Failed to get rooms:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const result = await pool.query("SELECT * FROM rooms WHERE id = $1", [id]);
  const room = result.rows[0];

  if (!room) return res.status(404).json({ error: "Room not found" });

  const featuresResult = await pool.query(
    `SELECT f.id, f.name 
     FROM features f 
     JOIN room_features rf ON f.id = rf.feature_id 
     WHERE rf.room_id = $1 AND f.hidden = FALSE`,
    [id]
  );

  const features = featuresResult.rows;

  res.json({
    ...room,
    features,
    feature_ids: features.map((f) => f.id),
  });
});


router.get("/:roomId/feedbacks", async (req, res) => {
  const { roomId } = req.params;

  try {
    const result = await pool.query(
      `SELECT b.feedback, b.rating ,u.name AS username 
       FROM bookings b
       JOIN users u ON b.user_id = u.id
       WHERE b.room_id = $1 AND b.feedback IS NOT NULL AND b.feedback != ''`,
      [roomId]
    );

    res.json(result.rows);
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

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
 
      const roomResult = await client.query(
        "INSERT INTO rooms (name, capacity_id, available_from, image, location, price) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
        [name, capacity_id, foermattedDate, image, location, price]
      );

      const roomId = roomResult.rows[0].id;

      for (const fid of feature_ids) {
        await client.query(
          "INSERT INTO room_features (room_id, feature_id) VALUES ($1, $2)",
          [roomId, fid]
        );
      }

      await client.query('COMMIT');
      res.status(201).json({ message: "Room created", roomId });
    } catch (error) {
      await client.query('ROLLBACK');

      if (error.code === '23505') { // PostgreSQL unique violation
        return res
          .status(400)
          .json({
            error: "Room name already exists. Please choose a unique name.",
          });
      }

      console.error("CREATE ERROR:", error);
      res.status(500).json({ error: "Failed to create room" });
    } finally {
      client.release();
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

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

     
      let image = null;

      if (req.file?.filename) {
        image = req.file.filename;
      } else if (req.body.image && typeof req.body.image === "string") {
        image = req.body.image;
      } else {
        const roomBefore = await client.query(
          "SELECT image FROM rooms WHERE id = $1",
          [id]
        );
        image = roomBefore.rows[0]?.image || "OIP.webp";
      }

      await client.query(
        `UPDATE rooms SET name = $1, capacity_id = $2, available_from = $3, image = $4, location = $5, price = $6 WHERE id = $7`,
        [name, capacity_id, formattedDate, image, location, price, id]
      );

      await client.query(`DELETE FROM room_features WHERE room_id = $1`, [id]);

      for (const fid of feature_ids) {
        await client.query(
          `INSERT INTO room_features (room_id, feature_id) VALUES ($1, $2)`,
          [id, fid]
        );
      }

      const updatedRoom = await client.query(
        "SELECT * FROM rooms WHERE id = $1",
        [id]
      );
      const features = await client.query(
        `SELECT f.id, f.name 
   FROM features f 
   JOIN room_features rf ON f.id = rf.feature_id 
   WHERE rf.room_id = $1 AND f.hidden = FALSE`,
        [id]
      );

      await client.query('COMMIT');
      res.json({
        message: "Room updated successfully",
        room: { ...updatedRoom.rows[0], features: features.rows },
      });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error("UPDATE ERROR:", error);
      res.status(500).json({ error: "Failed to update room" });
    } finally {
      client.release();
    }
  }
);

router.delete("/:id", authenticateJWT, isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Check for approved bookings in the future
    const result = await pool.query(
      `SELECT COUNT(*) AS count FROM bookings
       WHERE room_id = $1 AND status = 'approved' AND end_date >= CURRENT_DATE`,
      [id]
    );

    const count = parseInt(result.rows[0].count);

    if (count > 0) {
      return res.status(400).json({
        error: "Cannot delete room with active or future approved bookings.",
      });
    }

    await pool.query("DELETE FROM rooms WHERE id = $1", [id]);

    res.json({ message: "Room deleted successfully" });
  } catch (err) {
    console.error("Error deleting room:", err);
    res.status(500).json({ err: "Failed to delete room" });
  }
});




export default router;
