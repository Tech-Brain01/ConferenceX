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
import {
  formatDateForDisplay,
  formatDateToInputValue,
} from "../../utils/dateUtils.js";
import { Badge } from "../../components/ui/badge.jsx";
import {
  PencilIcon,
  CameraIcon,
  ArrowPathIcon,
  UsersIcon,
  CalendarDaysIcon,
  SparklesIcon,
} from "@heroicons/react/24/solid";

const AddRoom = () => {
  const [newRoom, setNewRoom] = useState({
    name: "",
    capacity_id: "",
    available_from: "",
    image: "",
    feature_ids: [],
  });

  const [capacities, setCapacities] = useState([]);
  const [features, setFeatures] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewRoom((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFeatureToggle = (id) => {
    setNewRoom((prev) => {
      const feature_ids = prev.feature_ids.includes(id)
        ? prev.feature_ids.filter((fid) => fid !== id)
        : [...prev.feature_ids, id];
      return { ...prev, feature_ids };
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewRoom((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    const missingFields = [];
    if (!newRoom.name) missingFields.push("Room name");
    if (!newRoom.capacity_id) missingFields.push("Capacity");
    if (!newRoom.available_from) missingFields.push("Available from");
    if (!newRoom.feature_ids) missingFields.push("feature");
    if (!newRoom.location) missingFields.push("Room location");
    if (!newRoom.price) missingFields.push("Room price");

    if (missingFields.length > 0) {
      toast.error(`Please fill in: ${missingFields.join(" , ")}`);
      return;
    }

    setIsSubmitting(true);
    const token = localStorage.getItem("token");

    const formData = new FormData();

    formData.append("name", newRoom.name);
    formData.append("capacity_id", newRoom.capacity_id);
    formData.append("available_from", newRoom.available_from);
    formData.append("location", newRoom.location);
    formData.append("price", newRoom.price);
    formData.append("feature_ids", JSON.stringify(newRoom.feature_ids));

    if (newRoom.image) {
      formData.append("image", newRoom.image);
    }

    try {
      const res = await fetch("http://localhost:8080/api/rooms", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Room created!");
        navigate("/admin");
      } else {
        toast.error("Create failed: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Create room error:", err);
      toast.error("An error occurred while creating the room.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const [capRes, featRes] = await Promise.all([
        fetch("http://localhost:8080/api/master/capacity"),
        fetch("http://localhost:8080/api/master/feature"),
      ]);

      const caps = await capRes.json();
      const feats = await featRes.json();

      setCapacities(caps.filter((c) => !c.hidden));
      setFeatures(feats.filter((f) => !f.hidden));
    };

    fetchData();
  }, []);

  return (
    <div className="flex justify-center py-10 px-4 bg-gray-50 dark:bg-zinc-900 min-h-screen">
      <BackgroundGradient
        containerClassName="max-w-3xl w-full rounded-3xl"
        className="p-8 sm:p-12 bg-white dark:bg-zinc-800 rounded-3xl shadow-xl transition-all"
        animate={true}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Create a New Room
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
              value={newRoom.name}
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
              value={newRoom.capacity_id}
              onChange={handleChange}
              className="mt-2 w-full px-4 py-2 border rounded-lg bg-white text-gray-900 dark:bg-zinc-700 dark:text-white focus:ring-2 focus:ring-cyan-400"
              required
            >
              <option value="" disabled>
                Select Capacity
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
              className="block text-gray-700 dark:text-gray-300 font-semibold"
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
                    : newRoom.available_from
                    ? formatDateForDisplay(newRoom.available_from)
                    : "Select date"}
                  <ChevronDownIcon className="stroke-cyan-600 w-5 h-5 ml-2" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-4 rounded-lg bg-white shadow-lg border border-cyan-200"
                align="start"
              >
                <Calendar
                  mode="single"
                  captionLayout="dropdown"
                  selected={
                    selectedDates ||
                    (newRoom.available_from
                      ? new Date(newRoom.available_from)
                      : undefined)
                  }
                  onSelect={(date) => {
                    setSelectedDates(date);
                    setNewRoom((prev) => ({
                      ...prev,
                      available_from: date.toISOString(),
                    }));
                    setOpen(false);
                  }}
                  disabled={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0); // normalize time to midnight
                    return date < today; // disable only dates before today, allow today
                  }}
                  className="
                                      bg-white text-cyan-800 rounded-lg
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
                    checked={newRoom.feature_ids?.includes(feature.id)}
                    onChange={() => handleFeatureToggle(feature.id)}
                    className="h-5 w-5 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                  />
                  {feature.name}
                </label>
              ))}
            </div>
            {/* Features preview badges */}
            <div className="mt-4 flex flex-wrap gap-2">
              {(newRoom.feature_ids || []).map((fid) => {
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
              value={newRoom.location}
              onChange={handleChange}
              placeholder="Enter room location"
              required
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm
               focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500
               dark:bg-zinc-800 dark:text-white dark:border-zinc-600"
            />
          </div>

          {/* Room Price Section */}
          <div>
            <Label
              htmlFor="price"
              className="block text-gray-700 dark:text-gray-300 font-semibold"
            >
              💰Price
            </Label>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="text-cyan-300 text-lg font-semibold">
                ₹{newRoom.price || 0}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-white">Manual:</span>
                <Input
                  type="number"
                  name="price"
                  value={newRoom.price}
                  onChange={(e) =>
                    setNewRoom((prev) => ({ ...prev, price: e.target.value }))
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
              value={newRoom.price || 0}
              onChange={(e) =>
                setNewRoom((prev) => ({
                  ...prev,
                  price: e.target.value,
                }))
              }
              className="w-full h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg appearance-none cursor-pointer
              focus:outline-none focus:ring-2 focus:ring-cyan-400 dark:bg-zinc-700"
            />
          </div>

          {/* Image Filename */}
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

          {/* update Button */}
          <div className="flex justify-center mt-10 ">
            <Button
              type="button"
              onClick={() => setShowConfirmDialog(true)}
              disabled={isSubmitting}
              variant="primary"
              className="border rounded-full hover:bg-slate-400"
            >
              {isSubmitting ? "Creating..." : "created a Room"}
            </Button>
          </div>
        </form>

        {/* Confirmation Dialog */}
        <AlertDialog
          open={showConfirmDialog}
          onOpenChange={setShowConfirmDialog}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to Create this room?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel asChild>
                <Button variant="outline">Cancel</Button>
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? "Updating..." : "Yes, Update"}
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </BackgroundGradient>
    </div>
  );
};

export default AddRoom;
