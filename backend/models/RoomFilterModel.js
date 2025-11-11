import pool from "./db.js";

export const filterRooms = async (searchTerm, filterBy) => {
  if (!searchTerm) return [];

  if (!["name", "feature"].includes(filterBy)) {
    throw new Error("Filter must be 'name' or 'feature'");
  }

  let query = `
    SELECT DISTINCT r.id, r.name, r.location, r.price, r.image
    FROM rooms r
    LEFT JOIN room_features rf ON r.id = rf.room_id
    LEFT JOIN features f ON rf.feature_id = f.id
  `;

  let params = [];

  if (filterBy === "name") {
    query += " WHERE r.name LIKE ?";
    params.push(`%${searchTerm}%`);
  } else if (filterBy === "feature") {
    query += " WHERE f.name LIKE ?";
    params.push(`%${searchTerm}%`);
  }

  query += " LIMIT 10";

  try {
    const [rows] = await pool.query(query, params);
    return rows;
  } catch (err) {
    throw err;
  }
};
