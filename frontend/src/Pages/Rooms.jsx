import RoomList from "../components/RoomList.jsx";

const Rooms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white">
      <section className="flex flex-col items-center justify-start min-h-screen px-4 sm:px-6 lg:px-12 pt-28 pb-20 text-center">
        <h2 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-10">
          Available Rooms
        </h2>
        <RoomList />
      </section>
    </div>
  );
};

export default Rooms;
