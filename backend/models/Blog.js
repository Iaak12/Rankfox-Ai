const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  content: {
    type: String,
    required: true,
  },
  excerpt: {
    type: String,
  },
  image: {
    type: String,
    default: '/blog_placeholder.jpg'
  },
  category: {
    type: String,
    default: 'AI & SEO'
  },
  author: {
    type: String,
    default: 'RankFox Team'
  },
  status: {
    type: String,
    enum: ['Published', 'Draft'],
    default: 'Published'
  },
  isAiGenerated: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
