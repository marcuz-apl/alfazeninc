'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function PagesTab() {
  const [pages, setPages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingPage, setEditingPage] = useState<any>(null);

  // Form State
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [contentHtml, setContentHtml] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const res = await fetch('/api/admin/pages');
      const data = await res.json();
      if (data.pages) {
        setPages(data.pages);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEditingPage(null);
    setSlug('');
    setTitle('');
    setContentHtml('');
    setMetaTitle('');
    setMetaDescription('');
  };

  const handleEdit = (page: any) => {
    setEditingPage(page);
    setSlug(page.slug);
    setTitle(page.title);
    setContentHtml(page.content_html);
    setMetaTitle(page.meta_title || '');
    setMetaDescription(page.meta_description || '');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingPage?.id,
          slug,
          title,
          content_html: contentHtml,
          meta_title: metaTitle,
          meta_description: metaDescription
        })
      });
      if (res.ok) {
        resetForm();
        fetchPages();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to save page');
      }
    } catch (e) {
      console.error(e);
      alert('An error occurred');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this page?')) return;
    try {
      const res = await fetch(`/api/admin/pages?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchPages();
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (isLoading) return <div>Loading pages...</div>;

  return (
    <div style={{ display: 'flex', gap: '32px' }}>
      <div style={{ flex: '1 1 40%' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '20px' }}>Custom Pages</h3>
        {pages.length === 0 ? (
          <div className="admin-empty-state">No custom pages found. Create one!</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {pages.map((p) => (
              <motion.div key={p.id} className="card" style={{ padding: '16px' }} layout>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: 0 }}>{p.title}</h4>
                    <p style={{ margin: '4px 0 0', fontSize: '14px', color: 'var(--text-muted)' }}>/{p.slug}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleEdit(p)} className="btn btn-secondary" style={{ padding: '4px 12px' }}>Edit</button>
                    <button onClick={() => handleDelete(p.id)} className="btn btn-secondary" style={{ padding: '4px 12px', color: '#ff4444' }}>Delete</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div style={{ flex: '1 1 60%' }}>
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '24px' }}>{editingPage ? 'Edit Page' : 'Create New Page'}</h3>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group">
              <label className="label">Page Title</label>
              <input className="input" required value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. About Us" />
            </div>
            
            <div className="form-group">
              <label className="label">URL Slug</label>
              <input className="input" required value={slug} onChange={e => setSlug(e.target.value)} placeholder="e.g. about-us" />
            </div>

            <div className="form-group">
              <label className="label">Content (HTML allowed)</label>
              <textarea className="input" required value={contentHtml} onChange={e => setContentHtml(e.target.value)} rows={8} placeholder="<p>Welcome to our about page...</p>" />
            </div>

            <h4 style={{ marginTop: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>SEO Overrides</h4>
            
            <div className="form-group">
              <label className="label">Meta Title</label>
              <input className="input" value={metaTitle} onChange={e => setMetaTitle(e.target.value)} placeholder="Leave blank to use Page Title" />
            </div>

            <div className="form-group">
              <label className="label">Meta Description</label>
              <textarea className="input" value={metaDescription} onChange={e => setMetaDescription(e.target.value)} rows={2} />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button type="submit" className="btn">{editingPage ? 'Update Page' : 'Create Page'}</button>
              {editingPage && (
                <button type="button" onClick={resetForm} className="btn btn-secondary">Cancel</button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
