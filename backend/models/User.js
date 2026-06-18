const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
  lastLogin: {
    type: Date,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  hasAccess: {
    type: Boolean,
    default: false,
  },
  accessLevel: {
    type: String,
    enum: ['view', 'edit'],
    default: 'view',
  },
  otp: String,
  otpExpires: Date,
  integrations: {
    medium: { connected: { type: Boolean, default: false }, token: String },
    blogger: { connected: { type: Boolean, default: false }, token: String },
    tumblr: { connected: { type: Boolean, default: false }, token: String },
    wordpress: { connected: { type: Boolean, default: false }, url: String, username: String, appPassword: String },
    gsc: { connected: { type: Boolean, default: false }, token: String },
    ga: { connected: { type: Boolean, default: false }, token: String },
    ahrefs: { connected: { type: Boolean, default: false }, token: String },
    semrush: { connected: { type: Boolean, default: false }, token: String }
  }
}, {
  timestamps: true,
});

// Method to check password match
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Hook to hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Handle model caching in dev
const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
