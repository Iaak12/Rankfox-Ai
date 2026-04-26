const PageContent = require('../models/PageContent');
const LibraryArticle = require('../models/LibraryArticle');

// ─── Page Content (CMS) ───
const getPageContent = async (req, res) => {
  try {
    const content = await PageContent.findOne({ page: req.params.page });
    if (content) res.json(content);
    else res.status(404).json({ message: 'Page content not found' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const updatePageContent = async (req, res) => {
  const { sections } = req.body;
  try {
    let content = await PageContent.findOne({ page: req.params.page });
    if (content) {
      content.sections = sections;
      await content.save();
      res.json(content);
    } else {
      content = await PageContent.create({ page: req.params.page, sections });
      res.status(201).json(content);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// ─── Content Library (Articles) ───

// GET /api/content/library
const getLibraryArticles = async (req, res) => {
  try {
    const articles = await LibraryArticle.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching articles', error: error.message });
  }
};

// POST /api/content/library
const saveLibraryArticle = async (req, res) => {
  try {
    const article = await LibraryArticle.create({
      ...req.body,
      user: req.user._id
    });
    res.status(201).json(article);
  } catch (error) {
    res.status(500).json({ message: 'Error saving article', error: error.message });
  }
};

// DELETE /api/content/library/:id
const deleteLibraryArticle = async (req, res) => {
  try {
    const article = await LibraryArticle.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user._id 
    });
    if (!article) return res.status(404).json({ message: 'Article not found' });
    res.json({ message: 'Article deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting article', error: error.message });
  }
};

module.exports = { 
  getPageContent, 
  updatePageContent,
  getLibraryArticles,
  saveLibraryArticle,
  deleteLibraryArticle
};
