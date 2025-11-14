export default function RefundList({ onSelect, selectedId }) {
  const refundRequests = [
    {
      id: 1,
      user: "John Doe",
      amount: 120,
      bookingId: "BK1001",
      reason: "Double payment",
      status: "Pending",
    },
    {
      id: 2,
      user: "Sarah Jones",
      amount: 80,
      bookingId: "BK1002",
      reason: "Room not available",
      status: "Pending",
    },
  ];

  return (
    <div>
      <h2 className="p-4 font-semibold text-gray-700 border-b">Refund Requests</h2>

      <ul className="overflow-y-auto h-[calc(100vh-150px)]">
        {refundRequests.map((req) => (
          <li
            key={req.id}
            className={`p-4 cursor-pointer border-b hover:bg-gray-100 ${
              selectedId === req.id ? "bg-gray-200" : ""
            }`}
            onClick={() => onSelect(req)}
          >
            <p className="font-medium">{req.user}</p>
            <p className="text-sm text-gray-500">#{req.bookingId}</p>
            <p className="text-sm text-red-500 font-semibold">${req.amount}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
