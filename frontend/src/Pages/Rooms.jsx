import RoomList from "../components/RoomList.jsx";

const Rooms = () => {
  return (
       <div className="min-h-screen bg-gray-50 text-gray-900">
      <section className="flex flex-col items-center justify-start min-h-screen px-4 sm:px-6 lg:px-12 pt-28 pb-20 text-center bg-gradient-to-r from-amber-50 to-orange-100 text-black py-24 ">
        
              <div className="container mx-auto px-6 text-center">
         <h2 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-10">
          Available Rooms
        </h2>
          <p className="text-lg max-w-xl mx-auto text-gray-400">
            Browse our available rooms and book instantly. Enjoy modern, stylish spaces designed for comfort and productivity.
          </p>
          </div>
        <RoomList />
      </section>
    </div>
  );
};

export default Rooms;
