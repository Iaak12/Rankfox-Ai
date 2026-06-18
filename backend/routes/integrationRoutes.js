const express = require('express');
const router = express.Router();
const { protect, requireEditAccess } = require('../middleware/authMiddleware');
const {
  getStatus,
  connectIntegration,
  disconnectIntegration,
  getGscAuthUrl,
  handleGscCallback
} = require('../controllers/integrationController');

router.get('/status', protect, getStatus);

// GSC specific OAuth routes
router.get('/gsc/auth-url', requireEditAccess, getGscAuthUrl);
router.get('/gsc/callback', handleGscCallback); // no protect here, handled by state

router.post('/connect/:platform', requireEditAccess, connectIntegration);
router.post('/disconnect/:platform', requireEditAccess, disconnectIntegration);

module.exports = router;
