import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table.jsx";
import { Input } from "./ui/input.jsx";
import { Checkbox } from "./ui/checkbox.jsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog.jsx";
import { Button } from "./ui/Button.jsx";
import { toast, Toaster } from "sonner";

const ConfirmDialog = ({ open, setOpen, title, description, onConfirm }) => (
  <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogFooter className="flex justify-end space-x-3">
        <Button variant="secondary" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button
          variant="destructive"
          onClick={() => {
            onConfirm();
            setOpen(false);
          }}
        >
          Confirm
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

const MasterDataManagement = () => {
  const [capacities, setCapacities] = useState([]);
  const [features, setFeatures] = useState([]);
  const [newCapacity, setNewCapacity] = useState("");
  const [newFeature, setNewFeature] = useState("");
  const [editCapacity, setEditCapacity] = useState(null);
  const [editFeature, setEditFeature] = useState(null);
  const [loading, setLoading] = useState(false);

  const [deleteCapId, setDeleteCapId] = useState(null);
  const [deleteFeatId, setDeleteFeatId] = useState(null);

  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const fetchData = async () => {
    try {
      const [capRes, featRes] = await Promise.all([
        fetch("http://localhost:8080/api/master/capacity"),
        fetch("http://localhost:8080/api/master/feature"),
      ]);
      if (!capRes.ok || !featRes.ok) throw new Error("Failed to fetch data");
      const cap = await capRes.json();
      const feat = await featRes.json();
      setCapacities(cap);
      setFeatures(feat);
    } catch (error) {
      toast.error(`Error fetching data: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddCapacity = async () => {
    if (!newCapacity.trim()) {
      toast.error("Please enter a capacity");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/master/capacity", {
        method: "POST",
        headers,
        body: JSON.stringify({ capacity: newCapacity.trim() }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to add capacity");
      }
      setNewCapacity("");
      toast.success("Capacity added");
      fetchData();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFeature = async () => {
    if (!newFeature.trim()) {
      toast.error("Please enter a feature");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/master/feature", {
        method: "POST",
        headers,
        body: JSON.stringify({ name: newFeature.trim() }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to add feature");
      }
      setNewFeature("");
      toast.success("Feature added");
      fetchData();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCapacity = async (id, capacity, hidden) => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8080/api/master/capacity/${id}`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify({ capacity, hidden: hidden ? 1 : 0 }),
        }
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update capacity");
      }
      toast.success("Capacity updated");
      fetchData();
      setEditCapacity(null);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateFeature = async (id, name, hidden) => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8080/api/master/feature/${id}`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify({ name, hidden }),
        }
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update feature");
      }
      toast.success("Feature updated");
      fetchData();
      setEditFeature(null);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCapacity = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8080/api/master/capacity/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to delete capacity");
      toast.success("Capacity deleted");
      fetchData();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFeature = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8080/api/master/feature/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to delete feature");
      toast.success("Feature deleted");
      fetchData();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-10">
        <h1 className="text-4xl font-extrabold mb-10 text-gray-900 tracking-tight">
          Master Admin: Capacities & Features
        </h1>

        {/* Capacities Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-6 text-gray-800 border-b border-gray-300 pb-2">
            Capacities
          </h2>

          <div className="flex mb-6 space-x-4">
            <Input
              type="text"
              value={newCapacity}
              onChange={(e) => setNewCapacity(e.target.value)}
              placeholder="Add new capacity"
              className="flex-grow rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500"
              disabled={loading}
            />
            <Button
              onClick={handleAddCapacity}
              disabled={loading}
              className="px-6 py-2"
              variant="primary"
            >
              Add Capacity
            </Button>
          </div>

          <Table className="shadow-sm rounded-lg overflow-hidden border border-gray-200">
            <TableHeader className="bg-indigo-50">
              <TableRow>
                <TableHead className="px-6 py-4 text-left text-indigo-700 font-semibold uppercase tracking-wide text-sm">
                  Capacity
                </TableHead>
                <TableHead className="px-6 py-4 text-left text-indigo-700 font-semibold uppercase tracking-wide text-sm">
                  Used In Room
                </TableHead>
                <TableHead className="px-6 py-4 text-center text-indigo-700 font-semibold uppercase tracking-wide text-sm">
                  Hidden
                </TableHead>
                <TableHead className="px-6 py-4 text-center text-indigo-700 font-semibold uppercase tracking-wide text-sm">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {capacities.map((cap) => {
                const isEditing = editCapacity && editCapacity.id === cap.id;
                const isInUse = cap.used_count > 0;

                return (
                  <TableRow
                    key={cap.id}
                    className={`border-b last:border-b-0 hover:bg-indigo-50 transition cursor-pointer ${
                      isInUse ? "opacity-90" : "opacity-100"
                    }`}
                  >
                    <TableCell
                      className={`px-6 py-4 font-medium text-gray-900 ${
                        cap.hidden ? "line-through text-gray-400" : ""
                      }`}
                    >
                      {isEditing ? (
                        <Input
                          type="text"
                          value={editCapacity.capacity}
                          onChange={(e) =>
                            setEditCapacity({
                              ...editCapacity,
                              capacity: e.target.value,
                            })
                          }
                          disabled={loading}
                          className="w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                        />
                      ) : (
                        cap.capacity
                      )}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-gray-700 text-sm">
                      {isInUse ? (
                        <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full font-semibold">
                          {cap.used_rooms} rooms
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">Not used</span>
                      )}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      {isEditing ? (
                        <Checkbox
                          checked={!!editCapacity.hidden}
                          onCheckedChange={(checked) =>
                            setEditCapacity({
                              ...editCapacity,
                              hidden: checked,
                            })
                          }
                          disabled={loading}
                          className="mx-auto cursor-pointer border rounded-full border-black"
                        />
                      ) : cap.hidden ? (
                        <span className="text-red-500 font-semibold">Yes</span>
                      ) : (
                        <span className="text-green-600 font-semibold">No</span>
                      )}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center space-x-3">
                      {isEditing ? (
                        <>
                          <Button
                            onClick={() =>
                              handleUpdateCapacity(
                                editCapacity.id,
                                editCapacity.capacity,
                                editCapacity.hidden
                              )
                            }
                            variant="success"
                            disabled={loading}
                            className="px-4 py-1 text-sm"
                          >
                            Save
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() => setEditCapacity(null)}
                            disabled={loading}
                            className="px-4 py-1 text-sm"
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="warning"
                            onClick={() => setEditCapacity(cap)}
                            disabled={loading || isInUse}
                            className="px-4 py-1 text-sm"
                            title={isInUse ? "Cannot edit capacity in use" : ""}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => setDeleteCapId(cap.id)}
                            disabled={loading || isInUse}
                            className="px-4 py-1 text-sm"
                            title={
                              isInUse ? "Cannot delete capacity in use" : ""
                            }
                          >
                            Delete
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </section>

        {/* Features Section */}
        <section>
          <h2 className="text-3xl font-semibold mb-6 text-gray-800 border-b border-gray-300 pb-2">
            Features
          </h2>

          <div className="flex mb-6 space-x-4">
            <Input
              type="text"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              placeholder="Add new feature"
              className="flex-grow rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500"
              disabled={loading}
            />
            <Button
              onClick={handleAddFeature}
              disabled={loading}
              className="px-6 py-2"
              variant="primary"
            >
              Add Feature
            </Button>
          </div>

          <Table className="shadow-sm rounded-lg overflow-hidden border border-gray-200">
            <TableHeader className="bg-indigo-50">
              <TableRow>
                <TableHead className="px-6 py-4 text-left text-indigo-700 font-semibold uppercase tracking-wide text-sm">
                  Feature
                </TableHead>
                <TableHead className="px-6 py-4 text-left text-indigo-700 font-semibold uppercase tracking-wide text-sm">
                  Used In Room
                </TableHead>
                <TableHead className="px-6 py-4 text-center text-indigo-700 font-semibold uppercase tracking-wide text-sm">
                  Hidden
                </TableHead>
                <TableHead className="px-6 py-4 text-center text-indigo-700 font-semibold uppercase tracking-wide text-sm">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {features.map((feat) => {
                const isEditing = editFeature && editFeature.id === feat.id;
                const isInUseFeat = feat.used_count > 0;
                return (
                  <TableRow
                    key={feat.id}
                    className="border-b last:border-b-0 hover:bg-indigo-50 transition cursor-pointer"
                  >
                    <TableCell
                      className={`px-6 py-4 font-medium text-gray-900 ${
                        feat.hidden ? "line-through text-gray-400" : ""
                      }`}
                    >
                      {isEditing ? (
                        <Input
                          type="text"
                          value={editFeature.name}
                          onChange={(e) =>
                            setEditFeature({
                              ...editFeature,
                              name: e.target.value,
                            })
                          }
                          disabled={loading}
                          className="w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                        />
                      ) : (
                        feat.name
                      )}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-gray-700 text-sm">
                      {isInUseFeat ? (
                        <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full font-semibold">
                          {feat.used_rooms} rooms
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">Not used</span>
                      )}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      {isEditing ? (
                        <Checkbox
                          checked={!!editFeature.hidden}
                          onCheckedChange={(checked) =>
                            setEditFeature({ ...editFeature, hidden: checked })
                          }
                          disabled={loading}
                          className="mx-auto cursor-pointer border border-black rounded-full"
                        />
                      ) : feat.hidden ? (
                        <span className="text-red-500 font-semibold">Yes</span>
                      ) : (
                        <span className="text-green-600 font-semibold">No</span>
                      )}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center space-x-3">
                      {isEditing ? (
                        <>
                          <Button
                            onClick={() =>
                              handleUpdateFeature(
                                editFeature.id,
                                editFeature.name,
                                editFeature.hidden
                              )
                            }
                            variant="success"
                            disabled={loading}
                            className="px-4 py-1 text-sm"
                          >
                            Save
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() => setEditFeature(null)}
                            disabled={loading}
                            className="px-4 py-1 text-sm"
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="warning"
                            onClick={() => setEditFeature(feat)}
                            disabled={loading || isInUseFeat}
                            className="px-4 py-1 text-sm"
                            title={
                              isInUseFeat ? "Cannot edit capacity in use" : ""
                            }
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => setDeleteFeatId(feat.id)}
                            disabled={loading || isInUseFeat}
                            className="px-4 py-1 text-sm"
                            title={
                              isInUseFeat ? "Cannot delete capacity in use" : ""
                            }
                          >
                            Delete
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </section>

        {/* Confirm Delete Capacity */}
        <ConfirmDialog
          open={!!deleteCapId}
          setOpen={() => setDeleteCapId(null)}
          title="Delete Capacity"
          description="Are you sure you want to delete this capacity?"
          onConfirm={() => {
            if (deleteCapId) {
              handleDeleteCapacity(deleteCapId);
            }
          }}
        />

        {/* Confirm Delete Feature */}
        <ConfirmDialog
          open={!!deleteFeatId}
          setOpen={() => setDeleteFeatId(null)}
          title="Delete Feature"
          description="Are you sure you want to delete this feature?"
          onConfirm={() => {
            if (deleteFeatId) {
              handleDeleteFeature(deleteFeatId);
            }
          }}
        />
      </div>
    </div>
  );
};

export default MasterDataManagement;
