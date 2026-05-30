# 🎭 Kịch Bản Thuyết Trình — 40 Phút (v3)
## Nhóm 5 · SSH1151 · Bức Tranh Địa Chính Trị Trung Đông & Bài Học Cho Việt Nam

> **Thời lượng:** 40 phút · **Số người:** 4  
> **Quà tặng:** 6 món quà nhỏ (trao ngay cho người trả lời quiz đúng & nhanh nhất)  
> **Địa điểm:** D5-101 · Tuần 32/35 · **GVHD:** Phạm Thị Mai Duyên

---

## I. PHÂN CÔNG VAI TRÒ — 4 NGƯỜI

| Vai trò | Người | Mô tả |
|---------|-------|-------|
| 🎤 **Speaker Chính** | **Nguyễn Thị Trà My** | Dẫn chương trình + thuyết trình phần Trung Đông (S2–S6). Tự cầm laptop, tự chuyển slide, tự lật card, tự click roleplay. |
| 📢 **Speaker Phụ** | **Đoàn Ngọc Sơn** | Thuyết trình phần Việt Nam (S8, S9, S10). Khi đến lượt, nhận laptop từ Trà My, tự điều khiển slide. |
| 🛡️ **Trực Q&A** | **Nguyễn Duy Thái** | Laptop riêng mở `/admin`. Suốt buổi: trả lời câu hỏi khán giả qua tab ❓, pin câu hỏi hay lên màn chiếu, gõ trả lời push về mobile. |
| 🎛️ **Trực Hệ Thống** | **Tống Thái Sơn** | Laptop/tablet riêng mở `/admin`. Suốt buổi: phát quiz, chốt kết quả, monitor users, xử lý spam/block, quản lý poll. |

> [!IMPORTANT]
> **Speaker tự điều khiển slide** — không cần người bấm hộ. Phím `→`/`Space` chuyển slide, click thẻ để lật, click option roleplay. Toolbar hiện khi di chuột xuống đáy.

### Sơ đồ vị trí trong phòng:

```
┌─────────────────────────────────────────────────────┐
│                    MÀN CHIẾU                         │
│              (laptop Speaker cắm HDMI)                │
├─────────────────────────────────────────────────────┤
│                                                       │
│   🎤 Speaker (đứng/ngồi, cầm laptop hoặc để bàn)     │
│                                                       │
│   ┌──────────┐  ┌──────────┐                          │
│   │ 🛡️ Thái  │  │ 🎛️ T.Sơn │  ← 2 laptop admin      │
│   │ Trực Q&A │  │ Trực HT  │    (ngồi gần nhau)      │
│   └──────────┘  └──────────┘                          │
│                                                       │
│                 KHÁN GIẢ (quét QR điện thoại)         │
└─────────────────────────────────────────────────────┘
```

---

## II. HỆ THỐNG — THÔNG TIN TRUY CẬP

| Trang | URL | Đăng nhập |
|-------|-----|-----------|
| **Màn chiếu** | `doanson.id.vn` | PIN **`115100`** |
| **Khán giả** | `doanson.id.vn/vote` | MSSV + Mã Mời 4 số (Ví dụ: **`1234`**) |
| **Admin** | `doanson.id.vn/admin` | Mã **`202600`** |

---

## III. 6 CÂU QUIZ TƯƠNG TÁC — TRAO QUÀ NGAY

> [!TIP]
> Mỗi phần nội dung kết thúc bằng 1 câu quiz. Hệ thống tự xếp hạng ai đúng + nhanh nhất. **Trao quà ngay** cho người đứng #1. Chuẩn bị **6 món quà nhỏ** trước buổi.

| Quiz # | Sau slide | Câu hỏi | Đáp án |
|--------|-----------|---------|--------|
| **Q1** | S2 (Nguyên nhân) | *"Thỏa ước nào năm 1916 đã chia cắt Trung Đông theo lợi ích thực dân Anh-Pháp?"* | A. Versailles · **B. Sykes-Picot ✅** · C. Camp David · D. Oslo |
| **Q2** | S3 (Israel-Palestine) | *"Palestine đấu tranh thiết lập quốc gia với thủ đô ở đâu?"* | A. Bethlehem · B. Ramallah · **C. Đông Jerusalem ✅** · D. Gaza |
| **Q3** | S4 (Iran-Mỹ) | *"Iran sử dụng lực lượng ủy nhiệm nào tại Lebanon?"* | A. Hamas · **B. Hezbollah ✅** · C. Houthi · D. Taliban |
| **Q4** | S6 (Kịch bản) | *"Trong 3 kịch bản tương lai, kịch bản nào được đánh giá xác suất CAO nhất?"* | A. Tổng lực · **B. Xung đột giới hạn ✅** · C. Hạ nhiệt · D. Chiến tranh hạt nhân |
| **Q5** | S9 (Cây Tre) | *"'Bốn Không' gồm: Không liên minh quân sự, Không căn cứ nước ngoài, Không vũ lực, và?"* | A. Không tham gia LHQ · **B. Không đứng về bên này chống bên kia ✅** · C. Không xuất khẩu vũ khí · D. Không quan hệ nước lớn |
| **Q6** | S10 (Bài học) | *"Theo tư tưởng HCM, câu nói 'Đem sức ta mà tự giải phóng cho ta' nhấn mạnh bài học nào?"* | A. Hòa bình · **B. Tự chủ tuyệt đối ✅** · C. Đoàn kết · D. Kinh tế |

### Quy trình phát quiz (T.Sơn làm):
```
1. Tab 📝 → Click "🚀 Phát Sóng" trên câu quiz đã chuẩn bị sẵn
2. → Tất cả điện thoại tự hiện overlay + timer đếm ngược (15 giây)
3. Quan sát bar chart realtime (ai chọn gì)
4. Khi hết giờ → Click "Chốt Kết Quả" → chọn đáp án đúng
5. → Bảng xếp hạng hiện: Người đúng + nhanh nhất = #1
6. Đọc tên cho MC: "[Tên] nhanh nhất! Mời lên nhận quà!"
7. Click "Ẩn" → tiếp tục slide
```

---

## IV. TIMELINE CHI TIẾT — 40 PHÚT

```
  THỜI GIAN          SLIDE    NỘI DUNG                              AI LÀM GÌ              QUÀ
  ────────────────────────────────────────────────────────────────────────────────────────────────

  00:00 → 02:30      S1       Khai mạc + QR đăng ký                 My dẫn, tự bật QR        —
                                                                      Thái+T.Sơn check hệ thống

  02:30 → 05:00      S2       Nguyên nhân xung đột (3 cards)        My tự lật 3 card          —

  05:00 → 06:30      ⚡ Q1    Quiz: Sykes-Picot                     T.Sơn phát quiz          🎁 #1

  06:30 → 08:30      S3       Israel & Palestine (2 cards)           My tự lật 2 card          —

  08:30 → 10:00      ⚡ Q2    Quiz: Thủ đô Palestine                T.Sơn phát quiz          🎁 #2

  10:00 → 12:00      S4       Iran & Mỹ (2 cards)                   My tự lật 2 card          —

  12:00 → 13:30      ⚡ Q3    Quiz: Hezbollah                       T.Sơn phát quiz          🎁 #3

  13:30 → 18:00      S5       ⭐ Roleplay Lãnh đạo (3 thẻ)          My tự click thẻ+option    —
                                                                      Lớp react trên app

  18:00 → 20:00      S6       3 Kịch bản tương lai (3 cards)        My tự lật 3 card          —

  20:00 → 21:30      ⚡ Q4    Quiz: Kịch bản xác suất cao nhất      T.Sơn phát quiz          🎁 #4

  21:30 → 24:00      S7       ⭐ LIVE POLL — Biểu quyết 60s         My dẫn, T.Sơn đóng poll   —

  ──── CHUYỂN SPEAKER: My trao laptop cho Sơn ────

  24:00 → 26:00      S8       Địa chính trị VN + Bản đồ            Sơn tự điều khiển         —

  26:00 → 28:00      S9       Ngoại giao Cây Tre (3 cột)           Sơn tự điều khiển         —

  28:00 → 29:30      ⚡ Q5    Quiz: Bốn Không                       T.Sơn phát quiz          🎁 #5

  29:30 → 32:00      S10      5 Bài học xương máu                   Sơn trình bày             —

  32:00 → 33:30      ⚡ Q6    Quiz: Tự chủ tuyệt đối               T.Sơn phát quiz          🎁 #6

  ──── CHUYỂN SPEAKER: Sơn trao laptop lại cho My ────

  33:30 → 34:30      S12      Dynamic Ending (AI phân tích)         My dẫn                    —

  34:30 → 37:30      S13      ⭐ Q&A Board                           Thái pin câu hỏi          —
                                                                      Cả nhóm trả lời miệng

  37:30 → 39:00      S14      ⭐ Lucky Wheel                         My click 🎁 toolbar       —

  39:00 → 40:00      S15      Outro — Lời kết                       My dẫn                    —

  40:00               ════════ KẾT THÚC ═══════════════════════════════════════════════════════
```

---

## V. SCRIPT NÓI MẪU

### 📌 S1 — Khai mạc (00:00 → 02:30) — Trà My

**[My]** Tự bấm Fullscreen (F11) → Click QR trên toolbar (Mã Mời 4 số sẽ hiện ngay dưới QR)

> *"Kính chào thầy/cô và các bạn! Chào mừng đến với Hội Nghị Địa Chính Trị Trung Đông 2026!*
>
> *Hôm nay sẽ có BỎ PHIẾU REALTIME, CHAT AI trực tiếp, và đặc biệt — 6 câu quiz tương tác. Mỗi câu, bạn nào trả lời ĐÚNG và NHANH nhất sẽ nhận quà ngay lập tức!*
>
> *Mời lấy điện thoại, quét QR trên màn hình. Đăng nhập bằng MSSV và nhập Mã Mời 4 số được ghim trên màn hình — ví dụ '1234' để bắt đầu trải nghiệm!"*

**[Thái]** Kiểm tra số người join trên tab 👥 → nhắn nhóm.  
**[T.Sơn]** Kiểm tra quiz bank đã có đủ 6 câu.

---

### 📌 S2 — Nguyên nhân xung đột (02:30 → 05:00) — Trà My

> *"Vì sao Trung Đông là điểm nóng bậc nhất? 3 nguyên nhân:"*

**[My tự click Card 1]** — DẦU MỎ
> *"Ai kiểm soát Trung Đông, người đó nắm giá năng lượng toàn cầu. Kênh đào Suez, eo biển Hormuz — cổng họng kinh tế thế giới."*

**[My tự click Card 2]** — TÔN GIÁO
> *"1300 năm Sunni-Shia. Jerusalem — giao điểm 3 tôn giáo lớn."*

**[My tự click Card 3]** — SYKES-PICOT
> *"1916, Anh-Pháp dùng thước kẻ chia cắt Trung Đông. Iraq, Syria ngày nay vẫn trả giá."*

---

### ⚡ Q1 — Quiz Sykes-Picot (05:00 → 06:30)

**[T.Sơn]** Phát sóng Quiz 1
**My:** *"Câu quiz đầu tiên! Mở điện thoại — 15 giây — bạn nào ĐÚNG và NHANH nhất sẽ nhận quà ngay!"*

*[Hết giờ]* **[T.Sơn]** Chốt → đọc tên #1
**My:** *"Đáp án: B — Sykes-Picot! Người nhanh nhất: [TÊN]! Mời lên nhận quà! 🎁"*
**[T.Sơn]** Click "Ẩn"

---

### 📌 S3 — Israel & Palestine (06:30 → 08:30) — Trà My

**[My tự click Card Israel]**
> *"Israel — nhà nước Do Thái duy nhất. Mục tiêu: tiêu diệt Hamas, vành đai phòng thủ bất khả xâm phạm."*

**[My tự click Card Palestine]**
> *"Palestine — 75 năm đấu tranh. Mục tiêu: quốc gia độc lập, Đông Jerusalem thủ đô, quyền hồi hương triệu người tị nạn."*

---

### ⚡ Q2 — Quiz Thủ đô Palestine (08:30 → 10:00)

**[T.Sơn]** Phát sóng Quiz 2
**My:** *"Câu thứ hai! Ai nhanh nhất lần này?"*

*[Hết giờ]* → *"Đáp án: C — Đông Jerusalem! Người nhanh nhất: [TÊN]! Lên nhận quà! 🎁"*

---

### 📌 S4 — Iran & Mỹ (10:00 → 12:00) — Trà My

**[My tự click Card Iran]**
> *"Iran — Phòng thủ Chủ động: đánh xa biên giới. 'Trục Kháng chiến': Hezbollah, Houthi, Hamas. Hạt nhân là đòn răn đe tối thượng."*

**[My tự click Card Mỹ]**
> *"Hoa Kỳ — ranh giới đỏ: Iran KHÔNG được sở hữu hạt nhân. Iron Dome + vũ khí vô điều kiện cho Israel."*

---

### ⚡ Q3 — Quiz Hezbollah (12:00 → 13:30)

**[T.Sơn]** Phát sóng Quiz 3
**My:** *"Câu thứ ba! Nhanh lên nhé, quà có hạn!"*

*[Hết giờ]* → *"Đáp án: B — Hezbollah! Người nhanh nhất: [TÊN]! 🎁"*

---

### 📌 S5 — Roleplay ⭐ (13:30 → 18:00) — Trà My

> *"Phần thú vị nhất — nhập vai lãnh đạo quốc gia!"*

**🇺🇸 Mỹ** (~1.5')  
**[My tự click thẻ Mỹ]**
> *"Iran phóng tên lửa, 100 lính bị thương. A: Tomahawk san phẳng? hay B: Xuống thang + cấm vận?*  
> *React trên app! Giơ tay!"*

**[My tự click B]** → *"Lịch sử: Trump xuống thang sau vụ Soleimani 01/2020!"*

**🇮🇱 Israel** (~1.5'): *"5000 rocket Hamas lúc 6:30 sáng..."*  
**🇮🇷 Iran** (~1.5'): *"Israel không kích Lãnh sự quán, 7 tướng thiệt mạng..."*

---

### 📌 S6 — 3 Kịch bản (18:00 → 20:00) — Trà My

**[My tự lật 3 card]**
> - *"💥 Tổng Lực — xác suất THẤP"*
> - *"⚠️ Giới Hạn — 55%, CAO nhất"*
> - *"🕊️ Hạ Nhiệt — TRUNG BÌNH"*
>
> *"Và bây giờ — CÁC BẠN quyết định kịch bản nào!"*

---

### ⚡ Q4 — Quiz Kịch bản (20:00 → 21:30)

**[T.Sơn]** Phát sóng Quiz 4
**My:** *"Trước khi bỏ phiếu — quiz nhanh! Kịch bản nào xác suất cao nhất?"*

*[Hết giờ]* → *"Đáp án: B — Xung đột giới hạn! Nhanh nhất: [TÊN]! 🎁"*

---

### 📌 S7 — LIVE POLL ⭐ (21:30 → 24:00) — Trà My

> *"Tab BỎ PHIẾU trên điện thoại → chọn kịch bản bạn nghĩ sẽ xảy ra! Timer 60 giây... BẮT ĐẦU!"*

**[My]** Bấm Timer 1 phút trên toolbar. Nhìn vote bars nhảy.

*[Hết 60s]:*
> *"Kết quả: đa số chọn [Kịch bản X]! Rất thú vị — cùng xem kết luận sau phần Việt Nam nhé!"*

**[T.Sơn]** Đóng poll.

---

### 🔄 CHUYỂN SPEAKER — My trao laptop cho Sơn

> **My:** *"Giờ phần quan trọng nhất — Bài học cho Việt Nam! Mình xin nhường cho Sơn."*

---

### 📌 S8 — Địa chính trị VN (24:00 → 26:00) — Sơn (tự điều khiển)

> *"Từ Trung Đông quay về Việt Nam. Bờ biển 3.260km án ngữ Biển Đông — 30% thương mại toàn cầu.*
>
> *Hai quần đảo Hoàng Sa, Trường Sa — chủ quyền không thể tranh cãi của Việt Nam.*
>
> *Lợi thế: kinh tế biển, FDI. Rủi ro: tâm điểm Mỹ-Trung, áp lực chủ quyền."*

---

### 📌 S9 — Ngoại giao Cây Tre (26:00 → 28:00) — Sơn

> - *"🌱 **Gốc Vững**: Kiên định độc lập. 'Dĩ bất biến, ứng vạn biến.'"*
> - *"🍃 **Cành Uyển Chuyển**: Đa phương hóa. Việt Nam là bạn, đối tác tin cậy."*
> - *"🛡️ **Bốn Không**: Không liên minh quân sự, không căn cứ, không vũ lực, không chọn phe."*

---

### ⚡ Q5 — Quiz Bốn Không (28:00 → 29:30)

**[T.Sơn]** Phát sóng Quiz 5
**Sơn:** *"Quiz nhanh! Bốn Không còn thiếu gì? 15 giây!"*

*[Hết giờ]* → *"Đáp án: B! Nhanh nhất: [TÊN]! 🎁"*

---

### 📌 S10 — 5 Bài học (29:30 → 32:00) — Sơn

> - *"01 — **Tự Chủ**: 'Đem sức ta tự giải phóng cho ta.' Chọn phe = biến nhà thành chiến trường."*
> - *"02 — **Hòa Bình**: Biển Đông phải dựa vào UNCLOS 1982, không phải súng đạn."*
> - *"03 — **Nội Lực**: Tự chủ năng lượng, an ninh lương thực — tuyến phòng thủ thật sự."*
> - *"04 — **Đoàn Kết**: Trung Đông sụp từ chia rẽ. Đại đoàn kết là lá chắn kiên cố nhất."*
> - *"05 — **Đòn Bẩy**: Biến Biển Đông thành kinh tế biển, logistics, du lịch."*

---

### ⚡ Q6 — Quiz Tự chủ (32:00 → 33:30)

**[T.Sơn]** Phát sóng Quiz 6 (câu cuối!)
**Sơn:** *"Câu cuối cùng! Ai nhận phần quà thứ 6?"*

*[Hết giờ]* → *"Đáp án: B — Tự chủ tuyệt đối! Chúc mừng [TÊN]! 🎁"*

---

### 🔄 CHUYỂN SPEAKER — Sơn trao laptop lại cho My

---

### 📌 S12 — Dynamic Ending (33:30 → 34:30) — Trà My

> *"Dựa trên phiếu bầu lớp mình — hệ thống AI đã tổng kết. Và khán phòng đã quyết định..."*

*(Nội dung tự cập nhật theo vote. AI Gemini viết nhận định nếu đã cấu hình API Key.)*

---

### 📌 S13 — Q&A ⭐ (34:30 → 37:30) — Cả nhóm

**My:**
> *"Bạn nào thắc mắc? Gõ câu hỏi vào app — tab Câu hỏi. Hoặc thử chat trực tiếp với AI trên điện thoại! Câu hỏi hay nhất sẽ hiện lên màn hình!"*

**[Thái]** — *đã trực Q&A suốt buổi, giờ là lúc tập trung*:
1. Tab ❓ → Click **"📌 Pin"** câu hỏi hay → hiện to trên màn chiếu
2. Nhóm trả lời miệng
3. Gõ tóm tắt → push về mobile người hỏi
4. **"Bỏ Pin"** → Pin câu tiếp

> [!NOTE]
> Thái đã trả lời nhiều câu qua admin panel suốt buổi. Phần này tập trung vào câu hỏi chất lượng nhất để cả lớp cùng nghe.

---

### 📌 S14 — Lucky Wheel ⭐ (37:30 → 39:00) — Trà My

> *"Cuối cùng — vòng quay may mắn! Tất cả đã đăng ký trên app đều có cơ hội!"*

**[My]** Di chuột xuống toolbar → click 🎁 → Wheel quay → dừng.

> *"Người may mắn là... [TÊN]! 🎉 Mời lên nhận thưởng!"*

---

### 📌 S15 — Outro (39:00 → 40:00) — Trà My

> *"Thay mặt Nhóm 5 — xin chân thành cảm ơn thầy/cô và các bạn!*
>
> *'Không có gì quý hơn Độc lập — Tự do.' — Hồ Chí Minh*
>
> *Hy vọng qua buổi hôm nay, chúng ta hiểu thêm tại sao Ngoại giao Cây Tre là lựa chọn sáng suốt nhất. Cảm ơn!"*

---

## VI. CHI TIẾT VAI TRÒ TỪNG NGƯỜI

### 🎤 Trà My — Speaker Chính

```
TRƯỚC BUỔI:
  ✅ Cắm HDMI, mở Chrome → doanson.id.vn → PIN 115100
  ✅ Bật Fullscreen (F11), test chuyển 2-3 slide
  ✅ Kiểm tra lật flip card, click roleplay hoạt động

SUỐT BUỔI (S1–S7):
  ✅ Tự chuyển slide: phím → / Space, hoặc click biểu tượng ◀ ▶ trên Toolbar ở đáy màn hình
  ✅ Tự click flip card đúng lúc đang nói
  ✅ Tự click thẻ roleplay + chọn option
  ✅ Bật QR (toolbar) khi cần lớp scan
  ✅ Bật Timer (toolbar) khi Poll
  ✅ Sau mỗi phần → tạm dừng cho T.Sơn phát quiz

CHUYỂN GIQ (S8–S10):
  ✅ Trao laptop cho Sơn (đã để bàn, chỉ cần đổi vị trí)

QUAY LẠI (S12–S15):
  ✅ Nhận lại laptop, dẫn kết thúc
  ✅ Click 🎁 Lucky Wheel trên toolbar
```

### 📢 Sơn — Speaker Phụ

```
TRƯỚC BUỔI:
  ✅ Nắm phím tắt: → / Space / ← / F11
  ✅ Xem trước S8, S9, S10 trên màn

SUỐT BUỔI (S1–S7):
  ✅ Ngồi chỗ, chuẩn bị nội dung phần VN

KHI ĐẾN LƯỢT (S8–S10):
  ✅ Nhận laptop từ My
  ✅ Tự chuyển slide, tự điều khiển
  ✅ Tạm dừng cho T.Sơn phát quiz Q5, Q6

SAU PHẦN VN:
  ✅ Trao laptop lại cho My
```

### 🛡️ Thái — Trực Q&A

```
TRƯỚC BUỔI:
  ✅ Laptop riêng → doanson.id.vn/admin → 202600
  ✅ Để sẵn tab ❓ (Q&A)

SUỐT BUỔI:
  ✅ Liên tục check tab ❓ — có câu hỏi mới → đọc
  ✅ Câu hỏi dễ → gõ trả lời push về mobile người hỏi
  ✅ Câu hỏi hay → click 📌 Pin lên màn chiếu chính
  ✅ Chỉ pin câu hỏi ở đúng thời điểm (Q&A Board, hoặc lúc chuyển tiếp)

PHẦN Q&A (S13):
  ✅ Tập trung pin câu hỏi chất lượng
  ✅ Nhóm trả lời miệng → Thái gõ tóm tắt → push
  ✅ Bỏ Pin → Pin câu tiếp
```

### 🎛️ T.Sơn — Trực Hệ Thống

```
TRƯỚC BUỔI:
  ✅ Laptop/tablet → doanson.id.vn/admin → 202600
  ✅ Tab 📝 → kiểm tra Quiz Bank có đủ 6 câu
  ✅ Nếu chưa có → tạo sẵn 6 câu (nội dung ở mục III)

SUỐT BUỔI:
  ✅ Phát quiz đúng lúc speaker báo hiệu ("Quiz nhanh!")
  ✅ Quy trình: Phát sóng → Chờ 15s → Chốt → Đọc #1 → Ẩn
  ✅ Monitor tab 👥 users — báo nếu bất thường
  ✅ Nếu spam → Tab 🛡️ → Block MSSV hoặc Fingerprint
  ✅ Quản lý Poll: Tab 🗳️ → Đóng poll khi My ra hiệu
  ✅ Monitor tab 📋 Nhật Ký xem tương tác realtime
```

---

## VII. CHECKLIST CHUẨN BỊ

### Ngày hôm trước:
- [ ] Test full: `doanson.id.vn` → PIN → 15 slides → Poll → Q&A → Wheel
- [ ] Test `/vote`: MSSV login → vote → chat AI → quiz
- [ ] Test `/admin` → tạo + phát sóng 1 quiz thử → chốt → ẩn
- [ ] **Tạo sẵn 6 câu quiz** trong Quiz Bank (nội dung ✅ ở mục III)
- [ ] Cấu hình Gemini API Key (tab 🔐) nếu muốn AI phân tích vote
- [ ] Chuẩn bị **6 món quà nhỏ** (kẹo, bút, sticker, v.v.)
- [ ] Backup: Screenshot slides phòng mất mạng

### 15 phút trước buổi:
- [ ] **My:** Laptop → HDMI → Chrome → PIN `115100` → Fullscreen
- [ ] **Thái:** Laptop → `/admin` → `202600` → sẵn tab ❓
- [ ] **T.Sơn:** Laptop/tablet → `/admin` → `202600` → sẵn tab 📝 Quiz Bank
- [ ] 3 laptop/tablet tắt thông báo hệ thống, sạc đầy
- [ ] My bật QR → test lớp scan thử
- [ ] Thái + T.Sơn xác nhận hệ thống ổn
- [ ] Đặt 6 phần quà sẵn trên bàn, dễ lấy

---

## VIII. XỬ LÝ SỰ CỐ

| Sự cố | Ai xử lý | Cách |
|-------|-----------|------|
| Server chết | T.Sơn | SSH → `pm2 restart server` |
| WebSocket ngắt | T.Sơn | Refresh → tự reconnect |
| Slide kẹt | My/Sơn | Click vào slide để focus → thử phím |
| Quiz không hiện trên mobile | T.Sơn | Kiểm tra đã click "Phát Sóng" chưa |
| Poll không cập nhật | T.Sơn | Tab 🗳️ → verify poll đang Active |
| Spam bình luận | T.Sơn | Tab 🛡️ → Block MSSV/Fingerprint |
| Khán giả không vào được | Thái | Nhắc mọi người nhập đúng Mã Mời 4 số hiện dưới QR |
| AI không phản hồi | T.Sơn | Tab 🔐 → kiểm tra/đổi API Key |
| WiFi yếu | T.Sơn | Bật hotspot 4G → kết nối laptop |
| Không ai join Wheel | My | Nhắc lớp — Wheel lấy từ Q&A hoặc all users |

---

## IX. TÓM TẮT 1 TRANG

```
  ┌──────────────────────────────────────────────────────────────┐
  │  4 NGƯỜI: My (MC+Speaker) · Sơn (Speaker VN) ·              │
  │           Thái (Trực Q&A) · T.Sơn (Trực Hệ Thống+Quiz)     │
  │                                                              │
  │  6 QUÀ = 6 QUIZ (1 quiz/phần, trao ngay cho #1 nhanh nhất)  │
  │                                                              │
  │  SPEAKER TỰ ĐIỀU KHIỂN SLIDE — không cần tech bấm hộ        │
  │                                                              │
  │  URL: doanson.id.vn                                          │
  │  PIN: 115100  ·  Admin: 202600                               │
  │  SV Login: MSSV + Mã Mời hiển thị trên màn chiếu (4 số)       │
  └──────────────────────────────────────────────────────────────┘

  00:00  S1   Khai mạc + QR                     My
  02:30  S2   Nguyên nhân (3 cards)              My
  05:00  Q1   Quiz Sykes-Picot                   🎁 #1
  06:30  S3   Israel & Palestine                 My
  08:30  Q2   Quiz Đông Jerusalem                🎁 #2
  10:00  S4   Iran & Mỹ                          My
  12:00  Q3   Quiz Hezbollah                     🎁 #3
  13:30  S5   ⭐ Roleplay 3 lãnh đạo              My
  18:00  S6   3 Kịch bản                         My
  20:00  Q4   Quiz Kịch bản cao nhất             🎁 #4
  21:30  S7   ⭐ LIVE POLL 60s                     My
  24:00  S8   Địa chính trị VN                   Sơn
  26:00  S9   Ngoại giao Cây Tre                 Sơn
  28:00  Q5   Quiz Bốn Không                     🎁 #5
  29:30  S10  5 Bài học                           Sơn
  32:00  Q6   Quiz Tự chủ                        🎁 #6
  33:30  S12  Dynamic Ending                     My
  34:30  S13  ⭐ Q&A Board                         ALL
  37:30  S14  ⭐ Lucky Wheel                       My
  39:00  S15  Outro                              My
  40:00  ═══  KẾT THÚC  ════════════════════════════
```

---

*Kịch bản v3 · 4 người · 6 quiz · 40 phút · Nhóm 5 SSH1151 · April 2026*
