import { useLocation, useNavigate } from "react-router-dom";
import { bookCar } from "../services/api";

export default function Payment() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // ❌ If user refreshes → state becomes undefined
  if (!state) {
    return (
      <div style={{ color: "white", padding: "20px" }}>
        <h2>No booking data found ❌</h2>
        <button onClick={() => navigate("/home")}>
          Go Back
        </button>
      </div>
    );
  }

  const { brand, pricePerDay, from, to } = state;

  // 🧮 Calculate total price
  const days =
    (new Date(to) - new Date(from)) / (1000 * 60 * 60 * 24) + 1;

  const total = days * pricePerDay;

  const handleConfirm = async () => {
    await bookCar({ ...state, total });
    alert("Booking Confirmed ✅");
    navigate("/bookings");
  };

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h1>Payment Page</h1>

      <div
        style={{
          padding: "20px",
          borderRadius: "10px",
          background: "#020617",
          maxWidth: "400px"
        }}
      >
        <h2>{brand}</h2>

        <p>From: {from}</p>
        <p>To: {to}</p>

        <p>Days: {days}</p>
        <h3>Total: ₹{total}</h3>

        <button
          style={{
            width: "100%",
            marginTop: "10px",
            background: "#22c55e"
          }}
          onClick={handleConfirm}
        >
          Confirm Booking
        </button>

        <button
          style={{
            width: "100%",
            marginTop: "10px",
            background: "#ef4444"
          }}
          onClick={() => navigate("/home")}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}