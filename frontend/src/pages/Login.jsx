import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        if (data.notVerified) {
          alert('Please verify your email first.');
          navigate('/signup', { state: { email: data.email, autoStep: 2 } });
          return;
        }
        throw new Error(data.message || 'Error logging in');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      navigate('/dashboard');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-glow"></div>
      
      {/* Navbar Minimal */}
      <nav className="auth-navbar">
        <Link to="/" className="public-logo">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="6" fill="#1f2937"/>
            <path d="M8 20 L14 8 L20 20 M11 15 h6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{ color: '#1f2937' }}>RankFox</span>
        </Link>
      </nav>

      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">Welcome back!!</h1>
          <p className="auth-subtitle">Your AI team is ready to work</p>
          
          <form className="auth-form" onSubmit={handleLogin}>
            <div className="auth-group">
              <label className="auth-label">Email *</label>
              <input type="email" className="auth-input" placeholder="Enter Your Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            
            <div className="auth-group">
              <label className="auth-label">Password *</label>
              <div className="auth-input-wrapper">
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="auth-input" 
                  placeholder="Enter Your Password" 
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
            
            <div className="auth-options">
              <label className="auth-checkbox">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <a href="#" className="auth-forgot">Forgot password?</a>
            </div>
            
            <button type="submit" className="auth-btn">
              Login <ArrowRight size={18} />
            </button>
          </form>
          
          <div className="auth-footer">
            Don't have an account? <Link to="/signup" className="auth-link">Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
