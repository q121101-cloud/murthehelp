## 2026-08-23T19:05:47Z

You are the E2E Test Writer for the Murthehelp project.
Your working directory is `/Users/quan/.gemini/antigravity/scratch/murthehelp/.agents/e2e_test_writer_1`.
You MUST read `/Users/quan/.gemini/antigravity/scratch/murthehelp/.agents/ORIGINAL_REQUEST.md` and `/Users/quan/.gemini/antigravity/scratch/murthehelp/PROJECT.md` before starting.
Also review survey reports at:
- `/Users/quan/.gemini/antigravity/scratch/murthehelp/.agents/survey_explorer_1/handoff.md`
- `/Users/quan/.gemini/antigravity/scratch/murthehelp/.agents/survey_explorer_2/handoff.md`
- `/Users/quan/.gemini/antigravity/scratch/murthehelp/.agents/survey_explorer_3/handoff.md`

Your tasks:
1. Create `TEST_INFRA.md` at `/Users/quan/.gemini/antigravity/scratch/murthehelp/TEST_INFRA.md` documenting the test methodology (Category-Partition, BVA, Pairwise, Real-World Workloads), feature inventory coverage, and tier breakdown.
2. Implement a comprehensive, standalone Node.js test suite at `/Users/quan/.gemini/antigravity/scratch/murthehelp/tests/e2e/test_runner.js` covering:
   - **Tier 1 (Feature Coverage)**: Individual assertions for R1 (ticker hover pause and speed reduction), R2 (F12 button absence in navbar/hero, modal presence in DOM, footer yellow text and 1.5s triple click logic), R3 (MURDER-SHOP branding text and no old references), R4 (catalog size >= 50, all required categories/tiers populated).
   - **Tier 2 (Boundary & Corner Cases)**: Rapid consecutive clicks (e.g. 2 clicks vs 3 clicks vs 4 clicks; clicks spaced > 1.5s resetting counter), extreme ticker animation CSS properties, schema validation on all products (id, name, subCat, code, price, img, specs), price formats and non-empty strings.
   - **Tier 3 (Cross-Feature Combinations)**: Stage transitions (disguise -> portal via triple click, portal -> dark stage via login, dark stage -> disguise via returnToDisguise), cart operations, clearance filtering.
   - **Tier 4 (Real-World Application Scenarios & Image Health)**:
     * Full login simulation with Super Admin credentials `q121101` / `Tungqu@n1208.`.
     * Live asynchronous HTTP HEAD check for EVERY product image URL in `PRODUCTS_DB` ensuring 100% return HTTP 200 OK (zero broken links).
     * Script syntax verification (`new Function(...)` on all inline script tags).
3. Test runner must output clear structured reporting with exit code 0 when all tests pass and non-zero on failure.
4. Execute `node tests/e2e/test_runner.js` and verify it runs cleanly (it is expected that some implementation assertions will fail until workers implement changes).
5. When complete, publish `TEST_READY.md` at `/Users/quan/.gemini/antigravity/scratch/murthehelp/TEST_READY.md` summarizing the test suite.

Write your report to `/Users/quan/.gemini/antigravity/scratch/murthehelp/.agents/e2e_test_writer_1/handoff.md` and send a completion message.
