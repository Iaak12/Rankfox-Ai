const User = require('../models/User');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/signup
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      if (userExists.isVerified) {
        return res.status(400).json({ message: 'User already exists' });
      } else {
        // If unverified, resend OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        userExists.otp = otp;
        userExists.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        await userExists.save();
        
        await sendEmail({
          email: userExists.email,
          subject: 'Your RankFox Verification Code',
          message: `Your verification code is ${otp}.`,
          html: `<div style="font-family: sans-serif; padding: 20px;"><h2>Verify your Email</h2><p>Your code is:</p><div style="font-size: 32px; font-weight: bold; color: #3b82f6;">${otp}</div></div>`
        });
        
        return res.status(201).json({
          message: 'OTP sent to email. Please verify.',
          email: userExists.email
        });
      }
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    const user = await User.create({
      name,
      email,
      password,
      otp,
      otpExpires
    });

    if (user) {
      // Send OTP via Email
      try {
        await sendEmail({
          email: user.email,
          subject: 'Your RankFox Verification Code',
          message: `Your verification code is ${otp}. It expires in 10 minutes.`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; color: #333;">
              <h2>Welcome to RankFox!</h2>
              <p>Please use the code below to verify your email address:</p>
              <div style="font-size: 32px; font-weight: bold; color: #3b82f6; margin: 20px 0;">${otp}</div>
              <p>This code will expire in 10 minutes.</p>
            </div>
          `
        });

        res.status(201).json({
          message: 'OTP sent to email. Please verify.',
          email: user.email
        });
      } catch (err) {
        // If email fails, still created but user will need to resend
        res.status(201).json({
          message: 'User created but failed to send email. Please try resending OTP.',
          email: user.email
        });
      }
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Verify Email OTP
// @route   POST /api/auth/verify-email
const verifyEmail = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'User already verified' });
    }

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({
      message: 'Email verified successfully!',
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
const resendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.isVerified) return res.status(400).json({ message: 'User already verified' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendEmail({
      email: user.email,
      subject: 'New RankFox Verification Code',
      message: `Your new verification code is ${otp}.`,
      html: `<div style="font-family: sans-serif; padding: 20px;"><h2>RankFox Verification</h2><p>Your new code is:</p><div style="font-size: 32px; font-weight: bold; color: #3b82f6;">${otp}</div></div>`
    });

    res.json({ message: 'New OTP sent to email' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Auth user & get token
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      if (!user.isVerified) {
        return res.status(401).json({ 
          message: 'Please verify your email first.',
          notVerified: true,
          email: user.email 
        });
      }

      // Check if user has access (Admins always have access)
      if (!user.hasAccess && !user.isAdmin) {
        return res.status(401).json({ 
          message: 'Your account is pending approval. Please contact the administrator.',
          pendingAccess: true 
        });
      }

      user.lastLogin = new Date();
      await user.save();

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        hasAccess: user.hasAccess,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerUser, loginUser, verifyEmail, resendOTP };
