import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "../../ui/table";
import { Card, CardHeader, CardContent, CardTitle } from "../../ui/card";
import { format, parseISO } from "date-fns";
import FilterBar from "../../FilterBar.jsx";
import InvoicePDF from "./InvoicePDF.jsx";

function Invoices() {
  const [downloadInvoiceData, setDownloadInvoiceData] = useState([]);
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

  useEffect(() => {
    async function fetchInvoices() {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const from = filterDate?.fromDate ? format(filterDate.fromDate, "yyyy-MM-dd") : null;
        const to = filterDate?.toDate ? format(filterDate.toDate, "yyyy-MM-dd") : null;

        let url = `http://localhost:8080/api/user/dashboard/download-invoices`;
        if (from && to) url += `?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Failed to fetch invoices");
        const result = await res.json();
        setDownloadInvoiceData(result);
      } catch (err) {
        console.error(err);
        setDownloadInvoiceData([]);
      } finally {
        setLoading(false);
      }
    }
    fetchInvoices();
  }, [filterDate]);

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-indigo-700 mb-2">Download Invoice</h1>
          <p className="text-gray-600">View and Download Your Invoices</p>
          <div className="mt-10 flex items-center justify-center">
            <FilterBar
              onApply={handleApplyFilter}
              initialFromDate={filterDate.fromDate}
              initialToDate={filterDate.toDate}
            />
          </div>
        </header>

        <Card className="p-6 bg-white shadow-lg rounded-xl border border-gray-200 mt-10">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              Invoice History
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            {loading ? (
              <p className="text-center text-gray-500 py-4">Loading...</p>
            ) : (
              <Table className="min-w-full border-collapse">
                <TableHeader>
                  <TableRow className="bg-indigo-100">
                    <TableHead>Sr No</TableHead>
                    <TableHead>Invoice Number</TableHead>
                    <TableHead>Room Name</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Tax</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {downloadInvoiceData.length > 0 ? (
                    downloadInvoiceData.map((iv, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell>{iv.invoices_number}</TableCell>
                        <TableCell>{iv.room_name}</TableCell>
                        <TableCell>{format(parseISO(iv.issue_date), "MMM dd, yyyy")}</TableCell>
                        <TableCell>{format(parseISO(iv.due_date), "MMM dd, yyyy")}</TableCell>
                        <TableCell>₹{iv.total_amount}</TableCell>
                        <TableCell>₹{iv.tax}</TableCell>
                        <TableCell>
                          <InvoicePDF invoice={iv} />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan="8" className="text-center py-4 text-gray-500">
                        No invoices found.
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

export default Invoices;
