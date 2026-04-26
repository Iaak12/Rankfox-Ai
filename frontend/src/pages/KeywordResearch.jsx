import React, { useState } from 'react';
import { Search, TrendingUp, TrendingDown, Minus, Download, Sparkles } from 'lucide-react';
import { seoApi } from '../utils/seoApi';

function diffColor(d) {
  if (d <= 10) return { bg: '#dcfce7', color: '#16a34a' };
  if (d <= 25) return { bg: '#dbeafe', color: '#2563eb' };
  if (d <= 50) return { bg: '#ffedd5', color: '#ea580c' };
  return { bg: '#fee2e2', color: '#dc2626' };
}
function intentColor(i) {
  return i === 'Informational' ? { bg: '#ede9fe', color: '#7c3aed' }
    : i === 'Transactional' ? { bg: '#dcfce7', color: '#16a34a' }
    : i === 'Commercial' ? { bg: '#fef9c3', color: '#b45309' }
    : { bg: '#dbeafe', color: '#2563eb' };
}
function compColor(c) {
  return c === 'Low' ? '#16a34a' : c === 'Medium' ? '#f59e0b' : '#dc2626';
}

export default function KeywordResearch() {
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!keyword.trim()) return;
    setLoading(true);
    setError('');
    setResults([]);
    try {
      const data = await seoApi('keywords', { keyword });
      setResults(data.keywords || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    if (!results.length) return;
    const header = 'Keyword,Volume,Difficulty,Intent,CPC,Trend,Competition\n';
    const rows = results.map(r =>
      `"${r.keyword}",${r.volume},${r.difficulty},${r.intent},${r.cpc},${r.trend},${r.competition}`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = `keywords-${keyword}.csv`; a.click();
  };

  return (
    <div className="page-content">
      {/* Search bar */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Sparkles size={16} style={{ color: '#7c3aed' }} /> AI Keyword Research
        </div>
        <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 12 }}>
          Enter any topic or seed keyword — our AI will generate real keyword opportunities with volume, difficulty, and search intent.
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <input
            className="big-input"
            placeholder="Enter seed keyword (e.g. digital marketing, TCS NQT, Python tutorials)"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
          />
          <button className="primary-btn" onClick={handleSearch} disabled={loading}>
            {loading ? <><span className="spinner" /> Researching…</> : <><Search size={15} /> Find Keywords</>}
          </button>
        </div>
        {error && <div className="acc-msg error" style={{ marginTop: 12, marginBottom: 0 }}>{error}</div>}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, color: '#7c3aed', fontWeight: 600, fontSize: 15 }}>
            <span className="spinner" style={{ borderColor: 'rgba(124,58,237,0.3)', borderTopColor: '#7c3aed' }} />
            AI is researching keywords for "{keyword}"…
          </div>
          <p style={{ color: '#9ca3af', fontSize: 13, marginTop: 8 }}>This takes 5-10 seconds</p>
        </div>
      )}

      {/* Results table */}
      {!loading && results.length > 0 && (
        <div className="table-card">
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #f0f0f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div className="card-title" style={{ marginBottom: 2 }}>{results.length} Keywords Found</div>
              <div style={{ fontSize: 12, color: '#9ca3af' }}>for "{keyword}" — powered by Groq AI</div>
            </div>
            <button className="action-btn" onClick={exportCSV}><Download size={13} /> Export CSV</button>
          </div>
          <div className="table-header" style={{ gridTemplateColumns: '2fr 90px 90px 130px 70px 60px 90px' }}>
            <span>Keyword</span>
            <span>Volume</span>
            <span>Difficulty</span>
            <span>Intent</span>
            <span>CPC</span>
            <span>Trend</span>
            <span>Competition</span>
          </div>
          {results.map((r, i) => {
            const dc = diffColor(r.difficulty);
            const ic = intentColor(r.intent);
            return (
              <div key={i} className="table-row" style={{ gridTemplateColumns: '2fr 90px 90px 130px 70px 60px 90px' }}>
                <span style={{ fontWeight: 600, fontSize: 13, color: '#1a1a2e' }}>{r.keyword}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e' }}>{Number(r.volume).toLocaleString()}</span>
                <span>
                  <span className="diff-badge" style={{ background: dc.bg, color: dc.color, width: 'auto', padding: '2px 10px', borderRadius: 6 }}>
                    {r.difficulty}
                  </span>
                </span>
                <span>
                  <span className="keyword-badge" style={{ background: ic.bg, color: ic.color }}>{r.intent}</span>
                </span>
                <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 600 }}>{r.cpc}</span>
                <span style={{ color: r.trend === 'up' ? '#16a34a' : r.trend === 'down' ? '#dc2626' : '#9ca3af' }}>
                  {r.trend === 'up' ? <TrendingUp size={16}/> : r.trend === 'down' ? <TrendingDown size={16}/> : <Minus size={16}/>}
                </span>
                <span style={{ fontSize: 12, fontWeight: 600, color: compColor(r.competition) }}>{r.competition}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {!loading && results.length === 0 && !error && (
        <div className="card" style={{ textAlign: 'center', padding: '50px 20px' }}>
          <Search size={40} style={{ color: '#d1d5db', marginBottom: 12 }} />
          <div style={{ color: '#9ca3af', fontSize: 14 }}>Enter a keyword above to get AI-powered keyword suggestions</div>
        </div>
      )}
    </div>
  );
}
