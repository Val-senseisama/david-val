import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { FaDatabase, FaExternalLinkAlt, FaChartBar, FaCreditCard, FaTrophy, FaBrain, FaGem } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import NodeNetwork from './NodeNetwork';

interface ProjectCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  technologies: string[];
  path: string;
  accentColor: string;
}

const projects: ProjectCard[] = [
  {
    id: 'inventory-dashboard',
    title: 'Inventory Dashboard',
    description: 'Real-time inventory management with add/edit/delete, search & filter, and localStorage persistence.',
    icon: <FaDatabase size={24} />,
    technologies: ['React', 'TypeScript', 'localStorage'],
    path: '/inventory',
    accentColor: '#D4AF37',
  },
  {
    id: 'sales-forecast',
    title: 'Sales Forecast',
    description: 'AI-powered sales forecasting with CSV upload, Chart.js visualization, and predictive analytics.',
    icon: <FaChartBar size={24} />,
    technologies: ['React', 'Chart.js', 'TypeScript'],
    path: '/sales-forecast',
    accentColor: '#D4AF37',
  },
  {
    id: 'multivendor-payments',
    title: 'Multi-Vendor Payments',
    description: 'Payment splitting system with vendor payouts, platform fees, VAT, and transaction history.',
    icon: <FaCreditCard size={24} />,
    technologies: ['React', 'TypeScript', 'Payment Logic'],
    path: '/multivendor',
    accentColor: '#FFD700',
  },
  {
    id: 'goal-quest-tracker',
    title: 'GoalQuest',
    description: 'Gamified productivity app with XP system, quest management, and achievement analytics.',
    icon: <FaTrophy size={24} />,
    technologies: ['React', 'TypeScript', 'Gamification'],
    path: '/goal-quest',
    accentColor: '#B8860B',
  },
  {
    id: 'mind-map-creator',
    title: 'Mind Map Creator',
    description: 'Interactive mind mapping with drag-and-drop, node connections, and localStorage sync.',
    icon: <FaBrain size={24} />,
    technologies: ['React', 'TypeScript', 'Drag & Drop'],
    path: '/mind-map',
    accentColor: '#D4AF37',
  },
  {
    id: 'shardspace',
    title: 'ShardSpace',
    description: 'Goal visualization system that breaks large goals into milestones and mini-quests with XP tracking.',
    icon: <FaGem size={24} />,
    technologies: ['React', 'TypeScript', 'Gamification'],
    path: '/shardspace',
    accentColor: '#FFD700',
  },
];

export default function Showcase() {
  const navigate = useNavigate();

  return (
    <section id="showcase" style={{
      minHeight: '100vh',
      background: '#050505',
      color: 'white',
      position: 'relative',
      overflow: 'hidden',
      padding: 'clamp(3rem, 6vw, 5rem) clamp(1rem, 3vw, 2rem)',
    }}>
      {/* Sparse node network background */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.5 }}>
        <Canvas
          camera={{ position: [0, 0, 25], fov: 65 }}
          dpr={[1, 1]}
          gl={{ antialias: false, alpha: false, powerPreference: 'default' }}
          onCreated={({ gl }) => gl.setClearColor(0x050505, 1)}
        >
          <Suspense fallback={null}>
            <NodeNetwork nodeCount={40} spread={40} connectionDistance={10} speed={0.012} />
          </Suspense>
          <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
        </Canvas>
      </div>

      <div style={{ position: 'relative', zIndex: 2, maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 'clamp(2.5rem, 5vw, 4rem)' }}
        >
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#D4AF37', marginBottom: '0.75rem', fontWeight: 600 }}>
            Built to Ship
          </p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)', fontWeight: 800, color: '#fff', marginBottom: '1rem' }}>
            Frontend Concepts
          </h2>
          <p style={{ color: '#888', fontSize: 'clamp(0.9rem, 2vw, 1.05rem)', maxWidth: '560px', margin: '0 auto', lineHeight: 1.7 }}>
            A collection of production-quality frontend applications demonstrating end-to-end engineering.
          </p>
        </motion.div>

        {/* Project grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
        }}>
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.7 }}
              viewport={{ once: true }}
              onClick={() => navigate(project.path)}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(212,175,55,0.15)',
                borderRadius: '16px',
                padding: '1.75rem',
                cursor: 'pointer',
                transition: 'border-color 0.3s, background 0.3s, transform 0.2s, box-shadow 0.3s',
              }}
              whileHover={{
                scale: 1.02,
                borderColor: 'rgba(212,175,55,0.5)',
                backgroundColor: 'rgba(212,175,55,0.04)',
                boxShadow: '0 16px 40px rgba(212,175,55,0.08)',
              }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Icon + title */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', marginBottom: '0.9rem', color: project.accentColor }}>
                {project.icon}
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', margin: 0 }}>
                  {project.title}
                </h3>
              </div>

              <p style={{ color: '#888', fontSize: '0.88rem', lineHeight: 1.7, marginBottom: '1.2rem' }}>
                {project.description}
              </p>

              {/* Tech chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
                {project.technologies.map(tech => (
                  <span key={tech} style={{
                    fontSize: '0.72rem', color: '#D4AF37',
                    background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)',
                    borderRadius: '5px', padding: '0.2rem 0.55rem',
                  }}>
                    {tech}
                  </span>
                ))}
              </div>

              {/* CTA row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: project.accentColor, fontSize: '0.82rem', fontWeight: 600 }}>
                <span>Open Project</span>
                <FaExternalLinkAlt size={11} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
