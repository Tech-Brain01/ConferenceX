import pool from "./db.js";

export const filterRooms = async (searchTerm, filterBy, sortOrder) => {
  if (!searchTerm) return [];

  if (!["name", "feature"].includes(filterBy)) {
    throw new Error("Filter must be 'name' or 'feature'");
  }

  let query = `
    SELECT 
      r.id,
      r.name,
      r.location,
      r.price,
      c.capacity,
      r.image,
      STRING_AGG(DISTINCT f.name, ',' ORDER BY f.name ASC) AS features
    FROM rooms r
    LEFT JOIN capacity c ON r.id = c.room_id
    LEFT JOIN room_features rf ON r.id = rf.room_id
    LEFT JOIN features f ON rf.feature_id = f.id
  `;

  let params = [];

  if (filterBy === "name") {
    query += " WHERE r.name ILIKE $1";
    params.push(`%${searchTerm}%`);
  } else if (filterBy === "feature") {
    query += " WHERE f.name ILIKE $1";
    params.push(`%${searchTerm}%`);
  }

  query += " GROUP BY r.id, r.name, r.location, r.price, c.capacity, r.image";

  if (sortOrder === "low-to-high") {
    query += " ORDER BY r.price ASC";
  } else if (sortOrder === "high-to-low") {
    query += " ORDER BY r.price DESC";
  } else {
    query += " ORDER BY r.name ASC";
  }

  query += " LIMIT 10";

  const result = await pool.query(query, params);

  return result.rows.map((r) => ({
    ...r,
    features: r.features ? r.features.split(",") : [],
  }));
};
