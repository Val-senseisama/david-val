import { Canvas } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import MoonModel from './MoonModel';
import SpaceshipModel from './SpaceshipModel';
import { motion } from 'framer-motion';
import { Suspense } from 'react';

export default function Hero3D() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
      style={{
        width: '100%',
        height: '100vh',
        position: 'relative',
        background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)'
      }}
    >
      <Canvas 
        camera={{ position: [0, 0, 10], fov: 75 }}
        dpr={[1, 2]}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          
          <Stars 
            radius={100} 
            depth={50} 
            count={3000} 
            factor={4} 
            fade 
            speed={1} 
          />
          
          <MoonModel position={[0, 0, -5]} />
          <SpaceshipModel position={[4, 2, -2]} />
          
          <OrbitControls 
            enableZoom={true} 
            enablePan={true} 
            enableRotate={true}
            autoRotate={true}
            autoRotateSpeed={0.5}
            maxDistance={20}
            minDistance={5}
          />
        </Suspense>
      </Canvas>
      
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        color: 'white',
        zIndex: 10,
        pointerEvents: 'none'
      }}>
        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          style={{
            fontSize: '3rem',
            marginBottom: '1rem',
            textShadow: '0 0 20px rgba(74, 158, 255, 0.8)'
          }}
        >
          David Uyi Val-Izevbigie
        </motion.h1>
        <motion.p
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          style={{
            fontSize: '1.5rem',
            color: '#4a9eff',
            textShadow: '0 0 10px rgba(74, 158, 255, 0.5)'
          }}
        >
          Fullstack Developer
        </motion.p>
        <motion.p
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          style={{
            fontSize: '1rem',
            color: '#a0a0a0',
            maxWidth: '600px',
            margin: '1rem auto'
          }}
        >
          Building for Earth, from Space 🚀
        </motion.p>
      </div>
    </motion.div>
  );
} 