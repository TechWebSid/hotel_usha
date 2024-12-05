const express = require("express");
const Razorpay = require("razorpay");
const Room = require("../models/roomModel");
const Booking = require("../models/bookingModel");
const razorpayWebhook = require("../controllers/razorpayWebhook");

const router = express.Router();
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post("/capture-payment", async (req, res) => {
  const { paymentId, orderId, signature, roomId, checkInDate, checkOutDate } =
    req.body;

  try {
    // Verify the payment signature
    const isSignatureValid = razorpayInstance.orders.create({
      order_id: orderId,
      payment_id: paymentId,
      signature,
    });

    if (!isSignatureValid) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // Save the booking details
    const newBooking = new Booking({
      user: {
        name: "User Name", // Replace with dynamic user data
        email: "user@example.com", // Same as above
        phone: "1234567890", // Same as above
      },
      room: roomId,
      checkInDate,
      checkOutDate,
      status: "Confirmed",
    });

    const booking = await newBooking.save();
    console.log("Booking saved:", booking);

    // Update room availability
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    console.log("Room availability before update:", room.availability);

    // Remove booked dates from room's availability
    room.availability = room.availability.filter((availability) => {
      // Checking if the current availability overlaps with the booked dates
      const isUnavailable =
        new Date(availability.startDate) <= new Date(checkOutDate) &&
        new Date(availability.endDate) >= new Date(checkInDate);
      return !isUnavailable; // Remove dates that overlap with the booked dates
    });

    console.log("Room availability after update:", room.availability);

    // Save the updated room with new availability
    await room.save();
    console.log("Room saved with updated availability:", room);

    res
      .status(200)
      .json({ message: "Booking confirmed and room availability updated" });
  } catch (error) {
    console.error("Error completing booking:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/webhook", razorpayWebhook);

module.exports = router;
