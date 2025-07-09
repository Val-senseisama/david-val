import React, { Suspense, useState, useEffect, lazy } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';

// Lazy load the 3D model components
const LazyMoonModel = lazy(() => import('./MoonModel'));
const LazySpaceshipModel = lazy(() => import('./SpaceshipModel'));

// Error boundary component for 3D models
function ModelErrorBoundary({ children, fallback }: { children: React.ReactNode; fallback: React.ReactNode }) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return <>{fallback}</>;
  }

  return (
    <ErrorBoundary onError={() => setHasError(true)}>
      {children}
    </ErrorBoundary>
  );
}

// Simple ErrorBoundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; onError: () => void },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; onError: () => void }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

export default function Hero3D() {
  const [isWebGLAvailable, setIsWebGLAvailable] = useState(true);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [modelErrors, setModelErrors] = useState<string[]>([]);

  useEffect(() => {
    // Check WebGL availability
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      setIsWebGLAvailable(false);
    }
  }, []);

  const handleModelError = (modelName: string) => {
    setModelErrors(prev => [...prev, modelName]);
  };

  const handleModelsLoaded = () => {
    setModelsLoaded(true);
  };

  if (!isWebGLAvailable) {
    return (
      <div style={{
        width: '100%',
        height: '100vh',
        background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        textAlign: 'center'
      }}>
        <div>
          <h1>WebGL Not Available</h1>
          <p>Your browser doesn't support WebGL. Please try a different browser.</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
      style={{
        width: '100%',
        height: '100vh',
        position: 'relative',
        background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)',
        overflow: 'hidden'
      }}
    >
      <Canvas 
        camera={{ position: [0, 0, 10], fov: 75 }}
        dpr={[1, 1.5]}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "default",
          preserveDrawingBuffer: false,
          failIfMajorPerformanceCaveat: false
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
        onError={(error) => {
          console.error('Canvas error:', error);
          setIsWebGLAvailable(false);
        }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <Stars 
          radius={100} 
          depth={50} 
          count={1500} 
          factor={4} 
          fade 
          speed={0.5} 
        />
        
        <Suspense fallback={null}>
          <ModelErrorBoundary fallback={
            <mesh position={[0, 0, -5]}>
              <sphereGeometry args={[2, 32, 32]} />
              <meshStandardMaterial color="#888888" />
            </mesh>
          }>
            <LazyMoonModel 
              position={[0, 0, -5]} 
              onError={() => handleModelError('moon')}
            />
          </ModelErrorBoundary>
          
          <ModelErrorBoundary fallback={
            <mesh position={[6, 3, -2]}>
              <boxGeometry args={[1, 1, 2]} />
              <meshStandardMaterial color="#4a9eff" />
            </mesh>
          }>
            <LazySpaceshipModel 
              position={[6, 3, -2]} 
              onError={() => handleModelError('spaceship')}
            />
          </ModelErrorBoundary>
        </Suspense>
        
        <OrbitControls 
          enableZoom={true} 
          enablePan={true} 
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={0.3}
          maxDistance={20}
          minDistance={5}
        />
      </Canvas>
      
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        color: 'white',
        zIndex: 10,
        pointerEvents: 'none',
        padding: '0 1rem'
      }}>
        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          style={{
            fontSize: 'clamp(1.5rem, 5vw, 3rem)',
            marginBottom: '1rem',
            textShadow: '0 0 20px rgba(74, 158, 255, 0.8)',
            lineHeight: '1.2'
          }}
        >
          David Uyi Val-Izevbigie
        </motion.h1>
        <motion.p
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          style={{
            fontSize: 'clamp(1rem, 3vw, 1.5rem)',
            color: '#4a9eff',
            textShadow: '0 0 10px rgba(74, 158, 255, 0.5)',
            marginBottom: '0.5rem'
          }}
        >
          Fullstack Developer
        </motion.p>
        <motion.p
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          style={{
            fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
            color: '#a0a0a0',
            maxWidth: '600px',
            margin: '1rem auto',
            lineHeight: '1.4'
          }}
        >
          Building for Earth, from Space 🚀
        </motion.p>
      </div>
    </motion.div>
  );
} 