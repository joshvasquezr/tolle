# `books.json` provenance

`books.json` is the only source of book facts (AGENTS.md). This file records where its numbers came from.

## Verse counts (`chapters`, `verses`)
- **Source:** eBible.org, King James (Authorized) Version, `eng-kjv2006`: the 1769 standardized text, protocanon only (66 books), public domain.
- **Download:** `https://ebible.org/Scriptures/eng-kjv2006_usfm.zip`
- **Version:** source files dated 2026-11-03; zip built 2026-11-10 (per its `copr.htm`). HTTP `last-modified: Tue, 10 Nov 2026 06:31:13 GMT`, 2,466,540 bytes.
- **SHA-256 (zip):** `dce1ec3ea45a155ac05e975fc8d817da403a817713d554eb9cc3a2177a6cfd1c`
- **Retrieved:** 2026-11-10.
- **Method:** each chapter's count is its highest `\v` number, read from the 66 `.usfm` files in canonical order and matched to books by USFM code (`GEN` … `REV`). The extraction also checked every chapter for gaps, out-of-order numbers and verse bridges (`\v 1-2`) and found none.
- **Result:** 66 books, 1,189 chapters, 31,102 verses. All 1,189 chapters were compared one by one between the committed file and the source, with zero differences.
- **Fingerprint:** FNV-1a 32-bit over `verses` joined as `n,n,…;n,n,…` in book order: `91bbd209`. `books.test.ts` pins it.

P0.9 should commit this same edition under `data/sources/kjv/`. P0.11's validators then recheck these counts against the committed USFM for BSB, KJV and WEB. Differences in other translations go in `data/versemap/{tr}.json`, not here.

## Names, slugs, short names, aliases
Written by hand for P0.3.
- `id` = `slug`: lowercase, hyphenated full name (SPEC "URLs").
- `short`: SBL Handbook abbreviations without periods.
- `aliases`: normalized keys (lowercase, no spaces or dots, ordinal as a digit) drawn from SBL, Chicago and common informal forms. No exact alias may map to two books. Prefix ambiguity is handled by the parser (P0.5).

## Changing this file
Edit `books.json` directly. If a count changes, record the evidence here and update the fingerprint in `books.test.ts` in the same commit.
