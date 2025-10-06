import {
  createTicket,
  addTicketMessage,
  getUserTicket,
  getAllTickets,
  getTicketId,
  getTicketMessages,
  updateTicketStatus
} from "../models/TicketModel.js";

export const createTicketController = async (req, res) => {
  try {
    const { subject, description = "" } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    if (!subject || !subject.trim()) {
      return res.status(400).json({ success: false, error: "Subject is required" });
    }

    const ticketId = await createTicket(userId, subject.trim());

    if (description && description.trim()) {
      await addTicketMessage(ticketId, userId, description.trim());
    }

    res.status(201).json({ success: true, ticket: { id: ticketId, subject } });
  } catch (err) {
    console.error("Error creating ticket:", err); 
    res.status(500).json({ error: "Internal server error" });
  }
};



export const getUserTicketController = async (req, res) => {
  try {
    const tickets = await getUserTicket(req.user.id);
    res.status(200).json({ success: true, tickets });
  } catch (err) {
    console.error("error in  fetching ticket", err);
    res.status(500).json({ err: "Internal server error" });
  }
};

export const getAllTicketsController = async (req, res) => {
  try {
    const tickets = await getAllTickets();
    res.status(200).json({ success: true, tickets });
  } catch (err) {
    console.error("error in fetching all ticket", err);
    res.status(500).json({ err: "Internal server error" });
  }
};

export const getTicketDetailsController = async (req, res) => {
  try {
    const ticketId = Number(req.params.ticketId);
    if (isNaN(ticketId)) {
      return res.status(400).json({ error: "Invalid ticket ID" });
    }

    const ticket = await getTicketId(ticketId);
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    if (ticket.user_id !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    const messages = await getTicketMessages(ticketId);
    res.json({ success: true, ticket, messages });
  } catch (err) {
    console.error("Error in getTicketDetailsController:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const addMessageController = async (req, res) => {
  try {
    const { ticketId, message } = req.body;
    const senderId = req.user.id;

    const ticket = await getTicketId(ticketId);
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    if (ticket.user_id !== senderId && req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    await addTicketMessage(ticketId, senderId, message);
    res.status(201).json({ success: true, message: "Message added" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add message" });
  }
};

export const updateTicketStatusController = async (req, res) => {
  try {
    const ticketId = Number(req.params.ticketId);
    const { status } = req.body;

    if (isNaN(ticketId)) {
      return res.status(400).json({ error: "Invalid ticket ID" });
    }

    if (!["open", "resolved", "pending"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const success = await updateTicketStatus(ticketId, status);
    if (!success) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    res.json({ success: true, message: "Ticket status updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
