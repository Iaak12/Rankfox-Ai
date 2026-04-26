import React from 'react';
import { Lock, Zap } from 'lucide-react';

export default function InstantBoost() {
  return (
    <div className="page-content">
      <div className="card">
        <div className="locked-overlay">
          <div className="locked-icon">🔒</div>
          <div className="locked-title">Instant Boost — Premium Feature</div>
          <div className="locked-desc">
            Instantly boost your content's visibility with AI-powered optimizations,
            auto-indexing requests, and smart link-building campaigns. Upgrade to Pro to unlock.
          </div>
          <button className="upgrade-btn"><Zap size={16} style={{ marginRight: 6, display: 'inline' }} />Upgrade to Pro</button>
        </div>
      </div>
    </div>
  );
}
