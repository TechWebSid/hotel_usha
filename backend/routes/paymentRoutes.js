// paymentRoutes.js
const express = require('express');
const { createOrder, capturePayment } = require('../services/razorpayService'); // Import the Razorpay service
const router = express.Router();

// Route to create a Razorpay order
router.post('/create-order', async (req, res) => {
  const { amount } = req.body; // Amount in INR (should be a number)

  try {
    const order = await createOrder(amount);
    res.json(order); // Respond with the created order details
  } catch (error) {
    res.status(500).json({ message: 'Error creating Razorpay order', error: error.message });
  }
});

// Route to capture the payment after successful payment
router.post('/capture-payment', async (req, res) => {
  const { paymentId, amount } = req.body; // Payment ID and the amount paid

  try {
    const capture = await capturePayment(paymentId, amount);
    res.json(capture); // Respond with the payment capture details
  } catch (error) {
    res.status(500).json({ message: 'Error capturing payment', error: error.message });
  }
});

module.exports = router;
