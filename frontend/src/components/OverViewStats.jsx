import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "./ui/card.jsx";
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

function TotalBookingsCard({ totalbookings }) {
  return (
    <Card className="w-full rounded-2xl shadow-lg border-0 text-white bg-gradient-to-r from-indigo-600 to-indigo-800">
      <CardContent className="p-6 h-44 flex flex-col justify-between">
        <div className="flex items-center gap-4">
          <CalendarDaysIcon className="h-7 w-7 text-white/90" />
          <div>
            <h3 className="text-base font-semibold opacity-90 uppercase tracking-wide">
              Total Bookings
            </h3>
            <p className="text-3xl font-extrabold">{totalbookings}</p>
            <p className="text-green-300 text-xs mt-1 font-medium">
              +20% from last month
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

function TotalRevenueCard({ totalrevenue }) {
  return (
    <Card className="w-full rounded-2xl shadow-lg border-0 text-white bg-gradient-to-r from-blue-600 to-blue-800">
      <CardContent className="p-6 h-44 flex flex-col justify-between">
        <div className="flex items-center gap-4">
          <MdCurrencyRupee className="h-7 w-7 text-white/90" />
          <div>
            <h3 className="text-base font-semibold opacity-90 uppercase tracking-wide">
              Total Revenue
            </h3>
            <p className="text-3xl font-extrabold">₹{totalrevenue}</p>
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

const roomData = [
  { value: 30 },
  { value: 45 },
  { value: 38 },
  { value: 50 },
  { value: 42 },
  { value: 60 },
  { value: 55 },
  { value: 58 },
];

function TotalRoomCard({ totalroom }) {
  return (
    <Card className="w-full rounded-2xl shadow-lg border-0 text-white bg-gradient-to-r from-yellow-500 to-yellow-700">
      <CardContent className="p-6 h-44 flex flex-col justify-between">
        <div className="flex items-center gap-4">
          <BuildingOfficeIcon className="h-7 w-7 text-white/90" />
          <div>
            <h3 className="text-base font-semibold opacity-90 uppercase tracking-wide">
              Total Rooms
            </h3>
            <p className="text-3xl font-extrabold">{totalroom}</p>
          </div>
        </div>
        <div className="h-24 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={roomData}>
              <Area
                type="natural"
                dataKey="value"
                stroke="#fde047"
                strokeWidth={2}
                fill="rgba(253, 224, 71, 0.3)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

const OverViewStats = ({ filterDate }) => {
  const [stats, setStats] = useState({
    totalbookings: 0,
    totalrevenue: 0,
    totalroom: 0,
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

        let url = `http://localhost:8080/api/admin/dashboard/stats`;

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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      <TotalBookingsCard totalbookings={stats.totalbookings} />
      <TotalRevenueCard totalrevenue={stats.totalrevenue} />
      <TotalRoomCard totalroom={stats.totalroom} />
    </div>
  );
};

export default OverViewStats;
