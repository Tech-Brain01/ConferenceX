import React, { useEffect, useState } from "react";
import {
  LineChart,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format, parseISO } from "date-fns";
import FilterBar from "../../FilterBar.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card.jsx";

function User_Booking_Over_Time({ data }) {
  const UserBookingTrendTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const { bookings, bookingRefs, roomNames } = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded shadow-lg max-w-sm text-sm">
          <p className="font-semibold mb-2">{formatPeriod(label)}</p>
          <p>
            <strong>Total Bookings:</strong> {bookings}
          </p>
          <p>
            <strong>Booking Refs:</strong> {bookingRefs || "N/A"}
          </p>
          <p>
            <strong>Rooms:</strong> {roomNames || "N/A"}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="shadow-lg mb-8 bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">
          Booking Over Time
        </CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              stroke="#8021EC"
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: "#F96E05" }}
              tickLine={false}
              tickFormatter={(dateStr) => format(parseISO(dateStr), "MMM-d ")}
            />
            <YAxis
              stroke="#8021EC"
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: "#F96E05" }}
              tickLine={false}
              label={{
                value: "Total Bookings",
                angle: -90,
                position: "insideLeft",
                offset: 10,
                fill: "#5C0CB6",
                fontSize: 14,
                fontWeight: "600",
              }}
            />
            <Tooltip content={<UserBookingTrendTooltip />} />

            <Legend />
            <Line
              type="monotone"
              dataKey="bookings"
              stroke="#6366f1"
              strokeWidth={2}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

const formatPeriod = (period) => {
  try {
    return format(parseISO(period), "MMM dd, yyyy");
  } catch {
    return period;
  }
};

const BookingTrend = () => {
  const [bookingTrendData, setBookingTrendData] = useState([]);
  const [bookingTrendLoading, setBookingTrendLoading] = useState(false);

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
    //  console.log("filtered applied:", fromDate, toDate);
  };

  useEffect(() => {
    async function fetchBookingTrends() {
      setBookingTrendLoading(true);
      try {
        const token = localStorage.getItem("token");
        // console.log(token)
        const from = filterDate?.fromDate
          ? format(filterDate.fromDate, "yyyy-MM-dd")
          : null;
        const to = filterDate?.toDate
          ? format(filterDate.toDate, "yyyy-MM-dd")
          : null;

        let url = `http://localhost:8080/api/user/dashboard/booking-stats`;
        if (from && to)
          url += `?from=${encodeURIComponent(from)}&to=${encodeURIComponent(
            to
          )}`;

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Failed to fetch booking trends");
        

        const result = await res.json();
        // console.log("API result:", result);

        const transformed = result.map((item) => ({
          date: item.period,
          bookings: item.total_bookings,
          bookingRefs: item.booking_refs,
          roomNames: item.room_names,
        }));

        setBookingTrendData(transformed);
      } catch (err) {
        console.error(err);
        setBookingTrendData([]);
      } finally {
        setBookingTrendLoading(false);
      }
    }
    fetchBookingTrends();
  }, [filterDate]);

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-indigo-700 mb-2">
            📊 Booking Analytics
          </h1>
          <p className="text-gray-600">
            Track and visualize your bookings with clarity.
          </p>
          <div className="mt-10 flex items-center justify-center">
            <FilterBar
              onApply={handleApplyFilter}
              initialFromDate={filterDate.fromDate}
              initialToDate={filterDate.toDate}
            />
          </div>
        </header>

        <div className="space-y-12">
          {bookingTrendLoading ? (
            <p className="text-center text-gray-500">
              Loading booking trends...
            </p>
          ) : (
            <User_Booking_Over_Time data={bookingTrendData} />
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingTrend;
