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
          <h2 className="hero-title" style={{ fontSize: 48, textAlign: 'center', marginBottom: 60 }}>Choose Your Strategy</h2>
          
          <div className="pricing-cards" style={{ alignItems: 'stretch' }}>
            {[
              { 
                name: 'Basic', price: '$299/mo', color: '#8b5cf6', 
                features: ['1 Service Included', '15 Keywords', '4 Blogs/mo', 'Email Support']
              },
              { 
                name: 'Standard', price: '$499/mo', color: '#a3e635', 
                features: ['2 Services Included', '40 Keywords', '8 Blogs/mo', 'Priority Support']
              },
              { 
                name: 'Enterprise', price: 'CUSTOM', color: '#d9f99d', 
                features: ['All 3 Services', 'Unlimited Tracking', 'Custom Content', 'Dedicated Manager']
              }
            ].map((p, i) => (
              <div key={i} className="price-card" style={{ background: '#fff', borderRadius: 4, padding: 32, display: 'flex', flexDirection: 'column', borderTop: `6px solid ${p.color}` }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>{p.name}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#1e293b', marginBottom: 24 }}>{p.price}</div>
                <div style={{ flex: 1, marginBottom: 32 }}>
                  {p.features.map((f, fi) => (
                    <div key={fi} style={{ display: 'flex', gap: 10, marginBottom: 12, alignItems: 'center' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                      <span style={{ fontSize: 13, color: '#64748b' }}>{f}</span>
                    </div>
                  ))}
                </div>
                <Link to="/pricing" className="price-btn" style={{ background: '#1e293b', color: '#fff', fontSize: 13 }}>View Full Details</Link>
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
