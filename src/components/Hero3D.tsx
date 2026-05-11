import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { motion } from "framer-motion";
import { FaArrowDown, FaFileAlt } from "react-icons/fa";
import NodeNetwork from "./NodeNetwork";

export default function Hero3D() {
  const scrollToWork = () => {
    document
      .getElementById("showcase")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      style={{
        width: "100%",
        height: "100vh",
        position: "relative",
        background: "#050505",
        overflow: "hidden",
      }}
    >
      {/* Subtle dot grid overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          backgroundImage:
            "radial-gradient(circle, rgba(212,175,55,0.18) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          pointerEvents: "none",
        }}
      />

      {/* Radial fade vignette to keep center readable */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          background:
            "radial-gradient(ellipse 70% 70% at 50% 50%, transparent 30%, #050505 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Node network canvas */}
      <Canvas
        camera={{ position: [0, 0, 20], fov: 65 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "default",
          preserveDrawingBuffer: false,
        }}
        onCreated={({ gl }) => gl.setClearColor(0x050505, 1)}
        style={{ position: "absolute", inset: 0, zIndex: 3 }}
      >
        <ambientLight intensity={0.4} color="#D4AF37" />
        <pointLight position={[10, 10, 10]} intensity={0.6} color="#FFD700" />
        <Suspense fallback={null}>
          <NodeNetwork
            nodeCount={90}
            spread={35}
            connectionDistance={9}
            speed={0.025}
          />
        </Suspense>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
          autoRotate={false}
        />
      </Canvas>

      {/* Hero text — above canvas */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          color: "white",
          zIndex: 10,
          pointerEvents: "none",
          width: "100%",
          padding: "0 2rem",
        }}
      >
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          style={{
            fontSize: "clamp(0.7rem, 2vw, 0.85rem)",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "#D4AF37",
            marginBottom: "1.2rem",
            fontWeight: 600,
          }}
        >
          Fullstack Engineer
        </motion.p>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 1 }}
          style={{
            fontSize: "clamp(2rem, 6vw, 4rem)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            marginBottom: "1.5rem",
            color: "#FFFFFF",
          }}
        >
          David Uyi Val-Izevbigie
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          style={{
            fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
            color: "#999999",
            maxWidth: "600px",
            margin: "0 auto 0.75rem",
            lineHeight: 1.6,
          }}
        >
          Engineering systems from zero to production.
        </motion.p>

        {/* Sub-tagline chips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.7, duration: 0.8 }}
          style={{
            display: "flex",
            gap: "0.75rem",
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: "2.5rem",
          }}
        >
          {["Scalable SaaS", "Fintech Infrastructure", "AI Systems"].map(
            (chip) => (
              <span
                key={chip}
                style={{
                  fontSize: "clamp(0.7rem, 1.8vw, 0.8rem)",
                  color: "#D4AF37",
                  border: "1px solid rgba(212,175,55,0.35)",
                  borderRadius: "100px",
                  padding: "0.3rem 0.9rem",
                  letterSpacing: "0.05em",
                  background: "rgba(212,175,55,0.06)",
                }}
              >
                {chip}
              </span>
            ),
          )}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
            pointerEvents: "all",
          }}
        >
          <button
            onClick={scrollToWork}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.8rem 2rem",
              background: "linear-gradient(135deg, #D4AF37, #B8860B)",
              border: "none",
              borderRadius: "8px",
              color: "#050505",
              fontWeight: 700,
              fontSize: "0.95rem",
              cursor: "pointer",
              letterSpacing: "0.03em",
              transition: "opacity 0.2s, transform 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.85";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <FaArrowDown size={14} />
            View My Work
          </button>

          <a
            href="/Val-Izevbigie David-001.pdf"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.8rem 2rem",
              background: "transparent",
              border: "1px solid rgba(212,175,55,0.5)",
              borderRadius: "8px",
              color: "#D4AF37",
              fontWeight: 600,
              fontSize: "0.95rem",
              cursor: "pointer",
              letterSpacing: "0.03em",
              textDecoration: "none",
              transition: "background 0.2s, transform 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(212,175,55,0.08)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <FaFileAlt size={14} />
            Download Resume
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        style={{
          position: "absolute",
          bottom: "2rem",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.4rem",
        }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        ></motion.div>
      </motion.div>
    </motion.div>
  );
}
