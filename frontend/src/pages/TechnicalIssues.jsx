import React, { useState } from 'react';
import { AlertTriangle, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { seoApi } from '../utils/seoApi';

const SEV_COLOR = {
  Critical: { bg: '#fee2e2', color: '#dc2626', dot: '#dc2626' },
  Warning:  { bg: '#ffedd5', color: '#ea580c', dot: '#f59e0b' },
  Notice:   { bg: '#dbeafe', color: '#2563eb', dot: '#3b82f6' },
};
const CAT_EMOJI = {
  Crawling: '🕷️', Indexing: '📑', Performance: '⚡', Security: '🔒',
  Mobile: '📱', 'Structured Data': '🏷️', Links: '🔗',
};

export default function TechnicalIssues() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState({});

  const handleScan = async () => {
    if (!url.trim()) return;
    setLoading(true); setError(''); setResult(null); setExpanded({});
    try {
      const data = await seoApi('technical', { url });
      setResult(data);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const toggle = (i) => setExpanded(e => ({ ...e, [i]: !e[i] }));

  return (
    <div className="page-content">
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Sparkles size={16} style={{ color: '#7c3aed' }} /> AI Technical SEO Scanner
        </div>
        <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 12 }}>
          Enter your website URL to get a deep technical SEO analysis with categorized issues and fix instructions.
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <input className="big-input" placeholder="https://yourwebsite.com" value={url}
            onChange={e => setUrl(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleScan()} />
          <button className="primary-btn" onClick={handleScan} disabled={loading || !url.trim()}>
            {loading ? <><span className="spinner" /> Scanning…</> : <><AlertTriangle size={15} /> Scan Issues</>}
          </button>
        </div>
        {error && <div className="acc-msg error" style={{ marginTop: 12, marginBottom: 0 }}>{error}</div>}
      </div>

      {loading && (
        <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, color: '#7c3aed', fontWeight: 600, fontSize: 15 }}>
            <span className="spinner" style={{ borderColor: 'rgba(124,58,237,0.3)', borderTopColor: '#7c3aed' }} />
            Scanning technical SEO for {url}…
          </div>
          <p style={{ color: '#9ca3af', fontSize: 13, marginTop: 8 }}>Checking crawling, indexing, performance, security & more</p>
        </div>
      )}

      {result && !loading && (
        <>
          {/* Summary stats */}
          <div className="issues-grid" style={{ marginBottom: 18 }}>
            {[
              { label: 'Health Score', value: result.summary?.healthScore, suffix: '/100', color: result.summary?.healthScore >= 80 ? '#16a34a' : result.summary?.healthScore >= 60 ? '#f59e0b' : '#dc2626' },
              { label: 'Critical Issues', value: result.summary?.critical, color: '#dc2626' },
              { label: 'Warnings', value: result.summary?.warnings, color: '#f59e0b' },
              { label: 'Notices', value: result.summary?.notices, color: '#3b82f6' },
            ].map(({ label, value, color, suffix = '' }) => (
              <div key={label} className="issue-stat-card">
                <div className="issue-stat-num" style={{ color }}>{value}{suffix}</div>
                <div className="issue-stat-label">{label}</div>
              </div>
            ))}
          </div>

          {/* Issues list */}
          <div className="table-card">
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #f0f0f5', fontWeight: 700, fontSize: 14 }}>
              Technical Issues — {url}
            </div>
            {(result.issues || []).map((issue, i) => {
              const sc = SEV_COLOR[issue.severity] || SEV_COLOR.Notice;
              return (
                <div key={i} style={{ borderBottom: '1px solid #f0f0f5' }}>
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', cursor: 'pointer', transition: 'background 0.1s' }}
                    onClick={() => toggle(i)}
                    onMouseEnter={e => e.currentTarget.style.background = '#fafafd'}
                    onMouseLeave={e => e.currentTarget.style.background = ''}
                  >
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: sc.dot, flexShrink: 0 }} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af' }}>{CAT_EMOJI[issue.category] || '🔧'} {issue.category}</span>
                    <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: '#1a1a2e' }}>{issue.issue}</span>
                    <span className="keyword-badge" style={{ background: sc.bg, color: sc.color }}>{issue.severity}</span>
                    {issue.affectedUrls > 0 && <span style={{ fontSize: 11, color: '#9ca3af' }}>{issue.affectedUrls} URLs</span>}
                    {expanded[i] ? <ChevronUp size={14} style={{ color: '#9ca3af' }} /> : <ChevronDown size={14} style={{ color: '#9ca3af' }} />}
                  </div>

                  {expanded[i] && (
                    <div style={{ padding: '0 20px 16px 42px', background: '#fafafd', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', marginBottom: 5 }}>DESCRIPTION</div>
                        <p style={{ fontSize: 12, color: '#374151', lineHeight: 1.6 }}>{issue.description}</p>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#7c3aed', marginBottom: 5 }}>HOW TO FIX</div>
                        <p style={{ fontSize: 12, color: '#374151', lineHeight: 1.6 }}>{issue.howToFix}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {!loading && !result && !error && (
        <div className="card" style={{ textAlign: 'center', padding: '50px 20px' }}>
          <AlertTriangle size={40} style={{ color: '#d1d5db', marginBottom: 12 }} />
          <div style={{ color: '#9ca3af', fontSize: 14 }}>Enter a website URL above to scan for technical SEO issues</div>
        </div>
      )}
    </div>
  );
}
