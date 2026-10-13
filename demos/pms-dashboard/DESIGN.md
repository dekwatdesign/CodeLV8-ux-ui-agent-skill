# Pulse PMS — Thai dashboard prototype

## Brief and decisions

- Requested domain: **Performance Management System**, not hotel/property or project management.
- Requested deliverable: interactive Thai dashboard with sample data.
- Assumed audience: HR reviewer and team managers monitoring an evaluation cycle. No interviews or real employee data were supplied.
- Primary flow: identify pending reviews → open a person's detail → review score/feedback → save → return to the same filtered list. Secondary flow: identify low-progress goals → inspect the owner → add a goal where needed.
- Success: a user can locate pending work, inspect a person, recover from invalid input, save without duplicate submission, and see updated summaries without losing list context.
- Visual direction: restrained Aurora Glassmorphism, sage/forest action color, readable opaque work surfaces, subtle lavender/amber status colors and locally hosted LINE Seed Sans TH. Status always has text, not color alone.
- Motion: brief modal entrance and control feedback; reduced-motion removes animation. Mobile menu opens in document flow; list rows become cards rather than a compressed desktop table.

## Information hierarchy

Context and cycle/department filters → summary metrics → evaluation progress and pending actions → department scores → individual details → low-progress goals.

The pending-action panel pairs with the progress chart. Search/status filters affect the personnel list and exported personnel CSV; cycle/department filters affect overview metrics, list and goals. Clear labels distinguish these scopes. Goal cards show three priorities initially, with an explicit show-all control.

## Fixture and metric contract

12 fictional employees across four departments; two independent in-memory cycles:

- Q3/2569: current assessment window, six reviewed, four pending, two with no preliminary score. Closing date 20 October 2569, snapshot 13 October 2569.
- Q2/2569: completed round, read-only assessment and no new goals. Scores and goal progress are a separate fixture; selecting this round does not overwrite Q3 changes.

Scores are on a 0–100 scale. Average excludes missing values and includes explicitly labeled pending preliminary scores. Initial all-department average: **84.4 from 10 scored people**. Completion: reviewed count / scoped employee count. Follow-up goals: scoped goals below 50% progress. That threshold is a prototype assumption, not an organization's established evaluation policy.

Trend points are a synthetic cumulative sequence derived from the current fixture count; they are labeled sample data, not actual historical events. Department scores and all summaries derive from the same scoped data as the list.

## Working interactions

- Cycle and department filters; name/job search; status filters and pagination.
- Pending-review shortcut; person detail modal with keyboard-operable summary/goals/review tabs.
- Score validation, feedback input, dirty-close protection, brief local save busy state and duplicate prevention.
- Add-goal modal with title/owner/progress validation and escaped user text.
- CSV export of the filtered personnel set with UTF-8 BOM and formula-prefix protection.
- Focus containment, Escape/return focus, fallback focus when a saved row leaves the current filter.
- Historical cycle is read-only; reload restores the original fictional fixture.

No API, authentication, real permission enforcement, database or persistence is implemented. The displayed manager identity is fictional. UI validation and closed-round behavior demonstrate the flow; production implementation must use its real server authorization and validation contracts.

## Run and verification

From the repository root:

```powershell
python -m http.server 8767 --bind 127.0.0.1 --directory '.\demos\pms-dashboard'
```

Open [local prototype](http://127.0.0.1:8767/). The server serves this demo directory only. A currently running preview already uses this port; do not start a second server on it.

Browser QA: [tests/QA.md](tests/QA.md). Original font files and their license: [assets/fonts/OFL.txt](assets/fonts/OFL.txt). Official [LINE Seed Thai](https://seed.line.me/index_th.html) declares OFL 1.1; original font metadata was inspected and its copyright retained. No component-provider source was copied.
