import React, { useState, useEffect } from 'react';

export default function SEOTab({ showNotification }: { showNotification: (msg: string, isError?: boolean) => void }) {
  const [globalSeo, setGlobalSeo] = useState({ global_title: '', global_description: '', og_image_url: '', twitter_handle: '' });
  const [pageSeo, setPageSeo] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const globalRes = await fetch('/api/admin/seo/global');
      const globalData = await globalRes.json();
      if (globalData.settings) setGlobalSeo(globalData.settings);

      const pagesRes = await fetch('/api/admin/seo/pages');
      const pagesData = await pagesRes.json();
      if (pagesData.pages) setPageSeo(pagesData.pages);
    } catch (err) {
      showNotification('Failed to load SEO data', true);
    } finally {
      setLoading(false);
    }
  };

  const saveGlobalSeo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      const res = await fetch('/api/admin/seo/global', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(globalSeo)
      });
      if (!res.ok) throw new Error('Failed to save');
      showNotification('Global SEO saved successfully');
    } catch (err) {
      showNotification('Error saving Global SEO', true);
    } finally {
      setSaveLoading(false);
    }
  };

  const savePageSeo = async (page: any) => {
    setSaveLoading(true);
    try {
      const res = await fetch('/api/admin/seo/pages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(page)
      });
      if (!res.ok) throw new Error('Failed to save');
      showNotification(`${page.page_slug} SEO saved successfully`);
    } catch (err) {
      showNotification(`Error saving ${page.page_slug} SEO`, true);
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) return <div>Loading SEO settings...</div>;

  return (
    <div>
      <div className="card" style={{ padding: '24px', marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '1.25rem' }}>Global SEO Settings</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>These settings are used as a fallback if a specific page or entity does not define its own meta tags.</p>
        <form onSubmit={saveGlobalSeo}>
          <div className="form-group">
            <label className="label">Global Title</label>
            <input type="text" className="input" value={globalSeo.global_title} onChange={e => setGlobalSeo({ ...globalSeo, global_title: e.target.value })} required />
          </div>
          <div className="form-group" style={{ marginTop: '16px' }}>
            <label className="label">Global Description</label>
            <textarea className="input" rows={3} value={globalSeo.global_description} onChange={e => setGlobalSeo({ ...globalSeo, global_description: e.target.value })} required />
          </div>
          <div className="form-group" style={{ marginTop: '16px' }}>
            <label className="label">Default OpenGraph Image URL</label>
            <input type="text" className="input" value={globalSeo.og_image_url || ''} onChange={e => setGlobalSeo({ ...globalSeo, og_image_url: e.target.value })} />
          </div>
          <div className="form-group" style={{ marginTop: '16px' }}>
            <label className="label">Twitter Handle</label>
            <input type="text" className="input" value={globalSeo.twitter_handle || ''} onChange={e => setGlobalSeo({ ...globalSeo, twitter_handle: e.target.value })} placeholder="@alfazeninc" />
          </div>
          <button type="submit" disabled={saveLoading} className="btn" style={{ marginTop: '20px' }}>
            {saveLoading ? 'Saving...' : 'Save Global SEO'}
          </button>
        </form>
      </div>

      <div className="card" style={{ padding: '24px' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '1.25rem' }}>Static Pages SEO</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Override the global SEO settings for specific main pages on your website.</p>
        
        {pageSeo.map((page, idx) => (
          <div key={page.page_slug} style={{ marginBottom: '32px', padding: '16px', border: '1px solid var(--surface-border)', borderRadius: '8px' }}>
            <h4 style={{ textTransform: 'capitalize', marginBottom: '12px' }}>{page.page_slug} Page</h4>
            <div className="form-group">
              <label className="label">Meta Title Override</label>
              <input type="text" className="input" value={page.meta_title || ''} onChange={e => {
                const newPages = [...pageSeo];
                newPages[idx].meta_title = e.target.value;
                setPageSeo(newPages);
              }} placeholder={`Default: ${globalSeo.global_title}`} />
            </div>
            <div className="form-group" style={{ marginTop: '16px' }}>
              <label className="label">Meta Description Override</label>
              <textarea className="input" rows={2} value={page.meta_description || ''} onChange={e => {
                const newPages = [...pageSeo];
                newPages[idx].meta_description = e.target.value;
                setPageSeo(newPages);
              }} placeholder={`Default: ${globalSeo.global_description}`} />
            </div>
            <button onClick={() => savePageSeo(page)} disabled={saveLoading} className="btn btn-secondary" style={{ marginTop: '16px' }}>
              Save {page.page_slug} SEO
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
