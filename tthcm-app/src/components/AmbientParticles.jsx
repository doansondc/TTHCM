import { motion } from 'framer-motion';

export default function AmbientParticles({ type }) {
  // Generate random stable particles
  const particles = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 5 + 5,
    delay: Math.random() * 3
  }));

  let ParticleColor = 'rgba(200, 200, 200, 0.4)'; // dust default
  if (type === 'ember') ParticleColor = 'rgba(255, 100, 50, 0.6)';
  if (type === 'lotus') ParticleColor = 'rgba(212, 168, 67, 0.4)'; // gold spark

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 1 }}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: `${p.y}vh`, x: `${p.x}vw` }}
          animate={{
            opacity: [0, 0.8, 0],
            y: [`${p.y}vh`, `${p.y - 10}vh`],
            x: [`${p.x}vw`, `${p.x + (Math.random() > 0.5 ? 2 : -2)}vw`]
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: ParticleColor,
            borderRadius: '50%',
            filter: 'blur(1px)'
          }}
        />
      ))}
    </div>
  );
}
