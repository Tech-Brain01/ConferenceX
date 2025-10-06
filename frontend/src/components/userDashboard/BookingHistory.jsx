import React from "react";
import BookingCard from "./BookingCard";

const BookingHistory = ({ bookings = [], onEdit, onCancel, onPay }) => {
  const today = new Date();

  const filtered = bookings.filter((b) => {
    const end = new Date(b.end_date);
    return (
      end < today &&
      ["cancelled", "rejected", "completed"].includes(b.status)
    );
  });

  if (filtered.length === 0) {
    return <p className="text-center text-gray-400 mt-6">No booking history found.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {filtered.map((b) => (
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

export default BookingHistory;
