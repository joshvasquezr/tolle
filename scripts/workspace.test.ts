// PLAN P0.1 "Done when": exact versions pinned; generated dirs git-ignored.
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(import.meta.dirname, "..");

type Manifest = {
  packageManager?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
};

function manifests(): Array<[string, Manifest]> {
  const dirs = ["."];
  for (const group of ["apps", "packages"]) {
    for (const d of readdirSync(join(root, group))) dirs.push(join(group, d));
  }
  dirs.push("scripts");
  return dirs
    .filter((d) => existsSync(join(root, d, "package.json")))
    .map((d) => [d, JSON.parse(readFileSync(join(root, d, "package.json"), "utf8")) as Manifest]);
}

// An exact semver, or a workspace link to a sibling package.
const EXACT = /^(\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?|workspace:\*)$/;

describe("P0.1 workspace scaffold", () => {
  it("pins every dependency to an exact version", () => {
    const loose: string[] = [];
    for (const [dir, m] of manifests()) {
      for (const field of ["dependencies", "devDependencies", "optionalDependencies"] as const) {
        for (const [name, range] of Object.entries(m[field] ?? {})) {
          if (!EXACT.test(range)) loose.push(`${dir}: ${name}@${range}`);
        }
      }
    }
    expect(loose).toEqual([]);
  });

  it("pins the package manager", () => {
    const [, rootManifest] = manifests()[0]!;
    expect(rootManifest.packageManager).toMatch(/^pnpm@\d+\.\d+\.\d+$/);
  });

  it("has a committed lockfile", () => {
    expect(existsSync(join(root, "pnpm-lock.yaml"))).toBe(true);
  });

  it.each([
    "apps/web/public/data/bsb/john/3.json",
    "apps/web/dist/index.html",
    "dist/index.html",
    "node_modules/x/index.js",
    "apps/worker/.dev.vars",
    ".env",
  ])("git-ignores generated/secret path %s", (path) => {
    // check-ignore exits 0 when the path is ignored and throws otherwise.
    const out = execFileSync("git", ["check-ignore", "--no-index", path], { cwd: root, encoding: "utf8" });
    expect(out.trim()).toBe(path);
  });

  it.each(["packages/core/src/index.ts", "data/sources/bsb/43JHN.usfm", "test-vectors/refs.json"])(
    "does not ignore source path %s",
    (path) => {
      expect(() =>
        execFileSync("git", ["check-ignore", "--no-index", path], { cwd: root, stdio: "pipe" }),
      ).toThrow();
    },
  );
});
