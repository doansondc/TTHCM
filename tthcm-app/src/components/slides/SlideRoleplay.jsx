import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';

const ENV_URL = window.location.hostname === 'localhost' ? 'http://localhost:3001' : '';
const socket  = io(ENV_URL, { transports: ['websocket', 'polling'] });

const OPT_LABELS = ['A', 'B', 'C', 'D'];

/**
 * S5 — Roleplay v2:
 * Left panel: list of leaders (click to select)
 * Right panel: leader photo + random picker + question + 3 A/B/C options
 * Options have type: 'fact' (✅ THỰC TẾ) or 'hypo' (❌ GIẢ ĐỊNH)
 */
export default function SlideRoleplay({ data }) {
  const { subtitle, title, desc, cards } = data;

  const [activeIdx,     setActiveIdx]     = useState(null);
  const [selectedOpt,   setSelectedOpt]   = useState(null);
  const [revealed,      setRevealed]      = useState(false);
  const [users,         setUsers]         = useState([]);
  const [assignments,   setAssignments]   = useState({}); // { [cardIdx]: user }
  const [rolling,       setRolling]       = useState(false);
  const [mssvInput,     setMssvInput]     = useState('');
  const [mssvError,     setMssvError]     = useState('');
  const [showBoard,     setShowBoard]     = useState(false);
  const [questionShown, setQuestionShown] = useState(false);
  const [rpQuestions,   setRpQuestions]   = useState({}); // { [cardIdx]: [{id,text,askerName}] }

  /* fetch connected users for random picker */
  useEffect(() => {
    socket.emit('request_users');
    socket.on('update_users', u => setUsers(Array.isArray(u) ? u : []));
    socket.emit('request_roleplay_questions');
    socket.on('roleplay_questions_update', q => {
      // Keys come back as strings from JSON — normalize to Numbers
      const normalized = {};
      Object.entries(q || {}).forEach(([k, v]) => { normalized[Number(k)] = v; });
      setRpQuestions(normalized);
    });
    return () => { socket.off('update_users'); socket.off('roleplay_questions_update'); };
  }, []);

  const handleSelectCard = (idx) => {
    setActiveIdx(idx);
    setSelectedOpt(null);
    setRevealed(false);
    setQuestionShown(false); // hide question when switching leaders
    // Do NOT clear assignment — each card remembers its own user
    setMssvInput('');
    setMssvError('');
    const card = cards[idx];
    // Emit with visible:false — audience only knows a leader is active, NOT the question content
    socket.emit('start_roleplay_poll', {
      cardIdx: idx,
      leader: card.leaderName,
      flag: card.flag,
      question: card.question,
      options: card.options.map(o => ({ text: o.label })),
      accentColor: card.accentColor,
      visible: false, // hide debate question from audience until presenter reveals
    });
  };

  const rollRandom = () => {
    if (activeIdx === null || !users.length || rolling) return;
    setRolling(true);
    setMssvInput('');
    setMssvError('');
    let count = 0;
    const iv = setInterval(() => {
      const u = users[Math.floor(Math.random() * users.length)];
      setAssignments(prev => ({ ...prev, [activeIdx]: u }));
      if (++count >= 20) { clearInterval(iv); setRolling(false); }
    }, 70);
  };

  const handleMssvSubmit = (e) => {
    e.preventDefault();
    if (activeIdx === null) return;
    const raw = mssvInput.trim();
    if (!raw) return;
    if (raw.length < 6) { setMssvError('❌ MSSV phải từ 6 ký số'); return; }
    const padded = raw.padStart(9, '0');

    // 1. Check already-connected users first (fastest)
    const online = users.find(u => u.mssv === padded || u.mssv === raw);
    if (online) {
      setAssignments(prev => ({ ...prev, [activeIdx]: online }));
      setMssvError('');
      return;
    }

    // 2. Fall back to server student DB (works even when student is offline)
    setMssvError('⏳ Đang tra cứu...');
    socket.emit('check_mssv', padded, (res) => {
      if (res && res.name) {
        setAssignments(prev => ({ ...prev, [activeIdx]: { name: res.name, mssv: padded } }));
        setMssvError(res.found ? '' : '⚠️ Không có trong CSDL — hiển thị thủ công');
      } else {
        setAssignments(prev => ({ ...prev, [activeIdx]: { name: `MSSV: ${raw}`, mssv: raw } }));
        setMssvError('⚠️ Không tìm thấy trong CSDL');
      }
    });
  };

  const handleSelectOpt = (optIdx) => {
    if (revealed) return;
    setSelectedOpt(optIdx);
    setRevealed(true);
  };

  const activeCard = activeIdx !== null ? cards[activeIdx] : null;
  const pickedUser = activeIdx !== null ? (assignments[activeIdx] || null) : null;

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      width: '100%', height: '100%',
      padding: '1.0rem 1.8rem 1.1rem',
      gap: '0.42rem', boxSizing: 'border-box',
      background: 'transparent', position: 'relative', overflow: 'hidden',
    }}>
      {/* Subtle grid bg */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.025,
        backgroundImage: `linear-gradient(rgba(232,184,75,1) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(232,184,75,1) 1px, transparent 1px)`,
        backgroundSize: '50px 50px',
      }} />

      {/* Header */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: '0.18rem', flexShrink: 0,
      }}>
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 13px', borderRadius: 100,
            background: 'rgba(232,184,75,0.10)', border: '1px solid rgba(232,184,75,0.25)',
            color: 'var(--gold)', fontSize: '0.70rem', fontWeight: 700,
            letterSpacing: '0.11em', textTransform: 'uppercase',
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)' }} />
          {subtitle}
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            fontFamily: 'var(--font-display)', fontSize: 'var(--fs-2xl)', fontWeight: 700,
            color: 'var(--text-primary)', textAlign: 'center', lineHeight: 1.12,
            letterSpacing: '-0.02em', margin: 0,
          }}
        >
          {title}
        </motion.h2>

        {/* Board toggle button */}
        <motion.button
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          onClick={() => setShowBoard(b => !b)}
          style={{
            marginTop: '0.3rem',
            padding: '0.32rem 1rem', borderRadius: 100,
            background: showBoard ? 'rgba(232,184,75,0.18)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${showBoard ? 'rgba(232,184,75,0.5)' : 'rgba(255,255,255,0.12)'}`,
            color: showBoard ? '#e8b84b' : 'var(--text-quaternary)',
            fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer',
            fontFamily: 'var(--font-sans)', letterSpacing: '0.06em',
            display: 'flex', alignItems: 'center', gap: 6,
            transition: 'all 0.2s',
          }}
        >
          <span style={{ fontSize: '0.85rem' }}>{showBoard ? '✕' : '📊'}</span>
          {showBoard ? 'THẾ BẢNG' : 'BẢNG HỘI ĐỒNG'}
        </motion.button>
      </div>

      {/* Main body */}
      <div style={{ display: 'flex', gap: '0.9rem', flex: 1, overflow: 'hidden' }}>

        {/* ─── Left: leader list ─── */}
        <div style={{
          width: 190, flexShrink: 0,
          display: 'flex', flexDirection: 'column', gap: '0.38rem',
          overflowY: 'auto',
        }}>
          <div style={{
            fontSize: '0.58rem', fontWeight: 700, color: 'var(--text-quaternary)',
            letterSpacing: '0.1em', textTransform: 'uppercase',
            marginBottom: '0.15rem', paddingLeft: '0.25rem',
          }}>
            Chọn lãnh đạo
          </div>

          {cards.map((card, idx) => {
            const isActive = activeIdx === idx;
            return (
              <motion.button
                key={idx}
                onClick={() => handleSelectCard(idx)}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.55rem',
                  padding: '0.52rem 0.72rem', borderRadius: 10,
                  background: isActive ? `${card.accentColor}18` : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${isActive ? card.accentColor + '50' : 'rgba(255,255,255,0.07)'}`,
                  cursor: 'pointer', textAlign: 'left',
                  boxShadow: isActive ? `0 0 20px ${card.accentColor}18` : 'none',
                  transition: 'all 0.2s',
                }}
              >
                {/* Thumbnail */}
                <div style={{
                  width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                  overflow: 'hidden',
                  background: `linear-gradient(135deg, ${card.accentColor}20, ${card.accentColor}40)`,
                  border: `1.5px solid ${isActive ? card.accentColor : 'rgba(255,255,255,0.10)'}`,
                }}>
                  <img
                    src={card.leaderImage} alt=""
                    onError={e => { e.currentTarget.style.display = 'none'; }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '0.78rem', fontWeight: 700,
                    color: isActive ? card.accentColor : 'var(--text-secondary)',
                    lineHeight: 1.2,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {card.country} {card.flag}
                  </div>
                  <div style={{
                    fontSize: '0.63rem', color: 'var(--text-quaternary)',
                    marginTop: 2, lineHeight: 1.25,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {card.leaderName}
                  </div>
                  {assignments[idx] && (
                    <div style={{
                      marginTop: 4,
                      padding: '0.18rem 0.45rem',
                      borderRadius: 5,
                      background: `${card.accentColor}18`,
                      border: `1px solid ${card.accentColor}35`,
                      display: 'flex', flexDirection: 'column', gap: 1,
                    }}>
                      <div style={{
                        fontSize: '0.68rem', fontWeight: 700,
                        color: card.accentColor,
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>
                        👤 {assignments[idx].name}
                      </div>
                      {assignments[idx].mssv && (
                        <div style={{
                          fontSize: '0.56rem', color: 'var(--text-quaternary)',
                          fontFamily: 'var(--font-mono)', letterSpacing: '0.04em',
                        }}>
                          {assignments[idx].mssv}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {isActive && (
                  <span style={{ color: card.accentColor, fontSize: '0.68rem', flexShrink: 0 }}>▶</span>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* ─── Right: detail panel ─── */}
        <div style={{ flex: 1, overflow: 'hidden', minWidth: 0 }}>
          <AnimatePresence mode="wait">
            {!activeCard ? (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} exit={{ opacity: 0 }}
                style={{
                  height: '100%', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  gap: '0.65rem', color: 'var(--text-quaternary)', fontSize: '0.9rem',
                }}
              >
                <span style={{ fontSize: '2.8rem' }}>👆</span>
                <span style={{ textAlign: 'center' }}>
                  {desc || 'Chọn một lãnh đạo để bắt đầu nhập vai'}
                </span>
              </motion.div>
            ) : (
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0, x: 22 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -22 }}
                transition={{ duration: 0.22 }}
                style={{ height: '100%', display: 'flex', gap: '0.85rem', overflow: 'hidden' }}
              >
                {/* Leader photo + random picker */}
                <div style={{
                  width: 210, flexShrink: 0,
                  display: 'flex', flexDirection: 'column', gap: '0.55rem',
                }}>
                  {/* Photo */}
                  <div style={{
                    flex: 1, borderRadius: 12, overflow: 'hidden', position: 'relative',
                    background: `linear-gradient(135deg, ${activeCard.accentColor}20, ${activeCard.accentColor}40)`,
                    minHeight: 0,
                  }}>
                    <img
                      src={activeCard.leaderImage} alt=""
                      onError={e => { e.currentTarget.style.display = 'none'; }}
                      style={{
                        width: '100%', height: '100%',
                        objectFit: 'cover', objectPosition: 'center 20%',
                      }}
                    />
                    {/* Gradient overlay */}
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: `linear-gradient(0deg, rgba(8,12,18,0.95) 0%, rgba(8,12,18,0.05) 50%)`,
                      pointerEvents: 'none',
                    }} />
                    {/* Flag */}
                    <div style={{
                      position: 'absolute', top: 8, right: 8,
                      fontSize: '1.6rem',
                      filter: `drop-shadow(0 0 10px ${activeCard.accentColor}80)`,
                    }}>
                      {activeCard.flag}
                    </div>
                    {/* Name */}
                    <div style={{
                      position: 'absolute', bottom: 10, left: 0, right: 0,
                      padding: '0 10px', textAlign: 'center',
                    }}>
                      <div style={{
                        fontSize: '0.90rem', fontWeight: 800, color: '#fff',
                        lineHeight: 1.2, textShadow: '0 2px 8px rgba(0,0,0,0.9)',
                      }}>
                        {activeCard.leaderName}
                      </div>
                      <div style={{
                        fontSize: '0.62rem', color: activeCard.accentColor,
                        marginTop: 3, fontWeight: 600,
                      }}>
                        {activeCard.leader}
                      </div>
                    </div>
                  </div>

                </div>

                {/* ─── Question + options ─── */}
                <div style={{
                  flex: 1, display: 'flex', flexDirection: 'column',
                  gap: '0.65rem', overflowY: 'auto', minWidth: 0,
                }}>

                  {/* ── PICKER — large, prominent, top of content column ── */}
                  <div style={{
                    flexShrink: 0,
                    borderRadius: 14,
                    background: `${activeCard.accentColor}08`,
                    border: `1.5px solid ${activeCard.accentColor}25`,
                    padding: '0.8rem 1rem',
                    display: 'flex', flexDirection: 'column', gap: '0.55rem',
                  }}>
                    {/* Header row */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{
                        fontSize: '0.65rem', fontWeight: 700,
                        color: activeCard.accentColor,
                        letterSpacing: '0.10em', textTransform: 'uppercase',
                      }}>🎲 Chọn người nhập vai</span>
                      {pickedUser && (
                        <button
                          onClick={rollRandom}
                          style={{
                            fontSize: '0.65rem', fontWeight: 600, cursor: 'pointer',
                            background: 'transparent',
                            border: `1px solid ${activeCard.accentColor}40`,
                            borderRadius: 6, padding: '0.15rem 0.5rem',
                            color: activeCard.accentColor, fontFamily: 'var(--font-sans)',
                          }}
                        >
                          {rolling ? '...' : '🔄 Bốc lại'}
                        </button>
                      )}
                    </div>

                    {/* Assigned user display */}
                    {pickedUser ? (
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                        padding: '0.6rem 0.85rem', borderRadius: 10,
                        background: `${activeCard.accentColor}15`,
                        border: `1px solid ${activeCard.accentColor}40`,
                      }}>
                        <div style={{
                          width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                          background: `${activeCard.accentColor}30`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '1.1rem',
                        }}>👤</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            fontSize: '1.05rem', fontWeight: 800,
                            color: activeCard.accentColor, lineHeight: 1.2,
                          }}>{pickedUser.name}</div>
                          {pickedUser.mssv && (
                            <div style={{
                              fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)',
                              fontFamily: 'var(--font-mono)', marginTop: 2,
                            }}>{pickedUser.mssv}</div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {/* Roll random */}
                        <button
                          onClick={rollRandom}
                          disabled={!users.length || rolling}
                          style={{
                            flex: 1, padding: '0.6rem', borderRadius: 9,
                            background: users.length ? `${activeCard.accentColor}18` : 'rgba(255,255,255,0.04)',
                            border: `1px solid ${users.length ? activeCard.accentColor + '45' : 'rgba(255,255,255,0.08)'}`,
                            color: users.length ? activeCard.accentColor : 'var(--text-quaternary)',
                            fontSize: '0.82rem', fontWeight: 700,
                            cursor: users.length ? 'pointer' : 'not-allowed',
                            fontFamily: 'var(--font-sans)', transition: 'all 0.2s',
                          }}
                        >
                          {rolling ? '🏒 Đang bốc...' : '🏒 Bốc ngẫu nhiên'}
                        </button>
                      </div>
                    )}

                    {/* MSSV input */}
                    <form onSubmit={handleMssvSubmit}
                      style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}
                    >
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-quaternary)', flexShrink: 0 }}>MSSV:</span>
                      <input
                        type="tel"
                        value={mssvInput}
                        onChange={e => { setMssvInput(e.target.value.replace(/\D/g, '').slice(0, 10)); setMssvError(''); }}
                        placeholder="Nhập MSSV..."
                        style={{
                          flex: 1, padding: '0.42rem 0.65rem',
                          borderRadius: 8, border: `1px solid ${mssvError.startsWith('❌') ? 'rgba(248,113,113,0.5)' : activeCard.accentColor + '30'}`,
                          background: 'rgba(255,255,255,0.06)',
                          color: '#fff', fontSize: '0.85rem', outline: 'none',
                          fontFamily: 'var(--font-mono)', letterSpacing: '0.06em',
                        }}
                      />
                      <button type="submit" style={{
                        padding: '0.42rem 0.9rem', borderRadius: 8, flexShrink: 0,
                        background: `${activeCard.accentColor}22`,
                        border: `1px solid ${activeCard.accentColor}50`,
                        color: activeCard.accentColor, fontSize: '0.82rem',
                        fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-sans)',
                      }}>Xác nhận</button>
                    </form>

                    {mssvError && (
                      <div style={{ fontSize: '0.65rem', color: mssvError.startsWith('❌') ? '#f87171' : '#facc15' }}>
                        {mssvError}
                      </div>
                    )}
                  </div>
                  {/* Reveal question — compact inline button */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                    <span style={{ fontSize: '0.60rem', color: 'var(--text-quaternary)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      📚 Câu hỏi nhập vai
                    </span>
                    <button
                      onClick={() => {
                        const next = !questionShown;
                        setQuestionShown(next);
                        // Sync visibility to audience /vote page
                        if (activeIdx !== null) {
                          const card = cards[activeIdx];
                          socket.emit('start_roleplay_poll', {
                            cardIdx: activeIdx,
                            leader: card.leaderName,
                            flag: card.flag,
                            question: card.question,
                            options: card.options.map(o => ({ text: o.label })),
                            accentColor: card.accentColor,
                            visible: next,
                          });
                        }
                      }}
                      style={{
                        padding: '0.22rem 0.7rem', borderRadius: 6,
                        background: questionShown ? `${activeCard.accentColor}20` : 'rgba(255,255,255,0.06)',
                        border: `1px solid ${questionShown ? activeCard.accentColor + '50' : 'rgba(255,255,255,0.10)'}`,
                        color: questionShown ? activeCard.accentColor : 'var(--text-quaternary)',
                        fontSize: '0.65rem', fontWeight: 700, cursor: 'pointer',
                        fontFamily: 'var(--font-sans)', transition: 'all 0.18s',
                      }}
                    >
                      {questionShown ? '🔓 Ẩn' : '🔒 Hiện'}
                    </button>
                  </div>
                  {questionShown && (
                    <AnimatePresence mode="wait">
                      <motion.div
                        key="question-block"
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        style={{ display: 'flex', flexDirection: 'column', gap: '0.52rem' }}
                      >
                  {/* Question box */}
                  <div style={{
                    background: `${activeCard.accentColor}10`,
                    border: `1px solid ${activeCard.accentColor}30`,
                    borderRadius: 10, padding: '0.78rem 1rem', flexShrink: 0,
                  }}>
                    <div style={{
                      fontSize: '0.60rem', fontWeight: 700,
                      color: activeCard.accentColor,
                      letterSpacing: '0.11em', textTransform: 'uppercase',
                      marginBottom: '0.4rem', fontFamily: 'var(--font-mono)',
                    }}>
                      {activeCard.leader} — Câu hỏi:
                    </div>
                    <p style={{
                      fontSize: '1.0rem', color: 'var(--text-primary)',
                      lineHeight: 1.6, fontWeight: 600, margin: 0, fontStyle: 'italic',
                    }}>
                      "{activeCard.question}"
                    </p>
                  </div>

                  {/* Context note */}
                  {activeCard.context && (
                    <div style={{
                      fontSize: '0.74rem', color: 'var(--text-quaternary)',
                      lineHeight: 1.5, fontStyle: 'italic',
                      padding: '0.35rem 0.7rem',
                      borderLeft: `2px solid ${activeCard.accentColor}40`,
                      background: `${activeCard.accentColor}06`,
                      borderRadius: '0 6px 6px 0',
                      flexShrink: 0,
                    }}>
                      📌 {activeCard.context}
                    </div>
                  )}

                  {/* Options */}
                  <div style={{
                    display: 'flex', flexDirection: 'column', gap: '0.42rem',
                  }}>
                    {activeCard.options.map((opt, optIdx) => {
                      const isSelected = selectedOpt === optIdx;
                      const isFact = opt.type === 'fact';

                      return (
                        <motion.button
                          key={optIdx}
                          onClick={() => handleSelectOpt(optIdx)}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: optIdx * 0.06 }}
                          style={{
                            display: 'flex', gap: '0.62rem', alignItems: 'flex-start',
                            width: '100%', padding: '0.62rem 0.85rem', borderRadius: 9,
                            background: isSelected
                              ? (isFact ? 'rgba(61,214,140,0.12)' : 'rgba(248,113,113,0.10)')
                              : 'rgba(255,255,255,0.035)',
                            border: `1px solid ${isSelected
                              ? (isFact ? 'rgba(61,214,140,0.45)' : 'rgba(248,113,113,0.40)')
                              : 'rgba(255,255,255,0.08)'}`,
                            cursor: revealed ? 'default' : 'pointer',
                            textAlign: 'left', fontFamily: 'var(--font-sans)',
                            transition: 'all 0.18s',
                          }}
                        >
                          {/* A/B/C badge */}
                          <span style={{
                            width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: isSelected
                              ? (isFact ? 'rgba(61,214,140,0.25)' : 'rgba(248,113,113,0.22)')
                              : `${activeCard.accentColor}18`,
                            fontSize: '0.75rem', fontWeight: 800,
                            color: isSelected
                              ? (isFact ? '#3dd68c' : '#f87171')
                              : activeCard.accentColor,
                            border: `1px solid ${isSelected
                              ? (isFact ? '#3dd68c40' : '#f8717140')
                              : activeCard.accentColor + '30'}`,
                          }}>
                            {OPT_LABELS[optIdx]}
                          </span>

                          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                            {/* Label + tag */}
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, flexWrap: 'wrap' }}>
                              <span style={{
                                fontSize: '0.90rem', lineHeight: 1.55, fontWeight: 500,
                                color: isSelected
                                  ? (isFact ? '#3dd68c' : '#f87171')
                                  : 'var(--text-secondary)',
                                flex: 1,
                              }}>
                                {opt.label}
                              </span>
                            </div>

                            {/* Hệ quả — revealed on selection */}
                            {isSelected && revealed && opt.result && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                style={{
                                  fontSize: '0.82rem', color: 'var(--text-secondary)',
                                  lineHeight: 1.55, marginTop: 3,
                                  padding: '0.42rem 0.65rem',
                                  background: isFact
                                    ? 'rgba(61,214,140,0.07)'
                                    : 'rgba(248,113,113,0.07)',
                                  borderRadius: 7,
                                  borderLeft: `3px solid ${isFact ? '#3dd68c' : '#f87171'}`,
                                }}
                              >
                                {opt.result}
                              </motion.div>
                            )}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Reset */}
                  {revealed && (
                    <motion.button
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      onClick={() => { setSelectedOpt(null); setRevealed(false); }}
                      style={{
                        padding: '0.38rem 0.9rem', borderRadius: 7,
                        alignSelf: 'flex-start',
                        background: 'transparent',
                        border: '1px solid rgba(255,255,255,0.12)',
                        color: 'var(--text-quaternary)', cursor: 'pointer',
                        fontSize: '0.72rem', fontFamily: 'var(--font-sans)', fontWeight: 600,
                        marginTop: 2,
                      }}
                    >
                      ← Chọn lại
                    </motion.button>
                  )}
                      </motion.div>
                    </AnimatePresence>
                  )}

                  {/* Audience questions — inline, no notification box */}
                  <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {/* Section label + clear button */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 2 }}>
                      <span style={{ fontSize: '0.56rem', color: 'var(--text-quaternary)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                        🎤 Câu hỏi khán giả {(rpQuestions[activeIdx] || []).length > 0 && `(${(rpQuestions[activeIdx] || []).length})`}
                      </span>
                      {(rpQuestions[activeIdx] || []).length > 0 && (
                        <button
                          onClick={() => socket.emit('roleplay_questions_clear', { cardIdx: activeIdx })}
                          style={{ background: 'transparent', border: 'none', color: 'var(--text-quaternary)', fontSize: '0.55rem', cursor: 'pointer', fontFamily: 'var(--font-sans)', padding: 0 }}
                        >Xoá tất cả</button>
                      )}
                    </div>

                    {(rpQuestions[activeIdx] || []).length === 0 ? (
                      <div style={{ fontSize: '0.64rem', color: 'var(--text-quaternary)', fontStyle: 'italic', opacity: 0.6, padding: '0.3rem 0' }}>
                        Chưa có câu hỏi từ khán giả
                      </div>
                    ) : (
                      [...(rpQuestions[activeIdx] || [])].reverse().map((q, qi) => (
                        <motion.div
                          key={q.id || qi}
                          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                          style={{
                            padding: '0.5rem 0.65rem',
                            borderRadius: 8,
                            background: `${activeCard.accentColor}08`,
                            border: `1px solid ${activeCard.accentColor}25`,
                          }}
                        >
                          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                            {q.text}
                          </div>
                          <div style={{ fontSize: '0.56rem', color: 'var(--text-quaternary)', fontFamily: 'var(--font-mono)', marginTop: 3 }}>
                            — {q.askerName}{q.mssv ? ` (${q.mssv})` : ''}
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ─── BOARD OVERLAY ─── */}
      <AnimatePresence>
        {showBoard && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 12 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            style={{
              position: 'absolute', inset: 0, zIndex: 50,
              background: 'rgba(5,8,14,0.97)',
              backdropFilter: 'blur(20px)',
              display: 'flex', flexDirection: 'column',
              padding: '1rem 1.5rem 1.2rem', gap: '0.8rem',
              borderRadius: 'inherit',
            }}
          >
            {/* Board header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                🏛️ BẢNG HỘI ĐỒNG — TấT CẢ LÃNH ĐạO
              </div>
              <button
                onClick={() => setShowBoard(false)}
                style={{
                  padding: '0.25rem 0.7rem', borderRadius: 6,
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  color: 'var(--text-quaternary)', cursor: 'pointer', fontSize: '0.72rem',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                ✕ Đóng
              </button>
            </div>

            {/* Cards grid */}
            <div style={{
              flex: 1, display: 'flex', gap: '0.7rem', overflow: 'hidden',
            }}>
              {cards.map((card, idx) => {
                const person = assignments[idx] || null;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.06 }}
                    style={{
                      flex: 1, borderRadius: 14, overflow: 'hidden',
                      position: 'relative', minWidth: 0,
                      border: `1.5px solid ${person ? card.accentColor + '50' : 'rgba(255,255,255,0.06)'}`,
                      boxShadow: person ? `0 0 24px ${card.accentColor}18` : 'none',
                      background: `linear-gradient(180deg, ${card.accentColor}10 0%, rgba(5,8,14,0.95) 100%)`,
                      cursor: 'pointer',
                      display: 'flex', flexDirection: 'column',
                    }}
                    onClick={() => { setActiveIdx(idx); setQuestionShown(false); setSelectedOpt(null); setRevealed(false); setShowBoard(false); }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {/* Leader photo — compact */}
                    <div style={{ width: '100%', aspectRatio: '3/4', overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
                      <img
                        src={card.leaderImage} alt={card.leaderName}
                        onError={e => { e.currentTarget.style.display = 'none'; }}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 15%' }}
                      />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(5,8,14,0.98) 0%, rgba(5,8,14,0.05) 50%)' }} />
                      <div style={{ position: 'absolute', top: 8, right: 8, fontSize: '1.4rem' }}>{card.flag}</div>
                      {(rpQuestions[idx] || []).length > 0 && (
                        <div style={{ position: 'absolute', top: 8, left: 8, padding: '0.2rem 0.45rem', borderRadius: 20, background: 'rgba(250,204,21,0.2)', border: '1px solid rgba(250,204,21,0.5)', fontSize: '0.58rem', color: '#facc15', fontWeight: 700, backdropFilter: 'blur(8px)' }}>
                          🎤 {(rpQuestions[idx] || []).length}
                        </div>
                      )}
                    </div>

                    {/* Name + person */}
                    <div style={{ padding: '0.45rem 0.6rem 0.35rem', flexShrink: 0 }}>
                      <div style={{ fontSize: '0.58rem', color: card.accentColor, fontWeight: 700, letterSpacing: '0.05em', marginBottom: 1 }}>{card.country}</div>
                      <div style={{ fontSize: '0.78rem', color: '#fff', fontWeight: 800, lineHeight: 1.2, marginBottom: 4 }}>{card.leaderName}</div>
                      {person ? (
                        <div style={{ padding: '0.2rem 0.45rem', borderRadius: 5, background: `${card.accentColor}20`, border: `1px solid ${card.accentColor}40` }}>
                          <div style={{ fontSize: '0.64rem', fontWeight: 700, color: card.accentColor }}>👤 {person.name}</div>
                          {person.mssv && <div style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)', marginTop: 1 }}>{person.mssv}</div>}
                        </div>
                      ) : (
                        <div style={{ padding: '0.2rem 0.45rem', borderRadius: 5, border: '1px dashed rgba(255,255,255,0.12)', fontSize: '0.6rem', color: 'rgba(255,255,255,0.25)', fontStyle: 'italic' }}>
                          Chưa chọn người
                        </div>
                      )}
                    </div>

                    {/* Live Q&A feed */}
                    <div style={{ flex: 1, minHeight: 0, padding: '0.1rem 0.5rem 0.5rem', display: 'flex', flexDirection: 'column', gap: 3, overflowY: 'auto' }}>
                      {(rpQuestions[idx] || []).length === 0 ? (
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.55rem', color: 'rgba(255,255,255,0.15)', fontStyle: 'italic', textAlign: 'center' }}>
                          Chưa có câu hỏi
                        </div>
                      ) : (
                        [...(rpQuestions[idx] || [])].reverse().map((q, qi) => (
                          <motion.div key={q.id || qi} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                            style={{ padding: '0.3rem 0.45rem', borderRadius: 6, background: 'rgba(255,255,255,0.04)', border: `1px solid ${card.accentColor}20` }}>
                            <div style={{ fontSize: '0.52rem', color: card.accentColor, fontWeight: 700, marginBottom: 2 }}>🎤 {q.askerName || 'Khán giả'}</div>
                            <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.82)', lineHeight: 1.4 }}>{q.text}</div>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
