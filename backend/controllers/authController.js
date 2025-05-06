const User = require('../models/user.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const fsPromises = require('fs').promises;
const path  = require('path')


// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const handleRegister = async (req, res) => {
  const { name, email, password, company, address, phone } = req.body;

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    company,
    address,
    phone
  });

};
module.exports = handleRegister

// Login user
// @route   POST /api/auth/login

const handleLogin = async (req, res) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return res.status(400).json({'message':'Please provide an email and a password'});
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return res.status(400).json({'message':'User does not exist'});
  }

  // Check if password matches
  const isMatch = await bcrypt.compare(email, password);

  if (isMatch) {
    const accessToken = jwt.sign(
      {'email': user.email},
      process.env.ACCESS_TOKEN,
      {expiresIn: '10m'},
    )

    const refreshToken = jwt.sign(
      {'email': user.email},
      process.env.REFRESH_TOKEN,
      {expiresIn: '1d'},
    )
    const otherUsers = User.filter(person => person.email !== user.email)
    const currentUser = {...user, refreshToken}
    User.setUsers([...otherUsers, currentUser])
    await fsPromises.writeFile(
      path.join(__dirname, '..', 'model', 'user'),
      JSON.stringify(user)
    )
    res.cookie('jwt', refreshToken, {httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 })
    return res.json({accessToken});
  } else {
    return res.status(401).json({'message':'Invalid credentials'});
  }

};
module.exports = handleLogin;

// refresh token
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
module.exports = handleRefreshToken;

//Get current logged in user
// @route   GET /api/auth/me

const getMe = async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user
  });
};
module.exports = {getMe}

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
module.exports = logout;

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