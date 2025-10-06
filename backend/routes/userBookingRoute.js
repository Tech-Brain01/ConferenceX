import express from "express";
import pool from "../models/db.js";
import { authenticateJWT, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// fetch all the bookings of logged-in user
router.get("/my-bookings", authenticateJWT, async (req, res) => {
  const userId = req.user.id;

  try {
    const [bookings] = await pool.query(
      `SELECT b.id, b.booking_ref, b.start_date, b.end_date, b.status, b.payment_status,
          r.name AS room_name, r.image, r.price,
          b.reject_response , b.feedback
   FROM bookings b
   JOIN rooms r ON b.room_id = r.id
   WHERE b.user_id = ?
   ORDER BY b.start_date DESC`,
      [userId]
    );

    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

// fetch a detail info about the particular booking
router.get("/:id", authenticateJWT, async (req, res) => {
  const bookingId = req.params.id;
  const userId = req.user.id;

  try {
    const [[booking]] = await pool.query(
      `SELECT b.*, r.name AS room_name, r.image  , b.reject_response
       FROM bookings b
       JOIN rooms r ON b.room_id = r.id
       WHERE b.id = ? AND b.user_id = ?`,
      [bookingId, userId]
    );

    if (!booking) return res.status(404).json({ err: "Booking not found" });

    res.json(booking);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: "Server error" });
  }
});

// Get booked dates for a specific room (to mark booked dates in frontend)
router.get("/room/:roomId/booked-dates", async (req, res) => {
  const { roomId } = req.params;

  try {
    const [bookings] = await pool.query(
      `SELECT start_date, end_date 
       FROM bookings 
       WHERE room_id = ? 
         AND status != 'cancelled' AND status != 'rejected'`,
      [roomId]
    );

    // Return an array of { start_date, end_date }
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch booked dates" });
  }
});

// Create a new booking
router.post("/book", authenticateJWT, async (req, res) => {
  const userId = req.user.id;
  const { room_id, start_date, end_date, phone_number } = req.body;

  try {
    // Check if room exists
    const [[room]] = await pool.query(
      "SELECT available_from FROM rooms WHERE id = ?",
      [room_id]
    );
    if (!room) return res.status(404).json({ error: "Room not found" });

    const start = new Date(start_date);
    const end = new Date(end_date);
    const availableFrom = new Date(room.available_from);

    if (start < availableFrom) {
      return res
        .status(400)
        .json({ error: `Room not available before ${room.available_from}` });
    }

    if (end < start) {
      return res
        .status(400)
        .json({ error: "End date must be after start date" });
    }

    // Check for overlapping bookings
    const [existingBookings] = await pool.query(
      `SELECT * FROM bookings
   WHERE room_id = ?
     AND status != 'cancelled' AND status != 'rejected'
     AND (
       (start_date <= ? AND end_date >= ?)
       OR (start_date <= ? AND end_date >= ?)
       OR (start_date >= ? AND end_date <= ?)
     )`,
      [
        room_id,
        start_date,
        start_date,
        end_date,
        end_date,
        start_date,
        end_date,
      ]
    );

    if (existingBookings.length > 0) {
      return res
        .status(400)
        .json({ error: "Room already booked for selected dates" });
    }

    // Insert booking
    const [result] = await pool.query(
      `INSERT INTO bookings (user_id, room_id, start_date, end_date, phone_number, status)
       VALUES (?, ?, ?, ?, ?, 'pending')`,
      [userId, room_id, start_date, end_date, phone_number]
    );

    // Generate booking_ref for the booking
    const bookingId = result.insertId;
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const bookingRef = `BK${dateStr}-${String(bookingId).padStart(6, "0")}`;

    await pool.query(`UPDATE bookings SET booking_ref = ? WHERE id = ?`, [
      bookingRef,
      bookingId,
    ]);

    // Fetch the newly created booking with username and email
    const [[newBooking]] = await pool.query(
      `SELECT b.*, u.name AS username, u.email
   FROM bookings b
   JOIN users u ON b.user_id = u.id
   WHERE b.id = ?`,
      [bookingId]
    );

    res.status(201).json({ message: "Booking confirmed", booking: newBooking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to book room" });
  }
});

// contact technical support
router.post("/support/contact", authenticateJWT, async (req, res) => {
  const userId = req.user.id;
  const { subject, message } = req.body;

  if (!subject || !message)
    return res.status(400).json({ error: "Subject and message are required" });

  try {
    const result = await pool.query(
      `INSERT INTO support_message (user_id , subject , message , created_at) VALUES(? , ? , ? , now())`,
      [userId, subject, message]
    );

    res.json({ message: "support requested submitted", send: result });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: "server error" });
  }
});

// cancel a booking
router.patch("/:id/cancel", authenticateJWT, async (req, res) => {
  const bookingId = req.params.id;
  const userId = req.user.id;

  try {
    // check that booking exist or not for the user
    const [[booking]] = await pool.query(
      "SELECT status FROM bookings WHERE id = ? AND user_id = ?",
      [bookingId, userId]
    );

    if (!booking) return res.status(404).json({ err: "Booking not found" });
    if (booking.status === "cancelled")
      return res.status(400).json({ err: "Booking already cancelled" });

    //   Update status to cancel
    const update = await pool.query(
      "UPDATE bookings SET status = 'cancelled' WHERE id = ?",
      [bookingId]
    );

    res.json({
      message: "booking cancelled successfully ",
      updateStatus: update,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: "server error" });
  }
});

//  update booking
router.patch("/:id", authenticateJWT, async (req, res) => {
  const bookingId = req.params.id;
  const userId = req.user.id;
  const { start_date, end_date, phone_number } = req.body;

  try {
    const [[booking]] = await pool.query(
      "SELECT status , room_id FROM bookings WHERE id = ? AND user_id = ?",
      [bookingId, userId]
    );

    if (!booking) {
      console.log("❌ Booking not found");
      return res.status(404).json({ err: "Booking not found" });
    }

    if (booking.status !== "pending") {
      return res
        .status(400)
        .json({ err: "Only pending Booking can be Updated" });
    }

    if (new Date(end_date) < new Date(start_date)) {
      return res
        .status(400)
        .json({ err: "end date must be after the start date" });
    }

    const [conflicts] = await pool.query(
      `SELECT * FROM bookings WHERE room_id = ? and id != ? AND status != 'cancelled' AND status != 'rejected'
    AND (
      (start_date <= ? AND end_date >= ?) OR
      (start_date <= ? AND end_date >= ?) OR
      (start_date >= ? AND end_date <= ?)
    )`,
      [
        booking.room_id,
        bookingId,
        start_date,
        start_date,
        end_date,
        end_date,
        start_date,
        end_date,
      ]
    );

    if (conflicts.length > 0) {
      console.log("❌ Conflicting booking found:", conflicts);
      return res
        .status(400)
        .json({ err: "Room already booked for selected dates" });
    }

    const update = await pool.query(
      `UPDATE bookings SET start_date = ? , end_date = ? , phone_number = ? WHERE id = ?`,
      [start_date, end_date, phone_number, bookingId]
    );

    console.log("✅ Booking updated successfully");
    res.json({
      message: "booking updated successfully",
      bookingUpdate: update,
    });
  } catch (err) {
    console.log("❌ Server error:", err);
    res.status(500).json({ err: "server error" });
  }
});

//  mark booking status as paid or not
router.patch("/:id/payment", authenticateJWT, async (req, res) => {
  const bookingId = req.params.id;
  const userId = req.user.id;

  try {
    const [[booking]] = await pool.query(
      `SELECT payment_status FROM bookings WHERE id = ? AND user_id = ? `,
      [bookingId, userId]
    );

    if (!booking) return res.status(404).json({ error: "Booking Not Found" });
    if (booking.payment_status === "paid")
      return res.status(400).json({ error: "Booking is already paid" });

    const update = await pool.query(
      `UPDATE bookings SET payment_status = 'paid' WHERE id = ?`,
      [bookingId]
    );

    res.json({ message: "Payment Successfully done!!", updatePayment: update });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: "server error" });
  }
});

router.post("/:id/feedback", authenticateJWT, async (req, res) => {
  const bookingId = req.params.id;
  const userId = req.user.id;
  const { feedback } = req.body;
  try {
    const [[booking]] = await pool.query(
      `SELECT * FROM bookings WHERE id = ? AND user_id = ? `,
      [bookingId, userId]
    );

    if (!booking) return res.status(404).json({ mssg: "no booking found" });
    if (booking.payment_status !== "paid") {
      return res
        .status(400)
        .json({
          error: "Feedback can only be submitted for completed bookings",
        });
    }
    if (!feedback || feedback.trim().length === 0) {
      return res.status(400).json({ error: "Feedback cannot be empty" });
    }

    await pool.query(`UPDATE bookings SET feedback = ? WHERE id = ?`, [
      feedback.trim(),
      bookingId,
    ]);

    res.json({ message: "Feedback submitted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
