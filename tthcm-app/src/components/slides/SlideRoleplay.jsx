import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';

const ENV_URL = window.location.hostname === 'localhost' ? 'http://localhost:3001' : '';
const socket  = io(ENV_URL, { transports: ['websocket', 'polling'] });

/** S5 — Roleplay: "World Leaders Summit" Dark Edition */
export default function SlideRoleplay({ data }) {
  const { subtitle, title, desc, cards } = data;
  const [active, setActive] = useState(null);
  const [answered, setAnswered] = useState({});
  const [activeRoleplay, setActiveRoleplay] = useState(null);

  useEffect(() => {
    socket.on('roleplay_state', setActiveRoleplay);
    return () => { socket.off('roleplay_state'); };
  }, []);

  const handleCardClick = (idx) => {
    if (active === idx) {
      setActive(null);
      setAnswered(prev => { const n = { ...prev }; delete n[idx]; return n; });
      socket.emit('stop_roleplay_poll');
    } else {
      setActive(idx);
      const card = cards[idx];
      socket.emit('start_roleplay_poll', {
        cardIdx: idx, leader: card.leader, question: card.question,
        options: card.options, accentColor: card.accentColor,
      });
    }
  };

  const handleAnswer = (cardIdx, optIdx, e) => {
    e.stopPropagation();
    setAnswered(prev => ({ ...prev, [cardIdx]: optIdx }));
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      width: '100%', height: '100%',
      padding: '1.2rem 2rem 1.3rem',
      gap: '0.5rem',
      boxSizing: 'border-box',
      background: 'transparent',
      position: 'relative', overflow: 'hidden',
    }}>

      {/* Background grid */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.03,
        backgroundImage: `
          linear-gradient(rgba(232,184,75,1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(232,184,75,1) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
      }} />

      {/* ── Header ── */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem', flexShrink: 0 }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 13px', borderRadius: 100,
            background: 'rgba(232,184,75,0.10)',
            border: '1px solid rgba(232,184,75,0.25)',
            color: 'var(--gold)',
            fontSize: '0.70rem', fontWeight: 700,
            letterSpacing: '0.11em', textTransform: 'uppercase',
          }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)' }} />
          {subtitle}
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--fs-3xl)', fontWeight: 700,
            color: 'var(--text-primary)',
            textAlign: 'center', lineHeight: 1.12,
            letterSpacing: '-0.02em', margin: 0,
          }}
        >
          {title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.18 }}
          style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-tertiary)', textAlign: 'center', lineHeight: 1.5 }}
        >
          {desc}
        </motion.p>
      </div>

      {/* ── Cards row ── */}
      <div style={{ display: 'flex', gap: '0.7rem', flex: 1, alignItems: 'stretch', overflow: 'hidden' }}>
        {cards.map((card, idx) => {
          const isActive = active === idx;
          const isOther = active !== null && !isActive;
          const hasAnswer = answered[idx] !== undefined;

          return (
            <motion.div
              key={idx}
              onClick={() => handleCardClick(idx)}
              animate={{
                flex: isActive ? 3 : isOther ? 0.55 : 1,
                opacity: isOther ? 0.45 : 1,
              }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              style={{
                cursor: 'pointer',
                overflow: 'hidden',
                borderRadius: 14,
                background: isActive
                  ? `linear-gradient(180deg, ${card.accentColor}15 0%, rgba(16,22,32,0.95) 100%)`
                  : 'rgba(255,255,255,0.035)',
                border: `1px solid ${isActive ? card.accentColor + '40' : 'rgba(255,255,255,0.07)'}`,
                boxShadow: isActive
                  ? `0 0 40px ${card.accentColor}20, 0 4px 20px rgba(0,0,0,0.5), inset 0 0 30px rgba(0,0,0,0.2)`
                  : '0 2px 8px rgba(0,0,0,0.3)',
                display: 'flex', flexDirection: 'column',
                minWidth: 0, height: '100%',
                transition: 'background 0.3s, border-color 0.3s, box-shadow 0.3s',
              }}
            >
              {/* ── Country banner ── */}
              <div style={{
                padding: '0.75rem 1rem 0.55rem',
                display: 'flex', alignItems: 'center', gap: '0.55rem', flexShrink: 0,
                borderBottom: `1px solid ${isActive ? card.accentColor + '25' : 'rgba(255,255,255,0.05)'}`,
                background: isActive ? `${card.accentColor}08` : 'transparent',
              }}>
                <span style={{ fontSize: '1.4rem', lineHeight: 1,
                  filter: isActive ? `drop-shadow(0 0 10px ${card.accentColor})` : 'none',
                  transition: 'filter 0.3s',
                }}>
                  {card.flag}
                </span>
                <span style={{
                  fontSize: isActive ? '1.0rem' : '0.88rem',
                  fontWeight: 700,
                  color: isActive ? card.accentColor : 'var(--text-tertiary)',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  transition: 'all 0.25s', letterSpacing: '-0.01em',
                  textShadow: isActive ? `0 0 20px ${card.accentColor}50` : 'none',
                }}>
                  {card.country}
                </span>
              </div>

              {/* ── Image ── */}
              <div style={{
                flexShrink: 0, margin: '0.6rem 0.75rem 0',
                borderRadius: 8, overflow: 'hidden',
                height: isActive ? 95 : 68, transition: 'height 0.35s ease',
                position: 'relative',
                background: `linear-gradient(135deg, ${card.accentColor}18, ${card.accentColor}35)`,
              }}>
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '2rem', opacity: 0.2, zIndex: 0,
                }}>
                  {card.flag}
                </div>
                <img
                  src={card.image} alt=""
                  onError={e => { e.currentTarget.style.display = 'none'; }}
                  style={{
                    width: '100%', height: '100%', objectFit: 'cover',
                    opacity: isActive ? 0.85 : 0.5,
                    transition: 'opacity 0.3s ease',
                    position: 'relative', zIndex: 1,
                  }}
                />
                {/* Gradient overlay */}
                <div style={{
                  position: 'absolute', inset: 0, zIndex: 2,
                  background: `linear-gradient(180deg, transparent 40%, ${card.accentColor}40 100%)`,
                }} />
              </div>

              {/* ── Collapsed label ── */}
              {!isActive && (
                <div style={{
                  padding: '0.5rem 0.8rem', fontSize: '0.70rem',
                  color: 'var(--text-quaternary)', textAlign: 'center',
                  fontWeight: 500, lineHeight: 1.3,
                }}>
                  {card.leader}
                </div>
              )}

              {/* ── Expanded content ── */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.22, delay: 0.08 }}
                    style={{
                      padding: '0.75rem 1rem',
                      display: 'flex', flexDirection: 'column', gap: '0.65rem',
                      flex: 1, overflowY: 'auto',
                    }}
                    onClick={e => e.stopPropagation()}
                  >
                    {/* Leader role + question */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                      <span style={{
                        fontSize: '0.78rem', fontWeight: 700,
                        color: card.accentColor, letterSpacing: '0.08em',
                        textTransform: 'uppercase', fontFamily: 'var(--font-mono)',
                        textShadow: `0 0 12px ${card.accentColor}50`,
                      }}>
                        {card.leader}
                      </span>
                      <p style={{ fontSize: '0.96rem', color: 'var(--text-secondary)', lineHeight: 1.6, fontStyle: 'italic' }}>
                        "{card.question}"
                      </p>
                    </div>

                    {/* Options or result */}
                    {!hasAnswer ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.38rem' }}>
                        {card.options.map((opt, optIdx) => (
                          <motion.button
                            key={optIdx}
                            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: optIdx * 0.07 }}
                            onClick={e => handleAnswer(idx, optIdx, e)}
                            style={{
                              background: 'rgba(255,255,255,0.04)',
                              border: '1px solid rgba(255,255,255,0.08)',
                              borderRadius: 8,
                              padding: '0.6rem 0.9rem',
                              color: 'var(--text-secondary)',
                              fontSize: '0.92rem', textAlign: 'left',
                              cursor: 'pointer',
                              lineHeight: 1.5,
                              fontFamily: 'var(--font-sans)',
                              transition: 'all 0.15s ease',
                              display: 'flex', alignItems: 'center', gap: 7,
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.background = `${card.accentColor}15`;
                              e.currentTarget.style.borderColor = `${card.accentColor}45`;
                              e.currentTarget.style.color = 'var(--text-primary)';
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                              e.currentTarget.style.color = 'var(--text-secondary)';
                            }}
                          >
                            <span style={{
                              width: 6, height: 6, borderRadius: '50%',
                              background: card.accentColor, opacity: 0.7, flexShrink: 0,
                            }} />
                            <span style={{flex: 1}}>{opt.text}</span>
                            <span style={{ fontSize: '0.8rem', color: card.accentColor, fontWeight: 700, paddingLeft: 6 }}>
                              {activeRoleplay?.votes?.[optIdx]?.length ? `${activeRoleplay.votes[optIdx].length} 🧑‍💻` : ''}
                            </span>
                          </motion.button>
                        ))}
                      </div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                        style={{
                          background: card.options[answered[idx]].result.startsWith('✅')
                            ? 'rgba(61,214,140,0.08)' : 'rgba(255,85,85,0.08)',
                          border: `1px solid ${card.options[answered[idx]].result.startsWith('✅')
                            ? 'rgba(61,214,140,0.25)' : 'rgba(255,85,85,0.25)'}`,
                          borderRadius: 10, padding: '0.65rem 0.85rem',
                          display: 'flex', flexDirection: 'column', gap: 6,
                        }}
                      >
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-quaternary)', lineHeight: 1.3 }}>
                          Lựa chọn: <em style={{ color: 'var(--text-tertiary)' }}>{card.options[answered[idx]].text}</em>
                        </p>
                        <p style={{ fontSize: '0.94rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                          {card.options[answered[idx]].result}
                        </p>
                        <button
                          onClick={e => { e.stopPropagation(); setAnswered(prev => { const n = {...prev}; delete n[idx]; return n; }); }}
                          style={{
                            marginTop: 2, background: 'transparent', border: 'none',
                            color: card.accentColor, cursor: 'pointer',
                            fontSize: '0.70rem', fontFamily: 'var(--font-sans)',
                            textAlign: 'left', fontWeight: 600,
                          }}
                        >
                          ← Chọn lại
                        </button>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
