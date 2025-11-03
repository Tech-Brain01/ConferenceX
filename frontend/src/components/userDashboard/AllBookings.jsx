import React, { useState } from "react";
import BookingCard from "./BookingCard";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/Button";



const AllBookings = ({ bookings = [], onCancel, onEdit, onPay }) => {
  const [selectFilter, setSelectFilter] = useState("");

// const getDefaultFromDate = new Date(
//   new Date().getFullYear(),
//   new Date().getMonth(),
//   1
// );
// const getDefaultToDate = new Date();

// const [filterDate, setFilterDate] = useState({
//   fromDate: getDefaultFromDate,
//   toDate: getDefaultToDate
// });

// const handleApplyFilter = (fromDate, toDate) => {
//   setFilterDate({fromDate , toDate});
// }


  if (!bookings.length) {
    return (
      <p className="text-center text-gray-400 mt-10">No bookings found.</p>
    );
  }

  const filteredBookings = selectFilter
    ? bookings.filter((b) => {
        const statusMatch =
          b.status.toLowerCase() === selectFilter.toLowerCase();
        const paymentMatch =
          b.payment_status.toLowerCase() === selectFilter.toLowerCase();
        return statusMatch || paymentMatch;
      })
    : bookings;

  return (
    <div className="p-6 ">
     {/* <div className="mt-10 flex items-center justify-center z-100 relative">
         <FilterBar
            onApply={handleApplyFilter}
            initialFromDate={filterDate.fromDate}
            initialToDate={filterDate.toDate}
          />
        </div> */}
      <div className="flex items-center justify-end mb-4">
        <Popover>
          <PopoverTrigger className="border rounded-2xl p-2 border-cyan-300 text-base cursor-pointer">
            Filter My bookings:{" "}
            <span className="font-semibold">{selectFilter || "All"}</span>
          </PopoverTrigger>
          <PopoverContent className="max-h-60 overflow-y-auto w-48 p-2 bg-white">
            {[
              "Approved",
              "Pending",
              "Rejected",
              "Cancelled",
              "Paid",
              "Unpaid",
            ].map((filterOption) => (
              <Button
                key={filterOption}
                className={`block w-full text-left px-3 py-1 rounded-md mb-2 ${
                  selectFilter.toLowerCase() === filterOption.toLowerCase()
                    ? "bg-indigo-600 text-white"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setSelectFilter(filterOption)}
              >
                {filterOption}
              </Button>
            ))}

            <Button
              className="block w-full text-left px-3 py-1 rounded-md mt-2 hover:bg-gray-100"
              onClick={() => setSelectFilter("")}
            >
              Clear Filter
            </Button>
          </PopoverContent>
        </Popover>
      </div>

      {filteredBookings.map((booking) => (
        <BookingCard
          
          key={booking.id}
          booking={booking}
          onCancel={onCancel}
          onEdit={onEdit}
          onPay={onPay}
        />
      ))}
    </div>
  );
};

export default AllBookings;
