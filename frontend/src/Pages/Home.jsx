import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import BookingCalendarAnimation from "../assets/Booking Calender.json";
import { Link } from "react-router-dom";
import { CalendarDaysIcon, UserCircleIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import { DottedGlowBackground } from "../components/ui/dotted-glow-background.jsx";

const Home = () => {
  useEffect(() => {
    // Disable scrolling when Home mounts
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    // Re-enable scrolling when Home unmounts
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const cards = [
    {
      title: "View Rooms",
      description: "Explore and book available conference rooms instantly.",
      link: "/rooms",
      icon: CalendarDaysIcon,
      color: "from-cyan-500 to-blue-600",
    },
    {
      title: "User Login",
      description: "Access your bookings and manage your schedule securely.",
      link: "/login",
      icon: UserCircleIcon,
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "Admin Login",
      description: "Manage rooms, monitor bookings, and view reports.",
      link: "/admin",
      icon: ShieldCheckIcon,
      color: "from-orange-500 to-yellow-500",
    },
  ];

  return (
    <div className="min-h-screen relative flex flex-col bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-gray-100 overflow-hidden">
      <DottedGlowBackground
        className="absolute inset-0 opacity-25"
        gap={18}
        radius={1.5}
        color="rgba(80, 200, 240, 0.15)"
        glowColor="rgba(0, 180, 255, 0.2)"
      />

      <header className="z-20 border-b border-gray-800 bg-gray-900/70 backdrop-blur-md px-8 py-4 flex justify-between items-center shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-cyan-400">ConferenceX Portal</h1>
      </header>

      <section className="flex flex-col-reverse md:flex-row items-center justify-between px-8 md:px-20 py-20 flex-grow">
        <div className="flex-1 flex flex-col justify-center space-y-8 text-center md:text-left">
          <motion.h1
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl font-bold text-white leading-tight"
          >
            Welcome to <span className="text-cyan-400">ConferenceX</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-gray-300 text-lg max-w-md mx-auto md:mx-0"
          >
            Manage and book conference rooms effortlessly with our secure and modern portal.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.9 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10"
          >
            {cards.map((card, index) => (
              <Link
                key={index}
                to={card.link}
                className={`group relative rounded-xl p-6 bg-gradient-to-br ${card.color} shadow-lg hover:shadow-cyan-500/20 transition-all transform hover:-translate-y-1`}
              >
                <div className="absolute inset-0 bg-black/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative flex flex-col items-center md:items-start text-center md:text-left space-y-3">
                  <card.icon className="h-10 w-10 text-white" />
                  <h3 className="text-xl font-semibold text-white">{card.title}</h3>
                  <p className="text-gray-100 text-sm">{card.description}</p>
                </div>
              </Link>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 max-w-lg w-full mb-10 md:mb-0"
        >
          <Lottie animationData={BookingCalendarAnimation} loop={false} />
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
