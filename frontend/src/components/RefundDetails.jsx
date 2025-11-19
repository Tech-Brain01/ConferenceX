import { useState, useEffect } from "react";
import { processRefund, getRefundDetails } from "../service/refundService.js";

export default function RefundDetails({ refund , onUpdate}) {
  const token = localStorage.getItem("token");

  const [adminReason, setAdminReason] = useState("");
  const [partialAmount, setPartialAmount] = useState("");
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch refund and booking details
  useEffect(() => {
    async function loadDetails() {
      setLoading(true);
      setError(null);

      try {
        const res = await getRefundDetails(
          refund.refund_id || refund._id,
          token
        );
        // console.log("Refund details API response:", res);

        // API returns an array of refund objects
        if (Array.isArray(res) && res.length > 0) {
          const data = res[0];
          setBooking({
            id: data.refund_id,
            booking_ref: data.booking_ref,
            txn_no: data.txn_no,
            room_name: data.room_name || "N/A",
            amount_paid: data.booking_amount || "N/A",
            start_date: data.booking_start_date || "N/A",
            end_date: data.booking_end_date || "N/A",
            payment_date: data.payment_date || "N/A",
            payment_method: data.payment_method || "N/A",
            payment_status: data.payment_status || "N/A",
          });
        }
      } catch (err) {
        console.error("Error fetching refund details:", err);
        setError("Failed to load booking info");
      } finally {
        setLoading(false);
      }
    }

    loadDetails();
  }, [refund.refund_id, refund._id, token]);

const handleAction = async (refundId) => {
  if (!partialAmount || !booking) return;

  const amount = Number(partialAmount);
  const totalAmount = Number(booking.amount_paid);

  if (amount <= 0 || amount > totalAmount) {
    return alert(
      `Amount must be greater than 0 and less than or equal to ₹${totalAmount}`
    );
  }

  const status = amount === totalAmount ? "APPROVED_FULL" : "APPROVED_PARTIAL";

  const payload = {
    status,                   // must match DB enum exactly
    partial_amount: amount,   // number or null
    admin_reason: adminReason || null,
  };

  try {
    const data = await processRefund(refundId, payload, token);

    if (data.success) {
      alert(`Refund of ₹${amount} processed successfully!`);
      onUpdate && onUpdate(); // refresh parent if needed
    } else {
      alert("Error: " + (data.error || "Unknown error"));
    }
  } catch (err) {
    console.error("Error processing refund:", err);
    alert("Network error: " + err.message);
  }
};



  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Refund Details</h2>
        <p className="text-gray-500">
          Request ID: #{refund.refund_id || refund._id}
        </p>
      </div>

      {/* User Info */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="font-semibold text-gray-700 mb-2">User Info</h3>
        <p>
          <span className="font-medium">Name:</span> {refund.user_name}
        </p>
        <p>
          <span className="font-medium">Email:</span> {refund.user_email}
        </p>
      </div>

      {/* Booking Info */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="font-semibold text-gray-700 mb-2">Booking Info</h3>
        {loading ? (
          <p className="text-gray-400">Loading booking info...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : booking ? (
          <>
            <p>
              <span className="font-medium">Booking Ref:</span>{" "}
              {booking.booking_ref}
            </p>
            <p>
              <span className="font-medium">Transaction No:</span>{" "}
              {booking.txn_no}
            </p>
            <p>
              <span className="font-medium">Room:</span> {booking.room_name}
            </p>
            <p>
              <span className="font-medium">Amount Paid:</span> ₹
              {booking.amount_paid}
            </p>
            <p>
              <span className="font-medium">Start Date:</span>{" "}
              {booking.start_date}
            </p>
            <p>
              <span className="font-medium">End Date:</span> {booking.end_date}
            </p>
            <p>
              <span className="font-medium">payment date:</span>{" "}
              {booking.payment_date}
            </p>
            <p>
              <span className="font-medium">Payment Method:</span>{" "}
              {booking.payment_method}
            </p>
            <p>
              <span className="font-medium">Payment status:</span>{" "}
              {booking.payment_status}
            </p>
          </>
        ) : (
          <p className="text-gray-400">No booking information available.</p>
        )}
      </div>

      {/* Refund Request Info */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="font-semibold text-gray-700 mb-2">Refund Request</h3>
        <p>
          <span className="font-medium">Reason:</span> {refund.user_reason}
        </p>
        <p>
          <span className="font-medium">Status:</span>{" "}
          <span className="ml-2 px-2 py-1 text-sm rounded bg-gray-100 text-gray-700">
            {refund.status}
          </span>
        </p>
        {refund.partial_amount && (
          <p>
            <span className="font-medium">Approved Partial Amount:</span> ₹
            {refund.partial_amount}
          </p>
        )}
      </div>

   
      {/* Admin Input */}
      <div className="bg-white p-4 rounded-lg shadow-sm space-y-3">
        <input
          className="w-full border p-2 rounded"
          placeholder="Admin reason (optional)"
          value={adminReason}
          onChange={(e) => setAdminReason(e.target.value)}
        />
        <input
          className="w-full border p-2 rounded"
          placeholder={`Enter amount ≤ ₹${booking?.amount_paid || 0}`}
          type="number"
          min="0"
          max={booking?.amount_paid || 0}
          value={partialAmount}
          onChange={(e) => setPartialAmount(e.target.value)}
        />
        <p className="text-gray-500 text-sm">
          Enter an amount to auto-process refund (full if equals total paid).
        </p>
        <button onClick={() => handleAction(refund.refund_id || refund._id)}>Approve Refund</button>

      </div>
    </div>
  );
}
