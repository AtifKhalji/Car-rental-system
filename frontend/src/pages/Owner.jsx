import { useCallback, useEffect, useState } from "react";
import {
  getCars,
  getOwnerCars,
  getOwnerBookings,
  addCar,
  updateCarPrice,
  deleteOwnerCar,
  sendComplaint
} from "../services/api";
import { useNavigate } from "react-router-dom";

const fallbackCarImage =
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80";

const ownerBackgroundImage =
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=2200&q=80";

const pageStyles = `
  .owner-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 20px;
  }

  .owner-form {
    display: grid;
    grid-template-columns: 1.2fr 0.8fr 0.8fr 1.4fr auto;
    gap: 12px;
    align-items: end;
  }

  @media (max-width: 1200px) {
    .owner-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .owner-form {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 800px) {
    .owner-grid,
    .owner-form {
      grid-template-columns: 1fr;
    }
  }
`;

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px",
  border: "1px solid #1f2937",
  borderRadius: "8px",
  fontSize: "15px",
  background: "white",
  color: "#020617"
};

const buttonStyle = {
  padding: "12px 16px",
  border: "none",
  borderRadius: "8px",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer"
};

export default function Owner() {
  const [cars, setCars] = useState([]);
  const [allCars, setAllCars] = useState([]);
  const [bookedCars, setBookedCars] = useState([]);
  const [priceEdits, setPriceEdits] = useState({});
  const [form, setForm] = useState({
    brand: "",
    fuelType: "",
    pricePerDay: "",
    image: ""
  });
  const [complaint, setComplaint] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchDashboard = useCallback(async () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "owner") {
      localStorage.clear();
      navigate("/");
      return;
    }

    try {
      const [ownerCarsRes, allCarsRes, ownerBookingsRes] =
        await Promise.all([
          getOwnerCars(),
          getCars(),
          getOwnerBookings()
        ]);

      setCars(ownerCarsRes.data);
      setAllCars(allCarsRes.data);
      setBookedCars(ownerBookingsRes.data);
      setPriceEdits(
        Object.fromEntries(
          allCarsRes.data.map((car) => [car.id, car.pricePerDay])
        )
      );
    } catch (err) {
      if (err.response?.status === 400 || err.response?.status === 401) {
        localStorage.clear();
        navigate("/");
        return;
      }

      alert("Failed to load owner cars");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const handleAdd = async (e) => {
    e.preventDefault();

    if (!form.brand || !form.fuelType || !form.pricePerDay) {
      return alert("Fill brand, fuel type, and price");
    }

    try {
      await addCar({
        brand: form.brand.trim(),
        fuelType: form.fuelType,
        pricePerDay: Number(form.pricePerDay),
        image: form.image.trim() || fallbackCarImage
      });

      setForm({
        brand: "",
        fuelType: "",
        pricePerDay: "",
        image: ""
      });
      fetchDashboard();
    } catch {
      alert("Failed to add car");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteOwnerCar(id);
      setCars((currentCars) =>
        currentCars.filter((car) => car.id !== id)
      );
      setAllCars((currentCars) =>
        currentCars.filter((car) => car.id !== id)
      );
    } catch {
      alert("Failed to delete car");
    }
  };

  const handlePriceChange = async (id) => {
    const nextPrice = Number(priceEdits[id]);

    if (!nextPrice || nextPrice <= 0) {
      return alert("Enter a valid price");
    }

    try {
      const res = await updateCarPrice(id, nextPrice);
      const updatedCar = res.data;

      setCars((currentCars) =>
        currentCars.map((car) =>
          car.id === id ? { ...car, pricePerDay: updatedCar.pricePerDay } : car
        )
      );
      setAllCars((currentCars) =>
        currentCars.map((car) =>
          car.id === id ? { ...car, pricePerDay: updatedCar.pricePerDay } : car
        )
      );
      alert("Price updated");
    } catch {
      alert("Failed to update price");
    }
  };

  const handleComplaint = async (e) => {
    e.preventDefault();

    if (!complaint.trim()) {
      return alert("Write your complaint");
    }

    try {
      await sendComplaint({ message: complaint.trim() });
      alert("Complaint submitted");
      setComplaint("");
    } catch {
      alert("Failed to submit complaint");
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "28px",
        color: "white",
        background: `
          linear-gradient(rgba(2, 6, 23, 0.88), rgba(15, 23, 42, 0.92)),
          url(${ownerBackgroundImage})
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >
      <style>{pageStyles}</style>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          marginBottom: "26px"
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: "48px" }}>
            Owner Dashboard
          </h1>
          <p style={{ margin: "8px 0 0", color: "#cbd5e1" }}>
            Manage your rental cars, pricing, and listing photos.
          </p>
        </div>

        <button
          onClick={logout}
          style={{
            ...buttonStyle,
            background: "#ef4444",
            minWidth: "100px"
          }}
        >
          Logout
        </button>
      </div>

      <section
        style={{
          background: "#020617",
          border: "1px solid rgba(148, 163, 184, 0.14)",
          padding: "24px",
          borderRadius: "10px",
          marginBottom: "28px",
          boxShadow: "0 12px 30px rgba(0,0,0,0.25)"
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "16px",
            marginBottom: "18px"
          }}
        >
          <div>
            <h2 style={{ margin: 0 }}>Add Car</h2>
            <p style={{ margin: "6px 0 0", color: "#94a3b8" }}>
              Add a car with a price and image URL for customers to book.
            </p>
          </div>
          <strong style={{ color: "#22c55e" }}>
            {allCars.length} listed
          </strong>
        </div>

        <form className="owner-form" onSubmit={handleAdd}>
          <input
            placeholder="Brand / Model"
            value={form.brand}
            onChange={(e) =>
              setForm({ ...form, brand: e.target.value })
            }
            style={inputStyle}
          />

          <select
            value={form.fuelType}
            onChange={(e) =>
              setForm({ ...form, fuelType: e.target.value })
            }
            style={inputStyle}
          >
            <option value="">Fuel Type</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="CNG">CNG</option>
            <option value="Electric">Electric</option>
            <option value="Hybrid">Hybrid</option>
          </select>

          <input
            placeholder="Price per day"
            type="number"
            min="1"
            value={form.pricePerDay}
            onChange={(e) =>
              setForm({ ...form, pricePerDay: e.target.value })
            }
            style={inputStyle}
          />

          <input
            placeholder="Image URL optional"
            value={form.image}
            onChange={(e) =>
              setForm({ ...form, image: e.target.value })
            }
            style={inputStyle}
          />

          <button
            type="submit"
            style={{
              ...buttonStyle,
              background: "#22c55e",
              minHeight: "46px"
            }}
          >
            Add Car
          </button>
        </form>
      </section>

      <section style={{ marginBottom: "28px" }}>
        <h2 style={{ marginTop: 0 }}>Booked Cars</h2>

        {loading ? (
          <p style={{ color: "#cbd5e1" }}>Loading bookings...</p>
        ) : bookedCars.length === 0 ? (
          <div
            style={{
              background: "#020617",
              border: "1px solid rgba(148, 163, 184, 0.14)",
              borderRadius: "10px",
              padding: "36px",
              textAlign: "center",
              color: "#cbd5e1"
            }}
          >
            No customer bookings for your cars yet.
          </div>
        ) : (
          <div className="owner-grid">
            {bookedCars.map((booking) => (
              <article
                key={booking.id}
                style={{
                  background: "#020617",
                  border: "1px solid rgba(148, 163, 184, 0.14)",
                  padding: "15px",
                  borderRadius: "10px",
                  boxShadow: "0 10px 24px rgba(0,0,0,0.25)"
                }}
              >
                <img
                  src={booking.image || fallbackCarImage}
                  alt={booking.brand}
                  onError={(e) => {
                    if (e.currentTarget.src !== fallbackCarImage) {
                      e.currentTarget.src = fallbackCarImage;
                    }
                  }}
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    background: "#111827"
                  }}
                />

                <h3 style={{ marginBottom: "8px" }}>{booking.brand}</h3>
                <p style={{ margin: "0 0 6px", color: "#cbd5e1" }}>
                  Customer: {booking.user}
                </p>
                <p style={{ margin: "0 0 6px", color: "#cbd5e1" }}>
                  {booking.from} to {booking.to}
                </p>
                <h3 style={{ color: "#22c55e" }}>
                  Rs {booking.total}
                </h3>
              </article>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 style={{ marginTop: 0 }}>Your Cars</h2>

        {loading ? (
          <p style={{ color: "#cbd5e1" }}>Loading cars...</p>
        ) : allCars.length === 0 ? (
          <div
            style={{
              background: "#020617",
              border: "1px solid rgba(148, 163, 184, 0.14)",
              borderRadius: "10px",
              padding: "36px",
              textAlign: "center",
              color: "#cbd5e1"
            }}
          >
            No cars are visible to customers right now.
          </div>
        ) : (
          <div className="owner-grid">
            {allCars.map((car) => (
              <article
                key={car.id}
                style={{
                  background: "#020617",
                  border: "1px solid rgba(148, 163, 184, 0.14)",
                  padding: "15px",
                  borderRadius: "10px",
                  boxShadow: "0 10px 24px rgba(0,0,0,0.25)"
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
                    height: "160px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    background: "#111827"
                  }}
                />

                <h3 style={{ marginBottom: "8px" }}>{car.brand}</h3>
                <p style={{ margin: 0, color: "#cbd5e1" }}>
                  {car.fuelType}
                </p>
                <h3>Rs {car.pricePerDay}/day</h3>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    gap: "8px",
                    marginTop: "8px"
                  }}
                >
                  <input
                    type="number"
                    min="1"
                    value={priceEdits[car.id] ?? car.pricePerDay}
                    onChange={(e) =>
                      setPriceEdits({
                        ...priceEdits,
                        [car.id]: e.target.value
                      })
                    }
                    style={{
                      ...inputStyle,
                      padding: "10px"
                    }}
                  />

                  <button
                    onClick={() => handlePriceChange(car.id)}
                    style={{
                      ...buttonStyle,
                      background: "#22c55e"
                    }}
                  >
                    Save
                  </button>
                </div>

                <button
                  onClick={() => handleDelete(car.id)}
                  style={{
                    ...buttonStyle,
                    width: "100%",
                    background: "#ef4444",
                    marginTop: "8px"
                  }}
                >
                  Delete
                </button>
              </article>
            ))}
          </div>
        )}
      </section>

      <section
        style={{
          background: "#020617",
          border: "1px solid rgba(148, 163, 184, 0.14)",
          padding: "24px",
          borderRadius: "10px",
          marginBottom: "28px",
          boxShadow: "0 12px 30px rgba(0,0,0,0.25)"
        }}
      >
        <h2 style={{ margin: 0 }}>Complaint</h2>
        <p style={{ margin: "6px 0 18px", color: "#94a3b8" }}>
          Send an issue or request to the admin team.
        </p>

        <form onSubmit={handleComplaint}>
          <textarea
            placeholder="Write your complaint here"
            value={complaint}
            onChange={(e) => setComplaint(e.target.value)}
            rows="4"
            style={{
              ...inputStyle,
              resize: "vertical",
              minHeight: "110px",
              marginBottom: "12px",
              fontFamily: "inherit"
            }}
          />

          <button
            type="submit"
            style={{
              ...buttonStyle,
              background: "#22c55e"
            }}
          >
            Submit Complaint
          </button>
        </form>
      </section>
    </div>
  );
}
