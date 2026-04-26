import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="public-navbar">
      <Link to="/" className="public-logo" onClick={() => setIsOpen(false)}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="#3b82f6" style={{ filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))' }}>
          <path d="M12 2L4.5 9 3 22l9-3 9 3-1.5-13L12 2z"/>
          <circle cx="9" cy="12" r="1" fill="#fff" opacity="0.8"/>
          <circle cx="15" cy="12" r="1" fill="#fff" opacity="0.8"/>
        </svg>
        <span>RankFox</span>
      </Link>
      
      <button className="public-mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      <div className={`public-nav-menu ${isOpen ? 'open' : ''}`}>
        <div className="public-nav-links">
          <Link to="/" className="public-nav-link" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/products" className="public-nav-link" onClick={() => setIsOpen(false)}>Products</Link>
          <Link to="/pricing" className="public-nav-link" onClick={() => setIsOpen(false)}>Pricing</Link>
          <Link to="/about" className="public-nav-link" onClick={() => setIsOpen(false)}>About</Link>
          <Link to="/contact" className="public-nav-link" onClick={() => setIsOpen(false)}>Contact</Link>
          <Link to="/blog" className="public-nav-link" onClick={() => setIsOpen(false)}>Blog</Link>
        </div>
        <div className="public-nav-actions">
          <Link to="/dashboard" className="public-btn-primary" onClick={() => setIsOpen(false)}>Get a Demo</Link>
          <Link to="/login" className="public-btn-secondary" onClick={() => setIsOpen(false)}>Log In</Link>
        </div>
      </div>
    </nav>
  );
}
