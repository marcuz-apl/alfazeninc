'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
}

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mustChangePassword, setMustChangePassword] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Password change form states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);
  const [changePasswordError, setChangePasswordError] = useState('');
  const [changePasswordSuccess, setChangePasswordSuccess] = useState('');

  // Password Strength Criteria
  const isLengthValid = newPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasDigit = /\d/.test(newPassword);
  const hasSpecial = /[@$!%*?&#]/.test(newPassword);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;
  const isNewPasswordStrong = isLengthValid && hasUpper && hasLower && hasDigit && hasSpecial;
  const canSubmitChangePassword = isNewPasswordStrong && passwordsMatch && currentPassword.length > 0;

  // Fetch messages if session cookie exists
  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/admin/messages');
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
        setIsLoggedIn(true);
        setMustChangePassword(false);
      } else if (response.status === 403) {
        setIsLoggedIn(true);
        setMustChangePassword(true);
      } else if (response.status === 401) {
        setIsLoggedIn(false);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchMessages();
  }, []);

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
          fetchMessages();
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
        
        // Reset states
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');

        // Wait a second to show success, then proceed
        setTimeout(() => {
          setMustChangePassword(false);
          setIsChangePasswordModalOpen(false);
          setChangePasswordSuccess('');
          fetchMessages();
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
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleDelete = async (id: number) => {
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
      console.error('Delete error:', err);
    }
  };

  if (!mounted || loading) {
    return (
      <div className="admin-loading-container">
        <div className="admin-spinner" />
        <p>Loading admin panel...</p>
      </div>
    );
  }

  return (
    <div className="admin-page-container">
      <AnimatePresence mode="wait">
        {!isLoggedIn ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="admin-login-wrapper"
          >
            <form onSubmit={handleLogin} className="card admin-login-card">
              <h2 className="admin-title">Admin Access</h2>
              <p className="admin-subtitle">Enter credentials to manage guest inquiries.</p>

              {error && <div className="admin-error-banner">{error}</div>}

              <div className="form-group">
                <label className="label" htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  required
                  className="input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                />
              </div>

              <div className="form-group" style={{ marginTop: '16px' }}>
                <label className="label" htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  required
                  className="input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="btn"
                style={{ width: '100%', marginTop: '24px' }}
              >
                {loginLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          </motion.div>
        ) : mustChangePassword ? (
          <motion.div
            key="force-change-password"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="admin-login-wrapper"
          >
            <form onSubmit={handleChangePassword} className="card admin-login-card">
              <h2 className="admin-title">Update Password</h2>
              <p className="admin-subtitle">For security reasons, please update your default password to a strong one before proceeding.</p>

              {changePasswordError && <div className="admin-error-banner">{changePasswordError}</div>}
              {changePasswordSuccess && <div className="admin-success-banner">{changePasswordSuccess}</div>}

              <div className="form-group">
                <label className="label" htmlFor="currentPassword">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  required
                  className="input"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              <div className="form-group" style={{ marginTop: '16px' }}>
                <label className="label" htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  required
                  className="input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              <div className="form-group" style={{ marginTop: '16px' }}>
                <label className="label" htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  required
                  className="input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              {/* Password strength checklist */}
              <div className="password-checklist">
                <div className={`checklist-item ${isLengthValid ? 'valid' : ''}`}>
                  <span className="bullet">{isLengthValid ? '✓' : '•'}</span> At least 8 characters
                </div>
                <div className={`checklist-item ${hasUpper ? 'valid' : ''}`}>
                  <span className="bullet">{hasUpper ? '✓' : '•'}</span> At least 1 uppercase letter (A-Z)
                </div>
                <div className={`checklist-item ${hasLower ? 'valid' : ''}`}>
                  <span className="bullet">{hasLower ? '✓' : '•'}</span> At least 1 lowercase letter (a-z)
                </div>
                <div className={`checklist-item ${hasDigit ? 'valid' : ''}`}>
                  <span className="bullet">{hasDigit ? '✓' : '•'}</span> At least 1 number (0-9)
                </div>
                <div className={`checklist-item ${hasSpecial ? 'valid' : ''}`}>
                  <span className="bullet">{hasSpecial ? '✓' : '•'}</span> At least 1 special character (@$!%*?&#)
                </div>
                <div className={`checklist-item ${passwordsMatch ? 'valid' : ''}`}>
                  <span className="bullet">{passwordsMatch ? '✓' : '•'}</span> Passwords match
                </div>
              </div>

              <button
                type="submit"
                disabled={changePasswordLoading || !canSubmitChangePassword}
                className="btn"
                style={{ width: '100%', marginTop: '24px' }}
              >
                {changePasswordLoading ? 'Updating...' : 'Update Password'}
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="btn btn-secondary"
                style={{ width: '100%', marginTop: '12px' }}
              >
                Cancel / Logout
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="admin-dashboard-wrapper"
          >
            {/* Dashboard Header */}
            <header className="admin-header">
              <div className="brand-group-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
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
                  <p className="admin-dashboard-subtitle" style={{ marginTop: '4px' }}>Guest Message Management Console</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => setIsChangePasswordModalOpen(true)} className="btn btn-secondary">
                  Change Password
                </button>
                <button onClick={handleLogout} className="btn btn-secondary">
                  Logout
                </button>
              </div>
            </header>

            {/* Dashboard Stats */}
            <div className="admin-stats-grid">
              <div className="card admin-stat-card">
                <h3>Total Inquiries</h3>
                <p className="stat-number">{messages.length}</p>
              </div>
              <div className="card admin-stat-card">
                <h3>Latest Activity</h3>
                <p className="stat-number">
                  {messages.length > 0 
                    ? new Date(messages[0].created_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : 'No messages'}
                </p>
              </div>
            </div>

            {/* Message List Table */}
            <div className="card admin-table-card">
              <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>Inbox Submissions</h2>
              
              {messages.length === 0 ? (
                <div className="admin-empty-state">
                  <p>No messages received yet.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Sender</th>
                        <th>Contact</th>
                        <th>Message</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence>
                        {messages.map((msg) => (
                          <motion.tr
                            key={msg.id}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                          >
                            <td className="td-date">
                              {new Date(msg.created_at).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </td>
                            <td className="td-name"><strong>{msg.name}</strong></td>
                            <td className="td-contact">
                              <div>{msg.email}</div>
                              {msg.phone && <div className="td-phone">{msg.phone}</div>}
                            </td>
                            <td className="td-message">{msg.message}</td>
                            <td>
                              <button
                                onClick={() => handleDelete(msg.id)}
                                className="admin-delete-btn"
                                aria-label="Delete inquiries"
                              >
                                Delete
                              </button>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Change Password Modal */}
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

              {changePasswordError && <div className="admin-error-banner">{changePasswordError}</div>}
              {changePasswordSuccess && <div className="admin-success-banner">{changePasswordSuccess}</div>}

              <form onSubmit={handleChangePassword}>
                <div className="form-group">
                  <label className="label" htmlFor="modalCurrentPassword">Current Password</label>
                  <input
                    type="password"
                    id="modalCurrentPassword"
                    required
                    className="input"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>

                <div className="form-group" style={{ marginTop: '16px' }}>
                  <label className="label" htmlFor="modalNewPassword">New Password</label>
                  <input
                    type="password"
                    id="modalNewPassword"
                    required
                    className="input"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>

                <div className="form-group" style={{ marginTop: '16px' }}>
                  <label className="label" htmlFor="modalConfirmPassword">Confirm New Password</label>
                  <input
                    type="password"
                    id="modalConfirmPassword"
                    required
                    className="input"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>

                {/* Password strength checklist */}
                <div className="password-checklist">
                  <div className={`checklist-item ${isLengthValid ? 'valid' : ''}`}>
                    <span className="bullet">{isLengthValid ? '✓' : '•'}</span> At least 8 characters
                  </div>
                  <div className={`checklist-item ${hasUpper ? 'valid' : ''}`}>
                    <span className="bullet">{hasUpper ? '✓' : '•'}</span> At least 1 uppercase letter (A-Z)
                  </div>
                  <div className={`checklist-item ${hasLower ? 'valid' : ''}`}>
                    <span className="bullet">{hasLower ? '✓' : '•'}</span> At least 1 lowercase letter (a-z)
                  </div>
                  <div className={`checklist-item ${hasDigit ? 'valid' : ''}`}>
                    <span className="bullet">{hasDigit ? '✓' : '•'}</span> At least 1 number (0-9)
                  </div>
                  <div className={`checklist-item ${hasSpecial ? 'valid' : ''}`}>
                    <span className="bullet">{hasSpecial ? '✓' : '•'}</span> At least 1 special character (@$!%*?&#)
                  </div>
                  <div className={`checklist-item ${passwordsMatch ? 'valid' : ''}`}>
                    <span className="bullet">{passwordsMatch ? '✓' : '•'}</span> Passwords match
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setIsChangePasswordModalOpen(false);
                      setChangePasswordError('');
                      setChangePasswordSuccess('');
                    }}
                    className="btn btn-secondary"
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={changePasswordLoading || !canSubmitChangePassword}
                    className="btn"
                    style={{ flex: 1 }}
                  >
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
