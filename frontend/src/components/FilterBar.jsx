import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Label } from "./ui/label";
import { Button } from "./ui/Button";

const FilterBar = ({ onApply }) => {
  const defaultFromDate = new Date();
  defaultFromDate.setDate(1); 
  const defaultToDate = new Date(); 

  const [fromDate, setFromDate] = useState(defaultFromDate);
  const [toDate, setToDate] = useState(defaultToDate);


  useEffect(() => {
    onApply(defaultFromDate, defaultToDate);
  }, []);

  const handleReset = () => {
    setFromDate(defaultFromDate);
    setToDate(defaultToDate);
    onApply(defaultFromDate, defaultToDate);
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
