import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDaysIcon,
  ChatBubbleLeftIcon,
  UserCircleIcon,
  HomeIcon,
  ArrowLeftOnRectangleIcon,
  BoltIcon,
} from "@heroicons/react/24/outline";
import { Sidebar, SidebarBody, SidebarLink } from "../ui/SideBarUi.jsx";
import { AuthContext } from "../../context/AuthContext.jsx";

const UserSidebar = ({ user }) => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogoClick = () => navigate("/");

  const handleLogout = async () => {
    try {
      logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // --- Grouped Links ---
  const navSections = [
    {
      title: "MAIN",
      links: [
        {
          label: "My Dashboard",
          href: "/dashboard/user",
          icon: <HomeIcon className="h-5 w-5 shrink-0" />,
        },
      ],
    },
    {
      title: "BOOKINGS",
      links: [
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
      ],
    },
    {
      title: "ACCOUNT",
      links: [
        {
          label: "Profile",
          href: "/dashboard/profile",
          icon: <UserCircleIcon className="h-5 w-5 shrink-0" />,
        },
        {
          label: "Logout",
          href: "#",
          icon: <ArrowLeftOnRectangleIcon className="h-5 w-5 shrink-0 text-red-600" />,
          isLogout: true,
        },
      ],
    },
  ];

  return (
    <Sidebar open={open}  animate={true} className="bg-gray-900">
      <SidebarBody className="justify-between bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-neutral-100">
        <div className="flex flex-col gap-6">

          <div
            className="flex items-center gap-2 px-3 py-4 cursor-pointer"
            onClick={handleLogoClick}
          >
            <BoltIcon className="h-6 w-6 text-cyan-400" />
            {open && (
              <span className="text-lg font-semibold tracking-wide text-cyan-300">
                User Panel
              </span>
            )}
          </div>

        
          {user?.name && open && (
            <div className="px-3 text-sm text-amber-400">
              Welcome, <strong>{user.name}</strong>
            </div>
          )}

          <div className="flex flex-col gap-6">
            {navSections.map((section, i) => (
              <div key={i}>
                {open && (
                  <div className="px-3 mb-2 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                    {section.title}
                  </div>
                )}
                <div className="flex flex-col gap-1">
                  {section.links.map((link, idx) => (
                    <div
                      key={idx}
                      onClick={(e) => {
                        if (link.isLogout) {
                          e.preventDefault();
                          handleLogout();
                        } else {
                          navigate(link.href);
                        }
                      }}
                    >
                      <SidebarLink link={link} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {open && (
          <div className="px-3 py-4 border-t border-slate-700 text-xs text-slate-400">
            © {new Date().getFullYear()} ConferenceX
          </div>
        )}
      </SidebarBody>
    </Sidebar>
  );
};

export default UserSidebar;
