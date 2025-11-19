import React, { useEffect, useState } from "react";
import AdminPayment from "../../components/AdminPayment";
import AdminPaymentTable from "../../components/AdminPaymentTable";
import { toast } from "sonner";
import axios from "axios";

const ManualBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch bookings
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:8080/api/admin/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        if (res.status === 401) toast.error("Unauthorized: Admin login required");
        throw new Error("Failed to fetch bookings");
      }

      const data = await res.json();
      setBookings(Array.isArray(data.bookings) ? data.bookings : []);
    } catch (err) {
      console.error(err);
      toast.error("Error loading bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Show pending OR approved AND unpaid
  const paymentBooking = bookings.find(
    (b) =>
      b.payment_status?.toLowerCase() !== "paid" &&
      ["approved", "pending"].includes(b.status?.toLowerCase())
  );

  // Placeholder Edit handler
  const handleEdit = (booking) => {
    console.log("Edit booking:", booking);
    toast.info("Edit booking feature coming soon");
  };

  // Placeholder cancel handler
  const handleCancel = (booking) => {
    console.log("Cancel booking:", booking);
    toast.info("Cancel feature coming soon");
  };

  // Payment Handler
  const handlePayment = async (booking) => {
    try {
      const token = localStorage.getItem("token");

      // Optimistic update
      setBookings((prev) =>
        prev.map((b) =>
          b.id === booking.id ? { ...b, payment_status: "paid" } : b
        )
      );

      const res = await axios.patch(
        `http://localhost:8080/api/admin/${booking.id}/payment`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(
        `Payment successful: ₹${res.data.paymentDetails.totalAmount}`
      );

      fetchBookings(); // sync
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Payment failed");

      // revert
      setBookings((prev) =>
        prev.map((b) =>
          b.id === booking.id ? { ...b, payment_status: "unpaid" } : b
        )
      );
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Loading bookings...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Payment Request Card */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          Payment Requests
        </h2>

        {paymentBooking ? (
          <AdminPayment
            booking={paymentBooking}
            onEdit={handleEdit}
            onCancel={handleCancel}
            onPay={handlePayment}
          />
        ) : (
          <p className="text-gray-500">No pending payment requests</p>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          Bookings Made
        </h2>

        <AdminPaymentTable />
      </div>
    </div>
  );
};

export default ManualBooking;
