export const slideData = [
  // ─────────────────────────────────────────────
  // S1 — COVER
  // ─────────────────────────────────────────────
  {
    id: 's1',
    bg: 'https://images.unsplash.com/photo-1541379337735-7b99a93985e6?auto=format&fit=crop&w=1920&q=80',
    bgVideo: null,
    type: 'title',
    data: {
      subject: 'Tư Tưởng Hồ Chí Minh · SSH1151',
      classLT: '170263',
      classBT: '170265',
      teacher: 'Phạm Thị Mai Duyên',
      title: 'Bức Tranh Địa Chính Trị Trung Đông',
      subtitle: 'và Bài Học Cho Việt Nam',
      group: 'Nhóm 5',
      members: [
        { name: 'Nguyễn Thị Trà My', id: '202419868' },
        { name: 'Nguyễn Duy Thái',   id: '20232543' },
        { name: 'Đoàn Ngọc Sơn',    id: '20203824' },
        { name: 'Tống Thái Sơn',    id: '20232290' },
        { name: 'Cao Xuân Nam',      id: '20233080' },
        { name: 'Nguyễn Viết Tuấn Minh', id: '20226391' },
        { name: 'Nguyễn Đăng Minh', id: '20221236' },
        { name: 'Đinh Thị Trang Nhung', id: '20221253' },
        { name: 'Hoàng Thị Bé Nhi', id: '20223299' },
      ],
      venue: 'D5-101 · Tuần 32/35',
    },
    // Short summary for Mobile /vote display
    mobileSummary: 'Slide mở đầu — Giới thiệu chủ đề và nhóm thực hiện.',
  },

  // ─────────────────────────────────────────────
  // S2 — Nguyên nhân xung đột → 3 Flip Cards
  // ─────────────────────────────────────────────
  {
    id: 's2',
    bg: 'https://images.unsplash.com/photo-1569012871812-f38ee64cd54c?auto=format&fit=crop&w=1920&q=80',
    type: 'flip-cards',
    data: {
      subtitle: 'Nguồn Gốc Căng Thẳng',
      title: 'Nguyên Nhân Lõi Của Xung Đột',
      cards: [
        {
          title: 'Địa Chính Trị & Tài Nguyên',
          icon: '🛢️',
          accentColor: '#f0c040',
          front: {
            headline: 'Tài sản chiến lược quan trọng nhất thế giới',
            image: 'https://images.pexels.com/photos/1427541/pexels-photo-1427541.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
          },
          back: {
            points: [
              'Sở hữu trữ lượng dầu mỏ & khí đốt khổng lồ, quyết định an ninh năng lượng toàn cầu.',
              'Các tuyến hàng hải huyết mạch: Kênh đào Suez, eo biển Hormuz — cổng họng kinh tế thế giới.',
              'Ai kiểm soát Trung Đông, người đó nắm chìa khóa giá năng lượng toàn hành tinh.',
            ],
          },
        },
        {
          title: 'Xung Đột Tôn Giáo',
          icon: '☪️',
          accentColor: '#60a5fa',
          front: {
            headline: '1300 năm phân chia Sunni — Shia',
            image: '/images/mosque.jpg',
          },
          back: {
            points: [
              'Hệ phái Sunni (Ả Rập Xê-út) vs Shia (Iran) — cuộc chiến quyền lực tôn giáo hơn 13 thế kỷ.',
              'Thánh địa Jerusalem — giao điểm thiêng liêng của Do Thái giáo, Hồi giáo và Kitô giáo.',
              'Mỗi cuộc bầu cử, mỗi cuộc xung đột đều bị bóng ma tôn giáo chi phối.',
            ],
          },
        },
        {
          title: 'Vết Cắt Lịch Sử',
          icon: '🗺️',
          accentColor: '#f87171',
          front: {
            headline: 'Thoả ước Sykes-Picot 1916',
            image: '/images/sykes-picot.jpg',
          },
          back: {
            points: [
              'Anh và Pháp sau Thế chiến I dùng thước kẻ phân chia Trung Đông theo lợi ích thực dân.',
              'Đường biên giới thẳng tắp phớt lờ ranh giới dân tộc — nhét các sắc tộc thù địch vào chung 1 quốc gia.',
              'Iraq, Syria, Lebanon ngày nay vẫn đang trả giá cho sai lầm địa chính trị 100 năm trước.',
            ],
          },
        },
      ],
    },
    mobileSummary: 'Phần 1 — 3 nguyên nhân cốt lõi dẫn đến xung đột tại Trung Đông: Tài nguyên, Tôn giáo, Lịch sử.',
  },

  // ─────────────────────────────────────────────
  // S3 — Israel & Palestine → 2 Flip Cards
  // ─────────────────────────────────────────────
  {
    id: 's3',
    bg: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1920&q=80',
    type: 'flip-cards',
    data: {
      subtitle: 'Mặt Trận Khốc Liệt',
      title: 'Động Cơ Của Israel & Palestine',
      cards: [
        {
          title: 'Israel 🇮🇱',
          icon: '🔯',
          accentColor: '#60a5fa',
          front: {
            headline: 'Bảo vệ Nhà nước Do Thái duy nhất',
            image: 'https://images.unsplash.com/photo-1559598467-f8b76c8155d0?auto=format&fit=crop&w=600&q=80',
          },
          back: {
            points: [
              'Bảo vệ sự tồn vong của nhà nước Do Thái duy nhất giữa vòng vây khối Ả Rập.',
              'Tiêu diệt hoàn toàn năng lực tấn công của Hamas và Hezbollah — Mục tiêu quân sự tối thượng.',
              'Xây dựng vành đai phòng thủ bất khả xâm phạm tại Dải Gaza và Bờ Tây.',
            ],
          },
        },
        {
          title: 'Palestine 🇵🇸',
          icon: '🕌',
          accentColor: '#34d97b',
          front: {
            headline: 'Đấu tranh cho quyền tự quyết dân tộc',
            image: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=600&q=80',
          },
          back: {
            points: [
              'Thiết lập Quốc gia Độc lập với Đông Jerusalem làm thủ đô — mục tiêu 75 năm chưa đạt được.',
              'Khôi phục ranh giới lãnh thổ được LHQ công nhận từ 1967.',
              'Quyền hồi hương hợp pháp cho hàng triệu người tị nạn Palestine trên khắp thế giới.',
            ],
          },
        },
      ],
    },
    mobileSummary: 'Phần 2 — Hai phía xung đột: Israel (bảo vệ tồn vong) và Palestine (giành độc lập).',
  },

  // ─────────────────────────────────────────────
  // S4 — Iran & Mỹ → 2 Flip Cards
  // ─────────────────────────────────────────────
  {
    id: 's4',
    bg: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=1920&q=80',
    type: 'flip-cards',
    data: {
      subtitle: 'Cán Cân Siêu Cường',
      title: 'Động Cơ Của Iran & Mỹ — Cuộc Chiến Ủy Nhiệm',
      cards: [
        {
          title: 'Iran 🇮🇷',
          icon: '⚛️',
          accentColor: '#34d97b',
          front: {
            headline: '"Phòng thủ chủ động" — chiến đấu ngoài biên giới',
            image: 'https://images.unsplash.com/photo-1564625235187-2e97e2acf7c0?auto=format&fit=crop&w=600&q=80',
          },
          back: {
            points: [
              'Học thuyết Phòng thủ Chủ động: Giữ chiến tranh càng xa biên giới càng tốt.',
              'Tài trợ "Trục Kháng chiến": Hezbollah (Lebanon), Houthi (Yemen), Hamas (Gaza).',
              'Con bài hạt nhân và khả năng phong tỏa eo biển Hormuz — đòn răn đe tối thượng.',
            ],
          },
        },
        {
          title: 'Hoa Kỳ 🇺🇸',
          icon: '🦅',
          accentColor: '#60a5fa',
          front: {
            headline: '"Bảo lãnh" cho trật tự Trung Đông',
            image: 'https://images.unsplash.com/photo-1541417904950-b855846fe074?auto=format&fit=crop&w=600&q=80',
          },
          back: {
            points: [
              'Ngăn chặn Iran sở hữu vũ khí hạt nhân bằng mọi giá — ranh giới đỏ không thể vượt qua.',
              'Đảm bảo tự do lưu thông hàng hải và dòng năng lượng ổn định toàn cầu.',
              'Lá chắn phòng không Iron Dome + hỗ trợ vũ khí tối tân vô điều kiện cho Israel.',
            ],
          },
        },
      ],
    },
    mobileSummary: 'Phần 3 — Hai siêu cường: Iran (chiến lược ủy nhiệm) và Mỹ (bảo lãnh trật tự).',
  },

  // ─────────────────────────────────────────────
  // S5 — Roleplay: Nhập vai Lãnh Đạo
  // ─────────────────────────────────────────────
  {
    id: 's5',
    bg: 'https://images.unsplash.com/photo-1480985041486-122d0be52b34?auto=format&fit=crop&w=1920&q=80',
    type: 'roleplay',
    data: {
      subtitle: 'Hoạt Động Tương Tác',
      title: 'Nhập Vai Lãnh Đạo Quốc Gia',
      desc: 'Bấm vào thẻ để nhập vai và đưa ra quyết định lịch sử.',
      cards: [
        {
          country: 'Hoa Kỳ', flag: '🇺🇸', leader: 'Tổng thống Mỹ',
          image: 'https://images.pexels.com/photos/1202723/pexels-photo-1202723.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
          accentColor: '#60a5fa',
          question: 'Iran vừa phóng tên lửa vào căn cứ Mỹ, 100 binh sĩ bị thương. Lệnh của ông?',
          options: [
            { text: 'Phóng Tomahawk san phẳng radar Tây Iran', result: '📌 Phỏng đoán 🤔 — Iran phản kích Tel Aviv, bùng nổ Thế chiến III.' },
            { text: 'Phủ nhận thiệt hại + tăng cấm vận + không kích mạng', result: '📚 Lịch sử! Trump chọn xuống thang sau vụ ám sát Soleimani (01/2020).' },
          ],
        },
        {
          country: 'Israel', flag: '🇮🇱', leader: 'Thủ tướng Israel',
          image: 'https://images.pexels.com/photos/2169011/pexels-photo-2169011.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
          accentColor: '#a78bfa',
          question: '5000 quả rocket Hamas khai hỏa lúc 6:30 sáng. Phản ứng thế nào?',
          options: [
            { text: 'Phản kích phủ đầu diện rộng — chiến dịch Thanh sắt', result: '📚 Lịch sử! Chiến dịch Cây gậy Sắt (10/2023), Israel thề tiêu diệt Hamas.' },
            { text: 'Kêu gọi LHQ, nhượng bộ đàm phán', result: '📌 Phỏng đoán 🤔 — Nội các lật đổ ngay. Israel mất toàn bộ sức răn đe.' },
          ],
        },
        {
          country: 'Iran', flag: '🇮🇷', leader: 'Lãnh tụ Tối cao',
          image: 'https://images.pexels.com/photos/3560044/pexels-photo-3560044.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
          accentColor: '#34d97b',
          question: 'Israel không kích Lãnh sự quán Iran tại Syria, 7 tướng thiệt mạng. Phản đòn?',
          options: [
            { text: 'Cảnh báo 72h trước, phóng 300 UAV & tên lửa "biểu diễn"', result: '📚 Lịch sử! Giữ thể diện mà không cần leo thang — Iran 04/2024.' },
            { text: 'Phóng tên lửa siêu thanh tiêu diệt hệ thống phòng không Israel', result: '📌 Phỏng đoán 🤔 — Mỹ + Israel phản kích phá hủy toàn bộ cơ sở hạt nhân Iran.' },
          ],
        },
        {
          country: 'Ả Rập Xê-út', flag: '🇸🇦', leader: 'Thái tử MBS',
          image: 'https://images.pexels.com/photos/3225529/pexels-photo-3225529.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
          accentColor: '#f0c040',
          question: 'Căng thẳng Vịnh Ba Tư khiến giá dầu lên xuống điên cuồng. Chiến lược dầu mỏ?',
          options: [
            { text: 'Hạ giá dầu tối đa để giúp Mỹ kìm hãm Nga & Iran', result: '📌 Phỏng đoán 🤔 — Ngân sách rỗng, siêu dự án NEOM sụp đổ. Bạo loạn nội địa.' },
            { text: 'Bắt tay OPEC+ cắt giảm sản lượng, bất chấp Mỹ', result: '📚 Lịch sử! Dầu duy trì $80-90, tối đa hóa doanh thu Ả Rập.' },
          ],
        },
        {
          country: 'Palestine', flag: '🇵🇸', leader: 'Chủ tịch Palestine',
          image: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=600&q=80',
          accentColor: '#34d97b',
          question: 'Gaza bị phong tỏa hoàn toàn, người dân thiếu lương thực. Lãnh đạo Hamas đưa ra quyết định?',
          options: [
            { text: 'Tiếp tục kháng chiến vũ trang, từ chối đàm phán vô điều kiện', result: '📚 Lịch sử! Hamas kiên trì lập trường, đổi lại là áp lực quốc tế ngày càng tăng.' },
            { text: 'Đơn phương ngừng bắn, chấp nhận giải pháp 2 nhà nước ngay lập tức', result: '📌 Phỏng đoán 🤔 — Mang lại viện trợ nhưng chia rẽ nội bộ phong trào kháng chiến.' },
          ],
        },
      ],
    },
    mobileSummary: 'Phần 4 — Nhập vai 5 lãnh đạo: Mỹ, Israel, Iran, Ả Rập, Palestine. Chọn quyết định đúng!',
  },

  // ─────────────────────────────────────────────
  // S6 — 3 Kịch bản tương lai
  // ─────────────────────────────────────────────
  {
    id: 's6',
    bg: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80',
    type: 'flip-cards',
    data: {
      subtitle: 'Phân Tích Chuyên Sâu',
      title: 'Ba Kịch Bản Tương Lai Của Trung Đông',
      cards: [
        {
          title: 'Kịch Bản 1: Tổng Lực',
          icon: '💥',
          accentColor: '#f87171',
          front: {
            headline: 'Chiến tranh toàn diện bùng nổ',
            image: 'https://images.unsplash.com/photo-1575997028963-3b7d17c56e18?auto=format&fit=crop&w=600&q=80',
          },
          back: {
            points: [
              'Xác suất xảy ra: THẤP. Iran tấn công Israel trực tiếp, Mỹ can thiệp quân sự.',
              'Hệ thống phòng thủ kiệt quệ, giá dầu vọt 200$/thùng, kinh tế toàn cầu sụp đổ.',
              'Nguy cơ leo thang hạt nhân nếu Israel cảm thấy sự tồn vong bị đe dọa.',
            ],
          },
        },
        {
          title: 'Kịch Bản 2: Giới Hạn',
          icon: '⚠️',
          accentColor: '#f0c040',
          front: {
            headline: 'Xung đột có kiểm soát kéo dài',
            image: 'https://images.unsplash.com/photo-1580130037679-48cff30c23a4?auto=format&fit=crop&w=600&q=80',
          },
          back: {
            points: [
              'Xác suất xảy ra: CAO. Kịch bản thực tế nhất — các bên "đánh để dằn mặt".',
              'Chiến tranh mạng, không kích có chọn lọc, proxy wars kéo dài vô thời hạn.',
              'Chuỗi cung ứng gián đoạn, lạm phát toàn cầu tăng nhưng tránh được thảm họa hạt nhân.',
            ],
          },
        },
        {
          title: 'Kịch Bản 3: Hạ Nhiệt',
          icon: '🕊️',
          accentColor: '#34d97b',
          front: {
            headline: 'Ngoại giao thành công, ngừng bắn',
            image: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=600&q=80',
          },
          back: {
            points: [
              'Xác suất xảy ra: TRUNG BÌNH. Sức ép quốc tế buộc toàn bộ các bên xuống thang.',
              'Thỏa thuận Abraham mở rộng, bình thường hóa quan hệ Ả Rập - Israel.',
              'Giải pháp 2 nhà nước được tái khởi động dưới sự trung gian quốc tế.',
            ],
          },
        },
      ],
    },
    mobileSummary: 'Phần 5 — 3 kịch bản tương lai: Tổng lực (20%), Giới hạn (55%), Hạ nhiệt (25%).',
  },

  // ─────────────────────────────────────────────
  // S7 — Poll Biểu Quyết
  // ─────────────────────────────────────────────
  {
    id: 's7',
    bg: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1920&q=80',
    type: 'poll',
    data: {
      subtitle: 'Mời Khán Giả Tham Gia',
      title: 'Trưng Cầu Ý Dân: Kịch Bản Nào Sẽ Xảy Ra?',
    },
    mobileSummary: 'POLL — Bạn nghĩ Trung Đông sẽ đi về đâu? Hãy bỏ phiếu ngay!',
  },

  // ─────────────────────────────────────────────
  // S8 — Đặc điểm địa lý Việt Nam
  // ─────────────────────────────────────────────
  {
    id: 's8',
    bg: 'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=1920&q=80',
    type: 'geo-layout',
    data: {
      subtitle: 'Quay Về Việt Nam',
      title: 'Đặc Điểm Địa Chính Trị Nước Ta',
      topBlock: {
        icon: '📍',
        title: 'Vị Trí Địa Lý',
        text: 'Nằm ở trung tâm Đông Nam Á — cầu nối Đông Bắc Á và Đông Nam Á. Đường bờ biển dài 3.260km án ngữ Biển Đông, tuyến hàng hải nhộn nhịp chiếm 30% thương mại toàn cầu.',
      },
      bottomLeft: {
        icon: '🌟',
        title: 'Lợi Thế',
        color: '#34d97b',
        points: [
          'Kinh tế biển và logistics quốc tế phát triển mạnh.',
          'Thu hút FDI lớn nhờ vị trí địa chiến lược.',
          'Hợp tác an ninh đa phương với nhiều cường quốc.',
        ],
      },
      bottomRight: {
        icon: '⚠️',
        title: 'Rủi Ro',
        color: '#f87171',
        points: [
          'Tâm điểm cạnh tranh chiến lược Mỹ — Trung.',
          'Áp lực bảo vệ chủ quyền Biển Đông liên tục.',
          'Nguy cơ bị kéo vào vòng xoáy địa chính trị.',
        ],
      },
    },
    mobileSummary: 'Phần 6 — Vị trí địa lý VN: Lợi thế kinh tế biển vs rủi ro địa chính trị.',
  },

  // ─────────────────────────────────────────────
  // S9 — Đường lối Cây Tre → SlideBamboo
  // ─────────────────────────────────────────────
  {
    id: 's9',
    bg: 'https://images.unsplash.com/photo-1516214104703-d870798883c5?auto=format&fit=crop&w=1920&q=80',
    type: 'bamboo-diplomacy',
    data: {
      subtitle: 'Chiến Lược Đảng & Nhà Nước',
      title: 'Đường Lối "Ngoại Giao Cây Tre"',
      sections: [
        {
          title: 'Gốc Vững',
          icon: '🌱',
          color: '#34d97b',
          headline: 'Mục tiêu trường tồn: Độc lập — Tự chủ',
          image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80',
          points: [
            'Kiên định mục tiêu độc lập dân tộc và chủ nghĩa xã hội.',
            'Lợi ích quốc gia — dân tộc luôn trên hết và trước hết.',
            '"Dĩ bất biến, ứng vạn biến" — Kim chỉ nam của Cụ Hồ.'
          ]
        },
        {
          title: 'Cành Uyển Chuyển',
          icon: '🍃',
          color: '#60a5fa',
          headline: 'Linh hoạt: Đa phương — Cởi mở',
          image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&w=600&q=80',
          points: [
            'Đa phương hóa, đa dạng hóa quan hệ đối ngoại.',
            'Việt Nam là bạn, đối tác tin cậy vững chắc.',
            'Tranh thủ tối đa nguồn lực bên ngoài.'
          ]
        },
        {
          title: 'Bốn Không',
          icon: '🛡️',
          color: '#f0c040',
          headline: 'Quốc phòng độc lập tuyệt đối',
          image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=600&q=80',
          points: [
            'Không tham gia liên minh quân sự chống nước khác.',
            'Không cho nước ngoài đặt căn cứ quân sự.',
            'Không sử dụng / đe dọa vũ lực.'
          ]
        }
      ],
    },
    mobileSummary: 'Phần 7 — Ngoại giao Cây tre: Gốc vững (kiên định), Cành uyển chuyển (linh hoạt), Bốn Không.',
  },

  // ─────────────────────────────────────────────
  // S10 — Bài học 1-5 (gộp từ S10+S11)
  // ─────────────────────────────────────────────
  {
    id: 's10',
    bg: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1920&q=80',
    type: 'lessons',
    data: {
      subtitle: 'Bài Học Xương Máu',
      title: 'Rút Ra Từ Thảm Kịch Trung Đông',
      lessons: [
        {
          number: '01', icon: '🔗', color: '#f87171',
          headline: 'Tự Chủ Tuyệt Đối',
          text: '\"Chọn phe\" đồng nghĩa biến lãnh thổ thành chiến trường ủy nhiệm. \"Đem sức ta mà tự giải phóng cho ta\" — lời Bác.',
          image: 'https://images.unsplash.com/photo-1569162942170-6f0b5ca9e28e?auto=format&fit=crop&w=600&q=80'
        },
        {
          number: '02', icon: '⚖️', color: '#60a5fa',
          headline: 'Giải Quyết Bằng Hòa Bình',
          text: 'Bạo lực chỉ tạo vòng xoáy. Mọi tranh chấp Biển Đông phải dựa vào Luật pháp Quốc tế & UNCLOS 1982.',
          image: 'https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?auto=format&fit=crop&w=600&q=80'
        },
        {
          number: '03', icon: '📈', color: '#34d97b',
          headline: 'Giữ Vững Nội Lực Kinh Tế',
          text: 'Đa dạng hóa thị trường, tự chủ năng lượng và an ninh lương thực là tuyến phòng thủ thực sự của quốc gia.',
          image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80'
        },
        {
          number: '04', icon: '🤝', color: '#a78bfa',
          headline: 'Kiểm Soát Bất Ổn Nội Bộ',
          text: 'Sụp đổ Trung Đông bắt nguồn từ chia rẽ nội bộ. Xây dựng đại đoàn kết và phát triển bao trùm là lá chắn kiên cố nhất.',
          image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80'
        },
        {
          number: '05', icon: '🧭', color: '#f0c040',
          headline: 'Biến Rủi Ro Thành Đòn Bẩy',
          text: 'Việt Nam tận dụng triệt để vị thế địa lý Biển Đông (kinh tế biển, du lịch, logistics) thay vì để bị thao túng chiến lược.',
          image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80'
        }
      ],
    },
    mobileSummary: 'Phần 8 — 5 bài học từ thảm kịch Trung Đông cho Việt Nam.',
  },

  // ─────────────────────────────────────────────
  // S12 — Dynamic Ending
  // ─────────────────────────────────────────────
  {
    id: 's12',
    bg: 'none',
    type: 'dynamic-ending',
    data: {
      subtitle: 'Tổng Kết Theo Ý Dân',
      title: 'Kết Cục Do Khán Phòng Quyết Định',
    },
    mobileSummary: 'Slide cuối — Tổng kết biểu quyết. Hãy chắc chắn bạn đã vote!',
  },

  // ─────────────────────────────────────────────
  // S13 — Q&A
  // ─────────────────────────────────────────────
  {
    id: 's13',
    bg: 'none',
    type: 'qa-board',
    data: {
      subtitle: 'Hỏi & Đáp',
      title: 'Câu Hỏi Từ Khán Giả',
    },
    mobileSummary: 'Q&A — Câu hỏi của bạn đang được xử lý. Vui lòng chờ phản hồi!',
  },

  // ─────────────────────────────────────────────
  // S14 — Lucky Wheel
  // ─────────────────────────────────────────────
  {
    id: 's14',
    bg: 'none',
    type: 'lucky-wheel',
    data: {
      subtitle: 'Bốc Thăm Ngẫu Nhiên',
      title: 'Ai Sẽ Là Người Được Chọn?',
    },
    mobileSummary: 'Bốc thăm từ danh sách người đặt câu hỏi — Hãy theo dõi màn hình lớn!',
  },

  // ─────────────────────────────────────────────
  // S15 — Lời kết
  // ─────────────────────────────────────────────
  {
    id: 's15',
    bg: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=1920&q=80',
    type: 'outro',
    data: {
      subtitle: 'Kết Thúc Buổi Thảo Luận',
      title: 'Xin Chân Thành Cảm Ơn!',
      quote: '"Không có gì quý hơn Độc lập — Tự do"',
      author: '— Hồ Chí Minh',
      group: 'Nhóm 5 · Lớp 170263 · SSH1151',
      teacher: 'Giảng viên: Phạm Thị Mai Duyên',
    },
    mobileSummary: 'Cảm ơn bạn đã tham gia! Hẹn gặp lại.',
  },
];
