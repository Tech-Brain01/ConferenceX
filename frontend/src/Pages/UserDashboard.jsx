import { Outlet } from "react-router-dom";
import UserSidebar from "../components/userDashboard/UserSidebar";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const UserDashboard = () => {
  const {user} = useContext(AuthContext);
  return (
    <div className="flex min-h-screen">
       <div className="w-60 bg-white border-r border-gray-300">
        <UserSidebar user={user} />
      </div>
       <main className="flex-1 p-6 bg-slate-50 text-gray-900">
        <Outlet />
      </main>
    </div>
  );
};

export default UserDashboard;
