import React, { useState } from 'react';
import { PlayCircle, ArrowRight, PenLine, Copy, Globe } from 'lucide-react';

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

  return (
    <div className="page-content">
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
