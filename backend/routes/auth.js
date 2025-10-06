import express from "express";
import bcrypt from "bcrypt";
import pool from "../models/db.js";
import { authenticateJWT, isAdmin } from "../middleware/authMiddleware.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


const router = express.Router();


router.get('/users', authenticateJWT, isAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, email, role, created_at, isrestrict FROM users WHERE role = ?', ['user']);

    res.json(rows);  
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
   
    const hashedPassword = await bcrypt.hash(password, 10);


    const [result] = await pool.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    const user = { id: result.insertId, name, email, role: 'user' };

    
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '2h' });

    res.status(201).json({ user, token });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Email already exists' });
    }

    console.error('Signup error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const [user] = await pool.query("select * from users where email = ?", [email]);

  if (!user.length) return res.status(400).json({ error: "User not found" });

  if (user[0].isrestrict === 1) {
    return res.status(403).json({ error: "User is restricted and cannot log in" });
  }

  const match = await bcrypt.compare(password, user[0].password);
  if (!match) return res.status(400).json({ error: "Invalid password" });

  const token = jwt.sign(
    { id: user[0].id, name: user[0].name, email: user[0].email, role: user[0].role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  await pool.query("UPDATE users SET lastLogin = NOW() WHERE id = ?", [user[0].id]);

  res.json({ message: "login successful", token, user: { id: user[0].id,name: user[0].name, email: user[0].email, role: user[0].role , lastLogin: user[0].lastLogin} });
});


router.post("/rooms/add", authenticateJWT , isAdmin, async (req, res) => {
  
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
    await pool.query("UPDATE users SET name = ?, email = ? WHERE id = ?", [name, email, userId]);
    const [updatedUser] = await pool.query("SELECT id, name, email, role, lastLogin FROM users WHERE id = ?", [userId]);
    res.json({ user: updatedUser[0] });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
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
    return res.status(400).json({ error: "Both current and new passwords are required" });
  }

  try {
    const [rows] = await pool.query("SELECT password FROM users WHERE id = ?", [userId]);
    if (!rows.length) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, rows[0].password);
    if (!isMatch) return res.status(400).json({ error: "Current password is incorrect" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, userId]);

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Password update error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.patch("/user/:id/restrict" , authenticateJWT , isAdmin , async(req,res) => {
  const userId = req.params.id;
  const {isrestrict} = req.body;

   if (typeof isrestrict !== 'boolean') {
    return res.status(400).json({ error: 'isrestrict boolean is required' });
  }

  try {
    await pool.query('UPDATE users SET isrestrict = ? WHERE id = ?', [isrestrict, userId]);
    const [updatedUser] = await pool.query('SELECT id, name, email, isrestrict FROM users WHERE id = ?', [userId]);

    if (!updatedUser.length) return res.status(404).json({ error: 'User not found' });

    res.json({ user: updatedUser[0], message: `User ${isrestrict ? 'restricted' : 'unrestricted'} successfully.` });
  } catch (error) {
    console.error('Error updating restrict status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// DELETE /user - Delete user with password verification (already provided)
router.delete("/user", authenticateJWT, async (req, res) => {
  const userId = req.user.id;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: "Password is required to delete account." });
  }

  try {
    const [userRows] = await pool.query("SELECT password FROM users WHERE id = ?", [userId]);
    if (!userRows.length) return res.status(404).json({ error: "User not found." });

    const isMatch = await bcrypt.compare(password, userRows[0].password);
    if (!isMatch) return res.status(400).json({ error: "Incorrect password." });

    await pool.query("DELETE FROM users WHERE id = ?", [userId]);
    res.json({ message: "User account deleted successfully." });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


export default router;