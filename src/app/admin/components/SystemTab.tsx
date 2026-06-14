'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function SystemTab() {
  const [systemData, setSystemData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSystemData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/system');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch system data');
      setSystemData(data);
      setError('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSystemData();
  }, []);

  const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  const formatUptime = (seconds: number) => {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor(seconds % (3600 * 24) / 3600);
    const m = Math.floor(seconds % 3600 / 60);
    
    const dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
    const hDisplay = h > 0 ? h + (h == 1 ? " hr, " : " hrs, ") : "";
    const mDisplay = m > 0 ? m + (m == 1 ? " min" : " mins") : "";
    return dDisplay + hDisplay + mDisplay || "< 1 min";
  };

  if (loading && !systemData) {
    return (
      <div className="admin-loading-container" style={{ minHeight: '50vh' }}>
        <div className="admin-spinner"></div>
        <p>Loading System Metrics...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 className="admin-title" style={{ textAlign: 'left', margin: 0 }}>System Information</h2>
        <button onClick={fetchSystemData} className="btn btn-secondary" disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh Metrics'}
        </button>
      </div>

      {error && <div className="admin-error-banner">{error}</div>}

      {systemData && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* OS & Environment */}
          <section>
            <h3 style={{ fontSize: '18px', color: 'var(--primary)', marginBottom: '16px', borderBottom: '1px solid var(--surface-border)', paddingBottom: '8px' }}>
              Environment & Host
            </h3>
            <div className="admin-stats-grid">
              <div className="card admin-stat-card">
                <h3>Operating System</h3>
                <div style={{ fontSize: '20px', fontWeight: 600, color: 'var(--foreground)' }}>
                  {systemData.os.platform} ({systemData.os.release})
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>Architecture: {systemData.os.arch}</div>
              </div>
              
              <div className="card admin-stat-card">
                <h3>System Uptime</h3>
                <div style={{ fontSize: '20px', fontWeight: 600, color: 'var(--foreground)' }}>
                  {formatUptime(systemData.os.uptimeSeconds)}
                </div>
              </div>

              <div className="card admin-stat-card">
                <h3>Node Environment</h3>
                <div style={{ fontSize: '20px', fontWeight: 600, color: 'var(--foreground)' }}>
                  {systemData.environment.nodeVersion}
                </div>
              </div>
            </div>
          </section>

          {/* Hardware */}
          <section>
            <h3 style={{ fontSize: '18px', color: 'var(--primary)', marginBottom: '16px', borderBottom: '1px solid var(--surface-border)', paddingBottom: '8px' }}>
              Hardware Resources
            </h3>
            <div className="admin-stats-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
              
              {/* CPU Card */}
              <div className="card admin-stat-card" style={{ gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3>CPU Information</h3>
                  <span style={{ fontSize: '12px', background: 'var(--surface-border)', padding: '4px 8px', borderRadius: '4px' }}>
                    {systemData.cpu.cores} Cores
                  </span>
                </div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--foreground)', minHeight: '48px' }}>
                  {systemData.cpu.model}
                </div>
                <div>
                  <h4 style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Load Averages (1m, 5m, 15m)</h4>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    {systemData.cpu.loadAvg.map((load: number, idx: number) => (
                      <div key={idx} style={{ flex: 1, background: 'var(--surface)', padding: '8px', borderRadius: '6px', textAlign: 'center', fontSize: '15px', fontWeight: 500 }}>
                        {load.toFixed(2)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Memory Card */}
              <div className="card admin-stat-card" style={{ gap: '16px' }}>
                <h3>Memory Usage</h3>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div className="stat-number">{systemData.memory.usagePercent}%</div>
                  <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                    {formatBytes(systemData.memory.usedBytes)} / {formatBytes(systemData.memory.totalBytes)}
                  </div>
                </div>

                <div style={{ width: '100%', height: '8px', background: 'var(--surface-border)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      height: '100%', 
                      background: systemData.memory.usagePercent > 90 ? 'var(--accent)' : 'var(--primary)',
                      width: `${systemData.memory.usagePercent}%`,
                      transition: 'width 0.5s ease-out, background-color 0.3s ease'
                    }} 
                  />
                </div>
                
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  Free Memory: {formatBytes(systemData.memory.freeBytes)}
                </div>
              </div>
            </div>
            
            {/* GPU Card */}
            <div className="card admin-stat-card" style={{ marginTop: '24px' }}>
              <h3>Graphics Processing Unit (GPU)</h3>
              <div style={{ fontSize: '16px', fontWeight: 500, color: 'var(--foreground)', marginTop: '8px' }}>
                {systemData.gpu}
              </div>
            </div>

          </section>
        </div>
      )}
    </motion.div>
  );
}
