// PLAN P0.3 · D§3.1 Books · SPEC P2 (alias table), P5 (bounds), §9.3 (KJV versification).
import { describe, expect, it } from "vitest";
import {
  BOOKS,
  BOOKS_SCHEMA,
  bookByAlias,
  bookByOrder,
  chapterVerses,
  getBook,
  isBookId,
  ordinalValue,
  toBookId,
  verseCount,
  type Book,
} from "./books.js";

const sum = (ns: readonly number[]) => ns.reduce((a, b) => a + b, 0);
const book = (id: string): Book => getBook(toBookId(id));

// FNV-1a 32-bit. Not for security: it pins the exact per-chapter counts so any
// edit to books.json must also update the fingerprint deliberately.
function fnv1a(s: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, "0");
}

// Computed from eng-kjv2006 USFM (see data/books.SOURCE.md), not from books.json.
const SOURCE_FINGERPRINT = "91bbd209";

describe("books.json totals (SPEC §9.3, PLAN P0.3)", () => {
  it("has 66 books: 39 OT, 27 NT, schema 1", () => {
    expect(BOOKS).toHaveLength(66);
    expect(BOOKS.filter((b) => b.testament === "ot")).toHaveLength(39);
    expect(BOOKS.filter((b) => b.testament === "nt")).toHaveLength(27);
    expect(BOOKS_SCHEMA).toBe(1);
  });

  it("has 1,189 chapters and 31,102 verses", () => {
    expect(sum(BOOKS.map((b) => b.chapters))).toBe(1189);
    expect(sum(BOOKS.map(verseCount))).toBe(31102);
  });

  it("splits verses 23,145 OT / 7,957 NT", () => {
    expect(sum(BOOKS.filter((b) => b.testament === "ot").map(verseCount))).toBe(23145);
    expect(sum(BOOKS.filter((b) => b.testament === "nt").map(verseCount))).toBe(7957);
  });
});

describe("chapter-level verse counts", () => {
  it("match the eng-kjv2006 source for every chapter (fingerprint)", () => {
    const canonical = BOOKS.map((b) => b.verses.join(",")).join(";");
    expect(fnv1a(canonical)).toBe(SOURCE_FINGERPRINT);
  });

  it("are positive integers, one per chapter", () => {
    for (const b of BOOKS) {
      expect(b.verses).toHaveLength(b.chapters);
      for (const n of b.verses) expect(Number.isInteger(n) && n > 0).toBe(true);
    }
  });

  it.each([
    ["genesis", 1533], ["psalms", 2461], ["isaiah", 1292], ["matthew", 1071],
    ["john", 879], ["acts", 1007], ["revelation", 404],
  ])("%s has %i verses (known KJV totals)", (id, n) => {
    expect(verseCount(book(id))).toBe(n);
  });

  it.each([
    ["genesis", 1, 31], ["genesis", 50, 26], ["psalms", 23, 6], ["psalms", 117, 2],
    ["psalms", 119, 176], ["haggai", 2, 23], ["matthew", 5, 48], ["john", 3, 36],
    ["romans", 8, 39], ["1-corinthians", 13, 13], ["3-john", 1, 14], ["jude", 1, 25],
    ["revelation", 22, 21],
  ])("%s %i has %i verses", (id, ch, n) => {
    expect(chapterVerses(book(id), ch)).toBe(n);
  });

  it("has exactly five single-chapter books", () => {
    expect(BOOKS.filter((b) => b.chapters === 1).map((b) => b.id)).toEqual([
      "obadiah", "philemon", "2-john", "3-john", "jude",
    ]);
  });
});

describe("identity fields (SPEC URLs, D§3.1)", () => {
  it("orders books 1..66 with John at 43", () => {
    BOOKS.forEach((b, i) => expect(b.order).toBe(i + 1));
    expect(bookByOrder(43)?.id).toBe("john");
  });

  it("uses id = slug = lowercase hyphenated full name, all unique", () => {
    for (const b of BOOKS) {
      expect(b.id).toBe(b.slug);
      expect(b.slug).toBe(b.name.toLowerCase().replaceAll(" ", "-"));
      expect(b.slug).toMatch(/^[1-3]?-?[a-z]+(-[a-z]+)*$/);
      expect(b.short.length).toBeGreaterThan(0);
    }
    expect(new Set(BOOKS.map((b) => b.id)).size).toBe(66);
  });
});

describe("aliases (SPEC P2)", () => {
  // Exact aliases must be unambiguous; prefix ambiguity ("ph", "ju") is P0.5's job.
  const INTENDED_AMBIGUOUS: readonly string[] = [];

  it("are normalized keys", () => {
    for (const b of BOOKS) for (const a of b.aliases) expect(a).toMatch(/^[1-3]?[a-z]+$/);
  });

  it("never map to two books", () => {
    const owners = new Map<string, string[]>();
    for (const b of BOOKS) for (const a of new Set(b.aliases)) owners.set(a, [...(owners.get(a) ?? []), b.id]);
    const shared = [...owners].filter(([a, ids]) => ids.length > 1 && !INTENDED_AMBIGUOUS.includes(a));
    expect(shared).toEqual([]);
  });

  it("have no duplicates within a book and include the full name", () => {
    for (const b of BOOKS) {
      expect(new Set(b.aliases).size).toBe(b.aliases.length);
      expect(b.aliases).toContain(b.slug.replaceAll("-", ""));
    }
  });

  // Mirrors D§3.1 step 4 just enough to form keys from SPEC §5.3 book tokens.
  function key(token: string): string {
    const words = token.toLowerCase().replaceAll(".", "").split(/\s+/).filter(Boolean);
    const ord = words.length > 1 ? ordinalValue(words[0]!) : undefined;
    return ord ? `${ord}${words.slice(1).join("")}` : words.join("");
  }

  it.each([
    ["jn", "john"], ["John", "john"], ["Jn.", "john"],
    ["romans", "romans"], ["rom", "romans"], ["Rom", "romans"],
    ["1 cor", "1-corinthians"], ["1cor", "1-corinthians"], ["I Cor", "1-corinthians"],
    ["first corinthians", "1-corinthians"],
    ["ps", "psalms"], ["psalm", "psalms"], ["psalms", "psalms"], ["pslm", "psalms"],
    ["gen", "genesis"], ["matt", "matthew"], ["jude", "jude"], ["obadiah", "obadiah"],
    ["Song of Songs", "song-of-solomon"], ["Song of Solomon", "song-of-solomon"],
    ["Canticles", "song-of-solomon"], ["Revelation", "revelation"], ["Revelations", "revelation"],
  ])("SPEC §5.3 token %j resolves to %s", (token, id) => {
    expect(bookByAlias(key(token))?.id).toBe(id);
  });

  it("reach every numbered book through every ordinal form, by name and short name", () => {
    const forms = {
      1: ["1", "i", "first", "1st"],
      2: ["2", "ii", "second", "2nd"],
      3: ["3", "iii", "third", "3rd"],
    } as const;
    const numbered = BOOKS.filter((b) => /^[1-3] /.test(b.name));
    expect(numbered).toHaveLength(17);
    for (const b of numbered) {
      const n = Number(b.name[0]) as 1 | 2 | 3;
      for (const base of [b.name, b.short].map((s) => s.slice(2).toLowerCase().replaceAll(" ", ""))) {
        for (const ord of forms[n]) {
          expect(bookByAlias(`${ordinalValue(ord)}${base}`), `${ord} ${base}`).toBe(b);
        }
      }
    }
  });
});

describe("lookups", () => {
  it("ordinalValue accepts only 1st–3rd forms", () => {
    expect(ordinalValue("II")).toBe(2);
    expect(ordinalValue("Third")).toBe(3);
    expect(ordinalValue("iv")).toBeUndefined();
    expect(ordinalValue("fourth")).toBeUndefined();
  });

  it("toBookId validates untrusted ids (aliases are not ids)", () => {
    expect(isBookId("song-of-solomon")).toBe(true);
    expect(isBookId("jn")).toBe(false);
    expect(() => toBookId("Genesis")).toThrow(RangeError);
  });

  it("bookByOrder rejects out-of-range and non-integer input", () => {
    expect(bookByOrder(1)?.id).toBe("genesis");
    expect(bookByOrder(66)?.id).toBe("revelation");
    for (const n of [0, 67, 1.5, Number.NaN]) expect(bookByOrder(n)).toBeUndefined();
  });

  it("chapterVerses is undefined outside the book (SPEC P5 bounds)", () => {
    const john = book("john");
    for (const ch of [0, 22, 2.5, -1]) expect(chapterVerses(john, ch)).toBeUndefined();
  });

  it("metadata is immutable", () => {
    expect(Object.isFrozen(BOOKS)).toBe(true);
    expect(Object.isFrozen(BOOKS[0])).toBe(true);
    expect(Object.isFrozen(BOOKS[0]!.verses)).toBe(true);
  });
});
