import React from "react";

const AdminPayment = ({ booking, onEdit, onCancel, onPay }) => {
  if (!booking) {
    return (
      <div className="p-5 text-center text-gray-500">
        No booking data found
      </div>
    );
  }

  // ========== UTILITIES ==========

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return "N/A";

    return date.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Days calculation
  const getDays = () => {
    if (!booking.start_date || !booking.end_date) return null;

    const s = new Date(booking.start_date);
    const e = new Date(booking.end_date);

    if (isNaN(s) || isNaN(e)) return null;

    return Math.floor((e - s) / (1000 * 60 * 60 * 24)) + 1;
  };

  const days = getDays();

  // Price * days calculation
  const calculatedAmount =
    booking.price && days ? booking.price * days : null;

  // ========== STATUS COLORS ==========

  const statusColors = {
    pending: "bg-yellow-300 text-yellow-900",
    approved: "bg-green-600 text-white",
    rejected: "bg-red-600 text-white",
    cancelled: "bg-red-800 text-white",
    completed: "bg-gray-700 text-white",
  };

  const paymentColors = {
    paid: "bg-green-600 text-white",
    unpaid: "bg-red-600 text-white",
    pending: "bg-yellow-300 text-yellow-900",
  };

  // ========== PAY BUTTON LOGIC ==========
  // Show Pay button for ANY unpaid booking that is pending OR approved
  const canPay =
    booking.payment_status?.toLowerCase() !== "paid" &&
    ["approved", "pending"].includes(booking.status?.toLowerCase());

  // ========== SAFE IMAGE ==========
  const imageUrl = booking.room_image
    ? `http://localhost:8080/uploads/${encodeURIComponent(
        booking.room_image
      )}`
    : "/no-image.png";

  return (
    <div className="p-5">
      <div className="flex flex-col sm:flex-row gap-6 items-center w-full p-5 bg-slate-200 rounded-xl shadow">
        
        {/* ROOM IMAGE */}
        <div className="w-full sm:w-[180px] overflow-hidden rounded-xl border">
          <img
            src={imageUrl}
            alt={booking.room_name || "Room"}
            className="w-full h-40 object-cover rounded-xl"
          />
        </div>

        {/* ===== INFO SECTION ===== */}
        <div className="flex-1 space-y-3 text-sm text-zinc-800">

          <h2 className="text-2xl font-semibold text-zinc-900">
            {booking.room_name || "Room"}
          </h2>

          {/* BOOKING REF */}
          <p className="text-gray-600">
            Booking Ref:{" "}
            <span className="font-mono font-semibold">
              {booking.booking_ref}
            </span>
          </p>

          {/* DATES & PRICE */}
          <div className="flex flex-wrap gap-3">
            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
              Start: {formatDate(booking.start_date)}
            </span>

            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full">
              End: {formatDate(booking.end_date)}
            </span>

            {booking.price && (
              <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
                ₹{booking.price}/day
              </span>
            )}

            {days && (
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                Days: {days}
              </span>
            )}

            {calculatedAmount && (
              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                Base Amount: ₹{calculatedAmount}
              </span>
            )}
          </div>

          {/* STATUS BADGES */}
          <div className="flex flex-wrap gap-3 mt-1">
            <span
              className={`px-3 py-1 rounded-full font-medium ${
                statusColors[booking.status?.toLowerCase()] ||
                "bg-gray-300 text-gray-700"
              }`}
            >
              Status: {booking.status}
            </span>

            <span
              className={`px-3 py-1 rounded-full font-medium ${
                paymentColors[booking.payment_status?.toLowerCase()] ||
                "bg-gray-300 text-gray-700"
              }`}
            >
              Payment: {booking.payment_status}
            </span>
          </div>
        </div>

        {/* ===== ACTION BUTTONS ===== */}
        <div className="flex flex-col gap-2">

          {/* EDIT */}
          {onEdit && booking.status?.toLowerCase() === "pending" && (
            <button
              onClick={() => onEdit(booking)}
              className="bg-yellow-500 text-white px-4 py-1 rounded-full shadow"
            >
              ✏️ Edit
            </button>
          )}

          {/* CANCEL */}
          {onCancel && booking.status?.toLowerCase() === "pending" && (
            <button
              onClick={() => onCancel(booking)}
              className="bg-red-600 text-white px-4 py-1 rounded-full shadow"
            >
              🗑️ Cancel
            </button>
          )}

          {/* PAY BUTTON */}
          {onPay && canPay && (
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
