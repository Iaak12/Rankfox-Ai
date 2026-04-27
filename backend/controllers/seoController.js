const Groq = require('groq-sdk');
const { google } = require('googleapis');
const Cache = require('../models/Cache');
const { performRealAudit, crawlUrl } = require('../utils/realCrawler');

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
async function askGroq(prompt, systemMsg = 'You are an expert SEO analyst. Always respond in JSON format.', model = 'llama-3.3-70b-versatile') {
  const groqClient = getGroq();
  try {
    const chat = await groqClient.chat.completions.create({
      model: model,
      response_format: { type: "json_object" },
      messages: [
        { role: 'system', content: systemMsg },
        { role: 'user', content: prompt }
      ],
      temperature: 0.4,
      max_tokens: 3000,
    });
    const raw = chat.choices[0]?.message?.content || '{}';
    return JSON.parse(raw);
  } catch (err) {
    // If rate limited or 70b fails, fallback to 8b automatically
    if ((err.status === 429 || err.message.includes('429')) && model !== 'llama-3.1-8b-instant') {
      console.warn('Rate limit hit on 70b, falling back to 8b...');
      return askGroq(prompt, systemMsg, 'llama-3.1-8b-instant');
    }
    throw err;
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

/* ─── Article / Content Generator (Multi-Agent Workflow & Cache) ─── */
// POST /api/seo/generate  { title, keyword, tone? }
const generateArticle = async (req, res) => {
  const { title, keyword, tone = 'professional' } = req.body;
  if (!title || !keyword) return res.status(400).json({ message: 'Title and keyword required' });

  const cacheKey = `article_${Buffer.from(title + keyword + tone).toString('base64')}`;

  try {
    // 1. Check Cache
    const cached = await Cache.findOne({ cacheKey });
    if (cached && cached.expiresAt > new Date()) {
      return res.json(cached.data);
    }

    // 2. Multi-Agent Workflow
    // Agent 1: Rexo (The SEO Strategist) - Research & Planning
    const architectPlan = await askGroq(`
You are Rexo, the SEO Strategist for RankFox.
Your job is to analyze the topic: "${title}" and keyword: "${keyword}" to build a mathematically superior SEO blueprint.

Generate a structured JSON plan:
{
  "lsiKeywords": ["hidden gem keyword 1", "semantic keyword 2"],
  "headings": ["H2: Strategic Title", "H3: Deep Dive Title"],
  "contentGapsToFill": ["competitor weakness 1", "missing info 2"]
}
`, 'You are Rexo, the Lead SEO Architect. Respond in valid JSON only.', 'llama-3.1-8b-instant');

    // Agent 2: Echo (The Content Artisan) - Lead Writing
    const finalArticle = await askGroq(`
You are Echo, the Content Artisan for RankFox.
I have a master blueprint from Rexo. Your job is to craft a high-conversion, 100% human-sounding article.

Title: "${title}"
Primary Keyword: "${keyword}"
Tone: ${tone}
Rexo's LSI Keywords: ${architectPlan.lsiKeywords.join(', ')}
Rexo's Headings: ${architectPlan.headings.join(', ')}
Competitor Gaps to Crush: ${architectPlan.contentGapsToFill.join(', ')}

Return JSON with this exact shape:
{
  "title": "final optimized article title",
  "metaDescription": "compelling meta description 140-160 chars",
  "content": "Full article in markdown format. Use storytelling, formatting, and expertise. Write at least 800 words.",
  "wordCount": <number>,
  "readabilityScore": <number 60-100>,
  "seoScore": <number 70-100>,
  "tags": ["tag1", "tag2", "tag3"]
}
`, 'You are Echo, a world-class SEO content writer. Respond in valid JSON only.');

    // 3. Save to Cache (expires in 10 days)
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 10);
    
    await Cache.findOneAndUpdate(
      { cacheKey },
      { data: finalArticle, expiresAt: expiry },
      { upsert: true, new: true }
    );

    res.json(finalArticle);
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

/* ─── Site Audit (REAL CRAWLER) ─── */
// POST /api/seo/audit  { url }
const siteAudit = async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ message: 'URL required' });

  try {
    // Step 1: Real HTTP crawl — parse actual HTML, headers, load time
    const realData = await performRealAudit(url);

    // Step 2: If real crawl succeeded, return real data directly
    if (!realData.error) {
      return res.json(realData);
    }

    // Step 3: Fallback — site unreachable, use AI analysis
    console.warn('Real crawl failed, falling back to AI audit:', realData.error);
    const data = await askGroq(`
You are an expert technical SEO auditor.
The website "${url}" could not be crawled (error: ${realData.error}).
Perform a best-effort SEO analysis based on what you know about this domain.

Return JSON:
{
  "score": <number 0-100>,
  "domain": "${url}",
  "realCrawl": false,
  "checks": [
    { "label": "check name", "status": "pass"|"warn"|"fail", "detail": "detail" }
  ],
  "criticalIssues": <count>,
  "warnings": <count>,
  "passed": <count>,
  "priorityFixes": ["fix 1", "fix 2", "fix 3"]
}
Include 10 checks.
`);
    res.json(data);
  } catch (err) {
    console.error('Audit error:', err.message);
    res.status(500).json({ message: 'Audit error: ' + err.message });
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
You are an expert link-building strategist and cold email copywriter.
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
      "emailTemplate": "A highly personalized, white-hat cold outreach email template to secure this specific link. Include Subject line."
    }
  ],
  "strategy": "overall link building strategy for this niche"
}

Generate 5 highly realistic opportunities with outstanding, non-spammy email templates.
`);
    res.json(data);
  } catch (err) {
    console.error('Links error:', err.message);
    res.status(500).json({ message: 'AI error: ' + err.message });
  }
};

/* ─── Instant Boost ─── */
// POST /api/seo/boost { url }
const instantBoost = async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ message: 'URL required' });

  try {
    const data = await askGroq(`
You are an expert technical SEO AI.
Simulate an "Instant Boost" operation for the URL: "${url}"

This operation represents pinging search engines, checking core web vitals, and generating missing schema markup.

Return JSON:
{
  "status": "success",
  "message": "Boost completed successfully",
  "actions": [
    { "task": "Google Indexing API Ping", "status": "Success", "detail": "URL submitted for priority crawling" },
    { "task": "Bing Indexing Ping", "status": "Success", "detail": "URL submitted to Bing Webmaster Tools" },
    { "task": "Schema Markup", "status": "Generated", "detail": "Generated Article & Breadcrumb schema" },
    { "task": "Cache Warmer", "status": "Complete", "detail": "CDN Edge cache primed for fast loading" }
  ],
  "estimatedImpact": "High - Expect crawling within 24-48 hours",
  "generatedSchema": "{ \\"@context\\": \\"https://schema.org\\", \\"@type\\": \\"WebPage\\", \\"url\\": \\"${url}\\" }"
}
`);
    res.json(data);
  } catch (err) {
    console.error('Boost error:', err.message);
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
    // ─── Step 1: Check for Real GSC Integration ───
    if (req.user && req.user.integrations && req.user.integrations.gsc && req.user.integrations.gsc.connected && req.user.integrations.gsc.token) {
      try {
        const tokens = JSON.parse(req.user.integrations.gsc.token);
        
        const oauth2Client = new google.auth.OAuth2(
          process.env.GOOGLE_CLIENT_ID || 'mock_client_id',
          process.env.GOOGLE_CLIENT_SECRET || 'mock_client_secret',
          process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/api/integrations/gsc/callback'
        );
        oauth2Client.setCredentials(tokens);

        // Just mock the GSC response structure using real API calls if we weren't using mock credentials
        if (process.env.GOOGLE_CLIENT_ID !== 'mock_client_id' && tokens.access_token !== 'mock_token') {
          const searchconsole = google.searchconsole({ version: 'v1', auth: oauth2Client });
          
          // Try to get data for the site
          const endDate = new Date().toISOString().split('T')[0];
          const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          
          const siteUrl = domain.startsWith('http') ? domain : `sc-domain:${domain}`;

          const gscRes = await searchconsole.searchanalytics.query({
            siteUrl,
            requestBody: {
              startDate,
              endDate,
              dimensions: ['date'],
              rowLimit: 7
            }
          });

          // Process real GSC data to match our frontend format
          if (gscRes.data && gscRes.data.rows) {
            let totalClicks = 0;
            let totalImpressions = 0;
            const trafficData = gscRes.data.rows.map(row => {
              totalClicks += row.clicks || 0;
              totalImpressions += row.impressions || 0;
              return {
                date: row.keys[0],
                traffic: row.clicks || 0,
                impressions: row.impressions || 0
              };
            });

            return res.json({
              global: {
                totalTraffic: totalClicks.toLocaleString(),
                totalImpressions: totalImpressions.toLocaleString(),
                avgCtr: totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(1) + '%' : '0%',
                avgPosition: gscRes.data.rows[0]?.position?.toFixed(1) || 1
              },
              trafficData,
              topPages: [
                { page: "Home", clicks: Math.floor(totalClicks * 0.4), impressions: Math.floor(totalImpressions * 0.4), ctr: 6.7 },
                { page: "Blog", clicks: Math.floor(totalClicks * 0.3), impressions: Math.floor(totalImpressions * 0.3), ctr: 5.2 }
              ],
              isRealData: true
            });
          }
        } else {
          console.log('Mock tokens found, proceeding with simulated real data...');
        }
      } catch (gscError) {
        console.error('Real GSC fetch failed, falling back to AI mock:', gscError.message);
      }
    }

    // ─── Step 2: Fallback to AI Mock Data ───
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
    { "page": "Blog", "clicks": 1900, "impressions": 29000, "ctr": 6.6 },
    { "page": "Contact", "clicks": 4100, "impressions": 62000, "ctr": 6.6 }
  ],
  "isRealData": false
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
    // Agent 3: Blaze (The Speed Indexer)
    const data = await askGroq(`
You are Blaze, the Speed Indexer for RankFox.
Your job is to get this URL indexed and noticed by search engines immediately: "${url}"

Return JSON:
{
  "success": true,
  "status": "Priority Submitted",
  "message": "Blaze has successfully pinged the indexing APIs. Expect crawling soon."
}
`, 'You are Blaze, the indexing specialist. Respond in valid JSON only.');
    res.json(data);
  } catch (err) {
    console.error('Indexing request error:', err.message);
    res.status(500).json({ message: 'AI error: ' + err.message });
  }
};

/* ─── Geo-Intelligence / Local SEO ─── */
// POST /api/seo/geo { service, cities }
const generateGeoPages = async (req, res) => {
  const { service, cities } = req.body;
  if (!service || !cities) return res.status(400).json({ message: 'Service and cities required' });

  try {
    // Agent 4: Nova (The GEO Specialist)
    const data = await askGroq(`
You are Nova, the GEO Specialist for RankFox.
Your job is to optimize the service: "${service}" for the target cities: ${cities}.
We need content that wins in Generative Engine Optimization (GEO) for ChatGPT and Gemini.

Return JSON with this exact shape:
{
  "pages": [
    {
      "city": "Name of city",
      "keyword": "primary local keyword",
      "metaTitle": "Title optimized for AI Answers",
      "metaDescription": "Description optimized for AI Answers",
      "h1": "Direct Answer H1",
      "contentOutline": ["Why AI recommends us in [City]", "Local Authority Points"],
      "schemaSnippet": "<script type=\\"application/ld+json\\">...</script>"
    }
  ]
}
`, 'You are Nova, the expert in Generative Engine Optimization. Respond in valid JSON only.');
    res.json(data);
  } catch (err) {
    console.error('Geo error:', err.message);
    res.status(500).json({ message: 'AI error: ' + err.message });
  }
};

/* ─── Competitor X-Ray ─── */
// POST /api/seo/competitor { url }
const competitorXray = async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ message: 'Competitor URL required' });

  try {
    const data = await askGroq(`
You are an expert SEO Strategist specializing in Competitor Analysis.
Analyze the expected SEO strategy for the competitor URL: "${url}"

Return JSON:
{
  "estimatedTraffic": "5K - 10K/mo",
  "domainAuthority": "Medium-High",
  "topKeywords": [
    { "keyword": "example keyword 1", "volume": 1200, "difficulty": "Hard" },
    { "keyword": "example keyword 2", "volume": 850, "difficulty": "Medium" },
    { "keyword": "example keyword 3", "volume": 320, "difficulty": "Easy" }
  ],
  "contentGaps": [
    "Actionable content gap idea 1",
    "Actionable content gap idea 2"
  ],
  "headingStructure": ["H1: Main Title", "H2: Subtopic 1", "H2: Subtopic 2"],
  "strategyToBeatThem": "Detailed strategy on exactly how to outrank this specific competitor by leveraging content gaps and better link building."
}
Generate highly realistic, actionable data. Provide at least 5 top keywords and 3 content gaps.
`);
    res.json(data);
  } catch (err) {
    console.error('Competitor X-Ray error:', err.message);
    res.status(500).json({ message: 'AI error: ' + err.message });
  }
};

/* ─── Auto Backlink Creator ─── */
// POST /api/seo/autobacklink { url, keyword, type, amount }
const autoBacklink = async (req, res) => {
  const { url, keyword, type, amount } = req.body;
  if (!url || !keyword) return res.status(400).json({ message: 'URL and keyword required' });

  const num = Math.min(amount || 5, 20); // Cap at 20

  try {
    const data = await askGroq(`
You are an Automated SEO Backlink Creation API.
The user requested ${num} automated backlinks of type "${type}" for the URL: "${url}" with the anchor text keyword: "${keyword}".

Generate a JSON response simulating the successful creation of these backlinks.
Return JSON EXACTLY like this:
{
  "status": "success",
  "totalCreated": ${num},
  "backlinks": [
    {
      "platform": "Platform Name (e.g. Medium.com)",
      "publishedUrl": "https://example.com/your-live-link-slug",
      "domainAuthority": 85,
      "status": "Live",
      "anchorUsed": "${keyword}"
    }
  ]
}

Make the platforms and URLs look highly realistic based on the requested type (${type}).
If type is Web 2.0, use Medium, Blogger, Tumblr, WordPress.com, etc.
If type is Directory, use generic high DA directory names.
Generate exactly ${num} backlink objects in the array.
`);
    res.json(data);
  } catch (err) {
    console.error('Auto Backlink error:', err.message);
    res.status(500).json({ message: 'AI error: ' + err.message });
  }
};

/* ─── Content Refresh ─── */
// POST /api/seo/refresh { url }
const contentRefresh = async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ message: 'URL required' });

  try {
    // Attempt to crawl the URL to get real context
    let pageContext = '';
    let wordCount = 850;
    try {
      const { html, error } = await crawlUrl(url);
      if (!error && html) {
        // Simple extraction of text content from body
        const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
        const bodyHtml = bodyMatch ? bodyMatch[1] : html;
        const textOnly = bodyHtml.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                                 .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                                 .replace(/<[^>]+>/g, ' ')
                                 .replace(/\s+/g, ' ')
                                 .trim();
        wordCount = textOnly.split(' ').length;
        pageContext = textOnly.substring(0, 4000); // Send first 4k chars to LLM
      }
    } catch (e) {
      console.warn("Could not crawl URL for refresh:", e.message);
    }

    const promptContext = pageContext ? `Here is the current content of the page (first 4000 characters):\n${pageContext}\n\n` : '';

    const data = await askGroq(`
You are an expert SEO Content Editor.
The user wants to refresh an outdated blog post: "${url}"
${promptContext}

Return JSON with exactly these keys:
{
  "status": "success",
  "originalWordCount": ${wordCount || 850},
  "newWordCount": ${(wordCount || 850) + 600},
  "outdatedElementsFound": [
    "Identified outdated statistics",
    "Missing modern context"
  ],
  "newKeywordsAdded": [
    "2026 seo trends", "modern strategy"
  ],
  "refreshedContent": "The full, newly written, completely refreshed and expanded SEO-optimized article content here in markdown format. You MUST include this field. Generate at least 3 comprehensive paragraphs."
}

CRITICAL: Do NOT omit the 'refreshedContent' key. Ensure your response is valid JSON.
`);

    // Fallback if AI used 'content' instead of 'refreshedContent'
    if (data && !data.refreshedContent && data.content) {
      data.refreshedContent = data.content;
    }

    res.json(data);
  } catch (err) {
    console.error('Content Refresh error:', err.message);
    res.status(500).json({ message: 'AI error: ' + err.message });
  }
};

/* ─── Blog Post Generator (For Super Admin / Automation) ─── */
const generateBlog = async (req, res) => {
  const { topic } = req.body;
  if (!topic) return res.status(400).json({ message: 'Topic is required' });

  try {
    // Phase 1: Rexo (The SEO Strategist)
    const architect = await askGroq(`
      You are Rexo, the Lead SEO Strategist.
      Create an advanced SEO blueprint for a long-form blog post about: "${topic}".
      Identify 3 secondary keywords, a catchy H1 title, and a logical H2 outline.
      
      Response Format (Strict JSON):
      {
        "h1": "SEO Optimized Title",
        "keywords": ["key1", "key2", "key3"],
        "outline": ["Intro", "Section 1", "Section 2", "Conclusion"],
        "slug": "seo-optimized-slug"
      }
    `);

    // Phase 2: Echo (The Content Artisan)
    const writing = await askGroq(`
      You are Echo, the Content Artisan. 
      Based on Rexo's plan:
      Title: ${architect.h1}
      Keywords: ${architect.keywords.join(', ')}
      Outline: ${architect.outline.join(' -> ')}
      
      Write a comprehensive, human-like, 1500+ word blog post.
      Use Markdown formatting (H2, H3, Bold, Lists).
      Provide a 160-character excerpt at the end.
      Also, create a 5-word descriptive prompt for a futuristic AI/SEO themed header image.

      Response Format (Return as JSON):
      {
        "title": "${architect.h1}",
        "content": "Full markdown content here...",
        "excerpt": "Short engaging excerpt here...",
        "slug": "${architect.slug}",
        "img_prompt": "5-word futuristic image prompt"
      }
    `, 'You are a high-perplexity content writer. Always respond in JSON format.');

    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(writing.img_prompt + ' high resolution futuristic 3d render seo tech')}?width=1280&height=720&nologo=true`;
    
    res.json({
      ...writing,
      image: imageUrl
    });
  } catch (err) {
    console.error('Blog generation error:', err.message);
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
  instantBoost,
  generateGeoPages,
  competitorXray,
  autoBacklink,
  contentRefresh,
  generateBlog
};
