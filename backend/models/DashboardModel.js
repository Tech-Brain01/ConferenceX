import pool from "./db.js";

export const getTotalBookings = async (fromDate, toDate) => {
  let query = `SELECT COUNT(*) AS totalbookings FROM bookings WHERE status = 'approved'`;
  const params = [];

  if (fromDate && toDate) {
    query += ` AND start_date >= $1::date AND end_date <= $2::date`;
    params.push(fromDate, toDate);
  }

  const result = await pool.query(query, params);
  return result.rows[0].totalbookings;
};

export const getTotalRevenue = async (fromDate, toDate) => {
  let query = `
    SELECT COALESCE(SUM(b.total_amount), 0) AS totalrevenue
    FROM bookings b
    JOIN rooms r ON b.room_id = r.id
    WHERE b.status = 'approved' AND b.payment_status = 'paid'
  `;
  const params = [];

  if (fromDate && toDate) {
    query += ` AND start_date >= $1::date AND end_date <= $2::date`;
    params.push(fromDate, toDate);
  }

  const result = await pool.query(query, params);
  return result.rows[0].totalrevenue;
};

export const getTotalRoom = async () => {
  let query = `SELECT COUNT(*) AS totalrooms FROM rooms`;

  const result = await pool.query(query);
  return result.rows[0].totalrooms;
};

export const getBookedRooms = async (fromDate, toDate) => {
  let params = [];
  let dateCondition = "";

  if (fromDate && toDate) {
    dateCondition = `AND b.start_date >= $1::date AND b.end_date <= $2::date`;
    params.push(fromDate, toDate);
  }

 const query = `
  SELECT 
    r.id,
    r.name,
    COUNT(b.id) AS totalbookings,
    STRING_AGG(b.booking_ref, ', ') AS booking_refs,
    AVG(b.end_date - b.start_date) AS avg_booking_duration
  FROM rooms r
  LEFT JOIN bookings b
    ON r.id = b.room_id
    AND b.status = 'approved'
    AND b.payment_status = 'paid'
    ${dateCondition}
  GROUP BY r.id, r.name
`;

  const result = await pool.query(query, params);
  return result.rows;
};





export const getUpcomingBookings = async (fromDate, toDate) => {
  let params = [];
  let dateCondition = "";

  if (fromDate && toDate) {
    dateCondition = `AND b.start_date >= $1::date AND b.end_date <= $2::date`;
    params.push(fromDate, toDate);
  }

  const query = `
    SELECT 
      b.id, b.start_date, b.end_date, b.status, 
      r.name AS room_name, u.name AS user_name
    FROM bookings b
    JOIN rooms r ON b.room_id = r.id
    JOIN users u ON b.user_id = u.id
    WHERE b.start_date >= CURRENT_DATE
    ${dateCondition}
    ORDER BY b.start_date ASC
  `;

  const result = await pool.query(query, params);
  return result.rows;
};

export const getBookingTrends = async (fromDate, toDate) => {
  let query = `
    SELECT 
      TO_CHAR(b.start_date, 'DD-MM-YYYY') AS period,
      TO_CHAR(b.end_date, 'DD-MM-YYYY') AS end_period,
      COUNT(*) AS total_bookings,
      STRING_AGG(DISTINCT b.booking_ref, ', ' ORDER BY b.booking_ref) AS booking_refs,
      STRING_AGG(DISTINCT r.name, ', ' ORDER BY r.name) AS room_names,
      STRING_AGG(DISTINCT u.name, ', ' ORDER BY u.name) AS user_names
    FROM bookings b
    JOIN rooms r ON b.room_id = r.id
    JOIN users u ON b.user_id = u.id
    WHERE b.status = 'approved'
      AND b.payment_status = 'paid'
  `;

  const params = [];
  if (fromDate && toDate) {
    query += ` AND b.start_date >= $1::date AND b.start_date <= $2::date`;
    params.push(fromDate, toDate);
  }

  query += `
    GROUP BY period, end_period
    ORDER BY period
  `;

  const result = await pool.query(query, params);
  return result.rows;
};



export const getCancelledvsApprovedTrend = async (fromDate, toDate) => {
  let query = `
    SELECT 
      DATE(b.start_date) AS period,
      DATE(b.end_date) AS end_period,
      COUNT(CASE WHEN b.status = 'cancelled' THEN 1 END) AS cancelledbooking,
      COUNT(CASE WHEN b.status = 'approved' THEN 1 END) AS approvedbooking,
      STRING_AGG(DISTINCT b.booking_ref, ', ' ORDER BY b.booking_ref) AS booking_refs,
      STRING_AGG(DISTINCT r.name, ', ' ORDER BY r.name) AS room_names,
      STRING_AGG(DISTINCT u.name, ', ' ORDER BY u.name) AS user_names
    FROM bookings b
    JOIN rooms r ON b.room_id = r.id
    JOIN users u ON b.user_id = u.id
  `;

  const params = [];
  if (fromDate && toDate) {
    query += ` WHERE b.start_date BETWEEN $1::date AND $2::date`;
    params.push(fromDate, toDate);
  }

  query += ` GROUP BY DATE(b.start_date), DATE(b.end_date) ORDER BY DATE(b.start_date)`;

  const result = await pool.query(query, params);
  return result.rows;
};


export const getRevenueTrends = async (fromDate, toDate) => {
  const query = `
    SELECT 
      DATE(start_date) AS period,
      DATE(end_date) AS end_period,
      COUNT(DISTINCT b.id) AS total_bookings,
      COALESCE(SUM(b.total_amount), 0) AS totalrevenue,
      STRING_AGG(DISTINCT r.name, ', ' ORDER BY r.name) AS room_names,
      COUNT(DISTINCT r.id) AS total_rooms
    FROM bookings b
    JOIN rooms r ON b.room_id = r.id
    WHERE b.status = 'approved' AND b.payment_status = 'paid'
      AND start_date BETWEEN $1::date AND $2::date
    GROUP BY DATE(b.start_date), DATE(b.end_date)
    ORDER BY period
  `;

  const params = [fromDate, toDate];
  const result = await pool.query(query, params);
  return result.rows;
};


export const getRevenueByRoom = async (fromDate, toDate) => {
  const query = `
    SELECT 
      COUNT(b.id) AS total_bookings,
      STRING_AGG(DISTINCT u.name, ', ' ORDER BY u.name) AS user_names,
      STRING_AGG(DISTINCT b.booking_ref, ', ' ORDER BY b.booking_ref) AS booking_refs,
      r.name AS room_name, 
      COALESCE(SUM(b.total_amount), 0) AS totalrevenue
    FROM rooms r
    LEFT JOIN bookings b 
      ON r.id = b.room_id 
      AND b.status = 'approved' 
      AND b.payment_status = 'paid'
      AND b.start_date BETWEEN $1::date AND $2::date
    LEFT JOIN users u ON b.user_id = u.id
    GROUP BY r.name
    ORDER BY totalrevenue DESC
  `;

  const params = [fromDate, toDate];
  const result = await pool.query(query, params);
  return result.rows;
};

export const getRevenueByUser = async (fromDate, toDate) => {
  const query = `
    SELECT 
      u.name AS user_name,
      COUNT(b.id) AS total_bookings,
      STRING_AGG(DISTINCT b.booking_ref, ', ' ORDER BY b.booking_ref) AS booking_refs,
      COALESCE(SUM(b.total_amount), 0) AS total_revenue
    FROM users u
    LEFT JOIN bookings b 
      ON u.id = b.user_id
      AND b.status = 'approved' 
      AND b.payment_status = 'paid'
      AND b.start_date BETWEEN $1::date AND $2::date
    LEFT JOIN rooms r ON b.room_id = r.id
    GROUP BY u.id, u.name
    HAVING COALESCE(SUM(b.total_amount), 0) > 0
    ORDER BY total_revenue DESC
  `;

  const params = [fromDate, toDate];
  const result = await pool.query(query, params);
  return result.rows;
};


export const getRevenueLossFromCancellations = async (fromDate, toDate) => {
  const query = `
    SELECT r.id, COALESCE(SUM(
          r.price * EXTRACT(day FROM (b.end_date - b.start_date))
        ), 0) AS revenueloss
    FROM rooms r
    LEFT JOIN bookings b 
      ON r.id = b.room_id 
      AND b.status = 'cancelled' 
      AND b.start_date BETWEEN $1::date AND $2::date
    GROUP BY r.id
    ORDER BY revenueloss DESC
  `;

  const params = [fromDate, toDate];
  const result = await pool.query(query, params);

  if (!result.rows || result.rows.length === 0) return 0;

  return result.rows[0].revenueloss || 0;
};

export const getAvailableRooms = async (fromDate, toDate) => {
  const query = `
    SELECT 
      r.id,
      r.name,
      COALESCE(
        json_agg(
          json_build_object(
            'from', b.start_date,
            'to', b.end_date
          ) ORDER BY b.start_date
        ) FILTER (WHERE b.id IS NOT NULL),
        '[]'
      ) AS bookings
    FROM rooms r
    LEFT JOIN bookings b 
      ON r.id = b.room_id
      AND b.status = 'approved'
      AND b.payment_status = 'paid'
      AND b.start_date <= $2::date
      AND b.end_date >= $1::date
    GROUP BY r.id;
  `;

  const result = await pool.query(query, [fromDate, toDate]);

  const rooms = result.rows;

  return rooms.map((room) => {
    const bookings = room.bookings.sort(
      (a, b) => new Date(a.from) - new Date(b.from)
    );

    const available = [];
    let curStart = new Date(fromDate);
    const filterEnd = new Date(toDate);

    bookings.forEach((b) => {
      const bStart = new Date(b.from);
      const bEnd = new Date(b.to);

      // If gap exists between current start and this booking start
      if (curStart < bStart) {
        available.push({
          from: new Date(curStart),
          to: new Date(bStart.setDate(bStart.getDate() - 1)),
        });
      }

      // Move current start after booking end
      curStart = new Date(bEnd.setDate(bEnd.getDate() + 1));
    });

    // Last gap (after last booking)
    if (curStart <= filterEnd) {
      available.push({
        from: curStart,
        to: filterEnd,
      });
    }

    return {
      id: room.id,
      name: room.name,
      available_ranges: available,
    };
  });
};

