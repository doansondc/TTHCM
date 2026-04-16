import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const spring = { type: 'spring', stiffness: 320, damping: 28 };

export default function LockScreen({ onUnlock }) {
  const [code,          setCode]         = useState('');
  const [error,         setError]        = useState(false);
  const [shake,         setShake]        = useState(false);
  const [slidePassword, setSlidePassword] = useState('115168');

  useEffect(() => {
    fetch('/api/config')
      .then(r => r.json())
      .then(d => { if (d.slidePassword) setSlidePassword(d.slidePassword); })
      .catch(() => {});
  }, []);

  const handleDigit = (d) => {
    if (code.length >= 8) return; // allows up to 8 digits
    setCode(c => c + d);
  };

  const handleDelete = () => setCode(c => c.slice(0, -1));

  const verify = () => {
    if (code === slidePassword) {
      onUnlock();
    } else {
      setShake(true); setError(true);
      setTimeout(() => { setCode(''); setError(false); setShake(false); }, 900);
    }
  };

  useEffect(() => {
    const fn = (e) => {
      if (/^\d$/.test(e.key)) handleDigit(e.key);
      if (e.key === 'Backspace') handleDelete();
      if (e.key === 'Enter') verify();
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [code, slidePassword]);

  const numKeys = [1, 2, 3, 4, 5, 6, 7, 8, 9, '⌫', 0, 'OK'];

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'linear-gradient(160deg, #0c0c18 0%, #10101e 50%, #0d0d1c 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-sans)',
      WebkitFontSmoothing: 'antialiased',
      zIndex: 9999, gap: 0,
    }}>
      {/* Ambient glow */}
      <div style={{ position:'absolute', inset:0, pointerEvents:'none',
        background:'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(176,125,16,0.05) 0%, transparent 70%)' }} />

      <motion.div
        animate={shake ? { x: [-8, 8, -6, 6, -3, 3, 0] } : { x: 0 }}
        transition={{ duration: 0.42 }}
        style={{ display:'flex', flexDirection:'column', alignItems:'center', gap: 32, position:'relative' }}
      >
        {/* Lock icon */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ ...spring, delay: 0.05 }}
          style={{ fontSize: '2.8rem', lineHeight: 1 }}
        >
          🔐
        </motion.div>

        {/* Title block */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          style={{ textAlign: 'center', display:'flex', flexDirection:'column', gap: 6 }}
        >
          <h1 style={{
            fontSize: '1.35rem', color: 'rgba(255,255,255,0.92)',
            fontFamily: 'var(--font-display)', fontWeight: 600,
            letterSpacing: '-0.01em', lineHeight: 1.2,
          }}>
            Hội Nghị Trung Đông 2026
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.32)', fontSize: '0.82rem', fontWeight: 400 }}>
            Nhập mật khẩu trình chiếu
          </p>
        </motion.div>

        {/* Dot indicators */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          style={{ display:'flex', gap: 12, alignItems:'center', height: 20 }}
        >
          {[...Array(slidePassword.length)].map((_, i) => {
            const filled = i < code.length;
            return (
              <motion.div key={i}
                animate={{
                  scale: i === code.length - 1 ? [1, 1.25, 1] : 1,
                  backgroundColor: error ? '#f87171' : filled ? '#d4a018' : 'rgba(255,255,255,0.18)',
                }}
                transition={{ duration: 0.18 }}
                style={{
                  width: 12, height: 12, borderRadius: '50%',
                  border: `1.5px solid ${error ? 'rgba(248,113,113,0.4)' : filled ? 'rgba(212,160,24,0.5)' : 'rgba(255,255,255,0.22)'}`,
                  boxShadow: filled && !error ? '0 0 8px rgba(212,160,24,0.45)' : 'none',
                }}
              />
            );
          })}
        </motion.div>

        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.p
              key="err"
              initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ color: '#f87171', fontSize: '0.80rem', marginTop: -20, fontWeight: 500 }}
            >
              Mật khẩu không đúng, thử lại
            </motion.p>
          )}
        </AnimatePresence>

        {/* Numpad */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}
          style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 72px)',
            gap: 12,
          }}
        >
          {numKeys.map((k, i) => {
            const isDelete = k === '⌫';
            const isOk = k === 'OK';
            return (
              <motion.button
                key={i}
                whileTap={{ scale: 0.91 }}
                onClick={() => {
                  if (isDelete) handleDelete();
                  else if (isOk) verify();
                  else handleDigit(String(k));
                }}
                style={{
                  width: 72, height: 72,
                  borderRadius: '50%',
                  border: '1px solid rgba(255,255,255,0.10)',
                  background: isDelete || isOk ? 'transparent' : 'rgba(255,255,255,0.07)',
                  backdropFilter: 'blur(20px)',
                  color: isDelete ? 'rgba(255,255,255,0.45)' : isOk ? '#f0c040' : 'rgba(255,255,255,0.88)',
                  fontSize: isDelete || isOk ? '1.4rem' : '1.55rem',
                  fontWeight: isDelete || isOk ? 600 : 300,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                  transition: 'background 0.12s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
                onMouseEnter={e => { if(!isDelete && !isOk) e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
                onMouseLeave={e => { if(!isDelete && !isOk) e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
              >
                {k}
              </motion.button>
            );
          })}
        </motion.div>

        <p style={{ color: 'rgba(255,255,255,0.16)', fontSize: '0.72rem', fontWeight: 400 }}>
          Hoặc nhập từ bàn phím vật lý
        </p>
      </motion.div>
    </div>
  );
}
