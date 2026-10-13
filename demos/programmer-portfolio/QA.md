# Obtained evidence — 2026-10-13

Target: `http://127.0.0.1:8768/demos/programmer-portfolio/`, real Chromium via Playwright CLI. Screenshots are under `D:\Projects\CodeLV8-ux-ui-agent-skill\output\playwright`.

| Lane | Result | Evidence |
|---|---|---|
| Static | Passed | `node --check` on `app.js` and `studio.js`; GLB JSON chunk parsed and verified |
| Browser interaction | Passed, 29 checks | `tools/browser-qa.js` (26) and `tools/fallback-qa.js` (3) |
| Automated accessibility | Passed for selected checks | axe-core 4.10.3; no violations in four viewport states and two dialogs, WCAG 2 A/AA, 2.1 AA and 2.2 AA tags |
| Keyboard | Passed in tested flow | Enter opens project details; Tab stays in the native modal; Escape closes and returns focus |
| Visual | Passed in inspected screenshots | Blender render, desktop, 768px tablet, 390px and 320px mobile, project dialog inspected; camera axis, head parenting and 320px title overflow corrected |
| Data/API | Not applicable | Fixtures only; no backend or message delivery |
| Physical-device / cross-browser / FPS | Not verified | No claim of Safari, Firefox, physical mobile GPU performance or measured frame rate |

The 26 main checks verified GLB loading and clips, both local font weights, animation time advancement, pause/resume, changed canvas pixels, camera rotation/reset, no document overflow and canvas sizing at 1440/768/390/320px, both project modals, mobile dialog geometry, keyboard containment and focus restoration, contact opening, clipboard denial feedback, reduced motion, aborted-model fallback and no uncaught page errors. The 3 additional checks verified a forced unavailable WebGL context, usable project details without WebGL, and successful copy feedback using a controlled clipboard stub.

Clipboard tests check UI behavior with success/denial stubs; they do not prove the host OS clipboard permissions. The intentional aborted GLB request emits `net::ERR_FAILED`; the tested recovery displays the poster and retains the UI. This expected negative-path resource error is distinct from an uncaught JavaScript error (zero).

An automated scan is not full WCAG certification or user visual approval. The three GLB animation targets were verified from the saved binary, and actual animated canvas output changed when resumed. No production claims are made for fictional case studies.

## Retopology update

After the character refinement, the main 26 browser checks passed again with zero uncaught page errors. Updated Blender render, Blender wireframe view and browser screenshots were inspected. The in-app browser was reloaded and the updated scene observed.

Seven base character meshes are all-quad, closed manifold and free of zero-area faces by BMesh checks; measured details are in `evidence/retopology.json`. The saved GLB contains three animation clips and 202 mesh entries, no `Retopo source` nodes, and 2,062,060 bytes. Accessor counts confirm exported subdivision: head/torso/hand 1,538 vertices, sleeve 1,410 vertices. These checks cover the existing object animations; skeleton deformation and physical-device FPS remain unverified.

## Current connected high-poly update

The preceding section records the earlier asset. Current binaries are measured in `evidence/high-export.json`: desktop 9,441,216 bytes / 446,348 triangles; mobile 3,376,992 bytes / 142,220 triangles. Both contain 200 meshes and three animation clips, with no archived source nodes. Desktop body POSITION accessor contains 104,450 vertices; mobile contains 26,114.

Current cage assertions verify 1,632 quads in a single connected torso/arm component, closed manifold edges, nonzero face area and continued head-to-monitor alignment. The edited torso has zero boundary and non-manifold edges. Blender render and control-cage wireframe were inspected, along with the browser render; in-app browser was refreshed and observed.

The main 26 browser checks passed again. `tools/high-quality-qa.js` added 12 passing checks: actual mobile-model requests at 390/320px, correct quality selection, three clips, no overflow, animation advancement, mobile asset failure recovery, and desktop high-model loading. This pass therefore obtained 38 browser checks. Tests do not establish physical-device FPS or skeletal deformation.

```powershell
npx.cmd --yes --package @playwright/cli playwright-cli -s=portfolio run-code --filename=demos/programmer-portfolio/tools/high-quality-qa.js
```

## Current Tripo room integration

The current assets supersede the preceding procedural high-poly version. Both exported GLBs contain exactly one scene, one animation clip with a `weights` channel, and three named morph targets (`Type left`, `Type right`, `Breathe`). Desktop: 10,892,352 bytes; mobile: 8,582,108 bytes; both contain 120,803 triangles. Source counts are in `evidence/tripo-room-export.json`.

The 26 main browser checks and 12 high/mobile quality checks passed again (38 total). The quality check now requires an animation rather than the obsolete exact three-object-clip count, because the new clip combines three morph channels. Pausing freezes the timeline; resuming changes actual canvas pixels. Desktop and both mobile startup paths load and animate the current assets.

The local HTTP server/session had stopped before verification (`net::ERR_CONNECTION_REFUSED`); after verifying port 8768 was free, a localhost-only Python server was started against the same repository root. Browser verification then passed. Furniture was evaluated in its original scene before copying, preventing loss of bevels when exporting morph targets without applying modifiers.

The actual Blender render and browser screenshot `output/playwright/portfolio-tripo-room.png` were inspected. The Tripo character faces the monitor and uses its generated keyboard/seat shell, with hands raised to desk height. This local animation uses shape keys, with no new Tripo API call, paid rig, skeleton or full-body retargeting.

## Latest: original character restored

At the user's request, all four original room assets were restored from the pre-integration backup and verified with SHA-256. Both current GLBs contain the original `Head`, omit the Tripo character, and contain three object animation clips. Desktop/mobile bytes are again 9,441,216 / 3,376,992.

All 38 browser checks passed after restoration. Actual animation pixels, pause/resume, camera reset and mobile startup paths were checked. The in-app browser was reloaded and the restored original character observed; screenshot: `output/playwright/portfolio-original-restored.png`. Tripo candidate files and an archived integrated-room version were preserved. No new Tripo call or credit expenditure was made.

## Reproduce browser checks

From the repository root with the HTTP server available:

```powershell
npx.cmd --yes --package @playwright/cli playwright-cli -s=portfolio open http://127.0.0.1:8768/demos/programmer-portfolio/ --headed
npx.cmd --yes --package @playwright/cli playwright-cli -s=portfolio run-code --filename=demos/programmer-portfolio/tools/browser-qa.js
npx.cmd --yes --package @playwright/cli playwright-cli -s=portfolio run-code --filename=demos/programmer-portfolio/tools/fallback-qa.js
npx.cmd --yes --package @playwright/cli playwright-cli -s=portfolio run-code --filename=demos/programmer-portfolio/tools/accessibility-qa.js
```

The accessibility script expects the test-only `output/playwright/vendor/package/axe.min.js` obtained in this session from the npm `axe-core@4.10.3` tarball. Restore that exact dependency before re-running if test output is archived. The QA scripts run through CLI; they are not Playwright Test specs.
