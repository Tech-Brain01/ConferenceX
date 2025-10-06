import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "./ui/card.jsx";
import DateFilter from "./DateFilter.jsx";
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



const Monthly_Revenue = ({ data, filter }) => (
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
            tickFormatter={(d) => formatPeriod(d, filter)}
            tick={{ fontSize: 12 }}
            minTickGap={10}
          />
          <YAxis />
          <Tooltip
            labelFormatter={(label) => formatPeriod(label, filter)}
            formatter={(value) => [`₹${value}`, "Revenue"]}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="totalrevenue"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

const Revenue_by_room = ({ data }) => (
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
          <Tooltip formatter={(value) => [`₹${value}`, "Revenue"]} />
          <Bar dataKey="totalrevenue" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

const Revenue_loss = ({ revenueLoss }) => (
  <Card className="shadow-lg bg-white p-6 text-center">
    <CardTitle className="text-lg font-semibold text-gray-800 mb-2">
      Revenue Lost Due to Cancellations
    </CardTitle>
    <p className="text-3xl font-bold text-red-500">₹{revenueLoss.toFixed(2)}</p>
  </Card>
);

const RevenueAnalytics = () => {
  const defaultFilter = "week";
  const { fromDate: defaultFrom, toDate: defaultTo } = getDateStringsForQuickFilter(defaultFilter);

  const [filter, setFilter] = useState(defaultFilter);
  const [revenueTrendData, setRevenueTrendData] = useState([]);
  const [revenueByRoomData, setRevenueByRoomData] = useState([]);
  const [revenueLoss, setRevenueLoss] = useState(0);

  const [loadingTrend, setLoadingTrend] = useState(false);
  const [loadingByRoom, setLoadingByRoom] = useState(false);
  const [loadingLoss, setLoadingLoss] = useState(false);

  const fetchRevenueTrends = async (from, to, filterVal = filter) => {
    setLoadingTrend(true);
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({ from, to, filter: filterVal });
      const res = await fetch(`http://localhost:8080/api/admin/dashboard/revenue?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch revenue trends");

      const result = await res.json();
      setRevenueTrendData(result);
    } catch (error) {
      console.error(error);
      setRevenueTrendData([]);
    } finally {
      setLoadingTrend(false);
    }
  };

  const fetchRevenueByRoom = async () => {
    setLoadingByRoom(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8080/api/admin/dashboard/revenue-by-room`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch revenue by room");

      const result = await res.json();
      setRevenueByRoomData(result);
    } catch (error) {
      console.error(error);
      setRevenueByRoomData([]);
    } finally {
      setLoadingByRoom(false);
    }
  };

  const fetchRevenueLoss = async () => {
    setLoadingLoss(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8080/api/admin/dashboard/revenue-loss`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch revenue loss");

      const result = await res.json();
    console.log("Revenue loss response:", result); 

    setRevenueLoss(Number(result.revenueloss) || 0);
    } catch (error) {
      console.error(error);
      setRevenueLoss(0);
    } finally {
      setLoadingLoss(false);
    }
  };

  const handleApplyFilter = (from, to, selectedFilter = defaultFilter) => {
    setFilter(selectedFilter);
    fetchRevenueTrends(from, to, selectedFilter);
    fetchRevenueByRoom();
    fetchRevenueLoss();
  };

  useEffect(() => {
    handleApplyFilter(defaultFrom, defaultTo, defaultFilter);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-indigo-700 mb-2">💰 Revenue Analytics</h1>
          <p className="text-gray-600">Track your revenue trends and losses with clarity.</p>
        </div>

        <div className="mb-8 flex justify-center">
          <DateFilter
            onApply={handleApplyFilter}
            defaultFrom={defaultFrom}
            defaultTo={defaultTo}
            defaultFilter={defaultFilter}
          />
        </div>

        {loadingTrend ? (
          <p className="text-center text-gray-500">Loading revenue trends...</p>
        ) : (
          <Monthly_Revenue data={revenueTrendData} filter={filter} />
        )}

        {loadingByRoom ? (
          <p className="text-center text-gray-500">Loading revenue by room...</p>
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
