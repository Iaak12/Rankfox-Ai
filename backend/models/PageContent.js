const mongoose = require('mongoose');

const pageContentSchema = new mongoose.Schema({
  page: {
    type: String,
    required: true,
    unique: true, // e.g. 'home', 'about', 'pricing'
  },
  sections: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    required: true,
  },
}, {
  timestamps: true,
});

const PageContent = mongoose.model('PageContent', pageContentSchema);

module.exports = PageContent;
