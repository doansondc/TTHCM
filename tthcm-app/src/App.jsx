import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { slideData } from './slides';
import VotingBoard from './components/VotingBoard';
import FlipCard from './components/FlipCard';
import Timeline from './components/Timeline';
import './index.css';

function App() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => setCurrentSlide((prev) => Math.min(prev + 1, slideData.length - 1));
  const prevSlide = () => setCurrentSlide((prev) => Math.max(prev - 1, 0));

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    let isThrottled = false;
    const handleWheel = (e) => {
      if (isThrottled) return;
      if (Math.abs(e.deltaX) > 20 || Math.abs(e.deltaY) > 40) {
        if (e.deltaX > 0 || e.deltaY > 0) nextSlide();
        else prevSlide();
        isThrottled = true;
        setTimeout(() => isThrottled = false, 800);
      }
    };
    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  const currentData = slideData[currentSlide];

  return (
    <>
      <div className="ambient-glow"></div>
      
      {/* Background Transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentData.bg}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            backgroundImage: `url(${currentData.bg})`,
            backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0
          }}
        />
      </AnimatePresence>

      <div className="slide-container">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 0.9, x: 100 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: -100 }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}
            className="slide-content"
            style={{ zIndex: 10 }}
          >
            {currentData.subtitle && (
              <motion.div 
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
                style={{ fontSize: '1.5rem', color: 'var(--gold-light)', textTransform: 'uppercase', letterSpacing: '3px', fontWeight: '800', textAlign: 'center', marginBottom: '20px' }}>
                {currentData.subtitle}
              </motion.div>
            )}
            
            <motion.h1 
              initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
              style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', marginBottom: '20px', lineHeight: 1.2, textAlign: 'center' }}
              dangerouslySetInnerHTML={{ __html: currentData.title }} 
            />

            {currentData.desc && (
              <motion.p 
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
                style={{ fontSize: 'clamp(1.2rem, 1.8vw, 1.5rem)', color: 'var(--text-muted)', textAlign: 'center', maxWidth: '900px', lineHeight: 1.6 }}
                dangerouslySetInnerHTML={{ __html: currentData.desc }} 
              />
            )}

            {/* Custom Interactive Elements based on slide type */}
            {currentData.type === 'poll' && <VotingBoard />}
            
            {currentData.type === 'causes' && (
              <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px', width: '100%', maxWidth: '1200px', marginTop: '40px' }}>
                <div className="glass-card"><div style={{fontSize:'3rem', marginBottom:'15px'}}>🛢️</div><h3 style={{fontSize:'1.6rem', color:'var(--gold-light)', marginBottom:'10px'}}>Địa chính trị & Tài nguyên</h3><p style={{color:'var(--text-muted)'}}>Nơi sở hữu trữ lượng dầu mỏ, khí đốt khổng lồ. Tuyến hàng hải huyết mạch (Suez, Hormuz).</p></div>
                <div className="glass-card"><div style={{fontSize:'3rem', marginBottom:'15px'}}>☪️</div><h3 style={{fontSize:'1.6rem', color:'var(--gold-light)', marginBottom:'10px'}}>Tôn giáo & Sắc tộc</h3><p style={{color:'var(--text-muted)'}}>Sự chia rẽ sâu sắc hơn 1.300 năm giữa Sunni và Shia, cùng mâu thuẫn Do Thái - Ả Rập.</p></div>
                <div className="glass-card"><div style={{fontSize:'3rem', marginBottom:'15px'}}>🗺️</div><h3 style={{fontSize:'1.6rem', color:'var(--gold-light)', marginBottom:'10px'}}>Di sản lịch sử</h3><p style={{color:'var(--text-muted)'}}>Đường biên giới bị chia cắt một cách cơ học bởi Phương Tây sau Thế chiến I (Sykes-Picot).</p></div>
              </motion.div>
            )}

            {currentData.type === 'conflict-palestine' && (
               <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', width: '100%', maxWidth: '1200px', marginTop: '40px' }}>
                 <div className="glass-card"><h3 style={{color:'var(--gold-light)', fontSize:'1.6rem', marginBottom:'15px'}}>🇮🇱 Động cơ Israel</h3><ul style={{marginLeft:'20px', color:'var(--text-muted)', lineHeight:1.6}}><li>Bảo vệ sự tồn vong của Nhà nước Do Thái duy nhất.</li><li>Trấn áp các mối đe dọa vũ trang từ Hamas, Hezbollah.</li><li>Khẳng định quyền lịch sử với vùng lõi Jerusalem.</li></ul></div>
                 <div className="glass-card"><h3 style={{color:'var(--gold-light)', fontSize:'1.6rem', marginBottom:'15px'}}>🇵🇸 Động cơ Palestine</h3><ul style={{marginLeft:'20px', color:'var(--text-muted)', lineHeight:1.6}}><li>Thiết lập quốc gia độc lập với Đông Jerusalem là thủ đô.</li><li>Đòi lại lãnh thổ trước ranh giới 1967 (Gaza, Bờ Tây).</li><li>Bảo vệ quyền hồi hương cho hàng triệu người nhập cư.</li></ul></div>
               </motion.div>
            )}

            {currentData.type === 'conflict-iran' && (
               <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', width: '100%', maxWidth: '1200px', marginTop: '40px' }}>
                 <div className="glass-card"><h3 style={{color:'var(--gold-light)', fontSize:'1.6rem', marginBottom:'15px'}}>Ý Đồ Của Iran</h3><ul style={{marginLeft:'20px', color:'var(--text-muted)', lineHeight:1.6}}><li>Lọc Mỹ khỏi bản đồ quyền lực bằng chiến tranh ủy nhiệm.</li><li>Kích hoạt học thuyết "Phòng thủ chủ động" với UAV/Tên lửa.</li><li>Xây dựng mạng lưới "Trăng lưỡi liềm Shia" làm khiên chắn.</li></ul></div>
                 <div className="glass-card"><h3 style={{color:'var(--gold-light)', fontSize:'1.6rem', marginBottom:'15px'}}>Ý Đồ Của Israel & Mỹ</h3><ul style={{marginLeft:'20px', color:'var(--text-muted)', lineHeight:1.6}}><li>Tuyệt đối ngăn chặn Iran sở hữu vũ khí Hạt nhân.</li><li>Bảo vệ các dòng chảy năng lượng và an ninh đồng minh.</li><li>Dập rủi ro thiết lập cơ sở quân sự Iran tại Lebanon, Syria.</li></ul></div>
               </motion.div>
            )}

            {currentData.type === 'roleplay-cards' && (
              <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', width: '100%', maxWidth: '1400px', marginTop: '40px' }}>
                {currentData.cards.map((card, idx) => <FlipCard key={idx} card={card} delay={idx * 0.15} />)}
              </motion.div>
            )}

            {currentData.type === 'timeline' && <Timeline />}

            {currentData.type === 'vietnam' && (
               <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', width: '100%', maxWidth: '1200px', marginTop: '40px' }}>
                 <div className="glass-card"><h3 style={{color:'var(--gold-light)', fontSize:'1.6rem', marginBottom:'15px'}}>🎋 Ngoại Giao Cây Tre</h3><p style={{color:'var(--text-muted)', lineHeight:1.6}}>Gốc vững, thân chắc, cành uyển chuyển. Đứng trước sóng gió địa chính trị, Việt Nam kiên định nguyên tắc đa phương hóa, làm bạn với tất cả.</p></div>
                 <div className="glass-card"><h3 style={{color:'var(--gold-light)', fontSize:'1.6rem', marginBottom:'15px'}}>🛡️ Nguyên Tắc "Bốn Không"</h3><p style={{color:'var(--text-muted)', lineHeight:1.6}}>Không tham gia liên minh quân sự; Không liên kết nước này chống nước kia; Không cho đặc căn cứ; Không sử dụng vũ lực.</p></div>
               </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div style={{ position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '20px', zIndex: 100 }}>
        <button onClick={prevSlide} style={{ background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)', color:'#fff', width:'60px', height:'60px', borderRadius:'50%', fontSize:'1.5rem', cursor:'pointer', backdropFilter:'blur(10px)' }}>❮</button>
        <button onClick={nextSlide} style={{ background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)', color:'#fff', width:'60px', height:'60px', borderRadius:'50%', fontSize:'1.5rem', cursor:'pointer', backdropFilter:'blur(10px)' }}>❯</button>
      </div>
      
      <div style={{ position: 'fixed', bottom: '45px', right: '30px', color: 'var(--text-muted)', fontSize: '1.2rem', fontWeight: 'bold', zIndex: 100 }}>
        {currentSlide + 1} / {slideData.length}
      </div>
    </>
  );
}

export default App;
