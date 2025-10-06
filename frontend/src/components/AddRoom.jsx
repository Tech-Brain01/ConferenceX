import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AddRoom = () => {
  const [newRoom, setNewRoom] = useState({
  name: "",
  capacity_id: "",
  available_from: "",
  image: "OIP.webp",
  feature_ids: [], 
});


  const [capacities, setCapacities] = useState([]);
  const [features, setFeatures] = useState([]);
  const navigate = useNavigate();

  const formatDateForMySQL = (dateInput) => {
    const d = new Date(dateInput);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const createRoom = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("NOT authorized");

    const roomToSend = {
      ...newRoom,
      available_from: formatDateForMySQL(newRoom.available_from),
    };

    try {
      const res = await fetch("http://localhost:8080/api/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(roomToSend),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Room created!");
        navigate("/admin");
      } else {
        alert("Create failed: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Create room error:", err);
      alert("An error occurred while creating the room.");
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

      // Filter: show only non-hidden and non-deleted
      setCapacities(caps.filter((c) => !c.hidden));
      setFeatures(feats.filter((f) => !f.hidden));
    };

    fetchData();
  }, []);

  const toggleFeature = (id) => {
    setNewRoom((prev) => {
      const feature_ids = prev.feature_ids.includes(id)
        ? prev.feature_ids.filter((fid) => fid !== id)
        : [...prev.feature_ids, id];
      return { ...prev, feature_ids };
    });
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-lg mx-auto p-24 rounded-xl">
        <h2 className="text-2xl font-bold mb-6 text-white">Add New Room</h2>

        {/* Room name */}
        <input
          type="text"
          placeholder="Room name"
          value={newRoom.name}
          onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
          className="w-full mb-4 p-2 rounded text-black"
        />

        {/* Capacity */}
        <select
          value={newRoom.capacity_id}
          onChange={(e) =>
            setNewRoom({ ...newRoom, capacity_id: e.target.value })
          }
          className="w-full mb-4 p-2 rounded text-black"
        >
          <option value="">Select Capacity</option>
          {capacities.map((cap) => (
            <option key={cap.id} value={cap.id}>
              {cap.capacity}
            </option>
          ))}
        </select>

        {/* Date */}
        <input
          type="date"
          value={newRoom.available_from}
          onChange={(e) =>
            setNewRoom({ ...newRoom, available_from: e.target.value })
          }
          className="w-full mb-4 p-2 rounded text-black"
        />

        {/* Image */}
        <input
          type="text"
          placeholder="Image filename"
          value={newRoom.image}
          onChange={(e) =>
            setNewRoom({ ...newRoom, image: e.target.value })
          }
          className="w-full mb-6 p-2 rounded text-black"
        />

        {/* Features */}
        <div className="mb-4">
          <label className="text-white font-semibold mb-2 block">
            Features:
          </label>
          {features.map((feat) => (
            <div key={feat.id} className="text-white">
              <label>
                <input
                  type="checkbox"
                  checked={newRoom.feature_ids.includes(feat.id)}
                  onChange={() => toggleFeature(feat.id)}
                  className="mr-2"
                />
                {feat.name}
              </label>
            </div>
          ))}
        </div>

        <button
          onClick={createRoom}
          className="bg-green-500 px-4 py-2 rounded hover:bg-green-400 text-white"
        >
          Create Room
        </button>
      </div>
    </div>
  );
};

export default AddRoom;
