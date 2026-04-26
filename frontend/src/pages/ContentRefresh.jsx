import React, { useState } from 'react';
import { RefreshCw, Search, Loader, ShieldAlert, CheckCircle2, ChevronRight, Copy } from 'lucide-react';
import { seoApi } from '../utils/seoApi';

export default function ContentRefresh() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleAnalyze = async () => {
    if (!url.trim()) {
      setError('Please enter the URL of the outdated blog post.');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await seoApi('refresh', { url });
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(result?.refreshedContent || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="page-content">
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <RefreshCw size={18} style={{ color: '#0ea5e9' }} /> Automated AI Content Refresh
        </div>
        <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 16 }}>
          Google penalizes outdated content. Paste an old blog post URL here, and the AI will automatically identify outdated statistics, inject missing keywords, and rewrite the content to be longer and fully optimized for 2026.
        </p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <input 
            className="big-input" 
            placeholder="Old Blog Post URL (e.g. https://yoursite.com/old-post-2022)" 
            value={url} 
            onChange={e => setUrl(e.target.value)} 
            style={{ flex: 1 }} 
            onKeyDown={e => e.key === 'Enter' && handleAnalyze()}
          />
          <button className="primary-btn" onClick={handleAnalyze} disabled={loading || !url} style={{ background: '#0ea5e9', border: 'none' }}>
            {loading ? <><Loader size={15} className="spinner-icon" /> Analyzing…</> : <><RefreshCw size={15} /> Refresh Content</>}
          </button>
        </div>
        {error && <div className="acc-msg error" style={{ marginTop: 12, marginBottom: 0 }}>{error}</div>}
      </div>

      {loading && (
        <div className="card" style={{ textAlign: 'center', padding: '50px 20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, color: '#0ea5e9', fontWeight: 600 }}>
            <span className="spinner" style={{ borderColor: 'rgba(14,165,233,0.3)', borderTopColor: '#0ea5e9', width: 40, height: 40, borderWidth: 3 }} />
            <div>Reading and Rewriting Legacy Content...</div>
            <div style={{ fontSize: 13, color: '#6b7280', fontWeight: 400 }}>Identifying missing keywords & outdated stats</div>
          </div>
        </div>
      )}

      {result && !loading && (
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20, alignItems: 'start' }}>
          
          {/* Left Column: Stats & Changes */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="card" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 4 }}>Original Words</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#ef4444' }}>{result.originalWordCount}</div>
                </div>
                <ChevronRight size={24} color="#cbd5e1" />
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 4 }}>New Words</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#10b981' }}>{result.newWordCount}</div>
                </div>
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#0ea5e9', textAlign: 'center', padding: '8px 0', background: '#e0f2fe', borderRadius: 6 }}>
                +{result.newWordCount - result.originalWordCount} Words Added
              </div>
            </div>

            <div className="card">
               <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: '#1a1a2e', marginBottom: 12 }}>
                 <ShieldAlert size={16} color="#ef4444" /> Outdated Elements Fixed
               </div>
               <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, color: '#475569' }}>
                 {result.outdatedElementsFound?.map((gap, i) => (
                   <li key={i}>{gap}</li>
                 ))}
               </ul>
            </div>

            <div className="card">
               <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: '#1a1a2e', marginBottom: 12 }}>
                 <CheckCircle2 size={16} color="#10b981" /> New Keywords Injected
               </div>
               <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                 {result.newKeywordsAdded?.map((kw, i) => (
                   <span key={i} className="keyword-badge badge-green" style={{ fontSize: 11 }}>{kw}</span>
                 ))}
               </div>
            </div>
          </div>

          {/* Right Column: Refreshed Content */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 600 }}>
             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: '#1a1a2e' }}>
                 <RefreshCw size={16} color="#0ea5e9" /> Refreshed 2026-Ready Content
               </div>
               <button className="primary-btn" onClick={copyCode} style={{ padding: '6px 12px', fontSize: 12, background: '#1e293b' }}>
                 {copied ? <><CheckCircle2 size={12}/> Copied!</> : <><Copy size={12}/> Copy Content</>}
               </button>
             </div>
             
             <div style={{ flex: 1, padding: 20, background: '#f8f8fc', borderRadius: 8, overflowY: 'auto' }}>
               <pre style={{ margin: 0, fontFamily: 'Inter', fontSize: 14, lineHeight: 1.8, color: '#374151', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                 {result.refreshedContent}
               </pre>
             </div>
          </div>

        </div>
      )}

      {!loading && !result && !error && (
        <div className="card" style={{ textAlign: 'center', padding: '50px 20px' }}>
          <RefreshCw size={40} style={{ color: '#d1d5db', marginBottom: 12 }} />
          <div style={{ color: '#9ca3af', fontSize: 14 }}>Enter an old blog post URL to instantly upgrade it for 2026 rankings</div>
        </div>
      )}
    </div>
  );
}
