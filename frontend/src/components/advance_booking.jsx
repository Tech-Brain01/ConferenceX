import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { Input } from "./ui/input.jsx";
import { Label } from "./ui/label.jsx";
import { Button } from "./ui/Button.jsx";
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
} from "./ui/alert_dialog.jsx";
import { useParams } from "react-router-dom";

const AdvanceBookingForm = ({ onClose }) => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [room, setRoom] = useState(null);
  const [loadingRoom, setLoadingRoom] = useState(true);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    async function fetchRoom() {
      try {
        const res = await fetch(`http://localhost:8080/api/rooms/${id}`);
        if (!res.ok) throw new Error("Failed to fetch room");
        const data = await res.json();
        setRoom(data);
      } catch (error) {
        toast.error("Could not load room details");
        console.error(error);
      } finally {
        setLoadingRoom(false);
      }
    }

    fetchRoom();
  }, [id]);

  if (loadingRoom) return <div>Loading room info...</div>;
  if (!room) return <div>Room not found.</div>;
  if (!user) return <div>Loading user data...</div>;

  const validateFields = () => {
    if (!phoneNumber || !startDate || !endDate) {
      toast.error("Please fill all fields");
      return false;
    }
    if (new Date(endDate) < new Date(startDate)) {
      toast.error("End date must be after start date");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateFields()) return;
    setConfirmOpen(true);
  };

  const handleBooking = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:8080/api/bookings/advance-book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: user.id,
          room_id: room.id,
          start_date: startDate,
          end_date: endDate,
          phone_number: phoneNumber,
          // Add any advance booking specific fields here
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Advance booking confirmed!");
        setConfirmOpen(false);
        onClose();
      } else {
        toast.error(data.error || "Advance booking failed");
      }
    } catch (err) {
      toast.error("Failed to book room");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Main Booking Form Dialog */}
      <AlertDialog open={!confirmOpen} onOpenChange={(open) => !open && onClose()}>
        <AlertDialogContent className="bg-white dark:bg-zinc-900 p-6 rounded-lg max-w-md w-full shadow-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold mb-4">📅 Advance Book Room</AlertDialogTitle>
          </AlertDialogHeader>

          <AlertDialogDescription asChild>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label>User Name</Label>
                <Input type="text" value={user?.name || "Unknown"} disabled />
              </div>

              <div>
                <Label>Room Name</Label>
                <Input type="text" value={room.name} disabled />
              </div>

              <div>
                <Label>Email</Label>
                <Input type="email" value={user?.email || ""} disabled />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_date">From Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="end_date">Till Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>
              </div>

              <AlertDialogFooter className="pt-4 flex justify-end gap-3">
                <Button
                  type="button"
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  Save
                </Button>
              </AlertDialogFooter>
            </form>
          </AlertDialogDescription>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="bg-white dark:bg-zinc-900 p-6 rounded-lg max-w-md w-full shadow-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold mb-4">
              Confirm Advance Booking
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Are you sure you want to confirm this advance booking?
          </AlertDialogDescription>
          <AlertDialogFooter className="pt-4 flex justify-end gap-3">
            <AlertDialogCancel asChild>
              <Button
                onClick={() => setConfirmOpen(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                onClick={handleBooking}
                disabled={loading}
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
              >
                {loading ? "Booking..." : "Confirm"}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AdvanceBookingForm;
