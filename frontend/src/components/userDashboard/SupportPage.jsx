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
  const [dialogMode, setDialogMode] = useState("ticket"); 
  const [newSubject, setNewSubject] = useState("");

  // Refund form fields
  const [bookingRef, setBookingRef] = useState("");
  const [txnNo, setTxnNo] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [refundMessage, setRefundMessage] = useState("");

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
      if (!newSubject.trim()) return;

      const res = await createTicket({ subject: newSubject.trim() }, token);

      if (res.success && res.ticket) {
        setNewSubject("");
        setIsDialogOpen(false);
        await fetchTickets();
        setSelectedTicketId(res.ticket.id.toString());
      } else {
        alert("Failed to create ticket");
      }

    } else if (dialogMode === "refund") {
      // Form validation
      if (!bookingRef || !txnNo || !invoiceNo) {
        alert("Please fill in all refund fields.");
        return;
      }

      const refundPayload = {
        subject: `Refund Request - Booking ${bookingRef}`,
        details: {
          bookingRef,
          txnNo,
          invoiceNo,
          message: refundMessage,
        },
      };

      const res = await createTicket(refundPayload, token);

      if (res.success && res.ticket) {
        setBookingRef("");
        setTxnNo("");
        setInvoiceNo("");
        setRefundMessage("");
        setIsDialogOpen(false);
        await fetchTickets();
        setSelectedTicketId(res.ticket.id.toString());
      } else {
        alert("Failed to raise refund request.");
      }
    }
  };

  return (
    <div className="flex h-screen">
      <TicketsSidebar
        tickets={tickets}
        selectedTicketId={selectedTicketId}
        onSelectTicket={setSelectedTicketId}
        onCreateTicket={openTicketDialog}
        onRaiseRefund={openRefundDialog}
      />

      <div className="flex-grow flex flex-col">
        {selectedTicketId ? (
          <ChatWindow
            messages={messages}
            onSend={handleSend}
            status={status}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a ticket to start chatting
          </div>
        )}
      </div>

      {/* Unified Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md space-y-4">

          <DialogHeader>
            <DialogTitle>
              {dialogMode === "ticket" ? "Create New Ticket" : "Raise Refund Request"}
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
                placeholder="Enter Transaction No."
                value={txnNo}
                onChange={(e) => setTxnNo(e.target.value)}
              />

              <Input
                placeholder="Enter Invoice No."
                value={invoiceNo}
                onChange={(e) => setInvoiceNo(e.target.value)}
              />

              <textarea
                className="w-full min-h-24 border rounded-md p-2 text-sm"
                placeholder="Write refund description..."
                value={refundMessage}
                onChange={(e) => setRefundMessage(e.target.value)}
              />
            </div>
          )}

          <DialogFooter>
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
