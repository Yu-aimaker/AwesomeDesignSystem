import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { appendLedger } from "../lib/knowledge-append.mjs";
import { assertClean, constrainField, leakageFindings } from "../lib/redact.mjs";

const ledger = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "..", "..", "Knowledge/research/oss-candidates.md"), "utf8");

test("leakage findings name the kind and hide the value", () => {
  const text = [
    "person@example.com",
    "ghp_abcdefghijklmnopqrstuvwxyz123456",
    "https://user:secret@example.com/repo",
    "/Users/someone/notes",
    "via: bookmark",
  ].join("\n");
  const kinds = leakageFindings(text);
  assert.ok(kinds.includes("email"));
  assert.ok(kinds.includes("credential"));
  assert.ok(kinds.includes("local-path"));
  assert.ok(kinds.includes("forbidden-field"));
  assert.equal(JSON.stringify(kinds).includes("example.com"), false);
  assert.throws(() => assertClean(text, "report"), (error) => {
    assert.match(error.message, /report withheld/);
    assert.equal(error.message.includes("person@"), false);
    return true;
  });
  assert.equal(constrainField("ok title"), "ok title");
  assert.equal(constrainField("hidden@example.com"), "");
});

test("knowledge append drops a leaked row and keeps a clean one", () => {
  const next = appendLedger(ledger, [
    { title: "acme/demo", url: "https://github.com/acme/demo", stars: 400, license: "MIT" },
    { title: "hidden@example.com", url: "https://github.com/acme/hidden", stars: 10, license: "MIT" },
  ], "2026-11-11");
  assert.equal(next.added, 1);
  assert.equal(next.refused, 1);
  assert.match(next.markdown, /acme\/demo/);
  assert.equal(next.markdown.includes("hidden@"), false);
  const again = appendLedger(next.markdown, [
    { title: "acme/demo", url: "https://github.com/acme/demo", stars: 400, license: "MIT" },
  ], "2026-11-18");
  assert.equal(again.added, 0);
});
