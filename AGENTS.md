# AGENTS.md

The operating contract for AI coding agents in this repo. Humans: this is what agents follow.

## Project

A quiet, fast, static-first Bible reader for desktop web. Public-domain text (BSB, KJV, WEB) is pre-rendered to HTML and JSON and served from a CDN. A Cloudflare Worker adds an ESV proxy, optional magic-link accounts, and highlight sync. Product principles: just the text, minimal, fast, calm.

### Sources of truth (read on demand, never duplicate)

| File | Answers | Cite as |
|---|---|---|
| `README.md` | Setup, commands, current repo layout (once it exists) | — |
| `SPEC.md` | **What** to build: requirements (R1, N3, P2, S5, H4, T5, A3…), NFRs, licensing | `SPEC §5.3`, `H6` |
| `DESIGN.md` | **How**: architecture, interfaces, data models, tests | `D§3.4` |
| `PLAN.md` | **Order**: tasks, `Needs`, `Done when`, `Verify`, Decisions log | `P2.3` |
| `STATE.md` | **Now**: current task, progress, blockers, approvals | — |

- Precedence for product and technical content: SPEC > DESIGN > PLAN. If they conflict, stop and ask. Do not choose one silently.
- For process (how agents work), this file overrides PLAN's "How to use this plan" wherever they differ.

### Architecture at a glance
- `packages/core`: pure TypeScript with no DOM and no I/O. Holds books, parser, routes, verse IDs, versification and ESV windowing. Shared by web, worker and build. All shared logic goes here.
- `packages/render`: `renderChapter(Block[]) → HTML`. The only code that produces Scripture HTML.
- `apps/web`: Astro static site plus vanilla-TS islands and the service worker.
- `apps/worker`: Hono on Workers, plus D1, the KV cache and the `EsvBudget` Durable Object.
- `scripts/`: the USFM → chapter JSON data pipeline, validators and the search index.
- `test-vectors/`: JSON fixtures that act as the contract for a future iOS port.

Full layout: `D§2`.

## Hard constraints

Never break these. If a task seems to require it, stop and ask.

### ESV licensing

**External obligations.** These come from the ESV API terms as summarized in `SPEC §8.1`. That summary comes from the project brief and has not yet been checked against the live terms (`P5.0`).
- Non-commercial use only.
- Each request or page shows at most `min(500 verses, half the book)`.
- Each page with ESV text shows the "ESV" label, the copyright notice, a link to esv.org, and a link to `/about/esv-copyright`. Copied text carries the citation.
- Caching is limited.
- Rate limits: 60/min, 1,000/hour, 5,000/day.

Never quote the terms or the notice wording from memory. Use `SPEC §8.1`, the live terms, or Crossway's reply in `docs/esv-compliance.md`.

**Stricter project policies.** These are our own choices, set out in `SPEC §8.1`, `D§1 D5–D6` and `D§3.12`.
- The API key exists only as a Worker secret.
- ESV is never prefetched.
- ESV text never appears in static files, `dist/`, the sitemap, OG tags or descriptions, the service worker, IndexedDB, localStorage, sync payloads, search indexes, logs, or fixtures beyond `P5.1`'s limits.
- The KV cache keeps entries for at most 24 h, with one window per entry and no cache warming.
- The budget enters its soft state at 80% and its hard state at 95%.
- ESV pages are `noindex` shells.
- Anything ambiguous takes the stricter reading.

Keep both sets as they are. Loosening anything needs explicit approval, and an external rule can only be loosened by Crossway's written answer.

### Other constraints
- **No monetization.** No ads, donation links, sponsorships, paid tiers or third-party scripts.
- **Privacy (`SPEC §7`, `D§8`).** Never log IPs, queries, emails or tokens. Set no cookies for anonymous visitors. The server stores only email, user ID and highlights.
- **Highlights** store `verseId`, color and timestamps only. Whole verses only.
- **Budgets (`SPEC §7`).** First-load JS ≤ 60 KB gz, LCP ≤ 1.0 s, CLS ≤ 0.02, WCAG 2.2 AA.
- **URLs and `/api/v1`** never change once released. API changes are additive only.

## Conventions
- TypeScript `strict` everywhere. pnpm workspace with exact pinned versions. Commit the lockfile.
- Small pure functions in `core`. Islands stay framework-free unless `D§3` says otherwise.
- Never hardcode book, chapter or verse facts. Derive them from `books.json` via `core`.
- Escape all text. SQL uses bound parameters only. Validate Worker input against `core`.
- CSS uses the tokens in `D§5.1` only. No new colors.
- Comments explain *why*. Don't restate SPEC or DESIGN; cite the ID instead (`// SPEC H6`).
- Never commit generated output (`apps/web/public/data`, `dist`).
- Tests sit next to the code and name the requirement ID they cover.

## Workflow

Work on one task at a time. You may run approved tasks one after another in a session, but you must not cross a phase boundary or an unmet dependency.

1. **Orient.** Read `STATE.md` and the task in `PLAN.md`. Read `README.md` (if present) before any significant change.
2. **Pick.** If STATE shows an unfinished task, resume it. Otherwise take the first unchecked task in the **current approved phase** whose `Needs` are all checked.
   - Never bypass an unmet dependency, including tasks marked `(human)`.
   - If nothing is unblocked, record the blocker in STATE and stop.
3. **Load context.** Read only the SPEC and DESIGN sections the task's `Refs` cite.
4. **Implement** within the task's `Files` and their tests.
   - Small, directly related edits elsewhere are allowed: an export, an index file, a config entry, a shared test helper. List them in the commit message.
   - Anything larger is a scope change and needs approval (see below).
5. **Verify** (see the next section).
6. **Record.** Tick the task's box in PLAN (`- [x]`, no hash) and update STATE.
7. **Commit once.** The commit includes the implementation, tests, and the PLAN and STATE updates.
   - The title starts with the task ID: `P0.3: books metadata (SPEC P2)`.
   - The body holds the verification evidence (below).
   - The ID in the title is the link between task and commit: `git log --grep '^P0.3:'`.
8. If the phase's last task is now done, run the phase checkpoint, report, and **stop** (see "Approvals").

### Git rules
- Commit to the current branch unless told otherwise. Never push, open PRs, deploy, or rewrite published history without permission. That includes `Verify` steps that need one, such as `P0.2` and `P1.8`.
- Never discard, revert, stash or overwrite work just to get a clean tree. That includes work you didn't write.
- If you must stop mid-task, leave the changes in place, describe them exactly in STATE, and don't commit failing work. If the human asks, commit it as `WIP P?.?: …` instead.

## Testing and verification

- **While developing:** run targeted tests (`pnpm --filter <pkg> test <name>`).
- **To finish a task:** all of the following.
  - The task's `Verify` command passes.
  - Typecheck and tests pass for every package you touched.
  - Every `Done when` item maps to a test or command that proves it. List that mapping in the commit body.
  - UI tasks: axe is clean, and the change works in light and dark mode, by keyboard, and with reduced motion.
  - ESV, storage, SW, logging or sync changes: re-check the hard constraints.
- **At a phase checkpoint:** run the full checks.
  - `pnpm install --frozen-lockfile`, `pnpm -r typecheck`, `pnpm -r test` and `pnpm build`.
  - Playwright and axe for the phase's flows.
  - Budgets, once CI checks them.
- **Honesty.** Report only checks you actually ran, with their real results. If a command doesn't exist yet (before `P0.1`), or a check couldn't run, say so. Never weaken a test, a vector or a budget to get a pass. A failing check means the box stays unticked.

## Approvals

Get **explicit human approval** for each of these. Write the request under `## Needs decision` in STATE, then stop.

- **Starting each phase** (P0 through P7, including crossing the MVP line). Finishing one phase never starts the next. Approvals are recorded in STATE as `Approved phase: P2`.
- Scope beyond small related edits: new modules, packages or apps, changes to another task's deliverables, or reordering or rescoping PLAN.
- Architecture: DESIGN decisions D1–D7, the stack, data schemas, `verseId`, chapter JSON, URLs, the API.
- Any new runtime dependency, or any dependency over ~10 KB gz.
- ESV terms, privacy guarantees, monetization, or loosening a hard constraint.
- A spike that fails its exit criterion. Don't improvise.
- Settling an `[A]` assumption or an open SPEC §14 question.

Once approved, record the decision in PLAN's **Decisions log** (`date · task · decision · reason`). Change SPEC or DESIGN only if the human asks.

## Coordination: one writer

- `PLAN.md` and `STATE.md` are shared. Only the **lead** session may edit them: the one named in STATE's `Lead:` line.
- Other agents report through their final message or commit body. That includes subagents and parallel sessions, which run in their own branch or worktree.
- Before editing either file, re-read it. Make minimal, targeted edits, never a full rewrite (except STATE's body when you are the lead).
- The lead changes only when the human explicitly authorizes it. The outgoing lead (or the human) updates `Lead:` and notes the handoff in STATE.
- If STATE names a different lead, don't edit PLAN or STATE, however old the entry is. Ask the human.

## `STATE.md`

STATE is short (≤ 40 lines) and holds only what's happening now. Finished work goes in PLAN's checkboxes, and permanent decisions go in PLAN's Decisions log. Create it from this template if it doesn't exist:

```markdown
# STATE
Updated: YYYY-MM-DD HH:MM · Lead: <agent/session>
Approved phase: <none | P0 | …>

## Current task
P?.? · <title> · in progress | blocked | done

## Progress
- done / left; uncommitted files; failing checks

## Needs decision
- (empty, or a request for the human)

## Next
- exact next step

## Notes for next session
- gotchas, findings not yet worth a Decisions-log entry
```

## Handoff between sessions

Before you stop, even mid-task:
- STATE is current, and "Next" is specific enough to act on cold.
- Every uncommitted change is listed in STATE.
- Any failing or unrun checks are listed in STATE.

A new session needs only this file, then `STATE.md`, `README.md` and the task in `PLAN.md`. Don't rely on chat history.
