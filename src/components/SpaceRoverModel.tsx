import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, Suspense } from 'react';
import * as THREE from 'three';

// Preload the model
useGLTF.preload('/models/SpaceRover.glb');

function SpaceRoverModelInner(props: any) {
  const { scene } = useGLTF('/models/SpaceRover.glb');
  const roverRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (roverRef.current) {
      roverRef.current.rotation.y += 0.008;
      roverRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.3;
    }
  });

  return <primitive ref={roverRef} object={scene} scale={1.2} {...props} />;
}

export default function SpaceRoverModel(props: any) {
  return (
    <Suspense fallback={null}>
      <SpaceRoverModelInner {...props} />
    </Suspense>
  );
} 