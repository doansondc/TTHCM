import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';

const ENV_URL = window.location.hostname === 'localhost' ? 'http://localhost:3001' : '';
const socket = io(ENV_URL, { transports: ['websocket', 'polling'] });

export default function VotingBoard() {
  const [polls, setPolls]       = useState([]);
  const [totalUsers, setTotal]  = useState(0);

  useEffect(() => {
    socket.on('update_polls',  setPolls);
    socket.on('update_users',  (u) => setTotal(u.length));
    socket.emit('get_polls');
    return () => { socket.off('update_polls'); socket.off('update_users'); };
  }, []);

  const activePoll = polls.find(p => p.active) || null;

  if (!activePoll) return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: '1rem', height: '100%', opacity: 0.5,
    }}>
      <div style={{ fontSize: '3rem' }}>📊</div>
      <p style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
        Chưa có poll nào được kích hoạt
      </p>
    </div>
  );

  const totalVotes = activePoll.options.reduce((s, o) => s + (activePoll.votes?.[o.id]?.length || 0), 0);

  return (
    <div style={{
      width: '100%', maxWidth: '820px',
      display: 'flex', flexDirection: 'column', gap: '1.2rem',
    }}>
      {/* Live badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{
            width: 8, height: 8, borderRadius: '50%',
            background: 'var(--green)', boxShadow: '0 0 10px var(--green)',
            animation: 'live-pulse 1.4s ease-in-out infinite', flexShrink: 0,
          }} />
          <span style={{
            fontSize: '0.65rem', color: 'var(--green)', fontWeight: 700,
            letterSpacing: '0.14em', fontFamily: 'var(--font-mono)', textTransform: 'uppercase',
          }}>LIVE · {totalVotes} phiếu · {totalUsers} khán giả</span>
        </div>
        <div style={{
          fontSize: '0.62rem', color: 'var(--text-quaternary)',
          fontFamily: 'var(--font-mono)', letterSpacing: '0.08em',
        }}>
          POLL_ID: {activePoll.id?.slice(0, 8)}
        </div>
      </div>

      {/* Poll Title */}
      <div style={{ marginBottom: '0.5rem' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#e8eaf0', fontFamily: 'Playfair Display, serif', lineHeight: 1.4, margin: 0, textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
          {activePoll.title}
        </h2>
      </div>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
        {activePoll.options.map((opt, i) => {
          const count = activePoll.votes?.[opt.id]?.length || 0;
          const pct   = totalVotes ? Math.round(count / totalVotes * 100) : 0;
          const isLeading = totalVotes > 0 && count === Math.max(...activePoll.options.map(o => activePoll.votes?.[o.id]?.length || 0));
          const voters = activePoll.votes?.[opt.id] || [];

          const barColors = [
            'linear-gradient(90deg, #e05c5c88, #ff5555)',
            'linear-gradient(90deg, #e8b84b88, #f0ca6a)',
            'linear-gradient(90deg, #3dd68c88, #52e09c)',
            'linear-gradient(90deg, #4f86f788, #6a9eff)',
            'linear-gradient(90deg, #9b72e888, #b090f5)',
          ];
          const glowColors = ['rgba(255,85,85,0.35)', 'rgba(232,184,75,0.35)', 'rgba(61,214,140,0.35)', 'rgba(79,134,247,0.35)', 'rgba(155,114,232,0.35)'];
          const barColor  = opt.color ? `linear-gradient(90deg, ${opt.color}66, ${opt.color})` : barColors[i % barColors.length];
          const glowColor = opt.color ? `${opt.color}40` : glowColors[i % glowColors.length];

          return (
            <AnimatePresence key={opt.id}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${isLeading && totalVotes > 0 ? 'rgba(232,184,75,0.30)' : 'rgba(255,255,255,0.06)'}`,
                  borderRadius: 14,
                  padding: '1rem 1.2rem',
                  position: 'relative', overflow: 'hidden',
                  boxShadow: isLeading && totalVotes > 0 ? `0 0 24px ${glowColor}` : 'none',
                  transition: 'all 0.4s ease',
                }}
              >
                {/* Bar fill */}
                <motion.div
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.9, ease: 'easeOut' }}
                  style={{
                    position: 'absolute', inset: 0, right: 'auto',
                    background: barColor, opacity: 0.18, borderRadius: 'inherit',
                  }}
                />

                <div style={{ position: 'relative', zIndex: 1 }}>
                  {/* Top row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                      {opt.icon && <span style={{ fontSize: '1.4rem' }}>{opt.icon}</span>}
                      <span style={{
                        fontSize: '0.96rem', fontWeight: 600,
                        color: 'var(--text-primary)', fontFamily: 'var(--font-sans)',
                      }}>{opt.label}</span>
                      {isLeading && totalVotes > 0 && (
                        <span style={{
                          fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.12em',
                          color: 'var(--gold)', border: '1px solid rgba(232,184,75,0.4)',
                          padding: '0.12rem 0.5rem', borderRadius: 100,
                          fontFamily: 'var(--font-mono)',
                        }}>DẪN ĐẦU</span>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                      <span style={{
                        fontSize: '1.6rem', fontWeight: 800,
                        fontFamily: 'var(--font-display)',
                        color: isLeading && totalVotes > 0 ? 'var(--gold)' : 'var(--text-primary)',
                      }}>{count}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>phiếu</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div style={{ height: 6, background: 'rgba(255,255,255,0.07)', borderRadius: 3, overflow: 'hidden', marginBottom: '0.5rem' }}>
                    <motion.div
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.9, ease: 'easeOut' }}
                      style={{ height: '100%', background: barColor, borderRadius: 3 }}
                    />
                  </div>


                </div>

              </motion.div>
            </AnimatePresence>
          );
        })}
      </div>
    </div>
  );
}
