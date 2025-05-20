const User = require('../models/user.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const fsPromises = require('fs').promises;
const path  = require('path')

// Register user
// @route   POST /api/auth/register
const handleRegister = async (req, res) => {
  try {
    const { name, email, password, company, address, phone } = req.body;

    if (!name || !email || !password || !company || !address || !phone) {
        return res.status(400).json({ success: false, message: 'All fields  are required.' });
      }

  // Create user
    const user = await User.create({
      name,
      email,
      password,
      company,
      address,
      phone
    });
    res.status(201).json({ success: true, message: 'User  registered successfully.' });
  } catch(error){
    console.error('Registration error', error)
    res.status(500).json({success: false, message: 'Server error'})
  }

};

// Login user
// @route   POST /api/auth/login
const handleLogin = async (req, res) => {
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
    const isMatch = await bcrypt.compare(password, user.password); // Corrected here
    if (isMatch) {
      const accessToken = jwt.sign(
        { email: user.email },
        process.env.ACCESS_TOKEN,
        { expiresIn: '10m' }
      );
      const refreshToken = jwt.sign(
        { email: user.email },
        process.env.REFRESH_TOKEN,
        { expiresIn: '1d' }
      );
      // Assuming you want to store the refresh token in the database
      user.refreshToken = refreshToken; // Store refresh token in user document
      await user.save(); // Save the updated user document
      // Set the refresh token in a cookie
      res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });
      return res.json({ accessToken });
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// refresh token
// @route   POST /api/auth/refresh
const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  console.log(cookies.jwt)
  const refreshToken = cookies.jwt
  
  // Check for user
  const user = await User.findOne({ email }).select('+password');

  if (!user) return res.sendStatus(403);
  
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN,
    (err, decoded) => {
        if (err || user.email !== decoded.email) return res.sendStatus(403)
            const accessToken = jwt.sign(
                {'email': decoded.email},
                process.env.ACCESS_TOKEN,
                {expiresIn: '60s'}
            );
            res.json({accessToken})
    }
  )
};



// Log user out / clear cookie
// @route   GET /api/auth/logout
const logout = async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    data: {}
  });
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
