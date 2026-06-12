'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '@/components/ThemeToggle';
import ContactForm from '@/components/ContactForm';
import GalleryCarousel from '@/components/GalleryCarousel';

export default function Home() {
  const navLinks = ['Services', 'Gallery', 'Team', 'Article', 'Contact Us'];
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  return (
    <main>
      {/* Navigation */}
      <header className="header">
        <div className="header-container">
          <div className="brand-title">Alfazen Inc.</div>
          <nav className="nav-links">
            {navLinks.map((link) => (
              <a key={link} href={`#${link.toLowerCase().replace(' ', '-')}`} className="nav-item">
                {link}
              </a>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section" id="home">
        <div className="hero-bg-wrapper">
          <div className="hero-bg-image" />
          <div className="hero-overlay" />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container hero-content"
        >
          <h1 className="hero-title">Global AI Solutions for Oil & Gas</h1>
          <p className="hero-subtitle">
            With over 20 years of experience across multiple continents, Alfazen Inc. leverages advanced AI and data science to tackle the unique challenges of the oil and gas industry. Based in Calgary, AB, we deliver innovative solutions that optimize operations and drive industry progress. Partner with us to harness the power of AI for your energy needs.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <a href="#contact-us" className="btn btn-lg">
              Contact Us
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* Services Section */}
      <section id="services" className="section" style={{ backgroundColor: 'var(--background)' }}>
        <div className="container">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Alfazen Inc. Data Science Services for Oil & Gas
          </motion.h2>
          <div className="grid">
            {[
              {
                title: 'AI-Driven Reservoir Analysis',
                desc: 'Utilize advanced AI models to optimize reservoir characterization and enhance extraction efficiency, minimizing operational risks.',
                img: 'https://images.unsplash.com/photo-1691505748956-2d02b6603e84?crop=entropy&ixid=M3w0OTUyODh8MHwxfHNlYXJjaHw0fHxvaWwlMjByZXNlcnZvaXJ8ZW58MHwwfHx8MTc2MzQwMTc2N3ww&ixlib=rb-4.1.0&w=600&q=80&auto=format&fit=crop',
                alt: 'a large field with a water tower in the middle of it'
              },
              {
                title: 'Predictive Maintenance Solutions',
                desc: 'Implement machine learning algorithms to predict equipment failures and schedule proactive maintenance, reducing downtime.',
                img: 'https://images.unsplash.com/photo-1701383838063-ceb050928f24?crop=entropy&ixid=M3w0OTUyODh8MHwxfHNlYXJjaHw3fHxvaWwlMjByaWclMjBtYWludGVuYW5jZXxlbnwwfDB8fHwxNzYzMzE5MDMyfDA&ixlib=rb-4.1.0&w=600&q=80&auto=format&fit=crop',
                alt: 'an old rusted out truck with a number on it'
              },
              {
                title: 'Custom AI Solutions Development',
                desc: 'Design and implement tailored AI applications addressing specific challenges faced by oil and gas companies worldwide.',
                img: 'https://images.unsplash.com/photo-1721314787850-5745fdfb06b4?crop=entropy&ixid=M3w0OTUyODh8MHwxfHNlYXJjaHw3fHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlfGVufDB8MHx8fDE3NjMzNzMwNzh8MA&ixlib=rb-4.1.0&w=600&q=80&auto=format&fit=crop',
                alt: 'AI chip background'
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                className="card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="card-image-wrapper">
                  <img src={feature.img} alt={feature.alt} className="card-image" />
                </div>
                <h3 className="card-title">{feature.title}</h3>
                <p className="card-desc">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="section" style={{ backgroundColor: 'var(--surface)' }}>
        <div className="container">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Gallery
          </motion.h2>
          <GalleryCarousel />
        </div>
      </section>

      {/* Quote Banner Section */}
      <section className="quote-banner">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="quote-banner-content"
          >
            <h2 className="quote-banner-title">Empowering Oil & Gas with AI</h2>
            <p className="quote-banner-subtitle">Discover our expertise now!</p>
          </motion.div>
        </div>
      </section>

      {/* Image Banner Section */}
      <section className="image-banner">
        <div className="image-banner-bg" />
      </section>

      {/* Team Section */}
      <section id="team" className="section" style={{ backgroundColor: 'var(--background)' }}>
        <div className="container">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Team
          </motion.h2>
          <div className="grid">
            {[
              {
                name: 'Marcus Zou',
                role: 'Commercialisation Officer',
                bio: 'Marcus Zou, Senior Data Specialist and Commercialization Officer, Microsoft certified Cloud Engineer, brings 20 years of expertise in AI and machine learning applied to geoscience, reservoir modeling and predictive maintenance in the oil and gas sector.',
                img: 'https://cdn.soloist.ai/9a6cdcdf-8b81-4230-a673-75d77e3a7a88/6579892a-1466-44d5-a9b8-e34587dd8543_1040x1040.webp'
              },
              {
                name: 'Edward Zou',
                role: 'Business Portfolio Manager',
                bio: 'Edward Zou, Software Architect and Business Portfolio Manager, Microsoft Certified Cloud Developer, specializes in orchestrating software architecture, building scalable data solutions and integrating complex data for advanced analytics and operational optimization.',
                img: 'https://cdn.soloist.ai/9a6cdcdf-8b81-4230-a673-75d77e3a7a88/c9974234-a8b3-4d4d-ad52-138e1f64cd04_1040x1040.webp'
              }
            ].map((member, i) => (
              <motion.div 
                key={i}
                className="card team-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="team-image-wrapper">
                  <img src={member.img} alt={member.name} className="team-image" />
                </div>
                <h3 className="card-title" style={{ fontSize: '24px', textAlign: 'center' }}>{member.name}</h3>
                <h4 className="team-role">{member.role}</h4>
                <p className="card-desc" style={{ textAlign: 'center' }}>{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Article Section */}
      <section id="article" className="section article-section" style={{ backgroundColor: 'var(--surface)' }}>
        <div className="container article-grid">
          <motion.div 
            className="article-image-container"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <img 
              src="https://images.unsplash.com/photo-1646800864458-c4ea73403075?crop=entropy&ixid=M3w0OTUyODh8MHwxfHNlYXJjaHw3fHxEYXRhJTIwU2NpZW5jZSUyQyUyME9pbCUyMGFuZCUyMEdhcyUyMEluZHVzdHJ5JTJDJTIwQXJ0aWZpY2lhbCUyMEludGVsbGlnZW5jZSUyQyUyMENhbGdhcnl8ZW58MHwwfHx8MTc2MzQwMTc2OHww&ixlib=rb-4.1.0&w=1000&q=80&auto=format&fit=crop" 
              alt="a sunset in the background with oil industry elements" 
              className="article-image"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="article-content"
          >
            <h2 className="article-title">Alfazen Inc.: Pioneering Data Science Solutions in the Oil and Gas Industry</h2>
            
            <h3 className="article-heading">Expertise Rooted in Experience and Innovation</h3>
            <p className="article-text">
              Alfazen Inc., headquartered in Calgary, AB, brings over 20 years of unparalleled expertise in data science tailored specifically for the oil and gas sector. With a presence across multiple continents, our team combines deep industry knowledge with cutting-edge AI technologies to address the complex challenges faced by energy companies today. Our seasoned professionals understand the nuances of the oil and gas industry, enabling us to deliver insights that drive operational efficiency and strategic decision-making.
            </p>

            <h3 className="article-heading">Comprehensive Data Science Services</h3>
            <p className="article-text">
              We offer a suite of data science services designed to optimize exploration, production, and asset management processes. Our solutions encompass predictive analytics, machine learning models, and advanced data integration techniques that transform vast datasets into actionable intelligence. Whether it’s enhancing reservoir characterization, improving drilling accuracy, or optimizing supply chain logistics, Alfazen Inc. provides customized strategies that align with our clients’ unique needs and goals.
            </p>

            <h3 className="article-heading">Empowering the Industry with AI-Driven Solutions</h3>
            <p className="article-text">
              At Alfazen Inc., we are committed to harnessing the power of artificial intelligence to revolutionize the oil and gas industry. Our AI capabilities enable companies to anticipate market fluctuations, reduce operational risks, and increase sustainability through smarter resource management. By partnering with us, clients gain a competitive edge through innovative technology that not only addresses current challenges but also anticipates future opportunities in an ever-evolving energy landscape.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact-us" className="section" style={{ backgroundColor: 'var(--background)' }}>
        <div className="container">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Connect with Alfazen Inc.
          </motion.h2>
          
          <div className="contact-layout">
            <div className="contact-form-container">
              <ContactForm />
            </div>
            
            <motion.div 
              className="contact-map-container"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d160499.8519548483!2d-114.22858169999999!3d51.013117!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x537170039f843fd5%3A0x266d3bb1b652b63a!2sCalgary%2C%20AB!5e0!3m2!1sen!2sca!4v1718200000000!5m2!1sen!2sca" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Map of Calgary, AB, Canada"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-layout">
          <div className="footer-left">
            <button onClick={() => setShowDisclaimer(true)} className="footer-btn">
              Disclaimer
            </button>
          </div>
          <div className="footer-center">
            <p>@2026 Alfazen Inc. All rights reserved. The website is made with ❤️ Gemini 3.5 Flash ❤️</p>
          </div>
          <div className="footer-right">
            <a href="https://alfazen.org" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Website">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Twitter">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
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
    </main>
  );
}

