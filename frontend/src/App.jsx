import { useContext } from "react";
import { useLocation, Navigate, Routes, Route } from "react-router-dom";
import { AuthContext } from "./context/AuthContext.jsx";
import { Toaster } from "../src/components/ui/toaster.jsx";
import {toast} from "sonner";

// Navbar
import { Navbar, NavBody, NavItems } from "./components/Navbar.jsx";

// Pages
import Home from "./Pages/Home.jsx";
import LoginPage from "./components/LoginPage.jsx";
import SignupPage from "./components/SignupPage.jsx";
import BookingForm from "./components/BookingForm.jsx";
import AdvanceBookingForm from './components/advance_booking.jsx';

//User Pages
import UserDashboard from "./Pages/UserDashboard.jsx";
import DashboardTabs from "./components/userDashboard/DasboardTabs.jsx";
import SupportPage from "./components/userDashboard/SupportPage.jsx";
import Profile from "./components/userDashboard/Profile.jsx";

// Admin Pages
import AdminDashboard from "./Pages/admin/AdminDashboard.jsx";
import ManageRooms from "./Pages/admin/ManageRooms.jsx";
import AddRoom from "./Pages/admin/AddRoom.jsx";
import EditRoom from "./Pages/admin/EditRoom.jsx";
import ManageBookings from "./Pages/admin/ManageBookings.jsx";
import BookingDetail from "./Pages/admin/BookingDetail.jsx";
import MasterDataManagement from "./components/MasterDataManagement.jsx";
import Rooms from "./Pages/Rooms.jsx";
import AdminProfile from "./Pages/admin/AdminProfile.jsx";
import AdminSupportPage from "./components/AdminSupportPage.jsx";
import AdminUserControl from "./Pages/admin/AdminUserControl.jsx";
import Dashboard from "./Pages/admin/Dashboard.jsx";
import Analytics from "./Pages/admin/Analytics.jsx";

function AppWrapper() {
  const { user, logout, login } = useContext(AuthContext);
  const location = useLocation();

  const isDashboardRoute =
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/admin");

  const handleBook = (room) => {
    if (!user) {
      toast.error("please login before booking");
      return;
    }
    toast.success(`Booking for ${room.name} by ${user.name}`);
  };

  const ProtectedAdminRoute = ({ children }) => {
    return user?.role === "admin" ? children : <Navigate to="/" />;
  };

  return (
    <>
      <Toaster position="center" />
      <div className="relative min-h-screen">
        {!isDashboardRoute && (
          <Navbar className=" text-white">
            <NavBody className=" text-white" user={user}>
              <NavItems
                items={[
                  { name: "Home", link: "/" },
                  { name: "Rooms", link: "/rooms" },
                ]}
                user={user}
                logout={logout}
              />
            </NavBody>
          </Navbar>
        )}

        <Routes>
          {/* Public Routes */}

          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<Rooms onBook={handleBook} />} />
          <Route path="/login" element={<LoginPage onLogin={login} />} />
          <Route path="/signup" element={<SignupPage onLogin={login} />} />
          <Route path="/book/:id" element={<BookingForm />} />
          <Route path="/rooms/:id/advance-book" element={<AdvanceBookingForm onClose={() => Navigate(-1)} />} />

          {/* User Route */}
          <Route path="/dashboard" element={<UserDashboard />}>
            <Route index element={<Navigate to="bookings" />} />
            <Route path="bookings" element={<DashboardTabs />} />
            <Route path="support" element={<SupportPage />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          >
            <Route index element={<Navigate to="rooms" />} />
            <Route path="rooms" element={<ManageRooms />} />
            <Route path="rooms/add" element={<AddRoom />} />
            <Route path="rooms/edit/:id" element={<EditRoom />} />
            <Route path="bookings" element={<ManageBookings />} />
            <Route path="bookings/:id" element={<BookingDetail />} />
            <Route path="master" element={<MasterDataManagement />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="support" element={<AdminSupportPage />} />
             <Route path="users" element={<AdminUserControl/>} />
             <Route path="dashboard" element={<Dashboard/>}/>
             <Route path="analytics" element={<Analytics/>}/>
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default AppWrapper;
