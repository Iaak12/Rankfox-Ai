import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { seoApi } from '../utils/seoApi';

export default function Insights() {
  const [period, setPeriod] = useState('28 Days');
  const filters = ['7 Days', '28 Days', '180 Days'];
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      try {
        const res = await seoApi('insights', { domain: 'rankfox.ai' });
        setData(res);
      } catch (e) {
        alert('Failed to load insights: ' + e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, []);

  if (loading) {
    return (
      <div className="page-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column' }}>
        <span className="spinner" style={{ width: 40, height: 40, borderWidth: 4, borderColor: '#e5e7eb', borderTopColor: '#6c47ff' }}></span>
        <div style={{ marginTop: 20, color: '#6b7280', fontSize: 15 }}>AI is analyzing search console data...</div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="page-content">
      {/* Mock Data Banner */}
      {!data.isRealData && (
        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', color: '#b45309', padding: '12px 16px', borderRadius: 8, marginBottom: 20, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16 }}>⚠️</span>
          <div>
            <strong>Simulated Data Active:</strong> The insights shown below are AI-generated mock data. To view your real website traffic, you must add your <code>GOOGLE_CLIENT_ID</code> and <code>GOOGLE_CLIENT_SECRET</code> to the backend <code>.env</code> file.
          </div>
        </div>
      )}

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 20 }}>
        {[
          { label: 'Total Traffic', value: data.global?.totalTraffic, icon: '🌀', color: '#6c47ff' },
          { label: 'Total Impressions', value: data.global?.totalImpressions, icon: '👁', color: '#0ea5e9' },
          { label: 'Avg. CTR', value: data.global?.avgCtr, icon: '📈', color: '#16a34a' },
          { label: 'Avg. Position', value: data.global?.avgPosition, icon: '🎯', color: '#f59e0b' },
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
          <AreaChart data={data.trafficData}>
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
        {data.topPages?.map((row, i) => (
          <div key={i} className="table-row" style={{ gridTemplateColumns: '2fr 1fr 1fr 80px' }}>
            <span style={{ fontSize: 13, fontWeight: 500 }}>{row.page}</span>
            <span style={{ fontSize: 13, color: '#6c47ff', fontWeight: 600 }}>{row.clicks?.toLocaleString()}</span>
            <span style={{ fontSize: 13, color: '#6b7280' }}>{row.impressions?.toLocaleString()}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#16a34a' }}>{row.ctr}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
