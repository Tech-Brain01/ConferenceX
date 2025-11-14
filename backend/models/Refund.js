import pool from "./db.js";

const RefundModel = {
  createRefund: (booking_id, user_id, reason) => {
    return pool.query(
      `INSERT INTO conference_booking.refund_requests 
       (booking_id, user_id, reason)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [booking_id, user_id, reason]
    );
  },

  getRefundsByUser: (user_id) => {
    return pool.query(
      `SELECT * FROM conference_booking.refund_requests 
       WHERE user_id = $1 
       ORDER BY requested_at DESC`,
      [user_id]
    );
  },

  // ADMIN ACTIONS
  updateRefundStatus: (id, status, refund_amount, admin_reason) => {
    return pool.query(
      `UPDATE conference_booking.refund_requests
       SET status = $2,
           refund_amount = $3,
           admin_reason = $4,
           refunded_at = CASE 
               WHEN $2 IN ('Approved','Partial') THEN NOW()
               ELSE NULL
           END
       WHERE id = $1
       RETURNING *`,
      [id, status, refund_amount, admin_reason]
    );
  },

  getAllRefunds: () => {
    return pool.query(
      `SELECT * FROM conference_booking.refund_requests
       ORDER BY requested_at DESC`
    );
  }
};

export default RefundModel;
