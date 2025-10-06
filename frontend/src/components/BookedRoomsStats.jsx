import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "./ui/card.jsx";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "./ui/table.jsx";

const BookedRoomsStats = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [filter, setFilter] = useState("all"); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRoomStats() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:8080/api/admin/dashboard/room-booking-stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) throw new Error("Failed to fetch room stats");
        const data = await res.json();
        setRooms(data);
        setFilteredRooms(data);
      } catch (err) {
        console.error("Failed to fetch room stats", err);
      } finally {
        setLoading(false);
      }
    }
    fetchRoomStats();
  }, []);

  const handleFilter = (type) => {
    setFilter(type);
    if (type === "all") {
      setFilteredRooms(rooms);
    } else if (type === "booked") {
      setFilteredRooms(rooms.filter((room) => room.totalbookings > 0));
    } else if (type === "not-booked") {
      setFilteredRooms(rooms.filter((room) => room.totalbookings === 0));
    }
  };

  return (
    <Card className="p-6 bg-white shadow-lg rounded-xl border border-gray-200">
      <CardHeader className="flex flex-col  ">
        <div className="flex  space-x-3  items-center justify-center">
          {["all", "booked", "not-booked"].map((type) => {
            const labelMap = {
              all: "All",
              booked: "Booked",
              "not-booked": "Not Booked",
            };
            const colorMap = {
              all: "indigo",
              booked: "green",
              "not-booked": "red",
            };
            const isActive = filter === type;
            const color = colorMap[type];

            return (
              <button
                key={type}
                aria-pressed={isActive}
                onClick={() => handleFilter(type)}
                className={`
                  inline-flex items-center justify-center
                  py-2 px-5 rounded-md text-sm font-semibold
                  transition-colors duration-200
                  focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-${color}-500
                  ${
                    isActive
                      ? `bg-${color}-600 text-white shadow-md hover:bg-${color}-700`
                      : `bg-gray-100 text-gray-700 hover:bg-gray-200`
                  }
                `}
              >
                {labelMap[type]}
              </button>
            );
          })}
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
        ) : filteredRooms.length === 0 ? (
          <p className="text-center text-gray-500 font-medium py-12">
            No rooms match the selected filter.
          </p>
        ) : (
          <Table className="min-w-full border-collapse">
            <TableHeader>
              <TableRow className="bg-indigo-100">
                <TableHead className="text-left text-gray-700 py-3 px-4 font-semibold tracking-wide">
                  Room ID
                </TableHead>
                <TableHead className="text-left text-gray-700 py-3 px-4 font-semibold tracking-wide">
                  Room Name
                </TableHead>
                <TableHead className="text-left text-gray-700 py-3 px-4 font-semibold tracking-wide">
                  Total Bookings
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRooms.map((room) => (
                <TableRow
                  key={room.id}
                  className="hover:bg-indigo-50 cursor-pointer transition-colors duration-150"
                >
                  <TableCell className="py-3 px-4 text-gray-800 font-medium">
                    {room.id}
                  </TableCell>
                  <TableCell className="py-3 px-4 text-gray-900">
                    {room.name}
                  </TableCell>
                  <TableCell className="py-3 px-4 text-indigo-600 font-semibold">
                    {room.totalbookings}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default BookedRoomsStats;
