import { useEffect, useState } from "react";
import OverViewStats from "../../components/OverViewStats.jsx";
import BookedRoomsStats from "../../components/BookedRoomsStats.jsx";
import UpcomingBookings from "../../components/UpcomingBookings.jsx";
import BookingTrend from "../../components/BookingTrend.jsx";
import FilterBar from "../../components/FilterBar.jsx";
import {DownloadDashboardExcelButton} from "../../components/ExcelButton.jsx";

const Dashboard = () => {
  const getDefaultFromDate = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );
    const getDefaultToDate = new Date();
  
    const [filterDate, setFilterDate] = useState({
      fromDate: getDefaultFromDate,
      toDate: getDefaultToDate,
    });
  

  const handleApplyFilter = (fromDate, toDate) => {
    setFilterDate({ fromDate, toDate });
    // console.log("filtered applied:", fromDate, toDate);
  };
  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <header className="mb-8">
        <DownloadDashboardExcelButton filterDate={filterDate} />

        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Overview
        </h1>
        <div className="mt-10 flex items-center justify-center">
         <FilterBar
            onApply={handleApplyFilter}
            initialFromDate={filterDate.fromDate}
            initialToDate={filterDate.toDate}
          />
        </div>
      </header>

      <section className="mb-12">
        <OverViewStats filterDate={filterDate} />
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-6 mt-6 text-gray-800">
          Booked Rooms Stats
        </h2>
        <BookedRoomsStats filterDate={filterDate} />
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-6 mt-6 text-gray-800">Upcoming Bookings</h2>
        <UpcomingBookings filterDate={filterDate} />
      </section> 

      <section className="mb-12 ">
        <h2 className="text-xl font-semibold mb-6 mt-6 text-gray-800">Booking Trend Chart</h2>
        <BookingTrend filterDate={filterDate}  />
      </section>
    </div>
  );
};

export default Dashboard;
