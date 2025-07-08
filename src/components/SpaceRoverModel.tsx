import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

export default function SpaceRoverModel(props: any) {
  const { scene } = useGLTF('/models/SpaceRover.glb');
  const roverRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (roverRef.current) {
      roverRef.current.rotation.y += 0.008;
      roverRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.3) * 2;
    }
  });

  return <primitive ref={roverRef} object={scene} scale={0.8} {...props} />;
} 