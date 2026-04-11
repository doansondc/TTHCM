import React from 'react';
import { motion } from 'framer-motion';

/**
 * SlideBamboo — S9 Ngoại giao Cây Tre · Dark "Vietnam Forest" Edition
 * 3-column layout, deep olive/forest dark nền, bamboo SVG connector
 */

// Subtle animated bamboo joint SVG divider
function BambooJoint({ color }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      position: 'absolute', top: 0, right: -1,
      height: '100%', zIndex: 2, pointerEvents: 'none',
    }}>
      <div style={{ flex: 1, width: 2, background: `linear-gradient(180deg, transparent, ${color}50, transparent)` }} />
    </div>
  );
}

export default function SlideBamboo({ data }) {
  const { subtitle, title, sections } = data;
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      width: '100%', height: '100%',
      padding: '1.5rem 2.2rem 1.3rem',
      background: 'transparent',
      position: 'relative', overflow: 'hidden',
    }}>

      {/* Background botanical texture */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.03,
        backgroundImage: `
          linear-gradient(rgba(61,214,140,1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(61,214,140,1) 1px, transparent 1px)
        `,
        backgroundSize: '52px 52px',
      }} />

      {/* Radial green ambient */}
      <div style={{
        position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)',
        width: 600, height: 400,
        background: 'radial-gradient(ellipse, rgba(29,160,80,0.08) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />

      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 13px', borderRadius: 100,
            background: 'rgba(61,214,140,0.10)',
            border: '1px solid rgba(61,214,140,0.25)',
            color: 'var(--green)',
            fontSize: '0.70rem', fontWeight: 700,
            letterSpacing: '0.11em', textTransform: 'uppercase',
          }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', flexShrink: 0 }} />
          {subtitle}
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            fontFamily: 'var(--font-display)', fontSize: 'var(--fs-2xl)',
            fontWeight: 700, textAlign: 'center', lineHeight: 1.15, margin: 0,
            background: 'linear-gradient(135deg, #3dd68c 0%, #66eaa6 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {title}
        </motion.h2>
      </div>

      {/* 3-column bamboo grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.2rem', flex: 1 }}>
        {sections.map((s, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + idx * 0.14, type: 'spring', stiffness: 110, damping: 18 }}
            style={{
              display: 'flex', flexDirection: 'column', gap: '1rem',
              position: 'relative',
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(61,214,140,0.10)',
              borderRadius: '12px', padding: '0', overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            }}
          >
            {/* Image header */}
            <div style={{ height: '130px', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
              <img
                src={s.image} alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }}
              />
              {/* Color overlay bottom-to-top */}
              <div style={{
                position: 'absolute', inset: 0,
                background: `linear-gradient(180deg, transparent 30%, ${s.color}cc 100%)`,
              }} />
              {/* Top-left dim */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(160deg, rgba(10,21,16,0.6) 0%, transparent 60%)',
              }} />
              {/* Icon + title badge */}
              <div style={{
                position: 'absolute', bottom: 12, left: 14,
                display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#fff',
              }}>
                <span style={{ fontSize: '1.4rem', filter: `drop-shadow(0 0 8px ${s.color})` }}>
                  {s.icon}
                </span>
                <span style={{
                  fontSize: 'var(--fs-md)', fontWeight: 700,
                  letterSpacing: '0.02em', textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                }}>
                  {s.title}
                </span>
              </div>
            </div>

            {/* Content */}
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '0.65rem', padding: '0 1rem 1rem' }}>
              <p style={{
                fontSize: '1.25rem', fontStyle: 'italic', fontWeight: 600,
                color: s.color, textShadow: `0 0 12px ${s.color}50`,
                margin: 0,
              }}>
                {s.headline}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {s.points.map((pt, j) => (
                  <motion.div
                    key={j}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: 0.55 + idx * 0.08 + j * 0.09 }}
                    style={{
                      borderTop: '1px solid rgba(255,255,255,0.05)',
                      paddingTop: '0.5rem',
                      display: 'flex', gap: '0.5rem', alignItems: 'flex-start',
                    }}
                  >
                    <span style={{
                      width: 4, height: 4, borderRadius: '50%',
                      background: s.color, boxShadow: `0 0 6px ${s.color}`,
                      flexShrink: 0, marginTop: '0.5rem',
                    }} />
                    <span style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      {pt}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
