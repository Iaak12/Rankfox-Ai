import React, { useState } from 'react';
import { Trash2, Plus, Check, Eye, EyeOff, ExternalLink, Globe, Zap, Link2 } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'account',        label: 'My Account' },
  { id: 'password',       label: 'Change Password' },
  { id: 'plans',          label: 'Our Plans' },
  { id: 'domains',        label: 'Domain Manager' },
  { id: 'integrations',   label: 'Integrations' },
  { id: 'internal-links', label: 'Internal Links' },
];

/* ─── My Account Tab ─── */
function UsageBar({ used, total }) {
  const pct = total > 0 ? Math.min((used / total) * 100, 100) : 0;
  return (
    <div className="usage-bar-wrap">
      <div className="usage-bar-track">
        <div className="usage-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="usage-bar-label">{used.toLocaleString()} / {total.toLocaleString()}</span>
    </div>
  );
}

function MyAccountTab() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [name, setName] = useState(user.name || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [company, setCompany] = useState(user.company || '');
  const [saved, setSaved] = useState(false);

  const getInitials = () => {
    if (!user.name) return 'U';
    const parts = user.name.trim().split(' ').filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0].slice(0, 2).toUpperCase();
  };

  const handleSave = (e) => {
    e.preventDefault();
    const updated = { ...user, name, phone, company };
    localStorage.setItem('user', JSON.stringify(updated));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const USAGE = [
    { label: 'Total Articles',      used: 900,  total: 900  },
    { label: 'Total Keywords',      used: 895,  total: 1000 },
    { label: 'Total Backlinks',     used: 18,   total: 20   },
    { label: 'Total Pages Indexed', used: 7800, total: 7800 },
  ];

  return (
    <div className="acc-section" style={{ maxWidth: 720 }}>

      {/* Avatar + Personal Info */}
      <div className="myacc-top">
        <div className="myacc-avatar">{getInitials()}</div>
        <div className="myacc-form-side">
          <h2 className="acc-section-title" style={{ marginBottom: 18 }}>Personal Information</h2>
          <form className="acc-form" onSubmit={handleSave}>
            <div className="acc-form-row">
              <label className="acc-label">Full Name</label>
              <input className="acc-input" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" />
            </div>
            <div className="acc-form-row">
              <label className="acc-label">Email ID</label>
              <input className="acc-input" value={user.email || ''} disabled style={{ background: '#f8f8fc', color: '#6b7280', cursor: 'not-allowed' }} />
            </div>
            <div className="acc-form-row">
              <label className="acc-label">Phone Number</label>
              <input className="acc-input" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="e.g. +91 9876543210" />
            </div>
            <div className="acc-form-row">
              <label className="acc-label">Company Name</label>
              <input className="acc-input" value={company} onChange={e => setCompany(e.target.value)} placeholder="Your company" />
            </div>
            <button type="submit" className="acc-save-btn">
              {saved ? <><Check size={14} /> Saved!</> : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>

      {/* Current Plan Section */}
      <div className="current-plan-card">
        <div className="current-plan-header">
          <div className="current-plan-left">
            <span className="current-plan-label">Current Plan :</span>
            <span className="current-plan-name">Enterprise</span>
            <span className="current-plan-upgrade">Upgrade</span>
          </div>
          <div className="current-plan-right">
            <span className="current-plan-expires">Expires : Nov 21, 2025</span>
            <button className="view-invoices-btn">View invoices</button>
          </div>
        </div>

        <div className="usage-table">
          <div className="usage-table-header">
            <span>Usage this month</span>
            <span>Credits</span>
          </div>
          {USAGE.map(({ label, used, total }) => (
            <div className="usage-table-row" key={label}>
              <span className="usage-label">{label}</span>
              <UsageBar used={used} total={total} />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

/* ─── Change Password Tab ─── */
function ChangePasswordTab() {
  const [show, setShow] = useState({ current: false, new: false, confirm: false });
  const [vals, setVals] = useState({ current: '', new: '', confirm: '' });
  const [msg, setMsg] = useState(null);

  const toggle = (f) => setShow(s => ({ ...s, [f]: !s[f] }));
  const set = (f) => (e) => setVals(v => ({ ...v, [f]: e.target.value }));

  const handleSave = (e) => {
    e.preventDefault();
    if (vals.new !== vals.confirm) { setMsg({ type: 'error', text: 'New passwords do not match.' }); return; }
    if (vals.new.length < 6) { setMsg({ type: 'error', text: 'Password must be at least 6 characters.' }); return; }
    setMsg({ type: 'success', text: 'Password updated successfully!' });
    setVals({ current: '', new: '', confirm: '' });
    setTimeout(() => setMsg(null), 3000);
  };

  return (
    <div className="acc-section">
      <h2 className="acc-section-title">Change Password</h2>
      <p className="acc-section-sub">Update your account password</p>
      {msg && <div className={`acc-msg ${msg.type}`}>{msg.text}</div>}
      <form className="acc-form" onSubmit={handleSave}>
        {[
          { key: 'current', label: 'Current Password' },
          { key: 'new',     label: 'New Password' },
          { key: 'confirm', label: 'Confirm New Password' },
        ].map(({ key, label }) => (
          <div className="acc-form-row" key={key}>
            <label className="acc-label">{label}</label>
            <div className="acc-input-wrap">
              <input
                className="acc-input"
                type={show[key] ? 'text' : 'password'}
                value={vals[key]}
                onChange={set(key)}
                placeholder="••••••••"
                required
              />
              <button type="button" className="acc-eye-btn" onClick={() => toggle(key)}>
                {show[key] ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
        ))}
        <button type="submit" className="acc-save-btn">Update Password</button>
      </form>
    </div>
  );
}

/* ─── Our Plans Tab ─── */
const PLANS = [
  { name: 'Starter', price: '$0', period: '/mo', features: ['5 Projects', '100 Credits/mo', 'Basic Keyword Research', 'Email Support'], current: true, color: '#6b7280' },
  { name: 'Pro',     price: '$29', period: '/mo', features: ['Unlimited Projects', '5,000 Credits/mo', 'Advanced SEO Tools', 'GSC Integration', 'Priority Support'], current: false, color: '#7c3aed' },
  { name: 'Agency', price: '$79', period: '/mo', features: ['Everything in Pro', '20,000 Credits/mo', 'Multi-domain Support', 'White-label Reports', 'Dedicated Manager'], current: false, color: '#1a1a2e' },
];

function OurPlansTab() {
  return (
    <div className="acc-section">
      <h2 className="acc-section-title">Our Plans</h2>
      <p className="acc-section-sub">Choose the plan that fits your needs</p>
      <div className="plans-grid">
        {PLANS.map(p => (
          <div key={p.name} className={`plan-card${p.current ? ' plan-current' : ''}`} style={{ borderColor: p.current ? p.color : undefined }}>
            {p.current && <div className="plan-badge">Current Plan</div>}
            <div className="plan-name" style={{ color: p.color }}>{p.name}</div>
            <div className="plan-price">{p.price}<span className="plan-period">{p.period}</span></div>
            <ul className="plan-features">
              {p.features.map(f => (
                <li key={f}><Check size={13} style={{ color: p.color, flexShrink: 0 }} />{f}</li>
              ))}
            </ul>
            <button className="plan-btn" style={{ background: p.current ? '#f3f4f6' : p.color, color: p.current ? '#6b7280' : '#fff', cursor: p.current ? 'default' : 'pointer' }} disabled={p.current}>
              {p.current ? 'Current Plan' : 'Upgrade'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Domain Manager Tab ─── */
function DomainManagerTab() {
  const [domains, setDomains] = useState(['talentbattle.in']);
  const [newDomain, setNewDomain] = useState('');
  const [adding, setAdding] = useState(false);

  const addDomain = () => {
    const d = newDomain.trim().replace(/^https?:\/\//, '').replace(/\/$/, '');
    if (d && !domains.includes(d)) {
      setDomains(prev => [...prev, d]);
    }
    setNewDomain('');
    setAdding(false);
  };

  const removeDomain = (d) => setDomains(prev => prev.filter(x => x !== d));

  return (
    <div className="acc-section">
      <div className="acc-section-header">
        <div>
          <h2 className="acc-section-title">Domain Manager</h2>
          <p className="acc-section-sub">Manage domains connected to your account</p>
        </div>
        <button className="acc-add-btn" onClick={() => setAdding(true)}>
          <Plus size={14} /> Add New Domain
        </button>
      </div>

      {adding && (
        <div className="domain-add-row">
          <Globe size={15} style={{ color: '#9ca3af', flexShrink: 0 }} />
          <input
            className="acc-input domain-input"
            autoFocus
            placeholder="example.com"
            value={newDomain}
            onChange={e => setNewDomain(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') addDomain(); if (e.key === 'Escape') { setAdding(false); setNewDomain(''); } }}
          />
          <button className="acc-save-btn" style={{ padding: '7px 14px', fontSize: 12 }} onClick={addDomain}>Add</button>
          <button className="acc-cancel-btn" onClick={() => { setAdding(false); setNewDomain(''); }}>Cancel</button>
        </div>
      )}

      <div className="domain-list">
        {domains.length === 0 && (
          <div className="domain-empty">No domains added yet. Click "Add New Domain" to get started.</div>
        )}
        {domains.map(d => (
          <div className="domain-row" key={d}>
            <Globe size={15} style={{ color: '#9ca3af' }} />
            <span className="domain-name">{d}</span>
            <a href={`https://${d}`} target="_blank" rel="noreferrer" className="domain-link-btn" title="Visit site">
              <ExternalLink size={13} />
            </a>
            <button className="domain-delete-btn" title="Remove" onClick={() => removeDomain(d)}>
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Integrations Tab ─── */
const INTEGRATIONS = [
  { name: 'Google Search Console', desc: 'Connect GSC for indexing & traffic insights', icon: '🔍', connected: false, color: '#4285F4' },
  { name: 'Google Analytics',      desc: 'Import GA4 traffic and engagement data',    icon: '📊', connected: false, color: '#E37400' },
  { name: 'Ahrefs',                desc: 'Import backlink and keyword data',           icon: '🔗', connected: false, color: '#FF6B35' },
  { name: 'Semrush',               desc: 'Sync keyword rankings and audits',           icon: '⚡', connected: false, color: '#FF642D' },
];

function IntegrationsTab() {
  const [connected, setConnected] = useState({});
  const toggle = (name) => setConnected(c => ({ ...c, [name]: !c[name] }));
  return (
    <div className="acc-section">
      <h2 className="acc-section-title">Integrations</h2>
      <p className="acc-section-sub">Connect your favourite tools to RankFox</p>
      <div className="integrations-list">
        {INTEGRATIONS.map(i => (
          <div className="integration-row" key={i.name}>
            <span className="integration-icon">{i.icon}</span>
            <div className="integration-info">
              <div className="integration-name">{i.name}</div>
              <div className="integration-desc">{i.desc}</div>
            </div>
            <button
              className={`integration-btn${connected[i.name] ? ' connected' : ''}`}
              onClick={() => toggle(i.name)}
            >
              {connected[i.name] ? <><Check size={13} /> Connected</> : 'Connect'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Internal Links Tab ─── */
function InternalLinksTab() {
  const [links, setLinks] = useState([
    { id: 1, from: '/blog/seo-guide', to: '/tools/keyword-research', anchor: 'keyword research tool' },
    { id: 2, from: '/blog/backlinks', to: '/tools/link-builder', anchor: 'link building tool' },
  ]);
  const [form, setForm] = useState({ from: '', to: '', anchor: '' });
  const setF = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  const addLink = (e) => {
    e.preventDefault();
    if (!form.from || !form.to) return;
    setLinks(l => [...l, { id: Date.now(), ...form }]);
    setForm({ from: '', to: '', anchor: '' });
  };

  return (
    <div className="acc-section">
      <h2 className="acc-section-title">Internal Links</h2>
      <p className="acc-section-sub">Manage internal linking strategy for better SEO</p>

      <form className="internal-link-form" onSubmit={addLink}>
        <input className="acc-input" placeholder="From URL  (e.g. /blog/post)" value={form.from} onChange={setF('from')} />
        <input className="acc-input" placeholder="To URL  (e.g. /tools/audit)" value={form.to} onChange={setF('to')} />
        <input className="acc-input" placeholder="Anchor text" value={form.anchor} onChange={setF('anchor')} />
        <button type="submit" className="acc-save-btn" style={{ whiteSpace: 'nowrap' }}><Plus size={14} /> Add Link</button>
      </form>

      <div className="ilinks-table">
        <div className="ilinks-header">
          <span>From</span><span>To</span><span>Anchor</span><span></span>
        </div>
        {links.map(l => (
          <div className="ilinks-row" key={l.id}>
            <span className="ilink-url">{l.from}</span>
            <span className="ilink-url">{l.to}</span>
            <span className="ilink-anchor">{l.anchor}</span>
            <button className="domain-delete-btn" onClick={() => setLinks(ls => ls.filter(x => x.id !== l.id))}>
              <Trash2 size={13} />
            </button>
          </div>
        ))}
        {links.length === 0 && <div className="domain-empty">No internal links added yet.</div>}
      </div>
    </div>
  );
}

/* ─── Main AccountSettings Component ─── */
export default function AccountSettings({ defaultTab = 'account' }) {
  const [active, setActive] = useState(defaultTab);

  const renderContent = () => {
    switch (active) {
      case 'account':        return <MyAccountTab />;
      case 'password':       return <ChangePasswordTab />;
      case 'plans':          return <OurPlansTab />;
      case 'domains':        return <DomainManagerTab />;
      case 'integrations':   return <IntegrationsTab />;
      case 'internal-links': return <InternalLinksTab />;
      default:               return <MyAccountTab />;
    }
  };

  return (
    <div className="acc-layout">
      {/* Left sub-nav */}
      <aside className="acc-subnav">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            className={`acc-nav-item${active === item.id ? ' active' : ''}`}
            onClick={() => setActive(item.id)}
          >
            {item.label}
          </button>
        ))}
      </aside>

      {/* Right content */}
      <div className="acc-content">
        {renderContent()}
      </div>
    </div>
  );
}
