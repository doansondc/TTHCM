import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { io } from 'socket.io-client';

const ENV_URL = window.location.hostname === 'localhost' ? 'http://localhost:3001' : '';
const socket  = io(ENV_URL, { transports: ['websocket', 'polling'] });

// Admin code loaded dynamically from server (default fallback)
let ADMIN_CODE_FALLBACK = '654321';

const LOG_ICONS  = { join:'👋', vote:'✅', comment:'💬', question:'❓', answer:'💡', block:'🚫', change_admin_code:'🔐', change_slide_password:'🔑' };

// ── Shared glass card style ──────────────────────────
const G = (extra = {}) => ({
  background: 'rgba(255,255,255,0.82)',
  backdropFilter: 'blur(30px)',
  WebkitBackdropFilter: 'blur(30px)',
  border: '1px solid rgba(0,0,0,0.07)',
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.06), 0 1px 0 rgba(255,255,255,0.9) inset',
  ...extra,
});

function StatCard({ label, value, icon, color }) {
  return (
    <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} style={G({ padding:'1.4rem' })}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'0.8rem' }}>
        <span style={{ fontSize:'0.73rem', color:'#78726a', fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase' }}>{label}</span>
        <span style={{ fontSize:'1.3rem' }}>{icon}</span>
      </div>
      <div style={{ fontSize:'2.8rem', fontWeight:800, color, fontFamily:'Playfair Display,serif', lineHeight:1 }}>{value}</div>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const [authed,     setAuthed]     = useState(false);
  const [code,       setCode]       = useState('');
  const [err,        setErr]        = useState(false);
  const [tab,        setTab]        = useState('overview');
  const [logs,       setLogs]       = useState([]);
  const [users,      setUsers]      = useState([]);
  const [questions,  setQs]         = useState([]);
  const [votes,      setVotes]      = useState({});
  const [pollOn,     setPollOn]     = useState(true);
  // Multi-poll
  const [polls,       setPolls]      = useState([]);
  const [showNewPoll,  setSNP]       = useState(false);
  const [editPoll,    setEditPoll]   = useState(null);
  const [newPollTitle, setNPT]       = useState('');
  const [newPollOpts,  setNPO]       = useState([
    {id:'A', label:'Lựa chọn A', icon:'', color:'#ff5555'},
    {id:'B', label:'Lựa chọn B', icon:'', color:'#e8b84b'},
    {id:'C', label:'Lựa chọn C', icon:'', color:'#3dd68c'},
  ]);
  // Quiz bank
  const [quizBank,    setQuizBank]   = useState([]);
  const [showNewQuiz,  setSNQ]       = useState(false);
  const [editQuiz,    setEditQuiz]   = useState(null);
  const [qxTitle,     setQXTitle]    = useState('');
  const [qxOpts,      setQXOpts]     = useState([{id:'A',text:''},{id:'B',text:''},{id:'C',text:''}]);
  const [qxCorrect,   setQXCorrect]  = useState('');
  const [qxExplan,    setQXExplan]   = useState(''); // explanation
  const [qxType,      setQXType]     = useState('mcq'); // 'mcq' or 'open'
  // Q&A
  const [selectedQ,  setSelQ]       = useState(null);
  const [answer,     setAns]        = useState('');
  const [logFilter,  setLogFilter]  = useState('all');
  const [blockedIPs, setBlocked]    = useState([]);
  const [qrUrl,      setQrUrl]      = useState('');
  const [zoom,       setZoom]       = useState(100);
  const [timerMins,  setTimerMins]  = useState(10);
  const [timerSecs,  setTimerSecs]  = useState(0);
  const [timerOn,    setTimerOn]    = useState(false);
  const [qrConfig,   setQrConfig]   = useState({ show: false, position: 'right', size: 100 });
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizTimeLimit, setQuizTimeLimit] = useState(15);
  const [correctOpt, setCorrectOpt] = useState('');
  const [quizExplanation, setQuizExplanation] = useState(''); // for live quiz stop explanation
  const [now,        setNow]        = useState(new Date());
  // Moderation state
  const [blockedMSSV,   setBlockedMSSV]   = useState([]);
  const [mutedMSSV,     setMutedMSSV]     = useState([]);
  const [commentQueue,  setCQueue]         = useState([]);
  const [commentsOn,    setCommentsOn]    = useState(true);
  const [questionsOn,   setQuestionsOn]   = useState(true);
  const [reactionsOn,   setReactionsOn]   = useState(true);
  const [commentModeOn, setCommentModeOn] = useState(false);
  const timerRef = useRef(null);
  // Student directory
  const [studentList,   setStudentList]   = useState([]);
  const [stuSearch,     setStuSearch]     = useState('');
  const [stuFilter,     setStuFilter]     = useState('all'); // all | online | offline | voted | unvoted
  const [showPasswords, setShowPasswords] = useState(false);
  // Security / password management
  const [adminCodeState,   setAdminCodeState]   = useState('654321');
  const [slidePassState,   setSlidePassState]   = useState('SSH1151');
  const [oldAdminCode,     setOldAdminCode]     = useState('');
  const [newAdminCode,     setNewAdminCode]     = useState('');
  const [adminCodeMsg,     setAdminCodeMsg]     = useState(null);
  const [newSlidePass,     setNewSlidePass]     = useState('');
  const [slidePassMsg,     setSlidePassMsg]     = useState(null);
  const [adminCodeForSlide, setAdminCodeForSlide] = useState('');

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch config (admin code + slide password) from server on mount
  useEffect(() => {
    fetch('/api/config').then(r => r.json()).then(d => {
      if (d.adminCode)      setAdminCodeState(d.adminCode);
      if (d.slidePassword)  setSlidePassState(d.slidePassword);
    }).catch(() => {});
  }, []);

  useEffect(() => { setQrUrl(`${window.location.protocol}//${window.location.host}/vote`); }, []);

  // Fetch student directory from REST API periodically
  useEffect(() => {
    if (!authed) return;
    const fetchStudents = () => {
      fetch('/api/students').then(r => r.json()).then(d => setStudentList(d.students || [])).catch(() => {});
    };
    fetchStudents();
    const interval = setInterval(fetchStudents, 5000);
    return () => clearInterval(interval);
  }, [authed]);

  useEffect(() => {
    if (!authed) return;
    socket.emit('get_logs');
    socket.emit('get_blocked_ips');
    socket.emit('get_blocked_mssv');
    socket.emit('get_muted_mssv');
    socket.emit('get_comment_queue');
    socket.emit('get_polls');
    socket.emit('get_quiz_bank');
    socket.emit('get_config');
    socket.emit('get_qr_config');
    socket.on('admin_logs',          setLogs);
    socket.on('update_users',        setUsers);
    socket.on('update_votes',        setVotes);
    socket.on('update_polls',        setPolls);
    socket.on('qr_config_update',    setQrConfig);
    socket.on('quiz_bank_update',    setQuizBank);
    socket.on('update_questions',    setQs);
    socket.on('new_question',        q => setQs(p => [q,...p]));
    socket.on('question_answered',   d => setQs(p => p.map(q => q.id===d.id ? {...q,answer:d.answer} : q)));
    socket.on('poll_status',         setPollOn);
    socket.on('blocked_ips',         setBlocked);
    socket.on('quiz_state',          setActiveQuiz);
    socket.on('blocked_mssv_update', setBlockedMSSV);
    socket.on('muted_mssv_update',   setMutedMSSV);
    socket.on('comment_queue_update',setCQueue);
    socket.on('comments_status',     setCommentsOn);
    socket.on('questions_status',    setQuestionsOn);
    socket.on('reactions_status',    setReactionsOn);
    socket.on('comment_mode_status', setCommentModeOn);
    socket.on('config_update',       d => { if (d.adminCode) setAdminCodeState(d.adminCode); if (d.slidePassword) setSlidePassState(d.slidePassword); });
    socket.on('slide_password_updated', d => { if (d.slidePassword) setSlidePassState(d.slidePassword); });
    return () => ['admin_logs','update_users','update_votes','update_polls','quiz_bank_update','update_questions','new_question','question_answered','poll_status','blocked_ips','quiz_state','blocked_mssv_update','muted_mssv_update','comment_queue_update','comments_status','questions_status','reactions_status','comment_mode_status','config_update','slide_password_updated','qr_config_update'].forEach(e => socket.off(e));
  }, [authed]);

  useEffect(() => {
    if (timerOn && timerSecs > 0) {
      timerRef.current = setInterval(() => setTimerSecs(s => s - 1), 1000);
    } else { clearInterval(timerRef.current); if (timerSecs === 0) setTimerOn(false); }
    return () => clearInterval(timerRef.current);
  }, [timerOn, timerSecs]);

  const startTimer = () => { setTimerSecs(timerMins * 60); setTimerOn(true); };
  const fmtTime = s => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

  const handleLogin = e => {
    e.preventDefault();
    if (code === adminCodeState) setAuthed(true);
    else { setErr(true); setTimeout(() => { setErr(false); setCode(''); }, 1200); }
  };

  const submitAnswer = () => {
    if (!selectedQ || !answer.trim()) return;
    socket.emit('answer_question', { id: selectedQ.id, answer });
    setAns(''); setSelQ(null);
  };

  const blockIp        = ip   => { if (window.confirm(`Chặn IP ${ip}?`)) socket.emit('block_ip', ip); };
  const unblockIp      = ip   => socket.emit('unblock_ip', ip);
  const blockMssv      = mssv => { if (window.confirm(`Chặn MSSV ${mssv}?`)) socket.emit('block_mssv', mssv); };
  const unblockMssv    = mssv => socket.emit('unblock_mssv', mssv);
  const muteMssv       = mssv => socket.emit('mute_mssv', mssv);
  const unmuteMssv     = mssv => socket.emit('unmute_mssv', mssv);
  const approveComment = id   => socket.emit('approve_comment', id);
  const rejectComment  = id   => socket.emit('reject_comment', id);
  const blockFP        = fp   => { if (window.confirm(`Chặn thiết bị này?`)) socket.emit('block_fingerprint', fp); };
  const togglePoll     = ()   => socket.emit('toggle_poll', !pollOn);

  const activePoll = polls.find(p => p.active) || polls[0];
  const TV = activePoll ? Object.values(activePoll.votes || {}).reduce((s,a) => s+(a?.length||0), 0) : 0;
  const filteredLogs = logFilter==='all' ? logs : logs.filter(l=>l.type===logFilter);
  const pendingQs = questions.filter(q=>!q.answer).length;
  const moderationCount = blockedMSSV.length + mutedMSSV.length;

  // ── Login ────────────────────────────────────────
  if (!authed) return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(145deg,#f8f4ec,#ede7d9)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Inter, sans-serif' }}>
      <div style={{ position:'fixed', inset:0, opacity:0.03, backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize:'180px', pointerEvents:'none' }} />
      <div style={{ position:'absolute', top:'20%', left:'25%', width:'300px', height:'300px', background:'radial-gradient(circle, rgba(181,134,13,0.07) 0%, transparent 70%)', borderRadius:'50%', filter:'blur(40px)' }} />
      
      <motion.div initial={{ opacity:0, y:30, scale:0.97 }} animate={{ opacity:1, y:0, scale:1 }}
        style={{ ...G({ padding:'2.5rem', width:'360px', boxShadow:'0 20px 60px rgba(0,0,0,0.1)' }) }}>
        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <div style={{ width:'64px', height:'64px', borderRadius:'50%', background:'linear-gradient(135deg, rgba(181,134,13,0.15), rgba(181,134,13,0.05))', border:'2px solid rgba(181,134,13,0.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.8rem', margin:'0 auto 1rem' }}>🛡️</div>
          <h2 style={{ color:'#b5860d', fontSize:'1.4rem', fontFamily:'Playfair Display,serif', marginBottom:'0.3rem' }}>Admin Panel</h2>
          <p style={{ color:'#78726a', fontSize:'0.82rem' }}>Hội Nghị Trung Đông · Slide: <strong style={{ fontFamily:'monospace', color:'#b5860d' }}>{slidePassState}</strong></p>
        </div>
        <form onSubmit={handleLogin} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
          <input type="password" maxLength={6} value={code} onChange={e => setCode(e.target.value)}
            placeholder="● ● ● ● ● ●"
            autoFocus
            style={{ padding:'0.95rem', borderRadius:'12px', border:`1.5px solid ${err?'#dc2626':'rgba(0,0,0,0.12)'}`, background:'rgba(255,255,255,0.9)', color:'#1a1714', fontSize:'1.4rem', textAlign:'center', letterSpacing:'0.4em', outline:'none', transition:'all 0.2s', boxShadow: err ? '0 0 0 3px rgba(220,38,38,0.1)' : 'none' }}
          />
          <AnimatePresence>
            {err && (
              <motion.p initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                style={{ color:'#dc2626', fontSize:'0.8rem', textAlign:'center', margin:'-0.3rem 0' }}>
                ❌ Mã không đúng
              </motion.p>
            )}
          </AnimatePresence>
          <button type="submit" style={{ padding:'0.95rem', borderRadius:'12px', background:'linear-gradient(135deg,#b5860d,#c9960f)', color:'#fff', border:'none', fontWeight:700, cursor:'pointer', fontSize:'1rem', boxShadow:'0 4px 14px rgba(181,134,13,0.25)', letterSpacing:'0.02em' }}>
            Đăng Nhập
          </button>
        </form>
      </motion.div>
    </div>
  );

  // ── Dashboard ────────────────────────────────────
  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(145deg,#f8f4ec,#ede7d9)', color:'#1a1714', fontFamily:'Inter,sans-serif', display:'flex', flexDirection:'column' }}>
      <div style={{ position:'fixed', inset:0, opacity:0.025, backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize:'180px', pointerEvents:'none', zIndex:0 }} />

      {/* Sticky Header */}
      <div style={{ ...G({ borderRadius:0, borderBottom:'1px solid rgba(0,0,0,0.07)', padding:'0 1.5rem', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:100, height:'56px' }) }}>
        <div style={{ display:'flex', alignItems:'center', gap:'0.8rem' }}>
          <div style={{ width:'32px', height:'32px', borderRadius:'8px', background:'linear-gradient(135deg, rgba(181,134,13,0.2), rgba(181,134,13,0.08))', border:'1px solid rgba(181,134,13,0.25)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem' }}>🛡️</div>
          <div>
            <span style={{ fontWeight:700, color:'#b5860d', fontSize:'0.95rem' }}>Admin Panel</span>
            <span style={{ fontSize:'0.72rem', color:'#a89e94', marginLeft:'0.5rem' }}>slide: {slidePassState}</span>
          </div>
        </div>
        <div style={{ display:'flex', gap:'0.8rem', alignItems:'center' }}>
          <span style={{ fontSize:'0.75rem', color:'#78726a', background:'rgba(0,0,0,0.04)', padding:'0.2rem 0.7rem', borderRadius:'20px' }}>
            {now.toLocaleTimeString('vi-VN')}
          </span>
          <div style={{ display:'flex', gap:'0.5rem', fontSize:'0.8rem', color:'#78726a' }}>
            <span style={{ background:'rgba(37,99,235,0.08)', color:'#2563eb', padding:'0.2rem 0.6rem', borderRadius:'20px', fontWeight:600 }}>👥 {users.length}</span>
            <span style={{ background:'rgba(181,134,13,0.08)', color:'#b5860d', padding:'0.2rem 0.6rem', borderRadius:'20px', fontWeight:600 }}>🗳️ {TV}</span>
            {pendingQs > 0 && <span style={{ background:'rgba(220,38,38,0.1)', color:'#dc2626', padding:'0.2rem 0.6rem', borderRadius:'20px', fontWeight:700 }}>❓ {pendingQs}</span>}
          </div>
          <motion.button onClick={togglePoll}
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            style={{ padding:'0.35rem 0.9rem', borderRadius:'20px', border:`1px solid ${pollOn?'rgba(22,163,74,0.3)':'rgba(220,38,38,0.3)'}`, background:pollOn?'rgba(22,163,74,0.1)':'rgba(220,38,38,0.08)', color:pollOn?'#16a34a':'#dc2626', cursor:'pointer', fontSize:'0.78rem', fontWeight:700 }}>
            {pollOn ? '▶ Poll MỞ' : '■ Poll ĐÓNG'}
          </motion.button>
        </div>
      </div>

      <div style={{ display:'flex', flex:1, position:'relative', zIndex:1 }}>
        {/* Sidebar */}
        <div style={{ width:'210px', flexShrink:0, padding:'1rem 0', borderRight:'1px solid rgba(0,0,0,0.06)', background:'rgba(255,255,255,0.5)', backdropFilter:'blur(10px)' }}>
          {[
            ['overview','📊','Tổng Quan', null],
            ['toolbar','🎛️','Điều Khiển', null],
            ['polls','🗳️','Quản Lý Poll', polls.length > 0 ? polls.length : null],
            ['quiz','📝','Đặt câu hỏi', quizBank.length > 0 ? quizBank.length : null],
            ['qa','❓','Hỏi & Đáp', pendingQs > 0 ? pendingQs : null],
            ['queue','📬','Duyệt Bình Luận', commentQueue.length > 0 ? commentQueue.length : null],
            ['students','🎓','Danh Sách SV', studentList.length > 0 ? studentList.length : null],
            ['users','👥','Đang Trực Tuyến', users.length > 0 ? users.length : null],
            ['moderation','🛡️','Kiểm Duyệt', moderationCount > 0 ? moderationCount : null],
            ['logs','📋','Nhật Ký', null],
            ['security','🔐','Bảo Mật', null],
          ].map(([id,icon,label,badge]) => (
            <button key={id} onClick={() => setTab(id)}
              style={{ width:'100%', display:'flex', alignItems:'center', gap:'0.6rem', padding:'0.75rem 1.2rem', background:tab===id?'rgba(181,134,13,0.1)':'transparent', border:'none', borderLeft:tab===id?'3px solid #b5860d':'3px solid transparent', color:tab===id?'#b5860d':'#78726a', cursor:'pointer', fontSize:'0.85rem', fontFamily:'Inter,sans-serif', textAlign:'left', transition:'all 0.18s', position:'relative' }}>
              <span style={{ fontSize:'1rem' }}>{icon}</span>
              <span style={{ flex:1 }}>{label}</span>
              {badge && <span style={{ background:id==='qa'?'#dc2626':'rgba(0,0,0,0.15)', color:'#fff', borderRadius:'10px', padding:'0.05rem 0.45rem', fontSize:'0.68rem', fontWeight:700 }}>{badge}</span>}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex:1, overflow:'auto', padding:'1.5rem' }}>

          {/* OVERVIEW */}
          {tab==='overview' && (
            <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(170px,1fr))', gap:'0.8rem' }}>
                <StatCard label="Khán giả" value={users.length} icon="👥" color="#2563eb" />
                <StatCard label="Tổng phiếu" value={TV} icon="🗳️" color="#b5860d" />
                <StatCard label="Câu hỏi" value={questions.length} icon="❓" color="#7c3aed" />
                <StatCard label="Chờ TL" value={pendingQs} icon="⏳" color="#dc2626" />
              </div>

              <div style={G({ padding:'1.5rem' })}>
                <h3 style={{ fontSize:'0.73rem', color:'#78726a', marginBottom:'1.2rem', letterSpacing:'0.1em', textTransform:'uppercase', fontWeight:700 }}>Kết Quả Biểu Quyết</h3>
                {!activePoll ? <p>Chưa có máy bỏ phiếu.</p> : activePoll.options.map(o => {
                  const cnt = activePoll.votes?.[o.id]?.length || 0; 
                  const pct = TV ? Math.round(cnt/TV*100) : 0;
                  return (
                    <div key={o.id} style={{ marginBottom:'1rem' }}>
                      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.4rem', fontSize:'0.9rem' }}>
                        <span style={{ color:'#3a3530', fontWeight:500 }}>{o.label || o.text || o.id}</span>
                        <span style={{ color:o.color || '#b5860d', fontWeight:700 }}>{cnt} phiếu · {pct}%</span>
                      </div>
                      <div style={{ height:'10px', background:'rgba(0,0,0,0.06)', borderRadius:'5px', overflow:'hidden' }}>
                        <motion.div
                          initial={{ width:0 }}
                          animate={{ width:`${pct}%` }}
                          transition={{ duration:0.8, ease:'easeOut' }}
                          style={{ height:'100%', background:`linear-gradient(90deg, ${(o.color||'#b5860d')}aa, ${o.color||'#b5860d'})`, borderRadius:'5px' }} />
                      </div>
                      {cnt>0 && <div style={{ fontSize:'0.7rem', color:'#a89e94', marginTop:'4px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{activePoll.votes[o.id].join(' · ')}</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TOOLBAR */}
          {tab==='toolbar' && (
            <div style={{ display:'flex', flexDirection:'column', gap:'1rem', maxWidth:'580px' }}>
              <h3 style={{ fontSize:'0.73rem', color:'#78726a', letterSpacing:'0.1em', textTransform:'uppercase', fontWeight:700, margin:0 }}>Điều Khiển Màn Chiếu</h3>

              {/* Zoom */}
              <div style={G({ padding:'1.3rem', display:'flex', flexDirection:'column', gap:'0.8rem' })}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div style={{ fontSize:'0.85rem', fontWeight:700, color:'#3a3530' }}>🔍 Thu Phóng Màn Hình</div>
                  <span style={{ fontSize:'0.88rem', color:'#b5860d', fontWeight:700 }}>{zoom}%</span>
                </div>
                <input type="range" min="60" max="140" step="5" value={zoom}
                  onChange={e => { setZoom(Number(e.target.value)); document.documentElement.style.fontSize = `${Number(e.target.value)/100 * 16}px`; }}
                  style={{ width:'100%', accentColor:'#b5860d' }}
                />
                <div style={{ display:'flex', gap:'0.5rem' }}>
                  {[70, 80, 100, 110].map(z => (
                    <button key={z} onClick={() => { setZoom(z); document.documentElement.style.fontSize = `${z/100 * 16}px`; }}
                      style={{ flex:1, padding:'0.4rem', borderRadius:'8px', border:`1px solid ${zoom===z?'rgba(181,134,13,0.4)':'rgba(0,0,0,0.1)'}`, background:zoom===z?'rgba(181,134,13,0.1)':'transparent', color:zoom===z?'#b5860d':'#78726a', cursor:'pointer', fontSize:'0.75rem' }}>
                      {z}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Timer */}
              <div style={G({ padding:'1.3rem', display:'flex', flexDirection:'column', gap:'0.8rem' })}>
                <div style={{ fontSize:'0.85rem', fontWeight:700, color:'#3a3530' }}>⏱ Đồng Hồ Đếm Ngược</div>
                {timerOn && (
                  <div style={{ textAlign:'center', fontSize:'3rem', fontWeight:800, color:'#b5860d', fontFamily:'monospace', lineHeight:1 }}>
                    {fmtTime(timerSecs)}
                  </div>
                )}
                <div style={{ display:'flex', gap:'0.8rem', alignItems:'center' }}>
                  <input type="number" min="1" max="60" value={timerMins}
                    onChange={e => setTimerMins(Number(e.target.value))}
                    style={{ width:'70px', padding:'0.5rem', borderRadius:'8px', border:'1px solid rgba(0,0,0,0.12)', background:'rgba(255,255,255,0.8)', color:'#1a1714', textAlign:'center', fontSize:'1rem', outline:'none' }}
                  />
                  <span style={{ color:'#78726a', fontSize:'0.85rem' }}>phút</span>
                  <button onClick={startTimer}
                    style={{ flex:1, padding:'0.55rem 1rem', borderRadius:'8px', background:timerOn?'rgba(0,0,0,0.06)':'linear-gradient(135deg,#16a34a,#15803d)', color:timerOn?'#78726a':'#fff', border:timerOn?'1px solid rgba(0,0,0,0.12)':'none', cursor:'pointer', fontWeight:700, fontSize:'0.88rem' }}>
                    {timerOn ? `⏸ Đang chạy` : '▶ Bắt đầu'}
                  </button>
                  {timerOn && <button onClick={() => { setTimerOn(false); setTimerSecs(0); }}
                    style={{ padding:'0.55rem 0.8rem', borderRadius:'8px', background:'rgba(220,38,38,0.08)', color:'#dc2626', border:'1px solid rgba(220,38,38,0.2)', cursor:'pointer', fontSize:'0.9rem' }}>■</button>}
                </div>
              </div>

              {/* Random Picker */}
              <div style={G({ padding:'1.3rem', display:'flex', flexDirection:'column', gap:'0.8rem' })}>
                <div style={{ fontSize:'0.85rem', fontWeight:700, color:'#3a3530' }}>🎲 Lựa Chọn Ngẫu Nhiên</div>
                <div style={{ display:'flex', gap:'0.5rem' }}>
                  <button onClick={() => socket.emit('spin_global_picker')}
                    style={{ flex:1, padding:'0.65rem 1rem', borderRadius:'10px', background:'linear-gradient(135deg,#8b5cf6,#6d28d9)', color:'#fff', border:'none', cursor:'pointer', fontWeight:700, fontSize:'0.88rem' }}>
                    Hiển Thị Popup Bốc Thăm (Trên Màn Chiếu)
                  </button>
                  <button onClick={() => socket.emit('close_global_picker')}
                    style={{ padding:'0.65rem 1.2rem', borderRadius:'10px', background:'rgba(0,0,0,0.05)', color:'#3a3530', border:'1px solid rgba(0,0,0,0.1)', cursor:'pointer', fontSize:'0.88rem' }}>
                    Đóng
                  </button>
                </div>
              </div>

              {/* Fullscreen */}
              <div style={G({ padding:'1.3rem' })}>
                <div style={{ fontSize:'0.85rem', fontWeight:700, color:'#3a3530', marginBottom:'0.8rem' }}>⛶ Toàn Màn Hình</div>
                <div style={{ display:'flex', gap:'0.5rem' }}>
                  <button onClick={() => document.documentElement.requestFullscreen().catch(()=>{})}
                    style={{ flex:1, padding:'0.65rem 1rem', borderRadius:'10px', background:'linear-gradient(135deg,#b5860d,#c9960f)', color:'#fff', border:'none', cursor:'pointer', fontWeight:700, fontSize:'0.88rem' }}>
                    Bật Fullscreen
                  </button>
                  <button onClick={() => document.exitFullscreen().catch(()=>{})}
                    style={{ padding:'0.65rem 1.2rem', borderRadius:'10px', background:'rgba(0,0,0,0.05)', color:'#3a3530', border:'1px solid rgba(0,0,0,0.1)', cursor:'pointer', fontSize:'0.88rem' }}>
                    Thoát
                  </button>
                </div>
              </div>

              {/* QR */}
              <div style={G({ padding:'1.3rem', display:'flex', flexDirection:'column', gap:'0.8rem' })}>
                <div style={{ fontSize:'0.85rem', fontWeight:700, color:'#3a3530' }}>📱 Mã QR Tương Tác</div>
                
                <div style={{ display:'flex', gap:'0.5rem', marginBottom:'0.5rem' }}>
                  <button onClick={() => socket.emit('update_qr_config', { show: !qrConfig.show })}
                    style={{ flex:1, padding:'0.65rem', borderRadius:'10px', background:qrConfig.show?'rgba(220,38,38,0.08)':'rgba(37,99,235,0.08)', color:qrConfig.show?'#dc2626':'#2563eb', border:`1px solid ${qrConfig.show?'rgba(220,38,38,0.2)':'rgba(37,99,235,0.2)'}`, cursor:'pointer', fontWeight:600, fontSize:'0.88rem' }}>
                    {qrConfig.show ? 'Ẩn Mã QR' : 'Hiện Mã QR'}
                  </button>
                </div>

                <div style={{ fontSize:'0.75rem', fontWeight:600, color:'#78726a' }}>Vị trí hiển thị:</div>
                <div style={{ display:'flex', gap:'0.5rem' }}>
                  {[{id:'left',label:'Góc Trái'},{id:'center',label:'Giữa Màn'},{id:'right',label:'Góc Phải'}].map(pos => (
                    <button key={pos.id} onClick={() => socket.emit('update_qr_config', { position: pos.id })}
                      style={{ flex:1, padding:'0.5rem', borderRadius:'8px', background:qrConfig.position===pos.id?'rgba(181,134,13,0.1)':'transparent', border:`1px solid ${qrConfig.position===pos.id?'rgba(181,134,13,0.3)':'rgba(0,0,0,0.1)'}`, color:qrConfig.position===pos.id?'#b5860d':'#78726a', cursor:'pointer', fontSize:'0.8rem', fontWeight:qrConfig.position===pos.id?700:500 }}>
                      {pos.label}
                    </button>
                  ))}
                </div>

                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'0.5rem' }}>
                  <div style={{ fontSize:'0.75rem', fontWeight:600, color:'#78726a' }}>Kích thước:</div>
                  <span style={{ fontSize:'0.85rem', color:'#b5860d', fontWeight:700 }}>{qrConfig.size || 100}%</span>
                </div>
                <input type="range" min="50" max="250" step="10" value={qrConfig.size || 100}
                  onChange={e => socket.emit('update_qr_config', { size: Number(e.target.value) })}
                  style={{ width:'100%', accentColor:'#b5860d' }}
                />
              </div>
            </div>
          )}
          {/* ─── POLLS ─── */}
          {tab==='polls' && (() => {
            const COLORS = ['#ff5555','#e8b84b','#3dd68c','#4f86f7','#a855f7','#f97316'];
            const resetForm = () => { setSNP(false); setEditPoll(null); setNPT(''); setNPO([{id:'A',label:'Lựa chọn A',icon:'',color:'#ff5555'},{id:'B',label:'Lựa chọn B',icon:'',color:'#e8b84b'},{id:'C',label:'Lựa chọn C',icon:'',color:'#3dd68c'}]); };
            const saveAndSend = () => {
              if (!newPollTitle.trim()) return;
              const opts = newPollOpts.filter(o => o.label.trim());
              if (opts.length < 2) return alert('Cần ít nhất 2 lựa chọn!');
              if (editPoll) {
                socket.emit('update_poll', { id: editPoll.id, title: newPollTitle, options: opts });
              } else {
                socket.emit('create_poll', { title: newPollTitle, options: opts });
              }
              resetForm();
            };
            const startEdit = (p) => {
              setEditPoll(p); setNPT(p.title);
              setNPO(p.options.map(o => ({ ...o })));
              setSNP(true);
            };
            return (
              <div style={{ display:'flex', flexDirection:'column', gap:'1.2rem', maxWidth:'700px' }}>
                {/* Header */}
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <h3 style={{ fontSize:'0.73rem', color:'#78726a', letterSpacing:'0.1em', textTransform:'uppercase', fontWeight:700, margin:0 }}>
                    Quản Lý Poll ({polls.length})
                  </h3>
                  <div style={{ display:'flex', gap:'0.5rem' }}>
                    <motion.button onClick={togglePoll} whileTap={{ scale:0.97 }}
                      style={{ padding:'0.38rem 0.9rem', borderRadius:'20px', border:`1px solid ${pollOn?'rgba(22,163,74,0.3)':'rgba(220,38,38,0.3)'}`, background:pollOn?'rgba(22,163,74,0.08)':'rgba(220,38,38,0.06)', color:pollOn?'#16a34a':'#dc2626', cursor:'pointer', fontSize:'0.78rem', fontWeight:700 }}>
                      {pollOn ? '▶ Poll MỞ' : '■ Poll ĐÓNG'}
                    </motion.button>
                    <button onClick={() => { resetForm(); setSNP(true); }}
                      style={{ padding:'0.38rem 1rem', borderRadius:'8px', background:'linear-gradient(135deg,#b5860d,#c9960f)', color:'#fff', border:'none', cursor:'pointer', fontSize:'0.82rem', fontWeight:700 }}>
                      + Tạo Poll
                    </button>
                  </div>
                </div>

                {/* Create / Edit form */}
                {showNewPoll && (
                  <div style={G({ padding:'1.3rem', display:'flex', flexDirection:'column', gap:'0.9rem', border:'1.5px solid rgba(181,134,13,0.3)' })}>
                    <div style={{ fontWeight:700, fontSize:'0.9rem', color:'#b5860d' }}>{editPoll ? '✏️ Sửa Poll' : '📋 Tạo Poll Mới'}</div>
                    <input value={newPollTitle} onChange={e => setNPT(e.target.value)}
                      placeholder="Câu hỏi / Tiêu đề poll..."
                      style={{ padding:'0.75rem', borderRadius:'8px', border:'1px solid rgba(0,0,0,0.12)', background:'rgba(255,255,255,0.9)', fontSize:'0.9rem', outline:'none', color:'#1a1714' }} />
                    <div style={{ display:'flex', flexDirection:'column', gap:'0.45rem' }}>
                      <div style={{ fontSize:'0.78rem', fontWeight:600, color:'#78726a' }}>Các lựa chọn:</div>
                      {newPollOpts.map((opt, i) => (
                        <div key={i} style={{ display:'flex', gap:'0.4rem', alignItems:'center' }}>
                          <input value={opt.icon} onChange={e => { const n=[...newPollOpts]; n[i]={...n[i],icon:e.target.value}; setNPO(n); }}
                            placeholder="icon" style={{ width:'44px', padding:'0.5rem', borderRadius:'8px', border:'1px solid rgba(0,0,0,0.1)', background:'rgba(255,255,255,0.9)', fontSize:'1rem', textAlign:'center', outline:'none' }} />
                          <input value={opt.label} onChange={e => { const n=[...newPollOpts]; n[i]={...n[i],label:e.target.value}; setNPO(n); }}
                            placeholder={`Lựa chọn ${opt.id}...`}
                            style={{ flex:1, padding:'0.5rem', borderRadius:'8px', border:'1px solid rgba(0,0,0,0.1)', background:'rgba(255,255,255,0.9)', fontSize:'0.85rem', outline:'none', color:'#1a1714' }} />
                          <select value={opt.color} onChange={e => { const n=[...newPollOpts]; n[i]={...n[i],color:e.target.value}; setNPO(n); }}
                            style={{ padding:'0.4rem', borderRadius:'8px', border:'1px solid rgba(0,0,0,0.1)', background:opt.color, color:'#fff', fontSize:'0.72rem', outline:'none', cursor:'pointer' }}>
                            {COLORS.map(c => <option key={c} value={c} style={{ background:c }}>{c}</option>)}
                          </select>
                          {newPollOpts.length > 2 && (
                            <button onClick={() => setNPO(newPollOpts.filter((_,j) => j!==i))}
                              style={{ padding:'0.3rem 0.5rem', background:'rgba(220,38,38,0.08)', border:'none', borderRadius:'6px', color:'#dc2626', cursor:'pointer', fontSize:'0.72rem' }}>✕</button>
                          )}
                        </div>
                      ))}
                      {newPollOpts.length < 6 && (
                        <button onClick={() => {
                          const id = String.fromCharCode(65 + newPollOpts.length);
                          setNPO([...newPollOpts, { id, label:`Lựa chọn ${id}`, icon:'', color: COLORS[newPollOpts.length % COLORS.length] }]);
                        }} style={{ alignSelf:'flex-start', background:'transparent', border:'none', color:'#2563eb', fontWeight:600, cursor:'pointer', fontSize:'0.8rem', padding:'0.2rem 0' }}>+ Thêm lựa chọn</button>
                      )}
                    </div>
                    <div style={{ display:'flex', gap:'0.6rem' }}>
                      <button onClick={saveAndSend}
                        style={{ flex:1, padding:'0.7rem', borderRadius:'8px', background:'linear-gradient(135deg,#b5860d,#c9960f)', color:'#fff', border:'none', cursor:'pointer', fontWeight:700, fontSize:'0.88rem' }}>
                        {editPoll ? 'Cập Nhật Poll' : 'Tạo & Lưu Poll'}
                      </button>
                      <button onClick={resetForm}
                        style={{ padding:'0.7rem 1rem', borderRadius:'8px', background:'rgba(0,0,0,0.06)', border:'1px solid rgba(0,0,0,0.1)', color:'#78726a', cursor:'pointer', fontSize:'0.88rem' }}>Hủy</button>
                    </div>
                  </div>
                )}

                {/* Poll list */}
                {polls.length === 0 && !showNewPoll && (
                  <p style={{ color:'#a89e94', fontSize:'0.9rem' }}>Chưa có poll nào. Bấm "+ Tạo Poll" để bắt đầu.</p>
                )}
                {polls.map(p => {
                  const totalVotes = Object.values(p.votes || {}).reduce((s, a) => s + (a?.length||0), 0);
                  const isActive   = p.active;
                  return (
                    <div key={p.id} style={G({ padding:'1.2rem', border: isActive ? '1.5px solid rgba(22,163,74,0.35)' : '1px solid rgba(0,0,0,0.07)', background: isActive ? 'rgba(22,163,74,0.03)' : 'rgba(255,255,255,0.82)' })}>
                      {/* Poll header */}
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'0.8rem', gap:'0.5rem' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', flex:1, minWidth:0 }}>
                          {isActive && <span style={{ fontSize:'0.65rem', color:'#16a34a', fontWeight:700, padding:'0.12rem 0.55rem', background:'rgba(22,163,74,0.12)', borderRadius:'10px', letterSpacing:'0.07em', whiteSpace:'nowrap' }}>● ĐANG CHIẾU</span>}
                          <span style={{ fontWeight:700, fontSize:'0.9rem', color:'#1a1714', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.title}</span>
                        </div>
                        <div style={{ display:'flex', gap:'0.35rem', flexShrink:0 }}>
                          {!isActive && (
                            <button onClick={() => socket.emit('activate_poll', p.id)}
                              style={{ padding:'0.25rem 0.6rem', borderRadius:'6px', background:'rgba(22,163,74,0.08)', border:'1px solid rgba(22,163,74,0.25)', color:'#16a34a', cursor:'pointer', fontSize:'0.72rem', fontWeight:600 }}>▶ Chiếu</button>
                          )}
                          <button onClick={() => startEdit(p)}
                            style={{ padding:'0.25rem 0.6rem', borderRadius:'6px', background:'rgba(37,99,235,0.06)', border:'1px solid rgba(37,99,235,0.2)', color:'#2563eb', cursor:'pointer', fontSize:'0.72rem' }}>✏️</button>
                          <button onClick={() => { if(window.confirm('Đặt lại phiếu?')) socket.emit('poll_reset', p.id); }}
                            style={{ padding:'0.25rem 0.6rem', borderRadius:'6px', background:'rgba(181,134,13,0.06)', border:'1px solid rgba(181,134,13,0.2)', color:'#b5860d', cursor:'pointer', fontSize:'0.72rem' }}>↺</button>
                          <button onClick={() => { if(window.confirm('Xóa poll này?')) socket.emit('delete_poll', p.id); }}
                            style={{ padding:'0.25rem 0.6rem', borderRadius:'6px', background:'rgba(220,38,38,0.06)', border:'1px solid rgba(220,38,38,0.2)', color:'#dc2626', cursor:'pointer', fontSize:'0.72rem' }}>🗑</button>
                        </div>
                      </div>

                      {/* Results bars */}
                      <div style={{ display:'flex', flexDirection:'column', gap:'0.4rem', marginBottom:'0.5rem' }}>
                        {p.options.map(o => {
                          const cnt = p.votes?.[o.id]?.length || 0;
                          const pct = totalVotes ? Math.round(cnt/totalVotes*100) : 0;
                          return (
                            <div key={o.id}>
                              <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.82rem', marginBottom:'0.18rem' }}>
                                <span style={{ color:'#3a3530', fontWeight:500 }}>{o.icon && o.icon+' '}{o.label || o.id}</span>
                                <span style={{ color: o.color||'#b5860d', fontWeight:700 }}>{cnt} · {pct}%</span>
                              </div>
                              <div style={{ height:7, background:'rgba(0,0,0,0.05)', borderRadius:4, overflow:'hidden' }}>
                                <motion.div animate={{ width:`${pct}%` }} transition={{ duration:0.5 }}
                                  style={{ height:'100%', background: o.color||'#b5860d', borderRadius:4 }} />
                              </div>
                              {cnt > 0 && (
                                <div style={{ fontSize:'0.64rem', color:'#a89e94', marginTop:'2px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                                  {(p.votes[o.id]||[]).join(' · ')}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <div style={{ fontSize:'0.72rem', color:'#78726a', textAlign:'right' }}>Tổng: <strong>{totalVotes}</strong> phiếu</div>
                    </div>
                  );
                })}
              </div>
            );
          })()}

          {/* QUIZ - BANK + LIVE */}
          {tab==='quiz' && (
            <div style={{ display:'flex', flexDirection:'column', gap:'1.2rem', maxWidth:'680px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <h3 style={{ fontSize:'0.73rem', color:'#78726a', letterSpacing:'0.1em', textTransform:'uppercase', fontWeight:700, margin:0 }}>Ngân Hàng Câu Hỏi ({quizBank.length})</h3>
                <div style={{ display:'flex', gap:'0.8rem', alignItems:'center' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.3rem', background:'rgba(255,255,255,0.7)', padding:'0.3rem 0.6rem', borderRadius:'8px', border:'1px solid rgba(0,0,0,0.08)' }}>
                    <span style={{ fontSize:'0.72rem', color:'#78726a', fontWeight:600 }}>⏱️ Thời gian (giây):</span>
                    <input type="number" value={quizTimeLimit} onChange={e => setQuizTimeLimit(Number(e.target.value))} style={{ width:'40px', padding:'0.2rem', borderRadius:'4px', border:'1px solid rgba(0,0,0,0.1)', fontSize:'0.75rem', fontWeight:700, outline:'none' }} min="5" max="300" />
                  </div>
                  <button onClick={() => { setSNQ(true); setEditQuiz(null); setQXType('mcq'); setQXTitle(''); setQXOpts([{id:'A',text:''},{id:'B',text:''},{id:'C',text:''}]); setQXCorrect(''); }}
                    style={{ padding:'0.45rem 1rem', borderRadius:'8px', background:'linear-gradient(135deg,#b5860d,#c9960f)', color:'#fff', border:'none', cursor:'pointer', fontSize:'0.82rem', fontWeight:700 }}>+ Tạo Câu Hỏi</button>
                </div>
              </div>

              {/* New / Edit Quiz Form */}
              {showNewQuiz && (
                <div style={G({ padding:'1.4rem', display:'flex', flexDirection:'column', gap:'0.9rem', border:'1.5px solid rgba(181,134,13,0.3)' })}>
                  <div style={{ fontWeight:700, fontSize:'0.9rem', color:'#b5860d' }}>{editQuiz ? '✏️ Sửa Câu Hỏi' : '📝 Tạo Câu Hỏi Mới'}</div>
                  
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                      <input type="radio" value="mcq" checked={qxType === 'mcq'} onChange={() => setQXType('mcq')} /> Trắc Nghiệm
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                      <input type="radio" value="open" checked={qxType === 'open'} onChange={() => setQXType('open')} /> Tự Luận
                    </label>
                  </div>

                  <input type="text" value={qxTitle} onChange={e => setQXTitle(e.target.value)}
                    placeholder="Nội dung câu hỏi..."
                    style={{ padding:'0.75rem', borderRadius:'8px', border:'1px solid rgba(0,0,0,0.12)', background:'rgba(255,255,255,0.9)', fontSize:'0.9rem', outline:'none', color:'#1a1714' }} />
                  
                  {qxType === 'mcq' && (
                    <div style={{ display:'flex', flexDirection:'column', gap:'0.45rem' }}>
                      <div style={{ fontSize:'0.78rem', fontWeight:600, color:'#78726a' }}>Đáp án:</div>
                      {qxOpts.map((opt, i) => (
                      <div key={i} style={{ display:'flex', gap:'0.4rem', alignItems:'center' }}>
                        <span style={{ width:32, height:32, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(181,134,13,0.12)', borderRadius:'8px', fontWeight:700, color:'#b5860d', fontSize:'0.82rem', flexShrink:0 }}>{opt.id}</span>
                        <input type="text" value={opt.text} onChange={e => { const n=[...qxOpts]; n[i]={...n[i],text:e.target.value}; setQXOpts(n); }}
                          placeholder={`Lựa chọn ${opt.id}...`}
                          style={{ flex:1, padding:'0.55rem', borderRadius:'8px', border:`1px solid ${qxCorrect===opt.id?'rgba(22,163,74,0.4)':'rgba(0,0,0,0.1)'}`, background:qxCorrect===opt.id?'rgba(22,163,74,0.06)':'rgba(255,255,255,0.9)', fontSize:'0.85rem', outline:'none', color:'#1a1714' }} />
                        <button onClick={() => setQXCorrect(qxCorrect===opt.id?'':opt.id)}
                          style={{ padding:'0.35rem 0.6rem', borderRadius:'6px', border:`1px solid ${qxCorrect===opt.id?'rgba(22,163,74,0.4)':'rgba(0,0,0,0.1)'}`, background:qxCorrect===opt.id?'rgba(22,163,74,0.1)':'transparent', color:qxCorrect===opt.id?'#16a34a':'#78726a', cursor:'pointer', fontSize:'0.7rem', fontWeight:600, whiteSpace:'nowrap' }}
                          title="Đánh dấu đáp án đúng">{qxCorrect===opt.id?'✓ Đúng':'Chọn đúng'}</button>
                        {qxOpts.length > 2 && <button onClick={() => setQXOpts(qxOpts.filter((_,j)=>j!==i))} style={{ padding:'0.3rem 0.5rem', background:'rgba(220,38,38,0.08)', border:'none', borderRadius:'6px', color:'#dc2626', cursor:'pointer', fontSize:'0.72rem' }}>✕</button>}
                      </div>
                    ))}
                    {qxOpts.length < 6 && (
                      <button onClick={() => setQXOpts([...qxOpts, {id:String.fromCharCode(65+qxOpts.length), text:''}])}
                        style={{ alignSelf:'flex-start', background:'transparent', border:'none', color:'#2563eb', fontWeight:600, cursor:'pointer', fontSize:'0.8rem', padding:'0.2rem 0' }}>+ Thêm đáp án</button>
                    )}
                  </div>
                  )}
                  <div>
                    <label style={{ fontSize:'0.78rem', fontWeight:600, color:'#78726a', display:'block', marginBottom:'0.3rem' }}>📚 Giải Thích Đáp Án <span style={{fontWeight:400}}>(hiện sau khi chốt)</span></label>
                    <textarea value={qxExplan} onChange={e => setQXExplan(e.target.value)}
                      placeholder="Nếu có, nhập giải thích ngắn gọn..."
                      rows={2}
                      style={{ width:'100%', boxSizing:'border-box', padding:'0.55rem 0.75rem', borderRadius:'8px', border:'1px solid rgba(0,0,0,0.12)', background:'rgba(255,255,255,0.9)', fontSize:'0.85rem', resize:'none', outline:'none', color:'#1a1714' }}
                    />
                  </div>
                  <div style={{ display:'flex', gap:'0.6rem' }}>
                    <button onClick={() => {
                      if (!qxTitle.trim() || (qxType === 'mcq' && qxOpts.every(o=>!o.text.trim()))) return;
                      const data = { id: editQuiz?.id || null, type: qxType, question: qxTitle, options: qxType === 'mcq' ? qxOpts.filter(o=>o.text.trim()) : [], correctId: qxCorrect || null, explanation: qxExplan.trim() };
                      socket.emit('save_quiz_to_bank', data);
                      setSNQ(false); setEditQuiz(null); setQXTitle(''); setQXOpts([{id:'A',text:''},{id:'B',text:''},{id:'C',text:''}]); setQXCorrect(''); setQXExplan(''); setQXType('mcq');
                    }} style={{ flex:1, padding:'0.7rem', borderRadius:'8px', background:'linear-gradient(135deg,#b5860d,#c9960f)', color:'#fff', border:'none', cursor:'pointer', fontWeight:700, fontSize:'0.88rem' }}>Lưu vào Ngân Hàng</button>
                    <button onClick={() => setSNQ(false)} style={{ padding:'0.7rem 1rem', borderRadius:'8px', background:'rgba(0,0,0,0.06)', border:'1px solid rgba(0,0,0,0.1)', color:'#78726a', cursor:'pointer', fontSize:'0.88rem' }}>Hủy</button>
                  </div>
                </div>
              )}

              {/* Live quiz status */}
              {activeQuiz && (
                <div style={G({ padding:'1.2rem', border:'1.5px solid rgba(181,134,13,0.35)', background:'rgba(181,134,13,0.03)' })}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.7rem' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'0.6rem' }}>
                      <span style={{ fontSize:'0.68rem', color:'#16a34a', fontWeight:700, padding:'0.15rem 0.6rem', background:'rgba(22,163,74,0.12)', borderRadius:'10px', letterSpacing:'0.08em' }}>📡 LIVE</span>
                      <span style={{ fontWeight:700, fontSize:'0.9rem', color:'#1a1714' }}>{activeQuiz.question}</span>
                    </div>
                    <button onClick={() => { socket.emit('admin_clear_quiz'); setCorrectOpt(''); }} style={{ padding:'0.3rem 0.7rem', borderRadius:'6px', background:'rgba(220,38,38,0.08)', border:'1px solid rgba(220,38,38,0.2)', color:'#dc2626', cursor:'pointer', fontSize:'0.75rem', fontWeight:600, whiteSpace:'nowrap' }}>Ẩn đi</button>
                  </div>
                  {activeQuiz.type !== 'open' ? (
                    <div style={{ display:'flex', flexDirection:'column', gap:'0.35rem', marginBottom:'0.8rem' }}>
                      {activeQuiz.options.map(opt => {
                        const count = activeQuiz.counts?.[opt.id] || 0;
                        const pct = activeQuiz.totalVotes ? Math.round(count/activeQuiz.totalVotes*100) : 0;
                        const respondents = activeQuiz.respondents?.[opt.id] || [];
                        return (
                          <div key={opt.id}>
                            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.82rem', marginBottom:'0.2rem' }}>
                              <span style={{ color: activeQuiz.correctOptionId === opt.id ? '#16a34a' : '#3a3530', fontWeight: activeQuiz.correctOptionId===opt.id ? 700 : 400 }}>
                                {activeQuiz.correctOptionId===opt.id ? '✅ ' : ''}<strong>{opt.id}.</strong> {opt.text}
                              </span>
                              <span style={{ fontWeight:700, color:'#b5860d' }}>{count} ({pct}%)</span>
                            </div>
                            <div style={{ height:7, background:'rgba(0,0,0,0.05)', borderRadius:4, overflow:'hidden', marginBottom: respondents.length>0 ? 3 : 0 }}>
                              <motion.div animate={{ width:`${pct}%` }} transition={{ duration:0.4 }} style={{ height:'100%', background: activeQuiz.correctOptionId===opt.id ? '#16a34a' : '#b5860d', borderRadius:4 }} />
                            </div>
                            {respondents.length > 0 && (
                              <div style={{ fontSize:'0.66rem', color:'#a89e94', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                                {respondents.slice(0,6).map(r=>r.name).join(' · ')}{respondents.length>6?` +${respondents.length-6} khác`:''}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{ display:'flex', flexDirection:'column', gap:'0.4rem', marginBottom:'0.8rem', maxHeight:'200px', overflowY:'auto' }}>
                      {activeQuiz.rawVotes && activeQuiz.rawVotes.length > 0 ? (
                        activeQuiz.rawVotes.map((v, i) => (
                          <div key={i} style={{ padding:'0.6rem', background:'rgba(255,255,255,0.7)', borderRadius:'8px', border:'1px solid rgba(0,0,0,0.05)' }}>
                            <div style={{ fontSize:'0.75rem', fontWeight:700, color:'#b5860d', marginBottom:'0.2rem' }}>{v.name} ({v.mssv})</div>
                            <div style={{ fontSize:'0.85rem', color:'#1a1714', lineHeight:1.4 }}>{v.optionId}</div>
                          </div>
                        ))
                      ) : (
                        <div style={{ fontSize:'0.8rem', color:'#78726a', fontStyle:'italic' }}>Chưa có câu trả lời nào...</div>
                      )}
                    </div>
                  )}
                  <div style={{ fontSize:'0.75rem', color:'#78726a', textAlign:'right', marginBottom:'0.6rem' }}>Tổng: <strong>{activeQuiz.totalVotes||0}</strong> phương án | {Object.values(users).length} khán giả</div>
                  {!activeQuiz.isFinished ? (
                    <div style={{ display:'flex', flexDirection:'column', gap:'0.6rem' }}>
                      <div style={{ display:'flex', gap:'0.7rem' }}>
                        <select value={correctOpt} onChange={e=>setCorrectOpt(e.target.value)}
                          style={{ flex:1, padding:'0.6rem', borderRadius:'7px', border:'1px solid rgba(0,0,0,0.12)', background:'rgba(255,255,255,0.9)', outline:'none', fontSize:'0.82rem', color:'#3a3530' }}>
                          <option value="">-- Khảo sát (không xếp hạng) --</option>
                          {activeQuiz.options.map(o => <option key={o.id} value={o.id}>{o.id}. {o.text}</option>)}
                        </select>
                        <button onClick={() => socket.emit('admin_stop_quiz', { correctOptionId: correctOpt || null, explanation: quizExplanation })}
                          style={{ padding:'0.6rem 1.1rem', borderRadius:'7px', background:'rgba(220,38,38,0.08)', color:'#dc2626', border:'1px solid rgba(220,38,38,0.25)', cursor:'pointer', fontWeight:700, whiteSpace:'nowrap', fontSize:'0.82rem' }}>Chốt Kết Quả</button>
                      </div>
                      <textarea
                        value={quizExplanation}
                        onChange={e => setQuizExplanation(e.target.value)}
                        placeholder="Giải thích đáp án (sẽ hiện sau khi chốt)..."
                        rows={2}
                        style={{ padding:'0.5rem 0.75rem', borderRadius:'7px', border:'1px solid rgba(0,0,0,0.12)', background:'rgba(255,255,255,0.9)', fontSize:'0.82rem', resize:'none', outline:'none', color:'#1a1714' }}
                      />
                    </div>
                  ) : (
                    <div style={{ display:'flex', flexDirection:'column', gap:'0.6rem' }}>
                      <div style={{ padding:'0.7rem 1rem', background:'rgba(22,163,74,0.07)', borderRadius:'8px', border:'1px solid rgba(22,163,74,0.2)', fontSize:'0.8rem', color:'#16a34a', fontWeight:700 }}>
                        ✅ Đã chốt{activeQuiz.correctOptionId ? ` · Đáp án: ${activeQuiz.correctOptionId}` : ' (khảo sát)'}
                      </div>
                      {activeQuiz.explanation && (
                        <div style={{ padding:'0.6rem 0.9rem', background:'rgba(37,99,235,0.06)', border:'1px solid rgba(37,99,235,0.18)', borderRadius:'8px', fontSize:'0.8rem', color:'#2563eb', lineHeight:1.5 }}>
                          📚 <strong>Giải thích:</strong> {activeQuiz.explanation}
                        </div>
                      )}
                      {activeQuiz.winners?.length > 0 && (
                        <div style={{ padding:'0.7rem 0.9rem', background:'rgba(181,134,13,0.06)', border:'1px solid rgba(181,134,13,0.2)', borderRadius:'8px' }}>
                          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.4rem' }}>
                            <div style={{ fontSize:'0.72rem', fontWeight:700, color:'#b5860d', letterSpacing:'0.06em' }}>🏆 TRẢ LỜI ĐÚNG & NHANH NHẤT ({activeQuiz.winners.length} người)</div>
                          </div>
                          <div style={{ maxHeight:'160px', overflowY:'auto', display:'flex', flexDirection:'column', gap:'1px' }}>
                            {activeQuiz.winners.map(w => (
                              <div key={w.rank} style={{ display:'flex', alignItems:'center', gap:'0.5rem', padding:'0.22rem 0', borderBottom:'1px solid rgba(0,0,0,0.04)' }}>
                                <span style={{ fontSize:'0.85rem', width:'1.6rem', textAlign:'center', flexShrink:0 }}>
                                  {w.rank===1?'🥇':w.rank===2?'🥈':w.rank===3?'🥉':`${w.rank}.`}
                                </span>
                                <span style={{ fontWeight:w.rank<=3?700:400, color:'#1a1714', fontSize:'0.83rem', flex:1 }}>{w.name}</span>
                                {w.mssv && <span style={{ fontSize:'0.68rem', color:'#a89e94', fontFamily:'monospace' }}>{w.mssv}</span>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Bank list */}
              <div style={{ display:'flex', flexDirection:'column', gap:'0.55rem' }}>
                <div style={{ fontSize:'0.72rem', color:'#78726a', fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase' }}>
                  Danh sách câu hỏi đã tạo
                </div>
                {quizBank.map((q, qi) => (
                  <div key={q.id} style={G({ padding:'1rem', display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'0.8rem', background: activeQuiz?.id===q.id ? 'rgba(22,163,74,0.04)' : 'rgba(255,255,255,0.82)', border: activeQuiz?.id===q.id ? '1.5px solid rgba(22,163,74,0.3)' : '1px solid rgba(0,0,0,0.07)' })}>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontWeight:700, fontSize:'0.87rem', color:'#1a1714', marginBottom:'0.3rem' }}>{qi+1}. {q.question} {q.type === 'open' && <span style={{fontSize:'0.75rem', fontWeight:400, color:'#16a34a'}}>(Tự luận)</span>}</div>
                      
                      {q.type !== 'open' ? (
                        <div style={{ display:'flex', flexWrap:'wrap', gap:'0.3rem' }}>
                          {q.options.map(o => (
                            <span key={o.id} style={{ fontSize:'0.72rem', padding:'0.12rem 0.55rem', background: q.correctId===o.id ? 'rgba(22,163,74,0.12)' : 'rgba(0,0,0,0.05)', border: q.correctId===o.id ? '1px solid rgba(22,163,74,0.25)' : '1px solid rgba(0,0,0,0.08)', borderRadius:'6px', color: q.correctId===o.id ? '#16a34a' : '#78726a', fontWeight: q.correctId===o.id ? 700 : 400 }}>{o.id}. {o.text}</span>
                          ))}
                        </div>
                      ) : (
                        <div style={{ fontSize:'0.75rem', color:'#78726a', fontStyle:'italic' }}>Câu hỏi trả lời tự do bằng văn bản</div>
                      )}
                    </div>
                    <div style={{ display:'flex', gap:'0.35rem', flexShrink:0 }}>
                      <button onClick={() => socket.emit('start_quiz_from_bank', { id: q.id, duration: quizTimeLimit })}
                        style={{ padding:'0.35rem 0.7rem', borderRadius:'6px', border:'1px solid rgba(181,134,13,0.3)', background:'rgba(181,134,13,0.08)', color:'#b5860d', cursor:'pointer', fontSize:'0.75rem', fontWeight:700, whiteSpace:'nowrap' }}>▶ Phát</button>
                      <button onClick={() => { setEditQuiz(q); setQXType(q.type || 'mcq'); setQXTitle(q.question); setQXOpts(q.options?.length ? [...q.options] : [{id:'A',text:''},{id:'B',text:''}]); setQXCorrect(q.correctId||''); setSNQ(true); }}
                        style={{ padding:'0.35rem 0.55rem', borderRadius:'6px', border:'1px solid rgba(0,0,0,0.1)', background:'transparent', color:'#78726a', cursor:'pointer', fontSize:'0.75rem' }}>✏️</button>
                      <button onClick={() => { if(window.confirm('Xóa câu hỏi này?')) socket.emit('delete_quiz_from_bank', q.id); }}
                        style={{ padding:'0.35rem 0.55rem', borderRadius:'6px', border:'1px solid rgba(220,38,38,0.2)', background:'rgba(220,38,38,0.06)', color:'#dc2626', cursor:'pointer', fontSize:'0.75rem' }}>🗑</button>
                    </div>
                  </div>
                ))}
                {quizBank.length===0 && <p style={{ color:'#a89e94', fontSize:'0.88rem' }}>Chưa có câu hỏi nào trong ngân hàng.</p>}
              </div>
            </div>
          )}

          {/* Q&A */}
          {tab==='qa' && (
            <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:'1rem', height:'calc(100vh - 140px)' }}>
              <div style={{ overflow:'auto', display:'flex', flexDirection:'column', gap:'0.4rem' }}>
                <div style={{ fontSize:'0.75rem', color:'#78726a', marginBottom:'0.4rem', display:'flex', gap:'0.8rem' }}>
                  <span style={{ color:'#dc2626', fontWeight:600 }}>{pendingQs} chờ trả lời</span>
                  <span>· {questions.length} tổng</span>
                </div>
                {questions.length===0 && <p style={{ color:'#a89e94', fontSize:'0.9rem' }}>Chưa có câu hỏi nào.</p>}
                {questions.map(q => (
                  <motion.div key={q.id} initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }}
                    onClick={() => { setSelQ(q); setAns(''); }}
                    style={{ ...G({ padding:'0.9rem', cursor:'pointer', border:selectedQ?.id===q.id?'1.5px solid rgba(181,134,13,0.4)':'1px solid rgba(0,0,0,0.07)', background:selectedQ?.id===q.id?'rgba(181,134,13,0.05)':'rgba(255,255,255,0.72)' }), transition:'all 0.2s' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.3rem' }}>
                      <span style={{ fontWeight:700, fontSize:'0.82rem', color:'#b5860d' }}>{q.name}</span>
                      <div style={{ display:'flex', gap:'0.4rem', alignItems:'center' }}>
                        {q.mssv && <span style={{ fontSize:'0.7rem', color:'#a89e94' }}>{q.mssv}</span>}
                        {q.answer 
                          ? <span style={{ fontSize:'0.65rem', color:'#16a34a', fontWeight:700, padding:'0.1rem 0.4rem', background:'rgba(22,163,74,0.1)', borderRadius:'6px' }}>✓ TL</span>
                          : <span style={{ fontSize:'0.65rem', color:'#dc2626', fontWeight:600, padding:'0.1rem 0.4rem', background:'rgba(220,38,38,0.08)', borderRadius:'6px' }}>Chờ</span>
                        }
                      </div>
                    </div>
                    <p style={{ fontSize:'0.85rem', color:'#3a3530', lineHeight:1.5 }}>{q.text}</p>
                    {q.answer && <p style={{ fontSize:'0.78rem', color:'#16a34a', marginTop:'0.3rem', fontStyle:'italic' }}>→ {q.answer}</p>}
                  </motion.div>
                ))}
              </div>
              <div style={{ ...G({ display:'flex',flexDirection:'column',overflow:'hidden' }) }}>
                <div style={{ padding:'0.8rem 1rem', borderBottom:'1px solid rgba(0,0,0,0.06)', fontSize:'0.73rem', color:'#b5860d', fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', background:'rgba(181,134,13,0.04)' }}>Trả Lời</div>
                <div style={{ flex:1, padding:'1rem', display:'flex', flexDirection:'column', gap:'0.8rem' }}>
                  {!selectedQ ? <p style={{ color:'#a89e94', fontSize:'0.85rem' }}>Chọn câu hỏi để trả lời</p> : (
                    <>
                      <div style={{ background:'rgba(181,134,13,0.06)', borderRadius:'8px', padding:'0.7rem', fontSize:'0.83rem', color:'#3a3530', lineHeight:1.5, border:'1px solid rgba(181,134,13,0.15)' }}>
                        <span style={{ color:'#b5860d', fontWeight:700 }}>{selectedQ.name}:</span> {selectedQ.text}
                      </div>
                      <textarea value={answer} onChange={e => setAns(e.target.value)} placeholder="Nhập câu trả lời..."
                        style={{ flex:1, minHeight:'100px', background:'rgba(255,255,255,0.9)', border:'1px solid rgba(0,0,0,0.1)', borderRadius:'10px', padding:'0.7rem', color:'#1a1714', fontSize:'0.85rem', resize:'vertical', outline:'none', fontFamily:'Inter,sans-serif' }}
                      />
                      <button onClick={submitAnswer}
                        style={{ padding:'0.7rem', borderRadius:'10px', background:answer.trim()?'linear-gradient(135deg,#b5860d,#c9960f)':'rgba(0,0,0,0.06)', color:answer.trim()?'#fff':'#a89e94', border:'none', fontWeight:700, cursor:'pointer', transition:'all 0.2s', fontSize:'0.88rem' }}>
                        Gửi → Push về thiết bị khán giả
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STUDENT LIST */}
          {tab==='students' && (() => {
            const onlineSet = new Set(users.map(u => u.mssv));
            const filtered = studentList.filter(s => {
              const matchSearch = !stuSearch || s.name.toLowerCase().includes(stuSearch.toLowerCase()) || s.mssv.includes(stuSearch);
              const matchFilter =
                stuFilter === 'all' ? true :
                stuFilter === 'online' ? onlineSet.has(s.mssv) :
                stuFilter === 'offline' ? !onlineSet.has(s.mssv) :
                stuFilter === 'voted' ? s.voted :
                stuFilter === 'unvoted' ? !s.voted : true;
              return matchSearch && matchFilter;
            });
            const onlineCount = studentList.filter(s => onlineSet.has(s.mssv)).length;
            const votedCount  = studentList.filter(s => s.voted).length;

            return (
              <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                {/* Stats bar */}
                <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'0.7rem' }}>
                  {[
                    { label:'Tổng SV', val: studentList.length, color:'#b5860d', bg:'rgba(181,134,13,0.08)' },
                    { label:'Đang online', val: onlineCount, color:'#16a34a', bg:'rgba(22,163,74,0.08)' },
                    { label:'Đã bỏ phiếu', val: votedCount, color:'#2563eb', bg:'rgba(37,99,235,0.08)' },
                    { label:'Vắng mặt', val: studentList.length - onlineCount, color:'#78726a', bg:'rgba(0,0,0,0.04)' },
                  ].map(c => (
                    <div key={c.label} style={{ background:c.bg, border:`1px solid ${c.color}30`, borderRadius:'12px', padding:'0.7rem 1rem' }}>
                      <div style={{ fontSize:'1.4rem', fontWeight:800, color:c.color }}>{c.val}</div>
                      <div style={{ fontSize:'0.7rem', color:'#78726a', fontWeight:600 }}>{c.label}</div>
                    </div>
                  ))}
                </div>

                {/* Search + Filter + Actions */}
                <div style={{ display:'flex', gap:'0.7rem', flexWrap:'wrap', alignItems:'center' }}>
                  <input
                    value={stuSearch} onChange={e => setStuSearch(e.target.value)}
                    placeholder="🔍 Tìm theo tên hoặc MSSV..."
                    style={{ flex:1, minWidth:'200px', padding:'0.55rem 0.9rem', borderRadius:'10px', border:'1px solid rgba(0,0,0,0.12)', background:'rgba(255,255,255,0.85)', fontSize:'0.85rem', outline:'none', color:'#1a1714' }}
                  />
                  {[['all','Tất cả'],['online','Online'],['offline','Vắng'],['voted','Đã phiếu'],['unvoted','Chưa phiếu']].map(([v,l]) => (
                    <button key={v} onClick={() => setStuFilter(v)}
                      style={{ padding:'0.4rem 0.8rem', borderRadius:'20px', border:`1px solid ${stuFilter===v?'rgba(181,134,13,0.4)':'rgba(0,0,0,0.1)'}`, background:stuFilter===v?'rgba(181,134,13,0.12)':'transparent', color:stuFilter===v?'#b5860d':'#78726a', cursor:'pointer', fontSize:'0.78rem', fontWeight:600 }}>
                      {l}
                    </button>
                  ))}
                  <button onClick={() => setShowPasswords(p => !p)}
                    style={{ padding:'0.4rem 0.8rem', borderRadius:'20px', border:`1px solid ${showPasswords?'rgba(37,99,235,0.4)':'rgba(0,0,0,0.1)'}`, background:showPasswords?'rgba(37,99,235,0.10)':'transparent', color:showPasswords?'#2563eb':'#78726a', cursor:'pointer', fontSize:'0.78rem', fontWeight:600 }}>
                    {showPasswords ? '🔓 Ẩn MK' : '🔐 Hiện MK'}
                  </button>
                  <a href={`/api/students/credentials?key=SSH1151`} target="_blank"
                    style={{ padding:'0.4rem 0.8rem', borderRadius:'20px', border:'1px solid rgba(22,163,74,0.3)', background:'rgba(22,163,74,0.08)',
                    color:'#16a34a', cursor:'pointer', fontSize:'0.78rem', fontWeight:600, textDecoration:'none' }}>
                    ↓ Xuất JSON
                  </a>
                </div>

                {/* Table */}
                <div style={{ background:'rgba(255,255,255,0.7)', borderRadius:'14px', border:'1px solid rgba(0,0,0,0.06)', overflow:'hidden' }}>
                  <div style={{ display:'grid', gridTemplateColumns:showPasswords?'2.5rem 1fr 6.5rem 5rem 4.5rem 5rem 6rem':'2.5rem 1fr 7rem 5rem 5rem 6rem', gap:0, padding:'0.5rem 1rem', background:'rgba(181,134,13,0.06)', borderBottom:'1px solid rgba(0,0,0,0.07)', fontSize:'0.7rem', color:'#78726a', fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase' }}>
                    <span>#</span><span>Họ Tên</span><span>MSSV</span><span>Online</span><span>Phiếu</span>
                    {showPasswords && <span style={{color:'#2563eb'}}>Mật Khẩu</span>}
                    <span>Hành Động</span>
                  </div>
                  <div style={{ maxHeight:'calc(100vh - 360px)', overflowY:'auto' }}>
                    {filtered.length === 0 && <p style={{ padding:'1rem', color:'#a89e94', fontSize:'0.88rem' }}>Không tìm thấy sinh viên.</p>}
                    {filtered.map((s, i) => {
                      const isOnline = onlineSet.has(s.mssv);
                      const isMuted  = mutedMSSV.includes(s.mssv);
                      const isBlocked = blockedMSSV.includes(s.mssv);
                      // Lookup password from STUDENTS (not available in studentList from API)
                      return (
                        <div key={s.mssv} style={{ display:'grid', gridTemplateColumns:showPasswords?'2.5rem 1fr 6.5rem 5rem 4.5rem 5rem 6rem':'2.5rem 1fr 7rem 5rem 5rem 6rem', gap:0, padding:'0.55rem 1rem', borderBottom:'1px solid rgba(0,0,0,0.04)', background: i%2===0 ? 'transparent' : 'rgba(0,0,0,0.015)', alignItems:'center' }}>
                          <span style={{ fontSize:'0.72rem', color:'#a89e94' }}>{i+1}</span>
                          <div style={{ minWidth:0 }}>
                            <div style={{ fontWeight:600, fontSize:'0.85rem', color:'#1a1714', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{s.name}</div>
                            {isMuted && <span style={{ fontSize:'0.62rem', color:'#b5860d', background:'rgba(181,134,13,0.1)', borderRadius:'4px', padding:'0 4px' }}>Muted</span>}
                            {isBlocked && <span style={{ fontSize:'0.62rem', color:'#dc2626', background:'rgba(220,38,38,0.1)', borderRadius:'4px', padding:'0 4px', marginLeft:'2px' }}>Blocked</span>}
                          </div>
                          <span style={{ fontFamily:'monospace', fontSize:'0.75rem', color:'#5a5450' }}>{s.mssv}</span>
                          <span style={{ fontSize:'0.8rem' }}>
                            {isOnline
                              ? <span style={{ color:'#16a34a', fontWeight:700 }}>● Online</span>
                              : <span style={{ color:'#a89e94' }}>○ Vắng</span>}
                          </span>
                          <span style={{ fontSize:'0.8rem' }}>
                            {s.voted
                              ? <span style={{ color:'#2563eb', fontWeight:700 }}>✓ Phiếu</span>
                              : <span style={{ color:'#a89e94' }}>–</span>}
                          </span>
                          {showPasswords && (
                            <span style={{ fontFamily:'monospace', fontSize:'0.78rem', color:'#2563eb', background:'rgba(37,99,235,0.07)', borderRadius:'5px', padding:'0.1rem 0.35rem' }}>
                              {s.password || '–'}
                            </span>
                          )}
                          <div style={{ display:'flex', gap:'0.25rem' }}>
                            {isMuted
                              ? <button onClick={() => unmuteMssv(s.mssv)} style={{ padding:'0.2rem 0.45rem', fontSize:'0.65rem', borderRadius:'5px', border:'1px solid rgba(181,134,13,0.3)', background:'rgba(181,134,13,0.1)', color:'#b5860d', cursor:'pointer' }}>🔈</button>
                              : <button onClick={() => muteMssv(s.mssv)} style={{ padding:'0.2rem 0.45rem', fontSize:'0.65rem', borderRadius:'5px', border:'1px solid rgba(0,0,0,0.1)', background:'transparent', color:'#78726a', cursor:'pointer' }} title="Mute">🔇</button>}
                            {!isBlocked
                              ? <button onClick={() => blockMssv(s.mssv)} style={{ padding:'0.2rem 0.45rem', fontSize:'0.65rem', borderRadius:'5px', border:'1px solid rgba(220,38,38,0.25)', background:'rgba(220,38,38,0.05)', color:'#dc2626', cursor:'pointer' }} title="Block">⛔</button>
                              : <button onClick={() => unblockMssv(s.mssv)} style={{ padding:'0.2rem 0.45rem', fontSize:'0.65rem', borderRadius:'5px', border:'1px solid rgba(22,163,74,0.25)', background:'rgba(22,163,74,0.05)', color:'#16a34a', cursor:'pointer' }}>✓ Bỏ chặn</button>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* USERS ONLINE */}
          {tab==='users' && (
            <div>
              <h3 style={{ fontSize:'0.73rem', color:'#78726a', marginBottom:'1rem', letterSpacing:'0.1em', textTransform:'uppercase', fontWeight:700 }}>{users.length} Người Dùng Trực Tuyến</h3>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:'0.7rem' }}>
                {users.map((u,i) => (
                  <div key={i} style={G({ padding:'0.9rem', display:'flex', justifyContent:'space-between', alignItems:'flex-start' })}>
                    <div style={{ display:'flex', gap:'0.7rem', alignItems:'center', minWidth:0 }}>
                      <div style={{ width:'36px', height:'36px', borderRadius:'50%', background:`hsl(${(i * 47) % 360}, 55%, 88%)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.85rem', fontWeight:700, color:`hsl(${(i * 47) % 360}, 50%, 35%)`, flexShrink:0 }}>
                        {(u.name||u).charAt(0).toUpperCase()}
                      </div>
                      <div style={{ minWidth:0 }}>
                        <div style={{ fontWeight:700, fontSize:'0.88rem', color:'#1a1714', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{u.name||u}</div>
                        {u.mssv && <div style={{ fontSize:'0.72rem', color:'#78726a' }}>{u.mssv}</div>}
                        {u.ip && <div style={{ fontSize:'0.68rem', color:'#a89e94', marginTop:'1px' }}>{u.ip}</div>}
                      </div>
                    </div>
                    <div style={{ display:'flex', gap:'0.4rem', flexShrink:0 }}>
                      {mutedMSSV.includes(u.mssv)
                        ? <button onClick={()=>unmuteMssv(u.mssv)} style={{ padding:'0.3rem 0.6rem', borderRadius:'6px', border:'1px solid rgba(181,134,13,0.3)', background:'rgba(181,134,13,0.1)', color:'#b5860d', cursor:'pointer', fontSize:'0.7rem' }} title="Bỏ tắt tiếng">🔈 Bỏ TT</button>
                        : <button onClick={()=>muteMssv(u.mssv)} style={{ padding:'0.3rem 0.6rem', borderRadius:'6px', border:'1px solid rgba(100,100,100,0.2)', background:'rgba(0,0,0,0.04)', color:'#636366', cursor:'pointer', fontSize:'0.7rem' }} title="Tắt tiếng">🔇 Mute</button>
                      }
                      {u.mssv && <button onClick={()=>blockMssv(u.mssv)} style={{ padding:'0.3rem 0.6rem', borderRadius:'6px', border:'1px solid rgba(220,38,38,0.25)', background:'rgba(220,38,38,0.06)', color:'#dc2626', cursor:'pointer', fontSize:'0.7rem' }}>⛔ Chặn</button>}
                    </div>
                  </div>
                ))}
                {users.length===0 && <p style={{ color:'#a89e94', fontSize:'0.9rem' }}>Chưa có khán giả nào.</p>}
              </div>
            </div>
          )}

          {/* COMMENT QUEUE */}
          {tab==='queue' && (
            <div style={{ display:'flex', flexDirection:'column', gap:'1.2rem' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
                <h3 style={{ fontSize:'0.73rem', color:'#78726a', letterSpacing:'0.1em', textTransform:'uppercase', fontWeight:700, margin:0 }}>Hàng Chờ Bình Luận ({commentQueue.length})</h3>
                <button onClick={() => socket.emit('toggle_comment_mode', !commentModeOn)}
                  style={{ padding:'0.35rem 1rem', borderRadius:'20px', border:'none', background: commentModeOn ? 'rgba(181,134,13,0.15)' : 'rgba(0,0,0,0.07)', color: commentModeOn ? '#b5860d' : '#78726a', cursor:'pointer', fontSize:'0.8rem', fontWeight:700 }}>
                  {commentModeOn ? '📬 Chế độ duyệt BẬT' : '📢 Bật duyệt bình luận'}
                </button>
              </div>
              {!commentModeOn && <p style={{ color:'#a89e94', fontSize:'0.85rem', margin:0 }}>Bật chế độ duyệt để bình luận được xếp hàng chờ tại đây trước khi lên màn chiếu.</p>}
              {commentModeOn && commentQueue.length === 0 && <p style={{ color:'#a89e94', fontSize:'0.9rem' }}>Chưa có bình luận nào chờ duyệt.</p>}
              <div style={{ display:'flex', flexDirection:'column', gap:'0.6rem' }}>
                {commentQueue.map((item) => (
                  <div key={item.id} style={G({ padding:'1rem 1.2rem', display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'1rem' })}>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontWeight:700, fontSize:'0.82rem', color:'#b5860d', marginBottom:'0.3rem' }}>{item.name} <span style={{ color:'#a89e94', fontWeight:400 }}>· {item.mssv}</span></div>
                      <div style={{ fontSize:'0.88rem', color:'#3a3530', lineHeight:1.5 }}>{item.text}</div>
                    </div>
                    <div style={{ display:'flex', gap:'0.5rem', flexShrink:0 }}>
                      <button onClick={() => approveComment(item.id)} style={{ padding:'0.35rem 0.8rem', borderRadius:'6px', border:'1px solid rgba(22,163,74,0.3)', background:'rgba(22,163,74,0.08)', color:'#16a34a', cursor:'pointer', fontSize:'0.78rem', fontWeight:600 }}>✓ Duyệt</button>
                      <button onClick={() => rejectComment(item.id)} style={{ padding:'0.35rem 0.8rem', borderRadius:'6px', border:'1px solid rgba(220,38,38,0.25)', background:'rgba(220,38,38,0.06)', color:'#dc2626', cursor:'pointer', fontSize:'0.78rem', fontWeight:600 }}>✕ Từ chối</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MODERATION */}
          {tab==='moderation' && (
            <div style={{ display:'flex', flexDirection:'column', gap:'2rem' }}>

              {/* Content Toggles */}
              <div style={G({ padding:'1.4rem' })}>
                <h3 style={{ fontSize:'0.73rem', color:'#78726a', marginBottom:'1.2rem', letterSpacing:'0.1em', textTransform:'uppercase', fontWeight:700 }}>Kiểm Soát Nội Dung Toàn Cục</h3>
                <div style={{ display:'flex', flexDirection:'column', gap:'0.8rem' }}>
                  {[
                    { label:'💬 Bình luận', on: commentsOn,    toggle: () => socket.emit('toggle_comments',     !commentsOn) },
                    { label:'❓ Câu hỏi',  on: questionsOn,  toggle: () => socket.emit('toggle_questions',    !questionsOn) },
                    { label:'❤️ Reactions', on: reactionsOn,  toggle: () => socket.emit('toggle_reactions',    !reactionsOn) },
                  ].map(({ label, on, toggle }) => (
                    <div key={label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0.6rem 0', borderBottom:'1px solid rgba(0,0,0,0.06)' }}>
                      <span style={{ fontSize:'0.88rem', fontWeight:600, color:'#3a3530' }}>{label}</span>
                      <button onClick={toggle} style={{ padding:'0.35rem 1rem', borderRadius:'20px', border:'none', cursor:'pointer', fontSize:'0.82rem', fontWeight:700, background: on ? 'rgba(22,163,74,0.12)' : 'rgba(220,38,38,0.1)', color: on ? '#16a34a' : '#dc2626' }}>
                        {on ? '● BẬT' : '○ TẮT'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* MSSV Bị Chặn */}
              <div>
                <h3 style={{ fontSize:'0.73rem', color:'#78726a', marginBottom:'1rem', letterSpacing:'0.1em', textTransform:'uppercase', fontWeight:700 }}>⛔ MSSV Bị Chặn ({blockedMSSV.length})</h3>
                {blockedMSSV.length === 0 && <p style={{ color:'#a89e94', fontSize:'0.9rem' }}>Chưa có MSSV nào bị chặn.</p>}
                <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem', maxWidth:'480px' }}>
                  {blockedMSSV.map((mssv, i) => (
                    <div key={i} style={G({ padding:'0.8rem 1.2rem', display:'flex', justifyContent:'space-between', alignItems:'center' })}>
                      <div style={{ fontFamily:'monospace', fontSize:'0.9rem', color:'#dc2626', fontWeight:600 }}>⛔ {mssv}</div>
                      <button onClick={() => unblockMssv(mssv)} style={{ padding:'0.3rem 0.9rem', borderRadius:'6px', border:'1px solid rgba(22,163,74,0.25)', background:'rgba(22,163,74,0.08)', color:'#16a34a', cursor:'pointer', fontSize:'0.78rem', fontWeight:600 }}>✓ Bỏ Chặn</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* MSSV Bị Mute */}
              <div>
                <h3 style={{ fontSize:'0.73rem', color:'#78726a', marginBottom:'1rem', letterSpacing:'0.1em', textTransform:'uppercase', fontWeight:700 }}>🔇 MSSV Bị Tắt Tiếng ({mutedMSSV.length})</h3>
                {mutedMSSV.length === 0 && <p style={{ color:'#a89e94', fontSize:'0.9rem' }}>Chưa có MSSV nào bị tắt tiếng.</p>}
                <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem', maxWidth:'480px' }}>
                  {mutedMSSV.map((mssv, i) => (
                    <div key={i} style={G({ padding:'0.8rem 1.2rem', display:'flex', justifyContent:'space-between', alignItems:'center' })}>
                      <div style={{ fontFamily:'monospace', fontSize:'0.9rem', color:'#b5860d', fontWeight:600 }}>🔇 {mssv}</div>
                      <button onClick={() => unmuteMssv(mssv)} style={{ padding:'0.3rem 0.9rem', borderRadius:'6px', border:'1px solid rgba(22,163,74,0.25)', background:'rgba(22,163,74,0.08)', color:'#16a34a', cursor:'pointer', fontSize:'0.78rem', fontWeight:600 }}>🔈 Bỏ Mute</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* IP Bị Chặn (IP blocking vẫn giữ lại) */}
              <div>
                <h3 style={{ fontSize:'0.73rem', color:'#78726a', marginBottom:'1rem', letterSpacing:'0.1em', textTransform:'uppercase', fontWeight:700 }}>🚫 IP Bị Chặn ({blockedIPs.length})</h3>
                {blockedIPs.length === 0 && <p style={{ color:'#a89e94', fontSize:'0.9rem' }}>Chưa có IP nào bị chặn.</p>}
                <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem', maxWidth:'480px' }}>
                  {blockedIPs.map((ip, i) => (
                    <div key={i} style={G({ padding:'0.8rem 1.2rem', display:'flex', justifyContent:'space-between', alignItems:'center' })}>
                      <div style={{ fontFamily:'monospace', fontSize:'0.9rem', color:'#dc2626' }}>🚫 {ip}</div>
                      <button onClick={() => unblockIp(ip)} style={{ padding:'0.3rem 0.9rem', borderRadius:'6px', border:'1px solid rgba(22,163,74,0.25)', background:'rgba(22,163,74,0.08)', color:'#16a34a', cursor:'pointer', fontSize:'0.78rem', fontWeight:600 }}>✓ Bỏ Chặn</button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* LOGS */}
          {tab==='logs' && (
            <div>
              <div style={{ display:'flex', gap:'0.4rem', marginBottom:'0.9rem', flexWrap:'wrap', alignItems:'center' }}>
                {['all','join','vote','comment','question','answer'].map(f => (
                  <button key={f} onClick={() => setLogFilter(f)}
                    style={{ padding:'0.3rem 0.85rem', borderRadius:'20px', border:'1px solid rgba(0,0,0,0.1)', background:logFilter===f?'rgba(181,134,13,0.1)':'rgba(255,255,255,0.7)', color:logFilter===f?'#b5860d':'#78726a', cursor:'pointer', fontSize:'0.78rem', fontFamily:'Inter,sans-serif', fontWeight:logFilter===f?700:400 }}>
                    {f==='all'?'Tất cả':`${LOG_ICONS[f]||''} ${f}`}
                  </button>
                ))}
                <span style={{ marginLeft:'auto', fontSize:'0.75rem', color:'#a89e94' }}>{filteredLogs.length} mục</span>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:'0.25rem', maxHeight:'calc(100vh - 200px)', overflowY:'auto' }}>
                {filteredLogs.map((l,i) => (
                  <div key={i} style={{ ...G({ padding:'0.45rem 0.9rem', display:'grid', gridTemplateColumns:'110px 60px 140px 1fr auto', gap:'0.7rem', alignItems:'center', fontSize:'0.76rem', borderRadius:'10px', background: i%2===0?'rgba(255,255,255,0.72)':'rgba(255,255,255,0.5)' }) }}>
                    <span style={{ color:'#a89e94', fontVariantNumeric:'tabular-nums' }}>{new Date(l.ts).toLocaleTimeString('vi-VN')}</span>
                    <span style={{ display:'inline-flex', alignItems:'center', gap:'3px' }}>{LOG_ICONS[l.type]||'·'} <span style={{ color:'#78726a' }}>{l.type}</span></span>
                    <span style={{ color:'#b5860d', fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{l.name||'—'}</span>
                    <span style={{ color:'#3a3530', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{l.option||l.text||l.answer||l.mssv||''}</span>
                    {l.ip && <button onClick={()=>blockIp(l.ip)} style={{ padding:'0.15rem 0.4rem', borderRadius:'4px', border:'1px solid rgba(220,38,38,0.2)', background:'transparent', color:'#dc2626', cursor:'pointer', fontSize:'0.68rem', whiteSpace:'nowrap' }}>Chặn</button>}
                  </div>
                ))}
                {filteredLogs.length===0 && <p style={{ color:'#a89e94', fontSize:'0.9rem' }}>Chưa có log nào.</p>}
              </div>
            </div>
          )}

          {/* SECURITY */}
          {tab==='security' && (() => {
            const handleChangeAdminCode = () => {
              if (!oldAdminCode || !newAdminCode) return;
              socket.emit('change_admin_code', { oldCode: oldAdminCode, newCode: newAdminCode }, (res) => {
                if (res.ok) {
                  setAdminCodeState(newAdminCode);
                  setAdminCodeMsg({ ok: true, txt: '✅ Mã admin đã được đổi thành công!' });
                  setOldAdminCode(''); setNewAdminCode('');
                } else {
                  setAdminCodeMsg({ ok: false, txt: `❌ ${res.msg}` });
                }
                setTimeout(() => setAdminCodeMsg(null), 3000);
              });
            };
            const handleChangeSlidePass = () => {
              if (!adminCodeForSlide || !newSlidePass) return;
              socket.emit('change_slide_password', { currentAdminCode: adminCodeForSlide, newPassword: newSlidePass }, (res) => {
                if (res.ok) {
                  setSlidePassMsg({ ok: true, txt: `✅ Mật khẩu slide đã đổi thành: ${newSlidePass}` });
                  setNewSlidePass(''); setAdminCodeForSlide('');
                } else {
                  setSlidePassMsg({ ok: false, txt: `❌ ${res.msg}` });
                }
                setTimeout(() => setSlidePassMsg(null), 3500);
              });
            };
            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 560 }}>
                <div style={{ fontSize: '0.78rem', color: '#78726a', background: 'rgba(181,134,13,0.07)', border: '1px solid rgba(181,134,13,0.18)', borderRadius: 12, padding: '0.8rem 1rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <span>⚠️</span>
                  <span>Sau khi đổi mã admin, bạn sẽ cần dùng mã mới để đăng nhập lại. Hãy ghi nhớ mã trước khi lưu.</span>
                </div>

                {/* Current passwords display */}
                <div style={G({ padding: '1.2rem', display: 'flex', gap: '1.5rem' })}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ fontSize: '0.68rem', color: '#a89e94', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>🔐 Mã Admin Hiện Tại</div>
                    <div style={{ fontSize: '1.5rem', fontFamily: 'monospace', color: '#b5860d', fontWeight: 800, letterSpacing: '0.15em' }}>{adminCodeState}</div>
                  </div>
                  <div style={{ width: 1, background: 'rgba(0,0,0,0.06)' }} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ fontSize: '0.68rem', color: '#a89e94', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>🔑 Mật Khẩu Slide Hiện Tại</div>
                    <div style={{ fontSize: '1.5rem', fontFamily: 'monospace', color: '#2563eb', fontWeight: 800, letterSpacing: '0.15em' }}>{slidePassState}</div>
                  </div>
                </div>

                {/* Change Admin Code */}
                <div style={G({ padding: '1.4rem' })}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem' }}>
                    <span style={{ fontSize: '1.1rem' }}>🔐</span>
                    <span style={{ fontWeight: 700, color: '#1a1714', fontSize: '0.95rem' }}>Đổi Mã Admin</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: '#78726a', fontWeight: 600, display: 'block', marginBottom: 4 }}>Mã Admin Cũ</label>
                      <input type="password" value={oldAdminCode} onChange={e => setOldAdminCode(e.target.value)}
                        placeholder="Nhập mã cũ..."
                        style={{ width: '100%', padding: '0.75rem', borderRadius: 10, border: '1.5px solid rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.9)', color: '#1a1714', fontSize: '1rem', fontFamily: 'monospace', letterSpacing: '0.1em', boxSizing: 'border-box', outline: 'none' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: '#78726a', fontWeight: 600, display: 'block', marginBottom: 4 }}>Mã Admin Mới (4–20 ký tự)</label>
                      <input type="text" value={newAdminCode} onChange={e => setNewAdminCode(e.target.value)}
                        placeholder="Nhập mã mới..."
                        style={{ width: '100%', padding: '0.75rem', borderRadius: 10, border: '1.5px solid rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.9)', color: '#1a1714', fontSize: '1rem', fontFamily: 'monospace', letterSpacing: '0.1em', boxSizing: 'border-box', outline: 'none' }} />
                    </div>
                    {adminCodeMsg && <div style={{ fontSize: '0.82rem', padding: '0.5rem 0.8rem', borderRadius: 8, background: adminCodeMsg.ok ? 'rgba(22,163,74,0.08)' : 'rgba(220,38,38,0.08)', color: adminCodeMsg.ok ? '#16a34a' : '#dc2626', border: `1px solid ${adminCodeMsg.ok ? 'rgba(22,163,74,0.2)' : 'rgba(220,38,38,0.2)'}` }}>{adminCodeMsg.txt}</div>}
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={handleChangeAdminCode}
                      disabled={!oldAdminCode || !newAdminCode || newAdminCode.length < 4}
                      style={{ padding: '0.75rem', borderRadius: 10, background: (!oldAdminCode || !newAdminCode || newAdminCode.length < 4) ? 'rgba(0,0,0,0.06)' : 'linear-gradient(135deg,#b5860d,#c9960f)', color: (!oldAdminCode || !newAdminCode || newAdminCode.length < 4) ? '#a89e94' : '#fff', border: 'none', fontWeight: 700, cursor: (!oldAdminCode || !newAdminCode || newAdminCode.length < 4) ? 'not-allowed' : 'pointer', fontSize: '0.88rem', transition: 'all 0.2s' }}>
                      Đổi Mã Admin
                    </motion.button>
                  </div>
                </div>

                {/* Change Slide Password */}
                <div style={G({ padding: '1.4rem' })}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem' }}>
                    <span style={{ fontSize: '1.1rem' }}>🔑</span>
                    <span style={{ fontWeight: 700, color: '#1a1714', fontSize: '0.95rem' }}>Đổi Mật Khẩu Slide</span>
                    <span style={{ fontSize: '0.72rem', color: '#a89e94', background: 'rgba(0,0,0,0.05)', padding: '2px 8px', borderRadius: 20 }}>Mã khán giả nhập khi tham gia</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: '#78726a', fontWeight: 600, display: 'block', marginBottom: 4 }}>Xác Nhận Bằng Mã Admin</label>
                      <input type="password" value={adminCodeForSlide} onChange={e => setAdminCodeForSlide(e.target.value)}
                        placeholder="Nhập mã admin để xác nhận..."
                        style={{ width: '100%', padding: '0.75rem', borderRadius: 10, border: '1.5px solid rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.9)', color: '#1a1714', fontSize: '1rem', fontFamily: 'monospace', letterSpacing: '0.1em', boxSizing: 'border-box', outline: 'none' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: '#78726a', fontWeight: 600, display: 'block', marginBottom: 4 }}>Mật Khẩu Slide Mới</label>
                      <input type="text" value={newSlidePass} onChange={e => setNewSlidePass(e.target.value)}
                        placeholder="Nhập mật khẩu mới (ví dụ: ABC123)..."
                        style={{ width: '100%', padding: '0.75rem', borderRadius: 10, border: '1.5px solid rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.9)', color: '#1a1714', fontSize: '1rem', fontFamily: 'monospace', letterSpacing: '0.08em', boxSizing: 'border-box', outline: 'none' }} />
                    </div>
                    {slidePassMsg && <div style={{ fontSize: '0.82rem', padding: '0.5rem 0.8rem', borderRadius: 8, background: slidePassMsg.ok ? 'rgba(37,99,235,0.07)' : 'rgba(220,38,38,0.08)', color: slidePassMsg.ok ? '#2563eb' : '#dc2626', border: `1px solid ${slidePassMsg.ok ? 'rgba(37,99,235,0.2)' : 'rgba(220,38,38,0.2)'}` }}>{slidePassMsg.txt}</div>}
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={handleChangeSlidePass}
                      disabled={!adminCodeForSlide || !newSlidePass}
                      style={{ padding: '0.75rem', borderRadius: 10, background: (!adminCodeForSlide || !newSlidePass) ? 'rgba(0,0,0,0.06)' : 'linear-gradient(135deg,#2563eb,#1d4ed8)', color: (!adminCodeForSlide || !newSlidePass) ? '#a89e94' : '#fff', border: 'none', fontWeight: 700, cursor: (!adminCodeForSlide || !newSlidePass) ? 'not-allowed' : 'pointer', fontSize: '0.88rem', transition: 'all 0.2s' }}>
                      Đổi Mật Khẩu Slide
                    </motion.button>
                  </div>
                </div>
              </div>
            );
          })()}

        </div>
      </div>
    </div>
  );
}

