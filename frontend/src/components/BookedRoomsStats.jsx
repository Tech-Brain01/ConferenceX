import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card.jsx";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "./ui/table.jsx";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu.jsx";
import { ChevronDown } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "./ui/pagination.jsx";

const cn = (...classes) => classes.filter(Boolean).join(" ");

const BookedRoomsStats = ({ filterDate }) => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({
    key: "srNo",
    direction: "asc",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 10;

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

 
  const sortedRooms = React.useMemo(() => {
    let sortableRooms = [...filteredRooms];

    if (sortConfig.key === "avg_booking_duration") {
      sortableRooms.sort((a, b) =>
        sortConfig.direction === "asc"
          ? a.avg_booking_duration - b.avg_booking_duration
          : b.avg_booking_duration - a.avg_booking_duration
      );
    } else if (sortConfig.key === "totalbookings") {
      sortableRooms.sort((a, b) =>
        sortConfig.direction === "asc"
          ? a.totalbookings - b.totalbookings
          : b.totalbookings - a.totalbookings
      );
    } else if (sortConfig.key === "srNo") {
      if (sortConfig.direction === "desc") {
        sortableRooms.reverse();
      }
    }

    return sortableRooms;
  }, [filteredRooms, sortConfig]);

  useEffect(() => {
    async function fetchRoomStats() {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const from = filterDate?.fromDate
          ? format(filterDate.fromDate, "yyyy-MM-dd")
          : null;
        const to = filterDate?.toDate
          ? format(filterDate.toDate, "yyyy-MM-dd")
          : null;

        let url = `http://localhost:8080/api/admin/dashboard/room-booking-stats`;
        if (from && to) {
          url += `?from=${encodeURIComponent(from)}&to=${encodeURIComponent(
            to
          )}`;
        }

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Failed to fetch room stats");

        const data = await res.json();
        console.log("Rooms fetched:", data);

        setRooms(data);
        setFilteredRooms(data);
        setFilter("all"); 
        setCurrentPage(1); 
      } catch (err) {
        console.error("Failed to fetch room stats:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchRoomStats();
  }, [filterDate]);


  const totalPages = Math.ceil(sortedRooms.length / bookingsPerPage);
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = sortedRooms.slice(
    indexOfFirstBooking,
    indexOfLastBooking
  );

  const getPageItems = () => {
    if (totalPages <= 7) {
      return [...Array(totalPages).keys()].map((n) => n + 1);
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, "ellipsis", totalPages];
    }

    if (currentPage >= totalPages - 3) {
      return [
        1,
        "ellipsis",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      "ellipsis",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "ellipsis",
      totalPages,
    ];
  };

  const handleFilter = (type) => {
    setFilter(type);
    if (type === "all") {
      setFilteredRooms(rooms);
    } else if (type === "booked") {
      setFilteredRooms(rooms.filter((room) => room.totalbookings > 0));
    } else if (type === "not-booked") {
      setFilteredRooms(rooms.filter((room) => room.totalbookings === 0));
    }
    setCurrentPage(1);
  };

  const renderSortArrow = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? " ↑" : " ↓";
  };

  return (
    <Card className="p-6 bg-white shadow-lg rounded-xl border border-gray-200">
      <CardHeader className="flex flex-col">
        <div className="flex space-x-3 items-center justify-center mb-4">
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
                onClick={() => handleFilter(type)}
                className={cn(
                  "py-2 px-5 rounded-md text-sm font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1",
                  isActive
                    ? `bg-${color}-600 text-white focus:ring-${color}-500`
                    : `bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-${color}-500`
                )}
              >
                {labelMap[type]}
              </button>
            );
          })}
        </div>
      </CardHeader>

      <CardContent className="overflow-x-auto">
        {loading ? (
          <div className="flex justify-center py-12">Loading...</div>
        ) : filteredRooms.length === 0 ? (
          <p className="text-center text-gray-500 font-medium py-12">
            No rooms match the selected filter.
          </p>
        ) : (
          <>
            <Table className="min-w-full border-collapse">
              <TableHeader>
                <TableRow className="bg-indigo-100">
                  <TableHead
                    className="cursor-pointer select-none px-4"
                    onClick={() => handleSort("srNo")}
                  >
                    Sr No{renderSortArrow("srNo")}
                  </TableHead>
                  <TableHead>Room Name</TableHead>
                  <TableHead
                    className="cursor-pointer select-none px-10"
                    onClick={() => handleSort("totalbookings")}
                  >
                    Total Bookings{renderSortArrow("totalbookings")}
                  </TableHead>
                  <TableHead>Booking Refs</TableHead>
                  <TableHead
                    className="cursor-pointer select-none px-14"
                    onClick={() => handleSort("avg_booking_duration")}
                  >
                    Avg Booking Duration{renderSortArrow("avg_booking_duration")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentBookings.map((room, idx) => (
                  <TableRow
                    className="text-base font-sans bg-indigo-50 text-black"
                    key={room.id}
                  >
                    <TableCell className="px-4">
                      {indexOfFirstBooking + idx + 1}
                    </TableCell>
                    <TableCell>{room.name}</TableCell>
                    <TableCell className="px-10">{room.totalbookings}</TableCell>

                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transition"
                            aria-label="Booking reference IDs"
                          >
                            Refs Id{" "}
                            <ChevronDown className="ml-1 h-4 w-4 text-gray-500" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 bg-white rounded-md border border-gray-200 shadow-lg p-2">
                          <DropdownMenuLabel className="text-gray-900 font-semibold">
                            Booking Reference Ids
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {(room.booking_refs ? room.booking_refs.split(",") : [])
                            .length > 0 ? (
                            room.booking_refs.split(",").map((ref, index) => (
                              <DropdownMenuItem
                                key={index}
                                className="font-mono text-xs text-gray-800 hover:bg-indigo-100 cursor-pointer rounded-md"
                              >
                                {ref}
                              </DropdownMenuItem>
                            ))
                          ) : (
                            <DropdownMenuItem className="text-gray-500 italic cursor-default">
                              No booking reference Id
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                    <TableCell className="px-14">
                      {room.avg_booking_duration !== null
                        ? Number(room.avg_booking_duration).toFixed(2)
                        : "0.00"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {totalPages > 1 && (
              <Pagination
                aria-label="Pagination Navigation"
                className="mt-8 bg-violet-200 rounded-md p-1 shadow-md flex items-center justify-center gap-2"
              >
                <PaginationPrevious
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 rounded-md px-3 py-2 text-indigo-600 hover:bg-indigo-100 disabled:text-gray-400 disabled:cursor-not-allowed transition"
                />

                <PaginationContent className="flex gap-2">
                  {getPageItems().map((item, index) =>
                    item === "ellipsis" ? (
                      <PaginationItem key={`ellipsis-${index}`}>
                        <PaginationEllipsis className="text-gray-400 select-none" />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={item}>
                        <PaginationLink
                          isActive={item === currentPage}
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(item);
                          }}
                          href="#"
                          className={cn(
                            "rounded-md px-3 py-2 text-sm font-medium transition",
                            item === currentPage
                              ? "bg-indigo-600 text-white shadow-md hover:bg-indigo-700"
                              : "text-gray-700 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          )}
                        >
                          {item}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}
                </PaginationContent>

                <PaginationNext
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 rounded-md px-3 py-2 text-indigo-600 hover:bg-indigo-100 disabled:text-gray-400 disabled:cursor-not-allowed transition"
                />
              </Pagination>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default BookedRoomsStats;
