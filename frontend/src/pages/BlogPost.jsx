import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const getViteApiUrl = () => {
  const base = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  return base.endsWith('/api') ? base : `${base}/api`;
};

const API_URL = getViteApiUrl();

export default function BlogPost() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/blogs/${slug}`)
      .then(res => res.json())
      .then(data => {
        setBlog(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching blog:', err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div style={{ background: '#000', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>Loading Article...</div>;
  if (!blog) return <div style={{ background: '#000', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>Article not found. <Link to="/blog">Go back</Link></div>;

  return (
    <div className="public-layout">
      <Navbar />
      
      <main style={{ flex: 1, padding: '160px 24px 100px' }}>
        <article style={{ maxWidth: 800, margin: '0 auto' }}>
          <Link to="/blog" style={{ color: '#3b82f6', textDecoration: 'none', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
            ← Back to Blog
          </Link>

          <div style={{ marginBottom: 48 }}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase' }}>{blog.category}</span>
              <span style={{ fontSize: 12, color: '#64748b' }}>• {new Date(blog.createdAt).toLocaleDateString()}</span>
            </div>
            <h1 style={{ fontSize: 48, fontWeight: 800, color: '#fff', marginBottom: 24, lineHeight: 1.1 }}>{blog.title}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#1f2937', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>R</div>
              <div>
                <div style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>{blog.author}</div>
                <div style={{ color: '#64748b', fontSize: 12 }}>AI Intelligence Lead</div>
              </div>
            </div>
          </div>

          <div style={{ borderRadius: 32, overflow: 'hidden', marginBottom: 64, border: '1px solid rgba(255,255,255,0.05)' }}>
            <img src={blog.image} alt={blog.title} style={{ width: '100%', display: 'block' }} />
          </div>

          <div className="blog-content" style={{ 
            color: '#d1d5db', 
            fontSize: 18, 
            lineHeight: 1.8,
            whiteSpace: 'pre-wrap' // Preserve AI markdown formatting
          }}>
            {blog.content}
          </div>

          <div style={{ marginTop: 80, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 64 }}>
            <h3 style={{ color: '#fff', fontSize: 24, fontWeight: 700, marginBottom: 32 }}>Share this insight</h3>
            <div style={{ display: 'flex', gap: 16 }}>
              <button className="public-btn-primary" style={{ padding: '12px 24px', fontSize: 14 }}>Twitter</button>
              <button className="public-btn-primary" style={{ padding: '12px 24px', fontSize: 14, background: '#1f2937' }}>LinkedIn</button>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
