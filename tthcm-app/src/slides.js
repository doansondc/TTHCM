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
  // S2a — Địa Chính Trị & Tài Nguyên
  // ─────────────────────────────────────────────
  {
    id: 's2a',
    bg: 'https://images.unsplash.com/photo-1569012871812-f38ee64cd54c?auto=format&fit=crop&w=1920&q=80',
    type: 'detail-card',
    data: {
      subtitle: 'Nguyên Nhân Lõi — 1/3',
      title: 'Địa Chính Trị & Tài Nguyên',
      card: {
        title: 'Địa Chính Trị & Tài Nguyên',
        icon: '🛢️',
        accentColor: '#f0c040',
        layout: 'energy',
        front: {
          headline: 'Tài sản chiến lược quan trọng nhất thế giới',
          renderChart: 'pie',
        },
        subImages: [
          { src: '/images/Kenh_dao_Suez.webp', caption: 'Kênh đào Suez — giảm chi phí lưu thông đường biển' },
          { src: '/images/Eo_bien_Hormuz.jpg', caption: 'Eo biển Hormuz — cửa ngõ xuất khẩu dầu mỏ' },
        ],
        back: {
          points: [
            'Sở hữu trữ lượng dầu mỏ & khí đốt khổng lồ, quyết định an ninh năng lượng toàn cầu.',
            'Kênh đào Suez: tạo nên để giảm chi phí lưu thông đường biển, rút ngắn hàng nghìn km.',
            'Eo biển Hormuz: cửa ngõ vận chuyển dầu mỏ từ Vịnh Ba Tư ra bên ngoài.',
          ],
        },
      },
    },
    mobileSummary: 'Nguyên nhân 1/3 — Địa chính trị: Dầu mỏ, Kênh Suez và Eo biển Hormuz.',
  },

  // ─────────────────────────────────────────────
  // S2b — Xung Đột Tôn Giáo Sunni-Shia
  // ─────────────────────────────────────────────
  {
    id: 's2b',
    bg: 'https://images.unsplash.com/photo-1569012871812-f38ee64cd54c?auto=format&fit=crop&w=1920&q=80',
    type: 'detail-card',
    data: {
      subtitle: 'Nguyên Nhân Lõi — 2/3',
      title: 'Xung Đột Tôn Giáo',
      card: {
        title: 'Xung Đột Tôn Giáo',
        icon: '☪️',
        accentColor: '#60a5fa',
        layout: 'religion',
        front: {
          headline: '1300 năm phân chia Sunni — Shia',
          image: '/images/Shunni_Shia.avif',
        },
        subImages: [
          { src: '/images/Shunn_Shia_2.avif', caption: 'Phân bố Sunni và Shia chi tiết tại Trung Đông' },
        ],
        back: {
          points: [
            'Phái Sunni ưu tiên chọn lãnh đạo bằng sự đồng thuận của cộng đồng.',
            'Phái Shia khẳng định lãnh đạo phải thuộc huyết thống trực hệ của Thiên sứ Muhammad.',
            'Thánh địa Jerusalem — giao điểm thiêng liêng của Do Thái giáo, Hồi giáo và Kitô giáo.',
            'Mỗi cuộc bầu cử, mỗi cuộc xung đột đều bị bóng ma tôn giáo 13 thế kỷ chi phối.',
          ],
        },
      },
    },
    mobileSummary: 'Nguyên nhân 2/3 — Tôn giáo: 1300 năm chia rẽ Sunni–Shia và Jerusalem.',
  },

  // ─────────────────────────────────────────────
  // S2c — Vết Cắt Lịch Sử
  // ─────────────────────────────────────────────
  {
    id: 's2c',
    bg: 'https://images.unsplash.com/photo-1569012871812-f38ee64cd54c?auto=format&fit=crop&w=1920&q=80',
    type: 'detail-card',
    data: {
      subtitle: 'Nguyên Nhân Lõi — 3/3',
      title: 'Vết Cắt Lịch Sử',
      card: {
        title: 'Vết Cắt Lịch Sử',
        icon: '🗺️',
        accentColor: '#f87171',
        layout: 'history',
        front: {
          headline: 'Thoả ước Sykes-Picot 1916 & Kế hoạch phân chia LHQ 1947',
          image: '/images/UN_chia_cat_Palestine.webp',
        },
        back: {
          points: [
            'Anh và Pháp sau Thế chiến I dùng thước kẻ phân chia Trung Đông theo lợi ích thực dân.',
            'Đường biên giới thẳng tắp phớt lờ ranh giới dân tộc — nhét các sắc tộc thù địch vào chung 1 quốc gia.',
            'Iraq, Syria, Lebanon ngày nay vẫn đang trả giá cho sai lầm địa chính trị 100 năm trước.',
          ],
        },
      },
    },
    mobileSummary: 'Nguyên nhân 3/3 — Lịch sử: Sykes-Picot 1916 và kế hoạch phân chia LHQ 1947.',
  },

  // ─────────────────────────────────────────────
  // S3 — Israel & Palestine → 2 Flip Cards
  // ─────────────────────────────────────────────
  {
    id: 's3',
    bg: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1920&q=80',
    type: 'static-cards',
    data: {
      subtitle: 'Mặt Trận Khốc Liệt',
      title: 'Động Cơ Của Israel & Palestine',
      intro: 'Nguyên nhân cốt lõi của xung đột là tranh chấp lãnh thổ và quyền tự quyết giữa người Do Thái và Ả Rập trên cùng một vùng đất. Sau World War II, United Nations đưa ra kế hoạch chia vùng năm 1947 nhưng bị phía Ả Rập bác bỏ, dẫn đến chiến tranh và sự ra đời của Israel năm 1948, khiến nhiều người Palestine mất đất và trở thành tị nạn. Xung đột kéo dài đến nay do các tranh chấp chưa được giải quyết về lãnh thổ, quy chế Jerusalem, người tị nạn và các vòng bạo lực trả đũa liên tục.',
      cards: [
        {
          title: 'Israel 🇮🇱',
          icon: '🔯',
          accentColor: '#60a5fa',
          front: {
            headline: 'Bảo vệ Nhà nước Do Thái duy nhất',
            image: '/images/Slide5_The1_Israel.jpg',
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
            image: '/images/Slide5_The_2_Palestine.jpg',
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
  // S3b — Mâu Thuẫn Iran & Arab Saudi (Mới)
  // ─────────────────────────────────────────────
  {
    id: 's3b',
    bg: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80',
    type: 'static-cards',
    data: {
      subtitle: 'Cạnh Tranh Khu Vực',
      title: 'Mâu Thuẫn Iran & Arab Saudi',
      intro: 'Xung đột giữa Iran và Saudi Arabia chủ yếu là cạnh tranh quyền lực khu vực (ai lãnh đạo Trung Đông), kết hợp với mâu thuẫn tôn giáo (Shia vs Sunni) và lợi ích chính trị–kinh tế. Hai bên hiếm khi đánh trực tiếp mà thường đối đầu gián tiếp (proxy war) ở Syria, Yemen — mỗi bên ủng hộ phe khác nhau để mở rộng ảnh hưởng.',
      cards: [
        {
          title: 'Nguyên nhân chung',
          icon: '⚔️',
          accentColor: '#f0c040',
          front: {
            headline: 'Proxy war kéo dài hàng thập kỷ',
            image: '/images/slide6_the1_war.jpg',
          },
          back: {
            points: [
              'Cạnh tranh vị thế "lãnh đạo Trung Đông" kết hợp xung đột Shia (Iran) vs Sunni (Saudi).',
              'Proxy war tại Syria và Yemen: mỗi bên hậu thuẫn phe đối lập để giành ảnh hưởng.',
              'Căng thẳng leo thang do tấn công quân sự và tranh chấp năng lượng quanh eo biển Hormuz.',
            ],
          },
        },
        {
          title: 'Động cơ của Iran 🇯🇷',
          icon: '⚛️',
          accentColor: '#34d97b',
          front: {
            headline: '"Trăng lưỡi liềm Shia" — vươn tới các nước láng giềng',
            image: '/images/Slide6_The2_Iran.webp',
          },
          back: {
            points: [
              'Muốn phá vỡ sự cô lập của phương Tây, xuất khẩu cách mạng Hồi giáo Shia.',
              'Gia tăng ảnh hưởng qua "Trục Kháng chiến": Iraq, Syria, Lebanon (Hezbollah), Yemen (Houthi).',
              'Chương trình hạt nhân là đòn bẩy ngoại giao tối thượng với phương Tây.',
            ],
          },
        },
        {
          title: 'Động cơ của Arab Saudi 🇸🇦',
          icon: '👑',
          accentColor: '#f0c040',
          front: {
            headline: 'Bảo vệ vị thế lãnh đạo thế giới Hồi giáo',
            image: '/images/Slide6_The3_Arab.jpg',
          },
          back: {
            points: [
              'Bảo vệ vị thế là lãnh đạo thế giới Hồi giáo (Sunni) trước sự bành trướng của Iran.',
              'Ngăn chặn "Trăng lưỡi liềm Shia" lan sang vùng Vịnh Ba Tư.',
              'Bảo vệ an ninh các mỏ dầu khổng lồ — nguồn sống của nền kinh tế 1.000 tỷ USD.',
            ],
          },
        },
      ],
    },
    mobileSummary: 'Phần 2b — Mâu thuẫn Iran & Arab Saudi: proxy war Syria, Yemen và cạnh tranh quyền lực khu vực.',
  },


  {
    id: 's4',
    bg: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=1920&q=80',
    type: 'static-cards',
    data: {
      subtitle: 'Cán Cân Siêu Cường',
      title: 'Động Cơ Của Iran & Mỹ — Cuộc Chiến Ủy Nhiệm',
      intro: 'Xung đột giữa Iran và United States bắt nguồn từ mất lòng tin lịch sử và đối đầu chính trị: Mỹ từng can thiệp vào Iran (đặc biệt là đảo chính 1953), còn sau Iranian Revolution, Iran trở thành chế độ chống Mỹ mạnh mẽ. Căng thẳng leo thang do chương trình hạt nhân của Iran, các lệnh trừng phạt của Mỹ và cạnh tranh ảnh hưởng ở Trung Đông. Xung đột còn bị đẩy cao bởi đối đầu quân sự trực tiếp và nguy cơ chiến tranh, đặc biệt liên quan đến hạt nhân và kiểm soát eo biển Hormuz.',
      cards: [
        {
          title: 'Iran 🇮🇷',
          icon: '⚛️',
          accentColor: '#34d97b',
          front: {
            headline: '"Phòng thủ chủ động" — chiến đấu ngoài biên giới',
            image: '/images/Slide7_The1_Iran.webp',
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
            image: '/images/Slide7_The2_US.avif',
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
      desc: 'Bối cảnh: Xung đột Iran–Mỹ–Israel vừa bùng phát. Chọn lãnh đạo để bắt đầu — bốc thăm thành viên nhập vai.',
      cards: [
        {
          country: 'Hoa Kỳ', flag: '🇺🇸',
          leader: 'Tổng thống Mỹ — Donald Trump',
          leaderName: 'Donald Trump',
          leaderImage: '/images/Donald_Trump.webp',
          accentColor: '#60a5fa',
          question: 'Tại sao Mỹ tấn công Iran trong lúc đang đàm phán hạt nhân?',
          options: [
            {
              label: '"Chúng ta đã cho Iran đủ cơ hội — 5 vòng đàm phán thất bại, đã đến lúc dùng sức mạnh."',
              type: 'hypo',
              result: '🔮 Hệ quả: Nếu Trump chọn lý do này, ông sẽ mất ưu thế đạo đức vì tự thừa nhận phá vỡ đàm phán đang tiến triển. Áp lực nội địa và quốc tế sẽ lớn hơn nhiều.',
            },
            {
              label: '"Iran đang đàm phán để câu giờ — tôi có bằng chứng tình báo họ sắp tấn công trước. Chúng ta không thể chờ."',
              type: 'fact',
              result: '🔮 Hệ quả: Đây là lập trường thực tế của Trump. Ông tuyên bố Iran "sẽ tấn công trước" và CIA xác nhận vị trí họp của Khamenei. Chiến tranh nổ ra. Tuy nhiên, Lầu Năm Góc sau đó nói với Quốc hội rằng không có bằng chứng Iran chuẩn bị tấn công trước.',
            },
            {
              label: '"Netanyahu (Israel) thuyết phục tôi — ông ấy có thông tin tình báo quan trọng mà tôi không thể bỏ qua."',
              type: 'hypo',
              result: '🔮 Hệ quả: Trump thực tế phủ nhận điều này, nói "Tôi có thể đã kéo Israel vào chứ không phải ngược lại." Việc thừa nhận bị Netanyahu dẫn dắt sẽ làm suy yếu hình ảnh "lãnh đạo mạnh mẽ" của ông.',
            },
          ],
        },
        {
          country: 'Israel', flag: '🇮🇱',
          leader: 'Thủ tướng Israel — Benjamin Netanyahu',
          leaderName: 'Benjamin Netanyahu',
          leaderImage: '/images/Netanyahu.jpg',
          accentColor: '#a78bfa',
          question: 'Israel và Mỹ tấn công Iran trong lúc đàm phán. Netanyahu giải thích thế nào?',
          options: [
            {
              label: '"Chúng tôi có bằng chứng Iran chuẩn bị tấn công Israel trước trong vòng 48 giờ."',
              type: 'hypo',
              result: '🔮 Hệ quả: Không có tuyên bố này từ Netanyahu. IAEA và nhiều chuyên gia cũng không xác nhận Iran có kế hoạch tấn công trước. Tuyên bố này nếu sai sẽ là thảm họa ngoại giao cho Israel.',
            },
            {
              label: '"Tôi đã thuyết phục Trump — đây là quyết định chung và hoàn toàn đúng đắn."',
              type: 'hypo',
              result: '🔮 Hệ quả: Netanyahu thực tế không thừa nhận "thuyết phục Trump" mà nhấn mạnh "phối hợp sâu". Trump cũng phủ nhận bị Netanyahu kéo vào chiến tranh. Cả hai đều cố giữ hình ảnh "chủ động".',
            },
            {
              label: '"Đây là tự vệ phòng ngừa — Iran đang tích lũy đủ uranium để làm bom trong vài tháng. Chúng tôi không thể chờ."',
              type: 'fact',
              result: '🔮 Hệ quả: Đúng với thực tế. Netanyahu gọi đây là "tấn công phòng ngừa" nhằm loại bỏ "hai mối đe dọa sinh tồn" — hạt nhân và tên lửa. Ông tuyên bố Iran đã bị "tàn phá hoàn toàn" về năng lực hạt nhân.',
            },
          ],
        },
        {
          country: 'Iran', flag: '🇮🇷',
          leader: 'Lãnh tụ Tối cao — Ali Khamenei',
          leaderName: 'Ali Khamenei',
          leaderImage: '/images/Ali_Khamenei_Iran.webp',
          accentColor: '#34d97b',
          context: 'Gaza bị tàn phá sau 2+ năm chiến tranh, hơn 75.000 người thiệt mạng, Hamas suy yếu nghiêm trọng.',
          question: 'Iran tấn công Saudi Arabia dù vừa bình thường hóa quan hệ. Tehran giải thích thế nào?',
          options: [
            {
              label: '"Saudi Arabia là kẻ thù — họ đã để Mỹ dùng lãnh thổ tấn công chúng tôi, xứng đáng bị trừng phạt."',
              type: 'hypo',
              result: '🔮 Hệ quả: Iran thực tế tránh tuyên bố này vì cần giữ kênh ngoại giao với Saudi. Nếu coi Saudi là kẻ thù, Iran sẽ cô lập hoàn toàn trong khu vực và mất mọi khả năng đàm phán thoát khỏi chiến tranh.',
            },
            {
              label: '"Chúng tôi chỉ nhắm vào căn cứ Mỹ — thiệt hại dân sự Saudi là ngoài ý muốn và chúng tôi xin lỗi."',
              type: 'fact',
              result: '🔮 Hệ quả: Đúng với thực tế. Pezeshkian xin lỗi các nước vùng Vịnh về thiệt hại dân sự — bước đi hiếm có. Iran liên tục nhấn mạnh mục tiêu là "căn cứ Mỹ và Israel" chứ không phải Saudi.',
            },
            {
              label: '"Chúng tôi không tấn công Saudi Arabia — đây là tin giả của Mỹ và Israel."',
              type: 'hypo',
              result: '🔮 Hệ quả: Không thể phủ nhận vì có quá nhiều bằng chứng. Iran thực tế xác nhận đã tấn công "các căn cứ kẻ thù trong khu vực" — chỉ cố phân biệt mục tiêu quân sự vs dân sự.',
            },
          ],
        },
        {
          country: 'Arab Saudi', flag: '🇸🇦',
          leader: 'Thái tử — Mohammed bin Salman (MBS)',
          leaderName: 'Mohammed bin Salman',
          leaderImage: '/images/Slide8-the4-arabsaudi.jpg',
          accentColor: '#f0c040',
          question: 'Báo cáo cho thấy MBS đã vận động Trump tấn công Iran. MBS phản hồi thế nào?',
          options: [
            {
              label: '"Đúng, tôi đã thuyết phục Trump vì đây là cơ hội lịch sử để loại bỏ Iran."',
              type: 'hypo',
              result: '🔮 Hệ quả: Thú nhận này sẽ là thảm họa ngoại giao cho Saudi. Sẽ khiến Saudi trở thành mục tiêu trực tiếp của Iran và mất uy tín với các nước Hồi giáo đang ủng hộ Palestine.',
            },
            {
              label: '"Tôi không bình luận về thông tin chưa xác nhận. Saudi Arabia ủng hộ loại trừ đe dọa hạt nhân nhưng không tham chiến."',
              type: 'fact',
              result: '🔮 Hệ quả: Đây là cách MBS thực tế xử lý — không xác nhận, không phủ nhận. Saudi tiếp tục khẳng định không để lãnh thổ dùng để tấn công Iran, dù nhiều báo cáo nói ngược lại.',
            },
            {
              label: '"Israel đã lừa cả tôi và Trump — chúng tôi đều là nạn nhân của Netanyahu."',
              type: 'hypo',
              result: '🔮 Hệ quả: Không xảy ra. Saudi Arabia và Israel đang trong tiến trình xích lại gần nhau. Đổ lỗi cho Israel sẽ phá vỡ hoàn toàn tiến trình bình thường hóa mà MBS đã đầu tư nhiều năm.',
            },
          ],
        },
        {
          country: 'Palestine', flag: '🇵🇸',
          leader: 'Chủ tịch Palestine — Mahmoud Abbas',
          leaderName: 'Mahmoud Abbas',
          leaderImage: '/images/Abbas_Palestine.jpg',
          accentColor: '#34d97b',
          context: 'Gaza bị tàn phá sau 2+ năm chiến tranh, hơn 75.000 người thiệt mạng, Hamas suy yếu nghiêm trọng.',
          question: 'Iran — nhà tài trợ chính của Hamas — đang bị tấn công nặng nề. Hamas phản ứng thế nào?',
          options: [
            {
              label: '"Hamas sẽ mở mặt trận thứ hai tấn công Israel để giúp Iran giảm áp lực."',
              type: 'hypo',
              result: '🔮 Hệ quả: Hamas không còn khả năng quân sự để mở chiến dịch lớn. Hầu hết cơ sở hạ tầng quân sự bị phá hủy. Hành động này sẽ chỉ dẫn đến thêm thiệt hại cho người dân Gaza.',
            },
            {
              label: '"Đây là cơ hội — trong khi Mỹ và Israel bận với Iran, Hamas có thể đàm phán vị thế tốt hơn ở Gaza."',
              type: 'hypo',
              result: '🔮 Hệ quả: Thực tế ngược lại: cuộc chiến Iran làm giảm áp lực quốc tế lên Israel ở Gaza vì sự chú ý chuyển hướng. Hamas mất đi nhà tài trợ và đồng minh quan trọng nhất.',
            },
            {
              label: '"Chúng tôi đoàn kết với Iran. Cuộc đấu tranh Palestine không phụ thuộc vào một nhà tài trợ — ý chí của người Palestine không thể bị đánh bại."',
              type: 'fact',
              result: '🔮 Hệ quả: Đúng với lập trường Hamas: bày tỏ đoàn kết với Iran nhưng nhấn mạnh tính độc lập của phong trào. Thực tế Hamas đang trong tình trạng rất suy yếu sau 2 năm chiến tranh với Israel.',
            },
          ],
        },
      ],
    },
    mobileSummary: 'Phần 4 — Nhập vai 5 lãnh đạo: Trump, Netanyahu, Khamenei, MBS, Abbas. Chọn lập trường đúng!',
  },


  // ─────────────────────────────────────────────
  // S6 — 3 Kịch bản tương lai
  // ─────────────────────────────────────────────
  {
    id: 's6',
    bg: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80',
    type: 'static-cards',
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
            image: '/images/slide9_the1.webp',
          },
          back: {
            points: [
              'Iran tấn công Israel trực tiếp, Mỹ can thiệp quân sự toàn lực.',
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
            image: '/images/slide9_the2.jpg',
          },
          back: {
            points: [
              'Các bên "đánh để dằn mặt", không leo thang toàn diện.',
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
            image: '/images/slide9_the3.png',
          },
          back: {
            points: [
              'Sức ép quốc tế buộc toàn bộ các bên xuống thang và ngồi vào bàn đàm phán.',
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
      contextBlocks: [
        {
          flag: '🕌',
          label: 'Trung Đông',
          color: '#f87171',
          text: 'Vị trí ngã ba châu lục (Á – Âu – Phi) và là "rốn dầu" của thế giới, khiến nơi đây trở thành bàn cờ cạnh tranh lợi ích khốc liệt của các cường quốc, dẫn đến xung đột dai dẳng.',
        },
        {
          flag: '🇻🇳',
          label: 'Việt Nam',
          color: '#f0c040',
          text: 'Nằm ở rìa phía Đông của bán đảo Đông Dương, án ngữ các tuyến đường hàng hải huyết mạch trên Biển Đông nối liền Thái Bình Dương và Ấn Độ Dương. Đây là vị trí "ngã tư đường" của Đông Nam Á.',
        },
      ],
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
      desc: 'Đường lối "ngoại giao cây tre" của Hồ Chí Minh: mềm dẻo, linh hoạt về sách lược nhưng kiên định nguyên tắc độc lập, chủ quyền và lợi ích dân tộc. Kết hợp khéo léo giữa hòa hiếu và kiên quyết, "dĩ bất biến ứng vạn biến" để giữ thế cân bằng trong môi trường quốc tế phức tạp.',
      sections: [
        {
          title: 'Gốc Vững',
          icon: '🌱',
          color: '#34d97b',
          headline: 'Mục tiêu trường tồn: Độc lập — Tự chủ',
          image: '/images/slide12_the1.jpg',
          points: [
            'Kiên định mục tiêu độc lập dân tộc và chủ nghĩa xã hội.',
            'Lợi ích quốc gia — dân tộc luôn trên hết và trước hết.',
            '"Dĩ bất biến, ứng vạn biến" — Kim chỉ nam của Hồ Chí Minh.'
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
          image: '/images/slide12_the3.jpg',
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
      author: 'HỒ CHÍ MINH',
      group: 'Nhóm 5 · Lớp 170263 · SSH1151',
      teacher: 'Giảng viên: Phạm Thị Mai Duyên',
    },
    mobileSummary: 'Cảm ơn bạn đã tham gia! Hẹn gặp lại.',
  },
];
