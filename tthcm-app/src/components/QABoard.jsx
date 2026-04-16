import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';

const ENV_URL = window.location.hostname === 'localhost' ? 'http://localhost:3001' : '';
const socket  = io(ENV_URL, { transports: ['websocket', 'polling'] });

export default function QABoard() {
  const [questions, setQuestions] = useState([]);
  const [selected,  setSelected]  = useState(null);
  const [answer,    setAnswer]    = useState('');

  useEffect(() => {
    socket.on('new_question', (q) => setQuestions(prev => [q, ...prev]));
    socket.on('question_answered', ({ id, answer: ans }) => {
      setQuestions(prev => prev.map(q => q.id === id ? { ...q, answer: ans } : q));
    });
    socket.on('update_questions', setQuestions);
    socket.emit('get_questions');

    return () => { socket.off('new_question'); socket.off('question_answered'); socket.off('update_questions'); };
  }, []);

  const submitAnswer = () => {
    if (!selected || !answer.trim()) return;
    socket.emit('answer_question', { id: selected.id, answer });
    setAnswer('');
    setSelected(null);
  };

  return (
    <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', gap: '1.2rem', height: 'clamp(18rem, 65vh, 30rem)' }}>

      {/* ── LEFT: Question list (smaller) ── */}
      <div style={{
        flex: 2, minWidth: 0,
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16,
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
      }}>
        {/* Header */}
        <div style={{
          padding: '0.75rem 1rem',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          fontSize: '0.70rem', color: 'var(--gold)', fontWeight: 700,
          letterSpacing: '0.12em', textTransform: 'uppercase',
          background: 'rgba(232,184,75,0.05)',
          display: 'flex', alignItems: 'center', gap: 8,
          fontFamily: 'var(--font-mono)',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)' }} />
          Câu Hỏi Từ Khán Giả ({questions.length})
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem' }}>
          {questions.length === 0 ? (
            <div style={{
              padding: '2rem', textAlign: 'center',
              color: 'var(--text-quaternary)', fontSize: '0.88rem', lineHeight: 1.6,
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.6rem' }}>📱</div>
              <div style={{ fontWeight: 700, color: 'var(--text-tertiary)', marginBottom: '0.3rem' }}>Chưa có câu hỏi nào</div>
              <div style={{ fontSize: '0.78rem' }}>Khán giả có thể gửi câu hỏi qua trang <strong style={{ color: 'var(--gold)' }}>/vote</strong> → Tab ❓ Câu hỏi</div>
            </div>
          ) : questions.map((q) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              onClick={() => setSelected(q)}
              style={{
                padding: '0.7rem 0.9rem', borderRadius: 10, cursor: 'pointer',
                background: selected?.id === q.id ? 'rgba(232,184,75,0.10)' : 'transparent',
                border: `1px solid ${selected?.id === q.id ? 'rgba(232,184,75,0.30)' : 'transparent'}`,
                marginBottom: '0.3rem', transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                <div style={{ minWidth: 0 }}>
                  <span style={{ fontSize: 'var(--fs-sm)', fontWeight: 700, color: 'var(--gold)' }}>{q.name}</span>
                  {q.mssv && <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-quaternary)', marginLeft: '0.4rem', fontFamily: 'var(--font-mono)' }}>· {q.mssv}</span>}
                  <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)', marginTop: '0.2rem', lineHeight: 1.5, wordBreak: 'break-word', margin: '0.2rem 0 0 0' }}>
                    {q.text}
                  </p>
                </div>
                {q.answer && (
                  <span style={{
                    fontSize: '0.60rem', color: 'var(--teal)', fontWeight: 700, flexShrink: 0,
                    padding: '2px 7px', background: 'rgba(0,212,170,0.10)',
                    border: '1px solid rgba(0,212,170,0.25)', borderRadius: 100,
                    fontFamily: 'var(--font-mono)',
                  }}>✓ TL</span>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if(window.confirm('Xóa câu hỏi này khỏi hệ thống (và loại khỏi bốc thăm)?')) socket.emit('delete_question', q.id);
                  }}
                  style={{
                    fontSize: '0.60rem', color: '#ff5555', fontWeight: 700, flexShrink: 0,
                    padding: '2px 7px', background: 'rgba(255,85,85,0.10)', border: '1px solid rgba(255,85,85,0.25)',
                    borderRadius: 100, cursor: 'pointer', fontFamily: 'var(--font-mono)', display: 'block', marginLeft: 'auto'
                  }}
                >✕ Xóa</button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── RIGHT: Answer panel (larger) ── */}
      <div style={{
        flex: 3, minWidth: 0,
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16,
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
      }}>
        {/* Header */}
        <div style={{
          padding: '0.75rem 1rem',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          fontSize: '0.70rem', color: 'var(--gold)', fontWeight: 700,
          letterSpacing: '0.12em', textTransform: 'uppercase',
          background: 'rgba(232,184,75,0.05)',
          fontFamily: 'var(--font-mono)',
        }}>
          Trả Lời →
        </div>

        <div style={{ flex: 1, padding: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
          {!selected ? (
            <div style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-quaternary)', fontSize: '0.84rem', textAlign: 'center',
              flexDirection: 'column', gap: '0.5rem',
            }}>
              <div style={{ fontSize: '1.5rem' }}>👈</div>
              Chọn câu hỏi để trả lời
            </div>
          ) : (
            <>
              <div style={{
                background: 'rgba(232,184,75,0.08)',
                border: '1px solid rgba(232,184,75,0.20)',
                borderRadius: 10, padding: '0.65rem 0.8rem',
                fontSize: '0.80rem', color: 'var(--text-secondary)', lineHeight: 1.5,
              }}>
                <span style={{ color: 'var(--gold)', fontWeight: 700 }}>{selected.name}: </span>
                {selected.text}
              </div>

              {selected.answer && (
                <div style={{
                  background: 'rgba(61,214,140,0.08)',
                  border: '1px solid rgba(61,214,140,0.25)',
                  borderRadius: 10, padding: '0.65rem 0.8rem',
                  fontSize: 'var(--fs-sm)', color: 'var(--teal)', lineHeight: 1.5,
                }}>
                  Đã trả lời: {selected.answer}
                </div>
              )}

              <textarea
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                placeholder="Nhập câu trả lời..."
                style={{
                  flex: 1, minHeight: '90px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  borderRadius: 10, padding: '0.7rem',
                  color: 'var(--text-primary)', fontSize: '0.85rem',
                  resize: 'none', outline: 'none',
                  fontFamily: 'var(--font-sans)',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(232,184,75,0.45)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.10)'}
              />

              <button
                onClick={submitAnswer}
                style={{
                  background: answer.trim()
                    ? 'linear-gradient(135deg, #e8b84b, #c89828)'
                    : 'rgba(255,255,255,0.05)',
                  border: answer.trim() ? 'none' : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 10, padding: '0.7rem',
                  cursor: answer.trim() ? 'pointer' : 'default',
                  color: answer.trim() ? '#0d1117' : 'var(--text-quaternary)',
                  fontWeight: 700, fontSize: '0.85rem',
                  transition: 'all 0.2s',
                  boxShadow: answer.trim() ? '0 4px 14px rgba(232,184,75,0.30)' : 'none',
                }}
              >
                Gửi → Push về thiết bị
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
