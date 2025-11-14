import express from "express";
import pool from "../models/db.js";
import { authenticateJWT, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin: View all bookings
router.get("/bookings", authenticateJWT, isAdmin, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let sql = `SELECT b.id, b.booking_ref, b.start_date, b.end_date, b.status, b.payment_status, 
       b.phone_number, b.feedback, u.name AS user_name, u.email, 
       r.name AS room_name, r.image AS room_image
              FROM bookings b
              JOIN users u ON b.user_id = u.id
              JOIN rooms r ON b.room_id = r.id`;

    let params = [];

    if (status) {
      sql += " WHERE b.status = $1";
      params.push(status);
    }

    sql +=
      " ORDER BY b.start_date DESC LIMIT $" +
      (params.length + 1) +
      " OFFSET $" +
      (params.length + 2);
    params.push(parseInt(limit), parseInt(offset));

    const result = await pool.query(sql, params);

    res.json({
      page: parseInt(page),
      limit: parseInt(limit),
      bookings: result.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Admin: View specific booking
router.get("/bookings/:id", authenticateJWT, isAdmin, async (req, res) => {
  try {
    const bookingId = req.params.id;

    const result = await pool.query(
      `SELECT b.*, u.name AS user_name, u.email AS user_email, r.name AS room_name, r.description, r.image AS room_image
       FROM bookings b
       JOIN users u ON b.user_id = u.id
       JOIN rooms r ON b.room_id = r.id
       WHERE b.id = $1`,
      [bookingId]
    );

    const booking = result.rows[0];

    if (!booking) return res.status(404).json({ error: "booking not found" });

    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server error" });
  }
});

//ADmin: Approve or reject booking logic
router.patch(
  "/bookings/:id/status",
  authenticateJWT,
  isAdmin,
  async (req, res) => {
    const bookingId = req.params.id;
    const { status, reject_response } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid Status" });
    }

    try {
      const result = await pool.query(`SELECT * FROM bookings WHERE id = $1`, [
        bookingId,
      ]);

      const booking = result.rows[0];

      if (!booking) return res.status(404).json({ err: "Booking Not Found" });

      if (booking.status !== "pending") {
        return res
          .status(400)
          .json({ err: "Only Pending Status can be Updated" });
      }

      // extra verification to avoid the conflict
      if (status === "approved") {
        const conflicts = await pool.query(
          `SELECT * FROM bookings WHERE room_id = $1 AND status = 'approved' AND id != $2 
         AND (
           (start_date <= $3 AND end_date >= $4) OR
           (start_date <= $5 AND end_date >= $6) OR
           (start_date >= $7 AND end_date <= $8)
         )`,
          [
            booking.room_id,
            bookingId,
            booking.start_date,
            booking.start_date,
            booking.end_date,
            booking.end_date,
            booking.start_date,
            booking.end_date,
          ]
        );

        if (conflicts.rows.length > 0) {
          return res
            .status(409)
            .json({ error: "Date conflict with another approved booking" });
        }

        await pool.query(
          "UPDATE bookings SET status = $1 , approved_at = NOW() WHERE id = $2",
          [status, bookingId]
        );
      }

      if (status == "rejected") {
        if (!reject_response || reject_response.trim() === "") {
          return res.status(400).json({ error: "reject response is needed" });
        }
        await pool.query(
          `UPDATE bookings SET status = $1 , reject_response = $2 WHERE id = $3`,
          [status, reject_response, bookingId]
        );
      } else {
        await pool.query("UPDATE bookings SET status = $1 WHERE id = $2", [
          status,
          bookingId,
        ]);
      }

      res.json({ message: `Booking ${status} successfully.` });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.patch("/:id/payment", authenticateJWT, isAdmin, async (req, res) => {
  const bookingId = req.params.id;

  try {
    // Fetch booking with room price
    const result = await pool.query(
      `SELECT b.id, b.start_date, b.end_date, b.payment_status, r.price AS room_price
       FROM bookings b
       JOIN rooms r ON b.room_id = r.id
       WHERE b.id = $1`,
      [bookingId]
    );

    const booking = result.rows[0];

    if (!booking) return res.status(404).json({ error: "Booking not found" });
    if (booking.payment_status === "paid")
      return res.status(400).json({ error: "Booking is already paid" });

    const start = new Date(booking.start_date);
    const end = new Date(booking.end_date);
    const diffDays = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;

    const baseAmount = parseFloat(booking.room_price) * diffDays;
    const gstRate = baseAmount <= 7500 ? 0.12 : 0.18;
    const tax = parseFloat((baseAmount * gstRate).toFixed(2));

    const transactionRef = `TXN-${Date.now()}-${Math.floor(
      Math.random() * 1000
    )}`;
    const invoiceNo = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Update booking and calculate total_amount in SQL
    await pool.query(
      `UPDATE bookings
   SET payment_status = 'paid',
       amount = $1,
       tax = $2,
       total_amount = $1::numeric + $2::numeric,
       transaction_ref = $3,
       invoice_no = $4,
       payment_date = NOW()
   WHERE id = $5`,
      [baseAmount, tax, transactionRef, invoiceNo, bookingId]
    );

    res.json({
      message: "Payment successfully done!",
      paymentDetails: {
        amount: baseAmount,
        tax,
        totalAmount: baseAmount + tax,
        transactionRef,
        invoiceNo,
        numberOfDays: diffDays,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Admin: View admin payments (only those made by admin)
router.get("/payments", authenticateJWT, isAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    // Fetch payments made by users with role 'admin'
    const result = await pool.query(
      `SELECT b.id, b.booking_ref, b.start_date, b.end_date, b.payment_status, 
              b.payment_date, b.total_amount, b.payment_method, r.name AS room_name, 
              r.image AS room_image, b.invoice_no, b.transaction_ref
       FROM bookings b
       JOIN rooms r ON b.room_id = r.id
       JOIN users u ON b.user_id = u.id
       WHERE b.payment_status = 'paid' AND u.role = 'admin'
       ORDER BY b.payment_date DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const totalResult = await pool.query(
      `SELECT COUNT(*) 
       FROM bookings b
       JOIN users u ON b.user_id = u.id
       WHERE b.payment_status = 'paid' AND u.role = 'admin'`
    );

    const total = parseInt(totalResult.rows[0].count);

    res.json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      payments: result.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});




export default router;
