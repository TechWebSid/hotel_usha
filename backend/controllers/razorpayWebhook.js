// backend/controllers/razorpayWebhook.js
const crypto = require('crypto');
const Room = require('../models/roomModel'); // Import Room model
const Booking = require('../models/bookingModel'); // Import Booking model

// Razorpay webhook secret (from Razorpay dashboard)
const razorpaySecret = 'your_razorpay_webhook_secret';

module.exports = async (req, res) => {
  const webhookData = req.body;

  // Get Razorpay signature and verify it
  const signature = req.headers['x-razorpay-signature'];
  const generatedSignature = crypto
    .createHmac('sha256', razorpaySecret)
    .update(JSON.stringify(webhookData))
    .digest('hex');

  if (signature === generatedSignature) {
    // Payment verified, now handle the booking
    const paymentDetails = webhookData.payload.payment.entity;
    const paymentId = paymentDetails.id;
    const orderId = paymentDetails.order_id;

    try {
      // Verify the payment and update booking details
      const room = await Room.findOne({ 'orderId': orderId }); // Assuming you store orderId in the room
      if (room) {
        // Mark the room as booked and unavailable
        room.availability = false;
        await room.save();

        // Optionally, save booking details to a booking collection
        const booking = new Booking({
          roomId: room._id,
          paymentId,
          userId: 'user_id',  // Replace with actual user ID
          checkInDate: room.checkInDate,
          checkOutDate: room.checkOutDate,
        });
        await booking.save();

        // Send confirmation to the user (optional)
        console.log('Booking confirmed');
        res.status(200).send({ message: 'Payment successful, room booked.' });
      } else {
        res.status(400).send({ error: 'Room not found or already booked.' });
      }
    } catch (error) {
      console.error('Error updating room availability:', error);
      res.status(500).send({ error: 'Error processing booking.' });
    }
  } else {
    console.error('Payment verification failed');
    res.status(400).send({ error: 'Payment verification failed' });
  }
};
