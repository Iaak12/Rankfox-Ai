const Groq = require('groq-sdk');
const GeoMonitor = require('../models/GeoMonitor');
const Alert = require('../models/Alert');

let groqInstance = null;
function getGroq() {
  if (!process.env.GROQ_API_KEY) throw new Error('GROQ_API_KEY not set');
  if (!groqInstance) groqInstance = new Groq({ apiKey: process.env.GROQ_API_KEY });
  return groqInstance;
}

async function askGroq(prompt, systemMsg = 'You are an AI assistant. Respond only in JSON.') {
  const groqClient = getGroq();
  const chat = await groqClient.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: systemMsg },
      { role: 'user', content: prompt }
    ],
    temperature: 0.2,
    max_tokens: 2000,
  });
  return JSON.parse(chat.choices[0]?.message?.content || '{}');
}

/* ─── HELPERS ─── */

// The queries we simulate sending to each AI platform about a brand
function buildQueries(brandName) {
  return [
    `What is ${brandName} and what do they offer?`,
    `Best SEO tools similar to ${brandName}`,
    `Is ${brandName} a good tool for SEO?`,
    `Tell me about ${brandName} services`,
    `${brandName} vs competitors`,
  ];
}

// Ask Groq to simulate what ChatGPT/Gemini would say about a brand
async function simulateAIPlatformResponse(platform, query, brandName) {
  const result = await askGroq(
    `You are simulating a response from "${platform}" AI assistant.
A user asked: "${query}"

Respond as if you are ${platform} answering this question based on your training data.
Then analyze your own response and return JSON:
{
  "simulatedResponse": "Your full simulated answer as ${platform}",
  "mentioned": true or false (is "${brandName}" mentioned by name?),
  "sentiment": "positive" | "neutral" | "negative" | "not_mentioned",
  "excerpt": "The exact sentence mentioning ${brandName}, or empty string if not mentioned",
  "confidence": a number 0-100 representing how prominently ${brandName} was featured
}`,
    `You are simulating AI platform responses for brand visibility research. Always respond in JSON.`
  );
  return result;
}

/* ─── Calculate GEO Score ─── */
function calculateGeoScore(mentions) {
  if (!mentions || mentions.length === 0) return 0;

  let score = 0;
  const total = mentions.length;
  const mentioned = mentions.filter(m => m.mentioned);

  // Base score: mention rate (0-50 points)
  score += (mentioned.length / total) * 50;

  // Sentiment bonus (0-30 points)
  mentioned.forEach(m => {
    if (m.sentiment === 'positive') score += 6;
    else if (m.sentiment === 'neutral') score += 3;
    else if (m.sentiment === 'negative') score -= 2;
  });

  // Platform diversity bonus (0-20 points)
  const platforms = [...new Set(mentioned.map(m => m.platform))];
  score += platforms.length * 5;

  return Math.min(100, Math.max(0, Math.round(score)));
}

/* ─── POST /api/geo-monitor/scan ─── */
// Body: { brandName, domain }
const scanBrandMentions = async (req, res) => {
  const { brandName, domain } = req.body;
  const userId = req.user?.id || req.body.userId;

  if (!brandName) return res.status(400).json({ message: 'brandName is required' });

  const platforms = ['ChatGPT', 'Gemini', 'Perplexity', 'Claude', 'Grok'];
  const queries = buildQueries(brandName);
  const allMentions = [];

  try {
    // Run checks for each platform × 1 query (to avoid rate limits)
    for (const platform of platforms) {
      const query = queries[Math.floor(Math.random() * queries.length)];
      try {
        const result = await simulateAIPlatformResponse(platform, query, brandName);
        allMentions.push({
          platform,
          query,
          response: result.simulatedResponse || '',
          mentioned: result.mentioned || false,
          sentiment: result.sentiment || 'not_mentioned',
          excerpt: result.excerpt || '',
          checkedAt: new Date(),
        });
      } catch (err) {
        // If one platform fails, continue with others
        console.error(`Platform ${platform} check failed:`, err.message);
        allMentions.push({
          platform,
          query,
          response: '',
          mentioned: false,
          sentiment: 'not_mentioned',
          excerpt: '',
          checkedAt: new Date(),
        });
      }
    }

    const geoScore = calculateGeoScore(allMentions);

    // Save or update the monitor record
    let monitor;
    if (userId) {
      monitor = await GeoMonitor.findOneAndUpdate(
        { userId, brandName },
        {
          domain,
          geoScore,
          mentions: allMentions,
          lastChecked: new Date(),
        },
        { upsert: true, new: true }
      );

      // ─── Generate Alerts ───
      const notMentioned = allMentions.filter(m => !m.mentioned);
      const mentioned = allMentions.filter(m => m.mentioned);

      if (mentioned.length > 0) {
        await Alert.create({
          userId,
          type: 'brand_mentioned',
          severity: 'success',
          title: `✅ Brand Mention Detected`,
          message: `"${brandName}" was mentioned on ${mentioned.map(m => m.platform).join(', ')}.`,
          brandName,
          platform: mentioned[0].platform,
        });
      }

      if (notMentioned.length >= 3) {
        await Alert.create({
          userId,
          type: 'brand_not_mentioned',
          severity: 'warning',
          title: `⚠️ Low AI Visibility`,
          message: `"${brandName}" was NOT found on ${notMentioned.map(m => m.platform).join(', ')}. GEO Score: ${geoScore}/100.`,
          brandName,
        });
      }

      if (geoScore < 30) {
        await Alert.create({
          userId,
          type: 'geo_score_drop',
          severity: 'critical',
          title: `🔴 Critical GEO Score: ${geoScore}/100`,
          message: `Your brand "${brandName}" has a very low AI visibility. Immediate GEO optimization needed.`,
          brandName,
        });
      }
    }

    res.json({
      brandName,
      domain,
      geoScore,
      mentions: allMentions,
      summary: {
        totalChecked: allMentions.length,
        mentioned: allMentions.filter(m => m.mentioned).length,
        notMentioned: allMentions.filter(m => !m.mentioned).length,
        positive: allMentions.filter(m => m.sentiment === 'positive').length,
        neutral: allMentions.filter(m => m.sentiment === 'neutral').length,
        negative: allMentions.filter(m => m.sentiment === 'negative').length,
      },
      lastChecked: new Date(),
    });
  } catch (err) {
    console.error('GEO Monitor scan error:', err.message);
    res.status(500).json({ message: 'Scan failed: ' + err.message });
  }
};

/* ─── GET /api/geo-monitor/history ─── */
const getMonitorHistory = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const history = await GeoMonitor.find({ userId }).sort({ lastChecked: -1 }).limit(20);
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ─── GET /api/geo-monitor/alerts ─── */
const getAlerts = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const alerts = await Alert.find({ userId }).sort({ triggeredAt: -1 }).limit(50);
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ─── PUT /api/geo-monitor/alerts/:id/read ─── */
const markAlertRead = async (req, res) => {
  const userId = req.user?.id;
  try {
    await Alert.findOneAndUpdate({ _id: req.params.id, userId }, { read: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ─── PUT /api/geo-monitor/alerts/read-all ─── */
const markAllAlertsRead = async (req, res) => {
  const userId = req.user?.id;
  try {
    await Alert.updateMany({ userId, read: false }, { read: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ─── GET /api/geo-monitor/unread-count ─── */
const getUnreadCount = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.json({ count: 0 });
  try {
    const count = await Alert.countDocuments({ userId, read: false });
    res.json({ count });
  } catch (err) {
    res.json({ count: 0 });
  }
};

module.exports = {
  scanBrandMentions,
  getMonitorHistory,
  getAlerts,
  markAlertRead,
  markAllAlertsRead,
  getUnreadCount,
};
