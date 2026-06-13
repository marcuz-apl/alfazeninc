'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = ['Services', 'Gallery', 'Team', 'Article', 'Contact Us'];
  const productLinks = [
    { name: 'ResoLogix', href: '/products#resologix' },
    { name: 'Elogant', href: '/products#elogant' },
    { name: 'Diabit', href: '/products#diabit' },
    { name: 'Seiscul', href: '/products#seiscul' },
    { name: 'FinaPick', href: '/products#finapick' },
  ];

  const getLinkHref = (link: string) => {
    const hash = `#${link.toLowerCase().replace(' ', '-')}`;
    return pathname === '/' ? hash : `/${hash}`;
  };

  const handleBrandClick = (e: React.MouseEvent) => {
    if (pathname === '/') {
      e.preventDefault();
      document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link 
          href="/"
          className="brand-group-wrapper" 
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}
          onClick={handleBrandClick}
        >
          <img 
            src="/logo.png" 
            alt="Alfazen Logo" 
            style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              objectFit: 'cover', 
              objectPosition: 'center',
              border: '1px solid var(--surface-border)',
              backgroundColor: '#ffffff'
            }} 
          />
          <div className="brand-group">
            <div className="brand-title">Alfazen Inc.</div>
            <div className="brand-slogan">Stay Zen at First Place</div>
          </div>
        </Link>
        <nav className="nav-links">
          <div 
            className="nav-item-dropdown"
            onMouseEnter={() => setIsProductsDropdownOpen(true)}
            onMouseLeave={() => setIsProductsDropdownOpen(false)}
            style={{ position: 'relative', display: 'flex', alignItems: 'center', height: '100%' }}
          >
            <Link href="/products" className="nav-item" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              Products
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: '2px' }}>
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </Link>
            <AnimatePresence>
              {isProductsDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="dropdown-menu"
                >
                  {productLinks.map((product) => (
                    <Link key={product.name} href={product.href} className="dropdown-item">
                      {product.name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {navLinks.map((link) => (
            <Link key={link} href={getLinkHref(link)} className="nav-item">
              {link}
            </Link>
          ))}
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <ThemeToggle />
          <button 
            className={`mobile-menu-btn ${isMobileMenuOpen ? 'open' : ''}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              className="mobile-nav-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.nav 
              className="mobile-nav-menu"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
            >
              <div className="mobile-nav-item" style={{ fontWeight: 'bold' }}>Products</div>
              {productLinks.map((product) => (
                <Link 
                  key={product.name} 
                  href={product.href} 
                  className="mobile-nav-item"
                  style={{ paddingLeft: '32px', fontSize: '0.9em' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {product.name}
                </Link>
              ))}
              <div style={{ margin: '8px 0', borderBottom: '1px solid var(--surface-border)' }} />
              {navLinks.map((link) => (
                <Link 
                  key={link} 
                  href={getLinkHref(link)} 
                  className="mobile-nav-item"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link}
                </Link>
              ))}
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
