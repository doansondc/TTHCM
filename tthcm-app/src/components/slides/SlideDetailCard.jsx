import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

/**
 * SlideDetailCard — Full-screen single-card layout.
 * card.layout controls which layout variant is used:
 *   'energy'   → Big chart left + sub-images + bullets right
 *   'religion' → Two maps side-by-side + 2-col bullets below
 *   'history'  → Big map left + headline + bullets right
 */

/* ─── Shared header ─── */
function CardHeader({ subtitle, title, icon, accentColor }) {
  return (
    <div style={{ flexShrink: 0, textAlign: 'center', marginBottom: '0.55rem' }}>
      <motion.div
        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 7,
          padding: '4px 14px', borderRadius: 100,
          background: `${accentColor}14`, border: `1px solid ${accentColor}30`,
          color: accentColor, fontSize: '0.68rem', fontWeight: 700,
          letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.35rem',
        }}
      >
        <span style={{ fontSize: '1rem' }}>{icon}</span>
        {subtitle}
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        style={{
          fontFamily: 'var(--font-display)', fontSize: 'var(--fs-2xl)',
          fontWeight: 700, color: 'var(--text-primary)',
          lineHeight: 1.12, margin: 0,
          textShadow: `0 0 40px ${accentColor}25`,
        }}
      >
        {title}
      </motion.h2>
    </div>
  );
}

/* ─── Bullet list ─── */
function BulletList({ points, accentColor, columns = 1, delay = 0 }) {
  return (
    <ul style={{
      listStyle: 'none', padding: 0, margin: 0,
      display: 'grid',
      gridTemplateColumns: columns === 2 ? '1fr 1fr' : '1fr',
      gap: '0.5rem 1.2rem',
    }}>
      {points.map((pt, i) => (
        <motion.li
          key={i}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: delay + i * 0.07 }}
          style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}
        >
          <span style={{
            width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
            background: accentColor, boxShadow: `0 0 8px ${accentColor}`,
            marginTop: '0.52rem',
          }} />
          <span style={{
            fontSize: '1.15rem', color: 'var(--text-secondary)',
            lineHeight: 1.65, fontWeight: 500,
          }}>
            {pt}
          </span>
        </motion.li>
      ))}
    </ul>
  );
}

/* ─── Image with overlay ─── */
function ImgBox({ src, caption, accentColor, style = {}, imgStyle = {} }) {
  return (
    <div style={{
      borderRadius: 10, overflow: 'hidden', position: 'relative',
      background: `${accentColor}12`, flexShrink: 0, ...style,
    }}>
      <img
        src={src} alt={caption || ''}
        onError={e => { e.currentTarget.closest('[data-imgbox]').style.display = 'none'; }}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', ...imgStyle }}
      />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.70) 100%)',
        pointerEvents: 'none',
      }} />
      {caption && (
        <div style={{
          position: 'absolute', bottom: 7, left: 10, right: 10,
          fontSize: '0.65rem', fontWeight: 600, color: '#fff',
          lineHeight: 1.25, textShadow: '0 1px 5px rgba(0,0,0,0.9)',
        }}>
          {caption}
        </div>
      )}
    </div>
  );
}

const OIL_DATA = [
  { name: 'Trung Đông', value: 48, color: '#f0c040' },
  { name: 'Châu Mỹ', value: 33, color: '#34d97b' },
  { name: 'Đông Âu & Á Âu', value: 9, color: '#60a5fa' },
  { name: 'Châu Phi', value: 7, color: '#f87171' },
  { name: 'Khu vực khác', value: 3, color: '#a78bfa' },
];

function OilReservesPieChart() {
  return (
    <div style={{ width: '100%', height: '100%', background: 'rgba(240,192,64,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <h3 style={{
        position: 'absolute', top: 15, left: 20, 
        color: '#f0c040', fontSize: '1rem', fontWeight: 800, margin: 0, 
        fontFamily: 'var(--font-mono)', letterSpacing: '0.05em'
      }}>
        Cán Cân Trữ Lượng Dầu Mỏ Toàn Cầu
      </h3>
      <div style={{ width: '100%', flex: 1, minHeight: 0, marginTop: 40 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={OIL_DATA}
              cx="50%"
              cy="50%"
              innerRadius="45%"
              outerRadius="75%"
              paddingAngle={4}
              dataKey="value"
              stroke="none"
              label={({ cx, cy, midAngle, innerRadius, outerRadius, value, index }) => {
                const RADIAN = Math.PI / 180;
                const radius = innerRadius + (outerRadius - innerRadius) * 0.5 + 20;
                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                const y = cy + radius * Math.sin(-midAngle * RADIAN);
                return (
                  <text x={x} y={y} fill={OIL_DATA[index].color} textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize="0.9rem" fontWeight="600">
                    {value}%
                  </text>
                );
              }}
            >
              {OIL_DATA.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(10,14,20,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff' }}
              itemStyle={{ color: '#fff' }}
              formatter={(value) => [`${value}%`, 'Trữ lượng']}
            />
            <Legend 
              layout="vertical" 
              verticalAlign="middle" 
              align="right"
              wrapperStyle={{ fontSize: '0.85rem', fontWeight: 500, color: '#e8eaf0' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div style={{ position: 'absolute', bottom: 10, right: 15, fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>
        Nguồn: Nước và Dầu mỏ thế giới (Thống kê ước tính)
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   LAYOUT A — Energy (Dầu mỏ)
   Left: big chart | Right: Suez+Hormuz + bullets
═══════════════════════════════════════════ */
function EnergyLayout({ data }) {
  const { subtitle, title, card } = data;
  const { accentColor, icon, front, subImages = [], back } = card;

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      width: '100%', height: '100%',
      padding: '1.0rem 2rem 1.0rem', boxSizing: 'border-box',
    }}>
      <CardHeader subtitle={subtitle} title={title} icon={icon} accentColor={accentColor} />

      {/* Headline */}
      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        style={{
          fontSize: '1.2rem', color: accentColor, fontWeight: 700,
          fontStyle: 'italic', textAlign: 'center', lineHeight: 1.4,
          margin: '0 0 0.55rem', flexShrink: 0,
          textShadow: `0 0 20px ${accentColor}45`,
        }}
      >
        {front.headline}
      </motion.p>

      {/* Main 2-col body */}
      <div style={{ display: 'flex', gap: '1.2rem', flex: 1, minHeight: 0 }}>

        {/* Left: Big chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.12 }}
          data-imgbox
          style={{ flex: '0 0 54%', borderRadius: 12, overflow: 'hidden', position: 'relative', background: 'rgba(240,192,64,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          {front.renderChart === 'pie' ? (
            <img
              src="/images/Slide2_The1_1_Graph_dau_mo_Trung_Dong.png"
              alt="Biểu đồ trữ lượng dầu mỏ Trung Đông"
              style={{
                width: '100%', height: '100%',
                objectFit: 'contain',
                display: 'block',
              }}
            />
          ) : (
            <ImgBox
              src={front.image} caption=""
              accentColor={accentColor}
              style={{ height: '100%', borderRadius: 12 }}
            />
          )}
        </motion.div>

        {/* Right: sub-images + bullets */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem', overflow: 'hidden' }}>
          {/* Sub-images side by side */}
          {subImages.length > 0 && (
            <div style={{ display: 'flex', gap: '0.65rem', flexShrink: 0, height: '46%' }}>
              {subImages.map((si, i) => (
                <motion.div
                  key={i} data-imgbox
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.17 + i * 0.07 }}
                  style={{ flex: 1, minWidth: 0 }}
                >
                  <ImgBox
                    src={si.src} caption={si.caption}
                    accentColor={accentColor}
                    style={{ height: '100%', borderRadius: 9 }}
                  />
                </motion.div>
              ))}
            </div>
          )}

          {/* Bullets */}
          <div style={{
            flex: 1, padding: '0.75rem 1rem',
            background: `${accentColor}08`,
            border: `1px solid ${accentColor}20`,
            borderRadius: 10, overflow: 'auto',
          }}>
            <BulletList points={back.points} accentColor={accentColor} delay={0.22} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   LAYOUT B — Religion (Tôn giáo Sunni-Shia)
   Top: 2 maps side-by-side | Bottom: 2-col bullets
═══════════════════════════════════════════ */
function ReligionLayout({ data }) {
  const { subtitle, title, card } = data;
  const { accentColor, icon, front, subImages = [], back } = card;

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      width: '100%', height: '100%',
      padding: '1.0rem 2rem 1.0rem', boxSizing: 'border-box', gap: '0.65rem',
    }}>
      <CardHeader subtitle={subtitle} title={title} icon={icon} accentColor={accentColor} />

      {/* Headline */}
      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        style={{
          fontSize: '1.2rem', color: accentColor, fontWeight: 700,
          fontStyle: 'italic', textAlign: 'center', lineHeight: 1.4,
          margin: 0, flexShrink: 0,
          textShadow: `0 0 20px ${accentColor}45`,
        }}
      >
        {front.headline}
      </motion.p>

      {/* Two maps */}
      <div style={{ display: 'flex', gap: '1.0rem', flex: '0 0 52%', minHeight: 0 }}>
        <motion.div
          data-imgbox
          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.12 }}
          style={{ flex: 1, minWidth: 0, borderRadius: 11, overflow: 'hidden' }}
        >
          <ImgBox
            src={front.image}
            caption="Phân bố Sunni và Shia theo quốc gia"
            accentColor={accentColor}
            style={{ height: '100%', borderRadius: 11 }}
          />
        </motion.div>

        {subImages[0] && (
          <motion.div
            data-imgbox
            initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.17 }}
            style={{ flex: 1, minWidth: 0, borderRadius: 11, overflow: 'hidden' }}
          >
            <ImgBox
              src={subImages[0].src}
              caption={subImages[0].caption}
              accentColor={accentColor}
              style={{ height: '100%', borderRadius: 11 }}
            />
          </motion.div>
        )}
      </div>

      {/* Bullets in 2 columns */}
      <div style={{
        flex: 1,
        padding: '0.75rem 1.2rem',
        background: `${accentColor}08`,
        border: `1px solid ${accentColor}20`,
        borderRadius: 10, overflow: 'auto',
      }}>
        <BulletList points={back.points} accentColor={accentColor} columns={2} delay={0.22} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   LAYOUT C — History (Vết cắt lịch sử)
   Left: big UN partition map | Right: headline + bullets
═══════════════════════════════════════════ */
function HistoryLayout({ data }) {
  const { subtitle, title, card } = data;
  const { accentColor, icon, front, back } = card;

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      width: '100%', height: '100%',
      padding: '1.0rem 2rem 1.0rem', boxSizing: 'border-box',
    }}>
      <CardHeader subtitle={subtitle} title={title} icon={icon} accentColor={accentColor} />

      {/* Main 2-col body */}
      <div style={{ display: 'flex', gap: '1.3rem', flex: 1, minHeight: 0 }}>

        {/* Left: big map */}
        <motion.div
          data-imgbox
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          style={{ flex: '0 0 55%', borderRadius: 12, overflow: 'hidden' }}
        >
          <ImgBox
            src={front.image}
            caption="Kế hoạch phân chia Palestine của LHQ năm 1947"
            accentColor={accentColor}
            style={{ height: '100%', borderRadius: 12 }}
          />
        </motion.div>

        {/* Right: headline + bullets */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem', overflow: 'hidden' }}>
          <motion.div
            initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.12 }}
            style={{
              padding: '0.65rem 0.9rem',
              background: `${accentColor}10`,
              border: `1px solid ${accentColor}28`,
              borderRadius: 10, flexShrink: 0,
            }}
          >
            <p style={{
              fontSize: '1.2rem', color: accentColor, fontWeight: 700,
              fontStyle: 'italic', lineHeight: 1.5, margin: 0,
              textShadow: `0 0 18px ${accentColor}45`,
            }}>
              {front.headline}
            </p>
          </motion.div>

          <div style={{
            flex: 1,
            padding: '0.75rem 1rem',
            background: `${accentColor}07`,
            border: `1px solid ${accentColor}18`,
            borderRadius: 10, overflow: 'auto',
          }}>
            <BulletList points={back.points} accentColor={accentColor} delay={0.18} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Root dispatcher ─── */
export default function SlideDetailCard({ data }) {
  const layout = data?.card?.layout || 'history';

  if (layout === 'energy')   return <EnergyLayout   data={data} />;
  if (layout === 'religion') return <ReligionLayout data={data} />;
  return <HistoryLayout data={data} />;
}
