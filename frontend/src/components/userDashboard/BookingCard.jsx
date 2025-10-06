import { useState, useEffect } from "react";
import { BackgroundGradient } from "../ui/background-gradient.jsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog.jsx";
import { toast } from "sonner";

const BookingCard = ({ booking, onEdit, onCancel, onPay }) => {
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (dialogOpen) {
      // Reset form state when dialog opens
      setFeedbackSubmitted(false);
      setFeedbackText("");
    }
  }, [dialogOpen]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date)
      ? "N/A"
      : date.toLocaleDateString("en-GB", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
  };


  const statusColors = {
    pending:
      "bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 text-yellow-900 shadow-md",
    approved:
      "bg-gradient-to-r from-green-500 via-green-600 to-green-700 text-white shadow-lg",
    rejected:
      "bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white shadow-lg",
    cancelled:
      "bg-gradient-to-r from-red-700 via-red-800 to-red-900 text-white shadow-lg",
    completed:
      "bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 text-white shadow",
  };

  const paymentColors = {
    paid: "bg-gradient-to-r from-green-500 via-green-600 to-green-700 text-white shadow-lg",
    unpaid:
      "bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white shadow-lg",
    pending:
      "bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 text-yellow-900 shadow-md",
  };

  const showPayButtonStatuses = ["approved"];

  return (
    <div className="p-5">
      <BackgroundGradient className="rounded-2xl shadow-lg overflow-hidden bg-white dark:bg-zinc-900 transition hover:shadow-2xl duration-300 ease-in-out">
        <div className="flex flex-col sm:flex-row gap-6 items-center w-full p-5 bg-slate-200">
          {/* Image */}
          <div className="w-full sm:w-[180px] flex-shrink-0 overflow-hidden rounded-xl">
            <img
              src={`http://localhost:8080/uploads/${booking.image}`}
              alt={booking.room_name}
              className="w-full h-40 sm:h-28 object-cover rounded-xl transform hover:scale-105 transition duration-300 ease-in-out"
            />
          </div>

          {/* Content */}
          <div className="flex-1 w-full min-w-0 space-y-2 text-sm text-zinc-800 dark:text-zinc-200">
            <h2 className="text-xl font-semibold truncate text-zinc-900 ">
              {booking.room_name}
            </h2>
            <p className="text-sm text-gray-500 truncate">
              Booking Ref:{" "}
              <span className="font-mono">{booking.booking_ref || "N/A"}</span>
            </p>

            <div className="flex flex-wrap items-center gap-2 text-md">
              <span className="bg-emerald-100 text-emerald-700 font-medium px-3 py-1 rounded-full">
                Starting from: {formatDate(booking.start_date)}
              </span>
              <span className="bg-red-100 text-red-700 font-medium px-3 py-1 rounded-full">
                Ending at: {formatDate(booking.end_date)}
              </span>

              {booking.price && (
                <span className="bg-yellow-100 text-yellow-800 font-medium px-3 py-1 rounded-full">
                  Price: ₹{booking.price}/Day
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <span
                className={`relative font-medium px-3 py-1 rounded-full cursor-default ${
                  statusColors[booking.status.toLowerCase()] ||
                  "bg-gray-200 text-gray-700"
                }`}
                title={
                  booking.status.toLowerCase() === "rejected" &&
                  booking.reject_response
                    ? booking.reject_response
                    : undefined
                }
              >
                Status: {booking.status}
              </span>

              {booking.status.toLowerCase() === "rejected" &&
                booking.reject_response && (
                  <p className="mt-1 text-red-600 font-semibold text-sm">
                    Reason: {booking.reject_response}
                  </p>
                )}

              {!["rejected", "cancelled"].includes(
                booking.status.toLowerCase()
              ) && (
                <span
                  className={`font-medium px-3 py-1 rounded-full ${
                    paymentColors[booking.payment_status.toLowerCase()] ||
                    "bg-gray-200 text-gray-700"
                  }`}
                >
                  Payment: {booking.payment_status}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col items-end gap-2 sm:min-w-[140px]">
            {/* Edit Button */}
            {onEdit && booking.status.toLowerCase() === "pending" && (
              <button
                onClick={() => onEdit(booking)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded-full text-sm font-medium shadow transition"
                aria-label="Edit booking"
              >
                ✏️ Edit
              </button>
            )}

            {/* Cancel Button */}
            {onCancel && booking.status.toLowerCase() === "pending" && (
              <button
                onClick={() => onCancel(booking)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-full text-sm font-medium shadow transition"
                aria-label="Cancel booking"
              >
                🗑️ Cancel
              </button>
            )}

            {/* Pay Button */}
            {onPay &&
              booking.payment_status.toLowerCase() !== "paid" &&
              showPayButtonStatuses.includes(booking.status.toLowerCase()) && (
                <button
                  onClick={() => onPay(booking)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-full text-sm font-medium shadow transition"
                  aria-label="Pay booking"
                >
                  💳 Pay
                </button>
              )}

            {/* Feedback Dialog */}
            {booking.payment_status.toLowerCase() === "paid" && (
              <>
                {!booking.feedback ? (
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium shadow transition">
                        💬 Feedback
                      </button>
                    </DialogTrigger>

                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Leave Feedback</DialogTitle>
                        <DialogDescription>
                          Please share your experience with this booking. Your
                          feedback helps us improve.
                        </DialogDescription>
                      </DialogHeader>

                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          if (!feedbackText.trim())
                            return toast.error("Feedback cannot be empty");

                          try {
                            const res = await fetch(
                              `http://localhost:8080/api/bookings/${booking.id}/feedback`,
                              {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json",
                                  Authorization: `Bearer ${localStorage.getItem(
                                    "token"
                                  )}`,
                                },
                                body: JSON.stringify({
                                  feedback: feedbackText,
                                }),
                              }
                            );

                            const data = await res.json();
                            if (!res.ok)
                              return toast.error(
                                data.error || "Failed to submit feedback"
                              );

                            toast.success("Feedback submitted successfully!");
                            setFeedbackSubmitted(true);
                            setFeedbackText("");
                          } catch (err) {
                            console.error(err);
                            toast.error(
                              "An error occurred while submitting feedback"
                            );
                          }
                        }}
                        className="flex flex-col gap-4 mt-4"
                      >
                        <textarea
                          rows={4}
                          className="w-full border rounded-lg px-3 py-2 text-sm"
                          placeholder="Write your feedback here..."
                          value={feedbackText}
                          onChange={(e) => setFeedbackText(e.target.value)}
                          disabled={feedbackSubmitted}
                        />

                        <DialogFooter>
                          {!feedbackSubmitted && (
                            <button
                              type="submit"
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
                            >
                              Submit Feedback
                            </button>
                          )}
                        </DialogFooter>

                        {feedbackSubmitted && (
                          <p className="text-green-600 text-sm font-medium">
                            ✅ Thank you for your feedback!
                          </p>
                        )}
                      </form>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <button
                    disabled
                    className="bg-gray-400 cursor-not-allowed text-white px-4 py-1 rounded-full text-sm font-medium shadow transition"
                    title="Feedback already submitted"
                  >
                    ✅ Feedback submitted
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </BackgroundGradient>
    </div>
  );
};

export default BookingCard;
