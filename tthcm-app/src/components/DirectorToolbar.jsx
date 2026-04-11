import React, { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Maximize, Minimize, ZoomIn, ZoomOut, QrCode, Timer, Gift, MessageSquareOff, MessageSquare, HeartOff, Heart, Play, Square } from 'lucide-react';
import { io } from 'socket.io-client';

const ENV_URL = window.location.hostname === 'localhost' ? 'http://localhost:3001' : '';
const socket  = io(ENV_URL, { transports: ['websocket', 'polling'] });

export default function DirectorToolbar({ zoom, setZoom }) {
  const [showQR,       setShowQR]   = useState(false);
  const [qrSize,       setQrSize]   = useState(150);
  const [isFS,         setIsFS]     = useState(false);
  const [time,         setTime]     = useState(0);      // seconds remaining
  const [timerInput,   setTimerInp] = useState('10');   // preset minutes
  const [timerRunning, setRunning]  = useState(false);
  const [showTimerEd,  setTimerEd]  = useState(false);
  const [pollOn,       setPollOn]   = useState(true);
  const [showReactions,setShowR]    = useState(true);
  const [showComments, setShowC]    = useState(true);
  const [qrUrl,        setQrUrl]    = useState('');
  const intervalRef = useRef(null);

  useEffect(() => {
    setQrUrl(`${window.location.protocol}//${window.location.host}/vote`);
  }, []);

  // Timer tick
  useEffect(() => {
    if (timerRunning && time > 0) {
      intervalRef.current = setInterval(() => setTime(t => t - 1), 1000);
    } else {
      clearInterval(intervalRef.current);
      if (time === 0 && timerRunning) setRunning(false);
    }
    return () => clearInterval(intervalRef.current);
  }, [timerRunning, time]);

  const startTimer = () => {
    const mins = parseInt(timerInput) || 10;
    setTime(mins * 60);
    setRunning(true);
    setTimerEd(false);
  };

  const toggleFS = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFS(true));
    } else document.exitFullscreen().then(() => setIsFS(false));
  };

  const handleSpin = () => socket.emit('spin_wheel');

  const togglePoll = () => {
    const next = !pollOn;
    setPollOn(next);
    socket.emit('toggle_poll', next);
  };

  const formatTime = (s) => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;
  const timeColor = time > 60 ? 'rgba(255,255,255,0.85)' : time > 0 ? '#f87171' : 'rgba(255,255,255,0.3)';

  const btnBase = {
    background: 'transparent', border: 'none', cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: '4px',
    padding: '8px 10px', borderRadius: '8px', color: 'rgba(255,255,255,0.7)',
    fontSize: '0.75rem', transition: 'background 0.2s, color 0.2s',
    fontFamily: 'Inter, sans-serif',
  };
  const btnActive = { ...btnBase, color: '#f0c040', background: 'rgba(240,192,64,0.12)' };
  const sep = { width: '1px', height: '28px', background: 'rgba(255,255,255,0.12)', margin: '0 2px', flexShrink: 0 };

  return (
    <>
      {/* Toolbar */}
      <div style={{
        position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
        zIndex: 1000,
        display: 'flex', alignItems: 'center', gap: '2px',
        background: 'rgba(10,10,20,0.75)',
        backdropFilter: 'blur(30px)',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: '16px',
        padding: '6px 10px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      }}>
        {/* ZOOM */}
        <button style={btnBase} onClick={() => setZoom(z => Math.max(z - 0.1, 0.5))} title="Thu nhỏ">
          <ZoomOut size={18}/>
        </button>
        <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', minWidth: '28px', textAlign: 'center' }}>
          {Math.round(zoom * 100)}%
        </span>
        <button style={btnBase} onClick={() => setZoom(z => Math.min(z + 0.1, 1.5))} title="Phóng to">
          <ZoomIn size={18}/>
        </button>

        <div style={sep}/>

        {/* FULLSCREEN */}
        <button style={btnBase} onClick={toggleFS} title={isFS ? 'Thoát toàn màn hình' : 'Toàn màn hình'}>
          {isFS ? <Minimize size={18}/> : <Maximize size={18}/>}
        </button>

        <div style={sep}/>

        {/* TIMER */}
        <button style={timerRunning ? btnActive : btnBase} onClick={() => !timerRunning && setTimerEd(e => !e)} title="Đồng hồ">
          <Timer size={18}/>
          <span style={{ color: timeColor, fontWeight: 600, minWidth: '42px', fontSize: '0.8rem' }}>
            {time > 0 ? formatTime(time) : `${timerInput}:00`}
          </span>
        </button>
        {timerRunning ? (
          <button style={{ ...btnBase, color: '#f87171' }} onClick={() => { setRunning(false); setTime(0); }} title="Dừng">
            <Square size={16} fill="#f87171"/>
          </button>
        ) : (
          <button style={{ ...btnBase, color: '#34d97b' }} onClick={startTimer} title="Bắt đầu">
            <Play size={16} fill="#34d97b"/>
          </button>
        )}

        <div style={sep}/>

        {/* POLL */}
        <button style={pollOn ? btnActive : { ...btnBase, color: '#f87171' }} onClick={togglePoll} title={pollOn ? 'Dừng Poll' : 'Mở Poll'}>
          {pollOn ? <Play size={18}/> : <Square size={18}/>}
          <span>{pollOn ? 'Poll ON' : 'Poll OFF'}</span>
        </button>

        <div style={sep}/>

        {/* REACTIONS toggle */}
        <button style={showReactions ? btnActive : btnBase} onClick={() => setShowR(r => !r)} title="Bật/tắt Reactions">
          {showReactions ? <Heart size={18}/> : <HeartOff size={18}/>}
        </button>

        {/* COMMENTS toggle */}
        <button style={showComments ? btnActive : btnBase} onClick={() => setShowC(c => !c)} title="Bật/tắt Comments">
          {showComments ? <MessageSquare size={18}/> : <MessageSquareOff size={18}/>}
        </button>

        <div style={sep}/>

        {/* QR */}
        <button style={showQR ? btnActive : btnBase} onClick={() => setShowQR(q => !q)} title="Mã QR">
          <QrCode size={18}/>
        </button>

        {/* SPIN */}
        <button style={btnBase} onClick={handleSpin} title="Vòng quay">
          <Gift size={18}/>
        </button>
      </div>

      {/* Timer edit popup */}
      {showTimerEd && !timerRunning && (
        <div style={{
          position: 'fixed', bottom: '80px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 1001, background: 'rgba(10,10,20,0.9)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px',
          padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem',
        }}>
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>Phút:</span>
          <input type="number" min="1" max="60" value={timerInput}
            onChange={e => setTimerInp(e.target.value)}
            style={{ width: '60px', padding: '0.3rem 0.5rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: '1rem', textAlign: 'center', outline: 'none' }}
          />
          <button onClick={startTimer} style={{ background: 'linear-gradient(135deg,#f0c040,#d4880a)', border: 'none', borderRadius: '8px', padding: '0.4rem 1rem', color: '#0a0a14', fontWeight: 700, cursor: 'pointer' }}>OK</button>
        </div>
      )}

      {/* QR corner widget */}
      {showQR && (
        <div style={{
          position: 'fixed', bottom: '90px', right: '24px',
          zIndex: 1000,
          background: 'rgba(10,10,20,0.85)',
          backdropFilter: 'blur(30px)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '16px',
          padding: '1rem',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button onClick={() => setQrSize(s => Math.max(s-20,80))} style={{ ...btnBase, padding:'4px 8px', fontSize:'1rem' }}>−</button>
            <span style={{ color: 'var(--gold)', fontSize: '0.75rem', fontWeight: 600 }}>TƯƠNG TÁC</span>
            <button onClick={() => setQrSize(s => Math.min(s+20,250))} style={{ ...btnBase, padding:'4px 8px', fontSize:'1rem' }}>+</button>
          </div>
          <QRCodeSVG value={qrUrl} size={qrSize} level="H"
            bgColor="transparent" fgColor="#ffffff" />
          <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', textAlign: 'center' }}>Quét để tham gia</p>
        </div>
      )}
    </>
  );
}
