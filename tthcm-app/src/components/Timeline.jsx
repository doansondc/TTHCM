import { motion } from 'framer-motion';

const events = [
  { date: 'Tháng 10 / 2023', text: 'Hamas tấn công quy mô lớn vào Israel. Khởi đầu chiến dịch trả đũa khốc liệt tại dải Gaza. Hình thành trạng thái thiết lập trật tự phòng thủ mới.' },
  { date: 'Tháng 04 / 2024', text: 'Đại sứ quán Iran tại Syria bị tấn công. Iran lần đầu tiên đáp trả Israel trực tiếp bằng đường không quy mô nhất lịch sử.' },
  { date: 'Tương Lại Kế Thừa', text: 'Cấu trúc an ninh cũ đổ vỡ. Hướng tới các liên minh đối nghịch kiểu mới. Ngoại giao rơi vào khoảng không khe cửa hẹp.' }
];

export default function Timeline() {
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '1000px', padding: '40px 0', marginTop: '40px' }}>
      <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '4px', background: 'var(--card-border)', transform: 'translateX(-50%)' }} />
      
      {events.map((ev, index) => {
        const isEven = index % 2 === 0;
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: isEven ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.3, duration: 0.6 }}
            style={{ 
              position: 'relative', width: '50%', marginBottom: '50px', zIndex: 2,
              marginLeft: isEven ? '0' : '50%',
              paddingRight: isEven ? '40px' : '0',
              paddingLeft: isEven ? '0' : '40px'
            }}
          >
            <motion.div
              whileHover={{ scale: 1.05, borderColor: 'var(--gold)' }}
              style={{ padding: '25px', background: 'rgba(16,22,38,0.8)', border: '2px solid var(--card-border)', borderRadius: '16px', position: 'relative' }}
            >
              <div style={{ position: 'absolute', top: '20px', width: '24px', height: '24px', borderRadius: '50%', background: 'var(--gold)', border: '4px solid var(--bg-color)', zIndex: 3, 
                            right: isEven ? '-52px' : 'auto', left: !isEven ? '-52px' : 'auto' }} />
              <div style={{ fontWeight: 'bold', color: 'var(--gold-light)', marginBottom: '10px', fontSize: '1.2rem' }}>{ev.date}</div>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.5 }}>{ev.text}</p>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
