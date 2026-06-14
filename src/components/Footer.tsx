'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Footer() {
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  return (
    <>
      <footer className="footer">
        <div className="container footer-layout">
          <div className="footer-left">
            <button onClick={() => setShowDisclaimer(true)} className="footer-btn">
              Disclaimer
            </button>
          </div>
          <div className="footer-center">
            <p>@2026 Alfazen Inc. All rights reserved. The website is empowered by ❤️ Gemini AI ❤️</p>
          </div>
          <div className="footer-right">
            <a href="mailto:info@alfazen.org" className="footer-social-link" aria-label="Email">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </a>
            <a href="https://alfazen.org" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Website">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Twitter">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>

      {/* Disclaimer Modal Dialog */}
      <AnimatePresence>
        {showDisclaimer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-backdrop"
            onClick={() => setShowDisclaimer(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="modal-card"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowDisclaimer(false)}
                className="modal-close-btn"
                aria-label="Close Disclaimer"
              >
                &times;
              </button>
              <h3 className="modal-title">Disclaimer &amp; Professional Statement</h3>
              <div className="modal-body-content">
                <p>
                  <strong>Alfazen Inc.</strong> is a technical consultancy and AI software solutions provider based in Calgary, AB, Canada. The analytical models, reservoir simulations, predictive maintenance algorithms, and consulting services presented on this website or delivered during client engagements are intended for operational optimization and general informational purposes.
                </p>
                <p style={{ marginTop: '16px' }}>
                  While our solutions utilize advanced artificial intelligence and data science methodologies, all technical evaluations, engineering recommendations, and geoscientific designs must be reviewed, validated, and signed off by licensed professional engineers and qualified geoscientists prior to operational deployment or final field execution.
                </p>
                <p style={{ marginTop: '16px' }}>
                  Alfazen Inc. shall not be held liable for any engineering decisions, operational downtime, equipment failures, resource mismanagement, or financial outcomes arising from the implementation of analytical projections or software configurations provided by our consultancy.
                </p>
              </div>
              <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={() => setShowDisclaimer(false)} className="btn">
                  Close Statement
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
