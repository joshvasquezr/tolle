# STATE
Updated: 2026-11-17 23:00 · Lead: Claude Code
Approved phase: P0 (approved by Josh 2026-11-10)

## Current task
None in progress. Baseline documentation refinement (E1–E19 plus follow-up corrections) is complete and independently approved by Codex; committed locally as `docs: finalize baseline documentation refinement`, not pushed. P0.3 is done and merged (PR #2 → `main` as `fcbc20a`). P0.4 is not approved and not started.

## Progress
- Lead handoff ended 2026-11-17: Kiro CLI was temporary lead solely for the documentation refinement. Claude Code is lead again. No push, PR or P0.4 work is authorized.
- P0.1–P0.3 merged to `main`; CI on `main` (run 42983874534) is green.
- Branch `kiro-baseline-refinement` holds the docs commit on top of `8e4526a`. Local `main` is at `8e4526a`, one ahead of `origin/main`. Nothing pushed.
- Working tree after the commit: only `.kiro/` is untracked (spec artifacts for this work, including `change-plan.md`; not authoritative documents, not committed). Nothing staged.
- Follow-ups applied after Codex review (done): (1) SPEC §8.1, §12 risk 2, §14 Q13 now require Crossway confirmation before ESV is made publicly available; (2) Cloudflare Web Analytics removed from DESIGN (Metrics, CSP), PLAN P7.4 and SPEC §7; first-party metrics kept; (3) this file shortened; (4) PLAN P0.11 (Data validators) cites `SPEC §12, risk 11`.
- Branches `p0.3-books-metadata` (also on origin) and `p0.4-verse-ids-types` (empty, local) exist; delete when Josh says.
- Failing checks: none known.

## Needs decision
- Josh to decide whether to push the docs commit or open a PR. Not authorized yet.
- Approve `P0.4 · Verse IDs and types` and its open points (proposed defaults): a. `decodeVerseId` throws on invalid input, plus `isVerseId`; b. branded `VerseId` (yes; log the deviation from D§3.1); c. `Translation = 'bsb' | 'kjv' | 'web' | 'esv'` in `types.ts`; d. use `src/types.ts` (DESIGN says `types.ts`); e. `test-vectors/verse-ids.json` (optional).

## Blockers
- None. Open doc issue: SPEC §11 "field data" Core Web Vitals now has no defined source after the Cloudflare removal.

## Next
1. Wait for Josh's decision on pushing the docs commit. 2. P0.4 only after Josh approves it (branch from `main`; Refs: D§3.1 Verse ID, D§3.2).

## Notes for next session
- pnpm is not installed globally; corepack 0.33 can't run pnpm 12. Use `npx --yes pnpm@12.16.1 <cmd>`.
- Toolchain: pnpm 12.16.1, TypeScript 6.0.3 (not 7.x; revisit at P1.3), Vitest 5.0.5, @types/node 24.19.2, Node ≥ 24.
- CI pins: actions/checkout v7.0.1, actions/setup-node v7.1.0 (commit SHAs), gitleaks 8.30.1 (SHA-256). Bump deliberately.
- Josh prefers simple git commands, one at a time (no chained heredocs or pipes). Feature branch + draft PR per task.
- `BookId` is branded: use `toBookId()`/`isBookId()` or a `Book`; never cast a raw string.
- P0.9: reuse eBible `eng-kjv2006` (checksum in `packages/core/data/books.SOURCE.md`); P0.10 must strip its Strong's markup.
- Package names are `@tolle/<dir>`; `render`, `web`, `worker` are `export {}` placeholders.
- `P5.0` (email Crossway) has no dependencies; start early.
