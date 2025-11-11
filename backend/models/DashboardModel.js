import pool from "./db.js";

export const getTotalBookings = async (fromDate, toDate) => {
  let query = `SELECT COUNT(*) AS totalbookings FROM bookings WHERE status = "approved"`;
  const params = [];

  if (fromDate && toDate) {
    query += ` AND start_date >= ? AND end_date <= ?`;
    params.push(fromDate, toDate);
  }

  const [rows] = await pool.query(query, params);
  return rows[0].totalbookings;
};

export const getTotalRevenue = async (fromDate, toDate) => {
  let query = `SELECT
    COALESCE(SUM(b.total_amount), 0) AS totalrevenue
     FROM bookings b
     JOIN rooms r ON b.room_id = r.id
     WHERE b.status = 'approved' AND b.payment_status = 'paid'`;
  const params = [];

  if (fromDate && toDate) {
    query += ` AND start_date >= ? AND end_date <= ?`;
    params.push(fromDate, toDate);
  }
  const [rows] = await pool.query(query, params);
  return rows[0].totalrevenue;
};

export const getTotalRoom = async () => {
  let query = `SELECT COUNT(*) AS totalrooms FROM rooms`;

  const [rows] = await pool.query(query);
  return rows[0].totalrooms;
};

export const getBookedRooms = async (fromDate, toDate) => {
  let params = [];
  let dateCondition = "";

  if (fromDate && toDate) {
    dateCondition = `AND b.start_date >= ? AND b.end_date <= ?`;
    params.push(fromDate, toDate);
  }
  const query = `
     SELECT 
     r.id,
     r.name,
     COUNT(b.id) AS totalbookings,
     GROUP_CONCAT(b.booking_ref) AS booking_refs,
     AVG(DATEDIFF(b.end_date, b.start_date)) AS avg_booking_duration
     FROM rooms r
    LEFT JOIN bookings b  
      ON r.id = b.room_id 
      AND b.status = 'approved'
      AND b.payment_status = 'paid'
      ${dateCondition}
    GROUP BY r.id, r.name
  `;
  const [rows] = await pool.query(query, params);
  return rows;
};

export const getUpcomingBookings = async (fromDate, toDate) => {
  let params = [];
  let dateCondition = "";

  if (fromDate && toDate) {
    dateCondition = `AND b.start_date >= ? AND b.end_date <= ?`;
    params.push(fromDate, toDate);
  }

  const query = `SELECT b.id, b.start_date, b.end_date, b.status, r.name AS room_name, u.name AS user_name
    FROM bookings b
    JOIN rooms r ON b.room_id = r.id
    JOIN users u ON b.user_id = u.id
    ${dateCondition}
    WHERE b.start_date >= CURDATE()
    ORDER BY b.start_date ASC
  ;`;

  const [rows] = await pool.query(query, params);
  return rows;
};

export const getBookingTrends = async (fromDate, toDate) => {
  const query = `
   SELECT 
  DATE_FORMAT(b.start_date, '%d-%m-%Y') AS period,
  DATE_FORMAT(b.end_date, '%d-%m-%Y') AS end_period,
  COUNT(*) AS total_bookings,
  GROUP_CONCAT(DISTINCT b.booking_ref ORDER BY b.booking_ref SEPARATOR ', ') AS booking_refs,
  GROUP_CONCAT(DISTINCT r.name ORDER BY r.name SEPARATOR ', ') AS room_names,
  GROUP_CONCAT(DISTINCT u.name ORDER BY u.name SEPARATOR ', ') AS user_names
FROM bookings b
JOIN rooms r ON b.room_id = r.id
JOIN users u ON b.user_id = u.id
WHERE b.status = 'approved'
  AND b.payment_status = 'paid'
  AND (? IS NULL OR b.start_date >= ?)
  AND (? IS NULL OR b.start_date <= ?)
GROUP BY period , end_period
ORDER BY period
  `;

  const params = [fromDate, fromDate, toDate, toDate];

  const [rows] = await pool.query(query, params);
  return rows;
};

export const getCancelledvsApprovedTrend = async (fromDate, toDate) => {
  let query = `
    SELECT 
      DATE(b.start_date) AS period,
      DATE(b.end_date) AS end_period,
      COUNT(CASE WHEN b.status = 'cancelled' THEN 1 END) AS cancelledbooking,
      COUNT(CASE WHEN b.status = 'approved' THEN 1 END) AS approvedbooking,
      GROUP_CONCAT(DISTINCT b.booking_ref ORDER BY b.booking_ref SEPARATOR ', ') AS booking_refs,
      GROUP_CONCAT(DISTINCT r.name ORDER BY r.name SEPARATOR ', ') AS room_names,
      GROUP_CONCAT(DISTINCT u.name ORDER BY u.name SEPARATOR ', ') AS user_names
    FROM bookings b
    JOIN rooms r ON b.room_id = r.id
    JOIN users u ON b.user_id = u.id
  `;

  const params = [];

  if (fromDate && toDate) {
    query += ` WHERE b.start_date BETWEEN ? AND ?`;
    params.push(fromDate, toDate);
  }

  query += ` GROUP BY DATE(b.start_date) , DATE(b.end_date) ORDER BY DATE(b.start_date);`;

  const [rows] = await pool.query(query, params);
  return rows;
};

export const getRevenueTrends = async (fromDate, toDate) => {
  const query = `
      SELECT DATE(start_date) AS period,
       DATE(end_date) AS end_period, 
       COUNT(DISTINCT b.id) AS total_bookings,
       COALESCE(SUM(b.total_amount), 0) AS totalrevenue,
       GROUP_CONCAT(DISTINCT r.name ORDER BY r.name SEPARATOR ', ') AS room_names,
       COUNT(DISTINCT r.id) AS total_rooms
FROM bookings b
JOIN rooms r ON b.room_id = r.id
WHERE b.status = 'approved' AND b.payment_status = 'paid' 
  AND start_date BETWEEN ? AND ?
GROUP BY DATE(b.start_date) ,  DATE(b.end_date)
ORDER BY period
`;
  const params = [fromDate, toDate];

  const [rows] = await pool.query(query, params);
  return rows;
};

export const getRevenueByRoom = async (fromDate, toDate) => {
  const query = `
  SELECT 
  
  COUNT(b.id) AS total_bookings,
  GROUP_CONCAT(DISTINCT u.name ORDER BY u.name SEPARATOR ', ') AS user_names,
  GROUP_CONCAT(DISTINCT b.booking_ref ORDER BY b.booking_ref SEPARATOR ', ') AS booking_refs,
  r.name AS room_name, 
  COALESCE(SUM(b.total_amount), 0) AS totalrevenue
FROM rooms r
LEFT JOIN bookings b 
  ON r.id = b.room_id 
  AND b.status = 'approved' 
  AND b.payment_status = 'paid'
  AND b.start_date BETWEEN ? AND ?
LEFT JOIN users u ON b.user_id = u.id
GROUP BY  r.name
ORDER BY totalrevenue DESC


  `;

  const params = [fromDate, toDate];
  const [rows] = await pool.query(query, params);
  return rows;
};

export const getRevenueByUser = async (fromDate, toDate) => {
  const query = `
SELECT 
    u.name AS user_name,
    COUNT(b.id) AS total_bookings,
    GROUP_CONCAT(DISTINCT b.booking_ref ORDER BY b.booking_ref SEPARATOR ', ') AS booking_refs,
    COALESCE(SUM(b.total_amount), 0) AS total_revenue
FROM users u
LEFT JOIN bookings b 
    ON u.id = b.user_id
    AND b.status = 'approved' 
    AND b.payment_status = 'paid'
    AND b.start_date BETWEEN ? AND ?
LEFT JOIN rooms r 
    ON b.room_id = r.id
GROUP BY u.id
HAVING total_revenue > 0
ORDER BY total_revenue DESC;`;
  const params = [fromDate, toDate];
  const [rows] = await pool.query(query, params);
  return rows;
};

export const getRevenueLossFromCancellations = async (fromDate, toDate) => {
  const query = `SELECT  r.id,  IFNULL(SUM(
        r.price * (DATEDIFF(b.end_date, b.start_date) + 1)
      ), 0) AS revenueloss
     FROM rooms r
     LEFT JOIN bookings b 
      ON r.id = b.room_id 
      AND b.status = 'cancelled' 
      AND b.start_date BETWEEN ? AND ?
       GROUP BY r.id
       ORDER BY revenueloss DESC`;

  const params = [fromDate, toDate];

  const [rows] = await pool.query(query, params);

  if (!rows || rows.length === 0) {
    return 0;
  }

  return rows[0].revenueloss || 0;
};
