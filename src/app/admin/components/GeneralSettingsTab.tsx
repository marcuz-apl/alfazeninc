'use client';

import React, { useState, useEffect } from 'react';

export default function GeneralSettingsTab() {
  const [settings, setSettings] = useState({
    site_name: 'Alfazen Inc.',
    site_slogan: 'Stay Zen at First Place',
    site_logo_url: '/images/brand/logo.png',
    footer_email: 'info@alfazen.org',
    footer_website: 'https://alfazen.org',
    footer_twitter: 'https://x.com',
    footer_linkedin: 'https://linkedin.com',
    footer_disclaimer_title: 'Disclaimer & Professional Statement',
    footer_disclaimer_text: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings/general');
      const data = await res.json();
      if (data.settings) {
        setSettings(data.settings);
      }
    } catch (e) {
      console.error(e);
      setError('Failed to load general settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/admin/settings/general', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        setSuccess('General settings saved successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to save general settings');
      }
    } catch (e: any) {
      console.error(e);
      setError('An error occurred: ' + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div>Loading general settings...</div>;

  return (
    <div className="card" style={{ maxWidth: '800px' }}>
      <h2 className="admin-title">General Brand Settings</h2>
      <p className="admin-subtitle" style={{ marginBottom: '24px' }}>
        Configure the core branding that appears in the navigation header, footer, and browser tabs.
      </p>

      {error && <div className="admin-error-banner" style={{ marginBottom: '16px' }}>{error}</div>}
      {success && <div className="admin-success-banner" style={{ marginBottom: '16px' }}>{success}</div>}

      <form onSubmit={handleSave}>
        
        {/* === BRANDING SECTION === */}
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: 'var(--text)', borderBottom: '1px solid var(--surface-border)', paddingBottom: '8px' }}>
          Header & Brand Identity
        </h3>

        <div className="form-group">
          <label className="label" htmlFor="site_name">Website Name</label>
          <input 
            type="text" 
            id="site_name" 
            required 
            className="input" 
            value={settings.site_name} 
            onChange={(e) => setSettings(({...settings, site_name: e.target.value}))} 
            placeholder="e.g. Alfazen Inc." 
          />
        </div>

        <div className="form-group" style={{ marginTop: '16px' }}>
          <label className="label" htmlFor="site_slogan">Website Slogan</label>
          <input 
            type="text" 
            id="site_slogan" 
            required 
            className="input" 
            value={settings.site_slogan} 
            onChange={(e) => setSettings(({...settings, site_slogan: e.target.value}))} 
            placeholder="e.g. Stay Zen at First Place" 
          />
        </div>

        <div className="form-group" style={{ marginTop: '16px' }}>
          <label className="label" htmlFor="site_logo_url">Website Logo URL</label>
          <input 
            type="text" 
            id="site_logo_url" 
            required 
            className="input" 
            value={settings.site_logo_url} 
            onChange={(e) => setSettings(({...settings, site_logo_url: e.target.value}))} 
            placeholder="e.g. /images/brand/logo.png" 
          />
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Upload your logo via the Media tab first, then paste the URL here. Recommended size: 40x40px or larger square.
          </p>
        </div>


        {/* === SOCIAL LINKS SECTION === */}
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '32px', marginBottom: '16px', color: 'var(--text)', borderBottom: '1px solid var(--surface-border)', paddingBottom: '8px' }}>
          Footer Social Links
        </h3>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px' }}>
          Leave a field blank to hide its icon from the footer.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="form-group">
            <label className="label" htmlFor="footer_email">Email Address</label>
            <input 
              type="text" 
              id="footer_email" 
              className="input" 
              value={settings.footer_email} 
              onChange={(e) => setSettings(({...settings, footer_email: e.target.value}))} 
              placeholder="e.g. info@alfazen.org" 
            />
          </div>

          <div className="form-group">
            <label className="label" htmlFor="footer_website">Website URL</label>
            <input 
              type="url" 
              id="footer_website" 
              className="input" 
              value={settings.footer_website} 
              onChange={(e) => setSettings(({...settings, footer_website: e.target.value}))} 
              placeholder="e.g. https://alfazen.org" 
            />
          </div>

          <div className="form-group">
            <label className="label" htmlFor="footer_twitter">X (Twitter) URL</label>
            <input 
              type="url" 
              id="footer_twitter" 
              className="input" 
              value={settings.footer_twitter} 
              onChange={(e) => setSettings(({...settings, footer_twitter: e.target.value}))} 
              placeholder="e.g. https://x.com/alfazen" 
            />
          </div>

          <div className="form-group">
            <label className="label" htmlFor="footer_linkedin">LinkedIn URL</label>
            <input 
              type="url" 
              id="footer_linkedin" 
              className="input" 
              value={settings.footer_linkedin} 
              onChange={(e) => setSettings(({...settings, footer_linkedin: e.target.value}))} 
              placeholder="e.g. https://linkedin.com/company/alfazen" 
            />
          </div>
        </div>

        {/* === LEGAL DISCLAIMER SECTION === */}
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '32px', marginBottom: '16px', color: 'var(--text)', borderBottom: '1px solid var(--surface-border)', paddingBottom: '8px' }}>
          Footer Legal Disclaimer
        </h3>

        <div className="form-group">
          <label className="label" htmlFor="footer_disclaimer_title">Disclaimer Title</label>
          <input 
            type="text" 
            id="footer_disclaimer_title" 
            required 
            className="input" 
            value={settings.footer_disclaimer_title} 
            onChange={(e) => setSettings(({...settings, footer_disclaimer_title: e.target.value}))} 
            placeholder="e.g. Disclaimer & Professional Statement" 
          />
        </div>

        <div className="form-group" style={{ marginTop: '16px' }}>
          <label className="label" htmlFor="footer_disclaimer_text">Disclaimer Text</label>
          <textarea 
            id="footer_disclaimer_text" 
            required 
            className="input" 
            value={settings.footer_disclaimer_text} 
            onChange={(e) => setSettings(({...settings, footer_disclaimer_text: e.target.value}))} 
            rows={8}
            placeholder="Enter disclaimer text here. Use double line breaks to separate paragraphs." 
            style={{ resize: 'vertical' }}
          />
        </div>

        <button type="submit" disabled={isSaving} className="btn" style={{ marginTop: '32px', width: '100%' }}>
          {isSaving ? 'Saving...' : 'Save General Settings'}
        </button>
      </form>
    </div>
  );
}
