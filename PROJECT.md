# Project: Murthehelp Simulation UI & Dark Mall Enhancement

## Architecture
Single-file web application (`index.html`) hosting a 3-stage dark web simulation:
1. **Public Disguise Stage (`#disguise-stage`)**: Corporate storefront ("TẬP ĐOÀN CƠ KHÍ & THỦY LỰC HOÀNG HẮC LONG (HUẾ)") with infinite scrolling order ticker, B2B product showcase, order lookup, and hidden triggers.
2. **Transit Portal Stage (`#portal-stage`)**: Secret entry gateway (`murderhelp`) with clearance stripe, login form, and registration form supporting both local cache (`DEFAULT_USERS`) and Supabase auth.
3. **Dark Mall Stage (`#dark-stage`)**: Tactical operational dashboard with Three.js WebGL canvas sphere, clearance tier tabs (RED, PURPLE, YELLOW, GREEN), subcategory filters, dynamic product grid (`PRODUCTS_DB`), product detail modal, escrow cart, and admin console.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Ticker Hover Pause | When user hovers over ticker bar, animation stops completely; resumes on mouse leave | M1 | ORIGINAL_REQUEST §R1 |
| 2 | Ticker Speed Reduction | Animation duration slowed down by ~40-50% (35s -> 65s) for readability | M1 | ORIGINAL_REQUEST §R1 |
| 3 | Remove Navbar F12 Button | Remove visible "F12 Kiểm Tra Mã Nguồn" buttons from utility bar and hero area; retain modal | M1 | ORIGINAL_REQUEST §R2 |
| 4 | Footer Secret Triple-Click | Triple-click on yellow `HHL-13543505-HUE` within 1.5s triggers hidden portal | M1 | ORIGINAL_REQUEST §R2 |
| 5 | Rebrand Dark Mall Header | Update visible header text from `MURDER.SHOPPING.MALL` to `MURDER-SHOP` | M1 | ORIGINAL_REQUEST §R3 |
| 6 | Fix Broken Product Images | Replace HTTP 404 images (RED-P02, RED-P06, RED-SMG01, RED-SMG04, RED-AR02, RED-SNP02, Revolvers) with verified working URLs | M2 | ORIGINAL_REQUEST §R4 |
| 7 | Expand Product Catalog | Add 14 new products across RED, PURPLE, YELLOW, GREEN tiers with complete schemas | M2 | ORIGINAL_REQUEST §R4 |
| 8 | E2E Test Harness & Tiers 1-4 | Automated multi-tiered test runner verifying all requirements, DOM states, URLs, and auth | E2E Track | ORIGINAL_REQUEST §Acceptance Criteria |
| 9 | Auth & Workflow Regression Pass | Guarantee `q121101` / `Tungqu@n1208.` login and all stages transition smoothly | Final Milestone | ORIGINAL_REQUEST §No Regressions |
| 10 | Git Commit & Push Verification | Clean git commit with required message and push to origin main | Final Milestone | ORIGINAL_REQUEST §No Regressions |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | UI Controls & Rebranding | R1 (Ticker pause & speed), R2 (F12 removal & footer triple-click), R3 (MURDER-SHOP branding) | none | DONE |
| M2 | Product Catalog & Image Assets | R4 (Fix broken image URLs, add 14 new products to PRODUCTS_DB) | none | DONE |
| E2E | E2E Testing Suite Track | Design & implement opaque-box test runner covering Tiers 1-4, publish TEST_READY.md | none | DONE |
| Final | E2E Verification & Adversarial Hardening | Pass 100% E2E tests (Tiers 1-4), Tier 5 adversarial testing, Git commit & push | M1, M2, E2E | IN_PROGRESS |

## Interface Contracts
### DOM & Event Wiring
- `#disguise-stage` → `.ticker-container:hover .marquee-track, .marquee-track:hover { animation-play-state: paused; }`
- Footer yellow text span: `onclick="handleSecretTripleClick(event)"`, timer window = 1500ms, calls `triggerMurthehelpPortal()`.
- `#f12-inspection-modal` remains in DOM with `openF12InspectionModal()` / `closeF12InspectionModal()`.
- Header in `#dark-stage`: `<span class="text-lg font-black tracking-widest text-red-500">MURDER-SHOP</span>`.
- `PRODUCTS_DB`: Array of objects `{ id, name, subCat, code, price, img, specs }`. Total items >= 50. All `img` URLs return HTTP 200.

## Code Layout
- Target application file: `/Users/quan/.gemini/antigravity/scratch/murthehelp/index.html`
- Test files: `/Users/quan/.gemini/antigravity/scratch/murthehelp/tests/e2e/test_runner.js`
- Agent metadata: `/Users/quan/.gemini/antigravity/scratch/murthehelp/.agents/`
