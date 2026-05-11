import { motion } from 'framer-motion';
import { usePortfolioData } from '../hooks/usePortfolioData';
import { FaEnvelope, FaLinkedin, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';

export default function Contact() {
  const data = usePortfolioData();
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    if (!formRef.current) return;
    try {
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_contact',
        import.meta.env.VITE_EMAILJS_TEMPLATE_TO_YOU || 'template_to_you',
        formRef.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_contact',
        import.meta.env.VITE_EMAILJS_TEMPLATE_TO_SENDER || 'template_to_sender',
        formRef.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
      setSubmitStatus('success');
      formRef.current.reset();
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error) {
      console.error('Failed to send email:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.8rem 1rem',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(212,175,55,0.2)',
    borderRadius: '8px',
    color: 'white',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  };

  const contactLinks = [
    { icon: <FaEnvelope size={16} />, label: 'Email', value: data.email, href: `mailto:${data.email}` },
    { icon: <FaPhone size={16} />, label: 'Phone', value: data.phone, href: `tel:${data.phone}` },
    { icon: <FaMapMarkerAlt size={16} />, label: 'Location', value: data.location, href: null },
    { icon: <FaLinkedin size={16} />, label: 'LinkedIn', value: 'Connect on LinkedIn', href: data.linkedin },
  ];

  return (
    <section id="contact" style={{
      minHeight: '100vh',
      background: '#050505',
      color: 'white',
      position: 'relative',
      overflow: 'hidden',
      padding: 'clamp(3rem, 6vw, 5rem) clamp(1rem, 3vw, 2rem)',
    }}>
      {/* Dot grid bg */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        backgroundImage: 'radial-gradient(circle, rgba(212,175,55,0.1) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        pointerEvents: 'none',
      }} />
      {/* Radial gold glow center-right */}
      <div style={{
        position: 'absolute', top: '20%', right: '-15%', zIndex: 0,
        width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(212,175,55,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 2, maxWidth: '1100px', margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 'clamp(2.5rem, 5vw, 4rem)' }}
        >
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#D4AF37', marginBottom: '0.75rem', fontWeight: 600 }}>
            Let's Talk
          </p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)', fontWeight: 800, color: '#fff', marginBottom: '1rem' }}>
            Let's build something that scales.
          </h2>
          <p style={{ color: '#888', fontSize: 'clamp(0.9rem, 2vw, 1rem)', maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 }}>
            Whether you have a project in mind, a role to fill, or just want to say hello — I'd love to hear from you.
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'clamp(2rem, 4vw, 4rem)',
          alignItems: 'start',
        }}>
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(212,175,55,0.15)',
              borderRadius: '16px',
              padding: 'clamp(1.5rem, 3vw, 2rem)',
            }}
          >
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#D4AF37', marginBottom: '1.5rem' }}>Send a Message</h3>
            <form ref={formRef} onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1.2rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Name</label>
                <input type="text" name="name" required placeholder="Your name" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'rgba(212,175,55,0.6)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(212,175,55,0.2)'}
                />
              </div>
              <div style={{ marginBottom: '1.2rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Email</label>
                <input type="email" name="email" required placeholder="your@email.com" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'rgba(212,175,55,0.6)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(212,175,55,0.2)'}
                />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Message</label>
                <textarea name="message" required rows={5} placeholder="Tell me about your project..." style={{ ...inputStyle, resize: 'vertical' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(212,175,55,0.6)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(212,175,55,0.2)'}
                />
              </div>

              {submitStatus === 'success' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '8px', padding: '0.8rem 1rem', marginBottom: '1rem', color: '#22c55e', fontSize: '0.88rem' }}>
                  Message sent! I'll get back to you shortly.
                </motion.div>
              )}
              {submitStatus === 'error' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '8px', padding: '0.8rem 1rem', marginBottom: '1rem', color: '#ef4444', fontSize: '0.88rem' }}>
                  Failed to send. Please try again or contact me directly.
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                whileTap={!isSubmitting ? { scale: 0.97 } : {}}
                style={{
                  width: '100%',
                  padding: '0.9rem',
                  background: isSubmitting ? 'rgba(212,175,55,0.4)' : 'linear-gradient(135deg, #D4AF37, #B8860B)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#050505',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  letterSpacing: '0.03em',
                }}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </motion.button>
            </form>
          </motion.div>

          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#D4AF37', marginBottom: '1.5rem' }}>Direct Contact</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {contactLinks.map(({ icon, label, value, href }) => (
                <div key={label} style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(212,175,55,0.12)',
                  borderRadius: '12px',
                  padding: '1rem 1.25rem',
                }}>
                  <span style={{ color: '#D4AF37', flexShrink: 0 }}>{icon}</span>
                  <div>
                    <p style={{ fontSize: '0.7rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 0.2rem' }}>{label}</p>
                    {href ? (
                      <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                        style={{ color: '#ccc', fontSize: '0.9rem', textDecoration: 'none', transition: 'color 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#D4AF37'}
                        onMouseLeave={e => e.currentTarget.style.color = '#ccc'}
                      >{value}</a>
                    ) : (
                      <p style={{ color: '#ccc', fontSize: '0.9rem', margin: 0 }}>{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
