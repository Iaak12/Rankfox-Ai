import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Pricing() {
  const [content, setContent] = React.useState(null);

  React.useEffect(() => {
    fetch('http://localhost:5000/api/content/pricing')
      .then(res => res.json())
      .then(data => setContent(data.sections))
      .catch(err => console.error('Error fetching pricing content:', err));
  }, []);

  const header = content?.header || {
    title: 'Affordable pricing for everyone',
    subtitle: 'Manage prompt libraries and optimize your flow with built-in AI tools.'
  };

  const plans = content?.plans || [
    { name: 'Basic', price: '$299/month', target: 'FOR SMALL BUSINESSES & EARLY TEAMS' },
    { name: 'Standard', price: '$499/month', target: 'FOR GROWING D2C, SAAS, AND SERVICE BRANDS' },
    { name: 'Enterprise', price: 'CUSTOM', target: 'FOR LARGE BRANDS, MULTI-LOCATION TEAMS' }
  ];

  return (
    <div className="public-layout">
      <Navbar />
      <div className="pricing-glow"></div>
      
      <main style={{ flex: 1 }}>
        <section className="pricing-container">
          <div className="page-badge">PRICING</div>
          <h1 className="pricing-title">{header.title}</h1>
          <p className="pricing-subtitle">{header.subtitle}</p>
          
          <div className="pricing-toggle">
            <span className="toggle-option active">Monthly</span>
            <span className="toggle-option">Annualy</span>
            <span className="toggle-badge">2 MONTHS FREE</span>
          </div>
          
          <div className="pricing-cards">
            {plans.map((p, i) => (
              <div key={i} className={`price-card ${p.name.toLowerCase()}`}>
                <div className="plan-name">{p.name}</div>
                <div className="plan-price">{p.price}</div>
                <div className="plan-desc">
                  For growing companies who want to monitor visibility and create AEO optimized content
                </div>
                <div className="plan-target">{p.target}</div>
                <div style={{ flex: 1 }}></div>
                <Link to="/dashboard" className="price-btn">{p.price === 'CUSTOM' ? 'Contact Us' : 'Get Started'}</Link>
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
