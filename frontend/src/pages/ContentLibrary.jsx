import React, { useState } from 'react';
import { PenLine, Eye, Trash2, Plus, BookOpen, X, Copy, Sparkles, Save } from 'lucide-react';
import { seoApi } from '../utils/seoApi';

const INITIAL_LIBRARY = [
  { id: 1, title: 'Mastering TCS NQT: Ultimate Preparation Guide', keyword: 'TCS NQT', status: 'Published', words: 2340, date: 'Apr 3, 2024', badge: 'badge-green', content: 'This is a mock article about TCS NQT.\n\nIt covers preparation strategies...' },
  { id: 2, title: 'Top Flipkart Grid 6.0 Strategies for Success', keyword: 'Flipkart Grid 6.0', status: 'Draft', words: 1890, date: 'Apr 7, 2024', badge: 'badge-blue', content: 'Mock content for Flipkart Grid 6.0.' },
  { id: 3, title: 'Ace Your Aptitude Questions: Comprehensive Guide', keyword: 'Aptitude Questions', status: 'Published', words: 3120, date: 'Apr 12, 2024', badge: 'badge-purple', content: 'Mock content for Aptitude Questions.' },
  { id: 4, title: 'Google Cloud Certification: Complete Roadmap 2024', keyword: 'Google Cloud Cert', status: 'In Review', words: 2780, date: 'Apr 15, 2024', badge: 'badge-orange', content: 'Mock content for Google Cloud Cert.' },
];

const STATUS_COLORS = {
  'Published': { bg: '#dcfce7', color: '#16a34a' },
  'Draft': { bg: '#f3f4f6', color: '#6b7280' },
  'In Review': { bg: '#dbeafe', color: '#2563eb' },
};

/* Article Generation Result Modal */
function ArticleModal({ article_data, onClose, onSave, isSaved }) {
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
            <div style={{ fontWeight: 700, fontSize: 15, color: '#1a1a2e' }}>{article_data?.title}</div>
            <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>
              {article_data?.wordCount || article_data?.words} words 
              {article_data?.seoScore && ` · SEO Score: ${article_data.seoScore}`} 
              {article_data?.readabilityScore && ` · Readability: ${article_data.readabilityScore}`}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {onSave && !isSaved && (
               <button className="primary-btn" onClick={() => onSave(article_data)} style={{ padding: '6px 12px', fontSize: 12 }}>
                 <Save size={12} /> Save to Library
               </button>
            )}
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

export default function ContentLibrary() {
  const [articles, setArticles] = useState(INITIAL_LIBRARY);
  const [search, setSearch] = useState('');
  
  // AI Generation State
  const [showPrompt, setShowPrompt] = useState(false);
  const [topic, setTopic] = useState('');
  const [keyword, setKeyword] = useState('');
  const [generating, setGenerating] = useState(false);
  const [articleResult, setArticleResult] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  const filtered = articles.filter(a => a.title.toLowerCase().includes(search.toLowerCase()));

  const handleGenerate = async () => {
    if (!topic.trim()) return alert("Please enter a topic");
    setGenerating(true);
    try {
      const data = await seoApi('generate', { title: topic, keyword: keyword });
      // Attach the keyword used so we can save it later
      data._originalKeyword = keyword || topic;
      setArticleResult(data);
      setIsSaved(false);
      setShowPrompt(false);
      setTopic('');
      setKeyword('');
    } catch (e) {
      alert('AI Error: ' + e.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveArticle = (data) => {
    const newArt = {
      id: Date.now(),
      title: data.title,
      keyword: data._originalKeyword || 'AI Generated',
      status: 'Draft',
      words: data.wordCount || 0,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      badge: 'badge-purple',
      content: data.content,
      metaDescription: data.metaDescription,
      tags: data.tags,
      seoScore: data.seoScore,
      readabilityScore: data.readabilityScore
    };
    setArticles([newArt, ...articles]);
    setIsSaved(true);
    alert('Article saved to library!');
  };

  const deleteArticle = (id) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      setArticles(articles.filter(a => a.id !== id));
    }
  };

  const viewArticle = (art) => {
    setArticleResult(art);
    setIsSaved(true); // Don't show save button when viewing an already saved article
  };

  return (
    <div className="page-content">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div className="section-title">Content Library</div>
          <div className="text-muted">{articles.length} articles total</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <input
            className="big-input"
            placeholder="Search articles..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: 220, padding: '8px 14px', fontSize: 13 }}
          />
          <button className="primary-btn" style={{ fontSize: 13, padding: '8px 14px' }} onClick={() => setShowPrompt(true)}>
            <Plus size={14} /> New Article
          </button>
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
                <button className="action-btn-icon" title="Preview" onClick={() => viewArticle(art)}><Eye size={13} /></button>
                <button className="action-btn-icon" title="Delete" style={{ color: '#ef4444' }} onClick={() => deleteArticle(art.id)}><Trash2 size={13} /></button>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Article Prompt Modal */}
      {showPrompt && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 16, width: 480, padding: 24, boxShadow: '0 24px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#1a1a2e', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Sparkles size={18} color="#2563eb" /> AI Article Writer
              </div>
              <button onClick={() => setShowPrompt(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}><X size={18} /></button>
            </div>
            
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Article Topic or Title</label>
              <input 
                className="big-input" 
                placeholder="e.g. The Ultimate Guide to Technical SEO in 2024"
                value={topic}
                onChange={e => setTopic(e.target.value)}
                autoFocus
              />
            </div>
            
            <div className="form-group" style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Primary Keyword (Optional)</label>
              <input 
                className="big-input" 
                placeholder="e.g. technical seo guide"
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleGenerate()}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button className="action-btn" onClick={() => setShowPrompt(false)}>Cancel</button>
              <button className="primary-btn" onClick={handleGenerate} disabled={generating} style={{ opacity: generating ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                {generating ? <><span className="spinner" style={{ width: 13, height: 13, borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }} /> Generating...</> : 'Generate Article'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Generated Article Result Modal */}
      {articleResult && (
        <ArticleModal
          article_data={articleResult}
          onClose={() => setArticleResult(null)}
          onSave={handleSaveArticle}
          isSaved={isSaved}
        />
      )}
    </div>
  );
}
