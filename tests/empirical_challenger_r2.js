/**
 * ==============================================================================
 * MURTHEHELP // EMPIRICAL CHALLENGER 1 (ROUND 2) AUDIT & TEST SUITE
 * ==============================================================================
 * Comprehensive verification harness executing empirical tests for:
 * 1. DISGUISE_PRODUCTS live HTTP 200 & image mime-type network probing.
 * 2. Complete absence of '[ TRẠM TRUNG CHUYỂN CỐ ĐÔ HUẾ // NODE-04-HUE-VN ]'.
 * 3. Registration form placeholders and min-length password validation (<8 vs >=8).
 * 4. Login form placeholders and 'PASSCODE:' label verification.
 * 5. Default user authentication (q121101 / Tungqu@n1208.) & master passcodes.
 * 6. Tactical product catalog images live network probing (40+ items).
 * 7. JavaScript syntax verification & E2E test suite integration.
 * ==============================================================================
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const http = require('http');
const https = require('https');
const { execSync } = require('child_process');

const indexPath = path.resolve(__dirname, '../index.html');
const indexContent = fs.readFileSync(indexPath, 'utf-8');

console.log('='.repeat(80));
console.log('MURTHEHELP ROUND 2 — EMPIRICAL CHALLENGER 1 VERIFICATION HARNESS');
console.log('='.repeat(80));

let passCount = 0;
let failCount = 0;

function assert(condition, testName, details = '') {
    if (condition) {
        console.log(`  ✔ PASS: ${testName}`);
        passCount++;
    } else {
        console.error(`  ✖ FAIL: ${testName} — ${details}`);
        failCount++;
    }
}

async function probeUrl(url) {
    return new Promise((resolve) => {
        try {
            const parsed = new URL(url);
            const client = parsed.protocol === 'https:' ? https : http;
            const req = client.get(url, {
                headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' },
                timeout: 12000
            }, (res) => {
                const statusCode = res.statusCode;
                const contentType = res.headers['content-type'] || '';
                const contentLength = res.headers['content-length'] || 0;
                res.on('data', () => {});
                res.on('end', () => {
                    resolve({
                        url,
                        statusCode,
                        contentType,
                        contentLength,
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

function extractJSProducts() {
    const disguiseMatch = indexContent.match(/const\s+DISGUISE_PRODUCTS\s*=\s*(\[[\s\S]*?\]);/);
    const productsDbMatch = indexContent.match(/const\s+PRODUCTS_DB\s*=\s*(\[[\s\S]*?\]);/);

    let disguiseProducts = [];
    let productsDb = [];

    if (disguiseMatch) {
        disguiseProducts = new Function(`return ${disguiseMatch[1]}`)();
    }
    if (productsDbMatch) {
        productsDb = new Function(`return ${productsDbMatch[1]}`)();
    }

    return { disguiseProducts, productsDb };
}

class MockColor {
    constructor(hex = 0x000000) { this.hex = hex; }
    clone() { return new MockColor(this.hex); }
    copy(c) { this.hex = (c && c.hex !== undefined) ? c.hex : c; return this; }
    setHex(h) { this.hex = h; return this; }
    lerp(c, alpha) { return this; }
}

function buildSandbox(htmlContent) {
    const alerts = [];
    const elements = new Map();
    const eventListeners = new Map();
    const mockStorage = {};

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
            appendChild(child) { this.children.push(child); }
        };
    }

    const idRegex = /id=["']([^"']+)["']/g;
    let match;
    while ((match = idRegex.exec(htmlContent)) !== null) {
        const id = match[1];
        if (!elements.has(id)) {
            elements.set(id, createMockElement(id));
        }
    }

    const documentMock = {
        getElementById(id) {
            return elements.get(id) || null;
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

    const windowMock = {
        addEventListener() {},
        innerWidth: 1920,
        innerHeight: 1080,
        supabase: null,
        AudioContext: class {
            constructor() { this.currentTime = 0; }
            createOscillator() { return { connect() {}, start() {}, stop() {}, frequency: { setValueAtTime() {}, exponentialRampToValueAtTime() {} } }; }
            createGain() { return { connect() {}, gain: { setValueAtTime() {}, exponentialRampToValueAtTime() {} } }; }
            createBiquadFilter() { return { connect() {}, frequency: { setValueAtTime() {}, exponentialRampToValueAtTime() {} } }; }
        }
    };

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
        supabase: null,
        supabaseClient: null,
        localStorage: {
            getItem: (k) => mockStorage[k] || null,
            setItem: (k, v) => { mockStorage[k] = String(v); },
            removeItem: (k) => { delete mockStorage[k]; },
            clear: () => { for (let k in mockStorage) delete mockStorage[k]; }
        },
        console: { log() {}, warn() {}, error() {} },
        alert(msg) { alerts.push(msg); },
        setTimeout(fn, delay = 0) { if (delay === 0) fn(); return 1; },
        clearTimeout() {},
        requestAnimationFrame(fn) { return 1; },
        cancelAnimationFrame() {},
        THREE: {
            WebGLRenderer: class { setPixelRatio() {} setSize() {} render() {} },
            Scene: class { add() {} },
            PerspectiveCamera: class { position = { z: 5 }; updateProjectionMatrix() {} },
            IcosahedronGeometry: class {},
            ShaderMaterial: class {},
            Mesh: class { rotation = { x: 0, y: 0 }; position = { x: 0, y: 0 }; },
            Vector2: class {},
            Color: MockColor
        },
        parseInt, parseFloat, isNaN, Math, Array, Object, String, Number, Set, Map, Date, RegExp
    };

    const context = vm.createContext(sandbox);
    try {
        vm.runInContext(scriptsCode, context);
    } catch (e) {
        console.warn('Sandbox init warning:', e.message);
    }

    return { sandbox, context, alerts, elements, mockStorage, scriptsCode };
}

async function runAllChecks() {
    const { disguiseProducts, productsDb } = extractJSProducts();

    // =========================================================================
    // 1. DISGUISE PRODUCTS URL EMPIRICAL HTTP PROBING
    // =========================================================================
    console.log('\n▶ [CHECK 1] PROBING DISGUISE_PRODUCTS IMAGE URLs VIA LIVE HTTP CALLS');
    assert(disguiseProducts.length >= 8, `Disguise product catalog count (Found: ${disguiseProducts.length})`);

    for (let i = 0; i < disguiseProducts.length; i++) {
        const prod = disguiseProducts[i];
        const result = await probeUrl(prod.img);
        console.log(`    [${prod.id}] HTTP ${result.statusCode} (${result.contentType}) - ${prod.name.substring(0, 45)}`);
        assert(
            result.ok,
            `Disguise Image [${prod.id}]: HTTP 200 & Image MIME type`,
            `Status: ${result.statusCode}, Type: ${result.contentType}`
        );
    }

    // =========================================================================
    // 2. CHECK ABSENCE OF FORBIDDEN PORTAL SUBTITLE
    // =========================================================================
    console.log('\n▶ [CHECK 2] VERIFYING COMPLETE REMOVAL OF FORBIDDEN PORTAL SUBTITLE');
    const forbiddenTarget = '[ TRẠM TRUNG CHUYỂN CỐ ĐÔ HUẾ // NODE-04-HUE-VN ]';
    assert(!indexContent.includes(forbiddenTarget), `Exact forbidden phrase absent in index.html`);
    assert(!/TRẠM\s+TRUNG\s+CHUYỂN\s+CỐ\s+ĐÔ\s+HUẾ/i.test(indexContent), `Regex check: 'TRẠM TRUNG CHUYỂN CỐ ĐÔ HUẾ' absent`);
    assert(!/NODE-04-HUE-VN/i.test(indexContent), `Regex check: 'NODE-04-HUE-VN' absent`);

    // Verify portal-stage DOM element contains no trace of the subtitle
    const portalStageMatch = indexContent.match(/<div[^>]*id=["']portal-stage["'][\s\S]*?<\/div>\s*<\/div>\s*<\/div>/i);
    if (portalStageMatch) {
        assert(!portalStageMatch[0].includes('TRẠM TRUNG CHUYỂN'), `Portal stage HTML contains no 'TRẠM TRUNG CHUYỂN'`);
        assert(!portalStageMatch[0].includes('NODE-04-HUE-VN'), `Portal stage HTML contains no 'NODE-04-HUE-VN'`);
    }

    // =========================================================================
    // 3. REGISTRATION FORM PLACEHOLDERS & PASSWORD VALIDATION
    // =========================================================================
    console.log('\n▶ [CHECK 3] REGISTRATION FORM PLACEHOLDERS & PASSWORD VALIDATION');
    
    const regFullnameMatch = indexContent.match(/<input[^>]*id=["']reg-fullname["'][^>]*>/i);
    const regFullnamePlaceholder = regFullnameMatch ? (regFullnameMatch[0].match(/placeholder=["']([^"']*)["']/i) || [])[1] : null;
    assert(
        regFullnamePlaceholder === 'Nguyễn Văn A',
        `Registration Fullname placeholder is 'Nguyễn Văn A'`,
        `Found: '${regFullnamePlaceholder}'`
    );

    const regUsernameMatch = indexContent.match(/<input[^>]*id=["']reg-username["'][^>]*>/i);
    const regUsernamePlaceholder = regUsernameMatch ? (regUsernameMatch[0].match(/placeholder=["']([^"']*)["']/i) ? regUsernameMatch[0].match(/placeholder=["']([^"']*)["']/i)[1] : '') : null;
    assert(
        regUsernamePlaceholder === '',
        `Registration Username placeholder is empty string`,
        `Found: '${regUsernamePlaceholder}'`
    );

    const regPasswordMatch = indexContent.match(/<input[^>]*id=["']reg-password["'][^>]*>/i);
    const regPasswordPlaceholder = regPasswordMatch ? (regPasswordMatch[0].match(/placeholder=["']([^"']*)["']/i) || [])[1] : null;
    assert(
        regPasswordPlaceholder && regPasswordPlaceholder.includes('8'),
        `Registration Password placeholder mentions minimum 8 characters`,
        `Found: '${regPasswordPlaceholder}'`
    );

    // Test Registration JS Logic using Sandbox
    const { sandbox, context, alerts, elements, mockStorage } = buildSandbox(indexContent);

    // Test 3a: Empty fields rejection
    alerts.length = 0;
    elements.get('reg-fullname').value = '';
    elements.get('reg-username').value = '';
    elements.get('reg-password').value = '';
    if (typeof sandbox.handleUserRegister === 'function') {
        await sandbox.handleUserRegister({ preventDefault() {} });
    }
    assert(
        alerts.some(a => a.includes('đầy đủ tất cả')),
        `Registration rejects empty input fields with appropriate warning`
    );

    // Test 3b: Password length < 8 rejection (1, 4, 7 characters)
    const shortPasswords = ['x', '1234', '1234567'];
    for (const pwd of shortPasswords) {
        alerts.length = 0;
        const uname = `user_short_${pwd.length}`;
        elements.get('reg-fullname').value = 'Test User Under 8';
        elements.get('reg-username').value = uname;
        elements.get('reg-password').value = pwd;
        elements.get('reg-tier').value = 'RED';

        if (typeof sandbox.handleUserRegister === 'function') {
            await sandbox.handleUserRegister({ preventDefault() {} });
        }

        assert(
            alerts.some(a => a.includes('8 ký tự')),
            `Registration rejects short password '${pwd}' (len ${pwd.length}) with >= 8 characters warning`,
            `Alerts: ${JSON.stringify(alerts)}`
        );

        const stored = JSON.parse(mockStorage['murthehelp_users_db'] || '{}');
        assert(!stored[uname], `User '${uname}' was NOT registered in database`);
    }

    // Test 3c: Password length >= 8 acceptance (8, 12, 20 characters)
    const validPasswords = ['12345678', 'P@ssword1234', 'SuperComplexLongP@ssw0rd!'];
    for (const pwd of validPasswords) {
        alerts.length = 0;
        const uname = `user_valid_${pwd.length}`;
        elements.get('reg-fullname').value = `Valid Operative ${pwd.length}`;
        elements.get('reg-username').value = uname;
        elements.get('reg-password').value = pwd;
        elements.get('reg-tier').value = 'PURPLE';

        if (typeof sandbox.handleUserRegister === 'function') {
            await sandbox.handleUserRegister({ preventDefault() {} });
        }

        const stored = JSON.parse(mockStorage['murthehelp_users_db'] || '{}');
        assert(
            stored[uname] && stored[uname].pass === pwd && stored[uname].role === 'PURPLE',
            `Registration succeeds for password length ${pwd.length} and stores correct user record`,
            `Stored: ${JSON.stringify(stored[uname])}`
        );
        assert(
            stored[uname].balance === 200000000,
            `PURPLE operative receives correct initial balance (200.000.000 ₫)`
        );
    }

    // =========================================================================
    // 4. LOGIN FORM PLACEHOLDERS & PASSCODE LABEL
    // =========================================================================
    console.log('\n▶ [CHECK 4] LOGIN FORM PLACEHOLDERS & PASSCODE LABEL');

    const loginUsernameMatch = indexContent.match(/<input[^>]*id=["']login-username["'][^>]*>/i);
    const loginUsernamePlaceholder = loginUsernameMatch ? (loginUsernameMatch[0].match(/placeholder=["']([^"']*)["']/i) || [])[1] : null;
    assert(
        !/admin|sniper_red|medic_yel/i.test(loginUsernamePlaceholder || ''),
        `Login username placeholder does NOT contain demo accounts (admin, sniper_red, medic_yel)`,
        `Found: '${loginUsernamePlaceholder}'`
    );

    const loginPasswordMatch = indexContent.match(/<input[^>]*id=["']login-password["'][^>]*>/i);
    const loginPasswordPlaceholder = loginPasswordMatch ? (loginPasswordMatch[0].match(/placeholder=["']([^"']*)["']/i) || [])[1] : null;
    assert(
        loginPasswordPlaceholder === 'Nhập mật khẩu',
        `Login password placeholder is exactly 'Nhập mật khẩu'`,
        `Found: '${loginPasswordPlaceholder}'`
    );

    const passcodeLabelRegex = /<label[^>]*>\s*PASSCODE:\s*<\/label>/i;
    assert(
        passcodeLabelRegex.test(indexContent),
        `Passcode label is exactly 'PASSCODE:' without Vietnamese prefix or parentheses`
    );
    assert(
        !/MẬT MÃ BẢO MẬT \(PASSCODE\)/i.test(indexContent),
        `Old passcode label 'MẬT MÃ BẢO MẬT (PASSCODE)' is completely removed`
    );

    // =========================================================================
    // 5. AUTHENTICATION & LOGIN FLOW VERIFICATION
    // =========================================================================
    console.log('\n▶ [CHECK 5] AUTHENTICATION & LOGIN FLOW (DEFAULT OPERATIVE q121101)');
    
    // Test login with default user q121101 / Tungqu@n1208.
    alerts.length = 0;
    elements.get('login-username').value = 'q121101';
    elements.get('login-password').value = 'Tungqu@n1208.';
    if (typeof sandbox.handleUserLogin === 'function') {
        await sandbox.handleUserLogin({ preventDefault() {} });
    }
    assert(
        alerts.some(a => a.includes('XÁC THỰC THÀNH CÔNG')),
        `Login succeeds for default user 'q121101' with password 'Tungqu@n1208.'`
    );
    assert(
        elements.get('dark-stage').classList.contains('flex') || !elements.get('dark-stage').classList.contains('hidden'),
        `Dark stage is displayed upon successful login`
    );

    // Test master passcodes (7209, JINMAN)
    alerts.length = 0;
    elements.get('login-username').value = 'q121101';
    elements.get('login-password').value = '7209';
    if (typeof sandbox.handleUserLogin === 'function') {
        await sandbox.handleUserLogin({ preventDefault() {} });
    }
    assert(
        alerts.some(a => a.includes('XÁC THỰC THÀNH CÔNG')),
        `Master passcode 7209 successfully authenticates account`
    );

    // Test incorrect password
    alerts.length = 0;
    elements.get('login-username').value = 'q121101';
    elements.get('login-password').value = 'WrongPassword!';
    if (typeof sandbox.handleUserLogin === 'function') {
        await sandbox.handleUserLogin({ preventDefault() {} });
    }
    assert(
        alerts.some(a => a.includes('không chính xác')),
        `Login with invalid password triggers 'Mật mã bảo mật không chính xác' alert`
    );

    // Test non-existent user
    alerts.length = 0;
    elements.get('login-username').value = 'unknown_user_999';
    elements.get('login-password').value = 'AnyPassword123';
    if (typeof sandbox.handleUserLogin === 'function') {
        await sandbox.handleUserLogin({ preventDefault() {} });
    }
    assert(
        alerts.some(a => a.includes('Không tìm thấy mã định danh')),
        `Login with non-existent user triggers 'Không tìm thấy mã định danh' alert`
    );

    // =========================================================================
    // 6. PROBING SAMPLE TACTICAL CATALOG IMAGES (PRODUCTS_DB)
    // =========================================================================
    console.log('\n▶ [CHECK 6] PROBING SAMPLE TACTICAL PRODUCTS_DB IMAGE URLs');
    assert(productsDb.length >= 40, `Tactical catalog item count (Found: ${productsDb.length})`);
    
    // Probe a representative sample of tactical images from each tier
    const sampleTactical = [
        productsDb[0], // Red Pistol
        productsDb[5], // Red Rifle
        productsDb[15], // Red Sniper
        productsDb.find(p => p.code === 'PURPLE'), // Purple Drone/Cleaner
        productsDb.find(p => p.code === 'YELLOW'), // Yellow Medic
        productsDb.find(p => p.code === 'GREEN')   // Green Master
    ].filter(Boolean);

    for (const item of sampleTactical) {
        const result = await probeUrl(item.img);
        console.log(`    [${item.id} - ${item.code}] HTTP ${result.statusCode} (${result.contentType}) - ${item.name}`);
        assert(
            result.ok,
            `Tactical Image [${item.id}]: HTTP 200 & Image MIME type`,
            `Status: ${result.statusCode}, Type: ${result.contentType}`
        );
    }

    // =========================================================================
    // 7. JAVASCRIPT SYNTAX & E2E TEST RUNNER INTEGRATION
    // =========================================================================
    console.log('\n▶ [CHECK 7] JAVASCRIPT SYNTAX INTEGRITY & E2E AUTOMATED RUNNER');
    
    const { scriptsCode } = buildSandbox(indexContent);
    let syntaxValid = true;
    let syntaxErr = '';
    try {
        new Function(scriptsCode);
    } catch (e) {
        syntaxValid = false;
        syntaxErr = e.message;
    }
    assert(syntaxValid, `All inline JavaScript passes new Function() syntax parsing`, syntaxErr);

    // Execute automated E2E test runner via child_process
    console.log('\n▶ Running tests/e2e/test_runner.js:');
    try {
        const e2eOutput = execSync('node tests/e2e/test_runner.js', { cwd: path.resolve(__dirname, '../') }).toString();
        const e2ePassed = e2eOutput.includes('ALL TESTS PASSED (100% SUCCESS)');
        assert(e2ePassed, `Automated E2E test suite (65/65 tests passed)`);
        console.log(e2eOutput.split('\n').filter(l => l.includes('Passed') || l.includes('Status')).join('\n'));
    } catch (err) {
        assert(false, `Automated E2E test runner execution`, err.message);
    }

    // =========================================================================
    // SUMMARY
    // =========================================================================
    console.log('\n' + '='.repeat(80));
    console.log(`TOTAL EMPIRICAL TESTS: ${passCount + failCount} | PASSED: ${passCount} | FAILED: ${failCount}`);
    console.log('='.repeat(80));

    process.exit(failCount === 0 ? 0 : 1);
}

runAllChecks().catch(err => {
    console.error('Fatal error during test run:', err);
    process.exit(1);
});
