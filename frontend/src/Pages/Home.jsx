import React from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import BookingCalendarAnimation from "../assets/Booking Calender.json";
import { DottedGlowBackground } from "../components/ui/dotted-glow-background.jsx";
import { InfiniteMovingCards } from "../components/ui/infinite-moving-cards.jsx";
// import { testimonials } from "../components/testimonial.jsx";
import { TextGenerateEffect } from "../components/ui/text-generate-effect.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Link } from "react-router-dom";
import { HoverEffect } from "../components/ui/CardHover.jsx";
import { CalendarDaysIcon, PaintBrushIcon, LockClosedIcon } from '@heroicons/react/24/outline';


const Home = () => {
  const words =
    "Book smart, modern Conference rooms with real-time availability,";

    const hoverCards = [
  {
    title: "Smart Booking",
    description: "Instantly check availability & book rooms with one click",
    link: "/rooms",
    image: null,
  },
  {
    title: "Modern Design",
    description: "Sleek futuristic UI with light and dark modes built in",
    link: "/rooms",
    image: null,
  },
  {
    title: "Secure Login",
    description: "Encrypted sign-in to keep your bookings safe",
    link: "/login",
    image: null,
  },
];

  return (
    <div
      className="min-h-screen relative flex flex-col"
      style={{ backgroundColor: "#FFF8F0" }}
    >
      {/* Dotted Glow Background */}
      <DottedGlowBackground
        className="absolute inset-0 pointer-events-none"
        opacity={0.4}
        gap={14}
        radius={2}
        color="rgba(200, 180, 160, 0.2)"
        glowColor="rgba(255, 220, 180, 0.3)"
        backgroundOpacity={0.05}
        speedMin={0.2}
        speedMax={0.8}
        speedScale={1}
      />

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-20 py-20 min-h-screen">
        {/* Left Text Content */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left space-y-6">
          <motion.h1
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900"
          >
            Welcome to ConferenceX
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg sm:text-xl md:text-2xl text-gray-800 max-w-xl"
          >
            <TextGenerateEffect words={words} />
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="flex gap-4 mt-6 flex-wrap justify-center md:justify-start"
          >
            <Link to="/login">
              <Button className="rounded-full text-lg px-8 py-4 bg-orange-400 hover:bg-orange-500 text-white transition">
                Get Started
              </Button>
            </Link>

            <Link to="/rooms">
              <Button className="rounded-full text-lg px-8 py-4 text-gray-900 border border-gray-300 bg-white hover:bg-gray-50 transition">
                Explore Rooms
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Right Lottie Animation */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 max-w-lg w-full mb-10 md:mb-0"
        >
          <Lottie animationData={BookingCalendarAnimation} loop={true} />
        </motion.div>
      </section>


      {/* Why Choose Us Section */}


     {/* Why Choose Us Section */}
{/* Why Choose Us Section */}
<section className="py-20 px-6 bg-[#FFF8F0] relative z-10">
  <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900">
    Why Choose Us?
  </h2>
  
  <div className="relative w-64 h-2 mt-2 bg-cyan-400 rounded-full mx-auto shadow-lg glow-tube animate-flicker"></div>

  {/* Hover Cards */}
<div className="mt-12 max-w-6xl mx-auto">
  <HoverEffect
    items={[
       {
    title: "Smart Booking",
    description: "Instantly check availability & book rooms with one click",
    link: "/rooms",
    image: null,
    bgColor: "bg-cyan-50", 
    icon: CalendarDaysIcon,
  },
  {
    title: "Modern Design",
    description: "Sleek futuristic UI with light and dark modes built in",
    link: "/rooms",
    image: null,
    bgColor: "bg-purple-50", 
    icon: PaintBrushIcon,
  },
  {
    title: "Secure Login",
    description: "Encrypted sign-in to keep your bookings safe",
    link: "/login",
    image: null,
    bgColor: "bg-yellow-50", 
    icon: LockClosedIcon,
  },
    ]}
    className="grid md:grid-cols-3 gap-8"
    cardClassName="border border-black backdrop-blur-md rounded-2xl shadow-lg hover:shadow-xl transition-transform hover:scale-105"
    titleClassName="text-black font-bold text-xl md:text-2xl"
    descriptionClassName="text-gray-600 text-sm md:text-base mt-2"
  />
</div>


</section>



      {/* Optional InfiniteMovingCards or Testimonials Section */}
      {/* <section className="py-20 px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-10">
          What Our Users Say
        </h2>
        <InfiniteMovingCards
          items={testimonials}
          direction="right"
          speed="slower"
          className="max-w-7xl mx-auto"
        />
      </section> */}
    </div>
  );
};

export default Home;
