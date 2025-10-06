import { Outlet } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";

const AdminDashboard = () => {
  return (
    <div className="flex min-h-screen">
    
      <div className="w-60">
        <AdminSidebar />
      </div>
       <main className="flex-1 p-6  bg-gray-50 text-gray-900">
      <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;
