const mongoose = require('mongoose');

const libraryArticleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  keyword: String,
  status: {
    type: String,
    enum: ['Draft', 'Published', 'In Review'],
    default: 'Draft'
  },
  words: Number,
  metaDescription: String,
  tags: [String],
  seoScore: Number,
  readabilityScore: Number,
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const LibraryArticle = mongoose.models.LibraryArticle || mongoose.model('LibraryArticle', libraryArticleSchema);

module.exports = LibraryArticle;
