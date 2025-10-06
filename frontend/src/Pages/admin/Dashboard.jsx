import OverViewStats from "../../components/OverViewStats.jsx";
import BookedRoomsStats from "../../components/BookedRoomsStats.jsx";
import UpcomingBookings from "../../components/UpcomingBookings.jsx";
import BookingTrend from "../../components/BookingTrend.jsx";





const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Overview
        </h1>
      </header>

      <section className="mb-12">
        <OverViewStats />
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-6 mt-6 text-gray-800">Booked Rooms Stats</h2>
        <BookedRoomsStats />
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-6 mt-6 text-gray-800">Upcoming Bookings</h2>
        <UpcomingBookings />
      </section>

      <section className="mb-12 ">
        <h2 className="text-xl font-semibold mb-6 mt-6 text-gray-800">Booking Trend Chart (Last 30 days)</h2>
        <BookingTrend />
      </section>
    </div>
  );
};

export default Dashboard;
