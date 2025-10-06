import React, { useEffect, useState, useContext } from "react";


import { AuthContext } from "../context/AuthContext.jsx";

const UserDetailView = () => {
  const { user: loggedInUser } = useContext(AuthContext);

  const [userDetails, setUserDetails] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [bookingDate, setBookingDate] = useState("");

  useEffect(() => {
    // fetch using loggedInUser.id
    fetch(`http://localhost:8080/api/user/details/${loggedInUser.id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user");
        return res.json();
      })
      .then(setUserDetails)
      .catch(console.error);
  }, [loggedInUser.id]);

  if (!loggedInUser) {
    return <p>Please log in to view your profile.</p>;
  }

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/api/user/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          room_id: userDetails.room_id, 
          date: bookingDate,
          phone,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setModalOpen(false);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to book room");
    }
  };

  if (!userDetails) return <p>Loading user details...</p>;

  return (
    <>
      <div className={`page-container ${modalOpen ? "blurred" : ""}`}>
        <h1>User Details</h1>
        <p><strong>Name:</strong> {userDetails.name}</p>
        <p><strong>Email:</strong> {userDetails.email}</p>
    

        <button onClick={() => setModalOpen(true)} className="btn-book">
          Book Now
        </button>
      </div>

      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Book Room</h2>
            <p><strong>Name:</strong> {userDetails.name}</p>
            <p><strong>Email:</strong> {userDetails.email}</p>

            <form onSubmit={handleBookingSubmit}>
              <label>
                Mobile Number:
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </label>
              <label>
                Booking Date:
                <input
                  type="date"
                  required
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                />
              </label>
              <button type="submit">Confirm Booking</button>
              <button type="button" onClick={() => setModalOpen(false)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      
      <style>{`
        .page-container {
          padding: 20px;
        }
        .blurred {
          filter: blur(5px);
          pointer-events: none;
          user-select: none;
        }
        .btn-book {
          padding: 10px 20px;
          background: cyan;
          border: none;
          cursor: pointer;
          border-radius: 6px;
          margin-top: 20px;
        }
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.6);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
        }
        .modal-content {
          background: #111;
          color: white;
          padding: 30px;
          border-radius: 12px;
          width: 300px;
          box-shadow: 0 0 15px cyan;
        }
        label {
          display: block;
          margin-bottom: 12px;
        }
        input {
          width: 100%;
          padding: 8px;
          margin-top: 4px;
          border-radius: 4px;
          border: none;
          font-size: 1em;
        }
        button[type="submit"] {
          background: cyan;
          border: none;
          padding: 10px 20px;
          cursor: pointer;
          border-radius: 6px;
          margin-right: 10px;
          color: black;
          font-weight: bold;
        }
        button[type="button"] {
          background: #555;
          border: none;
          padding: 10px 20px;
          cursor: pointer;
          border-radius: 6px;
          color: white;
        }
      `}</style>
    </>
  );
};

export default UserDetailView;
