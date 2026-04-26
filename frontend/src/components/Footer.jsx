import React from 'react';

export default function Footer() {
  return (
    <footer className="rankfox-footer">
      <div className="rankfox-footer-content">
        {/* Left Column: Offices */}
        <div className="footer-offices">
          <h3 className="footer-offices-title">OUR WORLDWIDE OFFICES</h3>
          
          <div className="office-item">
            <span className="office-country">Netherlands</span>
            <span className="office-address">Nieuwezijds Voorburgwal 104, 1012SG Amsterdam, The Netherlands</span>
          </div>

          <div className="office-item">
            <span className="office-country">India</span>
            <span className="office-address">801 A, Palm Spring Plaza, Golf Course Road, Gurugram</span>
            <span className="office-address">Prestige Atlanta, 80 Feet Rd, 1A Block, 3 Block, Koramangala,<br />Bengaluru, Karnataka 560034</span>
          </div>

          <div className="office-item">
            <span className="office-country">United Arab Emirates</span>
            <span className="office-address">Vision Tower, Business Bay, Dubai, United Arab Emirates</span>
          </div>

          <div className="office-item">
            <span className="office-country">Canada</span>
            <span className="office-address">300-3665 Kingsway, Vancouver, BC V5R 5W2, Canada</span>
          </div>

          <div className="office-item">
            <span className="office-country">United Kingdom</span>
            <span className="office-address">Office Gold, Building 3, Chiswick Park, London W4 5YA</span>
          </div>

          <div className="office-item">
            <span className="office-country">Australia</span>
            <span className="office-address">Level 1/457-459 Elizabeth Street, Surry Hills, NSW 2010</span>
          </div>
        </div>

        {/* Right side is handled by background image on the container, but we leave space here if needed */}
      </div>

      <div className="footer-bottom-bar">
        <span>RankFox All rights reserved, 2026.</span>
        <div className="footer-socials">
          <a href="#">X (Twitter)</a>
          <a href="#">LinkedIn</a>
          <a href="#">Instagram</a>
        </div>
      </div>
    </footer>
  );
}
