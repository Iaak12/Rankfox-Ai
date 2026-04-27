import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const SOURCE_CONFIG = {
  chatgpt: { label: 'ChatGPT', icon: '🤖', color: '#10a37f' },
  gemini: { label: 'Gemini', icon: '✨', color: '#4285f4' },
  perplexity: { label: 'Perplexity', icon: '🔭', color: '#7c3aed' },
  claude: { label: 'Claude', icon: '🧠', color: '#d97706' },
  grok: { label: 'Grok', icon: '⚡', color: '#1da1f2' },
  copilot: { label: 'Copilot', icon: '🪟', color: '#00a4ef' },
  other_ai: { label: 'Other AI', icon: '🔮', color: '#8b5cf6' },
  google: { label: 'Google', icon: '🔍', color: '#ea4335' },
  direct: { label: 'Direct', icon: '🔗', color: '#64748b' },
  other: { label: 'Other', icon: '📌', color: '#475569' },
};

function StatCard({ icon, label, value, sub, color = '#7c3aed' }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 14, padding: '20px 22px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 9, display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: 17, background: `${color}18`,
        }}>{icon}</div>
        <span style={{ color: '#64748b', fontSize: 12, fontWeight: 600 }}>{label}</span>
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color: '#fff' }}>{value}</div>
      {sub && <div style={{ color: '#475569', fontSize: 12, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function MiniBar({ value, max, color }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
      <div style={{
        width: `${pct}%`, height: '100%', background: color, borderRadius: 3,
        transition: 'width 0.8s ease',
      }} />
    </div>
  );
}

// Inline bar chart for daily trend
function TrendChart({ data }) {
  if (!data || data.length === 0) return null;
  const maxTotal = Math.max(...data.map(d => d.total), 1);

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 100 }}>
      {data.map((d) => (
        <div key={d.date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', height: 80, justifyContent: 'flex-end' }}>
            <div style={{
              width: '70%', background: '#7c3aed40', borderRadius: '4px 4px 0 0',
              height: `${(d.google / maxTotal) * 80}px`,
            }} />
            <div style={{
              width: '70%', background: '#7c3aed',
              height: `${(d.ai / maxTotal) * 80}px`,
            }} />
          </div>
          <span style={{ color: '#475569', fontSize: 9 }}>{d.date.split(' ')[1]}</span>
        </div>
      ))}
    </div>
  );
}

// Auto-tracking snippet shown to users
function TrackingSnippet() {
  const [copied, setCopied] = useState(false);
  const backendUrl = API;

  const snippet = `<!-- RankFox AI Traffic Tracker -->
<script>
(function() {
  var s = sessionStorage.getItem('rf_sid');
  if (!s) { s = Date.now().toString(36) + Math.random().toString(36).substr(2); sessionStorage.setItem('rf_sid', s); }
  var payload = { referrer: document.referrer, landingPage: location.pathname, sessionId: s,
    device: /Mobi/.test(navigator.userAgent) ? 'mobile' : 'desktop' };
  fetch('${backendUrl}/api/attribution/track', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
})();
</script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 14, padding: 24,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div>
          <h3 style={{ color: '#fff', margin: 0, fontSize: 15, fontWeight: 700 }}>📦 Your Tracking Script</h3>
          <p style={{ color: '#64748b', fontSize: 12, margin: '4px 0 0' }}>
            Add this to your website's &lt;head&gt; to track AI traffic automatically
          </p>
        </div>
        <button
          onClick={handleCopy}
          style={{
            padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
            background: copied ? '#22c55e' : '#7c3aed', color: '#fff', fontWeight: 600, fontSize: 12,
          }}
        >
          {copied ? '✓ Copied!' : 'Copy Script'}
        </button>
      </div>
      <pre style={{
        background: 'rgba(0,0,0,0.3)', borderRadius: 8, padding: 16, margin: 0,
        color: '#94a3b8', fontSize: 11, overflowX: 'auto', whiteSpace: 'pre-wrap', lineHeight: 1.7,
      }}>
        {snippet}
      </pre>
    </div>
  );
}

export default function AIAttribution() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/attribution/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data);
    } catch {
      // Show empty state
      setData({
        summary: { totalVisits: 0, aiVisits: 0, googleVisits: 0, directVisits: 0, totalConversions: 0, totalRevenue: 0, aiConversionRate: '0.0' },
        bySource: [],
        dailyTrend: [],
        topAiSources: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const maxVisits = data ? Math.max(...(data.bySource || []).map(s => s.visits), 1) : 1;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 0 40px' }}>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
        {['dashboard', 'setup'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 20px', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontWeight: 600, fontSize: 13,
              background: activeTab === tab ? '#7c3aed' : 'rgba(255,255,255,0.06)',
              color: activeTab === tab ? '#fff' : '#94a3b8',
              transition: 'all 0.2s',
            }}
          >
            {tab === 'dashboard' ? '📊 Attribution Dashboard' : '⚙️ Setup Tracking'}
          </button>
        ))}
      </div>

      {activeTab === 'dashboard' && (
        <>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 60 }}>
              <div style={{ fontSize: 36 }}>📡</div>
              <p style={{ color: '#64748b', marginTop: 12 }}>Loading attribution data...</p>
            </div>
          ) : (
            <>
              {/* Summary Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
                <StatCard icon="👥" label="Total Visits" value={data.summary.totalVisits.toLocaleString()} sub="Last 30 days" color="#7c3aed" />
                <StatCard icon="🤖" label="AI Referrals" value={data.summary.aiVisits.toLocaleString()} sub={`${data.summary.aiConversionRate}% conversion rate`} color="#10a37f" />
                <StatCard icon="✅" label="Conversions" value={data.summary.totalConversions} sub="From all AI sources" color="#22c55e" />
                <StatCard icon="💰" label="AI Revenue" value={`$${data.summary.totalRevenue.toLocaleString()}`} sub="Attributed to AI traffic" color="#f59e0b" />
              </div>

              {/* Traffic by Source */}
              <div style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 14, padding: 24, marginBottom: 18,
              }}>
                <h3 style={{ color: '#fff', margin: '0 0 18px', fontSize: 15, fontWeight: 700 }}>
                  🌐 Traffic by AI Source (Last 30 Days)
                </h3>

                {data.bySource.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '30px 0', color: '#475569', fontSize: 13 }}>
                    No traffic recorded yet. Add the tracking script to your website first.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {data.bySource
                      .sort((a, b) => b.visits - a.visits)
                      .map((src) => {
                        const config = SOURCE_CONFIG[src.source] || SOURCE_CONFIG.other;
                        return (
                          <div key={src.source}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontSize: 16 }}>{config.icon}</span>
                                <span style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 600 }}>{config.label}</span>
                              </div>
                              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                                <span style={{ color: '#94a3b8', fontSize: 12 }}>{src.visits} visits</span>
                                <span style={{ color: '#22c55e', fontSize: 12 }}>{src.conversions} conv.</span>
                                <span style={{ color: '#f59e0b', fontSize: 12 }}>${src.revenue}</span>
                              </div>
                            </div>
                            <MiniBar value={src.visits} max={maxVisits} color={config.color} />
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>

              {/* Daily Trend Chart */}
              <div style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 14, padding: 24, marginBottom: 18,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h3 style={{ color: '#fff', margin: 0, fontSize: 15, fontWeight: 700 }}>📈 Daily Traffic Trend</h3>
                  <div style={{ display: 'flex', gap: 12, fontSize: 11 }}>
                    <span style={{ color: '#7c3aed' }}>■ AI Traffic</span>
                    <span style={{ color: '#7c3aed50' }}>■ Google</span>
                  </div>
                </div>
                <TrendChart data={data.dailyTrend} />
              </div>

              {/* Empty state call-to-action */}
              {data.summary.totalVisits === 0 && (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(59,130,246,0.08))',
                  border: '1px solid rgba(124,58,237,0.3)',
                  borderRadius: 14, padding: 28, textAlign: 'center',
                }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>🚀</div>
                  <h3 style={{ color: '#fff', margin: '0 0 8px' }}>Start Tracking AI Traffic</h3>
                  <p style={{ color: '#94a3b8', fontSize: 13, margin: '0 0 18px' }}>
                    Add our 5-line tracking script to your website to see which AI platforms are sending you visitors.
                  </p>
                  <button
                    onClick={() => setActiveTab('setup')}
                    style={{
                      padding: '10px 24px', borderRadius: 8, border: 'none',
                      background: '#7c3aed', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer',
                    }}
                  >
                    Get Tracking Script →
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}

      {activeTab === 'setup' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* How it works */}
          <div style={{
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 14, padding: 24,
          }}>
            <h3 style={{ color: '#fff', margin: '0 0 18px', fontSize: 15, fontWeight: 700 }}>
              ⚡ How AI Attribution Works
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
              {[
                { step: '1', title: 'User Clicks a Link', desc: 'Someone on ChatGPT or Gemini clicks a link to your site' },
                { step: '2', title: 'Referrer Detected', desc: 'Our script reads the HTTP referrer and identifies the AI platform' },
                { step: '3', title: 'Attribution Stored', desc: 'The visit is logged to your dashboard with source, page, and device' },
              ].map(item => (
                <div key={item.step} style={{
                  padding: 18, background: 'rgba(124,58,237,0.08)', borderRadius: 10,
                  border: '1px solid rgba(124,58,237,0.15)',
                }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13, marginBottom: 10 }}>
                    {item.step}
                  </div>
                  <div style={{ color: '#e2e8f0', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>{item.title}</div>
                  <div style={{ color: '#64748b', fontSize: 12, lineHeight: 1.5 }}>{item.desc}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(34,197,94,0.06)', borderRadius: 8, border: '1px solid rgba(34,197,94,0.15)' }}>
              <div style={{ color: '#22c55e', fontWeight: 600, fontSize: 13, marginBottom: 4 }}>✅ AI Platforms Tracked Automatically:</div>
              <div style={{ color: '#94a3b8', fontSize: 12 }}>
                ChatGPT (chat.openai.com, chatgpt.com) · Gemini (gemini.google.com) · Perplexity (perplexity.ai) · Claude (claude.ai) · Grok (grok.x.ai) · Microsoft Copilot (copilot.microsoft.com)
              </div>
            </div>
          </div>

          <TrackingSnippet />
        </div>
      )}
    </div>
  );
}
