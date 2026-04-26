const express = require('express');
const router = express.Router();
const { 
  getPageContent, 
  updatePageContent,
  getLibraryArticles,
  saveLibraryArticle,
  deleteLibraryArticle
} = require('../controllers/contentController');
const { protect, admin } = require('../middleware/authMiddleware');

// Page Content (CMS)
router.get('/:page', getPageContent);
router.put('/:page', protect, admin, updatePageContent);

// Library Articles
router.get('/library/all', protect, getLibraryArticles);
router.post('/library/save', protect, saveLibraryArticle);
router.delete('/library/delete/:id', protect, deleteLibraryArticle);

module.exports = router;
