const jwt = require('jsonwebtoken');
require ('dotenv').config();
const User = require('../models/user.js');

// Protect routes
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({'message':'Not authorized'});
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);

    req.user = await User.findById(decoded.id);

    next();
  } catch (err) {
    return res.status(403).json({'message':'Not authorized'});
    //request.user = decoded.email
  }
};
module.exports = protect;