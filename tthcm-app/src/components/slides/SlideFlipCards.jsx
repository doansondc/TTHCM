import React, { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * FlipCards Slide — Dark "Intelligence Dossier" style
 * Front: Full-bleed image + icon badge + headline
 * Back: Dark analysis panel with numbered intel points
 */
function FlipCard({ card, idx, delay }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 110, damping: 16 }}
      style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}
    >
      {/* ── Title strip ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.65rem',
        padding: '0.7rem 0 0.5rem 0',
        borderBottom: `2px solid ${card.accentColor}40`,
        flexShrink: 0, marginBottom: '0.85rem',
      }}>
        <span style={{ fontSize: '1.3rem', lineHeight: 1, filter: 'drop-shadow(0 0 8px currentColor)' }}>
          {card.icon}
        </span>
        <span style={{
          fontSize: 'var(--fs-md)', fontWeight: 700, lineHeight: 1.2,
          textTransform: 'uppercase', letterSpacing: '0.06em',
          color: card.accentColor,
          textShadow: `0 0 20px ${card.accentColor}60`,
        }}>
          {card.title}
        </span>
      </div>

      {/* ── Flip body ── */}
      <div
        className="flip-card-scene"
        style={{ flex: 1, cursor: 'pointer' }}
        onClick={() => setFlipped(f => !f)}
      >
        <div className={`flip-card-inner${flipped ? ' flipped' : ''}`} style={{ height: '100%' }}>

          {/* ══ FRONT ══ */}
          <div className="flip-card-face" style={{ height: '100%', display: 'flex', flexDirection: 'column', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
            {/* Image */}
            {card.front.image && (
              <div style={{
                height: '195px', flexShrink: 0, overflow: 'hidden',
                borderRadius: '10px', position: 'relative',
                background: `linear-gradient(135deg, ${card.accentColor}18 0%, ${card.accentColor}35 100%)`,
                backfaceVisibility: 'hidden', 
                WebkitBackfaceVisibility: 'hidden',
                transform: 'translateZ(0)' // Hardware acceleration to enforce backface clipping
              }}>
                {/* Fallback icon */}
                <div style={{
                  position: 'absolute', inset: 0, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: '3.5rem', opacity: 0.25, zIndex: 0,
                }}>
                  {card.icon}
                </div>
                <img
                  src={card.front.image} alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.80, position: 'relative', zIndex: 1, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                  onError={e => { e.currentTarget.style.display = 'none'; }}
                />
                {/* Bottom gradient overlay */}
                <div style={{
                  position: 'absolute', inset: 0, zIndex: 2,
                  background: `linear-gradient(180deg, transparent 35%, ${card.accentColor}50 100%)`,
                  backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden'
                }} />
                {/* Status badge */}
                <div style={{
                  position: 'absolute', top: 10, right: 10, zIndex: 3,
                  padding: '3px 9px', borderRadius: 100,
                  background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)',
                  border: `1px solid ${card.accentColor}40`,
                  fontSize: '0.60rem', fontWeight: 700, color: card.accentColor,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  fontFamily: 'var(--font-mono)',
                }}>
                  PHÂN TÍCH
                </div>
              </div>
            )}

            {/* Headline */}
            <div style={{ padding: '0.9rem 0.2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <p style={{
                fontSize: '1.35rem', color: 'var(--text-primary)',
                lineHeight: 1.5, fontWeight: 600, margin: 0,
              }}>
                {card.front.headline}
              </p>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                color: card.accentColor, fontSize: 'var(--fs-sm)',
                marginTop: 'auto', fontWeight: 700, userSelect: 'none',
                letterSpacing: '0.06em',
                opacity: 0.8,
              }}>
                <span style={{ fontSize: '1.1rem' }}>↻</span>
                <span>NHẤN ĐỂ PHÂN TÍCH</span>
              </div>
            </div>
          </div>

          {/* ══ BACK ══ */}
          <div
            className="flip-card-back flip-card-face"
            style={{
              height: '100%', cursor: 'pointer',
              background: `linear-gradient(145deg, rgba(22,30,40,0.95) 0%, rgba(16,22,30,0.98) 100%)`,
              border: `1px solid ${card.accentColor}25`,
              borderRadius: '10px', padding: '1.2rem 1.3rem',
              boxShadow: `0 0 30px ${card.accentColor}18, inset 0 0 30px rgba(0,0,0,0.2)`,
              display: 'flex', flexDirection: 'column',
              boxSizing: 'border-box',
            }}
          >
            <h4 style={{
              color: card.accentColor, fontSize: '0.85rem',
              textTransform: 'uppercase', letterSpacing: '0.12em',
              marginBottom: '0.6rem', fontFamily: 'var(--font-mono)',
              display: 'flex', alignItems: 'center', gap: 6,
              flexShrink: 0,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: card.accentColor, boxShadow: `0 0 8px ${card.accentColor}`, display: 'inline-block' }} />
              Chi tiết phân tích ↻
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', padding: 0, margin: 0, flex: 1 }}>
              {card.back.points.map((pt, i) => (
                <li key={i} style={{
                  display: 'flex', gap: '0.7rem', alignItems: 'flex-start',
                  borderTop: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.06)',
                  paddingTop: i === 0 ? 0 : '0.7rem',
                }}>
                  <span style={{
                    color: card.accentColor, fontWeight: 800, fontSize: '1.05rem',
                    lineHeight: 1.65, flexShrink: 0,
                    fontFamily: 'var(--font-mono)',
                  }}>
                    {String(i + 1).padStart(2, '0')}.
                  </span>
                  <span style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.7, fontWeight: 500 }}>
                    {pt}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function SlideFlipCards({ data }) {
  const { subtitle, title, cards } = data;
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      width: '100%', height: '100%',
      padding: '1.5rem 2.2rem 1.3rem',
      background: 'transparent',
    }}>
      {/* Header */}
      <div style={{ marginBottom: '0.9rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="label-tag">
          {subtitle}
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            fontFamily: 'var(--font-display)', fontSize: 'var(--fs-2xl)',
            fontWeight: 700, color: 'var(--text-primary)',
            textAlign: 'center', lineHeight: 1.15, margin: 0,
          }}
        >
          {title}
        </motion.h2>
      </div>

      {/* Cards row */}
      <div style={{ display: 'flex', gap: '1rem', flex: 1, alignItems: 'stretch' }}>
        {cards.map((card, idx) => (
          <FlipCard key={idx} card={card} idx={idx} delay={0.15 + idx * 0.09} />
        ))}
      </div>
    </div>
  );
}
