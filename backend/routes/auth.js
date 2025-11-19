import express from "express";
import bcrypt from "bcrypt";
import pool from "../models/db.js";
import { authenticateJWT, isAdmin } from "../middleware/authMiddleware.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.get("/users", authenticateJWT, isAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, role, created_at, isrestrict FROM users WHERE role = $1",
      ["user"]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/signup", async (req, res) => {
  const { name, email, password, captcha } = req.body;

  if (!name || !email || !password || !captcha) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (!captcha || captcha !== req.session.captcha) {
    return res.status(400).json({ error: "Invalid or missing CAPTCHA" });
  }

  req.session.captcha = null;

  if (name.length < 3 || name.length > 30) {
    return res
      .status(400)
      .json({ error: "Username must be between 3 and 30 characters" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  if (password.length < 8) {
    return res
      .status(400)
      .json({ error: "Password must be at least 8 characters long" });
  }

  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/;
  if (!passwordRegex.test(password)) {
    return res
      .status(400)
      .json({
        error: "Password must include uppercase, lowercase, and a number",
      });
  }

  try {
    const existing = await pool.query(
      "SELECT id from users WHERE email = $1",
      [email]
    );
    if (existing.rows.length) {
      return res.status(400).json({ error: "Email already exists" });
    }



    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id",
      [name, email, hashedPassword]
    );

    const user = { id: result.rows[0].id, name, email, role: "user" };

    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "2h" });

    res.status(201).json({ user, token });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password, captcha } = req.body;

  // console.log("Submitted CAPTCHA:", captcha);
  // console.log("Stored session CAPTCHA:", req.session.captcha);

  if (!captcha || captcha !== req.session.captcha) {
    return res.status(400).json({ error: "Invalid or missing CAPTCHA" });
  }

  req.session.captcha = null;

  try {
    const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (!userResult.rows.length) return res.status(400).json({ error: "User not found" });

    const user = userResult.rows[0];

    if (user.isrestrict === 1 || user.isrestrict === true) {
      return res.status(403).json({ error: "User is restricted" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    await pool.query("UPDATE users SET lastLogin = NOW() WHERE id = $1", [
      user.id,
    ]);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/rooms/add", authenticateJWT, isAdmin, async (req, res) => {
  res.json({ message: "Room added by admin" });
});

// PATCH /user - Update user info
router.patch("/user", authenticateJWT, async (req, res) => {
  const userId = req.user.id;
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  try {
    await pool.query("UPDATE users SET name = $1, email = $2 WHERE id = $3", [
      name,
      email,
      userId,
    ]);
    const updatedUser = await pool.query(
      "SELECT id, name, email, role, lastLogin FROM users WHERE id = $1",
      [userId]
    );
    res.json({ user: updatedUser.rows[0] });
  } catch (err) {
    if (err.code === '23505') { // PostgreSQL unique violation
      return res.status(400).json({ error: "Email already exists" });
    }
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /api/auth/password
router.patch("/password", authenticateJWT, async (req, res) => {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ error: "Both current and new passwords are required" });
  }

  try {
    const rows = await pool.query("SELECT password FROM users WHERE id = $1", [
      userId,
    ]);
    if (!rows.rows.length) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, rows.rows[0].password);
    if (!isMatch)
      return res.status(400).json({ error: "Current password is incorrect" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query("UPDATE users SET password = $1 WHERE id = $2", [
      hashedPassword,
      userId,
    ]);

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Password update error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch(
  "/user/:id/restrict",
  authenticateJWT,
  isAdmin,
  async (req, res) => {
    const userId = req.params.id;
    const { isrestrict } = req.body;

    if (typeof isrestrict !== "boolean") {
      return res.status(400).json({ error: "isrestrict boolean is required" });
    }

    try {
      await pool.query("UPDATE users SET isrestrict = $1 WHERE id = $2", [
        isrestrict,
        userId,
      ]);
      const updatedUser = await pool.query(
        "SELECT id, name, email, isrestrict FROM users WHERE id = $1",
        [userId]
      );

      if (!updatedUser.rows.length)
        return res.status(404).json({ error: "User not found" });

      res.json({
        user: updatedUser.rows[0],
        message: `User ${
          isrestrict ? "restricted" : "unrestricted"
        } successfully.`,
      });
    } catch (error) {
      console.error("Error updating restrict status:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// DELETE /user - Delete user with password verification (already provided)
router.delete("/user", authenticateJWT, async (req, res) => {
  const userId = req.user.id;
  const { password } = req.body;

  if (!password) {
    return res
      .status(400)
      .json({ error: "Password is required to delete account." });
  }

  try {
    const userRows = await pool.query(
      "SELECT password FROM users WHERE id = $1",
      [userId]
    );
    if (!userRows.rows.length)
      return res.status(404).json({ error: "User not found." });

    const isMatch = await bcrypt.compare(password, userRows.rows[0].password);
    if (!isMatch) return res.status(400).json({ error: "Incorrect password." });

    await pool.query("DELETE FROM users WHERE id = $1", [userId]);
    res.json({ message: "User account deleted successfully." });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
