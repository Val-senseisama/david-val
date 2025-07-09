import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, Suspense, useEffect } from 'react';
import * as THREE from 'three';

// Preload the model
useGLTF.preload('/models/Moon.glb');

function MoonModelInner(props: any) {
  const { scene } = useGLTF('/models/Moon.glb');
  const moonRef = useRef<THREE.Group>(null);

  // Handle model loading errors
  useEffect(() => {
    if (props.onError && !scene) {
      props.onError();
    }
  }, [scene, props.onError]);

  useFrame(() => {
    if (moonRef.current) {
      moonRef.current.rotation.y += 0.005;
    }
  });

  if (!scene) {
    return null;
  }

  return <primitive ref={moonRef} object={scene} scale={6} {...props} />;
}

export default function MoonModel(props: any) {
  return (
    <Suspense fallback={null}>
      <MoonModelInner {...props} />
    </Suspense>
  );
} 