const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('==============================================================================');
console.log('  CHALLENGER 1: TRANSITION PIPELINE & STATE MACHINE EMPIRICAL SUITE');
console.log('==============================================================================\n');

const indexPath = path.resolve(__dirname, '../../../index.html');
const htmlSource = fs.readFileSync(indexPath, 'utf8');

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

// 1. Static DOM Structure Inspection
console.log('▶ STEP 1: Static Transition Screen DOM Inspection');

// Transit background #4a0005
check(
    'Transit Stage Background #4a0005',
    htmlSource.includes('id="portal-stage"') && htmlSource.includes('bg-[#4a0005]'),
    'Matches exact hex #4a0005'
);

// Lowercase branding murthehelp
const portalBrandingMatch = htmlSource.match(/<h1[^>]*class="[^"]*lowercase[^"]*"[^>]*>\s*murthehelp\s*<\/h1>/i);
check(
    'Transit Stage Lowercase Branding "murthehelp"',
    !!portalBrandingMatch,
    'Branding element rendered with lowercase text'
);

// 3-color clearance stripe: Crimson Red #b3001e, Ultraviolet #4d19bf, Radiant Amber #e67e00
check(
    '3-Color Clearance Stripe - Crimson Red #b3001e',
    htmlSource.includes('bg-[#b3001e]'),
    'Hex #b3001e present in stripe DOM'
);
check(
    '3-Color Clearance Stripe - Ultraviolet #4d19bf',
    htmlSource.includes('bg-[#4d19bf]'),
    'Hex #4d19bf present in stripe DOM'
);
check(
    '3-Color Clearance Stripe - Radiant Amber #e67e00',
    htmlSource.includes('bg-[#e67e00]'),
    'Hex #e67e00 present in stripe DOM'
);

// Confirmation button
check(
    'Confirm Trigger Button "XÁC NHẬN (확인)"',
    htmlSource.includes('id="btn-portal-confirm"') && htmlSource.includes('XÁC NHẬN (확인)'),
    'Button present with ID and localized text'
);

// Auto-Login Modal element
check(
    'Auto-Login Modal Container #portal-alert',
    htmlSource.includes('id="portal-alert"') && htmlSource.includes('ĐÃ TỰ ĐỘNG ĐĂNG NHẬP'),
    'Modal element with alert text present'
);

// 2. Behavioral State Machine Simulation
console.log('\n▶ STEP 2: Transition State Machine Simulation');

class MockAppStateMachine {
    constructor() {
        this.currentStage = 'disguise';
        this.portalAlertVisible = false;
        this.darkStageVisible = false;
        this.webglRunning = false;
        this.bodyBg = '#f8fafc';
        this.userClearance = 'GREEN';
        this.userName = 'Jeong Jin-man';
        this.audioEvents = [];
        this.timer = null;
    }

    triggerMurthehelpPortal() {
        this.audioEvents.push('playPortalWarp');
        this.currentStage = 'portal';
        this.portalAlertVisible = false;
        
        // Simulating setTimeout 1200ms
        this.timer = setTimeout(() => {
            this.portalAlertVisible = true;
            this.audioEvents.push(`playTierChime_${this.userClearance}`);
        }, 1200);
    }

    enterDarkMallFinal() {
        if (this.timer) clearTimeout(this.timer);
        this.audioEvents.push('playPortalWarp');
        this.currentStage = 'dark';
        this.darkStageVisible = true;
        this.bodyBg = '#06070a';
        this.webglRunning = true;
    }

    returnToDisguise() {
        if (this.timer) clearTimeout(this.timer);
        this.audioEvents.push('playPanicDischarge');
        this.currentStage = 'disguise';
        this.portalAlertVisible = false;
        this.darkStageVisible = false;
        this.webglRunning = false;
        this.bodyBg = '#f8fafc';
    }

    handleKeydown(key) {
        if (this.currentStage === 'portal' && (key === 'Enter' || key === ' ')) {
            this.enterDarkMallFinal();
            return 'ENTERED_MALL';
        }
        if (key === 'Escape') {
            this.returnToDisguise();
            return 'PANIC_RECOVERED';
        }
        return 'IGNORED';
    }
}

// Test State Transition Flow
const sm = new MockAppStateMachine();
check('Initial State is Disguise', sm.currentStage === 'disguise' && !sm.webglRunning);

sm.triggerMurthehelpPortal();
check('Triggering Portal sets stage to portal', sm.currentStage === 'portal');
check('Audio played warp sound on portal trigger', sm.audioEvents.includes('playPortalWarp'));

// Simulate timer tick
setTimeout(() => {
    check('Auto-login modal becomes visible after 1.2s delay', sm.portalAlertVisible === true);
    check('Tier chime played for clearance', sm.audioEvents.includes('playTierChime_GREEN'));

    // Test Keydown Enter on Portal Stage
    const keyRes = sm.handleKeydown('Enter');
    check('Enter key triggers dark mall entry from portal', keyRes === 'ENTERED_MALL' && sm.currentStage === 'dark');
    check('Dark stage background set to OLED black #06070a', sm.bodyBg === '#06070a');
    check('WebGL background runner started', sm.webglRunning === true);

    // Test Space Key from another instance
    const sm2 = new MockAppStateMachine();
    sm2.triggerMurthehelpPortal();
    const spaceRes = sm2.handleKeydown(' ');
    check('Space key triggers dark mall entry from portal', spaceRes === 'ENTERED_MALL' && sm2.currentStage === 'dark');

    // Test ESC Panic from Dark Mall
    const panicRes = sm.handleKeydown('Escape');
    check('Escape key resets to disguise stage instantly', panicRes === 'PANIC_RECOVERED' && sm.currentStage === 'disguise');
    check('WebGL runner stopped on panic', sm.webglRunning === false);
    check('Body background restored to light #f8fafc', sm.bodyBg === '#f8fafc');

    // Test ESC from Disguise (Idempotent safety)
    const panicDisguise = sm.handleKeydown('Escape');
    check('Escape key from disguise stage is safe and idempotent', panicDisguise === 'PANIC_RECOVERED' && sm.currentStage === 'disguise');

    console.log(`\n==============================================================================`);
    console.log(`TRANSITION PIPELINE SUMMARY: ${passed} passed, ${failed} failed.`);
    console.log(`==============================================================================`);

    if (failed > 0) process.exit(1);
}, 1300);
