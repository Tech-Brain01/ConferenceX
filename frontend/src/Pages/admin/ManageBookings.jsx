import { useEffect, useState } from "react";
import BookingCard from "../../components/BookingCard.jsx";
import { toast } from "sonner";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { cn } from "../../lib/utils.js";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "../../components/ui/pagination.jsx";
import { Input } from "../../components/ui/input.jsx";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../../components/ui/popover.jsx";
import { Button } from "../../components/ui/Button.jsx";
const statusTabs = ["all", "pending", "approved", "rejected", "cancelled"];

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [activeStatus, setActiveStatus] = useState("all");
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 6;

  const fetchBookings = async (status) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const url =
        status && status !== "all"
          ? `http://localhost:8080/api/admin/bookings?status=${status}`
          : "http://localhost:8080/api/admin/bookings";

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok || !Array.isArray(data.bookings)) {
        console.error("API error:", data.error || data);
        setBookings([]);
        return;
      }

      const sortedBookings = data.bookings.sort(
        (a, b) => new Date(a.start_date) - new Date(b.start_date)
      );

      setBookings(sortedBookings);
    } catch (err) {
      console.error("Fetch error:", err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (bookingId, status, rejectResponse = "") => {
    setUpdating(true);
    const token = localStorage.getItem("token");

    try {
      const body =
        status === "rejected"
          ? { status, reject_response: rejectResponse }
          : { status };

      const res = await fetch(
        `http://localhost:8080/api/admin/bookings/${bookingId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );

      if (res.ok) {
        toast.success(`Booking ${status} successfully.`);
        fetchBookings(activeStatus);
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to update status.");
      }
    } catch (err) {
      toast.error("Something went wrong.");
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchBookings(activeStatus);
  }, [activeStatus]);

  const uniqueRooms = Array.from(new Set(bookings.map((b) => b.room_name)));

  const filteredBookings = bookings.filter(
    (booking) => !selectedRoom || booking.room_name === selectedRoom
  );

  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);

  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = filteredBookings.slice(
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

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-10 text-center text-indigo-700 dark:text-indigo-400">
        Manage Bookings
      </h1>

      <div className="flex items-center justify-end mb-4">
        <Popover>
          <PopoverTrigger className="border rounded-2xl p-2 border-cyan-300 text-base cursor-pointer">
            Filter by room name:{" "}
            <span className="font-semibold">{selectedRoom || "All"}</span>
          </PopoverTrigger>
          <PopoverContent className="max-h-60 overflow-y-auto w-48 p-2 bg-white">
            <Button
              onClick={() => setSelectedRoom("")}
              className={`block w-full text-left px-3 py-1 rounded-md mb-2 ${
                selectedRoom === ""
                  ? "bg-indigo-600 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              All Rooms
            </Button>
            {uniqueRooms.map((room) => (
              <Button
                key={room}
                onClick={() => setSelectedRoom(room)}
                className={`block w-full text-left px-3 py-1 rounded-md mb-1 ${
                  selectedRoom === room
                    ? "bg-indigo-600 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {room}
              </Button>
            ))}
          </PopoverContent>
        </Popover>
      </div>

      <p className="text-black bg-indigo-100 p-2 rounded-lg mb-4 w-fit">
        Total bookings: {bookings.length}
      </p>

      <div className="flex flex-wrap justify-center gap-3">
        {statusTabs.map((status) => (
          <button
            key={status}
            onClick={() => setActiveStatus(status)}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition ${
              activeStatus === status
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center items-center space-x-2 text-indigo-600">
          <ArrowPathIcon className="w-6 h-6 animate-spin" />
          <span>Loading bookings...</span>
        </div>
      )}

      {!loading && currentBookings.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No bookings found.
        </p>
      )}

      {!loading &&
        currentBookings.map((booking) => (
          <BookingCard
            key={booking.id}
            booking={booking}
            showActions={booking.status === "pending"}
            onApprove={() => updateStatus(booking.id, "approved")}
            onReject={(reason) => updateStatus(booking.id, "rejected", reason)}
            loading={updating}
          />
        ))}

      {!loading && totalPages > 1 && (
        <Pagination
          aria-label="Pagination Navigation"
          className="mt-8 bg-white dark:bg-gray-800 rounded-md p-3 shadow-md flex items-center justify-center gap-4"
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
    </div>
  );
};

export default ManageBookings;
