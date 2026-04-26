import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const getViteApiUrl = () => {
  const base = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  return base.endsWith('/api') ? base : `${base}/api`;
};

const API_URL = getViteApiUrl();

export default function Pricing() {
  const [content, setContent] = React.useState(null);

  React.useEffect(() => {
    fetch(`${API_URL}/content/pricing`)
      .then(res => res.json())
      .then(data => setContent(data.sections))
      .catch(err => console.error('Error fetching pricing content:', err));
  }, []);

  const header = content?.header || {
    title: 'Affordable pricing for everyone',
    subtitle: 'Manage prompt libraries and optimize your flow with built-in AI tools.'
  };

  const plans = content?.plans || [
    { 
      name: 'Basic', 
      price: '$299/month', 
      target: 'FOR SMALL BUSINESSES & EARLY TEAMS',
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
  ];

  return (
    <div className="public-layout">
      <Navbar />
      <div className="pricing-glow"></div>
      
      <main style={{ flex: 1 }}>
        <section className="pricing-container" style={{ paddingBottom: 100 }}>
          <div className="page-badge">PRICING</div>
          <h1 className="pricing-title">{header.title}</h1>
          <p className="pricing-subtitle">{header.subtitle}</p>
          
          <div className="pricing-toggle">
            <span className="toggle-option active">Monthly</span>
            <span className="toggle-option">Annualy</span>
            <span className="toggle-badge">2 MONTHS FREE</span>
          </div>
          
          <div className="pricing-cards" style={{ alignItems: 'stretch' }}>
            {plans.map((p, i) => (
              <div key={i} className={`price-card ${p.name.toLowerCase()}`} style={{ height: 'auto', minHeight: '800px', display: 'flex', flexDirection: 'column', background: '#fff' }}>
                <div className="plan-name" style={{ fontSize: 32, fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>{p.name}</div>
                <div className="plan-price" style={{ fontSize: 24, fontWeight: 700, color: '#1e293b', marginBottom: 16 }}>{p.price}</div>
                <div className="plan-desc" style={{ fontSize: 14, color: '#64748b', marginBottom: 32 }}>
                  For growing companies who want to monitor visibility and create AEO optimized content
                </div>
                <div className="plan-target" style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, color: '#94a3b8', borderBottom: '1px solid #f1f5f9', paddingBottom: 16, marginBottom: 24 }}>{p.target}</div>
                
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
        
        {/* FAQ Section */}
        <section style={{ maxWidth: 800, margin: '80px auto 160px', padding: '0 48px' }}>
          {[
            'What is Generative Engine Optimization (GEO)?',
            'What is RankFox GEO and how does it work?',
            'How is this different from SEO?',
            'Can GEO work alongside my existing SEO strategy?',
            'Which AI platforms does RankFox monitor?',
            'How can RankFox help improve my brand\'s AI visibility?',
          ].map((question, i) => (
            <div key={i} style={{ borderBottom: '1px solid #1f2937', padding: '24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
              <h3 style={{ fontSize: 16, fontWeight: 600 }}>{question}</h3>
              <span style={{ fontSize: 24, fontWeight: 300, color: '#9ca3af' }}>{i === 0 ? '−' : '+'}</span>
            </div>
          ))}
          <p style={{ color: '#d1d5db', fontSize: 14, marginTop: 16, lineHeight: 1.6 }}>
            Generative Engine Optimization (GEO) is the discipline of optimizing your content and brand presence to be recognized, referenced, or cited by AI-driven platforms like ChatGPT, Gemini, and Perplexity. Unlike traditional SEO, which focuses on ranking in search results, GEO ensures your brand becomes part of the answers these AI engines deliver.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
