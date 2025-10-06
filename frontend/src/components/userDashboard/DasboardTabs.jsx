import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tab.jsx";
import AllBookings from "./AllBookings.jsx";
import Edit from "./Edit.jsx";
import { toast } from "sonner";

const DashboardTabs = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [allBookings, setAllBookings] = useState([]);
  const [editingBooking, setEditingBooking] = useState(null);

  useEffect(() => {
    async function fetchBookings() {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(
          "http://localhost:8080/api/bookings/my-bookings",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        if (res.ok) setAllBookings(data);
        else toast.error("Failed to fetch bookings");
      } catch (err) {
        toast.error("Error fetching bookings");
      }
    }
    fetchBookings();
  }, []);

  const toMySQLDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const getFilteredBookings = (type) => {
    const now = new Date();
    return allBookings
      .filter((booking) => {
        const start = new Date(booking.start_date);
        const end = new Date(booking.end_date);
        const status = booking.status.toLowerCase();

        if (type === "upcoming") {
          return start > now && (status === "pending" || status === "approved");
        }

        if (type === "history") {
          return (
            end < now || ["cancelled", "rejected", "completed"].includes(status)
          );
        }

        return true; // all bookings
      })
      .sort((a, b) => {
        const dateA = new Date(a.start_date);
        const dateB = new Date(b.start_date);
        return type === "history" ? dateB - dateA : dateA - dateB;
      });
  };

  const handleCancel = async (booking) => {
    if (!window.confirm("Are you sure you want to cancel the booking?")) return;

    try {
      const res = await fetch(
        `http://localhost:8080/api/bookings/${booking.id}/cancel`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (!res.ok) throw new Error("Failed to cancel booking");

      setAllBookings((prev) =>
        prev.map((b) =>
          b.id === booking.id ? { ...b, status: "cancelled" } : b
        )
      );
      toast.success("Booking cancelled!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handlePay = async (booking) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/bookings/${booking.id}/payment`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (!res.ok) throw new Error("Payment failed");

      setAllBookings((prev) =>
        prev.map((b) =>
          b.id === booking.id ? { ...b, payment_status: "Paid" } : b
        )
      );
      toast.success("Payment successful!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEdit = (booking) => {
    setEditingBooking(booking);
  };



const handleSaveEdit = async ({ start_date, end_date, phone_number }) => {
  if (!editingBooking) return;

  // ✅ Format to YYYY-MM-DD
  const formattedStart = new Date(start_date).toISOString().split("T")[0];
  const formattedEnd = new Date(end_date).toISOString().split("T")[0];

  console.log("📤 Sending booking update:");
  console.log("➡ Booking ID:", editingBooking.id);
  console.log("➡ start_date:", formattedStart);
  console.log("➡ end_date:", formattedEnd);
  console.log("➡ phone_number:", phone_number);

  try {
    const res = await fetch(
      `http://localhost:8080/api/bookings/${editingBooking.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          start_date: formattedStart,
          end_date: formattedEnd,
          phone_number,
        }),
      }
    );

    const responseData = await res.json();

    if (!res.ok) {
      console.error("❌ Server error response:", responseData);
      throw new Error(responseData.err || "Edit failed");
    }

    console.log("✅ Server response:", responseData);

    setAllBookings((prev) =>
      prev.map((b) =>
        b.id === editingBooking.id
          ? { ...b, start_date: formattedStart, end_date: formattedEnd, phone_number }
          : b
      )
    );
    toast.success("Booking updated!");
    setEditingBooking(null);
  } catch (err) {
    console.error("❌ Edit failed:", err.message);
    toast.error(err.message);
  }
};


  return (
    <>
      {editingBooking && (
        <Edit
          booking={editingBooking}
          onClose={() => setEditingBooking(null)}
          onSave={handleSaveEdit}
        />
      )}

      {/* Your tabs component */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-xl mx-auto mb-6">
          <TabsTrigger value="all">All Bookings</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <AllBookings
            bookings={getFilteredBookings("all")}
            onCancel={handleCancel}
            onEdit={handleEdit}
            onPay={handlePay}
          />
        </TabsContent>

        <TabsContent value="upcoming">
          <AllBookings
            bookings={getFilteredBookings("upcoming")}
            onCancel={handleCancel}
            onEdit={handleEdit}
            onPay={handlePay}
          />
        </TabsContent>

        <TabsContent value="history">
          <AllBookings
            bookings={getFilteredBookings("history")}
            onCancel={handleCancel}
            onEdit={handleEdit}
            onPay={handlePay}
          />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default DashboardTabs;
