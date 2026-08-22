# TEST INFRASTRUCTURE & METHODOLOGY
## MURTHEHELP // MURDER.SHOPPING.MALL E2E Test Suite

### 1. Overview & Test Architecture
The test suite for **MURTHEHELP // MURDER.SHOPPING.MALL** is engineered to provide rigorous, automated, opaque-box end-to-end verification of all functional, aesthetic, stateful, and security-critical specifications defined in `ORIGINAL_REQUEST.md` and `PROJECT.md`.

The testing framework operates independently without external runtime dependencies (using pure Node.js standard modules), providing deterministic execution, zero test flakiness, and sub-second execution speeds.

```
+-----------------------------------------------------------------------+
|                           TEST ARCHITECTURE                           |
+-----------------------------------------------------------------------+
|                                                                       |
|   +---------------------------------------------------------------+   |
|   |             TEST MATRIX: tests/e2e/test_cases.json            |   |
|   |  - Tier 1: Feature Coverage (R1-R6, >=5 tests/feature)        |   |
|   |  - Tier 2: Boundary & Corner Cases                            |   |
|   |  - Tier 3: Cross-Feature Pairwise Interactions                |   |
|   |  - Tier 4: Real-World User Journeys                           |   |
|   +-------------------------------+-------------------------------+   |
|                                   |                                   |
|                                   v                                   |
|   +---------------------------------------------------------------+   |
|   |            TEST RUNNER ENGINE: tests/e2e/test_runner.js        |   |
|   |  - HTML Parser & DOM Simulator                                |   |
|   |  - JS Runtime & VM Sandbox Executor (Isolated Contexts)       |   |
|   |  - Event Dispatcher (Clicks, Keydown, Form Input)             |   |
|   |  - Assertion & Validation Engine (Values, Types, Formats)     |   |
|   |  - Three.js WebGL & AudioContext Mocks                        |   |
|   +-------------------------------+-------------------------------+   |
|                                   |                                   |
|                                   v                                   |
|   +---------------------------------------------------------------+   |
|   |                  TARGET SUT: index.html                       |   |
|   |  - Layer 0: Three.js WebGL Simplex Shader Canvas              |   |
|   |  - Layer 1: Disguise Storefront / Transit / Dark Mall         |   |
|   |  - Layer 2: Cart Drawer / Admin Console / Blueprint Modals    |   |
|   |  - Layer 3: Central State Store & Procedural Audio Synth      |   |
|   +---------------------------------------------------------------+   |
|                                                                       |
+-----------------------------------------------------------------------+
```

---

### 2. Test Design Methodologies

#### 2.1 Category-Partition Method
Input domains across all modules are systematically partitioned into discrete equivalence classes and boundary subsets:
- **Search Gateway Passcodes**: Valid keys (`mh13543505`, `GREEN`, `RED`, `PURPLE`, `YELLOW`, `JINMAN`, `7209`), invalid searches (random agricultural keywords), casing variations (`Mh13543505`, `green`), and surrounded whitespace (`  red  `).
- **Clearance Tiers**: `GREEN` (Full Master access), `RED` (Weapons only), `PURPLE` (Espionage/Cleaners only), `YELLOW` (Medical only).
- **Cart Operations**: Add item, increment quantity, decrement quantity, remove line item, clear cart, over-balance checkout, zero-balance checkout.
- **Logistics Dispatch Options**: Option 1 (Stealth Drone), Option 2 (Camouflaged Agricultural Crate), Option 3 (Safehouse Rendezvous).
- **Admin Inputs**: Positive integers, zero, negative values, string non-numbers, blank usernames, custom director names.

#### 2.2 Boundary Value Analysis (BVA)
Precision testing applied to numeric and state boundary limits:
- **Currency & Pricing**: 0 ₫, minimum item price (12.500.000 ₫), maximum item price (920.000.000 ₫), dot formatting accuracy.
- **Balance Subtraction**: Checkout with `userBalance == totalCost`, `userBalance == totalCost - 1`, and `userBalance == totalCost + 1`.
- **Product Counts**: Agricultural matrix count (>=8 items), Tactical catalog count (>=40 items, 43 total), Subcategory distribution.
- **Click Triggers**: Triple-click threshold (<3 clicks vs >=3 clicks within 600ms window).

#### 2.3 Pairwise Combinatorial Testing
Interaction matrix validating multi-dimensional system states:
- `[Search Key]` × `[Detected Initial Tier]` × `[Admin Tier Override]` × `[Target Catalog Item]` × `[Dispatch Mode]`
- Matrix guarantees that switching clearance tiers from any initial state to any target state correctly re-evaluates catalog permissions and adjusts WebGL shader color palettes.

#### 2.4 Workload & Real-World User Journey Testing
Full lifecycle end-to-end scenarios simulating operational workflows:
1. *The Field Operative*: Disguise inspection -> Secret gateway via F12 code -> Auto-login -> Select Red weapons -> Add to cart -> Drone dispatch -> Check remaining balance.
2. *The Cleaner Undercover*: Search `PURPLE` -> Direct transit -> Filter espionage tools -> Safehouse delivery -> Emergency ESC panic to disguise.
3. *The Director Oversight*: Admin authentication `JINMAN` -> Deposit 1.000.000.000 VNĐ -> Switch tier to GREEN -> Purchase sentinel robot & exoskeleton -> Verify transaction log.

---

### 3. Four-Tier Test Suite Specification

| Tier | Category | Minimum Tests | Focus Areas |
|------|----------|---------------|-------------|
| **Tier 1** | Feature Coverage (R1-R6) | 35 | Verifies all individual requirements in isolation against acceptance criteria |
| **Tier 2** | Boundary & Corner Cases | 15 | Empty carts, invalid deposit amounts, whitespace/case variations, locked purchase blocks, WebGL fallbacks |
| **Tier 3** | Cross-Feature Interactions | 10 | Pairwise state permutations, tier switches affecting cart, admin overrides during active checkout |
| **Tier 4** | Real-World Scenarios | 5 | Multi-step end-to-end user journeys from disguised entrance to dispatch completion and panic reset |

---

### 4. Authoritative Expected Output Derivation
All test assertions are derived authoritatively from:
1. `ORIGINAL_REQUEST.md`: Exact passcodes, item IDs, names, prices in VNĐ, hex color codes (`#4a0005`, `#b3001e`, `#4d19bf`, `#e67e00`, `#06070a`), dispatch titles.
2. `PROJECT.md`: Interface contracts, state models, event dispatch flows, and DOM layout hierarchy.

---

### 5. Test Runner Execution & CI Integration
- **Command**: `node tests/e2e/test_runner.js`
- **Output**: Formatted ANSI console report + Exit Code (0 for 100% pass, 1 on failure) + Detailed failure breakdown.
