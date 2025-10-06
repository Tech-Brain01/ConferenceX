import React, { useState } from "react";
import { BackgroundGradient } from "./ui/background-gradient";
import {
  CheckCircleIcon,
  XCircleIcon,
  UserIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "../components/ui/alert_dialog.jsx";

const formatDate = (isoDate) => {
  const d = new Date(isoDate);
  return d.toLocaleDateString("en-GB");
};

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-200 text-green-800",
  rejected: "bg-red-100 text-red-800",
  cancelled: "bg-red-200 text-red-900",
};

const paymentColors = {
  paid: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  unpaid: "bg-yellow-100 text-yellow-700",
};

const BookingCard = ({
  booking,
  showActions,
  onApprove,
  onReject,
  loading,
}) => {
  const [rejectReason, setRejectReason] = useState("");
  const [rejectLoading, setRejectLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) {
      alert("Please provide a reason for rejection.");
      return;
    }

    setRejectLoading(true);
    try {
      await onReject(rejectReason);
      setOpen(false);
      setRejectReason("");
    } catch (error) {
      alert("Failed to reject booking.");
    } finally {
      setRejectLoading(false);
    }
  };

  return (
    <div className="p-5">
      <BackgroundGradient className="rounded-2xl shadow-lg bg-white dark:bg-zinc-900 hover:shadow-2xl transition duration-300 ease-in-out">
        <div className="flex flex-col sm:flex-row gap-6 items-center w-full p-5 bg-slate-200">
          
          {/* Image Section */}
          <div className="w-full sm:w-[180px] flex-shrink-0 overflow-hidden rounded-xl">
            <img
              src={`http://localhost:8080/uploads/${booking.room_image}`}
              alt={booking.room_name}
              className="w-full h-40 sm:h-28 object-cover rounded-xl transform hover:scale-105 transition duration-300 ease-in-out"
            />
          </div>

          {/* User Info */}
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            <h3 className="text-xl font-semibold text-zinc-900 truncate">
              Room Name: {booking.room_name}
            </h3>
            <div className="flex flex-wrap gap-6 mt-1 text-md text-zinc-700 ">
              <div className="flex items-center gap-1 whitespace-nowrap ">
                <UserIcon className="w-5 h-5 text-red-900" />
                <span>{booking.user_name}</span>
              </div>
              <div className="flex items-center gap-1 whitespace-nowrap">
                <span>📧 {booking.email}</span>
              </div>
              <div className="flex items-center gap-1 whitespace-nowrap">
                <PhoneIcon className="w-5 h-5 text-amber-700" />
                <span>+91{booking.phone_number}</span>
              </div>
            </div>

            {/* Dates */}
            <div className="flex flex-wrap gap-4 mt-3 text-md text-zinc-900 ">
              <div className="flex items-center gap-1">
                <CalendarIcon className="w-5 h-5 text-green-900" />
                <span>
                  <strong className="text-green-900">Start:</strong>{" "}
                  {formatDate(booking.start_date)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <CalendarIcon className="w-5 h-5 text-red-950" />
                <span>
                  <strong className="text-red-950">End:</strong>{" "}
                  {formatDate(booking.end_date)}
                </span>
              </div>
            </div>

            {/* Status & Payment */}
            <div className="flex flex-wrap gap-4 mt-3 text-yellow-800">
              <span
                className={`inline-block px-3 py-1 rounded-full font-semibold text-xs uppercase ${
                  statusColors[booking.status]
                }`}
              >
                {booking.status}
              </span>
              <span
                className={`inline-block px-3 py-1 rounded-full font-semibold text-xs uppercase ${
                  paymentColors[booking.payment_status]
                }`}
              >
                <CurrencyDollarIcon className="inline-block w-4 h-4 mr-1 text-yellow-600" />{" "}
                {booking.payment_status}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          {showActions && (
            <div className="flex gap-3 mt-4 sm:mt-0 sm:flex-col sm:justify-center">
              <button
                onClick={onApprove}
                disabled={loading}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-semibold transition"
                aria-label="Approve Booking"
              >
                <CheckCircleIcon className="w-5 h-5" />
                Approve
              </button>
              <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogTrigger asChild>
                  <button
                    disabled={loading}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-semibold transition"
                    aria-label="Reject Booking"
                  >
                    Reject
                  </button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reject Booking</AlertDialogTitle>
                    <AlertDialogDescription>
                      Please provide a reason for rejecting this booking.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <textarea
                    rows={4}
                    className="w-full border border-gray-300 rounded p-2 mt-4 mb-6 resize-none"
                    placeholder="Enter rejection reason"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    disabled={rejectLoading}
                  />

                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={rejectLoading}>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleRejectSubmit}
                      disabled={rejectLoading}
                    >
                      {rejectLoading ? "Rejecting..." : "Reject"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      </BackgroundGradient>
    </div>
  );
};

export default BookingCard;
