import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Calendar, BookOpen, BarChart2, Search,
  Link2, AlertTriangle, Zap, FileSearch, Settings2, Lock, Globe
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard',       to: '/dashboard' },
  { icon: Calendar,        label: 'Content Planner', to: '/dashboard/planner' },
  { icon: BookOpen,        label: 'Content Library', to: '/dashboard/library' },
  { icon: BarChart2,       label: 'Insights',        to: '/dashboard/insights' },
  { icon: Globe,           label: 'Indexing',        to: '/dashboard/indexing' },
  { icon: Search,          label: 'Keyword Research',to: '/dashboard/keywords' },
  { icon: Link2,           label: 'Link Builder',    to: '/dashboard/links' },
  { icon: AlertTriangle,   label: 'Technical Issues',to: '/dashboard/technical' },
  { icon: Zap,             label: 'Instant Boost',   to: '/dashboard/boost', locked: true },
  { icon: FileSearch,      label: 'Site Audit',      to: '/dashboard/audit' },
  { icon: Settings2,       label: 'Page Optimizer',  to: '/dashboard/optimizer' },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
          <rect width="26" height="26" rx="8" fill="#6c47ff"/>
          <path d="M8 18 L13 8 L18 18 M10.5 14.5 h5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span>RankFox.ai</span>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {navItems.map(({ icon: Icon, label, to, locked }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/dashboard'}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <Icon size={16} />
            {label}
            {locked && (
              <span className="nav-lock">
                <Lock size={11} />
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
