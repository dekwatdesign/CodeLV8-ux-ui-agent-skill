# Screen design and redesign

## Decide the structure

Describe the primary task, information order, main action, visual direction, and motion purpose before markup. Let the content shape the layout. Do not force every product into identical cards, centered marketing sections, or a dashboard shell.

Reuse the existing shell, navigation, component language, token naming, and responsive conventions. Inventory content and user actions before choosing a grid. On a dashboard, distinguish urgent exceptions, summary, trends, and drill-down; avoid inventing business data. Clearly mark fixture content in demonstrations.

## Resolve visual direction into the theme

Use semantic tokens for text, surfaces, border, focus, action, status, spacing, type, radius, elevation, and motion. Extend the project's existing layer; do not introduce a parallel theme or unnecessary token pipeline.

Without an established style, apply restrained Aurora Glassmorphism: neutral readable base, limited aurora accents, mostly opaque work surfaces, and blur only where it adds hierarchy. Provide a solid fallback. Validate actual foreground/background pairs, including gradients, overlays, hover, and focus. Decorative blur must not reduce readability or create avoidable rendering cost.

Prefer locally hosted LINE Seed Sans TH for new Thai UI when available and permitted. Official source: [LINE Seed](https://seed.line.me/) and [font archive](https://seed.line.me/src/images/fonts/LINE_Seed_Sans_TH.zip). Verify terms, included weights, file format, and real paths before adding `@font-face`; use `font-display: swap` and a suitable system fallback. Preserve an established project font. Do not use the document font TH SarabunPSK as the automatic web default.

## Make responsive behavior intentional

Start with the narrow layout and add capacity as space grows. Prioritize rather than simply shrink. Keep critical fields/actions accessible, allow toolbars to wrap, and use a deliberate scroll region for genuinely wide data. Avoid document-wide overflow. Overlays must fit the viewport, scroll internally when needed, and expose close/actions on small screens.

Use existing breakpoints; verify representative mobile, tablet, and desktop sizes. Check Thai/long text, zoom, large text, empty data, and dense records. Support existing/requested themes, not an unrequested second theme.

## Build only the authorized layer

For specifications, deliver layout, flow, states, responsive rules, token intent, and acceptance criteria. Stop at the spec; no application scaffolding or dependencies.

For implementation, keep the framework, routes, data contracts and permission controls intact. Separate data fetching from presentational concerns using existing conventions. Use believable labeled fixtures only for demos; avoid implying persistence or backend validation from a fixture. Add external components only after [source selection](source-catalog.md).

## Redesign an existing interface

Observe current UI and source before editing. Identify the actual friction and existing successful behavior. Prioritize concrete issues: hard-to-find action, weak hierarchy, invalid focus flow, unreadable state, inaccessible control, mobile overflow, or excessive motion.

Propose focused changes and preserve critical paths, URLs, auth, CRUD outcomes, list state and keyboard behavior. Capture before/after evidence where possible. Broad architecture changes require a separate reason and scope. Run regression checks on the affected workflow, not merely a screenshot of the new default state.

Finish using [verification](verification.md). Visual inspection cannot be replaced by a kit's sample checks or a successful build.
