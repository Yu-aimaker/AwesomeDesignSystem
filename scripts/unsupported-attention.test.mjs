// STA-100 Japanese copy: a crowd claim needs a source.
// no-ai-slop-ja pattern 15 (SKILL.md, fetched 2026-10-14):
// https://github.com/53able/no-ai-slop-ja
// Bad: 「近年注目されています。」 Fix: name the source, or delete the sentence.
// A citation on the same line or the next two is not a finding.
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const AUDIT = join(root, "Plugin/awesome-ds/skills/design-verifier/scripts/static-audit.mjs");

function audit(name, body) {
  const dir = mkdtempSync(join(tmpdir(), "ads-attention-"));
  writeFileSync(join(dir, name), body);
  const out = execFileSync(process.execPath, [AUDIT, dir, "--json"], { encoding: "utf8" });
  return JSON.parse(out);
}

function hits(findings) {
  return findings.filter((f) => f.rule === "unsupported-attention");
}

test("注目されています with no source is unsupported-attention", () => {
  const report = audit("Hero.tsx", "export const copy = `近年注目されています。`;\n");
  const hit = hits(report.findings);
  assert.equal(hit.length, 1);
  assert.equal(hit[0].sev, 3);
  assert.equal(hit[0].line, 1);
});

test("ご注目ください and 注目を集めて are the same finding", () => {
  const report = audit(
    "Copy.tsx",
    "export const a = `最新の機能にご注目ください。`;\nexport const b = `この手法が注目を集めています。`;\n",
  );
  assert.equal(hits(report.findings).length, 2);
});

test("a URL on the next line is a source", () => {
  const report = audit(
    "Cited.tsx",
    "export const copy = `近年注目されています。`;\nexport const source = `https://www.nngroup.com/articles/ai-roles-ux/`;\n",
  );
  assert.equal(hits(report.findings).length, 0);
});

test("出典 on the same line is a source", () => {
  const report = audit("Named.tsx", "export const copy = `近年注目されています。出典: NN/g`;\n");
  assert.equal(hits(report.findings).length, 0);
});

test("a before example and a quoted phrase are not findings", () => {
  const report = audit(
    "Catalog.tsx",
    'before: "最新の機能にご注目ください。",\nconst note = "「注目されています」は根拠がない";\n',
  );
  assert.equal(hits(report.findings).length, 0);
});

test("注目の as a label is not the pattern", () => {
  const report = audit("Nav.tsx", "export const label = `注目のデザインシステム`;\n");
  assert.equal(hits(report.findings).length, 0);
});

test("ads-audit-ignore skips one claim", () => {
  const report = audit("Skip.tsx", "export const copy = `近年注目されています。`; // ads-audit-ignore\n");
  assert.equal(hits(report.findings).length, 0);
});
