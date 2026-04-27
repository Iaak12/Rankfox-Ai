const Attribution = require('../models/Attribution');

// Known AI platform referrer domains
const AI_REFERRERS = {
  'chat.openai.com': 'chatgpt',
  'chatgpt.com': 'chatgpt',
  'gemini.google.com': 'gemini',
  'bard.google.com': 'gemini',
  'perplexity.ai': 'perplexity',
  'claude.ai': 'claude',
  'anthropic.com': 'claude',
  'grok.x.ai': 'grok',
  'x.com': 'grok',
  'copilot.microsoft.com': 'copilot',
  'bing.com': 'copilot',
  'you.com': 'other_ai',
  'phind.com': 'other_ai',
  'kagi.com': 'other_ai',
};

function detectSource(referrer) {
  if (!referrer) return 'direct';
  try {
    const url = new URL(referrer);
    const hostname = url.hostname.replace('www.', '');

    // Check AI platforms
    for (const [domain, source] of Object.entries(AI_REFERRERS)) {
      if (hostname === domain || hostname.endsWith('.' + domain)) {
        return source;
      }
    }

    // Check Google
    if (hostname.includes('google.')) return 'google';

    return 'other';
  } catch {
    return 'other';
  }
}

/* ─── POST /api/attribution/track ─── */
// Called from frontend tracker script
const trackVisit = async (req, res) => {
  const { referrer, landingPage, sessionId, device } = req.body;
  const userId = req.user?.id || req.body.userId;

  const source = detectSource(referrer);

  try {
    const event = await Attribution.create({
      userId: userId || null,
      source,
      referrerUrl: referrer || '',
      landingPage: landingPage || '/',
      sessionId,
      device: device || 'unknown',
    });

    res.json({ success: true, source, id: event._id });
  } catch (err) {
    console.error('Attribution track error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

/* ─── POST /api/attribution/convert ─── */
// Mark a session as converted (sale/signup)
const trackConversion = async (req, res) => {
  const { sessionId, revenue = 0 } = req.body;
  const userId = req.user?.id || req.body.userId;

  try {
    const result = await Attribution.findOneAndUpdate(
      { sessionId, userId },
      { converted: true, revenue },
      { new: true }
    );
    res.json({ success: true, event: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ─── GET /api/attribution/dashboard ─── */
// Returns aggregated AI traffic stats for the dashboard
const getDashboard = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  // Last 30 days
  const since = new Date();
  since.setDate(since.getDate() - 30);

  try {
    const events = await Attribution.find({ userId, timestamp: { $gte: since } });

    // Aggregate by source
    const bySource = {};
    events.forEach(e => {
      if (!bySource[e.source]) {
        bySource[e.source] = { visits: 0, conversions: 0, revenue: 0 };
      }
      bySource[e.source].visits++;
      if (e.converted) bySource[e.source].conversions++;
      bySource[e.source].revenue += e.revenue;
    });

    // Daily trend (last 14 days)
    const dailyMap = {};
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dailyMap[key] = { date: key, total: 0, ai: 0, google: 0, direct: 0 };
    }

    events.forEach(e => {
      const key = new Date(e.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (dailyMap[key]) {
        dailyMap[key].total++;
        if (['chatgpt', 'gemini', 'perplexity', 'claude', 'grok', 'copilot', 'other_ai'].includes(e.source)) {
          dailyMap[key].ai++;
        } else if (e.source === 'google') {
          dailyMap[key].google++;
        } else {
          dailyMap[key].direct++;
        }
      }
    });

    // AI sources summary
    const aiSources = ['chatgpt', 'gemini', 'perplexity', 'claude', 'grok', 'copilot', 'other_ai'];
    const totalAiVisits = aiSources.reduce((sum, s) => sum + (bySource[s]?.visits || 0), 0);
    const totalConversions = events.filter(e => e.converted).length;
    const totalRevenue = events.reduce((sum, e) => sum + e.revenue, 0);

    res.json({
      summary: {
        totalVisits: events.length,
        aiVisits: totalAiVisits,
        googleVisits: bySource['google']?.visits || 0,
        directVisits: bySource['direct']?.visits || 0,
        totalConversions,
        totalRevenue,
        aiConversionRate: totalAiVisits > 0
          ? ((aiSources.reduce((sum, s) => sum + (bySource[s]?.conversions || 0), 0) / totalAiVisits) * 100).toFixed(1)
          : '0.0',
      },
      bySource: Object.entries(bySource).map(([source, data]) => ({ source, ...data })),
      dailyTrend: Object.values(dailyMap),
      topAiSources: aiSources
        .filter(s => bySource[s]?.visits > 0)
        .map(s => ({ source: s, ...bySource[s] }))
        .sort((a, b) => b.visits - a.visits),
    });
  } catch (err) {
    console.error('Attribution dashboard error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

/* ─── GET /api/attribution/recent ─── */
const getRecentEvents = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const events = await Attribution.find({ userId })
      .sort({ timestamp: -1 })
      .limit(50);
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { trackVisit, trackConversion, getDashboard, getRecentEvents, detectSource };
