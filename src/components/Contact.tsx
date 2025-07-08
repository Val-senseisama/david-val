import { motion } from 'framer-motion';
import { usePortfolioData } from '../hooks/usePortfolioData';
import { Canvas } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import MoonModel from './MoonModel';
import { FaEnvelope, FaLinkedin, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { useState } from 'react';

export default function Contact() {
  const data = usePortfolioData();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data
    console.log('Form submitted:', formData);
    alert('Thank you for your message! I\'ll get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 100%)',
      color: 'white',
      padding: '4rem 2rem',
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
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <ambientLight intensity={0.3} />
          <Stars radius={80} depth={60} count={5000} factor={6} fade speed={1.2} />
          <MoonModel position={[0, 0, -3]} />
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
            fontSize: '3rem',
            textAlign: 'center',
            marginBottom: '4rem',
            color: '#4a9eff',
            textShadow: '0 0 20px rgba(74, 158, 255, 0.5)'
          }}
        >
          Let's Connect
        </motion.h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '4rem',
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
              padding: '2rem',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <h3 style={{
              fontSize: '1.8rem',
              marginBottom: '2rem',
              color: '#4a9eff'
            }}>
              Send a Message
            </h3>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#e0e0e0'
                }}>
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(74, 158, 255, 0.3)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                  placeholder="Your name"
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#e0e0e0'
                }}>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(74, 158, 255, 0.3)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                  placeholder="your.email@example.com"
                />
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#e0e0e0'
                }}>
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(74, 158, 255, 0.3)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '1rem',
                    resize: 'vertical'
                  }}
                  placeholder="Tell me about your project..."
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: 'linear-gradient(135deg, #4a9eff 0%, #357abd 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                Send Message
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
              fontSize: '1.8rem',
              marginBottom: '2rem',
              color: '#4a9eff'
            }}>
              Get in Touch
            </h3>

            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '15px',
              padding: '2rem',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              marginBottom: '2rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '1.5rem'
              }}>
                <FaEnvelope size={20} color="#4a9eff" />
                <div style={{ marginLeft: '1rem' }}>
                  <p style={{ color: '#e0e0e0', margin: 0 }}>Email</p>
                  <a 
                    href={`mailto:${data.email}`}
                    style={{ 
                      color: '#4a9eff', 
                      textDecoration: 'none',
                      fontSize: '1.1rem'
                    }}
                  >
                    {data.email}
                  </a>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '1.5rem'
              }}>
                <FaPhone size={20} color="#4a9eff" />
                <div style={{ marginLeft: '1rem' }}>
                  <p style={{ color: '#e0e0e0', margin: 0 }}>Phone</p>
                  <a 
                    href={`tel:${data.phone}`}
                    style={{ 
                      color: '#4a9eff', 
                      textDecoration: 'none',
                      fontSize: '1.1rem'
                    }}
                  >
                    {data.phone}
                  </a>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '1.5rem'
              }}>
                <FaMapMarkerAlt size={20} color="#4a9eff" />
                <div style={{ marginLeft: '1rem' }}>
                  <p style={{ color: '#e0e0e0', margin: 0 }}>Location</p>
                  <p style={{ color: '#4a9eff', margin: 0, fontSize: '1.1rem' }}>
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
                  <p style={{ color: '#e0e0e0', margin: 0 }}>LinkedIn</p>
                  <a 
                    href={data.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ 
                      color: '#4a9eff', 
                      textDecoration: 'none',
                      fontSize: '1.1rem'
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
                padding: '2rem',
                border: '1px solid rgba(74, 158, 255, 0.2)',
                textAlign: 'center'
              }}
            >
              <h4 style={{
                fontSize: '1.3rem',
                marginBottom: '1rem',
                color: '#4a9eff'
              }}>
                Ready to Build Together?
              </h4>
              <p style={{
                color: '#e0e0e0',
                lineHeight: '1.6'
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