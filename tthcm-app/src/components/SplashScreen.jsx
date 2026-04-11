import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const INFO = {
  subject:  'Tư Tưởng Hồ Chí Minh · SSH1151',
  teacher:  'Phạm Thị Mai Duyên',
  classLT:  '170263',
  classBT:  '170265',
  group:    'Nhóm 5',
  venue:    'D5-101 · Tuần 32/35',
  title:    'Bức Tranh Địa Chính Trị Trung Đông',
  subtitle: 'và Bài Học Cho Việt Nam',
};

// Typewriter hook
function useTypewriter(text, speed = 38, delay = 0) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    let timeout;
    let i = 0;
    const start = () => {
      const tick = () => {
        if (i <= text.length) {
          setDisplayed(text.slice(0, i));
          i++;
          timeout = setTimeout(tick, speed);
        }
      };
      timeout = setTimeout(tick, delay);
    };
    start();
    return () => clearTimeout(timeout);
  }, [text, speed, delay]);
  return displayed;
}

const spring = { type: 'spring', stiffness: 180, damping: 22 };

// AnimatedGlobe — pure CSS/SVG globe with orbit lines
function TacticalGlobe() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" style={{ filter: 'drop-shadow(0 0 16px rgba(232,184,75,0.5))' }}>
      {/* Main circle */}
      <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(232,184,75,0.35)" strokeWidth="1.5" />
      {/* Meridians */}
      {[0, 30, 60, 90, 120, 150].map((deg, i) => (
        <ellipse key={i} cx="40" cy="40" rx={Math.abs(Math.cos(deg * Math.PI / 180)) * 36 + 2} ry="36"
          fill="none" stroke="rgba(232,184,75,0.12)" strokeWidth="0.8"
          transform={`rotate(${deg} 40 40)`} />
      ))}
      {/* Parallels */}
      {[-24, 0, 24].map((y, i) => {
        const r = Math.sqrt(36 * 36 - y * y);
        return <ellipse key={i} cx="40" cy={40 + y} rx={r} ry={r * 0.28}
          fill="none" stroke="rgba(232,184,75,0.14)" strokeWidth="0.8" />;
      })}
      {/* Middle East "hotspot" */}
      <circle cx="52" cy="36" r="3.5" fill="rgba(255,85,85,0.8)" />
      <circle cx="52" cy="36" r="6" fill="none" stroke="rgba(255,85,85,0.5)" strokeWidth="1">
        <animate attributeName="r" values="4;9;4" dur="2.2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.6;0;0.6" dur="2.2s" repeatCount="indefinite" />
      </circle>
      {/* Center hub */}
      <circle cx="40" cy="40" r="3" fill="rgba(232,184,75,0.6)" />
    </svg>
  );
}

export default function SplashScreen({ onStart }) {
  const [started, setStarted] = useState(false);
  const titleTyped = useTypewriter(INFO.title, 40, 600);
  const subtitleTyped = useTypewriter(INFO.subtitle, 36, 600 + INFO.title.length * 40 + 200);

  const handleStart = () => {
    setStarted(true);
    setTimeout(onStart, 900);
  };

  return (
    <AnimatePresence>
      {!started && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04, filter: 'blur(12px)' }}
          transition={{ duration: 0.85, ease: [0.4, 0, 1, 1] }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-sans)',
            overflow: 'hidden',
          }}
        >
          {/* ── Animated dark background ── */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(145deg, #0a0e14 0%, #0d1117 40%, #0f1520 70%, #0a0e14 100%)',
          }} />

          {/* ── Radial gold ambient glow ── */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'radial-gradient(ellipse 65% 50% at 50% 42%, rgba(232,184,75,0.06) 0%, transparent 70%)',
          }} />

          {/* ── Diagonal grid / map lines ── */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.025,
            backgroundImage: `
              linear-gradient(rgba(232,184,75,1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(232,184,75,1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }} />

          {/* ── Red corner blip — Middle East hotspot ── */}
          <div style={{
            position: 'absolute', top: '22%', right: '18%',
            width: 8, height: 8, borderRadius: '50%',
            background: 'rgba(255,85,85,0.9)',
            boxShadow: '0 0 16px rgba(255,85,85,0.6)',
            animation: 'live-pulse 1.6s ease-in-out infinite',
          }} />

          {/* ── Scanlines ── */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.02,
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 3px)',
            backgroundSize: '100% 3px',
          }} />

          {/* ── Center Content ── */}
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 28, maxWidth: 580, width: '90%', position: 'relative',
          }}>

            {/* Globe */}
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...spring, delay: 0.1 }}
            >
              <TacticalGlobe />
            </motion.div>

            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.26 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '5px 14px',
                borderRadius: 100,
                background: 'rgba(232,184,75,0.10)',
                border: '1px solid rgba(232,184,75,0.25)',
                color: 'var(--gold)',
                fontSize: '0.72rem', fontWeight: 700,
                letterSpacing: '0.12em', textTransform: 'uppercase',
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)', display: 'inline-block' }} />
              🏛️ &nbsp;{INFO.subject}
            </motion.div>

            {/* Title — typewriter */}
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.6rem, 4vw, 3rem)',
                lineHeight: 1.12,
                color: '#e8eaf0',
                fontWeight: 700,
                letterSpacing: '-0.025em',
                minHeight: '3.5em',
              }}>
                <span style={{
                  background: 'linear-gradient(135deg, #e8b84b 0%, #f5d070 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  {titleTyped}
                </span>
                {titleTyped.length < INFO.title.length && (
                  <span style={{
                    display: 'inline-block', width: 2, height: '0.8em',
                    background: 'var(--gold)', marginLeft: 3,
                    verticalAlign: 'middle',
                    animation: 'blink-cursor 0.9s ease-in-out infinite',
                  }} />
                )}
              </h1>
              <p style={{
                fontSize: 'clamp(0.9rem, 1.6vw, 1.15rem)',
                color: 'var(--text-tertiary)',
                fontWeight: 400, letterSpacing: '-0.005em',
                minHeight: '1.6em',
              }}>
                {subtitleTyped}
              </p>
            </div>

            {/* Info card — dark glassmorphism */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.40 }}
              style={{
                width: '100%',
                background: 'rgba(22,30,40,0.80)',
                backdropFilter: 'blur(28px) saturate(1.3)',
                WebkitBackdropFilter: 'blur(28px) saturate(1.3)',
                border: '1px solid rgba(255,255,255,0.09)',
                borderTop: '1px solid rgba(232,184,75,0.18)',
                borderRadius: 16,
                padding: '18px 26px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              }}
            >
              <div style={{
                fontSize: '0.68rem', color: 'var(--gold)', fontWeight: 700,
                letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 14,
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span style={{ width: 16, height: 1, background: 'var(--gold)', display: 'inline-block', opacity: 0.6 }} />
                Thông Tin Phiên Thuyết Trình
                <span style={{ width: 16, height: 1, background: 'var(--gold)', display: 'inline-block', opacity: 0.6 }} />
              </div>
              {[
                ['GVHD', INFO.teacher],
                ['Học phần', INFO.subject],
                ['Lớp LT · BT', `${INFO.classLT} · ${INFO.classBT}`],
                ['Nhóm · Phòng', `${INFO.group} · ${INFO.venue}`],
              ].map(([label, value], i) => (
                <div key={i} style={{
                  display: 'flex', gap: 12, alignItems: 'baseline',
                  padding: '6px 0',
                  borderTop: i > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                }}>
                  <span style={{
                    color: 'var(--text-quaternary)', fontSize: '0.80rem',
                    minWidth: 96, flexShrink: 0, fontWeight: 600,
                    fontFamily: 'var(--font-mono)', letterSpacing: '0.02em',
                  }}>
                    {label}
                  </span>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', fontWeight: 500 }}>
                    {value}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.58 }}
              whileHover={{ scale: 1.04, boxShadow: '0 0 40px rgba(232,184,75,0.45), 0 12px 36px rgba(232,184,75,0.20)' }}
              whileTap={{ scale: 0.97 }}
              onClick={handleStart}
              style={{
                background: 'linear-gradient(160deg, #f0ca6a 0%, #e8b84b 50%, #c89828 100%)',
                color: '#0d1117',
                border: 'none',
                borderRadius: 100,
                padding: '0 40px',
                height: 52,
                fontSize: '1.02rem',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                boxShadow: '0 4px 20px rgba(232,184,75,0.35), inset 0 1px 0 rgba(255,255,255,0.25)',
                letterSpacing: '-0.01em',
                display: 'flex', alignItems: 'center', gap: 10,
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>▶</span>
              Bắt Đầu Hội Nghị
            </motion.button>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.80 }}
              style={{
                fontSize: '0.72rem', color: 'var(--text-quaternary)',
                letterSpacing: '0.04em', fontFamily: 'var(--font-mono)',
              }}
            >
              ▸ nhấn phím bất kỳ hoặc click để khởi động
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
