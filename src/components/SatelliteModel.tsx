import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, Suspense } from 'react';
import * as THREE from 'three';

// Preload the model
useGLTF.preload('/models/Satellite.glb');

function SatelliteModelInner(props: any) {
  const { scene } = useGLTF('/models/Satellite.glb');
  const satelliteRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (satelliteRef.current) {
      satelliteRef.current.rotation.y += 0.01;
      satelliteRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.2) * 2;
      satelliteRef.current.position.z = Math.cos(state.clock.elapsedTime * 0.2) * 2;
    }
  });

  return <primitive ref={satelliteRef} object={scene} scale={0.02} {...props} />;
}

export default function SatelliteModel(props: any) {
  return (
    <Suspense fallback={null}>
      <SatelliteModelInner {...props} />
    </Suspense>
  );
} 