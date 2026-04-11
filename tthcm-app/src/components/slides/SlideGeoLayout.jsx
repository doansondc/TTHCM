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
              <p style={{ fontSize: '1.05rem', color: 'var(--text-primary)', lineHeight: 1.65, fontWeight: 500, maxWidth: '95%', margin: 0 }}>
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
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {block.points.map((pt, j) => (
                    <motion.li
                      key={j}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ delay: 0.44 + i * 0.08 + j * 0.07 }}
                      style={{
                        display: 'flex', gap: '0.6rem', alignItems: 'flex-start',
                        borderTop: j === 0 ? 'none' : '1px solid rgba(255,255,255,0.06)', paddingTop: j === 0 ? 0 : '0.55rem',
                      }}
                    >
                      <span style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: block.color, boxShadow: `0 0 6px ${block.color}`,
                        flexShrink: 0, marginTop: '0.55rem',
                      }} />
                      <span style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.7, fontWeight: 500 }}>
                        {pt}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: Vietnam Map (no frame, displayed directly) ── */}
        <motion.div
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
          style={{
            flex: 0.55, display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          <div style={{
            width: '100%', flex: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative'
          }}>
            <img 
              src="/images/vietnam_map.svg" 
              alt="Bản đồ Việt Nam"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }} 
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
