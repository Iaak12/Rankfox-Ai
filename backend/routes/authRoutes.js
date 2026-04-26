const express = require('express');
const router = express.Router();
const { registerUser, loginUser, verifyEmail, resendOTP } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.post('/verify-email', verifyEmail);
router.post('/resend-otp', resendOTP);

module.exports = router;
