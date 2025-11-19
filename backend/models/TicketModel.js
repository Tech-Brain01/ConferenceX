import pool from "./db.js";

// create a ticket and return ticket_id
export const createTicket = async (userId, subject) => {
  const result = await pool.query(
    `INSERT INTO support_ticket (user_id , subject  ,status) VALUES ($1,$2,'open') RETURNING id`,
    [userId, subject]
  );
  return result.rows[0].id;
};

// Add initial or reply message to a ticket
export const addTicketMessage = async (ticketId, senderId, message) => {
  const result = await pool.query(
    `INSERT INTO ticket_message (ticket_id , sender_id , message) VALUES ($1,$2,$3) RETURNING id`,
    [ticketId, senderId, message]
  );
  return result.rows[0].id;
};

// get all detail for user
export const getUserTicket = async (userId) => {
  const result = await pool.query(
    `SELECT * FROM support_ticket WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId]
  );
  return result.rows;
};

// get all detail for admin
export const getAllTickets = async () => {
  const result = await pool.query(`
    SELECT 
      st.*, 
      u.name AS user_name 
    FROM 
      support_ticket st
    JOIN 
      users u ON st.user_id = u.id
    ORDER BY 
      st.created_at DESC
  `);
  return result.rows;
};

// get ticket detail by id
export const getTicketId = async (ticketId) => {
  const result = await pool.query(
    `SELECT * FROM support_ticket WHERE id = $1 `,
    [ticketId]
  );
  return result.rows[0];
};

// Get all messages for a ticket
export const getTicketMessages = async (ticketId) => {
  const result = await pool.query(
    `SELECT tm.*, u.name AS sender_name FROM ticket_message tm
     LEFT JOIN users u ON tm.sender_id = u.id
     WHERE tm.ticket_id = $1 ORDER BY tm.created_at ASC`,
    [ticketId]
  );
  return result.rows;
};

export const updateTicketStatus = async (ticketId, status) => {
  const result = await pool.query(
    `UPDATE support_ticket SET status = $1 WHERE id = $2`,
    [status, ticketId]
  );
  return result.rowCount > 0;
};



