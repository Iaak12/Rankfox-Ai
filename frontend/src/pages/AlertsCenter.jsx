import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const SEVERITY_CONFIG = {
  critical: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.25)', icon: '🔴' },
  warning: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)', icon: '⚠️' },
  success: { color: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.25)', icon: '✅' },
  info: { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.25)', icon: 'ℹ️' },
};

function timeAgo(dateStr) {
  const seconds = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function AlertsCenter() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/geo-monitor/alerts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAlerts(res.data);
    } catch {
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id) => {
    try {
      await axios.put(`${API}/api/geo-monitor/alerts/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAlerts(prev => prev.map(a => a._id === id ? { ...a, read: true } : a));
    } catch { /* ignore */ }
  };

  const markAllRead = async () => {
    try {
      await axios.put(`${API}/api/geo-monitor/alerts/read-all`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAlerts(prev => prev.map(a => ({ ...a, read: true })));
    } catch { /* ignore */ }
  };

  const unreadCount = alerts.filter(a => !a.read).length;

  const filtered = alerts.filter(a => {
    if (filter === 'unread') return !a.read;
    if (filter === 'critical') return a.severity === 'critical';
    if (filter === 'success') return a.severity === 'success';
    return true;
  });

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 0 40px' }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(59,130,246,0.08))',
        border: '1px solid rgba(124,58,237,0.2)',
        borderRadius: 14, padding: '20px 24px', marginBottom: 22,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div>
          <h2 style={{ color: '#fff', margin: 0, fontSize: 18, fontWeight: 700 }}>
            🔔 Monitoring Alerts Center
          </h2>
          <p style={{ color: '#94a3b8', fontSize: 13, margin: '4px 0 0' }}>
            Real-time alerts from your always-on AI brand monitoring (every 6 hours)
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {unreadCount > 0 && (
            <div style={{
              background: '#ef4444', color: '#fff', borderRadius: 20, padding: '3px 10px',
              fontSize: 12, fontWeight: 700,
            }}>
              {unreadCount} new
            </div>
          )}
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              style={{
                padding: '8px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)',
                background: 'transparent', color: '#94a3b8', fontSize: 12, cursor: 'pointer',
              }}
            >
              Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
        {[
          { key: 'all', label: `All (${alerts.length})` },
          { key: 'unread', label: `Unread (${unreadCount})` },
          { key: 'critical', label: '🔴 Critical' },
          { key: 'success', label: '✅ Success' },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              padding: '7px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontWeight: 600, fontSize: 12,
              background: filter === f.key ? '#7c3aed' : 'rgba(255,255,255,0.05)',
              color: filter === f.key ? '#fff' : '#64748b',
              transition: 'all 0.2s',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Alert List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60 }}>
          <div style={{ fontSize: 32 }}>🔔</div>
          <p style={{ color: '#64748b', marginTop: 12 }}>Loading alerts...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: 60,
          background: 'rgba(255,255,255,0.03)', borderRadius: 14,
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
          <h3 style={{ color: '#e2e8f0', margin: '0 0 8px' }}>
            {filter === 'all' ? 'No alerts yet' : 'No alerts in this category'}
          </h3>
          <p style={{ color: '#64748b', fontSize: 13 }}>
            {filter === 'all'
              ? 'Run a GEO brand scan to start monitoring. Alerts will appear here automatically every 6 hours.'
              : 'Try switching to "All" to see all alerts.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map((alert) => {
            const sc = SEVERITY_CONFIG[alert.severity] || SEVERITY_CONFIG.info;
            return (
              <div
                key={alert._id}
                onClick={() => !alert.read && markRead(alert._id)}
                style={{
                  padding: '16px 20px', borderRadius: 12,
                  background: alert.read ? 'rgba(255,255,255,0.03)' : sc.bg,
                  border: `1px solid ${alert.read ? 'rgba(255,255,255,0.07)' : sc.border}`,
                  cursor: alert.read ? 'default' : 'pointer',
                  display: 'flex', gap: 16, alignItems: 'flex-start',
                  transition: 'all 0.2s',
                  opacity: alert.read ? 0.7 : 1,
                }}
              >
                {/* Severity Icon */}
                <div style={{ fontSize: 22, flexShrink: 0, marginTop: 1 }}>{sc.icon}</div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ color: '#e2e8f0', fontWeight: 700, fontSize: 14 }}>{alert.title}</div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0, marginLeft: 12 }}>
                      {!alert.read && (
                        <div style={{
                          width: 8, height: 8, borderRadius: '50%',
                          background: sc.color, flexShrink: 0,
                        }} />
                      )}
                      <span style={{ color: '#475569', fontSize: 11 }}>{timeAgo(alert.triggeredAt)}</span>
                    </div>
                  </div>
                  <p style={{ color: '#94a3b8', fontSize: 13, margin: '6px 0 0', lineHeight: 1.5 }}>
                    {alert.message}
                  </p>
                  {alert.brandName && (
                    <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                      <span style={{
                        padding: '3px 10px', borderRadius: 20,
                        background: 'rgba(124,58,237,0.15)', color: '#a78bfa',
                        fontSize: 11, fontWeight: 600,
                      }}>
                        🏷 {alert.brandName}
                      </span>
                      {alert.platform && (
                        <span style={{
                          padding: '3px 10px', borderRadius: 20,
                          background: 'rgba(255,255,255,0.06)', color: '#64748b',
                          fontSize: 11, fontWeight: 600,
                        }}>
                          📡 {alert.platform}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Info Banner: Cron Schedule */}
      <div style={{
        marginTop: 24, padding: '14px 20px',
        background: 'rgba(255,255,255,0.03)', borderRadius: 10,
        border: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <span style={{ fontSize: 18 }}>⏱️</span>
        <div>
          <div style={{ color: '#94a3b8', fontSize: 12, fontWeight: 600 }}>Always-On Monitoring</div>
          <div style={{ color: '#475569', fontSize: 11 }}>
            Your brands are automatically checked across ChatGPT, Gemini & Perplexity every 6 hours.
            Score changes trigger instant alerts here.
          </div>
        </div>
      </div>
    </div>
  );
}
