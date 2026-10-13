# PMS prototype QA — 2026-10-13

Actual target: `http://127.0.0.1:8767/`, serving `demos/pms-dashboard`.

| Lane | Result | Evidence and limit |
|---|---|---|
| Static | Passed | `node --check demos/pms-dashboard/app.js`; repository whitespace check |
| Browser interaction | Passed | 58 assertions in [results.json](evidence/results.json), Chromium 151.0.7922.34 |
| Accessibility | Tested targets passed | Seven axe audits: four viewports, desktop validation modal, two mobile modal states. Actual Tab/Shift+Tab, tab arrows/End, Escape, focus recovery and reduced motion exercised. Not full WCAG certification or a screen-reader study. |
| Responsive | Passed at tested sizes | 320/390/768/1440 CSS px; 125% zoom at tablet; mobile menu and forms. No unintended document overflow in those checks. |
| Visual | Inspected | Desktop/tablet/mobile dashboard plus settled validation and mobile modal screenshots. Thai text wrapping, action reachability, hierarchy, focus/error rendering checked. No user approval asserted. |
| Integration | Not applicable | Fictional in-memory prototype, no API/auth/database or real personnel outcomes |

Verified interactions: department/cycle scope, missing-score average, queue shortcut, search/empty reset, pagination, detail tabs, score and goal validation, retained values, dirty-close cancellation, saving busy state, updated metrics, escaped goal titles, show-all goals, filtered CSV, closed-round read-only behavior, offline local interactions, and reload reset.

Two implementation issues were found and fixed: focus recovery could select a goal-card trigger after a filtered row disappeared; read-only fields changed the form serialization and falsely looked dirty. Full browser checks subsequently passed. Test selectors were also corrected to use visible controls and an unambiguous navigation link. Screenshots now wait for finite animations to settle before capture.

Test invocation in this workspace:

```powershell
$env:CODELV8_PLAYWRIGHT_PATH = 'C:\Users\User\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules\playwright'
$env:CODELV8_AXE_PATH = 'C:\Users\User\AppData\Local\Temp\codelv8-ui-ux-eval-20261013\node_modules\axe-core\axe.min.js'
node '.\demos\pms-dashboard\tests\qa.cjs'
```

The test runner can alternatively resolve installed `playwright` and `axe-core` packages; the prototype itself requires neither. No dependency was added to the application. Machine-specific test paths are configuration, not a runtime dependency of the skill or dashboard.

Evidence images include [desktop preview](evidence/dashboard-preview.png), [mobile preview](evidence/dashboard-mobile-preview.png), [desktop validation](evidence/detail-error-desktop.png), [mobile goal form](evidence/goal-modal-mobile.png), and [mobile review](evidence/review-modal-mobile.png). Full-page snapshots are retained at each tested width.

Font archive lacked a standalone license file; TTF metadata in the same official archive and the publisher's license page were checked before distributing the two original WOFF2 files with an OFL notice. WOFF2 metadata parsing initially needed an unavailable Brotli extension, so the original TTF metadata was read instead without modifying font binaries. The official OFL plaintext endpoint denied the terminal fetch; the notice includes the official license text obtained through browsing.
