const express = require('express');
const router = express.Router();
const { getPageContent, updatePageContent } = require('../controllers/contentController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/:page', getPageContent);
router.put('/:page', protect, admin, updatePageContent);

module.exports = router;
