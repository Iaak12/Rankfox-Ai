const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Get all blogs (public)
// @route   GET /api/blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find({ status: 'Published' }).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Get single blog by slug (public)
// @route   GET /api/blogs/:slug
router.get('/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Get all blogs (admin)
// @route   GET /api/blogs/admin/all
router.get('/admin/all', protect, admin, async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Create a blog
// @route   POST /api/blogs
router.post('/', protect, admin, async (req, res) => {
  const { title, slug, content, excerpt, category, image, status, isAiGenerated } = req.body;
  try {
    const blog = new Blog({ title, slug, content, excerpt, category, image, status, isAiGenerated });
    const createdBlog = await blog.save();
    res.status(201).json(createdBlog);
  } catch (err) {
    res.status(500).json({ message: 'Server Error: ' + err.message });
  }
});

// @desc    Update a blog
// @route   PUT /api/blogs/:id
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (blog) {
      Object.assign(blog, req.body);
      const updatedBlog = await blog.save();
      res.json(updatedBlog);
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Delete a blog
// @route   DELETE /api/blogs/:id
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (blog) {
      await blog.deleteOne();
      res.json({ message: 'Blog removed' });
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
