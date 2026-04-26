import React, { useState, useEffect } from 'react';
import { PlayCircle, ArrowRight, PenLine, Copy, Globe, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { seoApi } from '../utils/seoApi';

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
  0:    { bg: '#dcfce7', color: '#16a34a' },
  low:  { bg: '#dbeafe', color: '#2563eb' },
  mid:  { bg: '#ffedd5', color: '#ea580c' },
  high: { bg: '#fee2e2', color: '#dc2626' },
};

function getDiffStyle(d) {
  if (d === 0) return DIFF_COLORS[0];
  if (d <= 15) return DIFF_COLORS.low;
  if (d <= 25) return DIFF_COLORS.mid;
  return DIFF_COLORS.high;
}

/* Article Generation Modal */
function ArticleModal({ article, article_data, onClose }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(article_data?.content || '');
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 760, maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.2)' }}>
        {/* Header */}
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #f0f0f5', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#1a1a2e' }}>{article_data?.title || article.title}</div>
            <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>
              {article_data?.wordCount} words · SEO Score: {article_data?.seoScore} · Readability: {article_data?.readabilityScore}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="action-btn" onClick={copy}>{copied ? '✓ Copied!' : <><Copy size={12} /> Copy</>}</button>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', padding: 4 }}><X size={18} /></button>
          </div>
        </div>

        {/* Meta */}
        {article_data?.metaDescription && (
          <div style={{ padding: '10px 24px', background: '#f8f8fc', borderBottom: '1px solid #f0f0f5' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af' }}>META DESCRIPTION · </span>
            <span style={{ fontSize: 12, color: '#374151' }}>{article_data.metaDescription}</span>
          </div>
        )}

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '20px 24px' }}>
          <pre style={{ fontFamily: 'Inter', fontSize: 13, lineHeight: 1.8, color: '#1a1a2e', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {article_data?.content}
          </pre>
        </div>

        {/* Tags */}
        {article_data?.tags?.length > 0 && (
          <div style={{ padding: '12px 24px', borderTop: '1px solid #f0f0f5', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {article_data.tags.map(t => (
              <span key={t} className="keyword-badge badge-purple">{t}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [filter, setFilter] = useState('7 Days');
  const [kwInput, setKwInput] = useState('');
  const filters = ['7 Days', '28 Days', '180 Days'];
  
  const [gscDismissed, setGscDismissed] = useState(
    () => sessionStorage.getItem('gsc_banner_dismissed') === 'true'
  );
  
  // GSC Connection & AI Insights State
  const [gscConnecting, setGscConnecting] = useState(false);
  const [gscConnected, setGscConnected] = useState(() => localStorage.getItem('gsc_connected') === 'true');
  const [insightsData, setInsightsData] = useState(null);
  const [loadingInsights, setLoadingInsights] = useState(false);

  const [generating, setGenerating] = useState({});
  const [modal, setModal] = useState(null);
  const navigate = useNavigate();

  // Load AI Insights if GSC is connected
  useEffect(() => {
    if (gscConnected) {
      setLoadingInsights(true);
      seoApi('insights', { domain: 'rankfox.ai' })
        .then(data => setInsightsData(data))
        .catch(err => console.error('Error fetching insights:', err))
        .finally(() => setLoadingInsights(false));
    }
  }, [gscConnected]);

  const dismissGsc = () => {
    sessionStorage.setItem('gsc_banner_dismissed', 'true');
    setGscDismissed(true);
  };

  const connectGsc = () => {
    setGscConnecting(true);
    // Simulate OAuth flow delay
    setTimeout(() => {
      setGscConnecting(false);
      setGscConnected(true);
      localStorage.setItem('gsc_connected', 'true');
      setGscDismissed(true); // Auto-hide banner once connected
    }, 2500);
  };

  const handleCreate = async (art) => {
    setGenerating(g => ({ ...g, [art.id]: true }));
    try {
      const data = await seoApi('generate', { title: art.title, keyword: art.keyword });
      setModal({ article: art, data });
    } catch (e) {
      alert('AI Error: ' + e.message);
    } finally {
      setGenerating(g => ({ ...g, [art.id]: false }));
    }
  };

  const handleKwSearch = (e) => {
    if (e.key === 'Enter' && kwInput.trim()) {
      navigate(`/dashboard/keywords?q=${encodeURIComponent(kwInput.trim())}`);
    }
  };

  return (
    <div className="page-content">

      {/* GSC Connection Banner */}
      {!gscDismissed && !gscConnected && (
        <div className="gsc-banner">
          <div className="gsc-banner-left">
            <GSCIcon />
            <span>Connect your Google Search Console to activate AI-driven SEO insights</span>
          </div>
          <div className="gsc-banner-right">
            <button className="gsc-connect-btn" onClick={connectGsc} disabled={gscConnecting} style={{ opacity: gscConnecting ? 0.8 : 1 }}>
              {gscConnecting ? (
                <><span className="spinner" style={{ width: 14, height: 14, borderColor: '#ccc', borderTopColor: '#333' }} /> Connecting...</>
              ) : (
                <><GSCIcon /> Connect to GSC</>
              )}
            </button>
            <button className="gsc-dismiss-btn" onClick={dismissGsc} aria-label="Dismiss">
              <X size={15} />
            </button>
          </div>
        </div>
      )}

      {gscConnected && (
        <div style={{ background: '#dcfce7', color: '#16a34a', padding: '12px 16px', borderRadius: 8, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 500 }}>
          <CheckCircle2 size={16} /> Successfully synced with Google Search Console via RankFox AI.
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
          <div className="insights-stats" style={{ position: 'relative' }}>
            {loadingInsights && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                <span className="spinner" style={{ width: 24, height: 24, borderWidth: 3, borderTopColor: '#6c47ff' }} />
              </div>
            )}
            <div className="stat-item">
              <span className="stat-icon">🌀</span>
              <div>
                <div className="stat-number">{insightsData ? insightsData.global.totalTraffic : '0'}</div>
                <div className="stat-label">Total Traffic</div>
              </div>
            </div>
            <div className="stat-item">
              <span className="stat-icon">👁</span>
              <div>
                <div className="stat-number">{insightsData ? insightsData.global.totalImpressions : '0'}</div>
                <div className="stat-label">Total Impressions</div>
              </div>
            </div>
          </div>
          <div className="card-footer" style={{ marginTop: 'auto' }}>
            <button className="how-it-works-btn"><PlayCircle size={13} /> How it Works</button>
            <a className="action-link" href="/dashboard/insights">More Insights <ArrowRight size={13} /></a>
          </div>
        </div>

        {/* Indexing */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="card-title">Indexing</div>
          {loadingInsights ? (
             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
               <span className="spinner" style={{ width: 24, height: 24, borderWidth: 3, borderTopColor: '#6c47ff' }} />
             </div>
          ) : (
            <>
              <div className="index-number">{insightsData ? '1,492' : '0'}</div>
              <div className="index-label">Total Pages Indexed</div>
            </>
          )}
          <div className="card-footer" style={{ marginTop: 'auto' }}>
            <button className="how-it-works-btn"><PlayCircle size={13} /> How it Works</button>
            <a className="action-link" href="/dashboard/indexing"><Globe size={13} /> Index Pages <ArrowRight size={13} /></a>
          </div>
        </div>

        {/* Keyword Search */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="card-title">Keyword Search</div>
          <div className="keyword-input-wrap">
            <input
              className="keyword-input"
              placeholder="Enter Keyword & press Enter"
              value={kwInput}
              onChange={e => setKwInput(e.target.value)}
              onKeyDown={handleKwSearch}
            />
            <span className="keyword-search-icon" onClick={() => kwInput.trim() && navigate(`/dashboard/keywords?q=${encodeURIComponent(kwInput.trim())}`)} style={{ cursor: 'pointer' }}>🔍</span>
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
          const isGen = generating[art.id];
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
                <button
                  className="action-btn"
                  onClick={() => handleCreate(art)}
                  disabled={isGen}
                  style={{ minWidth: 90, opacity: isGen ? 0.7 : 1 }}
                >
                  {isGen
                    ? <><span className="spinner" style={{ width: 11, height: 11 }} /> Writing…</>
                    : <><Sparkles size={12} /> Create</>
                  }
                </button>
                <button className="action-btn-icon" title="Copy" onClick={() => navigator.clipboard.writeText(art.title)}>
                  <Copy size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Article Modal */}
      {modal && (
        <ArticleModal
          article={modal.article}
          article_data={modal.data}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}

