const express = require("express");
const Razorpay = require("razorpay");
const Room = require("../models/roomModel");
const Booking = require("../models/bookingModel");

const router = express.Router();
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Capture payment and update room availability after successful payment
router.post("/capture-payment", async (req, res) => {
  const { paymentId, orderId, signature, roomId, checkInDate, checkOutDate } = req.body;

  try {
    // Verify the payment signature
    const isSignatureValid = razorpayInstance.utils.verifyPaymentSignature({
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
        name: "User Name", // You can replace with dynamic user data
        email: "user@example.com", // Same as above
        phone: "1234567890", // Same as above
      },
      room: roomId,
      checkInDate,
      checkOutDate,
      status: "Confirmed",
    });

    const booking = await newBooking.save();

    // Update room availability
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Remove booked dates from room's availability
    room.availability = room.availability.filter(
      (availability) =>
        !(availability.startDate >= new Date(checkInDate) && availability.endDate <= new Date(checkOutDate))
    );

    await room.save();

    res.status(200).json({ message: "Booking confirmed and room availability updated" });
  } catch (error) {
    console.error("Error completing booking:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
