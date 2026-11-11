# Implementation Plan: A Quiet Bible MVP

Requirements: `SPEC.md` · Design: `DESIGN.md` (section numbers below are from it, written `D§3.4`). Requirement IDs (R1, N3, …) are from `SPEC.md`.
No code exists yet. This plan only orders the work.

## How to use this plan
This is a summary. `AGENTS.md` is the authority on workflow (approvals, scope, verification, git, coordination). If the two ever differ, follow `AGENTS.md`.
- Work one task at a time, top to bottom, inside the current approved phase. A task starts only when everything in its `Needs` is checked, including `(human)` tasks. Each phase needs explicit approval before it starts.
- Read the cited `SPEC.md` and `DESIGN.md` sections first. Do not restate them in code comments.
- Stay within the task's `Files`. Small, directly related edits elsewhere are fine. Larger scope changes need approval.
- A task is done only when its `Done when` is true and its `Verify` command passes. Then make one commit with the code, tests and the ticked box, titled with the task ID (e.g. `P0.3: …`). `git log --grep '^P0.3:'` finds it.
- If a spike fails its exit criterion, stop and record the finding under "Decisions log" at the end. Do not improvise a new design.

Task format: `ID · Title` — Needs · Refs · Files · Done when · Verify. Sizes: S (< 1 h), M (1–3 h).

## Phase order and MVP cut
| Phase | Result | Ships when |
|---|---|---|
| P0 Foundations | Repo, shared core, data pipeline, spikes | Core tests green, 3 translations validate |
| P1 Read | Static reading site, themes, URLs, SEO | Any PD chapter loads fast and looks right |
| P2 Navigate | Picker, reference bar, shortcuts, translations | Keyboard lookup works end to end |
| P3 Search | In-browser word search | S1–S5, S7 pass |
| P4 Highlights (local) | Select, tint, undo, persist, export | H1–H5, H8 pass |
| **MVP line** | **Public-domain reader with search and local highlights** | **Usable by Josh daily; deployable** |
| P5 ESV | Proxy, paging, budget, attribution | Compliance checks pass; Crossway answer in hand |
| P6 Accounts + sync | Magic link, sync, delete | A1–A8 pass |
| P7 Polish + launch | A11y, perf, beta, release | Success gates in `SPEC.md` §7 and §11 |

Note: `SPEC.md` §10 puts ESV before highlights. This plan swaps them so the MVP line arrives sooner. ESV and P7 still gate public launch; P6 may slip (SPEC §10).

---

## P0 · Foundations

- [ ] **P0.1 · Workspace scaffold** (S)
  - Needs: none · Refs: D§2 (layout, tech)
  - Files: root `package.json`, `pnpm-workspace.yaml`, `tsconfig.base.json`, `.gitignore`, `.editorconfig`, empty `apps/*`, `packages/*`, `scripts/`, `test-vectors/`
  - Done when: pnpm workspace installs; exact versions pinned; `pnpm -r typecheck` and `pnpm -r test` run (even if empty); generated dirs are git-ignored.
  - Verify: `pnpm install --frozen-lockfile && pnpm -r typecheck && pnpm -r test`

- [ ] **P0.2 · CI skeleton** (S)
  - Needs: P0.1 · Refs: D§9
  - Files: `.github/workflows/ci.yml`
  - Done when: CI runs install, typecheck, unit tests; a secret scanner step runs; job fails on any error.
  - Verify: open a draft PR; CI is green.

- [ ] **P0.3 · Books metadata** (M)
  - Needs: P0.1 · Refs: D§3.1 Books; SPEC §5.3 parser rules
  - Files: `packages/core/src/books.ts`, `packages/core/data/books.json`, tests
  - Done when: 66 books with slug, name, testament, order, chapters, verse counts per chapter, aliases (SBL, Chicago, informal, spelled/Roman ordinals). Totals: 1,189 chapters, 31,102 verses.
  - Verify: unit tests assert the totals and that no alias maps to two books unless intended-ambiguous.

- [ ] **P0.4 · Verse IDs and types** (S)
  - Needs: P0.3 · Refs: D§3.1 Verse ID, D§3.2
  - Files: `packages/core/src/verseId.ts`, `types.ts`, tests
  - Done when: `encodeVerseId`/`decodeVerseId` round-trip for all 31,102 verses; `Block`, `Item`, `Chapter` types match D§3.2.
  - Verify: `pnpm --filter core test`

- [ ] **P0.5 · Reference parser** (M)
  - Needs: P0.3, P0.4 · Refs: D§3.1 Reference parser; SPEC P2–P5, §5.3 table
  - Files: `packages/core/src/parse.ts`, `test-vectors/refs.json`, tests
  - Done when: all rows in SPEC §5.3 pass; ≥ 300 vectors (abbreviations, spacing, `.`/`:`/space separators, en dash, Roman and spelled ordinals, single-chapter books, ambiguity, out-of-range, search fallback, `;` truncation); parse takes < 1 ms per input.
  - Verify: `pnpm --filter core test parse`

- [ ] **P0.6 · Route resolver and path formatter** (S)
  - Needs: P0.5 · Refs: D§3.1 Route; SPEC "URLs"
  - Files: `packages/core/src/route.ts`, tests
  - Done when: `resolveRoute` and `formatPath` cover chapter, verses, alias redirect, default-translation redirect, static, notfound; `parse → formatPath → resolveRoute` round-trips for every chapter.
  - Verify: `pnpm --filter core test route`

- [ ] **P0.7 · ESV windowing** (S)
  - Needs: P0.3 · Refs: D§3.1 ESV windowing; SPEC §8.1
  - Files: `packages/core/src/esvWindows.ts`, tests
  - Done when: for all 1,189 chapters windows are contiguous, cover each verse once, and never exceed `min(500, floor(bookVerses/2))`; examples Jude → 9/9/7, 3 John → 7/7, Haggai 2 → 12/11 hold.
  - Verify: `pnpm --filter core test esvWindows`

- [ ] **P0.8 · Versification stub** (S)
  - Needs: P0.4 · Refs: D§3.1 Versification
  - Files: `packages/core/src/versification.ts`, tests
  - Done when: identity mapping works; exceptions load from `data/versemap/{tr}.json` (empty files allowed).
  - Verify: unit tests.

- [ ] **P0.9 · Source acquisition and checksums** (S)
  - Needs: P0.1 · Refs: D§6.2; SPEC §8.2
  - Files: `data/sources/{bsb,kjv,web}/*.usfm`, `data/sources/SOURCES.md`
  - Done when: USFM for the three translations is committed; `SOURCES.md` lists URL, date, version, SHA-256, and the public-domain status check done that day. Any licence doubt is recorded, not guessed.
  - Verify: `shasum -a 256 -c data/sources/checksums.txt`

- [ ] **P0.10 · USFM → Chapter JSON** (M)
  - Needs: P0.4, P0.9 · Refs: D§6.2 mapping list, D§3.2
  - Files: `scripts/usfm/parse.ts`, `scripts/build-data.ts` (parse step), fixtures, tests
  - Done when: output is `public/data/{tr}/{book}/{n}.json` matching D§4.1; prose, poetry indents, psalm titles, section headings, `\nd`, footnotes handled; no red-letter data.
  - Verify: fixture tests for John 3, Psalm 23, Genesis 1, one KJV `\nd` verse.

- [ ] **P0.11 · Data validators** (M)
  - Needs: P0.10 · Refs: D§6.2 validators; SPEC R11 risk
  - Files: `scripts/validate.ts`, tests with crafted bad inputs
  - Done when: build fails on missing books, wrong chapter/verse counts (unless in `versemap`), empty verses, stray markers, non-NFC text. Any real mismatch in BSB/KJV/WEB is fixed by a `versemap` entry or a recorded source fix.
  - Verify: `pnpm build:data` exits 0 for all three translations.

- [ ] **P0.12 · Spike: Workers Static Assets routing** (S)
  - Needs: P0.1 · Refs: D§1 D1, D§12
  - Files: `spikes/assets/` (deleted or moved to `docs/` after)
  - Done when: a toy deploy shows asset hits skip the Worker and unmatched paths reach it; write findings to the Decisions log.
  - Verify: written result with request logs; if it fails, stop and choose Pages (needs user decision).

- [ ] **P0.13 · Spike: font and JS budget baseline** (S)
  - Needs: P0.3 · Refs: D§12 last row, SPEC §7
  - Files: `docs/spikes/js-budget.md`
  - Done when: measured gz size of books metadata + parser; decision on lazy-loading aliases recorded.
  - Verify: numbers in the doc.

---

## P1 · Read

- [ ] **P1.1 · Design tokens and base CSS** (M)
  - Needs: P0.1 · Refs: D§5.1–5.3; SPEC §6.2–6.5
  - Files: `apps/web/src/styles/{tokens,base,type}.css`, font files, contrast test
  - Done when: light/dark tokens (with D7 values); type scale; self-hosted subset WOFF2 with fallback metrics; focus ring; reduced-motion rules. Contrast test passes for every text/background and text/tint pair in both modes.
  - Verify: `pnpm --filter web test contrast`

- [ ] **P1.2 · Chapter renderer** (M)
  - Needs: P0.4 · Refs: D§3.3; SPEC R1–R3
  - Files: `packages/render/src/renderChapter.ts`, snapshots, tests
  - Done when: prose, poetry (indent levels), headings, psalm titles, `nd` small caps, multi-fragment verses; text escaped; verse numbers not selectable.
  - Verify: snapshot tests plus an XSS-string test.

- [ ] **P1.3 · Astro site and chapter pages** (M)
  - Needs: P0.11, P1.1, P1.2 · Refs: D§6.1, D§6.3
  - Files: `apps/web/astro.config.*`, `src/pages/[tr]/[book]/[chapter].astro`, layout
  - Done when: 3 × 1,189 pages generated at `/{tr}/{book}/{n}`; single centered column; `h1` heading (plain text for now); correct `<title>`, description, canonical, OG.
  - Verify: `pnpm --filter web build && ls dist/bsb/john/3`; open locally and compare John 3 and Psalm 23 visually.

- [ ] **P1.4 · Theme and settings** (M)
  - Needs: P1.3 · Refs: D§3.9; SPEC R7, §6.4
  - Files: `apps/web/src/scripts/{theme-boot,settings}.ts`, settings popover
  - Done when: inline boot script sets theme before paint (no flash); Aa popover: size (5), font, width, headings, theme, auto-hide; persisted in `localStorage`; CSP-hash for the inline script is generated at build.
  - Verify: Playwright: set dark, reload, no light frame (screenshot at first paint); settings persist.

- [ ] **P1.5 · Prev/next links and landing page** (S)
  - Needs: P1.3 · Refs: SPEC R5, R6; D§4.4
  - Files: layout nav links, `src/pages/index.astro`, `pos` module
  - Done when: prev/next links cross book boundaries and are absent at Genesis 1 / Revelation 22; `/` is a copy of BSB John 1 with inline redirect to the stored position.
  - Verify: unit test of neighbor function over all chapters; Playwright for redirect.

- [ ] **P1.6 · Client router, prefetch, transitions** (M)
  - Needs: P1.5, P0.6 · Refs: D§3.8; SPEC §6.5, §7
  - Files: `apps/web/src/scripts/router.ts`, cache, live region
  - Done when: chapter changes without page reload; old content stays until new is ready; 120 ms cross-fade (reduced-motion safe); focus to `h1`, live-region announcement; popstate restores scroll; fetch failure falls back to normal navigation; adjacent chapters prefetched.
  - Verify: Playwright: next/prev/back; assert no layout shift (CLS ≤ 0.02 in trace).

- [ ] **P1.7 · Static support pages and SEO files** (S)
  - Needs: P1.3 · Refs: D§6.3; SPEC §7 SEO, §8.2
  - Files: `about`, `privacy`, sitemap, `robots.txt`, JSON-LD
  - Done when: About lists sources and statuses from `SOURCES.md`; privacy under 300 words; sitemap lists 3,567 chapters; `BreadcrumbList` present.
  - Verify: validate sitemap count; Lighthouse SEO ≥ 95.

- [ ] **P1.8 · Deploy skeleton** (S)
  - Needs: P0.12, P1.3 · Refs: D§2
  - Files: `apps/worker/wrangler.jsonc`, minimal Worker, deploy workflow
  - Done when: preview deploys of the static site on every PR; production deploy is manual.
  - Verify: preview URL loads John 3; LCP measured once and recorded.

---

## P2 · Navigate

- [ ] **P2.1 · Worker route fallback** (M)
  - Needs: P0.6, P1.8 · Refs: D§1 D2, D§2 routing, D§6.3
  - Files: `apps/worker/src/{index,routes}.ts`, tests
  - Done when: alias and default-translation redirects (301); verse/range URLs return the chapter HTML with rewritten title, description, canonical, OG and `data-focus`; out-of-range verse → 302 to chapter; unknown → 404 page.
  - Verify: Worker tests (`/john/3`, `/bsb/jn/3`, `/bsb/john/3/16`, `/bsb/john/3/99`, `/bsb/john/99`).

- [ ] **P2.2 · Focused-verse behavior** (S)
  - Needs: P2.1, P1.6 · Refs: SPEC R8; D§3.8
  - Files: `focus.ts`
  - Done when: `data-focus` range gets a quiet marker and is scrolled to viewport center; works on direct load and client navigation; the marker is not a highlight.
  - Verify: Playwright on `/bsb/1-corinthians/13/4-7`.

- [ ] **P2.3 · Reference bar** (M)
  - Needs: P0.5, P1.6 · Refs: D§3.4; SPEC P1–P7, §6.7
  - Files: `refbar.ts`, markup, CSS
  - Done when: combobox ARIA; inline suggestion; ≤ 3 rows for ambiguity; invalid message with suggestion; `Esc` restores label; `Cmd/Ctrl+Enter` forces search; width animation; navigation via router.
  - Verify: Playwright flows for every SPEC §5.3 example; axe clean.

- [ ] **P2.4 · Book/chapter picker** (M)
  - Needs: P1.6, P0.3 · Refs: D§3.5; SPEC N1–N7, §6.6
  - Files: `picker.ts`, markup, CSS
  - Done when: heading button opens a Popover API panel; two columns; chapter grid view with back; marks current book/chapter; type-ahead; arrow-key navigation; focus returns to heading; open < 150 ms with no network.
  - Verify: Playwright keyboard-only path `B → rom → Enter → 8 → Enter`; mouse path; trace shows no requests on open.

- [ ] **P2.5 · Keyboard dispatcher and shortcut list** (S)
  - Needs: P2.3, P2.4, P1.4 · Refs: D§3.6; SPEC §6.9
  - Files: `keys.ts`, shortcut popover
  - Done when: all shortcuts in SPEC §6.9 work; ignored in inputs, with IME composition, and when a popover owns the key; `?` popover is generated from the same binding table.
  - Verify: Playwright matrix (focused input vs body vs popover open).

- [ ] **P2.6 · Translation switcher** (S)
  - Needs: P1.6 · Refs: D§3.7; SPEC T2, T3
  - Files: `translations.ts`
  - Done when: switcher lists BSB, KJV, WEB (ESV added in P5); switching keeps verse and scroll offset; URL and title update.
  - Verify: Playwright: John 3:16 BSB → KJV keeps verse 16 in view.

- [ ] **P2.7 · Chrome auto-hide** (S)
  - Needs: P1.4 · Refs: D§3.9; SPEC §6.1
  - Files: `chrome.ts`
  - Done when: bar hides on scroll down, returns on scroll up, top-edge hover, or focus inside; setting turns it off.
  - Verify: Playwright scroll test; keyboard focus reveals the bar.

---

## P3 · Search

- [ ] **P3.1 · Spike: index size** (S)
  - Needs: P0.11 · Refs: D§3.11, D§12
  - Files: `docs/spikes/search-index.md`
  - Done when: MiniSearch BSB index measured (gz size, build time, query time); go/no-go for MiniSearch vs custom postings recorded.
  - Verify: numbers in doc; ≤ 3 MB gz or fallback chosen.

- [ ] **P3.2 · Index builder** (M)
  - Needs: P3.1 · Refs: D§3.11, D§6.1
  - Files: `scripts/search-index.ts`
  - Done when: versioned index per PD translation emitted to `/data/{tr}/search.v{hash}.json`; stemming and diacritic folding configured; deterministic output.
  - Verify: build twice, hashes match; size check script passes.

- [ ] **P3.3 · Search worker and query engine** (M)
  - Needs: P3.2 · Refs: D§3.11; SPEC S1, S3, S4, S7
  - Files: `apps/web/src/search/{worker,query}.ts`, tests
  - Done when: AND semantics, quoted phrase filter, scope filter, stemming; "love your enemies" returns Matthew 5:44 in the top 3 for each PD translation; < 200 ms after load.
  - Verify: Vitest with the real index; timing assertion.

- [ ] **P3.4 · Results page** (M)
  - Needs: P3.3, P2.3 · Refs: SPEC S2, §5.4
  - Files: `src/pages/search.astro`, island
  - Done when: `/search?q&t&scope&page`; 25 per page with pagination; match emphasis is subtle; each result links to the verse URL; scope control; empty state is one calm line; reference bar routes non-references here.
  - Verify: Playwright: type "faith without works" → James 2 appears; pagination works; axe clean.

- [ ] **P3.5 · Service worker (PD assets only)** (M)
  - Needs: P3.2, P1.8 · Refs: D§3.13
  - Files: `sw.ts`, registration
  - Done when: precache build assets; runtime cache `/data/*` only; never `/api/*` or `/esv/*`; kill switch; old caches cleaned.
  - Verify: Playwright offline test for a visited chapter's JSON; test asserting `/api/` requests bypass the SW.

---

## P4 · Highlights (local)

- [ ] **P4.1 · Highlight store** (M)
  - Needs: P0.4, P0.8 · Refs: D§3.10 Store, D§4.4
  - Files: `highlights/store.ts`, tests (fake-indexeddb)
  - Done when: `highlights`, `outbox`, `meta` stores; range read by chapter; `BroadcastChannel` updates; `localStorage` fallback; values contain only `color`, `updatedAt`, `deleted` (H6).
  - Verify: unit tests including the "no text fields" assertion.

- [ ] **P4.2 · Selection model** (M)
  - Needs: P1.2, P4.1 · Refs: D§3.10 Selection; SPEC H1
  - Files: `highlights/selection.ts`
  - Done when: mouse selection → verse set (single, range, multi-paragraph, poetry fragments); verse-number click and `Shift`+click path; keyboard verse cursor with `Shift+Arrow`; live-region announcements.
  - Verify: Playwright in Chromium, WebKit, Firefox with identical expectations.

- [ ] **P4.3 · Toolbar and apply/remove** (M)
  - Needs: P4.2 · Refs: D§3.10 Toolbar/Apply; SPEC §5.5, §6.8
  - Files: `toolbar.ts`, `paint.ts`, CSS tints
  - Done when: toolbar shows four tints and remove; places above or below; applies to whole verses; repaint via `data-hl`; `box-decoration-break: clone` on wraps; `1`–`4`/`0` keys; "highlighted" text for screen readers.
  - Verify: Playwright apply, change, remove; screenshot tests in both themes.

- [ ] **P4.4 · Undo** (S)
  - Needs: P4.3 · Refs: D§3.10 Apply step 4
  - Files: `history.ts`
  - Done when: `Cmd/Ctrl+Z` undoes the last 50 operations as new writes with fresh timestamps.
  - Verify: unit + property test: apply/undo sequences restore state.

- [ ] **P4.5 · Persist, repaint on navigation, cross-tab** (S)
  - Needs: P4.3, P1.6 · Refs: SPEC H3, H4
  - Files: `paint.ts`, router hook
  - Done when: highlights survive reload and browser restart; repaint on client navigation and translation switch; second tab updates live.
  - Verify: Playwright reload and two-page test.

- [ ] **P4.6 · Copy handler** (S)
  - Needs: P4.2 · Refs: SPEC R9; D§10 note
  - Files: `copy.ts`
  - Done when: copying a range yields clean text plus `— John 3:16 (BSB)`; verse numbers excluded; ESV hook point exists but is unused until P5.
  - Verify: Playwright clipboard test.

- [ ] **P4.7 · Export / import** (S)
  - Needs: P4.1 · Refs: SPEC H8; D§3.10
  - Files: settings menu entries
  - Done when: JSON export/import round-trips; import merges by last-write-wins and reports a count.
  - Verify: unit test plus Playwright download/upload.

### MVP line (end of P4)
- [ ] **MVP gate** · Deploy a preview. Josh reads three chapters, looks up five references, runs three searches, and makes ten highlights. Record defects. Lighthouse CI budgets (LCP ≤ 1.0 s, CLS ≤ 0.02, JS ≤ 60 KB gz) are measured and written to the Decisions log.

---

## P5 · ESV

- [ ] **P5.0 · Compliance questions to Crossway** (S, human)
  - Needs: none (start early) · Refs: SPEC §14 Q13, §8.1; D§12
  - Files: `docs/esv-compliance.md`
  - Done when: Josh has sent the questions (cache limits, half-book calculation, indexing, attribution wording) and the answers are recorded. Until then every **[A]** stays at the stricter reading.
  - Verify: answers pasted into the doc.

- [ ] **P5.1 · Spike: ESV response fidelity** (S)
  - Needs: P0.7 · Refs: D§3.12, D§12
  - Files: `apps/worker/test/fixtures/esv/*` (small, within quote limits), `docs/spikes/esv.md`
  - Done when: live API option names confirmed; fixtures captured for John 3, Psalm 23, Proverbs 3, Jude, one chapter with omitted verses; no fixture exceeds the allowed quantity.
  - Verify: doc lists final query options.

- [ ] **P5.2 · Normalizer** (M)
  - Needs: P5.1, P0.4 · Refs: D§3.12 Normalizer
  - Files: `apps/worker/src/esv/normalize.ts`, tests
  - Done when: ESV markup → `Block[]` with headings, paragraphs, poetry indents, verse markers; unknown tags dropped; output has no HTML.
  - Verify: fixture tests plus a hostile-markup test.

- [ ] **P5.3 · Budget durable object** (M)
  - Needs: P1.8 · Refs: D§3.12 Budget table; SPEC §8.1
  - Files: `apps/worker/src/esv/budget.ts`, tests
  - Done when: sliding windows (60/min, 1,000/h, 5,000/day); open/soft(80%)/hard(95%) states; persisted across restarts.
  - Verify: Worker tests simulate bursts and day rollover.

- [ ] **P5.4 · Passage endpoint with cache** (M)
  - Needs: P5.2, P5.3, P0.7 · Refs: D§3.12 Passage flow
  - Files: `apps/worker/src/esv/passage.ts`, tests
  - Done when: validates `book/chapter/part`; KV cache key and TTL ≤ 24 h; single-flight; per-visitor limit; `Cache-Control: private`; key only in upstream header; errors per D§3.12.
  - Verify: Worker tests with mocked upstream: hit, miss, soft state, hard state, bad part, key absent from responses.

- [ ] **P5.5 · Search endpoint** (S)
  - Needs: P5.4 · Refs: D§3.12; SPEC S6
  - Files: `esv/search.ts`
  - Done when: proxied search with page-size within the verse cap; shares the budget.
  - Verify: Worker tests.

- [ ] **P5.6 · ESV client shell and rendering** (M)
  - Needs: P5.4, P1.6, P2.6 · Refs: D§1 D6, D§3.8; SPEC T5, T6
  - Files: `/esv/*` shell page, client loader
  - Done when: ESV appears in the switcher; shell page is `noindex` with no ESV text; loader renders via the shared renderer; paging control for multi-window chapters; skeleton after 200 ms; no ESV prefetch; ESV text kept out of SW, IndexedDB, and any persistent store.
  - Verify: Playwright on John 3 and Jude; test that no ESV text exists in the SW cache or IndexedDB.

- [ ] **P5.7 · Attribution, copyright page, outage fallback** (S)
  - Needs: P5.6 · Refs: SPEC §8.1 attribution rows; D§7
  - Files: ESV notice component, `/about/esv-copyright`, copy hook
  - Done when: each ESV page shows label, notice, esv.org link, and link to the copyright page; copying ESV text adds the citation; busy/down shows the "Read in BSB" note.
  - Verify: Playwright asserts all four attribution elements on ESV pages and absence on others.

- [ ] **P5.8 · Compliance CI checks** (S)
  - Needs: P5.7 · Refs: D§8, D§9 "Compliance checks"
  - Files: `scripts/compliance.ts`, CI step
  - Done when: CI fails if the ESV key value appears in `dist/`, if ESV text appears in `dist/`/SW config/sync types/sitemap, or if ad, donation or third-party script patterns are found.
  - Verify: add a deliberately bad file in a test branch; CI fails.

---

## P6 · Accounts and sync

- [ ] **P6.1 · D1 schema and migrations** (S)
  - Needs: P1.8 · Refs: D§4.2
  - Files: `apps/worker/migrations/0001_init.sql`, db helper, tests
  - Done when: schema as in D§4.2 applies cleanly; cascade delete verified.
  - Verify: `wrangler d1 migrations apply --local` and tests.

- [ ] **P6.2 · Magic-link request and verify** (M)
  - Needs: P6.1 · Refs: D§3.12 Auth, D§1 D4
  - Files: `auth/*`, email sender, tests
  - Done when: always-202 request; hashed tokens; 15 min expiry; single use; POST verify; web cookie flags; native bearer; rate limits; Origin check.
  - Verify: Worker tests per D§9 (enumeration safety, expiry, replay, cookie flags, CSRF).

- [ ] **P6.3 · Sessions, `me`, sign-out, export, delete** (S)
  - Needs: P6.2 · Refs: SPEC A7, A8
  - Files: `auth/session.ts`, `account.ts`
  - Done when: 90-day sessions with extension; sign-out; account export; delete cascades all rows.
  - Verify: Worker tests.

- [ ] **P6.4 · Sync endpoints** (M)
  - Needs: P6.3, P0.4 · Refs: D§3.12 Sync, D§4.3
  - Files: `highlights/api.ts`, tests
  - Done when: batch upsert with LWW and per-batch `seq`; pull by cursor; `reset` logic; clamping; verse ID validation; `no-store`.
  - Verify: Worker tests incl. concurrent batches and tombstone purge cron.

- [ ] **P6.5 · OpenAPI spec** (S)
  - Needs: P6.4, P5.4 · Refs: D§11
  - Files: `packages/api-spec/openapi.yaml`, generated types
  - Done when: auth, me, account, sync, ESV endpoints described; a contract test checks Worker responses against it.
  - Verify: `pnpm --filter api-spec validate && pnpm --filter worker test contract`

- [ ] **P6.6 · Sign-in UI** (M)
  - Needs: P6.2 · Refs: SPEC A1, A2; D§1 D4
  - Files: corner link, sign-in popover, `/auth/verify` page
  - Done when: quiet "Sign in" link; email → "check your inbox" state; verify page posts the fragment token; expired-link state with one button.
  - Verify: Playwright with a mail sink.

- [ ] **P6.7 · Sync engine** (M)
  - Needs: P6.4, P4.5 · Refs: D§4.3 flow; SPEC A3–A6
  - Files: `highlights/sync.ts`, tests
  - Done when: triggers (load, focus, online, 2 s after write); first-sign-in merge; outbox backoff; repaint on pulled changes; sign-out options.
  - Verify: fast-check convergence test with two simulated clients; Playwright two-context test within 10 s.

- [ ] **P6.8 · Account settings** (S)
  - Needs: P6.6 · Refs: SPEC A7, A8; D§4.3 backups
  - Files: settings section
  - Done when: shows email, last synced, "Sync now", sign out (with clear-device option), export, delete account with one confirmation; privacy page mentions backup retention.
  - Verify: Playwright delete flow leaves no server rows.

---

## P7 · Polish and launch

- [ ] **P7.1 · Accessibility pass** (M)
  - Needs: P5.8, P6.8 (or P4 if P6 slips) · Refs: SPEC §6.10; D§5.4
  - Files: fixes across components, `docs/a11y-checklist.md`
  - Done when: axe clean on all key pages and open popovers; 200% zoom and 320 px reflow verified; manual VoiceOver and keyboard-only pass recorded.
  - Verify: CI axe job plus checklist signed by Josh.

- [ ] **P7.2 · Performance pass** (M)
  - Needs: P7.1 · Refs: SPEC §7 targets; D§12 budget
  - Files: budget configs, optimizations
  - Done when: Lighthouse CI ≥ 95 (perf, a11y, SEO); first-load JS ≤ 60 KB gz; CLS ≤ 0.02; ESV hit/miss times meet targets.
  - Verify: CI budgets green on the production build.

- [ ] **P7.3 · Security and privacy review** (S)
  - Needs: P6.8 · Refs: D§8; SPEC §7 Privacy
  - Files: CSP/headers config, `docs/runbook.md`
  - Done when: headers and CSP in place and tested; logging contains no IP/query/email/token; runbook covers ESV key rotation, kill switch, restore.
  - Verify: header test in CI; log-redaction test.

- [ ] **P7.4 · Analytics (cookieless) and metrics** (S)
  - Needs: P7.3 · Refs: D§3.12 Metrics; SPEC §11
  - Files: metrics beacon, dashboard notes
  - Done when: allow-listed counters only; no identifiers; Web Analytics enabled without cookies.
  - Verify: network capture shows no cookies or IDs.

- [ ] **P7.5 · Private beta** (human)
  - Needs: P7.2, P7.3 · Refs: SPEC §11 qualitative row, §14 Q18
  - Done when: ~20 people use it for two weeks; five-question survey collected; defects triaged.
  - Verify: results recorded in `docs/beta.md`.

- [ ] **P7.6 · Launch checklist** (S)
  - Needs: P7.5 · Refs: SPEC §8, §12 risks 1–3
  - Files: `docs/launch.md`
  - Done when: ESV compliance doc complete with Crossway reply; no monetization anywhere (CI check green); production deploy done; rollback tested.
  - Verify: checklist fully ticked.

---

## Dependency summary
```
P0 ─► P1 ─► P2 ─► P3 ─► P4 ═► MVP line
 │                         └─► P5 ESV ─┐
 └─ P0.12 spike ─► P1.8 ─► P6 sync ────┴─► P7 launch
```
P3 and P4 can run in parallel after P2. P5.0 (human email to Crossway) should start on day one.

## Decisions log
Record outcomes of spikes and any deviations here (date · task · decision · reason).

- _empty_

## Open items needing Josh
1. Product name and domain (`SPEC.md` §14 Q1) before P1.1 sets the wordmark.
2. Send the Crossway questions (P5.0).
3. Approve the final serif choice after seeing P1.3 (Source Serif 4 is the default).
