import React, { useState, useEffect } from "react";
import {
  getAllTickets,
  getTicketDetails,
  addAdminMessage,
  updateTicketStatus,
} from "../service/ticketService.js";

import { Label } from "../components/ui/label.jsx";
import { Input } from "../components/ui/input.jsx";
import { Button } from "../components/ui/Button.jsx";

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false); // Optional: track sending message

  const token = localStorage.getItem("token");

  // Load all tickets
  useEffect(() => {
    async function fetchTickets() {
      setLoading(true);
      const data = await getAllTickets(token);
      if (data.success) setTickets(data.tickets);
      setLoading(false);
    }
    fetchTickets();
  }, [token]);

  // Load selected ticket + messages
  useEffect(() => {
    if (!selectedTicketId) {
      setSelectedTicket(null);
      setMessages([]);
      return;
    }

    async function fetchDetails() {
      setLoading(true);
      const data = await getTicketDetails(selectedTicketId, token);
      if (data.success) {
        setSelectedTicket(data.ticket);
        setMessages(
          data.messages.map((msg) => ({
            ...msg,
            isAdmin: msg.sender_id !== data.ticket.user_id,
          }))
        );
      }
      setLoading(false);
    }
    fetchDetails();
  }, [selectedTicketId, token]);

  // Update status state when selectedTicket changes
  useEffect(() => {
    if (selectedTicket) {
      setStatus(selectedTicket.status);
    }
  }, [selectedTicket]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    setSendingMessage(true);
    const res = await addAdminMessage(selectedTicketId, newMessage.trim(), token);
    if (res.success) {
      setMessages((prev) => [
        ...prev,
        { message: newMessage.trim(), isAdmin: true, sender_name: "Admin" },
      ]);
      setNewMessage("");
    } else {
      alert("Failed to send message: " + (res.error || "Unknown error"));
    }
    setSendingMessage(false);
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setUpdatingStatus(true);
    const res = await updateTicketStatus(selectedTicketId, newStatus, token);
    if (res.success) {
      setSelectedTicket((prev) => ({
        ...prev,
        status: newStatus,
      }));

      setTickets((prev) =>
        prev.map((t) =>
          t.id === selectedTicket.id ? { ...t, status: newStatus } : t
        )
      );
    } else {
      setStatus(selectedTicket.status);
      alert("Failed to update status: " + (res.error || "Unknown error"));
    }
    setUpdatingStatus(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-96 border-r border-gray-300 bg-white overflow-y-auto">
        <div className="p-6 border-b border-gray-300">
          <h1 className="text-2xl font-bold text-gray-900">Support Tickets</h1>
        </div>

        {loading && !selectedTicketId ? (
          <div className="p-6 text-center text-gray-500">Loading tickets...</div>
        ) : (
          <ul>
            {tickets.map((ticket) => (
              <li
                key={ticket.id}
                onClick={() => setSelectedTicketId(ticket.id.toString())}
                className={`cursor-pointer px-6 py-4 border-b border-gray-200 hover:bg-yellow-50 flex justify-between items-start gap-4 ${
                  selectedTicketId === ticket.id.toString()
                    ? "bg-yellow-100 font-semibold"
                    : "font-normal"
                }`}
              >
                <div className="flex flex-col gap-1 w-[70%]">
                  <Label className="truncate text-base">{ticket.subject}</Label>
                  <p className="text-sm text-gray-500">
                    From:{" "}
                    <span className="font-medium text-blue-600">{ticket.user_name}</span>
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold uppercase tracking-wide ${
                    ticket.status === "open"
                      ? "bg-green-200 text-green-800"
                      : ticket.status === "resolved"
                      ? "bg-gray-300 text-gray-700"
                      : "bg-yellow-200 text-yellow-800"
                  }`}
                >
                  {ticket.status}
                </span>
              </li>
            ))}
            {tickets.length === 0 && (
              <li className="p-6 text-gray-500 text-center">No tickets found.</li>
            )}
          </ul>
        )}
      </aside>

      {/* Ticket Details */}
      <main className="flex-1 flex flex-col bg-white">
        {!selectedTicket ? (
          <div className="flex items-center justify-center h-full text-gray-400 text-lg">
            Select a ticket to view details
          </div>
        ) : (
          <>
            {/* Header */}
            <header className="border-b border-gray-300 px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900 truncate max-w-xl">
                  {selectedTicket.subject}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Created At: {new Date(selectedTicket.created_at).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  Status:{" "}
                  <select
                    value={status}
                    onChange={handleStatusChange}
                    disabled={updatingStatus}
                    className={`inline-block px-2 py-1 rounded text-xs font-semibold uppercase tracking-wide ${
                      status === "open"
                        ? "bg-green-200 text-green-800"
                        : status === "resolved"
                        ? "bg-gray-300 text-gray-700"
                        : "bg-yellow-200 text-yellow-800"
                    }`}
                  >
                    <option value="open">Open</option>
                    <option value="pending">Pending</option>
                    <option value="resolved">Resolved</option>
                  </select>
                  {updatingStatus && (
                    <span className="text-xs text-gray-500 italic">Updating...</span>
                  )}
                </p>
              </div>
            </header>

            {/* Messages */}
            <section className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-gray-50">
              {messages.length === 0 ? (
                <p className="text-center text-gray-400 mt-10">No messages yet.</p>
              ) : (
                messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`max-w-xl rounded-lg p-3 shadow ${
                      msg.isAdmin
                        ? "bg-blue-600 text-white self-end ml-auto"
                        : "bg-yellow-100 text-gray-900 self-start mr-auto"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                    <span className="text-xs mt-1 block opacity-70 text-right">
                      {msg.sender_name || (msg.isAdmin ? "Admin" : "User")}
                    </span>
                  </div>
                ))
              )}
            </section>

            {/* Input Area */}
            <footer className="border-t border-gray-300 px-6 py-4 flex items-end gap-4 bg-white">
              <div className="flex-grow">
                <Label
                  htmlFor="admin-reply"
                  className="text-sm text-gray-700 mb-1 block"
                >
                  Reply
                </Label>
                <Input
                  id="admin-reply"
                  as="textarea"
                  rows={2}
                  placeholder="Write your reply..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="w-full resize-none border border-yellow-300 bg-yellow-100 text-yellow-900 placeholder-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={sendingMessage}
                className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-6 py-2 rounded-md transition disabled:opacity-50"
              >
                {sendingMessage ? "Sending..." : "Send"}
              </Button>
            </footer>
          </>
        )}
      </main>
    </div>
  );
}
