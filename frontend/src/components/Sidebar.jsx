import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Calendar, BookOpen, BarChart2,
  Link2, AlertTriangle, Zap, FileSearch, Settings2, Lock, Globe, Search, MapPin, Target
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard',       to: '/dashboard' },
  { icon: Calendar,        label: 'Content Planner', to: '/dashboard/planner' },
  { icon: BookOpen,        label: 'Content Library', to: '/dashboard/library' },
  { icon: BarChart2,       label: 'Insights',        to: '/dashboard/insights' },
  { icon: Globe,           label: 'Indexing',        to: '/dashboard/indexing' },
  { icon: Search,          label: 'Keyword Research',to: '/dashboard/keywords' },
  { icon: Target,          label: 'Competitor X-Ray',to: '/dashboard/competitor' },
  { icon: Link2,           label: 'Link Builder',    to: '/dashboard/links' },
  { icon: AlertTriangle,   label: 'Technical Issues',to: '/dashboard/technical' },
  { icon: Zap,             label: 'Instant Boost',   to: '/dashboard/boost' },
  { icon: FileSearch,      label: 'Site Audit',      to: '/dashboard/audit' },
  { icon: Settings2,       label: 'Page Optimizer',  to: '/dashboard/optimizer' },
  { icon: MapPin,          label: 'Geo Optimizer',   to: '/dashboard/geo' },
];

export default function Sidebar() {
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

      {/* Nav */}
      <nav className="sidebar-nav">
        {navItems.map(({ icon: Icon, label, to, locked }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/dashboard'}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <Icon size={15} />
            <span>{label}</span>
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
