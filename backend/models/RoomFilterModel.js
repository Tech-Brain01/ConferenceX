import pool from "./db.js";

export const filterRooms = async (searchTerm, sortOrder) => {

  let query = `
    SELECT 
      r.id,
      r.name,
      r.location,
      r.price,
      c.capacity,
      r.image,
      GROUP_CONCAT(DISTINCT f.name ORDER BY f.name ASC SEPARATOR ',') AS features
    FROM rooms r
    LEFT JOIN capacities c ON r.capacity_id = c.id
    LEFT JOIN room_features rf ON r.id = rf.room_id
    LEFT JOIN features f ON rf.feature_id = f.id
  `;

  const params = [];

  if (searchTerm) {
    query += " WHERE r.name LIKE ?";
    params.push(`%${searchTerm}%`);
  }

  query += " GROUP BY r.id";

  if (sortOrder === "low-to-high") {
    query += " ORDER BY r.price ASC";
  } else if (sortOrder === "high-to-low") {
    query += " ORDER BY r.price DESC";
  }

  query += " LIMIT 10";

  const [rows] = await pool.query(query, params);

  return rows.map((r) => ({
    ...r,
    features: r.features ? r.features.split(",") : [],
  }));
};

