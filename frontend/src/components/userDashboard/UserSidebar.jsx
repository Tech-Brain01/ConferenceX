import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDaysIcon,
  ChatBubbleLeftIcon,
  UserCircleIcon,
  // ArrowLeftOnRectangleIcon, 
} from "@heroicons/react/24/outline";
import { Sidebar, SidebarBody, SidebarLink } from "../ui/SideBarUi.jsx";

const UserSidebar = ({ user, logout }) => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/");
  };

  const links = [
    {
      label: "My Bookings",
      href: "/dashboard/bookings",
      icon: <CalendarDaysIcon className="h-5 w-5 shrink-0" />,
    },
    {
      label: "Support",
      href: "/dashboard/support",
      icon: <ChatBubbleLeftIcon className="h-5 w-5 shrink-0" />,
    },
    {
      label: "Profile",
      href: "/dashboard/profile",
      icon: <UserCircleIcon className="h-5 w-5 shrink-0" />,
    },
  ];

  return (
    <Sidebar open={open} setOpen={setOpen} animate={false} className="bg-white">
      <SidebarBody className="justify-between bg-gray-900">
        <div className="flex flex-col gap-4">
          <div
            className="text-xl font-bold text-cyan-400 px-2 py-3 cursor-pointer"
            onClick={handleLogoClick}
          >
            {open ? "User Panel" : "UP"}
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

export default UserSidebar;
