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
    SELECT IFNULL(SUM(
      r.price * (DATEDIFF(b.end_date, b.start_date) + 1)
    ), 0) AS totalamountspend
    FROM bookings b
    JOIN rooms r ON b.room_id = r.id
    WHERE b.user_id = ? AND b.status = 'approved' AND b.payment_status = 'paid'
  `;
  const params = [userId];

  if (fromDate && toDate) {
    query += ` AND b.start_date >= ? AND b.end_date <= ?`;
    params.push(fromDate, toDate);
  }

  const [rows] = await pool.query(query, params);
  return rows[0].totalamountspend;
};

export const getUserBookingTrend = async (userId , fromDate, toDate) => {
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
      DATE(f.created_at) AS period,
      GROUP_CONCAT(DISTINCT r.name ORDER BY r.name SEPARATOR ', ') AS room_names,
      AVG(f.rating) AS avg_rating,
      GROUP_CONCAT(f.comment SEPARATOR ' || ') AS comments
    FROM feedbacks f
    JOIN bookings b ON f.booking_id = b.id
    JOIN rooms r ON b.room_id = r.id
    WHERE b.user_id = ?
  `;

  const params = [userId];

  if (fromDate && toDate) {
    query += ` AND DATE(f.created_at) BETWEEN ? AND ? `;
    params.push(fromDate, toDate);
  }

  query += `
    GROUP BY DATE(f.created_at)
    ORDER BY period DESC
  `;

  const [rows] = await pool.query(query, params);
  return rows;
};


export const getUserHistory = async (req,res) => {
    let query = ``

    const params = []

    const [rows] = await pool.query(query, params);
    return rows;
};


export const getInvoicesByUser = async (userId, from, to) => {
  let query = `
    SELECT 
      i.*, 
      r.name AS room_name, 
      r.location AS room_location, 
      r.price AS room_price,
      b.booking_ref, 
      b.start_date, 
      b.end_date, 
      u.name AS user_name, 
      u.email AS user_email
    FROM invoices i
    JOIN bookings b ON i.booking_id = b.id
    JOIN rooms r ON b.room_id = r.id
    JOIN users u ON b.user_id = u.id
    WHERE b.user_id = ?
  `;
  const params = [userId];

  if (from && to) {
    query += ` AND i.issue_date BETWEEN ? AND ?`;
    params.push(from, to);
  }

  query += ` ORDER BY i.issue_date DESC`;

  const [rows] = await pool.query(query, params);
  return rows;
};

export const getInvoiceDetail = async (invoiceId, userId) => {
  const [rows] = await pool.query(
    `SELECT 
        i.*, b.booking_ref, b.start_date, b.end_date, 
        r.name AS room_name, u.name AS user_name, u.email
     FROM invoices i
     JOIN bookings b ON i.booking_id = b.id
     JOIN rooms r ON b.room_id = r.id
     JOIN users u ON b.user_id = u.id
     WHERE i.id = ? AND b.user_id = ?`,
    [invoiceId, userId]
  );
  return rows[0];
};