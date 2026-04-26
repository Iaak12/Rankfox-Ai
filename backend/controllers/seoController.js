const Groq = require('groq-sdk');

// Lazy initialization so missing API key doesn't crash the whole server
let groqInstance = null;
function getGroq() {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY environment variable is not set on the server.');
  }
  if (!groqInstance) {
    groqInstance = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groqInstance;
}

/* ─── Helper: call Groq and parse JSON back ─── */
async function askGroq(prompt, systemMsg = 'You are an expert SEO analyst. Always respond in JSON format.') {
  const groqClient = getGroq();
  const chat = await groqClient.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    response_format: { type: "json_object" },
    messages: [
      { role: 'system', content: systemMsg },
      { role: 'user', content: prompt }
    ],
    temperature: 0.4,
    max_tokens: 3000,
  });
  const raw = chat.choices[0]?.message?.content || '{}';
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error('JSON Parse error on AI response:', err.message, '\nRaw Output:', raw);
    // Attempt fallback cleanup just in case
    const cleaned = raw.replace(/[\u0000-\u001F]+/g, ' '); 
    return JSON.parse(cleaned);
  }
}

/* ─── Keyword Research ─── */
// POST /api/seo/keywords  { keyword }
const keywordResearch = async (req, res) => {
  const { keyword } = req.body;
  if (!keyword) return res.status(400).json({ message: 'Keyword required' });

  try {
    const data = await askGroq(`
You are an expert SEO keyword researcher.
Given the seed keyword: "${keyword}"

Return a JSON object with this exact shape:
{
  "keywords": [
    {
      "keyword": "full keyword phrase",
      "volume": <number 100-200000>,
      "difficulty": <number 1-100>,
      "intent": "Informational" | "Navigational" | "Transactional" | "Commercial",
      "trend": "up" | "down" | "flat",
      "cpc": "$X.XX",
      "competition": "Low" | "Medium" | "High"
    }
  ]
}

Generate 10-12 relevant keyword variations and long-tail keywords.
Be realistic with volumes and difficulty scores based on the niche.
`);
    res.json(data);
  } catch (err) {
    console.error('Keyword research error:', err.message);
    res.status(500).json({ message: 'AI error: ' + err.message });
  }
};

/* ─── Article / Content Generator ─── */
// POST /api/seo/generate  { title, keyword, tone? }
const generateArticle = async (req, res) => {
  const { title, keyword, tone = 'professional' } = req.body;
  if (!title || !keyword) return res.status(400).json({ message: 'Title and keyword required' });

  try {
    const data = await askGroq(`
You are an expert SEO content writer.
Write a complete, high-quality SEO article.

Title: "${title}"
Primary Keyword: "${keyword}"
Tone: ${tone}

Return JSON with this shape:
{
  "title": "final article title",
  "metaDescription": "compelling meta description 140-160 chars",
  "content": "full article in markdown format with H2s, H3s, bullet points, 800-1200 words",
  "wordCount": <number>,
  "readabilityScore": <number 60-100>,
  "seoScore": <number 70-100>,
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}

Make the content genuinely useful, naturally use the keyword 3-5 times.
`, 'You are a professional SEO content writer. Always respond with valid JSON only.');
    res.json(data);
  } catch (err) {
    console.error('Article generation error:', err.message);
    res.status(500).json({ message: 'AI error: ' + err.message });
  }
};

/* ─── Page Optimizer ─── */
// POST /api/seo/optimize  { content, keyword, url? }
const optimizePage = async (req, res) => {
  const { content, keyword, url } = req.body;
  if (!keyword) return res.status(400).json({ message: 'Keyword required' });
  if (!content && !url) return res.status(400).json({ message: 'Content or URL required' });

  const wordCount = content ? content.split(/\s+/).filter(Boolean).length : 500;

  try {
    const data = await askGroq(`
You are an expert on-page SEO analyst.
Analyze the following for the keyword: "${keyword}"
URL: ${url || 'not provided'}
Word count: ${wordCount}

${content ? `Content (first 3000 chars):\n${content.substring(0, 3000)}` : `Simulate a detailed SEO analysis of the typical content expected at the provided URL.`}

Return JSON with this exact shape:
{
  "score": <number 0-100>,
  "checks": [
    { "label": "check name", "status": "pass"|"warn"|"fail", "detail": "specific actionable detail" }
  ],
  "suggestions": ["improvement 1", "improvement 2", "improvement 3", "improvement 4", "improvement 5"],
  "keywordDensity": <number like 1.5>,
  "readabilityScore": <number 0-100>,
  "titleSuggestion": "improved title with keyword",
  "metaSuggestion": "improved meta description"
}

Include these checks: Title Tag, Meta Description, H1 Tag, H2 Structure, Keyword in First 100 Words, Keyword Density, Content Length, Internal Links, Image Alt Text, Readability Score, Schema Markup, Mobile Friendly signals.
Be specific in the detail field.
`);
    res.json(data);
  } catch (err) {
    console.error('Optimizer error:', err.message);
    res.status(500).json({ message: 'AI error: ' + err.message });
  }
};

/* ─── Site Audit ─── */
// POST /api/seo/audit  { url }
const siteAudit = async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ message: 'URL required' });

  try {
    const data = await askGroq(`
You are an expert technical SEO auditor.
Perform a comprehensive technical SEO audit for the website: "${url}"

Based on common SEO best practices and what you know about websites, return JSON:
{
  "score": <number 0-100>,
  "domain": "${url}",
  "checks": [
    { "label": "check name", "status": "pass"|"warn"|"fail", "detail": "specific detail about this site" }
  ],
  "criticalIssues": <count of fail>,
  "warnings": <count of warn>,
  "passed": <count of pass>,
  "priorityFixes": ["most important fix 1", "fix 2", "fix 3"]
}

Include 12-15 checks covering: Title Tag, Meta Description, H1, H2 Structure, Internal Links, External Links, Image Alt Text, Schema Markup, Page Speed, Mobile Friendly, Canonical Tag, Open Graph, SSL/HTTPS, Robots.txt, Sitemap, Core Web Vitals.
`);
    res.json(data);
  } catch (err) {
    console.error('Audit error:', err.message);
    res.status(500).json({ message: 'AI error: ' + err.message });
  }
};

/* ─── Content Ideas / Planner ─── */
// POST /api/seo/ideas  { topic, count? }
const contentIdeas = async (req, res) => {
  const { topic, count = 10 } = req.body;
  if (!topic) return res.status(400).json({ message: 'Topic required' });

  try {
    const data = await askGroq(`
You are an expert SEO content strategist.
Generate ${count} content ideas for the topic: "${topic}"

Return JSON:
{
  "ideas": [
    {
      "title": "article title",
      "keyword": "primary keyword",
      "type": "How-to"|"Listicle"|"Guide"|"Review"|"Comparison"|"Case Study",
      "estimatedVolume": <number>,
      "difficulty": <number 1-100>,
      "intent": "Informational"|"Transactional"|"Commercial"|"Navigational",
      "estimatedWordCount": <number 500-3000>
    }
  ]
}

Make titles compelling, keyword-rich, and optimized for search intent.
`);
    res.json(data);
  } catch (err) {
    console.error('Content ideas error:', err.message);
    res.status(500).json({ message: 'AI error: ' + err.message });
  }
};

/* ─── Link Building Opportunities ─── */
// POST /api/seo/links  { url, niche }
const linkOpportunities = async (req, res) => {
  const { url, niche } = req.body;
  if (!niche) return res.status(400).json({ message: 'Niche required' });

  try {
    const data = await askGroq(`
You are an expert link-building strategist.
Find link building opportunities for a ${niche} website: ${url || 'not specified'}

Return JSON:
{
  "opportunities": [
    {
      "type": "Guest Post"|"Resource Page"|"Broken Link"|"HARO"|"Directory"|"Forum"|"Podcast",
      "site": "example domain or site type",
      "da": <number 20-90>,
      "difficulty": "Easy"|"Medium"|"Hard",
      "approach": "how to approach this opportunity",
      "estimatedDR": <number>
    }
  ],
  "strategy": "overall link building strategy for this niche"
}

Generate 8-10 realistic opportunities.
`);
    res.json(data);
  } catch (err) {
    console.error('Links error:', err.message);
    res.status(500).json({ message: 'AI error: ' + err.message });
  }
};

/* ─── Technical Issues Analysis ─── */
// POST /api/seo/technical  { url }
const technicalAnalysis = async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ message: 'URL required' });

  try {
    const data = await askGroq(`
You are a technical SEO expert.
Analyze technical SEO issues for: "${url}"

Return JSON:
{
  "summary": {
    "critical": <number>,
    "warnings": <number>,
    "notices": <number>,
    "healthScore": <number 0-100>
  },
  "issues": [
    {
      "category": "Crawling"|"Indexing"|"Performance"|"Security"|"Mobile"|"Structured Data"|"Links",
      "severity": "Critical"|"Warning"|"Notice",
      "issue": "issue name",
      "description": "detailed description",
      "howToFix": "step-by-step fix",
      "affectedUrls": <estimated number>
    }
  ]
}

Generate 10-12 realistic technical issues.
`);
    res.json(data);
  } catch (err) {
    console.error('Technical error:', err.message);
    res.status(500).json({ message: 'AI error: ' + err.message });
  }
};

/* ─── Insights / Mock Search Console ─── */
// POST /api/seo/insights  { domain }
const generateInsights = async (req, res) => {
  const { domain } = req.body;
  
  try {
    const data = await askGroq(`
You are an expert SEO data analyst.
Generate realistic mock Google Search Console data for the website: "${domain || 'a tech blog'}" over a 7-day period.

Respond with ONLY a JSON object exactly matching this structure:
{
  "global": {
    "totalTraffic": "18.6K",
    "totalImpressions": "463.6K",
    "avgCtr": "6.4%",
    "avgPosition": 12.3
  },
  "trafficData": [
    { "date": "Apr 1", "traffic": 2100, "impressions": 38000 },
    { "date": "Apr 2", "traffic": 2400, "impressions": 42000 },
    { "date": "Apr 3", "traffic": 2200, "impressions": 39000 },
    { "date": "Apr 4", "traffic": 3100, "impressions": 48000 },
    { "date": "Apr 5", "traffic": 3400, "impressions": 52000 },
    { "date": "Apr 6", "traffic": 2900, "impressions": 45000 },
    { "date": "Apr 7", "traffic": 3600, "impressions": 55000 }
  ],
  "topPages": [
    { "page": "Home", "clicks": 3200, "impressions": 48000, "ctr": 6.7 },
    { "page": "About", "clicks": 2800, "impressions": 41000, "ctr": 6.8 },
    { "page": "Services", "clicks": 2100, "impressions": 38000, "ctr": 5.5 },
    { "page": "Blog", "clicks": 1900, "impressions": 29000, "ctr: 6.6 },
    { "page": "Contact", "clicks": 4100, "impressions": 62000, "ctr": 6.6 }
  ]
}

Ensure the numbers look realistic and varied. The "trafficData" array must have exactly 7 items with sequential dates. The "topPages" array must have exactly 5 items relevant to the domain.
`);
    res.json(data);
  } catch (err) {
    console.error('Insights error:', err.message);
    res.status(500).json({ message: 'AI error: ' + err.message });
  }
};

/* ─── Indexing Request Simulation ─── */
// POST /api/seo/request-indexing  { url }
const requestIndexing = async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ message: 'URL required' });

  try {
    const data = await askGroq(`
You are a Google Search Console indexing API simulator.
Analyze this URL for indexability: "${url}"

If the URL looks like a valid, well-formed web page address, respond with a success status. If it looks like a junk string or broken URL, respond with an error.

Return JSON EXACTLY like this:
{
  "success": true | false,
  "status": "Pending" | "Failed",
  "message": "specific message about the indexing request"
}
`);
    res.json(data);
  } catch (err) {
    console.error('Indexing request error:', err.message);
    res.status(500).json({ message: 'AI error: ' + err.message });
  }
};

module.exports = {
  keywordResearch,
  generateArticle,
  optimizePage,
  siteAudit,
  contentIdeas,
  linkOpportunities,
  technicalAnalysis,
  generateInsights,
  requestIndexing,
};
