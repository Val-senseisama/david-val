import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import { Suspense, lazy } from 'react';
import {  FaDatabase, FaExternalLinkAlt, FaChartBar, FaCreditCard, FaTrophy, FaBrain, FaGem } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

// Lazy load the 3D model component
const LazyMoonModel = lazy(() => import('./MoonModel'));

interface ProjectCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  technologies: string[];
  features: string[];
  path: string;
  status: 'completed' | 'in-progress' | 'planned';
  color: string;
}

export default function Showcase() {
  const navigate = useNavigate();
  
  const projects: ProjectCard[] = [
    {
      id: 'inventory-dashboard',
      title: 'Inventory Dashboard',
      description: 'A responsive React-based inventory management system with localStorage persistence.',
      icon: <FaDatabase size={32} />,
      technologies: ['React', 'Bootstrap 5', 'TypeScript', 'localStorage'],
      features: ['Add/Edit/Delete Products', 'Search & Filter', 'Responsive Layout'],
      path: '/inventory',
      status: 'completed',
      color: '#4a9eff'
    },
    {
      id: 'sales-forecast',
      title: 'Sales Forecast',
      description: 'AI-powered sales forecasting dashboard with chart visualization and data persistence.',
      icon: <FaChartBar size={32} />,
      technologies: ['React', 'Chart.js', 'TypeScript', 'localStorage'],
      features: ['CSV Upload', 'Chart Visualization', 'Predictive Analytics'],
      path: '/sales-forecast',
      status: 'completed',
      color: '#4a9eff'
    },
    {
      id: 'multivendor-payments',
      title: 'Multi-Vendor Payments',
      description: 'Professional payment splitting system with vendor payouts, platform fees, and VAT calculations.',
      icon: <FaCreditCard size={32} />,
      technologies: ['React', 'TypeScript', 'localStorage', 'Payment Logic'],
      features: ['Payment Splitting', 'Vendor Payouts', 'Transaction History'],
      path: '/multivendor',
      status: 'completed',
      color: '#ff6b35'
    },
    {
      id: 'goal-quest-tracker',
      title: 'Goal Quest Tracker',
      description: 'Gamified productivity app with XP system, quest tracking, and achievement analytics.',
      icon: <FaTrophy size={32} />,
      technologies: ['React', 'TypeScript', 'localStorage', 'Gamification'],
      features: ['Quest Management', 'XP System', 'Progress Analytics'],
      path: '/goal-quest',
      status: 'completed',
      color: '#f59e0b'
    },
    {
      id: 'mind-map-creator',
      title: 'Mind Map Creator',
      description: 'Interactive web application for creating and managing mind maps with drag-and-drop functionality.',
      icon: <FaBrain size={32} />,
      technologies: ['React', 'TypeScript', 'localStorage', 'Drag & Drop'],
      features: ['Create, Edit, Delete Nodes', 'Connect Nodes', 'Save/Load Mind Maps'],
      path: '/mind-map',
      status: 'completed',
      color: '#6c757d'
    },
    {
      id: 'shardspace',
      title: 'ShardSpace',
      description: 'Gamified goal visualization tool that breaks down large goals into milestones and mini-quests with XP tracking.',
      icon: <FaGem size={32} />,
      technologies: ['React', 'TypeScript', 'localStorage', 'Gamification'],
      features: ['Goal Breakdown', 'Milestone Management', 'Quest Tracking', 'XP System'],
      path: '/shardspace',
      status: 'completed',
      color: '#8b5cf6'
    }
  ];

  const handleProjectClick = (project: ProjectCard) => {
    if (project.status === 'completed') {
      navigate(project.path);
    } else {
      alert(`${project.title} - Coming Soon! This project is ${project.status}.`);
    }
  };

  return (
    <section style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #16213e 0%, #0c0c0c 100%)',
      color: 'white',
      padding: 'clamp(2rem, 5vw, 4rem) clamp(1rem, 3vw, 2rem)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1
      }}>
        <Canvas 
          camera={{ position: [0, 0, 5], fov: 75 }}
          dpr={[1, 1.5]}
          gl={{ 
            antialias: true,
            alpha: true,
            powerPreference: "default",
            preserveDrawingBuffer: false,
            failIfMajorPerformanceCaveat: false
          }}
          onError={(error) => {
            console.error('Showcase Canvas error:', error);
          }}
        >
          <ambientLight intensity={0.3} />
          <Stars radius={80} depth={60} count={1200} factor={4} fade speed={0.6} />
          <Suspense fallback={null}>
            <LazyMoonModel position={[0, 0, -3]} />
          </Suspense>
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.2} />
        </Canvas>
      </div>

      <div style={{
        position: 'relative',
        zIndex: 2,
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <motion.h2
          initial={{ y: -50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          style={{
            fontSize: 'clamp(2rem, 6vw, 3rem)',
            textAlign: 'center',
            marginBottom: 'clamp(1rem, 3vw, 2rem)',
            color: '#4a9eff',
            textShadow: '0 0 20px rgba(74, 158, 255, 0.5)'
          }}
        >
          Frontend Concepts
        </motion.h2>

        <motion.p
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 1 }}
          viewport={{ once: true }}
          style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
            textAlign: 'center',
            marginBottom: 'clamp(2rem, 5vw, 4rem)',
            color: '#e0e0e0',
            maxWidth: '800px',
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: '1.6'
          }}
        >
          Explore my collection of frontend-only applications showcasing modern web development techniques.
        </motion.p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'clamp(1.5rem, 3vw, 2rem)',
          marginBottom: 'clamp(2rem, 5vw, 4rem)'
        }}>
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
              viewport={{ once: true }}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '15px',
                padding: 'clamp(1.5rem, 3vw, 2rem)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                minHeight: '200px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
              whileHover={{
                transform: 'translateY(-10px)',
                boxShadow: `0 20px 40px rgba(74, 158, 255, 0.2)`,
                borderColor: project.color
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleProjectClick(project)}
            >
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: 'clamp(1rem, 2.5vw, 1.5rem)',
                  color: project.color
                }}>
                  {project.icon}
                  <h3 style={{
                    fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
                    marginLeft: '1rem',
                    color: project.color,
                    margin: 0
                  }}>
                    {project.title}
                  </h3>
                </div>

                <p style={{
                  color: '#e0e0e0',
                  fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
                  lineHeight: '1.6',
                  marginBottom: 'clamp(1rem, 2.5vw, 1.5rem)'
                }}>
                  {project.description}
                </p>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                color: project.color,
                fontSize: '0.9rem',
                fontWeight: 'bold',
                padding: '0.75rem',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'all 0.3s ease'
              }}>
                <span>View Project</span>
                <FaExternalLinkAlt size={14} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 