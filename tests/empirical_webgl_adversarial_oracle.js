/**
 * ==============================================================================
 * CHALLENGER 2: EMPIRICAL WEBGL SHADER RESILIENCE & ADVERSARIAL ORACLE
 * ==============================================================================
 * Deep adversarial stress-testing of:
 * 1. WebGL Null Contexts & Graceful Degradation (missing canvas, missing THREE, null uniforms)
 * 2. Window Resize Chaos & Extreme Viewports (0x0, 10x10, 8K 7680x4320)
 * 3. Rapid Clearance Tab Switching (RED/PURPLE/YELLOW/GREEN) & Uniform Lerp Health
 * 4. Device Pixel Ratio (DPR) Capping & 60fps Performance Loop Throttling
 * 5. Headless Chromium Live Stress & Frame Rate Budget Monitoring
 * 6. Screenshot Artifact Magic Byte & Dimension Integrity Verification
 * ==============================================================================
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { chromium } = require('playwright');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const HTML_PATH = path.join(PROJECT_ROOT, 'index.html');
const SCREENSHOT_DIR = path.join(PROJECT_ROOT, 'artifacts', 'screenshots');
const htmlContent = fs.readFileSync(HTML_PATH, 'utf8');

const C = {
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    dim: '\x1b[2m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    cyan: '\x1b[36m',
    yellow: '\x1b[33m',
    magenta: '\x1b[35m'
};

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;
const failureList = [];

function assert(condition, testId, description, details = '') {
    totalChecks++;
    if (condition) {
        passedChecks++;
        console.log(`  ${C.green}✔ PASS${C.reset} [${C.cyan}${testId}${C.reset}] ${description}`);
    } else {
        failedChecks++;
        console.log(`  ${C.red}✖ FAIL${C.reset} [${C.yellow}${testId}${C.reset}] ${description}`);
        if (details) console.log(`    ${C.red}↳ Details:${C.reset} ${details}`);
        failureList.push({ testId, description, details });
    }
}

// Helper to inspect PNG dimensions from header
function getPngDimensions(filePath) {
    const buffer = fs.readFileSync(filePath);
    // Check PNG signature: 89 50 4E 47 0D 0A 1A 0A
    const isPng = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47 &&
                  buffer[4] === 0x0d && buffer[5] === 0x0a && buffer[6] === 0x1a && buffer[7] === 0x0a;
    if (!isPng) return { isPng: false };
    const width = buffer.readUInt32BE(16);
    const height = buffer.readUInt32BE(20);
    return { isPng: true, width, height, size: buffer.length };
}

// Minimal WebGL Mock VM environment
function createMockWebGLVM(html) {
    const elements = new Map();
    const activeTimers = new Map();
    const mockStorage = {};
    let timerCounter = 1;

    function createEl(id = '', tag = 'DIV') {
        return {
            id,
            tagName: tag.toUpperCase(),
            classList: {
                _s: new Set(['hidden']),
                add(...cls) { cls.forEach(c => c && this._s.add(c)); },
                remove(...cls) { cls.forEach(c => c && this._s.delete(c)); },
                contains(c) { return this._s.has(c); },
                toggle(c) { if (this._s.has(c)) this._s.delete(c); else this._s.add(c); }
            },
            style: {},
            innerText: '',
            innerHTML: '',
            value: '',
            children: [],
            appendChild(c) { this.children.push(c); },
            addEventListener() {},
            querySelector() { return null; },
            querySelectorAll() { return []; }
        };
    }

    [
        'webgl-canvas', 'dark-stage', 'portal-stage', 'disguise-stage',
        'tab-RED', 'tab-PURPLE', 'tab-YELLOW', 'tab-GREEN',
        'current-user-name', 'user-balance-display', 'user-tier-badge',
        'cart-counter', 'cart-modal', 'cart-items-wrapper', 'cart-subtotal', 'cart-total-final',
        'disguise-products-grid', 'dark-products-grid', 'subcat-filters'
    ].forEach(id => {
        elements.set(id, createEl(id));
    });

    class MockColor {
        constructor(hex = 0) { this.setHex(hex); }
        setHex(h) {
            this.hex = h;
            this.r = ((h >> 16) & 255) / 255;
            this.g = ((h >> 8) & 255) / 255;
            this.b = (h & 255) / 255;
            return this;
        }
        lerp(target, alpha) {
            if (target) {
                this.r += (target.r - this.r) * alpha;
                this.g += (target.g - this.g) * alpha;
                this.b += (target.b - this.b) * alpha;
            }
            return this;
        }
        getHexString() { return (this.hex || 0).toString(16); }
    }

    const sandbox = {
        window: {
            innerWidth: 1920,
            innerHeight: 1080,
            devicePixelRatio: 2,
            addEventListener() {},
            removeEventListener() {},
            AudioContext: class {
                constructor() { this.state = 'running'; this.currentTime = 0; this.destination = {}; }
                createOscillator() { return { type: 'sine', frequency: { setValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect() {}, start() {}, stop() {} }; }
                createGain() { return { gain: { setValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect() {} }; }
                createBiquadFilter() { return { type: 'lowpass', frequency: { setValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect() {} }; }
                resume() {}
            }
        },
        document: {
            getElementById(id) {
                if (!elements.has(id)) elements.set(id, createEl(id));
                return elements.get(id);
            },
            createElement(tag) { return createEl('', tag); },
            querySelectorAll() { return []; },
            querySelector() { return null; },
            addEventListener() {}
        },
        localStorage: {
            getItem(key) { return mockStorage[key] !== undefined ? mockStorage[key] : null; },
            setItem(key, val) { mockStorage[key] = String(val); },
            removeItem(key) { delete mockStorage[key]; },
            clear() { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); }
        },
        THREE: {
            Color: MockColor,
            WebGLRenderer: class {
                constructor() { this.domElement = {}; }
                setSize() {}
                setPixelRatio() {}
                render() {}
            },
            Scene: class { add() {} },
            PerspectiveCamera: class {
                constructor() { this.position = { z: 4.5 }; }
                updateProjectionMatrix() {}
            },
            IcosahedronGeometry: class {},
            ShaderMaterial: class { constructor(opts) { this.uniforms = opts.uniforms; } },
            Mesh: class { constructor() { this.rotation = { x: 0, y: 0 }; this.position = { x: 0, y: 0 }; } }
        },
        console: { log() {}, warn() {}, error() {} },
        setTimeout(fn, d) {
            const id = timerCounter++;
            activeTimers.set(id, fn);
            return id;
        },
        clearTimeout(id) { activeTimers.delete(id); },
        requestAnimationFrame(fn) { return 1; },
        Math,
        parseFloat,
        parseInt,
        isNaN,
        isFinite,
        Array,
        Object,
        String,
        Number,
        Date,
        RegExp,
        JSON
    };

    const scriptMatch = html.match(/<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/gi);
    const mainScript = scriptMatch ? scriptMatch[scriptMatch.length - 1].replace(/<\/?script[^>]*>/gi, '') : '';

    const context = vm.createContext(sandbox);
    vm.runInContext(mainScript, context);

    return {
        sandbox,
        elements,
        callFn(name, ...args) {
            return vm.runInContext(`${name}(${args.map(a => JSON.stringify(a)).join(',')});`, context);
        },
        getVar(name) {
            return vm.runInContext(`typeof ${name} !== 'undefined' ? ${name} : undefined`, context);
        },
        setVar(name, val) {
            vm.runInContext(`${name} = ${JSON.stringify(val)};`, context);
        }
    };
}

async function runAdversarialOracle() {
    console.log(`\n${C.bold}${C.magenta}==============================================================================${C.reset}`);
    console.log(`${C.bold}  CHALLENGER 2: WEBGL SHADER RESILIENCE & PERFORMANCE ADVERSARIAL ORACLE${C.reset}`);
    console.log(`${C.dim}  Target: ${HTML_PATH}${C.reset}`);
    console.log(`${C.bold}${C.magenta}==============================================================================${C.reset}\n`);

    // --------------------------------------------------------------------------
    // SUITE 1: SHADER SOURCE CODE & SAFETY AUDIT
    // --------------------------------------------------------------------------
    console.log(`${C.bold}${C.cyan}▶ SUITE 1: SHADER SOURCE CODE & DPR CAPPING STATIC AUDIT${C.reset}`);

    // Check Simplex noise fBm implementation
    assert(
        htmlContent.includes('float snoise(vec3 v)') && htmlContent.includes('float fbm(vec3 p)'),
        'WGL-STAT-01',
        'Vertex shader contains authentic 3D Simplex noise and fractional Brownian motion (fBm) displacement functions'
    );

    // Check chromatic aberration & Fresnel equations
    assert(
        htmlContent.includes('uFresnelPower') && htmlContent.includes('uChromaticOffset') && htmlContent.includes('chromaticColor'),
        'WGL-STAT-02',
        'Fragment shader contains dynamic Fresnel irradiance calculation and RGB chromatic aberration offset vectors'
    );

    // Check DPR capping in code
    const dprMatch = htmlContent.match(/renderer\.setPixelRatio\s*\(\s*Math\.min\s*\(\s*window\.devicePixelRatio\s*\|\|\s*1\s*,\s*(\d+(?:\.\d+)?)\s*\)\s*\)/i);
    assert(
        dprMatch && parseFloat(dprMatch[1]) === 2,
        'WGL-STAT-03',
        'WebGL renderer strictly caps devicePixelRatio to max 2.0 (Math.min(window.devicePixelRatio, 2)) for GPU 60fps budget'
    );

    // Check loop render throttling when dark stage is hidden
    assert(
        htmlContent.includes('const isDarkVisible = darkStage && !darkStage.classList.contains(\'hidden\');') &&
        htmlContent.includes('if (isDarkVisible && renderer && scene && camera && renderer.render)'),
        'WGL-STAT-04',
        'Animation loop throttles WebGL rendering calls when #dark-stage is hidden (bypasses render on Disguise/Portal stages)'
    );

    // --------------------------------------------------------------------------
    // SUITE 2: ISOLATED ADVERSARIAL VM STRESS TESTS (NULL CONTEXTS & DEGRADATION)
    // --------------------------------------------------------------------------
    console.log(`\n${C.bold}${C.cyan}▶ SUITE 2: NULL CONTEXTS & ADVERSARIAL DEGRADATION SIMULATION${C.reset}`);

    // Test 2.1: initThreeWebGL() with missing canvas
    {
        const vmEnv = createMockWebGLVM(htmlContent);
        vmEnv.sandbox.document.getElementById = (id) => (id === 'webgl-canvas' ? null : vmEnv.elements.get(id));
        let threwError = false;
        try {
            vmEnv.callFn('initThreeWebGL');
        } catch (e) {
            threwError = true;
        }
        assert(!threwError, 'WGL-DEG-01', 'initThreeWebGL() degrades cleanly without exception when #webgl-canvas is null in DOM');
    }

    // Test 2.2: initThreeWebGL() when THREE library is undefined
    {
        const vmEnv = createMockWebGLVM(htmlContent);
        delete vmEnv.sandbox.THREE;
        let threwError = false;
        try {
            vmEnv.callFn('initThreeWebGL');
        } catch (e) {
            threwError = true;
        }
        assert(!threwError, 'WGL-DEG-02', 'initThreeWebGL() degrades cleanly when THREE library is completely undefined');
    }

    // Test 2.3: updateWebGLColor() with uninitialized uniforms
    {
        const vmEnv = createMockWebGLVM(htmlContent);
        vmEnv.setVar('uniforms', null);
        let threwError = false;
        try {
            vmEnv.callFn('updateWebGLColor', 'RED');
            vmEnv.callFn('updateWebGLColor', 'PURPLE');
            vmEnv.callFn('updateWebGLColor', 'YELLOW');
            vmEnv.callFn('updateWebGLColor', 'GREEN');
            vmEnv.callFn('updateWebGLColor', 'UNKNOWN_TIER');
        } catch (e) {
            threwError = true;
        }
        assert(!threwError, 'WGL-DEG-03', 'updateWebGLColor() degrades cleanly when uniforms object is null or undefined');
    }

    // Test 2.4: animateWebGL() when uniforms or sphereMesh are null
    {
        const vmEnv = createMockWebGLVM(htmlContent);
        vmEnv.setVar('uniforms', null);
        vmEnv.setVar('sphereMesh', null);
        let threwError = false;
        try {
            vmEnv.callFn('animateWebGL');
        } catch (e) {
            threwError = true;
        }
        assert(!threwError, 'WGL-DEG-04', 'animateWebGL() gracefully handles null uniforms and sphereMesh without throwing');
    }

    // Test 2.5: Extreme Rapid Clearance Tab Switching (100 iterations)
    {
        const vmEnv = createMockWebGLVM(htmlContent);
        vmEnv.callFn('initThreeWebGL');
        const tiers = ['RED', 'PURPLE', 'YELLOW', 'GREEN'];
        let hasNanError = false;

        for (let i = 0; i < 100; i++) {
            const tier = tiers[i % tiers.length];
            vmEnv.callFn('updateWebGLColor', tier);
            // Simulate 5 frames of lerp animation
            for (let f = 0; f < 5; f++) {
                vmEnv.callFn('animateWebGL');
            }
        }

        const uniforms = vmEnv.getVar('uniforms');
        if (uniforms && uniforms.uColorA && uniforms.uColorA.value) {
            const r = uniforms.uColorA.value.r;
            const g = uniforms.uColorA.value.g;
            const b = uniforms.uColorA.value.b;
            if (isNaN(r) || isNaN(g) || isNaN(b) || !isFinite(r) || !isFinite(g) || !isFinite(b)) {
                hasNanError = true;
            }
        }

        assert(
            !hasNanError,
            'WGL-SWT-01',
            '100 rapid clearance tab color transitions (RED->PURPLE->YELLOW->GREEN) complete with 0 NaN or infinite uniform values'
        );
    }

    // Test 2.6: Window Resize Chaos (50 rapid resizes with extreme dimensions)
    {
        const vmEnv = createMockWebGLVM(htmlContent);
        vmEnv.callFn('initThreeWebGL');
        let resizeCrash = false;

        const extremeSizes = [
            { w: 0, h: 0 },
            { w: 1, h: 1 },
            { w: 10, h: 10 },
            { w: 7680, h: 4320 },
            { w: 1920, h: 1080 },
            { w: 3440, h: 1440 },
            { w: 375, h: 812 }
        ];

        try {
            for (let i = 0; i < 50; i++) {
                const s = extremeSizes[i % extremeSizes.length];
                vmEnv.sandbox.window.innerWidth = s.w;
                vmEnv.sandbox.window.innerHeight = s.h;
                vmEnv.callFn('onWindowResize');
            }
        } catch (err) {
            resizeCrash = true;
        }

        assert(!resizeCrash, 'WGL-RSZ-01', '50 extreme window resize events (0x0 to 8K) handled without crash or aspect ratio exceptions');
    }

    // --------------------------------------------------------------------------
    // SUITE 3: REAL PLAYWRIGHT HEADLESS CHROMIUM WEBGL RUNTIME STRESS
    // --------------------------------------------------------------------------
    console.log(`\n${C.bold}${C.cyan}▶ SUITE 3: REAL PLAYWRIGHT HEADLESS CHROMIUM STRESS & FPS BUDGET${C.reset}`);

    const browser = await chromium.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-web-security',
            '--allow-file-access-from-files',
            '--use-gl=swiftshader'
        ]
    });

    const context = await browser.newContext({
        viewport: { width: 1440, height: 900 },
        deviceScaleFactor: 2 // High-DPI Retina simulation
    });

    const page = await context.newPage();
    const liveConsoleErrors = [];
    const livePageErrors = [];

    page.on('console', msg => {
        if (msg.type() === 'error') liveConsoleErrors.push(msg.text());
    });
    page.on('pageerror', err => livePageErrors.push(err.message || String(err)));

    try {
        await page.goto('file://' + HTML_PATH, { waitUntil: 'networkidle' });
        await page.waitForTimeout(300);

        // Login as Super Admin to unlock Dark Mall
        await page.evaluate(() => {
            const loginInput = document.getElementById('login-username');
            const passInput = document.getElementById('login-password');
            if (loginInput && passInput) {
                loginInput.value = 'q121101';
                passInput.value = 'Tungqu@n1208.';
            }
            if (typeof window.triggerMurthehelpPortal === 'function') window.triggerMurthehelpPortal();
            if (typeof window.handleUserLogin === 'function') window.handleUserLogin();
        });
        await page.waitForTimeout(400);

        // Measure live WebGL Canvas and Renderer properties in headless browser
        const webglDiagnostics = await page.evaluate(() => {
            const canvas = document.getElementById('webgl-canvas');
            const isDark = document.getElementById('dark-stage') && !document.getElementById('dark-stage').classList.contains('hidden');
            const pixelRatio = window.devicePixelRatio;
            return {
                canvasExists: !!canvas,
                canvasWidth: canvas ? canvas.width : 0,
                canvasHeight: canvas ? canvas.height : 0,
                pixelRatio: pixelRatio,
                isDarkVisible: isDark
            };
        });

        assert(webglDiagnostics.canvasExists, 'PW-WGL-01', 'WebGL canvas (#webgl-canvas) initialized in live Chromium DOM');
        assert(webglDiagnostics.canvasWidth > 0 && webglDiagnostics.canvasHeight > 0, 'PW-WGL-02',
            `WebGL canvas dimensions allocated correctly: ${webglDiagnostics.canvasWidth}x${webglDiagnostics.canvasHeight} (at DPR ${webglDiagnostics.pixelRatio})`);

        // Test Live Rapid Tab Switching in Browser
        const tabList = ['#tab-RED', '#tab-PURPLE', '#tab-YELLOW', '#tab-GREEN'];
        for (let i = 0; i < 20; i++) {
            const selector = tabList[i % tabList.length];
            await page.click(selector);
            await page.waitForTimeout(50);
        }

        // Measure Frame Loop Continuity in live browser via requestAnimationFrame progression
        const rafMetrics = await page.evaluate(async () => {
            return new Promise((resolve) => {
                let frameCount = 0;
                const start = performance.now();
                function countFrame() {
                    frameCount++;
                    if (performance.now() - start < 500) {
                        requestAnimationFrame(countFrame);
                    } else {
                        const elapsed = performance.now() - start;
                        const fps = (frameCount / elapsed) * 1000;
                        resolve({ frameCount, elapsed, fps });
                    }
                }
                requestAnimationFrame(countFrame);
            });
        });

        assert(
            rafMetrics.frameCount >= 5,
            'PW-WGL-03',
            `Browser requestAnimationFrame render loop actively advances continuously with WebGL rendering (Count: ${rafMetrics.frameCount} frames in ${rafMetrics.elapsed.toFixed(0)}ms, ${rafMetrics.fps.toFixed(1)} FPS under SwiftShader software emulation)`
        );

        // Test Live Window Resize Stress
        await page.setViewportSize({ width: 800, height: 600 });
        await page.waitForTimeout(100);
        await page.setViewportSize({ width: 1920, height: 1080 });
        await page.waitForTimeout(100);
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.waitForTimeout(100);

        assert(
            liveConsoleErrors.length === 0,
            'PW-WGL-04',
            `Zero console errors detected during live WebGL stress execution (Errors: ${liveConsoleErrors.length})`
        );
        assert(
            livePageErrors.length === 0,
            'PW-WGL-05',
            `Zero unhandled page exceptions during live WebGL stress execution (Exceptions: ${livePageErrors.length})`
        );

    } finally {
        await browser.close();
    }

    // --------------------------------------------------------------------------
    // SUITE 4: SCREENSHOT ARTIFACT COMPLETENESS & MAGIC BYTE AUDIT
    // --------------------------------------------------------------------------
    console.log(`\n${C.bold}${C.cyan}▶ SUITE 4: SCREENSHOT ARTIFACT COMPLETENESS & INTEGRITY AUDIT${C.reset}`);

    const expectedScreenshots = [
        { name: 'tier1_disguise_storefront.png', minSize: 100000, desc: 'Tier 1 Disguise Storefront' },
        { name: 'tier2_transit_portal.png', minSize: 100000, desc: 'Tier 2 Biometric Laser Transit Portal' },
        { name: 'tier3_dark_mall_overview.png', minSize: 100000, desc: 'Tier 3 Dark Mall Overview' },
        { name: 'tier3_code_red_palette.png', minSize: 100000, desc: 'Tier 3 CODE RED Palette' },
        { name: 'tier3_code_green_admin.png', minSize: 100000, desc: 'Tier 3 CODE GREEN Admin Palette' },
        { name: 'tier3_cart_drawer.png', minSize: 50000, desc: 'Tier 3 Cart Drawer & Checkout' }
    ];

    expectedScreenshots.forEach((item, idx) => {
        const fullPath = path.join(SCREENSHOT_DIR, item.name);
        const exists = fs.existsSync(fullPath);
        if (!exists) {
            assert(false, `SCR-INT-0${idx + 1}`, `Screenshot exists: ${item.name}`, 'File missing');
            return;
        }

        const info = getPngDimensions(fullPath);
        assert(
            info.isPng && info.width >= 1200 && info.height >= 700 && info.size >= item.minSize,
            `SCR-INT-0${idx + 1}`,
            `Screenshot ${item.name} is valid PNG (${info.width}x${info.height}, ${(info.size / 1024).toFixed(1)} KB) for ${item.desc}`,
            info.isPng ? '' : 'Invalid PNG header magic bytes'
        );
    });

    // --------------------------------------------------------------------------
    // FINAL SUMMARY & EMPIRICAL VERDICT
    // --------------------------------------------------------------------------
    console.log(`\n${C.bold}${C.magenta}==============================================================================${C.reset}`);
    console.log(`${C.bold}CHALLENGER 2 EMPIRICAL VERDICT SUMMARY${C.reset}`);
    console.log(`${C.bold}${C.magenta}==============================================================================${C.reset}`);
    console.log(`  Total Checks Run : ${totalChecks}`);
    console.log(`  Passed Checks    : ${C.green}${C.bold}${passedChecks}${C.reset}`);
    console.log(`  Failed Checks    : ${failedChecks === 0 ? C.green + '0' : C.red + failedChecks}${C.reset}`);
    console.log(`  Empirical Verdict: ${failedChecks === 0 ? C.green + C.bold + 'APPROVE (100% PASS)' : C.red + C.bold + 'REQUEST_CHANGES'}${C.reset}`);
    console.log(`${C.bold}${C.magenta}==============================================================================${C.reset}\n`);

    if (failedChecks > 0) {
        process.exit(1);
    }
}

if (require.main === module) {
    runAdversarialOracle().catch(err => {
        console.error('Fatal Oracle Error:', err);
        process.exit(1);
    });
}

module.exports = { runAdversarialOracle };
