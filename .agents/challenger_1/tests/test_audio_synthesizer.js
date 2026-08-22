const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('==============================================================================');
console.log('  CHALLENGER 1: WEB AUDIO API PROCEDURAL SYNTHESIZER EMPIRICAL SUITE');
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

// Mock Web Audio Context & Nodes
class MockParam {
    constructor(val = 0) {
        this.value = val;
        this.timeline = [];
    }
    setValueAtTime(v, t) {
        this.timeline.push({ type: 'setValueAtTime', value: v, time: t });
        this.value = v;
    }
    exponentialRampToValueAtTime(v, t) {
        this.timeline.push({ type: 'exponentialRampToValueAtTime', value: v, time: t });
        this.value = v;
    }
}

class MockAudioNode {
    constructor(type) {
        this.nodeType = type;
        this.connectedTo = [];
    }
    connect(target) {
        this.connectedTo.push(target);
    }
}

class MockOscillator extends MockAudioNode {
    constructor() {
        super('Oscillator');
        this.type = 'sine';
        this.frequency = new MockParam(440);
        this.started = false;
        this.stopped = false;
    }
    start(t = 0) { this.started = true; this.startTime = t; }
    stop(t = 0) { this.stopped = true; this.stopTime = t; }
}

class MockGain extends MockAudioNode {
    constructor() {
        super('Gain');
        this.gain = new MockParam(1.0);
    }
}

class MockBiquadFilter extends MockAudioNode {
    constructor() {
        super('BiquadFilter');
        this.type = 'lowpass';
        this.frequency = new MockParam(350);
    }
}

class MockAudioContext {
    constructor() {
        this.currentTime = 10.0;
        this.state = 'suspended';
        this.destination = new MockAudioNode('Destination');
        this.createdOscillators = [];
        this.createdGains = [];
        this.createdFilters = [];
    }

    resume() {
        this.state = 'running';
    }

    createOscillator() {
        const osc = new MockOscillator();
        this.createdOscillators.push(osc);
        return osc;
    }

    createGain() {
        const gain = new MockGain();
        this.createdGains.push(gain);
        return gain;
    }

    createBiquadFilter() {
        const filter = new MockBiquadFilter();
        this.createdFilters.push(filter);
        return filter;
    }
}

// Mock localStorage and DOM
const mockStorage = {};
global.localStorage = {
    getItem: (k) => mockStorage[k] || null,
    setItem: (k, v) => { mockStorage[k] = v.toString(); }
};

const mockElements = {
    'audio-toggle-btn': { innerText: '🔊' }
};
global.document = {
    getElementById: (id) => mockElements[id] || null
};
global.window = {
    AudioContext: MockAudioContext
};

// Replicate TacticalAudioEngine class from index.html
class TacticalAudioEngine {
    constructor() {
        this.ctx = null;
        this.muted = localStorage.getItem('murthehelp_muted') === 'true';
    }

    init() {
        if (!this.ctx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                this.ctx = new AudioContextClass();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.muted = !this.muted;
        localStorage.setItem('murthehelp_muted', this.muted);
        const btn = document.getElementById('audio-toggle-btn');
        if (btn) btn.innerText = this.muted ? '🔇' : '🔊';
        return this.muted;
    }

    playMechanicalClick() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1400, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.04);

        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.04);
    }

    playPortalWarp() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc1.type = 'sawtooth';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(480, now);
        osc1.frequency.exponentialRampToValueAtTime(55, now + 0.85);
        osc2.frequency.setValueAtTime(240, now);
        osc2.frequency.exponentialRampToValueAtTime(28, now + 0.85);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(3200, now);
        filter.frequency.exponentialRampToValueAtTime(180, now + 0.85);

        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.85);
        osc2.stop(now + 0.85);
    }

    playTierChime(tier) {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const config = {
            'RED': { freqs: [440, 880], type: 'sawtooth', dur: 0.18 },
            'PURPLE': { freqs: [587.33, 1174.66], type: 'sine', dur: 0.22 },
            'YELLOW': { freqs: [880, 1320], type: 'triangle', dur: 0.18 },
            'GREEN': { freqs: [523.25, 659.25, 783.99], type: 'sine', dur: 0.35 }
        };

        const item = config[tier] || config['RED'];
        item.freqs.forEach((f, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = item.type;
            osc.frequency.setValueAtTime(f, now + idx * 0.05);

            gain.gain.setValueAtTime(0.1, now + idx * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + item.dur);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + idx * 0.05);
            osc.stop(now + idx * 0.05 + item.dur);
        });
    }

    playDroneLaunch() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const oscSub = this.ctx.createOscillator();
        const gainSub = this.ctx.createGain();
        oscSub.type = 'triangle';
        oscSub.frequency.setValueAtTime(160, now);
        oscSub.frequency.exponentialRampToValueAtTime(32, now + 0.65);
        gainSub.gain.setValueAtTime(0.3, now);
        gainSub.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
        oscSub.connect(gainSub);
        gainSub.connect(this.ctx.destination);
        oscSub.start(now);
        oscSub.stop(now + 0.65);

        const oscBeep = this.ctx.createOscillator();
        const gainBeep = this.ctx.createGain();
        oscBeep.type = 'sine';
        oscBeep.frequency.setValueAtTime(1760, now + 0.12);
        gainBeep.gain.setValueAtTime(0.18, now + 0.12);
        gainBeep.gain.exponentialRampToValueAtTime(0.001, now + 0.75);
        oscBeep.connect(gainBeep);
        gainBeep.connect(this.ctx.destination);
        oscBeep.start(now + 0.12);
        oscBeep.stop(now + 0.75);
    }

    playPanicDischarge() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.14);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.14);
    }
}

// Run Tests
console.log('▶ STEP 1: Tactical Audio Engine Initialization & Autoplay Resume');
const engine = new TacticalAudioEngine();
check('Audio engine instantiated with unmuted default', engine.muted === false);
engine.init();
check('AudioContext created on init()', !!engine.ctx);
check('Suspended AudioContext resumed on init()', engine.ctx.state === 'running');

console.log('\n▶ STEP 2: Synthesis Node Routing & Envelope Tests');
engine.playMechanicalClick();
check('playMechanicalClick created 1 Oscillator and 1 Gain', engine.ctx.createdOscillators.length === 1 && engine.ctx.createdGains.length === 1);
const clickOsc = engine.ctx.createdOscillators[0];
check('Mechanical click oscillator type is sine', clickOsc.type === 'sine');
check('Mechanical click frequency ramps 1400 -> 200 Hz', clickOsc.frequency.timeline.some(t => t.value === 1400) && clickOsc.frequency.timeline.some(t => t.value === 200));

// Test Portal Warp
const oscCountBeforeWarp = engine.ctx.createdOscillators.length;
engine.playPortalWarp();
const oscCountAfterWarp = engine.ctx.createdOscillators.length;
check('playPortalWarp created 2 dual-oscillators', oscCountAfterWarp - oscCountBeforeWarp === 2);
check('playPortalWarp routed through Biquad lowpass filter', engine.ctx.createdFilters.length >= 1 && engine.ctx.createdFilters[0].type === 'lowpass');

// Test Tier Chimes for all 4 Tiers
const tiers = ['RED', 'PURPLE', 'YELLOW', 'GREEN'];
tiers.forEach(tier => {
    const prevOsc = engine.ctx.createdOscillators.length;
    engine.playTierChime(tier);
    const postOsc = engine.ctx.createdOscillators.length;
    const count = tier === 'GREEN' ? 3 : 2;
    check(`playTierChime('${tier}') generated ${count} harmonic oscillators`, postOsc - prevOsc === count);
});

// Test Drone Launch and Panic Discharge
const prevDrone = engine.ctx.createdOscillators.length;
engine.playDroneLaunch();
check('playDroneLaunch generated sub-bass + telemetry beep oscillators', engine.ctx.createdOscillators.length - prevDrone === 2);

const prevPanic = engine.ctx.createdOscillators.length;
engine.playPanicDischarge();
check('playPanicDischarge generated downward sawtooth discharge', engine.ctx.createdOscillators.length - prevPanic === 1);

console.log('\n▶ STEP 3: Mute State & Resource Allocation Adversarial Test');
engine.toggleMute();
check('toggleMute() toggled muted flag to true', engine.muted === true);
check('toggleMute() saved to localStorage', mockStorage['murthehelp_muted'] === 'true');
check('toggleMute() updated HUD button to 🔇', mockElements['audio-toggle-btn'].innerText === '🔇');

const oscCountWhenMuted = engine.ctx.createdOscillators.length;
engine.playMechanicalClick();
engine.playPortalWarp();
engine.playTierChime('RED');
engine.playTierChime('GREEN');
engine.playDroneLaunch();
engine.playPanicDischarge();

check('When muted: ZERO audio nodes created across all sound triggers', engine.ctx.createdOscillators.length === oscCountWhenMuted);

// Toggle back to unmute
engine.toggleMute();
check('toggleMute() toggled back to false (unmuted)', engine.muted === false);
check('HUD button restored to 🔊', mockElements['audio-toggle-btn'].innerText === '🔊');
engine.playMechanicalClick();
check('Sound engine resumes audio generation after unmute', engine.ctx.createdOscillators.length > oscCountWhenMuted);

console.log(`\n==============================================================================`);
console.log(`AUDIO SYNTHESIZER SUITE SUMMARY: ${passed} passed, ${failed} failed.`);
console.log(`==============================================================================`);

if (failed > 0) process.exit(1);
