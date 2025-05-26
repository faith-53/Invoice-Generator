require('dotenv').config();
const jwt = require('jsonwebtoken');

// Protect routes
const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith('Bearer')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  const token = authHeader.split(' ')[1];
  
  // Verify the token using the single secret
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Forbidden' });
    
    // Attach the user information to the request object
    req.user = decoded.email; // or req.user = decoded; if you want to attach the entire decoded object
    next();
  });
};

module.exports = {
  protect,
};
