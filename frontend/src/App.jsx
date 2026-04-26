import React from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import AccountSettings from './pages/AccountSettings';
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
import GeoOptimizer from './pages/GeoOptimizer';
import CompetitorXRay from './pages/CompetitorXRay';
import AutoBacklink from './pages/AutoBacklink';
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
  '/dashboard/competitor': 'Competitor X-Ray',
  '/dashboard/links': 'Link Builder',
  '/dashboard/autobacklink': 'Auto Backlink',
  '/dashboard/technical': 'Technical Issues',
  '/dashboard/boost': 'Instant Boost',
  '/dashboard/audit': 'Site Audit',
  '/dashboard/optimizer': 'Page Optimizer',
  '/dashboard/geo': 'Geo Optimizer',
  '/dashboard/account': 'My Account',
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

/* Reads ?tab= from URL and opens correct AccountSettings tab */
function AccountSettingsRoute() {
  const { search } = useLocation();
  const tab = new URLSearchParams(search).get('tab') || 'account';
  return <AccountSettings defaultTab={tab} />;
}

function DashboardLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const title = PAGE_TITLES[pathname] || 'Dashboard';
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);
  const dropdownRef = React.useRef(null);

  const goTo = (tab) => {
    setShowProfileMenu(false);
    navigate(`/dashboard/account?tab=${tab}`);
  };

  // Get initials: up to 2 letters from name
  const getInitials = () => {
    if (!user.name) return 'U';
    const parts = user.name.trim().split(' ').filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0].slice(0, 2).toUpperCase();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <ProtectedRoute>
      <div className="app-layout">
        <Sidebar />
        <div className="main-content">
          <div className="topbar">
            <h1>{title}</h1>
            <div className="topbar-right">
              <div className="profile-trigger-wrap" ref={dropdownRef}>
                <button
                  className="user-avatar-initials"
                  onClick={() => setShowProfileMenu(v => !v)}
                  aria-label="Open profile menu"
                >
                  {getInitials()}
                </button>

                {showProfileMenu && (
                  <div className="profile-dropdown">
                    <button className="dropdown-item-link" onClick={() => goTo('account')}>
                      <span className="dropdown-emoji">👋</span>
                      My Account
                    </button>
                    <button className="dropdown-item-link" onClick={() => goTo('plans')}>
                      Our Plans
                    </button>
                    <button className="dropdown-item-link" onClick={() => goTo('domains')}>
                      Domain Manager
                    </button>
                    <button className="dropdown-item-link" onClick={() => goTo('integrations')}>
                      Integrations
                    </button>
                    <div className="dropdown-divider" />
                    <button className="dropdown-item-link logout-item" onClick={handleLogout}>
                      <LogOut size={14} />
                      Logout
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
            <Route path="/competitor" element={<CompetitorXRay />} />
            <Route path="/links" element={<LinkBuilder />} />
            <Route path="/autobacklink" element={<AutoBacklink />} />
            <Route path="/technical" element={<TechnicalIssues />} />
            <Route path="/boost" element={<InstantBoost />} />
            <Route path="/audit" element={<SiteAudit />} />
            <Route path="/optimizer" element={<PageOptimizer />} />
            <Route path="/geo" element={<GeoOptimizer />} />
            <Route path="/account" element={<AccountSettingsRoute />} />
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
