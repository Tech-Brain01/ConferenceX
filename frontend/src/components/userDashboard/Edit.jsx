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
  const date = new Date(dateString);
  if (isNaN(date)) return "";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDateForBackend(date) {
  return new Date(date).toLocaleDateString("en-CA");
}

const Edit = ({ booking, onClose, onSave }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    if (booking) {
      setStartDate(booking.start_date?.split("T")[0] || "");
      setEndDate(booking.end_date?.split("T")[0] || "");
      setPhoneNumber(booking.phone_number || "");
    }
  }, [booking]);

  if (!booking) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      toast.error("Start and End dates are required");
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      toast.error("End date must be after or equal to Start date");
      return;
    }

    if (phoneNumber && phoneNumber.replace(/\D/g, "").length !== 10) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }

    await onSave({
      start_date: formatDateForBackend(startDate),
      end_date: formatDateForBackend(endDate),
      phone_number: phoneNumber,
    });

    onClose();
  };

  return (
    <AlertDialog open>
      <AlertDialogContent className="bg-white dark:bg-zinc-900 p-6 rounded-lg max-w-md w-full shadow-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-semibold mb-4">
            ✏️ Edit Booking
          </AlertDialogTitle>
        </AlertDialogHeader>

        <AlertDialogDescription asChild>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Start Date */}
            <div>
              <Label className="block mb-1 font-medium">📅 Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    className="flex justify-between items-center w-full px-4 py-2 border border-cyan-500 rounded-md text-cyan-700 font-medium"
                  >
                    {startDate
                      ? formatDateForDisplay(startDate)
                      : "Select Start Date"}
                    <ChevronDownIcon className="w-5 h-5 text-cyan-600 ml-2" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="mt-1 p-4 rounded-lg bg-white">
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
        bg-white text-cyan-800 rounded-lg
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
              <Label className="block mb-1 font-medium">📅 End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    className="flex justify-between items-center w-full px-4 py-2 border border-cyan-500 rounded-md text-cyan-700 font-medium"
                  >
                    {endDate
                      ? formatDateForDisplay(endDate)
                      : "Select End Date"}
                    <ChevronDownIcon className="w-5 h-5 text-cyan-600 ml-2" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="mt-1 p-4 rounded-lg bg-white">
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
        bg-white text-cyan-800 rounded-lg
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
              <Label className="block mb-1 font-medium">📞 Phone Number</Label>
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ padding: "0 8px" }}>+91</span>
              <Input
                type="tel"
                value={phoneNumber}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/\D/g, "");
                  setPhoneNumber(cleaned.slice(0, 10));
                }}
                  maxLength={10}
                  required
                  style={{ flex: 1 }}
                placeholder="Optional (10 digits)"
              />
            </div>
            </div>
            {/* Footer */}
            <AlertDialogFooter className="pt-4 flex justify-end gap-3">
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
