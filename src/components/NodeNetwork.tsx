import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface NodeNetworkProps {
  nodeCount?: number;
  spread?: number;
  connectionDistance?: number;
  speed?: number;
}

export default function NodeNetwork({
  nodeCount = 80,
  spread = 30,
  connectionDistance = 8,
  speed = 0.04,
}: NodeNetworkProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Generate stable node positions
  const nodes = useMemo(() => {
    const positions: THREE.Vector3[] = [];
    for (let i = 0; i < nodeCount; i++) {
      positions.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * spread,
          (Math.random() - 0.5) * spread,
          (Math.random() - 0.5) * spread * 0.5
        )
      );
    }
    return positions;
  }, [nodeCount, spread]);

  // Generate edges between close nodes
  const edgePositions = useMemo(() => {
    const verts: number[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].distanceTo(nodes[j]) < connectionDistance) {
          verts.push(
            nodes[i].x, nodes[i].y, nodes[i].z,
            nodes[j].x, nodes[j].y, nodes[j].z
          );
        }
      }
    }
    return new Float32Array(verts);
  }, [nodes, connectionDistance]);

  // Node point positions
  const nodePositions = useMemo(() => {
    const arr = new Float32Array(nodes.length * 3);
    nodes.forEach((n, i) => {
      arr[i * 3] = n.x;
      arr[i * 3 + 1] = n.y;
      arr[i * 3 + 2] = n.z;
    });
    return arr;
  }, [nodes]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * speed;
      groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * speed * 0.4) * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Connection lines */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[edgePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#D4AF37"
          transparent
          opacity={0.2}
          depthWrite={false}
        />
      </lineSegments>

      {/* Nodes */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[nodePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.35}
          color="#FFD700"
          sizeAttenuation
          transparent
          opacity={0.9}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
