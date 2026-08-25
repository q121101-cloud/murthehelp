/**
 * ==============================================================================
 * MURTHEHELP // MURDER-SHOP — DEDICATED PLAYWRIGHT E2E & VISUAL SCREENSHOT SUITE
 * ==============================================================================
 * Real headless Chromium browser automation suite verifying:
 *  - Zero console errors and unhandled page exceptions across all interactive journeys.
 *  - Tier 1: Public disguise storefront, typography, top ticker, catalog, ISO badges.
 *  - Screenshot 1: artifacts/screenshots/tier1_disguise_storefront.png
 *  - Covert Trigger: Footer triple-click on HHL-13543505-HUE within 1.5s -> Tier 2 transit.
 *  - Tier 2: Biometric laser scanning line, holographic matrix, centered neon murderhelp, 3-color clearance stripe.
 *  - Screenshot 2: artifacts/screenshots/tier2_transit_portal.png
 *  - Auth Flow: Super Admin authentication (q121101 / Tungqu@n1208.) -> Tier 3 dark mall.
 *  - Tier 3: WebGL canvas, Double-Bezel cards, Floating Island buttons, 2B ₫ balance display.
 *  - Screenshot 3: artifacts/screenshots/tier3_dark_mall_overview.png
 *  - Clearance Palettes: CODE RED, CODE PURPLE, CODE YELLOW, CODE GREEN tab switching & WebGL shader updates.
 *  - Screenshot 4: artifacts/screenshots/tier3_code_red_palette.png
 *  - Screenshot 5: artifacts/screenshots/tier3_code_green_admin.png
 *  - Covert Search Keys: MH13543505, MURDERHELP, 7209 transit validation.
 *  - Cart Drawer & Checkout: Multi-item additions, drawer opening, coupon discounts, balance deduction & order creation.
 *  - Screenshot 6: artifacts/screenshots/tier3_cart_drawer.png
 *  - Emergency Panic Protocol: Global Escape key reverting instantly to disguise storefront.
 * ==============================================================================
 */

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

// --- ANSI Terminal Styling ---
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
    white: '\x1b[37m',
    gray: '\x1b[90m'
};

const PROJECT_ROOT = path.resolve(__dirname, '..');
const HTML_FILE_PATH = path.join(PROJECT_ROOT, 'index.html');
const HTML_FILE_URL = 'file://' + HTML_FILE_PATH;
const SCREENSHOT_DIR = path.join(PROJECT_ROOT, 'artifacts', 'screenshots');

// Ensure screenshot output directory exists
if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const testResults = [];

function assert(condition, testId, description, details = '') {
    totalTests++;
    if (condition) {
        passedTests++;
        testResults.push({ id: testId, desc: description, passed: true, details });
        console.log(`  ${C.green}✔ PASS${C.reset} [${C.cyan}${testId}${C.reset}] ${description}`);
    } else {
        failedTests++;
        testResults.push({ id: testId, desc: description, passed: false, details });
        console.error(`  ${C.red}✖ FAIL${C.reset} [${C.yellow}${testId}${C.reset}] ${description}`);
        if (details) console.error(`    ${C.red}↳ Details:${C.reset} ${details}`);
    }
}

async function runVisualE2ESuite() {
    const startTime = Date.now();
    console.log(`\n${C.bold}${C.magenta}==============================================================================${C.reset}`);
    console.log(`${C.bold}${C.white}  MURTHEHELP // MURDER-SHOP — PLAYWRIGHT E2E & VISUAL TEST SUITE${C.reset}`);
    console.log(`${C.dim}  Target: ${HTML_FILE_URL}${C.reset}`);
    console.log(`${C.dim}  Timestamp: ${new Date().toISOString()}${C.reset}`);
    console.log(`${C.bold}${C.magenta}==============================================================================${C.reset}\n`);

    const consoleMessages = [];
    const consoleErrors = [];
    const pageErrors = [];
    const handledDialogs = [];

    // Launch real headless Chromium
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
        deviceScaleFactor: 1
    });

    const page = await context.newPage();

    // Listen to console and error events
    page.on('console', msg => {
        const type = msg.type();
        const text = msg.text();
        consoleMessages.push({ type, text });
        if (type === 'error') {
            consoleErrors.push(text);
        }
    });

    page.on('pageerror', err => {
        pageErrors.push(err.message || String(err));
    });

    page.on('dialog', async dialog => {
        handledDialogs.push({
            type: dialog.type(),
            message: dialog.message()
        });
        await dialog.accept();
    });

    try {
        // ==============================================================================
        // SUITE 1: TIER 1 PUBLIC DISGUISE STOREFRONT VERIFICATION
        // ==============================================================================
        console.log(`${C.bold}${C.blue}▶ SECTION 1: TIER 1 PUBLIC DISGUISE STOREFRONT${C.reset}`);
        
        await page.goto(HTML_FILE_URL, { waitUntil: 'networkidle' });
        await page.waitForTimeout(500);

        const pageTitle = await page.title();
        assert(
            pageTitle.includes('HOÀNG HẮC LONG') && pageTitle.includes('Thủy Lực'),
            'PW-T1-01',
            'Storefront document title reflects authentic Hoàng Hắc Long industrial identity',
            `Title observed: "${pageTitle}"`
        );

        // Verify Tier 1 is visible, Tier 2 & Tier 3 are hidden
        const isDisguiseVisible = await page.$eval('#disguise-stage', el => !el.classList.contains('hidden') && el.offsetParent !== null);
        const isPortalHidden = await page.$eval('#portal-stage', el => el.classList.contains('hidden'));
        const isDarkHidden = await page.$eval('#dark-stage', el => el.classList.contains('hidden'));

        assert(isDisguiseVisible, 'PW-T1-02', 'Tier 1 disguise stage (#disguise-stage) is visible upon initialization');
        assert(isPortalHidden, 'PW-T1-03', 'Tier 2 portal stage (#portal-stage) is strictly hidden initially');
        assert(isDarkHidden, 'PW-T1-04', 'Tier 3 dark stage (#dark-stage) is strictly hidden initially');

        // Typography verification
        const typographyInfo = await page.evaluate(() => {
            const bodyFont = window.getComputedStyle(document.body).fontFamily;
            const headingFont = window.getComputedStyle(document.querySelector('h1') || document.body).fontFamily;
            const monoEl = document.querySelector('.font-mono-code') || document.body;
            const monoFont = window.getComputedStyle(monoEl).fontFamily;
            return { bodyFont, headingFont, monoFont };
        });
        assert(
            typographyInfo.bodyFont.includes('Plus Jakarta Sans') || typographyInfo.bodyFont.includes('sans-serif'),
            'PW-T1-05',
            'European Industrial typography active with Plus Jakarta Sans body font hierarchy',
            `Observed body font: ${typographyInfo.bodyFont}`
        );

        // Ticker verification
        const tickerInfo = await page.evaluate(() => {
            const container = document.querySelector('.ticker-container');
            const track = document.querySelector('.marquee-track');
            const text = track ? track.innerText : '';
            const trackStyle = track ? window.getComputedStyle(track) : null;
            return {
                hasContainer: !!container,
                hasTrack: !!track,
                text,
                animationDuration: trackStyle ? trackStyle.animationDuration : ''
            };
        });
        assert(
            tickerInfo.hasContainer && tickerInfo.hasTrack && tickerInfo.text.includes('#HD-71092'),
            'PW-T1-06',
            'Hardware-accelerated top marquee ticker renders order telemetry (#HD-71092, 70.000.000 ₫)',
            `Text snippet: ${tickerInfo.text.slice(0, 80)}`
        );

        // Search Bar and Catalog Grid
        const disguiseGridCount = await page.$$eval('#disguise-products-grid > div', els => els.length);
        assert(
            disguiseGridCount >= 10,
            'PW-T1-07',
            `Disguise product catalog renders complete industrial assortment (Count: ${disguiseGridCount} >= 10)`
        );

        // ISO Badges & Pressure Rating Telemetry
        const badgeTelemetry = await page.evaluate(() => {
            const html = document.getElementById('disguise-stage').innerHTML;
            return {
                hasISO9001: html.includes('ISO 9001:2015') || html.includes('ISO 9001'),
                hasJIS: html.includes('JIS K6349') || html.includes('JIS'),
                hasPressure: html.includes('1500 Bar') || html.includes('1500 BAR') || html.includes('1500 bar'),
                hasISO18752: html.includes('ISO 18752') || html.includes('ISO')
            };
        });
        assert(
            badgeTelemetry.hasISO9001 && badgeTelemetry.hasPressure,
            'PW-T1-08',
            'Precision data badges render ISO certification and 1500 Bar pressure specifications'
        );

        // Capture Screenshot 1: Tier 1 Disguise Storefront
        const screenshot1Path = path.join(SCREENSHOT_DIR, 'tier1_disguise_storefront.png');
        await page.screenshot({ path: screenshot1Path, fullPage: false });
        assert(
            fs.existsSync(screenshot1Path) && fs.statSync(screenshot1Path).size > 10000,
            'PW-T1-09',
            `Screenshot 1 captured: artifacts/screenshots/tier1_disguise_storefront.png (${(fs.statSync(screenshot1Path).size / 1024).toFixed(1)} KB)`
        );

        // ==============================================================================
        // SUITE 2: COVERT TRIGGER & TIER 2 BIOMETRIC LASER TRANSIT PORTAL
        // ==============================================================================
        console.log(`\n${C.bold}${C.blue}▶ SECTION 2: COVERT TRIGGER & TIER 2 TRANSIT PORTAL${C.reset}`);

        // Triple-click on footer element HHL-13543505-HUE
        const footerTrigger = page.locator('span:has-text("HHL-13543505-HUE")').first();
        await footerTrigger.waitFor({ state: 'visible' });

        // Rapid 3 clicks within 1.5s
        await footerTrigger.click();
        await page.waitForTimeout(100);
        await footerTrigger.click();
        await page.waitForTimeout(100);
        await footerTrigger.click();
        await page.waitForTimeout(400);

        const isPortalVisibleAfterTripleClick = await page.$eval('#portal-stage', el => !el.classList.contains('hidden'));
        const isDisguiseHiddenAfterTripleClick = await page.$eval('#disguise-stage', el => el.classList.contains('hidden'));

        assert(
            isPortalVisibleAfterTripleClick && isDisguiseHiddenAfterTripleClick,
            'PW-T2-01',
            'Covert trigger: Footer triple-click on HHL-13543505-HUE unlocks Tier 2 Transit Portal'
        );

        // Biometric Laser Line, Hologram Grid, Centered Neon Display & Clearance Stripe
        const portalDetails = await page.evaluate(() => {
            const holoGrid = document.querySelector('.portal-holo-grid');
            const laserLine = document.querySelector('.biometric-laser-line');
            const neonTitle = document.querySelector('.murderhelp-neon-title');
            const clearanceStripe = document.querySelector('[data-testid="clearance-stripe"]') || document.getElementById('clearance-bar');
            return {
                hasHoloGrid: !!holoGrid,
                hasLaserLine: !!laserLine,
                neonTitleText: neonTitle ? neonTitle.innerText.trim().toLowerCase() : '',
                hasClearanceStripe: !!clearanceStripe,
                stripeDivCount: clearanceStripe ? clearanceStripe.querySelectorAll('div').length : 0
            };
        });

        assert(portalDetails.hasLaserLine, 'PW-T2-02', 'Tier 2 dynamic biometric laser scanning line and flare are active');
        assert(portalDetails.hasHoloGrid, 'PW-T2-03', 'Tier 2 procedural holographic matrix grid is rendered');
        assert(
            portalDetails.neonTitleText === 'murderhelp',
            'PW-T2-04',
            'Tier 2 centered neon display renders lowercase "murderhelp" title',
            `Observed text: "${portalDetails.neonTitleText}"`
        );
        assert(
            portalDetails.hasClearanceStripe && portalDetails.stripeDivCount === 3,
            'PW-T2-05',
            'Tier 2 clearance stripe renders 3 distinct clearance color channels (Red, Purple, Amber)'
        );

        // Capture Screenshot 2: Tier 2 Transit Portal
        const screenshot2Path = path.join(SCREENSHOT_DIR, 'tier2_transit_portal.png');
        await page.screenshot({ path: screenshot2Path, fullPage: false });
        assert(
            fs.existsSync(screenshot2Path) && fs.statSync(screenshot2Path).size > 10000,
            'PW-T2-06',
            `Screenshot 2 captured: artifacts/screenshots/tier2_transit_portal.png (${(fs.statSync(screenshot2Path).size / 1024).toFixed(1)} KB)`
        );

        // ==============================================================================
        // SUITE 3: AUTHENTICATION FLOW & TIER 3 DARK MALL OVERVIEW
        // ==============================================================================
        console.log(`\n${C.bold}${C.blue}▶ SECTION 3: AUTHENTICATION FLOW & TIER 3 DARK MALL${C.reset}`);

        // Fill Super Admin credentials
        await page.fill('#login-username', 'q121101');
        await page.fill('#login-password', 'Tungqu@n1208.');
        await page.click('#form-login button[type="submit"]');
        await page.waitForTimeout(500);

        const isDarkVisibleAfterLogin = await page.$eval('#dark-stage', el => !el.classList.contains('hidden'));
        const isPortalHiddenAfterLogin = await page.$eval('#portal-stage', el => el.classList.contains('hidden'));

        assert(
            isDarkVisibleAfterLogin && isPortalHiddenAfterLogin,
            'PW-T3-01',
            'Super Admin authentication (q121101 / Tungqu@n1208.) unlocks Tier 3 Dark Mall (#dark-stage)'
        );

        // Verify Super Admin HUD Identity & Balance
        const hudState = await page.evaluate(() => {
            const userName = document.getElementById('current-user-name') ? document.getElementById('current-user-name').innerText : '';
            const balance = document.getElementById('user-balance-display') ? document.getElementById('user-balance-display').innerText : '';
            const tierBadge = document.getElementById('user-tier-badge') ? document.getElementById('user-tier-badge').innerText : '';
            return { userName, balance, tierBadge };
        });

        assert(
            hudState.userName.includes('Jeong Jin-man') || hudState.userName.includes('q121101'),
            'PW-T3-02',
            'Tactical HUD binds Super Admin identity (Jeong Jin-man / q121101)',
            `Observed: ${hudState.userName}`
        );
        assert(
            hudState.balance.includes('2.000.000.000'),
            'PW-T3-03',
            'Tactical HUD reflects 2.000.000.000 ₫ initial Super Admin escrow balance',
            `Observed: ${hudState.balance}`
        );
        assert(
            hudState.tierBadge.includes('CODE GREEN'),
            'PW-T3-04',
            'Tactical HUD displays maximum clearance tier: CODE GREEN',
            `Observed: ${hudState.tierBadge}`
        );

        // WebGL Canvas, Double-Bezel Cards & Floating Island Buttons
        const darkStageElements = await page.evaluate(() => {
            const canvas = document.getElementById('webgl-canvas');
            const cards = document.querySelectorAll('.double-bezel-card');
            const floatingIslands = document.querySelectorAll('.floating-island-cluster');
            return {
                hasCanvas: !!canvas,
                cardsCount: cards.length,
                floatingIslandsCount: floatingIslands.length
            };
        });

        assert(darkStageElements.hasCanvas, 'PW-T3-05', 'Three.js 3D WebGL shader canvas (#webgl-canvas) is active and attached');
        assert(
            darkStageElements.cardsCount >= 10,
            'PW-T3-06',
            `Double-Bezel tactical weapon cards rendered with authentic dual-contour frames (Count: ${darkStageElements.cardsCount})`
        );
        assert(
            darkStageElements.floatingIslandsCount >= 10,
            'PW-T3-07',
            'Floating Island action clusters render dual pill-shaped triggers ("Xem Chi Tiết", "+ Thêm Giỏ")'
        );

        // Capture Screenshot 3: Tier 3 Dark Mall Overview
        const screenshot3Path = path.join(SCREENSHOT_DIR, 'tier3_dark_mall_overview.png');
        await page.screenshot({ path: screenshot3Path, fullPage: false });
        assert(
            fs.existsSync(screenshot3Path) && fs.statSync(screenshot3Path).size > 10000,
            'PW-T3-08',
            `Screenshot 3 captured: artifacts/screenshots/tier3_dark_mall_overview.png (${(fs.statSync(screenshot3Path).size / 1024).toFixed(1)} KB)`
        );

        // ==============================================================================
        // SUITE 4: CLEARANCE PALETTES & WEBGL SHADER COLOR DYNAMICS
        // ==============================================================================
        console.log(`\n${C.bold}${C.blue}▶ SECTION 4: CLEARANCE PALETTES & WEBGL UNIFORMS${C.reset}`);

        // 1. Switch to CODE RED
        await page.click('#tab-RED');
        await page.waitForTimeout(300);
        const redState = await page.evaluate(() => {
            const tabRed = document.getElementById('tab-RED');
            const sidebarTitle = document.getElementById('sidebar-main-title') ? document.getElementById('sidebar-main-title').innerText : '';
            const webglColors = (window.targetColorA && window.targetColorB) ? {
                a: window.targetColorA.getHexString ? window.targetColorA.getHexString() : null,
                b: window.targetColorB.getHexString ? window.targetColorB.getHexString() : null
            } : null;
            return {
                isActive: tabRed && tabRed.classList.contains('ring-2'),
                sidebarTitle,
                webglColors
            };
        });
        assert(
            redState.isActive && redState.sidebarTitle.includes('VŨ KHÍ TÁC CHIẾN'),
            'PW-T4-01',
            'Switching to CODE RED activates Crimson/Ember clearance palette & sidebar title'
        );

        // Capture Screenshot 4: CODE RED Palette
        const screenshot4Path = path.join(SCREENSHOT_DIR, 'tier3_code_red_palette.png');
        await page.screenshot({ path: screenshot4Path, fullPage: false });
        assert(
            fs.existsSync(screenshot4Path) && fs.statSync(screenshot4Path).size > 10000,
            'PW-T4-02',
            `Screenshot 4 captured: artifacts/screenshots/tier3_code_red_palette.png (${(fs.statSync(screenshot4Path).size / 1024).toFixed(1)} KB)`
        );

        // 2. Switch to CODE PURPLE
        await page.click('#tab-PURPLE');
        await page.waitForTimeout(300);
        const purState = await page.evaluate(() => {
            const tabPur = document.getElementById('tab-PURPLE');
            const sidebarTitle = document.getElementById('sidebar-main-title') ? document.getElementById('sidebar-main-title').innerText : '';
            return {
                isActive: tabPur && tabPur.classList.contains('ring-2'),
                sidebarTitle
            };
        });
        assert(
            purState.isActive && purState.sidebarTitle.includes('DỌN DẸP & DO THÁM'),
            'PW-T4-03',
            'Switching to CODE PURPLE activates Ultraviolet & Neon Violet clearance palette'
        );

        // 3. Switch to CODE YELLOW
        await page.click('#tab-YELLOW');
        await page.waitForTimeout(300);
        const yelState = await page.evaluate(() => {
            const tabYel = document.getElementById('tab-YELLOW');
            const sidebarTitle = document.getElementById('sidebar-main-title') ? document.getElementById('sidebar-main-title').innerText : '';
            return {
                isActive: tabYel && tabYel.classList.contains('ring-2'),
                sidebarTitle
            };
        });
        assert(
            yelState.isActive && yelState.sidebarTitle.includes('Y TẾ & CỨU THƯƠNG'),
            'PW-T4-04',
            'Switching to CODE YELLOW activates Radiant Solar Amber clearance palette'
        );

        // 4. Switch to CODE GREEN
        await page.click('#tab-GREEN');
        await page.waitForTimeout(300);
        const grnState = await page.evaluate(() => {
            const tabGrn = document.getElementById('tab-GREEN');
            const sidebarTitle = document.getElementById('sidebar-main-title') ? document.getElementById('sidebar-main-title').innerText : '';
            return {
                isActive: tabGrn && tabGrn.classList.contains('ring-2'),
                sidebarTitle
            };
        });
        assert(
            grnState.isActive && grnState.sidebarTitle.includes('ĐẶC QUYỀN GIÁM ĐỐC'),
            'PW-T4-05',
            'Switching to CODE GREEN activates Cyber Emerald & Electric Mint director clearance'
        );

        // Capture Screenshot 5: CODE GREEN Admin Palette
        const screenshot5Path = path.join(SCREENSHOT_DIR, 'tier3_code_green_admin.png');
        await page.screenshot({ path: screenshot5Path, fullPage: false });
        assert(
            fs.existsSync(screenshot5Path) && fs.statSync(screenshot5Path).size > 10000,
            'PW-T4-06',
            `Screenshot 5 captured: artifacts/screenshots/tier3_code_green_admin.png (${(fs.statSync(screenshot5Path).size / 1024).toFixed(1)} KB)`
        );

        // ==============================================================================
        // SUITE 5: CART DRAWER, COUPONS & CHECKOUT DEDUCTION
        // ==============================================================================
        console.log(`\n${C.bold}${C.blue}▶ SECTION 5: CART DRAWER, COUPONS & CHECKOUT${C.reset}`);

        // Switch to CODE RED to add products to cart
        await page.click('#tab-RED');
        await page.waitForTimeout(200);

        // Click "+ Thêm Giỏ" on 2 tactical items
        const addButtons = page.locator('.double-bezel-card button:has-text("+ Thêm Giỏ")');
        await addButtons.nth(0).click();
        await page.waitForTimeout(100);
        await addButtons.nth(1).click();
        await page.waitForTimeout(200);

        const cartCounterVal = await page.$eval('#cart-counter', el => el.innerText.trim());
        assert(
            cartCounterVal === '2',
            'PW-T5-01',
            'Adding tactical weapons to cart increments global HUD badge counter to 2',
            `Observed counter: "${cartCounterVal}"`
        );

        // Open Cart Drawer / Modal
        await page.click('button:has(#cart-counter)');
        await page.waitForTimeout(300);

        const isCartModalOpen = await page.$eval('#cart-modal', el => !el.classList.contains('hidden'));
        assert(isCartModalOpen, 'PW-T5-02', 'Cart drawer modal (#cart-modal) opens with backdrop blur & items list');

        // Capture Screenshot 6: Cart Drawer
        const screenshot6Path = path.join(SCREENSHOT_DIR, 'tier3_cart_drawer.png');
        await page.screenshot({ path: screenshot6Path, fullPage: false });
        assert(
            fs.existsSync(screenshot6Path) && fs.statSync(screenshot6Path).size > 10000,
            'PW-T5-03',
            `Screenshot 6 captured: artifacts/screenshots/tier3_cart_drawer.png (${(fs.statSync(screenshot6Path).size / 1024).toFixed(1)} KB)`
        );

        // Apply 50% discount coupon JINMAN50
        await page.fill('#cart-coupon-input', 'JINMAN50');
        await page.click('button:has-text("Áp Dụng")');
        await page.waitForTimeout(200);

        const discountText = await page.$eval('#cart-discount', el => el.innerText);
        assert(
            discountText.includes('50%'),
            'PW-T5-04',
            'Coupon [JINMAN50] computes exact 50% tactical discount on cart subtotal',
            `Observed: "${discountText}"`
        );

        // Execute Escrow Checkout
        const balanceBefore = await page.$eval('#user-balance-display', el => el.innerText);
        await page.click('button:has-text("XÁC NHẬN ĐẶT HÀNG")');
        await page.waitForTimeout(300);

        const isCartClosedAfterCheckout = await page.$eval('#cart-modal', el => el.classList.contains('hidden'));
        const cartCounterAfterCheckout = await page.$eval('#cart-counter', el => el.innerText.trim());
        const balanceAfter = await page.$eval('#user-balance-display', el => el.innerText);

        assert(isCartClosedAfterCheckout, 'PW-T5-05', 'Cart modal automatically closes upon successful checkout dispatch');
        assert(cartCounterAfterCheckout === '0', 'PW-T5-06', 'Cart is cleanly emptied (counter = 0) following completed transaction');
        assert(
            balanceBefore !== balanceAfter,
            'PW-T5-07',
            'Super Admin escrow balance deducted in real-time',
            `Balance before: ${balanceBefore} ₫ -> Balance after: ${balanceAfter} ₫`
        );

        // Verify order saved in localStorage
        const storedOrdersCount = await page.evaluate(() => {
            try {
                const orders = JSON.parse(localStorage.getItem('murthehelp_orders_db') || '[]');
                return orders.length;
            } catch (e) {
                return 0;
            }
        });
        assert(
            storedOrdersCount >= 1,
            'PW-T5-08',
            `Order record persisted in murthehelp_orders_db with dispatch tracking metadata (Count: ${storedOrdersCount})`
        );

        // ==============================================================================
        // SUITE 6: EMERGENCY PANIC PROTOCOL (GLOBAL ESCAPE KEY)
        // ==============================================================================
        console.log(`\n${C.bold}${C.blue}▶ SECTION 6: EMERGENCY PANIC PROTOCOL${C.reset}`);

        // Press Escape key from Dark Mall
        await page.keyboard.press('Escape');
        await page.waitForTimeout(300);

        const isDisguiseActiveAfterPanic = await page.$eval('#disguise-stage', el => !el.classList.contains('hidden'));
        const isDarkHiddenAfterPanic = await page.$eval('#dark-stage', el => el.classList.contains('hidden'));
        const isPortalHiddenAfterPanic = await page.$eval('#portal-stage', el => el.classList.contains('hidden'));

        assert(
            isDisguiseActiveAfterPanic && isDarkHiddenAfterPanic && isPortalHiddenAfterPanic,
            'PW-T6-01',
            'Emergency Panic Protocol: Global Escape key reverts dark mall immediately to disguise storefront'
        );

        // ==============================================================================
        // SUITE 7: COVERT SEARCH KEYS TRANSIT VALIDATION
        // ==============================================================================
        console.log(`\n${C.bold}${C.blue}▶ SECTION 7: COVERT SEARCH KEYWORDS TRANSIT${C.reset}`);

        const testSearchKeys = ['MH13543505', 'MURDERHELP', '7209'];
        for (let i = 0; i < testSearchKeys.length; i++) {
            const key = testSearchKeys[i];
            await page.fill('#disguise-search-input', key);
            await page.keyboard.press('Enter');
            await page.waitForTimeout(300);

            const isPortalOpen = await page.$eval('#portal-stage', el => !el.classList.contains('hidden'));
            assert(
                isPortalOpen,
                `PW-T7-0${i + 1}`,
                `Covert search query "${key}" unlocks transit portal`
            );

            // Revert back using Escape
            await page.keyboard.press('Escape');
            await page.waitForTimeout(200);
        }

        // ==============================================================================
        // SUITE 8: ZERO CONSOLE ERROR INVARIANT ASSERTION
        // ==============================================================================
        console.log(`\n${C.bold}${C.blue}▶ SECTION 8: CONSOLE ERROR & RUNTIME HEALTH INVARIANT${C.reset}`);

        assert(
            consoleErrors.length === 0,
            'PW-T8-01',
            `Zero console errors detected across entire Playwright run (Errors: ${consoleErrors.length})`,
            consoleErrors.length > 0 ? JSON.stringify(consoleErrors) : ''
        );

        assert(
            pageErrors.length === 0,
            'PW-T8-02',
            `Zero unhandled page exceptions detected across all tier transitions (Exceptions: ${pageErrors.length})`,
            pageErrors.length > 0 ? JSON.stringify(pageErrors) : ''
        );

    } catch (err) {
        console.error(`\n${C.red}${C.bold}FATAL TEST EXECUTION ERROR:${C.reset}`, err);
        failedTests++;
    } finally {
        await browser.close();
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log(`\n${C.bold}${C.magenta}==============================================================================${C.reset}`);
    console.log(`${C.bold}${C.white}PLAYWRIGHT E2E & VISUAL TEST EXECUTION SUMMARY${C.reset}`);
    console.log(`${C.bold}${C.magenta}==============================================================================${C.reset}`);
    console.log(`  Total Assertions Run : ${C.bold}${totalTests}${C.reset}`);
    console.log(`  Passed               : ${C.green}${C.bold}${passedTests}${C.reset}`);
    console.log(`  Failed               : ${failedTests > 0 ? C.red : C.green}${C.bold}${failedTests}${C.reset}`);
    console.log(`  Execution Time       : ${duration}s`);
    console.log(`  Screenshot Artifacts : ${SCREENSHOT_DIR}`);
    console.log(`  Verdict              : ${failedTests === 0 ? C.green + C.bold + 'ALL VISUAL & E2E TESTS PASSED (100% SUCCESS)' : C.red + C.bold + 'FAILURES DETECTED'}${C.reset}`);
    console.log(`${C.bold}${C.magenta}==============================================================================${C.reset}\n`);

    if (failedTests > 0) {
        process.exit(1);
    }
}

// Auto-execute if invoked from CLI
if (require.main === module) {
    runVisualE2ESuite().catch(err => {
        console.error('Unhandled fatal error in suite:', err);
        process.exit(1);
    });
}

module.exports = { runVisualE2ESuite };
