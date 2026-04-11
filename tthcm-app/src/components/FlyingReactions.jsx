import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';

const ENV_URL = window.location.hostname === 'localhost' ? 'http://localhost:3001' : '';
const socket  = io(ENV_URL, { transports: ['websocket', 'polling'] });

export default function FlyingReactions() {
  const [reactions, setReactions] = useState([]);

  useEffect(() => {
    socket.on('show_reaction', (data) => {
      const id = Math.random();
      const x  = 10 + Math.random() * 80; // percentage from left
      setReactions(prev => [...prev, { ...data, id, x }]);
      setTimeout(() => setReactions(prev => prev.filter(r => r.id !== id)), 5000);
    });
    return () => socket.off('show_reaction');
  }, []);

  return (
    <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:200, overflow:'hidden' }}>
      <AnimatePresence>
        {reactions.map(r => (
          <motion.div key={r.id}
            initial={{ opacity:0, y:'110%', x:'-50%', scale:0.4 }}
            animate={{ opacity:[0, 1, 1, 0], y:['110%', '60%', '20%', '-20%'], scale:[0.4, 1.2, 1, 0.7] }}
            exit={{ opacity:0 }}
            transition={{ duration:4.8, ease:'easeOut' }}
            style={{ position:'absolute', left:`${r.x}%`, bottom:0, display:'flex', flexDirection:'column', alignItems:'center', gap:'4px' }}
          >
            {/* Reaction bubble */}
            <div style={{
              background: 'rgba(13,17,23,0.85)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(232,184,75,0.4)',
              borderRadius: '100px',
              padding: '6px 14px',
              display: 'flex', alignItems: 'center', gap: '6px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.4), 0 0 10px rgba(232,184,75,0.15)',
              whiteSpace: 'nowrap',
            }}>
              <span style={{ fontSize: '1.4rem', lineHeight:1 }}>{r.emoji}</span>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#e8eaf0', maxWidth: '100px', overflow:'hidden', textOverflow:'ellipsis' }}>{r.name}</span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
