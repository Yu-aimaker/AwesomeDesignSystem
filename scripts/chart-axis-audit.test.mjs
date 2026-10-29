// Charts were hard to read. Two Y axes are one of those cases.
// Source: https://www.datawrapper.de/blog/dualaxis (opened 2026-10-14).
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
  const dir = mkdtempSync(join(tmpdir(), "ads-chart-"));
  writeFileSync(join(dir, name), body);
  const out = execFileSync(process.execPath, [AUDIT, dir, "--json"], { encoding: "utf8" });
  return JSON.parse(out);
}

test("two YAxis tags are dual-axis", () => {
  const report = audit(
    "Compare.tsx",
    [
      "export function Compare() {",
      "  return (",
      "    <Chart>",
      "      <YAxis yAxisId=\"left\" />",
      "      <YAxis yAxisId=\"right\" orientation=\"right\" />",
      "    </Chart>",
      "  );",
      "}",
      "",
    ].join("\n"),
  );
  const hit = report.findings.filter((f) => f.rule === "dual-axis");
  assert.equal(hit.length, 1);
  assert.equal(hit[0].sev, 2);
  assert.equal(hit[0].line, 5);
});

test("one YAxis is allowed", () => {
  const report = audit(
    "Single.tsx",
    "export function Single() { return <Chart><YAxis /></Chart>; }\n",
  );
  assert.equal(report.findings.filter((f) => f.rule === "dual-axis").length, 0);
});
