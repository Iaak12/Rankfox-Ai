import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ContentPlanner from './pages/ContentPlanner';
import ContentLibrary from './pages/ContentLibrary';
import Insights from './pages/Insights';
import Indexing from './pages/Indexing';
import KeywordResearch from './pages/KeywordResearch';
import LinkBuilder from './pages/LinkBuilder';
import TechnicalIssues from './pages/TechnicalIssues';
import InstantBoost from './pages/InstantBoost';
import SiteAudit from './pages/SiteAudit';
import PageOptimizer from './pages/PageOptimizer';
import Landing from './pages/Landing';
import Pricing from './pages/Pricing';
import About from './pages/About';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Products from './pages/Products';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Chatbot from './components/Chatbot';
import './chatbot.css';

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/dashboard/planner': 'Content Planner',
  '/dashboard/library': 'Content Library',
  '/dashboard/insights': 'Insights',
  '/dashboard/indexing': 'Indexing',
  '/dashboard/keywords': 'Keyword Research',
  '/dashboard/links': 'Link Builder',
  '/dashboard/technical': 'Technical Issues',
  '/dashboard/boost': 'Instant Boost',
  '/dashboard/audit': 'Site Audit',
  '/dashboard/optimizer': 'Page Optimizer',
};

function ProtectedRoute({ children }) {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.hasAccess && !user.isAdmin) {
    return (
      <div style={{ 
        height: '100vh', 
        width: '100vw', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: '#f8fafc',
        fontFamily: 'sans-serif'
      }}>
        <div style={{ padding: 40, background: 'white', borderRadius: 16, boxShadow: '0 10px 25px rgba(0,0,0,0.05)', textAlign: 'center', maxWidth: 400 }}>
          <div style={{ fontSize: 48, marginBottom: 20 }}>⏳</div>
          <h2 style={{ color: '#1e293b', marginBottom: 12 }}>Access Pending</h2>
          <p style={{ color: '#64748b', lineHeight: 1.6 }}>Your account has been created successfully, but a Super Admin needs to grant you access before you can use the dashboard.</p>
          <button 
            onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
            style={{ marginTop: 24, padding: '10px 20px', borderRadius: 8, border: 'none', background: '#3b82f6', color: 'white', fontWeight: 600, cursor: 'pointer' }}
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return children;
}

function DashboardLayout() {
  const { pathname } = useLocation();
  const title = PAGE_TITLES[pathname] || 'Dashboard';
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <ProtectedRoute>
      <div className="app-layout">
        <Sidebar />
        <div className="main-content">
          <div className="topbar">
            <h1>{title}</h1>
            <div className="topbar-right">
              <div 
                className="profile-trigger" 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <div style={{ fontSize: 13, color: '#6b7280' }}>{user.email}</div>
                <div className="user-avatar">{user.name?.charAt(0).toUpperCase()}</div>
                
                {showProfileMenu && (
                  <div className="profile-dropdown">
                    <div className="dropdown-header">
                      <div className="user-initials">{user.name?.charAt(0).toUpperCase()}</div>
                      <div className="user-info">
                        <div className="user-name">{user.name}</div>
                        <div className="user-email-small">{user.email}</div>
                      </div>
                    </div>
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item logout" onClick={handleLogout}>
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/planner" element={<ContentPlanner />} />
            <Route path="/library" element={<ContentLibrary />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/indexing" element={<Indexing />} />
            <Route path="/keywords" element={<KeywordResearch />} />
            <Route path="/links" element={<LinkBuilder />} />
            <Route path="/technical" element={<TechnicalIssues />} />
            <Route path="/boost" element={<InstantBoost />} />
            <Route path="/audit" element={<SiteAudit />} />
            <Route path="/optimizer" element={<PageOptimizer />} />
          </Routes>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/products" element={<Products />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
        
        {/* Super Admin Routes */}
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />

        {/* Dashboard Pages */}
        <Route path="/dashboard/*" element={<DashboardLayout />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    <Chatbot />
    </>
  );
}
