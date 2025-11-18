import { useEffect, useState } from "react";
import { getAllRefunds } from "../service/refundService.js";

export default function RefundList({ onSelect, selectedId }) {
  const [refunds, setRefunds] = useState([]);
  const token = localStorage.getItem("token");

 useEffect(() => {
  async function loadRefunds() {
    try {
      const res = await getAllRefunds(token);
      console.log("Refunds API response:", res); // ✅ log entire response
      if (res.success) setRefunds(res.refunds);
    } catch (err) {
      console.error("Error loading refunds:", err);
    }
  }
  loadRefunds();
}, [token]);


  return (
    <div>
      <h2 className="p-4 font-semibold text-gray-700 border-b">
        Refund Requests
      </h2>

  <ul className="overflow-y-auto h-[calc(100vh-150px)]">
  {refunds.map((req) => (
    <li
      key={req.refund_id} // <-- use refund_id here
      className={`p-4 cursor-pointer border-b hover:bg-gray-100 ${
        selectedId === req.refund_id ? "bg-gray-200" : ""
      }`}
      onClick={() => onSelect(req)}
    >
      <p className="font-medium">{req.user_name}</p>
      <p className="text-sm text-gray-500">
        Booking: #{req.booking_ref}
      </p>
      <p className="text-sm text-gray-700">
        Room: {req.room_name || "N/A"}
      </p>
      <p className="text-sm font-semibold text-blue-600">
        Status: {req.status}
      </p>
      <p className="text-xs text-gray-400">
        {new Date(req.created_at).toLocaleString()}
      </p>
    </li>
  ))}
</ul>


    </div>
  );
}
