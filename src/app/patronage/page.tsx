import React from 'react';
import db from '@/lib/db';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Patronage - Alfazen Inc.',
  description: 'Support our work in creating free software for the energy sector.'
};

export default async function PatronagePage() {
  // Fetch patronage settings directly from the database server-side
  const keys = ['footer_patronage_enabled', 'patronage_message', 'patronage_link'];
  const placeholders = keys.map(() => '?').join(',');
  const rows = db.prepare(`SELECT key, value FROM admin_settings WHERE key IN (${placeholders})`).all(...keys) as {key: string, value: string}[];
  
  const settings: Record<string, string> = {
    footer_patronage_enabled: 'true',
    patronage_message: 'I am passionate about creating free, high-quality software for the energy sector. However, the costs of maintaining and hosting these services can add up quickly. If you find value in my work, please consider supporting me with a small donation. Your kindness and generosity are deeply appreciated and help keep these tools free for everyone!',
    patronage_link: ''
  };

  rows.forEach(row => {
    if (row.key in settings) settings[row.key] = row.value;
  });

  if (settings.footer_patronage_enabled !== 'true') {
    return (
      <div className="section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 className="section-title">Feature Disabled</h1>
          <p className="section-description">The patronage feature is currently disabled.</p>
          <div style={{ marginTop: '32px' }}>
            <Link href="/" className="btn">Return Home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="container" style={{ maxWidth: '800px', textAlign: 'center' }}>
        
        <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </div>
        </div>

        <h1 className="section-title" style={{ marginBottom: '24px' }}>Support Our Work</h1>
        
        <div className="card" style={{ padding: '40px', background: 'var(--surface)', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', borderRadius: '24px' }}>
          {settings.patronage_message.split('\n').map((paragraph, idx) => (
            paragraph.trim() ? <p key={idx} style={{ fontSize: '18px', lineHeight: '1.8', color: 'var(--text)', marginBottom: '24px' }}>{paragraph}</p> : null
          ))}

          <div style={{ marginTop: '48px' }}>
            {settings.patronage_link ? (
              <a 
                href={settings.patronage_link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn" 
                style={{ fontSize: '18px', padding: '16px 40px', borderRadius: '50px', display: 'inline-flex', alignItems: 'center', gap: '12px', boxShadow: '0 8px 20px rgba(var(--primary-rgb), 0.3)' }}
              >
                Donate via Stripe / PayPal
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </a>
            ) : (
              <div style={{ padding: '20px', background: 'var(--background)', borderRadius: '12px', color: 'var(--text-muted)' }}>
                <p>The donation link has not been set up yet. Please check back later!</p>
              </div>
            )}
          </div>
        </div>

        <div style={{ marginTop: '40px' }}>
          <Link href="/" className="footer-social-link" style={{ fontSize: '16px', display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Return to Homepage
          </Link>
        </div>

      </div>
    </div>
  );
}
