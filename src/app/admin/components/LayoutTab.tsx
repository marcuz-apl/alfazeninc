'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function LayoutTab() {
  const [layout, setLayout] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchLayout();
  }, []);

  const fetchLayout = async () => {
    try {
      const res = await fetch('/api/admin/layout');
      const data = await res.json();
      if (data.layout) {
        setLayout(data.layout);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newLayout = [...layout];
    if (direction === 'up' && index > 0) {
      const temp = newLayout[index - 1];
      newLayout[index - 1] = newLayout[index];
      newLayout[index] = temp;
    } else if (direction === 'down' && index < newLayout.length - 1) {
      const temp = newLayout[index + 1];
      newLayout[index + 1] = newLayout[index];
      newLayout[index] = temp;
    }
    setLayout(newLayout);
  };

  const toggleVisibility = (index: number) => {
    const newLayout = [...layout];
    newLayout[index].visible = !newLayout[index].visible;
    setLayout(newLayout);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/layout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ layout })
      });
      if (res.ok) {
        alert('Layout saved successfully!');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to save layout');
      }
    } catch (e: any) {
      console.error(e);
      alert('An error occurred: ' + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div>Loading layout...</div>;

  const sectionNames: Record<string, string> = {
    'hero': 'Hero Section',
    'services': 'Services Grid',
    'gallery': 'Image Gallery',
    'quote': 'Quote Banner',
    'image_banner': 'Image Banner',
    'team': 'Team Members',
    'article': 'Articles & News',
    'contact-us': 'Contact Form & Map'
  };

  return (
    <div style={{ maxWidth: '600px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ margin: 0 }}>Homepage Layout</h3>
        <button onClick={handleSave} disabled={isSaving} className="btn">
          {isSaving ? 'Saving...' : 'Save Layout'}
        </button>
      </div>

      <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
        Reorder the sections as they appear on the homepage, or toggle their visibility.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {layout.map((item, index) => (
          <motion.div 
            key={item.id} 
            className="card" 
            style={{ 
              padding: '16px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              opacity: item.visible ? 1 : 0.5,
              borderLeft: item.visible ? '4px solid var(--primary)' : '4px solid var(--border)'
            }}
            layout
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <button 
                  onClick={() => moveItem(index, 'up')} 
                  disabled={index === 0}
                  className="btn btn-secondary"
                  style={{ padding: '2px 8px', fontSize: '12px' }}
                >▲</button>
                <button 
                  onClick={() => moveItem(index, 'down')} 
                  disabled={index === layout.length - 1}
                  className="btn btn-secondary"
                  style={{ padding: '2px 8px', fontSize: '12px' }}
                >▼</button>
              </div>
              <div>
                <strong style={{ fontSize: '16px' }}>{sectionNames[item.id] || item.id}</strong>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>ID: {item.id}</div>
              </div>
            </div>

            <button 
              onClick={() => toggleVisibility(index)}
              className={`btn ${item.visible ? 'btn-secondary' : ''}`}
            >
              {item.visible ? 'Hide' : 'Show'}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
