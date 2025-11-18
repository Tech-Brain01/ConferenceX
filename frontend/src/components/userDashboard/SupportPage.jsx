import { useState, useEffect } from "react";
import TicketsSidebar from "../TicketsSidebar.jsx";
import ChatWindow from "../ChatWindow.jsx";
import {
  getMyTickets,
  getTicketDetails,
  addMessage,
  createTicket,
} from "../../service/ticketService.js";
import { createRefundRequest } from "../../service/refundService.js";

import {
  Dialog,
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
  const [dialogMode, setDialogMode] = useState("ticket");
  const [newSubject, setNewSubject] = useState("");

  const [bookingRef, setBookingRef] = useState("");
  const [txnNo, setTxnNo] = useState("");
  const [roomName, setRoomName] = useState("");
  const [refundMessage, setRefundMessage] = useState("");

  const userId = parseInt(localStorage.getItem("userId"));
  const token = localStorage.getItem("token");

  // Fetch all tickets
  async function fetchTickets() {
    const data = await getMyTickets(token);
    if (data.success) setTickets(data.tickets);
  }

  useEffect(() => {
    fetchTickets();
  }, []);

  // Fetch messages for selected ticket
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
    if (!msgText.trim()) return;
    await addMessage(selectedTicketId, msgText, token);
    setMessages((prev) => [...prev, { text: msgText, isUser: true }]);
  };

  const openTicketDialog = () => {
    setDialogMode("ticket");
    setIsDialogOpen(true);
  };

  const openRefundDialog = () => {
    setDialogMode("refund");
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (dialogMode === "ticket") {
      if (!newSubject.trim()) return alert("Subject cannot be empty.");

      const res = await createTicket({ subject: newSubject.trim() }, token);
      if (res.success && res.ticket) {
        setNewSubject("");
        setIsDialogOpen(false);
        await fetchTickets();
        setSelectedTicketId(res.ticket.id.toString());
      } else {
        alert("Failed to create ticket");
      }
      return;
    }

    // Inside SupportPage.jsx, handleSubmit() for refund
    if (dialogMode === "refund") {
      console.log("DEBUG: Refund Input Values:", {
        bookingRef,
        txnNo,
        roomName,
        refundMessage,
      });

      // Validation
      if (!bookingRef.trim()) return alert("Booking reference is required.");
      if (!txnNo.trim()) return alert("Transaction number is required.");
      if (!roomName.trim()) return alert("Room name is required.");
      if (!refundMessage.trim()) return alert("Refund reason is required.");

      // Payload that matches the backend controller
      const refundPayload = {
        bookingRef: bookingRef.trim(),
        txnNo: txnNo.trim(),
        roomName: roomName.trim(),
        reason: refundMessage.trim(),
      };

      console.log("DEBUG: Refund Payload Sent:", refundPayload);

      const res = await createRefundRequest(refundPayload, token);

      console.log("DEBUG: Refund API Response:", res);

      if (res.success) {
        setBookingRef("");
        setTxnNo("");
        setRoomName("");
        setRefundMessage("");
        setIsDialogOpen(false);
        alert("Refund request submitted successfully.");
      } else {
        alert(res.error || "Failed to submit refund request.");
      }
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <TicketsSidebar
        tickets={tickets}
        selectedTicketId={selectedTicketId}
        onSelectTicket={setSelectedTicketId}
        onCreateTicket={openTicketDialog}
        onRaiseRefund={openRefundDialog}
      />

      {/* Chat Window */}
      <div className="flex-grow flex flex-col">
        {selectedTicketId ? (
          <ChatWindow messages={messages} onSend={handleSend} status={status} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a ticket to start chatting
          </div>
        )}
      </div>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md space-y-4">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "ticket"
                ? "Create New Ticket"
                : "Raise Refund Request"}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === "ticket"
                ? "Please enter the subject of your new support ticket."
                : "Provide refund request details below."}
            </DialogDescription>
          </DialogHeader>

          {/* Ticket Form */}
          {dialogMode === "ticket" && (
            <Input
              placeholder="Enter ticket subject..."
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
            />
          )}

          {/* Refund Form */}
          {dialogMode === "refund" && (
            <div className="space-y-3">
              <Input
                placeholder="Enter Booking Reference No."
                value={bookingRef}
                onChange={(e) => setBookingRef(e.target.value)}
              />

              <Input
                placeholder="Enter Transaction Number"
                value={txnNo}
                onChange={(e) => setTxnNo(e.target.value)}
              />

              <Input
                placeholder="Enter Room Name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
              />

              <textarea
                className="w-full min-h-24 border rounded-md p-2 text-sm"
                placeholder="Write refund description..."
                value={refundMessage}
                onChange={(e) => setRefundMessage(e.target.value)}
              />
            </div>
          )}

          <DialogFooter className="flex justify-end space-x-2">
            <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {dialogMode === "ticket" ? "Create" : "Submit Refund"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
