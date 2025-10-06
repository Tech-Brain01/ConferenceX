import { useEffect, useState } from "react";
import { HoverEffect } from "./ui/CardHover.jsx";
import { useNavigate } from "react-router-dom";
import { Badge } from "./ui/badge.jsx";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from "./ui/alert_dialog.jsx";
import BookingForm from "./BookingForm.jsx";
import {
  XMarkIcon,
  CheckCircleIcon,
  XCircleIcon,
  MapPinIcon,
  CurrencyRupeeIcon,
  UserGroupIcon,
  CalendarIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "./ui/table.jsx";

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

  const navigate = useNavigate();

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
    // Capacity filter
    if (filters.capacity && room.capacity < Number(filters.capacity)) {
      return false;
    }

    // Available from filter - compare with dynamic_available_from
    if (
      filters.available_from &&
      new Date(room.dynamic_available_from) > new Date(filters.available_from)
    ) {
      return false;
    }

    // Feature filter
    if (
      filters.feature &&
      !room.features.some((f) =>
        f.toLowerCase().includes(filters.feature.toLowerCase())
      )
    ) {
      return false;
    }

    return true;
  });

  const formatDateForDisplay = (dateString) => {
    const d = new Date(dateString);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };

  const roomItems = filterRooms.map((room) => {
    const now = new Date();
    const availableFrom = new Date(room.dynamic_available_from);
    const isAvailable = availableFrom <= now;

    return {
      title: room.name,
      image: `http://localhost:8080/uploads/${room.image}`,
      description: (
        <div className="space-y-2 text-sm text-neutral-300">
          <div className="flex items-center justify-between">
            <Badge
              variant={isAvailable ? "secondary" : "destructive"}
              className="flex items-center gap-2"
            >
              <span
                className={`h-3 w-3 rounded-full ${
                  isAvailable ? "bg-green-500" : "bg-red-500"
                }`}
              ></span>
              {isAvailable ? "Available" : "Not Available"}
            </Badge>

            {/* Price */}
            <span className="text-green-400 font-semibold text-sm">
              ₹{Number(room.price).toFixed(2)}/Day
            </span>
          </div>
          <Table>
            <TableBody>
              <TableRow className="border-b-0">
                <TableCell className="font-semibold text-cyan-400 flex">
                  <span className="flex-grow text-left">Capacity No</span>
                  <span className="w-4 text-left px-2">:</span>
                </TableCell>
                <TableCell className="text-left">{room.capacity}</TableCell>
              </TableRow>
              {/* <TableRow className="border-b-0">
                <TableCell className="font-semibold text-cyan-400 flex">
                  <span className="flex-grow text-left">Available from</span>
                  <span className="w-4 text-left px-2">:</span>
                </TableCell>
                <TableCell className="text-left">
                  {formatDateForDisplay(room.dynamic_available_from)}
                </TableCell>
              </TableRow> */}
              <TableRow className="border-b-0">
                <TableCell className="font-semibold text-cyan-400 flex">
                  <span className="flex-grow text-left">Features List</span>
                  <span className="w-4 text-left px-2">:</span>
                </TableCell>
                <TableCell className="text-left">
                  {room?.features
                    ? room.features.length <= 2
                      ? room.features.join(", ")
                      : room.features.slice(0, 2).join(", ") + ", ..."
                    : "None"}
                </TableCell>
              </TableRow>
              <TableRow className="border-b-0">
                <TableCell className="font-semibold text-cyan-400 flex">
                  <span className="flex-grow text-left">Location</span>
                  <span className="w-4 text-left px-2">:</span>
                </TableCell>
                <TableCell className="text-left">
                  {room.location || "N/A"}
                </TableCell>
              </TableRow>
              <TableRow className="border-b-0">
                <TableCell className="font-semibold text-cyan-400 flex">
                  <span className="flex-grow text-left">Price of Room</span>
                  <span className="w-4 text-left px-2">:</span>
                </TableCell>
                <TableCell className="text-left">
                  ₹{Number(room.price).toFixed(2)}/Day
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <button
            onClick={() => {
              setSelectedRoom(room);
              setDialogOpen(true);
            }}
            className="mt-2 inline-block w-full rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 text-center font-semibold text-white shadow-lg transition-all hover:scale-105 hover:from-cyan-400 hover:to-blue-400"
          >
            View Details
          </button>
        </div>
      ),
    };
  });

  return (
    <>
      <HoverEffect items={roomItems} />

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto rounded-lg bg-white  p-6 shadow-lg">
          <AlertDialogHeader className="flex justify-between items-center border-b border-gray-200  pb-3">
            <AlertDialogTitle className="text-2xl font-semibold flex items-center gap-2 text-gray-900 ">
              {selectedRoom?.name || "Room Details"}
              {selectedRoom &&
                (selectedRoom.dynamic_available_from <=
                new Date().toISOString() ? (
                  <CheckCircleIcon
                    className="w-6 h-6 text-green-500"
                    title="Available"
                  />
                ) : (
                  <XCircleIcon
                    className="w-6 h-6 text-red-500"
                    title="Not Available"
                  />
                ))}
            </AlertDialogTitle>
            <button
              onClick={() => setDialogOpen(false)}
              aria-label="Close dialog"
              className="text-gray-500 hover:text-gray-700 "
            >
              <span className="flex border rounded-full gap-3 border-cyan-200 items-center justify-center p-1">
                <p>Back</p>
                <XMarkIcon className="w-6 h-6" />
              </span>
            </button>
          </AlertDialogHeader>

          <AlertDialogDescription className="mt-2 text-gray-700 ">
            Detailed information about the room.
          </AlertDialogDescription>

          <div className="mt-6 space-y-6 text-gray-900 ">
            {selectedRoom && (
              <>
                <img
                  src={`http://localhost:8080/uploads/${selectedRoom.image}`}
                  alt={selectedRoom.name}
                  className="w-full max-h-60 object-cover rounded-lg shadow-md"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <UserGroupIcon className="w-5 h-5 text-cyan-500" />
                    <span>
                      <strong>Capacity:</strong> {selectedRoom.capacity}
                    </span>
                  </div>
                  {/* <div className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-cyan-500" />
                    <span>
                      <strong>Available from:</strong>{" "}
                      {formatDateForDisplay(
                        selectedRoom.dynamic_available_from
                      )}
                    </span>
                  </div> */}
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
                      <strong>Location:</strong>{" "}
                      {selectedRoom.location || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CurrencyRupeeIcon className="w-5 h-5 text-cyan-500" />
                    <span>
                      <strong>Price:</strong> ₹
                      {Number(selectedRoom.price).toFixed(2)}/Day
                    </span>
                  </div>
                  {roomFeedbacks.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold mb-2 text-gray-800">
                        User Feedback
                      </h3>
                      <ul className="space-y-3">
                        {roomFeedbacks.map((fb, idx) => (
                          <li
                            key={idx}
                            className="bg-gray-100 p-3 rounded-md shadow text-gray-700"
                          >
                            <p className="italic">"{fb.feedback}"</p>
                            <p className="text-sm text-gray-500 mt-1">
                              — {fb.username}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Book Now Button */}
                <button
                  onClick={() => setBookingOpen(true)}
                  className="mt-6 w-full rounded-lg bg-green-600 px-4 py-2 text-white font-semibold shadow hover:bg-green-700 transition"
                >
                  Book Now
                </button>
              </>
            )}
          </div>

          <div className="mt-6 flex justify-center">
            <AlertDialogCancel className="bg-amber-500 hover:bg-amber-700">
              Close
            </AlertDialogCancel>
          </div>
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
