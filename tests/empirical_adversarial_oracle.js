/**
 * ==============================================================================
 * CHALLENGER 2: ADVERSARIAL FUZZING, ORACLES & EDGE-CASE GENERATOR
 * ==============================================================================
 * Additional adversarial attack scenarios:
 * 1. Malicious input fuzzing (XSS, SQLi, control characters, emoji) in search & auth
 * 2. Currency formatter stress on numerical extremes & boundary values
 * 3. Cart permutation generator & invariant oracle across random product subsets
 * 4. Multi-cycle rapid state machine transitions (Re-entry torture test)
 * ==============================================================================
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const HTML_FILE = path.join(__dirname, '../index.html');
const htmlContent = fs.readFileSync(HTML_FILE, 'utf-8');

let passed = 0;
let failed = 0;

function assert(cond, msg) {
    if (cond) {
        passed++;
        console.log(`  \x1b[32m✔ PASS\x1b[0m ${msg}`);
    } else {
        failed++;
        console.log(`  \x1b[31m✖ FAIL\x1b[0m ${msg}`);
    }
}

function createHarness() {
    const alerts = [];
    const elements = new Map();
    const mockStorage = {};

    function createMockElement(id = '', tag = 'DIV') {
        const classSet = new Set();
        return {
            id,
            tagName: tag.toUpperCase(),
            classList: {
                add(...cls) { cls.forEach(c => c && classSet.add(c)); },
                remove(...cls) { cls.forEach(c => c && classSet.delete(c)); },
                contains(c) { return classSet.has(c); },
                toggle(c) { if (classSet.has(c)) classSet.delete(c); else classSet.add(c); }
            },
            style: {},
            innerText: '',
            _innerHTML: '',
            get innerHTML() {
                if (this.children.length > 0) return this.children.map(c => c.innerHTML || '').join('');
                return this._innerHTML || '';
            },
            set innerHTML(val) { this._innerHTML = val; if (val === '') this.children = []; },
            value: '',
            children: [],
            options: [{ text: 'Stealth Drone', value: 'drone' }],
            selectedIndex: 0,
            get selectedOptions() { return [this.options[this.selectedIndex] || this.options[0]]; },
            addEventListener() {},
            appendChild(c) { this.children.push(c); },
            click() {}
        };
    }

    const docMock = {
        getElementById(id) {
            if (!elements.has(id)) elements.set(id, createMockElement(id));
            return elements.get(id);
        },
        createElement(tag) { return createMockElement('', tag); },
        querySelectorAll() { return []; },
        addEventListener() {}
    };

    const winMock = {
        innerWidth: 1920,
        innerHeight: 1080,
        addEventListener() {},
        AudioContext: class {
            constructor() { this.currentTime = 0; }
            createOscillator() { return { connect() {}, start() {}, stop() {}, frequency: { setValueAtTime() {} } }; }
            createGain() { return { connect() {}, gain: { setValueAtTime() {} } }; }
            createBiquadFilter() { return { connect() {}, frequency: { setValueAtTime() {} } }; }
        }
    };

    const storageMock = {
        getItem(k) { return mockStorage[k] !== undefined ? mockStorage[k] : null; },
        setItem(k, v) { mockStorage[k] = String(v); },
        removeItem(k) { delete mockStorage[k]; },
        clear() { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); }
    };

    const scriptMatch = htmlContent.match(/<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/gi);
    const mainScript = scriptMatch ? scriptMatch[scriptMatch.length - 1].replace(/<\/?script[^>]*>/gi, '') : '';

    const sandbox = {
        window: winMock,
        document: docMock,
        localStorage: storageMock,
        THREE: {
            Color: class { constructor() {} setHex() { return this; } lerp() { return this; } },
            Scene: class { add() {} },
            PerspectiveCamera: class { constructor() { this.position = {}; } updateProjectionMatrix() {} },
            WebGLRenderer: class { setSize() {} setPixelRatio() {} render() {} },
            IcosahedronGeometry: class {},
            ShaderMaterial: class { constructor(o) { this.uniforms = o.uniforms || {}; } },
            Mesh: class { constructor() { this.rotation = {}; this.position = {}; } }
        },
        lucide: { createIcons() {} },
        console: { log() {}, warn() {}, error() {} },
        setTimeout(fn) { if (typeof fn === 'function') fn(); return 1; },
        clearTimeout() {},
        requestAnimationFrame() {},
        supabase: null,
        alert(m) { alerts.push(m); },
        Date, Math, parseInt, parseFloat, isNaN, Object, Array, String, Number, JSON, RegExp
    };

    const context = vm.createContext(sandbox);
    vm.runInContext(mainScript, context);

    return {
        context,
        elements,
        alerts,
        getVar: (name) => vm.runInContext(`typeof ${name} !== 'undefined' ? ${name} : undefined`, context),
        setVar: (name, val) => { vm.runInContext(`${name} = ${JSON.stringify(val)};`, context); },
        callFn: (name, ...args) => {
            const argsStr = args.map(a => JSON.stringify(a)).join(', ');
            return vm.runInContext(`${name}(${argsStr});`, context);
        }
    };
}

async function runOracleTests() {
    console.log('\n\x1b[1m==============================================================================\x1b[0m');
    console.log('\x1b[1m  ADVERSARIAL FUZZING, ORACLES & PERMUTATION STRESS HARNESS\x1b[0m');
    console.log('\x1b[1m==============================================================================\x1b[0m\n');

    const h = createHarness();
    const tactical = h.getVar('PRODUCTS_DB') || [];

    // ORACLE 1: Adversarial Search Fuzzing
    console.log('\x1b[36m▶ ORACLE 1: ADVERSARIAL SEARCH FUZZING (XSS, Unicode, Control Chars)\x1b[0m');
    const fuzzPayloads = [
        '<script>alert(1)</script>',
        '"><img src=x onerror=alert(1)>',
        '\' OR \'1\'=\'1',
        '\\x00\\x1f\\x7f',
        '🔥⚔️🔫💣🧨',
        '   \t\r\n   ',
        'A'.repeat(5000)
    ];

    fuzzPayloads.forEach((payload, idx) => {
        h.elements.get('disguise-search-input').value = payload;
        h.alerts.length = 0;
        let crashed = false;
        try {
            h.callFn('handleDisguiseSearch');
        } catch (e) {
            crashed = true;
        }
        assert(!crashed, `Disguise search survived fuzz payload #${idx + 1} (${payload.slice(0, 25)}...) without runtime crash`);
    });

    // ORACLE 2: Mathematical Invariant Oracle across 100 Random Cart Combinations
    console.log('\n\x1b[36m▶ ORACLE 2: MATHEMATICAL INVARIANT ORACLE (100 Random Cart Permutations)\x1b[0m');
    let mathErrors = 0;
    for (let iter = 0; iter < 100; iter++) {
        h.setVar('cart', []);
        h.setVar('userClearance', 'GREEN');
        
        // Pick 1 to 10 random items
        const numItems = Math.floor(Math.random() * 10) + 1;
        let expectedSubtotal = 0;
        const chosen = [];

        for (let j = 0; j < numItems; j++) {
            const randomItem = tactical[Math.floor(Math.random() * tactical.length)];
            const qty = Math.floor(Math.random() * 5) + 1;
            chosen.push({ ...randomItem, quantity: qty, qty });
            expectedSubtotal += randomItem.price * qty;
        }

        h.setVar('cart', chosen);
        
        // Random coupon: 0%, 15%, 25%, 50%
        const coupons = [0, 15, 25, 50];
        const coupon = coupons[Math.floor(Math.random() * coupons.length)];
        h.setVar('appliedCouponDiscount', coupon);

        h.callFn('renderCartList');

        const expectedDiscount = Math.round(expectedSubtotal * (coupon / 100));
        const expectedFinal = expectedSubtotal - expectedDiscount;

        const renderedSubtotal = h.elements.get('cart-subtotal').innerText;
        const renderedFinal = h.elements.get('cart-total-final').innerText;

        if (renderedSubtotal !== expectedSubtotal.toLocaleString('vi-VN') + ' ₫' ||
            renderedFinal !== expectedFinal.toLocaleString('vi-VN') + ' ₫') {
            mathErrors++;
        }
    }
    assert(mathErrors === 0, `100/100 random cart permutations satisfied exact VNĐ integer invariant (0 rounding discrepancies)`);

    // ORACLE 3: Rapid Stage Transition Stress Test (50 Consecutive Cycles)
    console.log('\n\x1b[36m▶ ORACLE 3: RAPID STAGE TRANSITION TORTURE TEST (50 Re-Entry Cycles)\x1b[0m');
    let transitionFailures = 0;
    for (let c = 0; c < 50; c++) {
        // Disguise -> Portal (via 3 clicks)
        h.setVar('secretClickCount', 2);
        h.callFn('handleSecretTripleClick');
        if (!h.elements.get('portal-stage').classList.contains('flex')) transitionFailures++;

        // Portal -> Dark
        h.callFn('enterDarkMallFinal');
        if (!h.elements.get('dark-stage').classList.contains('flex')) transitionFailures++;

        // Dark -> Disguise
        h.callFn('returnToDisguise');
        if (h.elements.get('disguise-stage').classList.contains('hidden')) transitionFailures++;
    }
    assert(transitionFailures === 0, `50/50 stage transition lifecycles completed without state corruption`);

    // ORACLE 4: Extreme Balance & Draining Simulation
    console.log('\n\x1b[36m▶ ORACLE 4: EXTREME BALANCE & RAPID CHECKOUT DRAINING SIMULATION\x1b[0m');
    const startBal = 100000000; // 100M VND
    h.setVar('userBalance', startBal);
    h.setVar('currentUser', { name: 'Operative', role: 'RED', balance: startBal });
    h.setVar('currentUserId', 'sniper_red');

    const cheapItem = tactical.find(p => p.price <= 20000000 && p.code === 'RED'); // e.g. 16.5M
    let purchaseCount = 0;
    while (h.getVar('userBalance') >= cheapItem.price) {
        h.setVar('cart', [{ ...cheapItem, quantity: 1, qty: 1 }]);
        h.callFn('executeCheckout');
        purchaseCount++;
    }

    assert(purchaseCount === Math.floor(startBal / cheapItem.price),
        `Consecutive checkouts correctly drained balance across ${purchaseCount} orders down to ${h.getVar('userBalance').toLocaleString('vi-VN')} ₫`);

    // Next checkout must fail due to insufficient balance
    h.setVar('cart', [{ ...cheapItem, quantity: 1, qty: 1 }]);
    h.alerts.length = 0;
    h.callFn('executeCheckout');
    assert(h.alerts.some(a => a.includes('SỐ DƯ TÀI KHOẢN KHÔNG ĐỦ')), `Final checkout correctly rejected when balance (${h.getVar('userBalance').toLocaleString('vi-VN')} ₫) < price (${cheapItem.price.toLocaleString('vi-VN')} ₫)`);

    console.log('\n\x1b[1m==============================================================================\x1b[0m');
    console.log(`Oracle Tests Run: ${passed + failed}, Passed: \x1b[32m${passed}\x1b[0m, Failed: \x1b[31m${failed}\x1b[0m`);
    console.log('\x1b[1m==============================================================================\x1b[0m\n');

    if (failed > 0) process.exit(1);
}

runOracleTests().catch(err => {
    console.error('Oracle fatal error:', err);
    process.exit(1);
});
