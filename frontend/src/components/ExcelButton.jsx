import { format } from "date-fns";
import React from "react";

export const DownloadDashboardExcelButton = ({ filterDate }) => {
  const handleDownload = async () => {
    try {
      const token = localStorage.getItem("token");

      const from = filterDate?.fromDate
        ? format(filterDate.fromDate, "yyyy-MM-dd")
        : null;
      const to = filterDate?.toDate
        ? format(filterDate.toDate, "yyyy-MM-dd")
        : null;

      let url = `http://localhost:8080/api/admin/dashboard/export-excel-dashboard`;
      if (from && to) {
        url += `?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const blob = await response.blob();

      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `dashboard-data-${from || "start"}-to-${to || "end"}.xlsx`;
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download file.");
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
    >
      Download Excel
    </button>
  );
};

export const DownloadBookingAnalyticsExcelButton = ({ filterDate }) => {
  const handleDownload = async () => {
    try {
      const token = localStorage.getItem("token");

      const from = filterDate?.fromDate
        ? format(filterDate.fromDate, "yyyy-MM-dd")
        : null;
      const to = filterDate?.toDate
        ? format(filterDate.toDate, "yyyy-MM-dd")
        : null;

      let url = `http://localhost:8080/api/admin/dashboard/export-excel-booking-analytics`;
      if (from && to) {
        url += `?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const blob = await response.blob();

      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `booking-analytics-data-${from || "start"}-to-${
        to || "end"
      }.xlsx`;
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download file.");
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
    >
      Download Excel
    </button>
  );
};

export const DownloadRevenueAnalyticsExcelButton = ({ filterDate }) => {
  const handleDownload = async () => {
    try {
      const token = localStorage.getItem("token");

      const from = filterDate?.fromDate
        ? format(filterDate.fromDate, "yyyy-MM-dd")
        : null;
      const to = filterDate?.toDate
        ? format(filterDate.toDate, "yyyy-MM-dd")
        : null;

      let url = `http://localhost:8080/api/admin/dashboard/export-excel-revenue-analytics`;
      if (from && to) {
        url += `?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const blob = await response.blob();

      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `revenue-analytics-data-${from || "start"}-to-${
        to || "end"
      }.xlsx`;
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(downloadUrl);

      console.log("Token:", token);
      console.log("From:", from, "To:", to);
      console.log("URL:", url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download file.");
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
    >
      Download Excel
    </button>
  );
};
