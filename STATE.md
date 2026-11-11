# STATE
Updated: 2026-11-10 23:30 · Lead: Claude Code
Approved phase: P0 (approved by Josh 2026-11-10)

## Current task
P0.2 · CI skeleton · done (draft PR #1 green, not merged; awaiting Josh's review before P0.3)

## Progress
- P0.1 done (`d00703f`, on `origin/main`).
- P0.2 done on branch `p0.2-ci-skeleton`: `.github/workflows/ci.yml` (`9db105f`). Draft PR https://github.com/joshvasquezr/tolle/pull/1 is not merged.
- CI run 42979723029 on `9db105f` passed every step: install, typecheck, tests (12/12), gitleaks checksum OK, self-test detected the canary, history scan found no leaks across 3 commits.
- Uncommitted files: none (after this PLAN/STATE commit).
- Failing checks: none.

## Needs decision
- Review P0.2 / PR #1 and decide when to merge it. Josh asked that P0.3 not start until review.

## Blockers
- None.

## Next
- After review (and merge of PR #1 if Josh wants), start `P0.3 · Books metadata` from an up-to-date `main`.

## Notes for next session
- pnpm is not installed globally on this machine, and corepack 0.33 can't run pnpm 12 (native binary layout). Use `npx --yes pnpm@12.16.1 <cmd>` or install pnpm 12.16.1.
- Pinned toolchain: pnpm 12.16.1, TypeScript 6.0.3 (not 7.x: Astro/@astrojs/check compatibility with the native TS 7 compiler is unverified; revisit at P1.3), Vitest 5.0.5, @types/node 24.19.2, Node ≥ 24. Chose versions ≥ 2 weeks old.
- CI pins: actions/checkout v7.0.1 and actions/setup-node v7.1.0 by commit SHA; gitleaks 8.30.1 by SHA-256. Bump them deliberately (update SHA + comment together).
- Josh prefers git operations as separate, simple commands (no chained heredocs or pipes), each verified before the next.
- Package names are `@tolle/<dir>`; `pnpm --filter core test` resolves the unscoped name.
- Package `src/index.ts` files are `export {}` placeholders; replace them in the owning tasks.
- `P5.0` (human: email the questions to Crossway) has no dependencies, and PLAN suggests starting it on day one.
