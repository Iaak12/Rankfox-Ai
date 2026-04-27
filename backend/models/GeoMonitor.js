const mongoose = require('mongoose');

const mentionSchema = new mongoose.Schema({
  platform: { type: String, enum: ['ChatGPT', 'Gemini', 'Perplexity', 'Grok', 'Claude'], required: true },
  query: String,
  response: String,
  mentioned: { type: Boolean, default: false },
  sentiment: { type: String, enum: ['positive', 'neutral', 'negative', 'not_mentioned'], default: 'not_mentioned' },
  excerpt: String, // the part of AI response mentioning the brand
  checkedAt: { type: Date, default: Date.now },
});

const geoMonitorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  brandName: { type: String, required: true },
  domain: String,
  geoScore: { type: Number, default: 0 },    // 0-100 composite score
  mentions: [mentionSchema],
  lastChecked: { type: Date, default: Date.now },
  alertsEnabled: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('GeoMonitor', geoMonitorSchema);
