import React, { useState } from 'react';
import { Settings2, CheckCircle2, AlertTriangle, AlertCircle, Sparkles, Copy, Check } from 'lucide-react';
import { seoApi } from '../utils/seoApi';

const STATUS_ICON = {
  pass: <CheckCircle2 size={16} color="#16a34a" />,
  warn: <AlertTriangle size={16} color="#f59e0b" />,
  fail: <AlertCircle size={16} color="#dc2626" />,
};

export default function PageOptimizer() {
  const [content, setContent] = useState('');
  const [keyword, setKeyword] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');

  const wordCount = content.split(/\s+/).filter(Boolean).length;

  const handleAnalyze = async () => {
    if (!keyword.trim()) {
      setError('Please enter a target keyword.');
      return;
    }
    if (!content.trim() && !url.trim()) {
      setError('Please enter content or a URL to analyze.');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await seoApi('optimize', { content, keyword, url });
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const copyText = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(''), 2000);
  };

  const scoreColor = (s) => s >= 80 ? '#16a34a' : s >= 60 ? '#f59e0b' : '#dc2626';

  return (
    <div className="page-content">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 18, alignItems: 'start' }}>
        {/* Editor */}
        <div>
          <div className="card" style={{ marginBottom: 14 }}>
            <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Sparkles size={16} style={{ color: '#7c3aed' }} /> AI Page Optimizer
            </div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
              <input className="big-input" placeholder="Target keyword *" value={keyword}
                onChange={e => setKeyword(e.target.value)} style={{ maxWidth: 220 }} />
              <input className="big-input" placeholder="Page URL (optional)" value={url}
                onChange={e => setUrl(e.target.value)} style={{ flex: 1, minWidth: 160 }} />
              <button className="primary-btn" onClick={handleAnalyze} disabled={loading || !keyword || (!content && !url)}>
                {loading ? <><span className="spinner" /> Analyzing…</> : <><Settings2 size={15} /> Analyze</>}
              </button>
            </div>
            {error && <div className="acc-msg error" style={{ marginBottom: 10 }}>{error}</div>}
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Paste your article or page content here to analyze and get AI-powered optimization suggestions…"
              style={{
                width: '100%', minHeight: 420, padding: '14px', border: '1.5px solid #e0e0ea',
                borderRadius: 10, fontSize: 13, fontFamily: 'Inter', resize: 'vertical',
                outline: 'none', lineHeight: 1.7, color: '#1a1a2e', transition: 'border-color 0.14s'
              }}
              onFocus={e => e.target.style.borderColor = '#7c3aed'}
              onBlur={e => e.target.style.borderColor = '#e0e0ea'}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              <span className="text-muted">{wordCount} words</span>
              <span className="text-muted">{content.length} chars</span>
            </div>
          </div>
        </div>

        {/* Score panel */}
        <div>
          {loading && (
            <div className="card" style={{ textAlign: 'center', padding: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, color: '#7c3aed', fontWeight: 600 }}>
                <span className="spinner" style={{ borderColor: 'rgba(124,58,237,0.3)', borderTopColor: '#7c3aed' }} />
                AI Analyzing…
              </div>
              <p style={{ color: '#9ca3af', fontSize: 12, marginTop: 8 }}>Checking 12+ SEO factors</p>
            </div>
          )}

          {result && !loading && (
            <>
              {/* Score */}
              <div className="card" style={{ textAlign: 'center', marginBottom: 14 }}>
                <div className="optimizer-score" style={{ color: scoreColor(result.score) }}>{result.score}</div>
                <div style={{ fontSize: 13, color: '#6b7280', marginTop: 6 }}>Optimization Score</div>
                <div style={{ height: 6, background: '#f0f0f5', borderRadius: 99, marginTop: 10, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${result.score}%`, background: `linear-gradient(90deg,${scoreColor(result.score)},${scoreColor(result.score)}88)`, borderRadius: 99, transition: 'width 0.6s ease' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9ca3af', marginTop: 8 }}>
                  <span>Keyword Density: {result.keywordDensity}%</span>
                  <span>Readability: {result.readabilityScore}</span>
                </div>
              </div>

              {/* AI Suggestions */}
              {result.titleSuggestion && (
                <div className="card" style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: 10 }}>AI Suggestions</div>
                  {[
                    { key: 'title', label: 'Optimized Title', value: result.titleSuggestion },
                    { key: 'meta', label: 'Meta Description', value: result.metaSuggestion },
                  ].map(({ key, label, value }) => value && (
                    <div key={key} style={{ marginBottom: 10 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', marginBottom: 4 }}>{label}</div>
                      <div style={{ background: '#f8f8fc', borderRadius: 8, padding: '8px 10px', fontSize: 12, color: '#1a1a2e', lineHeight: 1.5, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                        <span>{value}</span>
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', flexShrink: 0 }}
                          onClick={() => copyText(value, key)}>
                          {copied === key ? <Check size={13} color="#16a34a" /> : <Copy size={13} />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Checklist */}
              <div className="table-card">
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f5', fontWeight: 700, fontSize: 13 }}>
                  SEO Checklist
                </div>
                {(result.checks || []).map((c, i) => (
                  <div key={i} className="optimizer-item" style={{ padding: '10px 16px' }}>
                    {STATUS_ICON[c.status] || STATUS_ICON.warn}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#1a1a2e' }}>{c.label}</div>
                      <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{c.detail}</div>
                    </div>
                    <span className="keyword-badge" style={{
                      background: c.status === 'pass' ? '#dcfce7' : c.status === 'warn' ? '#ffedd5' : '#fee2e2',
                      color: c.status === 'pass' ? '#16a34a' : c.status === 'warn' ? '#ea580c' : '#dc2626'
                    }}>
                      {c.status === 'pass' ? 'Pass' : c.status === 'warn' ? 'Warn' : 'Fail'}
                    </span>
                  </div>
                ))}
              </div>

              {/* What to improve */}
              {result.suggestions?.length > 0 && (
                <div className="card" style={{ marginTop: 14 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: 10 }}>Priority Improvements</div>
                  {result.suggestions.map((s, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, fontSize: 12, color: '#374151', alignItems: 'flex-start' }}>
                      <span style={{ background: '#7c3aed', color: '#fff', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
                      {s}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {!result && !loading && (
            <div className="card" style={{ textAlign: 'center', padding: 40 }}>
              <Settings2 size={40} style={{ color: '#d1d5db', marginBottom: 12 }} />
              <div style={{ color: '#9ca3af', fontSize: 13 }}>Paste content & enter keyword,<br />then click Analyze</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
