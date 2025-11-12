import { filterRooms } from "../models/RoomFilterModel.js";

export const getFilterRooms = async (req, res) => {
  const searchTerm = req.query.q || "";
  const sortOrder = req.query.sort || "";

  try {
    const rooms = await filterRooms(searchTerm, sortOrder);
    res.json(rooms);
  } catch (err) {
    console.error("Error filtering rooms:", err);
    res.status(500).json({ error: "Database error", details: err.message });
  }
};
