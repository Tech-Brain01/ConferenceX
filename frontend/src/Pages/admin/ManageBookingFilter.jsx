import React from "react";
import { Popover, PopoverTrigger, PopoverContent } from "../../components/ui/popover";
import { Button } from "../../components/ui/Button";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline";

const statusColors = {
  all: "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-200",
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-200 dark:text-yellow-900",
  approved: "bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900",
  rejected: "bg-red-100 text-red-800 dark:bg-red-200 dark:text-red-900",
  cancelled: "bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
};

const ManageBookingFilter = ({
  bookings = [],
  selectedRoom,
  setSelectedRoom,
  uniqueRooms = [],
  sortOrder,
  setSortOrder,
  activeStatus,
  setActiveStatus,
}) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-gray-200  rounded-md shadow-md mb-4">
      
      {/* Total bookings */}
      <p className="text-black  font-semibold">
        Total bookings: {bookings.length}
      </p>

      {/* Status popover */}
      <Popover>
        <PopoverTrigger className="border rounded-2xl p-2 border-cyan-300 text-base cursor-pointer bg-white ">
          Status: <span className="font-semibold">{activeStatus.charAt(0).toUpperCase() + activeStatus.slice(1)}</span>
        </PopoverTrigger>
        <PopoverContent className="w-40 p-2 bg-white dark:bg-gray-800 shadow-md rounded-md">
          {["all", "pending", "approved", "rejected", "cancelled"].map((status) => (
            <Button
              key={status}
              onClick={() => setActiveStatus(status)}
              className={`block w-full text-left px-3 py-1 rounded-md mb-1 ${
                activeStatus === status
                  ? `shadow-lg ${statusColors[status]}`
                  : "hover:bg-gray-100 "
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </PopoverContent>
      </Popover>

      {/* Room selection popover */}
      <Popover>
        <PopoverTrigger className="border rounded-2xl p-2 border-cyan-300  text-base cursor-pointer bg-white ">
          Room: <span className="font-semibold">{selectedRoom || "All"}</span>
        </PopoverTrigger>
        <PopoverContent className="max-h-60 overflow-y-auto w-48 p-2 bg-white dark:bg-gray-800 shadow-md rounded-md">
          <Button
            onClick={() => setSelectedRoom("")}
            className={`block w-full text-left px-3 py-1 rounded-md mb-2 ${
              selectedRoom === "" ? "bg-indigo-600 text-white" : "hover:bg-gray-100"
            }`}
          >
            All Rooms
          </Button>
          {uniqueRooms.map((room) => (
            <Button
              key={room}
              onClick={() => setSelectedRoom(room)}
              className={`block w-full text-left px-3 py-1 rounded-md mb-1 ${
                selectedRoom === room ? "bg-indigo-600 text-white" : "hover:bg-gray-100"
              }`}
            >
              {room}
            </Button>
          ))}
        </PopoverContent>
      </Popover>

      {/* Sort order toggle */}
      <Button
        onClick={() => setSortOrder(sortOrder === "Asc" ? "Desc" : "Asc")}
        className="flex items-center gap-2 px-3 py-2 rounded-md border border-gray-300  bg-white  text-gray-700  hover:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
      >
        Sort: {sortOrder === "Asc" ? "Oldest" : "Newest"}
        {sortOrder === "Asc" ? (
          <ArrowUpIcon className="w-4 h-4" />
        ) : (
          <ArrowDownIcon className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
};

export default ManageBookingFilter;
