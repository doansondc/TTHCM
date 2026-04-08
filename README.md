# Mô Phỏng Căng Thẳng Trung Đông 🌍

Dự án này là bài báo cáo trực quan cho học phần **Tư tưởng Hồ Chí Minh (SSH1151)**, do **Nhóm 5 - Lớp 170265** (Đại học Bách khoa Hà Nội) thực hiện, dưới sự hướng dẫn của **GVHD: Phạm Thị Mai Duyên**.

## 🎯 Tổng quan
Dự án được xây dựng dưới dạng Website tương tác, ứng dụng các kỹ thuật *Dark Mode*, *Glassmorphism* cũng như các *Micro-animations* bắt mắt để tối ưu hóa đặc biệt trên hệ thống màn chiếu. 

Dự án cho phép người xem có thể:
1. **Theo dõi trực quan (Slides Mode):** Chế độ tập trung giúp thuyết trình mượt mà.
2. **Đọc nâng cao (Report Mode):** Bản báo cáo đầy đủ phân tích nguyên nhân - thực tế - giải pháp và các bài học định hướng cho Việt Nam trong vấn đề địa chính trị quốc tế.
3. **Mô phỏng nhập vai (Role-play):** Tham gia xử lý tình huống khẩn cấp tại Trung Đông trên góc nhìn của 5 nhóm lãnh đạo quốc gia.

## 🚀 Tính năng Offline và Dockerization

Hệ thống được lập trình sẵn kịch bản chạy **100% Offline** (không yêu cầu kết nối mạng để tải assets như hình ảnh Unsplash hay Google Fonts). Bạn hoàn toàn có thể thiết lập dev hoặc chạy trực tiếp bằng **Docker**.

### Khởi động dự án với Docker Compose:

Mở Terminal tại thư mục hiện tại của dự án:
```bash
docker-compose up -d
```
Sau đó truy cập trình duyệt tại địa chỉ: [http://localhost:6969](http://localhost:6969)

Để tắt máy chủ tạm thời:
```bash
docker-compose down
```

## 👩‍💻 Nhóm Thực Hiện
- Nguyễn Duy Thái (Nhóm Trưởng)
- Nguyễn Thị Trà My
- Đoàn Ngọc Sơn 
- Tống Thái Sơn
- Cao Xuân Nam
- Nguyễn Viết Tuấn Minh
- Nguyễn Đăng Minh
- Đinh Thị Trang Nhung
- Hoàng Thị Bé Nhi

> **Vị trí địa lý tạo ra bối cảnh, nhưng chính sách và đường lối mới là yếu tố quyết định vận mệnh quốc gia.** — *Trích Báo cáo nhóm 5*.
