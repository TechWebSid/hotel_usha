const express = require('express');
const Booking = require('../models/bookingModel');
const Room = require('../models/roomModel');
const mongoose = require('mongoose');

const router = express.Router();

// Create a new booking
router.post('/', async (req, res) => {
  const { user, roomId, checkInDate, checkOutDate } = req.body;

  console.log('Booking request received');
  console.log('Request body:', req.body); // Log the request body to ensure you're receiving the correct data

  try {
    // Ensure the roomId is a valid ObjectId
    console.log('Checking if roomId is valid:', roomId);
    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      console.log('Invalid roomId:', roomId);
      return res.status(400).json({ message: 'Invalid roomId' });
    }

    // Check if the room exists and is available
    console.log('Looking for room with roomId:', roomId);
    const room = await Room.findById(roomId);
    if (!room) {
      console.log('Room not found');
      return res.status(400).json({ message: 'Room not found' });
    }

    console.log('Room found:', room);

    if (!room.availability) {
      console.log('Room not available');
      return res.status(400).json({ message: 'Room not available' });
    }

    // Mark the room as unavailable (booked) after a successful booking
    room.availability = false;
    await room.save();
    console.log('Room availability updated to false');

    // Create the booking
    console.log('Creating new booking');
    const newBooking = new Booking({
      user,
      room: roomId,
      checkInDate,
      checkOutDate,
    });

    const booking = await newBooking.save();
    console.log('Booking created successfully:', booking);

    // Return the booking details to the client
    res.status(201).json(booking);
  } catch (err) {
    console.log('Error during booking creation:', err);
    res.status(500).json({ message: 'Error creating booking', error: err });
  }
});

// Get a booking by ID
router.get('/:id', async (req, res) => {
  console.log('Get booking request received for ID:', req.params.id);

  try {
    const booking = await Booking.findById(req.params.id).populate('room');
    if (!booking) {
      console.log('Booking not found');
      return res.status(404).json({ message: 'Booking not found' });
    }
    console.log('Booking found:', booking);
    res.json(booking);
  } catch (err) {
    console.log('Error fetching booking:', err);
    res.status(500).json({ message: 'Error fetching booking', error: err });
  }
});

module.exports = router;
