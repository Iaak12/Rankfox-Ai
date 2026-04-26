import React, { useState } from 'react';
import { Globe, Plus, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';

const PAGES = [
  { url: '/mastering-tcs-nqt', status: 'Indexed', lastCrawl: '2 hours ago' },
  { url: '/flipkart-grid-strategies', status: 'Not Indexed', lastCrawl: '5 days ago' },
  { url: '/aptitude-guide', status: 'Indexed', lastCrawl: '1 day ago' },
  { url: '/cloud-certification-roadmap', status: 'Pending', lastCrawl: 'Never' },
  { url: '/python-data-science', status: 'Indexed', lastCrawl: '3 hours ago' },
];

export default function Indexing() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!url) return;
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  const indexed = PAGES.filter(p => p.status === 'Indexed').length;

  return (
    <div className="page-content">
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 20 }}>
        {[
          { label: 'Total Indexed', value: indexed, icon: '✅', color: '#16a34a' },
          { label: 'Not Indexed', value: PAGES.length - indexed - 1, icon: '❌', color: '#dc2626' },
          { label: 'Pending', value: 1, icon: '⏳', color: '#f59e0b' },
        ].map(s => (
          <div key={s.label} className="card" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 28 }}>{s.icon}</span>
            <div>
              <div style={{ fontSize: 30, fontWeight: 800, fontFamily: 'Outfit', color: s.color }}>{s.value}</div>
              <div className="text-muted">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Submit for indexing */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-title">Request Indexing</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <input
            className="big-input"
            placeholder="https://yoursite.com/page-url"
            value={url}
            onChange={e => setUrl(e.target.value)}
          />
          <button className="primary-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? <><span className="spinner"></span> Submitting…</> : <><Globe size={15} /> Submit to Google</>}
          </button>
        </div>
      </div>

      {/* Pages table */}
      <div className="table-card">
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #f0f0f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="card-title" style={{ marginBottom: 0 }}>Page Index Status</div>
          <button className="action-btn"><RefreshCw size={12} /> Refresh</button>
        </div>
        <div className="table-header" style={{ gridTemplateColumns: '2fr 1fr 1fr 100px' }}>
          <span>URL</span><span>Status</span><span>Last Crawl</span><span>Action</span>
        </div>
        {PAGES.map((p, i) => (
          <div key={i} className="table-row" style={{ gridTemplateColumns: '2fr 1fr 1fr 100px' }}>
            <span style={{ fontSize: 13, color: '#6c47ff' }}>{p.url}</span>
            <span>
              <span className="keyword-badge" style={{
                background: p.status === 'Indexed' ? '#dcfce7' : p.status === 'Not Indexed' ? '#fee2e2' : '#ffedd5',
                color: p.status === 'Indexed' ? '#16a34a' : p.status === 'Not Indexed' ? '#dc2626' : '#f59e0b'
              }}>{p.status}</span>
            </span>
            <span className="text-muted" style={{ fontSize: 12 }}>{p.lastCrawl}</span>
            <button className="action-btn" style={{ fontSize: 11 }}><RefreshCw size={11} /> Re-index</button>
          </div>
        ))}
      </div>
    </div>
  );
}
