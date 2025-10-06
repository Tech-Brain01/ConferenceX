import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table.jsx";
import { Input } from "../../components/ui/input.jsx";
import { Checkbox } from "../../components/ui/checkbox.jsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "../../components/ui/dialog.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { toast } from "sonner";

const AdminUserControl = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  function formatDateForDisplay(dateString) {
    const date = new Date(dateString);
    if (isNaN(date)) return "";
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  const fetchUsers = () => {
    setLoading(true);
    fetch("http://localhost:8080/api/auth/users", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch users");
        return res.json();
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };
  useEffect(() => {
    fetchUsers();
  }, [token]);

  const toggleRestrict = async (user) => {
    try {
      const res = await fetch(`http://localhost:8080/api/auth/user/${user.id}/restrict`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ isrestrict: !user.isrestrict }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update restrict status');
      }

      const { message } = await res.json();
      toast.success(message);
      fetchUsers();
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Error updating restrict status');
    }
  };

  if (loading) {
    return <div>Loading users...</div>;
  }
   return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-10">
        <h1 className="text-4xl font-extrabold mb-10 text-gray-900 tracking-tight">Registered Users :</h1>

        <section className="mb-16">
          <Table className="shadow-sm rounded-lg overflow-hidden border border-gray-200">
            <TableHeader className="bg-indigo-50">
              <TableRow >
                <TableHead>UserName</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Created A/C Date</TableHead>
                <TableHead>Restricted</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    No registered users found.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{formatDateForDisplay(user.created_at)}</TableCell>
                    <TableCell>{user.isrestrict ? "Yes" : "No"}</TableCell>
                    <TableCell>
                      <button
                        onClick={() => toggleRestrict(user)}
                        className={`px-3 py-1 rounded text-white ${user.isrestrict ? "bg-green-600" : "bg-red-500"}`}
                      >
                        {user.isrestrict ? "Unrestrict" : "Restrict"}
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </section>
      </div>
    </div>
  );
};

export default AdminUserControl;