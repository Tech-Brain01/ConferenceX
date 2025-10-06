const API_BASE = "http://localhost:8080/api/tickets";

export const createTicket = async (ticketData, token) => {
  const res = await fetch(`${API_BASE}/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(ticketData),
  });
  return res.json();
};

export const getMyTickets = async (token) => {
  const res = await fetch(`${API_BASE}/my`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
};

export const getTicketDetails = async (ticketId, token) => {
  const res = await fetch(`${API_BASE}/${ticketId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
};

export const addMessage = async (ticketId, message, token) => {
  const res = await fetch(`${API_BASE}/message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ ticketId, message }),
  });
  return res.json();
};

export const getAllTickets = async (token) => {
  const res = await fetch(`${API_BASE}/all`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
};


export const addAdminMessage = async (ticketId, message, token) => {
  const res = await fetch(`${API_BASE}/message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ ticketId, message }),
  });
  return res.json();
};


export const updateTicketStatus = async (ticketId, status, token) => {
  const res = await fetch(`${API_BASE}/${ticketId}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  return res.json();
};
