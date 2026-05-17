import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "fs";
import { join } from "path";

/**
 * Regression guard: prevents "Resource Hub" from sneaking back into the
 * codebase. We renamed everything user-facing to "Resource Library" — if
 * anyone copies legacy copy back in, this test fails loudly.
 *
 * Allowed exceptions: this test file itself, and a few historical
 * filenames/identifiers below.
 */

const ROOTS = ["src", "supabase/functions", "public", "index.html"];
const ALLOWED_PATHS = [
  "src/test/no-resource-hub.test.ts",
  // Legacy component filename kept for now; not user-visible text:
  "src/components/InsideDLDResourceHub.tsx",
];
const SKIP_DIRS = new Set(["node_modules", "dist", ".git", ".lovable"]);
const TEXT_EXT = /\.(tsx?|jsx?|css|html|md|json|txt|xml|svg)$/i;

function walk(p: string, out: string[] = []): string[] {
  let s;
  try { s = statSync(p); } catch { return out; }
  if (s.isFile()) { out.push(p); return out; }
  if (!s.isDirectory()) return out;
  for (const name of readdirSync(p)) {
    if (SKIP_DIRS.has(name)) continue;
    walk(join(p, name), out);
  }
  return out;
}

describe("Resource Hub regression guard", () => {
  it("no file contains the phrase 'Resource Hub'", () => {
    const offenders: string[] = [];
    for (const root of ROOTS) {
      for (const file of walk(root)) {
        if (ALLOWED_PATHS.includes(file)) continue;
        if (!TEXT_EXT.test(file)) continue;
        const text = readFileSync(file, "utf8");
        if (/resource hub/i.test(text)) offenders.push(file);
      }
    }
    expect(offenders, `Use "Resource Library" instead. Offenders:\n${offenders.join("\n")}`).toEqual([]);
  });
});
