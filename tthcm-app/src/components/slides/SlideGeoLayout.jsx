import React from 'react';
import { motion } from 'framer-motion';

/**
 * SlideGeoLayout — S8 · Dark "Strategic Intelligence" Edition
 * Layout: HERO top card + 2-column content + Vietnam map on right
 */
export default function SlideGeoLayout({ data }) {
  const { subtitle, title, topBlock, bottomLeft, bottomRight } = data;
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      width: '100%', height: '100%',
      padding: '1.2rem 1.8rem 1.1rem',
      background: 'transparent',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Grid bg */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.03,
        backgroundImage: `linear-gradient(rgba(232,184,75,1) 1px, transparent 1px), linear-gradient(90deg, rgba(232,184,75,1) 1px, transparent 1px)`,
        backgroundSize: '48px 48px',
      }} />

      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', marginBottom: '0.8rem' }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="label-tag">{subtitle}</motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-2xl)', fontWeight: 700, color: 'var(--text-primary)', textAlign: 'center', lineHeight: 1.15, margin: 0 }}
        >
          {title}
        </motion.h2>
      </div>

      {/* Main body: left content + right map */}
      <div style={{ display: 'flex', gap: '1.4rem', flex: 1, overflow: 'hidden' }}>

        {/* ── LEFT: content ── */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1.4, gap: '0.9rem', minWidth: 0 }}>

          {/* Top hero block */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            style={{
              display: 'flex', alignItems: 'flex-start', gap: '1.2rem',
              background: 'rgba(232,184,75,0.04)',
              border: '1px solid rgba(232,184,75,0.12)',
              borderRadius: 12, padding: '0.9rem 1.2rem', flexShrink: 0,
            }}
          >
            <span style={{
              fontSize: '2.6rem',
              filter: 'drop-shadow(0 4px 14px rgba(232,184,75,0.5))',
              flexShrink: 0, lineHeight: 1,
            }}>
              {topBlock.icon}
            </span>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '0.68rem', fontWeight: 700, color: 'var(--gold)',
                letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.35rem',
                fontFamily: 'var(--font-mono)',
              }}>
                {topBlock.title}
              </div>
              <p style={{ fontSize: 'var(--fs-md)', color: 'var(--text-primary)', lineHeight: 1.6, fontWeight: 500, maxWidth: '95%', margin: 0 }}>
                {topBlock.text}
              </p>
            </div>
          </motion.div>

          {/* Bottom 2-column */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem', flex: 1 }}>
            {[bottomLeft, bottomRight].map((block, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.30 + i * 0.12 }}
                style={{ display: 'flex', flexDirection: 'column' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '1.5rem', lineHeight: 1, filter: `drop-shadow(0 0 10px ${block.color}60)` }}>
                    {block.icon}
                  </span>
                  <span style={{
                    fontSize: '1.15rem', fontWeight: 700, color: block.color,
                    textShadow: `0 0 20px ${block.color}40`,
                  }}>
                    {block.title}
                  </span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.55rem', flex: 1 }}>
                  {block.points.map((pt, j) => (
                    <motion.li
                      key={j}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ delay: 0.44 + i * 0.08 + j * 0.07 }}
                      style={{
                        display: 'flex', gap: '0.6rem', alignItems: 'flex-start',
                        borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.55rem',
                      }}
                    >
                      <span style={{
                        width: 5, height: 5, borderRadius: '50%',
                        background: block.color, boxShadow: `0 0 6px ${block.color}`,
                        flexShrink: 0, marginTop: '0.5rem',
                      }} />
                      <span style={{ fontSize: 'var(--fs-md)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        {pt}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: Vietnam Map ── */}
        <motion.div
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
          style={{
            flex: 0.55, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            background: 'rgba(232,184,75,0.03)',
            border: '1px solid rgba(232,184,75,0.14)',
            borderRadius: 14,
            padding: '0.75rem 0.8rem 0.6rem',
            overflow: 'hidden', position: 'relative',
          }}
        >
          <div style={{
            fontSize: '0.60rem', color: 'var(--gold)', fontWeight: 700,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            fontFamily: 'var(--font-mono)', marginBottom: '0.5rem', textAlign: 'center',
          }}>
            🗺️ Bản Đồ Việt Nam
          </div>
          <div style={{
            flex: 1, width: '100%', position: 'relative',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: 8, overflow: 'hidden'
          }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15654316.559385551!2d104.91266205609459!3d16.03572856000213!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31157a4d736a1e5f%3A0xb03bb0c9e2fe62be!2sVietnam!5e0!3m2!1sen!2s!4v1712869500000!5m2!1sen!2s"
              width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
