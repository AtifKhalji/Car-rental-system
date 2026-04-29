import { useEffect, useState } from "react";
import { getBookings, deleteBooking } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getBookings()
      .then((res) => setBookings(res.data))
      .catch(() => alert("Failed to load bookings ❌"));
  }, []);

  const handleDelete = async (id) => {
    await deleteBooking(id);
    setBookings(bookings.filter((b) => b.id !== id));
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "20px",
        color: "white",
        background: "linear-gradient(to right, #020617, #0f172a)"
      }}
    >
      {/* 🔥 HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px"
        }}
      >
        <h1 style={{ margin: 0 }}>📊 My Bookings</h1>

        <button
          onClick={() => navigate("/home")}
          style={{
            background: "#22c55e",
            padding: "10px 16px",
            borderRadius: "8px",
            border: "none",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          ← Back to Home
        </button>
      </div>

      {/* 🔥 NO BOOKINGS */}
      {bookings.length === 0 ? (
        <p>No bookings found ❌</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px"
          }}
        >
          {bookings.map((b) => (
            <div
              key={b.id}
              style={{
                padding: "15px",
                borderRadius: "12px",
                background: "#020617",
                boxShadow: "0 0 10px rgba(0,0,0,0.5)"
              }}
            >
              <h2>{b.brand}</h2>

              <p>📅 From: {b.from}</p>
              <p>📅 To: {b.to}</p>

              <h3>💰 ₹{b.total}</h3>

              <button
                onClick={() => handleDelete(b.id)}
                style={{
                  marginTop: "10px",
                  width: "100%",
                  background: "#ef4444",
                  padding: "10px",
                  borderRadius: "6px",
                  border: "none",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                Cancel Booking
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}