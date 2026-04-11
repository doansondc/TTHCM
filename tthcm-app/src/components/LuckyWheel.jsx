import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';

const ENV_URL = window.location.hostname === 'localhost' ? 'http://localhost:3001' : '';
const socket = io(ENV_URL, { transports: ['websocket', 'polling'] });

// ── Confetti particles ────────────────────────────────────────
function ConfettiPiece({ delay, color }) {
  const x = Math.random() * 100;
  const rotate = Math.random() * 720 - 360;
  return (
    <motion.div
      initial={{ opacity: 1, y: -20, x: `${x}vw`, rotate: 0, scale: 1 }}
      animate={{ opacity: [1, 1, 0], y: '110vh', rotate, scale: [1, 0.8, 0.4] }}
      transition={{ duration: 2.5 + Math.random() * 1.5, delay, ease: 'easeIn' }}
      style={{
        position: 'fixed', top: 0, width: 10, height: 10,
        borderRadius: Math.random() > 0.5 ? '50%' : 2,
        background: color, pointerEvents: 'none', zIndex: 9000,
      }}
    />
  );
}

const CONFETTI_COLORS = ['#e8b84b','#f87171','#60a5fa','#34d97b','#a78bfa','#f97316','#fff'];

export default function LuckyWheel() {
  const [participants, setParticipants] = useState([]); // Q&A participants
  const [phase, setPhase]               = useState('idle'); // idle | scanning | reveal
  const [winner, setWinner]             = useState(null);
  const [scanIdx, setScanIdx]           = useState(0);
  const [confetti, setConfetti]         = useState([]);
  const scanRef  = useRef(null);
  const scanRef2 = useRef(null);

  // Load Q&A participants + listen for updates
  useEffect(() => {
    socket.emit('get_qa_participants');
    socket.on('qa_participants', setParticipants);

    // When new question arrives, refresh list
    socket.on('new_question', () => socket.emit('get_qa_participants'));
    socket.on('update_questions', () => socket.emit('get_qa_participants'));

    socket.on('wheel_winner', (person) => {
      setWinner(person);
      setPhase('reveal');
      clearInterval(scanRef.current);
      clearInterval(scanRef2.current);
      // Burst confetti
      setConfetti(Array.from({ length: 60 }, (_, i) => ({
        id: i,
        delay: i * 0.03,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      })));
      setTimeout(() => setConfetti([]), 5000);
    });

    return () => {
      socket.off('qa_participants');
      socket.off('new_question');
      socket.off('update_questions');
      socket.off('wheel_winner');
    };
  }, []);

  const startDraw = () => {
    if (phase === 'scanning' || participants.length === 0) return;
    setWinner(null);
    setPhase('scanning');

    const pool = participants.length > 0 ? participants : [];
    let idx = 0;
    let speed = 60; // ms per tick — starts fast, slows down

    const scheduleTick = () => {
      scanRef.current = setTimeout(() => {
        idx = (idx + 1) % pool.length;
        setScanIdx(idx);
        speed = Math.min(speed * 1.06, 320);
        if (speed < 320) {
          scheduleTick();
        } else {
          // Final slowdown phase
          let remaining = 6;
          scanRef2.current = setInterval(() => {
            idx = (idx + 1) % pool.length;
            setScanIdx(idx);
            remaining--;
            if (remaining <= 0) {
              clearInterval(scanRef2.current);
              socket.emit('spin_wheel');
            }
          }, 380);
        }
      }, speed);
    };
    scheduleTick();
  };

  const reset = () => {
    setPhase('idle');
    setWinner(null);
    setConfetti([]);
    clearInterval(scanRef.current);
    clearInterval(scanRef2.current);
  };

  const noParticipants = participants.length === 0;

  return (
    <div style={{
      display: 'flex', flexDirection: 'row',
      alignItems: 'stretch', justifyContent: 'center',
      gap: '2rem', width: '100%', height: '100%',
    }}>
      {/* ── Confetti ── */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9000, overflow: 'hidden' }}>
        <AnimatePresence>
          {confetti.map(c => <ConfettiPiece key={c.id} delay={c.delay} color={c.color} />)}
        </AnimatePresence>
      </div>

      {/* ── LEFT: Main draw area ── */}
      <div style={{
        flex: 1.2, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: '1.5rem',
      }}>

        {/* Scanner / Result card */}
        <div style={{ position: 'relative', minWidth: '28rem', width: 'max-content', maxWidth: '100%' }}>

          {/* Scanning card */}
          <AnimatePresence mode="wait">
            {phase === 'idle' && (
              <motion.div key="idle"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                style={{
                  background: 'rgba(232,184,75,0.04)',
                  border: '1px solid rgba(232,184,75,0.18)',
                  borderRadius: 20, padding: '2.8rem 2rem',
                  textAlign: 'center', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: '1rem',
                }}
              >
                <div style={{ fontSize: '3.5rem' }}>🎲</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--text-primary)', fontWeight: 700 }}>
                  Bốc Thăm May Mắn
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-quaternary)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>
                  {noParticipants ? 'Chờ khán giả đặt câu hỏi...' : `${participants.length} người tham gia Q&A`}
                </div>
              </motion.div>
            )}

            {phase === 'scanning' && participants.length > 0 && (
              <motion.div key="scanning"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  background: 'linear-gradient(160deg, rgba(232,184,75,0.08) 0%, rgba(13,17,23,0.95) 100%)',
                  border: '1.5px solid rgba(232,184,75,0.35)',
                  borderRadius: 20, padding: '2.8rem 2.2rem',
                  textAlign: 'center',
                  boxShadow: '0 0 40px rgba(232,184,75,0.18), 0 0 80px rgba(232,184,75,0.06)',
                  position: 'relative', overflow: 'hidden',
                }}
              >
                {/* Scan line effect */}
                <motion.div
                  animate={{ y: ['-100%', '200%'] }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  style={{
                    position: 'absolute', left: 0, right: 0, height: 2,
                    background: 'linear-gradient(90deg, transparent, rgba(232,184,75,0.6), transparent)',
                    pointerEvents: 'none', zIndex: 2,
                  }}
                />

                <div style={{ fontSize: '0.68rem', color: 'var(--gold)', fontFamily: 'var(--font-mono)', letterSpacing: '0.18em', marginBottom: '1.2rem', textTransform: 'uppercase' }}>
                  ⚡ Đang Bốc Thăm...
                </div>

                <AnimatePresence mode="wait">
                  <motion.div key={scanIdx}
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.08 }}
                  >
                    <div style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: (participants[scanIdx]?.name?.length || 0) > 14 ? `${Math.max(0.6, 45 / (participants[scanIdx]?.name?.length || 1))}rem` : '3.2rem',
                      whiteSpace: 'nowrap',
                      fontWeight: 700, color: 'var(--text-primary)',
                      lineHeight: 1.2, marginBottom: '0.6rem',
                    }}>
                      {participants[scanIdx]?.name || '—'}
                    </div>
                    <div style={{ fontSize: '1.3rem', color: 'var(--gold)', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', fontWeight: 600 }}>
                      {participants[scanIdx]?.mssv || ''}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            )}

            {phase === 'reveal' && winner && (
              <motion.div key="reveal"
                initial={{ opacity: 0, scale: 0.7, rotate: -3 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 180, damping: 18 }}
                style={{
                  background: 'linear-gradient(160deg, rgba(232,184,75,0.12) 0%, rgba(13,17,23,0.97) 100%)',
                  border: '2.5px solid rgba(232,184,75,0.65)',
                  borderRadius: 22, padding: '2.4rem 2rem',
                  textAlign: 'center',
                  boxShadow: '0 0 60px rgba(232,184,75,0.35), 0 0 120px rgba(232,184,75,0.12), 0 20px 50px rgba(0,0,0,0.7)',
                  position: 'relative', overflow: 'hidden',
                }}
              >
                {/* Gold radial glow bg */}
                <div style={{
                  position: 'absolute', inset: 0, pointerEvents: 'none',
                  background: 'radial-gradient(ellipse at center, rgba(232,184,75,0.15) 0%, transparent 65%)',
                }} />

                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: [0, 1.25, 1] }}
                  transition={{ delay: 0.15, duration: 0.6, type: 'spring' }}
                  style={{ fontSize: '3.5rem', marginBottom: '0.7rem', position: 'relative', zIndex: 1 }}
                >
                  🎉
                </motion.div>

                <div style={{ fontSize: '0.65rem', color: 'var(--text-quaternary)', fontFamily: 'var(--font-mono)', letterSpacing: '0.16em', marginBottom: '0.8rem', textTransform: 'uppercase', position: 'relative', zIndex: 1 }}>
                  ✨ Người Được Bốc Thăm
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  style={{ position: 'relative', zIndex: 1 }}
                >
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: ((typeof winner === 'object' ? winner.name : winner)?.length || 0) > 14 ? `${Math.max(0.6, 50 / ((typeof winner === 'object' ? winner.name : winner)?.length || 1))}rem` : '3.6rem',
                    whiteSpace: 'nowrap',
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #f0ca6a, #e8b84b, #c89828)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text', lineHeight: 1.2,
                    marginBottom: '0.6rem',
                  }}>
                    {typeof winner === 'object' ? winner.name : winner}
                  </div>
                  {typeof winner === 'object' && winner.mssv && (
                    <div style={{ fontSize: '1.4rem', color: 'var(--gold)', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', fontWeight: 700 }}>
                      MSSV: {winner.mssv}
                    </div>
                  )}
                </motion.div>

                {/* Buttons row */}
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
                  style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center', marginTop: '1.6rem', position: 'relative', zIndex: 1 }}
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => { setWinner(null); setPhase('idle'); startDraw(); }}
                    style={{
                      background: 'linear-gradient(135deg, #f0ca6a, #e8b84b)',
                      border: 'none', borderRadius: 100,
                      padding: '0.55rem 1.6rem', color: '#0d1117',
                      cursor: 'pointer', fontSize: '0.85rem',
                      fontFamily: 'var(--font-sans)', fontWeight: 700,
                      boxShadow: '0 4px 14px rgba(232,184,75,0.35)',
                    }}
                  >
                    🎲 Bốc Thăm Lần Nữa
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                    onClick={reset}
                    style={{
                      background: 'rgba(255,255,255,0.07)',
                      border: '1px solid rgba(255,255,255,0.12)', borderRadius: 100,
                      padding: '0.55rem 1.4rem', color: 'var(--text-tertiary)',
                      cursor: 'pointer', fontSize: '0.82rem',
                      fontFamily: 'var(--font-sans)', transition: 'all 0.2s',
                    }}
                  >
                    ↩ Đặt Lại
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Draw button */}
        {phase !== 'reveal' && (
          <motion.button
            whileHover={!noParticipants && phase === 'idle' ? { scale: 1.05, boxShadow: '0 0 40px rgba(232,184,75,0.45), 0 8px 24px rgba(232,184,75,0.25)' } : {}}
            whileTap={phase === 'idle' ? { scale: 0.95 } : {}}
            onClick={startDraw}
            disabled={noParticipants || phase === 'scanning'}
            style={{
              background: phase === 'scanning' || noParticipants
                ? 'rgba(255,255,255,0.06)'
                : 'linear-gradient(135deg, #f0ca6a 0%, #e8b84b 50%, #c89828 100%)',
              color: phase === 'scanning' || noParticipants ? 'var(--text-quaternary)' : '#0d1117',
              border: 'none',
              cursor: phase === 'scanning' || noParticipants ? 'not-allowed' : 'pointer',
              fontWeight: 700, fontSize: '1rem',
              padding: '0.9rem 3rem', borderRadius: '100px',
              boxShadow: phase === 'idle' && !noParticipants ? '0 4px 18px rgba(232,184,75,0.35)' : 'none',
              fontFamily: 'var(--font-sans)', transition: 'all 0.25s',
              letterSpacing: '-0.01em',
            }}
          >
            {phase === 'scanning' ? '⚡ Đang bốc thăm...'
              : noParticipants ? '⏳ Chờ câu hỏi từ khán giả'
              : '🎲 Bốc Thăm Ngay!'}
          </motion.button>
        )}
      </div>

      {/* ── RIGHT: Q&A Participants list ── */}
      <div style={{
        flex: 1, maxWidth: 300, display: 'flex', flexDirection: 'column', gap: '0.7rem',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          fontSize: '0.68rem', color: 'var(--gold)', fontWeight: 700,
          letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)',
        }}>
          <span style={{
            width: 7, height: 7, borderRadius: '50%', background: 'var(--green)',
            boxShadow: '0 0 8px var(--green)', flexShrink: 0,
            animation: 'live-pulse 1.4s ease-in-out infinite',
          }} />
          {participants.length > 0 ? `${participants.length} người tham gia Q&A` : 'Chưa có câu hỏi nào'}
        </div>

        {/* Participant cards */}
        {participants.length > 0 ? (
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 14, padding: '0.8rem',
            overflowY: 'auto', flex: 1,
            display: 'flex', flexDirection: 'column', gap: '0.45rem',
          }}>
            {participants.map((p, i) => {
              const isHighlighted = phase === 'scanning' && participants[scanIdx]?.mssv === p.mssv;
              const isWinner = phase === 'reveal' && winner && (winner.mssv === p.mssv || winner === p.name);
              return (
                <motion.div key={p.mssv || i}
                  animate={{
                    background: isHighlighted
                      ? 'rgba(232,184,75,0.14)'
                      : isWinner ? 'rgba(232,184,75,0.10)' : 'transparent',
                    borderColor: isHighlighted
                      ? 'rgba(232,184,75,0.50)'
                      : isWinner ? 'rgba(232,184,75,0.35)' : 'rgba(255,255,255,0.05)',
                    scale: isHighlighted ? 1.02 : 1,
                  }}
                  transition={{ duration: 0.12 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.6rem',
                    padding: '0.5rem 0.75rem', borderRadius: 10,
                    border: '1px solid rgba(255,255,255,0.05)',
                  }}
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', fontWeight: 700, fontFamily: 'var(--font-mono)',
                    background: isWinner ? 'rgba(232,184,75,0.20)' : 'rgba(255,255,255,0.06)',
                    color: isWinner ? 'var(--gold)' : 'var(--text-quaternary)',
                    border: isWinner ? '1px solid rgba(232,184,75,0.40)' : '1px solid rgba(255,255,255,0.08)',
                  }}>
                    {isWinner ? '🏆' : i + 1}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{
                      fontSize: '0.80rem', fontWeight: 600, color: isWinner ? 'var(--gold)' : isHighlighted ? 'var(--text-primary)' : 'var(--text-secondary)',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      transition: 'color 0.15s',
                    }}>
                      {p.name}
                    </div>
                    {p.mssv && (
                      <div style={{ fontSize: '0.62rem', color: 'var(--text-quaternary)', fontFamily: 'var(--font-mono)' }}>
                        {p.mssv}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 14, gap: '0.7rem',
            color: 'var(--text-quaternary)', fontSize: '0.82rem', textAlign: 'center',
            padding: '1.5rem',
          }}>
            <div style={{ fontSize: '2.5rem', opacity: 0.4 }}>❓</div>
            <div>Khán giả chưa đặt câu hỏi</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-quaternary)', fontFamily: 'var(--font-mono)', lineHeight: 1.5 }}>
              Vào tab ❓ Câu hỏi<br />trên trang /vote để tham gia
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
