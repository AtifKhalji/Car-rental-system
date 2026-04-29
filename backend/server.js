import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = "secret123";

/* ===== STORAGE ===== */
let users = [];
let cars = [];
let bookings = [];
let complaints = [];

/* ===== DEFAULT CARS ===== */
const defaultCars = [
  ["Maruti Swift", "Petrol", 1500, "https://imgd.aeplcdn.com/370x208/n/cw/ec/159099/swift-exterior-right-front-three-quarter-31.png?isig=0&q=80"],
  ["Hyundai i20", "Diesel", 1600, "https://imgd.aeplcdn.com/370x208/n/cw/ec/150603/i20-exterior-right-front-three-quarter-13.png?isig=0&q=80"],
  ["Tata Nexon", "Petrol", 2200, "https://imgd.aeplcdn.com/370x208/n/cw/ec/141867/nexon-exterior-right-front-three-quarter-135.jpeg?isig=0&q=80"],
  ["Mahindra XUV700", "Diesel", 3500, "https://imgd.aeplcdn.com/370x208/n/cw/ec/205104/xuv-7xo-exterior-right-front-three-quarter-547.png?isig=0&q=80"],
  ["Honda City", "Petrol", 2400, "https://imgd.aeplcdn.com/370x208/n/cw/ec/134287/city-exterior-right-front-three-quarter-2.png?isig=0&q=80"],
  ["Toyota Innova Crysta", "Diesel", 3800, "https://imgd.aeplcdn.com/370x208/n/cw/ec/140809/innova-crysta-exterior-right-front-three-quarter-3.png?isig=0&q=80"],
  ["Kia Seltos", "Petrol", 2800, "https://imgd.aeplcdn.com/370x208/n/cw/ec/192817/seltos-exterior-right-front-three-quarter-314.jpeg?isig=0&q=80"],
  ["Hyundai Creta", "Diesel", 2700, "https://imgd.aeplcdn.com/370x208/n/cw/ec/106815/creta-exterior-right-front-three-quarter-6.png?isig=0&q=80"],
  ["Maruti Baleno", "Petrol", 1700, "https://imgd.aeplcdn.com/370x208/n/cw/ec/102663/baleno-exterior-right-front-three-quarter-69.png?isig=0&q=80"],
  ["Tata Punch", "Petrol", 1800, "https://imgd.aeplcdn.com/370x208/n/cw/ec/172825/punch-exterior-right-front-three-quarter-25.jpeg?isig=0&q=80"],
  ["Mahindra Scorpio N", "Diesel", 3600, "https://imgd.aeplcdn.com/370x208/n/cw/ec/40432/scorpio-n-exterior-right-front-three-quarter-136.jpeg?isig=0&q=80"],
  ["Toyota Fortuner", "Diesel", 5200, "https://imgd.aeplcdn.com/370x208/n/cw/ec/44709/fortuner-exterior-right-front-three-quarter-7.jpeg?isig=0&q=80"],
  ["MG Hector", "Petrol", 3200, "https://imgd.aeplcdn.com/370x208/n/cw/ec/212881/hector-facelift-exterior-right-front-three-quarter.png?isig=0&q=80"],
  ["Skoda Slavia", "Petrol", 2600, "https://imgd.aeplcdn.com/370x208/n/cw/ec/175951/slavia-exterior-right-front-three-quarter-10.png?isig=0&q=80"],
  ["Volkswagen Virtus", "Petrol", 2600, "https://imgd.aeplcdn.com/370x208/n/cw/ec/144681/virtus-exterior-right-front-three-quarter-11.png?isig=0&q=80"],
  ["Renault Kiger", "Petrol", 1900, "https://imgd.aeplcdn.com/370x208/n/cw/ec/208550/kiger-exterior-right-front-three-quarter-30.png?isig=0&q=80"],
  ["Nissan Magnite", "Petrol", 1900, "https://imgd.aeplcdn.com/370x208/n/cw/ec/173325/magnite-exterior-right-front-three-quarter-27.png?isig=0&q=80"],
  ["Maruti Ertiga", "CNG", 2300, "https://imgd.aeplcdn.com/370x208/n/cw/ec/115777/ertiga-exterior-right-front-three-quarter-10.png?isig=0&q=80"],
  ["Toyota Glanza", "Petrol", 1700, "https://imgd.aeplcdn.com/370x208/n/cw/ec/112839/glanza-exterior-right-front-three-quarter-6.png?isig=0&q=80"],
  ["Honda Amaze", "Petrol", 1900, "https://imgd.aeplcdn.com/370x208/n/cw/ec/184377/amaze-exterior-right-front-three-quarter-5.png?isig=0&q=80"],
  ["Hyundai Verna", "Petrol", 2500, "https://imgd.aeplcdn.com/370x208/n/cw/ec/204398/verna-exterior-right-front-three-quarter.png?isig=0&q=80"],
  ["Tata Harrier", "Diesel", 3400, "https://imgd.aeplcdn.com/370x208/n/cw/ec/139139/harrier-exterior-right-front-three-quarter-7.png?isig=0&q=80"],
  ["Tata Safari", "Diesel", 3700, "https://imgd.aeplcdn.com/370x208/n/cw/ec/138895/safari-exterior-right-front-three-quarter-40.png?isig=0&q=80"],
  ["Mahindra Thar", "Diesel", 3900, "https://imgd.aeplcdn.com/370x208/n/cw/ec/204996/thar-2025-exterior-right-front-three-quarter-5.png?isig=0&q=80"],
  ["Jeep Compass", "Diesel", 4200, "https://imgd.aeplcdn.com/370x208/n/cw/ec/47051/compass-exterior-right-front-three-quarter-84.png?isig=0&q=80"],
  ["Kia Sonet", "Petrol", 2200, "https://imgd.aeplcdn.com/370x208/n/cw/ec/174423/sonet-exterior-right-front-three-quarter-12.png?isig=0&q=80"],
  ["Maruti Brezza", "Petrol", 2100, "https://imgd.aeplcdn.com/370x208/n/cw/ec/107543/brezza-exterior-right-front-three-quarter-14.png?isig=0&q=80"],
  ["Hyundai Venue", "Petrol", 2100, "https://imgd.aeplcdn.com/370x208/n/cw/ec/220850/venue-exterior-right-front-three-quarter.jpeg?isig=0&q=80"],
  ["Citroen C3", "Petrol", 1800, "https://imgd.aeplcdn.com/370x208/n/cw/ec/103611/c3-exterior-right-front-three-quarter-34.png?isig=0&q=80"],
  ["Maruti Dzire", "Petrol", 1700, "https://imgd.aeplcdn.com/370x208/n/cw/ec/170173/dzire-exterior-right-front-three-quarter-27.png?isig=0&q=80"],
  ["Toyota Urban Cruiser", "Petrol", 2300, "https://imgd.aeplcdn.com/370x208/n/cw/ec/47016/urban-cruiser-exterior-right-front-three-quarter-61.jpeg?isig=0&q=80"],
  ["Skoda Kushaq", "Petrol", 2900, "https://imgd.aeplcdn.com/370x208/n/cw/ec/187043/kushaq-facelift-exterior-right-front-three-quarter-6.png?isig=0&q=80"],
  ["Volkswagen Taigun", "Petrol", 2900, "https://imgd.aeplcdn.com/370x208/n/cw/ec/207718/taigun-facelift-exterior-right-front-three-quarter-24.jpeg?isig=0&q=80"],
  ["MG Astor", "Petrol", 3100, "https://imgd.aeplcdn.com/370x208/n/cw/ec/51940/astor-exterior-right-front-three-quarter-8.png?isig=0&q=80"],
  ["Hyundai Alcazar", "Diesel", 3600, "https://imgd.aeplcdn.com/370x208/n/cw/ec/157825/alcazar-exterior-right-front-three-quarter-23.png?isig=0&q=80"],
  ["Maruti Jimny", "Petrol", 3300, "https://imgd.aeplcdn.com/370x208/n/cw/ec/45299/jimny-exterior-right-front-three-quarter-23.png?isig=0&q=80"],
  ["Tata Tiago", "Petrol", 1400, "https://imgd.aeplcdn.com/370x208/n/cw/ec/39345/tiago-exterior-right-front-three-quarter-34.png?isig=0&q=80"],
  ["Tata Tigor", "CNG", 1600, "https://imgd.aeplcdn.com/370x208/n/cw/ec/41160/tigor-exterior-right-front-three-quarter-25.png?isig=0&q=80"],
  ["Honda Elevate", "Petrol", 3000, "https://imgd.aeplcdn.com/370x208/n/cw/ec/142515/elevate-exterior-right-front-three-quarter-29.png?isig=0&q=80"],
  ["Mahindra Bolero Neo", "Diesel", 2600, "https://imgd.aeplcdn.com/370x208/n/cw/ec/210989/bolero-neo-exterior-right-front-three-quarter-3.png?isig=0&q=80"]
];

cars = defaultCars.map(([brand, fuelType, pricePerDay, image], index) => ({
  id: index + 1,
  brand,
  fuelType,
  pricePerDay,
  image
}));

/* ===== AUTH ===== */
app.post("/api/auth/register", (req, res) => {
  const { name, email, password, role } = req.body;

  if (!role) return res.status(400).send("Select role");

  users.push({ name, email, password, role });

  res.send("Registered");
});

app.post("/api/auth/login", (req, res) => {
  const user = users.find(u => u.email === req.body.email);

  if (!user) return res.status(400).send("User not found");

  const token = jwt.sign(
    { email: user.email, role: user.role },
    SECRET
  );

  res.json({ token, role: user.role });
});

/* ===== AUTH MIDDLEWARE ===== */
const auth = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).send("No token");

  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(400).send("Invalid token");
  }
};

/* ===== CARS ===== */
app.get("/api/cars", (req, res) => {
  res.json(cars);
});

/* ===== BOOKINGS ===== */
app.post("/api/bookings", auth, (req, res) => {
  const { id: carId, pricePerDay, from, to, ...bookingDetails } = req.body;

  const days =
    (new Date(to) - new Date(from)) / (1000 * 60 * 60 * 24);

  const total = Math.max(1, days) * pricePerDay;

  bookings.push({
    id: Date.now(),
    carId,
    user: req.user.email,
    ...bookingDetails,
    total
  });

  res.send("Booked");
});

app.get("/api/bookings", auth, (req, res) => {
  const userBookings = bookings.filter(
    b => b.user === req.user.email
  );
  res.json(userBookings);
});

app.delete("/api/bookings/:id", auth, (req, res) => {
  bookings = bookings.filter(
    b => b.id != req.params.id || b.user !== req.user.email
  );
  res.send("Booking cancelled");
});

/* ===== OWNER ===== */
app.post("/api/owner/cars", auth, (req, res) => {
  cars.push({
    id: Date.now(),
    owner: req.user.email,
    ...req.body
  });

  res.send("Car added");
});

app.get("/api/owner/cars", auth, (req, res) => {
  const ownerCars = cars.filter(
    c => c.owner === req.user.email
  );
  res.json(ownerCars);
});

app.delete("/api/owner/cars/:id", auth, (req, res) => {
  cars = cars.filter(c => c.id != req.params.id);
  res.send("Car deleted");
});

app.put("/api/owner/cars/:id/price", auth, (req, res) => {
  const { pricePerDay } = req.body;

  if (!pricePerDay || Number(pricePerDay) <= 0) {
    return res.status(400).send("Enter a valid price");
  }

  const car = cars.find(c => c.id == req.params.id);

  if (!car) {
    return res.status(404).send("Car not found");
  }

  car.pricePerDay = Number(pricePerDay);
  res.json(car);
});

app.get("/api/owner/bookings", auth, (req, res) => {
  const ownerBookings = bookings.filter((booking) => {
    if (booking.owner === req.user.email) return true;

    const bookedCar = cars.find(c => c.id == booking.carId);
    return bookedCar?.owner === req.user.email;
  });

  res.json(ownerBookings);
});

/* ===== COMPLAINT ===== */
app.post("/api/complaint", auth, (req, res) => {
  complaints.push({
    id: Date.now(),
    user: req.user.email,
    ...req.body
  });

  res.send("Complaint submitted");
});

/* ===== ADMIN ===== */
app.get("/api/admin/users", auth, (req, res) => {
  res.json(users);
});

app.delete("/api/admin/users/:email", auth, (req, res) => {
  const user = users.find(u => u.email === req.params.email);

  if (user?.role === "admin") {
    return res.status(403).send("Admin users cannot be deleted");
  }

  users = users.filter(u => u.email !== req.params.email);
  res.send("User deleted");
});

app.get("/api/admin/bookings", auth, (req, res) => {
  res.json(bookings);
});

app.get("/api/admin/complaints", auth, (req, res) => {
  res.json(complaints);
});

/* ===== SERVER ===== */
app.listen(5000, () =>
  console.log("Server running on http://localhost:5000")
);
