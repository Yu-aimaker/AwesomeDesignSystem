// One page must not invent a third date form.
// Japanese prose is 年月日 (content-and-tone.md). Tables and code are ISO 8601.
// W3C: https://www.w3.org/International/questions/qa-date-format (opened 2026-10-14).
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
  const dir = mkdtempSync(join(tmpdir(), "ads-date-"));
  writeFileSync(join(dir, name), body);
  const out = execFileSync(process.execPath, [AUDIT, dir, "--json"], { encoding: "utf8" });
  return JSON.parse(out);
}

function hits(findings) {
  return findings.filter((f) => f.rule === "hand-rolled-date");
}

test("joining month, day and year with slashes is hand-rolled-date", () => {
  const report = audit(
    "Label.tsx",
    "export const label = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;\n",
  );
  const hit = hits(report.findings);
  assert.equal(hit.length, 1);
  assert.equal(hit[0].sev, 2);
  assert.equal(hit[0].line, 1);
});

test("Intl dateStyle long is allowed", () => {
  const report = audit(
    "Prose.tsx",
    'const label = new Intl.DateTimeFormat("ja-JP", { dateStyle: "long", timeZone: "Asia/Tokyo" }).format(d);\n',
  );
  assert.equal(hits(report.findings).length, 0);
});

test("an ISO string in code is allowed", () => {
  const report = audit("Iso.tsx", 'const day = "2026-10-08";\n');
  assert.equal(hits(report.findings).length, 0);
});

test("calendar math without a slash is allowed", () => {
  const report = audit(
    "Cal.tsx",
    "const next = new Date(d.getFullYear(), d.getMonth() + 1, d.getDate());\n",
  );
  assert.equal(hits(report.findings).length, 0);
});

test("ads-audit-ignore skips one hand-rolled date", () => {
  const report = audit(
    "Skip.tsx",
    "const label = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`; // ads-audit-ignore\n",
  );
  assert.equal(hits(report.findings).length, 0);
});
