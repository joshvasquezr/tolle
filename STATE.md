# STATE
Updated: 2026-11-10 21:06 · Lead: Claude Code
Approved phase: P0 (approved by Josh 2026-11-10)

## Current task
P0.1 · Workspace scaffold · done (committed; awaiting Josh's review before P0.2)

## Progress
- P0.1 done: pnpm workspace (`apps/{web,worker}`, `packages/{core,render}`, `scripts`), `tsconfig.base.json` (strict), `.gitignore`, `.editorconfig`, `.npmrc` (save-exact), lockfile.
- Verify ran green: `pnpm install --frozen-lockfile && pnpm -r typecheck && pnpm -r test` (scripts/workspace.test.ts: 12 passed; other packages have no tests yet).
- Uncommitted files: none.
- Failing checks: none.

## Needs decision
- Review P0.1. Josh asked that P0.2 not start until review.

## Blockers
- None.

## Next
- After Josh's review, start `P0.2 · CI skeleton`. Its Verify (open a draft PR) needs Josh's permission to push.

## Notes for next session
- pnpm is not installed globally on this machine, and corepack 0.33 can't run pnpm 12 (native binary layout). Use `npx --yes pnpm@12.16.1 <cmd>` or install pnpm 12.16.1.
- Pinned toolchain: pnpm 12.16.1, TypeScript 6.0.3 (not 7.x: Astro/@astrojs/check compatibility with the native TS 7 compiler is unverified; revisit at P1.3), Vitest 5.0.5, @types/node 24.19.2, Node ≥ 24. Chose versions ≥ 2 weeks old.
- Package names are `@tolle/<dir>`; `pnpm --filter core test` resolves the unscoped name.
- Package `src/index.ts` files are `export {}` placeholders; replace them in the owning tasks.
- `P5.0` (human: email the questions to Crossway) has no dependencies, and PLAN suggests starting it on day one.
