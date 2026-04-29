import express from "express";
import Booking from "../models/Booking.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, async (req, res) => {
  const booking = await Booking.create({
    ...req.body,
    userId: req.user.id
  });
  res.json(booking);
});

router.get("/", auth, async (req, res) => {
  const data = await Booking.find({ userId: req.user.id });
  res.json(data);
});

router.delete("/:id", auth, async (req, res) => {
  await Booking.findByIdAndDelete(req.params.id);
  res.send("Deleted");
});

export default router;