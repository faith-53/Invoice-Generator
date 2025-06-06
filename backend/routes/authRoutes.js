const express = require('express');
const authRoutes = express.Router();
const { protect } = require('../middlewares/auth.js');
const {handleRegister, handleLogin, handleRefreshToken, logout, sendTokenResponse, getMe} = require('../controllers/authController.js');

authRoutes.post('/register', handleRegister);
authRoutes.post('/refresh', handleRefreshToken);
authRoutes.post('/token', sendTokenResponse);
authRoutes.post('/login', handleLogin);
authRoutes.get('/logout', protect, logout);
authRoutes.get('/me', protect, getMe);

module.exports = authRoutes;