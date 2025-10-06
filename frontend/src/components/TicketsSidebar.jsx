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
  isAdmin = false,
}) {
  return (
    <Sidebar animate={false} className="bg-white shadow-md">
      <SidebarBody className="flex flex-col h-full bg-gradient-to-b from-yellow-100 via-yellow-200 to-yellow-300 shadow-inner font-sans">
        <div className="px-6 py-4 border-b border-gray-300 relative w-full">
           <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight">
            {isAdmin ? "User Tickets" : "All Tickets"}
          </h2>
         
            {!isAdmin && onCreateTicket && (
            <button
              onClick={onCreateTicket}
              className="mt-3 w-full bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 rounded-md transition"
            >
              + Create New Ticket
            </button>
          )}
        </div>
       

          <nav className="flex flex-col flex-1 overflow-y-auto">
          {tickets.map((ticket) => (
            <TicketSidebarLink
              key={ticket.id}
              ticket={ticket}
              isActive={selectedTicketId === ticket.id.toString()}
              onClick={() => onSelectTicket(ticket.id.toString())}
              isAdmin={isAdmin}
            />
          ))}
        </nav>
      </SidebarBody>
    </Sidebar>
  );
}

function TicketSidebarLink({ ticket, isActive, onClick, isAdmin }) {
  const createdAtDate = new Date(ticket.created_at);
  const formattedDate = isValid(createdAtDate)
    ? format(createdAtDate, "dd/MM/yyyy")
    : "Unknown date";

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      className={`flex items-center justify-between px-6 py-4 mt-5 cursor-pointer select-none rounded-md
        transition-colors duration-200 ease-in-out
        ${isActive ? "bg-blue-600 text-white shadow-lg" : "hover:bg-yellow-200"}
      `}
    >
      <div className="flex flex-col min-w-0">
        <Label
          className={`text-base font-semibold truncate ${
            isActive ? "text-white" : "text-gray-900"
          }`}
        >
          {ticket.subject}
        </Label>

        {/* For Admin: show user name if available */}
        {isAdmin && ticket.user_name && (
          <span className={`text-sm mt-1 italic ${isActive ? "text-blue-200" : "text-gray-600"}`}>
            by {ticket.user_name}
          </span>
        )}

        <span
          className={`text-sm truncate mt-1 ${
            isActive ? "text-blue-200" : "text-gray-700"
          }`}
        >
          {formattedDate}
        </span>
      </div>

      <Badge
        variant={
          ticket.status === "open"
            ? "cyan"
            : ticket.status === "resolved"
            ? "red"
            : "default"
        }
        className={`ml-4 uppercase tracking-wider px-3 py-1 flex-shrink-0 font-semibold ${
          isActive ? "bg-white text-blue-600" : ""
        }`}
      >
        {ticket.status}
      </Badge>
    </div>
  );
}