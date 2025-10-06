import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Input } from "../../components/ui/input.jsx";
import { Label } from "../../components/ui/label.jsx";
import { Button } from "../../components/ui/Button.jsx";
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
} from "../../components/ui/alert_dialog.jsx";
import { BackgroundGradient } from "../../components/ui/background-gradient.jsx";
import { Calendar } from "../../components/ui/calendar.jsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover.jsx";
import { ChevronDownIcon } from "lucide-react";
import { formatDateForDisplay } from "../../utils/dateUtils.js";
import { Badge } from "../../components/ui/badge.jsx";
import {
  PencilIcon,
  CameraIcon,
  ArrowPathIcon,
  UsersIcon,
  CalendarDaysIcon,
  SparklesIcon,
} from "@heroicons/react/24/solid";

const EditRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [roomData, setRoomData] = useState(null);
  const [capacities, setCapacities] = useState([]);
  const [features, setFeatures] = useState([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDates, setSelectedDates] = useState(null);
  const [open, setOpen] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imageName, setImageName] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const [roomRes, capacitiesRes, featuresRes] = await Promise.all([
        fetch(`http://localhost:8080/api/rooms/${id}`),
        fetch("http://localhost:8080/api/master/capacity"),
        fetch("http://localhost:8080/api/master/feature"),
      ]);

      const room = await roomRes.json();
      const caps = await capacitiesRes.json();
      const feats = await featuresRes.json();

      const feature_ids = room.features?.map((f) => f.id) || [];

      setRoomData({ ...room, feature_ids });
      setCapacities(caps);
      setFeatures(feats);
      setImageName(room.image || " ");
      setImagePreview(
        room.image ? `http://localhost:8080/uploads/${room.image}` : null
      );
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoomData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFeatureToggle = (featureId) => {
    const current = roomData.feature_ids || [];
    const updated = current.includes(featureId)
      ? current.filter((id) => id !== featureId)
      : [...current, featureId];
    setRoomData((prev) => ({ ...prev, feature_ids: updated }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setImageName("");
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const token = localStorage.getItem("token");
    const formData = new FormData();

    formData.append("name", roomData.name);
    formData.append("capacity_id", roomData.capacity_id);
    formData.append("available_from", roomData.available_from);
    formData.append("location", roomData.location);
    formData.append("price", roomData.price);
    formData.append("feature_ids", JSON.stringify(roomData.feature_ids));
    if (imageFile instanceof File) {
      formData.append("image", imageFile);
    } else if (imageName) {
      formData.append("image", imageName);
    }

    try {
      const res = await fetch(`http://localhost:8080/api/rooms/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        const refetch = await fetch(`http://localhost:8080/api/rooms/${id}`);
        const updated = await refetch.json();
        const updatedFeatureIds = updated.features?.map((f) => f.id) || [];
        setRoomData({ ...updated, feature_ids: updatedFeatureIds });

        toast.success("Room updated successfully!");
        setShowConfirmDialog(false);
        navigate("/admin");
      } else {
        toast.error(result.error || "Update failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!roomData) {
    return (
      <div className="flex justify-center items-center py-20 text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex justify-center py-10 px-4 bg-gray-50 dark:bg-zinc-900 min-h-screen">
      <BackgroundGradient
        containerClassName="max-w-3xl w-full rounded-3xl"
        className="p-8 sm:p-12 bg-white dark:bg-zinc-800 rounded-3xl shadow-xl transition-all"
        animate={true}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Edit Room
          </h2>
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-black hover:text-gray-900 dark:hover:text-black transition"
          >
            <ArrowPathIcon className="w-5 h-5 rotate-180" />
            Back
          </Button>
        </div>

        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            setShowConfirmDialog(true);
          }}
        >
          {/* Room Name */}
          <div>
            <Label
              htmlFor="name"
              className="block text-gray-700 dark:text-gray-300 font-semibold"
            >
              <PencilIcon className="inline w-5 h-5 mr-2 text-cyan-500" />
              Room Name
            </Label>
            <Input
              id="name"
              name="name"
              value={roomData.name}
              onChange={handleChange}
              placeholder="Enter room name"
              className="mt-2 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-400"
              required
            />
          </div>

          {/* Capacity */}
          <div>
            <Label
              htmlFor="capacity_id"
              className="block text-gray-700 dark:text-gray-300 font-semibold"
            >
              <UsersIcon className="inline w-5 h-5 mr-2 text-red-500" />
              Capacity
            </Label>
            <select
              id="capacity_id"
              name="capacity_id"
              value={roomData.capacity_id || ""}
              onChange={handleChange}
              className="mt-2 w-full px-4 py-2 border rounded-lg bg-white text-gray-900 dark:bg-zinc-700 dark:text-white focus:ring-2 focus:ring-cyan-400"
              required
            >
              <option value="" disabled>
                Choose capacity
              </option>
              {capacities.map((cap) => (
                <option key={cap.id} value={cap.id}>
                  {cap.capacity}
                </option>
              ))}
            </select>
          </div>

          {/* Available From */}
          <div>
            <Label
              htmlFor="available_from"
              className="block text-gray-700 dark:text-gray-300 font-semibold mb-4"
            >
              🗓Available From
            </Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="date"
                  className="flex justify-between items-center w-48 px-4 py-2 border-2 border-cyan-500 rounded-md
                                      text-cyan-700 font-medium shadow-sm
                                      hover:bg-cyan-50 hover:border-cyan-600
                                      focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-1
                                      transition-colors duration-200"
                >
                  {selectedDates
                    ? formatDateForDisplay(selectedDates)
                    : roomData.available_from
                    ? formatDateForDisplay(roomData.available_from)
                    : "Select Date"}
                  <ChevronDownIcon className="w-5 h-5 text-cyan-600 ml-2" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="mt-1 bg-white dark:bg-zinc-700 border border-cyan-200 rounded-lg shadow-lg p-4">
                <Calendar
                  mode="single"
                  captionLayout="dropdown"
                  selected={
                    selectedDates ||
                    (roomData.available_from
                      ? new Date(roomData.available_from)
                      : undefined)
                  }
                  onSelect={(date) => {
                    setSelectedDates(date);
                    setRoomData((prev) => ({
                      ...prev,
                      available_from: date.toISOString(),
                    }));
                    setOpen(false);
                  }}
                  disabled={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0); 
                    return date < today; 
                  }}
                  className="
                                      bg-white text-black rounded-lg
                                      [&_button]:rounded-md [&_button]:p-2 [&_button]:transition-colors
                                      [&_button:hover]:bg-cyan-100 [&_button:hover]:text-cyan-900
                                      [&_button:focus-visible]:ring-2 [&_button:focus-visible]:ring-cyan-400
                                      [&_button[data-selected]]:bg-cyan-600 [&_button[data-selected]]:text-white
                                      [&_button[data-selected]]:shadow-md
                                      [&_button[disabled]]:opacity-40 [&_button[disabled]]:cursor-not-allowed
                                    "
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Features */}
          <div>
            <Label className="block text-gray-700 dark:text-gray-300 font-semibold">
              ✨Features
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
              {features.map((feature) => (
                <label
                  key={feature.id}
                  className="flex items-center gap-2 text-sm text-gray-800 dark:text-gray-200 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={roomData.feature_ids?.includes(feature.id)}
                    onChange={() => handleFeatureToggle(feature.id)}
                    className="h-5 w-5 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                  />
                  {feature.name}
                </label>
              ))}
            </div>

            {/* Preview Badges */}
            <div className="mt-4 flex flex-wrap gap-2">
              {roomData.feature_ids?.map((fid) => {
                const feat = features.find((f) => f.id === fid);
                if (!feat) return null;
                return (
                  <Badge
                    key={fid}
                    variant="cyan"
                    className="text-black text-sm"
                  >
                    {feat.name}
                  </Badge>
                );
              })}
            </div>
          </div>

          {/* Room Location */}
          <div className="mt-5">
            <Label
              htmlFor="location"
              className="block text-white dark:text-gray-300 text-md font-medium mb-2"
            >
              📍Location
            </Label>
            <Input
              id="location"
              name="location"
              value={roomData.location}
              onChange={handleChange}
              placeholder="Enter room location"
              required
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm
                         focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500
                         dark:bg-zinc-800 dark:text-white dark:border-zinc-600"
            />
          </div>

          {/* Price */}
          <div>
            <Label
              htmlFor="price"
              className="block text-gray-700 dark:text-gray-300 font-semibold"
            >
              💰Price
            </Label>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="text-cyan-300 text-lg font-semibold">
                ₹{roomData.price || 0}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-white">Manual:</span>
                <Input
                  type="number"
                  name="price"
                  value={roomData.price}
                  onChange={(e) =>
                    setRoomData((prev) => ({ ...prev, price: e.target.value }))
                  }
                  placeholder="Enter price"
                  className="w-32 px-3 py-1 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 dark:bg-zinc-800 dark:text-white dark:border-zinc-600"
                  min={0}
                  max={10000}
                />
              </div>
            </div>

            <Input
              type="range"
              id="price"
              name="price"
              min="0"
              max="10000"
              step="100"
              value={roomData.price || 0}
              onChange={(e) =>
                setRoomData((prev) => ({
                  ...prev,
                  price: e.target.value,
                }))
              }
              className="w-full h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg appearance-none cursor-pointer
                         focus:outline-none focus:ring-2 focus:ring-cyan-400 dark:bg-zinc-700"
            />
          </div>

          {/* Image Upload */}
          <div>
            <Label
              htmlFor="image"
              className="block text-gray-700 dark:text-gray-300 font-semibold"
            >
              <CameraIcon className="inline w-5 h-5 mr-2 text-purple-500" />
              Room Image
            </Label>
            <div className="mt-2 flex items-center gap-4">
              <Input
                id="image"
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="py-2 px-4 border rounded-lg bg-white dark:bg-zinc-700 dark:text-white"
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Room Preview"
                  className="w-24 h-24 object-cover rounded-lg border border-gray-300 dark:border-zinc-600 shadow-sm"
                />
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-6 mt-12 ">
            <Button
              variant="destructive"
              onClick={() => setShowConfirmDialog(false)}
              className="px-6 py-2 text-black 0 border-gray-400 hover:bg-gray-100 "
            >
              Cancel
            </Button>
            <Button
              variant="success"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2"
            >
              {isSubmitting ? "Updating..." : "Update Room"}
            </Button>
          </div>
        </form>

        {/* Confirmation Dialog */}
        <AlertDialog
          open={showConfirmDialog}
          onOpenChange={setShowConfirmDialog}
        >
          <AlertDialogContent className="rounded-xl shadow-lg">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-lg font-bold text-red-600">
                Confirm Update
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-gray-600 dark:text-gray-400">
                Are you sure you want to save changes to this room? 🛠️
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-4 flex justify-end gap-3">
              <AlertDialogCancel asChild>
                <button className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-zinc-700 dark:text-gray-200 dark:hover:bg-zinc-600">
                  No, Cancel
                </button>
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white font-semibold transition"
                >
                  Yes, Update
                </button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </BackgroundGradient>
    </div>
  );
};

export default EditRoom;
