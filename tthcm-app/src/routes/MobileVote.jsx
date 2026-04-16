import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';

const ENV_URL = window.location.hostname === 'localhost' ? 'http://localhost:3001' : '';
const socket  = io(ENV_URL, { transports: ['websocket', 'polling'] });

// Tạo fingerprint thiết bị (anonymous, không có PII)
function generateFingerprint() {
  const parts = [
    navigator.userAgent,
    `${screen.width}x${screen.height}x${screen.colorDepth}`,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    navigator.language,
    navigator.platform,
    new Date().getTimezoneOffset(),
  ].join('|');
  let hash = 0;
  for (let i = 0; i < parts.length; i++) {
    hash = Math.imul(31, hash) + parts.charCodeAt(i) | 0;
  }
  return Math.abs(hash).toString(36);
}
const DEVICE_FP = generateFingerprint();

const SLIDE_SUMMARIES = {
  0:  'Slide mở đầu — Giới thiệu chủ đề và nhóm thực hiện.',
  1:  'Nguyên nhân 1/3 — Địa chính trị: Dầu mỏ, Kênh Suez và Eo biển Hormuz.',
  2:  'Nguyên nhân 2/3 — Tôn giáo: 1300 năm chia rẽ Sunni–Shia.',
  3:  'Nguyên nhân 3/3 — Lịch sử: Sykes-Picot 1916 và phân chia LHQ 1947.',
  4:  'Phần 2 — Hai phía xung đột: Israel (bảo vệ tồn vong) và Palestine (giành độc lập).',
  5:  'Phần 3 — Mâu thuẫn Iran & Arab Saudi: cạnh tranh quyền lực khu vực và proxy war.',
  6:  'Phần 4 — Siêu cường: Iran (phòng thủ chủ động) và Mỹ (bảo lãnh trật tự).',
  7:  'Phần 5 — Nhập vai 5 lãnh đạo: Trump, Netanyahu, Khamenei, MBS, Abbas.',
  8:  'Phần 6 — 3 kịch bản tương lai: Tổng lực (20%), Giới hạn (55%), Hạ nhiệt (25%).',
  9:  'POLL — Bạn nghĩ Trung Đông đi về đâu? Hãy bỏ phiếu!',
  10: 'Phần 7 — Vị trí địa lý Việt Nam vs Trung Đông.',
  11: 'Phần 8 — Ngoại giao Cây Tre: Gốc vững, Cành uyển chuyển, Bốn Không.',
  12: 'Phần 9 — 5 bài học xương máu từ thảm kịch Trung Đông cho Việt Nam.',
  13: 'Tổng kết — Kịch bản dựa trên biểu quyết của khán phòng.',
  14: 'Q&A — Đặt câu hỏi để nhóm trả lời.',
  15: 'Vòng Quay May Mắn — Theo dõi màn hình lớn!',
  16: 'Cảm ơn bạn đã tham gia Hội Nghị Trung Đông 2026.',
};

// Replaced by dynamic server polls

const OTPInput = ({ value, onChange, length }) => {
  const handleChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, length);
    onChange(val);
  };
  return (
    <div style={{ position:'relative', width:'100%', height:'52px' }}>
      <input type="tel" value={value} onChange={handleChange} style={{ position:'absolute', inset:0, opacity:0, cursor:'text', zIndex:10 }} />
      <div style={{ display:'flex', gap:'0.5rem', height:'100%' }}>
        {Array.from({length}).map((_, i) => (
          <div key={i} style={{
            flex:1, border:`2px solid ${value.length===i ? '#e8b84b' : (value.length>i ? 'rgba(232,184,75,0.55)' : 'rgba(255,255,255,0.10)')}`,
            borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:'1.3rem', fontWeight:800, color:'#e8eaf0',
            background: value.length>i ? 'rgba(232,184,75,0.10)' : 'rgba(255,255,255,0.04)',
            transition:'all 0.2s',
            boxShadow: value.length===i ? '0 0 0 3px rgba(232,184,75,0.18), 0 0 12px rgba(232,184,75,0.20)' : 'none',
          }}>
            {value[i] || ''}
          </div>
        ))}
      </div>
    </div>
  );
};

export default function MobileVote() {
  const [step,          setStep]     = useState('register');
  const [name,          setName]     = useState('');
  const [mssv,          setMssv]     = useState('');
  const [tab,           setTab]      = useState('vote');
  const [slide,         setSlide]    = useState(0);
  const [pollActive,    setPoll]     = useState(true); // global poll toggle legacy
  const [polls,         setPolls]    = useState([]); // real multi-poll
  const [voted,         setVoted]    = useState(null);
  const [comment,       setComment]  = useState('');
  const [question,      setQuestion] = useState('');
  const [verify,        setVerify]   = useState('');
  const [myAnswer,      setMyAnswer] = useState(null);
  const [flash,         setFlash]    = useState('');
  const [reactFlash,    setRF]       = useState('');
  const [activeQuiz,    setActiveQuiz] = useState(null);
  const [activeRoleplay,setActiveRoleplay] = useState(null);
  const [roleplayVoted, setRoleplayVoted] = useState(null);
  const [rpAskLeader,   setRpAskLeader]   = useState(null); // cardIdx selected to ask
  const [rpAskText,     setRpAskText]     = useState('');
  const [rpAskSent,     setRpAskSent]     = useState(false);
  const [quizVoted,     setQuizVoted]  = useState(null);
  const [selectedQuizOpt, setSelectedQuizOpt] = useState('');
  const [timeLeft,        setTimeLeft]      = useState(0);
  const [captchaCode,   setCaptcha]    = useState(() => Math.floor(100 + Math.random() * 900).toString());
  // Moderation state
  const [isMuted,       setIsMuted]    = useState(false);
  const [isBlocked,     setIsBlocked]  = useState(null); // null | { reason, message }
  const [commentsOn,    setCommentsOn] = useState(true);
  const [questionsOn,   setQsOn]       = useState(true);
  const [reactionsOn,   setRxOn]       = useState(true);
  const [commentQueued, setCQueued]    = useState(false); // confirmation flash
  const [password,      setPassword]   = useState('');
  const [loginError,    setLoginError] = useState('');
  const [loginLoading,  setLoginLoading] = useState(false);
  const [aiChats,       setAiChats]      = useState([]);
  const [isAskingAI,    setIsAskingAI]   = useState(false);
  const [qaVisible,     setQaVisible]    = useState(5); // paginated Q&A
  // Auto-select active leader when roleplay session changes
  useEffect(() => {
    if (activeRoleplay?.cardIdx !== undefined) {
      setRpAskLeader(activeRoleplay.cardIdx);
    }
  }, [activeRoleplay?.cardIdx]);
  // Change password
  const [showChangePw,  setShowChangePw]  = useState(false);
  const [cpOldPw,       setCpOld]         = useState('');
  const [cpNewPw,       setCpNew]         = useState('');
  const [cpConfirm,     setCpConfirm]     = useState('');
  const [cpError,       setCpError]       = useState('');
  const [cpLoading,     setCpLoading]     = useState(false);

  useEffect(() => {
    socket.on('slide_change',    setSlide);
    socket.on('poll_status',     setPoll);
    socket.on('update_polls',    setPolls);
    socket.on('comments_status', setCommentsOn);
    socket.on('questions_status',setQsOn);
    socket.on('reactions_status',setRxOn);
    socket.on('quiz_state',      q => { setActiveQuiz(q); if (!q) { setQuizVoted(null); setSelectedQuizOpt(''); } });
    socket.on('roleplay_state', (state) => {
      setActiveRoleplay(state);
      if (!state) setRoleplayVoted(null);
    });
    socket.emit('request_roleplay_questions'); // pull existing on connect
    socket.on('your_answer',     data => { setMyAnswer(data); setTab('question'); });
    socket.on('comment_queued',  () => { setCQueued(true); setTimeout(() => setCQueued(false), 3000); });
    socket.on('feature_disabled',() => flashMsg('Chức năng này đang tạm khóa.'));
    socket.on('muted',           () => setIsMuted(true));
    socket.on('unmuted',         () => setIsMuted(false));
    socket.on('blocked',         (data) => {
      setIsBlocked(data);
      sessionStorage.removeItem('voterName');
      sessionStorage.removeItem('voterMssv');
    });

    const handleConnect = () => {
      const savedName = sessionStorage.getItem('voterName');
      const savedMssv = sessionStorage.getItem('voterMssv');
      if (savedName && savedMssv) {
        setStep('main');
        socket.emit('join', { name: savedName, mssv: savedMssv, fingerprint: DEVICE_FP });
      }
    };
    
    socket.on('connect', handleConnect);
    // Explicitly run handler immediately if already connected
    if (socket.connected) handleConnect();

    const savedName = sessionStorage.getItem('voterName');
    const savedMssv = sessionStorage.getItem('voterMssv');
    if (savedName && savedMssv && !socket.connected) {
      setName(savedName);
      setMssv(savedMssv);
      setStep('main');
    }

    return () => ['slide_change','poll_status','update_polls','comments_status','questions_status','reactions_status','your_answer','quiz_state','comment_queued','feature_disabled','muted','unmuted','blocked','roleplay_questions_update', 'connect'].forEach(e => socket.off(e));
  }, []);
  // Timer logic for active quiz
  useEffect(() => {
    if (activeQuiz && !activeQuiz.isFinished && activeQuiz.startTime && activeQuiz.duration) {
      const updateTimer = () => {
        const elapsed = Math.floor((Date.now() - activeQuiz.startTime) / 1000);
        const rem = activeQuiz.duration - elapsed;
        setTimeLeft(rem > 0 ? rem : 0);
      };
      updateTimer();
      const intv = setInterval(updateTimer, 1000);
      return () => clearInterval(intv);
    }
  }, [activeQuiz]);

  const register = e => {
    e.preventDefault();
    const cleanMssv = mssv.trim();
    const cleanPass = password.trim();
    if (cleanMssv.length < 8) return setLoginError('MSSV phải đủ 8-9 chữ số!');
    const paddedMssv = cleanMssv.padStart(9, '0');

    setLoginLoading(true);
    setLoginError('');
    socket.emit('check_credentials', { mssv: paddedMssv, password: cleanPass, name: name.trim() }, (res) => {
      setLoginLoading(false);
      if (!res || !res.ok) {
        setLoginError(res?.reason || 'Thông tin không hợp lệ.');
        return;
      }
      sessionStorage.setItem('voterName', res.name);
      sessionStorage.setItem('voterMssv', res.mssv);
      setName(res.name);
      setMssv(res.mssv);
      socket.emit('join', { name: res.name, mssv: res.mssv, fingerprint: DEVICE_FP });
      socket.emit('get_ai_history', res.mssv, (resp) => { if (resp?.ok) setAiChats(resp.history); });
      setStep('main');
    });
  };

  const handleMssvChange = (val) => {
    setMssv(val);
    setLoginError('');
    if (val.length === 9 || val.length === 8) {
      const padded = val.padStart(9, '0');
      socket.emit('check_mssv', padded, (res) => {
        if (res && res.name) {
          setName(res.name);
          if (res.found) flashMsg('✅ Đã tìm thấy trong danh sách SV!');
        }
      });
    }
  };

  const activePoll = polls.find(p => p.active) || null;

  // Sync local voted status with server's activePoll status
  useEffect(() => {
    if (activePoll && voted) {
      const isVotedOnServer = activePoll.options.some(o => activePoll.votes?.[o.id]?.includes(name) || activePoll.votes?.[o.id]?.includes(mssv));
      if (!isVotedOnServer) {
        setVoted(null);
      }
    } else if (!activePoll) {
      setVoted(null);
    }
  }, [activePoll, name, mssv, voted]);

  const vote = (id) => { 
    if (voted) {
      alert("Bạn đã biểu quyết rồi, không thể thay đổi!");
      return;
    }
    if (window.confirm("Xác nhận lựa chọn này? Lựa chọn không thể thay đổi sau khi gửi.")) {
      socket.emit('vote', { pollId: activePoll?.id, option: id }); 
      setVoted(id); 
      flashMsg('✅ Đã biểu quyết thành công!'); 
    }
  };
  const submitQuiz = () => {
    if (!selectedQuizOpt || quizVoted || (activeQuiz && activeQuiz.isFinished)) return;
    setQuizVoted(selectedQuizOpt);
    socket.emit('submit_quiz_answer', selectedQuizOpt);
    flashMsg('🎯 Đã trả lời!');
  };
  const sendComment = e => {
    e.preventDefault();
    if (!comment.trim()) return;
    if (isMuted) return flashMsg('🔇 Bạn đang bị tắt tiếng.');
    if (!commentsOn) return flashMsg('🔒 Bình luận đang tạm khóa.');
    socket.emit('send_message', comment);
    setComment('');
    if (!commentQueued) flashMsg('💬 Đã gửi bình luận!');
  };
  const sendQuestion = e => {
    e.preventDefault();
    if (!questionsOn) return flashMsg('🔒 Câu hỏi đang tạm khóa.');
    if (isMuted) return flashMsg('🔇 Bạn đang bị tắt tiếng.');
    if (!question.trim()) return flashMsg('Vui lòng nhập tin nhắn!');
    socket.emit('send_question', { text: question });
    setQuestion('');
    flashMsg('❓ Đã gửi câu hỏi cho diễn giả!');
  };

  const askAI = (e) => {
    e.preventDefault();
    const cleanQ = question.trim();
    if (!cleanQ) return;
    setIsAskingAI(true);
    setQuestion('');
    
    const loadingId = Date.now().toString() + '_loading';
    setAiChats(prev => [...prev, 
      { id: Date.now().toString(), role: 'user', text: cleanQ },
      { id: loadingId, role: 'ai', text: 'Tư duy...', loading: true }
    ]);

    socket.emit('ask_ai_direct', { question: cleanQ, name, mssv }, (res) => {
      setIsAskingAI(false);
      if (res?.ok && res.history) {
        setAiChats(res.history);
      } else {
        setAiChats(prev => {
          const filtered = prev.filter(m => m.id !== loadingId);
          return [...filtered, { id: Date.now().toString(), role:'ai', text: '❌ Lỗi: ' + (res?.text || 'Hệ thống bận.'), error: true }];
        });
      }
    });
  };
  const react = emoji => { 
    if (!reactionsOn || isMuted) return;
    socket.emit('send_reaction', emoji); setRF(emoji); setTimeout(() => setRF(''), 800); 
  };
  const flashMsg = msg => { setFlash(msg); setTimeout(() => setFlash(''), 2000); };

  // ── Blocked screen ──────────────────────────────────
  if (isBlocked) return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(145deg,#1a0505,#2d0a0a)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Inter,sans-serif', padding:'2rem' }}>
      <div style={{ textAlign:'center', maxWidth:'320px' }}>
        <div style={{ fontSize:'4rem', marginBottom:'1rem' }}>⛔</div>
        <h2 style={{ color:'#fca5a5', fontSize:'1.3rem', fontWeight:700, marginBottom:'0.8rem' }}>Truy cập bị từ chối</h2>
        <p style={{ color:'rgba(255,255,255,0.6)', fontSize:'0.9rem', lineHeight:1.6 }}>{isBlocked.message}</p>
        <p style={{ color:'rgba(255,255,255,0.3)', fontSize:'0.75rem', marginTop:'1.5rem' }}>Liên hệ quản trị viên nếu bạn cho rằng đây là nhầm lẫn.</p>
      </div>
    </div>
  );

  // ── Register ─────────────────────────────────────
  if (step === 'register') return (
    <div style={S.page}>
      <div style={{ position:'fixed', inset:0, background:'linear-gradient(145deg, #0a0e14 0%, #0d1117 50%, #0f1320 100%)', zIndex:0 }} />
      {/* Ambient decoration */}
      <div style={{ position:'fixed', top:'10%', left:'15%', width:'280px', height:'280px', background:'radial-gradient(circle, rgba(232,184,75,0.06) 0%, transparent 70%)', borderRadius:'50%', filter:'blur(30px)', pointerEvents:'none' }} />
      <div style={{ position:'fixed', bottom:'15%', right:'10%', width:'220px', height:'220px', background:'radial-gradient(circle, rgba(0,212,170,0.04) 0%, transparent 70%)', borderRadius:'50%', filter:'blur(40px)', pointerEvents:'none' }} />

      <div style={S.content}>
        <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ type:'spring', stiffness:100 }}>
          {/* Header */}
          <div style={{ textAlign:'center', marginBottom:'2rem', padding:'2rem 0 1rem' }}>
            <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring', delay:0.1, stiffness:120 }}
              style={{ width:'72px', height:'72px', borderRadius:'50%', background:'linear-gradient(135deg, rgba(181,134,13,0.15), rgba(181,134,13,0.05))', border:'2px solid rgba(181,134,13,0.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2rem', margin:'0 auto 1rem' }}>
              🏛️
            </motion.div>
            <h1 style={{ fontSize:'1.5rem', fontWeight:700, fontFamily:'Playfair Display,serif', marginBottom:'0.4rem', background:'linear-gradient(135deg,#e8b84b,#f5d070)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
              Hội Nghị Trung Đông
            </h1>
            <p style={{ color:'#7a8494', fontSize:'0.88rem', lineHeight:1.5 }}>Tham gia tương tác với nhóm thuyết trình</p>
          </div>

          {/* Form card */}
          <div style={{ background:'rgba(22,30,40,0.85)', backdropFilter:'blur(30px)', border:'1px solid rgba(255,255,255,0.09)', borderTop:'1px solid rgba(232,184,75,0.15)', borderRadius:'20px', padding:'1.8rem', boxShadow:'0 8px 40px rgba(0,0,0,0.5)' }}>
            <form onSubmit={register} style={{ display:'flex', flexDirection:'column', gap:'1.2rem' }}>
              <div>
                <label style={S.label}>
                  Mã Số Sinh Viên *
                  <span style={{fontWeight:400, color:'#a89e94', marginLeft:'0.3rem', fontSize:'0.72rem'}}>(8-9 chữ số)</span>
                </label>
                <OTPInput value={mssv} onChange={handleMssvChange} length={9} />
                {mssv.length > 0 && mssv.length < 8 && (
                  <p style={{ fontSize:'0.72rem', color:'#b5860d', marginTop:'0.3rem' }}>
                    Còn {9 - mssv.length} số nữa
                  </p>
                )}
              </div>
              <div>
                <label style={S.label}>
                  Họ và Tên *
                  {name && <span style={{ color:'#16a34a', fontWeight:400, marginLeft:'0.4rem', fontSize:'0.72rem' }}>✓ Tìm thấy</span>}
                </label>
                <input
                  value={name}
                  onChange={e=>setName(e.target.value)}
                  placeholder="Tự động điền khi nhập MSSV"
                  style={S.input}
                  onFocus={e => e.target.style.borderColor = 'rgba(181,134,13,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.12)'}
                />
              </div>
              <div>
              <label style={S.label}>Mã Mời Tham Gia (4 ký tự) *</label>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '4px' }}>
                  {[0, 1, 2, 3].map(i => (
                    <input
                      key={i}
                      id={`invite-input-${i}`}
                      type="tel"
                      inputMode="numeric"
                      maxLength={1}
                      value={password[i] || ''}
                      autoComplete="off"
                      style={{
                        width: '3.5rem', height: '3.8rem',
                        textAlign: 'center', fontSize: '1.4rem', fontWeight: 800,
                        borderRadius: '12px',
                        border: '1.5px solid rgba(0,0,0,0.15)',
                        background: 'rgba(0,0,0,0.02)',
                        color: 'var(--gold)',
                        ...S.input,
                        padding: 0
                      }}
                      onFocus={e => { e.target.style.borderColor = 'rgba(181,134,13,0.5)'; e.target.style.background = '#fff'; }}
                      onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.15)'; e.target.style.background = 'rgba(0,0,0,0.02)'; }}
                      onChange={e => {
                        const val = e.target.value.replace(/\D/g, '');
                        if (!val && e.target.value) return; // ignore non-numeric typing
                        let newPass = password.split('');
                        newPass[i] = val;
                        setPassword(newPass.join('').slice(0,4));
                        setLoginError('');
                        if (val && i < 3) document.getElementById(`invite-input-${i+1}`)?.focus();
                      }}
                      onKeyDown={e => {
                        if (e.key === 'Backspace' && !password[i] && i > 0) {
                          document.getElementById(`invite-input-${i-1}`)?.focus();
                        }
                      }}
                    />
                  ))}
                </div>
              </div>
              {loginError && (
                <div style={{ background:'rgba(220,38,38,0.10)', border:'1px solid rgba(220,38,38,0.30)', borderRadius:'10px', padding:'0.6rem 0.9rem', fontSize:'0.83rem', color:'#ff6b6b', fontWeight:500 }}>
                  ⚠️ {loginError}
                </div>
              )}
              <motion.button
                type="submit"
                whileHover={{ scale:1.02, boxShadow:'0 8px 24px rgba(181,134,13,0.3)' }}
                whileTap={{ scale:0.98 }}
                disabled={loginLoading || mssv.length < 8}
                style={{ ...S.primaryBtn, opacity: (loginLoading || mssv.length < 8) ? 0.6 : 1, position:'relative' }}
              >
                {loginLoading ? '⏳ Đang xác thực...' : 'Vào Tương Tác →'}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );

  // ── Main ─────────────────────────────────────────
  return (
    <div style={S.page}>
      <div style={{ position:'fixed', inset:0, background:'linear-gradient(145deg, #0a0e14 0%, #0d1117 50%, #0f1320 100%)', zIndex:0 }} />
      <div style={{ position:'fixed', top:'15%', left:'10%', width:'250px', height:'250px', background:'radial-gradient(circle, rgba(232,184,75,0.05) 0%, transparent 65%)', borderRadius:'50%', filter:'blur(40px)', pointerEvents:'none' }} />

      {/* Flash message */}
      <AnimatePresence>
        {flash && (
          <motion.div initial={{ opacity:0,y:-20 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-10 }}
            style={{ position:'fixed', top:'14px', left:'50%', transform:'translateX(-50%)', background:'rgba(22,30,40,0.95)', border:'1px solid rgba(232,184,75,0.25)', borderRadius:'100px', padding:'0.5rem 1.4rem', fontSize:'0.86rem', fontWeight:600, color:'#e8eaf0', zIndex:999, boxShadow:'0 4px 24px rgba(0,0,0,0.5), 0 0 20px rgba(232,184,75,0.10)', whiteSpace:'nowrap', backdropFilter:'blur(20px)' }}>
            {flash}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={S.content}>
        {/* Identity badge */}
        <div style={{ background:'rgba(22,30,40,0.85)', backdropFilter:'blur(20px)', border:'1px solid rgba(255,255,255,0.08)', borderLeft:'2px solid rgba(232,184,75,0.4)', borderRadius:'14px', padding:'0.7rem 1rem', marginBottom:'0.8rem', display:'flex', alignItems:'center', gap:'0.7rem', boxShadow:'0 2px 12px rgba(0,0,0,0.3)' }}>
          <div style={{ width:'34px', height:'34px', borderRadius:'50%', background:'linear-gradient(135deg, rgba(232,184,75,0.20), rgba(232,184,75,0.08))', border:'1.5px solid rgba(232,184,75,0.35)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem', flexShrink:0 }}>👤</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:'0.82rem', fontWeight:700, color:'#e8eaf0' }}>{name}</div>
            <div style={{ fontSize:'0.70rem', color:'#7a8494', fontFamily:'IBM Plex Mono,monospace' }}>MSSV: {mssv}</div>
          </div>
          <button onClick={() => { setShowChangePw(p => !p); setCpOld(''); setCpNew(''); setCpConfirm(''); setCpError(''); }}
            style={{ padding:'0.3rem 0.7rem', borderRadius:'20px', border:'1px solid rgba(232,184,75,0.25)', background:'transparent', color:'#e8b84b', cursor:'pointer', fontSize:'0.72rem', fontWeight:600, whiteSpace:'nowrap' }}>
            🔑 Đổi MK
          </button>
        </div>

        {/* Change Password Panel */}
        <AnimatePresence>
          {showChangePw && (() => {
            const submitChangePw = (e) => {
              e.preventDefault();
              if (!cpOldPw.trim()) return setCpError('Nhập mật khẩu hiện tại!');
              if (cpNewPw.length < 2) return setCpError('Mật khẩu mới phải từ 2 ký tự!');
              if (cpNewPw !== cpConfirm) return setCpError('Xác nhọn mật khẩu không khớp!');
              setCpLoading(true); setCpError('');
              socket.emit('change_password', { mssv, oldPassword: cpOldPw.trim(), newPassword: cpNewPw.trim() }, (res) => {
                setCpLoading(false);
                if (!res || !res.ok) { setCpError(res?.reason || 'Thất bại.'); return; }
                flashMsg('✅ Đã đổi mật khẩu thành công!');
                setShowChangePw(false); setCpOld(''); setCpNew(''); setCpConfirm('');
              });
            };
            return (
              <motion.div key="changepw" initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }}
                style={{ overflow:'hidden', marginBottom:'0.8rem' }}>
                <form onSubmit={submitChangePw}
                  style={{ background:'rgba(22,30,40,0.9)', backdropFilter:'blur(20px)', border:'1px solid rgba(232,184,75,0.15)', borderRadius:'14px', padding:'1.2rem', display:'flex', flexDirection:'column', gap:'0.8rem' }}>
                  <div style={{ fontSize:'0.8rem', fontWeight:700, color:'#e8b84b', marginBottom:'0.1rem' }}>🔑 Đổi Mật Khẩu</div>
                  {[
                    ['Mật khẩu hiện tại', cpOldPw, setCpOld],
                    ['Mật khẩu mới', cpNewPw, setCpNew],
                    ['Xác nhọn mật khẩu mới', cpConfirm, setCpConfirm],
                  ].map(([label, val, setter]) => (
                    <div key={label}>
                      <label style={{ ...S.label, marginBottom:'0.3rem', display:'block' }}>{label}</label>
                      <input type="password" value={val} onChange={e => { setter(e.target.value); setCpError(''); }}
                        placeholder="••••••"
                        style={{ ...S.input, width:'100%', boxSizing:'border-box' }}
                        onFocus={e => e.target.style.borderColor='rgba(232,184,75,0.5)'}
                        onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.08)'}
                      />
                    </div>
                  ))}
                  {cpError && <div style={{ background:'rgba(220,38,38,0.10)', border:'1px solid rgba(220,38,38,0.30)', borderRadius:'8px', padding:'0.5rem 0.8rem', fontSize:'0.8rem', color:'#ff6b6b' }}>⚠️ {cpError}</div>}
                  <div style={{ display:'flex', gap:'0.6rem' }}>
                    <motion.button type="submit" whileTap={{ scale:0.97 }} disabled={cpLoading}
                      style={{ flex:1, padding:'0.7rem', borderRadius:'10px', background:'linear-gradient(135deg,#b5860d,#c9960f)', color:'#fff', border:'none', fontWeight:700, cursor:'pointer', fontSize:'0.88rem' }}>
                      {cpLoading ? '⏳ Đang xử lý...' : 'Xác Nhận Đổi MK'}
                    </motion.button>
                    <button type="button" onClick={() => setShowChangePw(false)}
                      style={{ padding:'0.7rem 1rem', borderRadius:'10px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.08)', color:'#7a8494', cursor:'pointer', fontSize:'0.88rem' }}>Hủy</button>
                  </div>
                </form>
              </motion.div>
            );
          })()}
        </AnimatePresence>

        {/* Muted Warning */}
        <AnimatePresence>
          {isMuted && (
            <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }}
              style={{ background:'rgba(255,85,85,0.10)', border:'1px solid rgba(255,85,85,0.30)', borderRadius:'14px', padding:'0.7rem 1rem', marginBottom:'0.8rem', display:'flex', alignItems:'center', gap:'0.6rem', color:'#ff5555' }}>
              <span style={{ fontSize:'1.2rem' }}>🔇</span>
              <div>
                <div style={{ fontSize:'0.8rem', fontWeight:700 }}>Bạn đang bị tắt tiếng</div>
                <div style={{ fontSize:'0.7rem', opacity:0.8 }}>Không thể bình luận, react hoặc đặt câu hỏi.</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Slide Summary Banner */}
        <AnimatePresence mode="wait">
          <motion.div key={slide} initial={{ opacity:0,y:-6 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0 }}
            style={{ background:'rgba(255,255,255,0.8)', backdropFilter:'blur(20px)', border:'1px solid rgba(181,134,13,0.15)', borderLeft:'3px solid #b5860d', borderRadius:'14px', padding:'0.75rem 1rem', marginBottom:'0.8rem', boxShadow:'0 2px 10px rgba(0,0,0,0.05)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.2rem' }}>
              <div style={{ fontSize:'0.63rem', color:'#b5860d', fontWeight:700, letterSpacing:'0.1em' }}>ĐANG CHIẾU</div>
              <div style={{ fontSize:'0.65rem', color:'#a89e94', fontWeight:600, background:'rgba(181,134,13,0.08)', padding:'0.1rem 0.5rem', borderRadius:'10px' }}>Slide {slide+1}</div>
            </div>
            <p style={{ fontSize:'0.82rem', color:'#3a3530', lineHeight:1.45 }}>{SLIDE_SUMMARIES[slide] || 'Đang theo dõi...'}</p>
          </motion.div>
        </AnimatePresence>

        {/* ACTIVE ROLEPLAY OVERLAY */}
        <AnimatePresence>
          {activeRoleplay && (
            <motion.div initial={{ opacity:0, scale:0.95, y:-10 }} animate={{ opacity:1, scale:1, y:0 }} exit={{ opacity:0, scale:0.95, y:-10 }}
              style={{ background:'rgba(255,255,255,0.95)', border:`1.5px solid ${activeRoleplay.accentColor || '#b5860d'}`, borderRadius:'18px', padding:'1.2rem', marginBottom:'0.8rem', boxShadow:'0 10px 30px rgba(0,0,0,0.08)', backdropFilter:'blur(20px)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.5rem' }}>
                <span style={{ fontSize:'1.4rem' }}>🎭</span>
                <div>
                  <div style={{ fontSize:'0.7rem', color:activeRoleplay.accentColor || '#b5860d', fontWeight:700, letterSpacing:'0.05em', textTransform:'uppercase' }}>
                    Phiên nhập vai đang diễn ra
                  </div>
                  <div style={{ fontSize:'0.82rem', color:'#1a1714', fontWeight:600, marginTop:2 }}>
                    {activeRoleplay.flag && <span style={{ marginRight:5 }}>{activeRoleplay.flag}</span>}
                    {activeRoleplay.leader}
                  </div>
                </div>
              </div>

              {activeRoleplay.visible ? (
                // Only show debate question + voting when presenter reveals it
                <>
                  <h3 style={{ fontSize:'0.95rem', color:'#1a1714', margin:'0 0 1rem 0', lineHeight:1.4, fontWeight:700, fontStyle:'italic' }}>
                    "{activeRoleplay.question}"
                  </h3>
                  <div style={{ display:'flex', flexDirection:'column', gap:'0.6rem' }}>
                    {activeRoleplay.options.map((opt, idx) => {
                      const isSelected = roleplayVoted === idx;
                      let btnBg = isSelected ? `${activeRoleplay.accentColor}20` : 'rgba(0,0,0,0.04)';
                      let btnBorder = isSelected ? activeRoleplay.accentColor : 'rgba(0,0,0,0.1)';
                      return (
                        <button key={idx} onClick={() => {
                            window.navigator.vibrate?.(20);
                            setRoleplayVoted(idx);
                            socket.emit('roleplay_vote', idx);
                          }}
                          style={{ padding:'0.8rem', background:btnBg, border:`1.5px solid ${btnBorder}`, borderRadius:'12px', textAlign:'left', color:isSelected ? '#1a1714' : '#4a4440', fontSize:'0.9rem', fontWeight:isSelected?700:500, cursor:'pointer', transition:'all 0.2s', display:'flex', alignItems:'flex-start', gap:'0.6rem' }}>
                          <div style={{ width:18, height:18, borderRadius:'50%', border:`2px solid ${isSelected ? activeRoleplay.accentColor : '#a89e94'}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}>
                            {isSelected && <div style={{ width:10, height:10, borderRadius:'50%', background:activeRoleplay.accentColor }} />}
                          </div>
                          <div style={{ flex: 1, lineHeight: 1.4 }}>{opt.text}</div>
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : (
                // Question hidden — show teaser
                <div style={{ textAlign:'center', padding:'0.6rem 0', color:'#a89e94', fontSize:'0.82rem', fontStyle:'italic' }}>
                  🔒 Câu hỏi tranh luận chưa được công bố...
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ASK A LEADER — shown whenever a roleplay session is active */}
        {activeRoleplay && name && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: `1.5px solid ${activeRoleplay.accentColor || 'rgba(232,184,75,0.4)'}44`,
              borderRadius: '18px', padding: '1.1rem',
              marginBottom: '0.8rem',
              boxShadow: '0 6px 24px rgba(0,0,0,0.2)',
              backdropFilter: 'blur(16px)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '1.2rem' }}>🎤</span>
              <div>
                <div style={{ fontSize: '0.72rem', color: activeRoleplay.accentColor || '#e8b84b', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Đặt câu hỏi chất vấn</div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.45)', marginTop: 1 }}>Câu hỏi sẽ hiện trên màn hình chính</div>
              </div>
            </div>

            {/* Leader selector — auto highlight active */}
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.6rem' }}>
              {[
                { idx: 0, flag: '🇺🇸', name: 'Trump' },
                { idx: 1, flag: '🇮🇱', name: 'Netanyahu' },
                { idx: 2, flag: '🇮🇷', name: 'Khamenei' },
                { idx: 3, flag: '🇸🇦', name: 'MBS' },
                { idx: 4, flag: '🇵🇸', name: 'Abbas' },
              ].map(l => {
                const isActive = activeRoleplay.cardIdx === l.idx;
                const isSelected = rpAskLeader === l.idx;
                return (
                  <button key={l.idx}
                    onClick={() => { setRpAskLeader(l.idx); setRpAskSent(false); }}
                    style={{
                      padding: '0.32rem 0.65rem', borderRadius: '20px',
                      border: `1.5px solid ${isSelected ? (activeRoleplay.accentColor || '#e8b84b') : isActive ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.10)'}`,
                      background: isSelected ? `${activeRoleplay.accentColor || '#e8b84b'}25` : isActive ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
                      color: isSelected ? (activeRoleplay.accentColor || '#e8b84b') : isActive ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)',
                      fontSize: '0.78rem', fontWeight: isSelected || isActive ? 700 : 400,
                      cursor: 'pointer', transition: 'all 0.18s',
                      display: 'flex', alignItems: 'center', gap: '0.3rem',
                    }}
                  >
                    {l.flag} {l.name}
                    {isActive && !isSelected && <span style={{ fontSize: '0.55rem', opacity: 0.7 }}>●</span>}
                  </button>
                );
              })}
            </div>

            {rpAskSent ? (
              <div style={{ textAlign: 'center', color: '#3dd68c', fontWeight: 600, fontSize: '0.85rem', padding: '0.5rem' }}>
                ✅ Câu hỏi đã gửi!
              </div>
            ) : (
              <form
                onSubmit={e => {
                  e.preventDefault();
                  const txt = rpAskText.trim();
                  if (!txt) return;
                  if (rpAskLeader === null) return flashMsg('⚠️ Vui lòng chọn một Lãnh Đạo phía trên để đặt câu hỏi!');
                  socket.emit('roleplay_ask', { cardIdx: rpAskLeader, text: txt });
                  setRpAskText('');
                  setRpAskSent(true);
                  setTimeout(() => setRpAskSent(false), 4000);
                }}
                style={{ display: 'flex', gap: '0.4rem' }}
              >
                <input
                  type="text"
                  value={rpAskText}
                  onChange={e => setRpAskText(e.target.value.slice(0, 300))}
                  placeholder={rpAskLeader === null ? 'Chọn lãnh đạo phía trên trước...' : 'Nhập câu hỏi chất vấn...'}
                  style={{
                    flex: 1, padding: '0.55rem 0.75rem', borderRadius: '10px',
                    border: '1.5px solid rgba(255,255,255,0.12)',
                    background: 'rgba(255,255,255,0.06)',
                    fontSize: '0.88rem', color: '#e8eaf0', outline: 'none',
                    fontFamily: 'inherit',
                  }}
                />
                <button type="submit" disabled={!rpAskText.trim() || rpAskLeader === null}
                  style={{
                    padding: '0.55rem 1rem', borderRadius: '10px',
                    background: (rpAskText.trim() && rpAskLeader !== null) ? (activeRoleplay.accentColor || '#b5860d') : 'rgba(255,255,255,0.06)',
                    border: 'none', color: (rpAskText.trim() && rpAskLeader !== null) ? '#fff' : 'rgba(255,255,255,0.3)',
                    fontWeight: 700, fontSize: '0.82rem', cursor: (rpAskText.trim() && rpAskLeader !== null) ? 'pointer' : 'default',
                    transition: 'all 0.2s', whiteSpace: 'nowrap',
                  }}
                >Gửi 📤</button>
              </form>
            )}
          </motion.div>
        )}

        {/* ACTIVE QUIZ OVERLAY */}
        <AnimatePresence>
          {activeQuiz && (
            <motion.div initial={{ opacity:0, scale:0.95, y:-10 }} animate={{ opacity:1, scale:1, y:0 }} exit={{ opacity:0, scale:0.95, y:-10 }}
              style={{ background:'rgba(255,255,255,0.95)', border:'1.5px solid rgba(181,134,13,0.35)', borderRadius:'18px', padding:'1.2rem', marginBottom:'0.8rem', boxShadow:'0 10px 30px rgba(181,134,13,0.12)', backdropFilter:'blur(20px)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'1rem' }}>
                <span style={{ fontSize:'1.3rem' }}>🎯</span>
                <h3 style={{ fontSize:'1rem', color:'#1a1714', margin:0, lineHeight:1.4, fontWeight:700 }}>{activeQuiz.question}</h3>
              </div>
              
              {activeQuiz.isFinished ? (
                <div style={{ display:'flex', flexDirection:'column', gap:'0.7rem' }}>
                  <div style={{ textAlign:'center', padding:'0.9rem', background:'rgba(22,163,74,0.08)', borderRadius:'12px', border:'1px solid rgba(22,163,74,0.25)' }}>
                    <h4 style={{ color:'#16a34a', margin:0, marginBottom:'0.4rem', fontSize:'0.95rem' }}>✅ Đã chốt kết quả</h4>
                    {activeQuiz.correctOptionId ? (
                      <p style={{ fontSize:'0.88rem', color:'#3a3530', margin:0 }}>Đáp án đúng: <span style={{ fontWeight:800, fontSize:'1.05rem', color:'#16a34a' }}>{activeQuiz.correctOptionId}</span>
                      {' — '}{activeQuiz.options.find(o => o.id === activeQuiz.correctOptionId)?.text || ''}</p>
                    ) : (
                      <p style={{ fontSize:'0.88rem', color:'#3a3530', margin:0 }}>Cảm ơn bạn đã tham gia!</p>
                    )}
                    {quizVoted && <div style={{ fontSize:'0.78rem', color:'#78726a', marginTop:'0.4rem' }}>Bạn đã chọn: <strong>{quizVoted}</strong>
                      {activeQuiz.correctOptionId && <span style={{ marginLeft:'0.4rem', color: quizVoted===activeQuiz.correctOptionId ? '#16a34a' : '#dc2626', fontWeight:700 }}>
                        {quizVoted===activeQuiz.correctOptionId ? '✓ Đúng!' : '✗ Sai'}
                      </span>}
                    </div>}
                  </div>
                  {/* Explanation */}
                  {activeQuiz.explanation && (
                    <div style={{ padding:'0.8rem 1rem', background:'rgba(37,99,235,0.06)', border:'1px solid rgba(37,99,235,0.2)', borderRadius:'12px' }}>
                      <div style={{ fontSize:'0.7rem', color:'#2563eb', fontWeight:700, marginBottom:'0.3rem', textTransform:'uppercase', letterSpacing:'0.08em' }}>📚 Giải thích</div>
                      <p style={{ fontSize:'0.88rem', color:'#1a1714', margin:0, lineHeight:1.6 }}>{activeQuiz.explanation}</p>
                    </div>
                  )}
                  {/* Winner - chỉ hiện người nhanh nhất */}
                  {activeQuiz.winners?.length > 0 && (() => {
                    const w1 = activeQuiz.winners[0];
                    return (
                      <div style={{ padding:'0.8rem 1rem', background:'rgba(181,134,13,0.05)', border:'1px solid rgba(181,134,13,0.2)', borderRadius:'12px', display:'flex', alignItems:'center', gap:'0.8rem' }}>
                        <span style={{ fontSize:'2rem' }}>🥇</span>
                        <div>
                          <div style={{ fontSize:'0.68rem', color:'#b5860d', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'0.15rem' }}>Nhanh nhất & đúng</div>
                          <div style={{ fontWeight:700, fontSize:'0.95rem', color: w1.name===name ? '#e8b84b' : '#3a3530' }}>
                            {w1.name}{w1.name===name ? ' 🎉 (Bạn!)' : ''}
                          </div>
                          <div style={{ fontSize:'0.68rem', color:'#78726a', marginTop:'2px' }}>
                            {w1.mssv && <span style={{ fontFamily:'monospace' }}>{w1.mssv}</span>}
                            <span> · ⏱️ {(w1.timeTaken / 1000).toFixed(2)}s</span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem' }}>
                  {activeQuiz.startTime && activeQuiz.duration && (
                    <div style={{ textAlign:'center', fontSize:'0.88rem', fontWeight:600, color: timeLeft <= Math.floor(activeQuiz.duration/3) ? '#dc2626' : '#b5860d', marginBottom:'0.4rem' }}>
                      ⏱️ Thời gian còn lại: {timeLeft}s
                    </div>
                  )}
                  {activeQuiz.type !== 'open' ? (
                    activeQuiz.options.map(opt => (
                      <motion.button key={opt.id} onClick={() => { if(!quizVoted) setSelectedQuizOpt(opt.id); }}
                        disabled={!!quizVoted}
                        whileTap={{ scale: quizVoted ? 1 : 0.98 }}
                        style={{ padding:'0.85rem 1rem', borderRadius:'12px', border:`1.5px solid ${selectedQuizOpt===opt.id ? '#b5860d' : 'rgba(0,0,0,0.1)'}`, background:selectedQuizOpt===opt.id ? 'rgba(181,134,13,0.1)' : 'rgba(255,255,255,0.85)', color:selectedQuizOpt===opt.id ? '#b5860d' : '#3a3530', fontSize:'0.9rem', fontWeight:selectedQuizOpt===opt.id?700:500, textAlign:'left', cursor:quizVoted?'default':'pointer', transition:'all 0.18s', backdropFilter:'blur(10px)', display:'flex', alignItems:'center', gap:'0.6rem', opacity: quizVoted && quizVoted!==opt.id ? 0.6 : 1 }}>
                        <span style={{ display:'inline-flex', width:'24px', height:'24px', borderRadius:'50%', background:selectedQuizOpt===opt.id?'rgba(181,134,13,0.2)':'rgba(0,0,0,0.06)', alignItems:'center', justifyContent:'center', fontSize:'0.78rem', fontWeight:800, color:selectedQuizOpt===opt.id?'#b5860d':'#78726a', flexShrink:0 }}>{opt.id}</span>
                        {opt.text}
                        {quizVoted===opt.id && <span style={{ marginLeft:'auto', color:'#b5860d', fontWeight:700 }}>✓ Đã chọn</span>}
                      </motion.button>
                    ))
                  ) : (
                    <textarea 
                      value={selectedQuizOpt}
                      onChange={e => !quizVoted && setSelectedQuizOpt(e.target.value)}
                      disabled={!!quizVoted}
                      placeholder="Nhập câu trả lời của bạn..."
                      rows={3}
                      style={{ padding:'0.85rem 1rem', borderRadius:'12px', border:`1.5px solid ${quizVoted ? 'rgba(181,134,13,0.5)' : '#b5860d'}`, background:'rgba(255,255,255,0.9)', resize:'none', outline:'none', fontSize:'0.9rem', color:'#3a3530' }}
                    />
                  )}
                  
                  {!quizVoted ? (
                    <motion.button onClick={submitQuiz}
                      disabled={!selectedQuizOpt.trim() || timeLeft === 0}
                      whileTap={{ scale: !selectedQuizOpt.trim() || timeLeft === 0 ? 1 : 0.97 }}
                      style={{ marginTop:'0.5rem', padding:'0.8rem', borderRadius:'12px', background:selectedQuizOpt.trim() && timeLeft > 0 ? 'linear-gradient(135deg, #b5860d, #c9960f)' : 'rgba(0,0,0,0.06)', color:selectedQuizOpt.trim() && timeLeft > 0 ? '#fff' : '#a89e94', border:'none', fontSize:'0.9rem', fontWeight:700, cursor:selectedQuizOpt.trim() && timeLeft > 0 ? 'pointer' : 'not-allowed' }}>
                      {timeLeft === 0 ? '⏳ Đã hết thời gian' : 'Khóa Đáp Án'}
                    </motion.button>
                  ) : (
                    <div style={{ marginTop:'0.5rem', textAlign:'center', fontSize:'0.82rem', color:'#78726a', fontWeight:600 }}>
                      ⏳ Đang chờ hệ thống chốt kết quả...
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab Bar — pinned just above reaction bar */}
        <div style={{ position:'fixed', bottom:60, left:0, right:0, padding:'0 0.75rem 0.4rem', zIndex:49 }}>
          <div style={{ display:'flex', background:'rgba(13,17,23,0.96)', backdropFilter:'blur(24px)', borderRadius:'14px', padding:'4px', border:'1px solid rgba(255,255,255,0.09)', boxShadow:'0 -2px 16px rgba(0,0,0,0.4)', maxWidth:480, margin:'0 auto' }}>
            {[['vote','🗳️','Bỏ phiếu'],['question','❓','Câu hỏi'],['comment','💬','Bình luận']].map(([id,icon,label]) => (
              <motion.button key={id} onClick={()=>setTab(id)}
                whileTap={{ scale: 0.97 }}
                style={{ flex:1, padding:'0.55rem 0', borderRadius:'10px', border:'none', background:tab===id?'#b5860d':'transparent', color:tab===id?'#fff':'rgba(255,255,255,0.45)', cursor:'pointer', fontSize:'0.80rem', fontWeight:tab===id?700:400, fontFamily:'Inter,sans-serif', transition:'all 0.2s', display:'flex', alignItems:'center', justifyContent:'center', gap:'5px', boxShadow: tab===id ? '0 2px 8px rgba(181,134,13,0.35)' : 'none' }}>
                <span>{icon}</span><span>{label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* VOTE TAB */}
        {tab==='vote' && (
          <AnimatePresence mode="wait">
            <motion.div key="vote" initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ display:'flex', flexDirection:'column', gap:'0.65rem' }}>
              {!activePoll ? (
                <div style={{ background:'rgba(220,38,38,0.06)', border:'1px solid rgba(220,38,38,0.2)', borderRadius:'12px', padding:'0.7rem 1rem', fontSize:'0.84rem', color:'#dc2626', textAlign:'center', display:'flex', alignItems:'center', gap:'0.5rem', justifyContent:'center' }}>
                  🔒 <span>Chưa có poll nào mở or đã bị đóng</span>
                </div>
              ) : (
                <>
                  <div style={{ marginBottom:'0.5rem', textAlign:'center' }}>
                    <h3 style={{ fontSize:'1rem', color:'#e8eaf0', fontWeight:700, margin:0, marginBottom:'0.3rem' }}>{activePoll.title}</h3>
                  </div>
                  {voted && (
                    <div style={{ background:'rgba(22,163,74,0.06)', border:'1px solid rgba(22,163,74,0.2)', borderRadius:'12px', padding:'0.5rem 1rem', fontSize:'0.8rem', color:'#16a34a', textAlign:'center', fontWeight:600 }}>
                      ✅ Đã xác nhận — Lựa chọn đã bị khóa
                    </div>
                  )}
                  {activePoll.options.map((opt, i) => {
                    const fallbackColors = ['#ff5555', '#e8b84b', '#3dd68c', '#4f86f7'];
                    const color = opt.color || fallbackColors[i % fallbackColors.length];
                    const bg    = `${color}15`; // ~8% opacity via hex trick -> approx
                    return (
                      <motion.button key={opt.id} disabled={!pollActive || isMuted} onClick={() => vote(opt.id)}
                        whileHover={{ scale: (pollActive && !isMuted && !voted) ? 1.015 : 1 }}
                        whileTap={{ scale: (pollActive && !isMuted && !voted) ? 0.985 : 1 }}
                        style={{ display:'flex', alignItems:'center', gap:'1rem', padding:'1.1rem 1.3rem', borderRadius:'16px', border:`1.5px solid ${voted===opt.id ? color : 'rgba(0,0,0,0.08)'}`, background:voted===opt.id ? bg : 'rgba(255,255,255,0.82)', cursor:(pollActive && !isMuted && !voted)?'pointer':'not-allowed', opacity:(!pollActive || isMuted || (voted && voted!==opt.id))?0.5:1, textAlign:'left', fontFamily:'Inter,sans-serif', transition:'all 0.22s', boxShadow:voted===opt.id?`0 4px 16px ${color}25`:'0 2px 8px rgba(0,0,0,0.04)', backdropFilter:'blur(20px)' }}>
                        {opt.icon && <span style={{ fontSize:'1.9rem' }}>{opt.icon}</span>}
                        <span style={{ fontWeight:voted===opt.id?700:500, fontSize:'0.95rem', color:voted===opt.id?color:'#3a3530', flex:1 }}>{opt.label || opt.id}</span>
                        {voted===opt.id && (
                          <span style={{ width:'22px', height:'22px', borderRadius:'50%', background:color, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:'0.75rem', flexShrink:0 }}>✓</span>
                        )}
                      </motion.button>
                    )
                  })}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {/* QUESTION TAB */}
        {tab==='question' && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}>
            {!questionsOn ? (
              <div style={{ textAlign:'center', padding:'2rem', background:'rgba(0,0,0,0.04)', borderRadius:'18px', border:'1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize:'2rem', marginBottom:'0.8rem' }}>🔒</div>
                <h3 style={{ fontSize:'0.9rem', color:'#78726a', fontWeight:600 }}>Cổng trò chuyện đang tạm khóa</h3>
                <p style={{ fontSize:'0.8rem', color:'#a89e94', marginTop:'0.3rem' }}>Vui lòng đợi quản trị viên mở lại.</p>
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column-reverse', gap:'1.2rem' }}>

                {/* 1. CHAT INPUT — at bottom (first in DOM, pushed to bottom by column-reverse) */}
                <form onSubmit={sendQuestion} style={{ display:'flex', flexDirection:'column', gap:'0.8rem', background:'rgba(255,255,255,0.02)', padding:'1rem', borderRadius:'16px', border:'1px solid rgba(255,255,255,0.08)' }}>
                  <textarea value={question} onChange={e=>setQuestion(e.target.value)} placeholder="Nhắn tin cho Trợ lý AI hoặc gửi câu hỏi trực tiếp cho diễn giả..." rows={2}
                    style={{ ...S.input, resize:'none', lineHeight:1.55, borderRadius:'12px' }} required
                    onFocus={e => e.target.style.borderColor = 'rgba(181,134,13,0.5)'} onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.12)'} />
                  <div style={{ display:'flex', gap:'0.6rem', marginTop:'0.2rem' }}>
                    <motion.button type="button" onClick={askAI} disabled={!question.trim() || isAskingAI}
                      whileHover={{ scale: (!question.trim() || isAskingAI) ? 1 : 1.02 }}
                      whileTap={{ scale: (!question.trim() || isAskingAI) ? 1 : 0.98 }}
                      style={{ flex:1, padding:'0.75rem', borderRadius:'12px', background:'linear-gradient(135deg, #10b981, #059669)', color:'#fff', border:'none', fontWeight:700, fontSize:'0.82rem', cursor:(!question.trim() || isAskingAI)?'not-allowed':'pointer', opacity:(!question.trim() || isAskingAI)?0.6:1, display:'flex', alignItems:'center', justifyContent:'center', gap:'0.3rem', boxShadow:'0 4px 12px rgba(16,185,129,0.3)' }}>
                      🤖 {isAskingAI ? 'Tư duy...' : 'Hỏi AI'}
                    </motion.button>
                    <motion.button type="submit" disabled={!question.trim()}
                      whileHover={{ scale: question.trim() ? 1.02 : 1 }}
                      whileTap={{ scale: 0.98 }}
                      style={{ flex:1, padding:'0.75rem', borderRadius:'12px', background:'linear-gradient(135deg,#f0ca6a 0%,#e8b84b 50%,#c89828 100%)', color:'#0d1117', border:'none', fontWeight:700, fontSize:'0.82rem', cursor:!question.trim()?'not-allowed':'pointer', opacity:!question.trim()?0.6:1, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 12px rgba(232,184,75,0.3)' }}>
                      Gửi Diễn Giả →
                    </motion.button>
                  </div>
                </form>

                {/* 2. CHAT HISTORY — reversed order (newest at bottom) */}
                {(aiChats.length > 0 || myAnswer) && (
                  <div style={{ display:'flex', flexDirection:'column', gap:'0.8rem', background:'rgba(255,255,255,0.03)', padding:'1rem', borderRadius:'16px', border:'1px solid rgba(255,255,255,0.05)' }}>
                    {/* Load more button */}
                    {aiChats.length > qaVisible && (
                      <button onClick={() => setQaVisible(v => v + 5)}
                        style={{ alignSelf:'center', padding:'0.35rem 1.2rem', borderRadius:'20px', border:'1px solid rgba(255,255,255,0.12)', background:'rgba(255,255,255,0.04)', color:'rgba(255,255,255,0.5)', fontSize:'0.72rem', cursor:'pointer', fontFamily:'inherit', marginBottom:'0.4rem' }}>
                        ↑ Tải thêm tin nhắn cũ hơn
                      </button>
                    )}

                    {myAnswer && (
                      <div style={{ background:'rgba(22,163,74,0.08)', border:'1px solid rgba(22,163,74,0.25)', borderRadius:'14px', padding:'1rem', marginBottom:'0.5rem' }}>
                        <div style={{ fontSize:'0.75rem', color:'#16a34a', fontWeight:700, marginBottom:'0.4rem', textTransform:'uppercase', letterSpacing:'0.05em' }}>🔔 Phản hồi từ Nhóm Diễn Giả</div>
                        <div style={{ fontSize:'0.88rem', color:'#b0b8c8', fontWeight:600, fontStyle:'italic', marginBottom:'0.6rem', paddingLeft:'0.5rem', borderLeft:'2px solid rgba(255,255,255,0.2)' }}>"{myAnswer.question}"</div>
                        <div style={{ fontSize:'0.9rem', color:'#ffffff', lineHeight:1.5, fontWeight:500, marginBottom:'0.6rem' }}>{myAnswer.answer}</div>
                        <button onClick={() => setMyAnswer(null)} style={{ padding:'0.3rem 0.8rem', background:'rgba(22,163,74,0.15)', color:'#16a34a', border:'none', borderRadius:'6px', fontSize:'0.75rem', fontWeight:600, cursor:'pointer' }}>✕ Đóng</button>
                      </div>
                    )}

                    {/* Show only last qaVisible messages, newest at bottom */}
                    {aiChats.slice(-qaVisible).map(msg => (
                      <motion.div key={msg.id} initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }}
                        style={{ display:'flex', flexDirection:'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                        <div style={{ fontSize:'0.65rem', color:'#7a8494', marginBottom:'0.25rem', padding:'0 5px' }}>
                          {msg.role === 'user' ? (name || 'Bạn') : '🤖 Chuyên gia AI Gemini'}
                        </div>
                        <div style={{
                          maxWidth:'92%', padding:'0.8rem 1rem', borderRadius:'14px',
                          background: msg.role === 'user' ? 'linear-gradient(135deg, #10b981, #059669)' : msg.error ? 'rgba(220,38,38,0.1)' : 'rgba(255,255,255,0.06)',
                          color: msg.role === 'user' ? '#fff' : msg.error ? '#ffb3b3' : '#e8eaf0',
                          border: msg.role === 'user' ? 'none' : msg.error ? '1px solid rgba(220,38,38,0.3)' : '1px solid rgba(255,255,255,0.15)',
                          fontSize:'0.88rem', lineHeight:1.55, whiteSpace:'pre-line',
                        }}>
                          {msg.loading ? (
                            <span style={{ display:'flex', alignItems:'center', gap:'5px', fontStyle:'italic' }}><span style={{width:6,height:6,background:'#e8b84b',borderRadius:'50%',display:'inline-block'}}></span> Đang nghĩ...</span>
                          ) : msg.text.replace(/\*\*/g, '')}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* COMMENT TAB */}
        {tab==='comment' && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}>
            {!commentsOn ? (
              <div style={{ textAlign:'center', padding:'2rem', background:'rgba(0,0,0,0.04)', borderRadius:'18px', border:'1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize:'2rem', marginBottom:'0.8rem' }}>🔒</div>
                <h3 style={{ fontSize:'0.9rem', color:'#78726a', fontWeight:600 }}>Tương tác bình luận đang tắt</h3>
                <p style={{ fontSize:'0.8rem', color:'#a89e94', marginTop:'0.3rem' }}>Người thuyết trình đã tạm tắt bình luận cho slide này.</p>
              </div>
            ) : (
              <form onSubmit={sendComment} style={{ display:'flex', flexDirection:'column', gap:'0.8rem' }}>
                <div>
                  <label style={S.label}>Bình luận của bạn</label>
                  <textarea value={comment} onChange={e=>setComment(e.target.value)} placeholder="Nhập bình luận — sẽ hiện lên màn chiếu..." rows={4}
                    style={{ ...S.input, resize:'none', lineHeight:1.55 }} required
                    onFocus={e => e.target.style.borderColor = 'rgba(181,134,13,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.12)'}
                  />
                  {comment.length > 0 && <div style={{ textAlign:'right', fontSize:'0.68rem', color:'#a89e94', marginTop:'0.2rem' }}>{comment.length} ký tự</div>}
                </div>
                {/* Quick replies */}
                <div style={{ display:'flex', gap:'0.4rem', flexWrap:'wrap' }}>
                  {['Rất hay!', 'Tôi đồng ý!', 'Thú vị!', '👀 Wow'].map(q => (
                    <button key={q} type="button" onClick={() => setComment(c => c + q)}
                      style={{ padding:'0.3rem 0.7rem', borderRadius:'20px', border:'1px solid rgba(255,255,255,0.10)', background:'rgba(255,255,255,0.05)', color:'#7a8494', fontSize:'0.75rem', cursor:'pointer', transition:'all 0.15s' }}>
                      {q}
                    </button>
                  ))}
                </div>
                <motion.button type="submit"
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  style={S.primaryBtn}>
                  Gửi Bình Luận 📢
                </motion.button>
                <p style={{ fontSize:'0.72rem', color:'#a89e94', textAlign:'center' }}>Bình luận hiển thị sau khi được hệ thống lọc.</p>
              </form>
            )}
          </motion.div>
        )}

        {/* Reaction bar */}
        <div style={{ position:'fixed', bottom:0, left:0, right:0, padding:'0.55rem 1rem', background:'rgba(13,17,23,0.92)', backdropFilter:'blur(28px)', borderTop:'1px solid rgba(255,255,255,0.07)', display:'flex', justifyContent:'space-around', alignItems:'center', zIndex:50, boxShadow:'0 -4px 24px rgba(0,0,0,0.4)' }}>
          {['❤️','👍','😮','🤣','🔥'].map(e => (
            <motion.button key={e} onClick={()=>react(e)}
              whileTap={reactionsOn && !isMuted ? { scale: 1.5, filter:'drop-shadow(0 0 12px rgba(232,184,75,0.6))' } : {}}
              style={{ background:'transparent', border:'none', fontSize:reactFlash===e?'2.2rem':'1.8rem', cursor:(!reactionsOn || isMuted)?'not-allowed':'pointer', opacity:(!reactionsOn || isMuted)?0.25:1, padding:'0.35rem', transition:'all 0.15s', lineHeight:1, filter:(!reactionsOn || isMuted)?'grayscale(100%) brightness(0.4)':'none' }}>
              {e}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

const S = {
  page: { height:'100%', overflowY:'auto', position:'relative', fontFamily:'Inter,sans-serif', WebkitFontSmoothing:'antialiased', color:'#e8eaf0' },
  content: { position:'relative', zIndex:1, maxWidth:'480px', margin:'0 auto', padding:'1.2rem 1rem 140px' },
  label: { display:'block', fontSize:'0.78rem', fontWeight:600, color:'#7a8494', marginBottom:'0.4rem', letterSpacing:'0.03em' },
  input: { width:'100%', padding:'0.85rem 1rem', borderRadius:'12px', border:'1px solid rgba(255,255,255,0.10)', background:'rgba(255,255,255,0.05)', color:'#e8eaf0', fontSize:'0.9rem', outline:'none', fontFamily:'Inter,sans-serif', backdropFilter:'blur(10px)', transition:'border-color 0.2s', boxShadow:'0 2px 8px rgba(0,0,0,0.2)' },
  primaryBtn: { padding:'0.95rem', borderRadius:'14px', background:'linear-gradient(135deg,#f0ca6a 0%,#e8b84b 50%,#c89828 100%)', color:'#0d1117', border:'none', fontWeight:700, fontSize:'1rem', cursor:'pointer', width:'100%', fontFamily:'Inter,sans-serif', boxShadow:'0 4px 16px rgba(232,184,75,0.35)', letterSpacing:'0.01em' },
};
