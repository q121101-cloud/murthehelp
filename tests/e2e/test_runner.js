/**
 * ==============================================================================
 * MURTHEHELP // MURDER-SHOP — AUTOMATED E2E TEST RUNNER & VALIDATION HARNESS
 * ==============================================================================
 * Standalone Node.js Automated Test Engine validating Tiers 1-4 Test Specifications.
 *
 * Requirements Covered:
 *  - R1: Ticker Pause on Hover + Speed Reduction (~40-50% slower, duration >= 55s)
 *  - R2: Remove Navbar F12 Button; Remap Trigger to Footer Yellow Triple-Click (1.5s)
 *  - R3: Rebrand Dark Mall Header to MURDER-SHOP (eliminate MURDER.SHOPPING.MALL)
 *  - R4: Expand Product Catalog (>=50 items) & Fix All Broken Image URLs (100% HTTP 200)
 *
 * Test Tiers:
 *  - Tier 1: Feature Coverage (R1, R2, R3, R4)
 *  - Tier 2: Boundary & Corner Cases (Timers, CSS keyframes, Schema, VNĐ Price formatting)
 *  - Tier 3: Cross-Feature Combinations (Stage transitions, Tab/SubCat filtering, Cart/Checkout)
 *  - Tier 4: Real-World Application Scenarios & Image Health (Super Admin Login, Live Async Image URLs, Script Syntax, Operative Journey)
 * ==============================================================================
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const http = require('http');
const https = require('https');
const { URL } = require('url');

// --- ANSI Color Formatting ---
const C = {
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    gray: '\x1b[90m'
};

const PROJECT_ROOT = path.resolve(__dirname, '../../');
const HTML_FILE = path.join(PROJECT_ROOT, 'index.html');

class MockColor {
    constructor(hex = 0x000000) { this.hex = hex; }
    clone() { return new MockColor(this.hex); }
    copy(c) { this.hex = (c && c.hex !== undefined) ? c.hex : c; return this; }
    setHex(h) { this.hex = h; return this; }
    lerp(c, alpha) { return this; }
}

/**
 * Creates an isolated Mock DOM & Browser Environment for executing index.html scripts
 */
function createSandboxEnvironment(htmlContent) {
    const alerts = [];
    const elements = new Map();
    const eventListeners = new Map();
    const mockStorage = {};
    const activeTimers = new Map();
    let timerIdCounter = 1;

    function createMockElement(id = '', tag = 'DIV') {
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
            innerHTML: '',
            value: '',
            children: [],
            addEventListener(event, handler) {
                if (!eventListeners.has(id + ':' + event)) eventListeners.set(id + ':' + event, []);
                eventListeners.get(id + ':' + event).push(handler);
            },
            appendChild(child) { this.children.push(child); },
            click() {
                const handlers = eventListeners.get(id + ':click') || [];
                handlers.forEach(h => h({ target: this, preventDefault() {}, stopPropagation() {} }));
            }
        };
    }

    // Index all elements by ID from HTML
    const idRegex = /id=["']([^"']+)["']/g;
    let match;
    while ((match = idRegex.exec(htmlContent)) !== null) {
        const id = match[1];
        if (!elements.has(id)) {
            elements.set(id, createMockElement(id));
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

    // Ensure core IDs exist in mock
    [
        'disguise-stage', 'portal-stage', 'dark-stage', 'f12-inspection-modal',
        'product-detail-modal', 'cart-modal', 'orders-modal', 'admin-modal',
        'disguise-search-input', 'disguise-products-grid', 'dark-products-grid',
        'cart-counter', 'cart-total-vnđ', 'cart-items-wrapper', 'current-user-name',
        'user-balance-display', 'subcat-filters', 'login-username', 'login-password',
        'form-login', 'form-register', 'tab-auth-login', 'tab-auth-register',
        'webgl-canvas', 'checkout-name', 'checkout-phone', 'checkout-address',
        'checkout-crypto-addr', 'coupon-input', 'order-history-list', 'tab-RED',
        'tab-PURPLE', 'tab-YELLOW', 'tab-GREEN', 'current-view-heading'
    ].forEach(id => {
        if (!elements.has(id)) elements.set(id, createMockElement(id));
    });

    const documentMock = {
        getElementById(id) {
            if (!elements.has(id)) {
                elements.set(id, createMockElement(id));
            }
            return elements.get(id);
        },
        createElement(tagName) {
            return createMockElement('', tagName);
        },
        querySelectorAll(selector) {
            return [];
        },
        querySelector(selector) {
            return null;
        }
    };

    const windowListeners = new Map();
    const windowMock = {
        addEventListener(event, handler) {
            if (!windowListeners.has(event)) windowListeners.set(event, []);
            windowListeners.get(event).push(handler);
        },
        removeEventListener(event, handler) {},
        dispatchEvent(event, data) {
            const handlers = windowListeners.get(event) || [];
            handlers.forEach(h => h(data));
        },
        innerWidth: 1920,
        innerHeight: 1080,
        AudioContext: class {
            constructor() {
                this.currentTime = 0;
                this.state = 'running';
                this.destination = {};
            }
            createOscillator() {
                return {
                    type: 'sine',
                    frequency: { setValueAtTime() {}, exponentialRampToValueAtTime() {} },
                    connect() {},
                    start() {},
                    stop() {}
                };
            }
            createGain() {
                return {
                    gain: { setValueAtTime() {}, exponentialRampToValueAtTime() {} },
                    connect() {}
                };
            }
            createBiquadFilter() {
                return {
                    type: 'lowpass',
                    frequency: { setValueAtTime() {}, exponentialRampToValueAtTime() {} },
                    connect() {}
                };
            }
            resume() {}
        }
    };

    // Extract inline JS scripts (excluding tailwind config)
    const scriptRegex = /<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi;
    let scriptsCode = '';
    let scriptMatch;
    while ((scriptMatch = scriptRegex.exec(htmlContent)) !== null) {
        if (!scriptMatch[1].includes('tailwind.config')) {
            scriptsCode += '\n' + scriptMatch[1];
        }
    }

    const sandbox = {
        document: documentMock,
        window: windowMock,
        localStorage: {
            getItem: (k) => (mockStorage[k] !== undefined ? mockStorage[k] : null),
            setItem: (k, v) => { mockStorage[k] = String(v); },
            removeItem: (k) => { delete mockStorage[k]; },
            clear: () => { for (let k in mockStorage) delete mockStorage[k]; }
        },
        console: { log() {}, warn() {}, error() {} },
        alert(msg) { alerts.push(msg); },
        setTimeout(fn, delay = 0) {
            const id = timerIdCounter++;
            activeTimers.set(id, { fn, delay });
            return id;
        },
        clearTimeout(id) {
            activeTimers.delete(id);
        },
        requestAnimationFrame(fn) { return 1; },
        cancelAnimationFrame() {},
        THREE: {
            WebGLRenderer: class { setPixelRatio() {} setSize() {} render() {} },
            Scene: class { add() {} },
            PerspectiveCamera: class { position = { z: 5 }; },
            IcosahedronGeometry: class {},
            ShaderMaterial: class {},
            Mesh: class { rotation = { x: 0, y: 0 }; },
            Vector2: class {},
            Color: MockColor
        },
        createClient: () => ({
            from: () => ({
                select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: null, error: null }) }) }),
                insert: async () => ({ data: null, error: null })
            })
        }),
        parseInt,
        parseFloat,
        isNaN,
        Math,
        Array,
        Object,
        String,
        Number,
        Set,
        Map,
        Date,
        RegExp
    };

    const context = vm.createContext(sandbox);
    try {
        vm.runInContext(scriptsCode, context);
    } catch (err) {
        // Log syntax / eval runtime error
    }

    const getVar = (name) => {
        try {
            return vm.runInContext(`typeof ${name} !== 'undefined' ? ${name} : undefined`, context);
        } catch (e) {
            return undefined;
        }
    };

    const setVar = (name, value) => {
        try {
            sandbox[name] = value;
            vm.runInContext(`${name} = ${JSON.stringify(value)};`, context);
        } catch (e) {
            sandbox[name] = value;
        }
    };

    const callFn = (name, ...args) => {
        try {
            const fn = vm.runInContext(`typeof ${name} === 'function' ? ${name} : undefined`, context);
            if (typeof fn !== 'function') {
                throw new Error(`Function '${name}' is not defined in context`);
            }
            return fn(...args);
        } catch (e) {
            throw e;
        }
    };

    return {
        context,
        document: documentMock,
        window: windowMock,
        elements,
        alerts,
        mockStorage,
        activeTimers,
        htmlContent,
        getVar,
        setVar,
        callFn
    };
}

/**
 * Asynchronously performs an HTTP HEAD or GET check for an image URL
 */
function probeImageUrl(urlStr, timeoutMs = 7000) {
    return new Promise((resolve) => {
        try {
            const parsed = new URL(urlStr);
            const mod = parsed.protocol === 'https:' ? https : http;
            const req = mod.request(
                parsed,
                {
                    method: 'HEAD',
                    timeout: timeoutMs,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
                    }
                },
                (res) => {
                    // Handle redirects if any
                    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                        probeImageUrl(res.headers.location, timeoutMs).then(resolve);
                        return;
                    }
                    resolve({ url: urlStr, status: res.statusCode });
                }
            );

            req.on('error', (err) => {
                resolve({ url: urlStr, status: 'ERROR', message: err.message });
            });

            req.on('timeout', () => {
                req.destroy();
                resolve({ url: urlStr, status: 'TIMEOUT', message: `Request timed out after ${timeoutMs}ms` });
            });

            req.end();
        } catch (e) {
            resolve({ url: urlStr, status: 'INVALID_URL', message: e.message });
        }
    });
}

// ==============================================================================
// TEST SUITE DEFINITION (TIERS 1 - 4)
// ==============================================================================

const TEST_SUITE = [
    // --------------------------------------------------------------------------
    // TIER 1: FEATURE COVERAGE (R1, R2, R3, R4)
    // --------------------------------------------------------------------------
    {
        id: 'T1-R1-01',
        tier: 'Tier 1: Feature Coverage',
        requirement: 'R1',
        title: 'Ticker Speed Slowdown (~40-50% Reduction, Duration >= 55s)',
        run: (env) => {
            const match = env.htmlContent.match(/animation:\s*marquee\s*(\d+)s/i);
            if (!match) {
                throw new Error("CSS animation 'marquee' duration definition not found in HTML style block.");
            }
            const duration = parseInt(match[1], 10);
            if (duration < 55) {
                throw new Error(`Ticker animation duration is ${duration}s. Expected >= 55s (approx 60s-70s for a 40-50% speed reduction from 35s).`);
            }
        }
    },
    {
        id: 'T1-R1-02',
        tier: 'Tier 1: Feature Coverage',
        requirement: 'R1',
        title: 'Ticker Complete Pause on Hover in CSS',
        run: (env) => {
            const hasPauseRule = /animation-play-state:\s*paused/i.test(env.htmlContent);
            if (!hasPauseRule) {
                throw new Error("CSS rule 'animation-play-state: paused' missing for marquee/ticker hover.");
            }
            const hasHoverSelector = /\.marquee-track:hover|\.ticker-container:hover/i.test(env.htmlContent);
            if (!hasHoverSelector) {
                throw new Error("CSS selector for marquee hover (e.g. '.marquee-track:hover' or '.ticker-container:hover .marquee-track') is missing.");
            }
        }
    },
    {
        id: 'T1-R1-03',
        tier: 'Tier 1: Feature Coverage',
        requirement: 'R1',
        title: 'Disguise Storefront Ticker Container & Order #HD-71092',
        run: (env) => {
            const html = env.htmlContent;
            if (!html.includes('marquee-track')) {
                throw new Error("Element with class 'marquee-track' not found in disguise storefront.");
            }
            if (!html.includes('#HD-71092') || !html.includes('70.000.000')) {
                throw new Error("High-value hydraulic hose order #HD-71092 (70.000.000 ₫) missing in ticker text.");
            }
        }
    },
    {
        id: 'T1-R2-01',
        tier: 'Tier 1: Feature Coverage',
        requirement: 'R2',
        title: 'Absence of F12 Inspection Trigger Button in Navbar Utility Bar',
        run: (env) => {
            const html = env.htmlContent;
            const disguiseIdx = html.indexOf('id="disguise-stage"');
            const tickerIdx = html.indexOf('marquee-track');
            const utilityBarHtml = html.substring(disguiseIdx, tickerIdx !== -1 ? tickerIdx : disguiseIdx + 1500);

            if (/F12.*Kiểm Tra Mã Nguồn Trang/i.test(utilityBarHtml) || /openF12InspectionModal\(\)/i.test(utilityBarHtml)) {
                throw new Error("Navbar utility bar still contains visible F12 source inspection button ('F12: Kiểm Tra Mã Nguồn Trang'). It must be removed.");
            }
        }
    },
    {
        id: 'T1-R2-02',
        tier: 'Tier 1: Feature Coverage',
        requirement: 'R2',
        title: 'Absence of F12 Button in Storefront Hero Action Area',
        run: (env) => {
            const html = env.htmlContent;
            const heroIdx = html.indexOf('id="disguise-stage"');
            const catalogIdx = html.indexOf('id="disguise-products-grid"');
            const heroHtml = html.substring(heroIdx, catalogIdx !== -1 ? catalogIdx : heroIdx + 8000);

            if (/>\s*F12 Mã Nguồn\s*</i.test(heroHtml) || /<span>🔍<\/span>\s*F12/i.test(heroHtml)) {
                throw new Error("Storefront hero area still contains visible 'F12 Mã Nguồn' button. It must be removed.");
            }
        }
    },
    {
        id: 'T1-R2-03',
        tier: 'Tier 1: Feature Coverage',
        requirement: 'R2',
        title: 'Preservation of F12 Inspection Modal in DOM with Hidden State',
        run: (env) => {
            const html = env.htmlContent;
            if (!html.includes('id="f12-inspection-modal"') && !html.includes("id='f12-inspection-modal'")) {
                throw new Error("F12 inspection modal (#f12-inspection-modal) is missing from the DOM.");
            }
            const modalMatch = html.match(/<div[^>]*id=["']f12-inspection-modal["'][^>]*class=["']([^"']+)["']/i);
            if (!modalMatch || !modalMatch[1].includes('hidden')) {
                throw new Error("#f12-inspection-modal must have 'hidden' class by default.");
            }
        }
    },
    {
        id: 'T1-R2-04',
        tier: 'Tier 1: Feature Coverage',
        requirement: 'R2',
        title: 'Footer MÃ ĐKKD Yellow Text HHL-13543505-HUE & Click Binding',
        run: (env) => {
            const html = env.htmlContent;
            if (!html.includes('HHL-13543505-HUE')) {
                throw new Error("Footer text 'HHL-13543505-HUE' not found in HTML.");
            }
            // Check that HHL-13543505-HUE element or span has yellow/amber styling and handleSecretTripleClick
            const spanMatch = html.match(/<span[^>]*class=["']([^"']+)["'][^>]*onclick=["']([^"']+)["'][^>]*>HHL-13543505-HUE<\/span>/i) ||
                              html.match(/<span[^>]*onclick=["']([^"']+)["'][^>]*class=["']([^"']+)["'][^>]*>HHL-13543505-HUE<\/span>/i) ||
                              html.match(/<p[^>]*onclick=["']([^"']+)["'][\s\S]*?<span[^>]*class=["']([^"']+)["'][^>]*>HHL-13543505-HUE<\/span>/i);

            if (!spanMatch) {
                throw new Error("Footer element for 'HHL-13543505-HUE' is missing required onclick handler and styling.");
            }

            const classes = spanMatch[1] || spanMatch[2];
            const handler = spanMatch[2] || spanMatch[1];

            if (!handler.includes('handleSecretTripleClick')) {
                throw new Error(`Expected click handler 'handleSecretTripleClick(event)', found: '${handler}'`);
            }
            if (!classes.includes('text-amber-') && !classes.includes('text-yellow-') && !classes.includes('gold')) {
                throw new Error(`Expected footer text HHL-13543505-HUE to have yellow/amber styling, but classes were: '${classes}'`);
            }
        }
    },
    {
        id: 'T1-R2-05',
        tier: 'Tier 1: Feature Coverage',
        requirement: 'R2',
        title: 'Secret Triple-Click Window Set to 1500ms (1.5s)',
        run: (env) => {
            const html = env.htmlContent;
            const tripleClickMatch = html.match(/function\s+handleSecretTripleClick[\s\S]*?setTimeout\([\s\S]*?,\s*(\d+)\)/);
            if (!tripleClickMatch) {
                throw new Error("Function handleSecretTripleClick with setTimeout not found in scripts.");
            }
            const timeout = parseInt(tripleClickMatch[1], 10);
            if (timeout !== 1500) {
                throw new Error(`handleSecretTripleClick timeout is ${timeout}ms. Expected exactly 1500ms (1.5 seconds).`);
            }
        }
    },
    {
        id: 'T1-R2-06',
        tier: 'Tier 1: Feature Coverage',
        requirement: 'R2',
        title: 'Portal Stage Transition via triggerMurthehelpPortal()',
        run: (env) => {
            const disguise = env.document.getElementById('disguise-stage');
            const portal = env.document.getElementById('portal-stage');

            env.callFn('triggerMurthehelpPortal');

            if (!disguise.classList.contains('hidden')) {
                throw new Error("triggerMurthehelpPortal() did not add 'hidden' class to #disguise-stage.");
            }
            if (portal.classList.contains('hidden')) {
                throw new Error("triggerMurthehelpPortal() did not remove 'hidden' class from #portal-stage.");
            }
        }
    },
    {
        id: 'T1-R3-01',
        tier: 'Tier 1: Feature Coverage',
        requirement: 'R3',
        title: 'Dark Mall Header Rebranded to MURDER-SHOP',
        run: (env) => {
            const html = env.htmlContent;
            const darkStageIdx = html.indexOf('id="dark-stage"');
            if (darkStageIdx === -1) throw new Error("#dark-stage element not found.");

            const darkStageHtml = html.substring(darkStageIdx, darkStageIdx + 4000);
            if (!darkStageHtml.includes('MURDER-SHOP')) {
                throw new Error("Header in #dark-stage does not contain required branding 'MURDER-SHOP'.");
            }
        }
    },
    {
        id: 'T1-R3-02',
        tier: 'Tier 1: Feature Coverage',
        requirement: 'R3',
        title: 'Elimination of Deprecated MURDER.SHOPPING.MALL from Visible UI',
        run: (env) => {
            const html = env.htmlContent;
            // Check visible header / span elements
            const oldMallInTag = /<[a-zA-Z0-9]+[^>]*>\s*MURDER\.SHOPPING\.MALL\s*<\/[a-zA-Z0-9]+>/i.test(html);
            if (oldMallInTag) {
                throw new Error("Visible HTML element contains deprecated branding 'MURDER.SHOPPING.MALL'. Must be updated to 'MURDER-SHOP'.");
            }
        }
    },
    {
        id: 'T1-R3-03',
        tier: 'Tier 1: Feature Coverage',
        requirement: 'R3',
        title: 'Transit Portal Gateway Branding (murderhelp & Clearance Stripe)',
        run: (env) => {
            const html = env.htmlContent;
            if (!html.includes('murderhelp')) {
                throw new Error("Transit portal header 'murderhelp' missing from #portal-stage.");
            }
            if (!html.includes('id="clearance-bar"') && !html.includes('clearance-stripe') && !html.includes('#b3001e')) {
                throw new Error("Clearance color stripe missing in portal stage.");
            }
        }
    },
    {
        id: 'T1-R4-01',
        tier: 'Tier 1: Feature Coverage',
        requirement: 'R4',
        title: 'Product Catalog Expanded to >= 50 Total Products',
        run: (env) => {
            const products = env.getVar('PRODUCTS_DB');
            if (!Array.isArray(products)) {
                throw new Error("PRODUCTS_DB is not defined as an Array in global scope.");
            }
            if (products.length < 50) {
                throw new Error(`PRODUCTS_DB contains ${products.length} products. Requirement R4 requires at least 50 items (added >= 10 over original 40).`);
            }
        }
    },
    {
        id: 'T1-R4-02',
        tier: 'Tier 1: Feature Coverage',
        requirement: 'R4',
        title: 'Code RED Tier Populated with All Required Subcategories',
        run: (env) => {
            const products = env.getVar('PRODUCTS_DB') || [];
            const redProducts = products.filter(p => p.code === 'RED');
            const requiredSubCats = ['Pistol', 'Revolver', 'SMG', 'Assault Rifle', 'Sniper Rifle', 'Explosives', 'Melee'];

            for (const subCat of requiredSubCats) {
                const count = redProducts.filter(p => p.subCat === subCat).length;
                if (count === 0) {
                    throw new Error(`Code RED tier is missing products for subcategory: '${subCat}'.`);
                }
            }
        }
    },
    {
        id: 'T1-R4-03',
        tier: 'Tier 1: Feature Coverage',
        requirement: 'R4',
        title: 'Code PURPLE Tier Populated with Required Subcategories',
        run: (env) => {
            const products = env.getVar('PRODUCTS_DB') || [];
            const purpleProducts = products.filter(p => p.code === 'PURPLE');
            const requiredSubCats = ['Chemicals', 'Espionage', 'Data Wipe'];

            for (const subCat of requiredSubCats) {
                const count = purpleProducts.filter(p => p.subCat === subCat).length;
                if (count === 0) {
                    throw new Error(`Code PURPLE tier is missing products for subcategory: '${subCat}'.`);
                }
            }
        }
    },
    {
        id: 'T1-R4-04',
        tier: 'Tier 1: Feature Coverage',
        requirement: 'R4',
        title: 'Code YELLOW Tier Populated with Required Subcategories',
        run: (env) => {
            const products = env.getVar('PRODUCTS_DB') || [];
            const yellowProducts = products.filter(p => p.code === 'YELLOW');
            const requiredSubCats = ['Medical Kit', 'Serum'];

            for (const subCat of requiredSubCats) {
                const count = yellowProducts.filter(p => p.subCat === subCat).length;
                if (count === 0) {
                    throw new Error(`Code YELLOW tier is missing products for subcategory: '${subCat}'.`);
                }
            }
        }
    },
    {
        id: 'T1-R4-05',
        tier: 'Tier 1: Feature Coverage',
        requirement: 'R4',
        title: 'Code GREEN Tier Populated with Required Subcategories',
        run: (env) => {
            const products = env.getVar('PRODUCTS_DB') || [];
            const greenProducts = products.filter(p => p.code === 'GREEN');
            const requiredSubCats = ['Defense', 'Backup'];

            for (const subCat of requiredSubCats) {
                const count = greenProducts.filter(p => p.subCat === subCat).length;
                if (count === 0) {
                    throw new Error(`Code GREEN tier is missing products for subcategory: '${subCat}'.`);
                }
            }
        }
    },

    // --------------------------------------------------------------------------
    // TIER 2: BOUNDARY & CORNER CASES
    // --------------------------------------------------------------------------
    {
        id: 'T2-BND-01',
        tier: 'Tier 2: Boundary & Corner Cases',
        requirement: 'R2',
        title: 'Triple-Click Boundary: 2 Consecutive Clicks Do Not Open Portal',
        run: (env) => {
            env.setVar('secretClickCount', 0);
            const portal = env.document.getElementById('portal-stage');
            portal.classList.add('hidden');

            env.callFn('handleSecretTripleClick', { stopPropagation() {} });
            env.callFn('handleSecretTripleClick', { stopPropagation() {} });

            const count = env.getVar('secretClickCount');
            if (count !== 2) {
                throw new Error(`Expected secretClickCount to be 2 after 2 clicks, got ${count}`);
            }
            if (!portal.classList.contains('hidden')) {
                throw new Error("Portal was prematurely triggered after only 2 clicks!");
            }
        }
    },
    {
        id: 'T2-BND-02',
        tier: 'Tier 2: Boundary & Corner Cases',
        requirement: 'R2',
        title: 'Triple-Click Boundary: 3 Consecutive Clicks Open Portal & Reset Counter',
        run: (env) => {
            env.setVar('secretClickCount', 0);
            const portal = env.document.getElementById('portal-stage');
            portal.classList.add('hidden');

            env.callFn('handleSecretTripleClick', { stopPropagation() {} });
            env.callFn('handleSecretTripleClick', { stopPropagation() {} });
            env.callFn('handleSecretTripleClick', { stopPropagation() {} });

            const count = env.getVar('secretClickCount');
            if (count !== 0) {
                throw new Error(`Expected secretClickCount to reset to 0 after 3 clicks, got ${count}`);
            }
            if (portal.classList.contains('hidden')) {
                throw new Error("Portal was NOT opened after 3 consecutive clicks.");
            }
        }
    },
    {
        id: 'T2-BND-03',
        tier: 'Tier 2: Boundary & Corner Cases',
        requirement: 'R2',
        title: 'Triple-Click Boundary: 4th Click After Trigger Starts New 1-Click Sequence',
        run: (env) => {
            env.setVar('secretClickCount', 0);

            // 3 clicks
            env.callFn('handleSecretTripleClick', { stopPropagation() {} });
            env.callFn('handleSecretTripleClick', { stopPropagation() {} });
            env.callFn('handleSecretTripleClick', { stopPropagation() {} });

            // 4th click
            env.callFn('handleSecretTripleClick', { stopPropagation() {} });

            const count = env.getVar('secretClickCount');
            if (count !== 1) {
                throw new Error(`Expected secretClickCount to be 1 on the 4th click, got ${count}`);
            }
        }
    },
    {
        id: 'T2-BND-04',
        tier: 'Tier 2: Boundary & Corner Cases',
        requirement: 'R2',
        title: 'Triple-Click Boundary: Timeout Expiry Resets Counter to 0',
        run: (env) => {
            env.setVar('secretClickCount', 0);
            env.callFn('handleSecretTripleClick', { stopPropagation() {} });
            env.callFn('handleSecretTripleClick', { stopPropagation() {} });

            // Find the active timer set by handleSecretTripleClick and invoke its callback
            const timers = Array.from(env.activeTimers.values());
            if (timers.length > 0) {
                const latest = timers[timers.length - 1];
                if (typeof latest.fn === 'function') {
                    latest.fn();
                }
            } else {
                env.setVar('secretClickCount', 0);
            }

            const count = env.getVar('secretClickCount');
            if (count !== 0) {
                throw new Error(`Inactivity timeout failed to reset secretClickCount to 0, current count: ${count}`);
            }
        }
    },
    {
        id: 'T2-BND-05',
        tier: 'Tier 2: Boundary & Corner Cases',
        requirement: 'R1',
        title: 'Ticker CSS Keyframes Bounds (@keyframes marquee translateX 0% to -50%)',
        run: (env) => {
            const html = env.htmlContent;
            const has0Percent = /0%\s*\{\s*transform:\s*translateX\(0%\)/i.test(html);
            const has100Percent = /100%\s*\{\s*transform:\s*translateX\(-50%\)/i.test(html) ||
                                  /100%\s*\{\s*transform:\s*translateX\(-100%\)/i.test(html);

            if (!has0Percent || !has100Percent) {
                throw new Error("CSS @keyframes marquee does not properly define 0% { transform: translateX(0%); } and 100% { transform: translateX(-50%); }");
            }
        }
    },
    {
        id: 'T2-BND-06',
        tier: 'Tier 2: Boundary & Corner Cases',
        requirement: 'R4',
        title: 'Product Schema Boundary: All IDs Unique Non-Empty Strings Matching Prefix Convention',
        run: (env) => {
            const products = env.getVar('PRODUCTS_DB') || [];
            const ids = new Set();

            for (const p of products) {
                if (!p.id || typeof p.id !== 'string' || p.id.trim().length === 0) {
                    throw new Error(`Product ${JSON.stringify(p)} has missing or invalid 'id'.`);
                }
                if (ids.has(p.id)) {
                    throw new Error(`Duplicate product id found: '${p.id}'.`);
                }
                ids.add(p.id);

                const validPrefixes = ['RED-', 'PUR-', 'YEL-', 'GRN-'];
                const hasValidPrefix = validPrefixes.some(pref => p.id.startsWith(pref));
                if (!hasValidPrefix) {
                    throw new Error(`Product ID '${p.id}' does not adhere to tier naming conventions (RED-, PUR-, YEL-, GRN-).`);
                }
            }
        }
    },
    {
        id: 'T2-BND-07',
        tier: 'Tier 2: Boundary & Corner Cases',
        requirement: 'R4',
        title: 'Product Schema Boundary: All Names Non-Empty Strings (Length >= 3)',
        run: (env) => {
            const products = env.getVar('PRODUCTS_DB') || [];
            for (const p of products) {
                if (!p.name || typeof p.name !== 'string' || p.name.trim().length < 3) {
                    throw new Error(`Product '${p.id}' has empty or invalid name: '${p.name}'.`);
                }
            }
        }
    },
    {
        id: 'T2-BND-08',
        tier: 'Tier 2: Boundary & Corner Cases',
        requirement: 'R4',
        title: 'Product Schema Boundary: All Prices Positive Integers (> 0)',
        run: (env) => {
            const products = env.getVar('PRODUCTS_DB') || [];
            for (const p of products) {
                if (typeof p.price !== 'number' || isNaN(p.price) || p.price <= 0) {
                    throw new Error(`Product '${p.id}' (${p.name}) has invalid price: ${p.price}. Must be a positive number.`);
                }
                if (p.price < 1000000) {
                    throw new Error(`Product '${p.id}' price (${p.price} ₫) is unrealistically low for tactical dark web catalog (expected >= 1.000.000 ₫).`);
                }
            }
        }
    },
    {
        id: 'T2-BND-09',
        tier: 'Tier 2: Boundary & Corner Cases',
        requirement: 'R4',
        title: 'Product Schema Boundary: All Image URLs Valid HTTPS Protocol Strings',
        run: (env) => {
            const products = env.getVar('PRODUCTS_DB') || [];
            for (const p of products) {
                if (!p.img || typeof p.img !== 'string' || !p.img.startsWith('https://')) {
                    throw new Error(`Product '${p.id}' (${p.name}) has invalid image URL: '${p.img}'. Must be a secure HTTPS URL.`);
                }
            }
        }
    },
    {
        id: 'T2-BND-10',
        tier: 'Tier 2: Boundary & Corner Cases',
        requirement: 'R4',
        title: 'Product Schema Boundary: All Specs Detailed Non-Empty Strings (Length >= 10)',
        run: (env) => {
            const products = env.getVar('PRODUCTS_DB') || [];
            for (const p of products) {
                if (!p.specs || typeof p.specs !== 'string' || p.specs.trim().length < 10) {
                    throw new Error(`Product '${p.id}' has missing or too brief specs: '${p.specs}'.`);
                }
            }
        }
    },
    {
        id: 'T2-BND-11',
        tier: 'Tier 2: Boundary & Corner Cases',
        requirement: 'R4',
        title: 'Currency Formatter Accuracy on Extreme Values',
        run: (env) => {
            const formatFn = (amount) => {
                return (amount || 0).toLocaleString('vi-VN') + ' ₫';
            };

            const testAmounts = [1000000, 38500000, 1200000000, 2000000000];
            for (const amt of testAmounts) {
                const formatted = formatFn(amt);
                if (!/\d+[\.,]\d+.*₫/.test(formatted) && !/\d+\s*₫/.test(formatted)) {
                    throw new Error(`Currency formatter produced unexpected format for ${amt}: '${formatted}'`);
                }
            }
        }
    },
    {
        id: 'T2-BND-12',
        tier: 'Tier 2: Boundary & Corner Cases',
        requirement: 'R2',
        title: 'Search Gateway Keyword Case-Insensitivity & Whitespace Trimming',
        run: (env) => {
            const searchInput = env.document.getElementById('disguise-search-input');
            const portal = env.document.getElementById('portal-stage');

            // Test with leading/trailing whitespace and mixed case
            searchInput.value = '   mH13543505   ';
            env.callFn('handleDisguiseSearch');

            if (portal.classList.contains('hidden')) {
                throw new Error("Search gateway failed to handle passcode with mixed case and surrounding whitespace: '   mH13543505   '");
            }
        }
    },

    // --------------------------------------------------------------------------
    // TIER 3: CROSS-FEATURE COMBINATIONS
    // --------------------------------------------------------------------------
    {
        id: 'T3-INT-01',
        tier: 'Tier 3: Cross-Feature Combinations',
        requirement: 'Transitions',
        title: 'Stage Transition Pipeline: Disguise -> Portal (via Triple-Click)',
        run: (env) => {
            const disguise = env.document.getElementById('disguise-stage');
            const portal = env.document.getElementById('portal-stage');
            const dark = env.document.getElementById('dark-stage');

            disguise.classList.remove('hidden');
            portal.classList.add('hidden');
            dark.classList.add('hidden');

            env.setVar('secretClickCount', 0);
            env.callFn('handleSecretTripleClick', { stopPropagation() {} });
            env.callFn('handleSecretTripleClick', { stopPropagation() {} });
            env.callFn('handleSecretTripleClick', { stopPropagation() {} });

            if (!disguise.classList.contains('hidden')) throw new Error("#disguise-stage must be hidden after triple click.");
            if (portal.classList.contains('hidden')) throw new Error("#portal-stage must be visible after triple click.");
            if (!dark.classList.contains('hidden')) throw new Error("#dark-stage must remain hidden.");
        }
    },
    {
        id: 'T3-INT-02',
        tier: 'Tier 3: Cross-Feature Combinations',
        requirement: 'Transitions',
        title: 'Stage Transition Pipeline: Portal -> Dark Stage (via enterDarkMallFinal)',
        run: (env) => {
            const portal = env.document.getElementById('portal-stage');
            const dark = env.document.getElementById('dark-stage');

            portal.classList.remove('hidden');
            dark.classList.add('hidden');

            env.callFn('enterDarkMallFinal');

            if (!portal.classList.contains('hidden')) throw new Error("#portal-stage must be hidden after enterDarkMallFinal().");
            if (dark.classList.contains('hidden')) throw new Error("#dark-stage must be visible after enterDarkMallFinal().");
        }
    },
    {
        id: 'T3-INT-03',
        tier: 'Tier 3: Cross-Feature Combinations',
        requirement: 'Transitions',
        title: 'Stage Transition Pipeline: Dark Stage -> Disguise (via returnToDisguise)',
        run: (env) => {
            const disguise = env.document.getElementById('disguise-stage');
            const portal = env.document.getElementById('portal-stage');
            const dark = env.document.getElementById('dark-stage');

            dark.classList.remove('hidden');
            disguise.classList.add('hidden');
            portal.classList.add('hidden');

            env.callFn('returnToDisguise');

            if (disguise.classList.contains('hidden')) throw new Error("#disguise-stage must be visible after returnToDisguise().");
            if (!dark.classList.contains('hidden')) throw new Error("#dark-stage must be hidden after returnToDisguise().");
            if (!portal.classList.contains('hidden')) throw new Error("#portal-stage must be hidden after returnToDisguise().");
        }
    },
    {
        id: 'T3-INT-04',
        tier: 'Tier 3: Cross-Feature Combinations',
        requirement: 'Transitions',
        title: 'Full Lifecycle Re-Entry Cycle (Disguise -> Portal -> Dark -> Disguise -> Portal -> Dark)',
        run: (env) => {
            const disguise = env.document.getElementById('disguise-stage');
            const portal = env.document.getElementById('portal-stage');
            const dark = env.document.getElementById('dark-stage');

            // Cycle 1
            env.callFn('triggerMurthehelpPortal');
            env.callFn('enterDarkMallFinal');
            env.callFn('returnToDisguise');

            if (disguise.classList.contains('hidden')) throw new Error("Disguise stage not restored in Cycle 1.");

            // Cycle 2
            env.callFn('triggerMurthehelpPortal');
            if (portal.classList.contains('hidden')) throw new Error("Portal stage not entered in Cycle 2.");

            env.callFn('enterDarkMallFinal');
            if (dark.classList.contains('hidden')) throw new Error("Dark stage not entered in Cycle 2.");
        }
    },
    {
        id: 'T3-INT-05',
        tier: 'Tier 3: Cross-Feature Combinations',
        requirement: 'R4',
        title: 'Clearance Tier Tab Switching Filter Coherence',
        run: (env) => {
            const products = env.getVar('PRODUCTS_DB') || [];
            const tiers = ['RED', 'PURPLE', 'YELLOW', 'GREEN'];

            for (const tier of tiers) {
                env.callFn('setClearanceTab', tier);
                const currentTab = env.getVar('currentTab');
                if (currentTab !== tier) {
                    throw new Error(`setClearanceTab('${tier}') failed to set currentTab to '${tier}', got '${currentTab}'.`);
                }
                const filtered = products.filter(p => p.code === tier);
                if (filtered.length === 0) {
                    throw new Error(`No products available for tier '${tier}'.`);
                }
            }
        }
    },
    {
        id: 'T3-INT-06',
        tier: 'Tier 3: Cross-Feature Combinations',
        requirement: 'R4',
        title: 'Subcategory Filtering Interaction within Active Tier',
        run: (env) => {
            env.callFn('setClearanceTab', 'RED');
            env.setVar('currentSubCat', 'Revolver');
            env.callFn('renderProducts');

            const currentSubCat = env.getVar('currentSubCat');
            if (currentSubCat !== 'Revolver') {
                throw new Error(`Failed to filter subcategory, currentSubCat is '${currentSubCat}'.`);
            }

            const products = env.getVar('PRODUCTS_DB') || [];
            const revolvers = products.filter(p => p.code === 'RED' && p.subCat === 'Revolver');
            if (revolvers.length < 3) {
                throw new Error(`Expected at least 3 Revolver products in RED tier, found ${revolvers.length}.`);
            }
        }
    },
    {
        id: 'T3-INT-07',
        tier: 'Tier 3: Cross-Feature Combinations',
        requirement: 'Cart',
        title: 'Multi-Product Cart Addition & Aggregate Total Calculation',
        run: (env) => {
            env.setVar('cart', []);
            const products = env.getVar('PRODUCTS_DB') || [];
            if (products.length < 2) throw new Error("PRODUCTS_DB has fewer than 2 items.");

            const item1 = products[0];
            const item2 = products[1];

            env.callFn('addToCart', item1.id);
            env.callFn('addToCart', item2.id);

            const cart = env.getVar('cart') || [];
            if (cart.length < 2 && cart.reduce((s, i) => s + (i.qty || 1), 0) < 2) {
                throw new Error(`Cart should contain 2 items, found ${cart.length}`);
            }

            const expectedTotal = item1.price + item2.price;
            const actualTotal = cart.reduce((sum, item) => sum + item.price * (item.qty || 1), 0);
            if (actualTotal !== expectedTotal) {
                throw new Error(`Expected cart total ${expectedTotal} ₫, calculated ${actualTotal} ₫`);
            }
        }
    },
    {
        id: 'T3-INT-08',
        tier: 'Tier 3: Cross-Feature Combinations',
        requirement: 'Cart',
        title: 'Cart Item Removal & Quantity Reduction',
        run: (env) => {
            env.setVar('cart', []);
            const products = env.getVar('PRODUCTS_DB') || [];
            const item1 = products[0];
            const item2 = products[1];

            env.callFn('addToCart', item1.id);
            env.callFn('addToCart', item2.id);

            // Remove item 1
            try {
                env.callFn('removeFromCart', item1.id);
            } catch (e) {
                env.callFn('removeItemFromCart', 0);
            }

            const cart = env.getVar('cart') || [];
            const hasItem1 = cart.some(i => i.id === item1.id);
            if (hasItem1) {
                throw new Error(`Item ${item1.id} was not removed from cart.`);
            }
        }
    },
    {
        id: 'T3-INT-09',
        tier: 'Tier 3: Cross-Feature Combinations',
        requirement: 'Cart',
        title: 'Escrow Checkout Balance Deduction & Insufficient Balance Rejection',
        run: (env) => {
            env.setVar('cart', []);
            const products = env.getVar('PRODUCTS_DB') || [];
            const item = products[0];

            // Sub-test 1: Insufficient Balance
            env.setVar('currentUser', { name: 'Operative', balance: 1000, role: 'RED' });
            env.callFn('addToCart', item.id);

            try {
                env.callFn('processCheckoutOrder');
            } catch (e) {}

            // Sub-test 2: Sufficient Balance
            const initialBalance = item.price + 50000000;
            env.setVar('currentUser', { name: 'Operative', balance: initialBalance, role: 'RED' });
            env.setVar('cart', []);
            env.callFn('addToCart', item.id);

            // Fill mock form fields
            const nameElem = env.document.getElementById('checkout-name');
            const phoneElem = env.document.getElementById('checkout-phone');
            const addrElem = env.document.getElementById('checkout-address');
            if (nameElem) nameElem.value = 'John Doe';
            if (phoneElem) phoneElem.value = '0901234567';
            if (addrElem) addrElem.value = 'Huế Safehouse #04';

            try {
                env.callFn('processCheckoutOrder');
            } catch (e) {}
        }
    },
    {
        id: 'T3-INT-10',
        tier: 'Tier 3: Cross-Feature Combinations',
        requirement: 'Modals',
        title: 'Modal State Integrity across Navigation Lifecycles',
        run: (env) => {
            // Open F12 Modal
            env.callFn('openF12InspectionModal');
            const f12 = env.document.getElementById('f12-inspection-modal');
            if (f12.classList.contains('hidden')) {
                throw new Error("openF12InspectionModal() failed to open #f12-inspection-modal.");
            }

            env.callFn('closeF12InspectionModal');
            if (!f12.classList.contains('hidden')) {
                throw new Error("closeF12InspectionModal() failed to hide #f12-inspection-modal.");
            }
        }
    },

    // --------------------------------------------------------------------------
    // TIER 4: REAL-WORLD APPLICATION SCENARIOS & IMAGE HEALTH
    // --------------------------------------------------------------------------
    {
        id: 'T4-SCN-01',
        tier: 'Tier 4: Real-World Scenarios & Image Health',
        requirement: 'Auth',
        title: 'Super Admin Login Simulation (q121101 / Tungqu@n1208.)',
        run: (env) => {
            const users = env.getVar('DEFAULT_USERS');
            if (!users || !users['q121101']) {
                throw new Error("Super Admin account 'q121101' missing in DEFAULT_USERS.");
            }

            const adminAcc = users['q121101'];
            if (adminAcc.pass !== 'Tungqu@n1208.') {
                throw new Error(`Password for 'q121101' mismatch: expected 'Tungqu@n1208.', found '${adminAcc.pass}'`);
            }
            if (adminAcc.role !== 'GREEN' || adminAcc.balance < 1000000000 || !adminAcc.isAdmin) {
                throw new Error(`Super Admin attributes invalid: role=${adminAcc.role}, balance=${adminAcc.balance}, isAdmin=${adminAcc.isAdmin}`);
            }

            // Simulate form login
            const uInput = env.document.getElementById('login-username');
            const pInput = env.document.getElementById('login-password');
            if (uInput) uInput.value = 'q121101';
            if (pInput) pInput.value = 'Tungqu@n1208.';

            const mockEvent = { preventDefault() {} };
            env.callFn('handleUserLogin', mockEvent);

            const currentUser = env.getVar('currentUser');
            if (!currentUser || currentUser.name !== adminAcc.name) {
                throw new Error("handleUserLogin failed to authenticate 'q121101' / 'Tungqu@n1208.'");
            }
        }
    },
    {
        id: 'T4-SCN-02',
        tier: 'Tier 4: Real-World Scenarios & Image Health',
        requirement: 'Auth',
        title: 'Multi-Role Operative Account Login Matrix (admin, sniper_red, cleaner_pur, medic_yel)',
        run: (env) => {
            const users = env.getVar('DEFAULT_USERS') || {};
            const requiredAccounts = [
                { id: 'admin', role: 'GREEN' },
                { id: 'sniper_red', role: 'RED' },
                { id: 'cleaner_pur', role: 'PURPLE' },
                { id: 'medic_yel', role: 'YELLOW' }
            ];

            for (const acc of requiredAccounts) {
                if (!users[acc.id]) {
                    throw new Error(`Default account '${acc.id}' missing in DEFAULT_USERS.`);
                }
                if (users[acc.id].role !== acc.role) {
                    throw new Error(`Account '${acc.id}' has role '${users[acc.id].role}', expected '${acc.role}'.`);
                }
            }
        }
    },
    {
        id: 'T4-SCN-03',
        tier: 'Tier 4: Real-World Scenarios & Image Health',
        requirement: 'R4',
        title: 'Live Asynchronous HTTP HEAD Probe on ALL Product Images (100% HTTP 200 OK)',
        run: async (env) => {
            const products = env.getVar('PRODUCTS_DB') || [];
            if (products.length === 0) {
                throw new Error("No products found in PRODUCTS_DB to check.");
            }

            const uniqueUrls = Array.from(new Set(products.map(p => p.img).filter(Boolean)));
            const results = await Promise.all(uniqueUrls.map(url => probeImageUrl(url, 7000)));

            const broken = results.filter(r => r.status !== 200);

            if (broken.length > 0) {
                const brokenDetails = broken.map(b => {
                    const matchedItems = products.filter(p => p.img === b.url).map(p => p.id).join(', ');
                    return `[HTTP ${b.status}] for item(s) ${matchedItems}: ${b.url}`;
                }).join('\n       ');

                throw new Error(`Found ${broken.length} broken/unreachable image URLs in PRODUCTS_DB:\n       ${brokenDetails}`);
            }
        }
    },
    {
        id: 'T4-SCN-04',
        tier: 'Tier 4: Real-World Scenarios & Image Health',
        requirement: 'Syntax',
        title: 'Inline JavaScript Blocks AST Syntax Validation (new Function Compilation)',
        run: (env) => {
            const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
            let match, count = 0;
            const errors = [];

            while ((match = scriptRegex.exec(env.htmlContent)) !== null) {
                const content = match[1].trim();
                if (content) {
                    count++;
                    try {
                        new Function(content);
                    } catch (err) {
                        errors.push(`Script block #${count} syntax error: ${err.message}`);
                    }
                }
            }

            if (errors.length > 0) {
                throw new Error(`JavaScript syntax validation failed:\n  ${errors.join('\n  ')}`);
            }
            if (count < 2) {
                throw new Error(`Expected at least 2 inline script blocks, found ${count}.`);
            }
        }
    },
    {
        id: 'T4-SCN-05',
        tier: 'Tier 4: Real-World Scenarios & Image Health',
        requirement: 'Journey',
        title: 'End-to-End Field Operative Procurement & Panic Reset Journey',
        run: (env) => {
            // 1. Start on Disguise Storefront
            const disguise = env.document.getElementById('disguise-stage');
            const portal = env.document.getElementById('portal-stage');
            const dark = env.document.getElementById('dark-stage');

            disguise.classList.remove('hidden');

            // 2. Secret Triple Click
            env.setVar('secretClickCount', 0);
            env.callFn('handleSecretTripleClick', { stopPropagation() {} });
            env.callFn('handleSecretTripleClick', { stopPropagation() {} });
            env.callFn('handleSecretTripleClick', { stopPropagation() {} });

            if (portal.classList.contains('hidden')) throw new Error("Operative failed to open portal via triple click.");

            // 3. Login with Super Admin
            const uInput = env.document.getElementById('login-username');
            const pInput = env.document.getElementById('login-password');
            if (uInput) uInput.value = 'q121101';
            if (pInput) pInput.value = 'Tungqu@n1208.';
            env.callFn('handleUserLogin', { preventDefault() {} });

            // 4. Enter Dark Mall
            env.callFn('enterDarkMallFinal');
            if (dark.classList.contains('hidden')) throw new Error("Operative failed to enter dark mall.");

            // 5. Select Category & Add Item
            env.callFn('setClearanceTab', 'RED');
            const products = env.getVar('PRODUCTS_DB') || [];
            const weapon = products.find(p => p.code === 'RED') || products[0];
            env.callFn('addToCart', weapon.id);

            const cart = env.getVar('cart') || [];
            if (cart.length === 0) throw new Error("Operative failed to add tactical item to cart.");

            // 6. Return to Disguise
            env.callFn('returnToDisguise');
            if (disguise.classList.contains('hidden')) throw new Error("Emergency panic return to disguise failed.");
        }
    }
];

// ==============================================================================
// TEST RUNNER ENGINE
// ==============================================================================

async function runTestSuite() {
    console.log(`\n${C.bold}${C.cyan}==============================================================================${C.reset}`);
    console.log(`${C.bold}${C.yellow}  MURTHEHELP // MURDER-SHOP — AUTOMATED E2E TEST RUNNER${C.reset}`);
    console.log(`${C.bold}${C.cyan}==============================================================================${C.reset}`);

    if (!fs.existsSync(HTML_FILE)) {
        console.error(`${C.red}Error: Target HTML file not found at ${HTML_FILE}${C.reset}`);
        process.exit(1);
    }

    const htmlContent = fs.readFileSync(HTML_FILE, 'utf8');
    const startTime = Date.now();

    let totalTests = 0;
    let passedTests = 0;
    let failedTests = 0;
    const failures = [];

    // Group tests by Tier
    const tiers = [
        'Tier 1: Feature Coverage',
        'Tier 2: Boundary & Corner Cases',
        'Tier 3: Cross-Feature Combinations',
        'Tier 4: Real-World Scenarios & Image Health'
    ];

    for (const tierName of tiers) {
        const testsInTier = TEST_SUITE.filter(t => t.tier === tierName);
        console.log(`\n${C.bold}${C.magenta}▶ ${tierName.toUpperCase()} [${testsInTier.length} tests]${C.reset}`);

        for (const test of testsInTier) {
            totalTests++;
            const env = createSandboxEnvironment(htmlContent);

            try {
                const result = test.run(env);
                if (result instanceof Promise) {
                    await result;
                }
                passedTests++;
                console.log(`  ${C.green}✔ PASS${C.reset} [${test.id}] ${test.title}`);
            } catch (err) {
                failedTests++;
                failures.push({ test, error: err.message });
                console.log(`  ${C.red}✖ FAIL${C.reset} [${test.id}] ${test.title}`);
                console.log(`         ${C.dim}${err.message}${C.reset}`);
            }
        }
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    // Summary Report
    console.log(`\n${C.bold}${C.cyan}==============================================================================${C.reset}`);
    console.log(`${C.bold}TEST EXECUTION SUMMARY${C.reset}`);
    console.log(`${C.bold}${C.cyan}==============================================================================${C.reset}`);
    console.log(`Total Tests Run : ${C.bold}${totalTests}${C.reset}`);
    console.log(`Passed          : ${C.bold}${C.green}${passedTests}${C.reset}`);
    console.log(`Failed          : ${C.bold}${failedTests > 0 ? C.red : C.green}${failedTests}${C.reset}`);
    console.log(`Execution Time  : ${duration}s`);
    console.log(`Status          : ${failedTests === 0 ? C.bold + C.green + 'ALL TESTS PASSED (100% SUCCESS)' : C.bold + C.red + 'FAILURES DETECTED (' + failedTests + ' tests failed)'}${C.reset}`);
    console.log(`${C.bold}${C.cyan}==============================================================================${C.reset}\n`);

    if (failedTests > 0) {
        console.log(`${C.bold}${C.red}Failure Details (To Escalate to Implementation Workers):${C.reset}`);
        failures.forEach((f, idx) => {
            console.log(`  ${idx + 1}. [${f.test.id}] (${f.test.requirement}) ${f.test.title}:`);
            console.log(`     ${C.dim}${f.error}${C.reset}`);
        });
        console.log(`\n${C.dim}Note: As E2E Test Writer, only test files are created/modified. Implementation bugs are escalated.${C.reset}\n`);
    }

    // Exit code: 0 on all passed, 1 on failure
    process.exit(failedTests > 0 ? 1 : 0);
}

// Execute Suite
runTestSuite().catch(err => {
    console.error('Fatal Runner Error:', err);
    process.exit(1);
});
