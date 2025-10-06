import React, { useState, useEffect } from "react";
import { Label } from "./ui/label.jsx";
import { Button } from "./ui/Button.jsx";
import { toast } from "sonner";

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
      firstDayOfWeek.setDate(today.getDate() - today.getDay()); // Sunday start of week
      fromDate = formatDate(firstDayOfWeek);
      toDate = formatDate(today);
      break;
    case "month":
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      fromDate = formatDate(firstDayOfMonth);
      toDate = formatDate(today);
      break;
    default:
      fromDate = "";
      toDate = "";
  }

  return { fromDate, toDate };
}

const DateFilter = ({ onApply, defaultFrom, defaultTo, defaultFilter }) => {
  const [quickFilter, setQuickFilter] = useState(defaultFilter || "custom");
  const [fromDate, setFromDate] = useState(defaultFrom || "");
  const [toDate, setToDate] = useState(defaultTo || "");

  // When quickFilter changes (via dropdown), update dates accordingly
  useEffect(() => {
    if (quickFilter !== "custom") {
      const dates = getDateStringsForQuickFilter(quickFilter);
      setFromDate(dates.fromDate);
      setToDate(dates.toDate);
    }
  }, [quickFilter]);

  const handleFromDateChange = (e) => {
    setFromDate(e.target.value);
    setQuickFilter("custom");
  };

  const handleToDateChange = (e) => {
    setToDate(e.target.value);
    setQuickFilter("custom");
  };

  const handleApply = () => {
    if (!fromDate || !toDate) {
      toast.error("Please select both From and To dates.");
      return;
    }
    if (fromDate > toDate) {
      toast.error("From date cannot be later than To date.");
      return;
    }
    onApply(fromDate, toDate);
  };

  return (
    <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1rem" }}>
      <select value={quickFilter} onChange={(e) => setQuickFilter(e.target.value)}>
        <option value="custom">Custom Range</option>
        <option value="today">Today</option>
        <option value="week">This Week</option>
        <option value="month">This Month</option>
      </select>

      <Label>
        From:{" "}
        <input type="date" value={fromDate} onChange={handleFromDateChange} />
      </Label>

      <Label>
        To:{" "}
        <input type="date" value={toDate} onChange={handleToDateChange} />
      </Label>

      <Button onClick={handleApply}>Apply</Button>
    </div>
  );
};

export default DateFilter;
