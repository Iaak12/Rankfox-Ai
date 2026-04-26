import React, { useState } from 'react';
import { PenLine, Eye, Trash2, Plus, BookOpen } from 'lucide-react';

const LIBRARY = [
  { id: 1, title: 'Mastering TCS NQT: Ultimate Preparation Guide', keyword: 'TCS NQT', status: 'Published', words: 2340, date: 'Apr 3, 2024', badge: 'badge-green' },
  { id: 2, title: 'Top Flipkart Grid 6.0 Strategies for Success', keyword: 'Flipkart Grid 6.0', status: 'Draft', words: 1890, date: 'Apr 7, 2024', badge: 'badge-blue' },
  { id: 3, title: 'Ace Your Aptitude Questions: Comprehensive Guide', keyword: 'Aptitude Questions', status: 'Published', words: 3120, date: 'Apr 12, 2024', badge: 'badge-purple' },
  { id: 4, title: 'Google Cloud Certification: Complete Roadmap 2024', keyword: 'Google Cloud Cert', status: 'In Review', words: 2780, date: 'Apr 15, 2024', badge: 'badge-orange' },
  { id: 5, title: 'Python for Data Science: Beginner to Advanced', keyword: 'Python Data Science', status: 'Published', words: 4200, date: 'Apr 18, 2024', badge: 'badge-red' },
  { id: 6, title: 'System Design Interview: Top 20 Questions Solved', keyword: 'System Design', status: 'Draft', words: 2950, date: 'Apr 22, 2024', badge: 'badge-green' },
];

const STATUS_COLORS = {
  'Published': { bg: '#dcfce7', color: '#16a34a' },
  'Draft': { bg: '#f3f4f6', color: '#6b7280' },
  'In Review': { bg: '#dbeafe', color: '#2563eb' },
};

export default function ContentLibrary() {
  const [view, setView] = useState('grid');
  const [search, setSearch] = useState('');

  const filtered = LIBRARY.filter(a => a.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="page-content">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div className="section-title">Content Library</div>
          <div className="text-muted">{LIBRARY.length} articles total</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <input
            className="big-input"
            placeholder="Search articles..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: 220, padding: '8px 14px', fontSize: 13 }}
          />
          <button className="primary-btn" style={{ fontSize: 13, padding: '8px 14px' }}><Plus size={14} /> New Article</button>
        </div>
      </div>

      <div className="library-grid">
        {filtered.map(art => {
          const sc = STATUS_COLORS[art.status];
          return (
            <div key={art.id} className="library-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span className="keyword-badge" style={{ background: sc.bg, color: sc.color }}>{art.status}</span>
                <span className="text-muted">{art.date}</span>
              </div>
              <div className="library-card-title">{art.title}</div>
              <div className="library-card-meta">
                <span className={`keyword-badge ${art.badge}`} style={{ fontSize: 10 }}>{art.keyword}</span>
                <span>•</span>
                <BookOpen size={11} />
                <span>{art.words.toLocaleString()} words</span>
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
                <button className="action-btn" style={{ flex: 1, justifyContent: 'center' }}><PenLine size={12} /> Edit</button>
                <button className="action-btn-icon" title="Preview"><Eye size={13} /></button>
                <button className="action-btn-icon" title="Delete" style={{ color: '#ef4444' }}><Trash2 size={13} /></button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
