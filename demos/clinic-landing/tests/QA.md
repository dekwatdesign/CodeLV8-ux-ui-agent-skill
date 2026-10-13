# Clinic demo QA · 2026-10-13

Target: `http://127.0.0.1:8772/`, serving `demos/clinic-landing`.

| Evidence lane | Result | Scope |
|---|---|---|
| Static | Passed | `node --check demos/clinic-landing/app.js`; `git diff --check` |
| Browser | Passed | 59/59 assertions, Chromium 151.0.7922.34; [results.json](evidence/results.json) |
| Responsive | Passed at tested sizes | 320/390/768/1440 CSS px and tablet 125% zoom; no document overflow |
| Accessibility | Tested targets passed | Five axe scans: four widths and booking success; keyboard filters, FAQ, mobile menu Escape and modal Tab/Shift+Tab/Escape/focus recovery |
| Visual | Inspected | Full desktop/mobile page, desktop hero, mobile booking; Thai wrapping, hierarchy, imagery, form reachability |
| Integration | Not applicable | Local simulation; no backend, clinical advice, appointment persistence or confirmed booking |

Other checks: both local generated assets and Thai font loaded; all three package and case modals; service selection transfer; required fields and past-date rejection; values retained on error; cleared on close; no external requests, storage entries or runtime/asset errors; reduced motion.

Found and corrected: a desktop illustration label's contrast, an unintended mobile header CTA caused by CSS specificity, and keyboard Tab wrapping at a native dialog boundary. Early harness runs also needed to select the already installed Chromium executable and wait for the lazy-loaded interior image. The full final run passed. Prior failure evidence remains as a debugging record in `failure.json` and is superseded by `results.json`.

This is not full WCAG certification, a screen-reader study, real-user approval, production or clinical validation.

## Reproduce

Start the server using [DESIGN.md](../DESIGN.md), then configure installed QA dependencies:

```powershell
$env:CODELV8_PLAYWRIGHT_PATH = 'C:\Users\User\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules\playwright'
$env:CODELV8_AXE_PATH = 'C:\Users\User\AppData\Local\Temp\codelv8-ui-ux-eval-20261013\node_modules\axe-core\axe.min.js'
node '.\demos\clinic-landing\tests\qa.cjs'
```

These machine-specific test paths do not affect the website. The runner can also resolve an installed `playwright` package when the first environment variable is absent. It requires an existing axe-core file and fails rather than skipping the audit if that file is missing.
