// Edit.jsx
import React, { useState, useEffect } from "react";
import { Input } from "../../components/ui/input.jsx";
import { Label } from "../../components/ui/label.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "../../components/ui/alert_dialog.jsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover.jsx";
import { Calendar } from "../../components/ui/calendar.jsx";
import { ChevronDownIcon } from "lucide-react";

function formatDateForDisplay(dateString) {
  // dateString should be "YYYY-MM-DD" or an ISO date
  const date = new Date(dateString);
  if (isNaN(date)) return "";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const Edit = ({ booking, onClose, onSave }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    console.log("[Edit] mounted");
    return () => {
      console.log("[Edit] unmounted");
    };
  }, []);

  useEffect(() => {
    console.log("[Edit] booking prop changed:", booking);
    if (booking) {
      setStartDate(booking.start_date ? booking.start_date.split("T")[0] : "");
      setEndDate(booking.end_date ? booking.end_date.split("T")[0] : "");
      setPhoneNumber(booking.phone_number || "");
    }
  }, [booking]);

  console.log("[Edit] rendering with booking id:", booking?.id);

  const handleSubmit = async (e) => {
    console.log("[handleSubmit] called");
    e.preventDefault();
    console.log("[handleSubmit] preventDefault called?", e.defaultPrevented);

    if (!startDate || !endDate) {
      console.log("[handleSubmit] missing start or end date");
      toast.error("Start and End dates are required");
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      console.log("[handleSubmit] invalid date range");
      toast.error("End date must be after or equal to Start date");
      return;
    }

    if (phoneNumber) {
      const cleaned = phoneNumber.replace(/\D/g, "");
      if (cleaned.length !== 10) {
        console.log("[handleSubmit] invalid phone number");
        toast.error("Phone number must be exactly 10 digits");
        return;
      }
    }

    console.log("[handleSubmit] Calling onSave...");
    await onSave({
      start_date: startDate,
      end_date: endDate,
      phone_number: phoneNumber,
    });
    console.log("[handleSubmit] onSave complete");

    console.log("[handleSubmit] Calling onClose...");
    onClose();
    console.log("[handleSubmit] onClose called");
  };

  if (!booking) return null;

  return (
    <AlertDialog
      open={true}
      onOpenChange={(isOpen) => {
        console.log("[AlertDialog] onOpenChange:", isOpen);
        if (!isOpen) onClose();
      }}
    >
      <AlertDialogContent className="bg-white dark:bg-zinc-900 p-6 rounded-lg max-w-md w-full shadow-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-semibold mb-4">
            Edit Booking
          </AlertDialogTitle>
        </AlertDialogHeader>

        <AlertDialogDescription asChild>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Start Date */}
            <div>
              <Label htmlFor="start_date" className="block mb-1 font-medium">
                📅 Start Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    className="flex justify-between items-center w-full px-4 py-2 border border-cyan-500 rounded-md
                      text-cyan-700 font-medium shadow-sm
                      hover:bg-cyan-50 hover:border-cyan-600
                      focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-1
                      transition-colors duration-200"
                  >
                    {startDate
                      ? formatDateForDisplay(startDate)
                      : "Select Start Date"}
                    <ChevronDownIcon className="w-5 h-5 text-cyan-600 ml-2" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="mt-1 bg-white dark:bg-zinc-700 border border-cyan-200 rounded-lg shadow-lg p-4">
                  <Calendar
                    mode="single"
                    captionLayout="dropdown"
                    selected={startDate ? new Date(startDate) : undefined}
                    onSelect={(date) => {
                      if (date) {
                        const iso = date.toISOString();
                        setStartDate(iso);
                        if (endDate && new Date(endDate) < new Date(iso)) {
                          setEndDate(iso);
                        }
                      }
                    }}
                    disabled={(date) => date < new Date().setHours(0, 0, 0, 0)}
                    className="
                      bg-white text-black rounded-lg
                      [&_button]:rounded-md [&_button]:p-2 [&_button]:transition-colors
                      [&_button:hover]:bg-cyan-100 [&_button:hover]:text-cyan-900
                      [&_button:focus-visible]:ring-2 [&_button:focus-visible]:ring-cyan-400
                      [&_button[data-selected]]:bg-cyan-600 [&_button[data-selected]]:text-white
                      [&_button[data-selected]]:shadow-md
                      [&_button[disabled]]:opacity-40 [&_button[disabled]]:cursor-not-allowed
                    "
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* End Date */}
            <div>
              <Label htmlFor="end_date" className="block mb-1 font-medium">
                📅 End Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    className="flex justify-between items-center w-full px-4 py-2 border border-cyan-500 rounded-md
                      text-cyan-700 font-medium shadow-sm
                      hover:bg-cyan-50 hover:border-cyan-600
                      focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-1
                      transition-colors duration-200"
                  >
                    {endDate ? formatDateForDisplay(endDate) : "Select End Date"}
                    <ChevronDownIcon className="w-5 h-5 text-cyan-600 ml-2" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="mt-1 bg-white dark:bg-zinc-700 border border-cyan-200 rounded-lg shadow-lg p-4">
                  <Calendar
                    mode="single"
                    captionLayout="dropdown"
                    selected={endDate ? new Date(endDate) : undefined}
                    onSelect={(date) => {
                      if (date) {
                        const iso = date.toISOString();
                        setEndDate(iso);
                      }
                    }}
                    disabled={(date) => {
                      if (!startDate) return true;
                      return date < new Date(startDate);
                    }}
                    className="
                      bg-white text-black rounded-lg
                      [&_button]:rounded-md [&_button]:p-2 [&_button]:transition-colors
                      [&_button:hover]:bg-cyan-100 [&_button:hover]:text-cyan-900
                      [&_button:focus-visible]:ring-2 [&_button:focus-visible]:ring-cyan-400
                      [&_button[data-selected]]:bg-cyan-600 [&_button[data-selected]]:text-white
                      [&_button[data-selected]]:shadow-md
                      [&_button[disabled]]:opacity-40 [&_button[disabled]]:cursor-not-allowed
                    "
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Phone Number */}
            <div>
              <Label htmlFor="phone" className="block mb-1 font-medium">
                📞 Phone Number
              </Label>
               <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ padding: "0 8px" }}>+91</span>
              <Input
                type="tel"
                id="phone"
                value={phoneNumber}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  setPhoneNumber(val.slice(0, 10));
                }}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Optional (10 digits)"
                maxLength={10}
              />
            </div>
            </div>
            

            <AlertDialogFooter className="flex justify-end gap-3 pt-4">
              <AlertDialogCancel asChild>
                <Button
                  type="button"
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                  onClick={onClose}
                >
                  Cancel
                </Button>
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button
                  type="submit"
                  className="px-4 py-2 rounded bg-yellow-500 text-white hover:bg-yellow-600"
                >
                  Save
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </AlertDialogDescription>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Edit;
