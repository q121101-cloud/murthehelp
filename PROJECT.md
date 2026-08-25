# Project: murthehelp UI/UX & 3D WebGL Overhaul

## Architecture
Single-page application (`index.html`) featuring a 3-tier progressive disclosure simulation architecture:
1. **Tier 1 (`#disguise-stage`)**: Public European Industrial B2B Disguise Storefront (*Tập Đoàn Cơ Khí & Thủy Lực Hoàng Hắc Long - Huế* / *Hamdeok Corp*). Clean steel/slate aesthetic, Plus Jakarta Sans typography, Space Grotesk/JetBrains Mono specs, precision telemetry badges (ISO 9001:2015, JIS K6349, ISO 18752, 1500 Bar ratings), hardware-accelerated 65s ticker with hover-pause, catalog grid.
2. **Tier 2 (`#portal-stage`)**: Transit biometric portal. Burgundy vignette gradient (`#4a0005` to `#240003` to `#0d0001`), dual-speed biometric laser sweep beam, holographic grid matrix, centered `murderhelp` neon glow title, 3-color clearance stripe (`#b3001e`, `#4d19bf`, `#e67e00`), and glassmorphism auth modal.
3. **Tier 3 (`#dark-stage` & `#webgl-canvas`)**: Awwwards-grade tactical dark mall (*MURDER-SHOP*). Driven by Three.js Fresnel Iridescent Plasma Sphere with Simplex noise fBm vertex displacement, chromatic aberration, and reactive clearance palettes (CODE RED, PURPLE, YELLOW, GREEN). Double-Bezel weapon cards and Floating Island action buttons.
4. **Backend & Storage**: Dual-mode Supabase integration (`murthehelp_users`, `murthehelp_orders`) with offline resilient `localStorage` fallbacks.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| F1 | European Industrial Typography & Theme | Plus Jakarta Sans body, Space Grotesk/JetBrains Mono specs, Steel/Slate palette | M1 | ORIGINAL_REQUEST §R1 |
| F2 | Precision Data Badges & Layout | ISO 9001:2015, JIS K6349, ISO 18752, 1500 Bar badges, refined micro-interactions | M1 | ORIGINAL_REQUEST §R1 |
| F3 | Hardware-Accelerated Marquee Ticker | Smooth 65s ticker with hover-pause and order #HD-71092 70.000.000 ₫ | M1 | ORIGINAL_REQUEST §R1 |
| F4 | Covert Trigger: Footer Triple-Click | Triple click on `HHL-13543505-HUE` within 1.5s unlocks portal | M1 | ORIGINAL_REQUEST §R4 |
| F5 | Covert Trigger: Secret Search Keys | `MH13543505`, `MURDERHELP`, `JINMAN`, `7209`, `RED`, `PURPLE`, `YELLOW`, `GREEN` | M1 | ORIGINAL_REQUEST §R4 |
| F6 | Covert Trigger: Emergency Panic Protocol | Global `Escape` key immediately returns to disguise storefront | M1 | ORIGINAL_REQUEST §R4 |
| F7 | Burgundy Transit Canvas & Vignette | Radial burgundy gradient `#4a0005` to `#240003` to `#0d0001` | M2 | ORIGINAL_REQUEST §R2 |
| F8 | Biometric Laser Scanning & Hologram Grid | Dual-speed vertical laser sweep beam, glowing flare, corner telemetry reticles | M2 | ORIGINAL_REQUEST §R2 |
| F9 | Centered Neon Title & 3-Color Glow Stripe | Centered `murderhelp` glow title with 3-color clearance stripe | M2 | ORIGINAL_REQUEST §R2 |
| F10 | Glassmorphic Tactical Auth Modal | Optical glassmorphic box, tactical input affordances, login validation | M2 | ORIGINAL_REQUEST §R2 |
| F11 | WebGL Fresnel Iridescent Plasma Sphere | Three.js shader with Simplex noise fBm displacement and chromatic aberration | M3 | ORIGINAL_REQUEST §R3 |
| F12 | Reactive Clearance Color Palettes | Smooth color transitions for CODE RED, PURPLE, YELLOW, GREEN | M3 | ORIGINAL_REQUEST §R3 |
| F13 | Double-Bezel Tactical Weapon Cards | Dual-contour layered frames with obsidian chassis and recessed asset wells | M3 | ORIGINAL_REQUEST §R3 |
| F14 | Floating Island Action Buttons | Pill-shaped action triggers ("Xem Chi Tiết", "+ Thêm Giỏ") with fluid hover states | M3 | ORIGINAL_REQUEST §R3 |
| F15 | Fluid Cart Drawer & Subcategory Nav | Animated cart slide-in, subcategory pill indicator, modal dialogues | M3 | ORIGINAL_REQUEST §R3 |
| F16 | Supabase State & Admin Auth | Super Admin `q121101` / `Tungqu@n1208.` CODE GREEN 2B ₫ sync, wallet, orders | M3 | ORIGINAL_REQUEST §R4 |
| F17 | Dual Track E2E Playwright Suite | Comprehensive headless E2E test suite + screenshot verification across all 3 tiers | M4 | ORIGINAL_REQUEST §R5 |
| F18 | Forensic Integrity Audit & Hardening | Binary veto verification (zero dummy logic, authentic runtime data flow) | M5 | ORIGINAL_REQUEST §R5 |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Tier 1 European Industrial Storefront | F1, F2, F3, F4, F5, F6 | none | DONE |
| M2 | Tier 2 Biometric Laser Transit Portal | F7, F8, F9, F10 | M1 | DONE |
| M3 | Tier 3 WebGL Plasma Shader & Tactical UI | F11, F12, F13, F14, F15, F16 | M2 | DONE |
| M4 | E2E Playwright Suite & Visual Verification | F17 (Tiers 1-4 validation + screenshots) | M3 | DONE |
| M5 | Forensic Integrity Audit & Victory Gate | F18 (Auditor + Challenger verification) | M4 | DONE |

## Interface Contracts
### Disguise Storefront ↔ Transit Portal
- **DOM Triggers**: `#disguise-search-input` (input event + Enter), footer `HHL-13543505-HUE` (`handleSecretTripleClick`), hotkeys (`Ctrl+Shift+K`, `Alt+M`).
- **Function**: `triggerMurthehelpPortal(clearance)` transitions `#disguise-stage` (hidden) $\to$ `#portal-stage` (flex).
- **Emergency Reversion**: `returnToDisguise()` hides `#portal-stage` and `#dark-stage`, displays `#disguise-stage`, resets background to `#f8fafc`.

### Transit Portal ↔ Tactical Dark Mall
- **Authentication**: `handlePortalLogin(event)` validates credentials against `DEFAULT_USERS`, `localStorage` (`murthehelp_users_db`), and Supabase REST API.
- **Clearance Routing**: `unlockDarkMall(user, clearance)` sets `currentUser`, sets `userClearance`, hides `#portal-stage`, reveals `#dark-stage`, initializes/updates WebGL shader palette, renders catalog.

### WebGL Shader ↔ UI Clearance Tabs
- **Uniform Update**: `updateWebGLColor(tier)` triggers lerped transition of `uColorA`, `uColorB`, `uNoiseIntensity` according to `TIER_COLOR_CONFIG[tier]`.
- **Performance Budget**: Target 60fps, DPR capped at 2.0, animation loops throttled when canvas is hidden.

## Code Layout
- Root Application: `/Users/quan/.gemini/antigravity/scratch/murthehelp/index.html`
- E2E Test Runner: `/Users/quan/.gemini/antigravity/scratch/murthehelp/tests/e2e/test_runner.js`
- Victory Audit Suite: `/Users/quan/.gemini/antigravity/scratch/murthehelp/tests/victory_audit_suite.js`
- Adversarial Suites: `/Users/quan/.gemini/antigravity/scratch/murthehelp/tests/adversarial_challenger_1.js`, `adversarial_challenger_2.js`, `empirical_adversarial_oracle.js`, `empirical_challenger_r2.js`
- Playwright E2E & Screenshots: `/Users/quan/.gemini/antigravity/scratch/murthehelp/tests/e2e_playwright_visual_suite.js`
- Screenshot Gallery: `/Users/quan/.gemini/antigravity/scratch/murthehelp/artifacts/screenshots/`
- Agent Metadata & Logs: `/Users/quan/.gemini/antigravity/scratch/murthehelp/.agents/`
