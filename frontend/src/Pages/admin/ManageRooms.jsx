import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RoomCard from "../../components/RoomCard.jsx";
import { toast } from "sonner";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { cn } from "../../lib/utils.js";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "../../components/ui/pagination.jsx";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "../../components/ui/dialog.jsx";
import { FileUpload } from "../../components/ui/file-upload.jsx";

const ManageRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 6;
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const fetchRooms = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/rooms");
      if (!res.ok) throw new Error("Failed to fetch rooms");
      const data = await res.json();
      // console.log("ROOMS:", data);
      setRooms(data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteRoom = async (id) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:8080/api/rooms/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errData = await res.json();
        toast.error(errData.error || "Failed to delete room");
        return;
      }

      toast.success("Room deleted");
      fetchRooms();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setRoomToDelete(null);
      setIsDialogOpen(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchRooms();
  }, []);

  const totalPages = Math.ceil(rooms.length / roomsPerPage);
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = rooms.slice(indexOfFirstRoom, indexOfLastRoom);

  const getPageItems = () => {
    if (totalPages <= 7) {
      return [...Array(totalPages).keys()].map((n) => n + 1);
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, "ellipsis", totalPages];
    }

    if (currentPage >= totalPages - 3) {
      return [
        1,
        "ellipsis",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      "ellipsis",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "ellipsis",
      totalPages,
    ];
  };

  return (
    <div className="p-6 ">
      <h1 className="text-4xl font-bold mb-8 text-center text-indigo-700 dark:text-indigo-400">
        Manage Rooms
      </h1>

      <div className="flex justify-between items-center mb-6">
        <p className="text-black bg-indigo-100 p-2 rounded-lg">
          Total Rooms: {rooms.length}
        </p>
        <button
          onClick={() => navigate("/admin/rooms/add")}
          className="px-8 py-2 rounded-full bg-amber-700 text-sm hover:shadow-amber/[0.1] transition duration-200 border border-slate-600"
        >
          + Add Room
        </button>
      </div>

      {rooms.length === 0 ? (
        <p>No rooms found.</p>
      ) : (
        currentRooms.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            onEdit={() => navigate(`/admin/rooms/edit/${room.id}`)}
            onDelete={() => {
              setRoomToDelete(room.id);
              setIsDialogOpen(true);
            }}
          />
        ))
      )}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Room</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this room? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <button className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-black">
                Cancel
              </button>
            </DialogClose>
            <button
              className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
              onClick={() => roomToDelete && deleteRoom(roomToDelete)}
            >
              Confirm
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {!loading && totalPages > 1 && (
        <Pagination
          aria-label="Pagination Navigation"
          className="mt-8 bg-white dark:bg-gray-800 rounded-md p-3 shadow-md flex items-center justify-center gap-4"
        >
          <PaginationPrevious
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1 rounded-md px-3 py-2 text-indigo-600 hover:bg-indigo-100 disabled:text-gray-400 disabled:cursor-not-allowed transition"
          />

          <PaginationContent className="flex gap-2">
            {getPageItems().map((item, index) =>
              item === "ellipsis" ? (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis className="text-gray-400 select-none" />
                </PaginationItem>
              ) : (
                <PaginationItem key={item}>
                  <PaginationLink
                    isActive={item === currentPage}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(item);
                    }}
                    href="#"
                    className={cn(
                      "rounded-md px-3 py-2 text-sm font-medium transition",
                      item === currentPage
                        ? "bg-indigo-600 text-white shadow-md hover:bg-indigo-700"
                        : "text-gray-700 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    )}
                  >
                    {item}
                  </PaginationLink>
                </PaginationItem>
              )
            )}
          </PaginationContent>

          <PaginationNext
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 rounded-md px-3 py-2 text-indigo-600 hover:bg-indigo-100 disabled:text-gray-400 disabled:cursor-not-allowed transition"
          />
        </Pagination>
      )}
    </div>
  );
};

export default ManageRooms;
