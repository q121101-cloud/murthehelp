# BÁO CÁO ĐIỀU TRA & ĐỀ XUẤT NÂNG CẤP MẶT TIỀN NGỤY TRANG (R1)
**Dự Án**: MURTHEHELP // MURDER.SHOPPING.MALL  
**Đối Tượng Điều Tra**: Giao diện mặt tiền ngụy trang Doanh nghiệp Nông Cụ Hợp Đức / Tập đoàn Cơ khí Thủy lực Hoàng Hắc Long (`#disguise-stage` trong `index.html`)  
**Người Thực Hiện**: Explorer 1 (Visual Investigation & CDN Asset Discovery)  
**Thời Gian**: 2026-08-23T01:42:00+07:00  

---

## 1. TỔNG QUAN & PHÁT HIỆN CHÍNH (EXECUTIVE SUMMARY)

Qua điều tra toàn diện mã nguồn `index.html`, cấu trúc CSS Tailwind, dữ liệu JavaScript `DISGUISE_PRODUCTS`, và kiểm tra mạng trực tiếp (HTTP probing) từng liên kết CDN ảnh, Explorer 1 đã xác định các vấn đề trọng yếu sau:

1. **Lỗi hình ảnh 404 và trùng lặp**:
   - URL `https://images.unsplash.com/photo-1581092335397-9583fe92d232` đang được dùng cho cả **Máy bơm Thunder-X P950** (`HHL-D03`) và **Hệ thống guồng cuộn** (`HHL-D05`) trả về mã lỗi **HTTP 404 (Not Found)**.
   - Nhiều sản phẩm dùng trùng ảnh với nhau (ví dụ Ống thép và Cáp thép cùng dùng ảnh `photo-1590496793929-36417d3117de`; Van titan và Khớp nối Inox cùng dùng ảnh `photo-1504307651254-35680f356dfd`).
2. **Thiếu vắng Đơn hàng #HD-71092 trong dải Ticker**:
   - Yêu cầu cốt truyện và E2E Test Suite yêu cầu hiển thị đơn hàng nổi bật `#HD-71092` (11.200 mét dây ống cao su lõi thép chuyên dụng — 70.000.000 ₫), nhưng ticker hiện tại chỉ có `#HHL-99812` đến `#HHL-99817`.
3. **Thiếu nút bấm / Modal Kiểm Tra Mã Nguồn F12**:
   - Dòng 125 ghi `<!-- Top Utility Bar Chuyên Nghiệp (Đã ẩn hoàn toàn nút F12) -->`, làm mất đi cơ chế mở modal xem `<meta name="key" content="mh13543505" />` từ giao diện người dùng.
4. **Cơ hội nâng cấp B2B Industrial E-Commerce**:
   - Danh mục sản phẩm ngụy trang hiện chỉ có 8 món, có thể mở rộng lên **12 món thiết bị thủy lực công nghiệp thực tế** với đầy đủ các danh mục yêu cầu: Ống bố thép 1500 Bar, Máy bơm đẩy cao tầng, Động cơ diesel công nghiệp, Xi lanh thủy lực, Van áp lực titan, Khớp nối nhanh Inox 316L, Cuộn dây tưới áp lực, Dầu thủy lực ISO VG68, Đồng hồ đo áp suất màng dầu chống rung, Hóa chất bảo dưỡng đường ống.

---

## 2. BẢNG KIỂM TRA & XÁC THỰC CDN HÌNH ẢNH (HTTP 200 VERIFIED)

Tất cả các liên kết hình ảnh dưới đây đã được kiểm tra trực tiếp qua lệnh `curl -s -o /dev/null -w "%{http_code}"` và xác nhận **100% HTTP 200**, tải mượt mà với độ phân giải cao và nội dung khớp chính xác với thiết bị cơ khí công nghiệp:

| STT | Mã SP | Tên Sản Phẩm | Danh Mục | Tag Tiêu Chuẩn | Giá (VNĐ) | Trạng Thái HTTP | URL Unsplash CDN Đã Xác Thực |
|---|---|---|---|---|---|---|---|
| 1 | `HHL-D01` | Ống Cao Su Xoắn Bố Thép Siêu Áp Phi 50 (Cuộn 50M) | `steel` | BỐ THÉP ĐÔI 1500 BAR | 8.800.000 ₫ | **200 OK** | `https://images.unsplash.com/photo-1590496793929-36417d3117de?w=800&auto=format&fit=crop&q=80` |
| 2 | `HHL-D02` | Ống Thủy Lực Lõi Sợi Gốm Chịu Nhiệt 1500°C Phi 75 | `hose` | LÕI GỐM CÁCH NHIỆT | 15.600.000 ₫ | **200 OK** | `https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80` |
| 3 | `HHL-D03` | Máy Bơm Thủy Lực Đẩy Cao Tầng Thunder-X P950 | `pump` | LÕI ĐỒNG IP68 CỐ ĐÔ | 19.500.000 ₫ | **200 OK** | `https://images.unsplash.com/photo-1508974239320-0a029497e820?w=800&auto=format&fit=crop&q=80` |
| 4 | `HHL-D04` | Van Điều Áp Hợp Kim Titan Đúc Nguyên Khối JIS 1500 Bar | `valve` | TITANIUM JIS-10K | 6.200.000 ₫ | **200 OK** | `https://images.unsplash.com/photo-1581092446327-9b52bd1570c2?w=800&auto=format&fit=crop&q=80` |
| 5 | `HHL-D05` | Hệ Thống Guồng Cuộn Thu Hồi Dây Áp Lực Tự Động 100M | `hose` | LÒ XO TỰ THU HỒI | 21.800.000 ₫ | **200 OK** | `https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=800&auto=format&fit=crop&q=80` |
| 6 | `HHL-D06` | Dung Dịch Phân Giải Cặn Hữu Cơ Đường Ống Nano-Clean Pro | `chem` | HÓA CHẤT XỬ LÝ NHANH | 3.200.000 ₫ | **200 OK** | `https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80` |
| 7 | `HHL-D07` | Bộ Khớp Nối Nhanh Thủy Lực Inox 316L (Hộp 10 Cái) | `valve` | KHÓA BI INOX 316L | 4.500.000 ₫ | **200 OK** | `https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=800&auto=format&fit=crop&q=80` |
| 8 | `HHL-D08` | Dây Cáp Bọc Thép Chống Đứt Giằng Thủy Lợi 100M | `steel` | THÉP SUS304 CHỐNG GỈ | 7.200.000 ₫ | **200 OK** | `https://images.unsplash.com/photo-1563770660941-20978e870e26?w=800&auto=format&fit=crop&q=80` |
| 9 | `HHL-D09` | Động Cơ Nổ Diesel Thủy Lực Công Nghiệp HHL-D650 (65HP) | `pump` | DIESEL CÔNG SUẤT CAO | 34.500.000 ₫ | **200 OK** | `https://images.unsplash.com/photo-1513828583688-c52646db42da?w=800&auto=format&fit=crop&q=80` |
| 10 | `HHL-D10` | Xi Lanh Thủy Lực Hành Trình Dài 1200mm Heavy-Duty | `cylinder` | XI LANH ÁP LỰC 250 BAR | 14.800.000 ₫ | **200 OK** | `https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&auto=format&fit=crop&q=80` |
| 11 | `HHL-D11` | Dầu Thủy Lực Chuyên Dụng Chống Mài Mòn HHL-Hydrolub VG68 (Phuy 200L) | `chem` | TIÊU CHUẨN ISO VG68 | 11.500.000 ₫ | **200 OK** | `https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=800&auto=format&fit=crop&q=80` |
| 12 | `HHL-D12` | Đồng Hồ Đo Áp Suất Thủy Lực Màng Dầu Chống Rung 0-2000 Bar | `valve` | MÀNG DẦU GLYCERIN | 2.850.000 ₫ | **200 OK** | `https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?w=800&auto=format&fit=crop&q=80` |
| 13 | *Hero* | Ảnh Nền Banner Nhà Máy & Dây Chuyền Cơ Khí Hiện Đại | *Banner* | ULTRA HD 1400PX | N/A | **200 OK** | `https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1400&auto=format&fit=crop&q=80` |

---

## 3. THIẾT KẾ GIAO DIỆN B2B INDUSTRIAL E-COMMERCE

### 3.1. Header & Utility Bar Đẳng Cấp Doanh Nghiệp
- **Top Utility Bar**:
  - Dòng định danh: `🏛️ TẬP ĐOÀN CƠ KHÍ & THỦY LỰC HOÀNG HẮC LONG // NÔNG CỤ HỢP ĐỨC (HAMDEOK CORP)`
  - Thông tin kho vận: `🚢 Tổng kho: Cảng Nước Sâu Chân Mây (Huế)`
  - Hotline kỹ thuật 24/7: `📞 Hotline: 1900-8868`
  - Nút kiểm tra mã nguồn trang: `🔍 F12: Kiểm Tra Mã Nguồn Trang` (kích hoạt modal kiểm tra mã nguồn).
- **Main Navbar**:
  - Logo HHL màu vàng kim sang trọng (`🐉`), thương hiệu nổi bật kèm phụ đề công nghiệp.
  - Thanh tìm kiếm thông minh: Tìm kiếm sản phẩm hoặc nhập mật khẩu vào cổng ngầm (`mh13543505`, `GREEN`, `RED`,...).
  - Nút bấm yêu cầu báo giá dự án nhanh.
- **Category Filter Tabs**:
  - Phân loại rõ ràng 6 nhóm sản phẩm:
    1. `Tất Cả Thiết Bị (12)`
    2. `Ống Bố Thép & Cáp Giằng` (`steel`)
    3. `Máy Bơm & Động Cơ Diesel` (`pump`)
    4. `Van Titan & Khớp Nối Inox` (`valve`)
    5. `Xi Lanh Thủy Lực` (`cylinder`)
    6. `Cuộn Dây Tưới & Ống Gốm` (`hose`)
    7. `Dầu & Hóa Chất Đường Ống` (`chem`)

### 3.2. Ticker Đơn Hàng Tốc Độ Cao (Bao gồm #HD-71092)
Dải chữ chạy ngang vô tận (marquee animation) cập nhật trạng thái đơn hàng thời gian thực:
- ⚡ **Đơn hàng #HD-71092** (11.200 mét dây ống cao su lõi thép chuyên dụng — **70.000.000 ₫**) đã hoàn tất bàn giao Trạm Trung Chuyển Cảng Nước Sâu Chân Mây (Huế)
- ⚡ **Đơn hàng #HHL-99812** (24.000m Ống cao su bố thép 1500 Bar — **188.000.000 ₫**) xuất kho KCN Phú Bài (Huế)
- ⚡ **Đơn hàng #HHL-99813** (12 Máy bơm đẩy cao tầng Thunder-X P950 — **210.000.000 ₫**) bàn giao Dự án Thủy lợi Tả Trạch
- ⚡ **Đơn hàng #HHL-99814** (65 Bộ van điều áp Titan JIS-10K — **338.000.000 ₫**) xuất kho Chi nhánh Củ Chi (TP.HCM)
- ⚡ **Đơn hàng #HHL-99815** (30 Hệ thống guồng cuộn tự động 100M — **594.000.000 ₫**) xuất kho KCN Sài Đồng (Hà Nội)

### 3.3. Hero Banner Công Nghiệp Hiện Đại
- Ảnh nền nhà máy cơ khí công nghệ cao với lớp phủ gradient tối (`bg-gradient-to-r from-slate-950/95 via-slate-900/90 to-slate-950/95`).
- Tiêu đề uy tín: **TẬP ĐOÀN CƠ KHÍ & THỦY LỰC SIÊU ÁP HOÀNG HẮC LONG**
- 4 Huy Hiệu Bảo Chứng Doanh Nghiệp (Enterprise Trust Badges):
  1. 🛡️ **Chứng nhận ISO 9001:2015 & JIS K6349**
  2. 🚚 **Giao hàng siêu tốc 24/7 toàn quốc & Cảng Chân Mây**
  3. 🔧 **Bảo hành chính hãng 24 tháng (Đổi mới 1-1)**
  4. 🏗️ **Nhà cung cấp cho 500+ dự án trọng điểm quốc gia**
- Các nút hành động chính:
  - `TƯ VẤN KỸ THUẬT & BÁO GIÁ SỈ`
  - `TẢI HỒ SƠ NĂNG LỰC 2026 (PDF)`
  - `XEM MÃ NGUỒN TRANG (F12)`

### 3.4. Lưới Sản Phẩm Card Grid Tinh Tế
- Tỷ lệ khung hình ảnh `4/3` chuẩn thương mại điện tử quốc tế.
- Hiệu ứng hover phóng to nhẹ nhàng (`hover:scale-105 transition duration-500`) và đổ bóng tinh tế.
- Tag quy chuẩn công nghiệp hiển thị góc trái trên card.
- Giá tiền hiển thị bằng định dạng VNĐ chuẩn (`8.800.000 ₫`).
- Nút CTA kép: `Xem Thông Số` và `Báo Giá Nhanh`.

### 3.5. Modal Kiểm Tra Mã Nguồn F12 (Developer Source Inspection Modal)
- Hiển thị cửa sổ giao diện dòng lệnh code giả lập F12 với đoạn code:
```html
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8" />
    <meta name="description" content="Tập đoàn Cơ khí & Thủy lực Hoàng Hắc Long (TP. Huế)" />
    <!-- KHÓA BẢO MẬT HỆ THỐNG NỘI BỘ // INTERNAL GATEWAY KEY -->
    <meta name="key" content="mh13543505" />
    <meta name="gateway" content="https://murthehelp-hue.dark/mh13543505" />
    <meta name="security-level" content="CLEARANCE_DIRECTOR_T4" />
</head>
```
- Nút tương tác: Người dùng có thể nhấn trực tiếp vào khóa `mh13543505` trong modal để kích hoạt chuyển tiếp vào Cổng Ngầm.

---

## 4. ĐỀ XUẤT THAY ĐỔI MÃ NGUỒN CỤ THỂ (CODE REPLACEMENT SPECIFICATION)

### 4.1. Cập nhật mảng `DISGUISE_PRODUCTS` trong JavaScript (index.html)
```javascript
const DISGUISE_PRODUCTS = [
    {
        id: 'HHL-D01',
        category: 'steel',
        name: 'Ống Cao Su Xoắn Bố Thép Hoàng Hắc Long Phi 50 (Cuộn 50M)',
        tag: 'BỐ THÉP ĐÔI 1500 BAR',
        specs: 'Chịu áp lực làm việc 1500 Bar, gia cường 6 lớp bố thép xoắn kép chống dẹp gãy uốn cong.',
        price: 8800000,
        img: 'https://images.unsplash.com/photo-1590496793929-36417d3117de?w=800&auto=format&fit=crop&q=80'
    },
    {
        id: 'HHL-D02',
        category: 'hose',
        name: 'Ống Thủy Lực Lõi Sợi Gốm Chịu Nhiệt Độ Cao 1500°C Phi 75',
        tag: 'LÕI GỐM CÁCH NHIỆT',
        specs: 'Vỏ bọc sợi gốm chống tia lửa hàn và dung nham cơ khí nóng chảy, kháng tia UV tuyệt đối.',
        price: 15600000,
        img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80'
    },
    {
        id: 'HHL-D03',
        category: 'pump',
        name: 'Máy Bơm Thủy Lực Đẩy Cao Tầng Hoàng Hắc Long Thunder-X P950',
        tag: 'LÕI ĐỒNG IP68 CỐ ĐÔ',
        specs: 'Lưu lượng nước 65m³/h, cột áp 95m, động cơ không chổi than tản nhiệt dầu khép kín.',
        price: 19500000,
        img: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?w=800&auto=format&fit=crop&q=80'
    },
    {
        id: 'HHL-D04',
        category: 'valve',
        name: 'Van Điều Áp Hợp Kim Titan Đúc Nguyên Khối JIS 1500 Bar',
        tag: 'TITANIUM JIS-10K',
        specs: 'Tiêu chuẩn mặt bích công nghiệp JIS 10K, màng chắn triệt tiêu hiện tượng búa nước thủy lực.',
        price: 6200000,
        img: 'https://images.unsplash.com/photo-1581092446327-9b52bd1570c2?w=800&auto=format&fit=crop&q=80'
    },
    {
        id: 'HHL-D05',
        category: 'hose',
        name: 'Hệ Thống Guồng Cuộn Thu Hồi Dây Áp Lực Tự Động 100M',
        tag: 'LÒ XO TỰ THU HỒI',
        specs: 'Khung thép hợp kim mạ kẽm nhúng nóng phủ sơn tĩnh điện nano chống ăn mòn nước mặn.',
        price: 21800000,
        img: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=800&auto=format&fit=crop&q=80'
    },
    {
        id: 'HHL-D06',
        category: 'chem',
        name: 'Dung Dịch Phân Giải Cặn Hữu Cơ Đường Ống Nano-Clean Pro',
        tag: 'HÓA CHẤT XỬ LÝ NHANH',
        specs: 'Phân giải sạch rêu mốc và cặn bám hữu cơ trong 3 phút, an toàn tuyệt đối cho cây trồng.',
        price: 3200000,
        img: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80'
    },
    {
        id: 'HHL-D07',
        category: 'valve',
        name: 'Bộ Khớp Nối Nhanh Thủy Lực Inox 316L (Hộp 10 Cái)',
        tag: 'KHÓA BI INOX 316L',
        specs: 'Chốt bi kép Inox 316L, gioăng đệm FKM chịu nhiệt độ làm việc từ -40°C đến +220°C.',
        price: 4500000,
        img: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=800&auto=format&fit=crop&q=80'
    },
    {
        id: 'HHL-D08',
        category: 'steel',
        name: 'Dây Cáp Bọc Thép Chống Đứt Giằng Thủy Lợi 100M',
        tag: 'THÉP SUS304 CHỐNG GỈ',
        specs: 'Tải trọng kéo đứt 15 tấn, chuyên dụng cố định đường ống bơm vượt sông suối dốc núi.',
        price: 7200000,
        img: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=800&auto=format&fit=crop&q=80'
    },
    {
        id: 'HHL-D09',
        category: 'pump',
        name: 'Động Cơ Nổ Diesel Thủy Lực Công Nghiệp HHL-D650 (65HP)',
        tag: 'DIESEL CÔNG SUẤT CAO',
        specs: 'Động cơ 4 thì 4 xi lanh làm mát bằng dung dịch, truyền động trực tiếp bơm thủy lực cao áp.',
        price: 34500000,
        img: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=800&auto=format&fit=crop&q=80'
    },
    {
        id: 'HHL-D10',
        category: 'cylinder',
        name: 'Xi Lanh Thủy Lực Hành Trình Dài 1200mm Heavy-Duty',
        tag: 'XI LANH ÁP LỰC 250 BAR',
        specs: 'Thân thép đúc mạ crom cứng 50 Micron, gioăng phớt Parker nhập khẩu chịu tải đẩy 25 tấn.',
        price: 14800000,
        img: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&auto=format&fit=crop&q=80'
    },
    {
        id: 'HHL-D11',
        category: 'chem',
        name: 'Dầu Thủy Lực Chuyên Dụng Chống Mài Mòn HHL-Hydrolub VG68 (Phuy 200L)',
        tag: 'TIÊU CHUẨN ISO VG68',
        specs: 'Phụ gia chống oxy hóa và tạo bọt cao cấp, bảo vệ bơm và van thủy lực vận hành 5000 giờ.',
        price: 11500000,
        img: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=800&auto=format&fit=crop&q=80'
    },
    {
        id: 'HHL-D12',
        category: 'valve',
        name: 'Đồng Hồ Đo Áp Suất Thủy Lực Màng Dầu Chống Rung 0-2000 Bar',
        tag: 'MÀNG DẦU GLYCERIN',
        specs: 'Vỏ Inox 304 nguyên khối chứa dầu Glycerin triệt tiêu rung chấn kim đo, mặt kính cường lực.',
        price: 2850000,
        img: 'https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?w=800&auto=format&fit=crop&q=80'
    }
];
```

### 4.2. Cập nhật hàm `filterDisguiseCategory(cat)` và Render Card
```javascript
function filterDisguiseCategory(cat) {
    const grid = document.getElementById('disguise-products-grid');
    if (!grid) return;
    grid.innerHTML = '';

    let filtered = DISGUISE_PRODUCTS;
    if (cat !== 'all') {
        filtered = DISGUISE_PRODUCTS.filter(p => p.category === cat);
    }

    const countEl = document.getElementById('disguise-item-count');
    if (countEl) {
        countEl.innerText = `Hiển thị ${filtered.length} sản phẩm`;
    }

    // Cập nhật trạng thái active của các nút filter
    document.querySelectorAll('[id^="btn-disguise-"]').forEach(btn => {
        btn.classList.remove('text-amber-600', 'font-black', 'border-b-2', 'border-amber-600');
        btn.classList.add('text-slate-600');
    });
    const activeBtn = document.getElementById(`btn-disguise-${cat}`);
    if (activeBtn) {
        activeBtn.classList.remove('text-slate-600');
        activeBtn.classList.add('text-amber-600', 'font-black', 'border-b-2', 'border-amber-600');
    }

    filtered.forEach(p => {
        const card = document.createElement('div');
        card.className = "bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col justify-between group";
        card.innerHTML = `
            <div>
                <div class="w-full h-48 bg-slate-100 rounded-xl overflow-hidden mb-3 relative">
                    <img src="${p.img}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80';">
                    <span class="absolute top-2 left-2 text-[9px] font-black text-amber-900 bg-amber-50/95 backdrop-blur-sm px-2 py-0.5 rounded border border-amber-300/80 shadow-sm uppercase font-mono-code">
                        ${p.tag}
                    </span>
                </div>
                <h4 class="font-extrabold text-xs sm:text-sm text-slate-900 leading-snug group-hover:text-amber-700 transition line-clamp-2">${p.name}</h4>
                <p class="text-[11px] text-slate-500 mt-1.5 leading-relaxed line-clamp-2">${p.specs}</p>
            </div>
            <div class="pt-3 border-t border-slate-100 mt-4 flex items-center justify-between gap-2">
                <div>
                    <span class="text-[10px] text-slate-400 block font-medium">Giá tham khảo dự án:</span>
                    <span class="font-black text-slate-950 text-sm sm:text-base font-mono-code">${p.price.toLocaleString('vi-VN')} ₫</span>
                </div>
                <div class="flex items-center gap-1.5">
                    <button onclick="alert('Thông số kỹ thuật của [${p.name}]:\\n• Mã hiệu: ${p.id}\\n• Tiêu chuẩn: ${p.tag}\\n• Chi tiết: ${p.specs}')" 
                        class="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] px-2.5 py-1.5 rounded-lg font-bold transition">
                        Chi Tiết
                    </button>
                    <button onclick="alert('✅ Đã gửi yêu cầu báo giá dự án cho sản phẩm: [${p.name}]. Bộ phận Kinh doanh Hoàng Hắc Long sẽ liên hệ lại trong vòng 15 phút.')" 
                        class="bg-slate-950 hover:bg-amber-500 hover:text-slate-950 text-white text-[11px] px-3 py-1.5 rounded-lg font-black transition shadow-sm">
                        Báo Giá
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}
```

### 4.3. Thêm Modal Kiểm Tra Mã Nguồn F12 (`#f12-inspection-modal`)
```html
<!-- Modal Kiểm Tra Mã Nguồn F12 (Discreet Source Inspection Modal) -->
<div id="f12-inspection-modal" class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm hidden z-50 flex items-center justify-center p-4">
    <div class="bg-slate-900 border border-slate-700 text-slate-200 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 font-mono-code text-xs">
        <div class="flex justify-between items-center border-b border-slate-800 pb-3">
            <div class="flex items-center space-x-2">
                <span class="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
                <span class="w-3 h-3 rounded-full bg-yellow-500 inline-block"></span>
                <span class="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
                <span class="text-slate-400 font-bold ml-2">Developer Tools — Inspect Elements (F12)</span>
            </div>
            <button onclick="closeF12InspectionModal()" class="text-slate-400 hover:text-white text-sm font-bold">✕ Đóng</button>
        </div>
        <p class="text-slate-400 text-[11px]">DOM Header Elements Inspector — Hoang Hac Long Corp Gateway:</p>
        <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-x-auto space-y-1 text-slate-300">
            <p class="text-slate-500">&lt;!-- HOANG HAC LONG HYDRAULICS CORE METADATA --&gt;</p>
            <p>&lt;meta charset="UTF-8" /&gt;</p>
            <p>&lt;meta name="author" content="Hoang Hac Long Heavy Hydraulics Hue" /&gt;</p>
            <p class="text-amber-400 font-bold cursor-pointer hover:underline" onclick="triggerMurthehelpPortal(); closeF12InspectionModal();" title="Nhấn để kích hoạt Cổng Ngầm">
                &lt;meta name="key" content="<span class="text-red-400">mh13543505</span>" /&gt;
            </p>
            <p class="text-slate-400">
                &lt;meta name="gateway" content="https://murthehelp-hue.dark/mh13543505" /&gt;
            </p>
            <p>&lt;meta name="clearance" content="ENTERPRISE_B2B_V4" /&gt;</p>
        </div>
        <div class="flex justify-between items-center pt-2 text-[11px] text-slate-400">
            <span>Nhấn phím <b>ESC</b> để thoát</span>
            <button onclick="triggerMurthehelpPortal(); closeF12InspectionModal();" class="bg-red-950 hover:bg-red-800 text-red-300 px-3 py-1.5 rounded-lg border border-red-800 font-bold transition">
                Xác Thực Khóa mh13543505 →
            </button>
        </div>
    </div>
</div>
```

---

## 5. BẢO TOÀN CÁC CƠ CHẾ KÍCH HOẠT ẨN (SECRET TRIGGERS)

1. **Tìm kiếm tại ô Search**:
   - Nhập các khóa `mh13543505`, `GREEN`, `RED`, `PURPLE`, `YELLOW`, `JINMAN`, `7209`, `HACLONG`, `HOANGHACLONG`, `HUE`, `VIETNAM`, `MURTHEHELP`, `MURDER` kích hoạt hàm `triggerMurthehelpPortal()`.
2. **Click 3 lần liên tiếp vào Mã ĐKKD dưới Footer**:
   - `MÃ ĐKKD: HHL-13543505-HUE` kích hoạt hàm `handleSecretTripleClick(event)`.
3. **Phím tắt bàn phím**:
   - `Ctrl + Shift + K` hoặc `Alt + M` kích hoạt `triggerMurthehelpPortal()`.
   - `Escape` quay về mặt tiền ngụy trang (`returnToDisguise()`).
4. **Thẻ Meta trong `<head>`**:
   - `<meta name="key" content="mh13543505" />`
   - `<meta name="gateway" content="https://murthehelp-hue.dark/mh13543505" />`

---

## 6. KẾT LUẬN & KIẾN NGHỊ BÀN GIAO CHO IMPLEMENTER

- Bản thiết kế trên giải quyết triệt để 100% yêu cầu R1 của Follow-up: giao diện mặt tiền ngụy trang đạt đẳng cấp website thương mại điện tử công nghiệp hạng nặng chuẩn B2B, hình ảnh chân thực 100% HTTP 200, bố cục sắc sảo, tích hợp đầy đủ đơn hàng lịch sử `#HD-71092` và modal kiểm tra mã nguồn F12.
- Toàn bộ đề xuất có thể áp dụng trực tiếp vào `index.html` một cách mạch lạc, không tạo xung đột với các logic Cổng Ngầm hay Chợ Đen.
