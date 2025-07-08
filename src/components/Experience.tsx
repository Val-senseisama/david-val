import { motion } from 'framer-motion';
import { usePortfolioData } from '../hooks/usePortfolioData';
import { Canvas } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import SpaceshipModel from './SpaceshipModel';
import { FaBriefcase, FaCalendar, FaMapMarkerAlt } from 'react-icons/fa';
import { useState, useEffect } from 'react';

export default function Experience() {
  const data = usePortfolioData();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <section style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #16213e 0%, #0c0c0c 100%)',
      color: 'white',
      padding: 'clamp(2rem, 5vw, 4rem) clamp(1rem, 3vw, 2rem)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1
      }}>
        <Canvas 
          camera={{ position: [0, 0, 5], fov: 75 }}
          dpr={[1, 1.5]}
          gl={{ 
            antialias: true,
            alpha: true,
            powerPreference: "default",
            preserveDrawingBuffer: false,
            failIfMajorPerformanceCaveat: false
          }}
          onError={(error) => {
            console.error('Experience Canvas error:', error);
          }}
        >
          <ambientLight intensity={0.3} />
          <Stars radius={70} depth={50} count={1500} factor={4} fade speed={0.5} />
          <SpaceshipModel position={[4, 2, -3]} />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.25} />
        </Canvas>
      </div>

      <div style={{
        position: 'relative',
        zIndex: 2,
        maxWidth: '1000px',
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
          Experience Journey
        </motion.h2>

        <div style={{
          position: 'relative'
        }}>
          {/* Timeline line - only shown on desktop */}
          {isDesktop && (
            <div style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              bottom: 0,
              width: '2px',
              background: 'linear-gradient(180deg, #4a9eff 0%, transparent 100%)',
              transform: 'translateX(-50%)',
              zIndex: 1
            }} />
          )}

          {data.experience.map((exp, index) => (
            <motion.div
              key={`${exp.company}-${exp.role}`}
              initial={{ x: index % 2 === 0 ? -100 : 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.3, duration: 0.8 }}
              viewport={{ once: true }}
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: 'clamp(2rem, 4vw, 3rem)',
                position: 'relative',
                zIndex: 2
              }}
            >
              <div style={{
                width: '100%',
                maxWidth: '500px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '15px',
                padding: 'clamp(1.5rem, 3vw, 2rem)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                position: 'relative',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 15px 30px rgba(74, 158, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              >
                {/* Timeline dot - only shown on desktop */}
                {isDesktop && (
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    right: '-60px',
                    width: '20px',
                    height: '20px',
                    background: '#4a9eff',
                    borderRadius: '50%',
                    transform: 'translateY(-50%)',
                    boxShadow: '0 0 20px rgba(74, 158, 255, 0.8)',
                    zIndex: 3
                  }} />
                )}

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: 'clamp(0.75rem, 2vw, 1rem)',
                  color: '#4a9eff'
                }}>
                  <FaBriefcase size={20} />
                  <h3 style={{
                    fontSize: 'clamp(1.1rem, 3vw, 1.4rem)',
                    marginLeft: '0.5rem',
                    color: '#4a9eff'
                  }}>
                    {exp.role}
                  </h3>
                </div>

                <h4 style={{
                  fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
                  marginBottom: '0.5rem',
                  color: '#e0e0e0'
                }}>
                  {exp.company}
                </h4>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '0.5rem',
                  color: '#a0a0a0',
                  fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)'
                }}>
                  <FaCalendar size={14} />
                  <span style={{ marginLeft: '0.5rem' }}>{exp.duration}</span>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: 'clamp(1rem, 2.5vw, 1.5rem)',
                  color: '#a0a0a0',
                  fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)'
                }}>
                  <FaMapMarkerAlt size={14} />
                  <span style={{ marginLeft: '0.5rem' }}>{exp.location}</span>
                </div>

                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 'clamp(0.4rem, 1.5vw, 0.5rem)',
                  marginBottom: 'clamp(1rem, 2.5vw, 1.5rem)'
                }}>
                  {exp.technologies.map((tech, techIndex) => (
                    <motion.span
                      key={tech}
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.3 + techIndex * 0.1, duration: 0.5 }}
                      viewport={{ once: true }}
                      style={{
                        background: 'rgba(74, 158, 255, 0.1)',
                        border: '1px solid rgba(74, 158, 255, 0.3)',
                        borderRadius: '15px',
                        padding: 'clamp(0.25rem, 1.5vw, 0.3rem) clamp(0.6rem, 2vw, 0.8rem)',
                        fontSize: 'clamp(0.7rem, 2.5vw, 0.8rem)',
                        color: '#4a9eff'
                      }}
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>

                <ul style={{
                  listStyle: 'none',
                  padding: 0
                }}>
                  {exp.achievements.map((achievement, achievementIndex) => (
                    <motion.li
                      key={achievement}
                      initial={{ x: -20, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.3 + achievementIndex * 0.1, duration: 0.6 }}
                      viewport={{ once: true }}
                      style={{
                        marginBottom: 'clamp(0.6rem, 2vw, 0.8rem)',
                        paddingLeft: 'clamp(1rem, 3vw, 1.5rem)',
                        position: 'relative',
                        lineHeight: '1.6',
                        color: '#e0e0e0',
                        fontSize: 'clamp(0.9rem, 2.5vw, 1rem)'
                      }}
                    >
                      <div style={{
                        position: 'absolute',
                        left: 0,
                        top: '0.5rem',
                        width: '6px',
                        height: '6px',
                        background: '#4a9eff',
                        borderRadius: '50%'
                      }} />
                      {achievement}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          viewport={{ once: true }}
          style={{
            textAlign: 'center',
            marginTop: 'clamp(2rem, 5vw, 4rem)',
            padding: 'clamp(1.5rem, 3vw, 2rem)',
            background: 'rgba(74, 158, 255, 0.05)',
            borderRadius: '15px',
            border: '1px solid rgba(74, 158, 255, 0.2)'
          }}
        >
          <h3 style={{
            fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
            marginBottom: 'clamp(0.75rem, 2vw, 1rem)',
            color: '#4a9eff'
          }}>
            Continuous Growth & Innovation
          </h3>
          <p style={{
            color: '#e0e0e0',
            fontSize: 'clamp(1rem, 2.5vw, 1.1rem)',
            lineHeight: '1.6'
          }}>
            From freelance development to building enterprise-grade ERP systems, 
            each experience has shaped my expertise in creating solutions that 
            bridge the gap between cutting-edge technology and practical business needs.
          </p>
        </motion.div>
      </div>
    </section>
  );
} 