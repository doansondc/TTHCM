import React from 'react';
import { motion } from 'framer-motion';

/**
 * SlideStaticCards — Displays all card content statically (no flip).
 * Replaces SlideFlipCards. Compatible with the same front/back data structure.
 * Supports optional `subImages` field for sub-images with captions inside a card.
 * Supports optional `intro` field for a context/cause text above the cards.
 */

function SubImage({ src, caption, accentColor }) {
  return (
    <div style={{
      borderRadius: 7, overflow: 'hidden', position: 'relative',
      flexShrink: 0, background: `${accentColor}18`,
    }}>
      <img
        src={src}
        alt={caption || ''}
        onError={e => { e.currentTarget.closest('[data-sub-img]').style.display = 'none'; }}
        style={{ width: '100%', height: 80, objectFit: 'cover', display: 'block', opacity: 0.88 }}
      />
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(180deg, transparent 45%, rgba(0,0,0,0.65) 100%)`,
        pointerEvents: 'none',
      }} />
      {caption && (
        <div style={{
          position: 'absolute', bottom: 5, left: 7, right: 7,
          fontSize: '0.60rem', fontWeight: 600, color: '#fff',
          lineHeight: 1.25, textShadow: '0 1px 4px rgba(0,0,0,0.9)',
        }}>
          {caption}
        </div>
      )}
    </div>
  );
}

function StaticCard({ card, delay }) {
  const { title, icon, accentColor, front, back, subImages } = card;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 110, damping: 16 }}
      style={{
        flex: 1, minWidth: 0,
        display: 'flex', flexDirection: 'column',
        background: 'linear-gradient(160deg, rgba(22,30,40,0.90), rgba(14,20,28,0.96))',
        border: `1px solid ${accentColor}28`,
        borderRadius: 13, overflow: 'hidden',
        boxShadow: `0 4px 28px rgba(0,0,0,0.45), 0 0 28px ${accentColor}0c`,
      }}
    >
      {/* Header image */}
      <div style={{
        height: 150, flexShrink: 0, overflow: 'hidden', position: 'relative',
        background: `linear-gradient(135deg, ${accentColor}18, ${accentColor}30)`,
      }}>
        <img
          src={front.image}
          alt=""
          onError={e => { e.currentTarget.style.opacity = 0; }}
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
        />
        {/* Dark gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(10,14,20,0.15) 0%, rgba(10,14,20,0.88) 100%)',
          pointerEvents: 'none',
        }} />
        {/* Icon + Title badge */}
        <div style={{
          position: 'absolute', bottom: 10, left: 12,
          display: 'flex', alignItems: 'center', gap: '0.5rem',
        }}>
          <span style={{
            fontSize: '1.3rem', lineHeight: 1,
            filter: `drop-shadow(0 0 10px ${accentColor}80)`,
          }}>
            {icon}
          </span>
          <span style={{
            fontSize: '0.98rem', fontWeight: 800,
            color: accentColor,
            textShadow: `0 0 18px ${accentColor}70, 0 2px 8px rgba(0,0,0,0.8)`,
            letterSpacing: '0.03em',
          }}>
            {title}
          </span>
        </div>
      </div>

      {/* Card body */}
      <div style={{
        padding: '0.7rem 1rem',
        flex: 1, display: 'flex', flexDirection: 'column', gap: '0.45rem',
        overflow: 'hidden',
      }}>
        {/* Headline */}
        <p style={{
          fontSize: '1.04rem', color: accentColor, fontWeight: 700,
          fontStyle: 'italic', lineHeight: 1.4, margin: 0,
          textShadow: `0 0 14px ${accentColor}45`,
          flexShrink: 0,
        }}>
          {front.headline}
        </p>

        {/* Sub-images (Suez, Hormuz, etc.) */}
        {subImages && subImages.length > 0 && (
          <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
            {subImages.map((si, i) => (
              <div key={i} data-sub-img style={{ flex: 1, minWidth: 0 }}>
                <SubImage src={si.src} caption={si.caption} accentColor={accentColor} />
              </div>
            ))}
          </div>
        )}

        {/* Bullet points */}
        <ul style={{
          listStyle: 'none', padding: 0, margin: 0,
          display: 'flex', flexDirection: 'column', gap: '0.38rem',
          overflowY: 'auto',
        }}>
          {back.points.map((pt, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.12 + i * 0.06 }}
              style={{
                display: 'flex', gap: '0.5rem', alignItems: 'flex-start',
                borderTop: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.06)',
                paddingTop: i === 0 ? 0 : '0.36rem',
              }}
            >
              <span style={{
                width: 5, height: 5, borderRadius: '50%',
                background: accentColor, boxShadow: `0 0 7px ${accentColor}`,
                flexShrink: 0, marginTop: '0.48rem',
              }} />
              <span style={{
                fontSize: '1.04rem', color: 'var(--text-secondary)',
                lineHeight: 1.62, fontWeight: 500,
              }}>
                {pt}
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

export default function SlideStaticCards({ data }) {
  const { subtitle, title, intro, cards } = data;

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      width: '100%', height: '100%',
      padding: '1.15rem 2rem 1.1rem',
      background: 'transparent',
    }}>
      {/* Header */}
      <div style={{
        marginBottom: '0.55rem',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem',
        flexShrink: 0,
      }}>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="label-tag"
        >
          {subtitle}
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            fontFamily: 'var(--font-display)', fontSize: 'var(--fs-2xl)',
            fontWeight: 700, color: 'var(--text-primary)',
            textAlign: 'center', lineHeight: 1.15, margin: 0,
          }}
        >
          {title}
        </motion.h2>

        {/* Optional intro / cause description — styled as a prominent callout box */}
        {intro && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              width: '100%',
              padding: '0.75rem 1.25rem',
              background: 'linear-gradient(135deg, rgba(232,184,75,0.10), rgba(232,184,75,0.04))',
              border: '1px solid rgba(232,184,75,0.30)',
              borderLeft: '3.5px solid rgba(232,184,75,0.75)',
              borderRadius: '0 10px 10px 0',
              boxShadow: '0 2px 16px rgba(232,184,75,0.06)',
            }}
          >
            <div style={{
              fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.12em',
              color: 'rgba(232,184,75,0.70)', textTransform: 'uppercase', marginBottom: '0.32rem',
              fontFamily: 'var(--font-mono)',
            }}>
              📌 Nguyên Nhân
            </div>
            <p style={{
              fontSize: '1.12rem', color: 'var(--text-secondary)', lineHeight: 1.62,
              margin: 0, fontWeight: 500,
            }}>
              {intro}
            </p>
          </motion.div>
        )}

      </div>

      {/* Cards row */}
      <div style={{
        display: 'flex', gap: '0.85rem', flex: 1,
        alignItems: 'stretch', minHeight: 0,
      }}>
        {cards.map((card, idx) => (
          <StaticCard
            key={card.title}
            card={card}
            delay={0.15 + idx * 0.09}
          />
        ))}
      </div>
    </div>
  );
}
