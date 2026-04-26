const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getStatus,
  connectIntegration,
  disconnectIntegration
} = require('../controllers/integrationController');

router.get('/status', protect, getStatus);
router.post('/connect/:platform', protect, connectIntegration);
router.post('/disconnect/:platform', protect, disconnectIntegration);

module.exports = router;
