const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  const auth = req.headers.authorization;

  if (auth && auth.startsWith('Bearer')) {
    try {
      const decoded = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  } else {
    return res.status(401).json({ message: 'No token provided' });
  }
};

module.exports = protect;
