const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  trackVisit,
  trackConversion,
  getDashboard,
  getRecentEvents,
} = require('../controllers/attributionController');

router.post('/track', trackVisit);                     // no auth — called from client tracker
router.post('/convert', protect, trackConversion);
router.get('/dashboard', protect, getDashboard);
router.get('/recent', protect, getRecentEvents);

module.exports = router;
