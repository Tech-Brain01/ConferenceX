
import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge.jsx";
import { Button } from "./ui/Button.jsx";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel } from "./ui/alert_dialog.jsx";
import { Star } from "lucide-react";

// RoomDetailsContent shows details of a single room passed via prop
const RoomDetailsContent = ({ room }) => {
  if (!room) return null;

  const formatDateForDisplay = (dateString) => {
    const d = new Date(dateString);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };

  const photos = room.photos || [{ url: `http://localhost:8080/uploads/${room.image}` }];
  const feedbacks = room.feedbacks || [
    { user: "John", rating: 4, message: "Great room, loved it!" },
    { user: "Emma", rating: 5, message: "Perfect for our meetings." },
  ];

  const now = new Date();
  const isAvailable = new Date(room.dynamic_available_from) <= now;

  return (
    <div className="space-y-4 text-gray-900 dark:text-gray-100">
      <h2 className="text-2xl font-bold">{room.name}</h2>
      <Badge variant={isAvailable ? "secondary" : "destructive"} className="mb-4">
        {isAvailable ? "Available" : "Not Available"}
      </Badge>
      <img
        src={`http://localhost:8080/uploads/${room.image}`}
        alt={room.name}
        className="w-full max-h-60 object-cover rounded-lg mb-4"
      />
      <p><strong>Capacity:</strong> {room.capacity}</p>
      <p><strong>Available from:</strong> {formatDateForDisplay(room.dynamic_available_from)}</p>
      <p><strong>Features:</strong> {room.features?.join(", ") || "None"}</p>
      <p><strong>Location:</strong> {room.location || "N/A"}</p>
      <p><strong>Price:</strong> ₹{Number(room.price).toFixed(2)}</p>

      <div>
        <strong>User Feedback:</strong>
        {feedbacks.length === 0 ? (
          <p>No feedback yet.</p>
        ) : (
          <ul className="space-y-2 mt-2 max-h-48 overflow-y-auto">
            {feedbacks.map(({ user, rating, message }, idx) => (
              <li key={idx} className="border p-2 rounded bg-gray-100 dark:bg-gray-800">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{user}</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={i < rating ? "text-yellow-400" : "text-gray-400"}
                        size={16}
                      />
                    ))}
                  </div>
                </div>
                <p className="italic text-sm">{message}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex justify-end mt-4">
        <Button onClick={() => alert("Booking flow coming soon!")}>Book Now</Button>
      </div>
    </div>
  );
};

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [filters, setFilters] = useState({
    capacity: "",
    feature: "",
    available_from: "",
  });
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

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

  const filterRooms = rooms.filter((room) => {
    if (filters.capacity && room.capacity < Number(filters.capacity)) return false;
    if (filters.available_from && new Date(room.dynamic_available_from) > new Date(filters.available_from)) return false;
    if (
      filters.feature &&
      !room.features.some((f) => f.toLowerCase().includes(filters.feature.toLowerCase()))
    )
      return false;
    return true;
  });

  const formatDateForDisplay = (dateString) => {
    const d = new Date(dateString);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        {filterRooms.map((room) => {
          const now = new Date();
          const availableFrom = new Date(room.dynamic_available_from);
          const isAvailable = availableFrom <= now;

          return (
            <div key={room.id} className="bg-gray-800 rounded-lg p-4 shadow-md text-white">
              <img
                src={`http://localhost:8080/uploads/${room.image}`}
                alt={room.name}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-bold mb-2">{room.name}</h3>
              <Badge variant={isAvailable ? "secondary" : "destructive"} className="mb-2">
                {isAvailable ? "Available" : "Not Available"}
              </Badge>
              <p><strong>Capacity:</strong> {room.capacity}</p>
              <p><strong>Available from:</strong> {formatDateForDisplay(room.dynamic_available_from)}</p>
              <p><strong>Price:</strong> ₹{Number(room.price).toFixed(2)}</p>
              <button
                className="mt-4 w-full bg-cyan-600 hover:bg-cyan-700 transition-colors rounded py-2 font-semibold"
                onClick={() => {
                  setSelectedRoom(room);
                  setDialogOpen(true);
                }}
              >
                View Details
              </button>
            </div>
          );
        })}
      </div>

      {/* Modal for Room Details */}
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>Room Details</AlertDialogTitle>
            <AlertDialogDescription>
              Detailed information about the room.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="mt-4">
            <RoomDetailsContent room={selectedRoom} />
          </div>

          <div className="mt-6 flex justify-end">
            <AlertDialogCancel>Close</AlertDialogCancel>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default RoomList;
