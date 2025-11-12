import express from "express";
import pool from "../models/db.js";
import { authenticateJWT, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin: View all bookings
router.get("/bookings", authenticateJWT, isAdmin, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let sql = `SELECT b.id, b.start_date, b.start_time, b.end_date, b.end_time, b.status, b.payment_status, b.phone_number, b.feedback, 
              u.name AS user_name, u.email, 
              r.name AS room_name, r.image AS room_image
              FROM bookings b
              JOIN users u ON b.user_id = u.id
              JOIN rooms r ON b.room_id = r.id`;

    let params = [];

    if (status) {
      sql += " WHERE b.status = ?";
      params.push(status);
    }

    sql += " ORDER BY b.start_date DESC LIMIT ? OFFSET ?";
    params.push(parseInt(limit), parseInt(offset));

    const [rows] = await pool.query(sql, params);

    res.json({ page: parseInt(page), limit: parseInt(limit), bookings: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Admin: View specific booking
router.get("/bookings/:id", authenticateJWT, isAdmin, async (req, res) => {
  try {
    const bookingId = req.params.id;

    const [[booking]] = await pool.query(
      `SELECT b.*, u.name AS user_name, u.email AS user_email, r.name AS room_name, r.description, r.image AS room_image
       FROM bookings b
       JOIN users u ON b.user_id = u.id
       JOIN rooms r ON b.room_id = r.id
       WHERE b.id = ?`,
      [bookingId]
    );

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
      const [[booking]] = await pool.query(
        `SELECT * FROM bookings WHERE id = ?`,
        [bookingId]
      );

      if (!booking) return res.status(404).json({ err: "Booking Not Found" });

      if (booking.status !== "pending") {
        return res
          .status(400)
          .json({ err: "Only Pending Status can be Updated" });
      }

      // extra verification to avoid the conflict
      if (status === "approved") {
        const [conflicts] = await pool.query(
          `SELECT * FROM bookings WHERE room_id = ? AND status = 'approved' AND id != ? 
         AND (
           (start_date <= ? AND end_date >= ?) OR
           (start_date <= ? AND end_date >= ?) OR
           (start_date >= ? AND end_date <= ?)
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

        if (conflicts.length > 0) {
          return res
            .status(409)
            .json({ error: "Date conflict with another approved booking" });
        }

        await pool.query("UPDATE bookings SET status = ? , approved_at = NOW() WHERE id = ?",
          [status,bookingId]
        )
      }

      if (status == "rejected") {
        if (!reject_response || reject_response.trim() === "") {
          return res.status(400).json({ error: "reject response is needed" });
        }
        await pool.query(
          `UPDATE bookings SET status = ? , reject_response = ? WHERE id = ?`,
          [status, reject_response, bookingId]
        );
      } else {
        await pool.query("UPDATE bookings SET status = ? WHERE id = ?", [
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

router.patch("/:id/payment", authenticateJWT , isAdmin , async (req,res) => {
  const bookingId = req.params.id;
  const userId = req.user.id;
  
  try {
    const [[booking]] = await pool.query(
      `SELECT b.id, b.start_date, b.end_date, b.payment_status, r.price AS room_price
       FROM bookings b
       JOIN rooms r ON b.room_id = r.id
       WHERE b.id = ? AND b.user_id = ?`,
       [bookingId, userId]
    );

     if (!booking) return res.status(404).json({ error: "Booking Not Found"})
     if (booking.payment_status === "paid")
      return res.status(400).json({ err: "Booking is already paid"})

     const start = new Date(booking.start_date);
     const end = new Date(booking.end_date);
     const diffDays = Math.floor((end - start) / (1000 * 60 * 60 * 24)) +1;

     const baseAmount = parseFloat(booking.room_price) * diffDays;
     const gstRate = baseAmount <= 7500 ? 0.05 : 0.18;
     const tax = parseFloat((baseAmount * gstRate).toFixed(2));

     const transactionRef = `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
     const invoiceNo = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

     await pool.query(
      `UPDATE bookings
      SET payment_status = "paid",
      amount = ?,
      tax = ?,
      transaction_ref = ?,
      invoice_no = ?,
      payment_date = NOW()
      WHERE id = ?`,
      [baseAmount , tax , transactionRef , invoiceNo, bookingId]
     );

     res.json({
      message: "Payment successfully done!",
      paymentDetails: {
        amount: baseAmount,
        tax,
        totalAmount: baseAmount + tax,
        transactionRef,
        invoiceNo,
        numberofDays: diffDays,
      },
     });
    } catch (err) {
    console.error(err);
    res.status(500).json({ err : "server error"})
  }
});


export default router;
