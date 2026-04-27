import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const PLATFORM_ICONS = {
  ChatGPT: '🤖',
  Gemini: '✨',
  Perplexity: '🔭',
  Claude: '🧠',
  Grok: '⚡',
};

const PLATFORM_COLORS = {
  ChatGPT: '#10a37f',
  Gemini: '#4285f4',
  Perplexity: '#7c3aed',
  Claude: '#d97706',
  Grok: '#1da1f2',
};

const SENTIMENT_CONFIG = {
  positive: { label: 'Positive', color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
  neutral: { label: 'Neutral', color: '#94a3b8', bg: 'rgba(148,163,184,0.12)' },
  negative: { label: 'Negative', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
  not_mentioned: { label: 'Not Found', color: '#64748b', bg: 'rgba(100,116,139,0.08)' },
};

function GeoScoreGauge({ score }) {
  const color = score >= 70 ? '#22c55e' : score >= 40 ? '#f59e0b' : '#ef4444';
  const label = score >= 70 ? 'Strong' : score >= 40 ? 'Moderate' : 'Weak';
  const circumference = 2 * Math.PI * 54;
  const dashOffset = circumference - (score / 100) * circumference;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <svg width="140" height="140" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
        <circle
          cx="60" cy="60" r="54"
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
          style={{ transition: 'stroke-dashoffset 1.2s ease' }}
        />
        <text x="60" y="55" textAnchor="middle" fill="white" fontSize="26" fontWeight="700">{score}</text>
        <text x="60" y="73" textAnchor="middle" fill="#94a3b8" fontSize="11">/100</text>
      </svg>
      <span style={{ color, fontWeight: 700, fontSize: 15 }}>{label} AI Visibility</span>
    </div>
  );
}

export default function GeoMonitor() {
  const [brandName, setBrandName] = useState('');
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('scan');

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (activeTab === 'history') fetchHistory();
  }, [activeTab]);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API}/api/geo-monitor/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory(res.data);
    } catch { /* ignore */ }
  };

  const handleScan = async () => {
    if (!brandName.trim()) return setError('Enter your brand name to scan');
    setError('');
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.post(
        `${API}/api/geo-monitor/scan`,
        { brandName: brandName.trim(), domain: domain.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Scan failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 0 40px' }}>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
        {['scan', 'history'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 20px',
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 13,
              background: activeTab === tab ? '#7c3aed' : 'rgba(255,255,255,0.06)',
              color: activeTab === tab ? '#fff' : '#94a3b8',
              transition: 'all 0.2s',
            }}
          >
            {tab === 'scan' ? '🔍 New Scan' : '📋 Scan History'}
          </button>
        ))}
      </div>

      {activeTab === 'scan' && (
        <>
          {/* Input Card */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(59,130,246,0.08))',
            border: '1px solid rgba(124,58,237,0.3)',
            borderRadius: 16,
            padding: 28,
            marginBottom: 24,
          }}>
            <h2 style={{ color: '#fff', margin: '0 0 6px', fontSize: 20, fontWeight: 700 }}>
              🌐 AI Brand Mention Scanner
            </h2>
            <p style={{ color: '#94a3b8', fontSize: 14, margin: '0 0 24px' }}>
              Check if your brand is mentioned across ChatGPT, Gemini, Perplexity, Claude & Grok
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={{ color: '#94a3b8', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>
                  BRAND NAME *
                </label>
                <input
                  value={brandName}
                  onChange={e => setBrandName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleScan()}
                  placeholder="e.g. RankFox"
                  style={{
                    width: '100%', padding: '11px 14px', borderRadius: 10,
                    border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.06)',
                    color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>
              <div>
                <label style={{ color: '#94a3b8', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>
                  WEBSITE (optional)
                </label>
                <input
                  value={domain}
                  onChange={e => setDomain(e.target.value)}
                  placeholder="e.g. rankfox.ai"
                  style={{
                    width: '100%', padding: '11px 14px', borderRadius: 10,
                    border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.06)',
                    color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {error && (
              <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, color: '#f87171', fontSize: 13 }}>
                {error}
              </div>
            )}

            <button
              onClick={handleScan}
              disabled={loading}
              style={{
                marginTop: 18,
                padding: '12px 32px',
                background: loading ? 'rgba(124,58,237,0.4)' : 'linear-gradient(135deg, #7c3aed, #3b82f6)',
                color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 14,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', gap: 8,
                transition: 'all 0.2s',
              }}
            >
              {loading ? (
                <>
                  <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⚙️</span>
                  Scanning AI Platforms...
                </>
              ) : '🔍 Scan AI Visibility'}
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 14, padding: 32, textAlign: 'center',
            }}>
              <div style={{ fontSize: 36, marginBottom: 16 }}>🔭</div>
              <p style={{ color: '#e2e8f0', fontWeight: 600, marginBottom: 8 }}>Querying AI Platforms...</p>
              <p style={{ color: '#64748b', fontSize: 13 }}>
                Checking ChatGPT → Gemini → Perplexity → Claude → Grok
              </p>
              <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center', gap: 8 }}>
                {['ChatGPT', 'Gemini', 'Perplexity', 'Claude', 'Grok'].map((p, i) => (
                  <div key={p} style={{
                    width: 40, height: 40, borderRadius: 8, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: 18,
                    background: `rgba(${i * 30}, ${i * 20 + 80}, 255, 0.1)`,
                    animation: `pulse 1.5s ease ${i * 0.2}s infinite`,
                  }}>
                    {PLATFORM_ICONS[p]}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          {result && !loading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

              {/* Score + Summary Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 18 }}>
                {/* GEO Score Gauge */}
                <div style={{
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 14, padding: '24px 32px', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <p style={{ color: '#64748b', fontSize: 12, fontWeight: 600, margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: 1 }}>
                    GEO Score
                  </p>
                  <GeoScoreGauge score={result.geoScore} />
                </div>

                {/* Summary Stats */}
                <div style={{
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 14, padding: 24,
                }}>
                  <h3 style={{ color: '#fff', margin: '0 0 16px', fontSize: 16 }}>
                    Results for <span style={{ color: '#7c3aed' }}>"{result.brandName}"</span>
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                    {[
                      { label: 'AI Platforms Checked', value: result.summary.totalChecked, color: '#94a3b8' },
                      { label: '✅ Mentioned On', value: result.summary.mentioned, color: '#22c55e' },
                      { label: '❌ Not Found On', value: result.summary.notMentioned, color: '#ef4444' },
                      { label: '😊 Positive', value: result.summary.positive, color: '#22c55e' },
                      { label: '😐 Neutral', value: result.summary.neutral, color: '#94a3b8' },
                      { label: '😞 Negative', value: result.summary.negative, color: '#ef4444' },
                    ].map(stat => (
                      <div key={stat.label} style={{
                        padding: '14px', background: 'rgba(255,255,255,0.04)',
                        borderRadius: 10, textAlign: 'center',
                      }}>
                        <div style={{ fontSize: 24, fontWeight: 800, color: stat.color }}>{stat.value}</div>
                        <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Platform Breakdown */}
              <div style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 14, padding: 24,
              }}>
                <h3 style={{ color: '#fff', margin: '0 0 18px', fontSize: 15, fontWeight: 700 }}>
                  Platform-by-Platform Breakdown
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {result.mentions.map((mention) => {
                    const sc = SENTIMENT_CONFIG[mention.sentiment] || SENTIMENT_CONFIG.not_mentioned;
                    const platformColor = PLATFORM_COLORS[mention.platform] || '#7c3aed';
                    return (
                      <div key={mention.platform} style={{
                        display: 'grid', gridTemplateColumns: '160px 1fr auto',
                        gap: 16, alignItems: 'start',
                        padding: '14px 16px', borderRadius: 10,
                        background: mention.mentioned ? 'rgba(34,197,94,0.04)' : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${mention.mentioned ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.06)'}`,
                      }}>
                        {/* Platform Name */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            width: 36, height: 36, borderRadius: 8, display: 'flex',
                            alignItems: 'center', justifyContent: 'center', fontSize: 18,
                            background: `${platformColor}18`,
                          }}>
                            {PLATFORM_ICONS[mention.platform]}
                          </div>
                          <div>
                            <div style={{ color: '#e2e8f0', fontWeight: 600, fontSize: 13 }}>{mention.platform}</div>
                            <div style={{ color: '#475569', fontSize: 11 }}>AI Platform</div>
                          </div>
                        </div>

                        {/* Excerpt / Query */}
                        <div>
                          <div style={{ color: '#64748b', fontSize: 11, marginBottom: 4 }}>
                            Query: "{mention.query}"
                          </div>
                          {mention.excerpt ? (
                            <div style={{ color: '#cbd5e1', fontSize: 12, fontStyle: 'italic', lineHeight: 1.5 }}>
                              "{mention.excerpt.substring(0, 150)}{mention.excerpt.length > 150 ? '...' : ''}"
                            </div>
                          ) : (
                            <div style={{ color: '#475569', fontSize: 12 }}>
                              Brand not mentioned in AI response
                            </div>
                          )}
                        </div>

                        {/* Sentiment Badge */}
                        <div style={{
                          padding: '5px 12px', borderRadius: 20,
                          background: sc.bg, color: sc.color,
                          fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap',
                        }}>
                          {mention.mentioned ? '✓ ' : '✗ '}{sc.label}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recommendations */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(59,130,246,0.06))',
                border: '1px solid rgba(124,58,237,0.2)',
                borderRadius: 14, padding: 24,
              }}>
                <h3 style={{ color: '#fff', margin: '0 0 14px', fontSize: 15, fontWeight: 700 }}>
                  💡 GEO Improvement Recommendations
                </h3>
                {result.geoScore < 50 ? (
                  <ul style={{ color: '#94a3b8', fontSize: 13, lineHeight: 2, paddingLeft: 20, margin: 0 }}>
                    <li>Publish authoritative content that AI models can cite (statistics, guides, case studies)</li>
                    <li>Build entity clarity — make sure your brand name + service + category is clear on your homepage</li>
                    <li>Get mentioned on high-authority sites (AI models trust Wikipedia, Forbes, Techcrunch citations)</li>
                    <li>Add structured data (JSON-LD) with your brand's name, description, and sameAs links</li>
                    <li>Create a Wikipedia page or Wikidata entity for your brand</li>
                    <li>Publish press releases and get coverage on news outlets AI models reference</li>
                  </ul>
                ) : result.geoScore < 75 ? (
                  <ul style={{ color: '#94a3b8', fontSize: 13, lineHeight: 2, paddingLeft: 20, margin: 0 }}>
                    <li>You have moderate visibility — focus on the platforms that are NOT mentioning you</li>
                    <li>Increase mention frequency by publishing content that directly answers common queries</li>
                    <li>Improve sentiment by highlighting differentiators and positive reviews in your content</li>
                    <li>Build more third-party mentions through PR campaigns and influencer partnerships</li>
                  </ul>
                ) : (
                  <ul style={{ color: '#94a3b8', fontSize: 13, lineHeight: 2, paddingLeft: 20, margin: 0 }}>
                    <li>🎉 Excellent AI visibility! Focus on maintaining quality and consistency</li>
                    <li>Monitor competitor mentions to stay ahead of rising challengers</li>
                    <li>Expand to new AI platforms that may emerge in your niche</li>
                    <li>Convert this visibility into trackable traffic with AI attribution UTM links</li>
                  </ul>
                )}
              </div>

            </div>
          )}
        </>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div>
          {history.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: 60,
              background: 'rgba(255,255,255,0.03)', borderRadius: 14,
              border: '1px solid rgba(255,255,255,0.06)',
            }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
              <p style={{ color: '#64748b' }}>No scan history yet. Run your first brand scan!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {history.map((h) => (
                <div key={h._id} style={{
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 12, padding: '16px 20px',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <div>
                    <div style={{ color: '#e2e8f0', fontWeight: 700, fontSize: 15 }}>{h.brandName}</div>
                    <div style={{ color: '#64748b', fontSize: 12, marginTop: 2 }}>
                      {h.domain && `${h.domain} · `}
                      Checked {new Date(h.lastChecked).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      fontSize: 22, fontWeight: 800,
                      color: h.geoScore >= 70 ? '#22c55e' : h.geoScore >= 40 ? '#f59e0b' : '#ef4444',
                    }}>
                      {h.geoScore}/100
                    </div>
                    <div style={{ color: '#475569', fontSize: 12 }}>
                      {h.mentions?.filter(m => m.mentioned).length || 0}/{h.mentions?.length || 5} platforms
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
      `}</style>
    </div>
  );
}
