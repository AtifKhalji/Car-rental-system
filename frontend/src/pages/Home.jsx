import { useEffect, useState } from "react";
import { getCars, sendComplaint } from "../services/api";
import { useNavigate } from "react-router-dom";

const fallbackCarImage =
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80";

const gridStyles = `
  .cars-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 20px;
  }

  @media (max-width: 1200px) {
    .cars-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  @media (max-width: 900px) {
    .cars-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 600px) {
    .cars-grid {
      grid-template-columns: 1fr;
    }
  }
`;

function Home() {
  const [cars, setCars] = useState([]);
  const [dates, setDates] = useState({});
  const [complaint, setComplaint] = useState("");

  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  useEffect(() => {
    getCars()
      .then(res => setCars(res.data))
      .catch(() => alert("Failed to load cars"));
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleBooking = (car) => {
    const selected = dates[car.id];

    if (!selected?.from || !selected?.to) {
      return alert("Select dates first ⚠️");
    }

    navigate("/payment", {
      state: {
        ...car,
        from: selected.from,
        to: selected.to
      }
    });
  };

  const handleComplaint = async () => {
    if (!complaint) return alert("Write complaint");

    await sendComplaint({ message: complaint });
    alert("Complaint submitted ✅");
    setComplaint("");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "20px",
        color: "white",
        background:
          "linear-gradient(to right, #020617, #0f172a)"
      }}
    >
      <style>{gridStyles}</style>

      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <h1>🚗 Dashboard</h1>
          <p>Role: {role}</p>
        </div>

        <div>
          <button onClick={() => navigate("/bookings")}>
            My Bookings
          </button>
          <button
            onClick={logout}
            style={{ background: "#ef4444" }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* CUSTOMER */}
      {role === "customer" && (
        <>
          <h2>Customer Panel</h2>

          <div
            className="cars-grid"
          >
            {cars.map((car) => (
              <div
                key={car.id}
                style={{
                  padding: "15px",
                  borderRadius: "10px",
                  background: "#020617"
                }}
              >
                <img
                  src={
                    car.image ||
                    fallbackCarImage
                  }
                  alt={car.brand}
                  onError={(e) => {
                    if (e.currentTarget.src !== fallbackCarImage) {
                      e.currentTarget.src = fallbackCarImage;
                    }
                  }}
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "10px"
                  }}
                />

                <h3>{car.brand}</h3>
                <p>{car.fuelType}</p>
                <h3>₹{car.pricePerDay}/day</h3>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "8px"
                  }}
                >
                  <input
                    type="date"
                    onChange={(e) =>
                      setDates({
                        ...dates,
                        [car.id]: {
                          ...dates[car.id],
                          from: e.target.value
                        }
                      })
                    }
                    style={{
                      minWidth: 0,
                      padding: "8px"
                    }}
                  />

                  <input
                    type="date"
                    onChange={(e) =>
                      setDates({
                        ...dates,
                        [car.id]: {
                          ...dates[car.id],
                          to: e.target.value
                        }
                      })
                    }
                    style={{
                      minWidth: 0,
                      padding: "8px"
                    }}
                  />

                  <button
                    onClick={() => handleBooking(car)}
                    style={{
                      gridColumn: "1 / -1"
                    }}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* COMPLAINT */}
          <h3 style={{ marginTop: "30px" }}>Complaint</h3>
          <textarea
            value={complaint}
            onChange={(e) => setComplaint(e.target.value)}
          />
          <button onClick={handleComplaint}>
            Submit Complaint
          </button>
        </>
      )}
    </div>
  );
}

export default Home;
