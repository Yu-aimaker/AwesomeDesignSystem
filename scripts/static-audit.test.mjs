// Japanese filler in design-verifier static-audit. Run: node --test scripts/static-audit.test.mjs
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
  const dir = mkdtempSync(join(tmpdir(), "ads-audit-"));
  const file = join(dir, name);
  writeFileSync(file, body);
  const out = execFileSync(process.execPath, [AUDIT, file, "--json"], { encoding: "utf8" });
  return JSON.parse(out);
}

function rules(report) {
  return report.findings.map((f) => f.rule);
}

test("Japanese filler in visible copy is ja-filler", () => {
  const report = audit(
    "page.html",
    "<p>本サービスは、革新的でシームレスな体験を実現することができます。</p>\n",
  );
  assert.ok(rules(report).includes("ja-filler"));
});

test("bad and before keys, quoted terms, comments, and ignore marks are skipped", () => {
  const report = audit(
    "copy.tsx",
    [
      'heroBadTitle: "革新的な体験を、シームレスに。",',
      'badBody: "次世代の報告",',
      'const note = "「ことができます」は禁止語";',
      'why: "\\"ことができます\\" is empty phrasing.",',
      "// 次世代",
      "const ok = \"保存しました\"; // ads-audit-ignore を実現",
      "",
    ].join("\n"),
  );
  assert.equal(rules(report).includes("ja-filler"), false);
});

test("a real label with を実現 is still ja-filler", () => {
  const report = audit("Button.tsx", 'export const B = () => <button>価値を実現</button>;\n');
  assert.ok(rules(report).includes("ja-filler"));
});
