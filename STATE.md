# STATE
Updated: 2026-11-10 23:40 · Lead: Claude Code
Approved phase: P0 (approved by Josh 2026-11-10)

## Current task
None in progress. P0.2 · CI skeleton · done and merged (PR #1 → `main` as `c59e317`). Awaiting Josh's approval to start P0.3.

## Progress
- P0.1 done (`d00703f`). P0.2 done (`9db105f`, `d6357b6`), merged via PR #1.
- CI on `main` after the merge (run 42980756079 on `c59e317`) is green.
- Local `main` was fast-forwarded to `origin/main`. Feature branch `p0.2-ci-skeleton` still exists locally and on origin; delete it when Josh says.
- Uncommitted files: none.
- Failing checks: none.

## Needs decision
- Approve starting `P0.3 · Books metadata`.

## Blockers
- None.

## Next
- On approval, branch from up-to-date `main` and start `P0.3 · Books metadata` (Refs: D§3.1 Books; SPEC §5.3).

## Notes for next session
- pnpm is not installed globally on this machine, and corepack 0.33 can't run pnpm 12 (native binary layout). Use `npx --yes pnpm@12.16.1 <cmd>` or install pnpm 12.16.1.
- Pinned toolchain: pnpm 12.16.1, TypeScript 6.0.3 (not 7.x: Astro/@astrojs/check compatibility with the native TS 7 compiler is unverified; revisit at P1.3), Vitest 5.0.5, @types/node 24.19.2, Node ≥ 24. Chose versions ≥ 2 weeks old.
- CI pins: actions/checkout v7.0.1 and actions/setup-node v7.1.0 by commit SHA; gitleaks 8.30.1 by SHA-256. Bump them deliberately (update SHA + comment together).
- Josh prefers git operations as separate, simple commands (no chained heredocs or pipes), each verified before the next.
- Package names are `@tolle/<dir>`; `pnpm --filter core test` resolves the unscoped name.
- Package `src/index.ts` files are `export {}` placeholders; replace them in the owning tasks.
- `P5.0` (human: email the questions to Crossway) has no dependencies, and PLAN suggests starting it on day one.
