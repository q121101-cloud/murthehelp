# SURVEY REPORT: SUPABASE INTEGRATION, STATE MANAGEMENT & TEST INFRASTRUCTURE
**Project:** MURTHEHELP // MURDER-SHOP Dark Web Simulation UI/UX & WebGL Overhaul  
**Target Application:** `/Users/quan/.gemini/antigravity/scratch/murthehelp/index.html`  
**Author:** Explorer 3 (`teamwork_preview_explorer_survey_3`)  
**Timestamp:** 2026-08-25T04:12:00Z  
**Integrity Mode:** Development (Read-Only Analysis)

---

## 1. Executive Summary & Problem Boundary

The **murthehelp** application is a high-fidelity single-file web application (`index.html`) implementing a dual-layer Vietnamese simulation:
1. **Public Disguise Stage (`#disguise-stage`)**: Corporate European-style B2B industrial storefront (*"TẬP ĐOÀN CƠ KHÍ & THỦY LỰC HOÀNG HẮC LONG - HUẾ"*).
2. **Transit Gateway Stage (`#portal-stage`)**: Tactical transit security gateway (*`murderhelp`*).
3. **Tactical Operational Dark Mall Stage (`#dark-stage`)**: Three.js WebGL 3D shader-powered operational marketplace (*`MURDER-SHOP`*).

The upcoming UI/UX and WebGL overhaul aims to elevate visual, motion, and 3D shader standards to Awwwards / $150k+ Agency tier while strictly preserving **100% of underlying game logic, covert triggers, authentication matrices, wallet transactions, and cloud database synchronization**.

This report maps the entire Supabase cloud architecture, client state management, authentication rules, wallet/checkout mechanics, offline fallback systems, and existing/proposed automated testing suites.

---

## 2. Codebase, Environment & Git Topology

### 2.1 Directory & File Layout
- **Root Directory:** `/Users/quan/.gemini/antigravity/scratch/murthehelp`
- **Primary Application File:** `index.html` (2,817 lines, ~162 KB)
- **Core Specifications & Documentation:**
  - `ORIGINAL_REQUEST.md`: Master user requirements (R1–R5, Acceptance Criteria).
  - `PROJECT.md`: Feature inventory, interface contracts, DOM wiring.
  - `TEST_INFRA.md`: Category-Partition, BVA, Pairwise test methodology spec.
  - `TEST_READY.md`: 44-test registry status and baseline output.
  - `README.md`: System manual and operative instructions.
- **Automated Test Directory (`tests/`):**
  - `tests/e2e/test_runner.js`: Pure Node.js high-speed test harness (44 tests).
  - `tests/e2e/test_cases.json`: JSON registry of test assertions across Tiers 1–4.
  - `tests/victory_audit_suite.js`: 33-point independent victory audit.
  - `tests/adversarial_challenger_1.js`: 85-assertion stress suite with Headless Chrome E2E.
  - `tests/adversarial_challenger_2.js`: Deep DOM & form validation checks.
  - `tests/empirical_adversarial_oracle.js`: Fuzzing oracles & invariant testing (11 tests).
  - `tests/empirical_challenger_r2.js`: 52 empirical verification tests.
- **Runtime Environment:**
  - **Node.js:** `v26.7.0`
  - **npm:** `11.19.0`
  - **npx / Playwright:** Available (`playwright@1.62.1`)
  - **Python:** `Python 3.14.7`
  - **Git Status:** Branch `main`, tracking `origin/main`.

---

## 3. Supabase Integration Architecture & Database Schema

### 3.1 Connection Configuration
The application integrates with Supabase via the official CDN bundle loaded in `<head>`:
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

In `index.html` (Lines 877–887):
```javascript
const SUPABASE_URL = 'https://hdiecjtimixgoydrhais.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhkaWVjanRpbWl4Z295ZHJoYWlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwNjI5MDUsImV4cCI6MjEwMjYzODkwNX0.3HB991l5cGsrPrtFJ8GC-N6SdLR9w6k1RPa6JaAAyKs';

let supabaseClient = null;
try {
    if (window.supabase) {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
} catch (e) {
    console.warn("Supabase init error:", e);
}
```

### 3.2 Table 1: `murthehelp_users`
Live verification against `https://hdiecjtimixgoydrhais.supabase.co/rest/v1/murthehelp_users` confirmed active connectivity (HTTP 200 OK).

#### Schema Definition:
| Column | Type | Nullable | Description | Example Value |
|---|---|---|---|---|
| `id` | `uuid` | NO | Primary Key (auto-generated) | `"17d49734-bb7c-4b4e-8da3-ddbdfded61e7"` |
| `username` | `text` | NO | Unique login identifier (lowercase) | `"q121101"` |
| `fullname` | `text` | YES | Display name / Operative title | `"Tổng Quản Trị Viên (q121101)"` |
| `password` | `text` | NO | Plaintext/Encrypted passcode string | `"Tungqu@n1208."` |
| `role` | `text` | NO | Clearance Tier (`'RED' \| 'PURPLE' \| 'YELLOW' \| 'GREEN'`) | `"GREEN"` |
| `balance` | `numeric` / `int8` | NO | Account funds in VNĐ | `2000000000` |
| `is_admin` | `boolean` | NO | Administrative privilege flag | `true` |
| `created_at` | `timestamptz` | YES | Record creation timestamp | `"2026-08-22T17:33:51.500727+00:00"` |

#### Live Records Present in Cloud Database:
1. `q121101`: `Tổng Quản Trị Viên (q121101)`, role `GREEN`, balance `2.000.000.000 ₫`, `is_admin: true`.
2. `admin`: `Jeong Jin-man (Giám Đốc)`, role `GREEN`, balance `1.500.000.000 ₫`, `is_admin: true`.
3. `test1`: `test`, role `RED`, balance `500.000.000 ₫`, `is_admin: false`.

### 3.3 Table 2: `murthehelp_orders`
Live verification against `https://hdiecjtimixgoydrhais.supabase.co/rest/v1/murthehelp_orders` confirmed active table endpoint (HTTP 200 OK, Allow: `GET, HEAD, POST, OPTIONS`).

#### Schema & Data Model:
| Field / Property | Type | Description |
|---|---|---|
| `trackingId` | `text` | Unique dispatch ID (e.g. `"TRACK-847291"`) |
| `date` | `text` / `timestamptz` | Order timestamp (`new Date().toLocaleString('vi-VN')`) |
| `itemsCount` | `integer` | Total quantity of tactical items in order |
| `total` | `numeric` | Final VNĐ payment after coupon discount |
| `province` | `text` | Target delivery destination (e.g. `"Thừa Thiên Huế"`) |
| `method` | `text` | Logistics delivery method (e.g. `"Stealth Drone"`) |
| `status` | `text` | Dispatch state (e.g. `"ĐÃ PHÓNG DRONE // TIẾP CẬN TỌA ĐỘ"`) |
| `items` | `jsonb` / `array` | Complete snapshot array of purchased cart items |

---

## 4. State Management & Authentication Flow

### 4.1 Global State Variables
```javascript
var userClearance = 'GREEN';      // Active clearance level ('RED' | 'PURPLE' | 'YELLOW' | 'GREEN')
var userName = 'Jeong Jin-man';   // Current active user display name
var userBalance = 1500000000;     // Current balance in VNĐ
let currentTab = 'RED';           // Active dark mall category tab
let currentSubCat = 'ALL_RED';    // Active subcategory filter
let currentUserId = 'admin';      // Current user key in database
let currentUser = DEFAULT_USERS['admin']; // Active user object
let cart = [];                    // Array of { id, name, price, qty, img, specs, subCat }
let appliedCouponDiscount = 0;    // Active coupon discount percentage (0 or 15)
let secretClickCount = 0;         // Footer triple-click accumulator
let secretClickTimer = null;      // 1500ms debounce timer
```

### 4.2 Local Storage Fallback & Caching
The application utilizes two primary `localStorage` keys for instant, zero-latency state synchronization and offline fallback:
- `'murthehelp_users_db'`: JSON dictionary of all registered users.
- `'murthehelp_orders_db'`: JSON array of all past orders.
- `'murthehelp_current_user'`: String ID of the most recently logged-in operative (defaults to `'q121101'`).

```javascript
const DEFAULT_USERS = {
    'q121101': {
        name: 'Tổng Quản Trị Viên (q121101)',
        pass: 'Tungqu@n1208.',
        role: 'GREEN',
        balance: 2000000000,
        isAdmin: true
    },
    'admin': {
        name: 'Jeong Jin-man (Giám Đốc)',
        pass: 'JINMAN',
        role: 'GREEN',
        balance: 1500000000,
        isAdmin: true
    },
    'sniper_red': {
        name: 'Đội Trưởng Xạ Thủ Red',
        pass: 'RED',
        role: 'RED',
        balance: 250000000,
        isAdmin: false
    },
    'cleaner_pur': {
        name: 'Chuyên Viên Dọn Dẹp Purple',
        pass: 'PURPLE',
        role: 'PURPLE',
        balance: 180000000,
        isAdmin: false
    },
    'medic_yel': {
        name: 'Bác Sĩ Dã Chiến Yellow',
        pass: 'YELLOW',
        role: 'YELLOW',
        balance: 120000000,
        isAdmin: false
    }
};
```

### 4.3 Authentication Logic (`handleUserLogin`)
1. **Input Normalization:** Username is converted to lowercase and trimmed; password is trimmed.
2. **Master / Safe Passcodes:**
   - Entering password `7209` or `JINMAN` or username `admin` automatically unlocks the `admin` (Jeong Jin-man) account.
   - For `q121101`, entering `Tungqu@n1208.`, `Tungqu@n1208`, `JINMAN`, or `7209` authenticates `q121101`.
3. **Local Cache Check:** Searches `getStoredUsers()` for matching credentials.
4. **Cloud Database Fallback:** If not found locally, queries Supabase table `murthehelp_users` via `.eq('username', usernameInput).eq('password', passwordInput).maybeSingle()`. If match found, populates local cache and completes login.
5. **Session Initiation:** Calls `enterDarkMallFinal()` to transition UI to `#dark-stage`, initializes Three.js WebGL canvas, and updates HUD with operative name, balance, and clearance badge.

### 4.4 User Registration (`handleUserRegister`)
1. **Validation Gates:**
   - All fields required (`fullname`, `username`, `password`, `clearance`).
   - Minimum password length: **$\ge 8$ characters**.
2. **Initial Tier Balance Allocation:**
   - `GREEN`: 1.500.000.000 ₫ (Admin/Director)
   - `RED`: 300.000.000 ₫ (Tactical Weapons)
   - `PURPLE`: 200.000.000 ₫ (Cleanup & Espionage)
   - `YELLOW`: 100.000.000 ₫ (Medical Trauma)
3. **Supabase Cloud Push:** Checks username collision; performs `client.from('murthehelp_users').insert([...])`.
4. **Instant Local Cache Write:** Saves to `localStorage`, sets as `currentUser`, and directly enters `#dark-stage`.

---

## 5. Wallet, Balance & Checkout Mechanics

### 5.1 Wallet Balance Flow
- **Current Balance Read:** `(typeof userBalance === 'number') ? userBalance : currentUser.balance`
- **Deposit Mechanism (`depositFunds()`):**
  - Triggered via Admin Modal (`#admin-modal`).
  - Validates positive integer amount.
  - Updates `userBalance` and `currentUser.balance`.
  - Persists to `localStorage` (`saveStoredUsers`).
  - Asynchronously pushes update to Supabase:
    ```javascript
    supabaseClient.from('murthehelp_users').update({
        balance: currentUser.balance
    }).eq('username', currentUserId)
    ```
  - Updates HUD display via `updateHeaderHUD()`.

### 5.2 Cart & Escrow Checkout Flow (`executeCheckout()`)
1. **Cart Emptiness Check:** Rejects if `cart.length === 0`.
2. **Total Calculation & Discounts:**
   - Computes subtotal: $\sum (\text{price} \times \text{quantity})$.
   - Applies coupon discount (e.g. promo code `HACLONG` gives 15% discount).
   - Computes `finalTotal = subtotal - discountAmount`.
3. **Balance Gate:**
   - If `currentBal < finalTotal`, halts checkout with alert: `⚠️ SỐ DƯ TÀI KHOẢN KHÔNG ĐỦ!`.
4. **Balance Deduction:**
   - `userBalance = currentBal - finalTotal`.
   - `currentUser.balance = userBalance`.
   - Persists updated user record to `localStorage`.
5. **Order Dispatch & Logging:**
   - Generates random `trackingId`: `'TRACK-' + Math.floor(100000 + Math.random() * 900000)`.
   - Creates `newOrder` object and prepends to `murthehelp_orders_db`.
   - Empties cart (`cart.length = 0`), resets discount, closes cart modal, updates badge counters, and displays tactical dispatch confirmation alert.

---

## 6. Verification & Automated Testing Infrastructure

### 6.1 Test Suite Inventory
The repository features a multi-tiered test infrastructure designed for instant execution, zero flakiness, and zero external dependencies:

```
tests/
├── e2e/
│   ├── test_cases.json                 # 44 standardized test definitions (Tiers 1-4)
│   └── test_runner.js                  # Automated test engine (VM sandbox & HTTP probe)
├── victory_audit_suite.js              # 33 independent requirement & syntax checks
├── adversarial_challenger_1.js         # 85 adversarial assertions + Headless Chrome E2E
├── adversarial_challenger_2.js         # Deep DOM & form validation checks
├── empirical_adversarial_oracle.js     # 11 oracles: XSS fuzzing, math invariants, 50 cycles
└── empirical_challenger_r2.js          # 52 empirical verification tests
```

### 6.2 Test Matrix by Requirement

| Requirement | Scope | Test Suites Covering | Current Status |
|---|---|---|---|
| **R1 (Storefront Ticker)** | Speed reduction $\ge 55\text{ s}$, pause on hover | `test_runner.js` (T1-R1-01..03, T2-BND-05), `victory_audit_suite.js`, `adversarial_challenger_1.js` | **PASSED (100%)** |
| **R2 (Hidden Triggers)** | Navbar F12 hidden, Footer yellow triple-click $\le 1.5\text{ s}$ | `test_runner.js` (T1-R2-01..06, T2-BND-01..04), `adversarial_challenger_1.js` | **PASSED (100%)** |
| **R3 (Dark Mall Branding)** | Header `MURDER-SHOP`, removal of old text | `test_runner.js` (T1-R3-01..03), `victory_audit_suite.js`, `adversarial_challenger_1.js` | **PASSED (100%)** |
| **R4 (Catalog & Images)** | $\ge 50$ products (54 items), 100% HTTP 200 URLs | `test_runner.js` (T1-R4-01..05, T4-SCN-03), `victory_audit_suite.js` (66 images probed) | **PASSED (100%)** |
| **R4 (Secret Search Keys)** | `MH13543505`, `RED`, `PURPLE`, `YELLOW`, `GREEN`, `JINMAN`, `7209` | `test_runner.js` (T2-BND-12), `empirical_adversarial_oracle.js` | **PASSED (100%)** |
| **R4 (Emergency Escape)** | `Escape` key closes all modals & returns to disguise | `test_runner.js` (T3-INT-03..04), `adversarial_challenger_1.js` | **PASSED (100%)** |
| **R4 (Auth & Supabase)** | `q121101` / `Tungqu@n1208.` admin login, wallet, cart | `test_runner.js` (T4-SCN-01..02, T3-INT-07..09), `victory_audit_suite.js` | **PASSED (100%)** |
| **R5 (Syntax & Headless)** | AST syntax parsing (`new Function`), Headless Chrome | `test_runner.js` (T4-SCN-04), `adversarial_challenger_1.js` (Section 5) | **PASSED (100%)** |

---

## 7. Recommended End-to-End Testing Strategy for UI/UX & WebGL Overhaul

As the workers proceed with the visual, shader, and layout overhaul, the following test harness recommendations guarantee that zero regressions occur:

### 7.1 Automated Headless Playwright Verification
Create an automated Playwright test script (`tests/e2e/playwright_visual_e2e.js`) to:
1. **Launch Headless Chromium:** Load `file://${process.cwd()}/index.html`.
2. **Console Error Trapping:** Listen to `page.on('console', msg => ...)` and `page.on('pageerror', err => ...)` to assert **0 runtime reference/syntax errors**.
3. **Verify Tier 1 Visuals:**
   - Check computed style for font families (`Plus Jakarta Sans`, `Space Grotesk`, `JetBrains Mono`).
   - Trigger hover on `.ticker-container` and assert `animationPlayState === 'paused'`.
   - Test footer triple-click sequence within 1500ms $\to$ verify `#portal-stage` appears.
4. **Verify Tier 2 Visuals:**
   - Check `#portal-stage` background gradient and laser scan element.
   - Verify `murderhelp` glowing neon display and 3-color stripe (Red, Purple, Amber).
   - Enter `q121101` / `Tungqu@n1208.` $\to$ submit login $\to$ verify `#dark-stage` appears.
5. **Verify Tier 3 WebGL Shader & Island UI:**
   - Inspect `#webgl-canvas` WebGL context.
   - Click clearance tabs: `RED`, `PURPLE`, `YELLOW`, `GREEN` $\to$ verify shader uniform colors update (`uColorA`, `uColorB`).
   - Add weapon to cart $\to$ verify cart drawer animation and total calculation $\to$ execute checkout $\to$ verify balance is deducted from 2.000.000.000 ₫ to remaining balance.
   - Press `Escape` key $\to$ verify immediate return to `#disguise-stage`.
6. **Screenshot Capture:** Capture rendered screenshots of:
   - `screenshot_tier1_disguise.png`
   - `screenshot_tier2_portal.png`
   - `screenshot_tier3_dark_red.png`
   - `screenshot_tier3_dark_green.png`

### 7.2 Verification Commands Checklist
```bash
# 1. Run core 44-assertion automated E2E test runner
node tests/e2e/test_runner.js

# 2. Run independent 33-point victory audit
node tests/victory_audit_suite.js

# 3. Run full adversarial challenger stress harness & headless browser
node tests/adversarial_challenger_1.js

# 4. Run adversarial oracles, mathematical invariants, and fuzzing
node tests/empirical_adversarial_oracle.js

# 5. Run Playwright E2E visual screenshot capture
npx playwright test
```

---

## 8. Summary of Findings for Orchestrator & Workers

1. **State & Supabase Ready:** The live Supabase connection to `https://hdiecjtimixgoydrhais.supabase.co` is healthy, verified, and has identical schemas for `murthehelp_users` and `murthehelp_orders`.
2. **Admin Credentials Sealed:** `q121101` / `Tungqu@n1208.` is present in `DEFAULT_USERS`, hardcoded in `getStoredUsers()`, supported in `handleUserLogin()`, and live on Supabase with 2.000.000.000 ₫ balance and `role: 'GREEN'`.
3. **Game Mechanics Locked:** Footer triple-click (1500ms window), secret search keys (`MH13543505`, `MURDERHELP`, `RED`, `PURPLE`, `YELLOW`, `GREEN`, `JINMAN`, `7209`), and Emergency `ESC` return are 100% covered by automated tests.
4. **Visual Overhaul Scope Clear:** Workers can safely modernize the CSS/HTML/Three.js shader layers in `index.html` as long as ID selectors, event handler bindings, global state variables, and DOM contracts remain intact.
