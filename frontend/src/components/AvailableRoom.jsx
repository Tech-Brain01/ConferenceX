import React, { useEffect, useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "./ui/table";
import { format } from "date-fns";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "./ui/pagination";

const AvailableRoom = ({ filterDate }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [sortConfig, setSortConfig] = useState({
    key: "srNo",
    direction: "asc",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 10;

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  useEffect(() => {
    async function fetchAvailableRooms() {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (!filterDate?.fromDate || !filterDate?.toDate) return;

        const from = format(filterDate.fromDate, "yyyy-MM-dd");
        const to = format(filterDate.toDate, "yyyy-MM-dd");

        const url = `http://localhost:8080/api/admin/dashboard/available-rooms?from=${from}&to=${to}`;

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Failed to fetch available rooms");

        const data = await res.json();
        setRooms(data);
        setCurrentPage(1);
      } catch (err) {
        console.error("Failed to fetch available rooms:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAvailableRooms();
  }, [filterDate]);

  // Sorting logic
  const sortedRooms = useMemo(() => {
    let sorted = [...rooms];
    if (sortConfig.key === "name") {
      sorted.sort((a, b) =>
        sortConfig.direction === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
      );
    }
    if (sortConfig.key === "srNo" && sortConfig.direction === "desc") {
      sorted.reverse();
    }
    return sorted;
  }, [rooms, sortConfig]);

  // Pagination logic
  const totalPages = Math.ceil(sortedRooms.length / roomsPerPage);
  const indexOfLast = currentPage * roomsPerPage;
  const indexOfFirst = indexOfLast - roomsPerPage;
  const currentRooms = sortedRooms.slice(indexOfFirst, indexOfLast);

  const getPageItems = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, "ellipsis", totalPages];
    }

    if (currentPage >= totalPages - 3) {
      return [
        1,
        "ellipsis",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      "ellipsis",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "ellipsis",
      totalPages,
    ];
  };

  const renderSortArrow = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? " ↑" : " ↓";
  };

  return (
    <Card className="p-6 bg-white shadow-lg rounded-xl border border-gray-200">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-800">
          Available Rooms
        </CardTitle>
      </CardHeader>

      <CardContent className="overflow-x-auto">
        {loading ? (
          <div className="flex justify-center py-12">Loading...</div>
        ) : rooms.length === 0 ? (
          <p className="text-center text-gray-500 font-medium py-12">
            No available rooms found.
          </p>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow className="bg-green-100">
                  <TableHead
                    className="cursor-pointer px-4"
                    onClick={() => handleSort("srNo")}
                  >
                    Sr No {renderSortArrow("srNo")}
                  </TableHead>

                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("name")}
                  >
                    Room Name {renderSortArrow("name")}
                  </TableHead>

                  <TableHead>Status</TableHead>
                  <TableHead>Availability Ranges</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {currentRooms.map((room, idx) => (
                  <TableRow className="bg-green-50" key={room.id}>
                    <TableCell className="px-4">
                      {indexOfFirst + idx + 1}
                    </TableCell>

                    <TableCell>{room.name}</TableCell>

                    <TableCell>
                      <span className="px-3 py-1 bg-green-600 text-white rounded-md text-sm">
                        Available
                      </span>
                    </TableCell>

                    <TableCell className="px-6">
                      {room.available_ranges?.length > 0 ? (
                        <ul className="space-y-1">
                          {room.available_ranges.map((range, i) => (
                            <li
                              key={i}
                              className="bg-green-200 px-2 py-1 rounded text-xs"
                            >
                              {format(new Date(range.from), "dd MMM yyyy")} →{" "}
                              {format(new Date(range.to), "dd MMM yyyy")}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-gray-400 text-sm">
                          No free slots
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination className="mt-8 bg-green-200 rounded-md p-1 shadow-md flex justify-center gap-2">
                <PaginationPrevious
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                />

                <PaginationContent>
                  {getPageItems().map((item, index) =>
                    item === "ellipsis" ? (
                      <PaginationItem key={index}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={item}>
                        <PaginationLink
                          isActive={item === currentPage}
                          onClick={() => setCurrentPage(item)}
                        >
                          {item}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}
                </PaginationContent>

                <PaginationNext
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                />
              </Pagination>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AvailableRoom;
