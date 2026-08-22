# MURTHEHELP // MURDER.SHOPPING.MALL

> **"Nghe kỹ đây, Ji-an. Những kẻ yếu chỉ biết sủa khi sợ hãi. Nếu muốn sống sót, hãy biến thành kẻ săn mồi."**  
> *— Jeong Jin-man (A Shop for Killers)*

---

![Murthehelp System Banner](https://img.shields.io/badge/SECURITY-AES--256--GCM-red?style=for-the-badge&logo=target)
![Clearance Matrix](https://img.shields.io/badge/CLEARANCE-GREEN%20%7C%20RED%20%7C%20PURPLE%20%7C%20YELLOW-emerald?style=for-the-badge)
![Status](https://img.shields.io/badge/STATUS-OPERATIONAL-brightgreen?style=for-the-badge)
![License](https://img.shields.io/badge/LICENSE-MIT-blue?style=for-the-badge)

**MURTHEHELP** (hay **MURDER.SHOPPING.MALL**) là một ứng dụng web Single Page Application (SPA) mô phỏng hệ thống chợ đen và kho vũ khí tác chiến ngầm được lấy cảm hứng từ bộ phim truyền hình hành động trinh thám nổi tiếng **"A Shop for Killers" (Cửa Hàng Sát Thủ - 킬러들의 쇼핑몰)**.

Dự án được thiết kế với kiến trúc **2 lớp (Dual-Layer Architecture)** độc đáo:
1. **Mặt tiền ngụy trang (Camouflaged Storefront)**: Một trang thương mại điện tử chuyên cung cấp ống nước cao áp và máy móc cơ khí nông nghiệp.
2. **Kênh ngầm tác chiến (Dark Cyberpunk Murder Mall)**: Hệ thống vũ khí, công cụ dọn dẹp hiện trường, thiết bị y tế khẩn cấp và gói chi viện tác chiến được phân cấp nghiêm ngặt theo mã màu bí mật.

---

## 📑 MỤC LỤC
- [1. Tính Năng Nổi Bật](#1-tính-năng-nổi-bật)
- [2. Ma Trận Phân Cấp An Ninh (Clearance Matrix)](#2-ma-trận-phân-cấp-an-ninh-clearance-matrix)
- [3. Mật Mã & Phương Thức Truy Cập Ngầm](#3-mật-mã--phương-thức-truy-cập-ngầm)
- [4. Hệ Thống Dòng Lệnh Terminal (CLI Telemetry)](#4-hệ-thống-dòng-lệnh-terminal-cli-telemetry)
- [5. Bộ Tạo Âm Thanh Tác Chiến (Web Audio Engine)](#5-bộ-tạo-âm-thanh-tác-chiến-web-audio-engine)
- [6. Hướng Dẫn Cài Đặt & Chạy Cục Bộ](#6-hướng-dẫn-cài-đặt--chạy-cục-bộ)
- [7. Hướng Dẫn Triển Khai (Deployment)](#7-hướng-dẫn-triển-khai-deployment)
- [8. Công Nghệ Sử Dụng](#8-công-nghệ-sử-dụng)

---

## 1. Tính Năng Nổi Bật

### 🌿 Giao Diện Mặt Tiền Ngụy Trang
- Trưng bày đầy đủ các danh mục ống dẫn nước bọc lõi thép, máy bơm áp lực, hóa chất tẩy rửa cặn ống, cảm biến nông nghiệp.
- Cổng kích hoạt bí mật **"Cổng Kỹ Thuật #00"** được ẩn tinh tế trên thanh điều hướng và mã số serial footer.

### 🛡️ Cổng Kiểm Soát An Ninh (Security Checkpoint)
- Modal giải mã kênh ngầm yêu cầu nhập mã PIN / Passkey xác thực.
- Kiểm tra tính hợp lệ và phân bổ quyền hạn tài khoản theo đúng cấp bậc đăng nhập.
- Hiệu ứng âm thanh điện tử tương tác (Access Granted / Access Denied).

### 🕶️ Chợ Đen Tác Chiến (Cyberpunk Tactical Mall)
- Hiệu ứng **CRT Scanlines** & phong cách Cyber-Glassmorphism đậm chất điện ảnh.
- **Color Clearance Filters**: Lọc trang bị tức thời theo màu sắc cấp quyền.
- **Tactical Blueprint Modal**: Xem thông số chi tiết của từng loại vũ khí (Sát thương, Tầm bắn, Độ ngụy trang).
- **Hệ Thống Tín Dụng (Credits - CR)**: HUD theo dõi số dư thời gian thực, cơ chế thanh toán và mô phỏng điều phối drone tàng hình.
- **Panic Button (Thoát khẩn cấp)**: Bấm nút khóa hoặc gõ phím `ESC` để lập tức ẩn giấu giao diện và trở về cửa hàng nông nghiệp.

---

## 2. Ma Trận Phân Cấp An Ninh (Clearance Matrix)

Hệ thống tuân thủ chặt chẽ nguyên tắc phân cấp màu sắc của tổ chức **Murthehelp**:

| Phân Cấp | Tên Mã | Quyền Hạn & Đối Tượng | Danh Mục Trang Bị |
| :--- | :--- | :--- | :--- |
| 🔴 **CODE RED** | Sát Thủ / Tấn Công | Cung cấp vũ khí nóng, vũ khí lạnh, súng bắn tỉa tầm xa, lựu đạn gây choáng và đạn dược chiến thuật. | • Súng tỉa SV-98 Mod<br>• Dao CQC Tungsten<br>• Flashbang x4<br>• HK USP-T |
| 🟣 **CODE PURPLE** | Dọn Dẹp / Do Thám | Phục vụ cho nhân sự xử lý hiện trường, phá hủy chứng cứ, do thám điện tử và tiêu hủy thi thể. | • Axit tiêu hủy PX-9<br>• Micro Drone tầm nhiệt<br>• Phá sóng EMP-X<br>• Cleaner-Pro |
| 🟡 **CODE YELLOW** | Cứu Thương / Y Tế | Dành cho bác sĩ chiến trường, sơ cứu khẩn cấp, hồi sinh nhịp tim và ổn định chấn thương. | • Bộ sơ cứu IFAK Elite<br>• Serum Adrenaline Pro<br>• Máy sốc tim AED-X |
| 🟢 **CODE GREEN** | VIP / Master Admin | Toàn quyền kiểm soát hệ thống, mua tất cả mọi trang bị và gọi đội chi viện vũ trang hạng nặng. | • Toàn bộ kho hàng RED/PURPLE/YELLOW<br>• Khiên Titanium IV<br>• Cứu viện phản ứng nhanh |

---

## 3. Mật Mã & Phương Thức Truy Cập Ngầm

Để kích hoạt kênh ngầm từ giao diện ngụy trang:
1. Nhấp vào nút **"Cổng Kỹ Thuật #00"** ở góc phải trên cùng.
2. Nhập một trong các mã định danh sau:

- `GREEN` (hoặc `JINMAN` / `00`): Cấp quyền **Master / Code Green**
- `RED`: Cấp quyền **Code Red**
- `PURPLE`: Cấp quyền **Code Purple**
- `YELLOW`: Cấp quyền **Code Yellow**

*Mẹo: Bạn có thể nhấp trực tiếp vào các nút gợi ý trong modal để tự động điền mã.*

---

## 4. Hệ Thống Dòng Lệnh Terminal (CLI Telemetry)

Giao diện Murder Mall tích hợp một CLI mini hỗ trợ các lệnh trực tiếp:

```bash
# Hiển thị danh sách câu lệnh trợ giúp
murthehelp@root:~$ help

# Kiểm tra trạng thái kết nối và số dư tài khoản
murthehelp@root:~$ status

# Thay đổi bậc quyền hạn (GREEN, RED, PURPLE, YELLOW)
murthehelp@root:~$ clearance RED

# Mua nhanh trang bị bằng mã ID (Ví dụ: R01, P01, Y01, G01)
murthehelp@root:~$ buy R01

# Nạp thêm tín dụng thử nghiệm
murthehelp@root:~$ credits 250000

# Kiểm tra định vị Drone vận chuyển ngầm
murthehelp@root:~$ drone

# Xóa trắng màn hình log
murthehelp@root:~$ clear

# Thoát khẩn cấp về giao diện ngụy trang
murthehelp@root:~$ exit
```

---

## 5. Bộ Tạo Âm Thanh Tác Chiến (Web Audio Engine)

Ứng dụng tích hợp bộ giải mã âm thanh kỹ thuật số thuần túy thông qua **HTML5 Web Audio API** mà không yêu cầu tải bất kỳ tệp MP3 hay asset ngoại vi nào:
- 🔊 **Mechanical Click**: Tần số 1200Hz cực ngắn cho cảm giác bấm phím cơ học.
- 🔊 **Access Granted Chime**: Hợp âm 3 nốt điện tử viễn tưởng (D5 -> A5 -> D6).
- 🔊 **Access Denied Alarm**: Sóng răng cưa (Sawtooth wave) tần số thấp 160Hz - 110Hz cảnh báo lỗi.
- 🔊 **Dispatch Warp**: Âm thanh điều phối đơn hàng và drone vận chuyển.

---

## 6. Hướng Dẫn Cài Đặt & Chạy Cục Bộ

Do được xây dựng dưới dạng **Single Page Application không cần build step**, bạn có thể chạy ứng dụng ngay lập tức:

### Cách 1: Mở trực tiếp bằng trình duyệt
Chỉ cần nhấp đúp vào tệp `index.html` hoặc kéo thả vào Google Chrome / Microsoft Edge / Safari / Firefox.

### Cách 2: Chạy qua Live Server (Node.js hoặc Python)
```bash
# Clone repository
git clone https://github.com/q121101-cloud/murthehelp.git
cd murthehelp

# Chạy với Python 3
python3 -m http.server 3000

# Hoặc chạy với npx serve
npx serve .
```
Truy cập `http://localhost:3000` trên trình duyệt.

---

## 7. Hướng Dẫn Triển Khai (Deployment)

### GitHub Pages
1. Đẩy mã nguồn lên repository GitHub của bạn:
   ```bash
   git add .
   git commit -m "feat: launch Murthehelp Murder Shopping Mall platform"
   git push origin main
   ```
2. Vào **Settings** > **Pages** trên GitHub.
3. Trong mục **Branch**, chọn `main` và thư mục `/(root)`, sau đó nhấn **Save**.

### Vercel / Netlify
- Kéo thả thư mục dự án trực tiếp vào [Vercel Dashboard](https://vercel.com) hoặc [Netlify Drop](https://app.netlify.com/drop) để deploy miễn phí trong 5 giây.

---

## 8. Công Nghệ Sử Dụng

- **HTML5 & Vanilla JavaScript (ES6+)**: Xử lý logic giỏ hàng, xác thực phân quyền, CLI telemetry và render DOM thời gian thực.
- **Tailwind CSS (CDN)**: Thiết kế giao diện phản hồi (Responsive Design), Grid layout, Glassmorphism và Dark Mode.
- **Lucide Icons**: Bộ icon hiện đại, tối giản và sắc nét.
- **Web Audio API**: Trình tạo âm thanh tổng hợp đa tầng không phụ thuộc tài nguyên bên ngoài.
- **Google Fonts**: Phông chữ `Inter`, `JetBrains Mono` và `Orbitron`.

---

## ⚠️ TUYÊN BỐ MIỄN TRỪ TRÁCH NHIỆM (DISCLAIMER)

Dự án này là một tác phẩm hư cấu lấy cảm hứng từ bộ phim truyền hình *"A Shop for Killers" (Cửa Hàng Sát Thủ)* nhằm mục đích học tập, thiết kế giao diện sáng tạo và giải trí. Toàn bộ thông tin, dữ liệu sản phẩm, đơn vị tiền tệ và tổ chức trong trang web đều là giả tưởng.

---

**Bản quyền © 2026 Murthehelp Corp. All Rights Reserved.**
