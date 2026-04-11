import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * LiquidFlipCard — Apple Liquid Glass style
 * Props:
 *  - title: string (always visible above card)
 *  - icon: string/emoji
 *  - frontContent: React node
 *  - backContent: React node
 *  - accentColor: CSS color string
 *  - delay: number (animation delay)
 *  - height: string (CSS height, default '300px')
 */
export default function LiquidFlipCard({
  title,
  icon,
  frontContent,
  backContent,
  accentColor = 'var(--gold)',
  delay = 0,
  height = '300px',
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', flex: 1, minWidth: 0 }}
    >
      {/* Title always visible */}
      <div style={{
        textAlign: 'center',
        fontSize: '0.85rem',
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: accentColor,
        padding: '0.4rem 0',
        filter: 'drop-shadow(0 0 8px currentColor)',
      }}>
        {icon && <span style={{ marginRight: '6px' }}>{icon}</span>}
        {title}
      </div>

      {/* 3D Flip Card */}
      <div
        onClick={() => setFlipped(!flipped)}
        style={{
          perspective: '1200px',
          cursor: 'pointer',
          height,
          position: 'relative',
        }}
      >
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.65, ease: [0.645, 0.045, 0.355, 1] }}
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Front */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            borderRadius: '18px',
            background: 'rgba(255,255,255,0.08)',
            border: `1px solid rgba(255,255,255,0.20)`,
            backdropFilter: 'blur(40px) saturate(180%)',
            WebkitBackdropFilter: 'blur(40px) saturate(180%)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.15)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            overflow: 'hidden',
          }}>
            {/* Specular top highlight */}
            <div style={{
              position: 'absolute', top: 0, left: '15%', right: '15%', height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
            }} />
            {/* Accent bottom glow */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%',
              background: `linear-gradient(to top, ${accentColor}18, transparent)`,
              pointerEvents: 'none',
            }} />
            {frontContent}
            <div style={{
              position: 'absolute', bottom: '12px', right: '14px',
              fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)',
              display: 'flex', alignItems: 'center', gap: '4px',
            }}>
              <span>Nhấn để lật</span>
              <span style={{ fontSize: '1rem' }}>↩</span>
            </div>
          </div>

          {/* Back */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            borderRadius: '18px',
            background: `linear-gradient(145deg, ${accentColor}22, rgba(255,255,255,0.06))`,
            border: `1px solid ${accentColor}55`,
            backdropFilter: 'blur(40px) saturate(180%)',
            WebkitBackdropFilter: 'blur(40px) saturate(180%)',
            boxShadow: `0 8px 32px rgba(0,0,0,0.45), 0 0 0 1px ${accentColor}22, inset 0 1px 0 rgba(255,255,255,0.15)`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            padding: '1.5rem',
            overflowY: 'auto',
          }}>
            <div style={{
              position: 'absolute', top: 0, left: '15%', right: '15%', height: '1px',
              background: `linear-gradient(90deg, transparent, ${accentColor}88, transparent)`,
            }} />
            {backContent}
            <div style={{
              position: 'absolute', bottom: '12px', right: '14px',
              fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)',
              display: 'flex', alignItems: 'center', gap: '4px',
            }}>
              <span>Nhấn để quay lại</span>
              <span>↩</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
