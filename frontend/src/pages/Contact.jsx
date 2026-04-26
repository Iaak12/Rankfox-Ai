import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Mail, MessageSquare, Clock, ArrowRight } from 'lucide-react';

const getViteApiUrl = () => {
  const base = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  return base.endsWith('/api') ? base : `${base}/api`;
};

const API_URL = getViteApiUrl();

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: 'Sales Inquiry',
    message: ''
  });
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('Sending your inquiry...');

    try {
      const res = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setStatus('Message sent successfully! We will get back to you shortly.');
        setFormData({ name: '', email: '', topic: 'Sales Inquiry', message: '' });
      } else {
        setStatus('Something went wrong. Please try again.');
      }
    } catch (error) {
      setStatus('Could not connect to the server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="public-layout">
      <div className="about-glow" style={{ top: '20%', left: '50%', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)' }}></div>
      <Navbar />

      <main style={{ flex: 1, padding: '120px 24px 160px' }}>
        <div className="contact-grid" style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start' }}>
          
          {/* Left Column: Info */}
          <div>
            <div className="page-badge">CONTACT US</div>
            <h1 className="contact-hero-title" style={{ marginTop: 24, fontSize: 56, fontWeight: 700, color: '#fff' }}>
              Let's talk about<br />your AI strategy.
            </h1>
            <p className="about-mission" style={{ marginTop: 24, fontSize: 18, color: '#9ca3af' }}>
              Whether you're looking for a demo, have a support question, or just want to learn more about RankFox, our team is ready to help.
            </p>

            <div style={{ marginTop: 64, display: 'flex', flexDirection: 'column', gap: 32 }}>
              <div style={{ display: 'flex', gap: 20 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: '#1f2937', display: 'flex', alignItems: 'center', justifyCenter: 'center', flexShrink: 0 }}>
                  <Mail size={20} color="#3b82f6" />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>Email us</div>
                  <div style={{ color: '#9ca3af', fontSize: 14 }}>enterprise@rankfox.ai</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 20 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: '#1f2937', display: 'flex', alignItems: 'center', justifyCenter: 'center', flexShrink: 0 }}>
                  <MessageSquare size={20} color="#10b981" />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>Chat with Sales</div>
                  <div style={{ color: '#9ca3af', fontSize: 14 }}>Available Mon-Fri, 9am - 6pm</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 20 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: '#1f2937', display: 'flex', alignItems: 'center', justifyCenter: 'center', flexShrink: 0 }}>
                  <Clock size={20} color="#a855f7" />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>Response time</div>
                  <div style={{ color: '#9ca3af', fontSize: 14 }}>We typically reply within 24 hours.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div style={{ background: 'rgba(31, 41, 55, 0.5)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: 48, borderRadius: 24 }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="John Doe" 
                  required 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Work Email</label>
                <input 
                  type="email" 
                  className="form-input" 
                  placeholder="john@company.com" 
                  required 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label className="form-label">How can we help?</label>
                <select 
                  className="form-input" 
                  style={{ appearance: 'none' }}
                  value={formData.topic}
                  onChange={(e) => setFormData({...formData, topic: e.target.value})}
                >
                  <option value="Sales Inquiry">Sales Inquiry</option>
                  <option value="Demo Request">Request a Demo</option>
                  <option value="Support">Technical Support</option>
                  <option value="Partnership">Partnership</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea 
                  className="form-input" 
                  rows="4" 
                  placeholder="Tell us about your project..." 
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="form-submit" 
                disabled={isSubmitting}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'} <ArrowRight size={18} />
              </button>

              {status && (
                <div style={{ 
                  marginTop: 8, 
                  padding: '12px 16px', 
                  borderRadius: 12, 
                  background: status.includes('successfully') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  color: status.includes('successfully') ? '#10b981' : '#ef4444',
                  fontSize: 14,
                  textAlign: 'center'
                }}>
                  {status}
                </div>
              )}
            </form>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
