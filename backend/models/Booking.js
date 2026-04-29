import mongoose from "mongoose";

export default mongoose.model("Booking", {
  userId: String,
  carId: String,
  startDate: Date,
  endDate: Date,
  totalPrice: Number
});
