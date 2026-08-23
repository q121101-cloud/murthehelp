# TEST INFRASTRUCTURE & METHODOLOGY SPECIFICATION
## MURTHEHELP // MURDER-SHOP Dark Web Simulation E2E Test Suite

### 1. Architectural Overview
The test suite for **MURTHEHELP // MURDER-SHOP** is engineered as a zero-external-dependency, high-speed, opaque-box test runner executed under native Node.js. It exercises and validates the entire single-file web application (`index.html`), comprising the public disguise stage (`#disguise-stage`), the transit gateway (`#portal-stage`), and the tactical operational stage (`#dark-stage`).

```
+---------------------------------------------------------------------------------------+
|                               TEST HARNESS ARCHITECTURE                               |
+---------------------------------------------------------------------------------------+
|                                                                                       |
|   +-------------------------------------------------------------------------------+   |
|   |                         TEST RUNNER ENGINE (Pure Node.js)                     |   |
|   |                   File: tests/e2e/test_runner.js                              |   |
|   |                                                                               |   |
|   |  - Static DOM AST & Content Analyzer (Regex / HTML Tokenizer)                  |   |
|   |  - Isolated VM Context & Sandbox Browser Environment Engine (Node vm)          |   |
|   |  - Event Dispatcher & State Machine Driver (Clicks, Keydown, Form Submits)    |   |
|   |  - Multi-threaded Async HTTP/HTTPS Network Probe (Image Link Health Check)    |   |
|   |  - Script Parser & AST Syntax Validator (new Function Compilation)            |   |
|   |  - Deterministic Timer & Click Sequence Simulator (Triple-Click Window)       |   |
|   +---------------------------------------+---------------------------------------+   |
|                                           |                                           |
|                                           v                                           |
|   +-------------------------------------------------------------------------------+   |
|   |                         SYSTEM UNDER TEST: index.html                         |   |
|   |                                                                               |   |
|   |  [Layer 1: Disguise Stage]  - Ticker Marquee, B2B Products, Footer Triggers   |   |
|   |  [Layer 2: Portal Stage]    - 3-Color Stripe, Auth Tabs, Local & Cloud Auth   |   |
|   |  [Layer 3: Dark Mall Stage] - Header MURDER-SHOP, Three.js 3D WebGL Canvas,   |   |
|   |                               Clearance Tabs, PRODUCTS_DB Catalog, Cart Drawer|   |
|   |  [Layer 4: Modals & HUD]    - F12 Source Modal, Product Specs, Checkout Escrow|   |
|   +-------------------------------------------------------------------------------+   |
|                                                                                       |
+---------------------------------------------------------------------------------------+
```

---

### 2. Test Design Methodologies

#### 2.1 Category-Partition Method
The input and state space of the system is partitioned into discrete equivalence classes:
1. **Marquee Ticker Animation (R1)**:
   - Duration parameter classes: Too fast ($T < 50\text{ s}$), target slowed duration ($55\text{ s} \le T \le 75\text{ s}$, 40–50% speed reduction), invalid.
   - Hover state classes: Active hover on `.ticker-container` or `.marquee-track` (`animation-play-state: paused`), unhovered state (`running`).
2. **F12 Triggers & Inspection (R2)**:
   - Navbar/Hero visibility classes: Prohibited visible trigger buttons (F12 button in top bar or hero CTA), permitted inspection modal (`#f12-inspection-modal` present in DOM but hidden).
   - Footer secret trigger classes: Text value (`HHL-13543505-HUE`), text color class (`text-amber-400`), click count ($\Delta N \in \{0, 1, 2, 3, 4+\}$), click interval ($\Delta t \le 1.5\text{ s}$ vs $\Delta t > 1.5\text{ s}$).
3. **Branding & Header Identity (R3)**:
   - Brand text classes: Current required branding (`MURDER-SHOP`), deprecated branding (`MURDER.SHOPPING.MALL`).
   - UI text surfaces: `#dark-stage` header HUD, badges (`NODE-04 HUẾ`), document `<title>`.
4. **Product Catalog & Schema (R4)**:
   - Total inventory count: $< 50$ items (FAIL), $\ge 50$ items (PASS).
   - Clearance Tiers: `RED` (Tactical Weapons), `PURPLE` (Cleanup & Espionage), `YELLOW` (Medical & Trauma), `GREEN` (Director Admin & Defense).
   - Subcategories: `Pistol`, `Revolver`, `SMG`, `Assault Rifle`, `Sniper Rifle`, `Explosives`, `Melee`, `Chemicals`, `Espionage`, `Data Wipe`, `Medical Kit`, `Serum`, `Defense`, `Backup`.
   - Field Schema: `{ id: string, name: string, subCat: string, code: string, price: number, img: string, specs: string }`.
5. **Authentication & User Identity**:
   - Super Admin: `q121101` / `Tungqu@n1208.` (`role: 'GREEN'`, `balance: 2.000.000.000 ₫`, `isAdmin: true`).
   - Standard Operatives: `admin` / `JINMAN` (or `7209`), `sniper_red` / `RED`, `cleaner_pur` / `PURPLE`, `medic_yel` / `YELLOW`.
   - Invalid credentials / missing fields.

#### 2.2 Boundary Value Analysis (BVA)
1. **Triple-Click Time Boundary**:
   - $t = 0\text{ ms}$: 1st click (count = 1).
   - $t = 500\text{ ms}$: 2nd click (count = 2).
   - $t = 1400\text{ ms}$ ($\le 1500\text{ ms}$): 3rd click $\implies$ Triggers portal, counter resets to 0.
   - $t = 1600\text{ ms}$ ($> 1500\text{ ms}$): Timeout fires, counter resets to 0. 3rd click now only counts as 1st click $\implies$ Does NOT trigger portal.
   - 4th click immediately after 3rd click: Starts new sequence (count = 1), does not double-trigger.
2. **Product Catalog Size Boundary**:
   - Minimum required threshold: $N = 50$ products.
   - Minimum new products added: $\Delta N \ge 10$.
3. **Product Price Boundaries**:
   - Price $> 0$ for all items.
   - Min item price: $\ge 12.500.000\text{ ₫}$.
   - Max item price: $\le 2.000.000.000\text{ ₫}$.
4. **Cart Balance Boundaries**:
   - `userBalance == totalCost`: Checkout succeeds, remaining balance = 0.
   - `userBalance == totalCost - 1`: Checkout rejected.
   - `userBalance == totalCost + 1`: Checkout succeeds, remaining balance = 1.

#### 2.3 Pairwise / Combinatorial Testing
Validates orthogonal feature interactions across stages:
- `[Stage: Disguise / Portal / Dark]` $\times$ `[Auth User: q121101 / admin / sniper_red / medic_yel]` $\times$ `[Clearance Tier: RED / PURPLE / YELLOW / GREEN]` $\times$ `[Action: Filter Subcat / Add to Cart / Checkout / Return to Disguise]`
- Verifies that navigating between clearance tabs dynamically re-renders the product grid, adjusts WebGL shader sphere color schemes, and maintains cart state without cross-talk.

#### 2.4 Real-World Application Workloads & Image Health
- **Live HTTP HEAD Probe**: Automated asynchronous network requests against every product image URL in `PRODUCTS_DB`. Zero broken links (HTTP 404/500/timeout) permitted.
- **JavaScript Evaluation & Sandbox Compilation**: `new Function(...)` executed against all `<script>` blocks in `index.html` to guarantee syntax correctness and zero runtime errors.
- **End-to-End Mission Lifecycles**: Complete browser simulation traversing Disguise Storefront $\to$ Footer Triple-Click Trigger $\to$ Portal Gateway $\to$ Super Admin Login (`q121101`) $\to$ Dark Mall Browsing $\to$ Cart Addition $\to$ Escrow Checkout $\to$ Disguise Panic Exit.

---

### 3. Four-Tier Test Suite Specification

| Tier | Category | Minimum Target | Focus Areas |
|------|----------|----------------|-------------|
| **Tier 1** | **Feature Coverage** | 15+ assertions | Individual verification of R1 (Ticker hover pause & speed duration), R2 (Navbar F12 removal, F12 modal retention, yellow footer text, 1.5s triple click logic), R3 (MURDER-SHOP branding, elimination of old mall text), R4 (Catalog size $\ge 50$, category coverage). |
| **Tier 2** | **Boundary & Corner Cases** | 12+ assertions | 2 clicks vs 3 clicks vs 4 clicks, click interval timeouts ($>1.5\text{ s}$), extreme CSS properties, schema validation on every single product (id, name, subCat, code, price, img, specs), price formats ($>0$), string non-emptiness. |
| **Tier 3** | **Cross-Feature Combinations** | 10+ assertions | Stage transition pipeline (disguise $\to$ portal $\to$ dark $\to$ disguise), tab and subcategory filtering, multi-item cart calculation, cart item removal, escrow checkout balance deduction. |
| **Tier 4** | **Real-World Scenarios & Image Health** | 5+ assertions | Super Admin login simulation (`q121101` / `Tungqu@n1208.`), live async HTTP HEAD check for all product image URLs (100% HTTP 200 OK), inline script syntax validation (`new Function`), complete end-to-end operative checkout workflow. |

---

### 4. Authoritative Output Derivation

All expected outcomes are derived authoritatively from:
1. `/Users/quan/.gemini/antigravity/scratch/murthehelp/.agents/ORIGINAL_REQUEST.md`:
   - Ticker pause on hover, 40–50% speed reduction.
   - Navbar F12 button removal, footer `HHL-13543505-HUE` triple-click within 1.5s.
   - Header text `MURDER-SHOP`.
   - Product catalog $\ge 50$ items, zero broken image icons, complete schema.
   - Script syntax validation and `q121101` / `Tungqu@n1208.` login verification.
2. `/Users/quan/.gemini/antigravity/scratch/murthehelp/PROJECT.md`:
   - Stage DOM selectors (`#disguise-stage`, `#portal-stage`, `#dark-stage`).
   - Interface contracts and event handlers.
3. Survey Reports (`survey_explorer_1`, `survey_explorer_2`, `survey_explorer_3` handoffs):
   - DOM lines, verified replacement URLs, and schema requirements.

---

### 5. Test Runner Execution
Execute via standard Node.js:
```bash
node tests/e2e/test_runner.js
```
The test runner outputs ANSI color formatted logs, full tier execution summaries, failure escalations with line-level diagnosis, and exits with code `0` on 100% pass or `1` on failure.
