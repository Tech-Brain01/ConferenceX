import { Outlet } from "react-router-dom";
import { useContext } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { AuthContext } from "../../context/AuthContext.jsx";

const AdminDashboard = () => {
   const { user } = useContext(AuthContext); 
  return (
    <div className="flex min-h-screen">
    
      <div className="w-60">
        <AdminSidebar user={user} />
      </div>
       <main className="flex-1 p-6  bg-gray-50 text-gray-900">
      <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;
