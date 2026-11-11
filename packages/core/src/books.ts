// Book metadata (D§3.1 Books). `data/books.json` is the only source of book
// facts; this module validates it once and exposes typed lookups.
import raw from "../data/books.json" with { type: "json" };

declare const bookIdBrand: unique symbol;

/**
 * A validated book id (equal to the slug, e.g. `song-of-solomon`).
 * Branded instead of a 66-member literal union so the ids live only in
 * books.json; get one from `toBookId`, `isBookId` or a `Book`.
 */
export type BookId = string & { readonly [bookIdBrand]: true };

export type Testament = "ot" | "nt";

export interface Book {
  readonly id: BookId;
  readonly slug: string;
  readonly name: string;
  readonly short: string;
  readonly testament: Testament;
  /** 1..66; also the book part of a verse id (D§3.1 Verse ID). */
  readonly order: number;
  readonly chapters: number;
  /** Verse count per chapter; index 0 = chapter 1. */
  readonly verses: readonly number[];
  /** Normalized keys: lowercase, no spaces or dots, ordinal as a digit. */
  readonly aliases: readonly string[];
}

type RawBook = (typeof raw.books)[number];

function fail(msg: string): never {
  throw new Error(`books.json: ${msg}`);
}

// Shape checks only, so the casts below are honest. Cross-book invariants
// (totals, uniqueness, alias collisions) are enforced by books.test.ts.
function toBook(b: RawBook, index: number): Book {
  if (b.testament !== "ot" && b.testament !== "nt") fail(`${b.id}: bad testament`);
  if (b.id !== b.slug) fail(`${b.id}: id must equal slug`);
  if (b.order !== index + 1) fail(`${b.id}: order ${b.order} at position ${index + 1}`);
  if (b.verses.length !== b.chapters) fail(`${b.id}: verses.length != chapters`);
  return Object.freeze({
    ...b,
    id: b.id as BookId,
    testament: b.testament,
    verses: Object.freeze([...b.verses]),
    aliases: Object.freeze([...b.aliases]),
  });
}

/** books.json format version (D§11). */
export const BOOKS_SCHEMA: number = raw.schema;

/** All books in canonical order. */
export const BOOKS: readonly Book[] = Object.freeze(raw.books.map(toBook));

const byId = new Map<string, Book>(BOOKS.map((b) => [b.id, b]));
const byAlias = new Map<string, Book>();
for (const b of BOOKS) {
  for (const a of b.aliases) {
    // SPEC P2/P4: exact aliases are unambiguous; ambiguity comes only from prefixes (P0.5).
    const prev = byAlias.get(a);
    if (prev && prev !== b) fail(`alias "${a}" maps to ${prev.id} and ${b.id}`);
    byAlias.set(a, b);
  }
}

export function isBookId(s: string): s is BookId {
  return byId.has(s);
}

/** Validates untrusted input (URLs, API params). Throws on an unknown id. */
export function toBookId(s: string): BookId {
  if (!isBookId(s)) throw new RangeError(`unknown book id: ${s}`);
  return s;
}

export function getBook(id: BookId): Book {
  // Non-null: a BookId can only be obtained for a known book.
  return byId.get(id)!;
}

export function bookByOrder(order: number): Book | undefined {
  return Number.isInteger(order) ? BOOKS[order - 1] : undefined;
}

/** Exact lookup of an already-normalized alias key (e.g. `1cor`, `songofsongs`). */
export function bookByAlias(key: string): Book | undefined {
  return byAlias.get(key);
}

/** Total verses in a book (drives the ESV half-book cap, D§3.1). */
export function verseCount(book: Book): number {
  return book.verses.reduce((sum, n) => sum + n, 0);
}

/** Verses in a chapter, or undefined if the chapter does not exist. */
export function chapterVerses(book: Book, chapter: number): number | undefined {
  return Number.isInteger(chapter) && chapter >= 1 ? book.verses[chapter - 1] : undefined;
}

const ORDINALS: ReadonlyMap<string, 1 | 2 | 3> = new Map([
  ["1", 1], ["i", 1], ["first", 1], ["1st", 1],
  ["2", 2], ["ii", 2], ["second", 2], ["2nd", 2],
  ["3", 3], ["iii", 3], ["third", 3], ["3rd", 3],
]);

/**
 * Value of a leading book ordinal token (`1`, `I`, `first`, `1st`, …), else
 * undefined. The parser (P0.5) prefixes it as a digit to form an alias key.
 */
export function ordinalValue(token: string): 1 | 2 | 3 | undefined {
  return ORDINALS.get(token.toLowerCase());
}
