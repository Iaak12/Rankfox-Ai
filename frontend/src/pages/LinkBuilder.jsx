import React, { useState } from 'react';
import { Link2, ExternalLink, Copy, Check, Sparkles, ArrowRight } from 'lucide-react';
import { seoApi } from '../utils/seoApi';

const DIFF_COLOR = { Easy: '#16a34a', Medium: '#f59e0b', Hard: '#dc2626' };
const TYPE_COLOR = {
  'Guest Post':    { bg: '#ede9fe', color: '#7c3aed' },
  'Resource Page': { bg: '#dbeafe', color: '#2563eb' },
  'Broken Link':   { bg: '#dcfce7', color: '#16a34a' },
  'HARO':          { bg: '#ffedd5', color: '#ea580c' },
  'Directory':     { bg: '#fef9c3', color: '#b45309' },
  'Forum':         { bg: '#f3f4f6', color: '#6b7280' },
  'Podcast':       { bg: '#fce7f3', color: '#be185d' },
};

export default function LinkBuilder() {
  const [url, setUrl] = useState('');
  const [niche, setNiche] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!niche.trim()) { setError('Please enter your niche'); return; }
    setLoading(true); setError(''); setResult(null);
    try {
      const data = await seoApi('links', { url, niche });
      setResult(data);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="page-content">
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Sparkles size={16} style={{ color: '#7c3aed' }} /> AI Link Building Opportunities
        </div>
        <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 12 }}>
          Enter your website and niche — AI will identify the best link building opportunities and outreach strategies.
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <input className="big-input" placeholder="Your website URL (optional)" value={url} onChange={e => setUrl(e.target.value)} style={{ flex: 1, minWidth: 200 }} />
          <input className="big-input" placeholder="Your niche (e.g. digital marketing, fitness, SaaS) *" value={niche} onChange={e => setNiche(e.target.value)} style={{ flex: 2, minWidth: 260 }}
            onKeyDown={e => e.key === 'Enter' && handleSearch()} />
          <button className="primary-btn" onClick={handleSearch} disabled={loading || !niche}>
            {loading ? <><span className="spinner" /> Finding…</> : <><Link2 size={15} /> Find Opportunities</>}
          </button>
        </div>
        {error && <div className="acc-msg error" style={{ marginTop: 12, marginBottom: 0 }}>{error}</div>}
      </div>

      {loading && (
        <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, color: '#7c3aed', fontWeight: 600, fontSize: 15 }}>
            <span className="spinner" style={{ borderColor: 'rgba(124,58,237,0.3)', borderTopColor: '#7c3aed' }} />
            AI is finding link opportunities for "{niche}"…
          </div>
        </div>
      )}

      {result && !loading && (
        <>
          {result.strategy && (
            <div className="card" style={{ marginBottom: 18, background: 'linear-gradient(135deg, #ede9fe, #f5f3ff)', border: '1px solid #ddd6fe' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', marginBottom: 6 }}>AI Strategy</div>
              <p style={{ fontSize: 13, color: '#4c1d95', lineHeight: 1.6 }}>{result.strategy}</p>
            </div>
          )}

          <div className="table-card">
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #f0f0f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div className="card-title" style={{ marginBottom: 2 }}>{result.opportunities?.length || 0} Link Opportunities</div>
                <div style={{ fontSize: 12, color: '#9ca3af' }}>for "{niche}" — powered by Groq AI</div>
              </div>
            </div>
            <div className="table-header" style={{ gridTemplateColumns: '120px 2fr 60px 90px 1fr' }}>
              <span>Type</span><span>Site / Source</span><span>DA</span><span>Difficulty</span><span>Approach</span>
            </div>
            {(result.opportunities || []).map((o, i) => {
              const tc = TYPE_COLOR[o.type] || { bg: '#f3f4f6', color: '#6b7280' };
              return (
                <div key={i} className="table-row" style={{ gridTemplateColumns: '120px 2fr 60px 90px 1fr', alignItems: 'flex-start', paddingTop: 14, paddingBottom: 14 }}>
                  <span><span className="keyword-badge" style={{ background: tc.bg, color: tc.color }}>{o.type}</span></span>
                  <span style={{ fontWeight: 600, fontSize: 13, color: '#1a1a2e' }}>{o.site}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#7c3aed' }}>{o.da}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: DIFF_COLOR[o.difficulty] || '#6b7280' }}>{o.difficulty}</span>
                  <span style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.5 }}>{o.approach}</span>
                </div>
              );
            })}
          </div>
        </>
      )}

      {!loading && !result && !error && (
        <div className="card" style={{ textAlign: 'center', padding: '50px 20px' }}>
          <Link2 size={40} style={{ color: '#d1d5db', marginBottom: 12 }} />
          <div style={{ color: '#9ca3af', fontSize: 14 }}>Enter your niche above to discover AI-powered link building opportunities</div>
        </div>
      )}
    </div>
  );
}
