import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RoomCard from "../../components/RoomCard.jsx";
import { toast } from "sonner";
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
    fetchRooms();
  }, []);

  return (
    <div className="p-6 ">
      <h1 className="text-4xl font-bold mb-8 text-center text-indigo-700 dark:text-indigo-400">
        Manage Rooms
      </h1>

      <div className="flex items-center justify-end gap-4 mb-6 ">
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
        rooms.map((room) => (
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
    </div>
  );
};

export default ManageRooms;
