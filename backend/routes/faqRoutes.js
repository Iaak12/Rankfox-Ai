const express = require('express');
const router = express.Router();
const FAQ = require('../models/FAQ');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Get all FAQs
// @route   GET /api/faqs
router.get('/', async (req, res) => {
  try {
    const faqs = await FAQ.find().sort({ order: 1 });
    res.json(faqs);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Create an FAQ
// @route   POST /api/faqs
router.post('/', protect, admin, async (req, res) => {
  const { question, answer, order } = req.body;
  try {
    const faq = new FAQ({ question, answer, order });
    const createdFaq = await faq.save();
    res.status(201).json(createdFaq);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Delete an FAQ
// @route   DELETE /api/faqs/:id
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);
    if (faq) {
      await faq.deleteOne();
      res.json({ message: 'FAQ removed' });
    } else {
      res.status(404).json({ message: 'FAQ not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
