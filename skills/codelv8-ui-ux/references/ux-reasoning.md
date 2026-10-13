# UX reasoning

Read when the task includes flows, information architecture, forms, or a consequential product decision. This is a decision aid, not evidence of user research.

## Frame the task

Separate what the user stated, what source/runtime inspection confirms, and what you infer. Use a compact brief:

- Primary user and context: frequency, expertise, device, interruptions, language.
- Task and success: what they need to accomplish and how completion is observable.
- Constraints: existing workflow, permissions, data/API, time, brand, supported devices.
- Unknowns: ask only those that change scope or behavior; label remaining assumptions.

Do not generate personas, interview quotes, conversion improvements, or usability findings as facts. If research is requested, propose methods and questions; record findings only from actual evidence.

## Reason from actions and information

Describe the shortest safe path: entry → locate/choose → act → feedback → return/recover. Identify the most frequent and most consequential actions. Put the information required to decide before the action, and expose secondary detail progressively. A dashboard should help a user decide or act, not merely display decorative totals.

Choose patterns by task, not popularity:

| Need | Prefer | Tradeoff to check |
|---|---|---|
| Compare many records | Table with search/filter and prioritized columns | Mobile access to essential fields and actions |
| Small contextual edit | Modal or inline edit | Focus, validation, unsaved data and return context |
| Long or branching workflow | Dedicated page or step flow | Navigation, draft recovery and clear progress |
| Choose a few stable options | Native select/radio where appropriate | Platform behavior and readable labels |
| Search a large remote option set | Accessible combobox | Async/error states and keyboard semantics |
| Understand change over time | Chart plus summary and data access | Units, dates, missing values and misleading scales |

Avoid destructive actions adjacent to routine primary actions. Confirm irreversible effects with the actual target and consequence. A UI confirmation does not replace server authorization.

## Forms and recovery

Group fields by the user's mental model. Explain required formats before errors occur. Preserve entered values on validation/network failure. Place field errors next to inputs, associate them programmatically, and summarize multiple errors when helpful. Move focus appropriately after failed submission without repeatedly interrupting typing.

Prevent duplicate submissions during a pending request. Differentiate success, validation rejection, permission denial, connection failure, and uncertain outcome. Do not retry a possibly completed write without an existing safe/idempotent contract. Use server errors faithfully while translating them into actionable UI copy.

Keep list search, filters, page, selection, and scroll context after modal actions where practical. When the current record disappears after filtering/deletion, explain the result and place focus at a meaningful location. Do not silently discard unsaved changes.

## Content and evaluation

Write concrete labels and verb-led actions. Error copy says what happened and what the user can do. Use Thai wrapping and adequate line height; do not rely on Latin-only character limits. Check long names, empty values, dates, amounts, and user-generated text. Never communicate status by color alone.

For a proposed usability check, state a realistic task and observable outcome: locate a record, edit it, recover from invalid input, confirm completion. Do not claim the design is usable solely because an automated check passed. Report implementation evidence separately from user testing.
