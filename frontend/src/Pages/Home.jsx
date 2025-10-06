"use client";
import React from "react";
import { motion } from "framer-motion";
import { WavyBackground } from "../components/ui/background-wavvy.jsx";
import { InfiniteMovingCards } from "../components/ui/infinite-moving-cards.jsx";
import { testimonials } from "../components/testimonial.jsx";
import { TextGenerateEffect } from "../components/ui/text-generate-effect.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Link } from "react-router-dom";

const Home = () => {
  const words =
    "Book smart, modern Conference rooms with real-time availability,";
  return (
    <div className="min-h-screen  text-white">
      {/* Wrap the hero section with WavyBackground */}

      <section className="flex flex-col items-center  p-4 justify-center min-h-screen  text-center relative z-10 bg-slate-600 ">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-orange-400 via-yellow-400 to-lime-400 bg-clip-text "
        >
          Conference Room Booking Platform
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-lg sm:text-xl md:text-2xl text-gray-400 max-w-2xl"
        >
          <TextGenerateEffect words={words} />
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-10 flex gap-4"
        >
          <Link to="/login">
            <Button className="rounded-full text-xl px-8 py-6 bg-blue-600 hover:bg-blue-700 transition">
              Get Started
            </Button>
          </Link>

          <Link to="/rooms">
            <Button className="rounded-full text-xl px-8 py-6 text-gray-300 border border-gray-500 bg-gray-700 hover:bg-gray-950 transition">
              Explore Rooms
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Other sections below remain the same */}
      <section className="py-20  px-6 bg-gradient-to-b from-slate-900 to-blue-900">
        <h2 className="text-3xl md:text-4xl font-bold text-center">
          Why Choose Us?
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-10">
          <div className="p-6 bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-4">Smart Booking</h3>
            <p className="text-gray-400">
              Instantly check availability & book rooms with one click
            </p>
          </div>

          <div className="p-6 bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-4">Modern Design</h3>
            <p className="text-gray-400">
              Sleek Futuristic UI with light and dark modes built in
            </p>
          </div>

          <div className="p-6 bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-4">Secure Login</h3>
            <p className="text-gray-400">
              Encrypted Sign-in to keep your bookings safe
            </p>
          </div>
        </div>
      </section>

      {/* Add InfiniteMovingCards section here */}
      <section className="py-20 px-6 bg-gray-900">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-10">
          What Our Users Say
        </h2>
        <InfiniteMovingCards
          items={testimonials}
          direction="right"
          speed="slower"
          className="max-w-7xl mx-auto"
        />
      </section>

      {/* Footer or any other bottom content can go here */}
    </div>
  );
};

export default Home;
