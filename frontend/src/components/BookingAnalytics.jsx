import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card.jsx";
import DateFilter from "./DateFilter.jsx";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";

import { format, addDays, startOfWeek, parseISO } from "date-fns";

function getDateFromWeek(year, week) {
  const jan4 = new Date(year, 0, 4);
  const startOfIsoWeek = startOfWeek(jan4, { weekStartsOn: 1 });

  return addDays(startOfIsoWeek, (week - 1) * 7);
}

function getDateStringsForQuickFilter(filter) {
  const today = new Date();
  let fromDate, toDate;

  const formatDate = (date) => date.toISOString().slice(0, 10);

  switch (filter) {
    case "today":
      fromDate = toDate = formatDate(today);
      break;
    case "week":
      const firstDayOfWeek = new Date(today);
      firstDayOfWeek.setDate(today.getDate() - today.getDay());
      fromDate = formatDate(firstDayOfWeek);
      toDate = formatDate(today);
      break;
    case "month":
      const firstDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );
      fromDate = formatDate(firstDayOfMonth);
      toDate = formatDate(today);
      break;
    default:
      fromDate = "";
      toDate = "";
  }

  return { fromDate, toDate };
}

const formatPeriod = (period, filter) => {
  if (!period) return "";

  try {
    if (filter === "day") {
      return format(parseISO(period), "dd MMM yyyy");
    }

    if (filter === "week") {
      const weekMatch = period.match(/^(\d{4})-?W?(\d{1,2})$/);
      if (weekMatch) {
        const year = Number(weekMatch[1]);
        const week = Number(weekMatch[2]);

        const date = getDateFromWeek(year, week);
        return format(date, "dd MMM yyyy");
      }

      return period;
    }

    if (filter === "month") {
      const [year, month] = period.split("-");
      if (!year || !month) return period;
      const date = new Date(year, Number(month) - 1);
      return format(date, "MMM yyyy");
    }

    return format(parseISO(period), "dd MMM yyyy");
  } catch {
    return period;
  }
};

function Booking_Over_Time({ data, filter }) {
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
              tickFormatter={(d) => formatPeriod(d, filter)}
              tick={{ fontSize: 12 }}
              minTickGap={10}
            />
            <YAxis />
            <Tooltip
              labelFormatter={(label) => formatPeriod(label, filter)}
              formatter={(value) => [`${value}`, "Bookings"]}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="bookings"
              stroke="#6366f1"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function CancelledVsApprovedBarChart({ data, filter }) {
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
              tickFormatter={(d) => formatPeriod(d, filter)}
              tick={{ fontSize: 12 }}
              minTickGap={10}
            />
            <YAxis />
            <Tooltip
              labelFormatter={(label) => formatPeriod(label, filter)}
              formatter={(value, name) => [value, name]} 
            />

            <Legend />
            <Bar dataKey="approvedbooking" fill="#10b981" name="Approved" />
            <Bar dataKey="cancelledbooking" fill="#ef4444" name="Cancelled" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

const BookingAnalytics = () => {
  const defaultFilter = "week";
  const { fromDate: defaultFrom, toDate: defaultTo } =
    getDateStringsForQuickFilter(defaultFilter);

  const [filter, setFilter] = useState(defaultFilter);
  const [bookingTrendData, setBookingTrendData] = useState([]);
  const [bookingTrendLoading, setBookingTrendLoading] = useState(false);

  const [cancelApprovedData, setCancelApprovedData] = useState([]);
  const [cancelApprovedLoading, setCancelApprovedLoading] = useState(false);

  const fetchBookingTrends = async (from, to, filterVal = filter) => {
    setBookingTrendLoading(true);
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({ from, to, filter: filterVal });
      const res = await fetch(
        `http://localhost:8080/api/admin/dashboard/booking-trends?${params.toString()}`,
         {
            headers: { Authorization: `Bearer ${token}` },
          }
      );
      if (!res.ok) throw new Error("Failed to fetch booking trends");

      const result = await res.json();
      const formatted = result.map((item) => ({
        date: item.period,
        bookings: item.totalbookings,
      }));

      setBookingTrendData(formatted);
    } catch (error) {
      console.error(error);
      setBookingTrendData([]);
    } finally {
      setBookingTrendLoading(false);
    }
  };

  const fetchCancelledApprovedTrend = async (from, to, filterVal = filter) => {
    setCancelApprovedLoading(true);
    try {
       const token = localStorage.getItem("token");
      const params = new URLSearchParams({ from, to, filter: filterVal });
      const res = await fetch(
        `http://localhost:8080/api/admin/dashboard/cancel-approved-trend?${params.toString()}`,
         {
            headers: { Authorization: `Bearer ${token}` },
          }
      );
      if (!res.ok) throw new Error("Failed to fetch cancel/approve trends");

      const result = await res.json();
      setCancelApprovedData(result);
    } catch (error) {
      console.error(error);
      setCancelApprovedData([]);
    } finally {
      setCancelApprovedLoading(false);
    }
  };

  const handleApplyFilter = (from, to, selectedFilter = defaultFilter) => {
    setFilter(selectedFilter);
    fetchBookingTrends(from, to, selectedFilter);
    fetchCancelledApprovedTrend(from, to, selectedFilter);
  };

  useEffect(() => {
    handleApplyFilter(defaultFrom, defaultTo, defaultFilter);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-indigo-700 mb-2">
            📊 Booking Analytics
          </h1>
          <p className="text-gray-600">
            Track and visualize your bookings with clarity.
          </p>
        </div>

        <div className="mb-8 flex justify-center">
          <DateFilter
            onApply={handleApplyFilter}
            defaultFrom={defaultFrom}
            defaultTo={defaultTo}
            defaultFilter={defaultFilter}
          />
        </div>

        <div className="space-y-12">
          {bookingTrendLoading ? (
            <p className="text-center text-gray-500">
              Loading booking trends...
            </p>
          ) : (
            <Booking_Over_Time data={bookingTrendData} filter={filter} />
          )}

          {cancelApprovedLoading ? (
            <p className="text-center text-gray-500">
              Loading cancelled vs approved chart...
            </p>
          ) : (
            <CancelledVsApprovedBarChart
              data={cancelApprovedData}
              filter={filter}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingAnalytics;
