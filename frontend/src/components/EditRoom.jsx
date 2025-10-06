import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

const EditRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [roomData, setRoomData] = useState(null);
  const [capacities, setCapacities] = useState([]);
  const [features, setFeatures] = useState([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomRes, capacitiesRes, featuresRes] = await Promise.all([
          fetch(`http://localhost:8080/api/rooms/${id}`),
          fetch("http://localhost:8080/api/master/capacity"),
          fetch("http://localhost:8080/api/master/feature"),
        ]);

        const roomData = await roomRes.json();
        const capacitiesData = await capacitiesRes.json();
        const featuresData = await featuresRes.json();

        setRoomData(roomData);
        setCapacities(capacitiesData);
        setFeatures(featuresData);
      } catch (error) {
        toast.error("Failed to load data");
      }
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

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:8080/api/rooms/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(roomData),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("Room updated successfully");
        navigate("/admin");
      } else {
        toast.error(result.error || "Update failed");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  if (!roomData) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-8 max-w-3xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-slate-800">Edit Room</h2>

      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Room Name</Label>
          <Input
            id="name"
            name="name"
            value={roomData.name}
            onChange={handleChange}
            placeholder="Enter room name"
          />
        </div>

        <div>
          <Label htmlFor="capacity">Capacity</Label>
          <select
            id="capacity"
            name="capacity_id"
            value={roomData.capacity_id || ""}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2 text-sm"
          >
            <option value="">Select capacity</option>
            {capacities
              .filter((cap) => cap.hidden === 0)
              .map((cap) => (
                <option key={cap.id} value={cap.id}>
                  {cap.capacity}
                </option>
              ))}
          </select>
        </div>

        <div>
          <Label htmlFor="available_from">Available From</Label>
          <Input
            type="date"
            id="available_from"
            name="available_from"
            value={roomData.available_from?.slice(0, 10)}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label htmlFor="image">Image Filename</Label>
          <Input
            id="image"
            name="image"
            value={roomData.image || ""}
            onChange={handleChange}
            placeholder="e.g., room1.jpg"
          />
        </div>

        <div>
          <Label>Features</Label>
          <div className="flex flex-wrap gap-3 mt-2">
            {features.map((feature) => (
              <label
                key={feature.id}
                className="flex items-center space-x-2 text-sm"
              >
                <input
                  type="checkbox"
                  checked={roomData.feature_ids?.includes(feature.id)}
                  onChange={() => handleFeatureToggle(feature.id)}
                />
                <span>{feature.name}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Button onClick={() => setShowConfirmDialog(true)}>
          Update Room
        </Button>
      </div>

      {/* Alert Dialog for Confirmation */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Update</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to update this room? Changes will be saved
              permanently.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="outline">Cancel</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button onClick={handleSubmit}>Yes, Update</Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EditRoom;
