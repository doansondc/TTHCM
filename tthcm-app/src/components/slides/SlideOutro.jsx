import React from 'react';
import { motion } from 'framer-motion';

/**
 * SlideOutro — S15 · Dark "Closing Statement" Edition
 */
export default function SlideOutro({ data }) {
  const { subtitle, title, quote, author, group, teacher } = data;
  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative',
      background: 'transparent',
      overflow: 'hidden',
    }}>
      {/* Radial gold center glow */}
      <div style={{
        position: 'absolute', top: '40%', left: '50%', transform: 'translateX(-50%)',
        width: 500, height: 500,
        background: 'radial-gradient(circle, rgba(232,184,75,0.07) 0%, transparent 65%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />

      {/* Decorative corner marks */}
      {[
        { top: 22, left: 22, borderTop: true, borderLeft: true },
        { top: 22, right: 22, borderTop: true, borderRight: true },
        { bottom: 22, left: 22, borderBottom: true, borderLeft: true },
        { bottom: 22, right: 22, borderBottom: true, borderRight: true },
      ].map((pos, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: pos.top, bottom: pos.bottom,
            left: pos.left, right: pos.right,
            width: 28, height: 28,
            borderTop: pos.borderTop ? '2px solid rgba(232,184,75,0.25)' : 'none',
            borderBottom: pos.borderBottom ? '2px solid rgba(232,184,75,0.25)' : 'none',
            borderLeft: pos.borderLeft ? '2px solid rgba(232,184,75,0.25)' : 'none',
            borderRight: pos.borderRight ? '2px solid rgba(232,184,75,0.25)' : 'none',
          }}
        />
      ))}

      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: '1.5rem', maxWidth: '720px', width: '100%',
        padding: '2rem 3rem', textAlign: 'center', position: 'relative',
      }}>
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="label-tag"
        >
          {subtitle}
        </motion.div>

        {/* Main title */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
          style={{
            fontFamily: 'var(--font-display)', fontWeight: 700,
            fontSize: 'clamp(1.8rem, 4.5vw, var(--fs-4xl))', lineHeight: 1.08, margin: 0,
            background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-vivid) 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          {title}
        </motion.h1>

        {/* Gold divider */}
        <motion.div
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ delay: 0.38, duration: 0.7 }}
          style={{
            width: 120, height: 2,
            background: 'linear-gradient(90deg, transparent, var(--gold) 30%, var(--gold) 70%, transparent)',
            borderRadius: 2, transformOrigin: 'center',
          }}
        />

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{ position: 'relative', width: '100%', padding: '0.5rem 0' }}
        >
          <span style={{
            position: 'absolute', top: '-2.2rem', left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '5.5rem', fontFamily: 'Georgia, serif',
            color: 'rgba(232,184,75,0.10)', lineHeight: 1, userSelect: 'none',
          }}>"</span>
          <p style={{
            position: 'relative', zIndex: 1,
            fontFamily: 'var(--font-display)', fontStyle: 'italic',
            fontSize: '1.18rem', color: 'var(--text-secondary)',
            lineHeight: 1.6, marginBottom: '0.9rem', margin: '0 0 0.9rem 0',
            textAlign: 'center',
          }}>
            {quote}
          </p>
          <p style={{
              fontSize: 'var(--fs-sm)', fontWeight: 700, color: 'var(--gold)',
              letterSpacing: '0.2em', textTransform: 'uppercase',
              position: 'relative', zIndex: 1, margin: 0,
              whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
            }}>
              <span style={{ opacity: 0.6 }}>— —</span>
              {author}
              <span style={{ opacity: 0.6 }}>— —</span>
            </p>
        </motion.div>

        {/* Footer credits */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.68 }}
          style={{
            fontSize: 'var(--fs-xs)', color: 'var(--text-quaternary)',
            lineHeight: 2, fontFamily: 'var(--font-mono)',
          }}
        >
          <div>{group}</div>
          <div>{teacher}</div>
        </motion.div>
      </div>
    </div>
  );
}
