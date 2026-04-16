import React from 'react';
import { motion } from 'framer-motion';

/**
 * S1 — Title Slide · "Mission Briefing" Dark Layout
 * LEFT 56%: Globe + Title + Meta  |  RIGHT 44%: Delegation list
 */
export default function SlideTitle({ data }) {
  const { subject, classLT, classBT, teacher, title, subtitle, group, members, venue } = data;

  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'grid', gridTemplateColumns: '56% 44%',
      background: 'transparent',
      position: 'relative', overflow: 'hidden',
    }}>

      {/* ── Background grid lines ── */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.04,
        backgroundImage: `
          linear-gradient(rgba(232,184,75,1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(232,184,75,1) 1px, transparent 1px)
        `,
        backgroundSize: '48px 48px',
      }} />

      {/* ── Radial glow left ── */}
      <div style={{
        position: 'absolute', top: '35%', left: '20%',
        width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(232,184,75,0.07) 0%, transparent 68%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />

      {/* ── LEFT: Main content ─────────────────────────────────── */}
      <div style={{
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '2.8rem 2.6rem 2.8rem 3.2rem', gap: '1.1rem',
        borderRight: '1px solid rgba(255,255,255,0.05)',
        position: 'relative',
      }}>

        {/* Eyebrow label */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 13px',
            borderRadius: 100,
            background: 'rgba(232,184,75,0.10)',
            border: '1px solid rgba(232,184,75,0.25)',
            color: 'var(--gold)',
            fontSize: '0.70rem', fontWeight: 700,
            letterSpacing: '0.11em', textTransform: 'uppercase',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)', flexShrink: 0 }} />
            {subject}
          </span>
        </motion.div>

        {/* Hero title */}
        <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontWeight: 700,
            fontSize: '2.3rem', lineHeight: 1.13,
            margin: 0, marginBottom: '0.6rem',
          }}>
            <span style={{
              background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-vivid) 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              {title}
            </span>
          </h1>
          <p style={{
            fontSize: '1.45rem', color: 'var(--text-primary)', fontWeight: 600,
            lineHeight: 1.4, margin: 0,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(232,184,75,0.7) 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            {subtitle}
          </p>
        </motion.div>

        {/* Animated gold rule */}
        <motion.div
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          style={{ height: 2, width: 90, background: 'linear-gradient(90deg, var(--gold), transparent)', transformOrigin: 'left' }}
        />

        {/* Meta info — mono style */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          {[
            { label: 'GVHD', value: teacher },
            { label: 'HP', value: `${subject} · LT ${classLT} · BT ${classBT}` },
            { label: 'LOC', value: venue },
          ].map((row, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.7rem', alignItems: 'baseline' }}>
              <span style={{
                fontSize: '0.66rem', color: 'var(--gold)', fontWeight: 700,
                minWidth: '40px', letterSpacing: '0.10em', textTransform: 'uppercase',
                fontFamily: 'var(--font-mono)', flexShrink: 0,
              }}>{row.label}</span>
              <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>{row.value}</span>
            </div>
          ))}
        </motion.div>

        {/* Classification badge */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.60 }}
          style={{
            marginTop: '0.4rem',
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '4px 12px',
            border: '1px solid rgba(255,85,85,0.20)',
            borderRadius: 6,
            background: 'rgba(255,85,85,0.06)',
            width: 'fit-content',
          }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--red)', boxShadow: '0 0 6px var(--red)', flexShrink: 0 }} />
          <span style={{ fontSize: '0.64rem', fontWeight: 700, color: 'var(--red)', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
            Phiên · Nhóm 5 · Confidential
          </span>
        </motion.div>
      </div>

      {/* ── RIGHT: Delegation list ─────────────────────────────── */}
      <div style={{
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '2.4rem 2.8rem 2.4rem 2rem', gap: '0.45rem',
        background: 'rgba(255,255,255,0.018)',
        position: 'relative',
      }}>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          style={{
            fontSize: '0.66rem', fontWeight: 700, color: 'var(--gold)',
            letterSpacing: '0.14em', textTransform: 'uppercase',
            marginBottom: '0.6rem', fontFamily: 'var(--font-mono)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
          <span style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, var(--gold-border), transparent)' }} />
          ĐẠI BIỂU {group}
          <span style={{ flex: 1, height: 1, background: 'linear-gradient(270deg, var(--gold-border), transparent)' }} />
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
          {members.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.36 + i * 0.048, type: 'spring', stiffness: 150 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.85rem',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                paddingBottom: '0.45rem',
              }}
            >
              {/* Number badge */}
              <div style={{
                minWidth: 22, height: 22,
                borderRadius: 5,
                background: `hsla(${38 + i * 12}, 65%, 52%, 0.15)`,
                border: `1px solid hsla(${38 + i * 12}, 65%, 52%, 0.30)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.60rem', fontWeight: 700,
                color: `hsl(${38 + i * 12}, 65%, 62%)`,
                fontFamily: 'var(--font-mono)', flexShrink: 0,
              }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <div>
                <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                  {m.name}
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-quaternary)', marginTop: 1, fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>
                  {m.id}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
