// STA-103: the popular slide-skill catalog stays a sourced table.
// Run: node --test scripts/slide-skills-catalog.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const file = join(root, "Knowledge/skills/slide-skills.md");

test("slide skill catalog lists sourced GitHub rows", () => {
  const text = readFileSync(file, "utf8");
  assert.equal(text.includes("—"), false);
  const rows = text.split("\n").filter((line) => line.startsWith("| ") && line.includes("https://github.com/"));
  assert.ok(rows.length >= 6, `expected at least 6 catalog rows, got ${rows.length}`);
  for (const row of rows) {
    assert.match(row, /2026-10-14|2026-\d{2}-\d{2}/);
    assert.match(row, /https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+/);
  }
  assert.match(text, /marp-slides/);
  assert.match(text, /404/);
});
