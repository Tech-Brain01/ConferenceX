import { filterRooms } from "../models/RoomFilterModel.js";

export const getFilterRooms = async (req, res) => {
  const searchTerm = req.query.q || "";
  const filterBy = req.query.filter;

  if (!searchTerm) return res.json([]);
  if (!filterBy || !["name", "feature"].includes(filterBy)) {
    return res
      .status(400)
      .json({ error: "Filter must be 'name' or 'feature'" });
  }

  try {
    const rooms = await filterRooms(searchTerm, filterBy);
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
};

