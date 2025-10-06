import BookingCard from "./BookingCard";

const PaymentBookings = ({ bookings }) => {
  const unpaid = bookings.filter(b => b.payment_status === "unpaid" && b.status === "approved");

  const handlePay = (booking) => {
    alert(`Redirect to payment for booking ${booking.id}`);
  };

  if (!unpaid.length) return <p>All bookings are paid.</p>;

  return (
    <div>
      {unpaid.map((b) => (
        <BookingCard key={b.id} booking={b} onPay={handlePay} />
      ))}
    </div>
  );
};

export default PaymentBookings;
