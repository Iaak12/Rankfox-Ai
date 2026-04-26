import React, { useState } from 'react';
import { Search, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const MOCK_RESULTS = [
  { keyword: 'TCS NQT preparation', volume: 8100, difficulty: 12, intent: 'Informational', trend: 'up', cpc: '$0.45' },
  { keyword: 'TCS NQT questions', volume: 6600, difficulty: 18, intent: 'Informational', trend: 'up', cpc: '$0.32' },
  { keyword: 'TCS NQT syllabus 2024', volume: 5400, difficulty: 8, intent: 'Informational', trend: 'up', cpc: '$0.28' },
  { keyword: 'how to crack TCS NQT', volume: 4400, difficulty: 22, intent: 'Navigational', trend: 'flat', cpc: '$0.61' },
  { keyword: 'TCS NQT mock test', volume: 3600, difficulty: 15, intent: 'Transactional', trend: 'up', cpc: '$0.89' },
  { keyword: 'TCS NQT cut off marks', volume: 2900, difficulty: 6, intent: 'Informational', trend: 'down', cpc: '$0.22' },
  { keyword: 'TCS NQT registration', volume: 2400, difficulty: 9, intent: 'Transactional', trend: 'up', cpc: '$1.10' },
];

function diffColor(d) {
  if (d <= 10) return { bg: '#dcfce7', color: '#16a34a' };
  if (d <= 20) return { bg: '#dbeafe', color: '#2563eb' };
  if (d <= 30) return { bg: '#ffedd5', color: '#ea580c' };
  return { bg: '#fee2e2', color: '#dc2626' };
}

function intentColor(i) {
  return i === 'Informational' ? { bg: '#ede9fe', color: '#6c47ff' }
    : i === 'Transactional' ? { bg: '#dcfce7', color: '#16a34a' }
    : { bg: '#dbeafe', color: '#2563eb' };
}

export default function KeywordResearch() {
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(MOCK_RESULTS);
  const [searched, setSearched] = useState(true);

  const handleSearch = () => {
    if (!keyword.trim()) return;
    setLoading(true);
    setSearched(false);
    setTimeout(() => { setResults(MOCK_RESULTS); setLoading(false); setSearched(true); }, 1200);
  };

  return (
    <div className="page-content">
      {/* Search bar */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-title">Keyword Research</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <input
            className="big-input"
            placeholder="Enter seed keyword (e.g. TCS NQT)"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
          />
          <button className="primary-btn" onClick={handleSearch} disabled={loading}>
            {loading ? <><span className="spinner"></span> Searching…</> : <><Search size={15} /> Find Keywords</>}
          </button>
        </div>
      </div>

      {/* Results table */}
      {searched && (
        <div className="table-card">
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #f0f0f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="card-title" style={{ marginBottom: 0 }}>{results.length} Keywords Found</div>
            <button className="action-btn">⬇ Export CSV</button>
          </div>
          <div className="table-header" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 80px 80px' }}>
            <span>Keyword</span><span>Volume</span><span>Difficulty</span><span>Intent</span><span>CPC</span><span>Trend</span>
          </div>
          {results.map((r, i) => {
            const dc = diffColor(r.difficulty);
            const ic = intentColor(r.intent);
            return (
              <div key={i} className="table-row" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 80px 80px' }}>
                <span style={{ fontWeight: 500, fontSize: 13 }}>{r.keyword}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e' }}>{r.volume.toLocaleString()}</span>
                <span><span className="diff-badge" style={{ background: dc.bg, color: dc.color, width: 'auto', padding: '2px 8px', borderRadius: 5 }}>{r.difficulty}</span></span>
                <span><span className="keyword-badge" style={{ background: ic.bg, color: ic.color }}>{r.intent}</span></span>
                <span style={{ fontSize: 13, color: '#6b7280' }}>{r.cpc}</span>
                <span style={{ color: r.trend === 'up' ? '#16a34a' : r.trend === 'down' ? '#dc2626' : '#9ca3af' }}>
                  {r.trend === 'up' ? <TrendingUp size={16}/> : r.trend === 'down' ? <TrendingDown size={16}/> : <Minus size={16}/>}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
