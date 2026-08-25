# Comprehensive Survey & Architectural Specification: Tier 1 Storefront & Covert Interactive Mechanics

**Target Project:** `murthehelp` (Dual-Layer Vietnamese Industrial / Tactical Dark Mall Simulation)  
**File Inspected:** `/Users/quan/.gemini/antigravity/scratch/murthehelp/index.html` (2,817 lines, 161,754 bytes)  
**Author:** Teamwork Explorer 1 (Tier 1 & Covert Mechanics Survey Specialist)  
**Timestamp:** 2026-08-25T04:11:00Z  
**Verification Baseline:** 44/44 E2E Test Runner assertions passed (100%), 85/85 Adversarial & Victory Oracle assertions passed (100%).

---

## 1. Executive Summary & Problem Boundary

The `murthehelp` platform is a single-file, multi-tier web application simulating a legitimate Vietnamese heavy industrial manufacturing corporation (*Tập Đoàn Cơ Khí & Thủy Lực Hoàng Hắc Long - Huế* / *Hamdeok Corp*) that conceals a covert tactical arms and dark-market procurement portal (*murderhelp* / *MURDER-SHOP*), inspired by the K-drama *A Shop for Killers*.

The primary objective of this investigation is to provide a complete, verified component-by-component architectural mapping of:
1. **Tier 1 Public Disguise Storefront (`#disguise-stage`)**: Corporate branding, visual hierarchy, layout grid, typography, technical specification badges, product catalog rendering (`DISGUISE_PRODUCTS`), and hardware-accelerated ticker implementation.
2. **Covert Interactive Mechanics & Triggers**: The footer triple-click mechanism on `HHL-13543505-HUE` (1.5s window), secret search keywords (`MH13543505`, `MURDERHELP`, `JINMAN`, `7209`, `RED`, `PURPLE`, `YELLOW`, `GREEN`, etc.) and their clearance mappings, keyboard shortcuts (`Ctrl+Shift+K`, `Alt+M`), and the global `Escape` emergency panic protocol.
3. **Preservation & Invariant Rules**: Critical DOM IDs, CSS selectors, data structures, and event bindings required to guarantee 100% functional integrity and backward compatibility with automated CI/CD test harnesses during the visual overhaul.

---

## 2. Comprehensive DOM Architecture of Tier 1 (`#disguise-stage`)

The entire Tier 1 stage is contained within `<div id="disguise-stage" class="min-h-screen flex flex-col">` (line 124 of `index.html`). The sub-components and their layout structure are detailed below:

```
#disguise-stage (flex flex-col min-h-screen)
├── Top Utility Bar (bg-slate-950 text-slate-300 text-xs py-2 border-b border-slate-800)
│   ├── Badge: "CỐ ĐÔ HUẾ // HỆ THỐNG THỦY LỰC TRỌNG ĐIỂM"
│   ├── Corporate text: "Tập Đoàn Cơ Khí & Thủy Lực Hoàng Hắc Long // Nông Cụ Hợp Đức (Hamdeok Corp)"
│   └── Metadata: Trụ sở TP. Huế | Kho Cảng Chân Mây | Hotline 1900-8868
│
├── Infinite Order Marquee Ticker (.ticker-container, .marquee-track)
│   ├── Duplicate track block 1 (7 orders including #HD-71092, #HHL-99812 to #HHL-99817)
│   └── Duplicate track block 2 (identical duplicate for seamless -50% translation loop)
│
├── Sticky Main Header (<header class="sticky top-0 z-30 bg-white border-b border-slate-200">)
│   ├── Brand & Logo: Dragon emblem "🐉" + "HOÀNG HẮC LONG" + Badge "HHL CORP // HUẾ"
│   ├── Disguise Search: #disguise-search-input + "Tìm Kiếm" button (handleDisguiseSearch())
│   └── Subcategory Nav: Buttons for 'all', 'steel', 'pump', 'valve', 'cylinder', 'hose', 'chem'
│
├── Main Showcase (<main class="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-grow space-y-8">)
│   ├── Hero Banner: 1500 Bar industrial background, 4 Enterprise Trust Badges (ISO 9001, 24/7, 24T, 500+), CTAs
│   ├── Catalog Section: #disguise-cat-title, #disguise-item-count, #disguise-products-grid
│   └── Corporate Facility Overview (#about-corp: Head Office, Logistics Hub, South Branch)
│
└── Footer (bg-slate-950 text-slate-400 py-10 border-t border-slate-800)
    ├── National Sovereignty Banner: "🇻🇳 HOÀNG SA VÀ TRƯỜNG SA MÃI MÃI LÀ CỦA VIỆT NAM! 🇻🇳"
    ├── Corporate Legal & Licensing details
    └── Covert Trigger Span: MÃ ĐKKD: <span onclick="handleSecretTripleClick(event)">HHL-13543505-HUE</span>
```

### Component Breakdown & Code References

| Component | DOM ID / Selector | Code Lines | Current Implementation Details |
|---|---|---|---|
| **Top Utility Bar** | `.bg-slate-950` | 127–141 | Dark industrial top banner displaying regional authority, dual corporate naming (Hoàng Hắc Long & Hamdeok Corp), and logistics hubs. |
| **Order Ticker Container** | `.ticker-container` | 144–221 | Amber gradient container (`bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600`) with overflow hidden and `z-20`. |
| **Marquee Track** | `.marquee-track` | 145–220 | Flex container with `width: max-content`, executing CSS `@keyframes marquee` duration `65s linear infinite`. Pauses on `.ticker-container:hover` or `.marquee-track:hover`. Contains critical order `#HD-71092` (70.000.000 ₫). |
| **Main Header** | `<header>` | 224–269 | Sticky header with white background, corporate logo, branding, search bar, and subcategory navigation. |
| **Search Input** | `#disguise-search-input` | 244–246 | `<input type="text" id="disguise-search-input">` styled with Tailwind. Bound to Enter key and search button. |
| **Category Nav** | `[id^="btn-disguise-"]` | 256–267 | Filter buttons: `#btn-disguise-all`, `#btn-disguise-steel`, `#btn-disguise-pump`, `#btn-disguise-valve`, `#btn-disguise-cylinder`, `#btn-disguise-hose`, `#btn-disguise-chem`. |
| **Hero Banner** | `div.relative.rounded-3xl` | 275–335 | Unsplash industrial imagery with dark gradient overlay, 1500 Bar headline, and 4 trust badges (ISO 9001:2015, 24/7 Logistics, 24M Warranty, 500+ Projects). |
| **Product Showcase** | `#disguise-products-grid` | 338–354 | Grid container rendering items from `DISGUISE_PRODUCTS` via `filterDisguiseCategory()`. Has `#disguise-cat-title` and `#disguise-item-count`. |
| **About Enterprise** | `#about-corp` | 357–380 | Enterprise profile detailing the Hue metallurgy and 1500 Bar hydraulic hose plant, with 3 logistics hubs. |
| **Sovereignty Banner** | `div.bg-gradient-to-r` | 387–396 | High-contrast Vietnamese red-and-gold sovereignty affirmation for Hoàng Sa & Trường Sa. |
| **Footer Secret Span** | `<span ... onclick="handleSecretTripleClick(event)">` | 406–409 | Yellow text span with content `HHL-13543505-HUE` invoking `handleSecretTripleClick(event)`. |
| **F12 Inspection Modal** | `#f12-inspection-modal` | 417–448 | Hidden developer simulation modal (`#f12-source-modal`) revealing metadata key `mh13543505` and trigger button. |

---

## 3. Typography & Styling System

### Current vs. Target Font Stack
- **Headings & Body UI (`font-sans`)**:
  - Current & Target: `'Plus Jakarta Sans', sans-serif`
  - Loaded via Google Fonts: `family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400`
  - Used on headings, body copy, navigation labels, and standard buttons.
- **Technical Specifications, Currency & Metadata (`font-mono-code` / `font-mono`)**:
  - Current & Target: `'Space Grotesk', 'JetBrains Mono', monospace`
  - Loaded via Google Fonts: `family=Space+Grotesk:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600;800`
  - Applied to product codes (`HHL-D01`), pressure ratings (`1500 Bar`), order numbers (`#HD-71092`), prices (`8.800.000 ₫`), and secret registration spans (`HHL-13543505-HUE`).

### Color Palette Architecture
- **Primary Disguise Background**: `bg-slate-50` (`#f8fafc`) for public storefront body, with dark contrast top bar (`#020617`).
- **Industrial Steel / Titanium Tone**: `slate-900` (`#0f172a`), `slate-800` (`#1e293b`), `slate-700` (`#334155`), `slate-200` (`#e2e8f0`).
- **High-Pressure Accent (Gold / Amber)**: `amber-500` (`#f59e0b`), `amber-600` (`#d97706`), `amber-400` (`#fbbf24`), custom `hhl.gold` (`#d4af37`).
- **Dark Mode / Dark Mall OLED Tone**: `oled` (`#06070a`), `oledCard` (`#0c0e14`), `oledBorder` (`rgba(255, 255, 255, 0.08)`).
- **Transit Portal Tone**: `transit` (`#4a0005`), `bg-[#3b0206]`.

---

## 4. Disguise Product Catalog Data Structure (`DISGUISE_PRODUCTS`)

The disguise catalog is defined at line 890 of `index.html` as `const DISGUISE_PRODUCTS = [...]`. It contains 12 verified products across 6 distinct categories:

| ID | Category | Product Name | Technical Tag | Price (VNĐ) | Verified CDN Image URL |
|---|---|---|---|---|---|
| `HHL-D01` | `steel` | Ống Cao Su Xoắn Bố Thép Hoàng Hắc Long Phi 50 (Cuộn 50M) | BỐ THÉP ĐÔI 1500 BAR | 8.800.000 ₫ | `photo-1590496793929-36417d3117de` |
| `HHL-D02` | `hose` | Ống Thủy Lực Lõi Sợi Gốm Chịu Nhiệt Độ Cao 1500°C Phi 75 | LÕI GỐM CÁCH NHIỆT | 15.600.000 ₫ | `photo-1581092160607-ee22621dd758` |
| `HHL-D03` | `pump` | Máy Bơm Thủy Lực Đẩy Cao Tầng Hoàng Hắc Long Thunder-X P950 | LÕI ĐỒNG IP68 CỐ ĐÔ | 19.500.000 ₫ | `photo-1508974239320-0a029497e820` |
| `HHL-D04` | `valve` | Van Điều Áp Hợp Kim Titan Đúc Nguyên Khối JIS 1500 Bar | TITANIUM JIS-10K | 6.200.000 ₫ | `photo-1581092446327-9b52bd1570c2` |
| `HHL-D05` | `hose` | Hệ Thống Guồng Cuộn Thu Hồi Dây Áp Lực Tự Động 100M | LÒ XO TỰ THU HỒI | 21.800.000 ₫ | `photo-1581093588401-fbb62a02f120` |
| `HHL-D06` | `chem` | Dung Dịch Phân Giải Cặn Hữu Cơ Đường Ống Nano-Clean Pro | HÓA CHẤT XỬ LÝ NHANH | 3.200.000 ₫ | `photo-1532187863486-abf9dbad1b69` |
| `HHL-D07` | `valve` | Bộ Khớp Nối Nhanh Thủy Lực Inox 316L (Hộp 10 Cái) | KHÓA BI INOX 316L | 4.500.000 ₫ | `photo-1530124566582-a618bc2615dc` |
| `HHL-D08` | `steel` | Dây Cáp Bọc Thép Chống Đứt Giằng Thủy Lợi 100M | THÉP SUS304 CHỐNG GỈ | 7.200.000 ₫ | `photo-1563770660941-20978e870e26` |
| `HHL-D09` | `pump` | Động Cơ Nổ Diesel Thủy Lực Công Nghiệp HHL-D650 (65HP) | DIESEL CÔNG SUẤT CAO | 34.500.000 ₫ | `photo-1513828583688-c52646db42da` |
| `HHL-D10` | `cylinder` | Xi Lanh Thủy Lực Hành Trình Dài 1200mm Heavy-Duty | XI LANH ÁP LỰC 250 BAR | 14.800.000 ₫ | `photo-1581092580497-e0d23cbdf1dc` |
| `HHL-D11` | `chem` | Dầu Thủy Lực Chuyên Dụng Chống Mài Mòn HHL-Hydrolub VG68 (Phuy 200L) | TIÊU CHUẨN ISO VG68 | 11.500.000 ₫ | `photo-1584467735871-8e85353a8413` |
| `HHL-D12` | `valve` | Đồng Hồ Đo Áp Suất Thủy Lực Màng Dầu Chống Rung 0-2000 Bar | MÀNG DẦU GLYCERIN | 2.850.000 ₫ | `photo-1581092334651-ddf26d9a09d0` |

### Rendering Engine (`filterDisguiseCategory`)
- Filters `DISGUISE_PRODUCTS` based on `category` parameter.
- Updates title `#disguise-cat-title` and count `#disguise-item-count`.
- Toggles active styling on `#btn-disguise-${cat}` (`text-amber-600 font-black border-b-2 border-amber-600`).
- Dynamically renders product cards with hover elevation, technical tag, price formatting (`price.toLocaleString('vi-VN') + ' ₫'`), and modal alerts for "Chi Tiết" and "Báo Giá".

---

## 5. Covert Interactive Mechanics & Triggers Deep Dive

### 5.1 Footer Triple-Click Trigger (`handleSecretTripleClick`)

```
[User Clicks "HHL-13543505-HUE"]
       │
       ▼
 secretClickCount++
 clearTimeout(secretClickTimer)
       │
       ├─── [count >= 3] ───────────────────────────► [Reset count = 0]
       │                                                    │
       │                                                    ▼
       │                                         triggerMurthehelpPortal()
       │
       └─── [count < 3] ────────────────────────────► [Set Timer 1500ms]
                                                            │
                                                  (if 1.5s expires)
                                                            ▼
                                                     secretClickCount = 0
```

- **Exact Location**: Line 407 (HTML span) & Line 2010 (JavaScript function).
- **DOM Binding**: `<span class="text-amber-400 hover:text-amber-300 font-bold transition cursor-pointer select-none" title="Mã chứng nhận hệ thống" onclick="handleSecretTripleClick(event)">HHL-13543505-HUE</span>`.
- **Timing Window**: Exactly **1500 ms (1.5 seconds)**.
- **State Variables**: `let secretClickCount = 0; let secretClickTimer = null;`
- **Code Implementation**:
  ```javascript
  function handleSecretTripleClick(e) {
      if (e && e.stopPropagation) e.stopPropagation();
      secretClickCount++;
      clearTimeout(secretClickTimer);

      if (secretClickCount >= 3) {
          secretClickCount = 0;
          triggerMurthehelpPortal();
      } else {
          secretClickTimer = setTimeout(() => {
              secretClickCount = 0;
          }, 1500);
      }
  }
  ```
- **Boundary Conditions Tested & Verified**:
  - 1 or 2 clicks do NOT open the portal.
  - Exactly 3 clicks within 1500ms opens `#portal-stage` and resets `secretClickCount` to `0`.
  - A 4th click after trigger begins a new sequence with count = 1.
  - Inactivity > 1500ms resets count to `0`.

---

### 5.2 Secret Search Keys Gateway (`handleDisguiseSearch`)

- **Exact Location**: Line 248 (HTML search button), Line 2005 (Enter key listener), Line 1979 (JavaScript function).
- **Search Element**: `<input type="text" id="disguise-search-input" ...>`
- **Normalization**: `const val = rawVal.trim().toUpperCase();` (whitespace trimmed, case-insensitive).
- **Secret Keyword Dictionary & Clearance Mappings**:

| Keyword Matched | Assigned Clearance (`userClearance`) | Role Update (`currentUser.role`) | Portal Trigger Action |
|---|---|---|---|
| `RED` | `'RED'` | `'RED'` | `triggerMurthehelpPortal()` |
| `PURPLE` | `'PURPLE'` | `'PURPLE'` | `triggerMurthehelpPortal()` |
| `YELLOW` | `'YELLOW'` | `'YELLOW'` | `triggerMurthehelpPortal()` |
| `GREEN`, `JINMAN`, `7209`, `MH13543505`, `HACLONG`, `HOANGHACLONG`, `HUE`, `VIETNAM`, `MURDERHELP`, `MURTHEHELP`, `MURDER` | `'GREEN'` | `'GREEN'` | `triggerMurthehelpPortal()` |
| Any other non-matching search term | Unchanged | Unchanged | Alert: `🔍 Kết quả tìm kiếm cho "${rawVal.trim()}": Không có mặt hàng ống nước nào phù hợp với quy cách này.` |

- **Code Implementation**:
  ```javascript
  function handleDisguiseSearch() {
      const inputEl = document.getElementById('disguise-search-input');
      const rawVal = inputEl ? inputEl.value : '';
      const val = rawVal.trim().toUpperCase();
      const SECRET_KEYS = ['MH13543505', 'GREEN', 'RED', 'PURPLE', 'YELLOW', 'JINMAN', '7209', 'HACLONG', 'HOANGHACLONG', 'HUE', 'VIETNAM', 'MURDERHELP', 'MURTHEHELP', 'MURDER'];
      
      if (SECRET_KEYS.some(k => val.includes(k))) {
          if (val.includes('RED')) {
              userClearance = 'RED';
              if (currentUser) currentUser.role = 'RED';
          } else if (val.includes('PURPLE')) {
              userClearance = 'PURPLE';
              if (currentUser) currentUser.role = 'PURPLE';
          } else if (val.includes('YELLOW')) {
              userClearance = 'YELLOW';
              if (currentUser) currentUser.role = 'YELLOW';
          } else if (val.includes('GREEN') || val.includes('JINMAN') || val.includes('7209') || val.includes('MH13543505') || val.includes('HACLONG') || val.includes('HOANGHACLONG') || val.includes('HUE') || val.includes('VIETNAM') || val.includes('MURDERHELP') || val.includes('MURTHEHELP') || val.includes('MURDER')) {
              userClearance = 'GREEN';
              if (currentUser) currentUser.role = 'GREEN';
          }
          triggerMurthehelpPortal();
      } else {
          alert(`🔍 Kết quả tìm kiếm cho "${rawVal.trim()}": Không có mặt hàng ống nước nào phù hợp với quy cách này.`);
      }
  }
  ```

---

### 5.3 Global Keyboard Shortcuts & Panic / Emergency Return Protocol (`Escape`)

- **Exact Location**: Lines 2026–2044 (Keyboard event listener) & Lines 2071–2088 (`returnToDisguise`).
- **Keyboard Shortcuts Matrix**:

| Key Combination | Scope / Context | Action Executed | Description |
|---|---|---|---|
| `Escape` (`ESC`) | Global (Any stage or modal) | `closeCartModal()`, `closeOrdersModal()`, `closeAdminModal()`, `closeProductDetailModal()`, `closeF12InspectionModal()`, `returnToDisguise()` | **Emergency Panic Protocol**: Instantly hides all tactical screens/modals, clears search input, resets background color to `#f8fafc`, and restores `#disguise-stage`. |
| `Ctrl + Shift + K` | Global | `triggerMurthehelpPortal()` | Covert hotkey to unlock transit portal. |
| `Alt + M` | Global | `triggerMurthehelpPortal()` | Alternate covert hotkey to unlock transit portal. |
| `Enter` or `Space` | When on `#portal-stage` | `enterDarkMallFinal()` | Rapid entry into `#dark-stage` from portal. |

- **Code Implementation (`returnToDisguise`)**:
  ```javascript
  function returnToDisguise() {
      const dark = document.getElementById('dark-stage');
      if (dark) { dark.classList.add('hidden'); dark.classList.remove('flex'); }
      const portal = document.getElementById('portal-stage');
      if (portal) { portal.classList.add('hidden'); portal.classList.remove('flex'); }
      const cartModal = document.getElementById('cart-modal');
      if (cartModal) { cartModal.classList.add('hidden'); cartModal.classList.remove('flex'); }
      const cartBackdrop = document.getElementById('cart-drawer-backdrop');
      if (cartBackdrop) { cartBackdrop.classList.add('hidden'); }
      const adminModal = document.getElementById('admin-modal');
      if (adminModal) { adminModal.classList.add('hidden'); adminModal.classList.remove('flex'); }
      const disguise = document.getElementById('disguise-stage');
      if (disguise) { disguise.classList.remove('hidden'); }
      const mainBody = document.getElementById('main-body');
      if (mainBody) { mainBody.style.backgroundColor = '#f8fafc'; }
      const searchInp = document.getElementById('disguise-search-input');
      if (searchInp) { searchInp.value = ''; }
  }
  ```

---

## 6. Stage Transition Pipeline State Machine

```
   ┌────────────────────────────────────────────────────────┐
   │                                                        │
   │                [#disguise-stage] (Visible)             │
   │             (Hoàng Hắc Long B2B Storefront)            │
   │                                                        │
   └───────┬───────────────────────┬────────────────────────┘
           │                       │
           │ Triple-Click on       │ Search Key Match
           │ HHL-13543505-HUE      │ (MH13543505, RED, ...)
           │ OR Ctrl+Shift+K       │
           ▼                       ▼
   ┌────────────────────────────────────────────────────────┐
   │                                                        │
   │                [#portal-stage] (Visible)               │
   │               (murderhelp Transit Portal)              │
   │                                                        │
   └───────┬────────────────────────────────────────────────┘
           │
           │ Auth Login (q121101 / admin)
           │ OR Enter / Space keypress
           ▼
   ┌────────────────────────────────────────────────────────┐
   │                                                        │
   │                 [#dark-stage] (Visible)                │
   │                (MURDER-SHOP Dark Mall)                 │
   │                                                        │
   └───────────────────────┬────────────────────────────────┘
                           │
                           │  Press ESC Key (Emergency Panic)
                           │  OR Click "Thoát Khẩn Cấp"
                           │
                           ▼
                    [returnToDisguise()]
                           │
                           ▼
             [#disguise-stage] (Restored)
```

---

## 7. Quality Invariants & Test Suite Regression Guardrails

To ensure zero regressions across the 44 E2E tests and 85 adversarial assertions during the UI overhaul, the following invariants MUST be preserved:

| Test ID | Critical Invariant | Required Value / Condition |
|---|---|---|
| `T1-R1-01` | Ticker animation speed | CSS `@keyframes marquee` duration $\ge 55\text{s}$ (target: 65s) |
| `T1-R1-02` | Ticker hover pause | `.marquee-track:hover` or `.ticker-container:hover` sets `animation-play-state: paused` |
| `T1-R1-03` | Disguise order content | Marquee track must contain `#HD-71092` with `70.000.000 ₫` |
| `T1-R2-01` | Navbar F12 button absence | No visible F12 inspection trigger button in the navbar |
| `T1-R2-02` | Hero F12 button absence | No visible F12 inspection button in the hero CTA area |
| `T1-R2-03` | F12 modal preservation | `#f12-inspection-modal` preserved in DOM with initial `hidden` class |
| `T1-R2-04` | Secret text span & handler | Span with text `HHL-13543505-HUE` and attribute `onclick="handleSecretTripleClick(event)"` |
| `T1-R2-05` | Triple-click timeout window | Exactly `1500` ms timeout in `handleSecretTripleClick` |
| `T1-R2-06` | Portal transition handler | `triggerMurthehelpPortal()` toggles `#disguise-stage` and `#portal-stage` |
| `T2-BND-05` | Marquee keyframe bounds | `@keyframes marquee` translates `translateX(0%)` to `translateX(-50%)` |
| `T2-BND-12` | Search gateway robustness | Trims whitespace, case-insensitive, handles `MH13543505`, `RED`, `PURPLE`, etc. |
| `T3-INT-01..04` | Stage transitions | Clean forward pipeline and multi-cycle re-entry (10+ cycles with zero state leakage) |
| `ADV-ST-02` | Panic return cleanup | `returnToDisguise()` resets body background to `#f8fafc` and clears `#disguise-search-input` |
| `ADV-PC-01..03` | Catalog image health | All images in `DISGUISE_PRODUCTS` (12 items) and `PRODUCTS_DB` (54 items) must return HTTP 200 |

---

## 8. Recommended Implementation Strategy for Tier 1 Overhaul

To elevate the public storefront to a **$150k+ European Industrial B2B aesthetic** without touching or breaking any underlying mechanics:

1. **Visual Language & Grid System**:
   - Introduce crisp, high-density titanium/slate border styling (`border-slate-800/60`, subtle micro-grid background texture).
   - Use high-contrast typography hierarchy using `Plus Jakarta Sans` (weights 400, 600, 800) for corporate headlines and `Space Grotesk` / `JetBrains Mono` for precision engineering metadata.
2. **Precision Engineering Badges**:
   - Enhance the 4 Hero Trust Badges with technical iconography, certification references (ISO 9001:2015, JIS K6349, ISO 18752), and 1500 Bar burst-pressure tolerances.
   - Add micro-callout chips for CAD tolerances, DIN standards, and DIN EN 853 / 856 wire braid specifications on product cards.
3. **Hardware-Accelerated Marquee Ticker**:
   - Maintain the dual-block structure (`translateX(0%)` to `translateX(-50%)`) for seamless 60fps infinite looping.
   - Preserve hover-pause rules in CSS (`animation-play-state: paused`).
   - Retain exact order payloads including `#HD-71092` with `70.000.000 ₫`.
4. **Preserve Exact DOM IDs & Event Bindings**:
   - Retain all element IDs: `disguise-stage`, `disguise-search-input`, `btn-disguise-*`, `disguise-cat-title`, `disguise-item-count`, `disguise-products-grid`, `about-corp`, `f12-inspection-modal`.
   - Keep exact handlers: `handleSecretTripleClick(event)`, `handleDisguiseSearch()`, `filterDisguiseCategory(cat)`, `returnToDisguise()`, `openF12InspectionModal()`, `closeF12InspectionModal()`.
5. **Pre-commit Automated Verification**:
   - Run `node tests/e2e/test_runner.js`
   - Run `node tests/adversarial_challenger_1.js`
   - Run `node tests/adversarial_challenger_2.js`
   - Run `node tests/victory_audit_suite.js`

---
*End of Survey Tier 1 & Covert Mechanics Report.*
