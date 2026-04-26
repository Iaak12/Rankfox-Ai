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
async function askGroq(prompt, systemMsg = 'You are an expert SEO analyst. Always respond with valid JSON only.') {
  const groqClient = getGroq();
  const chat = await groqClient.chat.completions.create({
    model: 'llama3-70b-8192',
    messages: [
      { role: 'system', content: systemMsg },
      { role: 'user', content: prompt }
    ],
    temperature: 0.4,
    max_tokens: 2048,
  });
  const raw = chat.choices[0]?.message?.content || '{}';
  // Strip markdown code fences if present
  const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(cleaned);
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
  if (!content || !keyword) return res.status(400).json({ message: 'Content and keyword required' });

  const wordCount = content.split(/\s+/).filter(Boolean).length;

  try {
    const data = await askGroq(`
You are an expert on-page SEO analyst.
Analyze this content for the keyword: "${keyword}"
URL: ${url || 'not provided'}
Word count: ${wordCount}

Content (first 3000 chars):
${content.substring(0, 3000)}

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

module.exports = {
  keywordResearch,
  generateArticle,
  optimizePage,
  siteAudit,
  contentIdeas,
  linkOpportunities,
  technicalAnalysis,
};
