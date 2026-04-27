const fetch = require('node-fetch');

// Timeout helper
function fetchWithTimeout(url, ms = 10000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ms);
  return fetch(url, { signal: controller.signal }).finally(() => clearTimeout(timeout));
}

/* ─── Real Website Crawler ─── */
// Returns raw HTML + headers + timing from an actual HTTP request
async function crawlUrl(rawUrl) {
  // Normalize URL
  let url = rawUrl.trim();
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }

  const startTime = Date.now();
  let html = '';
  let statusCode = 0;
  let headers = {};
  let loadTimeMs = 0;
  let error = null;

  try {
    const response = await fetchWithTimeout(url, 12000);
    statusCode = response.status;
    headers = Object.fromEntries(response.headers.entries());
    html = await response.text();
    loadTimeMs = Date.now() - startTime;
  } catch (err) {
    error = err.message;
    loadTimeMs = Date.now() - startTime;
  }

  return { url, html, statusCode, headers, loadTimeMs, error };
}

/* ─── HTML Analyzers ─── */
function extractTag(html, tag) {
  const m = html.match(new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`, 'i'));
  return m ? m[1].trim() : '';
}

function extractMeta(html, name) {
  const patterns = [
    new RegExp(`<meta\\s+name=["']${name}["']\\s+content=["']([^"']*)["']`, 'i'),
    new RegExp(`<meta\\s+content=["']([^"']*)["']\\s+name=["']${name}["']`, 'i'),
  ];
  for (const p of patterns) {
    const m = html.match(p);
    if (m) return m[1].trim();
  }
  return '';
}

function extractOgMeta(html, prop) {
  const m = html.match(new RegExp(`<meta\\s+property=["']og:${prop}["']\\s+content=["']([^"']*)["']`, 'i'));
  return m ? m[1].trim() : '';
}

function countTags(html, tag) {
  return (html.match(new RegExp(`<${tag}[^>]*>`, 'gi')) || []).length;
}

function extractAllTags(html, tag) {
  const matches = [];
  const re = new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`, 'gi');
  let m;
  while ((m = re.exec(html)) !== null) matches.push(m[1].trim());
  return matches;
}

function hasSchema(html) {
  return html.includes('application/ld+json');
}

function hasRobotsMeta(html) {
  const m = extractMeta(html, 'robots');
  return { exists: !!m, value: m };
}

function countImages(html) {
  const imgs = html.match(/<img[^>]*>/gi) || [];
  const withAlt = imgs.filter(i => /alt=["'][^"']+["']/i.test(i));
  return { total: imgs.length, withAlt: withAlt.length };
}

function extractCanonical(html) {
  const m = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i);
  return m ? m[1] : '';
}

function countInternalLinks(html, domain) {
  const links = html.match(/<a[^>]+href=["']([^"']*)["']/gi) || [];
  return links.filter(l => {
    const href = l.match(/href=["']([^"']*)/i)?.[1] || '';
    return href.startsWith('/') || href.includes(domain);
  }).length;
}

function hasViewport(html) {
  return /<meta[^>]+name=["']viewport["']/i.test(html);
}

/* ─── Main Real Audit Function ─── */
async function performRealAudit(rawUrl) {
  const { url, html, statusCode, headers, loadTimeMs, error } = await crawlUrl(rawUrl);

  const domain = (() => {
    try { return new URL(url).hostname; } catch { return rawUrl; }
  })();

  if (error || statusCode === 0) {
    return {
      score: 0,
      domain,
      realCrawl: true,
      error: error || 'Could not reach site',
      checks: [],
      criticalIssues: 1,
      warnings: 0,
      passed: 0,
      priorityFixes: ['Fix site connectivity — the URL could not be reached'],
    };
  }

  // ─── Run all checks ───
  const title = extractTag(html, 'title');
  const metaDesc = extractMeta(html, 'description');
  const h1s = extractAllTags(html, 'h1');
  const h2Count = countTags(html, 'h2');
  const images = countImages(html);
  const schema = hasSchema(html);
  const canonical = extractCanonical(html);
  const ogTitle = extractOgMeta(html, 'title');
  const ogDesc = extractOgMeta(html, 'description');
  const isHttps = url.startsWith('https://');
  const viewport = hasViewport(html);
  const internalLinks = countInternalLinks(html, domain);
  const robots = hasRobotsMeta(html);
  const wordCount = html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;

  const checks = [
    {
      label: 'HTTPS / SSL',
      status: isHttps ? 'pass' : 'fail',
      detail: isHttps ? `Site is served over HTTPS ✓` : `Site is NOT using HTTPS — critical security issue`,
    },
    {
      label: 'Title Tag',
      status: title ? (title.length >= 30 && title.length <= 65 ? 'pass' : 'warn') : 'fail',
      detail: title
        ? `Title: "${title}" (${title.length} chars) — ${title.length < 30 ? 'too short' : title.length > 65 ? 'too long' : 'optimal length'}`
        : 'No title tag found',
    },
    {
      label: 'Meta Description',
      status: metaDesc ? (metaDesc.length >= 120 && metaDesc.length <= 160 ? 'pass' : 'warn') : 'fail',
      detail: metaDesc
        ? `"${metaDesc.substring(0, 80)}..." (${metaDesc.length} chars)`
        : 'No meta description found — add one for better CTR',
    },
    {
      label: 'H1 Tag',
      status: h1s.length === 1 ? 'pass' : (h1s.length === 0 ? 'fail' : 'warn'),
      detail: h1s.length === 0
        ? 'No H1 tag found'
        : h1s.length === 1
        ? `H1: "${h1s[0].substring(0, 60)}" ✓`
        : `Multiple H1 tags found (${h1s.length}) — use exactly one`,
    },
    {
      label: 'H2 Structure',
      status: h2Count >= 2 ? 'pass' : (h2Count === 1 ? 'warn' : 'fail'),
      detail: `Found ${h2Count} H2 tag(s) — ${h2Count < 2 ? 'add more H2 sections to improve structure' : 'good heading hierarchy ✓'}`,
    },
    {
      label: 'Image Alt Text',
      status: images.total === 0 ? 'warn' : (images.withAlt === images.total ? 'pass' : 'warn'),
      detail: images.total === 0
        ? 'No images found on page'
        : `${images.withAlt}/${images.total} images have alt text${images.withAlt < images.total ? ' — add alt text to remaining images' : ' ✓'}`,
    },
    {
      label: 'Schema Markup',
      status: schema ? 'pass' : 'warn',
      detail: schema ? 'JSON-LD schema markup detected ✓' : 'No schema markup found — add structured data for rich snippets',
    },
    {
      label: 'Canonical Tag',
      status: canonical ? 'pass' : 'warn',
      detail: canonical ? `Canonical: ${canonical} ✓` : 'No canonical tag — add one to prevent duplicate content issues',
    },
    {
      label: 'Open Graph Tags',
      status: ogTitle && ogDesc ? 'pass' : (ogTitle || ogDesc ? 'warn' : 'fail'),
      detail: ogTitle
        ? `OG Title: "${ogTitle.substring(0, 50)}" ✓`
        : 'No Open Graph tags — add og:title and og:description for social sharing',
    },
    {
      label: 'Mobile Viewport',
      status: viewport ? 'pass' : 'fail',
      detail: viewport ? 'Viewport meta tag found — mobile-friendly ✓' : 'Missing viewport meta tag — site may not be mobile-friendly',
    },
    {
      label: 'Internal Links',
      status: internalLinks >= 3 ? 'pass' : (internalLinks >= 1 ? 'warn' : 'fail'),
      detail: `${internalLinks} internal links found — ${internalLinks < 3 ? 'add more internal links to improve crawlability' : 'good internal linking ✓'}`,
    },
    {
      label: 'Page Load Time',
      status: loadTimeMs < 2000 ? 'pass' : (loadTimeMs < 5000 ? 'warn' : 'fail'),
      detail: `Loaded in ${loadTimeMs}ms — ${loadTimeMs < 2000 ? 'fast ✓' : loadTimeMs < 5000 ? 'acceptable (aim for <2s)' : 'slow — optimize server response time'}`,
    },
    {
      label: 'HTTP Status',
      status: statusCode === 200 ? 'pass' : (statusCode >= 300 && statusCode < 400 ? 'warn' : 'fail'),
      detail: `Status code: ${statusCode} — ${statusCode === 200 ? 'OK ✓' : statusCode >= 300 && statusCode < 400 ? 'Redirect detected' : 'Error response'}`,
    },
    {
      label: 'Content Length',
      status: wordCount > 600 ? 'pass' : (wordCount > 300 ? 'warn' : 'fail'),
      detail: `~${wordCount} words on page — ${wordCount < 300 ? 'too thin, add more content' : wordCount < 600 ? 'add more depth' : 'good content volume ✓'}`,
    },
  ];

  const passed = checks.filter(c => c.status === 'pass').length;
  const warnings = checks.filter(c => c.status === 'warn').length;
  const criticalIssues = checks.filter(c => c.status === 'fail').length;
  const score = Math.round((passed / checks.length) * 100);

  const priorityFixes = checks
    .filter(c => c.status === 'fail')
    .slice(0, 5)
    .map(c => `Fix: ${c.label} — ${c.detail}`);

  if (priorityFixes.length === 0) {
    checks.filter(c => c.status === 'warn').slice(0, 3).forEach(c => {
      priorityFixes.push(`Improve: ${c.label} — ${c.detail}`);
    });
  }

  return {
    score,
    domain,
    statusCode,
    loadTimeMs,
    realCrawl: true,
    checks,
    criticalIssues,
    warnings,
    passed,
    priorityFixes,
    crawledAt: new Date().toISOString(),
  };
}

module.exports = { performRealAudit, crawlUrl };
