import React, { useState } from 'react';
import { Settings2, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';

const CHECKS = [
  { label: 'Target Keyword in Title', status: 'pass' },
  { label: 'Target Keyword in First Paragraph', status: 'pass' },
  { label: 'Keyword Density (1–3%)', status: 'warn' },
  { label: 'Content Length > 1000 words', status: 'pass' },
  { label: 'Outbound Links Present', status: 'fail' },
  { label: 'Internal Links ≥ 2', status: 'pass' },
  { label: 'Images with Alt Text', status: 'warn' },
  { label: 'Headings Structure (H1 → H2 → H3)', status: 'pass' },
  { label: 'Readability Score ≥ 60 (Flesch)', status: 'pass' },
  { label: 'Meta Description Present', status: 'pass' },
];

const STATUS_ICON = {
  pass: <CheckCircle2 size={16} color="#16a34a" />,
  warn: <AlertTriangle size={16} color="#f59e0b" />,
  fail: <AlertCircle size={16} color="#dc2626" />,
};

export default function PageOptimizer() {
  const [content, setContent] = useState('');
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  const score = Math.round((CHECKS.filter(c => c.status === 'pass').length / CHECKS.length) * 100);

  const handleAnalyze = () => {
    if (!content.trim()) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setAnalyzed(true); }, 1200);
  };

  return (
    <div className="page-content">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 18 }}>
        {/* Editor */}
        <div>
          <div className="card" style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
              <input className="big-input" placeholder="Target keyword" value={keyword} onChange={e => setKeyword(e.target.value)} style={{ maxWidth: 220 }} />
              <button className="primary-btn" onClick={handleAnalyze} disabled={loading}>
                {loading ? <><span className="spinner"></span> Analyzing…</> : <><Settings2 size={15} /> Analyze</>}
              </button>
            </div>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Paste your article content here to analyze and optimize…"
              style={{
                width: '100%', minHeight: 400, padding: '14px', border: '1.5px solid #e0e0ea',
                borderRadius: 10, fontSize: 13, fontFamily: 'Inter', resize: 'vertical',
                outline: 'none', lineHeight: 1.7, color: '#1a1a2e'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              <span className="text-muted">{content.split(/\s+/).filter(Boolean).length} words</span>
              <span className="text-muted">{content.length} characters</span>
            </div>
          </div>
        </div>

        {/* Score panel */}
        <div>
          {analyzed ? (
            <>
              <div className="card" style={{ textAlign: 'center', marginBottom: 14 }}>
                <div className="optimizer-score">{score}</div>
                <div style={{ fontSize: 13, color: '#6b7280', marginTop: 6 }}>Optimization Score</div>
                <div style={{ height: 6, background: '#f0f0f5', borderRadius: 99, marginTop: 10, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${score}%`, background: 'linear-gradient(90deg,#6c47ff,#a78bfa)', borderRadius: 99 }} />
                </div>
              </div>
              <div className="table-card">
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f5', fontWeight: 700, fontSize: 14, color: '#1a1a2e' }}>Checklist</div>
                {CHECKS.map((c, i) => (
                  <div key={i} className="optimizer-item" style={{ padding: '10px 16px' }}>
                    {STATUS_ICON[c.status]}
                    <span style={{ fontSize: 12, color: '#374151' }}>{c.label}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: 40 }}>
              <Settings2 size={40} style={{ color: '#d1d5db', marginBottom: 12 }} />
              <div style={{ color: '#9ca3af', fontSize: 14 }}>Paste content & click Analyze to see your optimization score</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
