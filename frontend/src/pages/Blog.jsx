import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const getViteApiUrl = () => {
  const base = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  return base.endsWith('/api') ? base : `${base}/api`;
};

const API_URL = getViteApiUrl();

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/blogs`)
      .then(res => res.json())
      .then(data => {
        setBlogs(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching blogs:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="public-layout">
      <Navbar />
      
      <main style={{ flex: 1 }}>
        <section style={{ padding: '160px 24px 100px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 80 }}>
              <div className="page-badge">RESOURCES</div>
              <h1 className="hero-title" style={{ fontSize: 64 }}>The AI SEO Blog</h1>
              <p className="hero-subtitle">
                Expert insights on Generative Engine Optimization, AI search trends, and digital visibility.
              </p>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', color: '#64748b', padding: '100px' }}>Loading articles...</div>
            ) : blogs.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#64748b', padding: '100px' }}>No articles published yet. Stay tuned!</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 40 }}>
                {blogs.map(blog => (
                  <Link to={`/blog/${blog.slug}`} key={blog._id} style={{ textDecoration: 'none' }}>
                    <div className="blog-card" style={{ 
                      background: 'rgba(31, 41, 55, 0.3)', 
                      border: '1px solid rgba(255, 255, 255, 0.05)', 
                      borderRadius: 24, 
                      overflow: 'hidden',
                      transition: 'all 0.3s ease'
                    }}>
                      <div style={{ height: 240, background: '#111827', overflow: 'hidden' }}>
                        <img src={blog.image} alt={blog.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
                      </div>
                      <div style={{ padding: 32 }}>
                        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase' }}>{blog.category}</span>
                          <span style={{ fontSize: 12, color: '#64748b' }}>• {new Date(blog.createdAt).toLocaleDateString()}</span>
                        </div>
                        <h3 style={{ fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 16, lineHeight: 1.3 }}>{blog.title}</h3>
                        <p style={{ color: '#9ca3af', fontSize: 15, lineHeight: 1.6, marginBottom: 24 }}>{blog.excerpt}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#fff', fontWeight: 600, fontSize: 14 }}>
                          Read Article <span style={{ color: '#3b82f6' }}>→</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
