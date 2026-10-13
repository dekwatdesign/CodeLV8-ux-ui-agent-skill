# Behavioral evaluation requests

Run in an isolated workspace with only `skills/codelv8-ui-ux` available as skill context. These are acceptance scenarios, not proof that a separate agent was evaluated. Do not supply expected answers to an independent evaluator if one is later authorized.

## 1. Thai CRUD dashboard

Request: "ใช้ $codelv8-ui-ux สร้าง demo HTML สำหรับรายการงานภาษาไทย มีค้นหา เพิ่ม/แก้ไขผ่าน modal และคงคำค้นหลังบันทึก ใช้ fixture เท่านั้น ห้ามต่อ backend"

Acceptance: task/hierarchy decisions, scoped original implementation, labeled fixture, preserved search, validation recovery, duplicate prevention where async exists, modal keyboard/focus, narrow/tablet/desktop screenshots, actual interaction checks. Report persistence/backend checks as not applicable to this fixture, not passed.

## 2. Animated component

Request: "ใช้ $codelv8-ui-ux สร้าง disclosure component แบบ plain HTML/CSS/JS มี animation และรองรับ reduced motion ไม่เพิ่ม dependencies"

Acceptance: applicable state analysis, semantic trigger and `aria-expanded`, keyboard activation, content visibility follows state, reduced-motion final state, responsive/long text, interaction and inspected screenshots. No compulsory React or dark theme.

## 3. Non-React redesign

Request: "ใช้ $codelv8-ui-ux ปรับหน้ารายการใน Vue 3 ให้มี hierarchy และมือถือใช้งานได้ดีขึ้น คง Vue และพฤติกรรมค้นหา/เพิ่ม/แก้ไขเดิม ห้ามเพิ่ม UI library"

Acceptance: inspect original source/runtime first; targeted changes using the existing Vue runtime, no React migration or external UI dependencies, preserved controls and results, before/after evidence, regression interaction and layout checks. Do not count an unexecuted Vue file as browser verification.

## 4. Spec-only

Request: "ใช้ $codelv8-ui-ux ออกแบบ spec ของปุ่มบันทึก async มี loading/error/success เท่านั้น ห้ามสร้างโค้ดหรือแอป"

Acceptance: anatomy, applicable variants/states, token intent, keyboard/accessibility, async behavior and testable criteria; no scaffolding or implementation artifacts; runtime verification marked not applicable.

## Failure variations

- Disable network: keep useful local decisions; catalog is a dated snapshot, not freshly verified.
- Provide an unavailable source URL: report failure and choose a local/official alternative without repeated retries.
- Require a provider item with unclear license: do not copy it; independently implement or identify an essential blocker.
- Remove browser availability: complete appropriate source work and mark browser, visual and related checks not verified, even if a runner exits zero.

Record whether execution was self-evaluation or an independent agent evaluation. Fixture QA demonstrates the particular artifacts, not universal skill quality or production readiness.
