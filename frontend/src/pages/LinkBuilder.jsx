import React, { useState } from 'react';
import { Link2, Plus, ExternalLink, CheckCircle2, XCircle } from 'lucide-react';

const OPPORTUNITIES = [
  { domain: 'geeksforgeeks.org', da: 82, type: 'Guest Post', status: 'Available', niche: 'Tech' },
  { domain: 'medium.com', da: 95, type: 'Resource Link', status: 'Available', niche: 'General' },
  { domain: 'dev.to', da: 78, type: 'Profile Link', status: 'Acquired', niche: 'Dev' },
  { domain: 'hashnode.com', da: 72, type: 'Guest Post', status: 'Available', niche: 'Dev' },
  { domain: 'hackernoon.com', da: 76, type: 'Sponsored', status: 'Pending', niche: 'Tech' },
  { domain: 'towardsdatascience.com', da: 89, type: 'Guest Post', status: 'Available', niche: 'Data Science' },
];

export default function LinkBuilder() {
  const [domain, setDomain] = useState('');

  return (
    <div className="page-content">
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 20 }}>
        {[
          { label: 'Total Backlinks', value: '1,248', color: '#6c47ff' },
          { label: 'Referring Domains', value: '342', color: '#0ea5e9' },
          { label: 'Domain Authority', value: '47', color: '#16a34a' },
          { label: 'New This Month', value: '28', color: '#f59e0b' },
        ].map(s => (
          <div key={s.label} className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'Outfit', color: s.color }}>{s.value}</div>
            <div className="text-muted" style={{ marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Domain input */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-title">Find Link Opportunities</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <input className="big-input" placeholder="yourwebsite.com" value={domain} onChange={e => setDomain(e.target.value)} />
          <button className="primary-btn"><Link2 size={15} /> Analyze</button>
        </div>
      </div>

      {/* Opportunities table */}
      <div className="table-card">
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #f0f0f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="card-title" style={{ marginBottom: 0 }}>Link Opportunities</div>
          <button className="primary-btn" style={{ fontSize: 12, padding: '7px 12px' }}><Plus size={13} /> Add Custom</button>
        </div>
        <div className="table-header" style={{ gridTemplateColumns: '2fr 80px 1fr 1fr 120px' }}>
          <span>Domain</span><span>DA</span><span>Type</span><span>Niche</span><span>Status</span>
        </div>
        {OPPORTUNITIES.map((o, i) => (
          <div key={i} className="table-row" style={{ gridTemplateColumns: '2fr 80px 1fr 1fr 120px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500 }}>
              <ExternalLink size={12} style={{ color: '#6c47ff' }} />{o.domain}
            </span>
            <span style={{ fontSize: 13, fontWeight: 700, color: o.da >= 80 ? '#16a34a' : o.da >= 60 ? '#f59e0b' : '#dc2626' }}>{o.da}</span>
            <span className="keyword-badge badge-blue" style={{ fontSize: 11 }}>{o.type}</span>
            <span className="keyword-badge badge-purple" style={{ fontSize: 11 }}>{o.niche}</span>
            <span><span className="keyword-badge" style={{
              background: o.status === 'Acquired' ? '#dcfce7' : o.status === 'Pending' ? '#ffedd5' : '#ede9fe',
              color: o.status === 'Acquired' ? '#16a34a' : o.status === 'Pending' ? '#ea580c' : '#6c47ff'
            }}>{o.status}</span></span>
          </div>
        ))}
      </div>
    </div>
  );
}
