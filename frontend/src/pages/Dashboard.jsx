import React, { useState } from 'react';
import { PlayCircle, ArrowRight, PenLine, Copy, Globe, X } from 'lucide-react';

/* GSC Google icon (coloured) */
function GSCIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M43.6 20.5H42V20H24v8h11.3C33.6 33.3 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 2.9l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.5-.4-3.5z" fill="#FFC107"/>
      <path d="M6.3 14.7l6.6 4.8C14.7 16 19.1 13 24 13c3.1 0 5.8 1.1 7.9 2.9l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" fill="#FF3D00"/>
      <path d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.2 26.8 36 24 36c-5.3 0-9.6-3.6-11.3-8.5l-6.5 5C9.5 39.5 16.2 44 24 44z" fill="#4CAF50"/>
      <path d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.7l6.2 5.2C37 38.8 44 34 44 24c0-1.2-.1-2.5-.4-3.5z" fill="#1976D2"/>
    </svg>
  );
}

const ARTICLES = [
  { id: 1, title: 'Mastering TCS NQT: Ultimate Preparation Guide', keyword: 'TCS NQT', difficulty: 0, volume: 0, badgeClass: 'badge-green' },
  { id: 2, title: 'Top Flipkart Grid 6.0 Strategies for Success', keyword: 'Flipkart Grid 6.0', difficulty: 0, volume: 0, badgeClass: 'badge-blue' },
  { id: 3, title: 'Ace Your Aptitude Questions: Comprehensive Guide', keyword: 'Aptitude Questions', difficulty: 12, volume: 4400, badgeClass: 'badge-purple' },
  { id: 4, title: 'Google Cloud Certification: Complete Roadmap 2024', keyword: 'Google Cloud Cert', difficulty: 8, volume: 1900, badgeClass: 'badge-orange' },
  { id: 5, title: 'Python for Data Science: Beginner to Advanced', keyword: 'Python Data Science', difficulty: 22, volume: 8100, badgeClass: 'badge-red' },
  { id: 6, title: 'System Design Interview: Top 20 Questions Solved', keyword: 'System Design', difficulty: 18, volume: 6600, badgeClass: 'badge-green' },
  { id: 7, title: 'AWS Solutions Architect Associate – Full Guide', keyword: 'AWS SAA', difficulty: 31, volume: 5400, badgeClass: 'badge-blue' },
];

const DIFF_COLORS = {
  0: { bg: '#dcfce7', color: '#16a34a' },
  low: { bg: '#dbeafe', color: '#2563eb' },
  mid: { bg: '#ffedd5', color: '#ea580c' },
  high: { bg: '#fee2e2', color: '#dc2626' },
};

function getDiffStyle(d) {
  if (d === 0) return DIFF_COLORS[0];
  if (d <= 15) return DIFF_COLORS.low;
  if (d <= 25) return DIFF_COLORS.mid;
  return DIFF_COLORS.high;
}

export default function Dashboard() {
  const [filter, setFilter] = useState('7 Days');
  const filters = ['7 Days', '28 Days', '180 Days'];
  const [gscDismissed, setGscDismissed] = useState(
    () => sessionStorage.getItem('gsc_banner_dismissed') === 'true'
  );

  const dismissGsc = () => {
    sessionStorage.setItem('gsc_banner_dismissed', 'true');
    setGscDismissed(true);
  };

  return (
    <div className="page-content">

      {/* GSC Connection Banner */}
      {!gscDismissed && (
        <div className="gsc-banner">
          <div className="gsc-banner-left">
            <GSCIcon />
            <span>Your Google search console for seamless SEO Management</span>
          </div>
          <div className="gsc-banner-right">
            <button className="gsc-connect-btn">
              <GSCIcon />
              Connect to GSC
            </button>
            <button className="gsc-dismiss-btn" onClick={dismissGsc} aria-label="Dismiss">
              <X size={15} />
            </button>
          </div>
        </div>
      )}

      {/* Top 3 cards */}
      <div className="dashboard-top-grid">

        {/* Insights */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="card-title">Insights</div>
          <div className="insights-filters">
            {filters.map(f => (
              <button key={f} className={`filter-pill${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
            ))}
            <button className="filter-pill" title="Calendar" style={{ padding: '4px 8px' }}>📅</button>
          </div>
          <div className="insights-stats">
            <div className="stat-item">
              <span className="stat-icon">🌀</span>
              <div>
                <div className="stat-number">18.6 K</div>
                <div className="stat-label">Total Traffic</div>
              </div>
            </div>
            <div className="stat-item">
              <span className="stat-icon">👁</span>
              <div>
                <div className="stat-number">463.6 K</div>
                <div className="stat-label">Total Impressions</div>
              </div>
            </div>
          </div>
          <div className="card-footer" style={{ marginTop: 'auto' }}>
            <button className="how-it-works-btn"><PlayCircle size={13} /> How it Works</button>
            <a className="action-link" href="#">More Insights <ArrowRight size={13} /></a>
          </div>
        </div>

        {/* Indexing */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="card-title">Indexing</div>
          <div className="index-number">0</div>
          <div className="index-label">Total Pages Indexed</div>
          <div className="card-footer" style={{ marginTop: 'auto' }}>
            <button className="how-it-works-btn"><PlayCircle size={13} /> How it Works</button>
            <a className="action-link" href="#"><Globe size={13} /> Index Pages <ArrowRight size={13} /></a>
          </div>
        </div>

        {/* Keyword Search */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="card-title">Keyword Search</div>
          <div className="keyword-input-wrap">
            <input className="keyword-input" placeholder="Enter Keyword" />
            <span className="keyword-search-icon">🔍</span>
          </div>
          <div className="card-footer" style={{ marginTop: 'auto' }}>
            <button className="how-it-works-btn"><PlayCircle size={13} /> How it Works</button>
            <a className="action-link" href="/dashboard/keywords">Find Keywords <ArrowRight size={13} /></a>
          </div>
        </div>
      </div>

      {/* Article Table */}
      <div className="table-card">
        <div className="table-header">
          <span>Article Title</span>
          <span>Difficulty</span>
          <span>Volume</span>
          <span></span>
        </div>
        {ARTICLES.map(art => {
          const ds = getDiffStyle(art.difficulty);
          return (
            <div className="table-row" key={art.id}>
              <div className="article-title-cell">
                <div className="article-name">{art.title}</div>
                <div className="keyword-tag">
                  Primary Keyword: <span className={`keyword-badge ${art.badgeClass}`}>{art.keyword}</span>
                </div>
              </div>
              <div>
                <span className="diff-badge" style={{ background: ds.bg, color: ds.color }}>{art.difficulty}</span>
              </div>
              <div style={{ fontSize: 13, color: '#6b7280' }}>{art.volume.toLocaleString()}</div>
              <div className="table-actions">
                <button className="action-btn"><PenLine size={12} /> Create</button>
                <button className="action-btn-icon" title="Copy"><Copy size={13} /></button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
