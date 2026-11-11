# STATE
Updated: 2026-11-11 08:10 · Lead: Claude Code
Approved phase: P0 (approved by Josh 2026-11-10)

## Current task
None in progress. P0.3 · Books metadata · done and merged (PR #2 → `main` as `fcbc20a`). Awaiting Josh's approval to start P0.4.

## Progress
- P0.1, P0.2, P0.3 merged to `main`. CI on `main` after the P0.3 merge (run 42983874534) is green.
- Branch `p0.3-books-metadata` still exists locally and on origin (merged); delete when Josh says.
- Uncommitted files: none.
- Failing checks: none.

## Needs decision
- Approve `P0.4 · Verse IDs and types` and settle its open points (proposed defaults in parentheses):
  a. `decodeVerseId` on invalid input (throw; plus `isVerseId` for yes/no checks)
  b. branded `VerseId` type (yes; log the deviation from D§3.1's `number`)
  c. `Translation = 'bsb' | 'kjv' | 'web' | 'esv'` in `types.ts` (yes; DESIGN never defines it)
  d. DESIGN says `packages/core/types.ts`, PLAN says `src/types.ts` (use `src/types.ts`)
  e. `test-vectors/verse-ids.json` for the Swift port (optional; not in P0.4's Files)

## Blockers
- None.

## Next
- On approval, branch from `main` and start `P0.4 · Verse IDs and types` (Refs: D§3.1 Verse ID, D§3.2).

## Notes for next session
- pnpm is not installed globally on this machine, and corepack 0.33 can't run pnpm 12 (native binary layout). Use `npx --yes pnpm@12.16.1 <cmd>` or install pnpm 12.16.1.
- Pinned toolchain: pnpm 12.16.1, TypeScript 6.0.3 (not 7.x: Astro/@astrojs/check compatibility with the native TS 7 compiler is unverified; revisit at P1.3), Vitest 5.0.5, @types/node 24.19.2, Node ≥ 24. Chose versions ≥ 2 weeks old.
- CI pins: actions/checkout v7.0.1 and actions/setup-node v7.1.0 by commit SHA; gitleaks 8.30.1 by SHA-256. Bump them deliberately (update SHA + comment together).
- Josh prefers git operations as separate, simple commands (no chained heredocs or pipes), each verified before the next. Feature branch + draft PR per task.
- `BookId` is branded: get one via `toBookId()`/`isBookId()` or from a `Book`; never cast a raw string.
- P0.9: use the same eBible `eng-kjv2006` edition (checksum in `packages/core/data/books.SOURCE.md`). Its USFM carries Strong's-number markup (`\w …|strong="…"\w*`), which P0.10 must strip.
- Package names are `@tolle/<dir>`; `pnpm --filter core test` resolves the unscoped name. `render`, `web`, `worker` still have `export {}` placeholders.
- `P5.0` (human: email the questions to Crossway) has no dependencies, and PLAN suggests starting it on day one.
