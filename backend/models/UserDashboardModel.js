import pool from "./db.js";

export const getTotalUserBookings = async (userId, fromDate, toDate) => {
  let query = `
    SELECT COUNT(*) AS totaluserbookings
    FROM bookings
    WHERE user_id = ? AND status = "approved"
  `;
  const params = [userId];

  if (fromDate && toDate) {
    query += ` AND start_date >= ? AND end_date <= ?`;
    params.push(fromDate, toDate);
  }

  const [rows] = await pool.query(query, params);
  return rows[0].totaluserbookings;
};

export const getTotalAmountSpend = async (userId, fromDate, toDate) => {
 let query = `
  SELECT 
    COALESCE(SUM(b.total_amount), 0) AS totalamountspend
  FROM bookings b
  JOIN rooms r ON b.room_id = r.id
  WHERE b.user_id = ? 
    AND b.status = 'approved' 
    AND b.payment_status = 'paid'
`;

  const params = [userId];

  if (fromDate && toDate) {
    query += ` AND b.start_date >= ? AND b.end_date <= ?`;
    params.push(fromDate, toDate);
  }

  const [rows] = await pool.query(query, params);
  return rows[0].totalamountspend;
};

export const getUserBookingTrend = async (userId, fromDate, toDate) => {
  const query = `
  SELECT
    DATE_FORMAT(b.start_date, '%Y-%m-%d') AS period,
    COUNT(*) AS total_bookings,
    GROUP_CONCAT(DISTINCT b.booking_ref ORDER BY b.booking_ref SEPARATOR ', ') AS booking_refs,
    GROUP_CONCAT(DISTINCT r.name ORDER BY r.name SEPARATOR ', ') AS room_names
  FROM bookings b
  JOIN rooms r ON b.room_id = r.id
  WHERE b.status = 'approved'
    AND b.payment_status = 'paid'
    AND (? IS NULL OR b.user_id = ?)
    AND (? IS NULL OR b.start_date >= ?)
    AND (? IS NULL OR b.start_date <= ?)
  GROUP BY period
  ORDER BY period
`;

  const params = [userId, userId, fromDate, fromDate, toDate, toDate];

  const [rows] = await pool.query(query, params);
  return rows;
};

export const getAllFeedback = async (userId, fromDate, toDate) => {
  let query = `
    SELECT
      DATE_FORMAT(b.start_date, '%Y-%m-%d') AS period,
      r.name AS room_name,
      AVG(b.rating) AS avg_rating,
      GROUP_CONCAT(b.feedback SEPARATOR '; ') AS feedbacks
    FROM bookings b
    JOIN rooms r ON b.room_id = r.id
    WHERE b.user_id = ? AND b.feedback IS NOT NULL 
  `;

  const params = [userId];

  if (fromDate && toDate) {
    query += ` AND b.start_date BETWEEN ? AND ?`;
    params.push(fromDate, toDate);
  }

  query += `
    GROUP BY r.id, r.name, period
    ORDER BY period
  `;

  const [rows] = await pool.query(query, params);
  return rows;
};

export const getUserHistory = async (userId , fromDate , toDate) => {
  let query = `
   SELECT
    b.booking_ref AS Booking_ref,
    b.transaction_ref AS Transaction_ref,
    r.name AS room_name,
    b.total_amount AS Total_Amount,
    b.payment_method AS Method,
    b.payment_date AS Date
   FROM bookings b
   JOIN rooms r ON b.room_id = r.id
   WHERE b.user_id = ?
  AND b.payment_status = 'paid'
  `;

  const params = [userId];

  if (fromDate && toDate) {
    query += `AND b.start_date BETWEEN ? AND ?`;
    params.push(fromDate , toDate);
  }

  query += `
  ORDER BY b.payment_date;
  `

  const [rows] = await pool.query(query, params);
  return rows;
};

export const getInvoicesByUser = async (userId, fromDate, toDate) => {
  let query = `
    SELECT 
      r.name AS room_name, 
      r.location AS room_location, 
      r.price AS room_price,
      b.booking_ref, 
      b.start_date, 
      b.end_date, 
      b.invoice_no AS Invoice_no,
      b.payment_date AS Issue_date,
      b.amount AS Amt,
      b.tax AS gst,
      b.total_amount AS Total_Amt,
      b.payment_status AS status,
      u.name AS user_name, 
      u.email AS user_email
    FROM bookings b
    JOIN rooms r ON b.room_id = r.id
    JOIN users u ON b.user_id = u.id
    WHERE b.user_id = ? AND b.payment_status = "paid"
  `;
  const params = [userId];

if (fromDate && toDate) {
    query += `AND b.start_date BETWEEN ? AND ?`;
    params.push(fromDate , toDate);
  }

  query += ` ORDER BY b.payment_date DESC`;

  const [rows] = await pool.query(query, params);
  return rows;
};
