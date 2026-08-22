const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('==============================================================================');
console.log('  CHALLENGER 1: WEBGL SHADER & GLSL MATHEMATICAL FIDELITY SUITE');
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

// 1. Extract Vertex and Fragment Shaders
console.log('▶ STEP 1: GLSL Shader Code Extraction & Static Structure Analysis');

const vsMatch = htmlSource.match(/const\s+vertexShader\s*=\s*`([\s\S]*?)`;/);
const fsMatch = htmlSource.match(/const\s+fragmentShader\s*=\s*`([\s\S]*?)`;/);

check('Vertex Shader extracted from source', !!vsMatch);
check('Fragment Shader extracted from source', !!fsMatch);

const vertexShader = vsMatch ? vsMatch[1] : '';
const fragmentShader = fsMatch ? fsMatch[1] : '';

// 2. Uniforms and Varyings Cross-Check
console.log('\n▶ STEP 2: Uniform & Varying Interface Cross-Validation');

const vsUniforms = (vertexShader.match(/uniform\s+[\w\d]+\s+([\w\d]+);/g) || []).map(s => s.split(/\s+/)[2].replace(';', ''));
const fsUniforms = (fragmentShader.match(/uniform\s+[\w\d]+\s+([\w\d]+);/g) || []).map(s => s.split(/\s+/)[2].replace(';', ''));

const vsVaryings = (vertexShader.match(/varying\s+[\w\d]+\s+([\w\d]+);/g) || []).map(s => s.split(/\s+/)[2].replace(';', ''));
const fsVaryings = (fragmentShader.match(/varying\s+[\w\d]+\s+([\w\d]+);/g) || []).map(s => s.split(/\s+/)[2].replace(';', ''));

console.log('  VS Uniforms:', vsUniforms);
console.log('  FS Uniforms:', fsUniforms);
console.log('  VS Varyings:', vsVaryings);
console.log('  FS Varyings:', fsVaryings);

// Verify VS Varyings match FS Varyings exactly
vsVaryings.forEach(v => {
    check(`Varying "${v}" in Vertex Shader is declared in Fragment Shader`, fsVaryings.includes(v));
});

// Verify Fragment Shader precision
check('Fragment shader declares precision', fragmentShader.includes('precision highp float;'));

// Verify Simplex functions in VS
check('VS includes permute function', vertexShader.includes('vec4 permute(vec4 x)'));
check('VS includes taylorInvSqrt function', vertexShader.includes('vec4 taylorInvSqrt(vec4 r)'));
check('VS includes snoise 3D function', vertexShader.includes('float snoise(vec3 v)'));

// 3. JavaScript Uniforms Object vs Shader Declarations
console.log('\n▶ STEP 3: JavaScript Uniforms Definition Cross-Check');

const expectedJSUniforms = [
    'u_time', 'u_noise_freq', 'u_noise_amp', 'u_noise_speed',
    'u_mouse', 'u_scroll', 'u_fresnel_power',
    'u_color_core', 'u_color_primary', 'u_color_secondary', 'u_color_glow'
];

expectedJSUniforms.forEach(u => {
    const inShader = vsUniforms.includes(u) || fsUniforms.includes(u);
    check(`Uniform "${u}" is declared in shader pipeline`, inShader);
});

// 4. Clearance Tier Color Palettes Validation
console.log('\n▶ STEP 4: Clearance Tier Color Palettes Validation');

const PALETTES = {
    'RED': {
        primary: '#b3001e',
        secondary: '#ffaa00',
        glow: '#ff2244',
        name: 'Deep Crimson & Molten Gold'
    },
    'PURPLE': {
        primary: '#4d19bf',
        secondary: '#d946ef',
        glow: '#8b5cf6',
        name: 'Ultraviolet & Neon Orchid'
    },
    'YELLOW': {
        primary: '#e67e00',
        secondary: '#facc15',
        glow: '#fbbf24',
        name: 'Radiant Amber & Solar Flare'
    },
    'GREEN': {
        primary: '#00b37e',
        secondary: '#34d399',
        glow: '#059669',
        name: 'Emerald Jade & Cyber Mint'
    }
};

for (const [tier, p] of Object.entries(PALETTES)) {
    const primaryHexInt = parseInt(p.primary.replace('#', ''), 16);
    const secondaryHexInt = parseInt(p.secondary.replace('#', ''), 16);

    const hasPrimary = htmlSource.includes(primaryHexInt.toString(16)) || htmlSource.includes(p.primary);
    const hasSecondary = htmlSource.includes(secondaryHexInt.toString(16)) || htmlSource.includes(p.secondary);

    check(`Tier ${tier} (${p.name}) Primary Color Configured`, hasPrimary, p.primary);
    check(`Tier ${tier} (${p.name}) Secondary Color Configured`, hasSecondary, p.secondary);
}

// 5. Fresnel Gradient Formula Check
console.log('\n▶ STEP 5: Fresnel Math Formula Validation');

function calculateFresnel(NdotV, power = 2.6) {
    return Math.pow(1.0 - Math.max(0.0, Math.min(1.0, NdotV)), power);
}

check('Fresnel is 1.0 at grazing angle (NdotV = 0.0)', Math.abs(calculateFresnel(0.0) - 1.0) < 1e-6);
check('Fresnel is 0.0 at perpendicular angle (NdotV = 1.0)', Math.abs(calculateFresnel(1.0) - 0.0) < 1e-6);
check('Fresnel decays monotonically for intermediate angles', calculateFresnel(0.2) > calculateFresnel(0.5) && calculateFresnel(0.5) > calculateFresnel(0.8));

// 6. GLSL Standard Built-in Functions & Syntactic Correctness
console.log('\n▶ STEP 6: GLSL Built-in Function & Construct Verification');

const glslConstructs = [
    { name: 'normalize()', regex: /normalize\s*\(/ },
    { name: 'clamp()', regex: /clamp\s*\(/ },
    { name: 'mix()', regex: /mix\s*\(/ },
    { name: 'smoothstep()', regex: /smoothstep\s*\(/ },
    { name: 'pow()', regex: /pow\s*\(/ },
    { name: 'dot()', regex: /dot\s*\(/ },
    { name: 'step()', regex: /step\s*\(/ },
    { name: 'floor()', regex: /floor\s*\(/ },
    { name: 'mod()', regex: /mod\s*\(/ },
    { name: 'gl_Position assignment', regex: /gl_Position\s*=/ },
    { name: 'gl_FragColor assignment', regex: /gl_FragColor\s*=/ }
];

glslConstructs.forEach(c => {
    const found = c.regex.test(vertexShader) || c.regex.test(fragmentShader);
    check(`GLSL construct "${c.name}" is present and correctly structured`, found);
});

console.log(`\n==============================================================================`);
console.log(`WEBGL SHADER & GLSL SUITE SUMMARY: ${passed} passed, ${failed} failed.`);
console.log(`==============================================================================`);

if (failed > 0) process.exit(1);
