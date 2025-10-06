import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "./ui/card.jsx";

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

function BookingTrendsChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchBookingTrends() {
      try {
        // ✅ Last 30 days calculation
        const today = new Date();
        const priorDate = new Date();
        priorDate.setDate(today.getDate() - 30);

        const toDate = today.toISOString().slice(0, 10);
        const fromDate = priorDate.toISOString().slice(0, 10);

        const params = new URLSearchParams({
          from: fromDate,
          to: toDate,
          filter: "day", // explicitly request daily grouping
        });

        const token = localStorage.getItem("token");

        const res = await fetch(
          `http://localhost:8080/api/admin/dashboard/booking-trends?${params.toString()}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch booking trends");

        const result = await res.json();

        // ✅ Map the result so `date` is available for chart
        const transformed = result.map(item => ({
          date: item.period, // make sure your API returns 'period' as 'YYYY-MM-DD'
          totalbookings: item.totalbookings,
        }));

        setData(transformed);
      } catch (err) {
        console.error("Error fetching booking trends:", err);
        setData([]);
      }
    }

    fetchBookingTrends();
  }, []);

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
              tickFormatter={(dateStr) =>
                format(parseISO(dateStr), "MMM d")
              }
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

            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                borderRadius: "8px",
                border: "none",
              }}
              labelFormatter={(label) => format(parseISO(label), "PPP")}
              itemStyle={{ color: "#818cf8", fontWeight: "600" }}
            />

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

const BookingTrend = () => {
  return <BookingTrendsChart />;
};

export default BookingTrend;
