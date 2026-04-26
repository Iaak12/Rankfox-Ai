import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react';

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const [step, setStep] = useState(location.state?.autoStep || 1); 
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState(location.state?.email || '');
  const [password, setPassword] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (res.ok) {
        setStep(2);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:5000/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        navigate('/dashboard');
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      const res = await fetch('http://127.0.0.1:5000/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      alert(data.message);
    } catch (err) {
      alert('Failed to resend');
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
          <h1 className="auth-title">
            {step === 1 ? <>Create your <span style={{ color: '#3b82f6' }}>Account</span></> : <>Verify your <span style={{ color: '#3b82f6' }}>Email</span></>}
          </h1>
          <p className="auth-subtitle">{step === 1 ? 'Get started in seconds' : `Enter the 6-digit code sent to ${email}`}</p>
          
          {step === 1 ? (
            <form className="auth-form" onSubmit={handleSignup}>
              <div className="auth-group">
                <label className="auth-label">Name *</label>
                <input type="text" className="auth-input" placeholder="Enter Your Name" required value={name} onChange={(e) => setName(e.target.value)} />
              </div>

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
              
              <div className="auth-options" style={{ marginTop: 24 }}>
                <label className="auth-checkbox">
                  <input type="checkbox" required />
                  <span>I agree to <a href="#">Terms</a> & <a href="#">Privacy</a></span>
                </label>
              </div>
              
              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? 'Creating...' : 'Create Account'} <ArrowRight size={18} />
              </button>
            </form>
          ) : (
            <form className="auth-form" onSubmit={handleVerifyOTP}>
              <div className="auth-group">
                <label className="auth-label">Verification Code</label>
                <input 
                  type="text" 
                  className="auth-input" 
                  placeholder="000000" 
                  maxLength="6"
                  required 
                  value={otp} 
                  onChange={(e) => setOtp(e.target.value)}
                  style={{ textAlign: 'center', fontSize: 24, letterSpacing: 8 }}
                />
              </div>
              
              <button type="submit" className="auth-btn" style={{ marginTop: 32 }} disabled={loading}>
                {loading ? 'Verifying...' : 'Verify Email'} <CheckCircle size={18} />
              </button>

              <div style={{ textAlign: 'center', marginTop: 24, fontSize: 14 }}>
                Didn't receive the code? <span onClick={handleResendOTP} style={{ color: '#3b82f6', cursor: 'pointer', fontWeight: 600 }}>Resend Code</span>
              </div>
            </form>
          )}
          
          <div className="auth-footer">
            {step === 1 ? (
              <>Already have an account? <Link to="/login" className="auth-link">Login</Link></>
            ) : (
              <span onClick={() => setStep(1)} style={{ cursor: 'pointer', color: '#64748b' }}>Back to Signup</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
