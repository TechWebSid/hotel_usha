// config.js: Store settings and environment-specific configurations
require('dotenv').config();

const config = {
  mongoURI: process.env.MONGO_URI,
  razorpayKeyID: process.env.RAZORPAY_KEY_ID,
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET,
  jwtSecret: process.env.JWT_SECRET,
  port: process.env.PORT || 5000, // Default to port 5000 if not specified
  emailHost: process.env.EMAIL_HOST,
  emailPort: process.env.EMAIL_PORT,
  emailUser: process.env.EMAIL_USER,
  emailPass: process.env.EMAIL_PASS,
};

module.exports = config;
