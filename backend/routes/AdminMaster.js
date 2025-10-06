import express from "express";
import pool from "../models/db.js";
import { authenticateJWT, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ALL ROUTES FOR CAPACITYS

router.get("/capacity", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        c.*,
        COUNT(r.id) AS used_count,
        GROUP_CONCAT(r.name SEPARATOR ', ') AS used_rooms
      FROM capacities c
      LEFT JOIN rooms r ON c.id = r.capacity_id
      GROUP BY c.id
      ORDER BY c.capacity ASC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/capacity", authenticateJWT, isAdmin, async (req, res) => {
  const { capacity } = req.body;

  try {
    const [rows] = await pool.query(
      `INSERT INTO capacities (capacity) VALUES (?)`,
      [capacity]
    );
    res.status(201).json({ id: rows.insertId, capacity });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/capacity/:id", authenticateJWT, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { capacity, hidden } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE capacities SET capacity = COALESCE(?, capacity), hidden = COALESCE(?, hidden) WHERE id = ?`,
      [capacity, hidden, id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Capacity not found" });
    res.json({ message: "capacity updated" });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.delete("/capacity/:id", authenticateJWT, isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const [[{ count }]] = await pool.query(
      `SELECT COUNT(*) as count FROM rooms WHERE capacity_id = ?`,
      [id]
    );
    if (count > 0) {
      return res.status(400).json({
        error: "Capacity is currently used in rooms and cannot be deleted.",
      });
    }

    const [result] = await pool.query(`DELETE from capacities WHERE id = ?`, [
      id,
    ]);
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Capacity not found" });

    res.json({ message: "Capacity deleted" });
  } catch (err) {
    console.error("Delete capacity error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ALL ROUTES FOR FEATURES

router.get("/feature", async (req, res) => {
  try {
    const [rows] = await pool.query(`
  SELECT 
    f.*,
    COUNT(rf.room_id) AS used_count,
    GROUP_CONCAT(r.name SEPARATOR ', ') AS used_rooms
  FROM features f
  LEFT JOIN room_features rf ON f.id = rf.feature_id
  LEFT JOIN rooms r ON rf.room_id = r.id
  GROUP BY f.id
  ORDER BY f.name ASC
`);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/feature", authenticateJWT, isAdmin, async (req, res) => {
  const { name } = req.body;
  try {
    const [rows] = await pool.query(`INSERT INTO features (name) VALUES (?)`, [
      name,
    ]);
    res.status(201).json({ id: rows.insertId, name });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/feature/:id", authenticateJWT, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, hidden } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE features SET name = COALESCE(?, name), hidden = COALESCE(?, hidden) WHERE id = ?`,
      [name, hidden, id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ err: "feature not found" });
    res.json({ message: "feature updated" });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.delete("/feature/:id", authenticateJWT, isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const [[{ count }]] = await pool.query(
      `SELECT COUNT(*) as count FROM room_features WHERE feature_id = ?`,
      [id]
    );
    if (count > 0) {
      return res.status(400).json({
        error: "Feature is currently used in rooms and cannot be deleted.",
      });
    }

    const [result] = await pool.query(`DELETE FROM features WHERE id = ?`, [
      id,
    ]);
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Feature not found" });

    res.json({ message: "Feature deleted" });
  } catch (err) {
    console.error("Delete feature error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
