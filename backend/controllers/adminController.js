const User = require('../models/User');
const Contact = require('../models/Contact');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all contact submissions
// @route   GET /api/admin/contacts
// @access  Private/Admin
const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({}).sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update user access (hasAccess and accessLevel)
// @route   PUT /api/admin/users/access/:id
// @access  Private/Admin
const toggleAccess = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (req.body.hasAccess !== undefined) {
      user.hasAccess = req.body.hasAccess;
    } else if (req.body.accessLevel === undefined) {
      // Fallback for old UI toggle
      user.hasAccess = !user.hasAccess;
    }
    
    if (req.body.accessLevel !== undefined) {
      user.accessLevel = req.body.accessLevel;
    }

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getUsers, getContacts, toggleAccess };
