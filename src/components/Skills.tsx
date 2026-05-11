import { motion } from 'framer-motion';
import { usePortfolioData } from '../hooks/usePortfolioData';
import { FaCode, FaDatabase, FaTools, FaRocket } from 'react-icons/fa';

const categoryIcons: Record<string, React.ReactNode> = {
  languagesAndFrameworks: <FaCode size={18} />,
  databases: <FaDatabase size={18} />,
  toolsPlatforms: <FaTools size={18} />,
  specialties: <FaRocket size={18} />,
};

const categoryLabels: Record<string, string> = {
  languagesAndFrameworks: 'Languages & Frameworks',
  databases: 'Databases',
  toolsPlatforms: 'Tools & Platforms',
  specialties: 'Specializations',
};

export default function Skills() {
  const data = usePortfolioData();

  return (
    <section id="skills" style={{
      minHeight: '100vh',
      background: '#050505',
      color: 'white',
      position: 'relative',
      overflow: 'hidden',
      padding: 'clamp(3rem, 6vw, 5rem) clamp(1rem, 3vw, 2rem)',
    }}>
      {/* Dot grid bg */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        backgroundImage: 'radial-gradient(circle, rgba(212,175,55,0.1) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        pointerEvents: 'none',
      }} />
      {/* Radial gold glow top-right */}
      <div style={{
        position: 'absolute', top: '-10%', right: '-10%', zIndex: 0,
        width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(212,175,55,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

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
            Technical Expertise
          </p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)', fontWeight: 800, color: '#fff', marginBottom: '1rem' }}>
            The Full Stack, Mastered.
          </h2>
          <p style={{ color: '#888', fontSize: 'clamp(0.9rem, 2vw, 1.05rem)', maxWidth: '580px', margin: '0 auto', lineHeight: 1.7 }}>
            From database schema to deployed UI — I own the entire engineering lifecycle.
          </p>
        </motion.div>

        {/* Skill category grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem',
        }}>
          {Object.entries(data.skills).map(([key, skills], catIndex) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: catIndex * 0.12, duration: 0.7 }}
              viewport={{ once: true }}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(212,175,55,0.15)',
                borderRadius: '16px',
                padding: '1.75rem',
                transition: 'border-color 0.3s, background 0.3s',
              }}
              whileHover={{ borderColor: 'rgba(212,175,55,0.45)', backgroundColor: 'rgba(212,175,55,0.04)' }}
            >
              {/* Category header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', color: '#D4AF37' }}>
                {categoryIcons[key]}
                <h3 style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#D4AF37', margin: 0 }}>
                  {categoryLabels[key]}
                </h3>
              </div>

              {/* Skill chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {(skills as string[]).map((skill, i) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: catIndex * 0.1 + i * 0.05, duration: 0.4 }}
                    viewport={{ once: true }}
                    style={{
                      fontSize: '0.8rem',
                      color: '#ccc',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '6px',
                      padding: '0.3rem 0.7rem',
                      transition: 'color 0.2s, border-color 0.2s',
                      cursor: 'default',
                    }}
                    whileHover={{ color: '#D4AF37', borderColor: 'rgba(212,175,55,0.4)' }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom callout */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          viewport={{ once: true }}
          style={{
            marginTop: 'clamp(2.5rem, 5vw, 4rem)',
            padding: '2rem',
            border: '1px solid rgba(212,175,55,0.2)',
            borderRadius: '16px',
            background: 'rgba(212,175,55,0.04)',
            textAlign: 'center',
          }}
        >
          <h3 style={{ color: '#D4AF37', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            Built for Production, Not Prototypes.
          </h3>
          <p style={{ color: '#888', fontSize: '0.95rem', lineHeight: 1.7, maxWidth: '700px', margin: '0 auto' }}>
            From offline-first mobile apps to multi-tenant SaaS platforms and AI-integrated fintech systems —
            I bring cutting-edge technologies together to build scalable, high-throughput solutions
            that operate reliably in production at scale.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
