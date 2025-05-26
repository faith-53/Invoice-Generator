require('dotenv').config();
const User = require('../models/user.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

// Register user
// @route   POST /api/auth/register
const handleRegister = async (req, res) => {
  const { name, email, password, company, address, phone } = req.body;

  try {
    if (!name || !email || !password || !company || !address || !phone) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword, // Save the hashed password
      company,
      address,
      phone
    });

    const newUser  = await user.save();

    // Assign jwt
    const token = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET, // Use a single secret for signing the token
      { expiresIn: '1d' } // Token expiration time
    );

    res.status(201).json({ success: true, message: 'User  registered successfully.', token });
  } catch (error) {
    console.error('Registration error', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Login user
// @route   POST /api/auth/login
const handleLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide an email and a password' });
  }

  try {
    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ message: 'User  does not exist' });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' }); 
    } else {
      const token = jwt.sign(
        { email: user.email },
        process.env.JWT_SECRET, 
        { expiresIn: '1d' } // Token expiration time
      );

      // Set the token in a cookie
      res.cookie('jwt', token, 
        { httpOnly: true, 
          sameSite: 'None', 
          secure: true, 
          maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
      res.json({ success: true, token }); 
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Refresh token
// @route   POST /api/auth/refresh
const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' });

  const token = cookies.jwt;

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, asyncHandler(async (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Forbidden' });

    // Check for user
    const user = await User.findOne({ email: decoded.email }).select('+password');
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    const newToken = jwt.sign(
      { email: decoded.email },
      process.env.JWT_SECRET, // Use a single secret for signing the token
      { expiresIn: '1d' } // Token expiration time
    );
    res.json({ token: newToken });
  }));
};

// Log user out / clear cookie
// @route   GET /api/auth/logout
const logout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
  res.json({ message: 'Cookie cleared' });
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token
    });
};

module.exports = {
  handleRegister,
  handleRefreshToken,
  handleLogin,
  logout,
  sendTokenResponse,
};
