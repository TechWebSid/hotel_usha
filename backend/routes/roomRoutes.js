const express = require('express');
const mongoose = require('mongoose');
const Room = require('../models/roomModel');
const Booking = require('../models/bookingModel');

const router = express.Router();

// Get all available rooms
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find(); // Return all rooms
    res.json(rooms);
  } catch (err) {
    console.error('Error fetching rooms:', err);
    res.status(500).json({ message: 'Error fetching rooms', error: err });
  }
});

// Get a room by ID
router.get('/:id', async (req, res) => {
  const roomId = req.params.id;

  try {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      return res.status(400).json({ message: 'Invalid roomId format' });
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.json(room);
  } catch (err) {
    console.error('Error fetching room by ID:', err);
    res.status(500).json({ message: 'Error fetching room', error: err });
  }
});

// Add a new room
router.post('/', async (req, res) => {
  const { name, description, price, images } = req.body;

  if (!name || !description || !price || !Array.isArray(images)) {
    return res.status(400).json({ message: 'All fields are required and images must be an array' });
  }

  try {
    const newRoom = new Room({ name, description, price, images, availability: true });
    const room = await newRoom.save();
    res.status(201).json(room);
  } catch (err) {
    console.error('Error adding room:', err);
    res.status(500).json({ message: 'Error adding room', error: err });
  }
});

// Update room details
router.put('/:id', async (req, res) => {
  const { name, description, price, images, availability } = req.body;

  if (images && !Array.isArray(images)) {
    return res.status(400).json({ message: 'Images must be an array' });
  }

  try {
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      { name, description, price, images, availability },
      { new: true }
    );

    if (!updatedRoom) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.json(updatedRoom);
  } catch (err) {
    console.error('Error updating room:', err);
    res.status(500).json({ message: 'Error updating room', error: err });
  }
});

// Delete a room
router.delete('/:id', async (req, res) => {
  try {
    const deletedRoom = await Room.findByIdAndDelete(req.params.id);

    if (!deletedRoom) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.json({ message: 'Room deleted successfully' });
  } catch (err) {
    console.error('Error deleting room:', err);
    res.status(500).json({ message: 'Error deleting room', error: err });
  }
});

// Check room availability
router.post('/check-availability', async (req, res) => {
  const { roomId, checkInDate, checkOutDate } = req.body;

  try {
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check for date overlap
    const isAvailable = !room.availability.some(booking => {
      return (
        new Date(checkInDate) < new Date(booking.endDate) &&
        new Date(checkOutDate) > new Date(booking.startDate)
      );
    });

    res.json({ isAvailable });
  } catch (err) {
    console.error('Error checking availability:', err);
    res.status(500).json({ message: 'Error checking availability', error: err });
  }
});

// Create a new booking
router.post('/book', async (req, res) => {
  const { user, roomId, checkInDate, checkOutDate } = req.body;

  try {
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check for availability
    const isBooked = room.availability.some(booking => {
      return (
        new Date(checkInDate) < new Date(booking.endDate) &&
        new Date(checkOutDate) > new Date(booking.startDate)
      );
    });

    if (isBooked) {
      return res.status(400).json({ message: 'Room is not available for the selected dates' });
    }

    // Create booking
    const newBooking = new Booking({
      user,
      room: roomId,
      checkInDate,
      checkOutDate,
    });

    await newBooking.save();

    // Update room availability
    room.availability.push({ startDate: checkInDate, endDate: checkOutDate });
    await room.save();

    res.status(201).json(newBooking);
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(500).json({ message: 'Error creating booking', error: err });
  }
});

module.exports = router;
