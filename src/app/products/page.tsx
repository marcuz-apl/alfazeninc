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
      description: 'Advanced reservoir characterization and simulation powered by cutting-edge AI. Optimize extraction efficiency and minimize operational risks.',
      color: 'var(--primary)'
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
            <div className="grid" style={{ alignItems: 'center' }}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 style={{ fontSize: '3rem', marginBottom: '24px', color: product.color }}>{product.name}</h2>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '32px' }}>
                  {product.description}
                </p>
                <button className="btn btn-lg">Learn More about {product.name}</button>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                style={{ 
                  height: '400px', 
                  borderRadius: 'var(--radius)', 
                  background: `linear-gradient(135deg, ${product.color}20, ${product.color}10)`,
                  border: `1px solid ${product.color}40`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <div style={{ color: product.color, opacity: 0.5 }}>
                  <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                    <line x1="8" y1="21" x2="16" y2="21"></line>
                    <line x1="12" y1="17" x2="12" y2="21"></line>
                  </svg>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      ))}

      <Footer />
    </main>
  );
}
