# Luma Clinic landing concept

Fictional Thai beauty clinic demo built with `codelv8-ui-ux` and built-in `imagegen`. No application framework or runtime dependency added. All packages, prices, cases, brand and premises are fictional. Images are generated illustrations, not patient photographs or treatment results.

## Brief and direction

Primary visitor: someone browsing aesthetic care on a phone and comparing first-visit options. Observable task: explore services, filter packages, inspect details or illustrative cases, select a package and complete a local booking simulation.

Sequence: editorial hero → care categories → asymmetric package comparison → illustrative case journeys → clinic atmosphere → FAQ → consultation CTA. Warm cream, lavender and restrained glass, large Thai headings, arched portrait and local LINE Seed Sans TH. Motion is limited to hover feedback and smooth anchor navigation, with reduced-motion support. Semantic CSS variables live in `styles.css`.

Booking uses a native modal dialog with focus containment, Escape, explicit close and opener focus recovery. Name/date errors stay next to fields and preserve entered values. Service choice transfers from package/case details. Closing clears the demo form. No phone, email, health history, API, analytics, cookies or storage collection. Dates use the local browser calendar day.

## Example packages and cases

| Package | Illustrative price | Example case |
|---|---|---|
| Glow Starter | ฿1,990 / one visit | Adult office worker seeking a simple moisture-care routine |
| Clear & Calm | ฿3,490 / two visits | Adult concerned about acne who starts with professional assessment |
| Skin Ritual | ฿5,900 / three visits | Adult seeking a manageable routine and follow-up |

These are content and UX examples, not clinical recommendations or sales offers. No medicines, invasive procedures, promised outcome, fake review or before/after claim is presented.

## Optional software packages

The shipped demo needs only HTML/CSS/JavaScript. Avoid dependencies until a production integration needs them.

| Candidate | Use when needed | Tradeoff / primary reference |
|---|---|---|
| `lucide` | A larger, consistent SVG icon set in a vanilla app | Import a small icon subset; no CDN needed. [Official vanilla guide](https://lucide.dev/guide/lucide) |
| `@radix-ui/react-dialog` | A future React app needs composable accessible dialogs | React-specific; unnecessary for this native-dialog demo. [Official Dialog docs](https://www.radix-ui.com/primitives/docs/components/dialog) |
| `@playwright/test` | Integrating browser regressions into project CI | Development tooling and browser binaries; no visitor runtime cost. [Official installation](https://playwright.dev/docs/intro) |

The existing QA pattern uses `playwright` and a separately configured `axe-core` script; no package was installed into this repository.

## Assets and provenance

- `assets/hero.png`, `assets/interior.png`: generated originals, copied into this workspace.
- `assets/hero.webp` (84,310 bytes), `assets/interior.webp` (284,510 bytes): WebP encoding of those originals at quality 86; no creative edits.
- Full successful prompts and generation mode: [IMAGE-PROMPTS.md](IMAGE-PROMPTS.md).
- Original local LINE Seed Sans TH Regular/Bold reused from this repository's PMS demo with its OFL notice. Publisher terms verified: [LINE Seed](https://seed.line.me/index_th.html). © LY Corporation.

## Run and handoff

From the repository root:

```powershell
python -m http.server 8772 --bind 127.0.0.1 --directory .\demos\clinic-landing
```

Open `http://127.0.0.1:8772/`. Opening `index.html` directly also works for normal browsing; QA targets the HTTP address. No build is needed.

Only new `demos/clinic-landing` files and an additive README link belong to this change. Existing uncommitted demos/skills/tests were preserved. No deployment, commit, production data or credentials changed. Rollback consists of reverting the added README entry and retaining/removing this new demo directory after confirming its exact path.

The source root was verified using Git at HEAD `3939715047c5a2674d516f412531fe42a44a7f5e`. The canonical knowledge registry has no entry for this repository, so no curated project notes were updated. No structural relationship to another project is asserted.
