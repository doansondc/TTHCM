import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import { loadDB, saveDB } from './db.js';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// ── Load Student Directory ────────────────────────────
let STUDENTS = [];
try {
  const studentsPath = path.join(__dirname, 'students.json');
  STUDENTS = JSON.parse(fs.readFileSync(studentsPath, 'utf-8'));
  console.log(`Loaded ${STUDENTS.length} students from students.json`);
} catch(e) {
  console.warn('No students.json found, authentication disabled:', e.message);
}

const app = express();
app.use(cors());
const server = createServer(app);
const io = new Server(server, { cors: { origin:'*', methods:['GET','POST'] } });

// ── Persistent State ─────────────────────────────────
let State = loadDB({
  polls: [
    {
      id: 'default',
      title: 'Bạn nghĩ chiều hướng nào sẽ xảy ra?',
      active: true,
      options: [
        { id:'Tổng lực', label:'Chiến Tranh Tổng Lực', icon:'💥', color:'#dc2626' },
        { id:'Giới hạn', label:'Xung Đột Giới Hạn',   icon:'⚠️', color:'#b5860d' },
        { id:'Hòa bình', label:'Hạ Nhiệt Ngoại Giao', icon:'🕊️', color:'#16a34a' }
      ],
      votes: {}
    }
  ],
  quizBank: [],
  questions: [],
  voterProfiles: {},
  blockedIPs: [],
  blockedMSSV: [],
  mutedMSSV: [],
  blockedFP: [],
  adminCode: '654321',
  slidePassword: 'SSH1151',
});

const commitDB = () => {
  State.blockedIPs = [...blockedIPs];
  State.blockedMSSV = [...blockedMSSV];
  State.mutedMSSV = [...mutedMSSV];
  State.blockedFP = [...blockedFP];
  State.adminCode = adminCode;
  State.slidePassword = slidePassword;
  saveDB(State);
};

let users        = {};
let currentSlide = 0;
let pollActive   = true;
let activeRoleplay = null;
let logs         = [];

let blockedIPs       = new Set(State.blockedIPs);
let blockedMSSV      = new Set(State.blockedMSSV);
let mutedMSSV        = new Set(State.mutedMSSV);
let blockedFP        = new Set(State.blockedFP);
let commentQueue     = [];
let commentsEnabled  = true;
let questionsEnabled = true;
let reactionsEnabled = true;
let commentModeOn    = false;

let qrConfig = { show: false, position: 'right', size: 100 };

let activeQuiz   = null;
let quizVotes    = {};

let polls        = State.polls;
let quizBank     = State.quizBank;
let questions    = State.questions;
let voterProfiles = State.voterProfiles;
let adminCode    = State.adminCode    || '654321';
let slidePassword = State.slidePassword || 'SSH1151';

const lastAction = {};
const RATE_MS    = { reaction:200, message:2500 };

// ── Express Middleware for IP Blocking ──────────────
app.use((req, res, next) => {
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.headers['x-real-ip'] || req.socket.remoteAddress;
  if (blockedIPs.has(ip)) {
    return res.status(403).send('<h1 style="font-family:sans-serif;text-align:center;margin-top:20%">⛔ Truy cập bị từ chối / Access Denied<br><br><span style="font-size:1rem;font-weight:normal">IP của bạn đã bị quản trị viên chặn khỏi hệ thống.</span></h1>');
  }
  next();
});

// ── Text Filter ──────────────────────
const filterText = (text) => {
  return text; // Đã tắt bộ lọc ngôn ngữ theo yêu cầu
};

const logAction = (type, data) => {
  logs.unshift({ ts: new Date().toISOString(), type, ...data });
  if (logs.length > 500) logs.pop();
};

// ── Socket Events ────────────────────────────────────
io.on('connection', (socket) => {
  const ip = socket.handshake.headers['x-forwarded-for']?.split(',')[0]?.trim() || socket.handshake.headers['x-real-ip'] || socket.handshake.address;

  if (blockedIPs.has(ip)) { socket.disconnect(true); return; }

  socket.on('join', ({ name, mssv, email, fingerprint }) => {
    const cleanMssv = mssv?.trim() || '';
    // Kiểm tra MSSV bị chặn
    if (blockedMSSV.has(cleanMssv)) {
      socket.emit('blocked', { reason: 'mssv', message: 'MSSV của bạn đã bị quản trị viên chặn khỏi phiên này.' });
      socket.disconnect(true); return;
    }
    // Kiểm tra fingerprint bị chặn
    if (fingerprint && blockedFP.has(fingerprint)) {
      socket.emit('blocked', { reason: 'fingerprint', message: 'Thiết bị của bạn đã bị chặn khỏi phiên này.' });
      socket.disconnect(true); return;
    }
    const user = { name: name.trim(), mssv: cleanMssv, email: email?.trim()||'', ip, fingerprint: fingerprint||'' };
    users[socket.id] = user;
    voterProfiles[cleanMssv] = { name: user.name, fingerprint: user.fingerprint };
    // If this user already submitted a quiz answer before name was resolved, patch it
    if (quizVotes[socket.id]) {
      quizVotes[socket.id].name = user.name;
      quizVotes[socket.id].mssv = cleanMssv;
    }
    logAction('join', { name: user.name, mssv: user.mssv, ip });
    io.emit('user_joined',        { name: user.name, mssv: user.mssv, total: Object.keys(users).length });
    io.emit('update_users',       Object.values(users));
    socket.emit('update_polls',   polls);
    socket.emit('quiz_bank_update', quizBank);
    socket.emit('update_questions', questions);
    socket.emit('slide_change',   currentSlide);
    socket.emit('poll_status',    pollActive);
    socket.emit('comments_status',  commentsEnabled);
    socket.emit('questions_status', questionsEnabled);
    socket.emit('reactions_status', reactionsEnabled);
    if (mutedMSSV.has(cleanMssv)) socket.emit('muted', { message: 'Bạn đang bị tắt tiếng trong phiên này.' });
    if (activeQuiz) { broadcastQuizState(); }
    io.emit('toast_notification', { message: `${user.name} vừa tham gia!` });
  });

  socket.on('request_users', () => {
    socket.emit('update_users', Object.values(users));
  });

  socket.on('check_mssv', (mssv, callback) => {
    if (typeof callback !== 'function') return;
    // Check students.json directory first
    const student = STUDENTS.find(s => s.mssv === mssv);
    if (student) {
      callback({ name: student.name, found: true });
    } else if (voterProfiles[mssv]) {
      callback({ name: voterProfiles[mssv].name, found: false });
    } else {
      callback(null);
    }
  });

  // Verify MSSV + password against students.json
  socket.on('check_credentials', ({ mssv, password }, callback) => {
    if (typeof callback !== 'function') return;
    const student = STUDENTS.find(s => s.mssv === mssv);
    if (!student) {
      callback({ ok: false, reason: 'Không tìm thấy MSSV trong danh sách lớp học.' });
      return;
    }
    if (student.password !== password.toLowerCase().trim()) {
      callback({ ok: false, reason: 'Mật khẩu không đúng. (Gợi ý: tên cuối viết thường không dấu)' });
      return;
    }
    callback({ ok: true, name: student.name, mssv: student.mssv });
  });

  // Change password
  socket.on('change_password', ({ mssv: targetMssv, oldPassword, newPassword }, callback) => {
    if (typeof callback !== 'function') return;
    const student = STUDENTS.find(s => s.mssv === targetMssv);
    if (!student) { callback({ ok: false, reason: 'Không tìm thấy MSSV.' }); return; }
    if (student.password !== oldPassword.toLowerCase().trim()) {
      callback({ ok: false, reason: 'Mật khẩu hiện tại không đúng.' }); return;
    }
    const cleaned = newPassword.toLowerCase().trim().replace(/[^a-z0-9_\-\.]/g, '');
    if (cleaned.length < 2) { callback({ ok: false, reason: 'Mật khẩu mới phải có ít nhất 2 ký tự (a-z, 0-9).' }); return; }
    // Update in-memory list
    student.password = cleaned;
    // Persist to students.json
    try {
      const studentsPath = path.join(__dirname, 'students.json');
      fs.writeFileSync(studentsPath, JSON.stringify(STUDENTS, null, 2), 'utf-8');
    } catch(e) { console.error('Error saving students.json:', e); }
    logAction('change_password', { mssv: targetMssv });
    callback({ ok: true });
  });

  const broadcastPolls = () => { io.emit('update_polls', polls); };

  socket.on('vote', ({ pollId, option }) => {
    if (!pollActive) return;
    const user = users[socket.id]; if (!user) return;
    const poll = polls.find(p => p.id === pollId) || polls.find(p => p.active);
    if (!poll) return;

    // Prevent changing vote
    let alreadyVoted = false;
    Object.keys(poll.votes).forEach(k => { if(poll.votes[k].includes(user.name)) alreadyVoted = true; });
    if (alreadyVoted) return;

    if (!poll.votes[option]) poll.votes[option] = [];
    poll.votes[option].push(user.name);
    
    logAction('vote', { name: user.name, mssv: user.mssv, pollId: poll.id, option, ip });
    io.emit('toast_notification', { message: `${user.name} biểu quyết: ${option}` });
    commitDB();
    broadcastPolls();
  });

  socket.on('send_reaction', (emoji) => {
    if (!reactionsEnabled) return;
    const now = Date.now();
    if (!lastAction[socket.id]) lastAction[socket.id] = {};
    if (now - (lastAction[socket.id].reaction||0) < RATE_MS.reaction) return;
    lastAction[socket.id].reaction = now;
    const user = users[socket.id]; if (!user) return;
    if (mutedMSSV.has(user.mssv)) return; // silently drop
    io.emit('show_reaction', { emoji, name: user.name, id: Math.random() });
  });

  socket.on('send_message', (rawText) => {
    if (!commentsEnabled) return;
    const now = Date.now();
    if (!lastAction[socket.id]) lastAction[socket.id] = {};
    if (now - (lastAction[socket.id].message||0) < RATE_MS.message) return;
    lastAction[socket.id].message = now;
    const user = users[socket.id]; if (!user) return;
    if (mutedMSSV.has(user.mssv)) return; // silently drop
    const text = filterText(rawText.trim().slice(0, 200));
    logAction('comment', { name: user.name, mssv: user.mssv, text, ip });
    if (commentModeOn) {
      const qItem = { id: Date.now() + Math.random(), name: user.name, mssv: user.mssv, text };
      commentQueue.unshift(qItem);
      socket.emit('comment_queued');
      io.emit('comment_queue_update', commentQueue);
    } else {
      io.emit('new_message', { name: user.name, text, id: Math.random() });
    }
  });

  socket.on('send_question', ({ text, verifyCode }) => {
    if (!questionsEnabled) { socket.emit('feature_disabled', { feature: 'questions' }); return; }
    const user = users[socket.id]; if (!user) return;
    if (mutedMSSV.has(user.mssv)) return; // silently drop
    const filtered = filterText(text.trim().slice(0, 300));
    const q = { id: Date.now() + Math.random(), name: user.name, mssv: user.mssv, socketId: socket.id, text: filtered, answer: null, verifyCode };
    questions.unshift(q);
    logAction('question', { name: user.name, mssv: user.mssv, text: filtered, ip });
    io.emit('question_toast', { name: user.name, text: 'vừa đặt một câu hỏi!' });
    commitDB();
    io.emit('new_question', q);
    io.emit('update_questions', questions);
  });

  socket.on('get_questions', () => {
    socket.emit('update_questions', questions);
  });

  socket.on('answer_question', ({ id, answer }) => {
    const q = questions.find(q => q.id === id); if (!q) return;
    q.answer = answer;
    logAction('answer', { qId: id, answer });
    commitDB();
    io.emit('question_answered', { id, answer });

    // Cố gắng gửi trả lời về đúng người hỏi bằng mssv nếu socket.id đã đổi do reload
    let targetSocketId = q.socketId;
    if (!users[targetSocketId]) {
      const activeUserSid = Object.keys(users).find(sid => users[sid].mssv === q.mssv);
      if (activeUserSid) targetSocketId = activeUserSid;
    }
    if (targetSocketId) {
      io.to(targetSocketId).emit('your_answer', { question: q.text, answer });
    }
  });

  socket.on('spin_wheel', () => {
    // Pick from Q&A participants (unique by mssv), fallback to all users
    const qaSet = new Map();
    questions.forEach(q => { if (!qaSet.has(q.mssv)) qaSet.set(q.mssv, { name: q.name, mssv: q.mssv }); });
    const pool = qaSet.size > 0 ? [...qaSet.values()] : Object.values(users);
    if (pool.length > 0) io.emit('wheel_winner', pool[Math.floor(Math.random() * pool.length)]);
  });

  socket.on('spin_global_picker', () => {
    const pool = Object.values(users);
    if (pool.length > 0) {
      const winner = pool[Math.floor(Math.random() * pool.length)];
      io.emit('global_picker_winner', { winner, pool });
    }
  });

  socket.on('close_global_picker', () => {
    io.emit('global_picker_close');
  });

  socket.on('get_qa_participants', () => {
    const qaSet = new Map();
    questions.forEach(q => { if (!qaSet.has(q.mssv)) qaSet.set(q.mssv, { name: q.name, mssv: q.mssv }); });
    socket.emit('qa_participants', [...qaSet.values()]);
  });

  socket.on('set_slide', (idx) => { currentSlide = idx; io.emit('slide_change', idx); });

  socket.on('toggle_poll', (active) => {
    pollActive = active;
    if (polls.length > 0) {
      polls.forEach(p => p.active = false);
      polls[0].active = active;
    }
    commitDB();
    io.emit('poll_status', active);
    io.emit('update_polls', polls);
    io.emit('toast_notification', { message: active ? '📊 Máy bỏ phiếu đã BẬT!' : '🔒 Máy bỏ phiếu đã ĐÓNG.' });
  });

  // ── Poll CRUD ───────────────────────────────
  socket.on('create_poll', (data) => {
    polls.push({
      id: `poll_${Date.now()}`,
      title: data.title || 'Poll mới',
      options: data.options || [],
      votes: {},
      active: false,
    });
    commitDB(); broadcastPolls();
  });
  socket.on('update_poll', (data) => {
    const p = polls.find(x => x.id === data.id);
    if (p) { p.title = data.title; p.options = data.options; commitDB(); broadcastPolls(); }
  });
  socket.on('delete_poll', (id) => {
    polls = polls.filter(p => p.id !== id);
    if (polls.length === 0) polls.push({ id:'default', title:'New Poll', options:[], votes:{}, active:true });
    State.polls = polls; // sync ref
    commitDB(); broadcastPolls();
  });
  socket.on('activate_poll', (id) => {
    polls.forEach(p => p.active = (p.id === id));
    pollActive = true;
    io.emit('poll_status', true);
    commitDB(); broadcastPolls();
  });
  socket.on('poll_reset', (id) => {
    const p = polls.find(x => x.id === id);
    if (p) { p.votes = {}; commitDB(); broadcastPolls(); }
  });

  // ── QuizBank CRUD ─────────────────────────────
  const broadcastQuizBank = () => { io.emit('quiz_bank_update', quizBank); };

  socket.on('save_quiz_to_bank', (data) => {
    if (data.id) {
      const q = quizBank.find(x => x.id === data.id);
      if (q) {
        q.question    = data.question;
        q.options     = data.options;
        q.correctId   = data.correctId;
        q.explanation = data.explanation || '';
        q.duration    = data.duration || 15;
      }
    } else {
      quizBank.push({
        id:          `quiz_${Date.now()}`,
        type:        data.type || 'mcq',
        question:    data.question,
        options:     data.options || [],
        correctId:   data.correctId   || null,
        explanation: data.explanation || '',
        duration:    data.duration || 15
      });
    }
    commitDB();
    broadcastQuizBank();
  });

  socket.on('start_quiz_from_bank', (data) => {
    const id = typeof data === 'string' ? data : data.id;
    const duration = typeof data === 'object' && data.duration ? data.duration : 15;
    const q = quizBank.find(x => x.id === id);
    if (!q) return;
    activeQuiz = {
      id: q.id,
      type: q.type || 'mcq',
      question: q.question,
      options: q.options,
      correctId: q.correctId,
      explanation: q.explanation,
      duration: duration,
      startTime: Date.now(),
      isFinished: false
    };
    quizVotes = {};
    io.emit('toast_notification', { message: '📝 Câu hỏi trắc nghiệm đã bắt đầu!' });
    broadcastQuizState();
  });

  socket.on('delete_quiz_from_bank', (id) => {
    quizBank = quizBank.filter(q => q.id !== id);
    State.quizBank = quizBank;
    commitDB();
    broadcastQuizBank();
  });

  // Admin controls
  socket.on('get_logs',    ()          => socket.emit('admin_logs', logs));
  socket.on('get_polls',   ()          => socket.emit('update_polls', polls));
  socket.on('get_quiz_bank',()         => socket.emit('quiz_bank_update', quizBank));
  socket.on('block_ip',   (targetIp)  => {
    blockedIPs.add(targetIp);
    Object.entries(users).forEach(([sid, u]) => {
      if (u.ip === targetIp) io.sockets.sockets.get(sid)?.disconnect(true);
    });
    io.emit('admin_logs', logs);
    io.emit('blocked_ips', [...blockedIPs]);
  });
  socket.on('unblock_ip', (targetIp)  => {
    blockedIPs.delete(targetIp);
    io.emit('blocked_ips', [...blockedIPs]);
  });
  socket.on('get_blocked_ips', () => socket.emit('blocked_ips', [...blockedIPs]));

  // ── MSSV Block ──────────────────────────────────────
  socket.on('block_mssv', (mssv) => {
    blockedMSSV.add(mssv);
    Object.entries(users).forEach(([sid, u]) => {
      if (u.mssv === mssv) {
        io.sockets.sockets.get(sid)?.emit('blocked', { reason: 'mssv', message: 'MSSV của bạn đã bị quản trị viên chặn.' });
        io.sockets.sockets.get(sid)?.disconnect(true);
      }
    });
    logAction('block', { name: `block_mssv:${mssv}`, mssv, ip: 'admin' });
    io.emit('blocked_mssv_update', [...blockedMSSV]);
  });
  socket.on('unblock_mssv',    (mssv) => { blockedMSSV.delete(mssv); io.emit('blocked_mssv_update', [...blockedMSSV]); });
  socket.on('get_blocked_mssv', ()    => socket.emit('blocked_mssv_update', [...blockedMSSV]));

  // ── MSSV Mute ───────────────────────────────────────
  socket.on('mute_mssv', (mssv) => {
    mutedMSSV.add(mssv);
    Object.entries(users).forEach(([sid, u]) => {
      if (u.mssv === mssv) io.to(sid).emit('muted', { message: 'Bạn đã bị tắt tiếng trong phiên này.' });
    });
    io.emit('muted_mssv_update', [...mutedMSSV]);
  });
  socket.on('unmute_mssv', (mssv) => {
    mutedMSSV.delete(mssv);
    Object.entries(users).forEach(([sid, u]) => { if (u.mssv === mssv) io.to(sid).emit('unmuted'); });
    io.emit('muted_mssv_update', [...mutedMSSV]);
  });
  socket.on('get_muted_mssv', () => socket.emit('muted_mssv_update', [...mutedMSSV]));

  // ── Content Toggles ─────────────────────────────────
  socket.on('toggle_comments',     (v) => { commentsEnabled  = v; io.emit('comments_status',  v); io.emit('toast_notification', { message: v ? '💬 Bình luận đã bật!'  : '🔇 Bình luận đã tắt.' }); });
  socket.on('toggle_questions',    (v) => { questionsEnabled = v; io.emit('questions_status', v); io.emit('toast_notification', { message: v ? '❓ Câu hỏi đã bật!'    : '🔒 Câu hỏi đã tắt.'   }); });
  socket.on('toggle_reactions',    (v) => { reactionsEnabled = v; io.emit('reactions_status', v); });
  socket.on('toggle_comment_mode', (v) => { commentModeOn = v; commentQueue = []; io.emit('comment_mode_status', v); io.emit('comment_queue_update', []); io.emit('toast_notification', { message: v ? '📬 Chế độ duyệt bình luận BẬT' : '📢 Bình luận tự động phát' }); });
  socket.on('update_rate_ms',      (newRates) => { Object.assign(RATE_MS, newRates); io.emit('rate_ms_updated', RATE_MS); });
  socket.on('get_rate_ms',         () => socket.emit('rate_ms_updated', RATE_MS));

  // ── Comment Moderation ──────────────────────────────
  socket.on('get_comment_queue',  ()   => socket.emit('comment_queue_update', commentQueue));
  socket.on('approve_comment',    (id) => {
    const item = commentQueue.find(c => c.id === id);
    if (item) { commentQueue = commentQueue.filter(c => c.id !== id); io.emit('new_message', { name: item.name, text: item.text, id: Math.random() }); io.emit('comment_queue_update', commentQueue); }
  });
  socket.on('reject_comment',     (id) => { commentQueue = commentQueue.filter(c => c.id !== id); io.emit('comment_queue_update', commentQueue); });

  // ── Password Management ─────────────────────────────
  socket.on('change_admin_code', ({ oldCode, newCode }, callback) => {
    if (!oldCode || !newCode) { callback?.({ ok: false, msg: 'Thiếu thông tin.' }); return; }
    if (oldCode !== adminCode) { callback?.({ ok: false, msg: 'Mã cũ không đúng.' }); return; }
    const cleaned = newCode.trim();
    if (cleaned.length < 4 || cleaned.length > 20) { callback?.({ ok: false, msg: 'Mã mới phải từ 4–20 ký tự.' }); return; }
    adminCode = cleaned;
    commitDB();
    logAction('change_admin_code', { name: 'admin', mssv: 'admin', ip: '' });
    callback?.({ ok: true });
    socket.emit('toast_notification', { message: '🔐 Mã admin đã được cập nhật!' });
  });

  socket.on('change_slide_password', ({ currentAdminCode, newPassword }, callback) => {
    if (!currentAdminCode || !newPassword) { callback?.({ ok: false, msg: 'Thiếu thông tin.' }); return; }
    if (currentAdminCode !== adminCode) { callback?.({ ok: false, msg: 'Mã admin không đúng.' }); return; }
    const cleaned = newPassword.trim();
    if (cleaned.length < 1 || cleaned.length > 30) { callback?.({ ok: false, msg: 'Mật khẩu phải từ 1–30 ký tự.' }); return; }
    slidePassword = cleaned;
    commitDB();
    logAction('change_slide_password', { name: 'admin', mssv: 'admin', ip: '' });
    // Broadcast new slide password to all connected clients
    io.emit('slide_password_updated', { slidePassword });
    callback?.({ ok: true });
    socket.emit('toast_notification', { message: `🔑 Mật khẩu slide đã đổi thành: ${cleaned}` });
  });

  socket.on('get_config', () => {
    socket.emit('config_update', { adminCode, slidePassword });
  });


  socket.on('block_fingerprint',   (fp) => {
    blockedFP.add(fp);
    Object.entries(users).forEach(([sid, u]) => {
      if (u.fingerprint === fp) { io.sockets.sockets.get(sid)?.emit('blocked', { reason: 'fingerprint', message: 'Thiết bị của bạn đã bị chặn.' }); io.sockets.sockets.get(sid)?.disconnect(true); }
    });
    io.emit('blocked_fp_update', [...blockedFP]);
  });
  socket.on('unblock_fingerprint', (fp) => { blockedFP.delete(fp); io.emit('blocked_fp_update', [...blockedFP]); });
  socket.on('get_blocked_fp',      ()   => socket.emit('blocked_fp_update', [...blockedFP]));

  // ── QR Config ───────────────────────────────────────
  socket.on('get_qr_config', () => socket.emit('qr_config_update', qrConfig));
  socket.on('update_qr_config', (cfg) => {
    qrConfig = { ...qrConfig, ...cfg };
    io.emit('qr_config_update', qrConfig);
  });

  // ── Quiz Functions ──────────────────────────────────
  socket.on('admin_start_quiz', (quizData) => {
    // quizData: { question, options: [{id, text}] }
    activeQuiz = quizData;
    quizVotes = {};
    io.emit('toast_notification', { message: '📝 Câu hỏi trắc nghiệm đã bắt đầu!' });
    broadcastQuizState();
  });

  socket.on('admin_stop_quiz', (data) => {
    // data: correctOptionId (string) or { correctOptionId, explanation }
    const correctOptionId = typeof data === 'string' ? data : data?.correctOptionId;
    const explanation     = typeof data === 'object' ? (data?.explanation || '') : '';

    if (activeQuiz) {
      activeQuiz.isFinished      = true;
      activeQuiz.correctOptionId = correctOptionId;
      activeQuiz.explanation     = explanation;

      // Compute winners: correct + sorted by timeTaken
      const correctVoters = Object.values(quizVotes)
        .filter(v => v.optionId === correctOptionId)
        .sort((a, b) => a.timeTaken - b.timeTaken)
        .map((v, i) => ({ rank: i + 1, name: v.name, mssv: v.mssv, timeTaken: v.timeTaken }));

      activeQuiz.winners = correctVoters;
      broadcastQuizState();

      const total   = Object.keys(quizVotes).length;
      const correct = correctVoters.length;
      io.emit('toast_notification', {
        message: `🏆 Chốt! ${correct}/${total} chịn đúng${correctVoters[0] ? ' · Nhanh nhất: ' + correctVoters[0].name : ''}`
      });
    } else {
      activeQuiz = null;
      quizVotes  = {};
      broadcastQuizState();
    }
  });

  socket.on('admin_clear_quiz', () => {
    activeQuiz = null;
    quizVotes = {};
    broadcastQuizState();
  });

  socket.on('submit_quiz_answer', (optionId) => {
    if (!activeQuiz || activeQuiz.isFinished) return;
    
    // Calculate time taken
    const timeTaken = Date.now() - activeQuiz.startTime;

    const user = users[socket.id];
    
    // Prevent changing answer: if recorded, ignore new submissions
    if (quizVotes[socket.id]) return;

    // First answer — record with timeTaken
    quizVotes[socket.id] = {
      optionId,
      timeTaken,
      name: user?.name || 'Unknown',
      mssv: user?.mssv || '',
    };

    broadcastQuizState();
  });

  const broadcastQuizState = () => {
    if (!activeQuiz) { io.emit('quiz_state', null); return; }
    // Count votes per option
    const counts = {};
    if (activeQuiz.options) {
      activeQuiz.options.forEach(opt => counts[opt.id] = 0);
    }
    Object.values(quizVotes).forEach(v => {
      const optId = v.optionId || v; // backward compat
      if (counts[optId] !== undefined) counts[optId]++;
    });
    const total = Object.keys(quizVotes).length;
    io.emit('quiz_state', { ...activeQuiz, counts, totalVotes: total, rawVotes: Object.values(quizVotes) });
  };

  // ── Roleplay Polling (Slide 5) ────────────────────────
  socket.on('start_roleplay_poll', (data) => {
    activeRoleplay = { ...data, votes: {} };
    io.emit('roleplay_state', activeRoleplay);
  });
  socket.on('stop_roleplay_poll', () => {
    activeRoleplay = null;
    io.emit('roleplay_state', null);
  });
  socket.on('roleplay_vote', (optIdx) => {
    if (!activeRoleplay) return;
    const user = users[socket.id]; if (!user) return;
    // Xóa vote cũ
    Object.keys(activeRoleplay.votes).forEach(k => {
      activeRoleplay.votes[k] = activeRoleplay.votes[k].filter(n => n !== user.name);
    });
    if (!activeRoleplay.votes[optIdx]) activeRoleplay.votes[optIdx] = [];
    activeRoleplay.votes[optIdx].push(user.name);
    io.emit('roleplay_state', activeRoleplay);
  });

  socket.on('disconnect', () => {
    delete users[socket.id];
    delete lastAction[socket.id];
    io.emit('update_users', Object.values(users));
  });
});

// ── REST API ──────────────────────────────────────
app.use(express.json());

// GET /api/config — public config (slide password, admin code hash)
app.get('/api/config', (req, res) => {
  res.json({ slidePassword, adminCode });
});
// GET /api/students — for admin student list panel
app.get('/api/students', (req, res) => {
  const onlineByMssv = new Set(Object.values(users).map(u => u.mssv));

  // Build voted set: check all active polls' votes by voter name → mssv lookup
  const votedMssv = new Set();
  polls.forEach(p => {
    Object.values(p.votes || {}).flat().forEach(voterName => {
      // Find mssv of this voter name from voterProfiles
      const mssv = Object.keys(voterProfiles).find(m => voterProfiles[m].name === voterName);
      if (mssv) votedMssv.add(mssv);
    });
  });

  const list = STUDENTS.map(s => ({
    name:     s.name,
    mssv:     s.mssv,
    password: s.password,
    online:   onlineByMssv.has(s.mssv),
    voted:    votedMssv.has(s.mssv),
  }));
  res.json({ total: list.length, onlineCount: onlineByMssv.size, votedCount: votedMssv.size, students: list });
});

// GET /api/students/credentials — admin-only full credential sheet
app.get('/api/students/credentials', (req, res) => {
  const key = req.headers['x-admin-key'] || req.query.key;
  if (key !== 'SSH1151') return res.status(403).json({ error: 'Forbidden' });
  res.json(STUDENTS.map((s, i) => ({ stt: i + 1, name: s.name, mssv: s.mssv, password: s.password })));
});

app.use(express.static(path.join(__dirname, 'dist')));
app.use((req, res) => res.sendFile(path.join(__dirname, 'dist', 'index.html')));

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => console.log(`Server on :${PORT}`));
