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
            {/* Feature 1: Affylo */}
            <div className="feature-col">
              <div className="feature-img-wrap">
                <img src="/feature_affylo.png" alt="Affylo Tracking" />
              </div>
              <h3 className="feature-title">Affylo</h3>
              <p className="feature-desc">
                With advanced monitoring and analytics, Affylo tracks affiliate performance, brand mentions, and partnership opportunities across AI platforms — including ChatGPT, Gemini, Perplexity, and Google AI Overviews — while ensuring your affiliate links are properly attributed.
              </p>
            </div>
            
            {/* Feature 2: Growli */}
            <div className="feature-col">
              <div className="feature-img-wrap">
                <img src="/feature_growli.png" alt="Growli GEO" />
              </div>
              <h3 className="feature-title">Growli</h3>
              <p className="feature-desc">
                Specialized in Generative Engine Optimization (GEO), Growli continuously monitors brand mentions and citations across leading AI platforms — including ChatGPT, Gemini, Perplexity, and Google AI Overviews — while providing actionable insights to boost your visibility.
              </p>
            </div>

            {/* Feature 3: Pyro */}
            <div className="feature-col">
              <div className="feature-img-wrap">
                <img src="/feature_pyro.png" alt="Pyro Analytics" />
              </div>
              <h3 className="feature-title">Pyro</h3>
              <p className="feature-desc">
                Equipped with real-time monitoring capabilities, Pyro tracks how major AI platforms — including ChatGPT, Gemini, Perplexity, and Google AI Overviews — describe, and position your brand across conversational responses, allowing you to react instantly to changes in sentiment.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
