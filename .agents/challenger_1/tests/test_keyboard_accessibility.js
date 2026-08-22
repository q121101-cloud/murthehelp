const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('==============================================================================');
console.log('  CHALLENGER 1: KEYBOARD ACCESSIBILITY & ESC PANIC STRESS SUITE');
console.log('==============================================================================\n');

let passed = 0;
let failed = 0;

function check(testName, condition, detail = '') {
    if (condition) {
        console.log(`  ✔ PASS: ${testName} ${detail ? '(' + detail + ')' : ''}`);
        passed++;
    } else {
        console.error(`  ✖ FAIL: ${testName} ${detail ? '(' + detail + ')' : ''}`);
        failed++;
    }
}

// Complete mock simulating all DOM stages, modals, state, and listeners
class FullAppMock {
    constructor() {
        this.activeStage = 'disguise';
        this.modals = {
            cartDrawer: false,
            adminModal: false,
            f12Modal: false,
            blueprintModal: false,
            dispatchModal: false,
            transactionsModal: false,
            portalAlert: false
        };
        this.userClearance = 'GREEN';
        this.userName = 'Jeong Jin-man';
        this.bodyBg = '#f8fafc';
        this.webglActive = false;
        this.secretClickCount = 0;
        this.secretClickTimer = null;
        this.logs = [];
    }

    closeAllModals() {
        for (const k of Object.keys(this.modals)) {
            this.modals[k] = false;
        }
        this.logs.push('closeAllModals');
    }

    triggerMurthehelpPortal() {
        this.activeStage = 'portal';
        this.logs.push('triggerMurthehelpPortal');
    }

    enterDarkMallFinal() {
        this.activeStage = 'dark';
        this.bodyBg = '#06070a';
        this.webglActive = true;
        this.logs.push('enterDarkMallFinal');
    }

    returnToDisguise() {
        this.closeAllModals();
        this.activeStage = 'disguise';
        this.bodyBg = '#f8fafc';
        this.webglActive = false;
        this.logs.push('returnToDisguise');
    }

    handleSecretTripleClick() {
        this.secretClickCount++;
        clearTimeout(this.secretClickTimer);
        this.secretClickTimer = setTimeout(() => {
            this.secretClickCount = 0;
        }, 600);

        if (this.secretClickCount >= 3) {
            this.secretClickCount = 0;
            this.userClearance = 'GREEN';
            this.triggerMurthehelpPortal();
        }
    }

    handleGlobalKeyDown(e) {
        const isPortalVisible = (this.activeStage === 'portal');

        if (isPortalVisible && (e.key === 'Enter' || e.key === ' ')) {
            if (e.preventDefault) e.preventDefault();
            this.enterDarkMallFinal();
        } else if ((e.ctrlKey && e.shiftKey && (e.key === 'K' || e.key === 'k')) || (e.altKey && (e.key === 'M' || e.key === 'm'))) {
            if (e.preventDefault) e.preventDefault();
            this.userClearance = 'GREEN';
            this.triggerMurthehelpPortal();
        } else if (e.key === 'Escape') {
            this.closeAllModals();
            this.returnToDisguise();
        }
    }
}

// 1. Test Enter / Space on Portal Stage
console.log('▶ STEP 1: Transit Portal Keyboard Entry (Enter & Space)');
const app1 = new FullAppMock();
app1.triggerMurthehelpPortal();
check('App in portal stage', app1.activeStage === 'portal');

app1.handleGlobalKeyDown({ key: 'Enter' });
check('Enter key on portal stage triggers enterDarkMallFinal()', app1.activeStage === 'dark' && app1.webglActive === true);

const app2 = new FullAppMock();
app2.triggerMurthehelpPortal();
app2.handleGlobalKeyDown({ key: ' ' });
check('Space key on portal stage triggers enterDarkMallFinal()', app2.activeStage === 'dark' && app2.webglActive === true);

const app3 = new FullAppMock(); // in disguise stage
app3.handleGlobalKeyDown({ key: 'Enter' });
check('Enter key when NOT in portal does not blindly enter dark mall', app3.activeStage === 'disguise');

// 2. Test Emergency ESC Panic Protocol from All Modals
console.log('\n▶ STEP 2: Emergency ESC Panic Across All Sub-Systems');

const modalNames = [
    'cartDrawer',
    'adminModal',
    'f12Modal',
    'blueprintModal',
    'dispatchModal',
    'transactionsModal'
];

modalNames.forEach(modal => {
    const app = new FullAppMock();
    app.enterDarkMallFinal();
    app.modals[modal] = true;

    check(`Setup: ${modal} is open in dark stage`, app.modals[modal] === true && app.activeStage === 'dark');

    app.handleGlobalKeyDown({ key: 'Escape' });
    check(`ESC key closes ${modal} and reverts to disguise stage`, app.modals[modal] === false && app.activeStage === 'disguise' && app.webglActive === false);
});

// Test ESC from Dark Mall with multiple modals open simultaneously
const appMulti = new FullAppMock();
appMulti.enterDarkMallFinal();
appMulti.modals.cartDrawer = true;
appMulti.modals.adminModal = true;
appMulti.modals.blueprintModal = true;

appMulti.handleGlobalKeyDown({ key: 'Escape' });
const allClosed = Object.values(appMulti.modals).every(v => v === false);
check('ESC closes ALL open modals concurrently and resets to disguise', allClosed && appMulti.activeStage === 'disguise');

// 3. Test Hotkey Shortcuts
console.log('\n▶ STEP 3: Secret Global Hotkeys (Ctrl+Shift+K and Alt+M)');

const appHot1 = new FullAppMock();
appHot1.handleGlobalKeyDown({ ctrlKey: true, shiftKey: true, key: 'K' });
check('Ctrl+Shift+K activates master portal transition', appHot1.activeStage === 'portal' && appHot1.userClearance === 'GREEN');

const appHot2 = new FullAppMock();
appHot2.handleGlobalKeyDown({ altKey: true, key: 'M' });
check('Alt+M activates master portal transition', appHot2.activeStage === 'portal' && appHot2.userClearance === 'GREEN');

// 4. Test Triple Click Handler with Timing
console.log('\n▶ STEP 4: Rapid Triple Click vs Timeout Test');

const appClick = new FullAppMock();
// 3 rapid clicks
appClick.handleSecretTripleClick();
appClick.handleSecretTripleClick();
appClick.handleSecretTripleClick();
check('3 rapid clicks (<600ms) triggers master portal', appClick.activeStage === 'portal' && appClick.userClearance === 'GREEN');

// Slow clicks (>600ms)
const appSlow = new FullAppMock();
appSlow.handleSecretTripleClick();
setTimeout(() => {
    // After 650ms, click count reset to 0
    appSlow.handleSecretTripleClick();
    check('Slow clicks (>600ms) do NOT trigger portal prematurely', appSlow.activeStage === 'disguise');

    console.log(`\n==============================================================================`);
    console.log(`KEYBOARD ACCESSIBILITY SUITE SUMMARY: ${passed} passed, ${failed} failed.`);
    console.log(`==============================================================================`);

    if (failed > 0) process.exit(1);
}, 650);
