# Handoff Report: Tier 2 Transit Portal & Tier 3 WebGL Plasma Shader Survey

**Agent**: Explorer 2 (UI/UX, 3D WebGL Shader & Interactive Engineering Specialist)  
**Target Project**: Murthehelp Simulation Platform (`/Users/quan/.gemini/antigravity/scratch/murthehelp`)  
**Working Directory**: `/Users/quan/.gemini/antigravity/scratch/murthehelp/.agents/teamwork_preview_explorer_survey_2`  
**Date**: 2026-08-25  
**Handoff Type**: Hard (Investigation & Architectural Blueprint Complete)

---

## 1. Observation

1. **Current Tier 2 Transit Portal (`#portal-stage`)**:
   - Location: `index.html` lines 453–544.
   - Container has class `bg-[#3b0206] hidden z-50 flex-col items-center justify-center font-mono-code text-white fade-in overflow-y-auto p-4`.
   - Title is rendered as `<h1 class="text-7xl sm:text-8xl md:text-9xl font-black tracking-widest text-red-500 lowercase drop-shadow-[0_0_45px_rgba(239,68,68,0.9)] animate-pulse text-center select-none">murderhelp</h1>`.
   - Clearance bar is rendered as `<div id="clearance-bar" class="flex w-full max-w-md sm:max-w-lg md:max-w-xl h-3 sm:h-3.5 rounded-full overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.8)] border border-neutral-900/60 clearance-stripe" data-testid="clearance-stripe">` with 3 colored div children (`#b3001e`, `#4d19bf`, `#e67e00`).
   - Auth modal is a flat dark box with class `bg-[#0b0d13] border border-red-800/80 text-gray-200 p-6 rounded-3xl shadow-2xl space-y-4 text-left`.

2. **Current Three.js WebGL Canvas Setup & Shader**:
   - Location: `index.html` lines 2670–2809.
   - Canvas element: `<canvas id="webgl-canvas" class="fixed inset-0 w-full h-full pointer-events-none opacity-35 z-0"></canvas>`.
   - Vertex shader uses basic 1D sine displacement: `vec3 newPosition = position + normal * (sin(position.x * 2.0 + uTime) * 0.15);`.
   - Fragment shader uses simple dot product and linear color mix: `float intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), 2.0); vec3 color = mix(uColorA, uColorB, vPosition.y * 0.5 + 0.5); gl_FragColor = vec4(color + intensity * 0.4, 0.85);`.
   - Geometry is `new THREE.IcosahedronGeometry(1.4, 32)` with `wireframe: true`.
   - Color transitions update `targetColorA` and `targetColorB` upon `updateWebGLColor(tier)`, lerping at `0.05` per frame in `animateWebGL()`.

3. **Current Tier 3 UI & Product Card Structure**:
   - Location: `index.html` lines 2154–2203 (`renderProducts()`).
   - Cards are rendered dynamically in `<div id="dark-products-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">`.
   - Card container has class `bg-[#0b0d14]/90 backdrop-blur-md border border-neutral-800/80 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-neutral-700 hover:shadow-2xl transition duration-300`.
   - Action buttons are standard flat blocks: `bg-neutral-900` for "Xem Chi Tiết" and `bg-red-900/80` for "Thêm Giỏ".

4. **Automated Test Suite Status**:
   - Command: `node tests/e2e/test_runner.js` -> 44/44 tests passed (100% success).
   - Command: `node tests/victory_audit_suite.js` -> 85/85 assertions passed (100% success).
   - Command: `node tests/adversarial_challenger_1.js` -> 52/52 checks passed (100% success).
   - Command: `node tests/adversarial_challenger_2.js` & `empirical_adversarial_oracle.js` -> 11/11 oracle tests passed (100% success).
   - Live image probes: 54/54 catalog images returned HTTP 200 OK.

---

## 2. Logic Chain

1. **Premise 1 (Tier 2 Aesthetic Gap)**:
   - Based on Observation 1, `#portal-stage` currently relies on a single solid color `#3b0206` and basic CSS drop-shadow.
   - Upgrading to a multi-stop radial burgundy gradient (`#4a0005` to `#240003` to `#0d0001`), combined with a dynamic CSS `@keyframes laserSweepVertical` beam and holographic grid matrix, will achieve the cinematic Korean thriller aesthetic requested in `ORIGINAL_REQUEST.md §R2`.

2. **Premise 2 (3D WebGL Plasma Shader Transformation)**:
   - Based on Observation 2, the current WebGL sphere is a low-density wireframe with basic 1D sine displacement.
   - Implementing a GLSL 3D Simplex noise fractional Brownian motion (fBm) vertex shader will create fluid, organic surface turbulence.
   - Implementing an analytical Fresnel equation (`pow(1.0 - max(dot(N, V), 0.0), 2.8)`), combined with cosine-based thin-film chromatic iridescence and RGB dispersion in the fragment shader, will deliver an Awwwards-grade volumetric plasma sphere reactive to the 4 clearance color palettes (CODE RED, PURPLE, YELLOW, GREEN) as requested in `ORIGINAL_REQUEST.md §R3`.

3. **Premise 3 (Tactical UI System Elevation)**:
   - Based on Observation 3, the current product cards lack depth and tactile hierarchy.
   - Structuring cards into a **Double-Bezel frame** (outer chassis in brushed obsidian acrylic + inner recessed asset well with containment borders and telemetry corner reticles), paired with **Floating Island Action Buttons** (tactical ghost inspect + vibrant clearance combat button), will satisfy `ORIGINAL_REQUEST.md §R3`.

4. **Premise 4 (Zero-Regression Invariance)**:
   - Based on Observation 4, all existing test harnesses check specific DOM element IDs (`#portal-stage`, `#clearance-bar` with `data-testid="clearance-stripe"`, `#webgl-canvas`, `#dark-stage`, `#tab-RED`, `#dark-products-grid`, `#cart-modal`, `#current-user-name`, `#user-balance-display`, etc.), secret click counters, and auth structures.
   - By preserving 100% of DOM IDs, dataset attributes, global state variables (`PRODUCTS_DB`, `currentUser`, `cart`), and function signatures, the visual overhaul can be executed with 0 test failures.

---

## 3. Caveats

- **WebGL Compatibility in Headless Environments**: Headless CI environments may lack dedicated GPU hardware or WebGL context. The existing safe initialization pattern in `initThreeWebGL()` (wrapping in `try...catch` with null checks on `canvas` and `THREE`) must be strictly maintained.
- **Performance Budget on Mobile / Low-End Devices**: High vertex subdivision (`IcosahedronGeometry(1.5, 64)`) combined with simplex noise in vertex shaders requires capping `renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))` and pausing rendering when `#dark-stage` is hidden.
- **Scope Discipline**: This survey is read-only. No source files outside `.agents/` were modified.

---

## 4. Conclusion

The architectural mapping for Tier 2 and Tier 3 is complete, validated, and fully detailed in `survey_tier2_tier3_shader.md`. The design provides:
1. Complete GLSL Vertex & Fragment Shader code with Simplex noise displacement, Fresnel iridescence, and chromatic aberration.
2. Exact CSS/SVG specifications for the Biometric Laser Scanning line, holographic grid, and `murderhelp` neon glow stripe.
3. Structural specifications for Double-Bezel weapon cards and Floating Island action triggers.
4. Comprehensive regression prevention matrix guaranteeing 100% test compatibility.

---

## 5. Verification Method

To independently verify all claims, contracts, and test baselines:
```bash
# 1. Run full automated E2E test suite (44 tests)
node tests/e2e/test_runner.js

# 2. Run Victory Audit test suite (85 assertions)
node tests/victory_audit_suite.js

# 3. Run Adversarial & Empirical Challenger suites (63 checks)
node tests/adversarial_challenger_1.js
node tests/adversarial_challenger_2.js
node tests/empirical_adversarial_oracle.js

# 4. Verify survey report existence and completeness
ls -la /Users/quan/.gemini/antigravity/scratch/murthehelp/.agents/teamwork_preview_explorer_survey_2/survey_tier2_tier3_shader.md
```

**Invalidation Conditions**:
- Any change to `#clearance-bar` that removes `data-testid="clearance-stripe"` or alters the 3 child div colors.
- Any change to `#webgl-canvas` or `initThreeWebGL` that throws unhandled errors when `THREE` is undefined.
- Any modification of `PRODUCTS_DB` schema that invalidates image URLs or breaks catalog filtering.
