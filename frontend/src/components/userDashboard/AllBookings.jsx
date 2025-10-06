import React from "react";
import BookingCard from "./BookingCard";

const AllBookings = ({ bookings = [], onCancel, onEdit, onPay }) => {
  if (!bookings.length) {
    return (
      <p className="text-center text-gray-400 mt-10">No bookings found.</p>
    );
  }

  return (
    <div className="p-6 ">
    
        {bookings.map((booking) => (
          <BookingCard
            key={booking.id}
            booking={booking}
            onCancel={onCancel}
            onEdit={onEdit}
            onPay={onPay}
          />
        ))}
     
    </div>
  );
};

export default AllBookings;
