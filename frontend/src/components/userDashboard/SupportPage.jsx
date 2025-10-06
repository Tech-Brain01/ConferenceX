import { useState, useEffect } from "react";
import TicketsSidebar from "../TicketsSidebar.jsx";
import ChatWindow from "../ChatWindow.jsx";
import {
  getMyTickets,
  getTicketDetails,
  addMessage,
  createTicket,
} from "../../service/ticketService.js";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog.jsx";
import { Input } from "../ui/input.jsx";
import { Button } from "../ui/Button.jsx";

export default function SupportPage() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newSubject, setNewSubject] = useState("");

  const userId = parseInt(localStorage.getItem("userId")) || 20;
  const token = localStorage.getItem("token");


  async function fetchTickets() {
    const data = await getMyTickets(token);
    if (data.success) setTickets(data.tickets);
  }

  useEffect(() => {
    fetchTickets();
  }, []);


  useEffect(() => {
    if (!selectedTicketId) return;

    async function fetchMessages() {
      const data = await getTicketDetails(selectedTicketId, token);
      if (data.success) {
        setMessages(
          data.messages.map((msg) => ({
            text: msg.message,
            isUser: msg.sender_id === userId,
          }))
        );

        setStatus(data.ticket.status);
      }
    }
    fetchMessages();
  }, [selectedTicketId]);

  const handleSend = async (msgText) => {
    await addMessage(selectedTicketId, msgText, token);
    setMessages((prev) => [...prev, { text: msgText, isUser: true }]);
  };

  const handleCreateTicket = () => {
    setIsDialogOpen(true);
  };

  const handleDialogSubmit = async () => {
    if (!newSubject.trim()) return;

    try {
      const res = await createTicket({ subject: newSubject.trim() }, token);

      if (res.success && res.ticket) {
        setNewSubject("");
        setIsDialogOpen(false);
        await fetchTickets();

        setSelectedTicketId(res.ticket.id.toString());
      } else {
        alert("Failed to create ticket. Please try again.");
      }
    } catch (err) {
      console.error("Error creating ticket:", err);
      alert("Something went wrong while creating the ticket.");
    }
  };

  return (
    <div className="flex h-screen">
      <TicketsSidebar
        tickets={tickets}
        selectedTicketId={selectedTicketId}
        onSelectTicket={setSelectedTicketId}
        onCreateTicket={handleCreateTicket}
      />

      <div className="flex-grow flex flex-col">
        {selectedTicketId ? (
          <ChatWindow messages={messages} onSend={handleSend} status={status} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a ticket to start chatting
          </div>
        )}
      </div>

      {/* Dialog for creating new ticket */}
      <Dialog open={isDialogOpen} onChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Ticket</DialogTitle>
            <DialogDescription>
              Please enter the subject of your new support ticket.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <Input
              type="text"
              placeholder="Enter ticket subject..."
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              className="w-full"
            />
          </div>
          <DialogFooter className="mt-4">
            <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleDialogSubmit}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
