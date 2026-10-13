# Verification and review

Match checks to the requested artifact and risk. Use existing project commands after inspecting manifests/docs; this skill supplies no universal executable gate. Do not invent commands, install tooling silently, or use another kit's examples to prove the project works.

## Evidence lanes

| Lane | Evidence | What it does not prove |
|---|---|---|
| Static/build | Actual type/lint/build results for changed code | Browser behavior, usability or pixels |
| Interaction | Browser actions and assertions on the real page/component | Backend persistence when tested only with fixtures |
| Accessibility | Automated audit plus keyboard/focus checks; measured relevant contrast | Complete WCAG compliance or all assistive technology behavior |
| Visual | Screenshots actually inspected at relevant sizes/states/themes | Real user approval or usability research |
| Data/API, when affected | Existing safe integration checks tracing request and resulting data | Production readiness from a mock alone |

Mark each applicable lane **passed**, **failed**, or **not verified**, with command/tool, target, and observed result. Mark truly irrelevant checks **not applicable** with a reason. A zero exit code with `SKIPPED` is not verified. When browser/tooling is unavailable, finish useful source/spec work and report the missing evidence; do not replace it with a fabricated pass.

## Acceptance inventory before code signoff

List the requested behavior, interactive controls, state changes, responsive requirements, and claims you intend to make. Tie each to an observable check. Verify:

- Happy path and relevant validation/network/permission failures; input survives recoverable errors.
- Click/tap and keyboard activation; visible focus, logical Tab order, Escape and return focus for overlays.
- Required variants/states using a harness/story or real flow; only supported themes.
- Representative mobile/tablet/desktop viewports, long Thai content and zoom; no unintended document overflow.
- Reduced motion; content remains available and state transitions still function.
- Existing auth/server validation and actual persistence if those layers changed.

For accessibility, prefer the project's tools and current [WCAG 2.2](https://www.w3.org/TR/WCAG22/) / [APG](https://www.w3.org/WAI/ARIA/apg/) guidance. Normal text generally needs 4.5:1 and large text 3:1; applicable non-text controls need 3:1. WCAG 2.2 AA target-size minimum is 24 CSS px with exceptions; 44 px is a useful ergonomic default, not the universal AA threshold. Measure actual colors, including transparent surfaces and states, before reporting ratios.

## Visual pass

Inspect actual rendered images after interaction, not only their filenames. Look for clipped Thai glyphs, long labels, wrong hierarchy, overlay/action reachability, misaligned icons, cramped controls, broken wrapping, and excessive decoration. Capture deterministic settled states; wait for transitions or disable them only for static geometry inspection. Check motion separately with animations enabled. Record issues and recheck affected states after fixes.

## Review-only and spec-only

For review, give prioritized findings with affected location, observed evidence, user consequence, concrete fix and verification. Separate source-confirmed defects from suspected runtime problems. Do not edit without scope to do so. If no actionable issue is found, say what was examined and which evidence remains missing.

For specification, check task coverage, hierarchy, variants, applicable states, tokens, responsive behavior, accessibility and acceptance criteria. Report **specification reviewed**; runtime checks are not applicable because no implementation exists. Never call the spec browser-tested.

## Completion report

Report the changed artifact and purpose, checks actually run with scope, remaining failures/unverified lanes, and material limitations. Do not call a demo a deployed application, a fixture an integrated backend, or an automated accessibility scan full WCAG certification. Keep useful work when a lane is unavailable rather than hiding its status.
