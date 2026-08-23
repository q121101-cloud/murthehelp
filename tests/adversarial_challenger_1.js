/**
 * ==============================================================================
 * CHALLENGER 1: EMPIRICAL ADVERSARIAL STRESS TEST SUITE
 * ==============================================================================
 * Comprehensive, adversarial stress testing harness verifying:
 * 1. Triple-Click Mechanism: Timing boundaries (1, 2, 3 rapid, >1.5s separation,
 *    4th click, jitter, burst clicking, stopPropagation, timeout expiry).
 * 2. Ticker Marquee: CSS rules, keyframes, duration, container & track hover
 *    pause rules, animation-play-state under live Headless Chrome.
 * 3. Stage Transitions & Modal Controls: Disguise <-> Portal <-> Dark Stage,
 *    Escape panic protocol, F12 modal, Product Detail modal, Cart drawer,
 *    Admin modal, multi-roundtrip idempotency.
 * 4. Product Catalog Integrity: Schemas, >=50 items, live network HTTP image probes.
 * 5. Full Real Headless Google Chrome Browser End-to-End Execution.
 * ==============================================================================
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const http = require('http');
const https = require('https');
const { execSync } = require('child_process');

const PROJECT_ROOT = path.resolve(__dirname, '../');
const HTML_FILE = path.join(PROJECT_ROOT, 'index.html');
const htmlContent = fs.readFileSync(HTML_FILE, 'utf-8');

// ANSI Color constants
const C = {
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failureList = [];

function assert(condition, code, name, details = '') {
    totalTests++;
    if (condition) {
        passedTests++;
        console.log(`  ${C.green}✔ PASS${C.reset} [${C.cyan}${code}${C.reset}] ${name}`);
    } else {
        failedTests++;
        failureList.push({ code, name, details });
        console.error(`  ${C.red}✖ FAIL${C.reset} [${C.yellow}${code}${C.reset}] ${name}`);
        if (details) {
            console.error(`         ${C.dim}${details}${C.reset}`);
        }
    }
}

// Mock Three.js Color for VM environment
class MockColor {
    constructor(hex = 0x000000) { this.hex = hex; }
    clone() { return new MockColor(this.hex); }
    copy(c) { this.hex = (c && c.hex !== undefined) ? c.hex : c; return this; }
    setHex(h) { this.hex = h; return this; }
    lerp(c, alpha) { return this; }
}

function createDOMSandbox() {
    const elements = new Map();
    const eventListeners = new Map();
    const mockStorage = {};
    const alertLogs = [];

    function createMockElement(id = '', tag = 'DIV') {
        const defaultOptions = [
            { text: '🚁 Drone Tàng Hình Ban Đêm', value: 'drone' },
            { text: '📦 Thùng Nông Cụ Ngụy Trang', value: 'container' },
            { text: '📍 Điểm Hẹn An Toàn Safehouse', value: 'safehouse' }
        ];

        return {
            id: id,
            tagName: tag.toUpperCase(),
            classList: {
                _classes: new Set(),
                add(...cls) { cls.forEach(c => c && this._classes.add(c)); },
                remove(...cls) { cls.forEach(c => c && this._classes.delete(c)); },
                contains(c) { return this._classes.has(c); },
                toggle(c) { if (this._classes.has(c)) this._classes.delete(c); else this._classes.add(c); }
            },
            style: {},
            innerText: '',
            _innerHTML: '',
            get innerHTML() {
                if (this.children && this.children.length > 0) {
                    return this.children.map(c => c.innerHTML || c.outerHTML || '').join('');
                }
                return this._innerHTML || '';
            },
            set innerHTML(val) {
                this._innerHTML = val;
                if (val === '') this.children = [];
            },
            value: '',
            children: [],
            options: defaultOptions,
            selectedIndex: 0,
            get selectedOptions() { return [this.options[this.selectedIndex] || this.options[0]]; },
            addEventListener(event, handler) {
                const key = id + ':' + event;
                if (!eventListeners.has(key)) eventListeners.set(key, []);
                eventListeners.get(key).push(handler);
            },
            appendChild(child) {
                if (!this.children) this.children = [];
                this.children.push(child);
            },
            click() {
                const key = id + ':click';
                const handlers = eventListeners.get(key) || [];
                handlers.forEach(h => h({ target: this, preventDefault() {}, stopPropagation() {} }));
            }
        };
    }

    // Populate all IDs from HTML
    const idRegex = /id=["']([^"']+)["']/g;
    let match;
    while ((match = idRegex.exec(htmlContent)) !== null) {
        if (!elements.has(match[1])) {
            elements.set(match[1], createMockElement(match[1]));
        }
    }

    // Set initial classes from raw HTML
    const tagWithIdAndClassRegex = /<([a-zA-Z0-9]+)[^>]*id=["']([^"']+)["'][^>]*class=["']([^"']+)["'][^>]*>/g;
    while ((match = tagWithIdAndClassRegex.exec(htmlContent)) !== null) {
        const id = match[2];
        const classNames = match[3].split(/\s+/).filter(Boolean);
        const elem = elements.get(id);
        if (elem) {
            classNames.forEach(c => elem.classList.add(c));
        }
    }

    // Elements with initial visibility
    if (elements.has('portal-stage')) elements.get('portal-stage').classList.add('hidden');
    if (elements.has('dark-stage')) elements.get('dark-stage').classList.add('hidden');
    if (elements.has('cart-modal')) elements.get('cart-modal').classList.add('hidden');
    if (elements.has('cart-drawer-backdrop')) elements.get('cart-drawer-backdrop').classList.add('hidden');
    if (elements.has('f12-inspection-modal')) elements.get('f12-inspection-modal').classList.add('hidden');
    if (elements.has('product-detail-modal')) elements.get('product-detail-modal').classList.add('hidden');
    if (elements.has('orders-modal')) elements.get('orders-modal').classList.add('hidden');
    if (elements.has('admin-modal')) elements.get('admin-modal').classList.add('hidden');

    const windowListeners = new Map();

    const makeQueryPromise = (data = []) => {
        const p = Promise.resolve({ data, error: null });
        p.order = () => p;
        p.limit = () => p;
        p.eq = () => p;
        p.maybeSingle = () => Promise.resolve({ data: null, error: null });
        return p;
    };

    const sandbox = {
        tailwind: { config: {} },
        console: {
            log: () => {},
            warn: () => {},
            error: () => {},
            info: () => {}
        },
        document: {
            getElementById: (id) => {
                if (!elements.has(id)) {
                    elements.set(id, createMockElement(id));
                }
                return elements.get(id);
            },
            querySelector: (sel) => {
                if (sel.startsWith('#')) return sandbox.document.getElementById(sel.slice(1));
                return createMockElement('sel-' + Math.random(), 'DIV');
            },
            querySelectorAll: () => [],
            createElement: (tag) => createMockElement('elem-' + Math.random(), tag),
            addEventListener: (event, handler) => {
                if (!windowListeners.has('doc:' + event)) windowListeners.set('doc:' + event, []);
                windowListeners.get('doc:' + event).push(handler);
            }
        },
        window: {
            addEventListener: (event, handler) => {
                if (!windowListeners.has('win:' + event)) windowListeners.set('win:' + event, []);
                windowListeners.get('win:' + event).push(handler);
            },
            dispatchEvent: (event) => {
                const handlers = windowListeners.get('win:' + event.type) || [];
                handlers.forEach(h => h(event));
            },
            location: { reload: () => {} },
            innerWidth: 1920,
            innerHeight: 1080,
            localStorage: {
                getItem: (k) => (mockStorage[k] !== undefined ? mockStorage[k] : null),
                setItem: (k, v) => { mockStorage[k] = String(v); },
                removeItem: (k) => { delete mockStorage[k]; },
                clear: () => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); }
            },
            supabase: {
                createClient: () => ({
                    auth: {
                        signInWithPassword: async () => ({ data: null, error: { message: 'Mock' } }),
                        signUp: async () => ({ data: null, error: { message: 'Mock' } })
                    },
                    from: () => ({
                        select: () => makeQueryPromise([]),
                        insert: () => makeQueryPromise([])
                    })
                })
            }
        },
        localStorage: {
            getItem: (k) => (mockStorage[k] !== undefined ? mockStorage[k] : null),
            setItem: (k, v) => { mockStorage[k] = String(v); },
            removeItem: (k) => { delete mockStorage[k]; },
            clear: () => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); }
        },
        alert: (msg) => { alertLogs.push(msg); },
        confirm: () => true,
        setTimeout: setTimeout,
        clearTimeout: clearTimeout,
        setInterval: setInterval,
        clearInterval: clearInterval,
        parseInt,
        parseFloat,
        isNaN,
        Date: Date,
        Math: Math,
        Array,
        Object,
        String,
        Number,
        Set,
        Map,
        RegExp,
        THREE: {
            Color: MockColor,
            Scene: class { add() {} },
            PerspectiveCamera: class { position = { z: 5, set() {} }; },
            WebGLRenderer: class { setPixelRatio() {} setSize() {} render() {} domElement = {}; },
            IcosahedronGeometry: class {},
            MeshStandardMaterial: class { color = new MockColor(); },
            ShaderMaterial: class {},
            Mesh: class { rotation = { x: 0, y: 0 }; },
            Vector2: class {},
            AmbientLight: class {},
            PointLight: class { position = { set() {} }; }
        },
        requestAnimationFrame: (cb) => setTimeout(cb, 16),
        cancelAnimationFrame: (id) => clearTimeout(id)
    };

    sandbox.window.document = sandbox.document;
    sandbox.global = sandbox;

    // Extract inline JS scripts excluding tailwind.config
    const scriptRegex = /<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi;
    let scriptsCode = '';
    let scriptMatch;
    while ((scriptMatch = scriptRegex.exec(htmlContent)) !== null) {
        if (!scriptMatch[1].includes('tailwind.config')) {
            scriptsCode += '\n' + scriptMatch[1];
        }
    }

    const context = vm.createContext(sandbox);
    vm.runInContext(scriptsCode, context);

    return { sandbox, context, elements, windowListeners, alertLogs };
}

async function probeUrl(url) {
    return new Promise((resolve) => {
        try {
            const parsed = new URL(url);
            const client = parsed.protocol === 'https:' ? https : http;
            const req = client.get(url, {
                headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' },
                timeout: 8000
            }, (res) => {
                const statusCode = res.statusCode;
                const contentType = res.headers['content-type'] || '';
                res.on('data', () => {});
                res.on('end', () => {
                    resolve({
                        url,
                        statusCode,
                        contentType,
                        ok: statusCode >= 200 && statusCode < 400 && contentType.startsWith('image/')
                    });
                });
            });
            req.on('error', (err) => {
                resolve({ url, statusCode: 0, contentType: '', error: err.message, ok: false });
            });
            req.on('timeout', () => {
                req.destroy();
                resolve({ url, statusCode: 408, contentType: '', error: 'TIMEOUT', ok: false });
            });
        } catch (e) {
            resolve({ url, statusCode: 0, contentType: '', error: e.message, ok: false });
        }
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function runAdversarialSuite() {
    console.log(`${C.bold}${C.blue}==============================================================================${C.reset}`);
    console.log(`${C.bold}${C.magenta}  MURTHEHELP // EMPIRICAL CHALLENGER 1 — ADVERSARIAL STRESS TEST SUITE${C.reset}`);
    console.log(`${C.bold}${C.blue}==============================================================================${C.reset}\n`);

    // =========================================================================
    // SECTION 1: TRIPLE-CLICK TIMING & BOUNDARY STRESS TESTS
    // =========================================================================
    console.log(`${C.bold}▶ SECTION 1: TRIPLE-CLICK MECHANISM ADVERSARIAL STRESS TESTS${C.reset}`);

    // Test 1.1: Single click does not trigger portal
    {
        const { context, elements } = createDOMSandbox();
        vm.runInContext(`
            secretClickCount = 0;
            clearTimeout(secretClickTimer);
            handleSecretTripleClick();
        `, context);
        const count = vm.runInContext('secretClickCount', context);
        const portalHidden = elements.get('portal-stage').classList.contains('hidden');
        assert(count === 1 && portalHidden, 'ADV-TC-01', 'Single click arms counter to 1, portal remains hidden',
            `count=${count}, portalHidden=${portalHidden}`);
    }

    // Test 1.2: Two consecutive clicks do not trigger portal
    {
        const { context, elements } = createDOMSandbox();
        vm.runInContext(`
            secretClickCount = 0;
            clearTimeout(secretClickTimer);
            handleSecretTripleClick();
            handleSecretTripleClick();
        `, context);
        const count = vm.runInContext('secretClickCount', context);
        const portalHidden = elements.get('portal-stage').classList.contains('hidden');
        assert(count === 2 && portalHidden, 'ADV-TC-02', 'Two consecutive clicks arm counter to 2, portal remains hidden',
            `count=${count}, portalHidden=${portalHidden}`);
    }

    // Test 1.3: Three rapid clicks trigger portal and reset counter
    {
        const { context, elements } = createDOMSandbox();
        vm.runInContext(`
            secretClickCount = 0;
            clearTimeout(secretClickTimer);
            handleSecretTripleClick();
            handleSecretTripleClick();
            handleSecretTripleClick();
        `, context);
        const count = vm.runInContext('secretClickCount', context);
        const portalVisible = !elements.get('portal-stage').classList.contains('hidden');
        const disguiseHidden = elements.get('disguise-stage').classList.contains('hidden');
        assert(count === 0 && portalVisible && disguiseHidden, 'ADV-TC-03', 'Three rapid clicks trigger portal, reset counter to 0, disguise hidden',
            `count=${count}, portalVisible=${portalVisible}, disguiseHidden=${disguiseHidden}`);
    }

    // Test 1.4: Clicks separated by >1500ms timeout reset
    {
        const { context, elements } = createDOMSandbox();
        vm.runInContext(`
            secretClickCount = 0;
            clearTimeout(secretClickTimer);
            handleSecretTripleClick(); // Click 1
        `, context);
        await sleep(1600);
        const countAfterExpiry = vm.runInContext('secretClickCount', context);
        vm.runInContext('handleSecretTripleClick();', context); // Click 2 (after reset)
        const countAfterSecond = vm.runInContext('secretClickCount', context);
        const portalHidden = elements.get('portal-stage').classList.contains('hidden');
        assert(countAfterExpiry === 0 && countAfterSecond === 1 && portalHidden, 'ADV-TC-04', 'Click separated by >1500ms resets count to 0, second click becomes click 1',
            `countAfterExpiry=${countAfterExpiry}, countAfterSecond=${countAfterSecond}, portalHidden=${portalHidden}`);
    }

    // Test 1.5: 4th Click Behavior (3 clicks trigger, 4th click starts fresh sequence)
    {
        const { context, elements } = createDOMSandbox();
        vm.runInContext(`
            secretClickCount = 0;
            clearTimeout(secretClickTimer);
            handleSecretTripleClick(); // Click 1
            handleSecretTripleClick(); // Click 2
            handleSecretTripleClick(); // Click 3 -> Triggers portal & resets to 0
            handleSecretTripleClick(); // Click 4 -> Should set count to 1
        `, context);
        const countAfter4th = vm.runInContext('secretClickCount', context);
        // Now perform 2 more clicks -> should trigger 2nd time
        elements.get('portal-stage').classList.add('hidden'); // reset for test
        vm.runInContext(`
            handleSecretTripleClick(); // Click 5 (2 of sequence)
            handleSecretTripleClick(); // Click 6 (3 of sequence -> triggers!)
        `, context);
        const countAfter6th = vm.runInContext('secretClickCount', context);
        const portalVisibleAgain = !elements.get('portal-stage').classList.contains('hidden');
        assert(countAfter4th === 1 && countAfter6th === 0 && portalVisibleAgain, 'ADV-TC-05', '4th click begins fresh sequence, 6th click triggers portal again',
            `countAfter4th=${countAfter4th}, countAfter6th=${countAfter6th}, portalVisibleAgain=${portalVisibleAgain}`);
    }

    // Test 1.6: Sliding Window Jitter (clicks at 0ms, 1400ms, 2800ms trigger successfully)
    {
        const { context, elements } = createDOMSandbox();
        vm.runInContext(`
            secretClickCount = 0;
            clearTimeout(secretClickTimer);
            handleSecretTripleClick(); // t=0
        `, context);
        await sleep(1300); // within 1500ms
        vm.runInContext('handleSecretTripleClick();', context); // t=1300ms (resets timer)
        await sleep(1300); // within 1500ms from 2nd click
        vm.runInContext('handleSecretTripleClick();', context); // t=2600ms (3rd click)
        const portalVisible = !elements.get('portal-stage').classList.contains('hidden');
        const count = vm.runInContext('secretClickCount', context);
        assert(portalVisible && count === 0, 'ADV-TC-06', 'Sliding window click interval (<1500ms between consecutive clicks) triggers portal',
            `portalVisible=${portalVisible}, count=${count}`);
    }

    // Test 1.7: Burst Clicking (12 rapid clicks trigger portal exactly 4 times)
    {
        const { context } = createDOMSandbox();
        vm.runInContext(`
            secretClickCount = 0;
            clearTimeout(secretClickTimer);
            var triggerCount = 0;
            triggerMurthehelpPortal = function() {
                triggerCount++;
            };
            for (let i = 0; i < 12; i++) {
                handleSecretTripleClick();
            }
        `, context);
        const actualTriggers = vm.runInContext('triggerCount', context);
        const finalCount = vm.runInContext('secretClickCount', context);
        assert(actualTriggers === 4 && finalCount === 0, 'ADV-TC-07', '12 rapid burst clicks trigger portal exactly 4 times with 0 leftover count',
            `actualTriggers=${actualTriggers}, finalCount=${finalCount}`);
    }

    // Test 1.8: Event Object Edge Cases (null, undefined, stopPropagation)
    {
        const { context } = createDOMSandbox();
        let errorThrown = false;
        try {
            vm.runInContext(`
                handleSecretTripleClick(null);
                handleSecretTripleClick(undefined);
                handleSecretTripleClick({});
                handleSecretTripleClick({ stopPropagation: () => {} });
            `, context);
        } catch (e) {
            errorThrown = true;
        }
        assert(!errorThrown, 'ADV-TC-08', 'handleSecretTripleClick gracefully handles null, undefined, and event objects without exceptions',
            `errorThrown=${errorThrown}`);
    }

    // Test 1.9: DOM Binding Verification on Footer Span
    {
        const footerSpanMatch = htmlContent.match(/<span[^>]*onclick=["']handleSecretTripleClick\(event\)["'][^>]*>\s*HHL-13543505-HUE\s*<\/span>/);
        const hasAmberColor = htmlContent.includes('text-amber-400') && htmlContent.includes('HHL-13543505-HUE');
        assert(!!footerSpanMatch && hasAmberColor, 'ADV-TC-09', 'Footer text HHL-13543505-HUE contains exact inline onclick binding and amber color styling',
            `matched=${!!footerSpanMatch}`);
    }

    // =========================================================================
    // SECTION 2: TICKER MARQUEE CSS & ANIMATION PLAY-STATE ADVERSARIAL TESTS
    // =========================================================================
    console.log(`\n${C.bold}▶ SECTION 2: TICKER MARQUEE CSS & ANIMATION PLAY-STATE TESTS${C.reset}`);

    // Test 2.1: Keyframes marquee CSS Rule Integrity
    {
        const keyframeBlockMatch = htmlContent.match(/@keyframes\s+marquee\s*\{([\s\S]*?\}\s*\})/);
        const block = keyframeBlockMatch ? keyframeBlockMatch[0] : '';
        const has0 = block.includes('0%') && block.includes('translateX(0%)');
        const has100 = block.includes('100%') && block.includes('translateX(-50%)');
        assert(!!keyframeBlockMatch && has0 && has100, 'ADV-TM-01', '@keyframes marquee definition with exact translateX(0%) to translateX(-50%)',
            `keyframeBlockMatch=${!!keyframeBlockMatch}, has0=${has0}, has100=${has100}`);
    }

    // Test 2.2: Ticker Marquee Track Speed Reduction (~40-50% slower, >= 55s)
    {
        const trackMatch = htmlContent.match(/\.marquee-track\s*\{([\s\S]*?)\}/);
        let durationSeconds = 0;
        if (trackMatch) {
            const durMatch = trackMatch[1].match(/(\d+)s/);
            if (durMatch) durationSeconds = parseInt(durMatch[1], 10);
        }
        assert(durationSeconds >= 55 && durationSeconds <= 80, 'ADV-TM-02', `Ticker marquee animation duration reduced to ${durationSeconds}s (>= 55s, ~40-50% slower)`,
            `durationSeconds=${durationSeconds}`);
    }

    // Test 2.3: Container and Track Hover Pause Rules in CSS
    {
        const hoverPauseMatch = htmlContent.match(/\.ticker-container:hover\s+\.marquee-track[\s\S]*?animation-play-state:\s*paused/);
        const trackHoverMatch = htmlContent.match(/\.marquee-track:hover[\s\S]*?animation-play-state:\s*paused/);
        assert(!!hoverPauseMatch && !!trackHoverMatch, 'ADV-TM-03', 'CSS contains explicit animation-play-state: paused on both .ticker-container:hover and .marquee-track:hover',
            `hoverPauseMatch=${!!hoverPauseMatch}, trackHoverMatch=${!!trackHoverMatch}`);
    }

    // Test 2.4: Absence of Navbar F12 Button
    {
        const f12NavbarMatch = htmlContent.match(/<button[^>]*>[^<]*F12\s*(?:Kiểm Tra|Mã Nguồn)[^<]*<\/button>/i);
        assert(!f12NavbarMatch, 'ADV-TM-04', 'Storefront navbar has ZERO visible F12 inspection trigger buttons',
            `f12NavbarMatch=${!!f12NavbarMatch}`);
    }

    // Test 2.5: Marquee Track Data Integrity (Contains Order #HD-71092 and duplicates)
    {
        const hd71092Count = (htmlContent.match(/#HD-71092/g) || []).length;
        const totalHHLOrders = (htmlContent.match(/#HHL-9981\d/g) || []).length;
        assert(hd71092Count >= 2 && totalHHLOrders >= 12, 'ADV-TM-05', 'Marquee track contains seamless duplicated order batches (#HD-71092 count >= 2, total orders >= 14)',
            `hd71092Count=${hd71092Count}, totalHHLOrders=${totalHHLOrders}`);
    }

    // =========================================================================
    // SECTION 3: STAGE TRANSITIONS & MODAL CONTROLS ADVERSARIAL TESTS
    // =========================================================================
    console.log(`\n${C.bold}▶ SECTION 3: STAGE TRANSITIONS & MODAL CONTROLS STRESS TESTS${C.reset}`);

    // Test 3.1: Full Forward Pipeline (Disguise -> Portal -> Dark Stage)
    {
        const { context, elements } = createDOMSandbox();
        vm.runInContext('triggerMurthehelpPortal();', context);
        const stage1DisguiseHidden = elements.get('disguise-stage').classList.contains('hidden');
        const stage1PortalFlex = elements.get('portal-stage').classList.contains('flex');

        vm.runInContext('enterDarkMallFinal();', context);
        const stage2PortalHidden = elements.get('portal-stage').classList.contains('hidden');
        const stage2DarkFlex = elements.get('dark-stage').classList.contains('flex');
        const bgColor = elements.get('main-body').style.backgroundColor;

        assert(stage1DisguiseHidden && stage1PortalFlex && stage2PortalHidden && stage2DarkFlex && bgColor === '#06070a',
            'ADV-ST-01', 'Forward stage pipeline: Disguise -> Portal (flex) -> Dark Stage (flex, bg #06070a)',
            `stage1DisguiseHidden=${stage1DisguiseHidden}, stage1PortalFlex=${stage1PortalFlex}, stage2PortalHidden=${stage2PortalHidden}, stage2DarkFlex=${stage2DarkFlex}`);
    }

    // Test 3.2: Emergency Return to Disguise (Panic Reset)
    {
        const { context, elements } = createDOMSandbox();
        // Move to dark stage and open multiple modals
        vm.runInContext(`
            triggerMurthehelpPortal();
            enterDarkMallFinal();
            openCartModal();
            openProductDetailModal('RED-P01');
            document.getElementById('disguise-search-input').value = 'mh13543505';
            returnToDisguise();
        `, context);

        const darkHidden = elements.get('dark-stage').classList.contains('hidden');
        const portalHidden = elements.get('portal-stage').classList.contains('hidden');
        const disguiseVisible = !elements.get('disguise-stage').classList.contains('hidden');
        const cartHidden = elements.get('cart-modal').classList.contains('hidden');
        const searchCleared = elements.get('disguise-search-input').value === '';
        const bodyBgReset = elements.get('main-body').style.backgroundColor === '#f8fafc';

        assert(darkHidden && portalHidden && disguiseVisible && cartHidden && searchCleared && bodyBgReset,
            'ADV-ST-02', 'returnToDisguise() cleanly resets all stages, hides modals, clears search input, and resets background color',
            `darkHidden=${darkHidden}, disguiseVisible=${disguiseVisible}, cartHidden=${cartHidden}, searchCleared=${searchCleared}, bodyBgReset=${bodyBgReset}`);
    }

    // Test 3.3: ESC Key Global Panic Handler
    {
        const { context, elements, windowListeners } = createDOMSandbox();
        vm.runInContext(`
            triggerMurthehelpPortal();
            enterDarkMallFinal();
            openCartModal();
        `, context);

        // Dispatch ESC keydown event
        const keydownHandlers = windowListeners.get('win:keydown') || [];
        keydownHandlers.forEach(h => h({ key: 'Escape', preventDefault() {} }));

        const darkHidden = elements.get('dark-stage').classList.contains('hidden');
        const disguiseVisible = !elements.get('disguise-stage').classList.contains('hidden');
        assert(darkHidden && disguiseVisible, 'ADV-ST-03', 'Global ESC keydown event closes all open modals and executes immediate emergency return to disguise',
            `darkHidden=${darkHidden}, disguiseVisible=${disguiseVisible}`);
    }

    // Test 3.4: F12 Modal Lifecycle & Secret Portal Activation
    {
        const { context, elements } = createDOMSandbox();
        vm.runInContext(`
            openF12InspectionModal();
        `, context);
        const f12Open = !elements.get('f12-inspection-modal').classList.contains('hidden');

        vm.runInContext(`
            closeF12InspectionModal();
        `, context);
        const f12Closed = elements.get('f12-inspection-modal').classList.contains('hidden');

        assert(f12Open && f12Closed, 'ADV-ST-04', 'F12 inspection modal opens and closes correctly via openF12InspectionModal / closeF12InspectionModal',
            `f12Open=${f12Open}, f12Closed=${f12Closed}`);
    }

    // Test 3.5: Product Detail Modal Exhaustive Sweep (All products open cleanly)
    {
        const { context, elements } = createDOMSandbox();
        const productsDb = vm.runInContext('PRODUCTS_DB', context);
        let allProductsOpenOk = true;
        let failedItemId = null;

        for (const item of productsDb) {
            vm.runInContext(`openProductDetailModal('${item.id}');`, context);
            const modalOpen = !elements.get('product-detail-modal').classList.contains('hidden');
            const nameMatch = elements.get('detail-item-name').innerText === item.name;
            const codeMatch = elements.get('detail-item-code').innerText === item.id;
            vm.runInContext('closeProductDetailModal();', context);
            const modalClosed = elements.get('product-detail-modal').classList.contains('hidden');

            if (!modalOpen || !nameMatch || !codeMatch || !modalClosed) {
                allProductsOpenOk = false;
                failedItemId = item.id;
                break;
            }
        }
        assert(allProductsOpenOk, 'ADV-ST-05', `Product Detail Modal opens and populates metadata correctly for all ${productsDb.length} catalog items`,
            `failedItemId=${failedItemId}`);
    }

    // Test 3.6: Multi-Cycle Stage Re-Entry Idempotency (10 full cycles)
    {
        const { context, elements } = createDOMSandbox();
        let cycleFailed = false;

        for (let cycle = 1; cycle <= 10; cycle++) {
            vm.runInContext(`
                triggerMurthehelpPortal();
                enterDarkMallFinal();
                returnToDisguise();
            `, context);

            const disguiseOk = !elements.get('disguise-stage').classList.contains('hidden');
            const portalOk = elements.get('portal-stage').classList.contains('hidden');
            const darkOk = elements.get('dark-stage').classList.contains('hidden');

            if (!disguiseOk || !portalOk || !darkOk) {
                cycleFailed = true;
                break;
            }
        }
        assert(!cycleFailed, 'ADV-ST-06', '10 consecutive full re-entry cycles (Disguise -> Portal -> Dark -> Disguise) execute with zero state leakage',
            `cycleFailed=${cycleFailed}`);
    }

    // Test 3.7: Cart Operations & Escrow Balance Stress Testing
    {
        const { context } = createDOMSandbox();
        vm.runInContext(`
            cart = [];
            currentUser = { username: 'q121101', role: 'GREEN', balance: 1500000000 };
            addToCart('RED-P01'); // 38,500,000
            addToCart('RED-P01'); // +1 qty
            addToCart('RED-AR01'); // 165,000,000
        `, context);

        const cartLength = vm.runInContext('cart.length', context);
        const p01Item = vm.runInContext("cart.find(i => i.id === 'RED-P01')", context);
        const totalSum = vm.runInContext("cart.reduce((s, i) => s + (i.price * i.qty), 0)", context);
        const expectedSum = (38500000 * 2) + 165000000;

        assert(cartLength === 2 && p01Item.qty === 2 && totalSum === expectedSum, 'ADV-ST-07', 'Cart multi-item addition and quantity aggregation compute exact totals',
            `cartLength=${cartLength}, p01Qty=${p01Item ? p01Item.qty : 0}, totalSum=${totalSum}, expectedSum=${expectedSum}`);
    }

    // Test 3.8: Rebranding Verification (MURDER-SHOP)
    {
        const headerSpanMatch = htmlContent.match(/<span[^>]*class=["'][^"']*text-red-500[^"']*["']>\s*MURDER-SHOP\s*<\/span>/);
        const deprecatedMallMatches = [...htmlContent.matchAll(/MURDER\.SHOPPING\.MALL/g)];
        assert(!!headerSpanMatch && deprecatedMallMatches.length === 0, 'ADV-ST-08', 'Dark mall header explicitly rebranded to MURDER-SHOP with zero leftover MURDER.SHOPPING.MALL references',
            `headerSpanMatch=${!!headerSpanMatch}, deprecatedMatches=${deprecatedMallMatches.length}`);
    }

    // =========================================================================
    // SECTION 4: PRODUCT CATALOG & LIVE IMAGE HEALTH PROBES
    // =========================================================================
    console.log(`\n${C.bold}▶ SECTION 4: PRODUCT CATALOG EXPANSION & IMAGE ASSET PROBES${C.reset}`);

    const { context: dbContext } = createDOMSandbox();
    const productsDb = vm.runInContext('PRODUCTS_DB', dbContext);
    const subCategories = vm.runInContext('SUB_CATEGORIES', dbContext);

    // Test 4.1: Product Count >= 50
    {
        assert(productsDb.length >= 50, 'ADV-PC-01', `PRODUCTS_DB contains ${productsDb.length} products (Requirement R4 >= 50 total items)`,
            `count=${productsDb.length}`);
    }

    // Test 4.2: Tier Distribution & Subcategory Coverage
    {
        const redCount = productsDb.filter(p => p.code === 'RED').length;
        const purpleCount = productsDb.filter(p => p.code === 'PURPLE').length;
        const yellowCount = productsDb.filter(p => p.code === 'YELLOW').length;
        const greenCount = productsDb.filter(p => p.code === 'GREEN').length;

        // Check each subcategory in SUB_CATEGORIES has items
        let missingSubCats = [];
        for (const [tier, list] of Object.entries(subCategories)) {
            for (const sub of list) {
                if (!sub.id.startsWith('ALL_')) {
                    const matchCount = productsDb.filter(p => p.code === tier && p.subCat === sub.id).length;
                    if (matchCount === 0) {
                        missingSubCats.push(`${tier}:${sub.id}`);
                    }
                }
            }
        }

        const coverageOk = missingSubCats.length === 0 && redCount >= 20 && purpleCount >= 8 && yellowCount >= 7 && greenCount >= 5;
        assert(coverageOk, 'ADV-PC-02', `All 4 Clearance Tiers populated (RED=${redCount}, PURPLE=${purpleCount}, YELLOW=${yellowCount}, GREEN=${greenCount}) with 100% subcategory representation`,
            missingSubCats.length > 0 ? `Missing subcategories: ${missingSubCats.join(', ')}` : `RED=${redCount}, PURPLE=${purpleCount}, YELLOW=${yellowCount}, GREEN=${greenCount}`);
    }

    // Test 4.3: Live Asynchronous HTTP Image Probes
    {
        console.log(`  ${C.dim}Probing ${productsDb.length} tactical product images via live HTTP HEAD/GET...${C.reset}`);
        const probePromises = productsDb.map(item => probeUrl(item.img));
        const probeResults = await Promise.all(probePromises);

        const brokenImages = [];
        probeResults.forEach((res, idx) => {
            if (!res.ok) {
                brokenImages.push({ item: productsDb[idx], result: res });
            }
        });

        assert(brokenImages.length === 0, 'ADV-PC-03', `100% of product images (${productsDb.length}/${productsDb.length}) returned HTTP 200 OK image response`,
            brokenImages.length > 0 ? `Found ${brokenImages.length} broken images: ${brokenImages.map(b => b.item.id + ' -> ' + b.result.statusCode).join(', ')}` : '');
    }

    // =========================================================================
    // SECTION 5: REAL HEADLESS GOOGLE CHROME LIVE E2E VALIDATION
    // =========================================================================
    console.log(`\n${C.bold}▶ SECTION 5: REAL HEADLESS GOOGLE CHROME E2E VERIFICATION${C.reset}`);

    {
        const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
        let chromePassed = false;
        let chromeDetails = '';

        try {
            const cmd = `"${chromePath}" --headless=new --disable-gpu --no-sandbox --dump-dom "file://${HTML_FILE}"`;
            const renderedDom = execSync(cmd, { encoding: 'utf-8', timeout: 15000, stdio: ['pipe', 'pipe', 'ignore'] });

            const hasDisguise = renderedDom.includes('id="disguise-stage"');
            const hasPortal = renderedDom.includes('id="portal-stage"');
            const hasDarkStage = renderedDom.includes('id="dark-stage"');
            const hasMurderShop = renderedDom.includes('MURDER-SHOP');
            const hasSecretSpan = renderedDom.includes('HHL-13543505-HUE');

            if (hasDisguise && hasPortal && hasDarkStage && hasMurderShop && hasSecretSpan) {
                chromePassed = true;
            } else {
                chromeDetails = `Missing components in rendered DOM: disguise=${hasDisguise}, portal=${hasPortal}, dark=${hasDarkStage}, murderShop=${hasMurderShop}, span=${hasSecretSpan}`;
            }
        } catch (e) {
            chromeDetails = `Chrome execution error: ${e.message}`;
        }

        assert(chromePassed, 'ADV-CHR-01', 'Headless Google Chrome successfully renders full single-page app DOM with zero parser errors',
            chromeDetails);
    }

    // =========================================================================
    // SUMMARY
    // =========================================================================
    console.log(`\n${C.bold}${C.blue}==============================================================================${C.reset}`);
    console.log(`${C.bold}ADVERSARIAL TEST EXECUTION SUMMARY${C.reset}`);
    console.log(`${C.bold}${C.blue}==============================================================================${C.reset}`);
    console.log(`Total Tests Run : ${totalTests}`);
    console.log(`Passed          : ${C.green}${passedTests}${C.reset}`);
    console.log(`Failed          : ${failedTests > 0 ? C.red : C.green}${failedTests}${C.reset}`);
    console.log(`Verdict         : ${failedTests === 0 ? C.green + 'ALL TESTS PASSED — READY FOR APPROVAL' : C.red + 'FAILURES DETECTED'}${C.reset}`);
    console.log(`${C.bold}${C.blue}==============================================================================${C.reset}\n`);

    return failedTests === 0;
}

runAdversarialSuite().then(success => {
    process.exit(success ? 0 : 1);
}).catch(err => {
    console.error('Fatal test error:', err);
    process.exit(1);
});
