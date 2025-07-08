import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

export default function SpaceStationModel(props: any) {
  const { scene } = useGLTF('/models/SpaceStation.glb');
  const stationRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (stationRef.current) {
      stationRef.current.rotation.y += 0.003;
      stationRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return <primitive ref={stationRef} object={scene} scale={1.5} {...props} />;
} 