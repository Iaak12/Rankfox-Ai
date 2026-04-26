import React, { useState } from 'react';
import { PenLine, Trash2, Plus } from 'lucide-react';

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
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const monthName = today.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="page-content">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div className="section-title">{monthName}</div>
          <div className="text-muted">Plan your content schedule</div>
        </div>
        <button className="primary-btn"><Plus size={15} /> New Content</button>
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
                  <div key={ev.id} className="planner-item" style={{ background: ev.color, color: ev.textColor }}>{ev.text}</div>
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
          {[
            { title: 'TCS NQT Guide', date: `${monthName.split(' ')[0]} 3, ${year}`, status: 'Draft', color: '#f59e0b' },
            { title: 'Flipkart Grid Strategies', date: `${monthName.split(' ')[0]} 7, ${year}`, status: 'Scheduled', color: '#16a34a' },
            { title: 'AWS Deep Dive', date: `${monthName.split(' ')[0]} 10, ${year}`, status: 'In Review', color: '#2563eb' },
            { title: 'Python Basics Guide', date: `${monthName.split(' ')[0]} 14, ${year}`, status: 'Draft', color: '#f59e0b' },
          ].map((row, i) => (
            <div key={i} className="table-row" style={{ gridTemplateColumns: '1fr 1fr 120px' }}>
              <span style={{ fontWeight: 500, fontSize: 13 }}>{row.title}</span>
              <span style={{ color: '#6b7280', fontSize: 13 }}>{row.date}</span>
              <span className="keyword-badge" style={{ background: row.color + '22', color: row.color, width: 'fit-content' }}>{row.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
