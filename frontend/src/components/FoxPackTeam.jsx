import React from 'react';
import { ShieldCheck, Zap, Globe, Link as LinkIcon } from 'lucide-react';

const AGENTS = [
  {
    name: 'Sly',
    role: 'Stealth Strategist',
    desc: 'Analyzes competitor weaknesses and builds mathematical SEO blueprints.',
    icon: <ShieldCheck size={20} color="#f97316" />,
    color: '#fff7ed'
  },
  {
    name: 'Wordy',
    role: 'Content Artisan',
    desc: 'Crafts high-perplexity, human-sounding content that crushes AI detectors.',
    icon: <Zap size={20} color="#8b5cf6" />,
    color: '#f5f3ff'
  },
  {
    name: 'Linky',
    role: 'Authority Builder',
    desc: 'Manages high-DA link placement and instant indexing requests.',
    icon: <LinkIcon size={20} color="#3b82f6" />,
    color: '#eff6ff'
  },
  {
    name: 'Visi',
    role: 'GEO Specialist',
    desc: 'Optimizes your brand for AI answers in ChatGPT, Gemini, and Perplexity.',
    icon: <Globe size={20} color="#10b981" />,
    color: '#ecfdf5'
  }
];

export default function FoxPackTeam() {
  return (
    <div style={{ marginTop: 24 }}>
      <div className="section-title" style={{ fontSize: 16, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
        🦊 Meet the Fox Pack <span className="keyword-badge badge-blue" style={{ fontSize: 10 }}>Active</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
        {AGENTS.map(agent => (
          <div key={agent.name} className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12, border: '1px solid #f0f0f5' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ padding: 10, borderRadius: 12, background: agent.color }}>
                {agent.icon}
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#1a1a2e', fontSize: 15 }}>{agent.name}</div>
                <div style={{ fontSize: 11, color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{agent.role}</div>
              </div>
            </div>
            <div style={{ fontSize: 13, color: '#4b5563', lineHeight: 1.5 }}>
              {agent.desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
