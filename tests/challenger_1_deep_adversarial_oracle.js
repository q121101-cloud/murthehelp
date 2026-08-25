/**
 * CHALLENGER 1 — DEEP EMPIRICAL ADVERSARIAL ORACLE & BOUNDARY STRESS HARNESS
 * Comprehensive stress-testing of interactive mechanics, timing boundaries,
 * coupon algebra, search permutations, and emergency panic reversion.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

console.log("==============================================================================");
console.log("  MURTHEHELP // CHALLENGER 1 DEEP ADVERSARIAL ORACLE & BOUNDARY SUITE");
console.log("==============================================================================\n");

const htmlPath = path.join(__dirname, '..', 'index.html');
const htmlSource = fs.readFileSync(htmlPath, 'utf8');

// Extract script blocks
const scriptRegex = /<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi;
let scriptsCode = '';
let scriptMatch;
while ((scriptMatch = scriptRegex.exec(htmlSource)) !== null) {
    if (!scriptMatch[1].includes('tailwind.config')) {
        scriptsCode += '\n' + scriptMatch[1];
    }
}

// Setup simulated DOM sandbox
function createFreshEnvironment() {
    const elements = new Map();
    const alertLogs = [];
    const mockStorage = {};
    const windowListeners = new Map();
    const activeTimers = new Map();
    let fakeTimerId = 1;

    function createMockElement(id = '', tag = 'DIV') {
        return {
            id: id,
            tagName: tag.toUpperCase(),
            classList: {
                _classes: new Set(['hidden']),
                add(...cls) { cls.forEach(c => c && this._classes.add(c)); },
                remove(...cls) { cls.forEach(c => c && this._classes.delete(c)); },
                contains(c) { return this._classes.has(c); },
                toggle(c) { if (this.contains(c)) this.remove(c); else this.add(c); }
            },
            style: {},
            innerText: '',
            innerHTML: '',
            value: '',
            src: '',
            children: [],
            appendChild(child) { this.children.push(child); },
            addEventListener(event, handler) { this[`on${event}`] = handler; },
            selectedOptions: [{ text: 'Thừa Thiên Huế', value: 'hue' }]
        };
    }

    const defaultIds = [
        'main-body', 'disguise-stage', 'portal-stage', 'dark-stage',
        'disguise-search-input', 'disguise-products-grid',
        'f12-inspection-modal', 'product-detail-modal', 'cart-modal',
        'cart-drawer-backdrop', 'orders-modal', 'admin-modal',
        'cart-counter', 'cart-items-wrapper', 'cart-subtotal', 'cart-discount',
        'cart-total-final', 'cart-total-vnđ', 'cart-coupon-input',
        'checkout-province', 'delivery-method', 'orders-history-wrapper',
        'admin-tier-select', 'admin-username-input', 'admin-deposit-input',
        'admin-users-list', 'current-user-name', 'user-balance-display',
        'user-tier-badge', 'btn-admin-panel', 'detail-item-img', 'detail-item-name',
        'detail-item-specs', 'detail-item-code', 'detail-item-subcat',
        'detail-item-tier', 'detail-item-price', 'detail-btn-add-cart',
        'sub-category-list', 'dark-products-grid', 'current-view-heading',
        'item-count-display', 'sidebar-main-title', 'webgl-canvas',
        'tab-RED', 'tab-PURPLE', 'tab-YELLOW', 'tab-GREEN',
        'login-username', 'login-password', 'reg-fullname', 'reg-username', 'reg-password', 'reg-role',
        'auth-tab-login', 'auth-tab-register', 'auth-form-login', 'auth-form-register'
    ];

    defaultIds.forEach(id => {
        elements.set(id, createMockElement(id));
    });
    elements.get('disguise-stage').classList.remove('hidden');

    class MockColor {
        constructor(hex = 0x000000) { this.hex = hex; }
        clone() { return new MockColor(this.hex); }
        copy(c) { this.hex = (c && c.hex !== undefined) ? c.hex : c; return this; }
        setHex(h) { this.hex = h; return this; }
        lerp(c, alpha) { return this; }
    }

    const sandbox = {
        console: { log: () => {}, warn: () => {}, error: () => {}, info: () => {} },
        document: {
            getElementById: (id) => {
                if (!elements.has(id)) elements.set(id, createMockElement(id));
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
            innerWidth: 1440,
            innerHeight: 900,
            devicePixelRatio: 1,
            localStorage: {
                getItem: (k) => (mockStorage[k] !== undefined ? mockStorage[k] : null),
                setItem: (k, v) => { mockStorage[k] = String(v); },
                removeItem: (k) => { delete mockStorage[k]; },
                clear: () => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); }
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
        setTimeout: (fn, ms) => {
            const id = fakeTimerId++;
            activeTimers.set(id, { fn, ms });
            return id;
        },
        clearTimeout: (id) => { activeTimers.delete(id); },
        setInterval: () => 1,
        clearInterval: () => {},
        requestAnimationFrame: () => 1,
        THREE: {
            Color: MockColor,
            Scene: class { add() {} },
            PerspectiveCamera: class { position = { z: 5, set() {} }; updateProjectionMatrix() {} },
            WebGLRenderer: class { setPixelRatio() {} setSize() {} render() {} domElement = {}; },
            IcosahedronGeometry: class {},
            ShaderMaterial: class {},
            Mesh: class { rotation = { x: 0, y: 0 }; position = { x: 0, y: 0 }; }
        },
        supabase: { createClient: () => null },
        parseInt,
        parseFloat,
        isNaN,
        Date,
        Math,
        Array,
        Object,
        String,
        Number,
        Set,
        Map
    };

    sandbox.window.document = sandbox.document;
    sandbox.global = sandbox;

    const context = vm.createContext(sandbox);
    vm.runInContext(scriptsCode, context);

    return {
        context,
        sandbox,
        elements,
        alertLogs,
        activeTimers,
        windowListeners,
        run: (code) => vm.runInContext(code, context)
    };
}

let passed = 0;
let total = 0;

function test(name, fn) {
    total++;
    try {
        fn();
        console.log(`  ✔ PASS [CH1-${String(total).padStart(2, '0')}] ${name}`);
        passed++;
    } catch (err) {
        console.error(`  ✖ FAIL [CH1-${String(total).padStart(2, '0')}] ${name}`);
        console.error(`    Error: ${err.message}`);
        console.error(err.stack);
    }
}

console.log("▶ SUITE 1: TIMING BOUNDARIES & TRIPLE-CLICK STATE MACHINE");

test("Triple-click exact timeout boundary: expiry at 1500ms resets count to 0", () => {
    const env = createFreshEnvironment();
    env.run("handleSecretTripleClick()");
    assert.strictEqual(env.run("secretClickCount"), 1);
    assert.strictEqual(env.activeTimers.size, 1);

    // Simulate timer firing at 1500ms
    const timerEntry = [...env.activeTimers.values()][0];
    assert.strictEqual(timerEntry.ms, 1500);
    timerEntry.fn(); // execute callback

    assert.strictEqual(env.run("secretClickCount"), 0, "Counter should be reset to 0 after timer callback");
});

test("Rapid multi-click burst: 15 consecutive clicks triggers portal exactly 5 times and leaves 0 count", () => {
    const env = createFreshEnvironment();
    env.run("let portalTriggers = 0; triggerMurthehelpPortal = () => { portalTriggers++; };");

    for (let i = 0; i < 15; i++) {
        env.run("handleSecretTripleClick()");
    }
    const portalTriggers = env.run("portalTriggers");
    const count = env.run("secretClickCount");
    assert.strictEqual(portalTriggers, 5, `Expected 5 portal triggers, got ${portalTriggers}`);
    assert.strictEqual(count, 0, `Expected remaining count 0, got ${count}`);
});

test("Interrupted sequence: 2 clicks, timer expires, 1 click -> portal is NOT triggered", () => {
    const env = createFreshEnvironment();
    env.run("let triggered = false; triggerMurthehelpPortal = () => { triggered = true; };");

    env.run("handleSecretTripleClick(); handleSecretTripleClick();");
    assert.strictEqual(env.run("secretClickCount"), 2);

    // Timer expires
    const timer = [...env.activeTimers.values()][0];
    timer.fn();
    assert.strictEqual(env.run("secretClickCount"), 0);

    // 1 more click
    env.run("handleSecretTripleClick();");
    assert.strictEqual(env.run("secretClickCount"), 1);
    assert.strictEqual(env.run("triggered"), false, "Portal must not trigger after interrupted sequence");
});

console.log("\n▶ SUITE 2: COVERT SEARCH KEYWORDS PERMUTATIONS & CLEARANCE ASSIGNMENT");

const testKeywords = [
    { key: "  mh13543505  ", expectedRole: "GREEN" },
    { key: "ORDER_MH13543505_DISPATCH", expectedRole: "GREEN" },
    { key: "murderhelp", expectedRole: "GREEN" },
    { key: "MuRdErHeLp", expectedRole: "GREEN" },
    { key: "7209", expectedRole: "GREEN" },
    { key: "JINMAN", expectedRole: "GREEN" },
    { key: "red", expectedRole: "RED" },
    { key: "purple", expectedRole: "PURPLE" },
    { key: "yellow", expectedRole: "YELLOW" },
    { key: "green", expectedRole: "GREEN" },
    { key: "vietnam", expectedRole: "GREEN" },
    { key: "haclong", expectedRole: "GREEN" }
];

testKeywords.forEach(({ key, expectedRole }) => {
    test(`Search keyword "${key}" unlocks portal and sets userClearance=${expectedRole}`, () => {
        const env = createFreshEnvironment();
        env.elements.get('disguise-search-input').value = key;
        env.run("let portalTriggered = false; triggerMurthehelpPortal = () => { portalTriggered = true; };");

        env.run("handleDisguiseSearch()");
        const portalTriggered = env.run("portalTriggered");
        const userClearance = env.run("userClearance");
        assert.strictEqual(portalTriggered, true, `Keyword "${key}" should have triggered portal`);
        assert.strictEqual(userClearance, expectedRole, `Expected clearance ${expectedRole}, got ${userClearance}`);
    });
});

test("Non-secret search query is rejected with notification and does NOT open portal", () => {
    const env = createFreshEnvironment();
    env.elements.get('disguise-search-input').value = "ong thep cong nghiep phi 50";
    env.run("let portalTriggered = false; triggerMurthehelpPortal = () => { portalTriggered = true; };");

    env.run("handleDisguiseSearch()");
    assert.strictEqual(env.run("portalTriggered"), false, "Portal should NOT trigger for normal search");
    assert.strictEqual(env.alertLogs.length, 1);
    assert.ok(env.alertLogs[0].includes("Không có mặt hàng ống nước nào"));
});

console.log("\n▶ SUITE 3: COUPON ALGEBRA, CART INVARIANTS & PRICING DISCOUNTS");

test("Coupon JINMAN50: Exact 50% discount computed across odd, even, and multi-item totals", () => {
    const env = createFreshEnvironment();
    env.run(`
        currentUser = { role: 'GREEN', balance: 5000000000 };
        userClearance = 'GREEN';
        addToCart('RED-P01'); // 38.500.000
        addToCart('PUR-01');   // 45.000.000
        addToCart('YEL-01');   // 14.500.000
    `);

    const subtotal = 38500000 + 45000000 + 14500000; // 98.000.000
    assert.strictEqual(subtotal, 98000000);

    env.elements.get('cart-coupon-input').value = '  jinman50  ';
    env.run("applyCoupon()");

    const discount = env.run("appliedCouponDiscount");
    assert.strictEqual(discount, 50);

    const discountAmount = Math.round(subtotal * 0.5);
    const finalTotal = subtotal - discountAmount;
    assert.strictEqual(discountAmount, 49000000);
    assert.strictEqual(finalTotal, 49000000);

    // Verify DOM text formatting
    const finalTotalText = env.elements.get('cart-total-final').innerText;
    assert.strictEqual(finalTotalText, '49.000.000 ₫');
});

test("Coupon VIETNAM/HUE: 25% discount, HACLONG: 15% discount, invalid: 0%", () => {
    const env = createFreshEnvironment();
    env.elements.get('cart-coupon-input').value = 'VIETNAM';
    env.run("applyCoupon()");
    assert.strictEqual(env.run("appliedCouponDiscount"), 25);

    env.elements.get('cart-coupon-input').value = 'HUE';
    env.run("applyCoupon()");
    assert.strictEqual(env.run("appliedCouponDiscount"), 25);

    env.elements.get('cart-coupon-input').value = 'HACLONG';
    env.run("applyCoupon()");
    assert.strictEqual(env.run("appliedCouponDiscount"), 15);

    env.elements.get('cart-coupon-input').value = 'EXPIRED_CODE';
    env.run("applyCoupon()");
    assert.strictEqual(env.run("appliedCouponDiscount"), 0);
});

test("Item removal from cart dynamically updates subtotal and recalculates coupon discount", () => {
    const env = createFreshEnvironment();
    env.run(`
        currentUser = { role: 'GREEN', balance: 5000000000 };
        userClearance = 'GREEN';
        addToCart('RED-P01'); // 38.500.000
        addToCart('PUR-01');   // 45.000.000
    `);
    env.elements.get('cart-coupon-input').value = 'JINMAN50';
    env.run("applyCoupon()");

    assert.strictEqual(env.elements.get('cart-total-final').innerText, '41.750.000 ₫'); // (38.5M + 45M) * 0.5 = 41.75M

    // Remove PUR-01 (index 1)
    env.run("changeCartItemQty(1, -999)");
    assert.strictEqual(env.run("cart.length"), 1);
    assert.strictEqual(env.elements.get('cart-total-final').innerText, '19.250.000 ₫'); // 38.5M * 0.5 = 19.25M
});

console.log("\n▶ SUITE 4: EMERGENCY PANIC REVERSION (ESCAPE PROTOCOL)");

test("Global Escape key cleanly reverts all stages, closes all modals, resets body color and search input", () => {
    const env = createFreshEnvironment();
    env.run(`
        triggerMurthehelpPortal();
        currentUser = { role: 'GREEN', name: 'Commander Q', balance: 2000000000 };
        unlockDarkMall(currentUser, 'GREEN');
        openCartModal();
        openProductDetailModal('RED-P01');
        openF12InspectionModal();
        openAdminModal();
        openOrdersModal();
    `);

    // Verify modals were open and stage is dark
    assert.strictEqual(env.elements.get('dark-stage').classList.contains('hidden'), false);
    assert.strictEqual(env.elements.get('disguise-stage').classList.contains('hidden'), true);
    assert.strictEqual(env.elements.get('cart-modal').classList.contains('hidden'), false);

    // Trigger ESC event
    const escEvent = { key: 'Escape', preventDefault: () => {} };
    const keydownListeners = env.windowListeners.get('win:keydown') || [];
    assert.ok(keydownListeners.length > 0, "Window keydown listeners must exist");
    keydownListeners.forEach(fn => fn(escEvent));

    // Assert complete reversion
    assert.strictEqual(env.elements.get('disguise-stage').classList.contains('hidden'), false, "Disguise stage must be visible");
    assert.strictEqual(env.elements.get('dark-stage').classList.contains('hidden'), true, "Dark stage must be hidden");
    assert.strictEqual(env.elements.get('portal-stage').classList.contains('hidden'), true, "Portal stage must be hidden");
    assert.strictEqual(env.elements.get('cart-modal').classList.contains('hidden'), true, "Cart modal must be hidden");
    assert.strictEqual(env.elements.get('product-detail-modal').classList.contains('hidden'), true, "Product detail modal must be hidden");
    assert.strictEqual(env.elements.get('admin-modal').classList.contains('hidden'), true, "Admin modal must be hidden");
    assert.strictEqual(env.elements.get('orders-modal').classList.contains('hidden'), true, "Orders modal must be hidden");
    assert.strictEqual(env.elements.get('f12-inspection-modal').classList.contains('hidden'), true, "F12 modal must be hidden");
    assert.strictEqual(env.elements.get('main-body').style.backgroundColor, '#f8fafc', "Body background must reset to #f8fafc");
    assert.strictEqual(env.elements.get('disguise-search-input').value, '', "Search input must be cleared");
});

console.log("\n▶ SUITE 5: ROLE-BASED ACCESS CONTROL & ESCROW DEDUCTION INTEGRITY");

test("Clearance enforcement: RED operative blocked from adding GREEN / YELLOW / PURPLE products", () => {
    const env = createFreshEnvironment();
    env.run(`
        currentUser = { role: 'RED', balance: 50000000 };
        userClearance = 'RED';
        addToCart('RED-P01'); // RED -> should succeed
    `);
    assert.strictEqual(env.run("cart.length"), 1);

    env.run("addToCart('PUR-01')");  // PURPLE -> should fail
    assert.strictEqual(env.run("cart.length"), 1);

    env.run("addToCart('YEL-01')");  // YELLOW -> should fail
    assert.strictEqual(env.run("cart.length"), 1);

    env.run("addToCart('GRN-01')");  // GREEN -> should fail
    assert.strictEqual(env.run("cart.length"), 1);

    assert.ok(env.alertLogs.some(a => a.includes('YÊU CẦU PHÂN QUYỀN')));
});

test("Checkout balance rejection: balance < total rejects checkout with alert, balance intact", () => {
    const env = createFreshEnvironment();
    env.run(`
        currentUser = { role: 'GREEN', balance: 30000000 }; // 30M balance
        userBalance = 30000000;
        userClearance = 'GREEN';
        addToCart('RED-P01'); // 38.5M price
    `);
    assert.strictEqual(env.run("cart.length"), 1);

    env.run("executeCheckout()");
    assert.strictEqual(env.run("currentUser.balance"), 30000000, "Balance must remain unchanged on rejection");
    assert.strictEqual(env.run("cart.length"), 1, "Cart must remain intact on rejection");
    assert.ok(env.alertLogs.some(a => a.includes('SỐ DƯ TÀI KHOẢN KHÔNG ĐỦ')));
});

test("Successful checkout deductions, order persistence, coupon reset, and cart cleanout", () => {
    const env = createFreshEnvironment();
    env.run(`
        currentUser = { role: 'GREEN', balance: 2000000000, username: 'q121101' };
        userBalance = 2000000000;
        currentUserId = 'q121101';
        userClearance = 'GREEN';
        addToCart('RED-P01'); // 38.5M
    `);
    env.elements.get('cart-coupon-input').value = 'JINMAN50';
    env.run("applyCoupon()");

    const expectedTotal = 19250000;
    env.run("executeCheckout()");

    assert.strictEqual(env.run("currentUser.balance"), 2000000000 - expectedTotal);
    assert.strictEqual(env.run("cart.length"), 0, "Cart must be cleared after checkout");
    assert.strictEqual(env.run("appliedCouponDiscount"), 0, "Coupon discount must be reset to 0");

    const orders = env.run("getStoredOrders()");
    assert.strictEqual(orders.length, 1);
    assert.strictEqual(orders[0].total, expectedTotal);
    assert.ok(orders[0].trackingId.startsWith('TRACK-'));
});

console.log("\n==============================================================================");
console.log(`TOTAL CHALLENGER 1 ADVERSARIAL TESTS: ${total}`);
console.log(`PASSED: ${passed} | FAILED: ${total - passed}`);
console.log(`VERDICT: ${passed === total ? 'ALL ADVERSARIAL CHALLENGES PASSED (100% APPROVE)' : 'FAILED'}`);
console.log("==============================================================================");

if (passed !== total) {
    process.exit(1);
}
