import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="public-navbar">
      <Link to="/" className="public-logo" onClick={() => setIsOpen(false)}>
        <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <path d="M12 2L3 9l2 13 7-3 7 3 2-13-9-7z" />
          <path d="M9 11l3 3 3-3" />
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
