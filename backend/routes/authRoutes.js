const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth.js');
const {handleRegister, handleLogin, getMe, logout} = require('../controllers/authController.js');

router.post('/register', handleRegister);
router.post('/login', handleLogin);
router.get('/me', protect, getMe);
router.get('/logout', protect, logout);

module.exports = router;