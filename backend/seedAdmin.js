const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const importData = async () => {
  try {
    // Check if admin exists
    const adminExists = await User.findOne({ email: 'rankfoxai12@admin' });

    if (adminExists) {
      console.log('Super Admin already exists!');
      process.exit();
    }

    // Create super admin
    await User.create({
      name: 'Super Admin',
      email: 'rankfoxai12@admin',
      password: 'rankfoxai121201@adminpass',
      isAdmin: true
    });

    console.log('Super Admin User Seeded Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
