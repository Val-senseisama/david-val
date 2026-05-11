import { Suspense } from "react";
import { motion } from "framer-motion";
import { usePortfolioData } from "../hooks/usePortfolioData";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function WireframeSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.18;
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.09;
    }
  });
  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[3, 1]} />
      <meshBasicMaterial color="#D4AF37" wireframe transparent opacity={0.35} />
    </mesh>
  );
}

const stats = [
  { value: "5+", label: "Years Experience" },
  { value: "3", label: "Companies Shipped" },
  { value: "1K+", label: "Talent Profiles Served" },
  { value: "₦600K+", label: "Transactions at Launch" },
];

export default function About() {
  const data = usePortfolioData();

  return (
    <section
      id="about"
      style={{
        minHeight: "100vh",
        background: "#050505",
        color: "white",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Dot grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          backgroundImage:
            "radial-gradient(circle, rgba(212,175,55,0.12) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          pointerEvents: "none",
        }}
      />

      {/* Stats strip */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          borderBottom: "1px solid rgba(212,175,55,0.15)",
          background: "rgba(212,175,55,0.03)",
          padding: "2rem clamp(1rem, 5vw, 4rem)",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "1.5rem",
            textAlign: "center",
          }}
        >
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div
                style={{
                  fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
                  fontWeight: 800,
                  color: "#D4AF37",
                  lineHeight: 1,
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "#999",
                  marginTop: "0.4rem",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "clamp(3rem, 6vw, 5rem) clamp(1rem, 3vw, 2rem)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "clamp(2rem, 5vw, 5rem)",
          alignItems: "center",
        }}
      >
        {/* Left: text */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9 }}
          viewport={{ once: true }}
        >
          <p
            style={{
              fontSize: "0.75rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#D4AF37",
              marginBottom: "1rem",
              fontWeight: 600,
            }}
          >
            About Me
          </p>
          <h2
            style={{
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: "1.5rem",
              color: "#fff",
            }}
          >
            From architecture
            <br />
            to execution.
          </h2>
          <p
            style={{
              fontSize: "clamp(0.95rem, 2vw, 1.05rem)",
              lineHeight: 1.8,
              color: "#aaa",
              marginBottom: "2rem",
            }}
          >
            {data.summary}
          </p>

          {/* Education card */}
          <div
            style={{
              background: "rgba(212,175,55,0.05)",
              border: "1px solid rgba(212,175,55,0.2)",
              borderRadius: "12px",
              padding: "1.5rem",
            }}
          >
            <p
              style={{
                fontSize: "0.7rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#D4AF37",
                marginBottom: "0.75rem",
              }}
            >
              Education
            </p>
            <p
              style={{
                fontWeight: 700,
                fontSize: "1rem",
                marginBottom: "0.25rem",
              }}
            >
              {data.education.degree} in {data.education.field}
            </p>
            <p
              style={{
                color: "#888",
                fontSize: "0.9rem",
                marginBottom: "0.2rem",
              }}
            >
              {data.education.institution}
            </p>
            <p
              style={{
                color: "#888",
                fontSize: "0.85rem",
                marginBottom: "0.2rem",
              }}
            >
              {data.education.duration}
            </p>
            {data.education.gpa && (
              <p
                style={{
                  color: "#D4AF37",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                }}
              >
                GPA: {data.education.gpa}
              </p>
            )}
          </div>
        </motion.div>

        {/* Right: 3D wireframe */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9 }}
          viewport={{ once: true }}
          style={{ height: "clamp(280px, 40vw, 420px)", position: "relative" }}
        >
          <Canvas
            camera={{ position: [0, 0, 8], fov: 60 }}
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: true, powerPreference: "default" }}
            style={{ position: "absolute", inset: 0 }}
          >
            <ambientLight intensity={0.5} color="#D4AF37" />
            <pointLight position={[5, 5, 5]} intensity={0.8} color="#FFD700" />
            <Suspense fallback={null}>
              <WireframeSphere />
            </Suspense>
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              autoRotate={false}
            />
          </Canvas>
        </motion.div>
      </div>
    </section>
  );
}
