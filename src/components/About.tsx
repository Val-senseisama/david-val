import { motion } from 'framer-motion';
import { usePortfolioData } from '../hooks/usePortfolioData';
import { Canvas } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import { Suspense, lazy } from 'react';

// Lazy load the 3D model component
const LazySpaceStationModel = lazy(() => import('./SpaceStationModel'));

export default function About() {
  const data = usePortfolioData();

  return (
    <section style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 100%)',
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
            console.error('About Canvas error:', error);
          }}
        >
          <ambientLight intensity={0.3} />
          <Stars radius={50} depth={30} count={800} factor={3} fade speed={0.3} />
          <Suspense fallback={null}>
            <LazySpaceStationModel position={[3, 1, -2]} />
          </Suspense>
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.2} />
        </Canvas>
      </div>

      <div style={{
        position: 'relative',
        zIndex: 2,
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 'clamp(2rem, 4vw, 4rem)',
        alignItems: 'center'
      }}>
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 2.5rem)',
            marginBottom: 'clamp(1.5rem, 3vw, 2rem)',
            color: '#4a9eff',
            textShadow: '0 0 10px rgba(74, 158, 255, 0.5)'
          }}>
            About Me
          </h2>
          
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            viewport={{ once: true }}
            style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.1rem)',
              lineHeight: '1.8',
              marginBottom: 'clamp(1.5rem, 3vw, 2rem)',
              color: '#e0e0e0'
            }}
          >
            {data.summary}
          </motion.p>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            viewport={{ once: true }}
            style={{
              background: 'rgba(74, 158, 255, 0.1)',
              border: '1px solid rgba(74, 158, 255, 0.3)',
              borderRadius: '10px',
              padding: 'clamp(1rem, 3vw, 1.5rem)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <h3 style={{
              fontSize: 'clamp(1.1rem, 3vw, 1.3rem)',
              marginBottom: '1rem',
              color: '#4a9eff'
            }}>
              Education
            </h3>
            <p style={{ 
              marginBottom: '0.5rem', 
              fontWeight: 'bold',
              fontSize: 'clamp(0.9rem, 2.5vw, 1rem)'
            }}>
              {data.education.degree} in {data.education.field}
            </p>
            <p style={{ 
              color: '#a0a0a0', 
              marginBottom: '0.5rem',
              fontSize: 'clamp(0.85rem, 2.5vw, 1rem)'
            }}>
              {data.education.institution}
            </p>
            <p style={{ 
              color: '#a0a0a0',
              fontSize: 'clamp(0.85rem, 2.5vw, 1rem)'
            }}>
              {data.education.duration}
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ x: 100, opacity: 0 }}
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
            fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
            marginBottom: 'clamp(1rem, 2.5vw, 1.5rem)',
            color: '#4a9eff'
          }}>
            Key Interests
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: 'clamp(0.75rem, 2vw, 1rem)'
          }}>
            {data.skills.specialties.map((specialty, index) => (
              <motion.div
                key={specialty}
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                style={{
                  background: 'rgba(74, 158, 255, 0.1)',
                  border: '1px solid rgba(74, 158, 255, 0.2)',
                  borderRadius: '8px',
                  padding: 'clamp(0.75rem, 2vw, 1rem)',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  fontSize: 'clamp(0.8rem, 2.5vw, 1rem)'
                }}
                whileHover={{
                  scale: 1.05,
                  background: 'rgba(74, 158, 255, 0.2)'
                }}
              >
                {specialty}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
} 