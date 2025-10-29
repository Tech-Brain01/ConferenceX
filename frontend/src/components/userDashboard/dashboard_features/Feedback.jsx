import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "../../ui/table.jsx";
import { Card, CardContent, CardHeader } from "../../ui/card.jsx";
import { format, parseISO } from "date-fns";
import FilterBar from "../../FilterBar.jsx";

function Feedback() {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(false);

  const getDefaultFromDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const getDefaultToDate = new Date();

  const [filterDate, setFilterDate] = useState({
    fromDate: getDefaultFromDate,
    toDate: getDefaultToDate,
  });

  const handleApplyFilter = (fromDate, toDate) => {
    setFilterDate({ fromDate, toDate });
  };

  const formatPeriod = (period) => {
    try {
      return format(parseISO(period), "MMM dd, yyyy");
    } catch {
      return period;
    }
  };

  useEffect(() => {
    async function fetchFeedbackStats() {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");

        const from = format(filterDate.fromDate, "yyyy-MM-dd");
        const to = format(filterDate.toDate, "yyyy-MM-dd");

        let url = `http://localhost:8080/api/user/dashboard/all-feedback`;
             if (from && to) url += `?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Failed to fetch feedbacks");

        const data = await res.json();
        setFeedback(data);
      } catch (err) {
        console.error("Failed to fetch feedbacks:", err);
        setFeedback([]);
      } finally {
        setLoading(false);
      }
    }

    fetchFeedbackStats();
  }, [filterDate]);

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-indigo-700 mb-2">Feedback</h1>
          <p className="text-gray-600">View your Feedbacks</p>
          <div className="mt-10 flex items-center justify-center">
            <FilterBar
              onApply={handleApplyFilter}
              initialFromDate={filterDate.fromDate}
              initialToDate={filterDate.toDate}
            />
          </div>
        </header>

        <Card className="p-6 bg-white shadow-lg rounded-xl border border-gray-200 mt-10">
          <CardHeader />
          <CardContent className="overflow-x-auto">
            {loading ? (
              <p className="text-center text-gray-500 py-4">Loading feedback...</p>
            ) : (
              <Table className="min-w-full border-collapse">
                <TableHeader>
                  <TableRow className="bg-indigo-100">
                    <TableHead>Sr No</TableHead>
                    <TableHead>Room Name</TableHead>
                    <TableHead>Posted At</TableHead>
                    <TableHead>Feedback</TableHead>
                    <TableHead>Rating</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feedback.length > 0 ? (
                    feedback.map((b, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{b.room_name || "N/A"}</TableCell>
                        <TableCell>{formatPeriod(b.period)}</TableCell>
                        <TableCell>{b.feedbacks || "N/A"}</TableCell>
                        <TableCell>{b.avg_rating || "N/A"}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan="5" className="text-center py-4 text-gray-500">
                        No feedback found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Feedback;
