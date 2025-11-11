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
  const [sortOrder, setSortOrder] = useState("");
  const [filters, setFilters] = useState({
  name: "",
  feature: "",
  capacity: "",
  location: "",
  minPrice: "",
  maxPrice: "",
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
    // Capacity filter
    if (filters.capacity && room.capacity < Number(filters.capacity)) {
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

  const roomItems = filterRooms.map((room) => {
    return {
      title: room.name,
      description: (
        <div className="space-y-4">
          <img
            src={`http://localhost:8080/uploads/${room.image}`}
            alt={room.name}
            className="w-full h-48 object-cover rounded-xl shadow-md"
          />

          {/* Room Info Table */}
          <Table className="text-sm">
            <TableBody>
              <TableRow className="border-b border-gray-700">
                <TableCell className="font-semibold text-amber-400">
                  Capacity No
                </TableCell>
                <TableCell className="text-left">{room.capacity}</TableCell>
              </TableRow>
              <TableRow className="border-b border-gray-700">
                <TableCell className="font-semibold text-amber-400">
                  Features
                </TableCell>
                <TableCell>
                  {room?.features
                    ? room.features.length <= 2
                      ? room.features.join(", ")
                      : room.features.slice(0, 2).join(", ") + ","
                    : "None"}
                </TableCell>
              </TableRow>
             <TableRow className="border-b border-gray-700">
              <TableCell className="font-semibold text-amber-400">Location</TableCell>
              <TableCell>
                {room?.location
                  ? Array.isArray(room.location)
                    ? room.location.length <= 2
                      ? room.location.join(", ")
                      : room.location.slice(0, 2).join(", ") + ", ..."
                    : (() => {
                        const parts = room.location.split(",");
                        return (
                          parts.slice(0, 2).join(", ") +
                          (parts.length > 2 ? ", ..." : "")
                        );
                      })()
                  : "None"}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold text-amber-400">Price</TableCell>
              <TableCell>₹{Number(room.price).toFixed(2)}/Day</TableCell>
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
      <HoverEffect
        items={roomItems}
        cardClassName="bg-gray-900/80 border border-gray-700 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 flex flex-col justify-between"
        titleClassName="text-white font-bold text-xl md:text-2xl"
        descriptionClassName="text-gray-300 text-sm md:text-base mt-4"
      />

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto rounded-lg bg-white  p-6 shadow-lg">
          <AlertDialogHeader className="flex justify-between items-center border-b border-gray-200  pb-3">
            <AlertDialogTitle className="text-2xl font-semibold flex items-center gap-2 text-gray-900 ">
              {selectedRoom?.name || "Room Details"}
            </AlertDialogTitle>
            <div className="flex justify-between items-center relative w-full">
              <div className="relative group">
                <button
                  onClick={() => setDialogOpen(false)}
                  aria-label="Go Back"
                  className="text-gray-500 hover:text-gray-700"
                >
                  <span className="flex border rounded-full border-gray-400 items-center justify-center p-1">
                    <ArrowLeftIcon className="w-6 h-6" />
                  </span>
                </button>

                <span className="absolute left-10 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                  Back
                </span>
              </div>

              <div className="relative group">
                <button
                  onClick={() => setBookingOpen(true)}
                  aria-label="Book Now"
                  className="text-green-500 hover:text-green-600"
                >
                  <span className="flex border rounded-full border-gray-400 items-center justify-center p-1">
                    <PaperAirplaneIcon className="w-6 h-6" />
                  </span>
                </button>
                <span className="absolute right-10 top-1/2 -translate-y-1/2 bg-green-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                  Book Now
                </span>
              </div>
            </div>
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
                    <div className="mt-4 grid col-span-2">
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
                              className="bg-gray-100 p-3 rounded-md shadow text-gray-700"
                            >
                              <p className="italic">"{fb.feedback}"</p>

                              <p className="flex text-yellow-500 mt-1">
                                {[...Array(fullStars)].map((_, i) => (
                                  <span key={`full-${i}`}>★</span>
                                ))}

                                {halfStar && <span>⯨</span>}

                                {[...Array(emptyStars)].map((_, i) => (
                                  <span
                                    key={`empty-${i}`}
                                    className="text-gray-300"
                                  >
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
              </>
            )}
          </div>
        </AlertDialogContent>
      </AlertDialog>
      {bookingOpen && (
        <BookingForm
          onClose={() => setBookingOpen(false)}
          onBookingSuccess={() => {
            setBookingOpen(false);
            setDialogOpen(false);
          }}
          roomId={selectedRoom?.id}
        />
      )}
    </>
  );
};

export default RoomList;
