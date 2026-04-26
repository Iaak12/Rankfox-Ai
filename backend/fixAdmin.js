const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const fixAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const email = 'rankfoxai12@admin';
    const user = await User.findOne({ email });

    if (user) {
      user.isAdmin = true;
      user.isVerified = true;
      user.hasAccess = true;
      await user.save();
      console.log(`User ${email} is now a Verified Super Admin!`);
    } else {
      console.log(`User ${email} not found.`);
    }

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

fixAdmin();
