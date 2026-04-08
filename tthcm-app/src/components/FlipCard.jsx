import { useState } from 'react';
import { motion } from 'framer-motion';

export default function FlipCard({ card, delay }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      style={{ perspective: 1000, height: '450px', cursor: 'pointer' }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.8, type: 'spring', stiffness: 60, damping: 15 }}
        style={{ width: '100%', height: '100%', position: 'relative', transformStyle: 'preserve-3d' }}
      >
        {/* FRONT */}
        <div className="glass-card" style={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <div style={{ fontSize: '5rem', marginBottom: '15px' }}>{card.flag}</div>
          <div style={{ fontSize: '1.8rem', fontFamily: 'Playfair Display', color: 'var(--gold)' }}>{card.name}</div>
          <div style={{ color: 'var(--gold-light)', marginTop: '20px', fontSize: '0.9rem' }}>(Nhấp để lật)</div>
        </div>

        {/* BACK */}
        <div className="glass-card" style={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', display: 'flex', flexDirection: 'column', transform: 'rotateY(180deg)' }}>
          <h3 style={{ color: 'var(--gold-light)', fontSize: '1.3rem', marginBottom: '15px' }}>{card.leader}</h3>
          <p style={{ color: 'var(--text-main)', marginBottom: '20px', fontStyle: 'italic', fontSize: '1rem' }}>{card.question}</p>
          <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
            {card.options.map((opt, i) => (
              <li key={i} style={{ position: 'relative', paddingLeft: '20px', marginBottom: '12px', color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.4 }}>
                <span style={{ position: 'absolute', left: 0, color: 'var(--gold)' }}>›</span>
                <span style={opt.includes('Lịch sử') ? {color: 'white', fontWeight: 'bold'} : {}}>{opt}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </motion.div>
  );
}
