const mongoose = require('mongoose');

// Define the Booking schema
const bookingSchema = new mongoose.Schema({
  user: {
    name: { type: String, required: true }, // User name
    email: { type: String, required: true }, // User email
    phone: { type: String, required: true }, // User phone number
  },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true }, // Room booked
  checkInDate: { type: Date, required: true }, // Check-in date
  checkOutDate: { type: Date, required: true }, // Check-out date
  status: { type: String, default: 'Pending' }, // Status of the booking (e.g., 'Pending', 'Confirmed')
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

// Create the Booking model
const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
