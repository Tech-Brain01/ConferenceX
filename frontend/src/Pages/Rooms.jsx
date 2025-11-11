import RoomList from "../components/RoomList.jsx";
import RoomAnimation from "../assets/Booking confirmation.json";
import Lottie from "lottie-react";
// import RoomFilter from "../components/RoomFilter.jsx";

const Rooms = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white overflow-hidden">
      <section className="relative flex flex-col md:flex-row items-center justify-center px-4 sm:px-6 lg:px-12 pt-25 pb-15 gap-1">
        <div className="md:w-1/4 flex justify-center md:justify-start">
          <div className="w-72 sm:w-96">
            <Lottie animationData={RoomAnimation} loop={true} />
          </div>
        </div>

        <div className="md:w-3/4 flex justify-center md:justify-center">
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-cyan-400 bg-clip-text text-transparent mb-6">
            Available Rooms
          </h2>
        </div>
      </section>

      {/* Room List Section */}
      <section className="w-full px-4 sm:px-6 lg:px-12 mt-12">
        <RoomList />
      </section>
    </div>
  );
};

export default Rooms;
