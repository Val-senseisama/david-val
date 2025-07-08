import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, Suspense } from 'react';
import * as THREE from 'three';

// Preload the model
useGLTF.preload('/models/Moon.glb');

function MoonModelInner(props: any) {
  const { scene } = useGLTF('/models/Moon.glb');
  const moonRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (moonRef.current) {
      moonRef.current.rotation.y += 0.005;
    }
  });

  return <primitive ref={moonRef} object={scene} scale={6} {...props} />;
}

export default function MoonModel(props: any) {
  return (
    <Suspense fallback={null}>
      <MoonModelInner {...props} />
    </Suspense>
  );
} 