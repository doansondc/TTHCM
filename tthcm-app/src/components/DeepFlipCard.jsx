import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DeepFlipCard({ card, delay }) {
  const [step, setStep] = useState(0); // 0: Front, 1: Back Options, 2: Result
  const [selectedOption, setSelectedOption] = useState(null);

  const handleCardClick = () => {
    if (step === 0) setStep(1);
  };

  const handleOptionClick = (opt, e) => {
    e.stopPropagation();
    setSelectedOption(opt);
    setStep(2);
  };

  const handleReset = (e) => {
    e.stopPropagation();
    setStep(0);
    setTimeout(() => setSelectedOption(null), 300);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "tween", duration: 0.5 }}
      style={{ perspective: 1200, height: '480px', cursor: step === 0 ? 'pointer' : 'default' }}
      onClick={handleCardClick}
    >
      <motion.div
        animate={{ rotateY: step > 0 ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'tween', ease: "easeInOut" }}
        style={{ width: '100%', height: '100%', position: 'relative', transformStyle: 'preserve-3d' }}
      >
        {/* LỚP 1: MẶT TRƯỚC (Quốc Gia) */}
        <div className="glass-card" style={{ 
            position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', 
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
            backgroundImage: card.cardBg && `linear-gradient(to bottom, rgba(255,255,255,0.85), rgba(248,250,252,0.9)), url(${card.cardBg})`,
            backgroundSize: 'cover', backgroundPosition: 'center', border: '1px solid var(--card-border)'
        }}>
          <div style={{ fontSize: '5rem', marginBottom: '15px' }}>{card.flag}</div>
          <div style={{ fontSize: '2.2rem', fontFamily: 'Playfair Display', color: 'var(--text-main)', fontWeight: 'bold' }}>{card.name}</div>
          <div style={{ color: 'var(--text-muted)', marginTop: '20px', fontSize: '1rem' }}>Lật bài để đóng vai</div>
        </div>

        {/* LỚP 2+3: MẶT SAU (Lựa Chọn & Kết Quả) */}
        <div className="glass-card" style={{ 
          position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', 
          display: 'flex', flexDirection: 'column', transform: 'rotateY(180deg)',
          background: 'var(--card-bg)'
        }}>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="options" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} transition={{duration: 0.2}}>
                <h3 style={{ color: 'var(--gold-light)', fontSize: '1.4rem', marginBottom: '10px' }}>{card.leader}</h3>
                <p style={{ color: 'var(--text-main)', marginBottom: '20px', fontStyle: 'italic', fontSize: '1.2rem', lineHeight: 1.5 }}>{card.question}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {card.options.map((opt, i) => (
                    <button 
                      key={i} 
                      onClick={(e) => handleOptionClick(opt, e)}
                      style={{
                        padding: '15px', background: 'rgba(212,168,67,0.1)', border: '1px solid var(--gold)',
                        borderRadius: '8px', color: 'var(--text-main)', cursor: 'pointer', textAlign: 'left',
                        fontSize: '1.1rem', transition: '0.2s', lineHeight: 1.4
                      }}
                      onMouseOver={(e) => e.currentTarget.style.background = 'rgba(212,168,67,0.3)'}
                      onMouseOut={(e) => e.currentTarget.style.background = 'rgba(212,168,67,0.1)'}
                    >
                      {opt.text}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && selectedOption && (
              <motion.div key="result" initial={{opacity: 0, scale: 0.95}} animate={{opacity: 1, scale: 1}} exit={{opacity: 0}} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ color: 'var(--gold-light)', fontSize: '1.4rem', marginBottom: '15px' }}>Hệ Quả Thực Tế</h3>
                <div style={{ padding: '20px', background: selectedOption.result.includes('Đúng') ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)', borderLeft: `4px solid ${selectedOption.result.includes('Đúng') ? '#4caf50' : '#f44336'}`, borderRadius: '4px', fontSize: '1.1rem', color: 'var(--text-main)', flex: 1, overflowY: 'auto', lineHeight: 1.6 }}>
                  <strong>Lựa chọn:</strong> {selectedOption.text.replace('(Lịch sử) ', '')}<br/><br/>
                  {selectedOption.result}
                </div>
                <button onClick={handleReset} style={{ marginTop: '15px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', textDecoration: 'underline' }}>Lật lại thẻ biểu quyết</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
