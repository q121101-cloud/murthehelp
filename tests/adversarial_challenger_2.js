/**
 * ==============================================================================
 * CHALLENGER 2: EMPIRICAL ADVERSARIAL VERIFICATION SUITE
 * ==============================================================================
 * Independent, exhaustive verification harness testing:
 * 1. Product Catalog & Disguise Catalog Pricing & Numeric Validity (43 + 8 items)
 * 2. Cart Operations & VNĐ Math Stress-Testing (Single/Multi-item, Qty, Deletions, Max load)
 * 3. Balance Deductions & Logistics Dispatch Simulations across all 3 modes
 * 4. Master Admin Console Overrides (Valid/Invalid deposits, Tiers, Identity, Ledger)
 * 5. ESC Panic Protocol across all Modals and UI States
 * ==============================================================================
 */

const fs = require('fs');
const path = require('path');
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
    cyan: '\x1b[36m'
};

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

    function createMockElement(id = '', tag = 'DIV') {
        const defaultOptions = [
            { text: '🚁 Drone Tàng Hình Ban Đêm (Thả dù định vị GPS sai số < 0.5m)', value: 'drone' },
            { text: '📦 Thùng Nông Cụ Ngụy Trang (Vận chuyển xe tải chuyên dụng)', value: 'container' },
            { text: '📍 Điểm Hẹn An Toàn Safehouse (Tọa độ tự hủy sau 60 phút)', value: 'safehouse' }
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

    const idRegex = /id=["']([^"']+)["']/g;
    let match;
    while ((match = idRegex.exec(htmlContent)) !== null) {
        if (!elements.has(match[1])) {
            elements.set(match[1], createMockElement(match[1]));
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
        setTimeout(fn) { fn(); return 1; },
        clearTimeout() {},
        requestAnimationFrame() {},
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

    return {
        context,
        getVar,
        setVar,
        callFn,
        elements,
        alerts,
        eventListeners,
        mockStorage,
        dispatchWindowEvent(type, eventProps = {}) {
            const handlers = eventListeners.get('window:' + type) || [];
            const evt = { type, preventDefault() {}, ...eventProps };
            handlers.forEach(h => h(evt));
        },
        dispatchElementEvent(elemId, type, eventProps = {}) {
            const handlers = eventListeners.get(elemId + ':' + type) || [];
            const evt = { target: elements.get(elemId), preventDefault() {}, ...eventProps };
            handlers.forEach(h => h(evt));
        }
    };
}

// ==============================================================================
// TEST HARNESS ASSERTIONS
// ==============================================================================
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const testResults = [];

function assert(condition, message, details = '') {
    totalTests++;
    if (condition) {
        passedTests++;
        testResults.push({ pass: true, message, details });
        console.log(`  ${C.green}✔ PASS${C.reset} ${message}`);
    } else {
        failedTests++;
        testResults.push({ pass: false, message, details });
        console.error(`  ${C.red}✖ FAIL${C.reset} ${message} ${details ? `(${details})` : ''}`);
    }
}

console.log(`\n${C.bold}${C.cyan}==============================================================================${C.reset}`);
console.log(`${C.bold}${C.cyan}  MURTHEHELP EMPIRICAL CHALLENGER 2: ADVERSARIAL VERIFICATION SUITE${C.reset}`);
console.log(`${C.bold}${C.cyan}==============================================================================${C.reset}\n`);

// ------------------------------------------------------------------------------
// SUITE 1: PRODUCT CATALOG PRICING & NUMERIC INTEGRITY
// ------------------------------------------------------------------------------
console.log(`${C.bold}▶ SUITE 1: PRODUCT CATALOG PRICING & NUMERIC INTEGRITY (43 Tactical + 8 Disguise)${C.reset}`);
{
    const h = createHarness();
    const tactical = h.getVar('PRODUCTS_DB');
    const disguise = h.getVar('DISGUISE_PRODUCTS');

    assert(Array.isArray(tactical) && tactical.length === 43, `Tactical catalog contains exactly 43 items (Observed: ${tactical ? tactical.length : 0})`);
    assert(Array.isArray(disguise) && disguise.length === 8, `Disguise catalog contains exactly 8 items (Observed: ${disguise ? disguise.length : 0})`);

    const vnPriceRegex = /^\d{1,3}(\.\d{3})+ ₫$/;

    // Tactical items test
    let tacticalAllValid = true;
    let tacticalFormatValid = true;
    const tierCounts = { RED: 0, PURPLE: 0, YELLOW: 0, GREEN: 0 };

    tactical.forEach(item => {
        if (typeof item.price !== 'number' || !Number.isInteger(item.price) || item.price <= 0) {
            tacticalAllValid = false;
        }
        const formatted = item.price.toLocaleString('vi-VN') + ' ₫';
        if (!vnPriceRegex.test(formatted)) {
            tacticalFormatValid = false;
        }
        if (tierCounts[item.code] !== undefined) tierCounts[item.code]++;
    });

    assert(tacticalAllValid, `All 43 tactical products have positive integer VNĐ prices without floating point distortion`);
    assert(tacticalFormatValid, `All 43 tactical products format correctly to Vietnamese dot-separated currency (e.g. 38.500.000 ₫)`);
    assert(tierCounts.RED === 24, `Code Red contains exactly 24 tactical items (Observed: ${tierCounts.RED})`);
    assert(tierCounts.PURPLE === 7, `Code Purple contains exactly 7 items (Observed: ${tierCounts.PURPLE})`);
    assert(tierCounts.YELLOW === 7, `Code Yellow contains exactly 7 items (Observed: ${tierCounts.YELLOW})`);
    assert(tierCounts.GREEN === 5, `Code Green contains exactly 5 items (Observed: ${tierCounts.GREEN})`);

    // Spot-check key prices from ORIGINAL_REQUEST.md
    const checkItemPrice = (id, expectedPrice, expectedName) => {
        const it = tactical.find(p => p.id === id);
        assert(it && it.price === expectedPrice, `Key item [${id}] ${expectedName} matches exact price ${expectedPrice.toLocaleString('vi-VN')} ₫`);
    };

    checkItemPrice('P020', 38500000, 'Colt M1911 Custom');
    checkItemPrice('P033', 16500000, 'Glock 19 Gen 5 Blackout');
    checkItemPrice('P021', 21000000, 'Tokarev TT-33');
    checkItemPrice('P022', 48000000, 'Desert Eagle .50 AE Titan');
    checkItemPrice('SNP01', 210000000, 'AI AWM .338');
    checkItemPrice('SNP02', 340000000, 'Barrett M82A1 .50 BMG');
    checkItemPrice('SNP03', 450000000, 'CheyTac M200 Intervention');
    checkItemPrice('EXP01', 16000000, 'Flashbang M84 x4');
    checkItemPrice('EXP02', 35000000, 'C4 Kèm Kíp Nổ Từ Xa');
    checkItemPrice('MEL01', 12500000, 'Dao CQC Tungsten');
    checkItemPrice('PUR01', 45000000, 'Axit Sinh Học PX-70');
    checkItemPrice('PUR02', 68000000, 'Micro Drone Trinh Sát Tàng Hình');
    checkItemPrice('PUR03', 52000000, 'EMP Phá Sóng Quân Sự');
    checkItemPrice('PUR04', 78000000, 'Máy Quét Laser Xuyên Tường');
    checkItemPrice('PUR05', 85000000, 'Vali Khử Từ Ổ Cứng Cleaner-Pro');
    checkItemPrice('YEL01', 14500000, 'Túi Sơ Cứu Chấn Thương IFAK');
    checkItemPrice('YEL02', 28000000, 'Serum Adrenaline Pro');
    checkItemPrice('YEL03', 32000000, 'Máy Khử Rung Tim AED-X');
    checkItemPrice('YEL04', 18500000, 'Băng Ép Cầm Máu Celox Pro');
    checkItemPrice('YEL05', 18500000, 'Keo Dán Vết Thương Sinh Học Bio-Glue');
    checkItemPrice('GRN01', 180000000, 'Khiên Graphene Cấp IV');
    checkItemPrice('GRN02', 850000000, 'Biệt Đội Can Thiệp Vũ Trang 5 Phút');
    checkItemPrice('GRN03', 920000000, 'Robot Tác Chiến Phòng Thủ Sentinel');
    checkItemPrice('GRN04', 450000000, 'Giáp Titanium Exoskeleton');

    // Disguise catalog test
    let disguiseAllValid = true;
    let disguiseFormatValid = true;
    disguise.forEach(item => {
        if (typeof item.price !== 'number' || !Number.isInteger(item.price) || item.price <= 0) {
            disguiseAllValid = false;
        }
        const formatted = item.price.toLocaleString('vi-VN') + ' ₫';
        if (!vnPriceRegex.test(formatted)) {
            disguiseFormatValid = false;
        }
    });

    assert(disguiseAllValid, `All 8 disguise products have positive integer VNĐ prices`);
    assert(disguiseFormatValid, `All 8 disguise products format correctly to Vietnamese currency (e.g. 7.800.000 ₫)`);

    // Alert banner order #HD-71092 check
    assert(htmlContent.includes('#HD-71092') && htmlContent.includes('70.000.000 ₫') && htmlContent.includes('11.200'),
        `Disguise banner contains exact order #HD-71092 with 11.200m hose and 70.000.000 ₫`);
}

// ------------------------------------------------------------------------------
// SUITE 2: CART OPERATIONS & VNĐ ARITHMETIC STRESS-TESTING
// ------------------------------------------------------------------------------
console.log(`\n${C.bold}▶ SUITE 2: CART OPERATIONS & VNĐ ARITHMETIC STRESS-TESTING${C.reset}`);
{
    const h = createHarness();

    // 1. Initial empty cart state
    assert(h.getVar('cart').length === 0, `Initial cart is empty`);
    assert(h.elements.get('cart-total-vnđ').innerText === '0 ₫', `Initial cart UI total is '0 ₫'`);
    assert(h.elements.get('cart-counter').innerText === 0, `Initial cart counter badge is 0`);

    // 2. Empty cart checkout rejection
    h.callFn('executeCheckout');
    assert(h.alerts.length === 1 && h.alerts[0].includes('trống'), `Attempting checkout on empty cart triggers warning alert and prevents transaction`);

    // 3. Single item addition
    h.callFn('addToCart', 'P020'); // Colt M1911 (38.500.000 ₫)
    const cart1 = h.getVar('cart');
    assert(cart1.length === 1 && cart1[0].qty === 1, `Adding P020 creates single cart item with qty = 1`);
    assert(h.elements.get('cart-total-vnđ').innerText === '38.500.000 ₫', `Cart total displays '38.500.000 ₫'`);
    assert(h.elements.get('cart-counter').innerText === 1, `Cart counter badge is 1`);

    // 4. Duplicate item addition
    h.callFn('addToCart', 'P020');
    const cart2 = h.getVar('cart');
    assert(cart2.length === 1 && cart2[0].qty === 2, `Adding duplicate P020 increments qty to 2 without duplicating item entry`);
    assert(h.elements.get('cart-total-vnđ').innerText === '77.000.000 ₫', `Cart total updates to '77.000.000 ₫' (38.5M * 2)`);
    assert(h.elements.get('cart-counter').innerText === 2, `Cart counter badge updates to 2`);

    // 5. Multi-item cross-tier additions
    h.callFn('addToCart', 'PUR01'); // 45.000.000 ₫
    h.callFn('addToCart', 'YEL01'); // 14.500.000 ₫
    h.callFn('addToCart', 'GRN01'); // 180.000.000 ₫
    // Total = 77M + 45M + 14.5M + 180M = 316.500.000 ₫
    const cart3 = h.getVar('cart');
    assert(cart3.length === 4, `Cart contains 4 distinct items across all 4 clearance codes`);
    assert(h.elements.get('cart-total-vnđ').innerText === '316.500.000 ₫', `Multi-item cart total correctly calculates '316.500.000 ₫'`);
    assert(h.elements.get('cart-counter').innerText === 5, `Total quantity counter across all items is 5`);

    // 6. Quantity increment (+)
    h.callFn('updateCartQty', 'YEL01', 1); // YEL01 becomes qty = 2 (+14.5M -> 331M)
    assert(h.getVar('cart').find(c => c.id === 'YEL01').qty === 2, `updateCartQty('YEL01', +1) increments quantity to 2`);
    assert(h.elements.get('cart-total-vnđ').innerText === '331.000.000 ₫', `Total updates correctly to '331.000.000 ₫'`);

    // 7. Quantity decrement (-)
    h.callFn('updateCartQty', 'P020', -1); // P020 becomes qty = 1 (-38.5M -> 292.5M)
    assert(h.getVar('cart').find(c => c.id === 'P020').qty === 1, `updateCartQty('P020', -1) decrements quantity to 1`);
    assert(h.elements.get('cart-total-vnđ').innerText === '292.500.000 ₫', `Total updates correctly to '292.500.000 ₫'`);

    // 8. Quantity decrement to 0 (auto-removal)
    h.callFn('updateCartQty', 'P020', -1); // P020 qty becomes 0 -> removed (-38.5M -> 254M)
    assert(h.getVar('cart').find(c => c.id === 'P020') === undefined, `Decreasing quantity to 0 automatically removes item from cart`);
    assert(h.getVar('cart').length === 3, `Cart item count shrinks from 4 to 3`);
    assert(h.elements.get('cart-total-vnđ').innerText === '254.000.000 ₫', `Total updates correctly to '254.000.000 ₫'`);

    // 9. Explicit item deletion (✕)
    h.callFn('removeFromCart', 'GRN01'); // Removes 180M -> 74M (PUR01: 45M + YEL01: 29M)
    assert(h.getVar('cart').find(c => c.id === 'GRN01') === undefined, `removeFromCart('GRN01') completely removes item`);
    assert(h.elements.get('cart-total-vnđ').innerText === '74.000.000 ₫', `Total updates to '74.000.000 ₫'`);

    // 10. Deleting all remaining items
    h.callFn('removeFromCart', 'PUR01');
    h.callFn('removeFromCart', 'YEL01');
    assert(h.getVar('cart').length === 0, `All items removed from cart`);
    assert(h.elements.get('cart-total-vnđ').innerText === '0 ₫', `Cart total correctly resets to '0 ₫'`);
    assert(h.elements.get('cart-counter').innerText === 0, `Cart counter badge resets to 0`);

    // 11. Massive Stress Test: Add all 43 products at once
    let expectedTotalAll = 0;
    const products = h.getVar('PRODUCTS_DB');
    products.forEach(item => {
        h.callFn('addToCart', item.id);
        expectedTotalAll += item.price;
    });
    const finalCart = h.getVar('cart');
    assert(finalCart.length === 43, `Cart successfully holds all 43 catalog items simultaneously`);
    const actualCalculatedSum = finalCart.reduce((s, i) => s + i.price * i.qty, 0);
    assert(actualCalculatedSum === expectedTotalAll, `Exact total sum of all 43 items matches: ${expectedTotalAll.toLocaleString('vi-VN')} ₫`);
    assert(h.elements.get('cart-total-vnđ').innerText === expectedTotalAll.toLocaleString('vi-VN') + ' ₫',
        `UI total matches exact 43-item grand sum: ${expectedTotalAll.toLocaleString('vi-VN')} ₫`);
}

// ------------------------------------------------------------------------------
// SUITE 3: BALANCE DEDUCTIONS & LOGISTICS DISPATCH (3 MODES)
// ------------------------------------------------------------------------------
console.log(`\n${C.bold}▶ SUITE 3: BALANCE DEDUCTIONS & LOGISTICS DISPATCH (3 MODES)${C.reset}`);
{
    // Mode 1: Drone Tàng Hình Ban Đêm
    const h1 = createHarness();
    h1.setVar('userBalance', 1500000000); // 1.5 Tỷ
    h1.callFn('addToCart', 'SNP03'); // CheyTac M200: 450.000.000 ₫
    h1.elements.get('delivery-method').selectedIndex = 0; // drone

    h1.callFn('executeCheckout');
    assert(h1.getVar('userBalance') === 1050000000, `Mode 1 (Drone): Balance deducted exactly from 1.5B to 1.05B (Observed: ${h1.getVar('userBalance')})`);
    assert(h1.getVar('cart').length === 0, `Mode 1: Cart emptied after checkout`);
    assert(h1.getVar('transactions').length === 1, `Mode 1: Transaction record added to ledger`);
    const t1 = h1.getVar('transactions')[0];
    assert(t1.method.includes('Drone Tàng Hình'), `Mode 1: Transaction log contains Drone dispatch method`);
    assert(t1.total === 450000000, `Mode 1: Transaction total is 450.000.000 ₫`);
    assert(t1.remainingBalance === 1050000000, `Mode 1: Transaction remainingBalance is 1.050.000.000 ₫`);
    assert(/^ORD-\d{6}$/.test(t1.orderId), `Mode 1: Order ID matches ORD-XXXXXX format (${t1.orderId})`);
    assert(h1.elements.get('dispatch-alert-modal').classList.contains('flex'), `Mode 1: Dispatch alert modal is shown`);
    assert(h1.elements.get('user-balance-display').innerText === '1.050.000.000', `Mode 1: Top HUD balance displays formatted 1.050.000.000`);

    // Mode 2: Thùng Nông Cụ Ngụy Trang
    const h2 = createHarness();
    h2.setVar('userBalance', 500000000);
    h2.callFn('addToCart', 'AR02'); // FN SCAR-H: 195.000.000 ₫
    h2.callFn('addToCart', 'SMG03'); // KRISS Vector: 135.000.000 ₫
    // Total = 330.000.000 ₫ -> remaining 170.000.000 ₫
    h2.elements.get('delivery-method').selectedIndex = 1; // container

    h2.callFn('executeCheckout');
    assert(h2.getVar('userBalance') === 170000000, `Mode 2 (Container): Balance deducted from 500M to 170M (Observed: ${h2.getVar('userBalance')})`);
    const t2 = h2.getVar('transactions')[0];
    assert(t2.method.includes('Thùng Nông Cụ Ngụy Trang'), `Mode 2: Transaction log contains Container method`);
    assert(t2.total === 330000000, `Mode 2: Transaction total is 330.000.000 ₫`);

    // Mode 3: Điểm Hẹn An Toàn Safehouse
    const h3 = createHarness();
    h3.setVar('userBalance', 1000000000);
    h3.callFn('addToCart', 'GRN02'); // Biệt Đội Can Thiệp 5 Phút: 850.000.000 ₫
    h3.elements.get('delivery-method').selectedIndex = 2; // safehouse

    h3.callFn('executeCheckout');
    assert(h3.getVar('userBalance') === 150000000, `Mode 3 (Safehouse): Balance deducted from 1B to 150M (Observed: ${h3.getVar('userBalance')})`);
    const t3 = h3.getVar('transactions')[0];
    assert(t3.method.includes('Điểm Hẹn An Toàn Safehouse'), `Mode 3: Transaction log contains Safehouse method`);

    // Boundary Test 1: Insufficient Balance Rejection
    const h4 = createHarness();
    h4.setVar('userBalance', 50000000); // 50M
    h4.callFn('addToCart', 'SNP02'); // Barrett M82A1: 340.000.000 ₫
    h4.callFn('executeCheckout');
    assert(h4.alerts.length === 1 && h4.alerts[0].includes('KHÔNG ĐỦ'), `Checkout with insufficient balance is rejected with alert`);
    assert(h4.getVar('userBalance') === 50000000, `Balance remains unchanged on failed checkout`);
    assert(h4.getVar('cart').length === 1, `Cart items preserved on failed checkout`);
    assert(h4.getVar('transactions').length === 0, `No transaction logged on failed checkout`);

    // Boundary Test 2: Exact Balance Checkout (userBalance == total)
    const h5 = createHarness();
    h5.setVar('userBalance', 38500000); // Exact price of Colt M1911
    h5.callFn('addToCart', 'P020');
    h5.callFn('executeCheckout');
    assert(h5.getVar('userBalance') === 0, `Exact balance checkout successfully reduces balance to 0 ₫`);
    assert(h5.getVar('transactions').length === 1 && h5.getVar('transactions')[0].remainingBalance === 0, `Transaction logged with remainingBalance = 0 ₫`);
}

// ------------------------------------------------------------------------------
// SUITE 4: MASTER ADMIN CONSOLE OVERRIDES
// ------------------------------------------------------------------------------
console.log(`\n${C.bold}▶ SUITE 4: MASTER ADMIN CONSOLE OVERRIDES${C.reset}`);
{
    const h = createHarness();
    h.setVar('userBalance', 500000000);

    // 1. Valid Custom Deposit
    h.elements.get('admin-deposit-input').value = '250000000';
    h.callFn('depositFunds');
    assert(h.getVar('userBalance') === 750000000, `depositFunds(250M) increases balance from 500M to 750M`);
    assert(h.elements.get('user-balance-display').innerText === '750.000.000', `HUD balance display updates to 750.000.000`);
    assert(h.mockStorage.murthehelp_balance === '750000000', `LocalStorage balance persists 750000000`);

    // 2. Quick Deposits
    h.callFn('quickDeposit', 100000000); // +100M -> 850M
    assert(h.getVar('userBalance') === 850000000, `quickDeposit(100M) updates balance to 850M`);
    h.callFn('quickDeposit', 500000000); // +500M -> 1.35B
    assert(h.getVar('userBalance') === 1350000000, `quickDeposit(500M) updates balance to 1.35B`);
    h.callFn('quickDeposit', 1000000000); // +1B -> 2.35B
    assert(h.getVar('userBalance') === 2350000000, `quickDeposit(1B) updates balance to 2.35B`);

    // 3. Invalid Deposit Handling (NaN, Negative, Zero, Blank)
    const prevBalance = h.getVar('userBalance');
    const alertCountBefore = h.alerts.length;

    h.elements.get('admin-deposit-input').value = 'invalid_text';
    h.callFn('depositFunds');
    assert(h.getVar('userBalance') === prevBalance, `Non-numeric deposit is rejected without balance change`);

    h.elements.get('admin-deposit-input').value = '-50000000';
    h.callFn('depositFunds');
    assert(h.getVar('userBalance') === prevBalance, `Negative deposit is rejected without balance change`);

    h.elements.get('admin-deposit-input').value = '0';
    h.callFn('depositFunds');
    assert(h.getVar('userBalance') === prevBalance, `Zero deposit is rejected without balance change`);

    h.elements.get('admin-deposit-input').value = '';
    h.callFn('depositFunds');
    assert(h.getVar('userBalance') === prevBalance, `Empty deposit is rejected without balance change`);
    assert(h.alerts.length === alertCountBefore + 4, `All 4 invalid deposits produced error alerts`);

    // 4. Tier Switching via Admin Console
    h.elements.get('admin-tier-select').value = 'RED';
    h.elements.get('admin-username-input').value = 'Operative Min-woo';
    h.callFn('saveAdminSettings');

    assert(h.getVar('userClearance') === 'RED', `Admin settings saved: userClearance updated to RED`);
    assert(h.getVar('userName') === 'Operative Min-woo', `Admin settings saved: userName updated to Operative Min-woo`);
    assert(h.elements.get('user-tier-badge').innerText === 'CODE RED', `Top HUD badge updated to CODE RED`);
    assert(h.elements.get('current-user-name').innerText === 'Operative Min-woo', `Top HUD name updated to Operative Min-woo`);
    assert(h.mockStorage.murthehelp_clearance === 'RED', `Clearance saved to localStorage as RED`);

    // Verify product access control when downgraded to RED
    h.callFn('setClearanceTab', 'GREEN');
    const greenGridHTML = h.elements.get('dark-products-grid').innerHTML;
    assert(greenGridHTML.includes('YÊU CẦU QUYỀN CODE GREEN'), `When user is RED, GREEN items are locked with 'YÊU CẦU QUYỀN CODE GREEN'`);

    // Upgrade back to GREEN
    h.elements.get('admin-tier-select').value = 'GREEN';
    h.callFn('saveAdminSettings');
    h.callFn('setClearanceTab', 'GREEN');
    const greenGridUnlocked = h.elements.get('dark-products-grid').innerHTML;
    assert(greenGridUnlocked.includes('+ ĐẶT MẶT HÀNG NÀY'), `When user is upgraded to GREEN, GREEN items are unlocked for order`);

    // 5. Blank Username Fallback
    h.elements.get('admin-username-input').value = '   ';
    h.callFn('saveAdminSettings');
    assert(h.getVar('userName') === 'Jeong Jin-man', `Blank admin username cleanly falls back to default 'Jeong Jin-man'`);

    // 6. Transaction Ledger Logging
    h.callFn('openTransactionsModal');
    assert(h.elements.get('transactions-modal').classList.contains('flex'), `openTransactionsModal() displays transaction logs modal`);
}

// ------------------------------------------------------------------------------
// SUITE 5: EMERGENCY ESC PANIC PROTOCOL ACROSS ALL STATES & MODALS
// ------------------------------------------------------------------------------
console.log(`\n${C.bold}▶ SUITE 5: EMERGENCY ESC PANIC PROTOCOL ACROSS ALL STATES & MODALS${C.reset}`);
{
    // Test Scenario A: ESC from Dark Mall with multiple modals open
    const h = createHarness();
    
    // Simulate Mall Entry
    h.callFn('triggerMurthehelpPortal');
    h.callFn('enterDarkMallFinal');
    assert(h.elements.get('dark-stage').classList.contains('flex'), `Dark Mall is active`);
    const webglBg = h.getVar('webglBg');
    assert(webglBg && webglBg.isRunning === true, `3D WebGL background is running`);

    // Open multiple modals
    h.callFn('openCartDrawer');
    h.callFn('openAdminModal');
    h.callFn('openF12Modal');
    h.callFn('openBlueprintModal', 'P020');
    h.callFn('openTransactionsModal');

    assert(!h.elements.get('cart-drawer-backdrop').classList.contains('hidden'), `Cart drawer is open`);
    assert(h.elements.get('admin-modal').classList.contains('flex'), `Admin modal is open`);
    assert(h.elements.get('f12-source-modal').classList.contains('flex'), `F12 modal is open`);
    assert(h.elements.get('blueprint-modal').classList.contains('flex'), `Blueprint modal is open`);
    assert(h.elements.get('transactions-modal').classList.contains('flex'), `Transactions modal is open`);

    // Trigger ESC Panic Key
    h.dispatchWindowEvent('keydown', { key: 'Escape' });

    // Assert complete containment & recovery
    assert(h.elements.get('dark-stage').classList.contains('hidden'), `Dark Mall is hidden after ESC`);
    assert(h.elements.get('portal-stage').classList.contains('hidden'), `Transit stage is hidden after ESC`);
    assert(h.elements.get('portal-alert').classList.contains('hidden'), `Portal alert is hidden after ESC`);
    assert(!h.elements.get('disguise-stage').classList.contains('hidden'), `Disguise storefront is restored after ESC`);
    assert(h.elements.get('main-body').style.backgroundColor === '#f8fafc', `Body background reset to disguise white (#f8fafc)`);
    assert(h.elements.get('disguise-search-input').value === '', `Disguise search input is wiped clean`);
    assert(h.getVar('webglBg').isRunning === false, `3D WebGL shader render loop stopped`);

    // Assert all modals closed
    assert(h.elements.get('cart-drawer-backdrop').classList.contains('hidden'), `Cart drawer closed`);
    assert(h.elements.get('admin-modal').classList.contains('hidden'), `Admin modal closed`);
    assert(h.elements.get('f12-source-modal').classList.contains('hidden'), `F12 modal closed`);
    assert(h.elements.get('blueprint-modal').classList.contains('hidden'), `Blueprint modal closed`);
    assert(h.elements.get('transactions-modal').classList.contains('hidden'), `Transactions modal closed`);
    assert(h.elements.get('dispatch-alert-modal').classList.contains('hidden'), `Dispatch alert modal closed`);

    // Test Scenario B: ESC while on Transit Screen
    const h2 = createHarness();
    h2.callFn('triggerMurthehelpPortal');
    assert(h2.elements.get('portal-stage').classList.contains('flex'), `Portal stage active`);
    h2.dispatchWindowEvent('keydown', { key: 'Escape' });
    assert(h2.elements.get('portal-stage').classList.contains('hidden'), `Portal stage immediately aborted on ESC`);
    assert(!h2.elements.get('disguise-stage').classList.contains('hidden'), `Disguise storefront restored`);

    // Test Scenario C: ESC while on Disguise Storefront (Safe no-op)
    const h3 = createHarness();
    h3.dispatchWindowEvent('keydown', { key: 'Escape' });
    assert(!h3.elements.get('disguise-stage').classList.contains('hidden'), `ESC from Disguise storefront safely retains storefront without errors`);
}

// ==============================================================================
// SUMMARY & VERDICT
// ==============================================================================
console.log(`\n${C.bold}${C.cyan}==============================================================================${C.reset}`);
console.log(`${C.bold}TEST EXECUTION SUMMARY${C.reset}`);
console.log(`${C.bold}${C.cyan}==============================================================================${C.reset}`);
console.log(`Total Verification Tests : ${totalTests}`);
console.log(`Passed                   : ${C.green}${passedTests}${C.reset}`);
console.log(`Failed                   : ${failedTests > 0 ? C.red : C.green}${failedTests}${C.reset}`);
console.log(`Success Rate             : ${C.bold}${((passedTests / totalTests) * 100).toFixed(1)}%${C.reset}`);
console.log(`${C.bold}${C.cyan}==============================================================================${C.reset}\n`);

if (failedTests === 0) {
    console.log(`${C.bold}${C.green}>>> EMPIRICAL VERIFICATION VERDICT: APPROVE <<<\n${C.reset}`);
    process.exit(0);
} else {
    console.log(`${C.bold}${C.red}>>> EMPIRICAL VERIFICATION VERDICT: REQUEST_CHANGES <<<\n${C.reset}`);
    process.exit(1);
}
