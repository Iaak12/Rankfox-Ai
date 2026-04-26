const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  keywordResearch,
  generateArticle,
  optimizePage,
  siteAudit,
  contentIdeas,
  linkOpportunities,
  technicalAnalysis,
  generateInsights,
  requestIndexing,
} = require('../controllers/seoController');

router.post('/keywords',   protect, keywordResearch);
router.post('/generate',   protect, generateArticle);
router.post('/optimize',   protect, optimizePage);
router.post('/audit',      protect, siteAudit);
router.post('/ideas',      protect, contentIdeas);
router.post('/links',      protect, linkOpportunities);
router.post('/technical',  protect, technicalAnalysis);
router.post('/insights',   protect, generateInsights);
router.post('/request-indexing', protect, requestIndexing);

module.exports = router;
