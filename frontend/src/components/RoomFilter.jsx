import React, { useState, useEffect, useCallback } from "react";
import { Input } from "./ui/input";
import axios from "axios";
import _ from "lodash";
import { FiSearch, FiX } from "react-icons/fi";

const RoomFilter = ({ onResults }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  // Debounced fetch function
  const fetchRooms = useCallback(
    _.debounce(async (term, sort) => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:8080/api/filter/search-room?q=${encodeURIComponent(term)}&sort=${sort}`
        );
        const data = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data.results)
          ? response.data.results
          : [];

        onResults(data);

        // Update suggestions only with room names
        if (term) {
          setSuggestions(data.map((room) => room.name));
        } else {
          setSuggestions([]);
        }
      } catch (err) {
        console.error("Error fetching rooms:", err);
        onResults([]);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    fetchRooms(searchTerm, sortOrder);
  }, [searchTerm, sortOrder, fetchRooms]);

  const clearSearch = () => setSearchTerm("");

  const selectSuggestion = (name) => {
    setSearchTerm(name);
    setSuggestions([]); // hide dropdown
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-4 p-4 bg-gray-800 rounded-lg shadow-md relative">
      <div className="flex flex-1 gap-2 w-full md:w-2/3 relative">
        <div className="relative w-full">
          <Input
            type="text"
            placeholder="Search by Room Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-10 rounded-md text-gray-900 bg-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 transition"
          />
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          {searchTerm && (
            <FiX
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer hover:text-gray-700"
              onClick={clearSearch}
            />
          )}

          {/* Auto-suggestions dropdown */}
          {suggestions.length > 0 && (
            <ul className="absolute z-50 w-full bg-white text-gray-900 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
              {suggestions.map((name, idx) => (
                <li
                  key={idx}
                  className="p-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => selectSuggestion(name)}
                >
                  {name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="flex w-full md:w-1/3 justify-end">
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="p-2 rounded-md text-gray-900 bg-gray-200 hover:bg-gray-300 transition"
        >
          <option value="">Sort by Price</option>
          <option value="low-to-high">Low to High</option>
          <option value="high-to-low">High to Low</option>
        </select>
      </div>

      {loading && (
        <div className="w-full flex justify-center mt-2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400"></div>
        </div>
      )}
    </div>
  );
};

export default RoomFilter;
