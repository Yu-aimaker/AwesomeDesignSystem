// The content-and-tone foundation listed 4 English forbidden words while design-verifier
// checked 13. This keeps the foundation table, check-copy and static-audit in step.
// Run: node --test scripts/content-tone.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { RULES, findingsInSource } from "./check-copy.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const doc = readFileSync(join(root, "AwesomeDS/foundations/content-and-tone.md"), "utf8");
const AUDIT = join(root, "Plugin/awesome-ds/skills/design-verifier/scripts/static-audit.mjs");
const auditSource = readFileSync(AUDIT, "utf8");

// | `seamless` | en | name the step that was removed |
const section = doc.split("## Forbidden words")[1].split("\n## ")[0];
const words = [...section.matchAll(/^\| `([^`]+)` \| (en|ja) \|/gm)].map(([, word, lang]) => ({ word, lang }));

function auditRegex(name) {
  const m = auditSource.match(new RegExp(`const ${name} = (/.+/[a-z]*);`));
  assert.ok(m, `${name} not found in static-audit.mjs`);
  const [, body, flags] = m[1].match(/^\/(.+)\/([a-z]*)$/);
  return new RegExp(body, flags);
}

// One readable sample per alternative: seamless(ly)? -> seamless, next[- ]gen -> next-gen.
function samples(re) {
  const inner = re.source.replace(/^\\b\(/, "").replace(/\)\\b$/, "");
  const parts = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < inner.length; i += 1) {
    if (inner[i] === "(" || inner[i] === "[") depth += 1;
    else if (inner[i] === ")" || inner[i] === "]") depth -= 1;
    else if (inner[i] === "|" && depth === 0) {
      parts.push(inner.slice(start, i));
      start = i + 1;
    }
  }
  parts.push(inner.slice(start));
  return parts.map((p) =>
    p
      .replace(/\([^)]*\)\?/g, "")
      .replace(/\((\w+)\|[^)]*\)/g, "$1")
      .replace(/\[- \]/g, "-")
      .replace(/\[sz\]/g, "z"),
  );
}

function audit(body) {
  const dir = mkdtempSync(join(tmpdir(), "ads-tone-"));
  const file = join(dir, "copy.tsx");
  writeFileSync(file, body);
  const out = execFileSync(process.execPath, [AUDIT, file, "--json"], { encoding: "utf8" });
  return JSON.parse(out).findings.map((f) => f.rule);
}

test("the foundation lists forbidden words in both languages", () => {
  assert.ok(words.filter((w) => w.lang === "en").length >= 10);
  assert.ok(words.filter((w) => w.lang === "ja").length >= 4);
});

test("check-copy and static-audit use the same English list", () => {
  const checkCopy = RULES.find((r) => r.id === "forbidden-en").re;
  assert.equal(checkCopy.source, auditRegex("FILLER").source);
});

test("every word the checkers look for is in the foundation table", () => {
  const listed = new Set(words.map((w) => w.word));
  for (const sample of samples(auditRegex("FILLER"))) assert.ok(listed.has(sample), `${sample} missing from the table`);
  for (const sample of auditRegex("JA_FILLER").source.split("|")) assert.ok(listed.has(sample), `${sample} missing from the table`);
});

test("every word in the foundation table is flagged by both checkers", () => {
  for (const { word, lang } of words) {
    const text = lang === "en" ? `Make it ${word} today` : `請求書を${word}`;
    const copyRules = findingsInSource(`label: "${text}"`).map((f) => f.rule);
    assert.ok(copyRules.length > 0, `check-copy misses ${word}`);
    const auditRules = audit(`<p>${text}</p>\n`);
    assert.ok(auditRules.includes(lang === "en" ? "filler-word" : "ja-filler"), `static-audit misses ${word}`);
  }
});
