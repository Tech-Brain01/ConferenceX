import pool from "./db.js";

export const getTotalUserBookings = async (userId, fromDate, toDate) => {
  let query = `
    SELECT COUNT(*) AS totaluserbookings
    FROM bookings
    WHERE user_id = $1 AND status = 'approved'
  `;
  const params = [userId];

  if (fromDate && toDate) {
    query += ` AND start_date >= $2 AND end_date <= $3`;
    params.push(fromDate, toDate);
  }

  const result = await pool.query(query, params);
  return result.rows[0].totaluserbookings;
};

export const getTotalAmountSpend = async (userId, fromDate, toDate) => {
 let query = `
  SELECT 
    COALESCE(SUM(b.total_amount), 0) AS totalamountspend
  FROM bookings b
  JOIN rooms r ON b.room_id = r.id
  WHERE b.user_id = $1 
    AND b.status = 'approved' 
    AND b.payment_status = 'paid'
`;

  const params = [userId];

  if (fromDate && toDate) {
    query += ` AND b.start_date >= $2 AND b.end_date <= $3`;
    params.push(fromDate, toDate);
  }

  const result = await pool.query(query, params);
  return result.rows[0].totalamountspend;
};

export const getUserBookingTrend = async (userId, fromDate, toDate) => {
  const query = `
  SELECT
    TO_CHAR(b.start_date, 'YYYY-MM-DD') AS period,
    COUNT(*) AS total_bookings,
    STRING_AGG(DISTINCT b.booking_ref, ', ' ORDER BY b.booking_ref) AS booking_refs,
    STRING_AGG(DISTINCT r.name, ', ' ORDER BY r.name) AS room_names
  FROM bookings b
  JOIN rooms r ON b.room_id = r.id
  WHERE b.status = 'approved'
    AND b.payment_status = 'paid'
    AND ($1 IS NULL OR b.user_id = $2)
    AND ($3 IS NULL OR b.start_date >= $4)
    AND ($5 IS NULL OR b.start_date <= $6)
  GROUP BY period
  ORDER BY period
`;

  const params = [userId, userId, fromDate, fromDate, toDate, toDate];

  const result = await pool.query(query, params);
  return result.rows;
};

export const getAllFeedback = async (userId, fromDate, toDate) => {
  let query = `
    SELECT
      TO_CHAR(b.start_date, 'YYYY-MM-DD') AS period,
      r.name AS room_name,
      AVG(b.rating) AS avg_rating,
      STRING_AGG(b.feedback, '; ') AS feedbacks
    FROM bookings b
    JOIN rooms r ON b.room_id = r.id
    WHERE b.user_id = $1 AND b.feedback IS NOT NULL 
  `;

  const params = [userId];

  if (fromDate && toDate) {
    query += ` AND b.start_date BETWEEN $2 AND $3`;
    params.push(fromDate, toDate);
  }

  query += `
    GROUP BY r.id, r.name, period
    ORDER BY period
  `;

  const result = await pool.query(query, params);
  return result.rows;
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
   WHERE b.user_id = $1
  AND b.payment_status = 'paid'
  `;

  const params = [userId];

  if (fromDate && toDate) {
    query += `AND b.start_date BETWEEN $2 AND $3`;
    params.push(fromDate , toDate);
  }

  query += `
  ORDER BY b.payment_date;
  `

  const result = await pool.query(query, params);
  return result.rows;
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
    WHERE b.user_id = $1 AND b.payment_status = 'paid'
  `;
  const params = [userId];

if (fromDate && toDate) {
    query += `AND b.start_date BETWEEN $2 AND $3`;
    params.push(fromDate , toDate);
  }

  query += ` ORDER BY b.payment_date DESC`;

  const result = await pool.query(query, params);
  return result.rows;
};
