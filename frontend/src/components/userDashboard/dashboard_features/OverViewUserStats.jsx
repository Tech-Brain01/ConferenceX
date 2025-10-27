import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "../../ui/card.jsx";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import {
  CalendarDaysIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/solid";
import { format } from "date-fns";

import { MdCurrencyRupee } from "react-icons/md";

const bookingData = [
  { value: 11 },
  { value: 25 },
  { value: 35 },
  { value: 70 },
  { value: 80 },
  { value: 75 },
  { value: 60 },
  { value: 40 },
];

function TotalUserBookingsCard({ totaluserbookings }) {
  return (
    <Card className="w-full rounded-2xl shadow-lg border-0 text-white bg-gradient-to-r from-indigo-600 to-indigo-800">
      <CardContent className="p-6 h-44 flex flex-col justify-between">
        <div className="flex items-center gap-4">
          <CalendarDaysIcon className="h-7 w-7 text-white/90" />
          <div>
            <h3 className="text-base font-semibold opacity-90 uppercase tracking-wide">
              Total Bookings Made
            </h3>
            <p className="text-3xl font-extrabold">{totaluserbookings}</p>
            <p className="text-green-300 text-xs mt-1 font-medium">
              +17% from last month
            </p>
          </div>
        </div>
        <div className="h-24 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={bookingData}>
              <Area
                type="basis"
                dataKey="value"
                stroke="#818CF8"
                strokeWidth={2}
                fill="rgba(129, 140, 248, 0.3)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

const revenueData = [
  { value: 10 },
  { value: 50 },
  { value: 5 },
  { value: 90 },
  { value: 85 },
  { value: 94 },
  { value: 60 },
  { value: 20 },
];

function TotalRevenueCard({ totalamountspend }) {
  return (
    <Card className="w-full rounded-2xl shadow-lg border-0 text-white bg-gradient-to-r from-blue-600 to-blue-800">
      <CardContent className="p-6 h-44 flex flex-col justify-between">
        <div className="flex items-center gap-4">
          <MdCurrencyRupee className="h-7 w-7 text-white/90" />
          <div>
            <h3 className="text-base font-semibold opacity-90 uppercase tracking-wide">
              Total Amount Spend
            </h3>
            <p className="text-3xl font-extrabold">₹{totalamountspend}</p>
            <p className="text-green-300 text-xs mt-1 font-medium">
              +15% from last month
            </p>
          </div>
        </div>
        <div className="h-24 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
              <Area
                type="natural"
                dataKey="value"
                stroke="#93c5fd"
                strokeWidth={2}
                fill="rgba(147, 197, 253, 0.3)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

const OverViewUserStats = ({ filterDate }) => {
  const [stats, setStats] = useState({
    totaluserbookings: 0,
    totalamountspend: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const token = localStorage.getItem("token");

        const from = filterDate?.fromDate
          ? format(filterDate.fromDate, "yyyy-MM-dd")
          : null;
        const to = filterDate?.toDate
          ? format(filterDate.toDate, "yyyy-MM-dd")
          : null;

        let url = `http://localhost:8080/api/user/dashboard/stats`;

        if (from && to) {
          url += `?from=${encodeURIComponent(from)}&to=${encodeURIComponent(
            to
          )}`;
        }
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      }
    }
    fetchStats();
  }, [filterDate]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      <TotalUserBookingsCard totaluserbookings={stats.totaluserbookings} />
      <TotalRevenueCard totalamountspend={stats.totalamountspend} />
    </div>
  );
};

export default OverViewUserStats;
