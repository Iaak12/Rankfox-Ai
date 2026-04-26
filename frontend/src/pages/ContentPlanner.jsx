import React, { useState } from 'react';
import { PenLine, Trash2, Plus, Sparkles, X, Calendar as CalIcon } from 'lucide-react';
import { seoApi } from '../utils/seoApi';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const INITIAL_EVENTS = {
  3: [{ id: 1, text: 'TCS NQT Guide', color: '#ede9fe', textColor: '#6c47ff' }],
  7: [{ id: 2, text: 'Flipkart Grid', color: '#dcfce7', textColor: '#16a34a' }],
  10: [{ id: 3, text: 'AWS Deep Dive', color: '#dbeafe', textColor: '#2563eb' }],
  14: [{ id: 4, text: 'Python Basics', color: '#ffedd5', textColor: '#ea580c' }],
  18: [{ id: 5, text: 'System Design', color: '#ede9fe', textColor: '#6c47ff' }],
  22: [{ id: 6, text: 'Cloud Cert', color: '#dcfce7', textColor: '#16a34a' }],
};

export default function ContentPlanner() {
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [upcoming, setUpcoming] = useState([
    { title: 'TCS NQT Guide', date: '3', status: 'Draft', color: '#f59e0b' },
    { title: 'Flipkart Grid Strategies', date: '7', status: 'Scheduled', color: '#16a34a' },
    { title: 'AWS Deep Dive', date: '10', status: 'In Review', color: '#2563eb' },
    { title: 'Python Basics Guide', date: '14', status: 'Draft', color: '#f59e0b' },
  ]);

  const [showPrompt, setShowPrompt] = useState(false);
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = today.toLocaleString('default', { month: 'long', year: 'numeric' });

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const generateIdeas = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const data = await seoApi('ideas', { topic, count: 5 });
      
      const newEvents = { ...events };
      const newUpcoming = [...upcoming];
      
      let nextDay = today.getDate() + 2; // start scheduling 2 days from now
      
      data.ideas?.forEach((idea, idx) => {
        if (nextDay > daysInMonth) nextDay = (nextDay % daysInMonth) + 1;
        
        if (!newEvents[nextDay]) newEvents[nextDay] = [];
        const colorSet = [
          { bg: '#dcfce7', text: '#16a34a' },
          { bg: '#dbeafe', text: '#2563eb' },
          { bg: '#ffedd5', text: '#ea580c' },
          { bg: '#ede9fe', text: '#6c47ff' }
        ];
        const c = colorSet[idx % colorSet.length];
        
        newEvents[nextDay].push({
          id: Date.now() + idx,
          text: idea.title.length > 25 ? idea.title.substring(0, 25) + '...' : idea.title,
          color: c.bg,
          textColor: c.text
        });
        
        newUpcoming.unshift({
          title: idea.title,
          date: nextDay.toString(),
          status: 'AI Idea',
          color: c.text
        });
        
        nextDay += 4; // spread them out every 4 days
      });
      
      setEvents(newEvents);
      setUpcoming(newUpcoming);
      setShowPrompt(false);
      setTopic('');
    } catch (e) {
      alert('AI Error: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div className="section-title">{monthName}</div>
          <div className="text-muted">Plan your content schedule</div>
        </div>
        <button className="primary-btn" onClick={() => setShowPrompt(true)}>
          <Plus size={15} /> New Content
        </button>
      </div>

      {/* Day headers */}
      <div className="planner-grid" style={{ marginBottom: 6 }}>
        {DAYS.map(d => <div key={d} className="planner-day-header">{d}</div>)}
      </div>

      {/* Cells */}
      <div className="planner-grid">
        {cells.map((day, i) => (
          <div key={i} className="planner-cell" style={day === today.getDate() ? { borderColor: '#6c47ff', background: '#faf7ff' } : {}}>
            {day && (
              <>
                <div className="planner-cell-date" style={day === today.getDate() ? { color: '#6c47ff', fontWeight: 700 } : {}}>{day}</div>
                {(events[day] || []).map(ev => (
                  <div key={ev.id} className="planner-item" style={{ background: ev.color, color: ev.textColor }} title={ev.text}>{ev.text}</div>
                ))}
              </>
            )}
          </div>
        ))}
      </div>

      {/* Upcoming */}
      <div style={{ marginTop: 24 }}>
        <div className="section-title">Upcoming Articles</div>
        <div className="table-card">
          <div className="table-header" style={{ gridTemplateColumns: '1fr 1fr 120px' }}>
            <span>Article</span><span>Scheduled Date</span><span>Status</span>
          </div>
          {upcoming.map((row, i) => (
            <div key={i} className="table-row" style={{ gridTemplateColumns: '1fr 1fr 120px' }}>
              <span style={{ fontWeight: 500, fontSize: 13 }}>{row.title}</span>
              <span style={{ color: '#6b7280', fontSize: 13 }}><CalIcon size={12} style={{marginRight:4, display:'inline'}} /> {monthName.split(' ')[0]} {row.date}, {year}</span>
              <span className="keyword-badge" style={{ background: row.color + '22', color: row.color, width: 'fit-content' }}>{row.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Strategy Modal */}
      {showPrompt && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 16, width: 480, padding: 24, boxShadow: '0 24px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#1a1a2e', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Sparkles size={18} color="#2563eb" /> AI Content Strategist
              </div>
              <button onClick={() => setShowPrompt(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}><X size={18} /></button>
            </div>
            
            <div className="text-muted" style={{ fontSize: 13, marginBottom: 20 }}>
              Enter a broad niche or topic. The AI will generate a month's worth of SEO-optimized article ideas and automatically schedule them on your calendar.
            </div>

            <div className="form-group" style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Niche / Seed Topic</label>
              <input 
                className="big-input" 
                placeholder="e.g. Personal Finance, React JS, Tech Gadgets"
                value={topic}
                onChange={e => setTopic(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && generateIdeas()}
                autoFocus
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button className="action-btn" onClick={() => setShowPrompt(false)}>Cancel</button>
              <button className="primary-btn" onClick={generateIdeas} disabled={loading} style={{ opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                {loading ? <><span className="spinner" style={{ width: 13, height: 13, borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }} /> Planning...</> : 'Generate & Schedule'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
