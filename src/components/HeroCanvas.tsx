import { Canvas } from "@react-three/fiber";
import NodeNetwork from "./NodeNetwork";

export default function HeroCanvas() {
  return (
    <Canvas
      camera={{ position: [-6, 0, 20], fov: 60 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: false, powerPreference: "default" }}
      onCreated={({ gl }) => gl.setClearColor(0x0b0d12, 1)}
    >
      <NodeNetwork nodeCount={90} spread={34} connectionDistance={8.5} speed={0.025} />
    </Canvas>
  );
}
