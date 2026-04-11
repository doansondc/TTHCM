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
      const bottom = 5 + Math.random() * 25; // percentage from bottom
      setReactions(prev => [...prev, { ...data, id, x, bottom }]);
      setTimeout(() => setReactions(prev => prev.filter(r => r.id !== id)), 3500);
    });
    return () => socket.off('show_reaction');
  }, []);

  return (
    <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:200, overflow:'hidden' }}>
      <AnimatePresence>
        {reactions.map(r => (
          <motion.div key={r.id}
            initial={{ opacity:0, y: 30, scale:0.3 }}
            animate={{ opacity:[0, 1, 1, 0], y:[30, 0, 0, -20], scale:[0.3, 1.2, 1, 0.8] }}
            exit={{ opacity:0, scale:0.5 }}
            transition={{ duration:3.5, ease:'easeOut', times:[0, 0.15, 0.8, 1] }}
            style={{ position:'absolute', left:`${r.x}%`, bottom:`${r.bottom}%`, display:'flex', flexDirection:'column', alignItems:'center', gap:'0px', transform:'translateX(-50%)' }}
          >
            {/* Animated Emoji */}
            <motion.div
              animate={{ rotate: [-10, 10, -10, 10, 0], scale: [1, 1.1, 1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{ fontSize: '3.5rem', lineHeight: 1, filter:'drop-shadow(0 4px 10px rgba(0,0,0,0.5))' }}
            >
              {r.emoji}
            </motion.div>
            {/* User Name underneath */}
            <span style={{ 
              fontSize: '0.85rem', fontWeight: 700, color: '#e8eaf0', 
              background: 'rgba(13,17,23,0.7)', backdropFilter: 'blur(10px)',
              padding: '2px 10px', borderRadius: '12px', 
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.6)',
              whiteSpace: 'nowrap', marginTop: '4px'
            }}>
              {r.name}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
