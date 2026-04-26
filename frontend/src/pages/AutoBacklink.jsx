import React, { useState, useEffect } from 'react';
import { Link2, Bot, Loader, ExternalLink, Zap, CheckCircle2, ShieldAlert } from 'lucide-react';
import { seoApi } from '../utils/seoApi';

export default function AutoBacklink() {
  const [url, setUrl] = useState('');
  const [keyword, setKeyword] = useState('');
  const [type, setType] = useState('Web 2.0 Auto-Publisher');
  const [amount, setAmount] = useState(5);
  
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [consoleLog, setConsoleLog] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const types = ['Web 2.0 Auto-Publisher', 'Directory Submissions', 'Profile Backlinks'];

  const addLog = (msg) => {
    setConsoleLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const startAutomation = async () => {
    if (!url || !keyword) {
      setError('Please enter both target URL and Keyword.');
      return;
    }
    
    setLoading(true);
    setError('');
    setResult(null);
    setConsoleLog([]);
    setProgress(0);

    // Fake progress simulation
    addLog('Initializing RankFox Auto-Publisher AI Engine...');
    setTimeout(() => addLog(`Target confirmed: ${url}`), 800);
    setTimeout(() => addLog(`Keyword loaded: ${keyword}`), 1500);
    setTimeout(() => addLog(`Preparing ${amount} ${type} campaigns...`), 2200);
    
    let simProgress = 0;
    const progressInterval = setInterval(() => {
      simProgress += Math.floor(Math.random() * 15) + 5;
      if (simProgress > 90) simProgress = 90;
      setProgress(simProgress);
      if (simProgress === 45) addLog('Bypassing captchas & registering accounts...');
      if (simProgress === 75) addLog('Writing teaser content & inserting backlinks...');
    }, 1000);

    try {
      const data = await seoApi('autobacklink', { url, keyword, type, amount });
      
      clearInterval(progressInterval);
      setProgress(100);
      addLog('Automation complete! Links successfully published.');
      setResult(data);
    } catch (e) {
      clearInterval(progressInterval);
      setError(e.message);
      addLog(`ERROR: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content">
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Bot size={18} style={{ color: '#ec4899' }} /> AI Auto-Backlink Engine
        </div>
        <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 16 }}>
          Automatically generate content, register accounts, and publish backlinks across high-DA platforms with zero manual effort.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#4b5563', marginBottom: 6 }}>Target URL</label>
            <input className="big-input" placeholder="https://yourwebsite.com/post" value={url} onChange={e => setUrl(e.target.value)} style={{ width: '100%' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#4b5563', marginBottom: 6 }}>Anchor Keyword</label>
            <input className="big-input" placeholder="e.g. Best SEO Tool" value={keyword} onChange={e => setKeyword(e.target.value)} style={{ width: '100%' }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          <div>
             <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#4b5563', marginBottom: 6 }}>Campaign Type</label>
             <div style={{ display: 'flex', gap: 8 }}>
               {types.map(t => (
                 <button 
                   key={t} 
                   onClick={() => setType(t)}
                   style={{ 
                     flex: 1, padding: '10px 0', fontSize: 12, fontWeight: 600, borderRadius: 8, cursor: 'pointer',
                     border: type === t ? '1.5px solid #ec4899' : '1.5px solid #e5e7eb',
                     background: type === t ? '#fdf2f8' : '#fff',
                     color: type === t ? '#be185d' : '#6b7280',
                     transition: 'all 0.2s'
                   }}
                 >
                   {t}
                 </button>
               ))}
             </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#4b5563', marginBottom: 6 }}>Volume: {amount} Links</label>
            <input 
              type="range" 
              min="1" max="20" 
              value={amount} 
              onChange={e => setAmount(Number(e.target.value))} 
              style={{ width: '100%', accentColor: '#ec4899', marginTop: 10 }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9ca3af', marginTop: 4 }}>
              <span>1</span><span>Safe limit: 20/day</span>
            </div>
          </div>
        </div>

        <button className="primary-btn" onClick={startAutomation} disabled={loading || !url || !keyword} style={{ width: '100%', padding: '14px 0', fontSize: 14, background: 'linear-gradient(135deg, #ec4899, #be185d)', border: 'none' }}>
          {loading ? <><span className="spinner" /> Automation Running...</> : <><Zap size={16} /> Start Full Automation</>}
        </button>
        {error && <div className="acc-msg error" style={{ marginTop: 12, marginBottom: 0 }}>{error}</div>}
      </div>

      {/* Console & Results */}
      {(loading || result) && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20 }}>
          
          {/* Console Output */}
          <div className="card" style={{ background: '#0f172a', border: '1px solid #1e293b' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', marginBottom: 16 }}>
              <Bot size={14} /> AI Terminal Console
            </div>
            
            <div style={{ background: '#1e293b', height: 6, borderRadius: 4, marginBottom: 16, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: \`\${progress}%\`, background: '#ec4899', transition: 'width 0.5s ease' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, height: 240, overflowY: 'auto', fontFamily: 'monospace', fontSize: 11, color: '#34d399' }}>
              {consoleLog.map((log, i) => (
                <div key={i}>{log}</div>
              ))}
              {loading && <div style={{ color: '#94a3b8' }}>_</div>}
            </div>
          </div>

          {/* Results Table */}
          <div className="card">
             <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#1a1a2e', fontSize: 14, fontWeight: 700, marginBottom: 16 }}>
               {result ? <><CheckCircle2 size={16} color="#10b981" /> Published Links ({result.totalCreated})</> : <><Loader size={16} className="spinner-icon" color="#ec4899" /> Publishing in progress...</>}
             </div>

             {result && (
               <div className="table-card" style={{ border: 'none', padding: 0 }}>
                 <div className="table-header" style={{ gridTemplateColumns: '1fr 2fr 60px 80px', padding: '10px 14px' }}>
                   <span>Platform</span><span>Published URL</span><span>DA</span><span>Status</span>
                 </div>
                 <div style={{ maxHeight: 240, overflowY: 'auto' }}>
                   {result.backlinks?.map((bl, i) => (
                     <div key={i} className="table-row" style={{ gridTemplateColumns: '1fr 2fr 60px 80px', padding: '12px 14px', borderBottom: '1px solid #f0f0f5' }}>
                       <span style={{ fontWeight: 600, color: '#374151', fontSize: 13 }}>{bl.platform}</span>
                       <a href={bl.publishedUrl} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: '#3b82f6', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                         {bl.publishedUrl} <ExternalLink size={10} />
                       </a>
                       <span style={{ fontSize: 13, fontWeight: 700, color: '#7c3aed' }}>{bl.domainAuthority}</span>
                       <span style={{ fontSize: 11, fontWeight: 700, color: '#10b981', background: '#dcfce7', padding: '2px 6px', borderRadius: 4, display: 'inline-block', textAlign: 'center' }}>
                         {bl.status}
                       </span>
                     </div>
                   ))}
                 </div>
               </div>
             )}

             {!result && (
               <div style={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: '#9ca3af', gap: 12 }}>
                 <ShieldAlert size={32} style={{ color: '#e5e7eb' }} />
                 <div style={{ fontSize: 13 }}>Links will appear here once successfully verified and indexed.</div>
               </div>
             )}
          </div>

        </div>
      )}

    </div>
  );
}
