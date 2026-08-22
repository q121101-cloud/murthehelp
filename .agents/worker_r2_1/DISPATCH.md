## 2026-08-23T01:43:00Z
You are the Worker for the murthehelp project.
Working directory: /Users/quan/.gemini/antigravity/scratch/murthehelp/.agents/worker_r2_1
Target code file (you own exclusively): /Users/quan/.gemini/antigravity/scratch/murthehelp/index.html
Authoritative User Request: /Users/quan/.gemini/antigravity/scratch/murthehelp/ORIGINAL_REQUEST.md (specifically Follow-up — 2026-08-23T01:38:12+07:00)

Explorer Hand-offs & Reports to read before editing:
1. /Users/quan/.gemini/antigravity/scratch/murthehelp/.agents/explorer_r2_1/report.md (Storefront UI & Verified 100% HTTP 200 CDN Image URLs)
2. /Users/quan/.gemini/antigravity/scratch/murthehelp/.agents/explorer_r2_2/report.md (Portal Subtitle DOM Deletion & Registration UX/Validation)
3. /Users/quan/.gemini/antigravity/scratch/murthehelp/.agents/explorer_r2_3/report.md (Login Form UX & Auth Integrity & Git Pipeline)

Implementation Tasks:
1. R1: Storefront Visual Overhaul:
   - Upgrade the disguise storefront (`#disguise-stage`) to an authentic, modern Vietnamese B2B industrial e-commerce aesthetic for Hoang Hac Long / Hamdeok Heavy Hydraulics.
   - Update `DISGUISE_PRODUCTS` to the 12-item catalog using the 100% HTTP 200 verified Unsplash CDN image URLs from Explorer 1's report (covering steel wire braided hoses, ceramic heat-resistant hoses, Thunder-X P950 pumps, titanium JIS valves, automatic hose reels, Nano-Clean solvent, Inox 316L quick couplings, SUS304 rigging cables, HHL-D650 diesel engine, 1200mm hydraulic cylinder, ISO VG68 hydraulic oil, and glycerin oil pressure gauge). Zero broken images!
   - Modernize hero section with industrial background (`https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1400&auto=format&fit=crop&q=80`), enterprise trust badges (ISO 9001:2015, 24/7 delivery, 24-month warranty, 500+ national projects), and CTAs.
   - Update real-time ticker to prominently display Đơn hàng #HD-71092 (11.200 mét dây ống cao su lõi thép chuyên dụng — 70.000.000 ₫) along with other warehouse dispatches.
   - Add the F12 source inspection modal (`#f12-inspection-modal`) containing `<meta name="key" content="mh13543505" />` with clickable key trigger and top utility bar link.
   - Ensure all secret transition mechanisms remain functional (`mh13543505`, passcodes `GREEN`/`RED`/`PURPLE`/`YELLOW`/`JINMAN`/`7209`, triple-click `HHL-13543505-HUE`, `Ctrl+Shift+K`/`Alt+M`, `Escape` to return).

2. R2: Portal Subtitle Removal:
   - Completely remove `<p class="text-[11px] text-red-300 tracking-widest uppercase font-bold">[ TRẠM TRUNG CHUYỂN CỐ ĐÔ HUẾ // NODE-04-HUE-VN ]</p>` from the DOM inside the portal transition stage.

3. R3: Registration Form Placeholders & Validation:
   - In `reg-fullname`: change placeholder to `Nguyễn Văn A`.
   - In `reg-username`: remove placeholder (make it empty `""`).
   - In `reg-password`: change placeholder to `Tối thiểu 8 ký tự...`.
   - In `handleUserRegister(event)`: update validation to reject passwords shorter than 8 characters (`passwordInput.length < 8`) with alert `'⚠️ Mật mã bảo mật phải có tối thiểu 8 ký tự!'`.

4. R4: Login Form Text & Label Fixes:
   - In `login-username`: change placeholder to `Tên đăng nhập của bạn` (remove all demo account examples `admin / sniper_red / medic_yel...`).
   - In `login-password`: change placeholder to `Nhập mật khẩu`.
   - In the password label above `login-password`: change label text to strictly `PASSCODE:` with no extra Vietnamese text or parentheses.

5. R5: Verification:
   - Validate JS syntax using Node.js (`new Function(...)` on all script blocks).
   - Test test runner if available (`node tests/e2e/test_runner.js` or manual test scripts).
   - Verify account `q121101` with `Tungqu@n1208.` authenticates cleanly.

6. R6: Git Commit & Push:
   - Run: `git add . && git commit -m "feat(ui): visual overhaul storefront, portal text removal, form UX fixes" && git push origin main`
   - Verify push was successful.
