import mongoose from "mongoose";

export default mongoose.model("Car", {
  brand: String,
  fuelType: String,
  pricePerDay: Number,
  image: String
});
