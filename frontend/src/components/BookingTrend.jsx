import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card.jsx";

import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { format, parseISO } from "date-fns";

function BookingTrendsChart({ filterDate }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchBookingTrends() {
      try {
        const token = localStorage.getItem("token");

        const from = filterDate?.fromDate
          ? format(filterDate.fromDate, "yyyy-MM-dd")
          : null;
        const to = filterDate?.toDate
          ? format(filterDate.toDate, "yyyy-MM-dd")
          : null;

        let url = `http://localhost:8080/api/admin/dashboard/booking-trends`;

        if (from && to) {
          url += `?from=${encodeURIComponent(from)}&to=${encodeURIComponent(
            to
          )}`;
        }
        const res = await fetch(
          url,

          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch booking trends");

        const result = await res.json();
        console.log("API result:", result);
        const transformed = result.map((item) => ({
          date: item.period || "",
          totalbookings: item.total_bookings || 0,
          roomNames: item.room_names || "N/A",
        }));

        setData(transformed);
      } catch (err) {
        console.error("Error fetching booking trends:", err);
        setData([]);
      }
    }
    fetchBookingTrends();
  }, [filterDate]);

  const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const { totalbookings, roomNames } = payload[0].payload;
    return (
      <div className="bg-violet-300 text-black p-3 border rounded shadow-lg max-w-sm text-sm">
        <p className="font-semibold mb-2">{formatPeriod(label)}</p>
        <p className="text-base font-bold"><strong className="text-sm font-semibold text-amber-900 ">Total Bookings:</strong> {totalbookings}</p>
        <p className="text-base font-bold"><strong className="text-sm font-semibold text-amber-900 ">Rooms:</strong> {roomNames || "N/A"}</p>
      </div>
    );
  }
  return null;
};

  return (
    <Card className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white rounded-xl shadow-lg mt-10 p-4">
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 20, bottom: 40 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#818cf8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />

            <XAxis
              dataKey="date"
              stroke="#c7d2fe"
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: "#c7d2fe" }}
              tickLine={false}
              tickFormatter={(dateStr) => format(parseISO(dateStr), "MMM d")}
              label={{
                value: "Date",
                position: "bottom",
                offset: 20,
                fill: "#a5b4fc",
                fontSize: 14,
                fontWeight: "600",
              }}
            />

            <YAxis
              stroke="#c7d2fe"
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: "#c7d2fe" }}
              tickLine={false}
              label={{
                value: "Total Bookings",
                angle: -90,
                position: "insideLeft",
                offset: 10,
                fill: "#a5b4fc",
                fontSize: 14,
                fontWeight: "600",
              }}
            />

            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="totalbookings"
              stroke="#6366f1"
              fill="url(#colorValue)"
              strokeWidth={2}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
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

const BookingTrend = ({ filterDate }) => {
  return <BookingTrendsChart filterDate={filterDate} />;
};

export default BookingTrend;
