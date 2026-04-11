# 🎭 Kịch Bản Tổ Chức Chương Trình Thuyết Trình
## Nhóm 5 · SSH1151 · Bức Tranh Địa Chính Trị Trung Đông

> **Căn cứ:** Phân tích toàn bộ source code hệ thống (14 slides, 3 routes, 20 Socket.IO events, 9 thành viên)  
> **Địa điểm:** D5-101 · Tuần 32/35  
> **Thời lượng ước tính:** ~55 phút

---

## PHẦN I — KỊCH BẢN NGƯỜI DÙNG (User Stories)

### 👤 Kịch bản 1: Vai trò Presenter (Người thuyết trình)

**Bối cảnh:** Thành viên điều khiển màn chiếu chính, đứng trước lớp.

| Bước | Hành động | Phản hồi hệ thống |
|------|-----------|-------------------|
| 1 | Mở trình duyệt → truy cập `http://34.126.106.92` | Màn LockScreen tối xuất hiện |
| 2 | Bấm PIN `1-2-3-4-5-6` trên bàn phím số | Hiệu ứng chấm sáng dần, màn mở |
| 3 | Nhìn thấy **SplashScreen** (nền kem, thông tin bài) | Splash đẹp với hiệu ứng fade-in |
| 4 | Click **"Bắt Đầu Hội Nghị →"** | Transition blur-scale, vào Slide 1 |
| 5 | Dùng **phím → hoặc Space** để chuyển slide | Slide chuyển mượt mà có animation |
| 6 | Di chuột → thấy **Director Toolbar** xuất hiện ở đáy | Toolbar tối với các icon điều khiển |
| 7 | Click icon **⛶ Fullscreen** trên toolbar | Màn chiếu full toàn màn hình |
| 8 | Click icon **QR** trên toolbar | QR code hiện góc phải màn hình |
| 9 | Click icon **Timer** → chỉnh số phút → **▶** | Đồng hồ đếm ngược MM:SS |
| 10 | Đến Slide 7 (Poll) → click **Poll ON** | Toggle poll, broadcast tới khán giả |
| 11 | Đến Slide 14 → click icon **🎁 Spin** | Vòng quay quay → hiện tên người thắng |
| 12 | Cuộn chuột lên/xuống | Chuyển slide prev/next (cooldown 900ms) |

**Lưu ý UX:** Toolbar tự ẩn sau 3 giây không di chuột → không gây xao nhãng khi thuyết trình.

---

### 📱 Kịch bản 2: Vai trò Khán giả (Audience)

**Bối cảnh:** Sinh viên trong lớp dùng điện thoại tham gia tương tác.

**Happy Path:**

```
Quét QR trên màn chiếu
        ↓
Trang /vote — Màn đăng ký (nền kem, glassmorphism)
        ↓
Nhập Họ tên + MSSV 9 số (OTP-style: 9 ô riêng biệt)
        ↓
Hệ thống lưu sessionStorage + join socket
        ↓ (mở lại tab sau này → auto tham gia lại)
Màn hình chính
```

**Bố cục màn hình chính:**
- **Badge danh tính:** Tên + MSSV góc trên
- **Slide Banner:** Realtime — tóm tắt nội dung slide đang chiếu
- **Quiz Overlay:** Tự động hiện khi admin phát quiz
- **3 tabs:** 🗳️ Bỏ phiếu / ❓ Câu hỏi / 💬 Bình luận
- **Reaction Bar:** 5 emoji ❤️ 👍 😮 🤣 🔥 cố định ở đáy

**Các hành động khán giả có thể thực hiện:**

| Chức năng | Cách dùng | Giới hạn |
|-----------|-----------|---------|
| 🗳️ Bỏ phiếu | Chọn 1 trong 3 kịch bản | 1 phiếu/người, đổi được |
| ❓ Gửi câu hỏi | Nhập câu hỏi + captcha 3 số | Lọc từ ngữ tự động |
| 💬 Bình luận | Nhập text + gửi | Rate limit 3 giây/lần |
| 🎯 Trả lời quiz | Chọn A/B/C/D khi overlay hiện | 1 lần/câu |
| ❤️ React | Tap emoji ở footer | Rate limit 800ms |
| 📍 Xem slide | Banner realtime | Passive — tự cập nhật |

**Kịch bản tiêu cực (Edge cases được xử lý):**
- Nhập MSSV sai → thông báo "Còn N số nữa"
- Captcha sai → thông báo "Mã không khớp" ❌
- Bình luận có từ tục → tự động lọc thành `●●●`
- Poll đóng → các nút bị disabled, hiện thông báo đỏ
- Reload trang → tự động re-join qua sessionStorage

---

### 🛡️ Kịch bản 3: Vai trò Admin (Quản trị viên)

**Bối cảnh:** Thành viên ngồi laptop riêng, điều phối backend.

**Happy Path:**
```
Truy cập /admin → nhập 654321
→ Dashboard hiện với 7 tabs
→ Giám sát realtime + điều khiển quiz + xử lý Q&A
```

**7 chức năng Admin:**

| Tab | Chức năng chính |
|-----|----------------|
| 📊 Tổng Quan | Xem 4 stats + vote bars với tên người bỏ phiếu |
| 🎛️ Điều Khiển | Zoom UI (60-140%) + Countdown timer + Fullscreen + QR Code |
| 📝 Trắc Nghiệm | Tạo quiz → phát sóng → xem live counts → chốt đáp án → ẩn |
| ❓ Hỏi & Đáp | Xem danh sách Q → click → gõ trả lời → push về mobile người hỏi |
| 👥 Người Dùng | Xem danh sách online (tên + MSSV + IP) → block nếu spam |
| 🚫 IP Bị Chặn | Danh sách block + nút unblock |
| 📋 Nhật Ký | Log filter: join/vote/comment/question/answer → block từ log |

---

## PHẦN II — KỊCH BẢN CHƯƠNG TRÌNH THEO TIMELINE

### Giai đoạn 0: Chuẩn bị (15 phút trước giờ)

| Thời gian | Người | Việc làm |
|-----------|-------|----------|
| T-15 phút | Đoàn Ngọc Sơn | Kết nối laptop → máy chiếu, mở Chrome |
| T-15 phút | Đoàn Ngọc Sơn | Truy cập `http://34.126.106.92`, nhập PIN `123456` |
| T-15 phút | Nguyễn Duy Thái | Mở laptop riêng → `/admin` → nhập `654321` |
| T-10 phút | Đoàn Ngọc Sơn | Click **QR** trên toolbar → để lớp scan thử |
| T-10 phút | Nguyễn Duy Thái | Chuẩn bị quiz sẵn trong tab Trắc Nghiệm |
| T-5 phút | Trà My | Ổn định vị trí, kiểm tra mic |
| T-0 | Trà My | Mở đầu chương trình |

---

### Giai đoạn 1: Khai mạc & Đăng ký (5 phút) — Slide 1

**Slide 1 — Cover:** Tiêu đề + 9 thành viên

```
[Màn chiếu]  Slide 1 — nền ảnh desert + overlay + 2 cột
[Toolbar]    Sơn click QR → QR widget hiện góc phải
[Mobile lớp] Mọi người scan → đăng ký tên + MSSV
[Admin]      Quan sát badge 👥 tăng dần
```

**Script MC (Trà My):**
> *"Chào mừng thầy/cô và các bạn đến với Hội Nghị Trung Đông 2026! Mời quét QR trên màn hình để tham gia tương tác — hôm nay sẽ có bỏ phiếu realtime, câu hỏi trực tiếp, và phần quà cho bạn may mắn cuối buổi!"*

---

### Giai đoạn 2: Nội dung chuyên sâu (25 phút) — Slides 2–6

#### Slide 2 — Nguyên nhân xung đột (3 phút)

**Người thuyết trình:** Nguyễn Viết Tuấn Minh

```
[Thuyết trình] Tuấn Minh dẫn dắt từng flip card
[Màn chiếu]    Sơn click card theo hiệu lệnh → flip 3D → hiện bullet points
Card 1: Tài nguyên dầu mỏ 🛢️
Card 2: Xung đột tôn giáo Sunni-Shia ☪️
Card 3: Vết cắt lịch sử Sykes-Picot 🗺️
```

#### Slide 3 — Israel vs Palestine (3 phút)

**Người thuyết trình:** Đinh Thị Trang Nhung
```
[Thuyết trình] Trang Nhung dẫn dắt
[Màn chiếu]    Sơn click 2 thẻ: 🇮🇱 Israel + 🇵🇸 Palestine
```

#### Slide 4 — Iran vs Mỹ (3 phút)

**Người thuyết trình:** Cao Xuân Nam
```
[Thuyết trình] Xuân Nam dẫn dắt
[Màn chiếu]    Sơn click 2 thẻ: 🇮🇷 Iran + 🇺🇸 USA
```

#### Slide 5 — Roleplay Nhập vai Lãnh đạo (6 phút) ⭐ ĐIỂM NHẤN TƯƠNG TÁC

**Điều phối:** Trà My (MC) + Sơn (Presenter)

**Kịch bản diễn xuất:**

```
MC: "Bây giờ đến phần nhập vai! Nhóm mình sẽ hóa thân thành 4 lãnh đạo thế giới!"

[Sơn click thẻ 🇺🇸 Mỹ → thẻ mở rộng, hình to lên]
MC: "Iran vừa phóng tên lửa vào căn cứ Mỹ, 100 binh sĩ bị thương.
     A: Phóng Tomahawk san phẳng radar Tây Iran
     B: Phủ nhận thiệt hại + tăng cấm vận + tấn công mạng
     Khán giả — bạn chọn A hay B?"

[Khán giả phản ứng] → MC chọn đa số hoặc gọi 1 người lên quyết định
[Sơn click option] → Hiện kết quả ✅ "Đúng! Trump chọn xuống thang..."
                             hoặc ❌ "Sai rồi! Iran phản kích Tel Aviv..."

[Repeat cho 3 lãnh đạo còn lại: Israel, Iran, Ả Rập]
```

#### Slide 6 — 3 Kịch bản tương lai (3 phút)

**Người thuyết trình:** Hoàng Thị Bé Nhi
```
Card 1: 💥 Tổng Lực — xác suất 20%
Card 2: ⚠️ Giới Hạn — xác suất 55%
Card 3: 🕊️ Hạ Nhiệt — xác suất 25%
```

---

### Giai đoạn 3: Live Poll (5 phút) — Slide 7 ⭐

**Slide 7 — "Trưng Cầu Ý Dân: Kịch Bản Nào Sẽ Xảy Ra?"**

```
[Màn chiếu]  VotingBoard — 3 progress bars realtime, animate theo từng phiếu
[Mobile]     Toàn lớp bỏ phiếu tab "🗳️ Bỏ phiếu"
[Admin]      Giám sát kết quả, sẵn sàng đóng poll
```

**Script Trà My:**
> *"Đến lúc toàn lớp lên tiếng! Nhìn vào điện thoại → tab Bỏ phiếu → chọn kịch bản bạn cho là khả năng cao nhất. Timer 60 giây bắt đầu... ngay bây giờ!"*

**Sau 60 giây:**
> *"Và kết quả là... [nhìn màn] đa số lớp mình cho rằng [Option] sẽ xảy ra! Thú vị thật — Bé Nhi vừa nói xác suất thực tế là X%, và khán phòng mình đồng ý!"*

**Admin:** Click **"Poll ĐÓNG"** để lock kết quả.

---

### Giai đoạn 4: Bài học cho Việt Nam (9 phút) — Slides 8–10

#### Slide 8 — Địa chính trị Việt Nam (3 phút)

**Người thuyết trình:** Nguyễn Đăng Minh
```
[Màn chiếu] SlideGeoLayout:
  TOP:   Vị trí địa lý — 3.260km bờ biển, Biển Đông
  LEFT:  Lợi thế (xanh): kinh tế biển, FDI, an ninh
  RIGHT: Rủi ro (đỏ): cạnh tranh Mỹ-Trung, chủ quyền
```

#### Slide 9 — Ngoại giao Cây Tre (3 phút)

**Người thuyết trình:** Tống Thái Sơn
```
[Màn chiếu] SlideBamboo — 3 cột ngang:
  🌱 Gốc Vững: Độc lập - Tự chủ
  🍃 Cành Uyển Chuyển: Đa phương hoá
  🛡️ Bốn Không: Không liên minh quân sự
```

#### Slide 10 — 5 Bài học xương máu (3 phút)

**Thuốc toàn nhóm** — mỗi thành viên 1 bài học:
```
Bài 01: 🔗 Tự Chủ Tuyệt Đối — Không chọn phe
Bài 02: ⚖️ Giải Quyết Bằng Hòa Bình — UNCLOS 1982
Bài 03: 📈 Giữ Vững Nội Lực Kinh Tế
Bài 04: 🤝 Kiểm Soát Bất Ổn Nội Bộ — Đại đoàn kết
Bài 05: 🧭 Biến Rủi Ro Thành Đòn Bẩy — Biển Đông
```

---

### Giai đoạn 5: Live Quiz (4 phút) — Xen kẽ ⭐

**Admin (Duy Thái)** phát quiz tại bất kỳ thời điểm phù hợp.

**Câu hỏi gợi ý:**

**Quiz 1** (sau Slide 4 — Iran):
> *"Iran sử dụng chiến lược ủy nhiệm thông qua lực lượng nào tại Lebanon?"*
> A. Hamas  B. Hezbollah  C. Houthi  D. Taliban

**Quiz 2** (sau Slide 9 — Cây Tre):
> *"'Bốn Không' của Việt Nam bao gồm: Không liên minh quân sự, Không cho đặt căn cứ, Không dùng vũ lực, và điều thứ 4 là?"*
> A. Không tham gia LHQ  B. Không đứng về phía nước này chống nước kia  C. Không xuất khẩu vũ khí  D. Không quan hệ với nước lớn

**Quy trình Admin:**
```
1. Tab Trắc Nghiệm → nhập câu hỏi + A/B/C/D
2. Click "🚀 Phát Sóng Câu Hỏi"
3. Tất cả mobile hiện overlay tự động
4. Quan sát live bar chart (counts realtime)
5. Sau ~30 giây → chọn đáp án đúng → "Chốt Kết Quả"
6. Mobile nhận feedback ✅/❌
7. MC đọc kết quả: "Đa số mình chọn B — và đó là đáp án đúng!"
8. Admin click "Ẩn Trắc Nghiệm"
```

---

### Giai đoạn 6: Dynamic Ending (2 phút) — Slide 11

**Slide 11 — Tổng Kết Theo Ý Dân**

```
[Màn chiếu] DynamicEnding component tự đọc kết quả vote:
  → Kịch bản "Giới hạn" thắng? → nội dung về xung đột có kiểm soát
  → Kịch bản "Hòa bình" thắng? → nội dung về ngoại giao thành công
  → Kịch bản "Tổng lực" thắng? → nội dung về leo thang chiến tranh
```

**Script Trà My:**
> *"Dựa trên phiếu bầu của cả lớp — nhóm mình đã chuẩn bị kết luận đặc biệt. Và khán phòng đã quyết định..."*

---

### Giai đoạn 7: Q&A Board (7 phút) — Slide 12 ⭐

**Slide 12 — Q&A từ khán giả**

```
[Màn chiếu]  QABoard — danh sách câu hỏi realtime từ mobile
[Mobile]     Khán giả gõ câu hỏi + điền captcha 3 số
[Admin]      Click câu hỏi → gõ trả lời → push về mobile
[Thuyết trình] Nhóm trả lời miệng theo câu hỏi trên màn
```

**Quy trình:**
1. Trà My: *"Bạn nào tò mò điều gì? Gõ câu hỏi vào app ngay đây!"*
2. Admin: Chiếu câu hỏi lên (tự động qua QABoard)
3. Nhóm: Trả lời miệng
4. Admin: Gõ tóm tắt câu trả lời → push về điện thoại người hỏi

**Ưu tiên câu hỏi:** Nội dung bài > Ý kiến cá nhân > ignore spam.

---

### Giai đoạn 8: Lucky Wheel (2 phút) — Slide 13 ⭐

**Slide 13 — Lucky Wheel**

```
[Màn chiếu]  LuckyWheel component — wheel với tên khán giả
[Sơn]        Click icon 🎁 trên Director Toolbar
             → wheel animate quay → dừng → tên người thắng
[MC]         Đọc tên, trao phần thưởng
```

**Script Trà My:**
> *"Và đây là khoảnh khắc mọi người đã chờ đợi! Ai đã đăng ký vào app → đều có cơ hội! Vòng quay... bắt đầu!"*
> *[Wheel quay animation]*
> *"Và người may mắn là... [tên người thắng]! 🎉"*

---

### Giai đoạn 9: Outro & Kết thúc (3 phút) — Slide 14

**Slide 14 — Outro**

```
[Màn chiếu]  Full-screen: Quote "Không có gì quý hơn Độc lập — Tự do"
             Nhóm 5 · Lớp 170263 · SSH1151
             Giảng viên: Phạm Thị Mai Duyên
```

**Script Trà My:**
> *"Thay mặt Nhóm 5, chúng mình xin chân thành cảm ơn thầy/cô và toàn thể các bạn đã tham gia! Hy vọng qua buổi hôm nay, chúng ta đã có thêm góc nhìn về địa chính trị và hiểu hơn lý do tại sao Ngoại giao Cây Tre lại là lựa chọn sáng suốt của Việt Nam."*

---

## PHẦN III — PHÂN CÔNG NHIỆM VỤ CHI TIẾT

### Bảng phân công đầy đủ

| STT | Thành viên | MSSV | Vai trò | Nhiệm vụ hệ thống | Nội dung thuyết trình |
|-----|------------|------|---------|-------------------|----------------------|
| 1 | **Nguyễn Thị Trà My** | 202419868 | 🎤 MC chính | Không cần thao tác hệ thống | Dẫn toàn bộ chương trình, điều phối Roleplay, đọc kết quả poll, dẫn Lucky Wheel |
| 2 | **Đoàn Ngọc Sơn** | 20203824 | 🖥️ Presenter | Điều khiển màn chiếu (PIN → Slides → QR → Timer → Spin) | Hỗ trợ Slide 5 roleplay click options |
| 3 | **Nguyễn Duy Thái** | 20232543 | 🛡️ Admin | Toàn bộ `/admin`: monitor, quiz CRUD, Q&A handler, block spam | Không thuyết trình |
| 4 | **Nguyễn Viết Tuấn Minh** | 20226391 | 📢 Speaker | Không | **Slide 2:** 3 nguyên nhân xung đột |
| 5 | **Đinh Thị Trang Nhung** | 20221253 | 📢 Speaker | Không | **Slide 3:** Lợi ích Israel & Palestine |
| 6 | **Cao Xuân Nam** | 20233080 | 📢 Speaker | Không | **Slide 4:** Iran & Mỹ — chiến tranh ủy nhiệm |
| 7 | **Hoàng Thị Bé Nhi** | 20223299 | 📢 Speaker | Không | **Slide 6:** 3 kịch bản + xác suất |
| 8 | **Nguyễn Đăng Minh** | 20221236 | 📢 Speaker | Không | **Slide 8:** Địa chính trị Việt Nam |
| 9 | **Tống Thái Sơn** | 20232290 | 📢 Speaker | Không | **Slide 9:** Ngoại giao Cây Tre |

> **Lưu ý:** Slide 10 (5 bài học) → cả nhóm cùng trình bày, mỗi người 1 bài học ngắn (~20-30 giây/bài).

---

### Chi tiết vai trò Admin — Duy Thái

**Quy trình trong buổi:**

```
Trước buổi:
  ✅ Vào /admin, kiểm tra kết nối server
  ✅ Chuẩn bị 2 câu quiz sẵn trong tab Trắc Nghiệm

Slide 1 (Khai mạc):
  ✅ Monitor 👥 badge — báo Sơn/Trà My nếu ít người join
  ✅ Nhắn nhóm chat nếu cần nhắc lớp scan QR

Slide 5 (Roleplay):
  ✅ Không cần thao tác — chú ý Q&A nếu có

Slide 7 (Poll):  
  ✅ Verify poll đang ON (màu xanh)
  ✅ Quan sát kết quả — sau 60s → admin click "Poll ĐÓNG"
  ✅ Thông báo kết quả cho MC qua chat/nháy mắt

Sau Slide 4 hoặc 9 (Quiz):
  ✅ Tab Trắc Nghiệm → nhập câu hỏi + options
  ✅ "🚀 Phát Sóng" → chờ 30-45s → chọn đáp án đúng → Chốt
  ✅ MC đọc kết quả → Admin click "Ẩn Trắc Nghiệm"

Slide 12 (Q&A):
  ✅ Tab Q&A — ưu tiên câu hỏi nội dung
  ✅ Click câu hỏi → gõ trả lời tóm tắt → Gửi
  ✅ Ignore/bỏ qua câu hỏi không phù hợp

Suốt buổi:
  ✅ Nếu thấy bình luận spam → Tab Users/Logs → Block IP
  ✅ Sẵn sàng xử lý tình huống bất ngờ
```

---

### Chi tiết vai trò Presenter — Đoàn Ngọc Sơn

**Quy trình trong buổi:**

```
Trước buổi:
  ✅ Kết nối laptop → máy chiếu (HDMI)
  ✅ Chrome → http://34.126.106.92 → PIN 123456
  ✅ Bật Fullscreen (F11 hoặc toolbar)
  ✅ Kiểm tra slide 1 hiển thị đúng

Khai mạc:
  ✅ Để Slide 1 → di chuột → toolbar → click QR icon
  ✅ Chờ Trà My ra hiệu → tắt QR khi lớp đã join đủ

Khi thuyết trình:
  ✅ Lắng nghe speaker → nhận tín hiệu → nhấn → chuyển slide
  ✅ Slide 2/3/4/6: Click flip cards đúng lúc được dẫn dắt
  ✅ Slide 5: Click thẻ lãnh đạo + click option theo hướng dẫn MC

Poll (Slide 7):
  ✅ Chuyển sang slide → chờ bar chart hiện
  ✅ Verify Poll ON trong toolbar

Q&A (Slide 12):
  ✅ Chuyển sang → không cần làm gì (câu hỏi tự hiện)

Lucky Wheel (Slide 13):
  ✅ Di chuột → toolbar → click icon 🎁 khi Trà My ra hiệu

Phím tắt cần nhớ:
  → / Space  = slide tiếp
  ←          = slide trước
  Scroll     = chuyển slide (cooldown 900ms)
  Di chuột   = toolbar hiện (ẩn sau 3s)
```

---

## PHẦN IV — CHECKLIST ĐẦY ĐỦ

### Ngày hôm trước

```
□ Kiểm tra server: curl http://34.126.106.92 → HTTP 200
□ Test full flow: PIN → SplashScreen → 14 slides → Poll → Q&A → Wheel
□ Test mobile /vote: đăng ký → vote → gửi câu hỏi → nhận trả lời
□ Test /admin: tạo quiz → phát sóng → chốt → ẩn
□ Chuẩn bị 2 câu quiz nội dung
□ Kiểm tra ảnh nền Unsplash load OK (cần internet)
□ Backup: PDF/screenshot toàn bộ slides phòng mất mạng
```

### Sáng buổi thuyết trình

```
□ Test WiFi lớp học trước → đảm bảo stable
□ Laptop Sơn: Sạc đầy pin, tắt thông báo hệ thống
□ Laptop Thái: Sạc đầy pin, tab /admin sẵn sàng
□ Chuẩn bị phần thưởng Lucky Wheel
□ Đến sớm 15 phút để setup
```

### Xử lý sự cố

| Sự cố | Xử lý nhanh |
|-------|-------------|
| Server không phản hồi | SSH: `source ~/.nvm/nvm.sh && pm2 restart tthcm` |
| WebSocket ngắt kết nối | Refresh trang /admin, /vote — tự reconnect |
| Slide không chuyển | Click vào slide một lần để focus → thử lại phím |
| No users trên Lucky Wheel | Cần ít nhất 1 người join /vote → nhắc lớp đăng ký |
| Poll không cập nhật | Kiểm tra tab Admin → verify poll ON |
| Bình luận spam tràn màn | Admin Tab Logs → click Chặn IP bên cạnh log |
| WiFi yếu | Bật hotspot điện thoại → Sơn kết nối laptop qua đó |

---

## PHẦN V — TIMELINE TỔNG THỂ

```
00:00 ─── Slide 1: Khai mạc + Đăng ký QR ───────── 5 phút
          Trà My dẫn, lớp scan QR, đăng ký mobile

05:00 ─── Slide 2: Nguyên nhân xung đột ─────────── 3 phút
          Tuấn Minh, 3 flip cards

08:00 ─── Slide 3: Israel & Palestine ────────────── 3 phút
          Trang Nhung, 2 flip cards

11:00 ─── Slide 4: Iran & Mỹ ────────────────────── 3 phút
          Xuân Nam, 2 flip cards

          [QUIZ 1 — sau Slide 4, ~2 phút]

16:00 ─── Slide 5: Roleplay Lãnh đạo ⭐ ──────────── 6 phút
          Trà My điều phối, 4 lãnh đạo, khán giả quyết định

22:00 ─── Slide 6: 3 Kịch bản tương lai ──────────── 3 phút
          Bé Nhi, 3 flip cards + xác suất

25:00 ─── Slide 7: LIVE POLL ⭐ ────────────────────── 5 phút
          Toàn lớp bỏ phiếu 60 giây, đọc kết quả

30:00 ─── Slide 8: Địa chính trị Việt Nam ─────────── 3 phút
          Đăng Minh, SlideGeoLayout

33:00 ─── Slide 9: Ngoại giao Cây Tre ─────────────── 3 phút
          Tống Thái Sơn, SlideBamboo

          [QUIZ 2 — sau Slide 9, ~2 phút]

38:00 ─── Slide 10: 5 Bài học ────────────────────── 3 phút
          Cả nhóm, mỗi người 1 bài học

41:00 ─── Slide 11: Dynamic Ending ────────────────── 2 phút
          Tự cập nhật theo vote

43:00 ─── Slide 12: Q&A Board ⭐ ────────────────────── 7 phút
          Xử lý câu hỏi từ lớp, admin push trả lời

50:00 ─── Slide 13: Lucky Wheel ⭐ ─────────────────── 2 phút
          Quay, trao thưởng

52:00 ─── Slide 14: Outro ──────────────────────────── 3 phút
          Lời kết, chụp ảnh

55:00 ─── KẾT THÚC ─────────────────────────────────────────
```

---

*Kịch bản tạo từ phân tích source code — Nhóm 5 SSH1151 — April 2026*  
*Production: http://34.126.106.92 | Admin: /admin | Audience: /vote*
