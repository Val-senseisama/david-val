import { motion } from 'framer-motion';
import { usePortfolioData } from '../hooks/usePortfolioData';
import { Canvas } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import SpaceRoverModel from './SpaceRoverModel';
import { FaCode, FaDatabase, FaTools, FaRocket } from 'react-icons/fa';
import { Suspense } from 'react';

export default function Skills() {
  const data = usePortfolioData();

  const skillCategories = [
    {
      title: 'Languages & Frameworks',
      icon: <FaCode size={24} />,
      skills: data.skills.languagesAndFrameworks
    },
    {
      title: 'Databases',
      icon: <FaDatabase size={24} />,
      skills: data.skills.databases
    },
    {
      title: 'Tools & Platforms',
      icon: <FaTools size={24} />,
      skills: data.skills.toolsPlatforms
    },
    {
      title: 'Specialties',
      icon: <FaRocket size={24} />,
      skills: data.skills.specialties
    }
  ];

  return (
    <section style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
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
        <Canvas 
          camera={{ position: [0, 0, 5], fov: 75 }}
          gl={{ 
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
          }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.3} />
            <Stars radius={60} depth={40} count={2000} factor={4} fade speed={0.8} />
            <SpaceRoverModel position={[-3, 0, -2]} />
            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.2} />
          </Suspense>
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
            marginBottom: '3rem',
            color: '#4a9eff',
            textShadow: '0 0 20px rgba(74, 158, 255, 0.5)'
          }}
        >
          Skills & Technologies
        </motion.h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem'
        }}>
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: categoryIndex * 0.2, duration: 0.8 }}
              viewport={{ once: true }}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '15px',
                padding: '2rem',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'all 0.3s ease'
              }}
              whileHover={{
                transform: 'translateY(-10px)',
                boxShadow: '0 20px 40px rgba(74, 158, 255, 0.2)'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '1.5rem',
                color: '#4a9eff'
              }}>
                {category.icon}
                <h3 style={{
                  fontSize: '1.3rem',
                  marginLeft: '1rem',
                  color: '#4a9eff'
                }}>
                  {category.title}
                </h3>
              </div>

              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.8rem'
              }}>
                {category.skills.map((skill, skillIndex) => (
                  <motion.div
                    key={skill}
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ 
                      delay: categoryIndex * 0.2 + skillIndex * 0.1, 
                      duration: 0.5 
                    }}
                    viewport={{ once: true }}
                    style={{
                      background: 'rgba(74, 158, 255, 0.1)',
                      border: '1px solid rgba(74, 158, 255, 0.3)',
                      borderRadius: '20px',
                      padding: '0.5rem 1rem',
                      fontSize: '0.9rem',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    whileHover={{
                      scale: 1.1,
                      background: 'rgba(74, 158, 255, 0.2)',
                      boxShadow: '0 5px 15px rgba(74, 158, 255, 0.3)'
                    }}
                  >
                    {skill}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          viewport={{ once: true }}
          style={{
            textAlign: 'center',
            marginTop: '4rem',
            padding: '2rem',
            background: 'rgba(74, 158, 255, 0.05)',
            borderRadius: '15px',
            border: '1px solid rgba(74, 158, 255, 0.2)'
          }}
        >
          <h3 style={{
            fontSize: '1.5rem',
            marginBottom: '1rem',
            color: '#4a9eff'
          }}>
            Ready to Build the Future
          </h3>
          <p style={{
            color: '#e0e0e0',
            fontSize: '1.1rem',
            lineHeight: '1.6'
          }}>
            From offline-first mobile apps to AI-powered ERP systems, 
            I bring cutting-edge technologies together to create scalable, 
            secure, and intuitive solutions that drive business growth.
          </p>
        </motion.div>
      </div>
    </section>
  );
} 