import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';

const ENV_URL = window.location.hostname === 'localhost' ? 'http://localhost:3001' : '';
const socket  = io(ENV_URL, { transports: ['websocket', 'polling'] });

const TYPE_STYLE = {
  comment:  { icon: '💬', accent: '#b5860d' },
  question: { icon: '❓', accent: '#dc2626' }, // Red accent for questions
  vote:     { icon: '🗳️', accent: '#2563eb' },
  join:     { icon: '👋', accent: '#16a34a' },
};

export default function LiveToast() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const addToast = (type, data) => {
      const id = Date.now() + Math.random();
      setToasts(prev => [...prev.slice(-3), { id, type, ...data }]);
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4500);
    };

    socket.on('new_message',        (d) => addToast('comment',  { name: d.name, text: d.text }));
    socket.on('question_toast',     (d) => addToast('question', { name: d.name, text: d.text }));
    socket.on('toast_notification', (d) => addToast('vote',     { text: d.message }));
    socket.on('user_joined',        (d) => addToast('join',     { name: d.name, text: `vừa tham gia` }));

    return () => { socket.off('new_message'); socket.off('question_toast'); socket.off('toast_notification'); socket.off('user_joined'); };
  }, []);

  return (
    <div style={{ position:'fixed', bottom:'60px', right:'24px', zIndex:300, display:'flex', flexDirection:'column-reverse', gap:'10px', maxWidth:'320px', pointerEvents:'none' }}>
      <AnimatePresence>
        {toasts.map(toast => {
          const s = TYPE_STYLE[toast.type] || TYPE_STYLE.comment;
          return (
            <motion.div key={toast.id}
              initial={{ opacity:0, y:20, scale:0.95 }}
              animate={{ opacity:1, y:0, scale:1 }}
              exit={{ opacity:0, x:30, scale:0.95 }}
              transition={{ type:'spring', stiffness:300, damping:25 }}
              style={{
                background: 'rgba(255, 255, 255, 0.75)',
                backdropFilter: 'blur(25px)',
                WebkitBackdropFilter: 'blur(25px)',
                border: '1px solid rgba(0, 0, 0, 0.06)',
                borderLeft: `4px solid ${s.accent}`,
                borderRadius: '16px',
                padding: '12px 16px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.03)',
                display: 'flex', gap: '12px', alignItems: 'flex-start',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              <span style={{ fontSize: '1.2rem', flexShrink:0, marginTop:'-2px', filter:'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}>{s.icon}</span>
              <div style={{ minWidth:0, marginTop: '2px' }}>
                {toast.name && (
                  <div style={{ fontSize:'0.85rem', fontWeight:600, color: '#1a1714', marginBottom:'4px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', fontFamily: 'Playfair Display, serif', letterSpacing: '0.02em' }}>
                    {toast.name}
                  </div>
                )}
                <div style={{ fontSize:'0.82rem', color:'#524d47', lineHeight:1.5, wordBreak:'break-word', fontWeight:400 }}>
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
