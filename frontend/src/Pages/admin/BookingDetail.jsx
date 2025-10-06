import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const BookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);

  const fetchDetail = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:8080/api/bookings/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setBooking(data);
  };

 


  useEffect(() => {
    fetchDetail();
  }, []);

  if (!booking) return <p>Loading...</p>;

  return (
    <div className=" p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-2">Booking #{booking.id}</h2>
      <p><strong>User:</strong> {booking.user_name}</p>
      <p><strong>Room:</strong> {booking.room_name}</p>
      <p><strong>Date:</strong> {booking.date}</p>
      <p><strong>Status:</strong> {booking.status}</p>

      <div className="mt-4 flex gap-3">
        <button
          className="bg-green-600 px-4 py-1 text-white rounded"
          onClick={() => updateStatus("approved")}
        >
          Approve
        </button>
        <button
          className="bg-red-600 px-4 py-1 text-white rounded"
          onClick={() => updateStatus("rejected")}
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default BookingDetail;
