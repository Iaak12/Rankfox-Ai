const Contact = require('../models/Contact');

// @desc    Submit a contact form
// @route   POST /api/contact
// @access  Public
const submitContact = async (req, res) => {
  const { name, email, topic, message } = req.body;

  try {
    const contact = await Contact.create({
      name,
      email,
      topic,
      message,
    });

    res.status(201).json({ message: 'Contact form submitted successfully', contact });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { submitContact };
