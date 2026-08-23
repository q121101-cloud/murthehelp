# Original User Request

## Initial Request — 2026-08-24T02:01:04+07:00

Improve the single-file Vietnamese dark web simulation at `/Users/quan/.gemini/antigravity/scratch/murthehelp/index.html`.

Working directory: /Users/quan/.gemini/antigravity/scratch/murthehelp
Integrity mode: development

---

## Requirements

### R1. Ticker Pause on Hover + Slow Down Speed

The scrolling ticker/marquee at the very top of the public disguise storefront (Hoàng Hắc Long) currently keeps scrolling even when the user hovers their mouse over it, and it scrolls too fast.

- When the user moves their mouse cursor **over** the ticker, it must **completely pause** (stop moving).
- When the mouse leaves, it resumes scrolling.
- Reduce the scrolling speed by approximately 40–50% compared to its current speed (make it noticeably slower and more readable).

### R2. Hide F12 Button; Remap Trigger to Footer Triple-Click

Currently there is a visible "F12 Kiểm Tra Mã Nguồn Trang" button in the top navigation bar of the storefront. This button is too obvious and breaks immersion.

- **Remove** (hide or delete) the "F12 Kiểm Tra Mã Nguồn" / "F12 Mã Nguồn" button from the storefront navbar entirely.
- Instead, implement a **triple-click handler** on the yellow text `HHL-13543505-HUE` in the storefront footer (the "MÃ ĐKKD:" field). Three consecutive clicks on that yellow text within 1.5 seconds must trigger the hidden portal (call `triggerMurthehelpPortal()` or the equivalent function). After triggering, reset the click counter.
- The F12 inspection modal (`id="f12-inspection-modal"` or similar) can remain in the DOM for functionality, but its trigger button in the navbar must be gone.

### R3. Rebrand Dark Mall Header

In the dark mall stage (`id="dark-stage"`), the header currently displays `MURDER.SHOPPING.MALL`.

- Change the displayed branding text to `MURDER-SHOP` (hyphen separator, no dot notation).
- Any associated subtitle, badge, or `<title>` tag that references the old brand should also be updated to match.

### R4. Expand Product Catalog with More Items and Working Images

The dark mall product catalog currently has too few items and several product cards show broken images (the Revolver category cards RED-R01, RED-R02, RED-R03 and some others show a broken image icon).

- Add at least **10 additional products** spread across existing categories (Pistol, Revolver, SMG, Assault Rifle, Sniper Rifle, Explosives, Melee) or across other clearance tiers (PURPLE, YELLOW, GREEN if they exist).
- **Fix all broken product images**: replace any broken Unsplash or placeholder URLs with verified working image URLs from Unsplash, Pexels, or similar public CDNs. Each product image must visually match the product type.
- New product entries must follow the same JavaScript data structure as existing items (id, name, subCat, code, price, img, specs).

---

## Acceptance Criteria

### Ticker
- [ ] Hovering mouse over the ticker row freezes the animation/scroll completely.
- [ ] Moving mouse away resumes scrolling.
- [ ] Scroll animation duration is visibly slower (noticeably more readable) than before.

### F12 Button
- [ ] No "F12 Kiểm Tra Mã Nguồn" or "F12 Mã Nguồn" button is visible anywhere in the storefront navbar.
- [ ] Clicking the yellow `HHL-13543505-HUE` text in the footer exactly 3 times within 1.5 seconds successfully opens the portal (transitions to portal-stage).
- [ ] The F12 inspection modal content still functions (just no visible navbar button).

### Branding
- [ ] The dark mall header reads `MURDER-SHOP` — not `MURDER.SHOPPING.MALL`.
- [ ] No leftover references to `MURDER.SHOPPING.MALL` in visible UI text (code/data is fine).

### Products
- [ ] At least 10 new product entries are added to the `PRODUCTS` array.
- [ ] Zero broken image icons (no 404 or `?` placeholder image) on any visible product card.
- [ ] All new product images display a relevant photo matching the product category.

### No Regressions
- [ ] JavaScript passes syntax validation: `node -e "new Function(...)"` on both inline script blocks returns no errors.
- [ ] Login with `q121101` / `Tungqu@n1208.` still works end-to-end.
- [ ] After all changes, commit and push: `git add . && git commit -m "feat(ui): ticker pause on hover, hide F12 button, footer triple-click trigger, rebrand MURDER-SHOP, expand product catalog" && git push origin main`.
