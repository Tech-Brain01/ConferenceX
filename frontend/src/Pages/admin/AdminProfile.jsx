import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import { toast } from "sonner";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../components/ui/tab.jsx";
import { Input } from "../../components/ui/input.jsx";
import { Label } from "../../components/ui/label.jsx";
import { Button } from "../../components/ui/Button.jsx";
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

// Avatar Component
function Avatar({ name }) {
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  return (
    <div className="w-20 h-20 rounded-full bg-cyan-600 flex items-center justify-center text-white text-2xl font-semibold shadow-md select-none">
      {initials}
    </div>
  );
}

// Main Admin Profile Component
const AdminProfile = () => {
  const { user, updateUser, updatePassword } = useContext(AuthContext);

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  // Email validation
  const isEmailValid = (email) => /\S+@\S+\.\S+/.test(email);

  // Handle profile info update
  const handleProfileSave = async () => {
    if (!name.trim() || !email.trim()) {
      toast.error("Name and email cannot be empty");
      return;
    }
    if (!isEmailValid(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    setLoading(true);
    try {
      await updateUser({ name, email });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // Handle password update
  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill all password fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await updatePassword({ currentPassword, newPassword });
      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error("Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  // Optional: Fetch user info from server (if needed)
 const fetchUser = async () => {
  setLoading(true);
  try {
    const res = await fetch("http://localhost:8080/api/auth/user", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch user");
    const data = await res.json();
    setName(data.name);
    setEmail(data.email);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token]);

  if (!user) return <p>Loading user...</p>;

  return (
    <div className="min-h-screen mx-auto p-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-gray-200 dark:border-zinc-700">
      {/* Profile Header */}
      <div className="flex items-center space-x-6 mb-10">
        <Avatar name={user.name} />
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
            <UserIcon className="w-6 h-6 text-cyan-600" />
            <span>{user.name}</span>
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center space-x-1">
            <EnvelopeIcon className="w-4 h-4" />
            <span>{user.email}</span>
          </p>
          <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1 font-medium inline-flex items-center space-x-1">
            <CheckCircleIcon className="w-5 h-5" />
            <span>{user.role}</span>
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="profile" className="space-y-8">
        <TabsList className="border-b border-gray-300 dark:border-zinc-700">
          <TabsTrigger
            value="profile"
            className="text-black font-semibold hover:bg-cyan-100  rounded-t-lg px-4 py-2"
          >
            Profile Info
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="text-black font-semibold hover:bg-cyan-100  rounded-t-lg px-4 py-2"
          >
            Security
          </TabsTrigger>
        </TabsList>

        {/* Profile Info Form */}
        <TabsContent value="profile">
          <form
            className="space-y-6 max-w-lg"
            onSubmit={async (e) => {
              e.preventDefault();
              await handleProfileSave();
            }}
          >
            <div>
              <Label htmlFor="name" className="flex items-center space-x-2">
                <UserIcon className="w-5 h-5 text-cyan-600" />
                <span className="text-white">Name</span>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="email" className="flex items-center space-x-2">
                <EnvelopeIcon className="w-5 h-5 text-cyan-600" />
                <span className="text-white">Email</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="mt-1"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="mt-4 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold"
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </TabsContent>

        {/* Security Form */}
        <TabsContent value="security">
          <form
            className="space-y-6 max-w-lg"
            onSubmit={async (e) => {
              e.preventDefault();
              await handlePasswordChange();
            }}
          >
            <div>
              <Label
                htmlFor="currentPassword"
                className="flex items-center space-x-2"
              >
                <LockClosedIcon className="w-5 h-5 text-cyan-600" />
                <span className="text-white">Current Password</span>
              </Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                disabled={loading}
                className="mt-1"
              />
            </div>

            <div>
              <Label
                htmlFor="newPassword"
                className="flex items-center space-x-2"
              >
                <LockClosedIcon className="w-5 h-5 text-cyan-600" />
                <span className="text-white">New Password</span>
              </Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={loading}
                className="mt-1"
              />
            </div>

            <div>
              <Label
                htmlFor="confirmPassword"
                className="flex items-center space-x-2"
              >
                <LockClosedIcon className="w-5 h-5 text-cyan-600" />
                <span className="text-white">Confirm New Password</span>
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                className="mt-1"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold"
            >
              {loading ? "Changing..." : "Change Password"}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminProfile;
