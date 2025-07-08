import { useEffect } from 'react';
import Hero3D from './components/Hero3D';
import About from './components/About';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Contact from './components/Contact';
import ErrorBoundary from './components/ErrorBoundary';
import { motion } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';

function App() {
  useEffect(() => {
    // Smooth scrolling for anchor links
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const id = target.getAttribute('href')?.slice(1);
        const element = document.getElementById(id || '');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <ErrorBoundary>
      <div style={{
        background: '#0c0c0c',
        color: 'white',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        {/* Navigation */}
        <nav style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: 'rgba(12, 12, 12, 0.9)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(74, 158, 255, 0.2)',
          padding: '1rem 2rem'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              style={{
                fontSize: '1.5rem',
                color: '#4a9eff',
                margin: 0,
                cursor: 'pointer'
              }}
              onClick={() => scrollToSection('hero')}
            >
              ValTech
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              style={{
                display: 'flex',
                gap: '2rem'
              }}
            >
              {['About', 'Skills', 'Experience', 'Contact'].map((item, index) => (
                <motion.button
                  key={item}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#e0e0e0',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    padding: '0.5rem 1rem',
                    borderRadius: '5px',
                    transition: 'all 0.3s ease'
                  }}
                  whileHover={{
                    color: '#4a9eff',
                    background: 'rgba(74, 158, 255, 0.1)'
                  }}
                >
                  {item}
                </motion.button>
              ))}
            </motion.div>
          </div>
        </nav>

        {/* Hero Section */}
        <section id="hero">
          <Hero3D />
        </section>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 1,
            y: [0, 10, 0]
          }}
          transition={{ 
            delay: 3,
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            cursor: 'pointer'
          }}
          onClick={() => scrollToSection('about')}
        >
          <FaChevronDown size={24} color="#4a9eff" />
        </motion.div>

        {/* About Section */}
        <section id="about">
          <About />
        </section>

        {/* Skills Section */}
        <section id="skills">
          <Skills />
        </section>

        {/* Experience Section */}
        <section id="experience">
          <Experience />
        </section>

        {/* Contact Section */}
        <section id="contact">
          <Contact />
        </section>

        {/* Footer */}
        <footer style={{
          background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 100%)',
          padding: '2rem',
          textAlign: 'center',
          borderTop: '1px solid rgba(74, 158, 255, 0.2)'
        }}>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            style={{
              color: '#a0a0a0',
              margin: 0
            }}
          >
            © 2024 David Uyi Val-Izevbigie. Built with React, Three.js, and a passion for innovation.
          </motion.p>
        </footer>
      </div>
    </ErrorBoundary>
  );
}

export default App;
