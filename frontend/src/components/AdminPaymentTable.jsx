import React, { useState, useEffect } from "react";
import { Card, CardTitle, CardHeader, CardContent } from "./ui/card.jsx";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "./ui/table.jsx";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "./ui/pagination.jsx";
import { format } from "date-fns";
import clsx from "clsx";

const AdminPaymentTable = () => {
  const [bookings, setBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10; // Number of rows per page

  // Fetch bookings on mount and whenever the current page changes
  useEffect(() => {
    fetchBookings(currentPage);
  }, [currentPage]);

  // Function to fetch bookings from the backend API
  const fetchBookings = async (page) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in localStorage.");
        return; // Don't proceed if no token is found
      }

      const res = await fetch(`http://localhost:8080/api/admin/payments?page=${page}&limit=${pageSize}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        console.error("Failed to fetch data:", res.statusText);
        return;
      }

      const data = await res.json();
      if (data && data.payments) {
        setBookings(data.payments); // Use `payments` instead of `bookings` to match the backend response
        setTotalPages(Math.ceil(data.total / pageSize)); // Calculate total pages
      } else {
        console.error("Invalid data structure:", data);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle>Admin Payment Table</CardTitle>
      </CardHeader>
      <CardContent>
        <Table className="min-w-full border-collapse">
          <TableHeader>
            <TableRow className="bg-indigo-100">
              {[
                "Sr No",
                "BK Ref",
                "Room Name",
                "Inv No.",
                "Txn No.",
                "Pay Date",
                "Start Date",
                "End Date",
                "Total Amt",
                "Pay Method",
              ].map((head) => (
                <TableHead
                  key={head}
                  className="text-left text-gray-700 py-3 px-4 font-semibold tracking-wide cursor-pointer select-none"
                >
                  {head}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Safely map over bookings */}
            {bookings && bookings.length > 0 ? (
              bookings.map((booking, index) => (
                <TableRow
                  key={booking.id}
                  className={clsx(index % 2 === 0 ? "bg-white" : "bg-gray-50")}
                >
                  <TableCell className="px-4 py-2">
                    {index + 1 + (currentPage - 1) * pageSize}
                  </TableCell>
                  <TableCell className="px-4 py-2">{booking.booking_ref}</TableCell>
                  <TableCell className="px-4 py-2">{booking.room_name}</TableCell>
                  <TableCell className="px-4 py-2">{booking.invoice_no}</TableCell>
                  <TableCell className="px-4 py-2">{booking.transaction_ref}</TableCell>
                  <TableCell className="px-4 py-2">
                    {booking.payment_date
                      ? format(new Date(booking.payment_date), "dd MMM yyyy")
                      : "-"}
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    {booking.start_date
                      ? format(new Date(booking.start_date), "dd MMM yyyy")
                      : "-"}
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    {booking.end_date
                      ? format(new Date(booking.end_date), "dd MMM yyyy")
                      : "-"}
                  </TableCell>
                  <TableCell className="px-4 py-2">{booking.total_amount}</TableCell>
                  <TableCell className="px-4 py-2">{booking.payment_method || "-"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-4">
                  No bookings available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationPrevious
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </PaginationPrevious>

            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i} active={i + 1 === currentPage}>
                <PaginationLink onClick={() => setCurrentPage(i + 1)}>
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationNext
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </PaginationNext>
          </PaginationContent>
        </Pagination>
      </CardContent>
    </Card>
  );
};

export default AdminPaymentTable;
