import { useEffect, useState } from "react";
import { HoverEffect } from "./ui/CardHover.jsx";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "./ui/alert_dialog.jsx";
import BookingForm from "./BookingForm.jsx";
import {
  MapPinIcon,
  CurrencyRupeeIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  PaperAirplaneIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { Table, TableBody, TableRow, TableCell } from "./ui/table.jsx";

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [filters, setFilters] = useState({
    capacity: "",
    feature: "",
    available_from: "",
  });
  const [bookingOpen, setBookingOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomFeedbacks, setRoomFeedbacks] = useState([]);

  useEffect(() => {
    async function fetchRooms() {
      try {
        const res = await fetch("http://localhost:8080/api/rooms");
        const data = await res.json();
        setRooms(data);
      } catch (err) {
        console.error("Failed to fetch the Rooms", err);
      }
    }
    fetchRooms();
  }, []);

  useEffect(() => {
    if (selectedRoom) {
      fetch(`http://localhost:8080/api/rooms/${selectedRoom.id}/feedbacks`)
        .then((res) => res.json())
        .then((data) => setRoomFeedbacks(data))
        .catch((err) => console.error("Error fetching feedbacks", err));
    }
  }, [selectedRoom]);

  const filterRooms = rooms.filter((room) => {
    if (filters.capacity && room.capacity < Number(filters.capacity))
      return false;
    if (
      filters.feature &&
      !room.features.some((f) =>
        f.toLowerCase().includes(filters.feature.toLowerCase())
      )
    )
      return false;
    return true;
  });

  const roomItems = filterRooms.map((room) => ({
    title: room.name,
    image: `http://localhost:8080/uploads/${room.image}`,
    description: (
      <div className="space-y-4 text-gray-700">
        <div className="flex justify-between items-center text-green-600 font-semibold text-lg">
          ₹{Number(room.price).toFixed(2)}/Day
        </div>

        <Table className="bg-gray-50 rounded-lg shadow-inner">
          <TableBody>
            <TableRow className="border-b">
              <TableCell className="font-semibold text-cyan-500">
                Capacity
              </TableCell>
              <TableCell>{room.capacity}</TableCell>
            </TableRow>
            <TableRow className="border-b">
              <TableCell className="font-semibold text-cyan-500">
                Features
              </TableCell>
              <TableCell>
                {room.features?.length <= 2
                  ? room.features.join(", ")
                  : room.features.slice(0, 2).join(", ") + ", ..."}
              </TableCell>
            </TableRow>
            <TableRow className="border-b">
              <TableCell className="font-semibold text-cyan-500">
                Location
              </TableCell>
              <TableCell>
                {Array.isArray(room.location)
                  ? room.location.slice(0, 2).join(", ") +
                    (room.location.length > 2 ? ", ..." : "")
                  : room.location?.split(",").slice(0, 2).join(", ") +
                    (room.location?.split(",").length > 2 ? ", ..." : "")}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold text-cyan-500">
                Price
              </TableCell>
              <TableCell>₹{Number(room.price).toFixed(2)}/Day</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <button
          onClick={() => {
            setSelectedRoom(room);
            setDialogOpen(true);
          }}
          className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold shadow hover:scale-105 hover:from-cyan-400 hover:to-blue-400 transition-transform"
        >
          View Details
        </button>
      </div>
    ),
  }));

  return (
    <>
      <HoverEffect
        items={roomItems}
        cardClassName="bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl p-6 m-5 transition-transform"
        titleClassName="text-gray-900 font-bold text-xl md:text-2xl"
        descriptionClassName="text-gray-600 text-sm md:text-base mt-2"
      />

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto rounded-xl bg-white p-6 shadow-lg">
          <AlertDialogHeader className="flex justify-between items-center border-b border-gray-200 pb-3">
            <AlertDialogTitle className="text-2xl font-semibold text-gray-900">
              {selectedRoom?.name || "Room Details"}
            </AlertDialogTitle>

            <div className="flex gap-4">
              <button
                onClick={() => setDialogOpen(false)}
                className="p-1 border rounded-full border-gray-300 hover:bg-gray-100 transition"
              >
                <ArrowLeftIcon className="w-6 h-6 text-gray-700" />
              </button>
              <button
                onClick={() => setBookingOpen(true)}
                className="p-1 border rounded-full border-green-400 hover:bg-green-50 transition"
              >
                <PaperAirplaneIcon className="w-6 h-6 text-green-500" />
              </button>
            </div>
          </AlertDialogHeader>

          <AlertDialogDescription className="mt-4 text-gray-700">
            Detailed information about the room.
          </AlertDialogDescription>

          {selectedRoom && (
            <div className="mt-6 space-y-6 text-gray-900">
              <img
                src={`http://localhost:8080/uploads/${selectedRoom.image}`}
                alt={selectedRoom.name}
                className="w-full max-h-64 object-cover rounded-lg shadow-md"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <UserGroupIcon className="w-5 h-5 text-cyan-500" />
                  <span>
                    <strong>Capacity:</strong> {selectedRoom.capacity}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Cog6ToothIcon className="w-5 h-5 text-cyan-500" />
                  <span>
                    <strong>Features:</strong>{" "}
                    {selectedRoom.features?.join(", ") || "None"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPinIcon className="w-5 h-5 text-cyan-500" />
                  <span>
                    <strong>Location:</strong> {selectedRoom.location || "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CurrencyRupeeIcon className="w-5 h-5 text-cyan-500" />
                  <span>
                    <strong>Price:</strong> ₹
                    {Number(selectedRoom.price).toFixed(2)}/Day
                  </span>
                </div>
              </div>

              {roomFeedbacks.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">
                    User Feedback
                  </h3>
                  <ul className="space-y-3">
                    {roomFeedbacks.map((fb, idx) => {
                      const fullStars = Math.floor(fb.rating);
                      const halfStar = fb.rating % 1 >= 0.5;
                      const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

                      return (
                        <li
                          key={idx}
                          className="bg-gray-50 p-3 rounded-md shadow-sm"
                        >
                          <p className="italic text-gray-700">
                            "{fb.feedback}"
                          </p>
                          <p className="flex text-yellow-500 mt-1">
                            {[...Array(fullStars)].map((_, i) => (
                              <span key={i}>★</span>
                            ))}
                            {halfStar && <span>⯨</span>}
                            {[...Array(emptyStars)].map((_, i) => (
                              <span key={i} className="text-gray-300">
                                ★
                              </span>
                            ))}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            — {fb.username}
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          )}
        </AlertDialogContent>
      </AlertDialog>

      {bookingOpen && (
        <BookingForm
          onClose={() => setBookingOpen(false)}
          roomId={selectedRoom?.id}
        />
      )}
    </>
  );
};

export default RoomList;
