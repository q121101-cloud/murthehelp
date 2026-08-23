const fs = require('fs');

const content = fs.readFileSync('/Users/quan/.gemini/antigravity/scratch/murthehelp/index.html', 'utf8');

const regex = /(https:\/\/images\.unsplash\.com\/[^"'\s\)]+)/g;
let match;
const urls = new Set();
while ((match = regex.exec(content)) !== null) {
  urls.add(match[1]);
}

console.log(`Found ${urls.size} unique Unsplash URLs`);

async function run() {
  let ok = 0;
  let failed = 0;
  for (const u of urls) {
    try {
      const res = await fetch(u, { method: 'HEAD' });
      if (res.status === 200) {
        ok++;
      } else {
        console.error(`FAIL [${res.status}]: ${u}`);
        failed++;
      }
    } catch (err) {
      console.error(`ERROR: ${u}`, err.message);
      failed++;
    }
  }
  console.log(`\nIMAGE AUDIT RESULT: ${ok} valid, ${failed} failed out of ${urls.size} total.`);
  if (failed > 0) process.exit(1);
}

run();
