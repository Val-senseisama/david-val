import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useAnimations, useGLTF } from "@react-three/drei";
import type { Group } from "three";
import NodeNetwork from "./NodeNetwork";

const MASCOT = "/mascot/val.glb";

function Mascot() {
  const group = useRef<Group>(null);
  const { scene, animations } = useGLTF(MASCOT);
  const { actions, names } = useAnimations(animations, group);

  useEffect(() => {
    const a = names[0] ? actions[names[0]] : null;
    a?.reset().play();
  }, [actions, names]);

  // turn gently toward the pointer
  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const target = -0.2 + state.pointer.x * 0.35;
    g.rotation.y += (target - g.rotation.y) * Math.min(1, dt * 3);
  });

  return (
    <group ref={group} position={[6.2, -7.4, 6]} scale={8.6}>
      <primitive object={scene} />
    </group>
  );
}

export default function HeroCanvas() {
  const [wide, setWide] = useState(() => window.innerWidth > 900);
  useEffect(() => {
    const onResize = () => setWide(window.innerWidth > 900);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <Canvas
      camera={{ position: [-6, 0, 20], fov: 60 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: false, powerPreference: "default" }}
      onCreated={({ gl }) => gl.setClearColor(0x0b0d12, 1)}
    >
      <NodeNetwork nodeCount={90} spread={34} connectionDistance={8.5} speed={0.025} />
      {wide && (
        <>
          <ambientLight intensity={1.1} color="#fff4e2" />
          <hemisphereLight args={["#fff4dc", "#2a2f3a", 1.6]} />
          <directionalLight position={[4, 8, 14]} intensity={3.6} color="#fff1d6" />
          <directionalLight position={[-12, 5, -4]} intensity={2.2} color="#e0b040" />
          <Suspense fallback={null}>
            <Mascot />
          </Suspense>
        </>
      )}
    </Canvas>
  );
}
