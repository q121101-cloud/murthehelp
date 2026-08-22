const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('==============================================================================');
console.log('  CHALLENGER 1: ADVERSARIAL AUTHENTICATION & PASSCODE PERMUTATION SUITE');
console.log('==============================================================================\n');

// Load index.html source
const indexPath = path.resolve(__dirname, '../../../index.html');
const htmlSource = fs.readFileSync(indexPath, 'utf8');

// Mock browser environment for testing search and auth logic
class MockDOM {
    constructor() {
        this.elements = {};
        this.alertLogs = [];
        this.portalTriggered = false;
        this.userClearance = 'GREEN';
        this.userName = 'Jeong Jin-man';
        this.soundPlayed = null;
    }

    setElement(id, value, classList = []) {
        this.elements[id] = {
            value: value,
            innerText: '',
            classList: new Set(classList),
            style: {}
        };
    }

    getElementById(id) {
        if (!this.elements[id]) {
            this.elements[id] = {
                value: '',
                innerText: '',
                classList: new Set(),
                style: {}
            };
        }
        return this.elements[id];
    }
}

// Function simulator based on index.html implementation
function runAuthTest(inputString) {
    const SECRET_KEYS = ['MH13543505', 'GREEN', 'RED', 'PURPLE', 'YELLOW', 'JINMAN', '7209', 'MURTHEHELP', 'MURDER'];
    const val = (inputString || '').trim().toUpperCase();

    const isMatch = SECRET_KEYS.some(k => val.includes(k));
    let detectedTier = 'NONE';

    if (isMatch) {
        if (val.includes('RED')) detectedTier = 'RED';
        else if (val.includes('PURPLE')) detectedTier = 'PURPLE';
        else if (val.includes('YELLOW')) detectedTier = 'YELLOW';
        else detectedTier = 'GREEN';
    }

    return { isMatch, detectedTier, normalizedInput: val };
}

let passed = 0;
let failed = 0;

function runCase(name, input, expectedMatch, expectedTier) {
    const res = runAuthTest(input);
    const matchOk = res.isMatch === expectedMatch;
    const tierOk = expectedTier ? res.detectedTier === expectedTier : true;

    if (matchOk && tierOk) {
        console.log(`  ✔ PASS: [${name}] input: "${input.replace(/\n/g, '\\n')}" -> match: ${res.isMatch}, tier: ${res.detectedTier}`);
        passed++;
    } else {
        console.error(`  ✖ FAIL: [${name}] input: "${input}" -> Expected: match=${expectedMatch}, tier=${expectedTier}; Got: match=${res.isMatch}, tier=${res.detectedTier}`);
        failed++;
    }
}

console.log('▶ TEST 1: Master Keys (mh13543505 variations)');
runCase('Master key exact lower', 'mh13543505', true, 'GREEN');
runCase('Master key exact upper', 'MH13543505', true, 'GREEN');
runCase('Master key mixed case', 'mH13543505', true, 'GREEN');
runCase('Master key leading/trailing whitespace', '   mh13543505   ', true, 'GREEN');
runCase('Master key newline trailing', 'mh13543505\n', true, 'GREEN');
runCase('Master key tab whitespace', '\tmh13543505\t', true, 'GREEN');
runCase('Master key embedded in phrase', 'tra cứu mã mh13543505 hôm nay', true, 'GREEN');
runCase('Master key with URL prefix', 'https://mhshoppingkill87689.dark/mh13543505', true, 'GREEN');

console.log('\n▶ TEST 2: Tier Specific Keys (RED, PURPLE, YELLOW, GREEN)');
runCase('Red tier lower', 'red', true, 'RED');
runCase('Red tier upper', 'RED', true, 'RED');
runCase('Red tier mixed', 'rEd', true, 'RED');
runCase('Red with whitespace', '  RED  ', true, 'RED');
runCase('Red with extra text', 'access code red now', true, 'RED');

runCase('Purple tier lower', 'purple', true, 'PURPLE');
runCase('Purple tier upper', 'PURPLE', true, 'PURPLE');
runCase('Purple tier mixed', 'PuRpLe', true, 'PURPLE');

runCase('Yellow tier lower', 'yellow', true, 'YELLOW');
runCase('Yellow tier upper', 'YELLOW', true, 'YELLOW');
runCase('Yellow tier mixed', 'yElLoW', true, 'YELLOW');

runCase('Green tier lower', 'green', true, 'GREEN');
runCase('Green tier upper', 'GREEN', true, 'GREEN');
runCase('Green tier mixed', 'GrEeN', true, 'GREEN');

console.log('\n▶ TEST 3: Director & Secondary Secret Keys');
runCase('Jinman exact lower', 'jinman', true, 'GREEN');
runCase('Jinman exact upper', 'JINMAN', true, 'GREEN');
runCase('Jinman mixed', 'JinMan', true, 'GREEN');
runCase('Pin 7209', '7209', true, 'GREEN');
runCase('Pin 7209 padded', '  7209  ', true, 'GREEN');
runCase('Brand murthehelp', 'murthehelp', true, 'GREEN');
runCase('Brand murder', 'murder', true, 'GREEN');
runCase('Brand MURDER.SHOPPING.MALL', 'MURDER.SHOPPING.MALL', true, 'GREEN');

console.log('\n▶ TEST 4: Invalid Inputs & Injection Payloads (Negative Tests)');
runCase('Regular agriculture search 1', 'ong cao su 1200 bar', false, 'NONE');
runCase('Regular agriculture search 2', 'may bom p900', false, 'NONE');
runCase('Regular agriculture search 3', 'van titan jis-10k', false, 'NONE');
runCase('Empty search string', '', false, 'NONE');
runCase('Whitespace only', '    ', false, 'NONE');
runCase('Random numbers', '12345678', false, 'NONE');
runCase('Partial non-matching key', 'mh13543', false, 'NONE');
runCase('Typo in key', 'mh13543506', false, 'NONE');
runCase('Typo in red', 'read', false, 'NONE');
runCase('Typo in jinman', 'jinmin', false, 'NONE');
runCase('SQL Injection attempt 1', "' OR 1=1 --", false, 'NONE');
runCase('SQL Injection attempt 2', "admin' --", false, 'NONE');
runCase('XSS attempt 1', '<script>alert(1)</script>', false, 'NONE');
runCase('XSS attempt 2', '<img src=x onerror=alert(1)>', false, 'NONE');
runCase('HTML special chars', '<div>test</div>', false, 'NONE');
runCase('Unicode homoglyphs / non-latin', 'мh13543505', false, 'NONE'); // Cyrillic 'м'
runCase('Null byte attempt', 'mh13543505\0', true, 'GREEN'); // Trims or includes key safely

console.log('\n▶ TEST 5: Verification of Meta Tags in index.html Source');
const metaKeyMatch = htmlSource.match(/<meta\s+name=["']key["']\s+content=["']([^"']+)["']/i);
const metaGatewayMatch = htmlSource.match(/<meta\s+name=["']gateway["']\s+content=["']([^"']+)["']/i);

if (metaKeyMatch && metaKeyMatch[1] === 'mh13543505') {
    console.log(`  ✔ PASS: <meta name="key"> tag is accurately defined as "${metaKeyMatch[1]}"`);
    passed++;
} else {
    console.error(`  ✖ FAIL: <meta name="key"> tag missing or incorrect`);
    failed++;
}

if (metaGatewayMatch && metaGatewayMatch[1] === 'https://mhshoppingkill87689.dark/mh13543505') {
    console.log(`  ✔ PASS: <meta name="gateway"> tag is accurately defined as "${metaGatewayMatch[1]}"`);
    passed++;
} else {
    console.error(`  ✖ FAIL: <meta name="gateway"> tag missing or incorrect`);
    failed++;
}

console.log(`\n==============================================================================`);
console.log(`AUTHENTICATION SUITE SUMMARY: ${passed} passed, ${failed} failed.`);
console.log(`==============================================================================`);

if (failed > 0) process.exit(1);
