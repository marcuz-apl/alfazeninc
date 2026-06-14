'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SECTIONS = ['brand', 'hero', 'services', 'gallery', 'team', 'articles'] as const;
type Section = (typeof SECTIONS)[number];

const SECTION_ICONS: Record<Section, string> = {
  brand: '⭐',
  hero: '🖼️',
  services: '✨',
  gallery: '📸',
  team: '👥',
  articles: '📝'
};

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function getFileExtension(name: string): string {
  return name.split('.').pop()?.toUpperCase() || '';
}

interface MediaTabProps {
  onSyncImages?: () => Promise<void>;
  syncLoading?: boolean;
}

export default function MediaTab({ onSyncImages, syncLoading }: MediaTabProps) {
  /* ─── state ─── */
  const [files, setFiles] = useState<Record<Section, string[]>>({ brand: [], hero: [], services: [], gallery: [], team: [], articles: [] });
  const [selectedSection, setSelectedSection] = useState<Section>('hero');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ─── helpers ─── */
  const totalFiles = Object.values(files).reduce((sum, arr) => sum + arr.length, 0);
  const sectionFiles = files[selectedSection] || [];

  const clearMessages = () => { setError(null); setSuccess(null); };

  const fetchMedia = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/media');
      const data = await res.json();
      if (data?.files) setFiles(data.files);
    } catch {
      setError('Failed to load media files.');
    }
  }, []);

  useEffect(() => { fetchMedia(); }, [fetchMedia]);

  // Auto-dismiss success messages
  useEffect(() => {
    if (success) {
      const t = setTimeout(() => setSuccess(null), 4000);
      return () => clearTimeout(t);
    }
  }, [success]);

  /* ─── upload ─── */
  const doUpload = async (file: File) => {
    clearMessages();
    setUploading(true);
    setUploadProgress(0);
    const formData = new FormData();
    formData.append('section', selectedSection);
    formData.append('file', file);

    try {
      const xhr = new XMLHttpRequest();
      await new Promise<void>((resolve, reject) => {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) setUploadProgress(Math.round((e.loaded / e.total) * 100));
        });
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            try {
              const err = JSON.parse(xhr.responseText);
              reject(new Error(err.error || 'Upload failed'));
            } catch {
              reject(new Error('Upload failed'));
            }
          }
        });
        xhr.addEventListener('error', () => reject(new Error('Network error during upload')));
        xhr.open('POST', '/api/admin/media/upload');
        xhr.send(formData);
      });
      setSuccess(`"${file.name}" uploaded successfully to ${selectedSection}.`);
      await fetchMedia();
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) doUpload(file);
    e.target.value = '';
  };

  /* ─── drag & drop ─── */
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = () => setDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) doUpload(file);
  };

  /* ─── download from URL ─── */
  const handleDownloadFromUrl = async () => {
    if (!downloadUrl.trim()) return;
    clearMessages();
    setDownloading(true);
    try {
      const res = await fetch('/api/admin/media/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: downloadUrl, section: selectedSection }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Download failed');
      setSuccess(`File downloaded from URL to ${selectedSection}.`);
      setDownloadUrl('');
      await fetchMedia();
    } catch (err: any) {
      setError(err.message || 'Download failed');
    } finally {
      setDownloading(false);
    }
  };

  /* ─── delete ─── */
  const handleDelete = async (filename: string) => {
    if (!confirm(`Permanently delete "${filename}"?\nThis action cannot be undone.`)) return;
    clearMessages();
    setDeleting(filename);
    try {
      const res = await fetch('/api/admin/media', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename, section: selectedSection }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Delete failed');
      setSuccess(`"${filename}" deleted.`);
      if (previewFile === filename) setPreviewFile(null);
      await fetchMedia();
    } catch (err: any) {
      setError(err.message || 'Delete failed');
    } finally {
      setDeleting(null);
    }
  };

  const isVideo = (name: string) => /\.(mp4|webm)$/i.test(name);

  /* ─── render ─── */
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* ── Stats Row ── */}
      <div className="admin-stats-grid" style={{ marginBottom: '24px' }}>
        <div className="card admin-stat-card">
          <h3>Total Assets</h3>
          <p className="stat-number">{totalFiles}</p>
        </div>
        <div className="card admin-stat-card">
          <h3>Current Section</h3>
          <p className="stat-number" style={{ fontSize: '22px' }}>
            {SECTION_ICONS[selectedSection]} {selectedSection.charAt(0).toUpperCase() + selectedSection.slice(1)}
          </p>
        </div>
        <div className="card admin-stat-card">
          <h3>Files in Section</h3>
          <p className="stat-number">{sectionFiles.length}</p>
        </div>
      </div>

      {/* ── Section Picker Card ── */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '16px', color: 'var(--primary)' }}>Browse by Section</h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {SECTIONS.map((sec) => (
            <button
              key={sec}
              onClick={() => { setSelectedSection(sec); clearMessages(); setPreviewFile(null); }}
              className={selectedSection === sec ? 'btn' : 'btn btn-secondary'}
              style={{
                padding: '10px 20px',
                fontSize: '14px',
                ...(selectedSection === sec
                  ? {}
                  : { backgroundColor: 'var(--surface)', border: '1px solid var(--surface-border)' }),
              }}
            >
              {SECTION_ICONS[sec]}&nbsp; {sec.charAt(0).toUpperCase() + sec.slice(1)}
              <span style={{
                marginLeft: '8px',
                fontSize: '12px',
                backgroundColor: selectedSection === sec ? 'rgba(255,255,255,0.25)' : 'var(--surface-border)',
                padding: '2px 8px',
                borderRadius: '12px',
              }}>
                {files[sec]?.length || 0}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Sync External Images Card ── */}
      {onSyncImages && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ flex: '1 1 300px' }}>
              <h2 style={{ fontSize: '20px', marginBottom: '6px', color: 'var(--primary)', margin: 0 }}>🔄 Sync External Images</h2>
              <p style={{ margin: '6px 0 0 0', fontSize: '14px', color: 'var(--text-muted)' }}>
                Scan the database for externally linked images (URLs) and download them to local <code>/images/</code> subfolders, then update all references automatically.
              </p>
            </div>
            <button
              onClick={onSyncImages}
              disabled={syncLoading}
              className="btn"
              style={{
                padding: '12px 28px',
                fontSize: '15px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap',
              }}
            >
              {syncLoading ? '⏳ Syncing…' : '📥 Sync Local Images'}
            </button>
          </div>
        </div>
      )}

      {/* ── Upload Card ── */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '16px', color: 'var(--primary)' }}>Upload Media</h2>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          {/* Drag & Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !uploading && fileInputRef.current?.click()}
            style={{
              flex: '1 1 300px',
              minHeight: '160px',
              border: `2px dashed ${dragging ? 'var(--primary)' : 'var(--surface-border)'}`,
              borderRadius: '12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: uploading ? 'default' : 'pointer',
              backgroundColor: dragging ? 'rgba(117, 66, 229, 0.06)' : 'var(--background)',
              transition: 'all 0.25s ease',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {uploading ? (
              <>
                <div style={{ fontSize: '32px' }}>⏳</div>
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)' }}>
                  Uploading… {uploadProgress}%
                </p>
                <div style={{
                  position: 'absolute',
                  bottom: 0, left: 0,
                  height: '4px',
                  width: `${uploadProgress}%`,
                  background: 'linear-gradient(to right, var(--primary), var(--accent))',
                  borderRadius: '0 2px 2px 0',
                  transition: 'width 0.3s ease',
                }} />
              </>
            ) : (
              <>
                <div style={{ fontSize: '40px', opacity: 0.7 }}>
                  {dragging ? '📂' : '📁'}
                </div>
                <p style={{ margin: 0, fontWeight: 500, color: 'var(--foreground)' }}>
                  {dragging ? 'Drop file here' : 'Drag & drop or click to browse'}
                </p>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
                  Supports JPG, PNG, WebP, GIF, MP4, WebM
                </p>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,.gif,.mp4,.webm"
              onChange={handleFileInput}
              disabled={uploading}
              style={{ display: 'none' }}
            />
          </div>

          {/* Download from URL */}
          <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="label">Download from URL</label>
              <input
                className="input"
                type="text"
                placeholder="https://example.com/photo.jpg"
                value={downloadUrl}
                onChange={(e) => setDownloadUrl(e.target.value)}
                disabled={downloading}
              />
              <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                Enter an external image / video URL to download into <code>/images/{selectedSection}/</code>
              </small>
            </div>
            <button
              className="btn"
              onClick={handleDownloadFromUrl}
              disabled={downloading || !downloadUrl.trim()}
              style={{ alignSelf: 'flex-start' }}
            >
              {downloading ? '⏳ Downloading…' : '🌐 Download to Local'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Alerts ── */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              background: 'rgba(226, 40, 80, 0.08)',
              border: '1px solid var(--accent)',
              color: 'var(--accent)',
              borderRadius: '8px',
              padding: '12px 16px',
              marginBottom: '16px',
              fontSize: '14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>⚠️ {error}</span>
            <button onClick={() => setError(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', fontSize: '16px' }}>✕</button>
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="admin-success-banner"
            style={{ marginBottom: '16px', textAlign: 'left' }}
          >
            ✅ {success}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Files Grid Card ── */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', margin: 0 }}>
            {SECTION_ICONS[selectedSection]} {selectedSection.charAt(0).toUpperCase() + selectedSection.slice(1)} Assets
          </h2>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            {sectionFiles.length} file{sectionFiles.length !== 1 ? 's' : ''}
          </span>
        </div>

        {sectionFiles.length === 0 ? (
          <div className="admin-empty-state">
            <div style={{ fontSize: '48px', marginBottom: '12px', opacity: 0.5 }}>📭</div>
            <p>No media files in this section yet.</p>
            <p style={{ fontSize: '13px' }}>Upload a file or download from a URL above.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '20px',
          }}>
            <AnimatePresence>
              {sectionFiles.map((filename) => {
                const filePath = `/images/${selectedSection}/${filename}`;
                const ext = getFileExtension(filename);
                const video = isVideo(filename);
                const isDeleting = deleting === filename;

                return (
                  <motion.div
                    key={filename}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: isDeleting ? 0.4 : 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={{ duration: 0.25 }}
                    style={{
                      border: '1px solid var(--surface-border)',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      backgroundColor: 'var(--surface)',
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'box-shadow 0.25s ease, transform 0.25s ease',
                    }}
                    whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
                    onClick={() => setPreviewFile(previewFile === filename ? null : filename)}
                  >
                    {/* Thumbnail */}
                    <div style={{ width: '100%', height: '140px', overflow: 'hidden', position: 'relative', backgroundColor: 'var(--background)' }}>
                      {video ? (
                        <video
                          src={filePath}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          muted
                        />
                      ) : (
                        <img
                          src={filePath}
                          alt={filename}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                          loading="lazy"
                        />
                      )}
                      {/* Badge */}
                      <span style={{
                        position: 'absolute',
                        top: '8px',
                        left: '8px',
                        background: video ? 'rgba(226, 40, 80, 0.85)' : 'rgba(117, 66, 229, 0.85)',
                        color: '#fff',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 600,
                        letterSpacing: '0.02em',
                        backdropFilter: 'blur(4px)',
                      }}>
                        {video ? '▶ VIDEO' : ext}
                      </span>
                    </div>

                    {/* File info */}
                    <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <p style={{
                        margin: 0,
                        fontSize: '13px',
                        fontWeight: 500,
                        color: 'var(--foreground)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }} title={filename}>
                        {filename}
                      </p>
                      <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>
                        /images/{selectedSection}/
                      </p>
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(filename); }}
                      disabled={isDeleting}
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        width: '28px',
                        height: '28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(0,0,0,0.55)',
                        backdropFilter: 'blur(4px)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: isDeleting ? 'default' : 'pointer',
                        fontSize: '14px',
                        transition: 'background 0.2s',
                      }}
                      title="Delete file"
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(226, 40, 80, 0.85)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.55)')}
                    >
                      🗑
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ── Preview Modal ── */}
      <AnimatePresence>
        {previewFile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewFile(null)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              background: 'rgba(0,0,0,0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'zoom-out',
              backdropFilter: 'blur(8px)',
            }}
          >
            <motion.div
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                maxWidth: '90vw',
                maxHeight: '85vh',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 32px 64px rgba(0,0,0,0.5)',
                cursor: 'default',
                position: 'relative',
                backgroundColor: '#000',
              }}
            >
              {isVideo(previewFile) ? (
                <video
                  src={`/images/${selectedSection}/${previewFile}`}
                  style={{ maxWidth: '90vw', maxHeight: '80vh', display: 'block' }}
                  controls
                  autoPlay
                  muted
                />
              ) : (
                <img
                  src={`/images/${selectedSection}/${previewFile}`}
                  alt={previewFile}
                  style={{ maxWidth: '90vw', maxHeight: '80vh', display: 'block' }}
                />
              )}
              {/* Caption bar */}
              <div style={{
                padding: '12px 16px',
                background: 'rgba(0,0,0,0.7)',
                color: '#fff',
                fontSize: '13px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <span style={{ fontWeight: 500 }}>{previewFile}</span>
                <span style={{ opacity: 0.6 }}>/images/{selectedSection}/</span>
              </div>
              {/* Close button */}
              <button
                onClick={() => setPreviewFile(null)}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(0,0,0,0.6)',
                  backdropFilter: 'blur(4px)',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
