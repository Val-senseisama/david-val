import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Hero3D from './components/Hero3D';
import ErrorBoundary from './components/ErrorBoundary';
import About from './components/About';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Contact from './components/Contact';
import Inventory from './pages/Inventory';
import SalesForecast from './pages/SalesForecast';
import MultiVendor from './pages/MultiVendor/index';
import GoalQuest from './pages/GoalQuest/GoalQuest';
import MindMap from './pages/MindMap/MindMap';
import ShardSpace from './pages/ShardSpace/ShardSpace';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaBars, FaTimes } from 'react-icons/fa';
import Showcase from './components/Showcase';
import { useSEO } from './hooks/useSEO';

// Throttle function to limit scroll event frequency
const throttle = (func: Function, limit: number) => {
  let inThrottle: boolean;
  return function(this: any, ...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
};

function PortfolioApp() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  // SEO for main portfolio page
  useSEO({
    title: 'David Uyi Val-Izevbigie - Fullstack Developer | ValTech',
    description: 'David Uyi Val-Izevbigie is a passionate Fullstack Developer specializing in React, Three.js, and modern web technologies. Building innovative solutions for Earth, from Space.',
    keywords: 'Fullstack Developer, React, Three.js, Web Development, Portfolio, David Val-Izevbigie, ValTech',
    ogUrl: 'https://david-val.vercel.app/',
    ogImage: 'https://david-val.vercel.app/og-image.jpg',
    canonical: 'https://david-val.vercel.app/'
  });

  useEffect(() => {
    // Check screen size on mount and resize
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Throttled scroll handler to prevent interference with 3D rendering
  useEffect(() => {
    const handleScroll = throttle(() => {
      // This prevents scroll events from interfering with 3D rendering
      // The throttling ensures smooth scrolling without overwhelming the GPU
      // No additional logic needed - just prevent interference
    }, 16); // ~60fps

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Use simple scrollIntoView since CSS scroll-margin-top handles the offset
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    // Close mobile menu after navigation
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navigationItems = ['About', 'Skills', 'Experience', 'Showcase', 'Contact'];

  // Don't show navigation for project pages
  if (location.pathname !== '/') {
    return (
      <ErrorBoundary>
        <Routes>
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/sales-forecast" element={<SalesForecast />} />
          <Route path="/multivendor" element={<MultiVendor />} />
          <Route path="/goal-quest" element={<GoalQuest />} />
          <Route path="/mind-map" element={<MindMap />} />
          <Route path="/shardspace" element={<ShardSpace />} />
          <Route path="/shardspace/:shardId" element={<ShardSpace />} />
        </Routes>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div style={{
        background: '#0c0c0c',
        color: 'white',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        scrollBehavior: 'smooth',
        overflow: 'visible',
        minHeight: '100vh'
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
          padding: 'clamp(0.75rem, 2vw, 1rem) clamp(1rem, 3vw, 2rem)',
          width: '100%',
          maxWidth: '100vw',
          boxSizing: 'border-box'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%'
          }}>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              style={{
                fontSize: 'clamp(1.2rem, 4vw, 1.5rem)',
                color: '#4a9eff',
                margin: 0,
                cursor: 'pointer'
              }}
              onClick={() => scrollToSection('hero')}
            >
              ValTech
            </motion.h1>

            {/* Desktop Navigation */}
            {!isMobile && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                style={{
                  display: 'flex',
                  gap: '2rem'
                }}
              >
                {navigationItems.map((item, index) => (
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
            )}

            {/* Mobile Hamburger Menu Button */}
            {isMobile && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={toggleMobileMenu}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#4a9eff',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  borderRadius: '5px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem'
                }}
                whileHover={{
                  background: 'rgba(74, 158, 255, 0.1)'
                }}
                whileTap={{ scale: 0.95 }}
              >
                {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
              </motion.button>
            )}
          </div>

          {/* Mobile Menu Overlay */}
          <AnimatePresence>
            {isMobileMenuOpen && isMobile && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  background: 'rgba(12, 12, 12, 0.95)',
                  backdropFilter: 'blur(15px)',
                  borderTop: '1px solid rgba(74, 158, 255, 0.2)',
                  overflow: 'hidden'
                }}
              >
                <div style={{
                  padding: 'clamp(0.75rem, 2vw, 1rem) clamp(1rem, 3vw, 2rem)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}>
                  {navigationItems.map((item, index) => (
                    <motion.button
                      key={item}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => scrollToSection(item.toLowerCase())}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#e0e0e0',
                        fontSize: '1.1rem',
                        cursor: 'pointer',
                        padding: '1rem',
                        borderRadius: '8px',
                        textAlign: 'left',
                        transition: 'all 0.3s ease',
                        borderBottom: '1px solid rgba(74, 158, 255, 0.1)'
                      }}
                      whileHover={{
                        color: '#4a9eff',
                        background: 'rgba(74, 158, 255, 0.1)',
                        paddingLeft: '1.5rem'
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {item}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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

        {/* Showcase Section */}
        <section id="showcase">
          <Showcase />
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PortfolioApp />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/sales-forecast" element={<SalesForecast />} />
        <Route path="/multivendor" element={<MultiVendor />} />
        <Route path="/goal-quest" element={<GoalQuest />} />
        <Route path="/mind-map" element={<MindMap />} />
        <Route path="/shardspace" element={<ShardSpace />} />
        <Route path="/shardspace/:shardId" element={<ShardSpace />} />
      </Routes>
    </Router>
  );
}

export default App;
 