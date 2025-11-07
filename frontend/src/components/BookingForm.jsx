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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const BookingForm = ({ onClose, onBookingSuccess, roomId }) => {
  const { user } = useContext(AuthContext);
  const [room, setRoom] = useState(null);
  const [loadingRoom, setLoadingRoom] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [startDateTime, setStartDateTime] = useState(null);
  const [endDateTime, setEndDateTime] = useState(null);

  const [bookedDatesSet, setBookedDatesSet] = useState(new Set());

  useEffect(() => {
    async function fetchRoomAndBookedDates() {
      try {
        setLoadingRoom(true);

        const resRoom = await fetch(
          `http://localhost:8080/api/rooms/${roomId}`
        );

        if (!resRoom.ok) throw new Error("Failed to fetch room");
        const roomData = await resRoom.json();
        setRoom(roomData);

        const resBooked = await fetch(
          `http://localhost:8080/api/bookings/room/${roomId}/booked-dates`
        );
        if (!resBooked.ok) throw new Error("Failed to fetch booked dates");
        const bookedData = await resBooked.json();

        // Convert booked ranges to a Set of booked days as strings
        const newBookedDatesSet = new Set();
        bookedData.forEach(({ start_date, end_date }) => {
          let current = new Date(start_date);
          const last = new Date(end_date);
          while (current <= last) {
            newBookedDatesSet.add(formatDateLocal(current)); // <-- fix here
            current.setDate(current.getDate() + 1);
          }
        });

        setBookedDatesSet(newBookedDatesSet);
      } catch (error) {
        toast.error("Could not load room details or booked dates");
        console.error(error);
        setRoom(null);
        setBookedDatesSet(new Set());
      } finally {
        setLoadingRoom(false);
      }
    }

    if (roomId) {
      fetchRoomAndBookedDates();
    }
  }, [roomId]);

  if (!user) return <div>Loading user data...</div>;
  if (loadingRoom) return <div>Loading room info...</div>;
  if (!room) return <div>Room not found.</div>;

  const validateFields = () => {
    if (!phoneNumber || !startDateTime || !endDateTime) {
      toast.error("Please fill all fields");
      return false;
    }
    if (new Date(endDateTime) < new Date(startDateTime)) {
      toast.error("End date must be before start date");
      return false;
    }
    return true;
  };

  function formatDateLocal(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function formatTimeLocal(date) {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateFields()) return;
    setConfirmOpen(true);
  };

  function toIST(date) {
    const offset = 5.5 * 60;
    return new Date(date.getTime() + offset * 60 * 1000);
  }
  

  const handleBooking = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const startIST = toIST(startDateTime);
      const endIST = toIST(endDateTime);
      const res = await fetch("http://localhost:8080/api/bookings/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: user.id,
          room_id: room.id,
          start_date: formatDateLocal(startIST),
          start_time: formatTimeLocal(startIST),
          end_date: formatDateLocal(endIST),
          end_time: formatTimeLocal(endIST),
          phone_number: phoneNumber,
        }),
      });



      const data = await res.json();
      console.log(data);
      if (res.ok) {
        toast.success("Booking request sent!");
        setConfirmOpen(false);
        onClose(); 

        if (typeof onBookingSuccess === "function") {
          onBookingSuccess();
        }
      } else {
        toast.error(data.error || "Booking failed");
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
      {/* Booking Form Dialog */}
      <AlertDialog
        open={!confirmOpen}
        onOpenChange={(open) => !open && onClose()}
      >
        <AlertDialogContent className="bg-white dark:bg-zinc-900 p-6 rounded-lg max-w-md w-full shadow-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold mb-4">
              ✏️ Book Room
            </AlertDialogTitle>
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
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span style={{ padding: "10px" }}>+91</span>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phoneNumber}
                    onChange={(e) => {
                      const onlyNums = e.target.value.replace(/\D/g, "");
                      setPhoneNumber(onlyNums.slice(0, 10));
                    }}
                    maxLength={10}
                    required
                    style={{ flex: 1 }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <Label className="text-black font-medium">
                    Start Date & Time
                  </Label>
                  <DatePicker
                    selected={startDateTime ? new Date(startDateTime) : null}
                    onChange={(date) => {
                      if (!date) return;
                      setStartDateTime(date);
                    }}
                    showTimeSelect
                    timeIntervals={15}
                    timeFormat="HH:mm"
                    dateFormat="dd MMM yyyy, HH:mm"
                    placeholderText="Select start date and time"
                    minDate={new Date()}
                    excludeDates={[...bookedDatesSet].map((d) => {
                      const parts = d.split("-");
                      return new Date(parts[0], parts[1] - 1, parts[2]);
                    })}
                    shouldCloseOnSelect={true}
                    className="w-full border border-cyan-500 rounded-md px-4 py-2 shadow-sm 
                     text-cyan-700 font-medium focus:ring-2 focus:ring-cyan-400
                     focus:outline-none hover:border-cyan-600"
                    popperPlacement="bottom"
                  />
                </div>

                {/* End Date & Time */}
                <div className="flex flex-col gap-2">
                  <Label className="text-black font-medium">
                    End Date & Time
                  </Label>
                  <DatePicker
                    selected={endDateTime ? new Date(endDateTime) : null}
                    onChange={(date) => setEndDateTime(date)}
                    showTimeSelect
                    timeIntervals={1}
                    timeFormat="HH:mm"
                    dateFormat="dd MMM yyyy, HH:mm"
                    placeholderText="Select end date and time"
                    minDate={
                      startDateTime ? new Date(startDateTime) : new Date()
                    }
                    excludeDates={[...bookedDatesSet].map((d) => {
                      const parts = d.split("-");
                      return new Date(parts[0], parts[1] - 1, parts[2]);
                    })}
                    shouldCloseOnSelect={true}
                    className="w-full border border-cyan-500 rounded-md px-4 py-2 shadow-sm 
                 text-cyan-700 font-medium focus:ring-2 focus:ring-cyan-400
                 focus:outline-none hover:border-cyan-600"
                    popperPlacement="bottom"
                  />
                </div>
              </div>

              <AlertDialogFooter className="flex justify-center sm:justify-center flex-row gap-8">
                <Button
                  type="button"
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="px-4 py-2 rounded bg-yellow-500 text-white hover:bg-yellow-600"
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
              Booking request
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Are you sure you want raise a booking request?
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
                {loading ? "sending..." : "request sent"}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default BookingForm;
