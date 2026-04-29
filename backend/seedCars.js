import mongoose from "mongoose";
import dotenv from "dotenv";
import Car from "./models/Car.js";

dotenv.config();

const cars = [
  {
    brand: "Maruti Swift",
    fuelType: "Petrol",
    pricePerDay: 1500,
    image: "https://via.placeholder.com/300"
  },
  {
    brand: "Hyundai i20",
    fuelType: "Diesel",
    pricePerDay: 1600,
    image: "https://via.placeholder.com/300"
  },
  {
    brand: "Toyota Innova",
    fuelType: "Diesel",
    pricePerDay: 2500,
    image: "https://via.placeholder.com/300"
  },
  {
    brand: "Honda City",
    fuelType: "Petrol",
    pricePerDay: 2000,
    image: "https://via.placeholder.com/300"
  },
  {
    brand: "Kia Seltos",
    fuelType: "Diesel",
    pricePerDay: 2200,
    image: "https://via.placeholder.com/300"
  }
];

const seedCars = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Car.deleteMany(); // clear old data
    await Car.insertMany(cars);

    console.log("Cars Seeded ✅");
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

seedCars();