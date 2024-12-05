const Booking = require('../models/bookingModel');
const Room = require('../models/roomModel');

// Create a new booking
const createBooking = async (req, res) => {
  const { user, roomId, checkInDate, checkOutDate } = req.body;

  try {
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check if the room is already booked for the selected dates
    const isBooked = room.availability.some(booking => {
      return (
        new Date(checkInDate) < new Date(booking.endDate) &&
        new Date(checkOutDate) > new Date(booking.startDate)
      );
    });

    if (isBooked) {
      return res.status(400).json({ message: 'Room is not available for the selected dates' });
    }

    // Create new booking
    const newBooking = new Booking({
      user,
      room: roomId,
      checkInDate,
      checkOutDate,
    });

    // Save booking and update room availability
    await newBooking.save();
    room.availability.push({ startDate: checkInDate, endDate: checkOutDate });
    await room.save();

    res.status(201).json(newBooking);
  } catch (err) {
    res.status(500).json({ message: 'Error creating booking', error: err });
  }
};

// Check room availability
const checkAvailability = async (req, res) => {
  const { roomId, checkInDate, checkOutDate } = req.body;

  try {
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const isAvailable = !room.availability.some(booking => {
      return (
        new Date(checkInDate) < new Date(booking.endDate) &&
        new Date(checkOutDate) > new Date(booking.startDate)
      );
    });

    res.json({ isAvailable });
  } catch (err) {
    res.status(500).json({ message: 'Error checking availability', error: err });
  }
};

module.exports = { createBooking, checkAvailability };
