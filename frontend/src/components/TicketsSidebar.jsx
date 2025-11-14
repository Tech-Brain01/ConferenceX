import React from "react";
import { Sidebar, SidebarBody } from "../components/ui/SideBarUi.jsx";
import { Label } from "../components/ui/label.jsx";
import { Badge } from "../components/ui/badge.jsx";
import { format, isValid } from "date-fns";

export default function TicketsSidebar({
  tickets,
  selectedTicketId,
  onSelectTicket,
  onCreateTicket,
  onRaiseRefund,
  isAdmin = false,
}) {
  return (
    <Sidebar animate={false} className="bg-white shadow-sm border-r">
      <SidebarBody className="flex flex-col h-full bg-gray-50 font-sans">

        {/* HEADER */}
        <div className="px-5 py-4 border-b bg-white sticky top-0 z-10">
          <h2 className="text-xl font-bold text-gray-800">
            {isAdmin ? "User Tickets" : "My Tickets"}
          </h2>

          {/* Buttons */}
          {!isAdmin && (
            <div className="space-y-2 mt-3">
              {onRaiseRefund && (
                <button
                  onClick={onRaiseRefund}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm font-medium transition"
                >
                  Raise Refund Request
                </button>
              )}

              {onCreateTicket && (
                <button
                  onClick={onCreateTicket}
                  className="w-full bg-gray-800 hover:bg-gray-900 text-white py-2 rounded-md text-sm font-medium transition"
                >
                  + Create New Ticket
                </button>
              )}
            </div>
          )}
        </div>

        {/* TICKET LIST */}
        <nav className="flex flex-col flex-1 overflow-y-auto p-3 space-y-3">
          {tickets.map((ticket) => (
            <TicketSidebarLink
              key={ticket.id}
              ticket={ticket}
              isActive={selectedTicketId === ticket.id.toString()}
              onClick={() => onSelectTicket(ticket.id.toString())}
              isAdmin={isAdmin}
            />
          ))}

          {tickets.length === 0 && (
            <p className="text-center text-gray-500 text-sm mt-4">
              No tickets found.
            </p>
          )}
        </nav>

      </SidebarBody>
    </Sidebar>
  );
}

function TicketSidebarLink({ ticket, isActive, onClick, isAdmin }) {
  const createdAtDate = new Date(ticket.created_at);
  const formattedDate = isValid(createdAtDate)
    ? format(createdAtDate, "dd MMM yyyy")
    : "Unknown date";

  const statusColor =
    ticket.status === "open"
      ? "bg-blue-100 text-blue-700"
      : ticket.status === "resolved"
      ? "bg-green-100 text-green-700"
      : "bg-gray-200 text-gray-700";

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all border
        ${
          isActive
            ? "bg-blue-600 text-white border-blue-700 shadow-md"
            : "bg-white hover:bg-gray-100 border-gray-200"
        }
      `}
    >
      {/* LEFT SIDE */}
      <div className="flex flex-col min-w-0">
        <Label
          className={`font-semibold truncate text-sm ${
            isActive ? "text-white" : "text-gray-900"
          }`}
        >
          {ticket.subject}
        </Label>

        {isAdmin && ticket.user_name && (
          <span
            className={`text-xs mt-1 italic ${
              isActive ? "text-blue-100" : "text-gray-600"
            }`}
          >
            by {ticket.user_name}
          </span>
        )}

        <span
          className={`text-xs mt-1 ${
            isActive ? "text-blue-100" : "text-gray-500"
          }`}
        >
          {formattedDate}
        </span>
      </div>

      {/* STATUS BADGE */}
      <Badge
        className={`uppercase text-[10px] px-2 py-1 font-bold rounded-md shrink-0 
          ${isActive ? "bg-white text-blue-700" : statusColor}
        `}
      >
        {ticket.status}
      </Badge>
    </div>
  );
}
