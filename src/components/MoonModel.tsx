import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

export default function MoonModel(props: any) {
  const { scene } = useGLTF('/models/Moon.glb');
  const moonRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (moonRef.current) {
      moonRef.current.rotation.y += 0.005;
    }
  });

  return <primitive ref={moonRef} object={scene} scale={2} {...props} />;
} 