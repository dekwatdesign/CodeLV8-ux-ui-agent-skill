# Orbit demo QA — 2026-10-13

Target: http://127.0.0.1:8768/demos/orbit-landing/ served from the repository root. Chromium 151.0.7922.34.

| Lane | Result | Evidence |
|---|---|---|
| Static | Passed | node --check demos/orbit-landing/app.js; git diff --check |
| Browser | Passed | 35 assertions, evidence/results.json |
| Responsive | Passed at tested sizes | 320/390/768/1440 CSS px without document overflow; 720 CSS px reflow as a 200 percent zoom equivalent, not an actual browser zoom test |
| Accessibility | Tested targets passed | Four viewport axe audits plus mobile dialog audit, zero violations; keyboard FAQ and pricing, modal focus, Tab containment, Escape and opener focus recovery, reduced motion |
| Visual | Inspected | Full desktop/mobile pages, desktop/mobile hero, mobile modal success; Thai text and action placement inspected |
| Backend | Not applicable | No server writes, accounts, payments, or storage; network assertion confirmed local GET requests only |

The first launch targeted an unavailable headless shell. The runner now uses the already installed full Chromium executable via chromium.executablePath(); no downloads. The first 320px check found overflow from a rotated decorative ellipse. Removing its rotation preserved the complete aurora glow and resolved overflow; all checks reran successfully after the final CSS change.

No full WCAG certification, screen reader study, user approval, or production readiness claimed. Eight individual modal Tab assertions are included in the 35 count; the count is not 35 independent product scenarios.

Reproduce with the already available tooling on this machine:

```powershell
python -m http.server 8768 --bind 127.0.0.1 --directory 'D:\Projects\CodeLV8-ux-ui-agent-skill'
```

In another terminal:

```powershell
$env:NODE_PATH = 'C:\Users\User\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules'
$env:CODELV8_AXE_PATH = 'C:\Users\User\AppData\Local\Temp\codelv8-ui-ux-eval-20261013\node_modules\axe-core\axe.min.js'
node demos/orbit-landing/qa.cjs
```

Without CODELV8_AXE_PATH, the runner performs interaction/layout checks only; automated accessibility is not verified by that run. Tool paths are test configuration, not page dependencies. The static page can be opened directly through index.html.
