# BÁO CÁO ĐIỀU TRA TOÀN DIỆN MÃ NGUỒN (CODEBASE EXPLORATION REPORT)
**Dự án**: MURTHEHELP // MURDER.SHOPPING.MALL  
**Tác giả**: Codebase Explorer Agent  
**Thời gian hoàn thành**: 2026-08-22T23:29:30+07:00  
**Tài liệu đối chiếu**: `/Users/quan/.gemini/antigravity/scratch/murthehelp/ORIGINAL_REQUEST.md`, `README.md`  
**Tệp mã nguồn điều tra**: `/Users/quan/.gemini/antigravity/scratch/murthehelp/index.html`

---

## 1. OBSERVATION (Quan Sát Thực Tế & Bằng Chứng Mã Nguồn)

### 1.1 Cấu Trúc Tổng Thể của `index.html`
- **Kiến trúc**: Ứng dụng Single Page Application (SPA) đơn tệp (`index.html`, kích thước ~80.6 KB, 1410 dòng).
- **Thư viện & CDN đang có**:
  - `Tailwind CSS`: `<script src="https://cdn.tailwindcss.com"></script>` (Dòng 17)
  - `Google Fonts`: `Plus Jakarta Sans`, `Space Grotesk`, `JetBrains Mono` (Dòng 44-46)
- **Thư viện & CDN bị thiếu**:
  - **Three.js (r128+ CDN)**: Hoàn toàn không có trong `<head>` hoặc `<body>`. Không có `<canvas>` WebGL.
  - **Lucide Icons**: Không có CDN; giao diện dùng emoji (`🐉`, `⚙️`, `🛒`, `🔒`, `🪙`) thay cho vector icons hiện đại.
  - **Web Audio API**: Không có hàm âm thanh tổng hợp nào trong tệp JS.
- **Quản lý trạng thái**: Sử dụng biến toàn cục JS (`currentTab`, `currentSubCat`, `userClearance`, `userName`, `userBalance`, `cart`, `secretClickCount`, `secretClickTimer`). Chưa có `localStorage` để lưu trữ số dư, lịch sử giao dịch và giỏ hàng.

---

### 1.2 Đánh Giá Chi Tiết Theo Từng Yêu Cầu R1 – R6

#### [R1] Mặt Tiền Ngụy Trang Nông Cụ Hợp Đức (Disguise Storefront)
- **Thương hiệu & Nội dung**:
  - *Quan sát mã nguồn*: Dòng 6, 9, 137, 140 đang sử dụng tên `TẬP ĐOÀN CƠ KHÍ & THỦY LỰC HẮC LONG` (Hac Long Heavy Apparatus & Hydraulics Corp) thay vì thương hiệu nguyên tác drama *A Shop for Killers*: **Nông Cụ Hợp Đức / Hamdeok Farming Tools**.
- **Danh mục nông cụ**:
  - Đã có 8 sản phẩm ngụy trang trong `DISGUISE_PRODUCTS` (Dòng 532–605: ống bố thép, dây thủy lực, máy bơm, van titan...).
- **Thông báo đơn hàng giá trị cao (#HD-71092)**:
  - *Quan sát mã nguồn*: **HOÀN TOÀN THIẾU**. Không có banner hay widget hiển thị: `Đơn hàng số #HD-71092 (11.200 mét dây ống cao su lõi thép chuyên dụng — 70.000.000 ₫)`.
- **Thanh tiện ích & Modal "Xem mã nguồn trang (F12)"**:
  - *Quan sát mã nguồn*: **THIẾU**. Không có nút mở modal kiểm tra mã nguồn F12.
  - Dòng 13 trong `<head>` đang ghi `<meta name="gateway" content="https://haclong-mechanics.vn/node-04-vietnam" />` thay vì `<meta name="gateway" content="https://mhshoppingkill87689.dark/mh13543505" />`.
- **Cơ chế xác thực cổng ngầm**:
  - Dòng 1070: Hàm `handleDisguiseSearch()` đã hỗ trợ các mật mã `MH13543505`, `GREEN`, `RED`, `PURPLE`, `YELLOW`, `JINMAN`, `7209`. Click 3 lần vào mã ĐKKD footer và phím tắt `Ctrl+Shift+K` / `Alt+M` cũng kích hoạt được portal.

---

#### [R2] Màn Hình Chuyển Tiếp Giải Mã (Cinematic Transition Portal)
- **Màu nền & Độ tương phản**:
  - Dòng 290: Dùng class `bg-[#3b0206]` (yêu cầu là `#4a0005`).
  - Dòng 294: `<h1 class="text-5xl font-black tracking-widest text-red-950 lowercase drop-shadow-md">murthehelp</h1>` — Màu chữ `text-red-950` gần như trùng màu nền tối `#3b0206`, làm tiêu đề bị chìm, khó đọc.
- **Thanh 3 màu phân cấp**:
  - Dòng 303–307: Đã hiển thị đúng 3 vạch màu: Đỏ `#b3001e`, Tím `#4d19bf`, Cam `#e67e00`.
- **Modal cảnh báo & Nút xác nhận**:
  - Dòng 313–320: Modal "ĐÃ TỰ ĐỘNG ĐĂNG NHẬP" hiển thị sau 1.2 giây; nút "XÁC NHẬN (확인)" gọi hàm `enterDarkMallFinal()`. Phím `Enter` / `Space` đã được bắt sự kiện tại dòng 1108.

---

#### [R3] Canvas 3D WebGL Shader Tương Tác Phong Cách BlueYard
- **Quan sát mã nguồn**: **CHƯA ĐƯỢC TRIỂN KHAI (0%)**.
  - Không có Three.js library.
  - Không có canvas WebGL nền tương tác.
  - Chưa có vertex/fragment displacement noise shader mô phỏng khối cầu morphing hữu cơ 3D.
  - Chưa có bảng màu gradient/Fresnel động chuyển đổi theo phân cấp:
    - *Code Red*: Crimson đỏ đậm & Molten Gold vàng đồng
    - *Code Purple*: Ultraviolet tím sâu & Neon Orchid hoa lan tím
    - *Code Yellow*: Radiant Amber hổ phách & Solar Flare vàng cam
    - *Code Green*: Emerald Jade ngọc lục bảo & Cyber Mint xanh bạc hà
  - Chưa có hiệu ứng parallax chuột mượt mà và cuộn lerp quán tính.

---

#### [R4] Kho Vũ Khí & Trang Bị Tác Chiến (40+ Món, Định Dạng VNĐ)
- **Tổng số lượng sản phẩm**:
  - Hiện tại `PRODUCTS_DB` (Dòng 608–986) có tổng cộng **39 sản phẩm** (RED: 21, PURPLE: 7, YELLOW: 6, GREEN: 5). Yêu cầu tối thiểu là **40+ sản phẩm**.
- **Sai lệch giá niêm yết & Danh mục so với ORIGINAL_REQUEST.md**:
  1. `Glock 19 Gen 5 Blackout` (P033): Mã nguồn hiện tại `24.500.000 ₫` ➔ Yêu cầu: `16.500.000 ₫`.
  2. `Desert Eagle .50 AE Titan` (P022): Mã nguồn hiện tại `52.000.000 ₫` ➔ Yêu cầu: `48.000.000 ₫`.
  3. `Colt Python .357` (R018): Mã nguồn hiện tại `49.000.000 ₫` ➔ Yêu cầu: `49.500.000 ₫`.
  4. `MAC-10 Compact Auto` (MG021): Mã nguồn hiện tại `65.000.000 ₫` ➔ Yêu cầu: `85.000.000 ₫`.
  5. `HK MP5 Navy Mod` (SMG01): Mã nguồn hiện tại `85.000.000 ₫` ➔ Yêu cầu: `95.000.000 ₫`.
  6. `CheyTac M200 Intervention` (SNP03): Mã nguồn hiện tại `380.000.000 ₫` ➔ Yêu cầu: `450.000.000 ₫`.
  7. `Flashbang M84 x4` (EXP01): Mã nguồn hiện tại `18.000.000 ₫` ➔ Yêu cầu: `16.000.000 ₫`.
  8. `Băng Ép Cầm Máu Celox Pro` (YEL04 - `18.500.000 ₫`): Đang thiếu trong nhóm CODE YELLOW (thay bằng YEL-03 Bộ phẫu thuật gắp đầu đạn `26.000.000 ₫`).
  9. `Robot Tác Chiến Phòng Thủ Sentinel` (GRN03): Mã nguồn hiện tại `620.000.000 ₫` ➔ Yêu cầu: `920.000.000 ₫`.
- **Định dạng tiền tệ**: Dùng `toLocaleString('vi-VN') + ' ₫'` cho kết quả hiển thị dấu chấm phân cách chuẩn (ví dụ: `38.500.000 ₫`).
- **Hình ảnh & Fallback**: Đang dùng link Unsplash bên ngoài. Fallback của sản phẩm ngụy trang dùng Unsplash khác (sẽ lỗi nếu mất mạng); Fallback sản phẩm ngầm là SVG inline cơ bản. Cần hệ thống SVG vector blueprint tự chứa 100%.
- **Modal chi tiết sản phẩm (Tactical Blueprint Modal)**: Chưa có cơ chế click xem popup thông số chi tiết (Damage, Range, Stealth, Ammo) cho từng trang bị.

---

#### [R5] Giỏ Hàng Ngầm & Mô Phỏng Điều Phối Logistics
- **Giao diện giỏ hàng**:
  - Đang là Modal ở giữa màn hình (`#cart-modal`, Dòng 444) thay vì Cart Drawer trượt mượt từ cạnh phải.
  - **Thiếu tính năng tăng/giảm số lượng (+/-)**: Khi thêm cùng 1 sản phẩm nhiều lần, giỏ hàng thêm từng dòng riêng lẻ thay vì gộp số lượng. Danh sách chỉ có nút xóa (`✕`).
- **Phương thức vận chuyển**:
  - Đã có 4 tùy chọn (Drone tàng hình, Thùng nông cụ ngụy trang, Safehouse, Đội xe vận tải).
- **Trừ số dư & Lịch sử giao dịch**:
  - Trừ số dư hoạt động chính xác (`userBalance -= total`).
  - **Thiếu nhật ký giao dịch (Transaction Logs)**: Không lưu lại các đơn hàng đã đặt và thiếu tab/modal xem lịch sử điều phối.

---

#### [R6] Bảng Quản Trị Giám Đốc Jeong Jin-man & Thoát Khẩn Cấp
- **Bảng Quản Trị**:
  - Mở qua icon bánh răng góc phải (`openAdminModal()`).
  - Cho phép nạp tiền VNĐ (`depositFunds()`), đổi cấp phân quyền (`saveAdminSettings()`), chỉnh sửa tên chủ tài khoản.
  - Phím tắt gõ `JINMAN` khi đang ở trong Dark Mall chưa mở trực tiếp bảng admin.
- **Panic Protocol (Thoát khẩn cấp)**:
  - Phím `ESC` tại dòng 1115 hoạt động tốt: đóng toàn bộ modal và quay lại giao diện nông cụ ngụy trang ngay lập tức.

---

### 1.3 Thẩm Mỹ & Trải Nghiệm Giao Diện (Visual & Interactive Aesthetics)
- **CRT Scanlines**: Tiêu chuẩn nghiệm thu ghi rõ *"Pitch-black OLED theme (`#06070a`) with modern typography without outdated CRT scanlines"*. Tuy nhiên lớp CSS `.scanlines-bg` vẫn còn tồn tại ở dòng 80 và được gán vào `#portal-stage` (dòng 290).
- **Âm thanh Web Audio API**: Thiếu hoàn toàn các hiệu ứng âm thanh (Click phím cơ, Tiếng chuông xác thực quyền, Cảnh báo từ chối quyền, Tiếng điều phối drone).

---

## 2. LOGIC CHAIN (Chuỗi Suy Luận & Phân Tích Nguyên Nhân)

1. **Từ Quan Sát [1.1 & 1.2 R3]**: `index.html` không có thẻ script nạp Three.js, không có logic shader GLSL, không có `<canvas>`.
   ➔ **Suy luận**: Yêu cầu R3 (Canvas 3D WebGL Shader phong cách BlueYard phản hồi theo mã màu và chuyển động chuột) chưa từng được dựng trong phiên bản hiện tại. Cần tích hợp thư viện Three.js r128+ và xây dựng shader vật liệu Vertex Displacement + Fragment Fresnel Iridescent.

2. **Từ Quan Sát [1.2 R1]**: Tên doanh nghiệp là "Tập Đoàn Cơ Khí Hắc Long", thiếu order banner `#HD-71092`, thiếu modal F12 inspection.
   ➔ **Suy luận**: Giao diện mặt tiền được tùy biến theo Hắc Long thay vì sát với kịch bản gốc "Nông Cụ Hợp Đức" (Hamdeok Farming Tools). Cần chỉnh sửa lại thương hiệu chuẩn, thêm widget đơn hàng `#HD-71092`, thêm modal "Xem mã nguồn trang (F12)" hiển thị đúng meta key/gateway.

3. **Từ Quan Sát [1.2 R4]**: `PRODUCTS_DB` có 39 sản phẩm, 9 sản phẩm sai lệch giá so với bảng giá chuẩn của `ORIGINAL_REQUEST.md`.
   ➔ **Suy luận**: Số lượng sản phẩm chưa đạt ngưỡng 40+ món và giá một số món bị lệch. Cần chuẩn hóa toàn bộ mã ID (P020, SMG01...), tên, quy cách và giá tiền đúng 100% tài liệu yêu cầu, đồng thời bổ sung thêm 3–5 món vũ khí/thiết bị để đạt 42+ sản phẩm.

4. **Từ Quan Sát [1.2 R5]**: Giỏ hàng dùng modal tĩnh, không có bộ đếm tăng giảm số lượng (+/-), không có log lịch sử đặt hàng.
   ➔ **Suy luận**: Trải nghiệm checkout chưa đạt độ hoàn thiện cao cấp (drawer tương tác, quản lý số lượng và telemetry log).

5. **Từ Quan Sát [1.3]**: Web Audio API và Lucide Icons chưa được tích hợp.
   ➔ **Suy luận**: Ứng dụng thiếu phản hồi xúc giác âm thanh điện tử và biểu tượng vector công nghệ cao làm giảm tính điện ảnh (cinematic feel).

---

## 3. CAVEATS (Những Điểm Cần Lưu Ý)

- **Kết nối mạng**: Các liên kết ảnh từ Unsplash có thể chậm hoặc bị chặn tại một số mạng nội bộ. Việc xây dựng giải pháp SVG vector blueprint dự phòng offline là bắt buộc để đảm bảo 0% lỗi ảnh.
- **Hiệu năng WebGL**: Khối cầu 3D Three.js cần được tối ưu hóa số lượng phân mảnh (geometry segments ~64x64 hoặc 128x128) để duy trì mượt mà 60fps trên màn hình Retina / OLED và thiết bị di động mà không gây tụt khung hình.

---

## 4. CONCLUSION (Kết Luận & Danh Sách Hạng Mục Cần Thực Hiện)

Mã nguồn hiện tại đã dựng được khung Single Page Application cơ bản với 2 tầng giao diện (Disguise & Dark Mall), xử lý phân quyền 4 màu và giỏ hàng cơ bản. Tuy nhiên, còn tồn tại **8 khoảng trống lớn (Gaps)** cần được hoàn thiện và nâng cấp toàn diện:

| STT | Hạng Mục | Trạng Thái Hiện Tại | Yêu Cầu Cần Đạt |
| :--- | :--- | :--- | :--- |
| 1 | **3D WebGL Shader Canvas (R3)** | Chưa có (0%) | Tích hợp Three.js r128+, dựng khối cầu 3D morphing noise shader với gradient 4 màu theo Clearance, phản hồi parallax chuột & cuộn mượt |
| 2 | **Thương Hiệu Nông Cụ Hợp Đức (R1)** | Đang để Hắc Long Corp | Đổi thành "Nông Cụ Hợp Đức / Hamdeok Farming Tools", thêm banner đơn hàng `#HD-71092` (70.000.000 ₫) |
| 3 | **Modal Xem Mã Nguồn F12 (R1)** | Chưa có | Thêm nút "Xem mã nguồn trang (F12)" tại top bar mở modal hiển thị thẻ meta bí mật (`mh13543505`) |
| 4 | **Kho Vũ Khí 40+ Món & Giá Chuẩn (R4)** | 39 món, 9 món sai giá | Mở rộng lên 42+ món, sửa đúng 100% giá và mã sản phẩm theo `ORIGINAL_REQUEST.md` |
| 5 | **Modal Bản Vẽ Tác Chiến (Blueprint Modal)** | Chưa có | Cho phép click vào từng món vũ khí để xem chi tiết thông số (Damage, Range, Caliber, Concealment) |
| 6 | **Giỏ Hàng Tương Tác & Lịch Sử Đơn Hàng (R5)** | Modal đơn giản, thiếu +/- | Nâng cấp Drawer/Modal có chỉnh sửa số lượng (+/-), bảng lưu vết lịch sử giao dịch & dispatch |
| 7 | **Hệ Thống Âm Thanh Web Audio Engine** | Chưa có | Tích hợp Web Audio API (Click cơ học, Access Granted, Access Denied, Dispatch Drone) |
| 8 | **Giao Diện OLED & Biểu Tượng** | Còn CRT scanlines, dùng emoji | Loại bỏ CRT scanlines, áp dụng OLED pitch-black `#06070a`, tích hợp Lucide Icons & SVG fallbacks |

---

## 5. VERIFICATION METHOD (Phương Pháp Độc Lập Kiểm Tra)

1. **Kiểm tra cú pháp & tính toàn vẹn**:
   ```bash
   node -e "
   const fs = require('fs');
   const html = fs.readFileSync('index.html', 'utf8');
   console.log('File size:', html.length, 'bytes');
   "
   ```
2. **Khởi chạy máy chủ nội bộ**:
   ```bash
   python3 -m http.server 3000
   ```
3. **Kiểm tra trực quan trên trình duyệt (`http://localhost:3000`)**:
   - Xác nhận mặt tiền hiển thị đúng thương hiệu "Nông Cụ Hợp Đức", banner `#HD-71092`, nút F12.
   - Nhập `mh13543505` vào thanh tìm kiếm ➔ Màn hình đỏ đô `#4a0005` xuất hiện ➔ Bấm `XÁC NHẬN` hoặc gõ `Enter` ➔ Vào Dark Mall.
   - Kiểm tra khối cầu Three.js 3D WebGL xoay chuyển mượt mà ở background và đổi màu khi bấm các tab Code Red, Purple, Yellow, Green.
   - Kiểm tra danh sách 40+ sản phẩm, giá tiền có định dạng `... ₫` với dấu chấm.
   - Thử thêm hàng vào giỏ, tăng/giảm số lượng, thanh toán và kiểm tra trừ tiền tài khoản.
   - Nhấn phím `ESC` để kiểm tra cơ chế thoát khẩn cấp về mặt tiền nông cụ.
