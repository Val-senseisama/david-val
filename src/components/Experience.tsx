import { motion } from 'framer-motion';
import { usePortfolioData } from '../hooks/usePortfolioData';
import { FaMapMarkerAlt } from 'react-icons/fa';

export default function Experience() {
  const data = usePortfolioData();

  return (
    <section id="experience" style={{
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
      {/* Gold glow bottom-left */}
      <div style={{
        position: 'absolute', bottom: '-10%', left: '-10%', zIndex: 0,
        width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 2, maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          style={{ marginBottom: 'clamp(2.5rem, 5vw, 4rem)' }}
        >
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#D4AF37', marginBottom: '0.75rem', fontWeight: 600 }}>
            Work History
          </p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)', fontWeight: 800, color: '#fff' }}>
            A track record of shipping at scale.
          </h2>
        </motion.div>

        {/* Timeline */}
        <div style={{ position: 'relative' }}>
          {/* Vertical line */}
          <div style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '2px',
            background: 'linear-gradient(180deg, #D4AF37 0%, rgba(212,175,55,0.1) 100%)',
          }} />

          {data.experience.map((exp, index) => (
            <motion.div
              key={`${exp.company}-${index}`}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15, duration: 0.7 }}
              viewport={{ once: true }}
              style={{
                position: 'relative',
                paddingLeft: '2.5rem',
                paddingBottom: index < data.experience.length - 1 ? 'clamp(2rem, 5vw, 3.5rem)' : 0,
              }}
            >
              {/* Timeline dot */}
              <div style={{
                position: 'absolute',
                left: '-6px',
                top: '6px',
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                background: '#D4AF37',
                border: '3px solid #050505',
                boxShadow: '0 0 12px rgba(212,175,55,0.6)',
              }} />

              {/* Card */}
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(212,175,55,0.15)',
                borderRadius: '16px',
                padding: 'clamp(1.25rem, 3vw, 1.75rem)',
                transition: 'border-color 0.3s',
              }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(212,175,55,0.4)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(212,175,55,0.15)')}
              >
                {/* Role + duration */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <h3 style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', fontWeight: 700, color: '#fff', margin: 0 }}>
                    {exp.role}
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '100px', padding: '0.2rem 0.7rem', whiteSpace: 'nowrap' }}>
                    {exp.duration}
                  </span>
                </div>

                {/* Company + location */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#D4AF37' }}>{exp.company}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: '#666' }}>
                    <FaMapMarkerAlt size={11} />
                    {exp.location}
                  </span>
                </div>

                {/* Tech chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
                  {exp.technologies.map(tech => (
                    <span key={tech} style={{
                      fontSize: '0.72rem',
                      color: '#D4AF37',
                      background: 'rgba(212,175,55,0.08)',
                      border: '1px solid rgba(212,175,55,0.2)',
                      borderRadius: '5px',
                      padding: '0.2rem 0.55rem',
                    }}>
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Achievements */}
                <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                  {exp.achievements.map((ach, i) => (
                    <li key={i} style={{
                      display: 'flex',
                      gap: '0.75rem',
                      marginBottom: '0.55rem',
                      color: '#aaa',
                      fontSize: 'clamp(0.82rem, 2vw, 0.9rem)',
                      lineHeight: 1.6,
                    }}>
                      <span style={{ color: '#D4AF37', flexShrink: 0, marginTop: '0.45rem', fontSize: '0.4rem', width: '6px', height: '6px', background: '#D4AF37', borderRadius: '50%', display: 'inline-block' }} />
                      {ach}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
