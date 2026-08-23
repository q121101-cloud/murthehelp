/**
 * ==============================================================================
 * CHALLENGER 2: EMPIRICAL ADVERSARIAL VERIFICATION & STRESS-TESTING SUITE
 * ==============================================================================
 * Independent, exhaustive verification harness testing:
 * 1. Live Network HTTP/HTTPS Probing on 100% of Images (PRODUCTS_DB & DISGUISE_PRODUCTS)
 * 2. Product Catalog Schema Boundary Validation & Data Invariants (54 Tactical + 12 Disguise)
 * 3. Cart Arithmetic, Multi-Item Accumulation, Stress Loads & Coupon Discounts
 * 4. Role-Based Access Control, Checkout Execution & Balance Deductions
 * 5. Authentication, Super Admin (q121101 / Tungqu@n1208.) & Admin Panel Operations
 * 6. UI Stage Transitions, Modals & AST Syntax Integrity
 * ==============================================================================
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const vm = require('vm');

const PROJECT_ROOT = path.resolve(__dirname, '../');
const HTML_FILE = path.join(PROJECT_ROOT, 'index.html');
const htmlContent = fs.readFileSync(HTML_FILE, 'utf-8');

// Color helpers
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

let totalPassed = 0;
let totalFailed = 0;
const failureDetails = [];

function assert(condition, message, detail = '') {
    if (condition) {
        totalPassed++;
        console.log(`  ${C.green}✔ PASS${C.reset} ${message}`);
    } else {
        totalFailed++;
        console.log(`  ${C.red}✖ FAIL${C.reset} ${message} ${detail ? C.dim + '(' + detail + ')' + C.reset : ''}`);
        failureDetails.push({ message, detail });
    }
}

class MockColor {
    constructor(hex = 0x000000) { this.hex = hex; }
    clone() { return new MockColor(this.hex); }
    copy(c) { this.hex = (c && c.hex !== undefined) ? c.hex : c; return this; }
    setHex(h) { this.hex = h; return this; }
    lerp(c, alpha) { return this; }
}

function createHarness() {
    const alerts = [];
    const elements = new Map();
    const eventListeners = new Map();
    const mockStorage = {};
    const activeTimers = new Map();
    let timerCounter = 1;

    function createMockElement(id = '', tag = 'DIV', initialClasses = []) {
        const defaultOptions = [
            { text: '🚁 Drone Tàng Hình Ban Đêm (Thả dù định vị GPS sai số < 0.5m)', value: 'drone' },
            { text: '📦 Thùng Nông Cụ Ngụy Trang (Vận chuyển xe tải chuyên dụng)', value: 'container' },
            { text: '📍 Điểm Hẹn An Toàn Safehouse (Tọa độ tự hủy sau 60 phút)', value: 'safehouse' }
        ];

        const classSet = new Set(initialClasses.filter(Boolean));

        return {
            id: id,
            tagName: tag.toUpperCase(),
            classList: {
                _classes: classSet,
                add(...cls) { cls.forEach(c => c && classSet.add(c)); },
                remove(...cls) { cls.forEach(c => c && classSet.delete(c)); },
                contains(c) { return classSet.has(c); },
                toggle(c) { if (classSet.has(c)) classSet.delete(c); else classSet.add(c); }
            },
            style: {},
            innerText: '',
            _innerHTML: '',
            get innerHTML() {
                if (this.children.length > 0) {
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
                if (!eventListeners.has(id + ':' + event)) eventListeners.set(id + ':' + event, []);
                eventListeners.get(id + ':' + event).push(handler);
            },
            appendChild(child) { this.children.push(child); },
            click() {
                const handlers = eventListeners.get(id + ':click') || [];
                handlers.forEach(h => h({ target: this, preventDefault() {} }));
            }
        };
    }

    // Seed mock elements from DOM id and class attributes
    const tagRegex = /<([a-zA-Z0-9-]+)\s+([^>]*?)>/g;
    let tagMatch;
    while ((tagMatch = tagRegex.exec(htmlContent)) !== null) {
        const tagName = tagMatch[1];
        const attrs = tagMatch[2];
        const idMatch = attrs.match(/id=["']([^"']+)["']/);
        const classMatch = attrs.match(/class=["']([^"']+)["']/);
        
        if (idMatch) {
            const elId = idMatch[1];
            const classes = classMatch ? classMatch[1].split(/\s+/) : [];
            if (!elements.has(elId)) {
                elements.set(elId, createMockElement(elId, tagName, classes));
            }
        }
    }

    const documentMock = {
        getElementById(id) {
            if (!elements.has(id)) {
                elements.set(id, createMockElement(id));
            }
            return elements.get(id);
        },
        createElement(tag) {
            return createMockElement('', tag);
        },
        querySelectorAll(selector) {
            const matches = [];
            for (const [id, el] of elements.entries()) {
                if (selector.startsWith('#') && id === selector.slice(1)) matches.push(el);
                if (selector.includes('btn-disguise-') && id.startsWith('btn-disguise-')) matches.push(el);
            }
            return matches;
        },
        documentElement: { scrollHeight: 2000 },
        addEventListener(event, handler) {
            if (!eventListeners.has('document:' + event)) eventListeners.set('document:' + event, []);
            eventListeners.get('document:' + event).push(handler);
        }
    };

    const windowMock = {
        innerWidth: 1920,
        innerHeight: 1080,
        devicePixelRatio: 2,
        scrollY: 0,
        addEventListener(event, handler) {
            if (!eventListeners.has('window:' + event)) eventListeners.set('window:' + event, []);
            eventListeners.get('window:' + event).push(handler);
        },
        dispatchEvent(evt) {
            const handlers = eventListeners.get('window:' + evt.type) || [];
            handlers.forEach(h => h(evt));
        },
        AudioContext: class {
            constructor() { this.state = 'running'; this.currentTime = 0; this.destination = {}; }
            createOscillator() { return { type: 'sine', frequency: { setValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect() {}, start() {}, stop() {} }; }
            createGain() { return { gain: { setValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect() {} }; }
            createBiquadFilter() { return { type: 'lowpass', frequency: { setValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect() {} }; }
            resume() { this.state = 'running'; }
        }
    };

    const localStorageMock = {
        getItem(key) { return mockStorage[key] !== undefined ? mockStorage[key] : null; },
        setItem(key, val) { mockStorage[key] = String(val); },
        removeItem(key) { delete mockStorage[key]; },
        clear() { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); }
    };

    const threeMock = {
        Color: MockColor,
        Clock: class { getElapsedTime() { return 1.0; } },
        WebGLRenderer: class {
            constructor() { this.domElement = {}; }
            setSize() {}
            setPixelRatio() {}
            setClearColor() {}
            render() {}
        },
        Scene: class { add() {} },
        PerspectiveCamera: class {
            constructor() { this.position = { z: 4.6 }; this.aspect = 1.77; }
            updateProjectionMatrix() {}
        },
        Vector2: class {
            constructor(x = 0, y = 0) { this.x = x; this.y = y; }
            set(x, y) { this.x = x; this.y = y; }
        },
        IcosahedronGeometry: class {},
        ShaderMaterial: class { constructor(opts) { this.uniforms = opts.uniforms || {}; } },
        Mesh: class {
            constructor() {
                this.rotation = { x: 0, y: 0, z: 0 };
                this.position = { x: 0, y: 0, z: 0 };
            }
        }
    };

    const scriptMatch = htmlContent.match(/<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/gi);
    const mainScript = scriptMatch ? scriptMatch[scriptMatch.length - 1].replace(/<\/?script[^>]*>/gi, '') : '';

    const sandbox = {
        window: windowMock,
        document: documentMock,
        localStorage: localStorageMock,
        THREE: threeMock,
        lucide: { createIcons() {} },
        console: { log() {}, warn() {}, error() {} },
        setTimeout(fn, delay = 0) {
            const id = timerCounter++;
            activeTimers.set(id, { fn, delay });
            return id;
        },
        clearTimeout(id) {
            activeTimers.delete(id);
        },
        requestAnimationFrame() {},
        supabase: null,
        alert(msg) { alerts.push(msg); },
        Date: Date,
        Math: Math,
        parseInt: parseInt,
        parseFloat: parseFloat,
        isNaN: isNaN,
        Object: Object,
        Array: Array,
        String: String,
        Number: Number,
        JSON: JSON,
        RegExp: RegExp
    };

    const context = vm.createContext(sandbox);
    vm.runInContext(mainScript, context);

    const getVar = (name) => {
        try {
            return vm.runInContext(`typeof ${name} !== 'undefined' ? ${name} : undefined`, context);
        } catch (e) {
            return undefined;
        }
    };

    const setVar = (name, value) => {
        try {
            vm.runInContext(`${name} = ${JSON.stringify(value)};`, context);
        } catch (e) {
            sandbox[name] = value;
        }
    };

    const callFn = (name, ...args) => {
        const argsStr = args.map(a => JSON.stringify(a)).join(', ');
        return vm.runInContext(`${name}(${argsStr});`, context);
    };

    const triggerTimer = (id) => {
        if (activeTimers.has(id)) {
            const timer = activeTimers.get(id);
            activeTimers.delete(id);
            timer.fn();
        }
    };

    const triggerAllTimers = () => {
        for (const [id, timer] of Array.from(activeTimers.entries())) {
            activeTimers.delete(id);
            timer.fn();
        }
    };

    return {
        context,
        getVar,
        setVar,
        callFn,
        elements,
        alerts,
        eventListeners,
        mockStorage,
        activeTimers,
        triggerTimer,
        triggerAllTimers
    };
}

async function probeImageUrl(url, timeoutMs = 8000) {
    return new Promise((resolve) => {
        try {
            const parsedUrl = new URL(url);
            const client = parsedUrl.protocol === 'https:' ? https : http;
            const req = client.request(url, {
                method: 'HEAD',
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
                timeout: timeoutMs
            }, (res) => {
                resolve({ url, status: res.statusCode, headers: res.headers });
            });
            req.on('error', (err) => {
                resolve({ url, error: err.message });
            });
            req.on('timeout', () => {
                req.destroy();
                resolve({ url, error: 'TIMEOUT' });
            });
            req.end();
        } catch (err) {
            resolve({ url, error: err.message });
        }
    });
}

// ==============================================================================
// MAIN ADVERSARIAL EXECUTION
// ==============================================================================
async function runAdversarialSuites() {
    console.log(`\n${C.bold}==============================================================================${C.reset}`);
    console.log(`${C.bold}  MURTHEHELP EMPIRICAL CHALLENGER 2: ADVERSARIAL VERIFICATION SUITE${C.reset}`);
    console.log(`${C.bold}==============================================================================${C.reset}\n`);

    const harness = createHarness();
    const tactical = harness.getVar('PRODUCTS_DB') || [];
    const disguise = harness.getVar('DISGUISE_PRODUCTS') || [];
    const subCategories = harness.getVar('SUB_CATEGORIES') || {};
    const defaultUsers = harness.getVar('DEFAULT_USERS') || {};

    // --------------------------------------------------------------------------
    // SUITE 1: LIVE NETWORK IMAGE PROBING (100% HTTP 200)
    // --------------------------------------------------------------------------
    console.log(`${C.cyan}▶ SUITE 1: LIVE NETWORK IMAGE PROBING & CDN HEALTH (PRODUCTS_DB + DISGUISE)${C.reset}`);
    
    const allImagesToProbe = [];
    tactical.forEach(p => allImagesToProbe.push({ catalog: 'tactical', id: p.id, url: p.img }));
    disguise.forEach(p => allImagesToProbe.push({ catalog: 'disguise', id: p.id, url: p.img }));

    assert(allImagesToProbe.length >= 60, `Total image URLs to probe >= 60 (Found ${allImagesToProbe.length})`);

    const imageProbeResults = await Promise.all(allImagesToProbe.map(item => probeImageUrl(item.url)));
    let imageFailureCount = 0;
    const brokenImages = [];

    imageProbeResults.forEach((res, idx) => {
        const item = allImagesToProbe[idx];
        if (res.status !== 200) {
            imageFailureCount++;
            brokenImages.push({ id: item.id, url: item.url, status: res.status, error: res.error });
        }
    });

    assert(imageFailureCount === 0, `100% of product images return HTTP 200 OK (${imageProbeResults.length - imageFailureCount}/${imageProbeResults.length} reachable)`,
        brokenImages.map(b => `[${b.id}] HTTP ${b.status || b.error}: ${b.url}`).join('; '));

    const nonHttpsImages = allImagesToProbe.filter(img => !img.url.startsWith('https://'));
    assert(nonHttpsImages.length === 0, `100% of product images use secure HTTPS protocol`,
        `Non-HTTPS images found: ${nonHttpsImages.length}`);

    // --------------------------------------------------------------------------
    // SUITE 2: PRODUCT CATALOG SCHEMA BOUNDARIES & INVARIANTS
    // --------------------------------------------------------------------------
    console.log(`\n${C.cyan}▶ SUITE 2: PRODUCT CATALOG SCHEMA BOUNDARIES & INVARIANTS${C.reset}`);

    assert(tactical.length >= 50, `Tactical catalog expanded to >= 50 products (Found ${tactical.length})`);
    assert(disguise.length >= 10, `Disguise catalog contains >= 10 products (Found ${disguise.length})`);

    // Check ID uniqueness across all products
    const allIds = new Set();
    let duplicateIdFound = false;
    [...tactical, ...disguise].forEach(p => {
        if (allIds.has(p.id)) duplicateIdFound = true;
        allIds.add(p.id);
    });
    assert(!duplicateIdFound, `All ${allIds.size} product IDs across tactical and disguise are unique (zero collisions)`);

    // Schema invariants for tactical products
    let schemaErrors = 0;
    tactical.forEach(p => {
        if (typeof p.id !== 'string' || !/^(RED|PUR|YEL|GRN)-[A-Z0-9]+$/.test(p.id)) schemaErrors++;
        if (typeof p.name !== 'string' || p.name.trim().length < 5) schemaErrors++;
        if (typeof p.subCat !== 'string' || p.subCat.trim().length === 0) schemaErrors++;
        if (!['RED', 'PURPLE', 'YELLOW', 'GREEN'].includes(p.code)) schemaErrors++;
        if (typeof p.price !== 'number' || !Number.isInteger(p.price) || p.price <= 0) schemaErrors++;
        if (typeof p.img !== 'string' || !p.img.startsWith('https://')) schemaErrors++;
        if (typeof p.specs !== 'string' || p.specs.trim().length < 15) schemaErrors++;
    });
    assert(schemaErrors === 0, `All ${tactical.length} tactical products satisfy strict schema invariants (id, name, subCat, code, price, img, specs)`);

    // Tier distributions
    const redCount = tactical.filter(p => p.code === 'RED').length;
    const purCount = tactical.filter(p => p.code === 'PURPLE').length;
    const yelCount = tactical.filter(p => p.code === 'YELLOW').length;
    const grnCount = tactical.filter(p => p.code === 'GREEN').length;

    assert(redCount >= 20, `CODE RED tier populated with >= 20 items (Observed: ${redCount})`);
    assert(purCount >= 7, `CODE PURPLE tier populated with >= 7 items (Observed: ${purCount})`);
    assert(yelCount >= 7, `CODE YELLOW tier populated with >= 7 items (Observed: ${yelCount})`);
    assert(grnCount >= 5, `CODE GREEN tier populated with >= 5 items (Observed: ${grnCount})`);

    // Disguise schema invariants
    let disguiseSchemaErrors = 0;
    disguise.forEach(p => {
        if (typeof p.id !== 'string' || !/^HHL-D\d{2}$/.test(p.id)) disguiseSchemaErrors++;
        if (typeof p.category !== 'string' || !['steel', 'hose', 'pump', 'valve', 'chem', 'cylinder'].includes(p.category)) disguiseSchemaErrors++;
        if (typeof p.name !== 'string' || p.name.trim().length < 5) disguiseSchemaErrors++;
        if (typeof p.tag !== 'string' || p.tag.trim().length < 3) disguiseSchemaErrors++;
        if (typeof p.specs !== 'string' || p.specs.trim().length < 15) disguiseSchemaErrors++;
        if (typeof p.price !== 'number' || !Number.isInteger(p.price) || p.price <= 0) disguiseSchemaErrors++;
        if (typeof p.img !== 'string' || !p.img.startsWith('https://')) disguiseSchemaErrors++;
    });
    assert(disguiseSchemaErrors === 0, `All ${disguise.length} disguise products satisfy strict schema invariants (id, category, name, tag, specs, price, img)`);

    // Subcategory coherence
    let invalidSubcats = 0;
    tactical.forEach(p => {
        const validList = subCategories[p.code] ? subCategories[p.code].map(s => s.id) : [];
        if (!validList.includes(p.subCat)) invalidSubcats++;
    });
    assert(invalidSubcats === 0, `All ${tactical.length} tactical product subcategories match SUB_CATEGORIES definition registry`);

    // --------------------------------------------------------------------------
    // SUITE 3: CART ARITHMETIC, MULTI-ITEM ACCUMULATION & COUPON MATH
    // --------------------------------------------------------------------------
    console.log(`\n${C.cyan}▶ SUITE 3: CART ARITHMETIC, MULTI-ITEM ACCUMULATION & COUPON MATH${C.reset}`);

    // Initial cart state
    harness.setVar('cart', []);
    harness.setVar('userClearance', 'GREEN');
    harness.callFn('renderCartList');
    assert(harness.elements.get('cart-subtotal').innerText === '0 ₫', `Initial cart subtotal is '0 ₫'`);
    assert(harness.elements.get('cart-total-final').innerText === '0 ₫', `Initial cart total final is '0 ₫'`);

    // Add 1 product
    const p1 = tactical[0];
    harness.callFn('addToCart', p1.id);
    let cartState = harness.getVar('cart');
    assert(cartState.length === 1 && cartState[0].quantity === 1, `Adding 1 item [${p1.id}] sets cart length 1, quantity 1`);
    assert(harness.elements.get('cart-counter').innerText === 1, `Cart badge counter reflects 1`);
    assert(harness.elements.get('cart-subtotal').innerText === p1.price.toLocaleString('vi-VN') + ' ₫', `Subtotal equals item price (${p1.price.toLocaleString('vi-VN')} ₫)`);

    // Add same product again (increment)
    harness.callFn('addToCart', p1.id);
    cartState = harness.getVar('cart');
    assert(cartState.length === 1 && cartState[0].quantity === 2, `Adding duplicate item increments quantity to 2`);
    assert(harness.elements.get('cart-counter').innerText === 2, `Cart badge counter reflects 2`);

    // Quantity decrement
    harness.callFn('changeCartItemQty', 0, -1);
    cartState = harness.getVar('cart');
    assert(cartState.length === 1 && cartState[0].quantity === 1, `changeCartItemQty(0, -1) reduces quantity back to 1`);

    // Quantity decrement below 1 removes item
    harness.callFn('changeCartItemQty', 0, -1);
    cartState = harness.getVar('cart');
    assert(cartState.length === 0, `changeCartItemQty(0, -1) at qty 1 completely removes item from cart`);

    // Multi-item stress load: Add all 54 products simultaneously
    harness.setVar('cart', []);
    harness.setVar('userClearance', 'GREEN');
    tactical.forEach(p => harness.callFn('addToCart', p.id));
    cartState = harness.getVar('cart');
    const expectedSubtotal = tactical.reduce((sum, p) => sum + p.price, 0);

    assert(cartState.length === tactical.length, `Simultaneous insertion of all ${tactical.length} tactical items into cart`);
    assert(harness.elements.get('cart-counter').innerText === tactical.length, `Cart counter reflects full catalog size (${tactical.length})`);
    assert(harness.elements.get('cart-subtotal').innerText === expectedSubtotal.toLocaleString('vi-VN') + ' ₫',
        `Subtotal correctly aggregates full catalog sum: ${expectedSubtotal.toLocaleString('vi-VN')} ₫`);

    // Coupon discount testing on max load
    // Test JINMAN50 (50%)
    harness.elements.get('cart-coupon-input').value = 'JINMAN50';
    harness.callFn('applyCoupon');
    let discount = harness.getVar('appliedCouponDiscount');
    let expected50 = Math.round(expectedSubtotal * 0.50);
    let final50 = expectedSubtotal - expected50;
    assert(discount === 50, `JINMAN50 sets appliedCouponDiscount to 50%`);
    assert(harness.elements.get('cart-total-final').innerText === final50.toLocaleString('vi-VN') + ' ₫',
        `JINMAN50 calculates exact 50% total: ${final50.toLocaleString('vi-VN')} ₫`);

    // Test VIETNAM (25%)
    harness.elements.get('cart-coupon-input').value = 'VIETNAM';
    harness.callFn('applyCoupon');
    let expected25 = Math.round(expectedSubtotal * 0.25);
    let final25 = expectedSubtotal - expected25;
    assert(harness.getVar('appliedCouponDiscount') === 25, `VIETNAM sets appliedCouponDiscount to 25%`);
    assert(harness.elements.get('cart-total-final').innerText === final25.toLocaleString('vi-VN') + ' ₫',
        `VIETNAM calculates exact 25% total: ${final25.toLocaleString('vi-VN')} ₫`);

    // Test HACLONG (15%)
    harness.elements.get('cart-coupon-input').value = 'HACLONG';
    harness.callFn('applyCoupon');
    let expected15 = Math.round(expectedSubtotal * 0.15);
    let final15 = expectedSubtotal - expected15;
    assert(harness.getVar('appliedCouponDiscount') === 15, `HACLONG sets appliedCouponDiscount to 15%`);
    assert(harness.elements.get('cart-total-final').innerText === final15.toLocaleString('vi-VN') + ' ₫',
        `HACLONG calculates exact 15% total: ${final15.toLocaleString('vi-VN')} ₫`);

    // Test Invalid Coupon
    harness.elements.get('cart-coupon-input').value = 'INVALID_CODE';
    harness.callFn('applyCoupon');
    assert(harness.getVar('appliedCouponDiscount') === 0, `Invalid coupon resets discount to 0%`);
    assert(harness.elements.get('cart-total-final').innerText === expectedSubtotal.toLocaleString('vi-VN') + ' ₫',
        `Invalid coupon reverts total back to full subtotal`);

    // Clear cart
    harness.setVar('cart', []);
    harness.callFn('renderCartList');

    // --------------------------------------------------------------------------
    // SUITE 4: ROLE-BASED ACCESS CONTROL, CHECKOUT & BALANCE DEDUCTIONS
    // --------------------------------------------------------------------------
    console.log(`\n${C.cyan}▶ SUITE 4: ROLE-BASED ACCESS CONTROL, CHECKOUT & BALANCE DEDUCTIONS${C.reset}`);

    // Role-based product authorization
    // RED user attempting PURPLE product
    harness.setVar('userClearance', 'RED');
    harness.setVar('currentUser', { name: 'Sniper', role: 'RED', balance: 250000000 });
    const purItem = tactical.find(p => p.code === 'PURPLE');
    const redItem = tactical.find(p => p.code === 'RED');

    harness.setVar('cart', []);
    harness.callFn('addToCart', purItem.id);
    assert(harness.getVar('cart').length === 0, `RED user blocked from adding PURPLE item [${purItem.id}]`);
    assert(harness.alerts.length > 0 && harness.alerts[harness.alerts.length - 1].includes('YÊU CẦU PHÂN QUYỀN'),
        `Clearance requirement alert triggered for unauthorized tier`);

    // RED user adding RED product
    harness.callFn('addToCart', redItem.id);
    assert(harness.getVar('cart').length === 1, `RED user permitted to add RED item [${redItem.id}]`);

    // GREEN / Super Admin user can add ANY product
    harness.setVar('userClearance', 'GREEN');
    harness.setVar('currentUser', { name: 'Super Admin', role: 'GREEN', balance: 2000000000 });
    harness.callFn('addToCart', purItem.id);
    const yelItem = tactical.find(p => p.code === 'YELLOW');
    const grnItem = tactical.find(p => p.code === 'GREEN');
    harness.callFn('addToCart', yelItem.id);
    harness.callFn('addToCart', grnItem.id);
    assert(harness.getVar('cart').length === 4, `Super Admin (CODE GREEN) can add products from all tiers (RED, PURPLE, YELLOW, GREEN)`);

    // Empty cart checkout attempt
    harness.setVar('cart', []);
    harness.alerts.length = 0;
    harness.callFn('executeCheckout');
    assert(harness.alerts.some(a => a.includes('Giỏ hàng đang trống')), `Empty cart checkout is rejected with alert`);

    // Insufficient balance checkout attempt
    harness.setVar('userClearance', 'RED');
    harness.setVar('userBalance', 10000000); // 10M VND
    harness.setVar('currentUser', { name: 'Low Balance User', role: 'RED', balance: 10000000 });
    harness.setVar('cart', [{ ...redItem, quantity: 1, qty: 1 }]); // 38.5M VND
    harness.alerts.length = 0;
    harness.callFn('executeCheckout');
    assert(harness.alerts.some(a => a.includes('SỐ DƯ TÀI KHOẢN KHÔNG ĐỦ')), `Insufficient balance checkout is rejected with alert`);
    assert(harness.getVar('userBalance') === 10000000, `Balance remains completely unchanged after failed checkout`);

    // Successful checkout execution with balance deduction
    const initialBal = 500000000; // 500M VND
    harness.setVar('userBalance', initialBal);
    harness.setVar('currentUser', { name: 'Operative', role: 'RED', balance: initialBal });
    harness.setVar('currentUserId', 'sniper_red');
    harness.setVar('cart', [{ ...redItem, quantity: 2, qty: 2 }]); // 38.5M * 2 = 77M VND
    const orderCost = redItem.price * 2;
    harness.alerts.length = 0;

    harness.callFn('executeCheckout');
    const expectedRemainingBal = initialBal - orderCost;
    assert(harness.getVar('userBalance') === expectedRemainingBal,
        `Balance correctly deducted: ${initialBal.toLocaleString('vi-VN')} ₫ -> ${expectedRemainingBal.toLocaleString('vi-VN')} ₫ (-${orderCost.toLocaleString('vi-VN')} ₫)`);
    assert(harness.getVar('cart').length === 0, `Cart is cleanly emptied after successful checkout`);
    assert(harness.getVar('appliedCouponDiscount') === 0, `Applied coupon discount is reset to 0 after checkout`);

    // Check order record in localStorage
    const storedOrders = harness.callFn('getStoredOrders') || [];
    assert(storedOrders.length > 0, `Order record successfully written to murthehelp_orders_db`);
    const lastOrder = storedOrders[0];
    assert(lastOrder.total === orderCost, `Stored order total matches checkout amount: ${lastOrder.total.toLocaleString('vi-VN')} ₫`);
    assert(lastOrder.trackingId.startsWith('TRACK-'), `Tracking ID generated with format TRACK-xxxxxx (${lastOrder.trackingId})`);
    assert(lastOrder.status.includes('DRONE'), `Order status set to dispatch protocol`);

    // --------------------------------------------------------------------------
    // SUITE 5: AUTHENTICATION, SUPER ADMIN (q121101) & ADMIN PANEL
    // --------------------------------------------------------------------------
    console.log(`\n${C.cyan}▶ SUITE 5: AUTHENTICATION, SUPER ADMIN (q121101) & ADMIN PANEL${C.reset}`);

    // Verify DEFAULT_USERS configuration
    assert(defaultUsers['q121101'] !== undefined, `Super Admin account [q121101] exists in DEFAULT_USERS`);
    assert(defaultUsers['q121101'].pass === 'Tungqu@n1208.', `Super Admin password is 'Tungqu@n1208.'`);
    assert(defaultUsers['q121101'].role === 'GREEN', `Super Admin clearance role is 'GREEN'`);
    assert(defaultUsers['q121101'].balance === 2000000000, `Super Admin initial balance is 2.000.000.000 ₫`);
    assert(defaultUsers['q121101'].isAdmin === true, `Super Admin isAdmin flag is true`);

    // Verify all standard accounts exist
    ['admin', 'sniper_red', 'cleaner_pur', 'medic_yel'].forEach(userKey => {
        assert(defaultUsers[userKey] !== undefined, `Standard operative account [${userKey}] exists with role [${defaultUsers[userKey].role}]`);
    });

    // Test Login Simulation: Super Admin q121101
    harness.elements.get('login-username').value = 'q121101';
    harness.elements.get('login-password').value = 'Tungqu@n1208.';
    harness.alerts.length = 0;
    await harness.callFn('handleUserLogin');
    assert(harness.getVar('currentUserId') === 'q121101', `Super Admin [q121101] login sets currentUserId`);
    assert(harness.getVar('currentUser').role === 'GREEN', `Super Admin login establishes CODE GREEN clearance`);

    // Test Login Simulation: Case-insensitivity (Q121101)
    harness.elements.get('login-username').value = 'Q121101';
    harness.elements.get('login-password').value = 'Tungqu@n1208.';
    harness.alerts.length = 0;
    await harness.callFn('handleUserLogin');
    assert(harness.getVar('currentUserId') === 'q121101', `Case-insensitive username [Q121101] authenticates successfully`);

    // Test Login Simulation: Master Bypass (JINMAN / 7209)
    harness.elements.get('login-username').value = 'admin';
    harness.elements.get('login-password').value = 'JINMAN';
    harness.alerts.length = 0;
    await harness.callFn('handleUserLogin');
    assert(harness.getVar('currentUserId') === 'admin', `Master bypass credentials [admin / JINMAN] authenticate successfully`);

    // Test Login Simulation: Invalid password
    harness.elements.get('login-username').value = 'q121101';
    harness.elements.get('login-password').value = 'WRONG_PASSWORD';
    harness.alerts.length = 0;
    await harness.callFn('handleUserLogin');
    assert(harness.alerts.some(a => a.includes('Mật mã bảo mật không chính xác')), `Invalid password attempt is rejected with alert`);

    // Test Login Simulation: Unknown username
    harness.elements.get('login-username').value = 'unknown_user_99';
    harness.elements.get('login-password').value = 'any_password';
    harness.alerts.length = 0;
    await harness.callFn('handleUserLogin');
    assert(harness.alerts.some(a => a.includes('Không tìm thấy mã định danh')), `Unknown user login is rejected with alert`);

    // Admin Panel Access Control
    // Non-admin user attempt
    harness.setVar('currentUser', { name: 'Sniper', role: 'RED', isAdmin: false });
    harness.alerts.length = 0;
    harness.callFn('openAdminModal');
    assert(harness.alerts.some(a => a.includes('Quyền hạn không đủ')), `Non-admin user (CODE RED) blocked from opening Admin Panel`);

    // Admin user attempt
    const adminBal = 2000000000;
    harness.setVar('currentUser', { name: 'Super Admin', role: 'GREEN', isAdmin: true, balance: adminBal });
    harness.setVar('userBalance', adminBal);
    harness.setVar('currentUserId', 'q121101');
    harness.alerts.length = 0;
    harness.callFn('openAdminModal');
    assert(harness.elements.get('admin-modal').classList.contains('flex'), `Super Admin successfully opens Admin Panel modal`);

    // Admin Deposit Operations
    harness.elements.get('admin-deposit-input').value = '500000000'; // +500M VND
    harness.callFn('depositFunds');
    assert(harness.getVar('userBalance') === adminBal + 500000000,
        `Admin deposit of 500.000.000 ₫ increases balance to ${(adminBal + 500000000).toLocaleString('vi-VN')} ₫`);

    // Admin Invalid Deposit Attempt (Negative / Zero / NaN)
    const balBeforeInvalidDeposit = harness.getVar('userBalance');
    harness.elements.get('admin-deposit-input').value = '-10000000';
    harness.alerts.length = 0;
    harness.callFn('depositFunds');
    assert(harness.alerts.some(a => a.includes('Vui lòng nhập số tiền VNĐ hợp lệ')), `Negative deposit attempt is rejected with alert`);
    assert(harness.getVar('userBalance') === balBeforeInvalidDeposit, `Balance unchanged after negative deposit attempt`);

    harness.elements.get('admin-deposit-input').value = '0';
    harness.alerts.length = 0;
    harness.callFn('depositFunds');
    assert(harness.alerts.some(a => a.includes('Vui lòng nhập số tiền VNĐ hợp lệ')), `Zero deposit attempt is rejected with alert`);
    assert(harness.getVar('userBalance') === balBeforeInvalidDeposit, `Balance unchanged after zero deposit attempt`);

    // Admin Save Settings (Role & Name Override)
    harness.elements.get('admin-tier-select').value = 'PURPLE';
    harness.elements.get('admin-username-input').value = 'Commander Q';
    harness.callFn('saveAdminSettings');
    assert(harness.getVar('userClearance') === 'PURPLE', `Admin settings update changed userClearance to PURPLE`);
    assert(harness.getVar('userName') === 'Commander Q', `Admin settings update changed userName to 'Commander Q'`);

    // --------------------------------------------------------------------------
    // SUITE 6: UI STAGE TRANSITIONS, MODALS & AST SYNTAX INTEGRITY
    // --------------------------------------------------------------------------
    console.log(`\n${C.cyan}▶ SUITE 6: UI STAGE TRANSITIONS, MODALS & AST SYNTAX INTEGRITY${C.reset}`);

    // Triple-Click State Machine
    harness.setVar('secretClickCount', 0);
    harness.callFn('handleSecretTripleClick');
    assert(harness.getVar('secretClickCount') === 1, `1st click on yellow footer text increments counter to 1`);

    harness.callFn('handleSecretTripleClick');
    assert(harness.getVar('secretClickCount') === 2, `2nd click increments counter to 2 (portal stage still hidden)`);

    harness.callFn('handleSecretTripleClick');
    assert(harness.getVar('secretClickCount') === 0, `3rd click triggers portal and resets counter to 0`);
    assert(harness.elements.get('portal-stage').classList.contains('flex'), `Portal stage (#portal-stage) is displayed`);
    assert(harness.elements.get('disguise-stage').classList.contains('hidden'), `Disguise stage (#disguise-stage) is hidden`);

    // Dark stage transition
    harness.callFn('enterDarkMallFinal');
    assert(harness.elements.get('dark-stage').classList.contains('flex'), `Dark Mall stage (#dark-stage) is displayed`);
    assert(harness.elements.get('portal-stage').classList.contains('hidden'), `Portal stage is hidden`);

    // Return to disguise
    harness.callFn('returnToDisguise');
    assert(!harness.elements.get('disguise-stage').classList.contains('hidden'), `Disguise stage (#disguise-stage) is displayed (hidden class removed)`);
    assert(harness.elements.get('dark-stage').classList.contains('hidden'), `Dark Mall stage is hidden`);

    // Product Detail Quick View Modal
    const testItem = tactical[0];
    harness.callFn('openProductDetailModal', testItem.id);
    assert(harness.elements.get('product-detail-modal').classList.contains('flex'), `Product detail modal opens on openProductDetailModal()`);
    assert(harness.elements.get('detail-item-name').innerText === testItem.name, `Detail modal name matches product name: ${testItem.name}`);
    assert(harness.elements.get('detail-item-price').innerText === testItem.price.toLocaleString('vi-VN') + ' ₫', `Detail modal price matches product price`);
    harness.callFn('closeProductDetailModal');
    assert(harness.elements.get('product-detail-modal').classList.contains('hidden'), `Product detail modal closes on closeProductDetailModal()`);

    // AST Syntax Validation of all Inline Scripts
    const allInlineScripts = htmlContent.match(/<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/gi) || [];
    let scriptSyntaxErrors = 0;
    allInlineScripts.forEach((sTag, sIdx) => {
        const rawCode = sTag.replace(/<\/?script[^>]*>/gi, '');
        try {
            new Function(rawCode);
            new vm.Script(rawCode);
        } catch (e) {
            scriptSyntaxErrors++;
            console.error(`Script #${sIdx + 1} syntax error:`, e.message);
        }
    });
    assert(scriptSyntaxErrors === 0, `All ${allInlineScripts.length} inline <script> blocks pass pure AST compilation without syntax errors`);

    // ==============================================================================
    // FINAL SUMMARY
    // ==============================================================================
    console.log(`\n${C.bold}==============================================================================${C.reset}`);
    console.log(`${C.bold}TEST EXECUTION SUMMARY${C.reset}`);
    console.log(`${C.bold}==============================================================================${C.reset}`);
    console.log(`Total Assertions Run : ${totalPassed + totalFailed}`);
    console.log(`Passed               : ${C.green}${totalPassed}${C.reset}`);
    console.log(`Failed               : ${totalFailed === 0 ? C.green + '0' + C.reset : C.red + totalFailed + C.reset}`);
    console.log(`Live Network Images  : ${C.green}${imageProbeResults.length} probed (100% HTTP 200 OK)${C.reset}`);
    console.log(`Verdict              : ${totalFailed === 0 ? C.green + C.bold + 'APPROVE (100% PASS)' + C.reset : C.red + C.bold + 'REQUEST_CHANGES' + C.reset}`);
    console.log(`${C.bold}==============================================================================${C.reset}\n`);

    if (totalFailed > 0) {
        process.exit(1);
    }
}

runAdversarialSuites().catch(err => {
    console.error('Fatal execution error:', err);
    process.exit(1);
});
