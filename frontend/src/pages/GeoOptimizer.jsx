import React, { useState } from 'react';
import { MapPin, Sparkles, Loader, Download, Copy, Check } from 'lucide-react';
import { seoApi } from '../utils/seoApi';

export default function GeoOptimizer() {
  const [service, setService] = useState('');
  const [cities, setCities] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [copiedSchema, setCopiedSchema] = useState(null);

  const handleGenerate = async () => {
    if (!service.trim() || !cities.trim()) {
      setError('Please enter both service and target cities.');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await seoApi('geo', { service, cities });
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const copyCode = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedSchema(id);
    setTimeout(() => setCopiedSchema(null), 2000);
  };

  return (
    <div className="page-content">
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <MapPin size={18} style={{ color: '#ef4444' }} /> Geo-Intelligence & Local SEO Dominator
        </div>
        <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 16 }}>
          Mass-generate hyper-local, optimized landing page strategies and schema markup for multiple cities instantly.
        </p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <input 
            className="big-input" 
            placeholder="Core Service (e.g. Attestation Services)" 
            value={service} 
            onChange={e => setService(e.target.value)} 
            style={{ flex: 1, minWidth: 200 }} 
          />
          <input 
            className="big-input" 
            placeholder="Target Cities (comma separated, e.g. Delhi, Noida, Gurgaon)" 
            value={cities} 
            onChange={e => setCities(e.target.value)} 
            style={{ flex: 2, minWidth: 300 }} 
            onKeyDown={e => e.key === 'Enter' && handleGenerate()}
          />
          <button className="primary-btn" onClick={handleGenerate} disabled={loading || !service || !cities} style={{ background: '#ef4444', border: 'none' }}>
            {loading ? <><Loader size={15} className="spinner-icon" /> Generating…</> : <><Sparkles size={15} /> Dominator Mode</>}
          </button>
        </div>
        {error && <div className="acc-msg error" style={{ marginTop: 12, marginBottom: 0 }}>{error}</div>}
      </div>

      {loading && (
        <div className="card" style={{ textAlign: 'center', padding: '50px 20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, color: '#ef4444', fontWeight: 600 }}>
            <span className="spinner" style={{ borderColor: 'rgba(239,68,68,0.3)', borderTopColor: '#ef4444', width: 40, height: 40, borderWidth: 3 }} />
            <div>Generating Local SEO Matrix...</div>
            <div style={{ fontSize: 13, color: '#6b7280', fontWeight: 400 }}>Creating unique strategies for {cities.split(',').length} locations</div>
          </div>
        </div>
      )}

      {result && !loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {(result.pages || []).map((page, i) => (
            <div key={i} className="card" style={{ padding: 24, borderLeft: '4px solid #ef4444' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, borderBottom: '1px solid #f0f0f5', paddingBottom: 16 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 18, fontWeight: 700, color: '#1a1a2e' }}>
                    <MapPin size={20} color="#ef4444" /> {page.city}
                  </div>
                  <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>
                    Keyword: <span style={{ fontWeight: 600, color: '#ef4444' }}>{page.keyword}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
                {/* Meta Data */}
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: 8 }}>Meta Data & Structure</div>
                  <div style={{ background: '#f8f8fc', padding: 12, borderRadius: 8, fontSize: 13, marginBottom: 10 }}>
                    <div style={{ fontWeight: 600, color: '#4b5563', marginBottom: 4 }}>Meta Title:</div>
                    <div style={{ color: '#1a1a2e' }}>{page.metaTitle}</div>
                  </div>
                  <div style={{ background: '#f8f8fc', padding: 12, borderRadius: 8, fontSize: 13, marginBottom: 10 }}>
                    <div style={{ fontWeight: 600, color: '#4b5563', marginBottom: 4 }}>Meta Description:</div>
                    <div style={{ color: '#1a1a2e' }}>{page.metaDescription}</div>
                  </div>
                  <div style={{ background: '#f8f8fc', padding: 12, borderRadius: 8, fontSize: 13 }}>
                    <div style={{ fontWeight: 600, color: '#4b5563', marginBottom: 4 }}>H1 Tag:</div>
                    <div style={{ color: '#1a1a2e', fontWeight: 600 }}>{page.h1}</div>
                  </div>
                </div>

                {/* Content & Schema */}
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: 8 }}>Content Outline</div>
                  <ul style={{ background: '#f8f8fc', padding: '12px 12px 12px 28px', borderRadius: 8, fontSize: 13, color: '#1a1a2e', margin: 0, marginBottom: 16 }}>
                    {page.contentOutline?.map((item, idx) => (
                      <li key={idx} style={{ marginBottom: 4 }}>{item}</li>
                    ))}
                  </ul>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase' }}>Local Schema</div>
                    <button className="action-btn" onClick={() => copyCode(page.schemaSnippet, i)} style={{ padding: '4px 8px', fontSize: 11 }}>
                      {copiedSchema === i ? <><Check size={12}/> Copied</> : <><Copy size={12}/> Copy Code</>}
                    </button>
                  </div>
                  <pre style={{ background: '#1a1a2e', color: '#a5b4fc', padding: 12, borderRadius: 8, fontSize: 11, overflowX: 'auto', fontFamily: 'monospace', lineHeight: 1.5, margin: 0 }}>
                    {page.schemaSnippet}
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !result && !error && (
        <div className="card" style={{ textAlign: 'center', padding: '50px 20px' }}>
          <MapPin size={40} style={{ color: '#d1d5db', marginBottom: 12 }} />
          <div style={{ color: '#9ca3af', fontSize: 14 }}>Enter your service and target cities to generate a local SEO matrix</div>
        </div>
      )}
    </div>
  );
}
