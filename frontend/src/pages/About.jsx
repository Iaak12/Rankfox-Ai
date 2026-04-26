import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function About() {
  const [content, setContent] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [openIndex, setOpenIndex] = useState(0);

  useEffect(() => {
    // Fetch page content
    fetch('http://localhost:5000/api/content/about')
      .then(res => res.json())
      .then(data => setContent(data.sections))
      .catch(err => console.error('Error fetching about content:', err));

    // Fetch FAQs
    fetch('http://localhost:5000/api/faqs')
      .then(res => res.json())
      .then(data => setFaqs(data))
      .catch(err => console.error('Error fetching FAQs:', err));
  }, []);

  const intro = content?.intro || {
    title: "We're empowering brands to\nstay visible in an AI-driven world.",
    mission: 'RankFox is on a mission to redefine how\nbrands measure visibility, because the\nnext search engine is artificial intelligence.'
  };

  const story = content?.story || {
    title: "Why we're building RankFox",
    text: 'As AI becomes the new search engine, brands are losing visibility in traditional SEO...'
  };

  return (
    <div className="public-layout">
      <div className="about-glow"></div>
      <Navbar />
      
      <main style={{ flex: 1 }}>
        <section className="about-container">
          <div className="about-watermark">RankFox</div>
          
          <div className="page-badge">ABOUT</div>
          <h1 className="about-title" style={{ whiteSpace: 'pre-line' }}>{intro.title}</h1>
          <p className="about-mission" style={{ whiteSpace: 'pre-line' }}>{intro.mission}</p>
          
          <div style={{ marginTop: 120 }}>
            <h2 className="about-section-title">{story.title}</h2>
            <p className="about-text">{story.text}</p>
          </div>
          
          <div style={{ marginTop: 160, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 100 }}>
            <div className="page-badge">FAQ</div>
            <h2 className="about-section-title" style={{ fontSize: 40, marginTop: 16 }}>Common Questions</h2>
            
            <div style={{ marginTop: 64, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {faqs.length === 0 ? (
                <p style={{ color: '#64748b' }}>No FAQs available yet.</p>
              ) : faqs.map((faq, i) => (
                <div key={faq._id} style={{ 
                  background: 'rgba(31, 41, 55, 0.3)', 
                  border: '1px solid rgba(255, 255, 255, 0.05)', 
                  padding: '24px 32px', 
                  borderRadius: 16,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 600, fontSize: 18, color: openIndex === i ? '#fff' : '#d1d5db' }}>{faq.question}</div>
                    <div style={{ fontSize: 24, color: '#3b82f6', transition: 'transform 0.3s ease', transform: openIndex === i ? 'rotate(45deg)' : 'rotate(0)' }}>+</div>
                  </div>
                  {openIndex === i && (
                    <div style={{ marginTop: 12, color: '#9ca3af', lineHeight: 1.6, fontSize: 15 }}>
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ marginTop: 100, textAlign: 'center', background: 'rgba(59, 130, 246, 0.05)', padding: '60px', borderRadius: 32, border: '1px solid rgba(59, 130, 246, 0.1)' }}>
              <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Still have questions?</h3>
              <p style={{ color: '#9ca3af', marginBottom: 32 }}>We're here to help you navigate the AI search era.</p>
              <Link to="/contact" className="public-btn-primary">Contact Our Team</Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
