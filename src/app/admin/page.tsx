'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MediaTab from './components/MediaTab';
import ProductsTab from './components/ProductsTab';

interface Message {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
}

interface Paragraph {
  heading: string;
  text: string;
}

interface Article {
  id?: number;
  title: string;
  content: string; // serialized JSON
  paragraphs?: Paragraph[];
  image_url: string;
  image_alt: string;
  author: string;
  published_date: string;
  display_order: number;
}

export default function AdminPage() {
  // Authentication & Navigation
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mustChangePassword, setMustChangePassword] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'inquiries' | 'hero' | 'services' | 'products' | 'gallery' | 'team' | 'articles' | 'media'>('inquiries');

  // Loading States
  const [loading, setLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  // Data States
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState<any>(null);

  // Form Fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Password Change fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);
  const [changePasswordError, setChangePasswordError] = useState('');
  const [changePasswordSuccess, setChangePasswordSuccess] = useState('');

  // Section Editing States
  const [editingCard, setEditingCard] = useState<any>(null); // Services/Team/Gallery/Article card
  const [editorMode, setEditorMode] = useState<'add' | 'edit' | null>(null);

  // Password Strength Criteria
  const isLengthValid = newPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasDigit = /\d/.test(newPassword);
  const hasSpecial = /[@$!%*?&#]/.test(newPassword);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;
  const isNewPasswordStrong = isLengthValid && hasUpper && hasLower && hasDigit && hasSpecial;
  const canSubmitChangePassword = isNewPasswordStrong && passwordsMatch && currentPassword.length > 0;

  // Initialize
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch messages (only accessible if authenticated)
      const msgRes = await fetch('/api/admin/messages');
      if (msgRes.ok) {
        const msgData = await msgRes.json();
        setMessages(msgData.messages || []);
        setIsLoggedIn(true);
        setMustChangePassword(false);
      } else if (msgRes.status === 403) {
        setIsLoggedIn(true);
        setMustChangePassword(true);
      } else if (msgRes.status === 401) {
        setIsLoggedIn(false);
      }

      // Fetch dynamic homepage contents (public access)
      const contentRes = await fetch('/api/content');
      if (contentRes.ok) {
        const contentData = await contentRes.json();
        setContent(contentData);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.passwordChangeRequired) {
          setIsLoggedIn(true);
          setMustChangePassword(true);
        } else {
          setIsLoggedIn(true);
          fetchData();
        }
      } else {
        const errData = await response.json();
        setError(errData.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmitChangePassword) return;

    setChangePasswordLoading(true);
    setChangePasswordError('');
    setChangePasswordSuccess('');

    try {
      const response = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      if (response.ok) {
        setChangePasswordSuccess('Password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');

        setTimeout(() => {
          setMustChangePassword(false);
          setIsChangePasswordModalOpen(false);
          setChangePasswordSuccess('');
          fetchData();
        }, 1500);
      } else {
        const errData = await response.json();
        setChangePasswordError(errData.error || 'Failed to change password.');
      }
    } catch (err) {
      setChangePasswordError('An error occurred. Please try again.');
    } finally {
      setChangePasswordLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/admin/logout', { method: 'POST' });
      if (response.ok) {
        setIsLoggedIn(false);
        setMustChangePassword(false);
        setMessages([]);
        setUsername('');
        setPassword('');
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleDeleteMessage = async (id: number) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const response = await fetch('/api/admin/messages', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });

      if (response.ok) {
        setMessages((prev) => prev.filter((msg) => msg.id !== id));
      } else {
        alert('Failed to delete the message.');
      }
    } catch (err) {
      console.error('Delete message error:', err);
    }
  };

  // Content Saving Helpers
  const showNotification = (msg: string, isError = false) => {
    if (isError) {
      setError(msg);
      setTimeout(() => setError(''), 4000);
    } else {
      setSuccess(msg);
      setTimeout(() => setSuccess(''), 4000);
    }
  };

  const handleSyncImages = async () => {
    if (!confirm('This will download all external images to local public/images subfolders and update the database links. Proceed?')) return;
    setSaveLoading(true);
    try {
      const response = await fetch('/api/admin/content/download-images', {
        method: 'POST'
      });
      if (response.ok) {
        showNotification('All images successfully downloaded and synchronized to local storage!');
        fetchData();
      } else {
        const data = await response.json();
        showNotification(`Sync failed: ${data.error || 'Unknown error'}`, true);
      }
    } catch (err) {
      showNotification('Error running sync process.', true);
    } finally {
      setSaveLoading(false);
    }
  };

  // 1. Save Hero Settings
  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      const response = await fetch('/api/admin/content/hero', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: content.hero.title,
          content: content.hero.content,
          show_contact_us: content.hero.show_contact_us,
          background_type: content.hero.background_type || 'image',
          background_url: content.hero.background_url || ''
        })
      });
      if (response.ok) {
        showNotification('Hero settings saved successfully!');
      } else {
        showNotification('Failed to save Hero settings.', true);
      }
    } catch (err) {
      showNotification('Error saving Hero settings.', true);
    } finally {
      setSaveLoading(false);
    }
  };

  // 2. Save Services Header Title
  const handleSaveServicesTitle = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      const response = await fetch('/api/admin/content/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settingsTitle: content.servicesSettings.title })
      });
      if (response.ok) {
        showNotification('Services section title saved successfully!');
      } else {
        showNotification('Failed to save services title.', true);
      }
    } catch (err) {
      showNotification('Error saving services title.', true);
    } finally {
      setSaveLoading(false);
    }
  };

  // 3. Save Services Card (Add / Edit)
  const handleSaveServiceCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      const method = editorMode === 'add' ? 'POST' : 'PUT';
      const response = await fetch('/api/admin/content/services', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCard)
      });
      if (response.ok) {
        showNotification(`Service card ${editorMode === 'add' ? 'created' : 'updated'} successfully!`);
        setEditorMode(null);
        setEditingCard(null);
        fetchData();
      } else {
        showNotification('Failed to save service card.', true);
      }
    } catch (err) {
      showNotification('Error saving service card.', true);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDeleteServiceCard = async (id: number) => {
    if (!confirm('Are you sure you want to delete this service card?')) return;
    try {
      const response = await fetch('/api/admin/content/services', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (response.ok) {
        showNotification('Service card deleted successfully!');
        fetchData();
      } else {
        showNotification('Failed to delete service card.', true);
      }
    } catch (err) {
      showNotification('Error deleting service card.', true);
    }
  };

  // 4. Save Gallery Settings
  const handleSaveGallerySettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      const response = await fetch('/api/admin/content/gallery', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sliding_effect: content.gallerySettings.sliding_effect,
          autoplay_speed: content.gallerySettings.autoplay_speed
        })
      });
      if (response.ok) {
        showNotification('Gallery carousel settings saved!');
      } else {
        showNotification('Failed to save gallery settings.', true);
      }
    } catch (err) {
      showNotification('Error saving gallery settings.', true);
    } finally {
      setSaveLoading(false);
    }
  };

  // 5. Save Gallery Item (Add / Edit)
  const handleSaveGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      const method = editorMode === 'add' ? 'POST' : 'PUT';
      const response = await fetch('/api/admin/content/gallery', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCard)
      });
      if (response.ok) {
        showNotification(`Gallery slide ${editorMode === 'add' ? 'created' : 'updated'} successfully!`);
        setEditorMode(null);
        setEditingCard(null);
        fetchData();
      } else {
        showNotification('Failed to save gallery slide.', true);
      }
    } catch (err) {
      showNotification('Error saving gallery slide.', true);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDeleteGalleryItem = async (id: number) => {
    if (!confirm('Are you sure you want to delete this gallery item?')) return;
    try {
      const response = await fetch('/api/admin/content/gallery', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (response.ok) {
        showNotification('Gallery slide deleted successfully!');
        fetchData();
      } else {
        showNotification('Failed to delete gallery slide.', true);
      }
    } catch (err) {
      showNotification('Error deleting gallery slide.', true);
    }
  };

  // 6. Save Team Card (Add / Edit)
  const handleSaveTeamCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      const method = editorMode === 'add' ? 'POST' : 'PUT';
      const response = await fetch('/api/admin/content/team', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCard)
      });
      if (response.ok) {
        showNotification(`Team member card ${editorMode === 'add' ? 'created' : 'updated'} successfully!`);
        setEditorMode(null);
        setEditingCard(null);
        fetchData();
      } else {
        showNotification('Failed to save team member.', true);
      }
    } catch (err) {
      showNotification('Error saving team member.', true);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDeleteTeamCard = async (id: number) => {
    if (!confirm('Are you sure you want to delete this team member?')) return;
    try {
      const response = await fetch('/api/admin/content/team', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (response.ok) {
        showNotification('Team member card deleted successfully!');
        fetchData();
      } else {
        showNotification('Failed to delete team member.', true);
      }
    } catch (err) {
      showNotification('Error deleting team member.', true);
    }
  };

  // 7. Save Article Post (Add / Edit)
  const handleSaveArticlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      const method = editorMode === 'add' ? 'POST' : 'PUT';
      // Serialize paragraphs array into content field
      const postData = {
        ...editingCard,
        content: JSON.stringify(editingCard.paragraphs)
      };
      
      const response = await fetch('/api/admin/content/articles', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      });
      if (response.ok) {
        showNotification(`Article post ${editorMode === 'add' ? 'created' : 'updated'} successfully!`);
        setEditorMode(null);
        setEditingCard(null);
        fetchData();
      } else {
        showNotification('Failed to save article post.', true);
      }
    } catch (err) {
      showNotification('Error saving article post.', true);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDeleteArticlePost = async (id: number) => {
    if (!confirm('Are you sure you want to delete this article post?')) return;
    try {
      const response = await fetch('/api/admin/content/articles', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (response.ok) {
        showNotification('Article post deleted successfully!');
        fetchData();
      } else {
        showNotification('Failed to delete article post.', true);
      }
    } catch (err) {
      showNotification('Error deleting article post.', true);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading-container">
        <div className="admin-spinner" />
        <p>Loading administration panel...</p>
      </div>
    );
  }

  return (
    <div className="admin-page-container">
      {/* Toast Notification Banners */}
      <AnimatePresence>
        {success && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="admin-success-banner" style={{ position: 'fixed', top: '24px', left: '50%', transform: 'translateX(-50%)', zIndex: 1100 }}>
            {success}
          </motion.div>
        )}
        {error && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="admin-error-banner" style={{ position: 'fixed', top: '24px', left: '50%', transform: 'translateX(-50%)', zIndex: 1100 }}>
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!isLoggedIn ? (
          <motion.div key="login" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="admin-login-wrapper">
            <form onSubmit={handleLogin} className="card admin-login-card">
              <h2 className="admin-title">Admin Access</h2>
              <p className="admin-subtitle">Enter credentials to manage the website content.</p>

              {error && <div className="admin-error-banner" style={{ marginBottom: '16px' }}>{error}</div>}

              <div className="form-group">
                <label className="label" htmlFor="username">Username</label>
                <input type="text" id="username" required className="input" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin" />
              </div>

              <div className="form-group" style={{ marginTop: '16px' }}>
                <label className="label" htmlFor="password">Password</label>
                <input type="password" id="password" required className="input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
              </div>

              <button type="submit" disabled={loginLoading} className="btn" style={{ width: '100%', marginTop: '24px' }}>
                {loginLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          </motion.div>
        ) : mustChangePassword ? (
          <motion.div key="force-change-password" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="admin-login-wrapper">
            <form onSubmit={handleChangePassword} className="card admin-login-card">
              <h2 className="admin-title">Update Password</h2>
              <p className="admin-subtitle">Update your password to a strong one before proceeding.</p>

              {changePasswordError && <div className="admin-error-banner" style={{ marginBottom: '16px' }}>{changePasswordError}</div>}
              {changePasswordSuccess && <div className="admin-success-banner" style={{ marginBottom: '16px' }}>{changePasswordSuccess}</div>}

              <div className="form-group">
                <label className="label" htmlFor="currentPassword">Current Password</label>
                <input type="password" id="currentPassword" required className="input" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="••••••••" />
              </div>

              <div className="form-group" style={{ marginTop: '16px' }}>
                <label className="label" htmlFor="newPassword">New Password</label>
                <input type="password" id="newPassword" required className="input" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" />
              </div>

              <div className="form-group" style={{ marginTop: '16px' }}>
                <label className="label" htmlFor="confirmPassword">Confirm New Password</label>
                <input type="password" id="confirmPassword" required className="input" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" />
              </div>

              <div className="password-checklist" style={{ marginTop: '16px' }}>
                <div className={`checklist-item ${isLengthValid ? 'valid' : ''}`}><span className="bullet">✓</span> At least 8 characters</div>
                <div className={`checklist-item ${hasUpper ? 'valid' : ''}`}><span className="bullet">✓</span> At least 1 uppercase letter</div>
                <div className={`checklist-item ${hasLower ? 'valid' : ''}`}><span className="bullet">✓</span> At least 1 lowercase letter</div>
                <div className={`checklist-item ${hasDigit ? 'valid' : ''}`}><span className="bullet">✓</span> At least 1 number</div>
                <div className={`checklist-item ${hasSpecial ? 'valid' : ''}`}><span className="bullet">✓</span> At least 1 special character</div>
                <div className={`checklist-item ${passwordsMatch ? 'valid' : ''}`}><span className="bullet">✓</span> Passwords match</div>
              </div>

              <button type="submit" disabled={changePasswordLoading || !canSubmitChangePassword} className="btn" style={{ width: '100%', marginTop: '24px' }}>
                {changePasswordLoading ? 'Updating...' : 'Update Password'}
              </button>

              <button type="button" onClick={handleLogout} className="btn btn-secondary" style={{ width: '100%', marginTop: '12px' }}>
                Cancel / Logout
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="admin-dashboard-wrapper">
            {/* Dashboard Header */}
            <header className="admin-header">
              <a 
                href="/" 
                className="brand-group-wrapper" 
                style={{ display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none', color: 'inherit' }}
              >
                <img 
                  src="/logo.png" 
                  alt="Alfazen Logo" 
                  style={{ 
                    width: '46px', 
                    height: '46px', 
                    borderRadius: '50%', 
                    objectFit: 'cover', 
                    objectPosition: 'center',
                    border: '1px solid var(--surface-border)',
                    backgroundColor: '#ffffff'
                  }} 
                />
                <div className="brand-group">
                  <h1 className="admin-dashboard-title">Alfazen Inc.</h1>
                  <span className="brand-slogan" style={{ fontSize: '12px' }}>Stay Zen at First Place</span>
                  <p className="admin-dashboard-subtitle" style={{ marginTop: '4px' }}>Content Management System Dashboard</p>
                </div>
              </a>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <button onClick={() => setIsChangePasswordModalOpen(true)} className="btn btn-secondary">
                  Change Password
                </button>
                <button onClick={handleLogout} className="btn btn-secondary">
                  Logout
                </button>
              </div>
            </header>

            {/* Dashboard Tabs Navigation */}
            <div className="admin-tabs" style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--surface-border)', marginBottom: '24px', paddingBottom: '8px', overflowX: 'auto' }}>
              {(['inquiries', 'hero', 'services', 'products', 'gallery', 'team', 'articles', 'media'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setEditorMode(null);
                    setEditingCard(null);
                  }}
                  className={`footer-btn ${activeTab === tab ? 'active' : ''}`}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    textTransform: 'capitalize',
                    fontWeight: activeTab === tab ? 'bold' : 'normal',
                    backgroundColor: activeTab === tab ? 'var(--surface)' : 'transparent',
                    color: activeTab === tab ? 'var(--primary)' : 'var(--text-muted)',
                    border: activeTab === tab ? '1px solid var(--surface-border)' : '1px solid transparent'
                  }}
                >
                  {tab === 'inquiries' ? `Inbox (${messages.length})` : tab}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="admin-tab-content">
              {/* Tab 1: Inquiries */}
              {activeTab === 'inquiries' && (
                <div>
                  {/* Dashboard Stats */}
                  <div className="admin-stats-grid" style={{ marginBottom: '24px' }}>
                    <div className="card admin-stat-card">
                      <h3>Total Inquiries</h3>
                      <p className="stat-number">{messages.length}</p>
                    </div>
                    <div className="card admin-stat-card">
                      <h3>Latest Inquiry</h3>
                      <p className="stat-number" style={{ fontSize: '18px' }}>
                        {messages.length > 0
                          ? new Date(messages[0].created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                          : 'No messages'}
                      </p>
                    </div>
                  </div>

                  <div className="card admin-table-card">
                    <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>Inbox Submissions</h2>
                    {messages.length === 0 ? (
                      <div className="admin-empty-state"><p>No messages received yet.</p></div>
                    ) : (
                      <div className="table-responsive">
                        <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                          <thead>
                            <tr style={{ borderBottom: '1px solid var(--surface-border)', textAlign: 'left' }}>
                              <th style={{ padding: '12px' }}>Date</th>
                              <th style={{ padding: '12px' }}>Sender</th>
                              <th style={{ padding: '12px' }}>Contact</th>
                              <th style={{ padding: '12px' }}>Message</th>
                              <th style={{ padding: '12px' }}>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {messages.map((msg) => (
                              <tr key={msg.id} style={{ borderBottom: '1px solid var(--surface-border)' }}>
                                <td style={{ padding: '12px', whiteSpace: 'nowrap' }}>
                                  {new Date(msg.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </td>
                                <td style={{ padding: '12px' }}><strong>{msg.name}</strong></td>
                                <td style={{ padding: '12px' }}>
                                  <div>{msg.email}</div>
                                  {msg.phone && <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{msg.phone}</div>}
                                </td>
                                <td style={{ padding: '12px', maxWidth: '400px' }}>{msg.message}</td>
                                <td style={{ padding: '12px' }}>
                                  <button onClick={() => handleDeleteMessage(msg.id)} className="admin-delete-btn" style={{ padding: '6px 12px', border: '1px solid var(--surface-border)', borderRadius: '4px', cursor: 'pointer' }}>
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 2: Hero Section */}
              {activeTab === 'hero' && content && (
                <div className="card" style={{ maxWidth: '800px' }}>
                  <h2 style={{ fontSize: '22px', marginBottom: '16px', color: 'var(--primary)' }}>Edit Hero Section</h2>
                  <form onSubmit={handleSaveHero}>
                    <div className="form-group">
                      <label className="label">Hero Title</label>
                      <input 
                        type="text" 
                        className="input" 
                        value={content.hero.title} 
                        onChange={(e) => setContent({ ...content, hero: { ...content.hero, title: e.target.value } })}
                        required
                      />
                    </div>
                    <div className="form-group" style={{ marginTop: '16px' }}>
                      <label className="label">Hero Context / Paragraph Text</label>
                      <textarea 
                        className="input" 
                        rows={6}
                        value={content.hero.content} 
                        onChange={(e) => setContent({ ...content, hero: { ...content.hero, content: e.target.value } })}
                        required
                      />
                    </div>
                    <div className="form-group" style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <input 
                        type="checkbox" 
                        id="show_contact_us"
                        checked={content.hero.show_contact_us === 1}
                        onChange={(e) => setContent({ ...content, hero: { ...content.hero, show_contact_us: e.target.checked ? 1 : 0 } })}
                        style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                      />
                      <label htmlFor="show_contact_us" className="label" style={{ margin: 0, cursor: 'pointer' }}>
                        Display "Contact Us" CTA Button
                      </label>
                    </div>

                    <div className="form-group" style={{ marginTop: '20px' }}>
                      <label className="label">Background Media Type</label>
                      <div style={{ display: 'flex', gap: '20px', marginTop: '8px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                          <input 
                            type="radio" 
                            name="background_type"
                            value="image"
                            checked={content.hero.background_type === 'image' || !content.hero.background_type}
                            onChange={(e) => setContent({ ...content, hero: { ...content.hero, background_type: 'image' } })}
                          />
                          Static Image
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                          <input 
                            type="radio" 
                            name="background_type"
                            value="video"
                            checked={content.hero.background_type === 'video'}
                            onChange={(e) => setContent({ ...content, hero: { ...content.hero, background_type: 'video' } })}
                          />
                          Short Video
                        </label>
                      </div>
                    </div>

                    <div className="form-group" style={{ marginTop: '16px' }}>
                      <label className="label">Background Media URL</label>
                      <input 
                        type="text" 
                        className="input" 
                        placeholder={content.hero.background_type === 'video' ? "e.g., /images/hero/hero_bg.mp4" : "e.g., /images/hero/hero_bg.jpg"}
                        value={content.hero.background_url || ''} 
                        onChange={(e) => setContent({ ...content, hero: { ...content.hero, background_url: e.target.value } })}
                      />
                      <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                        Leave empty to use defaults, or insert external URLs / local relative paths like <code>/images/hero/...</code>.
                      </small>
                    </div>
                    <button type="submit" disabled={saveLoading} className="btn" style={{ marginTop: '24px' }}>
                      {saveLoading ? 'Saving Settings...' : 'Save Settings'}
                    </button>
                  </form>
                </div>
              )}

              {/* Tab 3: Services */}
              {activeTab === 'services' && content && (
                <div>
                  {/* Edit Section Title */}
                  <div className="card" style={{ marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '20px', marginBottom: '16px', color: 'var(--primary)' }}>Edit Services Section Title</h2>
                    <form onSubmit={handleSaveServicesTitle} style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                      <div className="form-group" style={{ flex: 1 }}>
                        <input 
                          type="text" 
                          className="input" 
                          value={content.servicesSettings.title} 
                          onChange={(e) => setContent({ ...content, servicesSettings: { ...content.servicesSettings, title: e.target.value } })}
                          required
                        />
                      </div>
                      <button type="submit" disabled={saveLoading} className="btn" style={{ height: '48px' }}>
                        Save Title
                      </button>
                    </form>
                  </div>

                  {/* Card CRUD Interface */}
                  {editorMode === null ? (
                    <div className="card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 style={{ fontSize: '20px', margin: 0 }}>Service Offerings Cards</h2>
                        <button 
                          onClick={() => {
                            setEditorMode('add');
                            setEditingCard({ title: '', description: '', image_url: '', image_alt: '', display_order: content.services.length + 1 });
                          }}
                          className="btn"
                        >
                          + Add Service Card
                        </button>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {content.services.map((card: any) => (
                          <div key={card.id} style={{ display: 'flex', gap: '20px', border: '1px solid var(--surface-border)', borderRadius: '8px', padding: '16px', backgroundColor: 'var(--surface)', alignItems: 'center' }}>
                            <img src={card.image_url} alt={card.image_alt} style={{ width: '100px', height: '70px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--surface-border)' }} />
                            <div style={{ flex: 1 }}>
                              <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--primary)' }}>{card.title}</h3>
                              <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: 'var(--text-muted)' }}>{card.description}</p>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button 
                                onClick={() => {
                                  setEditorMode('edit');
                                  setEditingCard(card);
                                }}
                                className="btn btn-secondary"
                                style={{ padding: '8px 16px' }}
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => handleDeleteServiceCard(card.id)}
                                className="btn btn-secondary"
                                style={{ padding: '8px 16px', color: 'var(--accent)', borderColor: 'var(--accent)' }}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* Add/Edit Modal Form */
                    <div className="card" style={{ maxWidth: '700px' }}>
                      <h2 style={{ fontSize: '22px', marginBottom: '16px', color: 'var(--primary)' }}>
                        {editorMode === 'add' ? 'Add Service Card' : 'Edit Service Card'}
                      </h2>
                      <form onSubmit={handleSaveServiceCard}>
                        <div className="form-group">
                          <label className="label">Title</label>
                          <input 
                            type="text" 
                            className="input" 
                            value={editingCard.title} 
                            onChange={(e) => setEditingCard({ ...editingCard, title: e.target.value })}
                            required
                          />
                        </div>
                        <div className="form-group" style={{ marginTop: '16px' }}>
                          <label className="label">Description</label>
                          <textarea 
                            className="input" 
                            rows={4}
                            value={editingCard.description} 
                            onChange={(e) => setEditingCard({ ...editingCard, description: e.target.value })}
                            required
                          />
                        </div>
                        <div className="form-group" style={{ marginTop: '16px' }}>
                          <label className="label">Image URL</label>
                          <input 
                            type="text" 
                            className="input" 
                            value={editingCard.image_url} 
                            onChange={(e) => setEditingCard({ ...editingCard, image_url: e.target.value })}
                            required
                          />
                        </div>
                        <div className="form-group" style={{ marginTop: '16px' }}>
                          <label className="label">Image Alt Description</label>
                          <input 
                            type="text" 
                            className="input" 
                            value={editingCard.image_alt} 
                            onChange={(e) => setEditingCard({ ...editingCard, image_alt: e.target.value })}
                            required
                          />
                        </div>
                        <div className="form-group" style={{ marginTop: '16px' }}>
                          <label className="label">Display Order Index</label>
                          <input 
                            type="number" 
                            className="input" 
                            value={editingCard.display_order} 
                            onChange={(e) => setEditingCard({ ...editingCard, display_order: parseInt(e.target.value) || 0 })}
                            required
                          />
                        </div>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                          <button type="submit" disabled={saveLoading} className="btn">
                            {saveLoading ? 'Saving...' : 'Save Card'}
                          </button>
                          <button type="button" onClick={() => { setEditorMode(null); setEditingCard(null); }} className="btn btn-secondary">
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 4: Gallery */}
              {activeTab === 'gallery' && content && (
                <div>
                  {/* Settings section */}
                  <div className="card" style={{ marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '20px', marginBottom: '16px', color: 'var(--primary)' }}>Gallery Settings</h2>
                    <form onSubmit={handleSaveGallerySettings} style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                      <div className="form-group" style={{ minWidth: '200px', flex: 1 }}>
                        <label className="label">Sliding Effect</label>
                        <select 
                          className="input" 
                          value={content.gallerySettings.sliding_effect}
                          onChange={(e) => setContent({ ...content, gallerySettings: { ...content.gallerySettings, sliding_effect: e.target.value } })}
                        >
                          <option value="slide">Slide (Horizontal)</option>
                          <option value="fade">Fade (Dissolve)</option>
                        </select>
                      </div>
                      <div className="form-group" style={{ minWidth: '200px', flex: 1 }}>
                        <label className="label">Autoplay Speed (ms)</label>
                        <input 
                          type="number" 
                          className="input" 
                          value={content.gallerySettings.autoplay_speed}
                          onChange={(e) => setContent({ ...content, gallerySettings: { ...content.gallerySettings, autoplay_speed: parseInt(e.target.value) || 0 } })}
                        />
                      </div>
                      <button type="submit" disabled={saveLoading} className="btn" style={{ height: '48px' }}>
                        Save Settings
                      </button>
                    </form>
                  </div>

                  {/* Slides list */}
                  {editorMode === null ? (
                    <div className="card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 style={{ fontSize: '20px', margin: 0 }}>Gallery Slides</h2>
                        <button 
                          onClick={() => {
                            setEditorMode('add');
                            setEditingCard({ image_url: '', image_alt: '', display_order: content.gallery.length + 1 });
                          }}
                          className="btn"
                        >
                          + Add Slide Image
                        </button>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                        {content.gallery.map((item: any) => (
                          <div key={item.id} style={{ border: '1px solid var(--surface-border)', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'var(--surface)', display: 'flex', flexDirection: 'column' }}>
                            <img src={item.image_url} alt={item.image_alt} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                            <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)', flex: 1 }}>{item.image_alt}</p>
                              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                                <button 
                                  onClick={() => {
                                    setEditorMode('edit');
                                    setEditingCard(item);
                                  }}
                                  className="btn btn-secondary"
                                  style={{ padding: '6px 12px', flex: 1, fontSize: '13px' }}
                                >
                                  Edit
                                </button>
                                <button 
                                  onClick={() => handleDeleteGalleryItem(item.id)}
                                  className="btn btn-secondary"
                                  style={{ padding: '6px 12px', flex: 1, fontSize: '13px', color: 'var(--accent)', borderColor: 'var(--accent)' }}
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* Slide modal form */
                    <div className="card" style={{ maxWidth: '600px' }}>
                      <h2 style={{ fontSize: '22px', marginBottom: '16px', color: 'var(--primary)' }}>
                        {editorMode === 'add' ? 'Add Slide' : 'Edit Slide'}
                      </h2>
                      <form onSubmit={handleSaveGalleryItem}>
                        <div className="form-group">
                          <label className="label">Image URL</label>
                          <input 
                            type="text" 
                            className="input" 
                            value={editingCard.image_url} 
                            onChange={(e) => setEditingCard({ ...editingCard, image_url: e.target.value })}
                            required
                          />
                        </div>
                        <div className="form-group" style={{ marginTop: '16px' }}>
                          <label className="label">Caption / Description (Alt text)</label>
                          <input 
                            type="text" 
                            className="input" 
                            value={editingCard.image_alt} 
                            onChange={(e) => setEditingCard({ ...editingCard, image_alt: e.target.value })}
                            required
                          />
                        </div>
                        <div className="form-group" style={{ marginTop: '16px' }}>
                          <label className="label">Display Order Index</label>
                          <input 
                            type="number" 
                            className="input" 
                            value={editingCard.display_order} 
                            onChange={(e) => setEditingCard({ ...editingCard, display_order: parseInt(e.target.value) || 0 })}
                            required
                          />
                        </div>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                          <button type="submit" disabled={saveLoading} className="btn">
                            {saveLoading ? 'Saving...' : 'Save Slide'}
                          </button>
                          <button type="button" onClick={() => { setEditorMode(null); setEditingCard(null); }} className="btn btn-secondary">
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 5: Team */}
              {activeTab === 'team' && content && (
                <div>
                  {editorMode === null ? (
                    <div className="card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 style={{ fontSize: '20px', margin: 0 }}>Team Profiles</h2>
                        <button 
                          onClick={() => {
                            setEditorMode('add');
                            setEditingCard({ 
                              name: '', 
                              role: '', 
                              bio: '', 
                              image_url: '', 
                              display_order: content.team.length + 1,
                              image_zoom: 1.0,
                              image_x: 0,
                              image_y: 0,
                              image_blur: 0
                            });
                          }}
                          className="btn"
                        >
                          + Add Team Member
                        </button>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {content.team.map((member: any) => (
                          <div key={member.id} style={{ display: 'flex', gap: '20px', border: '1px solid var(--surface-border)', borderRadius: '8px', padding: '16px', backgroundColor: 'var(--surface)', alignItems: 'center' }}>
                            <img src={member.image_url} alt={member.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '50%', border: '2px solid var(--primary)' }} />
                            <div style={{ flex: 1 }}>
                              <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--primary)' }}>{member.name}</h3>
                              <h4 style={{ margin: '2px 0 6px 0', fontSize: '14px', color: 'var(--accent)' }}>{member.role}</h4>
                              <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)' }}>{member.bio}</p>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button 
                                onClick={() => {
                                  setEditorMode('edit');
                                  setEditingCard(member);
                                }}
                                className="btn btn-secondary"
                                style={{ padding: '8px 16px' }}
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => handleDeleteTeamCard(member.id)}
                                className="btn btn-secondary"
                                style={{ padding: '8px 16px', color: 'var(--accent)', borderColor: 'var(--accent)' }}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* Team Modal Form */
                    <div className="card" style={{ maxWidth: '700px' }}>
                      <h2 style={{ fontSize: '22px', marginBottom: '16px', color: 'var(--primary)' }}>
                        {editorMode === 'add' ? 'Add Team Member' : 'Edit Team Member'}
                      </h2>
                      <form onSubmit={handleSaveTeamCard}>
                        <div className="form-group">
                          <label className="label">Name</label>
                          <input 
                            type="text" 
                            className="input" 
                            value={editingCard.name} 
                            onChange={(e) => setEditingCard({ ...editingCard, name: e.target.value })}
                            required
                          />
                        </div>
                        <div className="form-group" style={{ marginTop: '16px' }}>
                          <label className="label">Role</label>
                          <input 
                            type="text" 
                            className="input" 
                            value={editingCard.role} 
                            onChange={(e) => setEditingCard({ ...editingCard, role: e.target.value })}
                            required
                          />
                        </div>
                        <div className="form-group" style={{ marginTop: '16px' }}>
                          <label className="label">Biography Text</label>
                          <textarea 
                            className="input" 
                            rows={4}
                            value={editingCard.bio} 
                            onChange={(e) => setEditingCard({ ...editingCard, bio: e.target.value })}
                            required
                          />
                        </div>
                        <div className="form-group" style={{ marginTop: '16px' }}>
                          <label className="label">Image URL</label>
                          <input 
                            type="text" 
                            className="input" 
                            value={editingCard.image_url} 
                            onChange={(e) => setEditingCard({ ...editingCard, image_url: e.target.value })}
                            required
                          />
                        </div>

                        {/* Team Image Position/Zoom/Blur Controls & Live circular preview */}
                        <div style={{ border: '1px solid var(--surface-border)', borderRadius: '8px', padding: '16px', marginTop: '20px', backgroundColor: 'var(--surface)' }}>
                          <h3 style={{ fontSize: '16px', margin: '0 0 16px 0', color: 'var(--primary)' }}>Advanced Image Alignment</h3>
                          
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px', gap: '8px' }}>
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Circle Fit Preview</span>
                            <div 
                              style={{ 
                                width: '150px', 
                                height: '150px', 
                                borderRadius: '50%', 
                                overflow: 'hidden', 
                                border: '3px solid var(--primary)', 
                                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                                backgroundColor: 'var(--background)'
                              }}
                            >
                              {editingCard.image_url ? (
                                <img 
                                  src={editingCard.image_url} 
                                  alt="Live crop preview" 
                                  style={{ 
                                    width: '100%', 
                                    height: '100%', 
                                    objectFit: 'cover',
                                    transform: `scale(${editingCard.image_zoom || 1.0}) translate(${editingCard.image_x || 0}px, ${editingCard.image_y || 0}px)`,
                                    filter: `blur(${editingCard.image_blur || 0}px)`,
                                    transformOrigin: 'center center',
                                    transition: 'transform 0.1s ease, filter 0.1s ease'
                                  }} 
                                />
                              ) : (
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
                                  No Image URL
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="form-group" style={{ marginTop: '12px' }}>
                            <label className="label" style={{ fontSize: '13px' }}>Zoom Scale ({editingCard.image_zoom || 1.0}x)</label>
                            <input 
                              type="range" 
                              min="1.0" 
                              max="3.0" 
                              step="0.05"
                              value={editingCard.image_zoom || 1.0}
                              onChange={(e) => setEditingCard({ ...editingCard, image_zoom: parseFloat(e.target.value) })}
                              style={{ width: '100%', cursor: 'pointer' }}
                            />
                          </div>

                          <div className="form-group" style={{ marginTop: '12px' }}>
                            <label className="label" style={{ fontSize: '13px' }}>Horizontal Pan ({editingCard.image_x || 0}px)</label>
                            <input 
                              type="range" 
                              min="-100" 
                              max="100" 
                              step="1"
                              value={editingCard.image_x || 0}
                              onChange={(e) => setEditingCard({ ...editingCard, image_x: parseInt(e.target.value) || 0 })}
                              style={{ width: '100%', cursor: 'pointer' }}
                            />
                          </div>

                          <div className="form-group" style={{ marginTop: '12px' }}>
                            <label className="label" style={{ fontSize: '13px' }}>Vertical Pan ({editingCard.image_y || 0}px)</label>
                            <input 
                              type="range" 
                              min="-100" 
                              max="100" 
                              step="1"
                              value={editingCard.image_y || 0}
                              onChange={(e) => setEditingCard({ ...editingCard, image_y: parseInt(e.target.value) || 0 })}
                              style={{ width: '100%', cursor: 'pointer' }}
                            />
                          </div>

                          <div className="form-group" style={{ marginTop: '12px' }}>
                            <label className="label" style={{ fontSize: '13px' }}>Blur Strength ({editingCard.image_blur || 0}px)</label>
                            <input 
                              type="range" 
                              min="0" 
                              max="20" 
                              step="0.5"
                              value={editingCard.image_blur || 0}
                              onChange={(e) => setEditingCard({ ...editingCard, image_blur: parseFloat(e.target.value) || 0 })}
                              style={{ width: '100%', cursor: 'pointer' }}
                            />
                          </div>
                        </div>
                        <div className="form-group" style={{ marginTop: '16px' }}>
                          <label className="label">Display Order Index</label>
                          <input 
                            type="number" 
                            className="input" 
                            value={editingCard.display_order} 
                            onChange={(e) => setEditingCard({ ...editingCard, display_order: parseInt(e.target.value) || 0 })}
                            required
                          />
                        </div>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                          <button type="submit" disabled={saveLoading} className="btn">
                            {saveLoading ? 'Saving...' : 'Save Member'}
                          </button>
                          <button type="button" onClick={() => { setEditorMode(null); setEditingCard(null); }} className="btn btn-secondary">
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 6: Articles */}
              {activeTab === 'articles' && content && (
                <div>
                  {editorMode === null ? (
                    <div className="card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 style={{ fontSize: '20px', margin: 0 }}>Article Posts</h2>
                        <button 
                          onClick={() => {
                            setEditorMode('add');
                            setEditingCard({
                              title: '',
                              paragraphs: [{ heading: '', text: '' }],
                              image_url: '',
                              image_alt: '',
                              author: '',
                              published_date: new Date().toISOString().split('T')[0],
                              display_order: content.articles.length + 1
                            });
                          }}
                          className="btn"
                        >
                          + Add Article Post
                        </button>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {content.articles.map((post: any) => (
                          <div key={post.id} style={{ display: 'flex', gap: '20px', border: '1px solid var(--surface-border)', borderRadius: '8px', padding: '16px', backgroundColor: 'var(--surface)', alignItems: 'center' }}>
                            <img src={post.image_url} alt={post.image_alt} style={{ width: '110px', height: '80px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--surface-border)' }} />
                            <div style={{ flex: 1 }}>
                              <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--primary)' }}>{post.title}</h3>
                              <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                                By {post.author || 'Anonymous'} | {post.published_date}
                              </p>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button 
                                onClick={() => {
                                  setEditorMode('edit');
                                  setEditingCard(post);
                                }}
                                className="btn btn-secondary"
                                style={{ padding: '8px 16px' }}
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => handleDeleteArticlePost(post.id)}
                                className="btn btn-secondary"
                                style={{ padding: '8px 16px', color: 'var(--accent)', borderColor: 'var(--accent)' }}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* Article Modal Form */
                    <div className="card" style={{ maxWidth: '800px' }}>
                      <h2 style={{ fontSize: '22px', marginBottom: '16px', color: 'var(--primary)' }}>
                        {editorMode === 'add' ? 'Add Article Post' : 'Edit Article Post'}
                      </h2>
                      <form onSubmit={handleSaveArticlePost}>
                        <div className="form-group">
                          <label className="label">Title</label>
                          <input 
                            type="text" 
                            className="input" 
                            value={editingCard.title} 
                            onChange={(e) => setEditingCard({ ...editingCard, title: e.target.value })}
                            required
                          />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
                          <div className="form-group">
                            <label className="label">Author Name</label>
                            <input 
                              type="text" 
                              className="input" 
                              value={editingCard.author} 
                              onChange={(e) => setEditingCard({ ...editingCard, author: e.target.value })}
                            />
                          </div>
                          <div className="form-group">
                            <label className="label">Published Date (YYYY-MM-DD)</label>
                            <input 
                              type="text" 
                              className="input" 
                              value={editingCard.published_date} 
                              onChange={(e) => setEditingCard({ ...editingCard, published_date: e.target.value })}
                            />
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '16px', marginTop: '16px' }}>
                          <div className="form-group">
                            <label className="label">Image URL</label>
                            <input 
                              type="text" 
                              className="input" 
                              value={editingCard.image_url} 
                              onChange={(e) => setEditingCard({ ...editingCard, image_url: e.target.value })}
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label className="label">Image Alt text</label>
                            <input 
                              type="text" 
                              className="input" 
                              value={editingCard.image_alt} 
                              onChange={(e) => setEditingCard({ ...editingCard, image_alt: e.target.value })}
                              required
                            />
                          </div>
                        </div>

                        {/* Paragraphs Manager */}
                        <div style={{ marginTop: '24px', borderTop: '1px solid var(--surface-border)', paddingTop: '20px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <h3 style={{ margin: 0, fontSize: '18px' }}>Post Content Sections</h3>
                            <button
                              type="button"
                              onClick={() => {
                                const paragraphs = [...(editingCard.paragraphs || [])];
                                paragraphs.push({ heading: '', text: '' });
                                setEditingCard({ ...editingCard, paragraphs });
                              }}
                              className="btn btn-secondary"
                              style={{ padding: '6px 12px', fontSize: '13px' }}
                            >
                              + Add Paragraph Block
                            </button>
                          </div>

                          {(editingCard.paragraphs || []).map((para: Paragraph, idx: number) => (
                            <div key={idx} style={{ border: '1px solid var(--surface-border)', borderRadius: '6px', padding: '16px', marginBottom: '16px', backgroundColor: 'var(--surface)' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                <span style={{ fontWeight: 'bold', fontSize: '14px', color: 'var(--primary)' }}>Block #{idx + 1}</span>
                                {(editingCard.paragraphs || []).length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const paragraphs = editingCard.paragraphs.filter((_: any, i: number) => i !== idx);
                                      setEditingCard({ ...editingCard, paragraphs });
                                    }}
                                    style={{ color: 'var(--accent)', border: 'none', background: 'none', cursor: 'pointer', fontSize: '13px' }}
                                  >
                                    Remove Block
                                  </button>
                                )}
                              </div>
                              <div className="form-group">
                                <label className="label" style={{ fontSize: '13px' }}>Block Heading (Optional)</label>
                                <input
                                  type="text"
                                  className="input"
                                  value={para.heading}
                                  onChange={(e) => {
                                    const paragraphs = [...editingCard.paragraphs];
                                    paragraphs[idx].heading = e.target.value;
                                    setEditingCard({ ...editingCard, paragraphs });
                                  }}
                                  placeholder="e.g. Expertise Rooted in Experience"
                                />
                              </div>
                              <div className="form-group" style={{ marginTop: '12px' }}>
                                <label className="label" style={{ fontSize: '13px' }}>Paragraph Content</label>
                                <textarea
                                  className="input"
                                  rows={4}
                                  value={para.text}
                                  onChange={(e) => {
                                    const paragraphs = [...editingCard.paragraphs];
                                    paragraphs[idx].text = e.target.value;
                                    setEditingCard({ ...editingCard, paragraphs });
                                  }}
                                  placeholder="Paragraph text..."
                                  required
                                />
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="form-group" style={{ marginTop: '16px' }}>
                          <label className="label">Display Order Index</label>
                          <input 
                            type="number" 
                            className="input" 
                            value={editingCard.display_order} 
                            onChange={(e) => setEditingCard({ ...editingCard, display_order: parseInt(e.target.value) || 0 })}
                            required
                          />
                        </div>

                        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                          <button type="submit" disabled={saveLoading} className="btn">
                            {saveLoading ? 'Saving...' : 'Save Article'}
                          </button>
                          <button type="button" onClick={() => { setEditorMode(null); setEditingCard(null); }} className="btn btn-secondary">
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              )}
{activeTab === 'products' && (
  <ProductsTab showNotification={showNotification} />
)}
{activeTab === 'media' && (
  <MediaTab onSyncImages={handleSyncImages} syncLoading={saveLoading} />
)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Change Password Modal (Admin logged in) */}
      <AnimatePresence>
        {isChangePasswordModalOpen && (
          <motion.div
            key="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="admin-modal-overlay"
            onClick={() => {
              setIsChangePasswordModalOpen(false);
              setChangePasswordError('');
              setChangePasswordSuccess('');
            }}
          >
            <motion.div
              key="modal-content"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="card admin-login-card admin-modal-card"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="admin-title">Change Password</h2>
              <p className="admin-subtitle">Update your administrative credentials.</p>

              {changePasswordError && <div className="admin-error-banner" style={{ marginBottom: '16px' }}>{changePasswordError}</div>}
              {changePasswordSuccess && <div className="admin-success-banner" style={{ marginBottom: '16px' }}>{changePasswordSuccess}</div>}

              <form onSubmit={handleChangePassword}>
                <div className="form-group">
                  <label className="label" htmlFor="modalCurrentPassword">Current Password</label>
                  <input type="password" id="modalCurrentPassword" required className="input" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="••••••••" />
                </div>

                <div className="form-group" style={{ marginTop: '16px' }}>
                  <label className="label" htmlFor="modalNewPassword">New Password</label>
                  <input type="password" id="modalNewPassword" required className="input" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" />
                </div>

                <div className="form-group" style={{ marginTop: '16px' }}>
                  <label className="label" htmlFor="modalConfirmPassword">Confirm New Password</label>
                  <input type="password" id="modalConfirmPassword" required className="input" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" />
                </div>

                <div className="password-checklist" style={{ marginTop: '16px' }}>
                  <div className={`checklist-item ${isLengthValid ? 'valid' : ''}`}><span className="bullet">✓</span> At least 8 characters</div>
                  <div className={`checklist-item ${hasUpper ? 'valid' : ''}`}><span className="bullet">✓</span> At least 1 uppercase letter</div>
                  <div className={`checklist-item ${hasLower ? 'valid' : ''}`}><span className="bullet">✓</span> At least 1 lowercase letter</div>
                  <div className={`checklist-item ${hasDigit ? 'valid' : ''}`}><span className="bullet">✓</span> At least 1 number</div>
                  <div className={`checklist-item ${hasSpecial ? 'valid' : ''}`}><span className="bullet">✓</span> At least 1 special character</div>
                  <div className={`checklist-item ${passwordsMatch ? 'valid' : ''}`}><span className="bullet">✓</span> Passwords match</div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                  <button type="button" onClick={() => { setIsChangePasswordModalOpen(false); setChangePasswordError(''); setChangePasswordSuccess(''); }} className="btn btn-secondary" style={{ flex: 1 }}>
                    Cancel
                  </button>
                  <button type="submit" disabled={changePasswordLoading || !canSubmitChangePassword} className="btn" style={{ flex: 1 }}>
                    {changePasswordLoading ? 'Saving...' : 'Save Password'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
