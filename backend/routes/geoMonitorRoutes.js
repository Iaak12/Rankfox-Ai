const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  scanBrandMentions,
  getMonitorHistory,
  getAlerts,
  markAlertRead,
  markAllAlertsRead,
  getUnreadCount,
} = require('../controllers/geoMonitorController');

// All routes require authentication
router.post('/scan', protect, scanBrandMentions);
router.get('/history', protect, getMonitorHistory);
router.get('/alerts', protect, getAlerts);
router.get('/alerts/unread-count', protect, getUnreadCount);
router.put('/alerts/read-all', protect, markAllAlertsRead);
router.put('/alerts/:id/read', protect, markAlertRead);

module.exports = router;
