'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

export default function ProductsPage() {
  const products = [
    {
      id: 'resologix',
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
      name: 'Elogant',
      description: 'Intelligent well logging and data interpretation. Streamline operations with automated insights and highly accurate predictions.',
      color: 'var(--secondary)'
    },
    {
      id: 'diabit',
      name: 'Diabit',
      description: 'Predictive maintenance and equipment health monitoring. Prevent downtime before it happens using advanced machine learning algorithms.',
      color: 'var(--primary)'
    },
    {
      id: 'seiscul',
      name: 'Seiscul',
      description: 'Seismic data processing and visualization. Enhance subsurface imaging to pinpoint valuable resources with unprecedented accuracy.',
      color: 'var(--secondary)'
    },
    {
      id: 'finapick',
      name: 'FinaPick',
      description: 'Financial forecasting and asset valuation for the energy sector. Make data-driven investment decisions with confidence.',
      color: 'var(--primary)'
    }
  ];

  return (
    <main>
      <Header />
      
      <section className="section" style={{ paddingTop: '120px', backgroundColor: 'var(--background)' }}>
        <div className="container">
          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ color: 'var(--text-primary)', textAlign: 'center', marginBottom: '20px' }}
          >
            Our Products
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '800px', margin: '0 auto 60px', fontSize: '1.2rem' }}
          >
            Discover the comprehensive suite of AI-driven solutions from Alfazen Inc., designed specifically to tackle the unique challenges of the oil and gas industry.
          </motion.p>
        </div>
      </section>

      {products.map((product, index) => (
        <section 
          key={product.id} 
          id={product.id} 
          className="section" 
          style={{ 
            backgroundColor: index % 2 === 0 ? 'var(--surface)' : 'var(--background)',
            minHeight: '60vh',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <div className="container">
            <div className={index % 2 === 0 ? "products-grid" : "products-grid-reversed"}>
              <motion.div
                className="product-text"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 style={{ fontSize: '3rem', marginBottom: '24px', color: product.color }}>{product.name}</h2>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: product.features ? '16px' : '32px' }}>
                  {product.description}
                </p>
                {product.features && (
                  <ul style={{ listStyleType: 'disc', paddingLeft: '24px', marginBottom: '32px', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                    {product.features.map((feat, i) => (
                      <li key={i}>{feat}</li>
                    ))}
                  </ul>
                )}
                <button className="btn btn-lg">Learn More about {product.name}</button>
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
                  <img src={product.logoUrl} alt={`${product.name} Logo`} style={{ width: '180px', height: '180px', objectFit: 'cover', borderRadius: '40px', filter: 'drop-shadow(0px 10px 20px rgba(0,0,0,0.15))' }} />
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
        </section>
      ))}

      <Footer />
    </main>
  );
}
