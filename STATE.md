# STATE
Updated: 2026-11-10 23:55 · Lead: Claude Code
Approved phase: P0 (approved by Josh 2026-11-10)

## Current task
P0.3 · Books metadata · done on branch `p0.3-books-metadata`, draft PR open, not merged. Awaiting Josh's review before P0.4.

## Progress
- P0.1, P0.2 merged to `main`. The `p0.2-ci-skeleton` branch was deleted locally and on origin.
- P0.3: `packages/core/data/books.json` (+ `books.SOURCE.md` provenance), `packages/core/src/books.ts`, `books.test.ts`; `src/index.ts` re-exports books.
- Checks run locally: frozen install OK; `pnpm -r typecheck` OK; `pnpm -r test` OK (core 60/60, scripts 12/12). Mutation checks: swapping two chapter counts fails the fingerprint even though totals still pass; a colliding alias fails at module load.
- Uncommitted files: none after the P0.3 commit.
- Failing checks: none.

## Needs decision
- Review P0.3 / its draft PR and decide on merge. Josh asked that P0.4 not start until review.

## Blockers
- None.

## Next
- After merge, sync `main`, branch, and start `P0.4 · Verse IDs and types` (Refs: D§3.1 Verse ID, D§3.2).

## Notes for next session
- pnpm is not installed globally on this machine, and corepack 0.33 can't run pnpm 12 (native binary layout). Use `npx --yes pnpm@12.16.1 <cmd>` or install pnpm 12.16.1.
- Pinned toolchain: pnpm 12.16.1, TypeScript 6.0.3 (not 7.x: Astro/@astrojs/check compatibility with the native TS 7 compiler is unverified; revisit at P1.3), Vitest 5.0.5, @types/node 24.19.2, Node ≥ 24. Chose versions ≥ 2 weeks old.
- CI pins: actions/checkout v7.0.1 and actions/setup-node v7.1.0 by commit SHA; gitleaks 8.30.1 by SHA-256. Bump them deliberately (update SHA + comment together).
- Josh prefers git operations as separate, simple commands (no chained heredocs or pipes), each verified before the next. Feature branch + draft PR per task.
- `BookId` is branded: get one via `toBookId()`/`isBookId()` or from a `Book`; never cast a raw string.
- P0.9: use the same eBible `eng-kjv2006` edition (checksum in `packages/core/data/books.SOURCE.md`). Its USFM carries Strong's-number markup (`\w …|strong="…"\w*`), which P0.10 must strip.
- Package names are `@tolle/<dir>`; `pnpm --filter core test` resolves the unscoped name. `render`, `web`, `worker` still have `export {}` placeholders.
- `P5.0` (human: email the questions to Crossway) has no dependencies, and PLAN suggests starting it on day one.
