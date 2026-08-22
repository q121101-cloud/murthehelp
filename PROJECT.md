# Project: MURTHEHELP // MURDER.SHOPPING.MALL

## Architecture
A high-performance, single-page client-side web application integrating Three.js WebGL 3D shaders, Web Audio procedural synthesis, and Tailwind CSS.
- **Layer 0 (Canvas)**: Three.js WebGL canvas running a 3D simplex noise vertex displacement morphing sphere with dynamic Fresnel gradient shifts.
- **Layer 1 (Surfaces)**: Dual-layer UI with Glassmorphism:
  - Disguise Storefront: Nông Cụ Hợp Đức (Hamdeok Farming Tools) industrial agriculture e-commerce.
  - Transit Screen: Cinematic dark burgundy (`#4a0005`) transition stage with 3-color clearance stripe.
  - Dark Mall: Cyberpunk tactical marketplace (`#06070a` OLED black) with glassmorphic cards and category matrix.
- **Layer 2 (HUD & Modals)**: Sticky navigation, F12 source inspection modal, auto-login modal, cart drawer, tactical blueprint modal, admin management console, and order dispatch notification.
- **Audio Subsystem**: Zero-external-asset procedural Web Audio API synthesizer for tactile clicks, transit warp, tier chimes, and dispatch sounds.
- **State Store**: Central reactive state with localStorage persistence for balance, clearance tier, user identity, cart items, and transaction logs.

## Feature Inventory
| # | Feature | Description | Milestone | Source | Status |
|---|---------|-------------|-----------|--------|--------|
| 1 | Nông Cụ Hợp Đức Branding | Legitimate industrial agriculture e-commerce branding | M1 | ORIGINAL_REQUEST R1 | VERIFIED |
| 2 | High-Value Order #HD-71092 | Top alert banner (11.200m hose — 70.000.000 ₫) | M1 | ORIGINAL_REQUEST R1 | VERIFIED |
| 3 | F12 Source Inspection Modal | Utility modal exposing secret `<meta>` key & gateway tags | M1 | ORIGINAL_REQUEST R1 | VERIFIED |
| 4 | Multi-Passcode Gateway | Search bar authenticating `mh13543505`, `GREEN`, `RED`, `PURPLE`, `YELLOW`, `JINMAN`, `7209` | M1 | ORIGINAL_REQUEST R1 | VERIFIED |
| 5 | Disguise Product Matrix | 8+ industrial high-pressure hose, pump & valve products | M1 | ORIGINAL_REQUEST R1 | VERIFIED |
| 6 | Dark Burgundy Transit Screen | Cinematic transit stage in `#4a0005` with `murthehelp` branding | M1 | ORIGINAL_REQUEST R2 | VERIFIED |
| 7 | 3-Color Clearance Stripe | Signature horizontal bar (`#b3001e`, `#4d19bf`, `#e67e00`) | M1 | ORIGINAL_REQUEST R2 | VERIFIED |
| 8 | Auto-Login Alert Modal | Notification popup "ĐÃ TỰ ĐỘNG ĐĂNG NHẬP" with detected tier | M1 | ORIGINAL_REQUEST R2 | VERIFIED |
| 9 | Functional Confirm Trigger | "XÁC NHẬN (확인)" trigger with click, Enter, and Space support | M1 | ORIGINAL_REQUEST R2 | VERIFIED |
| 10 | Three.js 3D Morphing Sphere | Simplex noise vertex displacement sphere in OLED `#06070a` | M2 | ORIGINAL_REQUEST R3 | VERIFIED |
| 11 | Dynamic Fresnel Gradients | Shader color shifting (Red, Purple, Yellow, Green) | M2 | ORIGINAL_REQUEST R3 | VERIFIED |
| 12 | Mouse Parallax & Scroll Lerp | Interactive 60fps reaction to mouse and scroll inertia | M2 | ORIGINAL_REQUEST R3 | VERIFIED |
| 13 | Procedural Audio Synthesizer | Web Audio API acoustic feedback for clicks, transitions, alarms | M2 | ORIGINAL_REQUEST R3 | VERIFIED |
| 14 | Code Red Tactical Matrix | 24 weapons & explosives with exact VNĐ prices | M3 | ORIGINAL_REQUEST R4 | VERIFIED |
| 15 | Code Purple Espionage Matrix | 7 cleaning & espionage items with exact VNĐ prices | M3 | ORIGINAL_REQUEST R4 | VERIFIED |
| 16 | Code Yellow Medical Matrix | 7 medical kits & serums with exact VNĐ prices | M3 | ORIGINAL_REQUEST R4 | VERIFIED |
| 17 | Code Green Master Matrix | 5 master defense & backup assets with exact VNĐ prices | M3 | ORIGINAL_REQUEST R4 | VERIFIED |
| 18 | Subcategory Matrix & Access Control | Real-time filtering and clearance level access authorization | M3 | ORIGINAL_REQUEST R4 | VERIFIED |
| 19 | Tactical Blueprint Detail Modal | Specs & telemetry modal for weapons & equipment | M3 | ORIGINAL_REQUEST R4 | VERIFIED |
| 20 | Resilient SVG Fallbacks | Guaranteed zero broken image states with inline SVG data URIs | M3 | ORIGINAL_REQUEST R4 | VERIFIED |
| 21 | Covert Cart Drawer | Slide-out cart with quantity modifiers (+/-) & VNĐ total | M4 | ORIGINAL_REQUEST R5 | VERIFIED |
| 22 | Covert Logistics Dispatch | 3 covert dispatch modes (Drone, Thùng nông cụ, Safehouse) | M4 | ORIGINAL_REQUEST R5 | VERIFIED |
| 23 | Balance & Transaction Logs | Dynamic balance deduction & dispatch telemetry history | M4 | ORIGINAL_REQUEST R5 | VERIFIED |
| 24 | Master Admin Console | Passcode `JINMAN` / gear icon: deposit funds, switch tier, edit name | M4 | ORIGINAL_REQUEST R6 | VERIFIED |
| 25 | Emergency ESC Panic Protocol | Instant recovery to disguise storefront on ESC keypress | M4 | ORIGINAL_REQUEST R6 | VERIFIED |
| 26 | Automated E2E Test Suite (Tiers 1-4) | Comprehensive opaque-box test runner validating all features | M_TEST | ORIGINAL_REQUEST AC | VERIFIED |
| 27 | Final E2E Pass & Adversarial Coverage | 100% test pass + Tier 5 adversarial stress testing | M5 | ORIGINAL_REQUEST AC | VERIFIED |
| 28 | Local Serving & Git Delivery | Local server verification at port 3000 & clean Git commit | M5 | ORIGINAL_REQUEST AC | VERIFIED |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M_TEST | E2E Testing Suite | Test infrastructure & Tiers 1-4 test cases | None | DONE |
| M1 | Disguise & Portal | Storefront R1 (Nông Cụ Hợp Đức) + Transit Portal R2 | None | DONE |
| M2 | 3D WebGL & Audio | Three.js Shader sphere R3 + Web Audio Synthesizer | None | DONE |
| M3 | Tactical Arsenal Catalog | 43+ items R4 in VNĐ + Subcategories + Blueprint modal | M1, M2 | DONE |
| M4 | Cart, Logistics & Admin | Cart drawer R5 + 3 dispatch modes + Admin console R6 + ESC panic | M3 | DONE |
| M5 | Final E2E Pass & Delivery | 100% E2E test pass + Tier 5 adversarial hardening + local serve + git | M_TEST, M4 | DONE |

## Interface Contracts

### Disguise Storefront ↔ Transit Portal
- Function: `triggerTransitionPortal(passcode, initialTier)`
- Parameters: `passcode` (string), `initialTier` (`'GREEN'` | `'RED'` | `'PURPLE'` | `'YELLOW'`)
- Effect: Hides `#disguise-stage`, shows `#portal-stage`, starts 3-stripe animation, schedules 1.2s auto-login modal.

### Transit Portal ↔ Dark Mall
- Function: `enterDarkMallFinal()`
- Trigger: Click on "XÁC NHẬN (확인)" button, `Enter` key, or `Space` key.
- Effect: Hides `#portal-stage`, displays `#dark-stage`, starts WebGL render loop, triggers sound `playDecoderWarp()`.

### Clearance Tier Controller ↔ Three.js Shader Canvas
- Function: `setClearanceTier(tier, playSound = true)`
- Parameters: `tier` (`'GREEN'` | `'RED'` | `'PURPLE'` | `'YELLOW'`)
- Effect: Updates `state.currentTier`, transitions WebGL shader uniform colors (`u_color_primary`, `u_color_secondary`, `u_color_glow`), filters tactical catalog, updates HUD badges.

### Cart & Balance Store ↔ Logistics Dispatch
- State: `{ balance: number, cart: Array<{ id, code, name, price, qty, tier, img }>, transactions: Array<Transaction> }`
- Function: `executeCheckout(dispatchMethod)`
- Return: `{ success: boolean, message: string, orderId: string, remainingBalance: number }`

### Admin Management Console ↔ State Store
- Function: `updateAdminSettings({ name, tier, depositAmount })`
- Effect: Mutates active user identity, credits balance, triggers audio feedback, updates UI headers.

### Panic Protocol ↔ All Layers
- Function: `triggerEmergencyPanic()`
- Trigger: `Escape` key event listener.
- Effect: Closes all modals (F12, Cart, Admin, Blueprint), sets active view to `#disguise-stage`, mutes/pauses WebGL if needed.

## Code Layout
- `index.html`: Complete standalone client application (HTML, CSS, Three.js shaders, Web Audio synthesizer, JavaScript business logic, and UI templates).
- `tests/e2e/test_runner.js`: Automated Node.js opaque-box E2E test runner (65/65 tests passed).
- `tests/e2e/test_cases.json`: Test matrix encompassing Tiers 1 through 4.
- `TEST_INFRA.md`: E2E test infrastructure specification.
- `TEST_READY.md`: E2E test readiness publication.
- `README.md`: Project documentation and user manual.
