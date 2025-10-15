import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card.jsx";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format, parseISO } from "date-fns";
import FilterBar from "./FilterBar.jsx";
import { DownloadRevenueAnalyticsExcelButton } from "./ExcelButton.jsx";

function Revenue_over_Time({ data }) {
  const RevenueTrendTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const { total_rooms, total_bookings, totalrevenue } = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded shadow-lg max-w-sm text-sm">
          <p className="font-semibold mb-2">{formatPeriod(label)}</p>
          <p>
            <strong>Total Rooms:</strong> {total_rooms}
          </p>
          <p>
            <strong>Total Booking:</strong> {total_bookings || "N/A"}
          </p>
          <p>
            <strong>Total Revenue:</strong> {totalrevenue || "N/A"}
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
          Revenue Over Time
        </CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="period"
              stroke="#8021EC"
              axisLine={{ stroke: "#F96E05" }}
              tick={{ fontSize: 12 }}
              tickLine={false}
              tickFormatter={(dateStr) => format(parseISO(dateStr), "MMM-d ")}
            />
            <YAxis
              stroke="#8021EC"
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: "#F96E05" }}
              tickLine={false}
            />
            <Tooltip content={<RevenueTrendTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="totalrevenue"
              stroke="#3b82f6"
              strokeWidth={2}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function Revenue_by_room({ data }) {
  const RevenueByRoomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const { total_bookings, totalrevenue, user_names, booking_refs } =
        payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded shadow-lg max-w-sm text-sm">
          <p className="font-semibold mb-2">{formatPeriod(label)}</p>
          <p>
            <strong>Total Booking:</strong> {total_bookings || "N/A"}
          </p>
          <p>
            <strong>Total Revenue:</strong> {totalrevenue || "N/A"}
          </p>
          <p>
            <strong>User Name:</strong> {user_names || "N/A"}
          </p>
          <p>
            <strong>Booking Refs:</strong> {booking_refs || "N/A"}
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
          Revenue by Room
        </CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 50 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" />
            <Tooltip content={<RevenueByRoomTooltip />} />
            <Bar dataKey="totalrevenue" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

const Revenue_loss = ({ revenueLoss }) => (
  <Card className="shadow-lg bg-white p-6 text-center">
    <CardTitle className="text-lg font-semibold text-gray-800 mb-2">
      Revenue Lost Due to Cancellations
    </CardTitle>
    <p className="text-3xl font-bold text-red-500">₹{revenueLoss}</p>
  </Card>
);

const formatPeriod = (period) => {
  try {
    return format(parseISO(period), "MMM dd, yyyy");
  } catch {
    return period;
  }
};

const RevenueAnalytics = () => {
  const [revenueTrendData, setRevenueTrendData] = useState([]);
  const [revenueByRoomData, setRevenueByRoomData] = useState([]);
  const [revenueLoss, setRevenueLoss] = useState(0);

  const [revenueLoadingTrend, setRevenueLoadingTrend] = useState(false);
  const [roomLoading, setroomLoading] = useState(false);
  const [loadingLoss, setLoadingLoss] = useState(false);

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

  useEffect(() => {
    async function fetchRevenueTrends() {
      setRevenueLoadingTrend(true);
      try {
        const token = localStorage.getItem("token");
        const from = filterDate?.fromDate
          ? format(filterDate.fromDate, "yyyy-MM-dd")
          : null;
        const to = filterDate?.toDate
          ? format(filterDate.toDate, "yyyy-MM-dd")
          : null;

        let url = `http://localhost:8080/api/admin/dashboard/revenue`;
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
          period: item.period,
          totalrevenue: item.totalrevenue,
          total_rooms: item.total_rooms,
          total_bookings: item.total_bookings,
        }));

        setRevenueTrendData(transformed);
      } catch (err) {
        console.error(err);
        setRevenueTrendData([]);
      } finally {
        setRevenueLoadingTrend(false);
      }
    }
    fetchRevenueTrends();
  }, [filterDate]);

  useEffect(() => {
    async function fetchRevenueByRoom() {
      setroomLoading(true);
      try {
        const token = localStorage.getItem("token");
        const from = filterDate?.fromDate
          ? format(filterDate.fromDate, "yyyy-MM-dd")
          : null;
        const to = filterDate?.toDate
          ? format(filterDate.toDate, "yyyy-MM-dd")
          : null;
        let url = `http://localhost:8080/api/admin/dashboard/revenue-by-room`;
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
          name: item.room_name,
          totalrevenue: item.totalrevenue,
          user_names: item.user_names,
          booking_refs: item.booking_refs,
          total_bookings: item.total_bookings,
        }));

        setRevenueByRoomData(transformed);
      } catch (err) {
        console.error(err);
        setRevenueByRoomData([]);
      } finally {
        setroomLoading(false);
      }
    }
    fetchRevenueByRoom();
  }, [filterDate]);

  useEffect(() => {
    async function fetchRevenueLoss() {
      setLoadingLoss(true);
      try {
        const token = localStorage.getItem("token");
        const from = filterDate?.fromDate
          ? format(filterDate.fromDate, "yyyy-MM-dd")
          : null;
        const to = filterDate?.toDate
          ? format(filterDate.toDate, "yyyy-MM-dd")
          : null;
        let url = `http://localhost:8080/api/admin/dashboard/revenue-loss`;
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
        setRevenueLoss(result.revenueloss);
      } catch (err) {
        console.error(err);
        setRevenueLoss(0);
      } finally {
        setLoadingLoss(false);
      }
    }
    fetchRevenueLoss();
  }, [filterDate]);

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-indigo-700 mb-2">
            💰 Revenue Analytics
          </h1>
          <p className="text-gray-600">
            Track your revenue trends and losses with clarity.
          </p>
          <DownloadRevenueAnalyticsExcelButton filterDate={filterDate} />
        </div>

        <div className="mb-8 flex justify-center">
          <FilterBar
            onApply={handleApplyFilter}
            initialFromDate={filterDate.fromDate}
            initialToDate={filterDate.toDate}
          />
        </div>

        {revenueLoadingTrend ? (
          <p className="text-center text-gray-500">Loading revenue trends...</p>
        ) : (
          <Revenue_over_Time data={revenueTrendData} />
        )}

        {roomLoading ? (
          <p className="text-center text-gray-500">
            Loading revenue by room...
          </p>
        ) : (
          <Revenue_by_room data={revenueByRoomData} />
        )}

        {loadingLoss ? (
          <p className="text-center text-gray-500">Loading revenue loss...</p>
        ) : (
          <Revenue_loss revenueLoss={revenueLoss} />
        )}
      </div>
    </div>
  );
};

export default RevenueAnalytics;
