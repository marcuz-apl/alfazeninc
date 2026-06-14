'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ProductItem {
  id?: number;
  slug: string;
  name: string;
  description: string;
  features_json: string | null;
  color: string;
  logo_url: string | null;
  status?: string;
  display_order: number;
  external_url?: string | null;
}

interface ProductsTabProps {
  showNotification: (msg: string, isError?: boolean) => void;
}

export default function ProductsTab({ showNotification }: ProductsTabProps) {
  const [settings, setSettings] = useState({ title: '', description: '', unreleased_message: '' });
  const [items, setItems] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);

  const [editorMode, setEditorMode] = useState<'add' | 'edit' | null>(null);
  const [editingCard, setEditingCard] = useState<ProductItem | null>(null);
  const [featuresText, setFeaturesText] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [setRes, itemsRes] = await Promise.all([
        fetch('/api/admin/products/settings'),
        fetch('/api/admin/products')
      ]);
      if (setRes.ok) {
        const data = await setRes.json();
        setSettings(data.settings);
      }
      if (itemsRes.ok) {
        const data = await itemsRes.json();
        setItems(data.items || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      const res = await fetch('/api/admin/products/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        showNotification('Products settings saved successfully!');
      } else {
        showNotification('Failed to save settings', true);
      }
    } catch (err) {
      showNotification('Error saving settings', true);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCard) return;
    setSaveLoading(true);
    try {
      // Parse featuresText into JSON array
      const featuresArr = featuresText.split('\n').map(f => f.trim()).filter(f => f.length > 0);
      const payload = {
        ...editingCard,
        features_json: featuresArr.length > 0 ? JSON.stringify(featuresArr) : null
      };

      const method = editorMode === 'add' ? 'POST' : 'PUT';
      const res = await fetch('/api/admin/products', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        showNotification(`Product ${editorMode === 'add' ? 'added' : 'updated'} successfully!`);
        setEditorMode(null);
        setEditingCard(null);
        fetchData();
      } else {
        const err = await res.json();
        showNotification(err.error || 'Failed to save product', true);
      }
    } catch (err) {
      showNotification('Error saving product', true);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDeleteItem = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch('/api/admin/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        showNotification('Product deleted successfully!');
        fetchData();
      } else {
        showNotification('Failed to delete product', true);
      }
    } catch (err) {
      showNotification('Error deleting product', true);
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === items.length - 1) return;
    
    const newItems = [...items];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap display_order
    const tempOrder = newItems[index].display_order;
    newItems[index].display_order = newItems[swapIndex].display_order;
    newItems[swapIndex].display_order = tempOrder;
    
    // Optimistic UI update
    const swappedItems = [...newItems];
    const tempItem = swappedItems[index];
    swappedItems[index] = swappedItems[swapIndex];
    swappedItems[swapIndex] = tempItem;
    setItems(swappedItems);

    try {
      await Promise.all([
        fetch('/api/admin/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newItems[index])
        }),
        fetch('/api/admin/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newItems[swapIndex])
        })
      ]);
      // Silently succeed
    } catch (err) {
      showNotification('Failed to update order', true);
      fetchData(); // Revert on error
    }
  };

  const openEditor = (mode: 'add' | 'edit', item?: ProductItem) => {
    setEditorMode(mode);
    if (mode === 'edit' && item) {
      setEditingCard(item);
      let ft = '';
      if (item.features_json) {
        try {
          const arr = JSON.parse(item.features_json);
          if (Array.isArray(arr)) ft = arr.join('\n');
        } catch (e) {}
      }
      setFeaturesText(ft);
    } else {
      setEditingCard({
        slug: '',
        name: '',
        description: '',
        features_json: null,
        color: 'var(--primary)',
        logo_url: '',
        status: 'Officially released',
        display_order: items.length + 1,
        external_url: ''
      });
      setFeaturesText('');
    }
  };

  if (loading) return <div className="admin-loading-container"><div className="admin-spinner" /><p>Loading Products data...</p></div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Settings Form */}
      <div className="card" style={{ maxWidth: '800px' }}>
        <h2 style={{ fontSize: '22px', marginBottom: '16px', color: 'var(--primary)' }}>Products Intro Settings</h2>
        <form onSubmit={handleSaveSettings}>
          <div className="form-group">
            <label className="label">Title</label>
            <input 
              type="text" 
              className="input" 
              value={settings?.title || ''} 
              onChange={(e) => setSettings({ ...settings, title: e.target.value })}
              required
            />
          </div>
          <div className="form-group" style={{ marginTop: '16px' }}>
            <label className="label">Description</label>
            <textarea 
              className="input" 
              rows={4}
              value={settings?.description || ''} 
              onChange={(e) => setSettings({ ...settings, description: e.target.value })}
              required
            />
          </div>
          <div className="form-group" style={{ marginTop: '16px' }}>
            <label className="label">Unreleased Product Pop-up Message</label>
            <textarea 
              className="input" 
              rows={3}
              value={settings?.unreleased_message || ''} 
              onChange={(e) => setSettings({ ...settings, unreleased_message: e.target.value })}
            />
          </div>
          <button type="submit" disabled={saveLoading} className="btn" style={{ marginTop: '20px' }}>
            {saveLoading ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
      </div>

      {/* Products List & Editor */}
      <div className="card" style={{ maxWidth: '800px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '22px', color: 'var(--primary)' }}>Manage Products</h2>
          {!editorMode && (
            <button onClick={() => openEditor('add')} className="btn">Add New Product</button>
          )}
        </div>

        {editorMode ? (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="admin-editor-panel" style={{ padding: '20px', backgroundColor: 'var(--background)', borderRadius: '8px', border: '1px solid var(--surface-border)' }}>
            <h3 style={{ marginBottom: '16px' }}>{editorMode === 'add' ? 'Add Product' : 'Edit Product'}</h3>
            <form onSubmit={handleSaveItem}>
              <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="label">Name</label>
                  <input type="text" className="input" value={editingCard?.name || ''} onChange={(e) => setEditingCard({ ...editingCard!, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="label">Slug (ID for anchor link)</label>
                  <input type="text" className="input" value={editingCard?.slug || ''} onChange={(e) => setEditingCard({ ...editingCard!, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '') })} required />
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '16px' }}>
                <label className="label">Description</label>
                <textarea className="input" rows={3} value={editingCard?.description || ''} onChange={(e) => setEditingCard({ ...editingCard!, description: e.target.value })} required />
              </div>

              <div className="form-group" style={{ marginTop: '16px' }}>
                <label className="label">Features (One per line, optional)</label>
                <textarea className="input" rows={4} value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} placeholder="Feature 1&#10;Feature 2" />
              </div>

              <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
                <div className="form-group">
                  <label className="label">Color (CSS var or hex)</label>
                  <input type="text" className="input" value={editingCard?.color || ''} onChange={(e) => setEditingCard({ ...editingCard!, color: e.target.value })} required placeholder="var(--primary)" />
                </div>
                <div className="form-group">
                  <label className="label">Logo URL</label>
                  <input type="text" className="input" value={editingCard?.logo_url || ''} onChange={(e) => setEditingCard({ ...editingCard!, logo_url: e.target.value })} placeholder="/images/products/..." />
                </div>
              </div>

              <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
                <div className="form-group">
                  <label className="label">Status</label>
                  <select className="input" value={editingCard?.status || 'Officially released'} onChange={(e) => setEditingCard({ ...editingCard!, status: e.target.value })}>
                    <option value="Officially released">Officially released</option>
                    <option value="In alfa/beta tests">In alfa/beta tests</option>
                    <option value="In developing">In developing</option>
                    <option value="Scheduled, to be developed">Scheduled, to be developed</option>
                    <option value="Scheduled, seeking patronage">Scheduled, seeking patronage</option>
                    <option value="Feasibility study">Feasibility study</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="label">Display Order</label>
                  <input type="number" className="input" value={editingCard?.display_order || 0} onChange={(e) => setEditingCard({ ...editingCard!, display_order: parseInt(e.target.value) || 0 })} required />
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '16px' }}>
                <label className="label">External URL (For Released Products)</label>
                <input type="text" className="input" value={editingCard?.external_url || ''} onChange={(e) => setEditingCard({ ...editingCard!, external_url: e.target.value })} placeholder="https://..." />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="submit" disabled={saveLoading} className="btn">
                  {saveLoading ? 'Saving...' : 'Save Product'}
                </button>
                <button type="button" onClick={() => setEditorMode(null)} className="btn btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--surface-border)', textAlign: 'left' }}>
                  <th style={{ padding: '12px' }}>Order</th>
                  <th style={{ padding: '12px' }}>Name</th>
                  <th style={{ padding: '12px' }}>Slug</th>
                  <th style={{ padding: '12px' }}>Status</th>
                  <th style={{ padding: '12px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr><td colSpan={5} style={{ padding: '12px', textAlign: 'center' }}>No products found.</td></tr>
                ) : items.map((item, index) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--surface-border)' }}>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>{item.display_order}</span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <button 
                            type="button" 
                            onClick={() => handleMoveOrder(index, 'up')}
                            disabled={index === 0}
                            style={{ background: 'none', border: 'none', cursor: index === 0 ? 'not-allowed' : 'pointer', opacity: index === 0 ? 0.3 : 1, padding: 0, fontSize: '10px', color: 'var(--text-primary)' }}
                          >
                            ▲
                          </button>
                          <button 
                            type="button" 
                            onClick={() => handleMoveOrder(index, 'down')}
                            disabled={index === items.length - 1}
                            style={{ background: 'none', border: 'none', cursor: index === items.length - 1 ? 'not-allowed' : 'pointer', opacity: index === items.length - 1 ? 0.3 : 1, padding: 0, fontSize: '10px', color: 'var(--text-primary)' }}
                          >
                            ▼
                          </button>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}><strong>{item.name}</strong></td>
                    <td style={{ padding: '12px' }}>{item.slug}</td>
                    <td style={{ padding: '12px' }}>{item.status || 'Officially released'}</td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => openEditor('edit', item)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '14px' }}>Edit</button>
                        <button onClick={() => handleDeleteItem(item.id!)} className="admin-delete-btn" style={{ padding: '6px 12px', fontSize: '14px', border: '1px solid var(--surface-border)', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
