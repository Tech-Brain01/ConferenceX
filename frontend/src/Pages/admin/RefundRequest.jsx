import { useState } from "react";
import RefundList from "../../components/RefundList";
import RefundDetails from "../../components/RefundDetails";

export default function RefundRequest() {
  const [selectedRefund, setSelectedRefund] = useState(null);

  return (
    <div className="flex h-full bg-gray-50 border rounded-lg overflow-hidden">
      {/* LEFT SIDE – LIST */}
      <div className="w-1/3 border-r bg-white">
        <RefundList
          onSelect={setSelectedRefund}
          selectedId={selectedRefund?.id}
        />
      </div>

      {/* RIGHT SIDE – DETAILS */}
      <div className="flex-1 bg-gray-50">
        {selectedRefund ? (
          <RefundDetails refund={selectedRefund} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-lg">
            Select a refund request
          </div>
        )}
      </div>
    </div>
  );
}
