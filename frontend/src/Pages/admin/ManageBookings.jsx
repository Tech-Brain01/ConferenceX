import { useEffect, useState } from "react";
import BookingCard from "../../components/BookingCard.jsx";
import { toast } from "sonner";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

const statusTabs = ["all", "pending", "approved", "rejected", "cancelled"];

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [activeStatus, setActiveStatus] = useState("all");
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

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

      setBookings(data.bookings);
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
    fetchBookings(activeStatus);
  }, [activeStatus]);

  return (
    <div className="p-6">
   
        <h1 className="text-4xl font-bold mb-10 text-center  text-indigo-700 dark:text-indigo-400">
          Manage Bookings
        </h1>
     

      {/* Status Filter Buttons */}
      <div className="flex flex-wrap justify-center mb-8 gap-3 mt-7">
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

      {!loading && bookings.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No bookings found.
        </p>
      )}

      {!loading &&
        bookings.map((booking) => (
          <BookingCard
            key={booking.id}
            booking={booking}
            showActions={booking.status === "pending"}
            onApprove={() => updateStatus(booking.id, "approved")}
            onReject={(reason) => updateStatus(booking.id, "rejected", reason)}
            loading={updating}
          />
        ))}
    </div>
  );
};

export default ManageBookings;
