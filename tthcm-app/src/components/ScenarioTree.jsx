import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const scenarios = [
  {
    id: 1,
    title: "🕊️ Cành 1: Hạ nhiệt ngoại giao (Mong đợi nhất)",
    content: "Dưới sự trung gian của Pakistan và Thổ Nhĩ Kỳ, các bên chấp thuận ngừng bắn vô điều kiện. Mỹ nới lỏng trừng phạt.\n• Ai có lợi: Nhân dân thế giới, các quốc gia đang phát triển (nhờ giá cả giảm).\n• Ai thiệt hại: Phe cực đoan hai bên và các tập đoàn buôn vũ khí."
  },
  {
    id: 2,
    title: "⚔️ Cành 2: Xung đột giới hạn (Thực tế nhất)",
    content: "Các bên tập trung 'đánh để dằn mặt', chuyển sang chiến tranh mạng và ám sát, tránh sa lầy trên bộ.\n• Ai có lợi: Phe phái chính trị cực đoan dùng chiến tranh để củng cố quyền lực.\n• Ai thiệt hại: Doanh nghiệp logistics và dòng chảy thương mại toàn cầu vẫn bị nghẽn."
  },
  {
    id: 3,
    title: "🔥 Cành 3: Chiến tranh tổng lực (Leo thang cực độ)",
    content: "Iran phong tỏa hoàn toàn eo biển Hormuz. Dầu mất nguồn cung. Mỹ tổng tiến công hạt nhân.\n• Ai có lợi: Chỉ các nước xuất khẩu dầu mỏ ngoài vùng chiến sự.\n• Ai thiệt hại: Kinh tế toàn thế giới suy thoái, thảm họa nhân đạo kỷ lục."
  }
];

export default function ScenarioTree() {
  const [activeId, setActiveId] = useState(null);

  return (
    <div style={{ width: '100%', maxWidth: '900px', marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
      {scenarios.map((sc) => (
        <motion.div 
          key={sc.id} 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: sc.id * 0.15 }}
          style={{ width: '100%' }}
        >
          <div 
            onClick={() => setActiveId(activeId === sc.id ? null : sc.id)}
            style={{ 
              padding: '20px', background: activeId === sc.id ? 'rgba(212,168,67,0.15)' : 'var(--card-bg)', 
              border: `1px solid ${activeId === sc.id ? 'var(--gold)' : 'var(--card-border)'}`, 
              borderRadius: '12px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.3s'
            }}
          >
            <h3 style={{ fontSize: '1.2rem', color: activeId === sc.id ? 'var(--gold)' : 'var(--text-main)', margin: 0 }}>{sc.title}</h3>
            <span style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>{activeId === sc.id ? '−' : '+'}</span>
          </div>

          <AnimatePresence>
            {activeId === sc.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1, marginTop: '10px' }}
                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                style={{ overflow: 'hidden' }}
              >
                <div style={{ padding: '20px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '12px', color: 'var(--text-muted)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                  {sc.content}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}
