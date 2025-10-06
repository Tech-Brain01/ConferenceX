import React, { useEffect, useState } from "react";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
} from "./ui/card.jsx";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "./ui/table";

function UpcomingBooking() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUpcomingBooking() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `http://localhost:8080/api/admin/dashboard/upcoming-bookings`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch upcoming bookings");
        const data = await res.json();
        setBookings(data);
        setFilteredBookings(data);
      } catch (error) {
        console.error("Failed to fetch upcoming bookings", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUpcomingBooking();
  }, []);

  const handleFilter = (type) => {
    setFilter(type);
    if (type === "all") {
      setFilteredBookings(bookings);
    } else {
      setFilteredBookings(
        bookings.filter(
          (booking) => booking.status.toLowerCase() === type.toLowerCase()
        )
      );
    }
  };

  const statusColors = {
    approved: "text-green-600 bg-green-100",
    pending: "text-yellow-600 bg-yellow-100",
    cancelled: "text-orange-500 bg-orange-100",
    rejected: "text-red-600 bg-red-100",
  };

  return (
    <Card className="p-6 bg-white shadow-lg rounded-xl border border-gray-200 mt-10">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between ">
        <div className="flex space-x-3 mt-4 md:mt-0 items-center flex-wrap">
          {["all", "approved", "pending", "cancelled", "rejected"].map(
            (status) => {
              const isActive = filter === status;
              return (
                <button
                  key={status}
                  aria-pressed={isActive}
                  onClick={() => handleFilter(status)}
                  className={`
                    inline-flex items-center justify-center
                    py-2 px-5 rounded-md text-sm font-semibold
                    transition-colors duration-200
                    focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500
                    ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-md hover:bg-indigo-700"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }
                  `}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              );
            }
          )}
        </div>
      </CardHeader>

      <CardContent className="overflow-x-auto">
        {loading ? (
          <div className="flex justify-center py-12">
            <svg
              className="animate-spin h-8 w-8 text-indigo-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-label="Loading"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          </div>
        ) : filteredBookings.length === 0 ? (
          <p className="text-center text-gray-500 font-medium py-12">
            No upcoming bookings
          </p>
        ) : (
          <Table className="min-w-full border-collapse">
            <TableHeader>
              <TableRow className="bg-indigo-100">
                <TableHead className="text-left text-gray-700 py-3 px-4 font-semibold tracking-wide">
                  Room Name
                </TableHead>
                <TableHead className="text-left text-gray-700 py-3 px-4 font-semibold tracking-wide">
                  Booked By
                </TableHead>
                <TableHead className="text-left text-gray-700 py-3 px-4 font-semibold tracking-wide">
                  Start Date
                </TableHead>
                <TableHead className="text-left text-gray-700 py-3 px-4 font-semibold tracking-wide">
                  End Date
                </TableHead>
                <TableHead className="text-left text-gray-700 py-3 px-4 font-semibold tracking-wide">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((booking) => (
                <TableRow
                  key={booking.id}
                  className="hover:bg-indigo-50 cursor-pointer transition-colors duration-150"
                >
                  <TableCell className="py-3 px-4 font-semibold text-gray-800">
                    {booking.room_name}
                  </TableCell>
                  <TableCell className="py-3 px-4 font-semibold text-gray-700">
                    {booking.user_name}
                  </TableCell>
                  <TableCell className="py-3 px-4 text-gray-700">
                    {new Date(booking.start_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="py-3 px-4 text-gray-700">
                    {new Date(booking.end_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="py-3 px-4">
                    <span
                      className={`
                        inline-block px-3 py-1 rounded-full text-sm font-semibold
                        ${
                          statusColors[booking.status.toLowerCase()] ||
                          "text-gray-600 bg-gray-100"
                        }
                      `}
                    >
                      {booking.status.charAt(0).toUpperCase() +
                        booking.status.slice(1)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

export default UpcomingBooking;
