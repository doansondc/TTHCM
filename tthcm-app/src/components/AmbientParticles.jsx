import { useMemo } from 'react';
import { motion } from 'framer-motion';

export default function AmbientParticles() {
  // useMemo so particles are stable across re-renders (no re-randomize)
  const particles = useMemo(() =>
    Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100 + 10,
      size: Math.random() * 2.5 + 1,
      duration: Math.random() * 10 + 8,
      delay: Math.random() * 6,
      driftX: Math.random() * 6 - 3,
      driftY: -(Math.random() * 20 + 10),
      color: Math.random() > 0.6 ? 'rgba(255, 120, 50, 0.7)' : 'rgba(232, 184, 75, 0.6)',
    }))
  , []);

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      
      {/* Light Flares — pure CSS radial, no animation on scale */}
      <div style={{ position:'absolute', top:'-20%', left:'-10%', width:'70vw', height:'70vw', background:'radial-gradient(circle, rgba(255,100,50,0.04) 0%, transparent 55%)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'-30%', right:'-20%', width:'80vw', height:'80vw', background:'radial-gradient(circle, rgba(232,184,75,0.03) 0%, transparent 55%)', pointerEvents:'none' }} />

      {/* Floating Sparks — reduced count, no boxShadow */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: `${p.y}vh`, x: `${p.x}vw` }}
          animate={{
            opacity: [0, 0.8, 0.8, 0],
            y: `${p.y + p.driftY}vh`,
            x: `${p.x + p.driftX}vw`,
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear"
          }}
          style={{
            position: 'absolute',
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.color,
            borderRadius: '50%',
          }}
        />
      ))}
    </div>
  );
}
