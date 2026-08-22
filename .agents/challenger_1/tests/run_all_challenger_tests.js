const { execSync } = require('child_process');
const path = require('path');

console.log('==============================================================================');
console.log('  CHALLENGER 1: MASTER EMPIRICAL ADVERSARIAL VERIFICATION HARNESS');
console.log('==============================================================================\n');

const testSuites = [
    { name: '1. Project E2E Suite (Tiers 1-4)', cmd: 'node tests/e2e/test_runner.js' },
    { name: '2. Adversarial Auth & Passcode Suite', cmd: 'node .agents/challenger_1/tests/test_auth_adversarial.js' },
    { name: '3. Transition Pipeline & State Machine Suite', cmd: 'node .agents/challenger_1/tests/test_transition_pipeline.js' },
    { name: '4. WebGL GLSL Shader & Mathematical Fidelity Suite', cmd: 'node .agents/challenger_1/tests/test_glsl_webgl.js' },
    { name: '5. Web Audio API Procedural Synthesizer Suite', cmd: 'node .agents/challenger_1/tests/test_audio_synthesizer.js' },
    { name: '6. Keyboard Accessibility & ESC Panic Suite', cmd: 'node .agents/challenger_1/tests/test_keyboard_accessibility.js' }
];

let allPassed = true;

for (const suite of testSuites) {
    console.log(`\n------------------------------------------------------------------------------`);
    console.log(`RUNNING: ${suite.name}`);
    console.log(`COMMAND: ${suite.cmd}`);
    console.log(`------------------------------------------------------------------------------`);
    try {
        const output = execSync(suite.cmd, {
            cwd: path.resolve(__dirname, '../../../'),
            stdio: 'inherit'
        });
    } catch (err) {
        console.error(`❌ FAILED: ${suite.name}`);
        allPassed = false;
        process.exit(1);
    }
}

console.log('\n==============================================================================');
console.log('  ALL CHALLENGER EMPIRICAL ADVERSARIAL SUITES COMPLETED WITH 100% SUCCESS');
console.log('==============================================================================');
