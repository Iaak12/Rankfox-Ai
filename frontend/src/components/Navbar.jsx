import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="public-navbar">
      <Link to="/" className="public-logo" onClick={() => setIsOpen(false)}>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect width="28" height="28" rx="6" fill="#fff"/>
          <path d="M8 20 L14 8 L20 20 M11 15 h6" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
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
        </div>
        <div className="public-nav-actions">
          <Link to="/dashboard" className="public-btn-primary" onClick={() => setIsOpen(false)}>Get a Demo</Link>
          <Link to="/login" className="public-btn-secondary" onClick={() => setIsOpen(false)}>Log In</Link>
        </div>
      </div>
    </nav>
  );
}
