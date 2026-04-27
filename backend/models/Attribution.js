const mongoose = require('mongoose');

const attributionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  source: {
    type: String,
    enum: ['chatgpt', 'gemini', 'perplexity', 'claude', 'grok', 'copilot', 'other_ai', 'google', 'direct', 'other'],
    default: 'other'
  },
  referrerUrl: String,
  landingPage: String,
  sessionId: String,
  country: String,
  device: { type: String, enum: ['desktop', 'mobile', 'tablet', 'unknown'], default: 'unknown' },
  converted: { type: Boolean, default: false },
  revenue: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

// Aggregate helper indexes
attributionSchema.index({ userId: 1, timestamp: -1 });
attributionSchema.index({ userId: 1, source: 1 });

module.exports = mongoose.model('Attribution', attributionSchema);
