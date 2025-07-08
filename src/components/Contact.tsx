import { motion } from 'framer-motion';
import { usePortfolioData } from '../hooks/usePortfolioData';
import { Canvas } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import SatelliteModel from './SatelliteModel';
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
      // Send email to yourself (David)
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_contact',
        import.meta.env.VITE_EMAILJS_TEMPLATE_TO_YOU || 'template_to_you',
        formRef.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      // Send confirmation email to the sender
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_contact',
        import.meta.env.VITE_EMAILJS_TEMPLATE_TO_SENDER || 'template_to_sender',
        formRef.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      setSubmitStatus('success');
      formRef.current.reset();
      
      // Reset status after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);

    } catch (error) {
      console.error('Failed to send email:', error);
      setSubmitStatus('error');
      
      // Reset status after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 100%)',
      color: 'white',
      padding: 'clamp(2rem, 5vw, 4rem) clamp(1rem, 3vw, 2rem)',
      position: 'relative'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1
      }}>
        <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 75 }}>
          <ambientLight intensity={0.3} />
          <Stars radius={80} depth={60} count={5000} factor={6} fade speed={1.2} />
          <SatelliteModel position={[0, 0, -3]} />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.2} />
        </Canvas>
      </div>

      <div style={{
        position: 'relative',
        zIndex: 2,
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <motion.h2
          initial={{ y: -50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          style={{
            fontSize: 'clamp(2rem, 6vw, 3rem)',
            textAlign: 'center',
            marginBottom: 'clamp(2rem, 5vw, 4rem)',
            color: '#4a9eff',
            textShadow: '0 0 20px rgba(74, 158, 255, 0.5)'
          }}
        >
          Let's Connect
        </motion.h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'clamp(2rem, 4vw, 4rem)',
          alignItems: 'start'
        }}>
          {/* Contact Form */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '15px',
              padding: 'clamp(1.5rem, 3vw, 2rem)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <h3 style={{
              fontSize: 'clamp(1.4rem, 3.5vw, 1.8rem)',
              marginBottom: 'clamp(1.5rem, 3vw, 2rem)',
              color: '#4a9eff'
            }}>
              Send a Message
            </h3>

            <form ref={formRef} onSubmit={handleSubmit}>
              <div style={{ marginBottom: 'clamp(1rem, 2.5vw, 1.5rem)' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#e0e0e0',
                  fontSize: 'clamp(0.9rem, 2.5vw, 1rem)'
                }}>
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  style={{
                    width: '100%',
                    padding: 'clamp(0.6rem, 2vw, 0.8rem)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(74, 158, 255, 0.3)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: 'clamp(0.9rem, 2.5vw, 1rem)'
                  }}
                  placeholder="Your name"
                />
              </div>

              <div style={{ marginBottom: 'clamp(1rem, 2.5vw, 1.5rem)' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#e0e0e0',
                  fontSize: 'clamp(0.9rem, 2.5vw, 1rem)'
                }}>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  style={{
                    width: '100%',
                    padding: 'clamp(0.6rem, 2vw, 0.8rem)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(74, 158, 255, 0.3)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: 'clamp(0.9rem, 2.5vw, 1rem)'
                  }}
                  placeholder="your.email@example.com"
                />
              </div>

              <div style={{ marginBottom: 'clamp(1.5rem, 3vw, 2rem)' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#e0e0e0',
                  fontSize: 'clamp(0.9rem, 2.5vw, 1rem)'
                }}>
                  Message
                </label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  style={{
                    width: '100%',
                    padding: 'clamp(0.6rem, 2vw, 0.8rem)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(74, 158, 255, 0.3)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
                    resize: 'vertical'
                  }}
                  placeholder="Tell me about your project..."
                />
              </div>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    background: 'rgba(34, 197, 94, 0.1)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    borderRadius: '8px',
                    padding: 'clamp(0.75rem, 2vw, 1rem)',
                    marginBottom: 'clamp(0.75rem, 2vw, 1rem)',
                    color: '#22c55e',
                    fontSize: 'clamp(0.85rem, 2.5vw, 1rem)'
                  }}
                >
                  ✅ Thank you! Your message has been sent successfully. I'll get back to you soon!
                </motion.div>
              )}

              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '8px',
                    padding: 'clamp(0.75rem, 2vw, 1rem)',
                    marginBottom: 'clamp(0.75rem, 2vw, 1rem)',
                    color: '#ef4444',
                    fontSize: 'clamp(0.85rem, 2.5vw, 1rem)'
                  }}
                >
                  ❌ Sorry, there was an error sending your message. Please try again or contact me directly.
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={!isSubmitting ? { scale: 1.05 } : {}}
                whileTap={!isSubmitting ? { scale: 0.95 } : {}}
                style={{
                  width: '100%',
                  padding: 'clamp(0.8rem, 2.5vw, 1rem)',
                  background: isSubmitting 
                    ? 'rgba(74, 158, 255, 0.5)' 
                    : 'linear-gradient(135deg, #4a9eff 0%, #357abd 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: 'clamp(1rem, 2.5vw, 1.1rem)',
                  fontWeight: 'bold',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <h3 style={{
              fontSize: 'clamp(1.4rem, 3.5vw, 1.8rem)',
              marginBottom: 'clamp(1.5rem, 3vw, 2rem)',
              color: '#4a9eff'
            }}>
              Get in Touch
            </h3>

            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '15px',
              padding: 'clamp(1.5rem, 3vw, 2rem)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              marginBottom: 'clamp(1.5rem, 3vw, 2rem)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: 'clamp(1rem, 2.5vw, 1.5rem)'
              }}>
                <FaEnvelope size={20} color="#4a9eff" />
                <div style={{ marginLeft: '1rem' }}>
                  <p style={{ 
                    color: '#e0e0e0', 
                    margin: 0,
                    fontSize: 'clamp(0.85rem, 2.5vw, 1rem)'
                  }}>Email</p>
                  <a 
                    href={`mailto:${data.email}`}
                    style={{ 
                      color: '#4a9eff', 
                      textDecoration: 'none',
                      fontSize: 'clamp(1rem, 2.5vw, 1.1rem)'
                    }}
                  >
                    {data.email}
                  </a>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: 'clamp(1rem, 2.5vw, 1.5rem)'
              }}>
                <FaPhone size={20} color="#4a9eff" />
                <div style={{ marginLeft: '1rem' }}>
                  <p style={{ 
                    color: '#e0e0e0', 
                    margin: 0,
                    fontSize: 'clamp(0.85rem, 2.5vw, 1rem)'
                  }}>Phone</p>
                  <a 
                    href={`tel:${data.phone}`}
                    style={{ 
                      color: '#4a9eff', 
                      textDecoration: 'none',
                      fontSize: 'clamp(1rem, 2.5vw, 1.1rem)'
                    }}
                  >
                    {data.phone}
                  </a>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: 'clamp(1rem, 2.5vw, 1.5rem)'
              }}>
                <FaMapMarkerAlt size={20} color="#4a9eff" />
                <div style={{ marginLeft: '1rem' }}>
                  <p style={{ 
                    color: '#e0e0e0', 
                    margin: 0,
                    fontSize: 'clamp(0.85rem, 2.5vw, 1rem)'
                  }}>Location</p>
                  <p style={{ 
                    color: '#4a9eff', 
                    margin: 0, 
                    fontSize: 'clamp(1rem, 2.5vw, 1.1rem)'
                  }}>
                    {data.location}
                  </p>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center'
              }}>
                <FaLinkedin size={20} color="#4a9eff" />
                <div style={{ marginLeft: '1rem' }}>
                  <p style={{ 
                    color: '#e0e0e0', 
                    margin: 0,
                    fontSize: 'clamp(0.85rem, 2.5vw, 1rem)'
                  }}>LinkedIn</p>
                  <a 
                    href={data.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ 
                      color: '#4a9eff', 
                      textDecoration: 'none',
                      fontSize: 'clamp(1rem, 2.5vw, 1.1rem)'
                    }}
                  >
                    Connect on LinkedIn
                  </a>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              viewport={{ once: true }}
              style={{
                background: 'rgba(74, 158, 255, 0.05)',
                borderRadius: '15px',
                padding: 'clamp(1.5rem, 3vw, 2rem)',
                border: '1px solid rgba(74, 158, 255, 0.2)',
                textAlign: 'center'
              }}
            >
              <h4 style={{
                fontSize: 'clamp(1.1rem, 3vw, 1.3rem)',
                marginBottom: 'clamp(0.75rem, 2vw, 1rem)',
                color: '#4a9eff'
              }}>
                Ready to Build Together?
              </h4>
              <p style={{
                color: '#e0e0e0',
                lineHeight: '1.6',
                fontSize: 'clamp(0.9rem, 2.5vw, 1rem)'
              }}>
                Whether you need a full-stack developer for your next project, 
                want to discuss potential collaborations, or just want to say hello, 
                I'd love to hear from you!
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 