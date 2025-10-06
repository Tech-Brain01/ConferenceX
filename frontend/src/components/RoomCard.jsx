import React from "react";
import { BackgroundGradient } from "./ui/background-gradient.jsx";


const RoomCard = ({ room, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date)
      ? "N/A"
      : date.toLocaleDateString("en-GB", { 
          year: "numeric",
          month: "short",
          day: "numeric",
        });
  };

  return (
    <div className="p-5">
      <BackgroundGradient className="rounded-2xl shadow-lg overflow-hidden bg-white dark:bg-zinc-900 transition hover:shadow-2xl duration-300 ease-in-out">
        <div className="flex flex-col sm:flex-row gap-6 items-center w-full p-5 bg-slate-200">
          {/* Image */}
          <div className="w-full sm:w-[180px] flex-shrink-0 overflow-hidden rounded-xl">
            <img
              src={`http://localhost:8080/uploads/${room.image}`}
              alt={room.name}
              className="w-full h-40 sm:h-28 object-cover rounded-xl transform hover:scale-105 transition duration-300 ease-in-out"
            />
          </div>

          {/* Content */}
          <div className="flex-1 w-full min-w-0 space-y-2 text-sm text-zinc-800 dark:text-zinc-200">
            <h2 className="text-xl font-semibold truncate text-zinc-900 ">
              {room.name}
            </h2>

            <div className="flex flex-wrap items-center gap-2 text-md">
              <span className="bg-cyan-100 text-cyan-700 font-medium px-3 py-1 rounded-full">
                Capacity: {room.capacity || "N/A"}
              </span>
              <span className="bg-emerald-100 text-emerald-700 font-medium px-3 py-1 rounded-full">
                Available date: {formatDate(room.available_from)}
              </span>
              {room.location && (
                <span className="bg-indigo-100 text-indigo-700 font-medium px-3 py-1 rounded-full">
                  📍Location: {room.location}
                </span>
              )}
              {room.price && (
                <span className="bg-yellow-100 text-yellow-800 font-medium px-3 py-1 rounded-full">
                  Price: ₹{room.price}/Day
                </span>
              )}
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-2 mt-2">
              <strong className="w-full text-zinc-900  text-md uppercase tracking-wide">
                Features:
              </strong>
              {Array.isArray(room.features) && room.features.length > 0 ? (
                room.features.map((f, index) => {
                  if (!f) return null;
                  return (
                    <span
                      key={f.id || index}
                      className="bg-blue-200 text-blue-800 px-2 py-1 text-xs rounded-full font-medium"
                    >
                      {typeof f === "string" ? f : f.name}
                    </span>
                  );
                })
              ) : (
                <span className="text-gray-400 text-xs">No features</span>
              )}
            </div>
          </div>

          {/* Buttons */}
          {(onEdit || onDelete) && (
            <div className="flex flex-col items-end gap-2 sm:min-w-[120px]">
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded-full text-sm font-medium shadow transition"
                >
                  ✏️ Edit
                </button>
              )}
              {onDelete && (
                <button
                  onClick={onDelete}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-full text-sm font-medium shadow transition"
                >
                  🗑️ Delete
                </button>
              )}
            </div>
          )}
        </div>
      </BackgroundGradient>
    </div>
  );
};

export default RoomCard;
