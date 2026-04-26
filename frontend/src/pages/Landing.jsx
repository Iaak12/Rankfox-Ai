import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const getViteApiUrl = () => {
  const base = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  return base.endsWith('/api') ? base : `${base}/api`;
};

const API_URL = getViteApiUrl();

export default function Landing() {
  const [content, setContent] = React.useState(null);

  React.useEffect(() => {
    fetch(`${API_URL}/content/home`)
      .then(res => res.json())
      .then(data => setContent(data.sections))
      .catch(err => console.error('Error fetching home content:', err));
  }, []);

  const hero = content?.hero || {
    title: 'Automate how AI\ndiscovers, mentions, and\nmarkets your brand.',
    subtitle: 'RankFox helps brands track, understand, and optimize\ntheir visibility across AI-powered search, PR, and\naffiliate channels.',
    primaryBtn: 'Get a Demo',
    secondaryBtn: 'Free report'
  };

  const features = content?.features?.items || [
    { name: 'Rexo', desc: 'The Lead SEO Strategist. Rexo analyzes competitor gaps and builds mathematical blueprints for ranking dominance.' },
    { name: 'Nova', desc: 'GEO Intelligence Expert. Specialized in Generative Engine Optimization to make your brand the #1 choice for AI answers.' },
    { name: 'Blaze', desc: 'Speed Indexing Specialist. Blaze handles high-authority link building and ensures your content is indexed in seconds.' },
    { name: 'Echo', desc: 'The Content Artisan. Echo crafts human-first, high-perplexity content that resonates with users and search engines alike.' }
  ];

  return (
    <div className="public-layout">
      <Navbar />
      
      <main style={{ flex: 1 }}>
        <section className="hero-section">
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <h1 className="hero-title" style={{ whiteSpace: 'pre-line' }}>{hero.title}</h1>
            <p className="hero-subtitle" style={{ whiteSpace: 'pre-line' }}>{hero.subtitle}</p>
            <div className="hero-actions">
              <Link to="/dashboard" className="public-btn-primary">{hero.primaryBtn}</Link>
              <button className="public-btn-black">{hero.secondaryBtn}</button>
            </div>
          </div>
        </section>

        <section className="features-section">
          <div className="features-container">
            <div className="features-grid ticker-animation">
              {[...features, ...features].map((f, i) => (
                <div key={i} className="feature-col">
                  <div className="feature-img-wrap">
                    <img src={`/feature_${f.name.toLowerCase()}.png`} alt={f.name} />
                  </div>
                  <h3 className="feature-title">{f.name}</h3>
                  <p className="feature-desc">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="pricing-container" style={{ paddingTop: 80, paddingBottom: 80 }}>
          <div className="page-badge">PRICING</div>
          <h1 className="pricing-title" style={{ textAlign: 'center' }}>Affordable pricing for everyone</h1>
          <p className="pricing-subtitle" style={{ textAlign: 'center' }}>Manage prompt libraries and optimize your flow with built-in AI tools.</p>
          
          <div className="pricing-toggle">
            <span className="toggle-option active">Monthly</span>
            <span className="toggle-option">Annualy</span>
            <span className="toggle-badge">2 MONTHS FREE</span>
          </div>
          
          <div className="pricing-cards" style={{ alignItems: 'stretch' }}>
            {[
              { 
                name: 'Basic', 
                price: '$299/month', 
                target: 'FOR SMALL BUSINESSES & EARLY TEAMS',
                color: '#8b5cf6',
                features: [
                  '1 Service Included (SEO or GEO or Local SEO)',
                  'Up to 15 Target Keywords / Prompts',
                  '4 New Pages or Blogs / mo',
                  '8 Content Improvements / Refreshes / mo',
                  '1 Competitor Audit / mo',
                  'Technical Site Fixes (up to 5 issues / mo)',
                  'Monthly Performance Report',
                  'Whatsapp / Email Support',
                  'Dedicated Kamp',
                  'Basic Support'
                ]
              },
              { 
                name: 'Standard', 
                price: '$499/month', 
                target: 'FOR GROWING D2C, SAAS, AND SERVICE BRANDS',
                color: '#a3e635',
                features: [
                  'Any 2 Services (SEO + GEO / SEO + Local)',
                  'Up to 40 Target Keywords / Prompts',
                  '8 New Pages or Blogs / mo',
                  '20 Content Improvements / Refreshes / mo',
                  'Competitor Insights Dashboard',
                  'Fix All Critical Technical SEO Issues',
                  'Schema Setup & Optimization',
                  'Local SEO Presence Boost (Maps, Citations, Reviews)',
                  'Fortnightly Review Calls',
                  'Priority Support Enterprise'
                ]
              },
              { 
                name: 'Enterprise', 
                price: 'CUSTOM', 
                target: 'FOR LARGE BRANDS, MULTI-LOCATION TEAMS, AGENCIES',
                color: '#d9f99d',
                features: [
                  'All 3 Services Included (SEO + GEO + Local SEO)',
                  'Unlimited Keywords / Prompts Tracking',
                  'Custom Content Volume Based on Goals',
                  'Full Technical SEO Overhaul',
                  'GEO Strategy Across All Major AI Search Platforms',
                  'Local SEO for Multiple Locations',
                  'Dedicated Strategist + Account Manager',
                  'Custom Dashboards & Integrations',
                  'Weekly Strategy Calls',
                  'Dedicated Manager'
                ]
              }
            ].map((p, i) => (
              <div key={i} className={`price-card ${p.name.toLowerCase()}`} style={{ height: 'auto', minHeight: '800px', display: 'flex', flexDirection: 'column', background: '#fff', borderTop: `6px solid ${p.color}` }}>
                <div className="plan-name" style={{ fontSize: 32, fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>{p.name}</div>
                <div className="plan-price" style={{ fontSize: 24, fontWeight: 700, color: '#1e293b', marginBottom: 16 }}>{p.price}</div>
                <div className="plan-desc" style={{ fontSize: 14, color: '#64748b', marginBottom: 32, textAlign: 'left' }}>
                  For growing companies who want to monitor visibility and create AEO optimized content
                </div>
                <div className="plan-target" style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, color: '#94a3b8', borderBottom: '1px solid #f1f5f9', paddingBottom: 16, marginBottom: 24, textAlign: 'left' }}>{p.target}</div>
                
                <div className="plan-features" style={{ marginBottom: 40, flex: 1 }}>
                  {p.features?.map((f, fi) => (
                    <div key={fi} style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'flex-start' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#16a34a', marginTop: 2, flexShrink: 0 }}>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span style={{ fontSize: 14, color: '#475569', lineHeight: 1.4 }}>{f}</span>
                    </div>
                  ))}
                </div>

                <Link to="/dashboard" className="price-btn" style={{ marginTop: 'auto', background: '#1e293b', color: '#fff' }}>{p.price === 'CUSTOM' ? 'Contact Us' : 'Get Started'}</Link>
              </div>
            ))}
          </div>
        </section>

        <section className="trusted-section">
          <h2 className="trusted-title">Trusted by brands like</h2>
          <p className="trusted-subtitle">
            Trusted by teams that rely on data-driven insights to dominate<br />
            AI-powered search, brand visibility, and digital authority.
          </p>
          <div className="trusted-logos">
            <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'Outfit' }}>Acme Corp</div>
            <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'Outfit' }}>Globex</div>
            <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'Outfit' }}>Soylent</div>
            <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'Outfit' }}>Initech</div>
            <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'Outfit' }}>Umbrella</div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
