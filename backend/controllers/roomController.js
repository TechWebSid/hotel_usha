const Room = require('../models/roomModel');

// Get all rooms
const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ availability: true });
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching rooms', error: err });
  }
};

// Add a new room
const addRoom = async (req, res) => {
  const { name, description, price, images } = req.body;

  try {
    const newRoom = new Room({
      name,
      description,
      price,
      images,
    });

    const room = await newRoom.save();
    res.status(201).json(room);
  } catch (err) {
    res.status(500).json({ message: 'Error adding room', error: err });
  }
};

// Update room details
const updateRoom = async (req, res) => {
  const { name, description, price, images, availability } = req.body;

  try {
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      { name, description, price, images, availability },
      { new: true }
    );
    res.json(updatedRoom);
  } catch (err) {
    res.status(500).json({ message: 'Error updating room', error: err });
  }
};

// Delete a room
const deleteRoom = async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.json({ message: 'Room deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting room', error: err });
  }
};

module.exports = {
  getRooms,
  addRoom,
  updateRoom,
  deleteRoom,
};
