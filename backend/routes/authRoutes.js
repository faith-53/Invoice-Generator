const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth.js');
const {handleRegister, handleLogin, handleRefreshToken, getMe, logout} = require('../controllers/authController.js');

router.post('/register', handleRegister);
router.post('/refresh', handleRefreshToken);
router.post('/login', handleLogin);
router.get('/logout', protect, logout);

module.exports = router;