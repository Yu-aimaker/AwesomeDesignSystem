// A crowd overlook claim needs a source.
// no-ai-slop-ja pattern 13 (SKILL.md, fetched 2026-10-14):
// https://github.com/53able/no-ai-slop-ja
// Bad: 「多くの人が見落としているのが、運用の重要性です。」
// Fix: delete the claim, or cite a measured rate.
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
  const dir = mkdtempSync(join(tmpdir(), "ads-overlook-"));
  writeFileSync(join(dir, name), body);
  const out = execFileSync(process.execPath, [AUDIT, dir, "--json"], { encoding: "utf8" });
  return JSON.parse(out);
}

function hits(findings) {
  return findings.filter((f) => f.rule === "unsupported-overlook");
}

test("多くの人が見落としている with no source is unsupported-overlook", () => {
  const report = audit("Hero.tsx", "export const copy = `多くの人が見落としているのが、運用の重要性です。`;\n");
  const hit = hits(report.findings);
  assert.equal(hit.length, 1);
  assert.equal(hit[0].sev, 3);
  assert.equal(hit[0].line, 1);
});

test("多くの人は見落とす is the same finding", () => {
  const report = audit("Copy.tsx", "export const copy = `多くの人は見落とします。`;\n");
  assert.equal(hits(report.findings).length, 1);
});

test("a URL on the next line is a source", () => {
  const report = audit(
    "Cited.tsx",
    "export const copy = `多くの人が見落としている点です。`;\nexport const source = `https://www.nngroup.com/articles/ai-roles-ux/`;\n",
  );
  assert.equal(hits(report.findings).length, 0);
});

test("出典 on the same line is a source", () => {
  const report = audit("Named.tsx", "export const copy = `調査では多くの人が見落としています。出典: NN/g`;\n");
  assert.equal(hits(report.findings).length, 0);
});

test("a before example and a quoted phrase are not findings", () => {
  const report = audit(
    "Catalog.tsx",
    'before: "多くの人が見落としているのが、運用の重要性です。",\nconst note = "「多くの人が見落としている」は根拠がない";\n',
  );
  assert.equal(hits(report.findings).length, 0);
});

test("見落とし without 多くの人 is not the pattern", () => {
  const report = audit("Nav.tsx", "export const label = `見落としのない確認`;\n");
  assert.equal(hits(report.findings).length, 0);
});

test("ads-audit-ignore skips one claim", () => {
  const report = audit("Skip.tsx", "export const copy = `多くの人が見落としています。`; // ads-audit-ignore\n");
  assert.equal(hits(report.findings).length, 0);
});
