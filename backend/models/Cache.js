const mongoose = require('mongoose');

const cacheSchema = new mongoose.Schema({
  cacheKey: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: '10d' } // Auto-delete documents 10 days after this date
  }
}, {
  timestamps: true,
});

// Handle model caching in dev
const Cache = mongoose.models.Cache || mongoose.model('Cache', cacheSchema);

module.exports = Cache;
