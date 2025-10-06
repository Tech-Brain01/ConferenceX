import React from "react";
import BookingCard from "./BookingCard";

const CancelledBookings = ({ bookings = [], onEdit, onCancel, onPay }) => {
  const cancelled = bookings.filter((b) => b.status === "cancelled");

  if (cancelled.length === 0)
    return <p className="text-center text-gray-400 mt-6">No cancelled bookings found.</p>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {cancelled.map((b) => (
        <BookingCard
          key={b.id}
          booking={b}
          onEdit={onEdit}
          onCancel={onCancel}
          onPay={onPay}
        />
      ))}
    </div>
  );
};

export default CancelledBookings;
