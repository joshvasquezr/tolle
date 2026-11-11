# PRD: A Quiet Bible (working title) — MVP

Status: Draft 1 · Owner: Josh · Date: 2026-11-10
Convention: items marked **[A]** are assumptions. Decisions still needed are in section 14.

---

## 1. Overview and problem statement

**One line:** Bible Gateway, but beautiful. A Bible website for looking up a verse or reading a chapter, with nothing else on screen.

**Problem.** The popular free Bible sites are cluttered: ads, banners, study tools, upsells, sidebars. Someone who only wants "John 3:16" or a calm chapter to read has to work around the page. Quiet reading apps exist, but most are apps (not the web), or push accounts, plans and streaks.

**Opportunity.** Design is the product. If looking up a verse is instant and reading is a pleasure, people will choose it over the incumbents. The text is free (public domain) or free for non-commercial use (ESV), so the site can be small and have no commercial pressure.

**MVP definition.** Desktop web. Four translations (BSB, KJV, WEB, ESV). Title picker + reference bar navigation. Full-text search. Local highlights, with optional sign-in to sync. No notes, bookmarks, plans, audio, sharing or AI.

---

## 2. Goals and non-goals

### Goals
1. A verse lookup takes under 3 seconds from landing, with the keyboard only.
2. Reading pages feel instant (see section 7).
3. Visual and interaction quality that people notice and mention.
4. Fully functional with no account and no backend, except for ESV text and sync.
5. Stay ESV-compliant: no ads, sponsorships or donations while ESV is offered.
6. Make choices now (data model, URLs, sync API) that do not block mobile web and a native iOS app.

### Non-goals (MVP)
- Study tools: commentaries, lexicons, cross-references, interlinear, maps.
- Notes, bookmarks, reading plans, devotionals, audio.
- Social features, sharing features (beyond copyable URLs), streaks, notifications.
- Ads, popups, upsells, donations (ESV rule).
- AI features. NIV. Languages other than English.
- A native or mobile-optimized experience (phases 2 and 3).

---

## 3. Target users and key use cases

| User | Need | Frequency |
|---|---|---|
| **The Looker-upper** | Heard a verse in a sermon, a talk or a quote. Wants it now. | Several times a week, short visits |
| **The Reader** | Sits down to read a chapter or a book, no distraction. | Daily or weekly, long visits |
| **The Builder (Josh)** | Uses it daily; wants it to feel better than the alternatives. | Daily |

Not served: people who want study depth. We say so plainly and do not apologize for it.

### User stories
- As a looker-upper, I type `rom 8:28` and land on the verse in under a second, highlighted in context.
- As a looker-upper, I type `ps 23` or `1 cor 13:4-7` or `jn3.16` and it just works.
- As a looker-upper, I type "faith without works" and find James 2.
- As a reader, I open the site and it returns me to where I stopped. **[A]**
- As a reader, I press the right arrow and the next chapter appears without a flash or a layout jump.
- As a reader, I click "John 3 ▾", pick Romans, then 8, and read.
- As a reader, I switch from BSB to KJV and stay on the same verse.
- As a reader, I select verses and highlight them softly. They are still there next week.
- As a reader on two computers, I sign in once and my highlights follow me.
- As a privacy-minded user, I use the whole site with no account and no tracking banner.

---

## 4. Product principles (the test for every feature)

1. **Just the text.** Anything that is not Scripture must earn its place.
2. **Elegant and minimal.** Black, white, neutral greys. Whitespace. Excellent type.
3. **Fast.** Navigation feels instant.
4. **Calm.** No ads, popups, streaks, notifications, social, or upsells.

**How we use them:** a feature that fails any principle is cut or redesigned. Example: a "verse of the day" widget fails #1 and #4 and is out.

---

## 5. Functional requirements (MVP)

Priority: **M** Must · **S** Should · **C** Could. IDs are stable for tracking.

### 5.1 Reading

| ID | Requirement | Pri | Acceptance criteria |
|---|---|---|---|
| R1 | Chapter view: one centered column, chapter heading, verses with small verse numbers | M | Column is 640–720px wide (about 65–75 characters per line) at default size. Verse numbers are superscript, grey, never selectable by text-copy **[A: copy excludes numbers by default]** |
| R2 | Section headings and poetry/prose layout from the source text | M | Psalms and poetic passages keep line breaks and indents. Headings (BSB, WEB, ESV supply them) render in a quiet grey style. Setting hides them **[A]** |
| R3 | Words of Christ are not colored | M | No red letter text. Principle 2. |
| R4 | Footnotes/variant notes | C | Public-domain footnotes appear as a tiny marker, content shown on hover or focus in a small popover. Deferred if data is messy. |
| R5 | Previous/next chapter controls, crossing book boundaries | M | From Genesis 50, "next" goes to Exodus 1. From Revelation 22, next is disabled. From Genesis 1, previous is disabled. |
| R6 | Return to last position | S | On `/` visit, user is sent to last chapter and translation **[A]** (local storage). First-time visitors see John 1 **[A]** in BSB. |
| R7 | Reading settings: text size (5 steps), font (serif / sans), line width (narrow / default), theme (light / dark / system) | S | Settings live in one small popover. Changes apply live and persist locally. |
| R8 | Single-verse and range display | M | `/john/3/16` shows the full chapter with verse 16 highlighted-by-focus (a quiet marker, not a user highlight) and scrolled into view. |
| R9 | Copy text | S | Copying a selected verse range yields clean text plus reference and translation, e.g. `"For God so loved…" — John 3:16 (BSB)`. For ESV, the copy includes the required ESV citation. |

### 5.2 Navigation: title picker

| ID | Requirement | Pri | Acceptance criteria |
|---|---|---|---|
| N1 | Chapter heading is a button ("John 3 ▾") that opens the picker | M | Click, Enter or Space opens it. Esc or outside click closes it. Focus returns to the heading. |
| N2 | Two-column book list: Old Testament left, New Testament right | M | All 66 books in canonical order. Names in full. No scrolling needed at 1280×720 **[A: a compact 3-line-wrap fit is acceptable]**. |
| N3 | Choosing a book reveals a grid of chapter numbers | M | Grid replaces the book list in place (with a back control), or appears beside it. One click on a number navigates. |
| N4 | Current book and chapter are marked | M | Current book is bold; current chapter is filled. |
| N5 | Type-ahead in the picker | S | Typing "ph" focuses Philippians (and Philemon, by arrow). Enter opens its chapters. |
| N6 | Keyboard operation of the picker | M | Arrow keys move through books/chapters, Enter selects, Backspace/Left goes back to books. |
| N7 | Opens fast | M | Open animation under 150 ms; no network request. |

### 5.3 Navigation: reference bar and parsing

| ID | Requirement | Pri | Acceptance criteria |
|---|---|---|---|
| P1 | A single input at the top, styled like a browser address bar | M | Shows current reference when idle (e.g. `John 3`). Click or `/` selects all text for replacement. |
| P2 | Parse references forgivingly | M | See the table below. Case, spaces, periods, colons and dashes are tolerant. |
| P3 | Live suggestion (one line, not a dropdown list) as the user types | S | Shows the parsed target, e.g. "Romans 8:28", faintly under/inside the bar. Enter goes. |
| P4 | Ambiguity handling | M | "ph" (Philippians vs Philemon) shows a short list of up to 3 choices. Enter takes the first. |
| P5 | Invalid reference feedback | M | "Genesis 99" shows an inline message "Genesis has 50 chapters" and offers Genesis 50. No error page. |
| P6 | Previous/next chapter buttons live beside the bar | M | Disabled state at ends. Tooltips show the shortcut. |
| P7 | Non-reference input falls through to search | M | See 5.4. |

**Parser examples (acceptance tests):**

| Input | Result |
|---|---|
| `jn 3`, `John 3`, `john3`, `Jn.3` | John 3 |
| `romans 8:28`, `rom 8 28`, `Rom8.28` | Romans 8:28 |
| `1 cor 13:4-7`, `1cor13:4-7`, `I Cor 13:4–7`, `first corinthians 13.4-7` | 1 Corinthians 13:4–7 |
| `ps 23`, `psalm 23`, `psalms 23`, `pslm 23` | Psalm 23 |
| `gen` | Genesis 1 |
| `matt 5:3-12; 6:9` | First range; second part ignored in MVP **[A]** (multi-range is Could) |
| `jude 5`, `obadiah 3` | Single-chapter books: the number is a verse, not a chapter |
| `ps 23:1-` , `john 3:16-` | Treated as the single verse **[A]** |

Parser rules: alias table for all 66 books (common abbreviations from SBL, Chicago, and informal use), Roman-numeral and spelled-out ordinals for numbered books, Song of Songs / Song of Solomon / Canticles, Revelation(s). The parser is pure code, runs in the browser, and has a unit test table of at least 300 cases.

### 5.4 Search

**Decision:** search lives **in the reference bar**. One input, two behaviors: if the text parses as a reference, go there; otherwise it is a word search. This keeps the chrome minimal (Principle 1).

| ID | Requirement | Pri | Acceptance criteria |
|---|---|---|---|
| S1 | Full-text word search in the current translation | M | Query "love your enemies" returns Matthew 5:44 in the top 3 for BSB. Results show reference, verse text with matches softly emphasised. |
| S2 | Search results page | M | URL `/search?q=…&t=BSB`. Results list of 25 per page, paginated. |
| S3 | Phrase search with quotes; AND by default | S | `"in the beginning"` matches the exact phrase. |
| S4 | Scope filter: All / Old Testament / New Testament / one book | S | Small text control above the results. |
| S5 | Public-domain search runs in the browser | M | Index loaded on first use (lazy), cached by the service worker. Results appear in under 200 ms after index load. First-use index download under 3 MB gzipped per translation **[A]**. |
| S6 | ESV search | M | Proxied to the ESV search endpoint. Respects rate limits. Results page shows ESV attribution. Max results per page keeps within the 500-verse rule. |
| S7 | Stemming and diacritics tolerance | S | "loved" matches "love"; "Jesus'" works. |

### 5.5 Highlights

**Palette:** four muted tints + remove. Names are descriptive, not meaningful (no color-coded meaning is imposed). **[A]**

| Name | Light mode (on #FFFFFF) | Dark mode (on #0F0F0F) |
|---|---|---|
| Sand | #F1EBDD | rgba(210,190,140,0.18) |
| Sage | #E4EBE1 | rgba(150,180,150,0.18) |
| Slate | #E3E8EE | rgba(140,165,200,0.18) |
| Rose | #F0E3E3 | rgba(200,150,150,0.18) |

Tints are low-saturation. Text contrast against each must stay at or above 4.5:1 (WCAG AA); verified in tests for both modes.

**Interaction (minimal):**
1. User selects text by mouse (drag across verses) or clicks a verse number (click again, or shift-click, to extend a range).
2. A small floating toolbar appears just above the selection: four color dots, and a "remove" mark if the selection is already highlighted. Nothing else on it (no copy, no share, no note).
3. Clicking a dot applies that tint to the whole verses touched by the selection. The toolbar fades out.
4. To remove: select the highlighted verse(s), click the "remove" mark. Clicking a different dot replaces the tint.
5. Keyboard: with a verse focused, `Shift+Arrow` extends the range, `1`–`4` applies a tint, `0` or `Backspace` removes. `Esc` clears the selection.

| ID | Requirement | Pri | Acceptance criteria |
|---|---|---|---|
| H1 | Select a verse or range and apply a tint | M | Works for single verse, a range inside a chapter, and a range crossing paragraphs. Highlights apply to whole verses only in MVP **[A]** (not partial verses). |
| H2 | Remove or change a tint | M | As described above. Undo with `Cmd/Ctrl+Z` for the last action. |
| H3 | Persist locally, no account | M | Stored in IndexedDB **[A]**. Survive reload and browser restart. |
| H4 | Highlights are translation-independent | M | A highlight is stored against verse reference (book, chapter, verse), not text. Switching BSB → KJV keeps it. Verse-numbering differences between translations are handled by a mapping to the base versification **[A: base = KJV/Protestant numbering]**. |
| H5 | Highlights render in both modes with AA contrast | M | Automated contrast test passes. |
| H6 | ESV: highlights store references only, never ESV text | M | Verified in the stored data and sync payload (licensing). |
| H7 | A way to see all highlights | C | Not in MVP. Without notes or bookmarks, a list is low value. Tracked for later. |
| H8 | Export/import highlights as a JSON file | S | Gives no-account users a backup. Small settings menu entry. |

### 5.6 Translations

| ID | Requirement | Pri | Acceptance criteria |
|---|---|---|---|
| T1 | Launch translations: BSB (default), KJV, WEB, ESV | M | All four readable for all 66 books. |
| T2 | Translation switcher | M | A small control beside the reference bar shows the abbreviation (e.g. `BSB ▾`). Switching keeps the same chapter and scroll position at the same verse. |
| T3 | Translation in the URL | M | `/bsb/john/3/16`. Shared links preserve the translation. |
| T4 | Public-domain text served as static files | M | No backend call. Per-chapter JSON (or HTML) files from the CDN. |
| T5 | ESV via backend proxy | M | See section 8. Chapter loads from `/api/esv/passage?q=John+3`. |
| T6 | ESV label and attribution on each ESV page | M | See section 8. |
| T7 | Side-by-side parallel view | C | Not in MVP (breaks the single column). Future. |

### 5.7 Accounts and sync

| ID | Requirement | Pri | Acceptance criteria |
|---|---|---|---|
| A1 | Account is optional, offered quietly | M | A small "Sign in" text link in the corner. No prompts, nags or modals. |
| A2 | Passwordless sign-in by email magic link **[A]** | M | Enter email, receive a link, click, signed in. Session lasts 90 days **[A]**. |
| A3 | On first sign-in, local highlights merge up | M | Local highlights upload. Server data merges down. No loss in either direction. |
| A4 | Sync | M | A highlight made on device A appears on device B within 10 seconds of next page load/focus. |
| A5 | Conflict rule | M | Per-verse last-write-wins using a timestamp; deletions are kept as tombstones for 30 days. |
| A6 | Offline-first | M | Highlighting works offline; changes queue and sync when back online. |
| A7 | Sign out | M | Local highlights stay on the device **[A]**; user may choose "also clear this device". |
| A8 | Delete account and all data | M | One action, in settings. Server data removed within 24 hours. Required for privacy and later App Store rules. |
| A9 | Sign in with Apple / Google | C | Not in MVP. Required for the iOS app if any third-party sign-in is offered. Email link only keeps data minimal. |

---

## 6. Design and UX requirements

### 6.1 Layout
- **Single centered reading column.** Max 680px **[A]**, with generous margins. No sidebars. Nothing to the left of the text.
- **Top bar** (the only chrome): thin, 48px, same background as page (no heavy borders; a 1px hairline appears only after scrolling).
  - Left: wordmark (small, text only).
  - Center: reference bar (about 360px, grows on focus to 520px).
  - Right: translation switcher, prev/next chapter, settings (Aa), sign in / account.
- **Chapter heading** below the bar: large serif "John 3 ▾", clickable (see picker).
- **Footer:** nothing in the reading view, except the required ESV notice on ESV pages (see section 8). An "About" page holds copyright and credits.
- **Chrome fades on scroll down** and returns on scroll up or mouse movement to the top. **[A]** (can be turned off in settings.)
- Wide screens: column stays centered; no extra panels.

### 6.2 Typography
- Reading font (serif default): a refined, open-licensed text serif such as **Source Serif 4** or **Newsreader** **[A: final choice made in design exploration]**. Alternate (sans): **Inter**. UI font: Inter.
- Size: 19px base on desktop, line height 1.7, scale of 5 steps (16/17/19/21/24). Paragraph spacing, not indentation.
- Verse numbers: 0.65em, grey (tertiary), superscript, tabular numerals, not selectable in copy.
- Chapter heading: 40px, tight tracking, medium weight. Section headings: 14px, small caps or grey sentence case.
- Use proper typographic details: curly quotes, hanging punctuation where supported, `text-wrap: pretty`, `font-variant-numeric: tabular-nums`, optical sizing.
- Fonts are self-hosted, subsetted to Latin, `font-display: swap`, with a metric-matched fallback to avoid layout shift.

### 6.3 Color system
Strictly black, white and neutral greys. The only non-grey color is the four highlight tints.

| Token | Light | Dark |
|---|---|---|
| `--bg` | #FFFFFF | #0F0F0F |
| `--surface` (popovers) | #FFFFFF + 1px border | #181818 + 1px border |
| `--text` | #111111 | #ECECEC |
| `--text-secondary` | #5C5C5C | #A3A3A3 |
| `--text-tertiary` (verse numbers) | #8A8A8A | #7A7A7A |
| `--border` | #E8E8E8 | #262626 |
| `--hover` | #F5F5F5 | #1C1C1C |
| `--focus-ring` | #111111, 2px, 2px offset | #ECECEC, 2px, 2px offset |

Values are starting points **[A]**. All text pairs must meet WCAG AA (4.5:1 body, 3:1 large text and UI parts). Tertiary grey on white at #8A8A8A is about 3.4:1: acceptable only for verse numbers as non-essential decoration; check against AA and darken to #767676 (4.5:1) if designer cannot justify the exception. **[A: use #767676 unless an exception is approved.]**

### 6.4 Light / dark mode
- Default follows the system. Manual override: Light, Dark, System, stored locally.
- No flash of wrong theme on load (theme set by an inline script before first paint).
- Dark mode is near-black (not pure black), softer white text (not pure white), to reduce glare.

### 6.5 Interaction states and motion
- Every interactive element has defined: default, hover, focus-visible, active, disabled.
- Hover: background shifts one step (`--hover`), 120 ms ease-out. No scale jumps.
- Focus: visible 2px ring for keyboard only (`:focus-visible`).
- Popovers (picker, settings): fade + 4px rise, 150 ms. Close: 100 ms.
- Chapter change: content cross-fades in 120 ms; scroll resets to top; no layout jump. Previous page stays visible until the next is ready (no blank flash).
- Respect `prefers-reduced-motion`: replace movement with instant or fade-only.
- Skeletons only if a load exceeds 200 ms (ESV). Never spinners over text.
- Cursor and selection color: selection uses a soft grey, not browser blue.

### 6.6 Flow: Book/chapter picker
1. User clicks "John 3 ▾". Popover opens under the heading, 640px wide.
2. Two columns: **Old Testament** (39 books) and **New Testament** (27). Small grey column labels. Books are text rows, 32px high, hover shaded.
3. Current book is marked. Focus starts on it.
4. User clicks "Romans". The popover content slides to a chapter grid (16 numbers in a 6-column grid for Romans), with the book name and a back arrow at the top.
5. User clicks "8". Page navigates to Romans 8. Popover closes. Focus moves to the chapter heading.
6. Keyboard path: `Cmd/Ctrl+K`? No — open with `B` **[A]**, type "rom", Enter, type "8", Enter.

### 6.7 Flow: Reference bar
1. User presses `/` (or `Cmd/Ctrl+L`). Bar grows, text selected.
2. User types `1 cor 13:4-7`. A faint suggestion shows "1 Corinthians 13:4–7".
3. Enter. Page loads 1 Corinthians 13, verses 4–7 marked and scrolled to the center of the screen. URL updates to `/bsb/1-corinthians/13/4-7`.
4. If the text is not a reference (e.g. "grace"), Enter opens search results for "grace".
5. Esc leaves the bar and restores the current reference.

### 6.8 Flow: Highlighting
See 5.5. Visual specifics: toolbar is 36px tall, rounded 8px, border 1px, soft shadow (light) or border only (dark); four 16px dots plus a small "×". Appears 8px above the selection, 100 ms fade. If no room above, appears below.

### 6.9 Keyboard shortcuts

| Key | Action |
|---|---|
| `/` or `Cmd/Ctrl+L` | Focus reference bar |
| `B` | Open book/chapter picker |
| `←` / `→` | Previous / next chapter (when focus is not in an input) |
| `J` / `K` | Scroll down / up by a screen **[A]** (Could) |
| `T` | Open translation switcher |
| `D` | Toggle light/dark **[A]** |
| `?` | Show shortcut list (small popover) |
| `Esc` | Close popover, clear selection, leave input |
| `1`–`4`, `0` | Apply tint / remove (with verses selected) |
| `Cmd/Ctrl+Z` | Undo last highlight change |

Shortcuts never fire while typing in an input, and never override browser shortcuts.

### 6.10 Accessibility (WCAG 2.2 AA)
- Full keyboard use; visible focus; logical focus order; no keyboard traps; focus returns after popovers close.
- Semantic HTML: one `h1` (chapter), `nav`, `main`, `article`; verses in `<span>` with `data-verse` and `aria-label` only where needed. Picker follows the ARIA dialog/menu patterns; the reference bar is a combobox.
- Contrast: AA for text and UI in both modes, including highlight tints.
- Text resizes to 200% without loss; layout reflows at 320px width.
- Reduced motion respected. No info by color alone: highlighted verses expose state to screen readers ("highlighted") and a user can show a subtle underline option **[A]** (Could).
- Skip link to main text.
- Test: axe in CI, manual VoiceOver + keyboard-only pass before each phase release.

---

## 7. Non-functional requirements

### Performance targets (desktop, cable connection, mid-range laptop)
| Metric | Target |
|---|---|
| Largest Contentful Paint (public-domain chapter, cold) | ≤ 1.0 s |
| Interaction to Next Paint | ≤ 100 ms |
| Cumulative Layout Shift | ≤ 0.02 |
| Chapter-to-chapter navigation (warm) | ≤ 100 ms perceived |
| First-load JS | ≤ 60 KB gzipped for the reading view **[A]** |
| ESV chapter (cache hit / miss) | ≤ 300 ms / ≤ 1.2 s |
| Lighthouse (performance, accessibility, SEO) | ≥ 95 each |

Means: static pre-rendered chapters on a CDN; prefetch of previous/next chapter on idle and on hover of controls; no client framework heavier than needed; service worker caches visited chapters (public-domain only) and fonts; search index lazy loaded.

### SEO for verse pages
- Every chapter and verse range has a crawlable, server-rendered HTML page with a unique `<title>` ("John 3 — Berean Standard Bible"), meta description (the first verse text, trimmed; public-domain only), canonical URL, and Open Graph tags.
- Canonical for a verse range = chapter URL with fragment; `/bsb/john/3/16` canonical is itself **[A]** (so people searching "John 3:16 BSB" land exactly there).
- Sitemap for all public-domain chapters and common verse pages. ESV pages: `noindex` is **not** required, but we do not pre-render ESV into static files and we do not put ESV text in sitemaps/OG descriptions **[A: conservative reading of terms; confirm with Crossway]**.
- Structured data: `BreadcrumbList`. No fake `Article` schema.
- Default translation URL `/john/3` redirects to `/bsb/john/3`.

### URLs (shareable, stable, human-readable)
```
/                              → last position, or /bsb/john/1
/{translation}/{book}/{chapter}            /bsb/john/3
/{translation}/{book}/{chapter}/{verse}    /bsb/john/3/16
/{translation}/{book}/{chapter}/{v1}-{v2}  /bsb/1-corinthians/13/4-7
/search?q=…&t=bsb
/about   /about/esv-copyright   /privacy
```
Book slugs: lowercase, hyphenated, full name (`1-corinthians`, `song-of-solomon`). Short aliases redirect (`/bsb/jn/3` → `/bsb/john/3`). URLs never change once released.

### Browser support
Last 2 versions of Chrome, Edge, Safari, Firefox (desktop). Phase 2 adds iOS Safari 16+ and Chrome Android. No IE. Works with JavaScript disabled for reading public-domain chapters (progressive enhancement); highlighting, search and the picker need JS.

### Privacy
- No analytics cookies, no third-party trackers, no ad tech, no fingerprinting. Cookieless, privacy-friendly aggregate analytics only (e.g. self-hosted Plausible/Umami or Cloudflare Web Analytics) **[A]**, with no cross-site identifiers. This means no cookie banner is needed.
- Accounts store only: email (hashed for lookup + encrypted for sending, or plain in the auth provider), user ID, highlight records, timestamps. No names, no reading history, no device fingerprints.
- Reading position and settings stay on the device (not synced) in MVP **[A]**.
- ESV proxy does not log user IPs or queries beyond short-lived rate-limit counters. Passage requests are not tied to accounts.
- A plain-language privacy page (under 300 words).
- Account deletion deletes everything (A8). Data export for signed-in users (JSON).
- Religious beliefs are sensitive data in some laws (GDPR "special category" arguments). Highlights tied to an email can be read that way. Therefore: encrypt at rest, minimize, no sale or sharing of data, ever.

### Reliability
- Public-domain reading works if the backend is down (fully static).
- Target availability 99.9% for static content (CDN); 99.5% for ESV proxy and sync.
- ESV outage or rate-limit: show an inline, calm message ("ESV is unavailable right now. Read this chapter in BSB?") with one-click switch. Never a blank page.
- Sync failures are silent and retried with backoff; local data is never lost.
- Backups of the highlights database daily, 30-day retention.

---

## 8. Licensing and compliance

### 8.1 ESV (via api.esv.org)
Source of truth: the ESV API terms and Crossway's permissions. The requirements below follow the terms as supplied in the brief. **Engineering and legal must re-read the live terms before launch [A].**

| Rule | Requirement in this product |
|---|---|
| Non-commercial only | **No ads, sponsorships, or donations anywhere on the site while ESV is offered** (including a "buy me a coffee" link). No paid tier. A compliance checklist item blocks any monetization PR. If monetization is ever wanted, ESV must be removed first or a commercial license obtained. |
| ≤ 500 verses or half a book (whichever is less) per request and per page | The proxy rejects requests over the limit. Chapters over 500 verses do not exist (Psalm 119 has 176). "Half a book" matters for short books: e.g. Jude (25 verses), 2 John (13), 3 John (14), Philemon (25), Obadiah (21): half = 12/6/7/12/10 verses. Short single-chapter books therefore **must be shown in parts** (e.g. 3 John shows verses 1–7, then a "continue" control for 8–14 that loads a new page-view). Page size rule: the page shows at most min(500 verses, floor(½ × book verse count)). The book-size table is in code, with unit tests. **[A: confirm the "half a book" calculation with Crossway; if ambiguous, adopt the stricter reading.]** |
| Limited local caching | Server cache: short TTL **[A: 24 hours maximum]**, at most 500 verses per cache entry, no bulk precomputation, no static ESV pages, no ESV text in the service worker or IndexedDB, no ESV text in sync data or search indices. Browser keeps ESV only in memory/HTTP cache with `Cache-Control: private, max-age` short. **[A: confirm cache limits with Crossway.]** |
| Rate limits 60/min, 1,000/hour, 5,000/day | The proxy tracks counters globally. Per-visitor throttle (e.g. 20/min) protects the shared budget. When the global budget is at 80%, ESV falls back to cache only and shows a calm notice; at 100%, ESV is "temporarily unavailable". Prefetching of ESV next/previous chapter is **disabled**. Search results count against the same budget. |
| Attribution | On every page that shows ESV text: (1) the translation labeled "ESV" in the switcher and page title; (2) the copyright notice in the footer of that page: *Scripture quotations are from the ESV® Bible (The Holy Bible, English Standard Version®), © 2001 by Crossway, a publishing ministry of Good News Publishers. Used by permission. All rights reserved.* **[A: use the exact wording Crossway/ESV API terms prescribe]**; (3) a link to **esv.org** on the page; (4) a copyright page at `/about/esv-copyright` linked from that notice. |
| API key never in the browser | Key only in server environment secret. Browser calls only our `/api/esv/*` routes. CI scan for the key pattern. Key rotation procedure documented. |
| Clipboard | Copied ESV text includes citation "ESV" and the copyright short form. |

The ESV attribution footer on ESV pages is the one allowed exception to the "nothing but text" rule. Design it as a single quiet line, tertiary grey, 12px, below the chapter end.

### 8.2 Public-domain sources
| Translation | Status | Source notes |
|---|---|---|
| Berean Standard Bible (BSB) | Dedicated to the public domain by its publisher (2023) | Use the official source files from berean.bible; keep the attribution on the About page even though not required. **[A: verify current status and text version at build time.]** |
| King James Version (KJV) | Public domain in the US (and worldwide, except the UK Crown letters patent for printing) | Use a clean digital edition (e.g., Project Gutenberg / Open Scriptures). Note UK printing right: web display is fine. |
| World English Bible (WEB) | Public domain; name "World English Bible" is a trademark-like label for the unmodified text | Use the official eBible.org USFM source; keep the name only for unmodified text. Do not use the "Messianic" or other variants. |

- A single build script converts source files (USFM or equivalent) into the canonical per-chapter JSON and records source URL, version and checksum in `/data/SOURCES.md`.
- The About page lists each translation, source, and status.

### 8.3 Other
- Fonts: open licenses (OFL) only.
- No third-party scripts that set cookies.
- Terms of use and privacy pages in plain language.

---

## 9. Technical approach and data model (high level)

### 9.1 Recommended stack **[A]**
Smallest thing that satisfies the brief:

| Concern | Choice | Why |
|---|---|---|
| Front end | **Astro** (static pages, tiny islands) or **SvelteKit** (adapter-static) with a small vanilla/Svelte island for picker, bar, highlights | Static HTML for SEO and speed; little JS |
| Hosting | **Cloudflare Pages** (static + CDN) | Free tier, fast edge, same vendor as the backend |
| Backend | **Cloudflare Workers** (ESV proxy, sync API, auth endpoints) | Serverless, no servers, secret bindings for the ESV key |
| Database | **Cloudflare D1** (SQLite) for users and highlights | Small, cheap, relational |
| Cache / rate limiting | **Workers KV** or **Durable Object** for the global ESV counters and short-TTL cache | Global counters need consistency; a Durable Object gives atomic counts |
| Auth | Own passwordless email link (signed token, Resend/Postmark for delivery) or a small provider (e.g. Supabase Auth, Clerk) | Fewest moving parts; avoid a provider that stores more data than needed |
| Search | MiniSearch or FlexSearch in-browser, index built at build time per translation | Works without a backend |
| Tests | Vitest (parser, versification, ESV limits), Playwright (flows), axe (a11y) | |

Alternative: Vercel + Supabase (Postgres + Auth). Equivalent; choose this if you prefer Postgres and a hosted auth UI. The rest of this document is stack-agnostic.

### 9.2 Architecture
```
Browser ──► CDN (static HTML/JSON, fonts, search index)         [public-domain, no backend]
   │
   ├──► /api/esv/passage, /api/esv/search ──► Worker ──► api.esv.org   [key secret, cache, limits]
   │
   └──► /api/auth/*, /api/sync ─────────────► Worker ──► D1            [optional accounts]
```

### 9.3 Bible text storage
- Canonical **versification** = KJV/Protestant (66 books, standard chapter/verse counts). Other translations map onto it; known differences (e.g., WEB/BSB verse splits, Psalm titles, 3 John 14/15) are in a small mapping table. **[A]**
- Static files per translation and chapter: `/data/{tr}/{book}/{chapter}.json`

```json
{
  "tr": "bsb", "book": "john", "chapter": 3,
  "blocks": [
    { "type": "heading", "text": "The New Birth" },
    { "type": "para", "verses": [
        { "n": 1, "text": "Now there was a Pharisee…" },
        { "n": 2, "text": "…" } ] },
    { "type": "poetry", "verses": [ { "n": 9, "lines": ["…","…"] } ] }
  ]
}
```
- Chapters are pre-rendered into HTML at build time for SEO; JSON is used for client-side navigation (fetch next chapter without a full reload).
- Search index per translation built from verse text: `/data/{tr}/search-index.json` (lazy).
- Book metadata (`books.json`): id, name, aliases, testament, chapter count, verse counts per chapter (drives the parser, the picker, bounds and ESV half-book math).

### 9.4 Highlights data model (shared by web and iOS)
```
Highlight {
  id:         string  (client-generated UUID v7)
  ref: { book: "john", chapter: 3, verse: 16 }   // one record per verse
  color:      "sand" | "sage" | "slate" | "rose"
  updated_at: ISO timestamp (client clock, server-clamped)
  deleted:    boolean  (tombstone)
}
```
- One record per verse keeps conflicts simple (last-write-wins per verse) and makes ranges trivial to unhighlight in part.
- Only references and colors; never Bible text (ESV-safe, translation-independent).
- Local store: IndexedDB `highlights` table keyed by `book:chapter:verse`.
- Server table: `highlights(user_id, book, chapter, verse, color, updated_at, deleted)` with primary key `(user_id, book, chapter, verse)`. `users(id, email, created_at)`. `sessions(...)`.

### 9.5 Sync API (versioned, usable by the iOS app)
```
POST /api/v1/auth/request   { email }              → sends link
POST /api/v1/auth/verify    { token }              → session (cookie for web; bearer token for native)
GET  /api/v1/highlights?since=<cursor>             → { items: [...], cursor }
POST /api/v1/highlights/batch  { items: [...] }    → { accepted, cursor }
DELETE /api/v1/account                             → deletes all data
```
- Delta sync by cursor; client keeps an outbox while offline.
- Auth supports both cookie sessions (web) and bearer tokens (iOS) from day one.
- API is documented in OpenAPI so the iOS app can reuse it.

### 9.6 ESV proxy
```
GET /api/v1/esv/passage?q=John+3        → { reference, text blocks, copyright }
GET /api/v1/esv/search?q=…&page=…
```
- Validates `q` against the parser and the page-size rules (500 verses / half book) before calling ESV.
- Uses the ESV API's options to omit extra content and request the structure we need **[A: HTML/plain-text option to be chosen in build; we render our own markup]**.
- Normalizes the response to the same block JSON as public-domain text.
- Global rate limiter, short-TTL cache, `Cache-Control` set, no logging of queries with IP.
- CORS limited to our origin. Key stored as a Worker secret.

---

## 10. Release plan

### Phase 1 — Desktop web MVP (primary target)
In scope:
- Reading view, typography, light/dark, settings (5.1)
- Title picker, reference bar, parser, keyboard shortcuts (5.2, 5.3, 6.9)
- BSB, KJV, WEB static; ESV through proxy with attribution (5.6, 8)
- Word search in the reference bar (5.4)
- Highlights, local only first; then optional account + sync (5.5, 5.7)
- SEO pages, sitemap, privacy and About pages
- WCAG AA audit

Suggested sequencing (milestones, not dates; **[A]** assumes one builder part-time):
1. **M0 Foundations** — data pipeline, versification, `books.json`, parser + tests, design tokens, type exploration.
2. **M1 Read** — static reading view, URLs, SEO, prev/next, theme, settings.
3. **M2 Navigate** — picker, reference bar, shortcuts, translation switcher.
4. **M3 Search** — in-browser index and results page.
5. **M4 ESV** — proxy, limits, attribution, fallback behaviors. *Do this before public launch; confirm terms with Crossway.*
6. **M5 Highlights (local)** — palette, toolbar, keyboard, undo, export.
7. **M6 Accounts and sync** — magic link, batch sync, delete account.
8. **M7 Polish and launch** — accessibility audit, performance pass, private beta with ~20 people, public launch.

Launch can ship without M6 if time is tight (sync is then "coming soon" without any teaser UI). **[A]**

### Phase 2 — Responsive web for phones
- Responsive layout: same single column, larger touch targets (44px), bottom-reachable prev/next.
- Picker becomes a full-screen sheet; reference bar becomes a top control with the on-screen keyboard in mind.
- Highlight toolbar adapts to touch selection (long-press, drag handles).
- PWA: installable, offline cache of visited public-domain chapters.
- Swipe left/right for chapters (optional).
- Re-test performance on mid-range phones and 4G (LCP ≤ 2.0 s).

### Phase 3 — Native iOS app
- SwiftUI app, same design language, bundled public-domain text for fully offline use.
- Same sync API; ESV still through the proxy (so the key stays secret; and rate budget is shared, so consider a higher-limit commercial license or per-user caching rules before launch).
- Sign in with Apple required if other third-party sign-in is offered; email link works as is.
- Highlights data model unchanged.
- App Store: privacy nutrition label ("data not linked to you" for the no-account path).

---

## 11. Success metrics

This is a calm product; measure quality and use, not engagement hacks. No dark patterns, no streak metrics.

| Metric | Target at 90 days after launch **[A]** |
|---|---|
| Lookup speed: median time from landing to verse displayed (reference bar path) | ≤ 3 s |
| Performance: p75 LCP / INP / CLS from field data | ≤ 1.2 s / ≤ 150 ms / ≤ 0.05 |
| Reference parser success rate (inputs that resolve to a reference or search) | ≥ 98% with a null/error page ≤ 1% |
| Returning users: share of visitors who return within 30 days | ≥ 30% |
| Highlight adoption: share of weekly active readers who use highlights | ≥ 15% |
| Account conversion among highlighters (healthy, not pushed) | 10–25% |
| Search → click-through on a result | ≥ 60% |
| Accessibility: axe violations / manual audit blockers | 0 |
| Qualitative: "beautiful/fast" in feedback from 20 beta users (simple 5-question survey, voluntary) | ≥ 8 of 10 say it is better than their current site |
| Organic search: impressions for verse queries | Growth month over month |
| ESV budget: days that hit the daily cap | 0 |

Measurement uses cookieless, aggregate analytics only. No individual tracking.

---

## 12. Risks and mitigations

| # | Risk | Likelihood / Impact | Mitigation |
|---|---|---|---|
| 1 | ESV rate limits (5,000/day) are exhausted by modest traffic | High / High | ESV is not default; short-TTL cache; no prefetch; per-visitor throttle; fall back to BSB with calm message; request a higher limit from Crossway if traffic grows |
| 2 | Terms ambiguity ("half a book", caching, SEO use) | Medium / High | Read live terms; email Crossway for written confirmation before launch; choose stricter interpretation by default |
| 3 | Pressure to monetize conflicts with ESV non-commercial rule | Medium / High | Written policy: no monetization while ESV is offered; compliance checklist; if needed, drop ESV |
| 4 | Parser mis-resolves references, which breaks trust in the main feature | Medium / High | Large test table; log (privacy-safe, aggregate) failed-parse strings locally in dev only; ambiguity UI |
| 5 | Verse numbering differences across translations break highlights | Medium / Medium | Canonical versification and mapping table; tests across 4 translations; fall back to the nearest verse |
| 6 | Design bar is subjective; scope creeps into endless polish | High / Medium | Design review gates per milestone; written "done" definition per component; ship v1 and iterate |
| 7 | Highlight selection is hard to get right across browsers | Medium / Medium | Click-on-verse-number path as a robust fallback; browser test matrix |
| 8 | Sync data loss or conflicts | Low / High | Per-verse LWW, tombstones, local-first, export; tests with offline/online scenarios |
| 9 | Magic-link emails land in spam | Medium / Medium | Authenticated sending domain (SPF, DKIM, DMARC); transactional provider; also show "check spam" hint |
| 10 | Privacy expectations: religious data is sensitive | Low / High | Minimal data; no tracking; delete account; clear privacy page; encrypt at rest |
| 11 | Public-domain source errors (typos, wrong verse splits) | Medium / Medium | Checksum sources; automated verse-count validation per book; spot checks; a public "report an error" email link on About |
| 12 | Free competitors copy the look | Medium / Low | Quality and speed are the moat; keep shipping |
| 13 | Solo builder bandwidth | High / Medium | Strict MVP; M6 (sync) can slip; static-first reduces ops |
| 14 | Font or JS bloat erodes the "fast" promise | Medium / Medium | Performance budget enforced in CI (Lighthouse CI) |

---

## 13. Future considerations (not in MVP)

- **NIV:** requires licensing directly from Biblica. Tabled. Commercial/non-commercial terms differ; revisit after launch.
- **AI features** (e.g., plain-language explanation, natural-language search "where does it talk about forgiving enemies"): possible later. Must be opt-in, off by default, clearly separated from Scripture text, and compatible with principle 1 and 4. Any use of ESV text with AI needs a separate license check.
- **Notes and bookmarks:** notes on verses; a single "last place" bookmark; list of highlights.
- **Reading plans / devotionals:** only if they can be quiet and optional.
- **Parallel translations** side by side.
- **Cross-references** shown on hover (light study; check against principle 1).
- **More translations:** other public-domain texts (ASV, Darby, YLT), other languages, possibly NASB/CSB/NLT/NET via their own terms (NET has an open API; check terms).
- **Audio.** Offline PWA. Shareable verse images (conflicts with "no social" stance, so revisit carefully).
- **Search upgrades:** typo tolerance, topical search.
- **Commercial license model** if the product needs to be funded (would remove ESV unless licensed).

---

## 14. Open questions

Decisions needed from you. Each has my default assumption.

| # | Question | My default |
|---|---|---|
| 1 | **Product name and domain.** | "A Quiet Bible" is a placeholder; need name before design (wordmark) |
| 2 | **Funding / monetization.** Is the site ever meant to earn money? | No, so ESV stays. If yes, ESV must go or be licensed commercially. |
| 3 | **Stack.** Cloudflare (Pages + Workers + D1) vs Vercel + Supabase? | Cloudflare |
| 4 | **Auth method.** Email magic link only, or add Sign in with Apple/Google? | Magic link only for MVP |
| 5 | **Highlights on partial verses?** Whole verse only, or word-level? | Whole verse only |
| 6 | **Highlight color names and meaning.** Neutral, or user-labelled? | Neutral, no labels |
| 7 | **Where is search?** (I decided: in the reference bar.) OK? | Yes |
| 8 | **Chrome auto-hide on scroll** on by default? | On, can turn off |
| 9 | **Fonts.** Serif choice, and whether to offer a sans alternative at launch. | Source Serif 4 + Inter option |
| 10 | **Landing for first-time visitors.** John 1? Genesis 1? A blank bar with focus? | John 1 (BSB) |
| 11 | **Sync scope.** Highlights only, or also settings, last position, translation? | Highlights only |
| 12 | **ESV in MVP or after?** Compliance work is real; ship ESV at launch or in a fast follow? | At launch, but can slip without blocking |
| 13 | **Written confirmation from Crossway** on caching, half-book rule, SEO/indexing: will you email them? | Yes, before launch |
| 14 | **Analytics.** Any at all? Cookieless aggregate OK? | Cookieless aggregate |
| 15 | **Apocrypha / deuterocanon.** Excluded? | Excluded (Protestant 66 books) |
| 16 | **Footnotes and section headings** shown by default? | Headings on, footnotes on hover |
| 17 | **Open source?** Will the code be public? (Affects the ESV key hygiene and trust.) | Private at first |
| 18 | **Budget and time for private beta** (~20 people) before public launch? | Yes, 2 weeks |
| 19 | **Support / contact** for error reports. | Single email on About page |
| 20 | **Accessibility commitment** beyond AA (e.g., AAA contrast on body text)? | AA, aim higher for body text |
