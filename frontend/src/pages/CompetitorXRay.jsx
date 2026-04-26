import React, { useState } from 'react';
import { Target, Search, Loader, ShieldAlert, BarChart3, List, BookOpen, ChevronRight } from 'lucide-react';
import { seoApi } from '../utils/seoApi';

export default function CompetitorXRay() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!url.trim()) {
      setError('Please enter a competitor URL.');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await seoApi('competitor', { url });
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content">
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Target size={18} style={{ color: '#10b981' }} /> Competitor X-Ray
        </div>
        <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 16 }}>
          Reverse-engineer your competitor's SEO strategy. Discover their top keywords, content gaps, and the exact steps needed to outrank them.
        </p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <input 
            className="big-input" 
            placeholder="Competitor URL (e.g. https://competitor.com)" 
            value={url} 
            onChange={e => setUrl(e.target.value)} 
            style={{ flex: 1 }} 
            onKeyDown={e => e.key === 'Enter' && handleAnalyze()}
          />
          <button className="primary-btn" onClick={handleAnalyze} disabled={loading || !url} style={{ background: '#10b981', border: 'none' }}>
            {loading ? <><Loader size={15} className="spinner-icon" /> Analyzing…</> : <><Search size={15} /> X-Ray Scan</>}
          </button>
        </div>
        {error && <div className="acc-msg error" style={{ marginTop: 12, marginBottom: 0 }}>{error}</div>}
      </div>

      {loading && (
        <div className="card" style={{ textAlign: 'center', padding: '50px 20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, color: '#10b981', fontWeight: 600 }}>
            <span className="spinner" style={{ borderColor: 'rgba(16,185,129,0.3)', borderTopColor: '#10b981', width: 40, height: 40, borderWidth: 3 }} />
            <div>Running Competitor X-Ray...</div>
            <div style={{ fontSize: 13, color: '#6b7280', fontWeight: 400 }}>Extracting keywords and content gaps</div>
          </div>
        </div>
      )}

      {result && !loading && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20, alignItems: 'start' }}>
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            
            {/* Top Keywords */}
            <div className="table-card">
               <div style={{ padding: '14px 20px', borderBottom: '1px solid #f0f0f5', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: '#1a1a2e' }}>
                 <BarChart3 size={16} color="#10b981" /> Top Ranking Keywords
               </div>
               <div className="table-header" style={{ gridTemplateColumns: '2fr 1fr 1fr' }}>
                 <span>Keyword</span><span>Est. Volume</span><span>Difficulty</span>
               </div>
               {result.topKeywords?.map((kw, i) => (
                 <div key={i} className="table-row" style={{ gridTemplateColumns: '2fr 1fr 1fr', padding: '12px 20px' }}>
                   <span style={{ fontWeight: 600, color: '#374151', fontSize: 13 }}>{kw.keyword}</span>
                   <span style={{ color: '#6b7280', fontSize: 13 }}>{kw.volume}</span>
                   <span style={{ 
                     fontSize: 12, fontWeight: 600, 
                     color: kw.difficulty === 'Easy' ? '#10b981' : kw.difficulty === 'Medium' ? '#f59e0b' : '#ef4444' 
                   }}>{kw.difficulty}</span>
                 </div>
               ))}
            </div>

            {/* Content Gaps */}
            <div className="card">
               <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: '#1a1a2e', marginBottom: 16 }}>
                 <ShieldAlert size={16} color="#f59e0b" /> Exploit Content Gaps
               </div>
               <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 12 }}>
                 Topics this competitor is missing or covering poorly. Write articles about these to steal their traffic.
               </p>
               <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, color: '#374151' }}>
                 {result.contentGaps?.map((gap, i) => (
                   <li key={i}>{gap}</li>
                 ))}
               </ul>
            </div>

          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            
            {/* Domain Overview */}
            <div className="card" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 12 }}>Domain Authority</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#1e293b', marginBottom: 16 }}>{result.domainAuthority}</div>
              
              <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 4 }}>Est. Traffic</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#10b981' }}>{result.estimatedTraffic}</div>
            </div>

            {/* Strategy to Beat Them */}
            <div className="card" style={{ borderLeft: '4px solid #10b981' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: '#1a1a2e', marginBottom: 12 }}>
                 <Target size={16} color="#10b981" /> Strategy to Outrank
               </div>
               <div style={{ fontSize: 13, lineHeight: 1.6, color: '#475569' }}>
                 {result.strategyToBeatThem}
               </div>
            </div>

            {/* Heading Structure */}
            <div className="card">
               <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: '#1a1a2e', marginBottom: 12 }}>
                 <List size={16} color="#8b5cf6" /> Heading Structure
               </div>
               <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                 {result.headingStructure?.map((heading, i) => (
                   <div key={i} style={{ fontSize: 12, color: '#475569', display: 'flex', alignItems: 'center', gap: 6 }}>
                     <ChevronRight size={12} color="#cbd5e1" /> {heading}
                   </div>
                 ))}
               </div>
            </div>

          </div>
        </div>
      )}

      {!loading && !result && !error && (
        <div className="card" style={{ textAlign: 'center', padding: '50px 20px' }}>
          <Target size={40} style={{ color: '#d1d5db', marginBottom: 12 }} />
          <div style={{ color: '#9ca3af', fontSize: 14 }}>Enter a competitor's URL to reveal their SEO playbook</div>
        </div>
      )}
    </div>
  );
}
