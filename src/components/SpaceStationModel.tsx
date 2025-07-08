import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, Suspense } from 'react';
import * as THREE from 'three';

// Preload the model
useGLTF.preload('/models/SpaceStation.glb');

function SpaceStationModelInner(props: any) {
  const { scene } = useGLTF('/models/SpaceStation.glb');
  const stationRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (stationRef.current) {
      stationRef.current.rotation.y += 0.003;
    }
  });

  return <primitive ref={stationRef} object={scene} scale={0.8} {...props} />;
}

export default function SpaceStationModel(props: any) {
  return (
    <Suspense fallback={null}>
      <SpaceStationModelInner {...props} />
    </Suspense>
  );
} 