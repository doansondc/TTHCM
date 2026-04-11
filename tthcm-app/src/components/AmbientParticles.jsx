import { motion } from 'framer-motion';

export default function AmbientParticles() {
  const particles = Array.from({ length: 45 }).map((_, i) => {
    const isBig = Math.random() > 0.8;
    return {
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100 + 10,
      size: isBig ? Math.random() * 4 + 3 : Math.random() * 2 + 1,
      duration: Math.random() * 8 + 6,
      delay: Math.random() * 5,
      driftX: Math.random() * 10 - 5,
      driftY: -(Math.random() * 30 + 15),
      color: Math.random() > 0.6 ? 'rgba(255, 120, 50, 0.9)' : 'rgba(232, 184, 75, 0.8)',
    };
  });

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      
      {/* Light Flares / Optical Glows */}
      <motion.div
        animate={{ opacity: [0.15, 0.35, 0.15], scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{ position:'absolute', top:'-20%', left:'-10%', width:'70vw', height:'70vw', background:'radial-gradient(circle, rgba(255,100,50,0.06) 0%, transparent 60%)', filter:'blur(40px)', pointerEvents:'none' }}
      />
      <motion.div
        animate={{ opacity: [0.1, 0.25, 0.1], scale: [1, 1.2, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        style={{ position:'absolute', bottom:'-30%', right:'-20%', width:'85vw', height:'85vw', background:'radial-gradient(circle, rgba(232,184,75,0.05) 0%, transparent 60%)', filter:'blur(40px)', pointerEvents:'none' }}
      />

      {/* Floating Sparks */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: `${p.y}vh`, x: `${p.x}vw`, scale: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
            y: `${p.y + p.driftY}vh`,
            x: `${p.x + p.driftX}vw`,
            scale: [0, 1.5, 0.8, 0.2]
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeOut"
          }}
          style={{
            position: 'absolute',
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.color,
            borderRadius: '50%',
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
            filter: 'blur(0.5px)'
          }}
        />
      ))}
    </div>
  );
}
