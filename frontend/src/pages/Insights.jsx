import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

const TRAFFIC_DATA = [
  { date: 'Apr 1', traffic: 2100, impressions: 38000 },
  { date: 'Apr 5', traffic: 3400, impressions: 52000 },
  { date: 'Apr 9', traffic: 2800, impressions: 61000 },
  { date: 'Apr 13', traffic: 4200, impressions: 74000 },
  { date: 'Apr 17', traffic: 3900, impressions: 68000 },
  { date: 'Apr 21', traffic: 5100, impressions: 89000 },
  { date: 'Apr 25', traffic: 6200, impressions: 99000 },
];

const PAGE_DATA = [
  { page: 'TCS NQT Guide', clicks: 3200, impressions: 48000, ctr: 6.7 },
  { page: 'Flipkart Grid', clicks: 2800, impressions: 41000, ctr: 6.8 },
  { page: 'Aptitude Qs', clicks: 2100, impressions: 38000, ctr: 5.5 },
  { page: 'Cloud Cert', clicks: 1900, impressions: 29000, ctr: 6.6 },
  { page: 'Python DS', clicks: 4100, impressions: 62000, ctr: 6.6 },
];

export default function Insights() {
  const [period, setPeriod] = useState('28 Days');
  const filters = ['7 Days', '28 Days', '180 Days'];

  return (
    <div className="page-content">
      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 20 }}>
        {[
          { label: 'Total Traffic', value: '18.6K', icon: '🌀', color: '#6c47ff' },
          { label: 'Total Impressions', value: '463.6K', icon: '👁', color: '#0ea5e9' },
          { label: 'Avg. CTR', value: '6.4%', icon: '📈', color: '#16a34a' },
          { label: 'Avg. Position', value: '12.3', icon: '🎯', color: '#f59e0b' },
        ].map(s => (
          <div key={s.label} className="card" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 28 }}>{s.icon}</span>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, fontFamily: 'Outfit', color: s.color }}>{s.value}</div>
              <div className="text-muted">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter pills */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {filters.map(f => (
          <button key={f} className={`filter-pill${period === f ? ' active' : ''}`} onClick={() => setPeriod(f)}>{f}</button>
        ))}
      </div>

      {/* Traffic chart */}
      <div className="card" style={{ marginBottom: 18 }}>
        <div className="card-title">Traffic & Impressions Over Time</div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={TRAFFIC_DATA}>
            <defs>
              <linearGradient id="gTraffic" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6c47ff" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#6c47ff" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f8" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} />
            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
            <Tooltip />
            <Area type="monotone" dataKey="traffic" stroke="#6c47ff" fill="url(#gTraffic)" strokeWidth={2} name="Traffic" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Top pages table */}
      <div className="table-card">
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #f0f0f5' }}>
          <div className="card-title" style={{ marginBottom: 0 }}>Top Pages</div>
        </div>
        <div className="table-header" style={{ gridTemplateColumns: '2fr 1fr 1fr 80px' }}>
          <span>Page</span><span>Clicks</span><span>Impressions</span><span>CTR</span>
        </div>
        {PAGE_DATA.map((row, i) => (
          <div key={i} className="table-row" style={{ gridTemplateColumns: '2fr 1fr 1fr 80px' }}>
            <span style={{ fontSize: 13, fontWeight: 500 }}>{row.page}</span>
            <span style={{ fontSize: 13, color: '#6c47ff', fontWeight: 600 }}>{row.clicks.toLocaleString()}</span>
            <span style={{ fontSize: 13, color: '#6b7280' }}>{row.impressions.toLocaleString()}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#16a34a' }}>{row.ctr}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
