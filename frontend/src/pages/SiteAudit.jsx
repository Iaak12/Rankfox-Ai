import React, { useState } from 'react';
import { FileSearch, CheckCircle2, AlertCircle, AlertTriangle, Sparkles, AlertOctagon } from 'lucide-react';
import { seoApi } from '../utils/seoApi';

const STATUS_ICON = {
  pass: <CheckCircle2 size={16} color="#16a34a" />,
  warn: <AlertTriangle size={16} color="#f59e0b" />,
  fail: <AlertCircle size={16} color="#dc2626" />,
};

export default function SiteAudit() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleAudit = async () => {
    const trimmed = url.trim();
    if (!trimmed) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await seoApi('audit', { url: trimmed });
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (s) => s >= 80 ? '#16a34a' : s >= 60 ? '#f59e0b' : '#dc2626';

  return (
    <div className="page-content">
      {/* URL Input */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Sparkles size={16} style={{ color: '#7c3aed' }} /> AI Site Audit
        </div>
        <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 12 }}>
          Enter any website URL to get a comprehensive technical SEO audit with actionable recommendations.
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <input
            className="big-input"
            placeholder="https://yourwebsite.com"
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAudit()}
          />
          <button className="primary-btn" onClick={handleAudit} disabled={loading || !url.trim()}>
            {loading ? <><span className="spinner" /> Auditing…</> : <><FileSearch size={15} /> Run Audit</>}
          </button>
        </div>
        {error && <div className="acc-msg error" style={{ marginTop: 12, marginBottom: 0 }}>{error}</div>}
      </div>

      {/* Loading */}
      {loading && (
        <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, color: '#7c3aed', fontWeight: 600, fontSize: 15 }}>
            <span className="spinner" style={{ borderColor: 'rgba(124,58,237,0.3)', borderTopColor: '#7c3aed' }} />
            AI is auditing {url}…
          </div>
          <p style={{ color: '#9ca3af', fontSize: 13, marginTop: 8 }}>Checking 15+ technical SEO factors</p>
        </div>
      )}

      {result && !loading && (
        <>
          {/* Stats Row */}
          <div className="issues-grid" style={{ marginBottom: 18 }}>
            {[
              { label: 'SEO Score', value: result.score, color: scoreColor(result.score), suffix: '/100' },
              { label: 'Critical Issues', value: result.criticalIssues, color: '#dc2626' },
              { label: 'Warnings', value: result.warnings, color: '#f59e0b' },
              { label: 'Passed', value: result.passed, color: '#16a34a' },
            ].map(({ label, value, color, suffix }) => (
              <div key={label} className="issue-stat-card">
                <div className="issue-stat-num" style={{ color }}>{value}{suffix}</div>
                <div className="issue-stat-label">{label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 18 }}>
            {/* Audit checklist */}
            <div className="table-card">
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #f0f0f5', fontWeight: 700, fontSize: 14 }}>
                Audit Results — {result.domain}
              </div>
              {(result.checks || []).map((item, i) => (
                <div key={i} className="audit-issue-item" style={{ padding: '12px 20px' }}>
                  {STATUS_ICON[item.status] || STATUS_ICON.warn}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e' }}>{item.label}</div>
                    <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{item.detail}</div>
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

            {/* Priority fixes + score ring */}
            <div>
              <div className="card" style={{ textAlign: 'center', marginBottom: 14 }}>
                <div className="audit-score-ring" style={{ borderColor: scoreColor(result.score), color: scoreColor(result.score) }}>
                  {result.score}
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', marginTop: 6 }}>SEO Score</div>
                <div className="text-muted">out of 100</div>
              </div>

              {result.priorityFixes?.length > 0 && (
                <div className="card">
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: 12 }}>
                    <AlertOctagon size={12} style={{ display: 'inline', marginRight: 4 }} />Priority Fixes
                  </div>
                  {result.priorityFixes.map((fix, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 10, fontSize: 12, color: '#374151', alignItems: 'flex-start' }}>
                      <span style={{ background: '#dc2626', color: '#fff', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
                      {fix}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {!loading && !result && !error && (
        <div className="card" style={{ textAlign: 'center', padding: '50px 20px' }}>
          <FileSearch size={40} style={{ color: '#d1d5db', marginBottom: 12 }} />
          <div style={{ color: '#9ca3af', fontSize: 14 }}>Enter a website URL above to run a full AI SEO audit</div>
        </div>
      )}
    </div>
  );
}
