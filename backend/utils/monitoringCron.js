const cron = require('node-cron');
const GeoMonitor = require('../models/GeoMonitor');
const Alert = require('../models/Alert');
const Groq = require('groq-sdk');

let groqInstance = null;
function getGroq() {
  if (!process.env.GROQ_API_KEY) return null;
  if (!groqInstance) groqInstance = new Groq({ apiKey: process.env.GROQ_API_KEY });
  return groqInstance;
}

async function quickMentionCheck(brandName, platform) {
  const groq = getGroq();
  if (!groq) return { mentioned: false, sentiment: 'not_mentioned' };

  try {
    const chat = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant', // use fast model for background jobs
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: 'You are simulating AI platform responses. Respond in JSON.' },
        {
          role: 'user',
          content: `Simulate a ${platform} response to: "What are the best SEO tools available in 2025?"
Return JSON: { "mentioned": true/false, "sentiment": "positive"|"neutral"|"negative"|"not_mentioned" }
Is "${brandName}" mentioned?`,
        },
      ],
      temperature: 0.1,
      max_tokens: 100,
    });
    return JSON.parse(chat.choices[0]?.message?.content || '{}');
  } catch {
    return { mentioned: false, sentiment: 'not_mentioned' };
  }
}

function calculateGeoScore(mentions) {
  if (!mentions || mentions.length === 0) return 0;
  const mentioned = mentions.filter(m => m.mentioned);
  let score = (mentioned.length / mentions.length) * 50;
  mentioned.forEach(m => {
    if (m.sentiment === 'positive') score += 6;
    else if (m.sentiment === 'neutral') score += 3;
  });
  const platforms = [...new Set(mentioned.map(m => m.platform))];
  score += platforms.length * 5;
  return Math.min(100, Math.max(0, Math.round(score)));
}

/* ─── The Background Monitor Job ─── */
// Runs every 6 hours — checks all active brand monitors
async function runMonitoringCycle() {
  console.log(`[GEO Cron] Running monitoring cycle at ${new Date().toISOString()}`);

  const monitors = await GeoMonitor.find({ alertsEnabled: true });
  const platforms = ['ChatGPT', 'Gemini', 'Perplexity'];

  for (const monitor of monitors) {
    const { brandName, userId, geoScore: previousScore } = monitor;

    const newMentions = [];
    for (const platform of platforms) {
      const result = await quickMentionCheck(brandName, platform);
      newMentions.push({
        platform,
        query: `Best SEO tools 2025`,
        mentioned: result.mentioned || false,
        sentiment: result.sentiment || 'not_mentioned',
        excerpt: '',
        checkedAt: new Date(),
      });
    }

    const newScore = calculateGeoScore(newMentions);

    // Update monitor record
    await GeoMonitor.findByIdAndUpdate(monitor._id, {
      geoScore: newScore,
      mentions: newMentions,
      lastChecked: new Date(),
    });

    // ─── Smart Alert Generation ───
    const scoreDiff = newScore - previousScore;

    // Alert if score dropped significantly
    if (scoreDiff <= -15) {
      await Alert.create({
        userId,
        type: 'geo_score_drop',
        severity: 'critical',
        title: `🔴 GEO Score Dropped: ${previousScore} → ${newScore}`,
        message: `Your brand "${brandName}" lost ${Math.abs(scoreDiff)} points in AI visibility. Check which platforms stopped mentioning you.`,
        brandName,
      });
    }

    // Alert if score improved
    if (scoreDiff >= 10) {
      await Alert.create({
        userId,
        type: 'geo_score_rise',
        severity: 'success',
        title: `✅ GEO Score Improved: ${previousScore} → ${newScore}`,
        message: `"${brandName}" is getting more AI mentions! Score up by ${scoreDiff} points.`,
        brandName,
      });
    }

    // Alert for new mentions on platforms that didn't have them before
    const newlyMentioned = newMentions.filter(m => m.mentioned);
    if (newlyMentioned.length > 0 && previousScore === 0) {
      await Alert.create({
        userId,
        type: 'brand_mentioned',
        severity: 'success',
        title: `🎉 First AI Mention Detected!`,
        message: `"${brandName}" was mentioned by ${newlyMentioned.map(m => m.platform).join(', ')} for the first time!`,
        brandName,
        platform: newlyMentioned[0].platform,
      });
    }

    console.log(`[GEO Cron] Checked "${brandName}" — Score: ${previousScore} → ${newScore}`);
  }

  console.log(`[GEO Cron] Cycle complete. Checked ${monitors.length} brand(s).`);
}

/* ─── Initialize Cron Jobs ─── */
function startMonitoringJobs() {
  // Every 6 hours: run GEO monitoring cycle
  cron.schedule('0 */6 * * *', async () => {
    try {
      await runMonitoringCycle();
    } catch (err) {
      console.error('[GEO Cron] Error in monitoring cycle:', err.message);
    }
  });

  // Every day at midnight: clean up old alerts (older than 30 days)
  cron.schedule('0 0 * * *', async () => {
    try {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 30);
      const result = await Alert.deleteMany({ triggeredAt: { $lt: cutoff } });
      console.log(`[Cleanup] Deleted ${result.deletedCount} old alerts`);
    } catch (err) {
      console.error('[Cleanup] Error:', err.message);
    }
  });

  console.log('[GEO Monitor] Background monitoring jobs started (every 6 hours)');
}

module.exports = { startMonitoringJobs, runMonitoringCycle };
