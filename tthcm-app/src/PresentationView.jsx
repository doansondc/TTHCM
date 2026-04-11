import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { slideData } from './slides';
import { io } from 'socket.io-client';
import { QRCodeSVG } from 'qrcode.react';

import SlideTitle    from './components/slides/SlideTitle';
import SlideFlipCards from './components/slides/SlideFlipCards';
import SlideRoleplay  from './components/slides/SlideRoleplay';
import SlideGeoLayout from './components/slides/SlideGeoLayout';
import SlideOutro     from './components/slides/SlideOutro';
import SlideBamboo    from './components/slides/SlideBamboo';
import SlideLessons   from './components/slides/SlideLessons';
import VotingBoard    from './components/VotingBoard';
import DynamicEnding  from './components/DynamicEnding';
import LuckyWheel     from './components/LuckyWheel';
import QABoard        from './components/QABoard';
import FlyingReactions from './components/FlyingReactions';
import LiveToast       from './components/LiveToast';
import SplashScreen    from './components/SplashScreen';
import './index.css';

const ENV_URL = window.location.hostname === 'localhost' ? 'http://localhost:3001' : '';
const socket  = io(ENV_URL, { transports: ['websocket', 'polling'] });

const WrapSlide = ({ children, data }) => (
  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', width:'100%', height:'100%', gap:'0.6rem', padding:'1.2rem 2rem', background:'transparent', boxSizing:'border-box' }}>
    <div className="label-tag">{data.subtitle}</div>
    <h2 style={{ fontFamily:'var(--font-display)', fontSize:'var(--fs-2xl)', color:'var(--text-primary)', textAlign:'center', lineHeight:1.15, margin:0, flexShrink:0 }}>{data.title}</h2>
    <div style={{ width:'100%', flex:1, display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>{children}</div>
  </div>
);

const COMPONENTS = {
  'title':            SlideTitle,
  'flip-cards':       SlideFlipCards,
  'roleplay':         SlideRoleplay,
  'geo-layout':       SlideGeoLayout,
  'bamboo-diplomacy': SlideBamboo,
  'lessons':          SlideLessons,
  'outro':            SlideOutro,
  'poll':             ({ data }) => <WrapSlide data={data}><VotingBoard /></WrapSlide>,
  'dynamic-ending':   ({ data }) => <WrapSlide data={data}><DynamicEnding /></WrapSlide>,
  'qa-board':         ({ data }) => <WrapSlide data={data}><QABoard /></WrapSlide>,
  'lucky-wheel':      ({ data }) => <WrapSlide data={data}><LuckyWheel /></WrapSlide>,
};

function Fallback({ data }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100%', flexDirection:'column', gap:'1rem' }}>
      <div className="label-tag">Placeholder</div>
      <h2 style={{ fontSize:'var(--fs-2xl)', color:'var(--text-main)' }}>{data?.title}</h2>
    </div>
  );
}

// ── QR Overlay ──────────────────────────────────────────
function QROverlay({ qrUrl, config }) {
  if (!config?.show) return null;

  let posStyle = {};
  if (config.position === 'right') posStyle = { bottom: 60, right: 30 };
  else if (config.position === 'left') posStyle = { bottom: 60, left: 30 };
  else if (config.position === 'center') posStyle = { top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bottom: 'auto', right: 'auto' };

  return (
    <AnimatePresence>
      <motion.div
        drag
        dragMomentum={false}
        initial={{ opacity:0, scale:0.88 }}
        animate={{ opacity:1, scale: (config.size || 100) / 100 }}
        exit={{ opacity:0, scale:0.92 }}
        transition={{ type:'spring', stiffness:320, damping:26 }}
        style={{
          position:'fixed', zIndex:2000,
          background:'rgba(13,17,23,0.96)',
          backdropFilter:'blur(32px) saturate(1.4)',
          border:'1px solid rgba(232,184,75,0.25)',
          borderRadius:20,
          padding:'18px',
          boxShadow:'0 8px 40px rgba(0,0,0,0.6), 0 0 30px rgba(232,184,75,0.10)',
          display:'flex', flexDirection:'column', alignItems:'center', gap:10,
          cursor:'grab',
          ...posStyle
        }}
      >
        <QRCodeSVG value={qrUrl} size={148} level="H" fgColor="#e8b84b" bgColor="transparent" pointerEvents="none" />
      </motion.div>
    </AnimatePresence>
  );
}

// ── Active Quiz Overlay ───────────────────────────────────────
function TimerDisplay({ startTime, duration }) {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const updateTimer = () => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const rem = duration - elapsed;
      setTimeLeft(rem > 0 ? rem : 0);
    };
    updateTimer();
    const intv = setInterval(updateTimer, 1000);
    return () => clearInterval(intv);
  }, [startTime, duration]);

  const pct = Math.max(0, (timeLeft / duration) * 100);
  const color = timeLeft <= Math.floor(duration / 3) ? '#ff5555' : '#3dd68c';

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'center' }}>
      <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 700, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
        ⏱️ Còn lại: <span style={{ color }}>{timeLeft}s</span>
      </div>
      <div style={{ width: '100%', height: '0.2rem', background: 'rgba(255,255,255,0.1)', borderRadius: '0.2rem', overflow: 'hidden' }}>
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: `${pct}%`, background: color }}
          transition={{ duration: 1, ease: 'linear' }}
          style={{ height: '100%', borderRadius: '0.2rem' }}
        />
      </div>
    </div>
  );
}

function QuizOverlay({ quiz }) {
  const [dismissed, setDismissed] = useState(false);
  const prevId = useRef(quiz?.id);

  useEffect(() => {
    if (quiz?.id !== prevId.current) {
      setDismissed(false);
      prevId.current = quiz?.id;
    }
  }, [quiz?.id]);

  if (!quiz || dismissed) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity:0, y:-32, scale:0.94, x:"-50%" }}
        animate={{ opacity:1, y:0, scale:1, x:"-50%" }}
        exit={{ opacity:0, y:-24, scale:0.96, x:"-50%" }}
        transition={{ type:'spring', stiffness:280, damping:26 }}
        style={{
          position:'absolute', top:'6%', left:'50%', zIndex:800,
          background:'rgba(13,17,23,0.92)',
          backdropFilter:'blur(40px)',
          border:'1.5px solid rgba(232,184,75,0.4)',
          borderRadius:'1.25rem',
          padding:'1.25rem 1.75rem',
          boxShadow:'0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(232,184,75,0.15)',
          maxWidth:'40rem', width:'90%',
          display:'flex', flexDirection:'column', gap:'1rem',
        }}
      >
        <button onClick={() => setDismissed(true)} style={{ position:'absolute', top:'1rem', right:'1rem', background:'transparent', border:'none', color:'var(--text-tertiary)', fontSize:'1.2rem', cursor:'pointer' }}>✕</button>
        <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', justifyContent:'center', padding:'0 2rem' }}>
          <span style={{ fontSize:'var(--fs-2xl)' }}>🎯</span>
          <h2 style={{ fontSize:'var(--fs-2xl)', color:'var(--text-primary)', fontFamily:'var(--font-display)', textAlign:'center', margin:0, lineHeight:1.3, fontWeight:700 }}>
            {quiz.question}
          </h2>
        </div>
        {/* Timer */}
        {quiz.startTime && quiz.duration && !quiz.isFinished && (
          <TimerDisplay startTime={quiz.startTime} duration={quiz.duration} />
        )}
        <div style={{ display:'flex', flexDirection:'column', gap:'0.6rem' }}>
          {quiz.options?.map(opt => {
            const count = quiz.counts?.[opt.id] || 0;
            const pct = quiz.totalVotes ? Math.round((count / quiz.totalVotes) * 100) : 0;
            const isCorrect = quiz.isFinished && quiz.correctOptionId === opt.id;
            const barColor = isCorrect ? '#3dd68c' : 'linear-gradient(90deg, #c9960f, #e8b84b)';
            const textColor = isCorrect ? '#3dd68c' : 'var(--gold)';
            return (
              <div key={opt.id} style={{ display:'flex', flexDirection:'column', gap:'0.25rem' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
                  <span style={{ color:isCorrect ? '#fff' : 'var(--text-secondary)', fontWeight:isCorrect ? 800 : 600, fontSize:'var(--fs-md)' }}>
                    {isCorrect && '✅ '} {opt.id}. {opt.text}
                  </span>
                  <span style={{ fontWeight:700, color:textColor, fontSize:'var(--fs-lg)', minWidth:'4rem', textAlign:'right' }}>{pct}% <span style={{ fontSize:'var(--fs-sm)', fontWeight:500, color:'var(--text-tertiary)' }}>({count})</span></span>
                </div>
                <div style={{ height:'0.35rem', background:'rgba(255,255,255,0.06)', borderRadius:'0.25rem', overflow:'hidden' }}>
                  <motion.div animate={{ width:`${pct}%` }} transition={{ duration:0.5, ease:[0.4,0,0.2,1] }}
                    style={{ height:'100%', background:barColor, borderRadius:'0.25rem' }} />
                </div>
              </div>
            );
          })}
          {quiz.type === 'open' && (
            <div style={{ color:'var(--text-secondary)', fontStyle:'italic', textAlign:'center', marginTop:'0.5rem' }}>
              📝 Câu hỏi trả lời tự do. Người thuyết trình sẽ công bố sau.
            </div>
          )}
        </div>
        <div style={{ textAlign:'center', fontSize:'var(--fs-sm)', color:'var(--text-tertiary)', marginTop:'0.25rem' }}>
          Tổng: <strong style={{ color:'var(--gold)', fontSize:'var(--fs-md)' }}>{quiz.totalVotes||0}</strong> lượt trả lời
        </div>

        {quiz.isFinished && quiz.explanation && (
          <motion.div initial={{ opacity:0, y:5 }} animate={{ opacity:1, y:0 }}
            style={{ marginTop:'0.5rem', padding:'1rem', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'0.75rem', fontSize:'var(--fs-md)', color:'var(--text-secondary)', lineHeight:1.5 }}>
            <span style={{ color:'var(--gold)', fontWeight:700 }}>💡 Giải thích:</span> {quiz.explanation}
          </motion.div>
        )}
        
        {quiz.isFinished && quiz.winners && quiz.winners.length > 0 && (
          <motion.div initial={{ opacity:0, scale:0.9, y:10 }} animate={{ opacity:1, scale:1, y:0 }} transition={{ delay:0.3 }}
            style={{ marginTop:'0.5rem', padding:'1.2rem', background:'linear-gradient(135deg, rgba(61,214,140,0.15), rgba(61,214,140,0.05))', border:'1.5px solid rgba(61,214,140,0.4)', borderRadius:'1rem', boxShadow:'0 8px 32px rgba(61,214,140,0.1)' }}>
            <div style={{ fontSize:'var(--fs-sm)', color:'#3dd68c', fontWeight:700, letterSpacing:'0.08em', marginBottom:'0.5rem', textTransform:'uppercase', textAlign:'center', display:'flex', gap:'0.4rem', justifyContent:'center', alignItems:'center' }}>
              <span>🏆 Phản hồi xuất sắc nhất</span>
            </div>
            {quiz.winners.slice(0,1).map(w => (
              <div key={w.rank} style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                <div style={{ fontSize:'1.6rem', fontWeight:800, color:'#fff', textAlign:'center' }}>{w.name}</div>
                <div style={{ display:'flex', justifyContent:'center', gap:'1rem', marginTop:'0.4rem', color:'rgba(255,255,255,0.8)', fontSize:'1rem', fontFamily:'var(--font-mono)' }}>
                  <span>{w.mssv || '—'}</span>
                  <span>⏱️ {(w.timeTaken/1000).toFixed(2)}s</span>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

// ── Global Random Picker Overlay ─────────────────────────
function GlobalPickerOverlay({ active, winner, pool }) {
  const [dismissed, setDismissed] = useState(false);
  const [phase, setPhase] = useState('scan');
  const [scanIdx, setScanIdx] = useState(0);

  useEffect(() => {
    if (!active) { 
      setDismissed(false); 
      return; 
    }
    setDismissed(false);
    
    if (pool?.length > 0) {
      setPhase('scan');
      const interval = setInterval(() => {
        setScanIdx(Math.floor(Math.random() * pool.length));
      }, 70);
      
      const timeout = setTimeout(() => {
        clearInterval(interval);
        setPhase('reveal');
      }, 3500);
      
      return () => { clearInterval(interval); clearTimeout(timeout); };
    } else {
      setPhase('reveal');
    }
  }, [active, winner, pool]);

  if (!active || dismissed) return null;

  const currentPerson = phase === 'scan' ? pool[scanIdx] : winner;
  if (!currentPerson) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity:0, y:-40, scale:0.8, rotateX: 20, x:"-50%" }}
        animate={{ opacity:1, y:0, scale:1, rotateX: 0, x:"-50%" }}
        exit={{ opacity:0, y:40, scale:0.8, rotateX: -20, x:"-50%" }}
        transition={{ type:'spring', stiffness:260, damping:24 }}
        style={{
          position:'absolute', top:'15%', left:'50%', zIndex:900,
          background:'rgba(13,17,23,0.95)',
          backdropFilter:'blur(40px)',
          border:'2px solid rgba(232,184,75,0.8)',
          borderRadius:'1.5rem',
          padding:'2.5rem 4rem',
          boxShadow:'0 30px 80px rgba(0,0,0,0.8), 0 0 80px rgba(232,184,75,0.3)',
          display:'flex', flexDirection:'column', alignItems:'center', gap:'1.2rem',
          minWidth:'32rem', width:'max-content', maxWidth:'90vw', textAlign:'center',
        }}
      >
        <button onClick={() => setDismissed(true)} style={{ position:'absolute', top:'1rem', right:'1rem', background:'transparent', border:'none', color:'rgba(255,255,255,0.4)', fontSize:'1.4rem', cursor:'pointer' }}>✕</button>
        <div style={{ fontSize:'2.5rem', filter:'drop-shadow(0 0 10px rgba(232,184,75,0.8))' }}>🎲</div>
        <div style={{ fontSize:'1.1rem', color:'var(--gold)', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase' }}>
          {phase === 'scan' ? 'Đang Bốc Thăm...' : 'Người Khách May Mắn'}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={phase === 'scan' ? scanIdx : 'winner'}
            initial={{ opacity: phase==='scan'?1:0, y: phase==='scan'?0:10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: phase==='scan' ? 0.05 : 0.4 }}
            style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'0.5rem', width:'100%' }}
          >
            <h2 style={{ fontSize: currentPerson?.name?.length > 14 ? `${Math.max(0.6, 50 / currentPerson.name.length)}rem` : '3.6rem', whiteSpace: 'nowrap', color:'var(--text-primary)', fontFamily:'var(--font-display)', margin:0, lineHeight:1.1, textShadow:'0 4px 20px rgba(232,184,75,0.4)', fontWeight:800 }}>
              {currentPerson.name}
            </h2>
            {currentPerson.mssv && (
              <div style={{ fontSize:'1.6rem', color:'var(--text-tertiary)', fontFamily:'var(--font-mono)', letterSpacing:'0.05em', background:'rgba(255,255,255,0.05)', padding:'0.4rem 1rem', borderRadius:'0.5rem', marginTop:'0.5rem' }}>
                {currentPerson.mssv}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Auto-hide Director Toolbar ──────────────────────────
function DirectorToolbar({ currentSlide, total, pollOn, togglePoll, slideData, goTo }) {
  const [visible, setVisible] = useState(false);
  const [zoom,    setZoom]    = useState(100);
  const hideTimer = useRef(null);

  const show = () => {
    setVisible(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setVisible(false), 3000);
  };

  useEffect(() => {
    window.addEventListener('mousemove', show);
    return () => { window.removeEventListener('mousemove', show); clearTimeout(hideTimer.current); };
  }, []);

  const applyZoom = (z) => {
    setZoom(z);
    document.documentElement.style.fontSize = `${z / 100 * 16}px`;
  };

  const chip = (active = false) => ({
    height: 28, padding: '0 10px', borderRadius: 7,
    border: `1px solid ${active ? 'var(--gold-border)' : 'rgba(0,0,0,0.12)'}`,
    background: active ? 'var(--gold-bg)' : 'transparent',
    color: active ? 'var(--gold)' : 'var(--text-secondary)',
    fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer',
    fontFamily: 'var(--font-sans)', whiteSpace: 'nowrap',
    display: 'inline-flex', alignItems: 'center', gap: 4,
    transition: 'all 0.14s ease',
  });

  const sep = { width: 1, height: 16, background: 'rgba(0,0,0,0.10)', flexShrink: 0, margin: '0 2px' };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div key="toolbar"
          initial={{ opacity:0, x:'-50%', y:6 }} 
          animate={{ opacity:1, x:'-50%', y:0 }} 
          exit={{ opacity:0, x:'-50%', y:6 }}
          transition={{ duration:0.16 }}
          onMouseMove={show}
          style={{
            position:'fixed', bottom:10, left:'50%', zIndex:600,
            display:'flex', alignItems:'center', gap:4,
            background:'rgba(255,255,255,0.96)',
            backdropFilter:'blur(32px) saturate(1.4)',
            border:'1px solid rgba(0,0,0,0.13)',
            borderRadius:14, padding:'5px 10px',
            boxShadow:'0 4px 20px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.06)',
          }}
        >
          {/* Nav Dots */}
          <div style={{ display:'flex', gap:5, alignItems:'center', marginRight:4 }}>
            {slideData.map((_, i) => (
              <button key={i} onClick={() => goTo(i)} style={{
                width: i === currentSlide ? 20 : 6, height: 6, borderRadius: 3,
                background: i === currentSlide ? 'var(--gold)' : 'rgba(0,0,0,0.18)',
                border: 'none', cursor: 'pointer', padding: 0,
                transition: 'all 0.24s cubic-bezier(0.4,0,0.2,1)', flexShrink: 0,
              }} />
            ))}
          </div>

          <span style={{ fontSize:'0.70rem', color:'var(--text-tertiary)', fontWeight:600, minWidth:38, textAlign:'center' }}>
            {currentSlide+1}/{total}
          </span>
          <div style={sep}/>
          <button style={chip(!pollOn)} onClick={togglePoll}>
            {pollOn ? '● Poll' : '○ Poll'}
          </button>
          <div style={sep}/>
          <button style={chip()} onClick={() => applyZoom(Math.max(70, zoom-5))}>−</button>
          <span style={{ fontSize:'0.70rem', color:'var(--text-secondary)', fontWeight:700, minWidth:32, textAlign:'center' }}>{zoom}%</span>
          <button style={chip()} onClick={() => applyZoom(Math.min(140, zoom+5))}>+</button>
          <div style={sep}/>
          <button style={chip()} onClick={() => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen().catch(()=>{})}>
            ⛶
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Design resolution (treat slides as 4:3 at this base size) ──
const DESIGN_W = 1200;
const DESIGN_H = 900;

// ── Hook: compute CSS scale to fit design resolution into frame ──
function useSlideScale(frameRef) {
  const [scale, setScale] = useState(1);

  const recalc = useCallback(() => {
    const el = frameRef.current;
    if (!el) return;
    const { width, height } = el.getBoundingClientRect();
    const scaleX = width  / DESIGN_W;
    const scaleY = height / DESIGN_H;
    setScale(Math.min(scaleX, scaleY));
  }, [frameRef]);

  useEffect(() => {
    recalc();
    const ro = new ResizeObserver(recalc);
    if (frameRef.current) ro.observe(frameRef.current);
    return () => ro.disconnect();
  }, [recalc]);

  return scale;
}

// ── Main View ────────────────────────────────────────────
export default function PresentationView() {
  const [started,      setStarted]      = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction,    setDirection]    = useState(1);
  const [pollOn,       setPollOn]       = useState(true);
  const [qrConfig,     setQrConfig]     = useState({ show: false, position: 'right', size: 100 });
  const [activeQuiz,   setActiveQuiz]   = useState(null);
  const [pickerWinner, setPickerWinner] = useState(null);
  const [pickerPool,   setPickerPool]   = useState([]);
  const [pickerActive, setPickerActive] = useState(false);
  const [pinnedItem, setPinnedItem] = useState(null);

  const frameRef = useRef(null);
  const scale    = useSlideScale(frameRef);

  const total  = slideData.length;
  const qrUrl  = `${window.location.protocol}//${window.location.host}/vote`;

  const goTo = (idx) => {
    if (idx < 0 || idx >= total) return;
    setDirection(idx > currentSlide ? 1 : -1);
    setCurrentSlide(idx);
    socket.emit('set_slide', idx);
  };

  const togglePoll = () => {
    const next = !pollOn; setPollOn(next);
    socket.emit('toggle_poll', next);
  };

  useEffect(() => {
    socket.emit('get_qr_config');
    socket.emit('get_pinned_item');
    socket.on('qr_config_update', setQrConfig);
    socket.on('poll_status', setPollOn);
    socket.on('quiz_state', setActiveQuiz);
    socket.on('global_picker_winner', (data) => {
      if (data && data.winner) {
        setPickerWinner(data.winner);
        setPickerPool(data.pool || []);
      } else {
        setPickerWinner(data);
        setPickerPool([]);
      }
      setPickerActive(true);
    });
    socket.on('global_picker_close', () => {
      setPickerActive(false);
      setTimeout(() => setPickerWinner(null), 500);
    });
    socket.on('pinned_item_update', setPinnedItem);
    return () => {
      socket.off('qr_config_update');
      socket.off('poll_status');
      socket.off('quiz_state');
      socket.off('global_picker_winner');
      socket.off('global_picker_close');
      socket.off('pinned_item_update');
    };
  }, []);

  useEffect(() => {
    if (!started) return;
    const fn = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') goTo(currentSlide + 1);
      if (e.key === 'ArrowLeft')  goTo(currentSlide - 1);
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [currentSlide, started]);

  useEffect(() => {
    if (!started) return;
    let cool = false;
    const fn = (e) => {
      if (cool || Math.abs(e.deltaY) < 40) return;
      if (e.deltaY > 0) goTo(currentSlide + 1); else goTo(currentSlide - 1);
      cool = true; setTimeout(() => cool = false, 900);
    };
    window.addEventListener('wheel', fn, { passive:true });
    return () => window.removeEventListener('wheel', fn);
  }, [currentSlide, started]);

  const slide    = slideData[currentSlide];
  const SlideComp = COMPONENTS[slide?.type] || Fallback;

  return (
    <>
      <SplashScreen onStart={() => setStarted(true)} />

      {/* Ambient Dark Theme Background */}
      <div style={{ position:'fixed', inset:0, zIndex:0, overflow:'hidden', background:'linear-gradient(160deg, #0b0f14 0%, #111824 100%)' }}>
        <AnimatePresence mode="wait">
          {slide?.bg && slide.bg !== 'none' && (
            <motion.div key={slide.bg}
              initial={{ opacity:0 }} animate={{ opacity:0.09 }} exit={{ opacity:0 }}
              transition={{ duration:1.8 }}
              style={{ position:'absolute', inset:0, backgroundImage:`url(${slide.bg})`, backgroundSize:'cover', backgroundPosition:'center' }}
            />
          )}
        </AnimatePresence>
        {/* Subtle radial glow from the golden palette */}
        <div style={{ position:'absolute', top:'-20%', left:'-10%', width:'70vw', height:'70vw', background:'radial-gradient(circle, rgba(232,184,75,0.035) 0%, transparent 60%)', filter:'blur(40px)', pointerEvents:'none' }} />
        {/* Subtle blue depth */}
        <div style={{ position:'absolute', bottom:'-30%', right:'-20%', width:'80vw', height:'80vw', background:'radial-gradient(circle, rgba(96,165,250,0.02) 0%, transparent 60%)', filter:'blur(40px)', pointerEvents:'none' }} />
      </div>

      <FlyingReactions />
      <LiveToast />

      {/* 4:3 frame */}
      <div className="slide-container" style={{ zIndex:1 }}>
        <div className="slide-frame" ref={frameRef}>
          {/* Scale wrapper: renders at DESIGN_W×DESIGN_H then scales to fit */}
          <div style={{
            position: 'absolute',
            width:  DESIGN_W,
            height: DESIGN_H,
            top:  '50%',
            left: '50%',
            transformOrigin: 'center center',
            transform: `translate(-50%, -50%) scale(${scale})`,
          }}>
            {/* Popups synchronized with Slide scale */}
            <GlobalPickerOverlay active={pickerActive} winner={pickerWinner} pool={pickerPool} />
            <QuizOverlay quiz={activeQuiz} />
            
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div key={currentSlide}
                custom={direction}
                initial={{ opacity:0, x: direction * 32, scale: 0.995 }}
                animate={{ opacity:1, x:0, scale:1 }}
                exit={{ opacity:0, x: direction * -32, scale: 0.995 }}
                transition={{ duration:0.30, ease:[0.4,0,0.2,1] }}
                style={{ position:'absolute', inset:0 }}
              >
                <SlideComp data={slide?.data} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <QROverlay qrUrl={qrUrl} config={qrConfig} />

      {/* Pinned Discussion Overlay */}
      <AnimatePresence>
        {pinnedItem && (
          <motion.div
            initial={{ opacity:0, y: 50, scale:0.95 }}
            animate={{ opacity:1, y:0, scale:1 }}
            exit={{ opacity:0, y:20, scale:0.95 }}
            transition={{ type:'spring', damping:25, stiffness:200 }}
            style={{
              position:'absolute', bottom:'5%', left:'50%', transform:'translateX(-50%)',
              zIndex:500, width:'85%', maxWidth:'52rem',
              background:'rgba(13,17,23,0.92)',
              backdropFilter:'blur(40px)', border:'1.5px solid rgba(232,184,75,0.4)',
              borderRadius:'24px', padding:'2.5rem 3rem',
              boxShadow:'0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(232,184,75,0.15)'
            }}
          >
            <div style={{ display:'flex', gap:'1rem', alignItems:'center', marginBottom:'1.2rem' }}>
              <span style={{ fontSize:'2.5rem', filter:'drop-shadow(0 4px 10px rgba(232,184,75,0.4))' }}>
                {pinnedItem.type === 'question' ? '❓' : '💬'}
              </span>
              <div style={{ display:'flex', flexDirection:'column' }}>
                <span style={{ fontSize:'1rem', color:'var(--gold)', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.1em' }}>
                  {pinnedItem.type === 'question' ? 'Câu Hỏi' : 'Bình Luận'} Tương Tác
                </span>
                <span style={{ fontSize:'1.4rem', color:'var(--text-primary)', fontWeight:800, fontFamily:'var(--font-display)' }}>
                  {pinnedItem.name} <span style={{ fontSize:'1rem', color:'var(--text-tertiary)', fontWeight:600 }}>({pinnedItem.mssv})</span>
                </span>
              </div>
            </div>
            
            <div style={{ fontSize:'1.75rem', color:'var(--text-secondary)', lineHeight:1.5, fontWeight:600, fontFamily:'var(--font-sans)' }}>
              "{pinnedItem.text}"
            </div>

            {pinnedItem.type === 'question' && pinnedItem.answer && (
              <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} style={{ marginTop:'1.5rem', background:'rgba(61,214,140,0.1)', border:'1px solid rgba(61,214,140,0.3)', padding:'1rem 1.5rem', borderRadius:'12px', color:'#3dd68c', fontSize:'1.2rem', lineHeight:1.5 }}>
                <strong style={{ color:'#fff', fontWeight:700 }}>👨‍💼 Phản hồi:</strong> {pinnedItem.answer}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auto-hide centered toolbar */}
      <DirectorToolbar currentSlide={currentSlide} total={total} pollOn={pollOn} togglePoll={togglePoll} slideData={slideData} goTo={goTo} />
    </>
  );
}
