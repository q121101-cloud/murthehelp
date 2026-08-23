const fs = require('fs');

const html = fs.readFileSync('/Users/quan/.gemini/antigravity/scratch/murthehelp/index.html', 'utf8');

console.log("=== MURTHEHELP FORENSIC INTEGRITY TEST SUITE ===");

let failures = [];
let passes = [];

function assert(condition, name, details = "") {
  if (condition) {
    passes.push(name);
    console.log(`[PASS] ${name}`);
  } else {
    failures.push({ name, details });
    console.error(`[FAIL] ${name}: ${details}`);
  }
}

// 1. Check Subtitle Deletion
assert(
  !html.includes('TRẠM TRUNG CHUYỂN CỐ ĐÔ HUẾ // NODE-04-HUE-VN') &&
  !html.includes('NODE-04-HUE-VN') &&
  !html.includes('TRẠM TRUNG CHUYỂN CỐ ĐÔ HUẾ'),
  'Check 1: Subtitle [ TRẠM TRUNG CHUYỂN CỐ ĐÔ HUẾ // NODE-04-HUE-VN ] genuinely deleted from DOM',
  'Found leftover subtitle string in HTML'
);

// 2. Check Disguise Products Count & URLs
const disguiseMatch = html.match(/const DISGUISE_PRODUCTS = (\[[\s\S]*?\]);/);
assert(Boolean(disguiseMatch), 'Check 2a: DISGUISE_PRODUCTS array exists in script');
if (disguiseMatch) {
  const products = eval(disguiseMatch[1]);
  assert(products.length === 12, `Check 2b: Exactly 12 disguise products defined (found ${products.length})`);
  
  const allHaveValidData = products.every(p => 
    p.id && p.category && p.name && p.tag && p.specs && p.price > 0 && typeof p.img === 'string' && p.img.startsWith('https://images.unsplash.com/')
  );
  assert(allHaveValidData, 'Check 2c: All 12 disguise products have genuine data and Unsplash CDN URLs');
}

// 3. Check Registration Form DOM Placeholders
const regFullnameMatch = html.match(/id="reg-fullname"[^>]*placeholder="([^"]*)"/);
assert(
  regFullnameMatch && regFullnameMatch[1] === 'Nguyễn Văn A',
  'Check 3a: Registration HỌ TÊN HIỂN THỊ placeholder is exactly "Nguyễn Văn A"',
  `Actual: ${regFullnameMatch ? regFullnameMatch[1] : 'NOT FOUND'}`
);

const regUsernameMatch = html.match(/id="reg-username"[^>]*placeholder="([^"]*)"/);
assert(
  regUsernameMatch && regUsernameMatch[1] === '',
  'Check 3b: Registration TÊN ĐĂNG NHẬP placeholder is empty',
  `Actual: "${regUsernameMatch ? regUsernameMatch[1] : 'NOT FOUND'}"`
);

const regPasswordMatch = html.match(/id="reg-password"[^>]*placeholder="([^"]*)"/);
assert(
  regPasswordMatch && regPasswordMatch[1].includes('Tối thiểu 8 ký tự'),
  'Check 3c: Registration MẬT MÃ BẢO MẬT placeholder indicates >= 8 chars',
  `Actual: "${regPasswordMatch ? regPasswordMatch[1] : 'NOT FOUND'}"`
);

// 4. Check Registration JS Validation Logic
const hasMin8Validation = /passwordInput\.length\s*<\s*8/.test(html) || /passwordInput\.length\s*>=\s*8/.test(html);
assert(hasMin8Validation, 'Check 4: Registration JS logic enforces >= 8 password length validation');

// 5. Check Login Form Placeholders & Labels
const loginUsernameMatch = html.match(/id="login-username"[^>]*placeholder="([^"]*)"/);
assert(
  loginUsernameMatch && 
  !loginUsernameMatch[1].includes('admin') && 
  !loginUsernameMatch[1].includes('sniper_red') && 
  !loginUsernameMatch[1].includes('medic_yel'),
  'Check 5a: Login username placeholder does not contain demo account examples',
  `Actual: "${loginUsernameMatch ? loginUsernameMatch[1] : 'NOT FOUND'}"`
);

const loginPassMatch = html.match(/id="login-password"[^>]*placeholder="([^"]*)"/);
assert(
  loginPassMatch && loginPassMatch[1] === 'Nhập mật khẩu',
  'Check 5b: Login password placeholder is exactly "Nhập mật khẩu"',
  `Actual: "${loginPassMatch ? loginPassMatch[1] : 'NOT FOUND'}"`
);

const passcodeLabelMatch = html.match(/<label[^>]*>PASSCODE:<\/label>/);
assert(
  Boolean(passcodeLabelMatch),
  'Check 5c: Login password label is exactly "PASSCODE:" with no Vietnamese prefix or parentheses'
);

// 6. Check JS Syntax
try {
  // Extract all script tags
  const scriptRegex = /<script>([\s\S]*?)<\/script>/gi;
  let match;
  let scriptCount = 0;
  while ((match = scriptRegex.exec(html)) !== null) {
    const code = match[1];
    if (code.trim()) {
      new Function(code);
      scriptCount++;
    }
  }
  assert(scriptCount > 0, `Check 6: All JavaScript (${scriptCount} inline blocks) passes syntax validation`);
} catch (err) {
  assert(false, 'Check 6: JavaScript syntax validation', err.message);
}

// 7. Check for Prohibited Integrity Patterns
// (a) Check for hardcoded test mock bypasses
const hasFakePass = /__TEST_PASS__|bypassAllSecurityCheck|mockAlwaysTrue/i.test(html);
assert(!hasFakePass, 'Check 7a: No fake pass conditions or test backdoor flags found');

// (b) Check for facade dummy implementations
const hasDummyFuncs = /function\s+\w+\(\)\s*{\s*return\s+(true|false|null|undefined|"");?\s*}/g.test(html);
assert(!hasDummyFuncs, 'Check 7b: No dummy/facade empty return functions');

// Summary
console.log(`\n==================================================`);
console.log(`SUMMARY: ${passes.length} Passed, ${failures.length} Failed.`);
if (failures.length > 0) {
  console.error("FAILURES DETECTED:", JSON.stringify(failures, null, 2));
  process.exit(1);
} else {
  console.log("ALL FORENSIC CHECKS PASSED WITH ZERO INTEGRITY VIOLATIONS!");
}
