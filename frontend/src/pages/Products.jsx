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
          
          <div className="features-grid">
            {/* Feature 1: Rexo */}
            <div className="feature-col">
              <div className="feature-img-wrap">
                <img src="/feature_rexo.png" alt="Rexo SEO" />
              </div>
              <h3 className="feature-title">Rexo</h3>
              <p className="feature-desc">
                The Lead SEO Strategist. Rexo analyzes competitor gaps and builds mathematical blueprints for ranking dominance, ensuring your site is perfectly structured for modern search engine algorithms.
              </p>
            </div>
            
            {/* Feature 2: Nova */}
            <div className="feature-col">
              <div className="feature-img-wrap">
                <img src="/feature_nova.png" alt="Nova GEO" />
              </div>
              <h3 className="feature-title">Nova</h3>
              <p className="feature-desc">
                GEO Intelligence Expert. Specialized in Generative Engine Optimization (GEO) to ensure your brand is the #1 choice and cited source within AI answers like ChatGPT, Gemini, and Perplexity.
              </p>
            </div>

            {/* Feature 3: Blaze */}
            <div className="feature-col">
              <div className="feature-img-wrap">
                <img src="/feature_blaze.png" alt="Blaze Indexing" />
              </div>
              <h3 className="feature-title">Blaze</h3>
              <p className="feature-desc">
                Speed Indexing Specialist. Blaze handles high-authority link building and priorities your site in indexing queues to make sure your new content gets noticed by Google in record time.
              </p>
            </div>

            {/* Feature 4: Echo */}
            <div className="feature-col">
              <div className="feature-img-wrap">
                <img src="/feature_echo.png" alt="Echo Content" />
              </div>
              <h3 className="feature-title">Echo</h3>
              <p className="feature-desc">
                The Content Artisan. Echo crafts human-first, high-perplexity content that resonates with both users and AI detectors, delivering 100% original articles that rank and convert.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
