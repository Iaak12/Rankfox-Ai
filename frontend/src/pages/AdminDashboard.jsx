import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  Users, 
  Globe, 
  MapPin, 
  MessageSquare, 
  HelpCircle, 
  Search, 
  LogOut,
  Moon,
  ChevronRight,
  UserCheck,
  Trash2
} from 'lucide-react';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('overview'); // 'overview', 'pageContent', 'contacts', 'faqs', 'users'
  const [selectedPage, setSelectedPage] = useState('home');
  const [activeSection, setActiveSection] = useState('hero');
  const [pageData, setPageData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });
  const [isGeneratingBlog, setIsGeneratingBlog] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/adminlogin');
      return;
    }

    const fetchData = async () => {
      try {
        const headers = { 'Authorization': `Bearer ${token}` };
        const apiBase = import.meta.env.VITE_API_URL;
        const [usersRes, contactsRes, faqsRes, blogsRes] = await Promise.all([
          fetch(`${apiBase}/admin/users`, { headers }),
          fetch(`${apiBase}/admin/contacts`, { headers }),
          fetch(`${apiBase}/faqs`),
          fetch(`${apiBase}/blogs/admin/all`, { headers })
        ]);

        if (!usersRes.ok || !contactsRes.ok) throw new Error('Auth failed');
        setUsers(await usersRes.json());
        setContacts(await contactsRes.json());
        setFaqs(await faqsRes.json());
        setBlogs(await blogsRes.json());
        setLoading(false);
      } catch (err) {
        localStorage.removeItem('adminToken');
        navigate('/adminlogin');
      }
    };
    fetchData();
  }, [navigate]);

  useEffect(() => {
    if (activeView === 'pageContent') {
      const fetchPageData = async () => {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/content/${selectedPage}`);
          const data = await res.json();
          setPageData(data.sections);
        } catch (err) {
          console.error('Failed to fetch page data');
        }
      };
      fetchPageData();
    }
  }, [activeView, selectedPage]);

  const handleSaveContent = async () => {
    const token = localStorage.getItem('adminToken');
    setIsSaving(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/content/${selectedPage}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ sections: pageData })
      });
      if (res.ok) alert('Page content updated successfully!');
      else alert('Failed to save changes.');
    } catch (err) {
      alert('Error saving content.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddFaq = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/faqs`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newFaq)
      });
      if (res.ok) {
        const created = await res.json();
        setFaqs([...faqs, created]);
        setNewFaq({ question: '', answer: '' });
      } else {
        const errData = await res.json();
        alert('Error: ' + (errData.message || res.statusText));
      }
    } catch (err) {
      alert('Failed to add FAQ: ' + err.message);
    }
  };

  const handleDeleteFaq = async (id) => {
    if (!window.confirm('Delete this FAQ?')) return;
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/faqs/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setFaqs(faqs.filter(f => f._id !== id));
      else alert('Failed to delete FAQ');
    } catch (err) {
      alert('Failed to delete FAQ: ' + err.message);
    }
  };

  const handleToggleAccess = async (userId) => {
    const token = localStorage.getItem('adminToken');
    console.log('Toggling access for:', userId);
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      // Point back to the real admin route
      const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/admin/users/access/${userId}`, {}, config);
      console.log('Toggle success:', data);
      
      // Ensure data is the full user object
      if (data._id) {
        setUsers(users.map(u => u._id === userId ? data : u));
      }
    } catch (err) {
      console.error('Toggle error:', err);
      alert('Error: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleGenerateAiBlog = async () => {
    const topic = window.prompt('Enter blog topic (e.g., How AI is changing local SEO):');
    if (!topic) return;

    const token = localStorage.getItem('adminToken');
    setIsGeneratingBlog(true);
    try {
      // 1. Generate Blog Content using Rexo/Echo
      const genRes = await fetch(`${import.meta.env.VITE_API_URL}/seo/generate-blog`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ topic })
      });
      
      const aiData = await genRes.json();
      if (!genRes.ok) throw new Error(aiData.message);

      // 2. Save to DB
      const saveRes = await fetch(`${import.meta.env.VITE_API_URL}/blogs`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: aiData.title,
          slug: aiData.slug,
          content: aiData.content,
          excerpt: aiData.excerpt,
          isAiGenerated: true,
          status: 'Published'
        })
      });

      if (saveRes.ok) {
        const saved = await saveRes.json();
        setBlogs([saved, ...blogs]);
        alert('AI Blog Generated and Published!');
      }
    } catch (err) {
      alert('Generation failed: ' + err.message);
    } finally {
      setIsGeneratingBlog(false);
    }
  };

  const handleDeleteBlog = async (id) => {
    if (!window.confirm('Delete this blog post?')) return;
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/blogs/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setBlogs(blogs.filter(b => b._id !== id));
    } catch (err) {
      alert('Delete failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/adminlogin');
  };

  const updateField = (section, field, value) => {
    setPageData({
      ...pageData,
      [section]: {
        ...pageData[section],
        [field]: value
      }
    });
  };

  if (loading) return <div className="admin-loading">Loading Portal...</div>;

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <h1>Admin Portal</h1>
          <p>RankFox Intelligence</p>
        </div>
        
        <nav className="admin-nav">
          <button onClick={() => setActiveView('overview')} className={`admin-nav-item ${activeView === 'overview' ? 'active' : ''}`} style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer' }}>
            <LayoutDashboard size={20} /> <span>Dashboard</span>
          </button>
          <button onClick={() => setActiveView('pageContent')} className={`admin-nav-item ${activeView === 'pageContent' ? 'active' : ''}`} style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer' }}>
            <FileText size={20} /> <span>Page Content</span>
          </button>
          <button onClick={() => setActiveView('users')} className={`admin-nav-item ${activeView === 'users' ? 'active' : ''}`} style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer' }}>
            <Users size={20} /> <span>Registered Users</span>
          </button>
          <div className="admin-nav-item"><MapPin size={20} /> <span>Locations (SEO)</span></div>
          <button onClick={() => setActiveView('blogs')} className={`admin-nav-item ${activeView === 'blogs' ? 'active' : ''}`} style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer' }}>
            <FileText size={20} /> <span>Blogs</span>
          </button>
          <button onClick={() => setActiveView('faqs')} className={`admin-nav-item ${activeView === 'faqs' ? 'active' : ''}`} style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer' }}>
            <HelpCircle size={20} /> <span>FAQs</span>
          </button>
          <div className="admin-nav-item"><Search size={20} /> <span>SEO Management</span></div>
          <button onClick={() => setActiveView('contacts')} className={`admin-nav-item ${activeView === 'contacts' ? 'active' : ''}`} style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer' }}>
            <MessageSquare size={20} /> <span>Contact Submissions</span>
          </button>
          <div className="admin-logout">
            <button onClick={handleLogout} className="admin-nav-item" style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer' }}>
              <LogOut size={20} /> <span>Logout</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <Moon size={20} style={{ color: '#64748b', cursor: 'pointer' }} />
            <div className="admin-user-profile">
              <div className="admin-user-info">
                <div className="welcome">Welcome back,</div>
                <div className="name">Administrator</div>
              </div>
              <div className="admin-avatar">A</div>
            </div>
          </div>
        </header>

        <div className="admin-content">
          <div className="admin-page-title">
            <h2>
              {activeView === 'overview' && 'Dashboard'}
              {activeView === 'pageContent' && 'Page Content Manager'}
              {activeView === 'contacts' && 'Contact Submissions'}
              {activeView === 'faqs' && 'FAQ Management'}
              {activeView === 'users' && 'Registered Users'}
            </h2>
            <p>
              {activeView === 'overview' && 'Overview of your content'}
              {activeView === 'pageContent' && 'Manage your frontend website text dynamically.'}
              {activeView === 'contacts' && 'All inquiries from the website.'}
              {activeView === 'faqs' && 'Add, edit, or remove questions from your About page.'}
              {activeView === 'users' && 'Manage and monitor everyone who signed up on RankFox.'}
            </p>
          </div>

          {activeView === 'overview' ? (
            <>
              <div className="admin-card-container">
                <div className="admin-card-header">
                  <h3>Dashboard</h3>
                  <p>Welcome back! Here's an overview of your content.</p>
                </div>

                <div className="stats-grid">
                  <div className="stat-card bg-blue">
                    <div className="icon-circle"><HelpCircle size={20} /></div>
                    <div><div className="label">Total FAQs</div><div className="value">{faqs.length}</div></div>
                  </div>
                  <div className="stat-card bg-green">
                    <div className="icon-circle"><FileText size={20} /></div>
                    <div><div className="label">Total Users</div><div className="value">{users.length}</div></div>
                  </div>
                  <div className="stat-card bg-orange">
                    <div className="icon-circle"><MessageSquare size={20} /></div>
                    <div><div className="label">Contact Submissions</div><div className="value">{contacts.length}</div></div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginTop: 32 }}>
                <div className="admin-table-card">
                  <h4 style={{ marginBottom: 20, fontSize: 18, color: '#1e293b' }}>Recent Signups</h4>
                  <table className="admin-table">
                    <thead><tr><th>User</th><th>Status</th><th>Date</th></tr></thead>
                    <tbody>
                      {users.slice(0, 5).map(u => (
                        <tr key={u._id}>
                          <td><div style={{ fontWeight: 600 }}>{u.name}</div><div style={{ fontSize: 12, color: '#64748b' }}>{u.email}</div></td>
                          <td><span style={{ padding: '4px 8px', borderRadius: 6, fontSize: 11, background: u.isAdmin ? '#dbeafe' : '#f1f5f9', color: u.isAdmin ? '#2563eb' : '#64748b', fontWeight: 600 }}>{u.isAdmin ? 'Admin' : 'Active'}</span></td>
                          <td style={{ color: '#64748b', fontSize: 12 }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="admin-table-card">
                  <h4 style={{ marginBottom: 20, fontSize: 18, color: '#1e293b' }}>Latest Inquiries</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {contacts.length === 0 ? <p style={{ color: '#64748b' }}>No submissions yet.</p> : contacts.slice(0, 3).map(c => (
                      <div key={c._id} style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <div style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</div>
                          <div style={{ fontSize: 11, color: '#94a3b8' }}>{new Date(c.createdAt).toLocaleDateString()}</div>
                        </div>
                        <div style={{ fontSize: 12, color: '#3b82f6', marginBottom: 4 }}>{c.topic}</div>
                        <div style={{ fontSize: 13, color: '#64748b', fontStyle: 'italic' }}>"{c.message.substring(0, 60)}..."</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : activeView === 'faqs' ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 32 }}>
              <div className="admin-card-container">
                <h4 style={{ marginBottom: 24, fontSize: 18, fontWeight: 700 }}>Add New FAQ</h4>
                <form onSubmit={handleAddFaq}>
                  <div className="cms-field-group">
                    <label className="cms-label">Question</label>
                    <input className="cms-input" value={newFaq.question} onChange={(e) => setNewFaq({...newFaq, question: e.target.value})} required />
                  </div>
                  <div className="cms-field-group">
                    <label className="cms-label">Answer</label>
                    <textarea className="cms-textarea" rows="4" value={newFaq.answer} onChange={(e) => setNewFaq({...newFaq, answer: e.target.value})} required />
                  </div>
                  <button type="submit" className="save-btn" style={{ width: '100%' }}>Create FAQ</button>
                </form>
              </div>

              <div className="admin-table-card">
                <h4 style={{ marginBottom: 24, fontSize: 18, fontWeight: 700 }}>Manage FAQs</h4>
                {faqs.length === 0 ? <p style={{ color: '#64748b' }}>No FAQs added yet.</p> : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {faqs.map(f => (
                      <div key={f._id} style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 20 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                          <div style={{ fontWeight: 700, color: '#1e293b' }}>{f.question}</div>
                          <button onClick={() => handleDeleteFaq(f._id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>Delete</button>
                        </div>
                        <div style={{ fontSize: 14, color: '#64748b', lineHeight: 1.5 }}>{f.answer}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : activeView === 'pageContent' ? (
            <div className="cms-layout">
              <div className="cms-sidebar">
                <div style={{ marginBottom: 24 }}>
                  <label className="cms-sidebar-label">Page</label>
                  <select className="cms-page-select" style={{ width: '100%' }} value={selectedPage} onChange={(e) => { setSelectedPage(e.target.value); setPageData(null); }}>
                    <option value="home">Home Page</option>
                    <option value="about">About Page</option>
                    <option value="pricing">Pricing Page</option>
                  </select>
                </div>
                <div>
                  <label className="cms-sidebar-label">Section</label>
                  {pageData && Object.keys(pageData).map(sectionKey => (
                    <button key={sectionKey} onClick={() => setActiveSection(sectionKey)} className={`cms-section-tab ${activeSection === sectionKey ? 'active' : ''}`}>
                      {sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1)} Section
                    </button>
                  ))}
                </div>
              </div>

              <div className="cms-editor-main">
                {pageData && activeSection && pageData[activeSection] ? (
                  <>
                    <div className="cms-editor-header">
                      <h3>Editing: {selectedPage.charAt(0).toUpperCase() + selectedPage.slice(1)} Page - {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} Section</h3>
                    </div>
                    <div className="cms-fields">
                      {Object.keys(pageData[activeSection]).map(fieldKey => {
                        if (Array.isArray(pageData[activeSection][fieldKey])) return null;
                        const isLongText = pageData[activeSection][fieldKey].length > 60;
                        const isImage = fieldKey.toLowerCase().includes('image') || fieldKey.toLowerCase().includes('bg');
                        return (
                          <div key={fieldKey} className="cms-field-group">
                            <label className="cms-label">{fieldKey.charAt(0).toUpperCase() + fieldKey.slice(1)}{fieldKey === 'title' && ' (HTML allowed)'}</label>
                            {isImage ? (
                              <div className="cms-upload-wrap">
                                <input type="text" className="cms-input" value={pageData[activeSection][fieldKey]} onChange={(e) => updateField(activeSection, fieldKey, e.target.value)} />
                                <button className="upload-btn"><LogOut size={16} /> Upload</button>
                              </div>
                            ) : isLongText ? (
                              <textarea className="cms-textarea" rows="4" value={pageData[activeSection][fieldKey]} onChange={(e) => updateField(activeSection, fieldKey, e.target.value)} />
                            ) : (
                              <input type="text" className="cms-input" value={pageData[activeSection][fieldKey]} onChange={(e) => updateField(activeSection, fieldKey, e.target.value)} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <div className="cms-footer"><button className="save-btn" onClick={handleSaveContent} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Changes'}</button></div>
                  </>
                ) : (
                  <div style={{ textAlign: 'center', color: '#64748b', marginTop: 40 }}>Select a section to begin editing.</div>
                )}
              </div>
            </div>
          ) : activeView === 'blogs' ? (
            <div className="admin-table-card" style={{ padding: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                <div>
                  <h3 style={{ fontSize: 24, fontWeight: 700, color: '#1e293b', margin: 0 }}>Manage Blogs</h3>
                  <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>Create, edit, and delete your blog posts</p>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button 
                    onClick={handleGenerateAiBlog} 
                    className="save-btn" 
                    style={{ background: '#a855f7', display: 'flex', alignItems: 'center', gap: 8 }}
                    disabled={isGeneratingBlog}
                  >
                    <Zap size={16} /> {isGeneratingBlog ? 'Echo is writing...' : 'Auto-Generate AI Blog'}
                  </button>
                  <button className="save-btn" style={{ background: '#3b82f6' }}>+ Create New Blog</button>
                </div>
              </div>

              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Title & Slug</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.map(b => (
                    <tr key={b._id}>
                      <td style={{ padding: '16px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 40, height: 40, borderRadius: 8, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FileText size={20} color="#64748b" />
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: '#1e293b' }}>{b.title}</div>
                            <div style={{ fontSize: 12, color: '#94a3b8' }}>/{b.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{ 
                          padding: '4px 10px', 
                          borderRadius: 20, 
                          fontSize: 11, 
                          fontWeight: 700,
                          background: b.status === 'Published' ? '#dcfce7' : '#f1f5f9',
                          color: b.status === 'Published' ? '#16a34a' : '#64748b'
                        }}>
                          {b.status.toUpperCase()}
                        </span>
                        {b.isAiGenerated && <div style={{ fontSize: 10, color: '#a855f7', marginTop: 4, fontWeight: 600 }}>AI GENERATED</div>}
                      </td>
                      <td style={{ color: '#64748b', fontSize: 13 }}>{new Date(b.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 12 }}>
                          <button style={{ color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer' }}><ChevronRight size={18} /></button>
                          <button onClick={() => handleDeleteBlog(b._id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : activeView === 'users' ? (
            <div className="admin-table-card" style={{ padding: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                <h3 style={{ fontSize: 24, fontWeight: 700, color: '#1e293b', margin: 0 }}>All Registered Users</h3>
                <div style={{ background: '#f1f5f9', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#475569' }}>
                  {users.length} Users
                </div>
              </div>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Joined Date</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id}>
                      <td style={{ padding: '16px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#3b82f6' }}>
                            {u.name.charAt(0)}
                          </div>
                          <div style={{ fontWeight: 600, color: '#1e293b' }}>{u.name}</div>
                        </div>
                      </td>
                      <td style={{ color: '#475569' }}>{u.email}</td>
                      <td style={{ color: '#64748b', fontSize: 13 }}>{new Date(u.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                      <td>
                        <span style={{ 
                          padding: '4px 10px', 
                          borderRadius: 20, 
                          fontSize: 11, 
                          fontWeight: 700,
                          background: u.isAdmin ? '#eff6ff' : '#f8fafc',
                          color: u.isAdmin ? '#2563eb' : '#64748b'
                        }}>
                          {u.isAdmin ? 'SUPER ADMIN' : 'USER'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: (u.hasAccess || u.isAdmin) ? '#10b981' : '#f59e0b', fontSize: 13, fontWeight: 600 }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: (u.hasAccess || u.isAdmin) ? '#10b981' : '#f59e0b' }}></div>
                          {(u.hasAccess || u.isAdmin) ? 'Active' : 'Pending'}
                        </div>
                      </td>
                      <td>
                        {!u.isAdmin && (
                          <button 
                            onClick={() => handleToggleAccess(u._id)}
                            style={{ 
                              padding: '6px 12px', 
                              borderRadius: 8, 
                              border: '1px solid #e2e8f0',
                              background: u.hasAccess ? '#fee2e2' : '#dcfce7',
                              color: u.hasAccess ? '#ef4444' : '#16a34a',
                              fontSize: 12,
                              fontWeight: 600,
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                          >
                            {u.hasAccess ? 'Revoke Access' : 'Grant Access'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="admin-table-card" style={{ padding: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                <h3 style={{ fontSize: 24, fontWeight: 700, color: '#1e293b', margin: 0 }}>All Contact Submissions</h3>
                <div style={{ background: '#f1f5f9', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#475569' }}>
                  {contacts.length} Total
                </div>
              </div>
              <table className="admin-table">
                <thead><tr><th>Date</th><th>Name</th><th>Email</th><th>Topic</th><th>Message</th></tr></thead>
                <tbody>
                  {contacts.map(c => (
                    <tr key={c._id}>
                      <td style={{ fontSize: 12, color: '#64748b', whiteSpace: 'nowrap' }}>{new Date(c.createdAt).toLocaleString()}</td>
                      <td style={{ fontWeight: 600 }}>{c.name}</td>
                      <td style={{ color: '#3b82f6' }}>{c.email}</td>
                      <td><span style={{ padding: '4px 8px', borderRadius: 6, fontSize: 11, background: '#eff6ff', color: '#2563eb', fontWeight: 600 }}>{c.topic}</span></td>
                      <td style={{ fontSize: 13, color: '#475569', maxWidth: 300 }}>{c.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
