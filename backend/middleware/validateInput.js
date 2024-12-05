// Basic input validation middleware
const validateRoomInput = (req, res, next) => {
    const { name, description, price, images } = req.body;
    if (!name || !description || !price || !images) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    next();
  };
  
  const validateBookingInput = (req, res, next) => {
    const { user, roomId, checkInDate, checkOutDate } = req.body;
    if (!user || !roomId || !checkInDate || !checkOutDate) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    next();
  };
  
  module.exports = { validateRoomInput, validateBookingInput };
  