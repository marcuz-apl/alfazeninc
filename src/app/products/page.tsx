'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function ProductsPage() {
  const [settings, setSettings] = useState({ 
    title: 'Our Products', 
    description: 'Discover the comprehensive suite of AI-driven solutions from Alfazen Inc., designed specifically to tackle the unique challenges of the oil and gas industry.',
    unreleased_message: 'Thanks for interests in this topic/product, Please go to our "Contact Us" page to leave messages about ideas, requirements of functions, how the product shall be, what the targeted markets or audience you are, etc. Thanks.'
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState<any>(null);
  
  const [products, setProducts] = useState<any[]>([
    {
      id: 'resologix',
      slug: 'resologix',
      name: 'ResoLogix',
      description: 'A premium, full-range Resource Evaluation and Analytics Platform for Petroleum Resources. Engineered for E&P companies to handle the lifecycle of petroleum resources from early discovery to active production.',
      features: [
        'Monte Carlo Engine with up to 50k iterations',
        'Decline Curve Analysis (DCA) for unconventional reservoirs',
        'Deterministic Economics for on-the-fly NPV & IRR',
        'Reporting Suite with PDF, Excel, and PowerPoint exports'
      ],
      color: 'var(--primary)',
      logoUrl: '/images/products/resologix-logo-cropped.png'
    },
    {
      id: 'elogant',
      slug: 'elogant',
      name: 'Elogant',
      description: 'Intelligent well logging and data interpretation. Streamline operations with automated insights and highly accurate predictions.',
      color: 'var(--secondary)'
    },
    {
      id: 'diabit',
      slug: 'diabit',
      name: 'Diabit',
      description: 'Predictive maintenance and equipment health monitoring. Prevent downtime before it happens using advanced machine learning algorithms.',
      color: 'var(--primary)'
    },
    {
      id: 'seiscult',
      slug: 'seiscult',
      name: 'SeisCult',
      description: 'Seismic data processing and visualization. Enhance subsurface imaging to pinpoint valuable resources with unprecedented accuracy.',
      color: 'var(--secondary)'
    },
    {
      id: 'finapick',
      slug: 'finapick',
      name: 'FinaPick',
      description: 'Financial forecasting and asset valuation for the energy sector. Make data-driven investment decisions with confidence.',
      color: 'var(--primary)'
    }
  ]);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.settings) {
          setSettings(data.settings);
        }
        if (data.items && data.items.length > 0) {
          const parsedItems = data.items.map((item: any) => ({
            ...item,
            id: item.slug,
            logoUrl: item.logo_url,
            features: item.features_json ? JSON.parse(item.features_json) : null
          }));
          setProducts(parsedItems);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <main style={{ overflowX: 'hidden' }}>
      <Header />
      
      <section className="section" style={{ paddingTop: '120px', backgroundColor: 'var(--background)' }}>
        <div className="container">
          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ color: 'var(--text-primary)', textAlign: 'center', marginBottom: '20px' }}
          >
            {settings.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '800px', margin: '0 auto 60px', fontSize: '1.2rem' }}
          >
            {settings.description}
          </motion.p>
        </div>
      </section>

      <section className="section" style={{ backgroundColor: 'var(--background)', paddingBottom: '120px' }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {products.map((product, index) => {
            const statusText = product.status || 'Officially released';
            let statusBgColor = '#22c55e'; // green default for the rest
            if (statusText === 'Officially released') statusBgColor = '#ef4444'; // red
            else if (statusText === 'In alfa/beta tests' || statusText === 'In developing') statusBgColor = '#f97316'; // orange
            else if (statusText === 'Scheduled, seeking patronage') statusBgColor = '#3b82f6'; // blue
            else if (statusText === 'Feasibility study') statusBgColor = '#000000'; // black

            return (
            <div 
              key={product.id} 
              id={product.id} 
              className="card"
              style={{ padding: '60px' }}
            >
              <div className={index % 2 === 0 ? "products-grid" : "products-grid-reversed"} style={{ width: '100%', alignItems: 'center' }}>
              <motion.div
                className="product-text"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '3rem', margin: 0, color: 'var(--text-primary)' }}>{product.name}™</h2>
                  <div style={{ padding: '6px 12px', backgroundColor: statusBgColor, color: '#ffffff', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '0.5px', textTransform: 'uppercase', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', whiteSpace: 'nowrap' }}>
                    {statusText}
                  </div>
                </div>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: product.features ? '16px' : '32px' }}>
                  {product.description}
                </p>
                {product.features && (
                  <ul style={{ listStyleType: 'disc', paddingLeft: '24px', marginBottom: '32px', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                    {product.features.map((feat: string, i: number) => (
                      <li key={i}>{feat}</li>
                    ))}
                  </ul>
                )}
                {statusText === 'Officially released' ? (
                  <a 
                    href={product.external_url || '#'} 
                    target={product.external_url ? "_blank" : "_self"} 
                    rel="noopener noreferrer" 
                    className="btn btn-lg" 
                    style={{ textDecoration: 'none', display: 'inline-block' }}
                  >
                    Learn More about {product.name}
                  </a>
                ) : (
                  <button 
                    className="btn btn-lg"
                    onClick={() => {
                      setActiveProduct(product);
                      setIsModalOpen(true);
                    }}
                  >
                    Learn More about {product.name}
                  </button>
                )}
              </motion.div>
              <motion.div
                className="product-image"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                style={{ 
                  height: '400px', 
                  borderRadius: 'var(--radius)', 
                  background: product.logoUrl ? 'transparent' : `linear-gradient(135deg, ${product.color}20, ${product.color}10)`,
                  border: product.logoUrl ? 'none' : `1px solid ${product.color}40`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}
              >
                {product.logoUrl ? (
                  <div style={{ width: '280px', height: '280px', borderRadius: '60px', overflow: 'hidden', boxShadow: '0px 15px 30px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
                    <img src={product.logoUrl} alt={`${product.name} Logo`} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.35)' }} />
                  </div>
                ) : (
                  <div style={{ color: product.color, opacity: 0.5 }}>
                    <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                      <line x1="8" y1="21" x2="16" y2="21"></line>
                      <line x1="12" y1="17" x2="12" y2="21"></line>
                    </svg>
                  </div>
                )}
              </motion.div>
              </div>
            </div>
            );
          })}
        </div>
      </section>

      <Footer />

      <AnimatePresence>
        {isModalOpen && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{ position: 'relative', backgroundColor: 'var(--surface)', padding: '40px', borderRadius: '12px', maxWidth: '500px', width: '90%', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '1px solid var(--surface-border)' }}
            >
              <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', color: 'var(--text-primary)' }}>
                {activeProduct?.name}™ - {activeProduct?.status}
              </h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '32px' }}>
                {settings.unreleased_message}
              </p>
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
                <button onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Close
                </button>
                <Link href="/#contact-us" onClick={() => setIsModalOpen(false)} className="btn">
                  Go to Contact Us
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
