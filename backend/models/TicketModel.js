import pool from "./db.js";

// create a ticket and return ticket_id
export const createTicket = async (userId, subject) => {
  const [result] = await pool.execute(
    `INSERT INTO support_ticket (user_id , subject  ,status) VALUES (?,?,'open')`,
    [userId, subject]
  );
  return result.insertId;
};

// Add initial or reply message to a ticket
export const addTicketMessage = async (ticketId, senderId, message) => {
  const [result] = await pool.execute(
    `INSERT INTO ticket_message (ticket_id , sender_id , message) VALUES (?,?,?)`,
    [ticketId, senderId, message]
  );
  return result.insertId;
};

// get all detail for user
export const getUserTicket = async (userId) => {
  const [rows] = await pool.execute(
    `SELECT * FROM support_ticket WHERE user_id = ? ORDER BY created_at DESC`,
    [userId]
  );
  return rows;
};

// get all detail for admin
export const getAllTickets = async () => {
  const [rows] = await pool.execute(`
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
  return rows;
};

// get ticket detail by id
export const getTicketId = async (ticketId) => {
  const [rows] = await pool.execute(
    `SELECT * FROM support_ticket WHERE id = ? `,
    [ticketId]
  );
  return rows[0];
};

// Get all messages for a ticket
export const getTicketMessages = async (ticketId) => {
  const [rows] = await pool.execute(
    `SELECT tm.*, u.name AS sender_name FROM ticket_message tm
     LEFT JOIN users u ON tm.sender_id = u.id
     WHERE tm.ticket_id = ? ORDER BY tm.created_at ASC`,
    [ticketId]
  );
  return rows;
};

export const updateTicketStatus = async (ticketId, status) => {
  const [result] = await pool.execute(
    `UPDATE support_ticket SET status = ? WHERE id = ?`,
    [status, ticketId]
  );
  return result.affectedRows > 0;
};



