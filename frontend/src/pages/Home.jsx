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
      .then((res) => setCars(res.data))
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
        background: "linear-gradient(to right, #020617, #0f172a)"
      }}
    >
      <style>{gridStyles}</style>

      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
          flexWrap: "wrap",
          gap: "20px"
        }}
      >
        {/* LOGO + BRAND */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px"
            }}
          >
            {/* CAR LOGO */}
            <img
              src="/logo.png"
              alt="RentSwift"
              style={{
                width: "75px",
                height: "75px",
                objectFit: "contain",
                borderRadius: "12px"
              }}
            />

            {/* BRAND TEXT */}
            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: "42px",
                  fontWeight: "800",
                  lineHeight: "1"
                }}
              >
                <span style={{ color: "white" }}>
                  Rent
                </span>

                <span style={{ color: "#22c55e" }}>
                  Swift
                </span>
              </h1>

              <p
                style={{
                  marginTop: "6px",
                  color: "#cbd5e1",
                  fontSize: "14px",
                  letterSpacing: "1px"
                }}
              >
                Your Journey, Our Priority 🚗
              </p>
            </div>
          </div>

          {/* ROLE */}
          <p
            style={{
              marginTop: "18px",
              fontSize: "18px"
            }}
          >
            Role: <b>{role}</b>
          </p>
        </div>

        {/* ACTION BUTTONS */}
        <div
          style={{
            display: "flex",
            gap: "12px"
          }}
        >
          <button
            onClick={() => navigate("/bookings")}
            style={{
              background: "#22c55e",
              border: "none",
              padding: "12px 20px",
              borderRadius: "10px",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            My Bookings
          </button>

          <button
            onClick={logout}
            style={{
              background: "#ef4444",
              border: "none",
              padding: "12px 20px",
              borderRadius: "10px",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* CUSTOMER */}
      {role === "customer" && (
        <>
          <h2
            style={{
              marginBottom: "20px"
            }}
          >
            Available Cars
          </h2>

          <div className="cars-grid">
            {cars.map((car) => (
              <div
                key={car.id}
                style={{
                  padding: "15px",
                  borderRadius: "16px",
                  background: "#020617",
                  border: "1px solid #1e293b",
                  boxShadow: "0 5px 20px rgba(0,0,0,0.3)"
                }}
              >
                <img
                  src={car.image || fallbackCarImage}
                  alt={car.brand}
                  onError={(e) => {
                    if (e.currentTarget.src !== fallbackCarImage) {
                      e.currentTarget.src = fallbackCarImage;
                    }
                  }}
                  style={{
                    width: "100%",
                    height: "180px",
                    objectFit: "cover",
                    borderRadius: "12px"
                  }}
                />

                <h3
                  style={{
                    marginTop: "15px"
                  }}
                >
                  {car.brand}
                </h3>

                <p
                  style={{
                    color: "#cbd5e1"
                  }}
                >
                  {car.fuelType}
                </p>

                <h3
                  style={{
                    color: "#22c55e"
                  }}
                >
                  ₹{car.pricePerDay}/day
                </h3>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "8px",
                    marginTop: "15px"
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
                      padding: "10px",
                      borderRadius: "8px",
                      border: "none"
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
                      padding: "10px",
                      borderRadius: "8px",
                      border: "none"
                    }}
                  />

                  <button
                    onClick={() => handleBooking(car)}
                    style={{
                      gridColumn: "1 / -1",
                      background: "#22c55e",
                      border: "none",
                      padding: "12px",
                      borderRadius: "10px",
                      color: "white",
                      fontWeight: "bold",
                      cursor: "pointer",
                      marginTop: "5px"
                    }}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* COMPLAINT */}
          <div
            style={{
              marginTop: "50px"
            }}
          >
            <h3>Complaint</h3>

            <textarea
              value={complaint}
              onChange={(e) => setComplaint(e.target.value)}
              placeholder="Write your complaint here..."
              style={{
                width: "100%",
                minHeight: "120px",
                padding: "15px",
                borderRadius: "12px",
                border: "none",
                marginTop: "10px",
                marginBottom: "15px",
                fontSize: "16px"
              }}
            />

            <button
              onClick={handleComplaint}
              style={{
                background: "#f59e0b",
                border: "none",
                padding: "12px 24px",
                borderRadius: "10px",
                color: "white",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              Submit Complaint
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Home;