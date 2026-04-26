import React, { useState } from 'react';
import { AlertTriangle, AlertCircle, CheckCircle2, Search } from 'lucide-react';

const ISSUES = [
  { severity: 'critical', title: 'Missing meta descriptions', count: 5, description: '5 pages have no meta description tag.' },
  { severity: 'critical', title: 'Broken internal links', count: 3, description: '3 internal links return 404 errors.' },
  { severity: 'warning', title: 'Images missing alt text', count: 12, description: '12 images lack descriptive alt attributes.' },
  { severity: 'warning', title: 'Slow page speed', count: 4, description: '4 pages score below 70 on PageSpeed.' },
  { severity: 'warning', title: 'Duplicate title tags', count: 2, description: '2 pages share identical title tags.' },
  { severity: 'info', title: 'No canonical tags', count: 7, description: '7 pages are missing canonical URL tags.' },
  { severity: 'passed', title: 'XML Sitemap present', count: 0, description: 'Your sitemap.xml is valid and accessible.' },
  { severity: 'passed', title: 'HTTPS enabled', count: 0, description: 'SSL certificate is valid and active.' },
  { severity: 'passed', title: 'robots.txt configured', count: 0, description: 'robots.txt file found and properly configured.' },
];

const SEV = {
  critical: { icon: <AlertCircle size={16} color="#dc2626"/>, bg: '#fee2e2', color: '#dc2626', label: 'Critical' },
  warning: { icon: <AlertTriangle size={16} color="#f59e0b"/>, bg: '#ffedd5', color: '#ea580c', label: 'Warning' },
  info: { icon: <AlertCircle size={16} color="#2563eb"/>, bg: '#dbeafe', color: '#2563eb', label: 'Notice' },
  passed: { icon: <CheckCircle2 size={16} color="#16a34a"/>, bg: '#dcfce7', color: '#16a34a', label: 'Passed' },
};

export default function TechnicalIssues() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanned, setScanned] = useState(true);

  const critical = ISSUES.filter(i => i.severity === 'critical').length;
  const warnings = ISSUES.filter(i => i.severity === 'warning').length;
  const passed = ISSUES.filter(i => i.severity === 'passed').length;

  const handleScan = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setScanned(true); }, 1400);
  };

  return (
    <div className="page-content">
      {/* Scanner input */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-title">Technical SEO Audit</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <input className="big-input" placeholder="https://yourwebsite.com" value={url} onChange={e => setUrl(e.target.value)} />
          <button className="primary-btn" onClick={handleScan} disabled={loading}>
            {loading ? <><span className="spinner"></span> Scanning…</> : <><Search size={15} /> Scan Site</>}
          </button>
        </div>
      </div>

      {scanned && (
        <>
          {/* Summary cards */}
          <div className="issues-grid">
            {[
              { label: 'Critical Issues', value: critical, color: '#dc2626', bg: '#fee2e2' },
              { label: 'Warnings', value: warnings, color: '#ea580c', bg: '#ffedd5' },
              { label: 'Passed', value: passed, color: '#16a34a', bg: '#dcfce7' },
            ].map(s => (
              <div key={s.label} className="issue-stat-card" style={{ borderTop: `3px solid ${s.color}` }}>
                <div className="issue-stat-num" style={{ color: s.color }}>{s.value}</div>
                <div className="issue-stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Issues list */}
          <div className="table-card">
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #f0f0f5' }}>
              <div className="card-title" style={{ marginBottom: 0 }}>All Issues</div>
            </div>
            {ISSUES.map((issue, i) => {
              const s = SEV[issue.severity];
              return (
                <div key={i} className="audit-issue-item" style={{ padding: '12px 20px' }}>
                  <div style={{ marginRight: 4 }}>{s.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e' }}>{issue.title}</div>
                    <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{issue.description}</div>
                  </div>
                  {issue.count > 0 && (
                    <span className="keyword-badge" style={{ background: s.bg, color: s.color }}>{issue.count} pages</span>
                  )}
                  <span className="keyword-badge" style={{ background: s.bg, color: s.color, marginLeft: 6 }}>{s.label}</span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
