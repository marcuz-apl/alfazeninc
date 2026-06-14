'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ContactForm from '@/components/ContactForm';
import GalleryCarousel from '@/components/GalleryCarousel';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function HomeClient() {

  // Dynamic Content States with Defaults
  const [hero, setHero] = useState({
    title: "Global AI Solutions for Oil & Gas",
    content: "With over 20 years of experience across multiple continents, Alfazen Inc. leverages advanced AI and data science to tackle the unique challenges of the oil and gas industry. Based in Calgary, AB, we deliver innovative solutions that optimize operations and drive industry progress. Partner with us to harness the power of AI for your energy needs.",
    show_contact_us: 1,
    background_type: "image",
    background_url: ""
  });
  
  const [servicesTitle, setServicesTitle] = useState("Alfazen Inc. Data Science Services for Oil & Gas");
  const [services, setServices] = useState<any[]>([
    {
      title: 'AI-Driven Reservoir Analysis',
      description: 'Utilize advanced AI models to optimize reservoir characterization and enhance extraction efficiency, minimizing operational risks.',
      image_url: 'https://images.unsplash.com/photo-1691505748956-2d02b6603e84?crop=entropy&ixid=M3w0OTUyODh8MHwxfHNlYXJjaHw0fHxvaWwlMjByZXNlcnZvaXJ8ZW58MHwwfHx8MTc2MzQwMTc2N3ww&ixlib=rb-4.1.0&w=600&q=80&auto=format&fit=crop',
      image_alt: 'a large field with a water tower in the middle of it'
    },
    {
      title: 'Predictive Maintenance Solutions',
      description: 'Implement machine learning algorithms to predict equipment failures and schedule proactive maintenance, reducing downtime.',
      image_url: 'https://images.unsplash.com/photo-1701383838063-ceb050928f24?crop=entropy&ixid=M3w0OTUyODh8MHwxfHNlYXJjaHw3fHxvaWwlMjByaWclMjBtYWludGVuYW5jZXxlbnwwfDB8fHwxNzYzMzE5MDMyfDA&ixlib=rb-4.1.0&w=600&q=80&auto=format&fit=crop',
      image_alt: 'an old rusted out truck with a number on it'
    },
    {
      title: 'Custom AI Solutions Development',
      description: 'Design and implement tailored AI applications addressing specific challenges faced by oil and gas companies worldwide.',
      image_url: 'https://images.unsplash.com/photo-1721314787850-5745fdfb06b4?crop=entropy&ixid=M3w0OTUyODh8MHwxfHNlYXJjaHw3fHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlfGVufDB8MHx8fDE3NjMzNzMwNzh8MA&ixlib=rb-4.1.0&w=600&q=80&auto=format&fit=crop',
      image_alt: 'AI chip background'
    }
  ]);
  
  const [gallerySettings, setGallerySettings] = useState({
    sliding_effect: "slide",
    autoplay_speed: 5000
  });
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [galleryItems, setGalleryItems] = useState<any[]>([
    {
      image_url: 'https://images.unsplash.com/photo-1695060601967-7fb135446f67?crop=entropy&ixid=M3w0OTUyODh8MHwxfHNlYXJjaHwxMXx8b2lsJTIwYW5kJTIwZ2FzJTIwaW5kdXN0cnklMjBkYXRhJTIwc2NpZW5jZSUyMEFJfGVufDB8MHx8fDE3NjM0MDE3NjF8MA&ixlib=rb-4.1.0&w=1400&q=80&auto=format&fit=crop',
      image_alt: 'A group of oil pumps sitting next to each other',
      category: 'oil-pumps'
    },
    {
      image_url: 'https://images.unsplash.com/photo-1729201754182-536252085563?crop=entropy&ixid=M3w0OTUyODh8MHwxfHNlYXJjaHw2fHxvaWwlMjBhbmYlMjBnYXMlMjBpbmR1c3RyeSUyMGRhdGElMjBzY2llbmNlJTIwQUl8ZW58MHwwfHx8MTc2MzQwMTc2MXww&ixlib=rb-4.1.0&w=1400&q=80&auto=format&fit=crop',
      image_alt: 'A black and white photo of an oil pump',
      category: 'oil-pumps'
    },
    {
      image_url: 'https://images.unsplash.com/photo-1646800864458-c4ea73403075?crop=entropy&ixid=M3w0OTUyODh8MHwxfHNlYXJjaHw1fHxvaWwlMjBhbmQlMjBnYXMlMjBpbmR1c3RyeSUyMGRhdGElMjBzY2llbmNlJTIwQUl8ZW58MHwwfHx8MTc2MzQwMTc2MXww&ixlib=rb-4.1.0&w=1400&q=80&auto=format&fit=crop',
      image_alt: 'Oil field operations during sunset',
      category: 'oil-pumps'
    },
    {
      image_url: 'https://images.unsplash.com/photo-1694039446022-2d227e8b104b?crop=entropy&ixid=M3w0OTUyODh8MHwxfHNlYXJjaHwxfHxvaWwlMjBhbmQlMjBnYXMlMjBpbmR1c3RyeSUyMGRhdGElMjBzY2llbmNlJTIwQUl8ZW58MHwwfHx8MTc2MzQwMTc2MXww&ixlib=rb-4.1.0&w=1400&q=80&auto=format&fit=crop',
      image_alt: 'Oil pumpjack working in remote landscape',
      category: 'oil-pumps'
    },
    {
      image_url: 'https://images.unsplash.com/photo-1596017264419-23e7af0e86db?crop=entropy&ixid=M3w0OTUyODh8MHwxfHNlYXJjaHw4fHxvaWwlMjBhbmQlMjBnYXMlMjBpbmR1c3RyeSUyMGRhdGElMjBzY2llbmNlJTIwQUl8ZW58MHwwfHx8MTc2MzQwMTc2MXww&ixlib=rb-4.1.0&w=1400&q=80&auto=format&fit=crop',
      image_alt: 'Sunset over industrial infrastructure',
      category: 'oil-pumps'
    },
    {
      image_url: 'https://images.unsplash.com/photo-1562237548-2e0fd9797537?crop=entropy&ixid=M3w0OTUyODh8MHwxfHNlYXJjaHw4fHxvaWwlMjBhbmQlMjBnYXMlMjBpbmR1c3RyeSUyMGRhdGElMjBzY2llbmNlJTIwQUl8ZW58MHwwfHx8MTc2MzQwMTc2MXww&ixlib=rb-4.1.0&w=1400&q=80&auto=format&fit=crop',
      image_alt: 'Active ERIELL drilling rig',
      category: 'oil-pumps'
    },
    {
      image_url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1400&auto=format&fit=crop',
      image_alt: 'AI Neural Network concept',
      category: 'ai-power'
    },
    {
      image_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1400&auto=format&fit=crop',
      image_alt: 'Artificial Intelligence brain',
      category: 'ai-power'
    },
    {
      image_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1400&auto=format&fit=crop',
      image_alt: 'Machine Learning code',
      category: 'ai-power'
    },
    {
      image_url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1400&auto=format&fit=crop',
      image_alt: 'Cybersecurity and Tech setup',
      category: 'ai-power'
    }
  ]);
  
  const [team, setTeam] = useState<any[]>([
    {
      name: 'Marcus Zou',
      role: 'Commercialisation Officer',
      bio: 'Marcus Zou, Senior Data Specialist and Commercialization Officer, Microsoft certified Cloud Engineer, brings 20 years of expertise in AI and machine learning applied to geoscience, reservoir modeling and predictive maintenance in the oil and gas sector.',
      image_url: 'https://cdn.soloist.ai/9a6cdcdf-8b81-4230-a673-75d77e3a7a88/6579892a-1466-44d5-a9b8-e34587dd8543_1040x1040.webp'
    },
    {
      name: 'Edward Zou',
      role: 'Business Portfolio Manager',
      bio: 'Edward Zou, Software Architect and Business Portfolio Manager, Microsoft Certified Cloud Developer, specializes in orchestrating software architecture, building scalable data solutions and integrating complex data for advanced analytics and operational optimization.',
      image_url: 'https://cdn.soloist.ai/9a6cdcdf-8b81-4230-a673-75d77e3a7a88/c9974234-a8b3-4d4d-ad52-138e1f64cd04_1040x1040.webp'
    }
  ]);
  
  const [articles, setArticles] = useState<any[]>([
    {
      title: "Alfazen Inc.: Pioneering Data Science Solutions in the Oil and Gas Industry",
      author: "Marcus Zou",
      published_date: "2026-06-12",
      image_url: "https://images.unsplash.com/photo-1646800864458-c4ea73403075?crop=entropy&ixid=M3w0OTUyODh8MHwxfHNlYXJjaHw3fHxEYXRhJTIwU2NpZW5jZSUyQyUyME9pbCUyMGFuZCUyMEdhcyUyMEluZHVzdHJ5JTJDJTIwQXJ0aWZpY2lhbCUyMEludGVsbGlnZW5jZSUyQyUyMENhbGdhcnl8ZW58MHwwfHx8MTc2MzQwMTc2OHww&ixlib=rb-4.1.0&w=1000&q=80&auto=format&fit=crop",
      image_alt: "a sunset in the background with oil industry elements",
      paragraphs: [
        {
          heading: "Expertise Rooted in Experience and Innovation",
          text: "Alfazen Inc., headquartered in Calgary, AB, brings over 20 years of unparalleled expertise in data science tailored specifically for the oil and gas sector. With a presence across multiple continents, our team combines deep industry knowledge with cutting-edge AI technologies to address the complex challenges faced by energy companies today."
        },
        {
          heading: "Comprehensive Data Science Services",
          text: "We offer a suite of data science services designed to optimize exploration, production, and asset management processes. Our solutions encompass predictive analytics, machine learning models, and advanced data integration techniques."
        }
      ]
    }
  ]);

  // Load Content from API
  useEffect(() => {
    fetch('/api/content')
      .then((res) => res.json())
      .then((data) => {
        if (data.hero) setHero(data.hero);
        if (data.servicesSettings?.title) setServicesTitle(data.servicesSettings.title);
        if (data.services && data.services.length > 0) setServices(data.services);
        if (data.gallerySettings) setGallerySettings(data.gallerySettings);
        if (data.gallery && data.gallery.length > 0) setGalleryItems(data.gallery);
        if (data.team && data.team.length > 0) setTeam(data.team);
        if (data.articles && data.articles.length > 0) setArticles(data.articles);
      })
      .catch((err) => console.error('Error loading landing page content:', err));
  }, []);

  return (
    <main>
      <Header />

      {/* Hero Section */}
      <section className="hero-section" id="home">
        <div className="hero-bg-wrapper">
          {hero.background_type === 'video' ? (
            <video
              src={hero.background_url || '/images/hero/hero_bg.mp4'}
              autoPlay
              loop
              muted
              playsInline
              className="hero-bg-image"
              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
            />
          ) : (
            <div 
              className="hero-bg-image" 
              style={hero.background_url ? { backgroundImage: `url(${hero.background_url})` } : undefined}
            />
          )}
          <div className="hero-overlay" />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container hero-content"
        >
          <h1 className="hero-title">{hero.title}</h1>
          <p className="hero-subtitle">{hero.content}</p>
          
          {hero.show_contact_us === 1 && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <a href="#contact-us" className="btn btn-lg">
                Partner with Us
              </a>
            </motion.div>
          )}
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
            {servicesTitle}
          </motion.h2>
          <div className="grid">
            {services.map((feature, i) => (
              <motion.div 
                key={feature.id || i}
                className="card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="card-image-wrapper">
                  <img src={feature.image_url} alt={feature.image_alt} className="card-image" />
                </div>
                <h3 className="card-title">{feature.title}</h3>
                <p className="card-desc">{feature.description}</p>
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
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '32px' }}>
            <button 
              onClick={() => setActiveCategory('all')}
              className={`btn ${activeCategory === 'all' ? '' : 'btn-secondary'}`}
            >
              All
            </button>
            <button 
              onClick={() => setActiveCategory('oil-pumps')}
              className={`btn ${activeCategory === 'oil-pumps' ? '' : 'btn-secondary'}`}
            >
              Oil Pumps
            </button>
            <button 
              onClick={() => setActiveCategory('ai-power')}
              className={`btn ${activeCategory === 'ai-power' ? '' : 'btn-secondary'}`}
            >
              AI Power
            </button>
          </div>

          <GalleryCarousel 
            images={galleryItems.filter(item => activeCategory === 'all' || item.category === activeCategory).map(item => ({ src: item.image_url, alt: item.image_alt }))}
            slidingEffect={gallerySettings.sliding_effect as 'slide' | 'fade'}
            autoplaySpeed={gallerySettings.autoplay_speed}
          />
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
            {team.map((member, i) => (
              <motion.div 
                key={member.id || i}
                className="card team-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="team-image-wrapper">
                  <img 
                    src={member.image_url} 
                    alt={member.name} 
                    className="team-image" 
                    style={{
                      transform: `scale(${member.image_zoom || 1}) translate(${member.image_x || 0}px, ${member.image_y || 0}px)`,
                      filter: `blur(${member.image_blur || 0}px)`,
                      transformOrigin: 'center center',
                      transition: 'transform 0.2s ease, filter 0.2s ease'
                    }}
                  />
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
        <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}>
          {articles.map((post, index) => (
            <div 
              key={post.id || index}
              className="article-grid"
              style={{
                display: 'grid',
                gap: '32px',
                alignItems: 'center'
              }}
            >
              {/* Image Column */}
              <motion.div 
                className="article-image-container"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                style={{ order: index % 2 === 1 ? 2 : 1 }}
              >
                <img 
                  src={post.image_url} 
                  alt={post.image_alt} 
                  className="article-image"
                />
              </motion.div>
              
              {/* Content Column */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="article-content"
                style={{ order: index % 2 === 1 ? 1 : 2 }}
              >
                <Link href={`/articles/${post.id}`} style={{ textDecoration: 'none' }}>
                  <h2 className="article-title">{post.title}</h2>
                </Link>
                {post.author && (
                  <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px', fontStyle: 'italic', marginTop: '-12px' }}>
                    By {post.author} {post.published_date && `| ${post.published_date}`}
                  </p>
                )}
                {post.paragraphs && post.paragraphs.map((para: any, i: number) => (
                  <React.Fragment key={i}>
                    {para.heading && <h3 className="article-heading" style={{ marginTop: '16px' }}>{para.heading}</h3>}
                    <p className="article-text">{para.text}</p>
                  </React.Fragment>
                ))}
              </motion.div>
            </div>
          ))}
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
                allowFullScreen
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Map of Calgary, AB, Canada"
                suppressHydrationWarning
              />
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
