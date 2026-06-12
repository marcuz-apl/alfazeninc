'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      message: formData.get('message'),
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setStatus('success');
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="card contact-form-card"
    >
      <h3 style={{ fontSize: '24px', marginBottom: '24px', textAlign: 'center' }}>Get in Touch</h3>
      {status === 'success' ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          style={{ padding: '24px', backgroundColor: 'rgba(42, 195, 162, 0.1)', color: '#2ac3a2', borderRadius: '8px', textAlign: 'center' }}
        >
          Thank you! Your message has been received successfully.
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label htmlFor="name" className="label">Name *</label>
            <input type="text" id="name" name="name" required className="input" placeholder="Your Name" />
          </div>
          <div>
            <label htmlFor="email" className="label">Email address *</label>
            <input type="email" id="email" name="email" required className="input" placeholder="your@email.com" />
          </div>
          <div>
            <label htmlFor="phone" className="label">Phone number</label>
            <input type="tel" id="phone" name="phone" className="input" placeholder="Your Phone Number" />
          </div>
          <div>
            <label htmlFor="message" className="label">Message *</label>
            <textarea id="message" name="message" rows={5} required className="input" placeholder="How can we help you?" style={{ resize: 'vertical' }}></textarea>
          </div>
          <button type="submit" className="btn" disabled={status === 'loading'} style={{ marginTop: '8px' }}>
            {status === 'loading' ? 'Sending...' : 'Send Message'}
          </button>
          {status === 'error' && (
            <p style={{ color: 'var(--accent)', marginTop: '8px', textAlign: 'center' }}>Failed to send message. Please try again.</p>
          )}
        </form>
      )}
    </motion.div>
  );
}
