'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Template {
  id: string;
  name: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  siteName: string;
  siteSlogan: string;
  isActive: boolean;
}

export default function TemplatesTab() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Modal State
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [confirmText, setConfirmText] = useState('');
  const [applying, setApplying] = useState(false);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/templates');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch templates');
      setTemplates(data.templates || []);
      setError('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleApplyTemplate = async () => {
    if (!selectedTemplate) return;
    if (confirmText.toUpperCase() !== 'CONFIRM') {
      setError('Please type CONFIRM exactly to proceed.');
      return;
    }

    setApplying(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/admin/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId: selectedTemplate.id })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to apply template');
      
      setSuccess(`Successfully applied the "${selectedTemplate.name}" template!`);
      setSelectedTemplate(null);
      setConfirmText('');
      
      // Refresh list to update active state
      await fetchTemplates();
      
      // Clear success notification after 5 seconds
      setTimeout(() => setSuccess(''), 5000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setApplying(false);
    }
  };

  if (loading && templates.length === 0) {
    return (
      <div className="admin-loading-container" style={{ minHeight: '30vh' }}>
        <div className="admin-spinner"></div>
        <p>Loading Website Templates...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px' }}>
      <h2 className="admin-title" style={{ textAlign: 'left', margin: 0 }}>Website Templates</h2>
      <p className="admin-subtitle" style={{ marginBottom: '24px' }}>
        Choose a website template to initialize or change your business category. Applying a template will update all landing page sections, products, and articles.
      </p>

      {error && <div className="admin-error-banner" style={{ marginBottom: '20px' }}>{error}</div>}
      {success && <div className="admin-success-banner" style={{ marginBottom: '20px' }}>{success}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px', marginTop: '16px' }}>
        {templates.map((template) => (
          <motion.div
            key={template.id}
            className={`card ${template.isActive ? 'active-template-card' : ''}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              border: template.isActive ? '2px solid var(--primary)' : '1px solid var(--surface-border)',
              boxShadow: template.isActive ? '0 4px 12px rgba(var(--primary-rgb), 0.15)' : 'none',
              position: 'relative',
              overflow: 'hidden'
            }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            {template.isActive && (
              <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'var(--primary)',
                color: '#fff',
                fontSize: '11px',
                fontWeight: 'bold',
                padding: '3px 8px',
                borderRadius: '12px',
                textTransform: 'uppercase'
              }}>
                Active
              </div>
            )}

            <div>
              {/* Template Color Palette Preview */}
              <div style={{ 
                height: '60px', 
                background: 'var(--surface-border)', 
                borderRadius: '6px', 
                marginBottom: '16px', 
                display: 'flex', 
                alignItems: 'center', 
                padding: '0 16px', 
                gap: '12px' 
              }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: template.primaryColor }} title="Primary Theme Color" />
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: template.secondaryColor }} title="Secondary Theme Color" />
                <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>Color Theme</span>
              </div>

              <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 8px 0', color: 'var(--text)' }}>
                {template.name}
              </h3>
              
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', minHeight: '52px', margin: '0 0 16px 0', lineHeight: 1.5 }}>
                {template.description}
              </p>

              <div style={{ background: 'var(--surface)', padding: '12px', borderRadius: '6px', marginBottom: '20px', fontSize: '12px' }}>
                <div style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>
                  <strong>Site Name:</strong> {template.siteName}
                </div>
                <div style={{ color: 'var(--text-muted)' }}>
                  <strong>Slogan:</strong> {template.siteSlogan}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedTemplate(template);
                setConfirmText('');
                setError('');
              }}
              className={`btn ${template.isActive ? 'btn-secondary' : ''}`}
              style={{ width: '100%', marginTop: 'auto' }}
              disabled={template.isActive}
            >
              {template.isActive ? 'Currently Active' : 'Apply Template'}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {selectedTemplate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="admin-modal-overlay"
            style={{ zIndex: 1000 }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="card"
              style={{
                width: '100%',
                maxWidth: '480px',
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--surface-border)',
                padding: '24px',
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}
            >
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text)', margin: 0 }}>
                Apply "{selectedTemplate.name}"?
              </h3>
              
              <div className="admin-error-banner" style={{ display: 'block', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '12px', borderRadius: '6px' }}>
                <p style={{ margin: 0, fontWeight: 'bold', fontSize: '13px' }}>⚠️ Warning: Destructive Action</p>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', lineHeight: 1.4 }}>
                  Applying this template will overwrite all landing page sections (Hero, Services, Gallery, Team, Articles) and digital Products.
                </p>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', lineHeight: 1.4, fontWeight: 'bold' }}>
                  Your contact form inquiries, newsletter subscribers, and admin credentials will NOT be affected.
                </p>
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className="label" htmlFor="confirmText" style={{ fontSize: '13px' }}>
                  Please type <strong style={{ color: 'var(--primary)' }}>CONFIRM</strong> below to verify:
                </label>
                <input
                  type="text"
                  id="confirmText"
                  className="input"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="Type CONFIRM here"
                  style={{ textTransform: 'uppercase' }}
                  disabled={applying}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="btn btn-secondary"
                  disabled={applying}
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplyTemplate}
                  className="btn"
                  style={{ backgroundColor: 'var(--accent, #ef4444)', borderColor: 'var(--accent, #ef4444)', color: '#fff' }}
                  disabled={confirmText.toUpperCase() !== 'CONFIRM' || applying}
                >
                  {applying ? 'Applying...' : 'Confirm & Apply'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
