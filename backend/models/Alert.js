const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['brand_mentioned', 'brand_not_mentioned', 'competitor_mentioned', 'geo_score_drop', 'geo_score_rise', 'new_traffic_spike'],
    required: true
  },
  severity: { type: String, enum: ['info', 'warning', 'success', 'critical'], default: 'info' },
  title: { type: String, required: true },
  message: { type: String, required: true },
  platform: String,       // e.g. "ChatGPT"
  brandName: String,
  read: { type: Boolean, default: false },
  triggeredAt: { type: Date, default: Date.now },
}, { timestamps: true });

alertSchema.index({ userId: 1, read: 1, triggeredAt: -1 });

module.exports = mongoose.model('Alert', alertSchema);
