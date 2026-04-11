import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';

const ENV_URL = window.location.hostname === 'localhost' ? 'http://localhost:3001' : '';
const socket  = io(ENV_URL, { transports: ['websocket', 'polling'] });

const TYPE_STYLE = {
  comment: { icon: '💬', border: 'rgba(37,99,235,0.25)', bg: 'rgba(37,99,235,0.07)', accent: '#2563eb' },
  vote:    { icon: '✅', border: 'rgba(22,163,74,0.25)',  bg: 'rgba(22,163,74,0.07)',  accent: '#16a34a' },
  join:    { icon: '👋', border: 'rgba(181,134,13,0.25)', bg: 'rgba(181,134,13,0.07)', accent: '#b5860d' },
};

export default function LiveToast() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const addToast = (type, data) => {
      const id = Date.now() + Math.random();
      setToasts(prev => [...prev.slice(-3), { id, type, ...data }]);
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4500);
    };

    socket.on('new_message',        (d) => addToast('comment', { name: d.name, text: d.text }));
    socket.on('toast_notification', (d) => addToast('vote',    { text: d.message }));
    socket.on('user_joined',        (d) => addToast('join',    { name: d.name, text: `vừa tham gia` }));

    return () => { socket.off('new_message'); socket.off('toast_notification'); socket.off('user_joined'); };
  }, []);

  return (
    <div style={{ position:'fixed', bottom:'60px', right:'24px', zIndex:300, display:'flex', flexDirection:'column-reverse', gap:'10px', maxWidth:'320px', pointerEvents:'none' }}>
      <AnimatePresence>
        {toasts.map(toast => {
          const s = TYPE_STYLE[toast.type] || TYPE_STYLE.comment;
          return (
            <motion.div key={toast.id}
              initial={{ opacity:0, y:20, scale:0.9 }}
              animate={{ opacity:1, y:0, scale:1 }}
              exit={{ opacity:0, x:20, scale:0.95 }}
              transition={{ type:'spring', stiffness:200, damping:22 }}
              style={{
                background: `${s.bg}`,
                backdropFilter: 'blur(30px)',
                WebkitBackdropFilter: 'blur(30px)',
                border: `1px solid ${s.border}`,
                borderLeft: `3px solid ${s.accent}`,
                borderRadius: '14px',
                padding: '10px 14px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                display: 'flex', gap: '10px', alignItems: 'flex-start',
                background: 'rgba(255,255,255,0.88)',
              }}
            >
              <span style={{ fontSize: '1.1rem', flexShrink:0, marginTop:'1px' }}>{s.icon}</span>
              <div style={{ minWidth:0 }}>
                {toast.name && (
                  <div style={{ fontSize:'0.75rem', fontWeight:700, color: s.accent, marginBottom:'2px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                    {toast.name}
                  </div>
                )}
                <div style={{ fontSize:'0.82rem', color:'#3a3530', lineHeight:1.45, wordBreak:'break-word' }}>
                  {toast.text}
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
