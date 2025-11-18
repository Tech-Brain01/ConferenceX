import React, { useState, useEffect } from "react";
import {
   Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from "../../ui/table.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card.jsx";
import { format, parseISO } from "date-fns";
import FilterBar from "../../FilterBar.jsx";

function PaymentHistory() {
  const [PaymentHistoryData, setPaymentHistoryData] = useState([]);
  const [PaymentHistoryLoading, setPaymentHistoryLoading] = useState(false);

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
  };

 const formatPeriod = (period) => {
  try {
    return format(parseISO(period), "MMM dd, yyyy hh:mm a"); 
  } catch {
    return period;
  }
};


  useEffect(() => {
    async function fetchPaymentHistory() {
      setPaymentHistoryLoading(true);
      try {
        const token = localStorage.getItem("token");
        const from = filterDate?.fromDate
          ? format(filterDate.fromDate, "yyyy-MM-dd")
          : null;
        const to = filterDate?.toDate
          ? format(filterDate.toDate, "yyyy-MM-dd")
          : null;

        let url = `http://localhost:8080/api/user/dashboard/payment-history`;
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

        if (!res.ok) throw new Error("Failed to fetch payment history");

        const result = await res.json();
        console.log(result);
        setPaymentHistoryData(result);
      } catch (err) {
        console.error(err);
        setPaymentHistoryData([]);
      } finally {
        setPaymentHistoryLoading(false);
      }
    }
    fetchPaymentHistory();
  }, [filterDate]);

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-indigo-700 mb-2">
            Payment History
          </h1>
          <p className="text-gray-600">Track Your payment History</p>
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
            {PaymentHistoryLoading ? (
              <p className="text-center text-gray-500 py-4">
                Loading feedback...
              </p>
            ) : (
              <Table className="min-w-full border-collapse">
                <TableHeader>
                  <TableRow className="bg-indigo-100">
                    <TableHead>sr no</TableHead>
                    <TableHead>Booking_ref</TableHead>
                    <TableHead>transaction_ref</TableHead>
                    <TableHead>Room Name</TableHead>
                    <TableHead>Total Amt Paided</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Payment Made</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {PaymentHistoryData.length > 0 ? (
                    PaymentHistoryData.map((his, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell>{his.booking_ref || "N/A"}</TableCell>
                        <TableCell>{his.transaction_ref || "N/A"}</TableCell>
                        <TableCell>{his.room_name || "N/A"}</TableCell>
                        <TableCell>{his.total_amount || "N/A"}</TableCell>
                        <TableCell>{his.method || "N/A"}</TableCell>
                        <TableCell>
                          {his.date ? formatPeriod(his.date) : "N/A"}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-4 text-gray-500"
                      >
                        No Payment History found.
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

export default PaymentHistory;
