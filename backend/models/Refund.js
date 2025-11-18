import pool from "./db.js";

export const createRefundRequest = async ({
  userId,
  roomName,
  bookingRef,
  txnNo,
  userReason,
}) => {
  const query = `
    INSERT INTO conference_booking.refund_requests
      (user_id, room_name, booking_ref, txn_no, user_reason)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;

  const result = await pool.query(query, [
    userId,
    roomName,
    bookingRef,
    txnNo,
    userReason,
  ]);

  return result.rows[0];
};


export const getAllRefundsForAdmin = async () => {
  try {
    const query = `
      SELECT 
        rr.id AS refund_id,
        rr.user_id,
        rr.booking_ref,
        rr.txn_no,
        rr.user_reason,
        rr.status AS refund_status,
        rr.partial_amount,
        rr.admin_reason,
        rr.created_at AS refund_requested_at,
        rr.updated_at AS refund_updated_at,
        u.name AS user_name,
        u.email AS user_email,
        b.amount AS booking_amount,
        b.payment_status,
        b.payment_method,
        b.payment_date,
        b.start_date AS booking_start_date,
        b.end_date AS booking_end_date,
        r.name AS room_name
      FROM conference_booking.refund_requests rr
      JOIN conference_booking.users u ON rr.user_id = u.id
      JOIN bookings b ON rr.booking_ref = b.booking_ref
      JOIN rooms r ON b.room_id = r.id
      ORDER BY rr.created_at DESC;
    `;

    const result = await pool.query(query);

    // Format dates in en-GB style
    const formatted = result.rows.map(row => ({
      ...row,
      booking_start_date: new Date(row.booking_start_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      booking_end_date: new Date(row.booking_end_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      payment_date: row.payment_date ? new Date(row.payment_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : null,
    }));

    return formatted;
  } catch (err) {
    console.error('getAllRefundsForAdmin error:', err);
    throw err;
  }
};


export const getBookingDetailsByRef = async (refundId) => {
  try {
    const query = `
      SELECT b.id, b.user_id, b.start_date, b.end_date,b.payment_method, b.payment_status, b.payment_date, r.name
      FROM bookings b
      JOIN rooms r ON b.room_id = r.id
      WHERE b.booking_ref = $1
    `;
    const result = await pool.query(query, [refundId]);
    return result.rows[0];
  } catch (err) {
    console.error('getBookingDetailsByRef error:', err);
    throw err;
  }
};

export const getRefundByUser = async (userId) => {
  const query = `
    SELECT *
    FROM conference_booking.refund_requests
    WHERE user_id = $1
    ORDER BY created_at DESC;
  `;

  const result = await pool.query(query, [userId]);
  return result.rows;
};


export const processRefund = async (id, status, partialAmount, adminReason) => {
  const query = `
    UPDATE conference_booking.refund_requests
    SET status = $1,
        partial_amount = $2,
        admin_reason = $3,
        updated_at = NOW()
    WHERE id = $4
    RETURNING *;
  `;
  const result = await pool.query(query, [status, partialAmount, adminReason, id]);
  return result.rows[0];
};

export const getRefundById = async (id) => {
  const query = `SELECT * FROM conference_booking.refund_requests WHERE id = $1`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};




export const getAllRefundsWithBooking = async () => {
  try {
    const query = `
      SELECT 
        rr.id AS refund_id,
        rr.user_id,
        rr.user_reason,
        rr.status,
        rr.partial_amount,
        rr.created_at AS refund_requested_at,
        rr.updated_at AS refund_updated_at,
        rr.booking_ref,
        rr.txn_no,
        b.total_amount AS amount_paid,
        b.payment_status,
        b.payment_method,
        TO_CHAR(b.payment_date, 'DD Mon YYYY') AS payment_date,
        TO_CHAR(b.start_date, 'DD Mon YYYY') AS start_date,
        TO_CHAR(b.end_date, 'DD Mon YYYY') AS end_date,
        r.name AS room_name,
        u.name AS user_name,
        u.email AS user_email
      FROM conference_booking.refund_requests rr
      JOIN conference_booking.users u ON rr.user_id = u.id
      JOIN bookings b ON rr.booking_ref = b.booking_ref
      JOIN rooms r ON b.room_id = r.id
      ORDER BY rr.created_at DESC;
    `;

    const result = await pool.query(query);
    return result.rows;
  } catch (err) {
    console.error("getAllRefundsWithBooking error:", err);
    throw err;
  }
};
