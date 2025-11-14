export default function RefundDetails({ refund }) {
  return (
    <div className="p-6 space-y-6">

      <div>
        <h2 className="text-xl font-semibold text-gray-800">Refund Details</h2>
        <p className="text-gray-500">Request ID: #{refund.id}</p>
      </div>

      {/* USER INFO */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="font-semibold text-gray-700 mb-2">User Info</h3>
        <p><span className="font-medium">Name:</span> {refund.user}</p>
        <p><span className="font-medium">Booking ID:</span> {refund.bookingId}</p>
      </div>

      {/* REFUND INFO */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="font-semibold text-gray-700 mb-2">Refund Details</h3>
        <p><span className="font-medium">Amount:</span> ${refund.amount}</p>
        <p><span className="font-medium">Reason:</span> {refund.reason}</p>
        <p>
          <span className="font-medium">Status:</span>{" "}
          <span className="px-2 py-1 text-sm rounded bg-yellow-100 text-yellow-700">
            {refund.status}
          </span>
        </p>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-3">
        <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          Approve Refund
        </button>

        <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
          Reject Request
        </button>

        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Mark as Refunded
        </button>
      </div>
    </div>
  );
}
