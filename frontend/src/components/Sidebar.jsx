import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import {
  LayoutDashboard, Calendar, BookOpen, BarChart2,
  Link2, AlertTriangle, Zap, FileSearch, Settings2, Lock, Globe, Search, MapPin, Target, Bot, RefreshCw,
  Radar, Activity, Bell
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard',          to: '/dashboard' },
  { icon: Calendar,        label: 'Content Planner',    to: '/dashboard/planner' },
  { icon: BookOpen,        label: 'Content Library',    to: '/dashboard/library' },
  { icon: RefreshCw,       label: 'Content Refresh',    to: '/dashboard/refresh' },
  { icon: BarChart2,       label: 'Insights',           to: '/dashboard/insights' },
  { icon: Globe,           label: 'Indexing',           to: '/dashboard/indexing' },
  { icon: Search,          label: 'Keyword Research',   to: '/dashboard/keywords' },
  { icon: Target,          label: 'Competitor X-Ray',   to: '/dashboard/competitor' },
  { icon: Link2,           label: 'Link Builder',       to: '/dashboard/links' },
  { icon: Bot,             label: 'Auto Backlink',      to: '/dashboard/autobacklink' },
  { icon: AlertTriangle,   label: 'Technical Issues',   to: '/dashboard/technical' },
  { icon: Zap,             label: 'Instant Boost',      to: '/dashboard/boost' },
  { icon: FileSearch,      label: 'Site Audit',         to: '/dashboard/audit' },
  { icon: Settings2,       label: 'Page Optimizer',     to: '/dashboard/optimizer' },
  { icon: MapPin,          label: 'Geo Optimizer',      to: '/dashboard/geo' },
  // ─── NEW GEO Intelligence ───
  { icon: Radar,           label: 'AI Brand Monitor',   to: '/dashboard/geo-monitor',  badge: 'NEW' },
  { icon: Activity,        label: 'AI Attribution',     to: '/dashboard/attribution',  badge: 'NEW' },
  { icon: Bell,            label: 'Alerts Center',      to: '/dashboard/alerts',       alertBadge: true },
];

export default function Sidebar() {
  const [unreadCount, setUnreadCount] = useState(0);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return;
    fetchUnread();
    // Poll every 2 minutes
    const interval = setInterval(fetchUnread, 120000);
    return () => clearInterval(interval);
  }, [token]);

  const fetchUnread = async () => {
    try {
      const res = await axios.get(`${API}/api/geo-monitor/alerts/unread-count`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUnreadCount(res.data.count || 0);
    } catch { /* ignore */ }
  };

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect width="28" height="28" rx="7" fill="#7c3aed"/>
          <path d="M9 19 L14 9 L19 19 M11.5 15 h5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span>RankFox.ai</span>
      </div>

      {/* GEO Intelligence Section Label */}
      <nav className="sidebar-nav">
        {navItems.map(({ icon: Icon, label, to, locked, badge, alertBadge }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/dashboard'}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <Icon size={15} />
            <span style={{ flex: 1 }}>{label}</span>

            {/* Alert unread count badge */}
            {alertBadge && unreadCount > 0 && (
              <span style={{
                background: '#ef4444', color: '#fff', borderRadius: 10,
                fontSize: 10, fontWeight: 700, padding: '1px 6px', minWidth: 18, textAlign: 'center',
              }}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}

            {/* NEW badge */}
            {badge && !alertBadge && (
              <span style={{
                background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
                color: '#fff', borderRadius: 6,
                fontSize: 9, fontWeight: 700, padding: '2px 6px',
              }}>
                {badge}
              </span>
            )}

            {locked && (
              <span className="nav-lock">
                <Lock size={10} />
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="credits-label">Total Credits Used</div>
        <div className="credits-bar"><div className="credits-fill" /></div>
        <div className="article-writer-row">
          <span>Article Writer</span>
          <span className="credits-value">0.05%</span>
        </div>
        <div className="article-writer-row" style={{ marginTop: 4 }}>
          <span>Credits Left</span>
          <span>900</span>
        </div>
      </div>
    </aside>
  );
}
