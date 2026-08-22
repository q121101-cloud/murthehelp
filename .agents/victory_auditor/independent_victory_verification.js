const fs = require('fs');
const path = require('path');
const vm = require('vm');

const htmlPath = path.resolve(__dirname, '../../index.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');

console.log("==============================================================================");
console.log("VICTORY AUDITOR — INDEPENDENT REQUIREMENT & INTEGRITY VERIFICATION SUITE");
console.log("==============================================================================");

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;

function assert(condition, message) {
    totalChecks++;
    if (condition) {
        passedChecks++;
        console.log(`  ✔ PASS: ${message}`);
    } else {
        failedChecks++;
        console.error(`  ✖ FAIL: ${message}`);
    }
}

// 1. Static Requirements & DOM checks
console.log("\n[1] Disguise Storefront & Branding (R1)");
assert(htmlContent.includes("NÔNG CỤ HỢP ĐỨC"), "Disguise title / header includes NÔNG CỤ HỢP ĐỨC");
assert(htmlContent.includes("HAMDEOK"), "Hamdeok Farming Tools branding present");
assert(htmlContent.includes("#HD-71092"), "High value order #HD-71092 alert present");
assert(htmlContent.includes("11.200") && htmlContent.includes("70.000.000 ₫"), "Order alert contains 11.200m hose and 70.000.000 ₫");
assert(htmlContent.includes('name="key" content="mh13543505"'), 'Meta tag name="key" content="mh13543505" present');
assert(htmlContent.includes('name="gateway" content="https://mhshoppingkill87689.dark/mh13543505"'), 'Meta tag name="gateway" present');
assert(htmlContent.includes("Xem mã nguồn trang (F12)"), "Discreet F12 modal button present in top bar");
assert(!htmlContent.includes("Vào chợ đen") && !htmlContent.includes("Go to Dark Mall"), "No overt dark web buttons exposed on default storefront");

console.log("\n[2] Transition Portal & Cinematic Transit (R2)");
assert(htmlContent.includes("#4a0005"), "Dark burgundy background #4a0005 configured for transit stage");
assert(htmlContent.includes("murthehelp"), "Lowercase murthehelp branding present");
assert(htmlContent.includes("#b3001e") && htmlContent.includes("#4d19bf") && htmlContent.includes("#e67e00"), "3-color horizontal clearance stripe colors present");
assert(htmlContent.includes("ĐÃ TỰ ĐỘNG ĐĂNG NHẬP"), "Auto-login notification modal text present");
assert(htmlContent.includes("XÁC NHẬN (확인)"), "Functional confirm trigger button text present");

console.log("\n[3] 3D WebGL Simplex Noise Shaders (R3)");
assert(htmlContent.includes("THREE.ShaderMaterial") || htmlContent.includes("ShaderMaterial"), "Three.js ShaderMaterial used for custom GLSL");
assert(htmlContent.includes("snoise(vec3 v)"), "GLSL Simplex noise function implemented");
assert(htmlContent.includes("u_fresnel_power"), "Fresnel power uniform implemented");
assert(htmlContent.includes("u_mouse") && htmlContent.includes("u_scroll"), "Mouse parallax & scroll uniforms implemented");
assert(htmlContent.includes("0xb3001e") && htmlContent.includes("0xffaa00"), "Code Red shader colors (Deep Crimson & Molten Gold) defined");
assert(htmlContent.includes("0x4d19bf") && htmlContent.includes("0xd946ef"), "Code Purple shader colors (Ultraviolet & Neon Orchid) defined");
assert(htmlContent.includes("0xe67e00") && htmlContent.includes("0xfacc15"), "Code Yellow shader colors (Radiant Amber & Solar Flare) defined");
assert(htmlContent.includes("0x00b37e") && htmlContent.includes("0x34d399"), "Code Green shader colors (Emerald Jade & Cyber Mint) defined");

console.log("\n[4] Covert Dispatch Logistics & Admin Management (R5 & R6)");
assert(htmlContent.includes("Drone Tàng Hình Ban Đêm"), "Dispatch Option 1 (Drone Tàng Hình) present");
assert(htmlContent.includes("Thùng Nông Cụ Ngụy Trang"), "Dispatch Option 2 (Thùng Nông Cụ Ngụy Trang) present");
assert(htmlContent.includes("Điểm Hẹn An Toàn Safehouse"), "Dispatch Option 3 (Điểm Hẹn An Toàn Safehouse) present");
assert(htmlContent.includes("Jeong Jin-man"), "Default Director account name Jeong Jin-man present");

// 2. Behavioral VM execution
console.log("\n[5] Behavioral Simulation in VM Sandbox");

const scriptRegex = /<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi;
let scriptsCode = '';
let scriptMatch;
while ((scriptMatch = scriptRegex.exec(htmlContent)) !== null) {
    if (!scriptMatch[1].includes('tailwind.config')) {
        scriptsCode += '\n' + scriptMatch[1];
    }
}

const mockStorage = {};
const mockElements = new Map();
const windowEvents = new Map();
const alerts = [];

function makeElem(id = '') {
    return {
        id,
        classList: {
            classes: new Set(),
            add(...c) { c.forEach(x => this.classes.add(x)); },
            remove(...c) { c.forEach(x => this.classes.delete(x)); },
            contains(x) { return this.classes.has(x); }
        },
        style: {},
        innerText: '',
        innerHTML: '',
        value: '',
        children: [],
        options: [
            { text: '🚁 Drone Tàng Hình Ban Đêm (Thả dù định vị GPS sai số < 0.5m)', value: 'drone' },
            { text: '📦 Thùng Nông Cụ Ngụy Trang (Vận chuyển xe tải chuyên dụng)', value: 'container' },
            { text: '📍 Điểm Hẹn An Toàn Safehouse (Tọa độ tự hủy sau 60 phút)', value: 'safehouse' }
        ],
        selectedIndex: 0,
        appendChild(child) { this.children.push(child); },
        addEventListener() {}
    };
}

const sandbox = {
    document: {
        getElementById(id) {
            if (!mockElements.has(id)) mockElements.set(id, makeElem(id));
            return mockElements.get(id);
        },
        createElement(tag) { return makeElem(''); }
    },
    window: {
        addEventListener(event, handler) {
            if (!windowEvents.has(event)) windowEvents.set(event, []);
            windowEvents.get(event).push(handler);
        },
        innerWidth: 1920,
        innerHeight: 1080,
        AudioContext: class {
            constructor() { this.currentTime = 0; this.state = 'running'; }
            createOscillator() { return { type: 'sine', frequency: { setValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect() {}, start() {}, stop() {} }; }
            createGain() { return { gain: { setValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect() {} }; }
            createBiquadFilter() { return { type: 'lowpass', frequency: { setValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect() {} }; }
            resume() {}
        }
    },
    localStorage: {
        getItem: (k) => mockStorage[k] || null,
        setItem: (k, v) => { mockStorage[k] = String(v); }
    },
    alert: (msg) => alerts.push(msg),
    console: { log() {}, warn() {}, error() {} },
    setTimeout: (fn) => fn(),
    clearTimeout: () => {},
    requestAnimationFrame: () => 1,
    THREE: {
        Color: class { constructor(h) { this.h = h; } clone() { return this; } copy() { return this; } lerp() { return this; } },
        Vector2: class {},
        WebGLRenderer: class { setPixelRatio() {} setSize() {} render() {} },
        Scene: class { add() {} },
        PerspectiveCamera: class { position = { z: 5 }; },
        IcosahedronGeometry: class {},
        ShaderMaterial: class {},
        Mesh: class { rotation = { x: 0, y: 0 }; position = { x: 0, y: 0 }; }
    },
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
vm.runInContext(scriptsCode, context);

const getVar = (name) => vm.runInContext(`typeof ${name} !== 'undefined' ? ${name} : undefined`, context);
const runFn = (expr) => vm.runInContext(expr, context);

// Catalog verification
const products = getVar('PRODUCTS_DB');
assert(Array.isArray(products) && products.length >= 40, `PRODUCTS_DB contains ${products ? products.length : 0} items (>=40 required)`);

const disguiseProds = getVar('DISGUISE_PRODUCTS');
assert(Array.isArray(disguiseProds) && disguiseProds.length >= 8, `DISGUISE_PRODUCTS contains ${disguiseProds ? disguiseProds.length : 0} items (>=8 required)`);

// Verify exact items requested in ORIGINAL_REQUEST.md
const expectedItems = [
    { id: 'P020', name: 'Colt M1911 Custom', price: 38500000, code: 'RED' },
    { id: 'P033', name: 'Glock 19 Gen 5 Blackout', price: 16500000, code: 'RED' },
    { id: 'P021', name: 'Tokarev TT-33', price: 21000000, code: 'RED' },
    { id: 'P022', name: 'Desert Eagle .50 AE Titan', price: 48000000, code: 'RED' },
    { id: 'R009', name: 'Smith & Wesson Model 686 .357', price: 42000000, code: 'RED' },
    { id: 'R018', name: 'Colt Python .357', price: 49500000, code: 'RED' },
    { id: 'R019', name: 'Chiappa Rhino 60DS', price: 46000000, code: 'RED' },
    { id: 'MG021', name: 'MAC-10 Compact Auto', price: 85000000, code: 'RED' },
    { id: 'SMG01', name: 'HK MP5 Navy Mod', price: 95000000, code: 'RED' },
    { id: 'SMG02', name: 'FN P90 Tactical', price: 115000000, code: 'RED' },
    { id: 'SNP01', name: 'AI AWM .338', price: 210000000, code: 'RED' },
    { id: 'SNP02', name: 'Barrett M82A1 .50 BMG', price: 340000000, code: 'RED' },
    { id: 'SNP03', name: 'CheyTac M200 Intervention', price: 450000000, code: 'RED' },
    { id: 'EXP01', name: 'Flashbang M84 x4', price: 16000000, code: 'RED' },
    { id: 'EXP02', name: 'C4 Kèm Kíp Nổ Từ Xa', price: 35000000, code: 'RED' },
    { id: 'MEL01', name: 'Dao CQC Tungsten', price: 12500000, code: 'RED' },
    { id: 'PUR01', name: 'Axit Sinh Học PX-70', price: 45000000, code: 'PURPLE' },
    { id: 'PUR02', name: 'Micro Drone Trinh Sát Tàng Hình', price: 68000000, code: 'PURPLE' },
    { id: 'PUR03', name: 'EMP Phá Sóng Quân Sự', price: 52000000, code: 'PURPLE' },
    { id: 'PUR04', name: 'Máy Quét Laser Xuyên Tường Quad-Eye', price: 78000000, code: 'PURPLE' },
    { id: 'PUR05', name: 'Vali Khử Từ Ổ Cứng Cleaner-Pro', price: 85000000, code: 'PURPLE' },
    { id: 'YEL01', name: 'Túi Sơ Cứu Chấn Thương IFAK', price: 14500000, code: 'YELLOW' },
    { id: 'YEL02', name: 'Serum Adrenaline Pro', price: 28000000, code: 'YELLOW' },
    { id: 'YEL03', name: 'Máy Khử Rung Tim AED-X', price: 32000000, code: 'YELLOW' },
    { id: 'YEL04', name: 'Băng Ép Cầm Máu Celox Pro', price: 18500000, code: 'YELLOW' },
    { id: 'YEL05', name: 'Keo Dán Vết Thương Sinh Học Bio-Glue', price: 18500000, code: 'YELLOW' },
    { id: 'GRN01', name: 'Khiên Graphene Cấp IV', price: 180000000, code: 'GREEN' },
    { id: 'GRN02', name: 'Biệt Đội Can Thiệp Vũ Trang 5 Phút', price: 850000000, code: 'GREEN' },
    { id: 'GRN03', name: 'Robot Tác Chiến Phòng Thủ Sentinel', price: 920000000, code: 'GREEN' },
    { id: 'GRN04', name: 'Giáp Titanium Exoskeleton', price: 450000000, code: 'GREEN' }
];

expectedItems.forEach(exp => {
    const item = products.find(p => p.id === exp.id);
    assert(item !== undefined, `Item ${exp.id} (${exp.name}) exists in PRODUCTS_DB`);
    if (item) {
        assert(item.price === exp.price, `Item ${exp.id} price matches ${exp.price} VNĐ (Observed: ${item.price})`);
        assert(item.code === exp.code, `Item ${exp.id} tier matches ${exp.code} (Observed: ${item.code})`);
    }
});

// Test Passcode Auth
const passcodes = ['mh13543505', 'GREEN', 'RED', 'PURPLE', 'YELLOW', 'JINMAN', '7209'];
passcodes.forEach(code => {
    mockElements.get('disguise-search-input').value = code;
    runFn('handleDisguiseSearch()');
    assert(mockElements.get('portal-stage').classList.contains('flex'), `Passcode "${code}" activates transit portal`);
    runFn('returnToDisguise()');
});

// Test Cart Operations & Balance Deduction
runFn("addToCart('P020')"); // 38.5M
runFn("addToCart('PUR01')"); // 45M
const initialBal = getVar('userBalance');
const cart = getVar('cart');
assert(cart.length === 2, "Cart contains 2 items");
const expectedCartTotal = 38500000 + 45000000;
const actualCartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
assert(actualCartTotal === expectedCartTotal, `Cart total matches ${expectedCartTotal} VNĐ`);

runFn('executeCheckout()');
const finalBal = getVar('userBalance');
assert(finalBal === initialBal - expectedCartTotal, `Balance deducted from ${initialBal} to ${initialBal - expectedCartTotal}`);
assert(getVar('cart').length === 0, "Cart cleared after checkout");
assert(getVar('transactions').length >= 1, "Transaction recorded in ledger");

// Test Admin Console & Emergency ESC Panic
runFn('openAdminModal()');
runFn('quickDeposit(500000000)');
assert(getVar('userBalance') === finalBal + 500000000, "Admin quickDeposit credited 500M VNĐ");

// Test ESC key
const keyListeners = windowEvents.get('keydown') || [];
keyListeners.forEach(h => h({ key: 'Escape', preventDefault() {} }));
assert(!mockElements.get('dark-stage').classList.contains('flex'), "Dark stage hidden after ESC");
assert(!mockElements.get('portal-stage').classList.contains('flex'), "Portal stage hidden after ESC");
assert(mockElements.get('disguise-stage').classList.contains('hidden') === false, "Disguise stage restored after ESC");

console.log("\n==============================================================================");
console.log(`AUDIT RESULTS: ${passedChecks} PASSED, ${failedChecks} FAILED (TOTAL: ${totalChecks})`);
console.log("==============================================================================");

if (failedChecks === 0) {
    console.log(">>> INDEPENDENT VICTORY AUDITOR VERDICT: VICTORY CONFIRMED <<<");
    process.exit(0);
} else {
    console.error(">>> INDEPENDENT VICTORY AUDITOR VERDICT: VICTORY REJECTED <<<");
    process.exit(1);
}
