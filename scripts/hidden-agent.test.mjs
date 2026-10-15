// STA-100 Japanese copy: keigo that hides who acts.
// no-ai-slop-ja pattern 9 (SKILL.md, fetched 2026-10-14):
// https://github.com/53able/no-ai-slop-ja/blob/main/skills/no-ai-slop-ja/SKILL.md
// Bad: 「こちらで確認させていただく形となっております。」
// Fix: name who checks, or say 確認します.
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
  const dir = mkdtempSync(join(tmpdir(), "ads-agent-"));
  writeFileSync(join(dir, name), body);
  const out = execFileSync(process.execPath, [AUDIT, dir, "--json"], { encoding: "utf8" });
  return JSON.parse(out);
}

function hits(findings) {
  return findings.filter((f) => f.rule === "hidden-agent");
}

test("させていただく with no actor is hidden-agent", () => {
  const report = audit("Toast.tsx", "export const copy = `こちらで確認させていただく。`;\n");
  const hit = hits(report.findings);
  assert.equal(hit.length, 1);
  assert.equal(hit[0].sev, 3);
  assert.equal(hit[0].line, 1);
});

test("the polite ます form is the same finding", () => {
  const report = audit("Toast2.tsx", "export const copy = `こちらで確認させていただきます。`;\n");
  assert.equal(hits(report.findings).length, 1);
});

test("させて頂く and 形となっております are the same finding", () => {
  const report = audit(
    "Copy.tsx",
    "export const a = `内容を確認させて頂きます。`;\nexport const b = `受付は完了した形となっております。`;\n",
  );
  assert.equal(hits(report.findings).length, 2);
});

test("a named action is not the pattern", () => {
  const report = audit("Ok.tsx", "export const copy = `担当者が確認します。`;\n");
  assert.equal(hits(report.findings).length, 0);
});

test("a before example and a quoted phrase are not findings", () => {
  const report = audit(
    "Catalog.tsx",
    'before: "確認させていただきます。",\nconst note = "「させていただく」は主体を隠す";\n',
  );
  assert.equal(hits(report.findings).length, 0);
});

test("ads-audit-ignore skips one line", () => {
  const report = audit("Skip.tsx", "export const copy = `確認させていただきます。`; // ads-audit-ignore\n");
  assert.equal(hits(report.findings).length, 0);
});
