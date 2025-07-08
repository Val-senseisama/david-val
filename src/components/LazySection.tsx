import { Suspense, lazy, useEffect, useRef } from 'react';
import type { ComponentType } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { motion } from 'framer-motion';
import { FaSpinner } from 'react-icons/fa';
import { measureComponentLoad } from '../utils/performance';

interface LazySectionProps {
  component: () => Promise<{ default: ComponentType<any> }>;
  fallback?: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
  className?: string;
  style?: React.CSSProperties;
  componentName?: string;
}

const SectionLoader = () => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 100%)',
    color: '#4a9eff'
  }}>
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem'
      }}
    >
      <FaSpinner size={40} />
      <p style={{ fontSize: '1.1rem', margin: 0 }}>Loading...</p>
    </motion.div>
  </div>
);

export default function LazySection({ 
  component, 
  fallback = <SectionLoader />,
  threshold = 0.1,
  rootMargin = '50px',
  className,
  style,
  componentName = 'Unknown'
}: LazySectionProps) {
  const { ref, hasTriggered } = useIntersectionObserver({
    threshold,
    rootMargin,
    triggerOnce: true
  });

  const loadStartRef = useRef<number>(0);
  const LazyComponent = lazy(component);

  useEffect(() => {
    if (hasTriggered) {
      loadStartRef.current = performance.now();
    }
  }, [hasTriggered]);

  const handleComponentLoad = () => {
    if (loadStartRef.current > 0) {
      measureComponentLoad(componentName, loadStartRef.current);
    }
  };

  return (
    <div ref={ref as React.Ref<HTMLDivElement>} className={className} style={style}>
      {hasTriggered && (
        <Suspense fallback={fallback}>
          <div onLoad={handleComponentLoad}>
            <LazyComponent />
          </div>
        </Suspense>
      )}
    </div>
  );
} 