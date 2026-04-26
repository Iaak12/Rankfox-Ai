import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Products() {
  return (
    <div className="public-layout">
      <Navbar />
      
      <main style={{ flex: 1 }}>
        <section className="features-section" style={{ paddingTop: 160 }}>
          <div style={{ textAlign: 'center', marginBottom: 80 }}>
            <div className="page-badge">PRODUCTS</div>
            <h1 className="hero-title">Our AI Intelligence Suite</h1>
            <p className="hero-subtitle">
              Comprehensive tools to monitor, analyze, and optimize your brand across AI platforms.
            </p>
          </div>
          
          <div className="features-container">
            <div className="features-grid ticker-animation">
              {[
                { name: 'Rexo', desc: 'The Lead SEO Strategist. Rexo analyzes competitor gaps and builds mathematical blueprints for ranking dominance.' },
                { name: 'Nova', desc: 'GEO Intelligence Expert. Specialized in Generative Engine Optimization (GEO) to ensure your brand is cited in AI answers.' },
                { name: 'Blaze', desc: 'Speed Indexing Specialist. Blaze handles high-authority link building and priorities your site in indexing queues.' },
                { name: 'Echo', desc: 'The Content Artisan. Echo crafts human-first, high-perplexity content that resonates with both users and AI detectors.' }
              ].concat([
                { name: 'Rexo', desc: 'The Lead SEO Strategist. Rexo analyzes competitor gaps and builds mathematical blueprints for ranking dominance.' },
                { name: 'Nova', desc: 'GEO Intelligence Expert. Specialized in Generative Engine Optimization (GEO) to ensure your brand is cited in AI answers.' },
                { name: 'Blaze', desc: 'Speed Indexing Specialist. Blaze handles high-authority link building and priorities your site in indexing queues.' },
                { name: 'Echo', desc: 'The Content Artisan. Echo crafts human-first, high-perplexity content that resonates with both users and AI detectors.' }
              ]).map((f, i) => (
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
      </main>

      <Footer />
    </div>
  );
}
