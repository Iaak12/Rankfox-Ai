import React, { useState } from 'react';
import { FileSearch, CheckCircle2, AlertCircle, AlertTriangle } from 'lucide-react';

const AUDIT_ITEMS = [
  { label: 'Page Title', status: 'pass', detail: 'Title is 58 chars — within optimal range' },
  { label: 'Meta Description', status: 'pass', detail: 'Description is 148 chars — good' },
  { label: 'H1 Tag', status: 'pass', detail: 'Single H1 found' },
  { label: 'H2 Structure', status: 'warn', detail: 'No H2 tags found — add subheadings' },
  { label: 'Internal Links', status: 'pass', detail: '4 internal links found' },
  { label: 'External Links', status: 'pass', detail: '2 external links with rel="noopener"' },
  { label: 'Image Alt Text', status: 'fail', detail: '3 images missing alt attributes' },
  { label: 'Schema Markup', status: 'warn', detail: 'No structured data detected' },
  { label: 'Page Speed', status: 'pass', detail: 'Score 88/100 on mobile' },
  { label: 'Mobile Friendly', status: 'pass', detail: 'Fully responsive layout detected' },
  { label: 'Canonical Tag', status: 'fail', detail: 'No canonical URL defined' },
  { label: 'Open Graph Tags', status: 'pass', detail: 'og:title, og:description, og:image present' },
];

const STATUS_ICON = {
  pass: <CheckCircle2 size={16} color="#16a34a" />,
  warn: <AlertTriangle size={16} color="#f59e0b" />,
  fail: <AlertCircle size={16} color="#dc2626" />,
};

export default function SiteAudit() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(true);

  const score = Math.round((AUDIT_ITEMS.filter(i => i.status === 'pass').length / AUDIT_ITEMS.length) * 100);

  const handleAudit = () => {
    setLoading(true);
    setDone(false);
    setTimeout(() => { setLoading(false); setDone(true); }, 1500);
  };

  return (
    <div className="page-content">
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-title">Site Audit</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <input className="big-input" placeholder="https://yourwebsite.com/page" value={url} onChange={e => setUrl(e.target.value)} />
          <button className="primary-btn" onClick={handleAudit} disabled={loading}>
            {loading ? <><span className="spinner"></span> Auditing…</> : <><FileSearch size={15} /> Run Audit</>}
          </button>
        </div>
      </div>

      {done && (
        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 18 }}>
          {/* Score */}
          <div className="card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <div className="audit-score-ring" style={{ borderColor: score >= 80 ? '#16a34a' : score >= 60 ? '#f59e0b' : '#dc2626', color: score >= 80 ? '#16a34a' : score >= 60 ? '#f59e0b' : '#dc2626' }}>
              {score}
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e' }}>SEO Score</div>
            <div className="text-muted">out of 100</div>
          </div>

          {/* Checklist */}
          <div className="table-card">
            {AUDIT_ITEMS.map((item, i) => (
              <div key={i} className="audit-issue-item" style={{ padding: '10px 20px' }}>
                {STATUS_ICON[item.status]}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{item.label}</div>
                  <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 1 }}>{item.detail}</div>
                </div>
                <span className="keyword-badge" style={{
                  background: item.status === 'pass' ? '#dcfce7' : item.status === 'warn' ? '#ffedd5' : '#fee2e2',
                  color: item.status === 'pass' ? '#16a34a' : item.status === 'warn' ? '#ea580c' : '#dc2626'
                }}>
                  {item.status === 'pass' ? 'Pass' : item.status === 'warn' ? 'Warning' : 'Fail'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
