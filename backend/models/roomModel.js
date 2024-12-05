const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  images: { type: [String] }, // Array of image URLs
  availability: { type: Boolean, default: true }, // Single boolean field
});


const Room = mongoose.model('Room', roomSchema);
module.exports = Room;
