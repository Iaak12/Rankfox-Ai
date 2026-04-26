import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="public-navbar">
      <Link to="/" className="public-logo" onClick={() => setIsOpen(false)}>
        <img src="/fox_logo.png" alt="RankFox Logo" style={{ height: 42, width: 'auto', mixBlendMode: 'lighten' }} />
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
