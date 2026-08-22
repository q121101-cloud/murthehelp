# Specification Mining Report: MURTHEHELP // MURDER.SHOPPING.MALL

**Document Reference**: `/Users/quan/.gemini/antigravity/scratch/murthehelp/ORIGINAL_REQUEST.md`  
**Target Application**: Dual-Layer Cyberpunk 3D WebGL Web Platform (Vietnamese Localization & VNĐ Currency)  
**Agent**: `spec_miner_survey`  
**Date**: 2026-08-22T23:28:24+07:00  

---

## 1. Observation

Direct examination of `/Users/quan/.gemini/antigravity/scratch/murthehelp/ORIGINAL_REQUEST.md`, `/Users/quan/.gemini/antigravity/scratch/murthehelp/README.md`, and the initial prototype `/Users/quan/.gemini/antigravity/scratch/murthehelp/index.html` revealed the following exact specifications and discrepancies:

1. **Dual-Layer Storefront Architecture**:
   - The disguise layer must represent **Nông Cụ Hợp Đức (Hamdeok Farming Tools)** specializing in industrial agriculture, 1200 Bar steel wire hoses, multi-stage booster pumps, and titanium valves.
   - Prominent notification badge for **Đơn hàng số #HD-71092** (11.200 mét dây ống cao su lõi thép chuyên dụng — 70.000.000 ₫).
   - Discreet "Xem mã nguồn trang (F12)" modal exposing:
     ```html
     <meta name="key" content="mh13543505" />
     <meta name="gateway" content="https://mhshoppingkill87689.dark/mh13543505" />
     ```
   - Search bar must accept exact trigger keys: `mh13543505`, `GREEN`, `RED`, `PURPLE`, `YELLOW`, `JINMAN`, `7209`.

2. **Transit Screen & Clearance Mechanics**:
   - Transit screen background color must be Dark Burgundy (`#4a0005`).
   - Lowercase branding `murthehelp` accompanied by the 3-color clearance stripe:
     - Crimson Red: `#b3001e`
     - Ultraviolet: `#4d19bf`
     - Radiant Amber: `#e67e00`
   - Modal popup "ĐÃ TỰ ĐỘNG ĐĂNG NHẬP" with detected user tier and functional "XÁC NHẬN (확인)" button (clickable and keyboard accessible via `Enter`/`Space`).

3. **3D WebGL Shader Canvas & OLED Dark Theme**:
   - Background theme: Pitch-black OLED (`#06070a`), eliminating outdated CRT scanlines for an ultra-modern aesthetic.
   - Interactive Three.js (r128+ CDN) 3D vertex-displacement noise / Fresnel shader sphere reacting to mouse movement and dynamic palette transitions per tier:
     - **Code Red**: Deep Crimson (`#b3001e` / `#ff1a40`) & Molten Gold (`#ffd700` / `#f59e0b`)
     - **Code Purple**: Ultraviolet (`#4d19bf` / `#7c3aed`) & Neon Orchid (`#da70d6` / `#e879f9`)
     - **Code Yellow**: Radiant Amber (`#e67e00` / `#f59e0b`) & Solar Flare (`#ffaa00` / `#fde047`)
     - **Code Green**: Emerald Jade (`#059669` / `#10b981`) & Cyber Mint (`#00ffaa` / `#6ee7b7`)

4. **Product Catalog & VNĐ Currency Matrix**:
   - 40+ distinct tactical items across 4 clearance tiers (RED, PURPLE, YELLOW, GREEN) with exact product codes, full Vietnamese descriptions, and dot-separated VNĐ prices (`xx.xxx.xxx ₫`).
   - 8+ agricultural disguise products.
   - Dynamic balance calculation, cart drawer, and 3 covert dispatch methods.

5. **Master Admin & Emergency Protocols**:
   - Admin console with passcode `JINMAN` or gear icon allowing VNĐ deposits, tier switching, and account holder name editing (Default: `Jeong Jin-man`).
   - Emergency panic key `ESC` instantly returning to the disguise storefront.

---

## 2. Logic Chain

1. **Disguise Layer Verification**: The disguise layer must appear 100% legitimate to ordinary visitors without any visible dark web elements. All entry triggers (`mh13543505`, `GREEN`, `RED`, `PURPLE`, `YELLOW`, `JINMAN`, `7209`, F12 modal, triple-click) route into the transit portal with appropriate initial clearance privileges.
2. **Transit & Authentication Flow**: Upon triggering, the application displays `#4a0005` burgundy screen, initiates the 3-stripe animation, and triggers the "ĐÃ TỰ ĐỘNG ĐĂNG NHẬP" alert showing the user tier. Clicking "XÁC NHẬN (확인)" or pressing Enter/Space smoothly unmasks the dark mall.
3. **Clearance Matrix & WebGL Synergy**: When the active clearance tab or user clearance changes (Red, Purple, Yellow, Green), the 3D shader uniforms transition colors smoothly, the subcategory sidebar dynamically adapts, and product cards lock/unlock according to the user's clearance hierarchy (Code Green having master privilege to purchase all items).
4. **Cart & Dispatch Mechanics**: Adding items to cart accumulates prices formatted in VNĐ. Checking out validates sufficient balance, deducts the total, records transaction telemetry, and simulates covert dispatch (Drone, Disguise container, Safehouse).
5. **Admin & Panic Safety**: The Admin console enables dynamic state mutation (balance deposit, tier change, name edit), while the `ESC` panic handler globally overrides all modals and views to instantly restore the disguise storefront.

---

## 3. Features Discovered

| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|----------|---------|-------------|--------|---------|----------------|----------------|
| 1 | Disguise Storefront | Nông Cụ Hợp Đức Branding | Industrial agriculture & high-pressure hose e-commerce interface with Hamdeok enterprise branding | User navigation, Category filtering | Category list, product cards, company profile | Fallback to 'all' categories | ORIGINAL_REQUEST R1 |
| 2 | Disguise Storefront | Order Alert #HD-71092 | High-value order notification banner: 11.200m steel hose — 70.000.000 ₫ | Page load | Dismissible/visible top alert banner | Graceful layout retention | ORIGINAL_REQUEST R1 |
| 3 | Disguise Storefront | F12 Inspection Modal | Discreet "Xem mã nguồn trang (F12)" utility displaying secret `<meta>` tags | Click on F12 button / key shortcut | Modal showing key `mh13543505` and gateway URL | Modal closes on backdrop/ESC click | ORIGINAL_REQUEST R1 |
| 4 | Disguise Storefront | Multi-Passcode Gateway | Search bar authenticating secret trigger keys: `mh13543505`, `GREEN`, `RED`, `PURPLE`, `YELLOW`, `JINMAN`, `7209` | Text input in search bar | Activates transition portal with mapped clearance tier | Shows standard agricultural search empty state if unmatched | ORIGINAL_REQUEST R1 & R2 |
| 5 | Disguise Storefront | Agricultural Catalog (8+ Items) | Display 8+ high-pressure hoses, pumps, titanium valves, quick couplings, and cleaning fluids | Category tab selection | Product cards with Vietnamese names, specs, VNĐ prices | Fallback image SVG placeholder on load error | ORIGINAL_REQUEST R1 & R4 |
| 6 | Transition Portal | Dark Burgundy Transit Stage | Cinematic transit stage in `#4a0005` with lowercase branding `murthehelp` | Secret trigger activation | Fullscreen transition screen with scanline/glow | Fallback to dark screen if animation delayed | ORIGINAL_REQUEST R2 |
| 7 | Transition Portal | 3-Color Clearance Stripe | Signature horizontal bar: Crimson Red (`#b3001e`), Ultraviolet (`#4d19bf`), Radiant Amber (`#e67e00`) | Stage activation | Smoothly rendered 3-stripe visual bar | Static CSS fallbacks | ORIGINAL_REQUEST R2 |
| 8 | Transition Portal | Auto-Login Alert Modal | Notification popup "ĐÃ TỰ ĐỘNG ĐĂNG NHẬP" displaying detected tier (e.g. CODE GREEN) | 1.2s delay after portal entrance | Modal with account tier and confirm button | Shows default Master tier if unassigned | ORIGINAL_REQUEST R2 |
| 9 | Transition Portal | Functional Confirm Trigger | "XÁC NHẬN (확인)" trigger transitioning cleanly to the dark mall | Button click, `Enter` key, `Space` key | Closes transit stage, mounts dark mall stage | Ignore redundant clicks | ORIGINAL_REQUEST R2 & AC |
| 10 | 3D WebGL Shader | Three.js Morphing Sphere | BlueYard-style 3D morphing sphere with fluid vertex displacement noise shader | Mouse movement, scroll delta, frame render loop | Interactive 3D WebGL canvas in `#06070a` OLED background | Fallback CSS radial gradient if WebGL unsupported | ORIGINAL_REQUEST R3 |
| 11 | 3D WebGL Shader | Dynamic Clearance Palettes | Shader iridescent / Fresnel gradient shifts based on active clearance (Red: Crimson/Gold; Purple: Ultraviolet/Orchid; Yellow: Amber/Solar; Green: Emerald/Mint) | Tier selection event (`RED`, `PURPLE`, `YELLOW`, `GREEN`) | Smooth shader uniform color interpolation | Fallbacks to default green/red palette | ORIGINAL_REQUEST R3 |
| 12 | Tactical Catalog | Code Red Matrix (16+ Items) | Weapons & Combat: Colt M1911 (P020), Glock 19 (P033), TT-33 (P021), Desert Eagle (P022), S&W 686 (R009), Colt Python (R018), Rhino 60DS (R019), MAC-10 (MG021), MP5 (SMG01), P90 (SMG02), AWM (SNP01), Barrett M82 (SNP02), CheyTac M200 (SNP03), Flashbang (EXP01), C4 (EXP02), Dao CQC (MEL01) | Red category selection, subcategory filtering | Product grid with dot formatted VNĐ prices, tactical specs, badges | Locked overlay if user lacks Red/Green clearance | ORIGINAL_REQUEST R4 |
| 13 | Tactical Catalog | Code Purple Matrix (7+ Items) | Cleaning & Espionage: Axit Sinh Học PX-70 (PUR01), Micro Drone (PUR02), EMP Phá Sóng (PUR03), Laser Quad-Eye (PUR04), Cleaner-Pro (PUR05), PX-9 Luminol (PUR06), Bio-Mask (PUR07) | Purple category selection, subcategory filtering | Product grid with specs, prices in VNĐ | Locked overlay if user lacks Purple/Green clearance | ORIGINAL_REQUEST R4 |
| 14 | Tactical Catalog | Code Yellow Matrix (6+ Items) | Medical & Serums: Túi IFAK (YEL01), Serum Adrenaline (YEL02), Máy AED-X (YEL03), Gạc Celox Pro (YEL04), Bio-Glue (YEL05), Phẫu thuật dã chiến (YEL06) | Yellow category selection, subcategory filtering | Product grid with specs, prices in VNĐ | Locked overlay if user lacks Yellow/Green clearance | ORIGINAL_REQUEST R4 |
| 15 | Tactical Catalog | Code Green Matrix (5+ Items) | Master Admin & Backup: Khiên Graphene Cấp IV (GRN01), Biệt Đội Can Thiệp 5 Phút (GRN02), Sentinel Bot (GRN03), Giáp Titanium (GRN04), Két Sắt Thermite (GRN05) | Green category selection | Master tier product grid with specs, prices in VNĐ | Locked overlay if user lacks Green clearance | ORIGINAL_REQUEST R4 |
| 16 | Tactical Catalog | Subcategory Sidebar Navigation | Real-time filtering by subcategories (Pistols, Revolvers, SMGs, Rifles, Snipers, Explosives, Melee, Chemicals, Espionage, Medical, Serums, Defense, Backup) | Click subcategory button | Updates grid and item counter instantly | Defaults to "All Items" of selected tier | ORIGINAL_REQUEST R4 |
| 17 | Tactical Catalog | Resilient Image Fallback | Guaranteed zero broken images across all products via SVG Data URI generator | Network failure / 404 error | Renders high-tech tactical SVG placeholder | Prevents broken image icon | ORIGINAL_REQUEST R4 & AC |
| 18 | Covert Cart & Logistics | Real-Time Cart Drawer | Interactive drawer calculating total order sum with dot-separated VNĐ formatting | Add to cart, modify quantity, delete item | Real-time total, item count badge | Prevent negative quantities | ORIGINAL_REQUEST R5 |
| 19 | Covert Cart & Logistics | Covert Dispatch Methods | Selection of 3 covert dispatch modes: 1. Drone Tàng Hình Ban Đêm (GPS < 0.5m); 2. Thùng Nông Cụ Ngụy Trang; 3. Safehouse (Tọa độ tự hủy 60p) | Dropdown selection | Selects dispatch channel metadata for checkout log | Default to Drone dispatch | ORIGINAL_REQUEST R5 |
| 20 | Covert Cart & Logistics | Dynamic Balance Deduction | Automated validation of account balance, deduction on checkout, and transaction dispatch alerts | Click "Xác nhận thanh toán" | Deducts balance, clears cart, triggers dispatch alert modal | Rejects checkout if balance < total | ORIGINAL_REQUEST R5 |
| 21 | Admin Console | Master Admin Management | Modal accessible via passcode `JINMAN` or top-right gear icon | Click gear / enter `JINMAN` | Form to deposit VNĐ, switch clearance tier, edit account name | Rejects invalid deposit numbers (<= 0) | ORIGINAL_REQUEST R6 |
| 22 | Security & Panic | Emergency ESC Panic Protocol | Global key listener for `Escape` key | Pressing `ESC` key | Immediately closes all modals, hides dark mall, restores disguise storefront | Safe to press repeatedly | ORIGINAL_REQUEST R6 & AC |

---

## 4. Edge Cases

| # | Feature | Input | Observed Behavior |
|---|---------|-------|-------------------|
| 1 | Passcode Gateway | Lowercase vs Uppercase input (e.g. `green`, `Green`, `GREEN`, `mh13543505`) | Case-insensitive matching ensures all variants authenticate correctly. |
| 2 | Passcode Gateway | Special character or whitespace surrounding key (e.g. `  JINMAN  `) | Input is trimmed prior to matching to avoid false rejections. |
| 3 | Disguise Search | Non-matching search string (e.g. `ống tưới lan 10mm`) | Normal search feedback displayed without exposing the dark portal. |
| 4 | Transit Confirmation | Pressing `Enter` or `Space` while alert modal is active | Triggers `enterDarkMallFinal()`, matching standard accessible keyboard behavior. |
| 5 | Transit Confirmation | Rapid double-clicking on "XÁC NHẬN (확인)" button | Transition executes once cleanly without glitching stages. |
| 6 | 3D WebGL Canvas | Resize window / mobile viewport change | `camera.aspect` and `renderer.setSize` update automatically with device pixel ratio clamp. |
| 7 | 3D WebGL Canvas | Browsers without WebGL support | Gracefully degrades to a high-tech CSS linear/radial gradient background without script crashes. |
| 8 | Tactical Product Access | User with `RED` clearance attempts to purchase `GREEN` or `PURPLE` item | Card shows locked badge ("🔒 YÊU CẦU QUYỀN CODE [TIER]") and disables purchase button. |
| 9 | Tactical Product Access | Master user with `GREEN` clearance browsing `RED`, `PURPLE`, `YELLOW` | Code Green has supreme privilege and can purchase items across all tiers. |
| 10 | Cart & Checkout | Checkout with empty cart | Warning alert ("Kiện hàng đang trống") is shown and checkout is halted. |
| 11 | Cart & Checkout | Cart total exceeds current VNĐ balance | Error alert shows required vs available funds and prompts user to deposit funds via Admin console. |
| 12 | Admin Deposit | Non-numeric or negative deposit amount | Input is validated; invalid inputs trigger warning alert without altering balance. |
| 13 | Admin Name Edit | Blank/empty username input | Defaults back to `Jeong Jin-man`. |
| 14 | Emergency Panic | Pressing `ESC` from within open Cart or Admin modal | Closes modals and immediately returns to the disguise storefront in one step. |
| 15 | Image Asset Error | External Unsplash image blocked by network / offline | `onerror` replaces src with SVG Data URI tactical blueprint placeholder without console errors. |

---

## 5. Detailed Specification Matrices

### 5.1 Exact Tactical Arsenal Catalog (40+ Products in VNĐ)

#### CODE RED (Vũ Khí & Tác Chiến)
1. **Colt M1911 Custom** — Code: `P020` | Price: `38.500.000 ₫` | Subcategory: `Pistol` | Cỡ đạn .45 ACP, báng gỗ mun gia công tinh xảo, đã mài xóa số sê-ri.
2. **Glock 19 Gen 5 Blackout** — Code: `P033` | Price: `16.500.000 ₫` | Subcategory: `Pistol` | Cỡ đạn 9x19mm Parabellum, rãnh gắn giảm thanh, phủ Cerakote đen tuyền.
3. **Tokarev TT-33** — Code: `P021` | Price: `21.000.000 ₫` | Subcategory: `Pistol` | Cỡ đạn 7.62×25mm xuyên áo giáp mỏng, độ tin cậy cơ học tuyệt đối.
4. **Desert Eagle .50 AE Titan** — Code: `P022` | Price: `48.000.000 ₫` | Subcategory: `Pistol` | Hỏa lực uy lực cực đại, phủ titan mờ chống phản quang ánh sáng ban đêm.
5. **Heckler & Koch USP Tactical .45** — Code: `P023` | Price: `36.000.000 ₫` | Subcategory: `Pistol` | Ống giảm âm nguyên khối cacbon, thước ngắm dạ quang ban đêm tritium.
6. **Sig Sauer P226 Legion Black** — Code: `P024` | Price: `34.000.000 ₫` | Subcategory: `Pistol` | Trang bị cò rút ngắn SRT, ray Picatinny tích hợp đèn pin laser hồng ngoại.
7. **Smith & Wesson Model 686 .357** — Code: `R009` | Price: `42.000.000 ₫` | Subcategory: `Revolver` | Cỡ đạn .357 Magnum mạ crom sáng bóng, ổ xoay 6 viên chuẩn xác.
8. **Colt Python .357** — Code: `R018` | Price: `49.500.000 ₫` | Subcategory: `Revolver` | Độ giật cân bằng, nòng khương tuyến 6 inch chuẩn xạ thủ chuyên nghiệp.
9. **Chiappa Rhino 60DS** — Code: `R019` | Price: `46.000.000 ₫` | Subcategory: `Revolver` | Thiết kế nòng đặt dưới trục xoay triệt tiêu độ hất nòng khi bắn nhanh.
10. **MAC-10 Compact Auto** — Code: `MG021` | Price: `85.000.000 ₫` | Subcategory: `Machine Pistol` | Tốc độ bắn 1200 viên/phút, kèm ống tiêu âm giảm thanh kéo dài.
11. **HK MP5 Navy Mod** — Code: `SMG01` | Price: `95.000.000 ₫` | Subcategory: `SMG` | Độ giật cực thấp, báng rút tiện dụng tác chiến không gian hẹp.
12. **FN P90 Tactical** — Code: `SMG02` | Price: `115.000.000 ₫` | Subcategory: `SMG` | Băng đạn 50 viên đặt ngang, cỡ đạn 5.7x28mm xuyên giáp Kevlar.
13. **KRISS Vector .45 ACP Gen II** — Code: `SMG03` | Price: `135.000.000 ₫` | Subcategory: `SMG` | Hệ thống cơ chế Super V triệt tiêu hoàn toàn lực giật ngược.
14. **HK416D Tác Chiến Đặc Nhiệm** — Code: `AR01` | Price: `165.000.000 ₫` | Subcategory: `Assault Rifle` | Piston trích khí ngắn chống cát bụi, nòng mạ crom dài 14.5 inch.
15. **FN SCAR-H 7.62x51mm NATO** — Code: `AR02` | Price: `195.000.000 ₫` | Subcategory: `Assault Rifle` | Sức công phá mạnh, tầm bắn hiệu quả 800m, báng gập tùy chỉnh.
16. **AI AWM .338** — Code: `SNP01` | Price: `210.000.000 ₫` | Subcategory: `Sniper Rifle` | Tầm bắn hiệu quả 1500m, kính ngắm Schmidt & Bender 5-25x56.
17. **Barrett M82A1 .50 BMG** — Code: `SNP02` | Price: `340.000.000 ₫` | Subcategory: `Sniper Rifle` | Súng bắn tỉa công phá xe bọc thép hạng nhẹ và công sự bê tông dày.
18. **CheyTac M200 Intervention** — Code: `SNP03` | Price: `450.000.000 ₫` | Subcategory: `Sniper Rifle` | Tầm bắn kỷ lục 2300m, máy tính đường đạn PDA tích hợp đo gió thời tiết.
19. **SV-98 Tactical Suppressed** — Code: `SNP04` | Price: `185.000.000 ₫` | Subcategory: `Sniper Rifle` | Súng bắn tỉa trích khí nạp đạn tay kèm ống giảm thanh nguyên khối.
20. **Flashbang M84 x4** — Code: `EXP01` | Price: `16.000.000 ₫` | Subcategory: `Explosives` | Cường độ 175dB và 6 triệu candela làm tê liệt hệ thần kinh trong 15 giây.
21. **C4 Kèm Kíp Nổ Từ Xa** — Code: `EXP02` | Price: `35.000.000 ₫` | Subcategory: `Explosives` | 1.25kg thuốc nổ dẻo RDX, kích hoạt sóng vô tuyến mã hóa chống rò quét.
22. **Mìn Định Hướng Claymore M18A1** — Code: `EXP03` | Price: `28.000.000 ₫` | Subcategory: `Explosives` | 700 viên bi thép hình quạt tạo vùng sát thương hủy diệt 50 mét.
23. **Dao CQC Tungsten** — Code: `MEL01` | Price: `12.500.000 ₫` | Subcategory: `Melee` | Hợp kim Tungsten không từ tính, vô hình trước máy dò kim loại sân bay.
24. **Lưỡi Lê Titan Tác Chiến Karambit** — Code: `MEL02` | Price: `9.800.000 ₫` | Subcategory: `Melee` | Thép gấp Damascus phủ DLC chống mài mòn, lưỡi cong móc cận chiến.

#### CODE PURPLE (Dọn Dẹp & Do Thám)
25. **Axit Sinh Học PX-70** — Code: `PUR01` | Price: `45.000.000 ₫` | Subcategory: `Chemicals` | Hòa tan mọi mô hữu cơ, xương và dấu vết DNA trong 10 phút, không khói không mùi.
26. **Micro Drone Trinh Sát Tàng Hình** — Code: `PUR02` | Price: `68.000.000 ₫` | Subcategory: `Espionage` | Kích thước siêu nhỏ 6cm, camera hồng ngoại tầm nhiệt, truyền sóng vi ba bảo mật.
27. **EMP Phá Sóng Quân Sự** — Code: `PUR03` | Price: `52.000.000 ₫` | Subcategory: `Espionage` | Làm nhiễu toàn bộ sóng điện thoại, Wi-Fi và camera an ninh trong bán kính 100m.
28. **Máy Quét Laser Xuyên Tường Quad-Eye** — Code: `PUR04` | Price: `78.000.000 ₫` | Subcategory: `Espionage` | Thu lại rung động vi mô trên bề mặt kính cách xa 500m và giải mã âm thanh thoại chuẩn.
29. **Vali Khử Từ Ổ Cứng Cleaner-Pro** — Code: `PUR05` | Price: `85.000.000 ₫` | Subcategory: `Data Wipe` | Xóa vĩnh viễn chip nhớ flash và đĩa từ theo tiêu chuẩn Bộ Quốc Phòng NSA 130-2.
30. **Dung Dịch Phá Hủy Phản Ứng Luminol PX-9** — Code: `PUR06` | Price: `28.000.000 ₫` | Subcategory: `Chemicals` | Phá hủy hoàn toàn phân tử hemoglobin của máu, vô hiệu hóa đèn chiếu pháp y UV.
31. **Bột Trung Hòa Khí Độc & Mùi Tử Thi Bio-Mask** — Code: `PUR07` | Price: `19.000.000 ₫` | Subcategory: `Chemicals` | Hấp thụ 99.9% khí amoniac và hợp chất lưu huỳnh sinh ra từ hiện trường phân hủy.

#### CODE YELLOW (Y Tế & Cứu Thương)
32. **Túi Sơ Cứu Chấn Thương IFAK** — Code: `YEL01` | Price: `14.500.000 ₫` | Subcategory: `Medical Kit` | Bao gồm gạc cầm máu Celox, garo xoay tự động và kim giải áp màng phổi khẩn cấp.
33. **Serum Adrenaline Pro** — Code: `YEL02` | Price: `28.000.000 ₫` | Subcategory: `Serum` | Kích hoạt trạng thái tỉnh táo cực đại và ức chế 95% cảm giác đau đớn trong 45 phút.
34. **Máy Khử Rung Tim AED-X** — Code: `YEL03` | Price: `32.000.000 ₫` | Subcategory: `Medical Kit` | Tự động phân tích nhịp tim và sốc điện phục hồi tuần hoàn sau chấn động nặng.
35. **Băng Ép Cầm Máu Celox Pro** — Code: `YEL04` | Price: `18.500.000 ₫` | Subcategory: `Medical Kit` | Hạt cầm máu sinh học đông vón máu động mạch chỉ sau 30 giây áp lực.
36. **Keo Dán Vết Thương Sinh Học Bio-Glue** — Code: `YEL05` | Price: `18.500.000 ₫` | Subcategory: `Serum` | Hàn gắn động mạch đứt và cầm máu tức thì trong 5 giây không cần chỉ khâu.
37. **Bộ Phẫu Thuật Gắp Đầu Đạn Dã Chiến** — Code: `YEL06` | Price: `26.000.000 ₫` | Subcategory: `Medical Kit` | Kẹp titanium chống nhiễm khuẩn, đèn nội soi sợi quang và kháng sinh tiêm trực tiếp.
38. **Hộp Viên Uống Giải Độc Thần Kinh Toàn Diện** — Code: `YEL07` | Price: `22.000.000 ₫` | Subcategory: `Serum` | Giải trừ các loại độc tố rắn, khí ga Sarin và chất độc thần kinh tổng hợp.

#### CODE GREEN (Đặc Quyền Tối Cao)
39. **Khiên Graphene Cấp IV** — Code: `GRN01` | Price: `180.000.000 ₫` | Subcategory: `Defense` | Hợp kim Graphene siêu nhẹ, chặn đứng đạn súng trường 7.62x51mm AP liên tiếp.
40. **Biệt Đội Can Thiệp Vũ Trang 5 Phút** — Code: `GRN02` | Price: `850.000.000 ₫` | Subcategory: `Backup` | 4 đặc nhiệm vũ trang hạng nặng xuất hiện giải cứu tại bất kỳ tọa độ nào trong 5-7 phút.
41. **Robot Tác Chiến Phòng Thủ Sentinel** — Code: `GRN03` | Price: `920.000.000 ₫` | Subcategory: `Defense` | Ngụy trang vali, tự bung súng 6 nòng xoay và AI nhận diện mục tiêu 360°.
42. **Giáp Titanium Exoskeleton** — Code: `GRN04` | Price: `450.000.000 ₫` | Subcategory: `Defense` | Trợ lực vận động nâng 200kg, chống đạn xuyên tâm và chống mảnh văng nổ.
43. **Két Sắt Ngầm Tự Hủy Bằng Nhiệt Nhôm Thermite** — Code: `GRN05` | Price: `290.000.000 ₫` | Subcategory: `Defense` | Nhiệt độ thiêu hủy 3000°C làm bốc hơi toàn bộ tài liệu và ổ cứng khi bị xâm nhập.

---

### 5.2 Disguise Storefront Product Catalog (8+ Products)
1. **Ống Cao Su Xoắn Bố Thép 1200 Bar Phi 50** — Code: `HD-01` | `7.800.000 ₫` | Category: `steel` | 6 lớp bố thép xoắn chống móp xẹp, chịu áp lực làm việc 1200 Bar.
2. **Ống Nhựa Cao Áp Thủy Lực Sapphire Phi 75** — Code: `HD-02` | `14.200.000 ₫` | Category: `hose` | Gia cường sợi dệt polyester kép bọc nhựa dẻo EPDM kháng tia UV.
3. **Máy Bơm Đẩy Cao Tầng Cánh Quạt Kép P900** — Code: `HD-03` | `17.500.000 ₫` | Category: `pump` | Động cơ tản nhiệt dầu khép kín, lưu lượng 55m³/h, cột áp 85m.
4. **Van Áp Lực Đúc Titan Nguyên Khối JIS-10K** — Code: `HD-04` | `5.200.000 ₫` | Category: `valve` | Chịu xung lực 1500 Bar, đệm kín gốm sứ chống rò rỉ hóa chất.
5. **Phụ Kiện Khớp Nối Nhanh Thủy Lực Inox 316L (Hộp 10 Cái)** — Code: `HD-05` | `3.600.000 ₫` | Category: `valve` | Khóa bi kép tự động, gioăng FKM chịu nhiệt độ làm việc 200°C.
6. **Hệ Thống Guồng Cuộn Thu Hồi Dây Tự Động 100M** — Code: `HD-06` | `19.800.000 ₫` | Category: `pump` | Khung hợp kim nhôm đúc phủ sơn tĩnh điện nano chống ăn mòn.
7. **Dung Dịch Phân Giải Cặn Hữu Cơ Đường Ống Nano-Clean** — Code: `HD-07` | `2.800.000 ₫` | Category: `chem` | Tẩy sạch rêu mốc và cặn bám hữu cơ trong 3 phút, bảo vệ lớp cao su.
8. **Dây Dẫn Khí Nén Bọc Sợi Gốm Chịu Nhiệt 30M** — Code: `HD-08` | `6.400.000 ₫` | Category: `hose` | Vỏ bọc sợi gốm cách nhiệt chống tia lửa xỉ hàn và phôi kim loại nóng chảy.

---

### 5.3 Trigger Passcodes & Action Map
- `mh13543505`: Default master key (origin: Jin-man's Murthehelp identification code).
- `GREEN`: Directly unlocks Code Green (Master tier).
- `RED`: Unlocks Code Red (Weapons & Combat tier).
- `PURPLE`: Unlocks Code Purple (Cleaning & Espionage tier).
- `YELLOW`: Unlocks Code Yellow (Medical & Rescue tier).
- `JINMAN`: Directly authenticates as Jeong Jin-man (Master / Admin).
- `7209`: Direct passkey (Jin-man's door code in the drama) unlocking Master tier.

---

## 6. Caveats

1. **Standalone Deployment Requirement**: The application is an ultra-modern client-side single-page application using CDN-hosted libraries (Tailwind CSS, Three.js r128+, Lucide Icons, Google Fonts). It must not require node_modules build steps to run.
2. **Fallback Asset Availability**: All tactical images point to high-resolution Unsplash URLs with inline SVG Data URIs bound to `onerror` handlers to guarantee zero broken image states under offline or restricted network environments.
3. **CRT Scanlines Removal**: Per Acceptance Criteria, obsolete CRT scanline overlays must be removed in favor of a sleek, modern pitch-black OLED aesthetic (`#06070a`) with modern typography (`Plus Jakarta Sans`, `Space Grotesk`, `JetBrains Mono`).

---

## 7. Conclusion

All functional requirements (R1–R6), acceptance criteria, product specifications, passcodes, transition portal dynamics, 3D WebGL shader specs, and edge cases have been mined, probed, and cataloged. The resulting specification provides an unambiguous blueprint for architecture exploration, UI styling, and implementation.

---

## 8. Verification Method

To verify the specification catalog:
1. **Inspect ORIGINAL_REQUEST.md**:
   ```bash
   cat /Users/quan/.gemini/antigravity/scratch/murthehelp/ORIGINAL_REQUEST.md
   ```
2. **Verify Product Codes and Pricing**:
   Check that all 43 tactical items and 8 disguise products match their respective VNĐ prices, IDs (`P020`, `P033`, `PUR01`, `YEL01`, `GRN01`, etc.), and clearance tiers.
3. **Validate Passcodes**:
   Confirm that all 7 passcodes (`mh13543505`, `GREEN`, `RED`, `PURPLE`, `YELLOW`, `JINMAN`, `7209`) are mapped to valid clearance levels.
4. **Validate Portal & WebGL Specs**:
   Confirm `#4a0005` burgundy transit background, 3-stripe colors (`#b3001e`, `#4d19bf`, `#e67e00`), and Three.js shader palette mappings for Red, Purple, Yellow, and Green tiers.
