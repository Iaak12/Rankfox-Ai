const express = require('express');
const router = express.Router();
const { 
  getPageContent, 
  updatePageContent,
  getLibraryArticles,
  saveLibraryArticle,
  deleteLibraryArticle
} = require('../controllers/contentController');
const { protect, admin, requireEditAccess } = require('../middleware/authMiddleware');

// Page Content (CMS)
router.get('/:page', getPageContent);
router.put('/:page', protect, admin, updatePageContent);

// Library Articles
router.get('/library/all', protect, getLibraryArticles);
router.post('/library/save', requireEditAccess, saveLibraryArticle);
router.delete('/library/delete/:id', protect, admin, deleteLibraryArticle);

module.exports = router;
