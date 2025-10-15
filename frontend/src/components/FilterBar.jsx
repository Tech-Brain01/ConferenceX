import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import { Label } from "./ui/label";
import { Button } from "./ui/Button";

const FilterBar = ({ onApply, initialFromDate, initialToDate }) => {
  const [fromDate, setFromDate] = useState(initialFromDate);
  const [toDate, setToDate] = useState(initialToDate);

  const handleReset = () => {
    const defaultFrom = getDefaultFromDate;
    const defaultTo = getDefaultToDate;

    setFromDate(defaultFrom);
    setToDate(defaultTo);
    onApply(defaultFrom, defaultTo);
  };

  const handleApply = () => {
    onApply(fromDate, toDate);
  };

  return (
    <div className="flex gap-4 items-center mb-4 bg-indigo-100 p-3 rounded-xl">
      <Label className="text-base text-indigo-900">
        From:{" "}
        <DatePicker
          className="rounded-xl p-1 w-24 text-indigo-600"
          selected={fromDate}
          onChange={(date) => setFromDate(date)}
          dateFormat="d MMM yyyy"
        />
      </Label>

      <Label className="text-base text-violet-900">
        To:{" "}
        <DatePicker
          className="rounded-xl p-1 w-24 text-violet-600"
          selected={toDate}
          onChange={(date) => setToDate(date)}
          dateFormat="d MMM yyyy"
        />
      </Label>

      <Button
        className="w-fit text-sm font-semibold rounded-full"
        variant="success"
        onClick={handleApply}
      >
        Apply
      </Button>
      <Button
        className="w-fit text-sm font-semibold rounded-full"
        variant="warning"
        onClick={handleReset}
      >
        Reset
      </Button>
    </div>
  );
};

export default FilterBar;
