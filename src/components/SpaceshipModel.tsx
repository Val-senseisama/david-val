import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, useState, Suspense } from 'react';
import * as THREE from 'three';

// Preload the model
useGLTF.preload('/models/Spaceship.glb');

function SpaceshipModelInner(props: any) {
  const { scene } = useGLTF('/models/Spaceship.glb');
  const spaceshipRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (spaceshipRef.current) {
      spaceshipRef.current.rotation.y += 0.01;
      spaceshipRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.5;
    }
  });

  return (
    <primitive
      ref={spaceshipRef}
      object={scene}
      scale={hovered ? 1.8 : 1.6}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      {...props}
    />
  );
}

export default function SpaceshipModel(props: any) {
  return (
    <Suspense fallback={null}>
      <SpaceshipModelInner {...props} />
    </Suspense>
  );
} 