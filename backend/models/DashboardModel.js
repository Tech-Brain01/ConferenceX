import pool from "./db.js";

export const getTotalBookings = async () => {
  const [rows] = await pool.query(
    `SELECT COUNT(*) AS totalbookings FROM bookings WHERE status = "approved"`
  );
  return rows[0].totalbookings;
};

export const getTotalRevenue = async () => {
  const [rows] = await pool.query(
    `SELECT IFNULL(SUM(
        r.price * (DATEDIFF(b.end_date, b.start_date) + 1)
      ), 0) AS totalrevenue
     FROM bookings b
     JOIN rooms r ON b.room_id = r.id
     WHERE b.status = 'approved' AND b.payment_status = 'paid'`
  );
  return rows[0].totalrevenue;
};


export const getTotalRoom = async () => {
  const [rows] = await pool.query(`SELECT COUNT (*) AS totalrooms FROM rooms`);
  return rows[0].totalrooms;
};

export const getBookedRooms = async () => {
  const [rows] = await pool.query(
    `SELECT r.id, r.name, COUNT(b.id) AS totalbookings
      FROM rooms r
       LEFT JOIN bookings b ON r.id = b.room_id AND b.status = 'approved'
        GROUP BY r.id, r.name;
      `
  );
  return rows;
};

export const getUpcomingBookings = async () => {
  const [rows] = await pool.query(
    `SELECT b.id, b.start_date, b.end_date, b.status, r.name AS room_name, u.name AS user_name
    FROM bookings b
    JOIN rooms r ON b.room_id = r.id
    JOIN users u ON b.user_id = u.id
    WHERE b.start_date >= CURDATE()
    ORDER BY b.start_date ASC
    LIMIT 10;`
  );
  return rows;
};

export const getBookingTrends = async (filter, fromDate, toDate) => {
  let query = "";
  let params = [];

  switch (filter) {
    case "day":
      query = `
        SELECT DATE(start_date) AS period, COUNT(*) AS totalbookings
        FROM bookings
        WHERE start_date BETWEEN ? AND ?
        GROUP BY DATE(start_date)
        ORDER BY period`;
      params = [fromDate, toDate];
      break;

    case "week":
      query = `
        SELECT DATE_FORMAT(start_date, '%x-%v') AS period, COUNT(*) AS totalbookings
        FROM bookings
        WHERE start_date BETWEEN ? AND ?
        GROUP BY period
        ORDER BY period`;
      params = [fromDate, toDate];
      break;

    case "month":
      query = `
        SELECT DATE_FORMAT(start_date, '%Y-%m') AS period, COUNT(*) AS totalbookings
        FROM bookings
        WHERE start_date BETWEEN ? AND ?
        GROUP BY period
        ORDER BY period`;
      params = [fromDate, toDate];
      break;

    default:
      throw new Error("Invalid filter");
  }

  const [rows] = await pool.query(query, params);
  return rows;
};

export const getCancelledvsApprovedTrend = async (filter, fromDate, toDate) => {
  let query = "";
  let params = [];

  switch (filter) {
    case "day":
      query = `
        SELECT DATE(start_date) AS period,
          COUNT(CASE WHEN status = 'cancelled' THEN 1 END) AS cancelledbooking,
          COUNT(CASE WHEN status = 'approved' THEN 1 END) AS approvedbooking
        FROM bookings
        WHERE start_date BETWEEN ? AND ?
        GROUP BY period
        ORDER BY period
        `;
      params = [fromDate, toDate];
      break;

    case "week":
      query = `
        SELECT DATE_FORMAT(start_date, '%x-%v') AS period,
          COUNT(CASE WHEN status = 'cancelled' THEN 1 END) AS cancelledbooking,
          COUNT(CASE WHEN status = 'approved' THEN 1 END) AS approvedbooking
        FROM bookings
        WHERE start_date BETWEEN ? AND ?
        GROUP BY period
        ORDER BY period`;
      params = [fromDate, toDate];
      break;

    case "month":
      query = `
        SELECT DATE_FORMAT(start_date, '%Y-%m') AS period,
          COUNT(CASE WHEN status = 'cancelled' THEN 1 END) AS cancelledbooking,
          COUNT(CASE WHEN status = 'approved' THEN 1 END) AS approvedbooking
        FROM bookings
        WHERE start_date BETWEEN ? AND ?
        GROUP BY period
        ORDER BY period`;
      params = [fromDate, toDate];
      break;

    default:
      throw new Error("Invalid filter");
  }

  const [rows] = await pool.query(query, params);
  return rows;
};

export const getRevenueTrends = async (filter, fromDate, toDate) => {
  let query = "";
  let params = [];

  switch (filter) {
    case "day":
      query = `
        SELECT DATE(start_date) AS period, 
               IFNULL(SUM(r.price), 0) AS totalrevenue
        FROM bookings b
        JOIN rooms r ON b.room_id = r.id
        WHERE b.status = 'approved' AND b.payment_status = 'paid' 
          AND start_date BETWEEN ? AND ?
        GROUP BY DATE(start_date)
        ORDER BY period`;
      params = [fromDate, toDate];
      break;

    case "week":
      query = `
        SELECT DATE_FORMAT(start_date, '%x-%v') AS period, 
               IFNULL(SUM(r.price), 0) AS totalrevenue
        FROM bookings b
        JOIN rooms r ON b.room_id = r.id
        WHERE b.status = 'approved' AND b.payment_status = 'paid' 
          AND start_date BETWEEN ? AND ?
        GROUP BY period
        ORDER BY period`;
      params = [fromDate, toDate];
      break;

    case "month":
      query = `
        SELECT DATE_FORMAT(start_date, '%Y-%m') AS period, 
               IFNULL(SUM(r.price), 0) AS totalrevenue
        FROM bookings b
        JOIN rooms r ON b.room_id = r.id
        WHERE b.status = 'approved' AND b.payment_status = 'paid' 
          AND start_date BETWEEN ? AND ?
        GROUP BY period
        ORDER BY period`;
      params = [fromDate, toDate];
      break;

    default:
      throw new Error("Invalid filter");
  }

  const [rows] = await pool.query(query, params);
  return rows;
};

export const getRevenueByRoom = async () => {
  const [rows] = await pool.query(`
    SELECT 
  r.id, 
  r.name, 
  IFNULL(SUM(r.price* (DATEDIFF(b.end_date, b.start_date) + 1)), 0) AS totalrevenue
FROM rooms r
LEFT JOIN bookings b ON r.id = b.room_id AND b.status = 'approved' AND b.payment_status = 'paid'
GROUP BY r.id, r.name
ORDER BY totalrevenue DESC;

  `);
  return rows;
};

export const getRevenueLossFromCancellations = async () => {
  const [rows] = await pool.query(`
    SELECT IFNULL(SUM(
        r.price * (DATEDIFF(b.end_date, b.start_date) + 1)
      ), 0) AS revenueloss
     FROM bookings b
     JOIN rooms r ON b.room_id = r.id
     WHERE b.status = 'cancelled' 
  `);
  return rows[0].revenueloss;
};


