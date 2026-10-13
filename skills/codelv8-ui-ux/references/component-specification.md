# Component specification and implementation

For a single component, identify its role in the user's task and check for an existing project equivalent first. Adapt the depth to the request; a specification does not authorize implementation.

## Specification contract

Include:

- Purpose, anatomy, visible content, and the primary interaction.
- Required variants/sizes and their actual use cases, rather than speculative variants.
- Public props/events or inputs/outputs when code is requested; match the framework and existing naming.
- Applicable states and transitions, including asynchronous content and failure recovery.
- Semantic token mapping and responsive/long-content behavior.
- Accessibility: semantic element, accessible name, keyboard operation, focus, and announcements.
- Observable acceptance criteria and the evidence required to verify them.

Use a small anatomy sketch or table when it clarifies structure. Reference existing project tokens by real name; mark proposed tokens as additions.

## State coverage

Assess these states; mark a state not applicable with a reason rather than rendering meaningless examples:

| State | Verify |
|---|---|
| Default | Clear purpose and readable content |
| Hover | Feedback where pointer input exists; no essential hover-only action |
| Focus | Visible indicator; logical order; not obscured |
| Active/pressed | Activation feedback without a misleading persistent state |
| Disabled | Correct native/ARIA semantics and understandable unavailable action |
| Loading | Busy/status feedback, duplicate prevention, stable geometry |
| Error | Useful recovery and field association when relevant |
| Selected/expanded | State matches actual UI and uses the appropriate semantic attribute |

Add empty/success/indeterminate states where the component needs them. Use `aria-pressed` for a toggle button, `aria-expanded` for a disclosure, `aria-selected` for supported selection widgets, and `aria-invalid` for invalid fields. Do not add arbitrary ARIA to ordinary elements. Prefer native semantics.

## Overlays and composite controls

Modal: label the dialog, put focus inside when opened, contain Tab/Shift+Tab, support Escape where safe, make background interaction unavailable, and return focus to the opener or meaningful fallback. Protect dirty forms. Scroll without losing actions on short/narrow viewports. A non-modal popover has different focus needs; do not trap focus indiscriminately.

For custom comboboxes, menus or tabs, follow the applicable [WAI-ARIA APG pattern](https://www.w3.org/WAI/ARIA/apg/patterns/) and verify keyboard behavior. A native select is acceptable; replacing it carries a real accessibility and maintenance cost.

## Motion and implementation

Animate to explain change or confirm input, not to delay task completion. Use existing motion tokens, targeted properties and bounded durations. Prefer compositor-friendly transforms/opacity when they express the effect correctly; layout transitions can be appropriate when tested for cost. Avoid blanket `transition: all`. Respect `prefers-reduced-motion`, including JavaScript-driven motion, and preserve the final state when motion is reduced.

Use the project's icon library with accessible names for icon-only controls; do not improvise ambiguous glyphs. Reuse one implementation across screens.

For code, use a state harness/story or existing component test environment to exercise required variants and states. Verify actual click/keyboard effects, supported themes and representative viewport sizes. Inspect rendered screenshots after interaction. Follow [verification](verification.md); a state table alone proves no runtime behavior.
