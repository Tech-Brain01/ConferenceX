import React, { useState, useEffect, useCallback } from "react";
import { Input } from "./ui/input";
import axios from "axios";
import _ from "lodash";

const RoomFilter = ({ onResults, sortOrder, setSortOrder }) => {
  const [filters, setFilters] = useState({
    combined: "",
    type: "name",
  });
  const [loading, setLoading] = useState(false);

  const fetchFilteredRooms = useCallback(
    _.debounce(async (searchTerm, filterType) => {
      if (!searchTerm) {
        onResults([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          `/api/filter/search-room?q=${encodeURIComponent(
            searchTerm
          )}&filter=${filterType}`
        );
        onResults(response.data || []);
      } catch (err) {
        console.error("Error fetching rooms:", err);
        onResults([]);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    fetchFilteredRooms(filters.combined, filters.type);
  }, [filters.combined, filters.type, fetchFilteredRooms]);

 return (
    <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-gray-800 rounded-lg">
      {/* Left side: filter selector + search input */}
      <div className="flex w-2/3 gap-2">
        <select
          value={filters.type}
          onChange={(e) =>
            setFilters({ ...filters, type: e.target.value })
          }
          className="p-2 rounded-md text-gray-900"
        >
          <option value="name">Room Name</option>
          <option value="feature">Feature</option>
        </select>

        <Input
          type="text"
          placeholder={`Search by ${filters.type === "name" ? "Name" : "Feature"}`}
          value={filters.combined}
          onChange={(e) =>
            setFilters({ ...filters, combined: e.target.value })
          }
          className="w-full p-2 rounded-md text-gray-900"
        />
      </div>

      {/* Right side: sort by price */}
      <div className="flex w-1/3 justify-end">
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="p-2 rounded-md text-gray-900"
        >
          <option value="">Sort by Price</option>
          <option value="low-to-high">Low to High</option>
          <option value="high-to-low">High to Low</option>
        </select>
      </div>

      {/* Loading indicator */}
      {loading && <p className="w-full text-gray-300 mt-2">Loading...</p>}
    </div>
  );
};

export default RoomFilter;