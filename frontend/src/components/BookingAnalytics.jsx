import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card.jsx";
import FilterBar from "./FilterBar.jsx";
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
import { DownloadBookingAnalyticsExcelButton } from "./ExcelButton.jsx";

function Booking_Over_Time({ data }) {
  const BookingTrendTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const { bookings, bookingRefs, roomNames, userNames } =
        payload[0].payload;
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
          <p>
            <strong>Users:</strong> {userNames || "N/A"}
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
            <Tooltip content={<BookingTrendTooltip />} />

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

function CancelledVsApprovedBarChart({ data }) {
  const CancelledApprovedTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const {
        approvedbooking,
        cancelledbooking,
        bookingRefs,
        roomNames,
        userNames,
      } = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded shadow-lg max-w-sm text-sm">
          <p className="font-semibold mb-2">{formatPeriod(label)}</p>
          <p>
            <strong>Total Approve:</strong> {approvedbooking}
          </p>
          <p>
            <strong>Total Cancel:</strong> {cancelledbooking}
          </p>
          <p>
            <strong>Booking Refs:</strong> {bookingRefs || "N/A"}
          </p>
          <p>
            <strong>Rooms:</strong> {roomNames || "N/A"}
          </p>
          <p>
            <strong>Users:</strong> {userNames || "N/A"}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="shadow-lg bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">
          Cancelled vs Approved Bookings
        </CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="period"
              stroke="#8021EC"
              axisLine={{ stroke: "#F96E05" }}
              tickFormatter={(dateStr) => format(parseISO(dateStr), "MMM-d ")}
              tick={{ fontSize: 12 }}
            />
            <YAxis axisLine={{ stroke: "#F96E05" }} />
            <Tooltip content={<CancelledApprovedTooltip />} />
            <Legend />
            <Bar dataKey="approvedbooking" fill="#10b981" name="Approved" />
            <Bar dataKey="cancelledbooking" fill="#ef4444" name="Cancelled" />
          </BarChart>
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

const BookingAnalytics = () => {
  const [bookingTrendData, setBookingTrendData] = useState([]);
  const [bookingTrendLoading, setBookingTrendLoading] = useState(false);
  const [cancelApprovedData, setCancelApprovedData] = useState([]);
  const [cancelApprovedLoading, setCancelApprovedLoading] = useState(false);
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
    console.log("filtered applied:", fromDate, toDate);
  };

  useEffect(() => {
    async function fetchBookingTrends() {
      setBookingTrendLoading(true);
      try {
        const token = localStorage.getItem("token");
        const from = filterDate?.fromDate
          ? format(filterDate.fromDate, "yyyy-MM-dd")
          : null;
        const to = filterDate?.toDate
          ? format(filterDate.toDate, "yyyy-MM-dd")
          : null;

        let url = `http://localhost:8080/api/admin/dashboard/booking-trends`;
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

        const transformed = result.map((item) => ({
          date: item.period,
          bookings: item.total_bookings,
          bookingRefs: item.booking_refs,
          roomNames: item.room_names,
          userNames: item.user_names,
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

  useEffect(() => {
    async function fetchCancelledApprovedData() {
      setCancelApprovedLoading(true);
      try {
        const token = localStorage.getItem("token");
        const from = filterDate?.fromDate
          ? format(filterDate.fromDate, "yyyy-MM-dd")
          : null;
        const to = filterDate?.toDate
          ? format(filterDate.toDate, "yyyy-MM-dd")
          : null;

        let url = `http://localhost:8080/api/admin/dashboard/cancel-approved-trend`;
        if (from && to)
          url += `?from=${encodeURIComponent(from)}&to=${encodeURIComponent(
            to
          )}`;

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-type": "application/json",
          },
        });

        if (!res.ok) throw new Error("failed to fetch booking trends");
        const result = await res.json();

        const transformed = result.map((item) => ({
          period: item.period,
          approvedbooking: item.approvedbooking,
          cancelledbooking: item.cancelledbooking,
          bookings: item.total_bookings,
          bookingRefs: item.booking_refs,
          roomNames: item.room_names,
          userNames: item.user_names,
        }));

        setCancelApprovedData(transformed);
      } catch (err) {
        console.error(err);
        setCancelApprovedData([]);
      } finally {
        setCancelApprovedLoading(false);
      }
    }
    fetchCancelledApprovedData();
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
          <DownloadBookingAnalyticsExcelButton filterDate={filterDate}/>
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
            <Booking_Over_Time data={bookingTrendData} />
          )}

          {cancelApprovedLoading ? (
            <p className="text-center text-gray-500">
              Loading cancelled vs approved chart...
            </p>
          ) : (
            <CancelledVsApprovedBarChart data={cancelApprovedData} />
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingAnalytics;
