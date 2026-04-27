const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getStatus,
  connectIntegration,
  disconnectIntegration,
  getGscAuthUrl,
  handleGscCallback
} = require('../controllers/integrationController');

router.get('/status', protect, getStatus);

// GSC specific OAuth routes
router.get('/gsc/auth-url', protect, getGscAuthUrl);
router.get('/gsc/callback', handleGscCallback); // no protect here, handled by state

router.post('/connect/:platform', protect, connectIntegration);
router.post('/disconnect/:platform', protect, disconnectIntegration);

module.exports = router;
