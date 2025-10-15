import React, { useEffect, useState } from "react";
import { Card, CardTitle, CardHeader, CardContent } from "./ui/card.jsx";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "./ui/table";
import { format } from "date-fns";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "./ui/pagination.jsx";
import clsx from "clsx";

function UpcomingBooking({ filterDate }) {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  const sortedBookings = React.useMemo(() => {
    let sortablebookings = [...filteredBookings];

    if (sortConfig.key === "start_date") {
      sortablebookings.sort((a, b) =>
        sortConfig.direction === "asc"
          ? new Date(a.start_date) - new Date(b.start_date)
          : new Date(b.start_date) - new Date(a.start_date)
      );
    } else if (sortConfig.key === "end_date") {
      sortablebookings.sort((a, b) =>
        sortConfig.direction === "asc"
          ? new Date(a.end_date) - new Date(b.end_date)
          : new Date(b.end_date) - new Date(a.end_date)
      );
    } else if (sortConfig.key === "srNo") {
      
      sortablebookings.sort((a, b) =>
        sortConfig.direction === "asc"
          ? (a.srNo ?? a.id ?? 0) - (b.srNo ?? b.id ?? 0)
          : (b.srNo ?? b.id ?? 0) - (a.srNo ?? a.id ?? 0)
      );
    }

    return sortablebookings;
  }, [filteredBookings, sortConfig]);

  useEffect(() => {
    async function fetchUpcomingBooking() {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");

        const from = filterDate?.fromDate
          ? format(filterDate.fromDate, "yyyy-MM-dd")
          : null;
        const to = filterDate?.toDate
          ? format(filterDate.toDate, "yyyy-MM-dd")
          : null;

        let url = `http://localhost:8080/api/admin/dashboard/upcoming-bookings`;
        if (from && to) {
          url += `?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
        }

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) throw new Error("Failed to fetch upcoming bookings");
        const data = await res.json();
        setBookings(data);
        setFilteredBookings(data);
        setCurrentPage(1); 
      } catch (error) {
        console.error("Failed to fetch upcoming bookings", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchUpcomingBooking();
  }, [filterDate]);

  const totalPages = Math.ceil(sortedBookings.length / bookingsPerPage);
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = sortedBookings.slice(
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
      setFilteredBookings(bookings);
    } else {
      setFilteredBookings(
        bookings.filter(
          (booking) => booking.status.toLowerCase() === type.toLowerCase()
        )
      );
    }
    setCurrentPage(1);
  };

  const statusColors = {
    approved: "text-green-600 bg-green-100",
    pending: "text-yellow-600 bg-yellow-100",
    cancelled: "text-orange-500 bg-orange-100",
    rejected: "text-red-600 bg-red-100",
  };

  const renderSortArrow = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? " ↑" : " ↓";
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
                  className={clsx(
                    "inline-flex items-center justify-center py-2 px-5 rounded-md text-sm font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500",
                    isActive
                      ? "bg-indigo-600 text-white shadow-md hover:bg-indigo-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
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
          <div className="flex justify-center py-12" role="status" aria-live="polite">
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
        ) : error ? (
          <p className="text-center text-red-500 font-medium py-12" role="alert">
            {error}
          </p>
        ) : currentBookings.length === 0 ? (
          <p className="text-center text-gray-500 font-medium py-12">
            No upcoming bookings
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
                  <TableHead
                    className="text-left text-gray-700 py-3 px-4 font-semibold tracking-wide cursor-pointer select-none"
                  >
                    Room Name
                  </TableHead>
                  <TableHead
                    className="text-left text-gray-700 py-3 px-4 font-semibold tracking-wide cursor-pointer select-none"
                  >
                    Booked By
                  </TableHead>
                  <TableHead
                    className="text-left text-gray-700 py-3 px-4 font-semibold tracking-wide cursor-pointer select-none"
                    onClick={() => handleSort("start_date")}
                  >
                    Start Date{renderSortArrow("start_date")}
                  </TableHead>
                  <TableHead
                    className="text-left text-gray-700 py-3 px-4 font-semibold tracking-wide cursor-pointer select-none"
                    onClick={() => handleSort("end_date")}
                  >
                    End Date{renderSortArrow("end_date")}
                  </TableHead>
                  <TableHead
                    className="text-left text-gray-700 py-3 px-4 font-semibold tracking-wide cursor-pointer select-none"
                    
                  >
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentBookings.map((booking, index) => (
                  <TableRow
                    key={booking.id ?? index}
                    className="hover:bg-indigo-50 cursor-pointer transition-colors duration-150"
                  >
                    <TableCell className="px-4">
                          {indexOfFirstBooking + index + 1}
                    </TableCell>
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
                        className={clsx(
                          "inline-block px-3 py-1 rounded-full text-sm font-semibold",
                          statusColors[booking.status.toLowerCase()] ||
                            "text-gray-600 bg-gray-100"
                        )}
                      >
                        {booking.status.charAt(0).toUpperCase() +
                          booking.status.slice(1)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {totalPages > 1 && (
              <Pagination
                aria-label="pagination Navigation"
                className="mt-8 bg-violet-200 rounded-md p-1 shadow-md flex items-center justify-center gap-2"
              >
                <PaginationPrevious
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 rounded-md px-3 py-2 text-indigo-600 hover:bg-indigo-100 disabled:text-gray-400 disabled:cursor-not-allowed transition"
                  aria-label="Previous page"
                />

                <PaginationContent className="flex gap-2">
                  {getPageItems().map((item, index) =>
                    item === "ellipsis" ? (
                      <PaginationItem key={`ellipsis-${index}`}>
                        <PaginationEllipsis
                          className="text-gray-400 select-none"
                          aria-hidden="true"
                        />
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
                          aria-current={item === currentPage ? "page" : undefined}
                          className={clsx(
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
                  aria-label="Next page"
                />
              </Pagination>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default UpcomingBooking;
