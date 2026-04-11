import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';

const ENV_URL = window.location.hostname === 'localhost' ? 'http://localhost:3001' : '';
const socket = io(ENV_URL, { transports: ['websocket', 'polling'] });

// ── Outcome definitions ──────────────────────────────────────────────────────
const OUTCOMES = {
  'Tổng lực': {
    icon: '💥',
    title: 'Chiến Tranh Toàn Diện',
    color: '#ff5555',
    glow: 'rgba(255,85,85,0.40)',
    accent: 'rgba(255,85,85,0.12)',
    particles: '🔥',
    desc: 'Iran khai hỏa toàn lực vào lãnh thổ Israel. Mỹ can thiệp quân sự trực tiếp. Hệ thống phòng thủ kiệt sức. Giá dầu vượt 200$/thùng, kinh tế toàn cầu suy thoái sâu. Nguy cơ leo thang hạt nhân chưa từng có trong lịch sử hiện đại.',
  },
  'Giới hạn': {
    icon: '⚠️',
    title: 'Xung Đột Giới Hạn Kéo Dài',
    color: '#e8b84b',
    glow: 'rgba(232,184,75,0.40)',
    accent: 'rgba(232,184,75,0.10)',
    particles: '💫',
    desc: 'Kịch bản thực tế nhất. Các bên "đánh để dằn mặt" — không kích có chọn lọc, chiến tranh mạng, proxy wars kéo dài. Chuỗi cung ứng tắc nghẽn, lạm phát toàn cầu tăng 15–20%. Thế giới học cách sống với xung đột mãn tính.',
  },
  'Hòa bình': {
    icon: '🕊️',
    title: 'Hạ Nhiệt Ngoại Giao',
    color: '#3dd68c',
    glow: 'rgba(61,214,140,0.40)',
    accent: 'rgba(61,214,140,0.10)',
    particles: '✨',
    desc: 'Sức ép quốc tế buộc các bên ngồi vào bàn đàm phán. Thỏa thuận ngừng bắn tạm thời được ký kết. Giải pháp 2 nhà nước được tái khởi động. Thế giới thở phào — nhưng các vết nứt địa chính trị vẫn còn đó.',
  },
};

function Particles({ color, emoji }) {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', borderRadius: 'inherit' }}>
      {[...Array(14)].map((_, i) => (
        <motion.div key={i}
          initial={{ opacity: 0, y: '105%', x: `${5 + Math.random() * 90}%`, scale: 0.4 }}
          animate={{ opacity: [0, 0.9, 0], y: '-10%', scale: [0.4, 1.2, 0.4] }}
          transition={{ duration: 2 + Math.random() * 2, delay: Math.random() * 2.5, repeat: Infinity, repeatDelay: Math.random() * 3 }}
          style={{ position: 'absolute', fontSize: '1.2rem', bottom: 0 }}
        >
          {emoji}
        </motion.div>
      ))}
    </div>
  );
}

export default function DynamicEnding() {
  const [polls, setPolls] = useState([]);
  const [outcome, setOutcome] = useState(null);
  const [phase, setPhase] = useState('waiting');
  const [isAnalyzingAI, setIsAnalyzingAI] = useState(false);
  const [aiText, setAiText] = useState('');

  useEffect(() => {
    socket.on('update_polls', setPolls);
    socket.emit('get_polls');
    return () => socket.off('update_polls');
  }, []);

  const activePoll = polls.find(p => p.active) || null;
  const totalVotes = activePoll
    ? activePoll.options.reduce((s, o) => s + (activePoll.votes?.[o.id]?.length || 0), 0)
    : 0;

  const getCount = (optId) => activePoll?.votes?.[optId]?.length || 0;

  const handleReveal = () => {
    if (!activePoll) return;
    setPhase('counting');
    setIsAnalyzingAI(false);
    setAiText('');
    setTimeout(() => {
      let winnerOpt = activePoll.options[0];
      let maxVotes = -1;
      for (const opt of activePoll.options) {
        const v = activePoll.votes?.[opt.id]?.length || 0;
        if (v > maxVotes) { maxVotes = v; winnerOpt = opt; }
      }
      setOutcome(winnerOpt.id);
      setPhase('reveal');
    }, 3500);
  };

  const analyzeWithAI = async () => {
    setIsAnalyzingAI(true);
    setAiText('');
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    let textToStream = '';
    const resultTitle = result?.title || 'Không rõ';
    const prompt = `Bạn là chuyên gia phân tích địa chính trị. ${activePoll?.title}. Số phiếu: ${totalVotes}. Kịch bản thắng: ${resultTitle}. Viết 1 đoạn (150 chữ) nhận định lý do khán giả chọn kịch bản này.`;

    if (apiKey && apiKey !== 'undefined') {
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        const data = await res.json();
        textToStream = data.candidates?.[0]?.content?.parts?.[0]?.text || "Không có phản hồi từ AI.";
      } catch(e) {
        textToStream = "Lỗi kết nối AI: " + e.message;
      }
    } else {
      // Thuật toán sinh text phân tích chiến lược tự động cho MỌI loại Poll mới
      const winLabel = resultTitle;
      const otherOpts = activePoll?.options.filter(o => o.id !== outcome).map(o => o.label || o.id);
      const othersText = otherOpts.length > 0 ? `các kịch bản khác như "${otherOpts.join('", "')}"` : 'các ngã rẽ khác';
      
      textToStream = `[Hệ thống Phân tích Chiến lược - Smart AI]\n\nPhân tích dữ liệu từ ${totalVotes} quyết định tại hội trường về chủ đề "${activePoll?.title}":\n\nĐám đông đã nghiêng hẳn về phương án: "${winLabel}". \n\nSự phân bổ phiếu bầu cho thấy một khuynh hướng tư duy rất thực tế: Thay vì phân tán vào ${othersText}, phần lớn nhận định rằng "${winLabel}" mang logic cốt lõi và phù hợp với thực tiễn hiện tại nhất.\n\nNhìn từ lăng kính địa chính trị và quản trị rủi ro, sự lựa chọn này hoàn toàn phản ánh tư duy "cân bằng lợi ích". Khi đối mặt với môi trường bất định, đám đông ưu tiên kịch bản duy trì được năng lực kiểm soát, phản chiếu cách các chủ thể lớn đang đấu trí và "đi trên dây" trong bối cảnh thực.\n\nKết luận: Đây là hệ quả tất yếu của một hệ thống có quản trị.`;
    }

    let i = 0;
    const interval = setInterval(() => {
      setAiText(prev => prev + textToStream.charAt(i));
      i++;
      if (i >= textToStream.length) clearInterval(interval);
    }, 15);
  };

  // Get outcome display data — try OUTCOMES map first, else build from poll option
  const getOutcomeData = (optId) => {
    // If we have a custom explanation in the poll option from Admin, we should prioritize it or use fallback
    const opt = activePoll?.options.find(o => o.id === optId);

    // Prefer custom dynamic outcome if provided by Admin
    if (opt?.explanation) {
      return {
        icon: opt?.icon || '🏁',
        title: opt?.label || optId,
        color: opt?.color || '#e8b84b',
        glow: `${opt?.color || '#e8b84b'}66`,
        accent: `${opt?.color || '#e8b84b'}15`,
        particles: opt?.icon || '✨',
        desc: opt.explanation,
      };
    }

    if (OUTCOMES[optId]) return OUTCOMES[optId];
    
    // Dynamic fallback
    return {
      icon: opt?.icon || '🏁',
      title: opt?.label || optId,
      color: opt?.color || '#e8b84b',
      glow: `${opt?.color || '#e8b84b'}66`,
      accent: `${opt?.color || '#e8b84b'}15`,
      particles: opt?.icon || '✨',
      desc: `Khán phòng đã bầu chọn kịch bản: ${opt?.label || optId}`,
    };
  };

  const result = outcome ? getOutcomeData(outcome) : null;

  return (
    <div style={{
      width: '100%', maxWidth: '900px', minHeight: 0,
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
      position: 'relative',
    }}>

      {/* ── WAITING phase ──────────────────────────────── */}
      {phase === 'waiting' && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.4rem' }}>

          {!activePoll ? (
            <div style={{ color: 'var(--text-quaternary)', fontSize: '0.9rem', textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.6rem' }}>📊</div>
              Chưa có poll nào được kích hoạt
            </div>
          ) : (
            <>
              {/* Poll Title */}
              <div style={{ marginBottom: '0.2rem', textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#e8eaf0', fontFamily: 'Playfair Display, serif', lineHeight: 1.4, margin: 0, textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
                  {activePoll.title}
                </h2>
              </div>

              {/* Vote summary cards */}
              <div style={{
                display: 'flex', gap: '1rem', justifyContent: 'center',
                flexWrap: 'wrap', width: '100%',
              }}>
                {activePoll.options.map(opt => {
                  const od = getOutcomeData(opt.id);
                  return (
                    <motion.div key={opt.id}
                      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                      style={{
                        flex: 1, minWidth: '130px', maxWidth: '220px',
                        background: `rgba(255,255,255,0.04)`,
                        border: `1px solid rgba(255,255,255,0.07)`,
                        borderRadius: 16, padding: '1.6rem 1rem',
                        textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.7rem', alignItems: 'center',
                        transition: 'all 0.4s',
                        position: 'relative', overflow: 'hidden',
                      }}>
                      <div style={{ fontSize: '3.2rem' }}>{od.icon || opt.icon}</div>
                      <div style={{ fontSize: 'var(--fs-md)', color: 'var(--text-secondary)', fontWeight: 700, lineHeight: 1.3 }}>
                        {opt.label || opt.id}
                      </div>
                      <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-quaternary)', fontFamily: 'var(--font-mono)' }}>
                        Bí mật cho đến khi tiết lộ...
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Total */}
              <div style={{
                fontSize: '0.72rem', color: 'var(--text-quaternary)', fontFamily: 'var(--font-mono)',
                letterSpacing: '0.1em',
              }}>
                TỔNG: {totalVotes} PHIẾU BẦU
              </div>

              {/* Reveal button */}
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(232,184,75,0.45), 0 8px 24px rgba(232,184,75,0.25)' }}
                whileTap={{ scale: 0.97 }}
                onClick={handleReveal}
                style={{
                  border: 'none', cursor: 'pointer',
                  background: 'linear-gradient(135deg, #f0ca6a, #e8b84b, #c89828)',
                  color: '#0d1117', fontWeight: 800,
                  fontSize: '1.05rem', padding: '0.9rem 2.8rem', borderRadius: '100px',
                  boxShadow: '0 4px 20px rgba(232,184,75,0.35)',
                  fontFamily: 'var(--font-display)', letterSpacing: '0.02em',
                }}>
                🔮 Tiết Lộ Kết Cục
              </motion.button>
            </>
          )}
        </motion.div>
      )}

      {/* ── COUNTING phase ────────────────────────────── */}
      {phase === 'counting' && (
        <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
          style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.2rem' }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
            style={{ fontSize: '3rem' }}>
            ⚙️
          </motion.div>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', fontWeight: 600, fontFamily: 'var(--font-sans)' }}>
            Đang tổng hợp phiếu bầu...
          </p>
          {/* Animated bars */}
          {activePoll && (
            <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-end', height: '52px' }}>
              {activePoll.options.map((opt, i) => {
                const od = getOutcomeData(opt.id);
                return (
                  <motion.div key={opt.id}
                    animate={{ height: ['20px', '52px', '28px', '44px'] }}
                    transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.2 }}
                    style={{ width: '36px', background: od.color, borderRadius: '6px', minHeight: 4 }} />
                );
              })}
            </div>
          )}
        </motion.div>
      )}

      {/* ── REVEAL phase ─────────────────────────────── */}
      <AnimatePresence>
        {phase === 'reveal' && result && (
          <>
            {/* Subtle bg glow */}
            <div style={{
              position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
              background: `radial-gradient(ellipse at center, ${result.accent} 0%, transparent 65%)`,
            }} />

            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 160, damping: 20, delay: 0.2 }}
              style={{
                background: 'rgba(13,17,23,0.90)',
                backdropFilter: 'blur(40px)',
                border: `1.5px solid ${result.color}44`,
                borderRadius: 22,
                boxShadow: `0 0 60px ${result.glow}, 0 0 120px ${result.glow}55, 0 20px 50px rgba(0,0,0,0.7)`,
                padding: '1.8rem 2.4rem',
                textAlign: 'center',
                maxWidth: '680px',
                width: '100%',
                position: 'relative',
                zIndex: 5,
                overflow: 'hidden',
              }}
            >
              <Particles color={result.color} emoji={result.particles} />

              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: [0, 1.3, 1] }}
                transition={{ delay: 0.4, duration: 0.7, type: 'spring' }}
                style={{ fontSize: '3.5rem', marginBottom: '0.7rem', display: 'block', position: 'relative', zIndex: 1 }}>
                {result.icon}
              </motion.div>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
                style={{
                  fontSize: 'clamp(1.4rem, 2.8vw, 2.2rem)',
                  fontFamily: 'var(--font-display)',
                  background: `linear-gradient(135deg, ${result.color}, #fff)`,
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: '0.9rem', lineHeight: 1.2, position: 'relative', zIndex: 1,
                }}>
                {result.title}
              </motion.h2>

              {/* Desc */}
              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                style={{
                  fontSize: 'var(--fs-md)', color: 'var(--text-secondary)',
                  lineHeight: 1.8, marginBottom: '1.2rem',
                  position: 'relative', zIndex: 1,
                }}>
                {result.desc}
              </motion.p>

              {/* Vote tally */}
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
                style={{
                  display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap',
                  marginBottom: '1.2rem', position: 'relative', zIndex: 1,
                }}>
                {activePoll?.options.map(opt => {
                  const cnt = getCount(opt.id);
                  const pct = totalVotes ? Math.round(cnt / totalVotes * 100) : 0;
                  const od  = getOutcomeData(opt.id);
                  const iw  = opt.id === outcome;
                  return (
                    <div key={opt.id} style={{
                      textAlign: 'center', padding: '0.5rem 1rem',
                      background: iw ? `${od.color}18` : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${iw ? od.color + '44' : 'rgba(255,255,255,0.07)'}`,
                      borderRadius: 10,
                    }}>
                      <div style={{ fontSize: 'var(--fs-xs)', color: od.color, fontWeight: 700, fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', marginBottom: '0.15rem' }}>
                        {opt.label || opt.id}
                      </div>
                      <div style={{ fontSize: 'var(--fs-xl)', fontWeight: 800, color: iw ? od.color : 'var(--text-tertiary)', fontFamily: 'var(--font-display)' }}>
                        {cnt}
                      </div>
                      <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-quaternary)', fontFamily: 'var(--font-mono)' }}>{pct}%</div>
                    </div>
                  );
                })}
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 1.3 }}
                style={{ fontSize: '0.72rem', color: 'var(--text-quaternary)', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', marginBottom: '1rem', position: 'relative', zIndex: 1, display:'flex', gap:'1rem', justifyContent:'center' }}>
                <span>KẾT CỤC TỪ <span style={{ color: result.color, fontWeight: 700 }}>{totalVotes}</span> PHIẾU BẦU</span>
              </motion.div>

              {!isAnalyzingAI ? (
                <div style={{ display:'flex', gap:'0.8rem', justifyContent:'center', position:'relative', zIndex:1, marginTop:'0.5rem' }}>
                  <motion.button
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
                    whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                    onClick={() => { setPhase('waiting'); setOutcome(null); }}
                    style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 100, padding: '0.6rem 1.4rem', color: 'var(--text-tertiary)', cursor: 'pointer', fontSize: '0.82rem', fontFamily: 'var(--font-sans)', transition: 'all 0.2s' }}>
                    ↩ Trở lại
                  </motion.button>
                  <motion.button
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}
                    whileHover={{ scale: 1.04, boxShadow: `0 0 20px ${result.color}66` }} whileTap={{ scale: 0.97 }}
                    onClick={analyzeWithAI}
                    style={{ background: `linear-gradient(135deg, ${result.color}, ${result.color}aa)`, border: 'none', borderRadius: 100, padding: '0.6rem 1.6rem', color: '#fff', cursor: 'pointer', fontSize: '0.82rem', fontFamily: 'var(--font-sans)', fontWeight:700, transition: 'all 0.2s' }}>
                    ✨ Phân tích với AI
                  </motion.button>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }}
                  style={{ background:'rgba(0,0,0,0.3)', border:'1px solid rgba(255,255,255,0.15)', padding:'1.5rem', borderRadius:'16px', position:'relative', zIndex:1, marginTop:'1rem', textAlign:'left' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.6rem' }}>
                    <span style={{ fontSize:'1.2rem', filter:'drop-shadow(0 0 6px #60a5fa)' }}>🤖</span>
                    <span style={{ fontSize:'0.85rem', color:'#60a5fa', fontWeight:700, letterSpacing:'0.05em', textTransform:'uppercase' }}>AI Analysis</span>
                  </div>
                  <div style={{ fontSize:'0.9rem', color:'#e8eaf0', lineHeight:1.7, whiteSpace:'pre-wrap', fontFamily:'var(--font-sans)', minHeight:'80px' }}>
                    {aiText}
                    {aiText.length > 0 && <motion.span animate={{ opacity:[1,0] }} transition={{ repeat:Infinity, duration:0.8 }} style={{ display:'inline-block', width:'6px', height:'14px', background:'#60a5fa', marginLeft:'4px', verticalAlign:'middle' }}/>}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
