import React from "react";

const AdminPayment = ({ booking, onEdit, onCancel, onPay }) => {
  if (!booking) {
    return (
      <div className="p-5 text-center text-gray-500">
        No booking data found
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date)
      ? "N/A"
      : date.toLocaleDateString("en-GB", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
  };

  const statusColors = {
    pending: "bg-yellow-300 text-yellow-900",
    approved: "bg-green-600 text-white",
    rejected: "bg-red-600 text-white",
    cancelled: "bg-red-800 text-white",
    completed: "bg-gray-600 text-white",
  };

  const paymentColors = {
    paid: "bg-green-600 text-white",
    unpaid: "bg-red-600 text-white",
    pending: "bg-yellow-300 text-yellow-900",
  };

  const showPayButtonStatuses = ["approved"];

  return (
    <div className="p-5">
      <div className="flex flex-col sm:flex-row gap-6 items-center w-full p-5 bg-slate-200 rounded-xl shadow">
        {/* Room Image */}
        <div className="w-full sm:w-[180px] overflow-hidden rounded-xl">
          <img
            src={`http://localhost:8080/uploads/${encodeURIComponent(
              booking.room_image
            )}`}
            alt={booking.room_name}
            className="w-full h-40 object-cover rounded-xl"
          />
        </div>

        {/* Info Section */}
        <div className="flex-1 space-y-2 text-sm text-zinc-800">
          <h2 className="text-xl font-semibold text-zinc-900">
            {booking.room_name}
          </h2>

          <p className="text-gray-500">
            Booking Ref: <span className="font-mono">{booking.booking_ref}</span>
          </p>

          <div className="flex flex-wrap gap-2">
            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
              Start: {formatDate(booking.start_date)}
            </span>

            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full">
              End: {formatDate(booking.end_date)}
            </span>

            {booking.price && (
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                ₹{booking.price}/day
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            <span
              className={`px-3 py-1 rounded-full font-medium ${
                statusColors[booking.status.toLowerCase()]
              }`}
            >
              Status: {booking.status}
            </span>

            <span
              className={`px-3 py-1 rounded-full font-medium ${
                paymentColors[booking.payment_status.toLowerCase()]
              }`}
            >
              Payment: {booking.payment_status}
            </span>
          </div>
        </div>

        {/* Buttons Section */}
        <div className="flex flex-col gap-2">
          {onEdit && booking.status.toLowerCase() === "pending" && (
            <button
              onClick={() => onEdit(booking)}
              className="bg-yellow-500 text-white px-4 py-1 rounded-full shadow"
            >
              ✏️ Edit
            </button>
          )}

          {onCancel && booking.status.toLowerCase() === "pending" && (
            <button
              onClick={() => onCancel(booking)}
              className="bg-red-600 text-white px-4 py-1 rounded-full shadow"
            >
              🗑️ Cancel
            </button>
          )}

          {onPay &&
            booking.payment_status.toLowerCase() !== "paid" &&
            showPayButtonStatuses.includes(booking.status.toLowerCase()) && (
              <button
                onClick={() => onPay(booking)}
                className="bg-green-600 text-white px-4 py-1 rounded-full shadow"
              >
                💳 Pay
              </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default AdminPayment;
