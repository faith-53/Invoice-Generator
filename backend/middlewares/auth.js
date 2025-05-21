const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/user.js');

// Protect routes
const protect = async (req, res, next) => {
  let token;

  // Check for token in authorization header or cookies
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.jwt) { // Ensure the cookie name matches
    token = req.cookies.jwt;
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN); // Use the correct secret

    // Find user by ID
    req.user = await User.findById(decoded.id);

    // Check if user exists
    if (!req.user) {
      return res.status(404).json({ message: 'User  not found' });
    }

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(403).json({ message: 'Token has expired' });
    }
    return res.status(403).json({ message: 'Not authorized, token invalid' });
  }
};

module.exports = {
  protect,
};
