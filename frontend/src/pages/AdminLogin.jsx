import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://127.0.0.1:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Error logging in');
      }

      if (!data.isAdmin) {
        throw new Error('Access denied. You are not an admin.');
      }

      localStorage.setItem('adminToken', data.token);
      navigate('/admindashboard');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="auth-layout" style={{ background: '#0b0f19' }}>
      <div className="auth-glow"></div>
      
      <div className="auth-container">
        <div className="auth-card" style={{ background: '#111827', border: '1px solid #1f2937' }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ display: 'inline-block', background: '#3b82f6', color: '#fff', padding: '4px 12px', borderRadius: 999, fontSize: 10, fontWeight: 700, letterSpacing: 1, marginBottom: 16 }}>SUPER ADMIN</div>
            <h1 className="auth-title" style={{ color: '#fff' }}>Secure Login</h1>
          </div>

          <form className="auth-form" onSubmit={handleLogin}>
            <div className="auth-group">
              <label className="auth-label" style={{ color: '#d1d5db' }}>Admin ID</label>
              <input type="email" className="auth-input" style={{ background: '#1f2937', color: '#fff', borderColor: '#374151' }} placeholder="Admin Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            
            <div className="auth-group">
              <label className="auth-label" style={{ color: '#d1d5db' }}>Password</label>
              <div className="auth-input-wrapper">
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="auth-input" 
                  style={{ background: '#1f2937', color: '#fff', borderColor: '#374151' }}
                  placeholder="Admin Password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button" 
                  className="auth-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="auth-btn" style={{ marginTop: 24 }}>
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
