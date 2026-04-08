import { useState } from 'react';
import { motion } from 'framer-motion';

export default function VotingBoard() {
  const [voted, setVoted] = useState(false);
  const [results, setResults] = useState([0, 0, 0]);

  const handleVote = (choice) => {
    setVoted(true);
    setTimeout(() => {
      if (choice === 0) setResults([75, 15, 10]);
      else if (choice === 1) setResults([20, 70, 10]);
      else setResults([30, 30, 90]);
    }, 100);
  };

  return (
    <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} style={{ width: '100%', maxWidth: '800px', margin: '40px auto 0' }}>
      {!voted ? (
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <button onClick={() => handleVote(0)} style={{ background: 'rgba(212,168,67,0.1)', border: '2px solid var(--gold)', padding: '15px 30px', borderRadius: '30px', color: 'var(--gold)', fontSize: '1.3rem', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'inherit' }}>🗺️ Địa Chính Trị</button>
          <button onClick={() => handleVote(1)} style={{ background: 'rgba(212,168,67,0.1)', border: '2px solid var(--gold)', padding: '15px 30px', borderRadius: '30px', color: 'var(--gold)', fontSize: '1.3rem', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'inherit' }}>☪️ Tôn Giáo</button>
          <button onClick={() => handleVote(2)} style={{ background: 'rgba(212,168,67,0.1)', border: '2px solid var(--gold)', padding: '15px 30px', borderRadius: '30px', color: 'var(--gold)', fontSize: '1.3rem', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'inherit' }}>🤝 Cả Hai Yếu Tố</button>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {[
            { label: '🗺️ Địa Chính Trị', val: results[0] },
            { label: '☪️ Tôn Giáo', val: results[1] },
            { label: '🤝 Cả hai', val: results[2] }
          ].map((item, idx) => (
            <div key={idx} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '20px', height: '40px', margin: '15px 0', position: 'relative', overflow: 'hidden' }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${item.val}%` }} transition={{ duration: 1, ease: "easeOut" }} style={{ background: 'var(--gold-gradient)', height: '100%' }} />
              <span style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', fontWeight: 'bold', fontSize: '1.1rem', color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{item.label} ({item.val}%)</span>
            </div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
