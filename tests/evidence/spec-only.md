# Async save button specification

User: Thai staff saving an edited record. Goal: submit once, understand the outcome, recover without losing input.

Anatomy: native button, visible action label, optional decorative spinner; nearby status/error region. One primary medium variant using project action/text/focus/spacing tokens; no invented brand tokens.

States: default บันทึก; hover feedback; visible keyboard focus; active activation feedback; disabled when unavailable; loading กำลังบันทึก with busy feedback and duplicate prevention; error actionable retry with preserved input; success บันทึกแล้ว via status. Selected/expanded are not applicable: this is an action, not a toggle.

Behavior: Enter/Space activates; preserve sensible focus after async completion; server validation errors remain associated with fields. An uncertain write outcome is not blindly retried. Busy/error/success announcements do not repeatedly steal focus. Support narrow layout, long Thai text, and reduced motion. Reuse existing tokens and actual API errors.

Acceptance: single request while pending, preserved input on validation/network failure, visible focus, clear completion or uncertain-outcome feedback, no clipped text. Specification reviewed. Runtime checks: not applicable; no implementation requested or produced.
