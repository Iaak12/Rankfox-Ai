import React, { useState } from 'react';
import { Zap, CheckCircle2, AlertCircle, Loader, Copy, Check } from 'lucide-react';
import { seoApi } from '../utils/seoApi';

export default function InstantBoost() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleBoost = async () => {
    if (!url.trim()) {
      setError('Please enter a URL to boost.');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await seoApi('boost', { url });
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const copySchema = () => {
    if (result?.generatedSchema) {
      navigator.clipboard.writeText(result.generatedSchema);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="page-content">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 18, alignItems: 'start' }}>
        
        {/* Left Column - Input Panel */}
        <div>
          <div className="card" style={{ marginBottom: 14 }}>
            <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Zap size={18} style={{ color: '#f59e0b', fill: '#f59e0b' }} /> AI Instant Boost
            </div>
            <div className="text-muted" style={{ marginBottom: 20 }}>
              Instantly ping search engines, prime CDN caches, and generate missing schema markup to accelerate your page's indexing and visibility.
            </div>

            <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
              <input 
                className="big-input" 
                placeholder="https://example.com/your-page" 
                value={url}
                onChange={e => setUrl(e.target.value)} 
                style={{ flex: 1 }} 
                onKeyDown={e => e.key === 'Enter' && handleBoost()}
              />
              <button className="primary-btn" onClick={handleBoost} disabled={loading || !url.trim()} style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', border: 'none' }}>
                {loading ? <><Loader size={15} className="spinner-icon" /> Boosting...</> : <><Zap size={15} /> Boost Now</>}
              </button>
            </div>
            {error && <div className="acc-msg error" style={{ marginBottom: 10 }}><AlertCircle size={14} /> {error}</div>}
          </div>

          {/* Results Area */}
          {loading && (
            <div className="card" style={{ textAlign: 'center', padding: 40 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                <div style={{ position: 'relative', width: 60, height: 60 }}>
                  <div className="spinner" style={{ width: 60, height: 60, borderWidth: 3, borderColor: 'rgba(245,158,11,0.2)', borderTopColor: '#f59e0b' }} />
                  <Zap size={24} style={{ color: '#f59e0b', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: '#1a1a2e' }}>Executing Multi-Point Boost...</div>
                  <div style={{ color: '#6b7280', fontSize: 13, marginTop: 4 }}>Pinging Google & Bing indexing APIs</div>
                </div>
              </div>
            </div>
          )}

          {result && !loading && (
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                <CheckCircle2 size={20} color="#16a34a" />
                <div style={{ fontSize: 16, fontWeight: 600, color: '#1a1a2e' }}>Boost Operation Successful</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {result.actions?.map((action, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 16px', background: '#f8f8fc', borderRadius: 8 }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Check size={14} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13, color: '#1a1a2e' }}>{action.task}</div>
                      <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{action.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Status & Schema */}
        <div>
          {result && !loading ? (
            <>
              <div className="card" style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: 10 }}>Expected Impact</div>
                <div style={{ padding: '12px 16px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, color: '#92400e', fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Zap size={16} /> {result.estimatedImpact}
                </div>
              </div>

              {result.generatedSchema && (
                <div className="card">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase' }}>Missing Schema Generated</div>
                    <button className="action-btn" onClick={copySchema} style={{ padding: '4px 8px', fontSize: 11 }}>
                      {copied ? <><Check size={12}/> Copied</> : <><Copy size={12}/> Copy Code</>}
                    </button>
                  </div>
                  <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 12 }}>
                    We noticed your page was missing optimal JSON-LD structured data. Paste this in your <code>&lt;head&gt;</code>:
                  </div>
                  <pre style={{ background: '#1a1a2e', color: '#a5b4fc', padding: 16, borderRadius: 8, fontSize: 11, overflowX: 'auto', fontFamily: 'monospace', lineHeight: 1.5 }}>
                    {result.generatedSchema}
                  </pre>
                </div>
              )}
            </>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: 40 }}>
              <Zap size={40} style={{ color: '#e5e7eb', marginBottom: 12 }} />
              <div style={{ color: '#9ca3af', fontSize: 13 }}>Enter a URL to instantly push<br/>updates to search engines</div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
