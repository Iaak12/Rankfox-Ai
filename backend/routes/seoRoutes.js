const express = require('express');
const router = express.Router();
const { protect, requireEditAccess } = require('../middleware/authMiddleware');
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
  instantBoost,
  generateGeoPages,
  competitorXray,
  autoBacklink,
  contentRefresh,
  generateBlog
} = require('../controllers/seoController');

// View-only endpoints
router.post('/keywords',   protect, keywordResearch);
router.post('/audit',      protect, siteAudit);
router.post('/ideas',      protect, contentIdeas);
router.post('/links',      protect, linkOpportunities);
router.post('/technical',  protect, technicalAnalysis);
router.post('/insights',   protect, generateInsights);
router.post('/competitor', protect, competitorXray);

// Edit/Modify endpoints
router.post('/generate',   requireEditAccess, generateArticle);
router.post('/optimize',   requireEditAccess, optimizePage);
router.post('/request-indexing', requireEditAccess, requestIndexing);
router.post('/boost',      requireEditAccess, instantBoost);
router.post('/geo',        requireEditAccess, generateGeoPages);
router.post('/autobacklink', requireEditAccess, autoBacklink);
router.post('/refresh',    requireEditAccess, contentRefresh);
router.post('/generate-blog', requireEditAccess, generateBlog);

module.exports = router;
