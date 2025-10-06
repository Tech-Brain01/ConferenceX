import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BuildingOfficeIcon,
  CalendarDaysIcon,
  ChatBubbleLeftIcon,
  Cog6ToothIcon,
  UserIcon,
  UserCircleIcon,
  BoltIcon,
  ChartBarIcon,
  HomeIcon,
} from '@heroicons/react/24/outline';
import { Sidebar, SidebarBody, SidebarLink } from "./ui/SideBarUi.jsx";
import { cn } from "../lib/utils.js";

const AdminSidebar = ({ user }) => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const handleDashboardLogoClick = () => {
    navigate("/");
  };

  const links = [
    {
      label: "Dashboard",
      href: "/admin/dashboard",
      icon: <HomeIcon className="h-5 w-5 shrink-0" />,
    },
    {
      label: "Manage Rooms",
      href: "/admin/rooms",
      icon: <BuildingOfficeIcon className="h-5 w-5 shrink-0" />,
    },
    {
      label: "Manage Bookings",
      href: "/admin/bookings",
      icon: <CalendarDaysIcon className="h-5 w-5 shrink-0" />,
    },
    {
      label: "Analytics",
      href: "/admin/analytics",
      icon: <ChartBarIcon className="h-5 w-5 shrink-0" />,
    },
    {
      label: "Registered Users",
      href: "/admin/users",
      icon: <UserIcon className="h-5 w-5 shrink-0" />,
    },
    {
      label: "Support",
      href: "/admin/support",
      icon: <ChatBubbleLeftIcon className="h-5 w-5 shrink-0" />,
    },
    {
      label: "Profile",
      href: "/admin/profile",
      icon: <UserCircleIcon className="h-5 w-5 shrink-0" />,
    },
  ];

  return (
    <Sidebar open={open} setOpen={setOpen} animate={false}>
      <SidebarBody className="justify-between bg-slate-900">
        <div className="flex flex-col gap-4">
          <div
            className="text-xl font-bold text-cyan-400 px-2 py-3 cursor-pointer"
            onClick={handleDashboardLogoClick}
          >
            {open ? "Admin Panel" : "AP"}
          </div>

          <div className="flex flex-col gap-2">
            {links.map((link, idx) => (
              <SidebarLink key={idx} link={link} />
            ))}
          </div>
        </div>
      </SidebarBody>
    </Sidebar>
  );
};

export default AdminSidebar;
