const PageContent = require('../models/PageContent');

// @desc    Get content for a specific page
// @route   GET /api/content/:page
// @access  Public
const getPageContent = async (req, res) => {
  try {
    const content = await PageContent.findOne({ page: req.params.page });
    if (content) {
      res.json(content);
    } else {
      res.status(404).json({ message: 'Page content not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update or create content for a page
// @route   PUT /api/content/:page
// @access  Private/Admin
const updatePageContent = async (req, res) => {
  const { sections } = req.body;
  try {
    let content = await PageContent.findOne({ page: req.params.page });

    if (content) {
      content.sections = sections;
      await content.save();
      res.json(content);
    } else {
      content = await PageContent.create({
        page: req.params.page,
        sections
      });
      res.status(201).json(content);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { getPageContent, updatePageContent };
