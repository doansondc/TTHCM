import React from 'react';
import { motion } from 'framer-motion';

/**
 * SlideLessons — S10 & S11 · Dark "Mission Debrief" Edition
 * Layout: Magazine timeline with glowing numbered circles
 */
export default function SlideLessons({ data }) {
  const { subtitle, title, lessons } = data;
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      width: '100%', height: '100%',
      padding: '1.5rem 2.4rem 1.3rem',
      background: 'linear-gradient(160deg, #0d1117 0%, #0f1520 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Bg grid */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.03,
        backgroundImage: `linear-gradient(rgba(232,184,75,1) 1px, transparent 1px), linear-gradient(90deg, rgba(232,184,75,1) 1px, transparent 1px)`,
        backgroundSize: '48px 48px',
      }} />

      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="label-tag">{subtitle}</motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-2xl)', fontWeight: 700, color: 'var(--text-primary)', textAlign: 'center', lineHeight: 1.15, margin: 0 }}
        >
          {title}
        </motion.h2>
      </div>

      {/* Lessons timeline */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', flex: 1, justifyContent: 'center' }}>
        {lessons.map((lesson, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.18 + idx * 0.12, type: 'spring', stiffness: 140 }}
            style={{ display: 'flex', gap: '1.4rem', alignItems: 'flex-start', position: 'relative' }}
          >
            {/* Number + connector line */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '40px', flexShrink: 0 }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                border: `2px solid ${lesson.color}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: `${lesson.color}15`, color: lesson.color,
                fontSize: '0.82rem', fontWeight: 800,
                boxShadow: `0 0 16px ${lesson.color}35`,
                fontFamily: 'var(--font-mono)',
              }}>
                {String(lesson.number).padStart(2, '0')}
              </div>
              {idx !== lessons.length - 1 && (
                <div style={{
                  width: '2px',
                  background: `linear-gradient(to bottom, ${lesson.color}50, transparent)`,
                  flex: 1, minHeight: '24px', marginTop: '0.4rem',
                  marginBottom: '0.3rem', borderRadius: '1px',
                }} />
              )}
            </div>

            {/* Content */}
            <div style={{ flex: 1, paddingBottom: idx !== lessons.length - 1 ? '1rem' : '0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
                <span style={{ fontSize: '1.3rem', filter: `drop-shadow(0 0 8px ${lesson.color}50)` }}>{lesson.icon}</span>
                <div style={{
                  fontSize: 'var(--fs-md)', fontWeight: 700, color: 'var(--text-primary)',
                  lineHeight: 1.25,
                }}>
                  {lesson.headline}
                </div>
              </div>
              <p style={{
                fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)',
                lineHeight: 1.6, marginLeft: '2rem', maxWidth: '85%', margin: '0 0 0 2rem',
              }}>
                {lesson.text}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
