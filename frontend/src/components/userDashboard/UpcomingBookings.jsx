import BookingCard from "./BookingCard";

const UpcomingBookings = ({ bookings = [] }) => {
  const today = new Date();

  const filtered = bookings.filter((b) => {
    const start = new Date(b.start_date);

    return start > today && (b.status === "pending" || b.status === "approved");
  }); 

  if (filtered.length === 0) {
    return (
      <p className="text-center text-gray-400 mt-6">
        No upcoming pending bookings.
      </p>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {filtered.map((b) => (
        <BookingCard key={b.id} booking={b} />
      ))}
    </div>
  );
};

export default UpcomingBookings;
