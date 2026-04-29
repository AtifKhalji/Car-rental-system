import express from "express";
const router = express.Router();

const cars = [
  { brand: "Maruti", fuelType: "Petrol", pricePerDay: 1500, image: "https://via.placeholder.com/300" },
  { brand: "Hyundai", fuelType: "Diesel", pricePerDay: 1600, image: "https://via.placeholder.com/300" },
  { brand: "Toyota", fuelType: "Petrol", pricePerDay: 1700, image: "https://via.placeholder.com/300" }
];

router.get("/", (req, res) => res.json(cars));

export default router;