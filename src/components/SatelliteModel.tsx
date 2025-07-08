import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

export default function SatelliteModel(props: any) {
  const { scene } = useGLTF('/models/Satellite.glb');
  const satelliteRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (satelliteRef.current) {
      satelliteRef.current.rotation.y += 0.006;
      satelliteRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.3;
      satelliteRef.current.position.x = Math.cos(state.clock.elapsedTime * 0.3) * 0.5;
    }
  });

  return <primitive ref={satelliteRef} object={scene} scale={0.02} {...props} />;
} 