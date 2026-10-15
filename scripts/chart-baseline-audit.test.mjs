// Sir 2026-10-11: charts were hard to read. A bar that does not start at zero is one case.
// Source: https://clauswilke.com/dataviz/visualizing-amounts.html (opened 2026-10-14).
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
  const dir = mkdtempSync(join(tmpdir(), "ads-bar-"));
  writeFileSync(join(dir, name), body);
  const out = execFileSync(process.execPath, [AUDIT, dir, "--json"], { encoding: "utf8" });
  return JSON.parse(out);
}

function bars(findings) {
  return findings.filter((f) => f.rule === "bar-baseline");
}

test("a bar Y axis above zero is bar-baseline", () => {
  const report = audit(
    "Sales.tsx",
    [
      "export function Sales() {",
      "  return (",
      "    <BarChart data={rows}>",
      "      <YAxis domain={[40, 100]} />",
      "      <Bar dataKey=\"n\" />",
      "    </BarChart>",
      "  );",
      "}",
      "",
    ].join("\n"),
  );
  const hit = bars(report.findings);
  assert.equal(hit.length, 1);
  assert.equal(hit[0].sev, 2);
  assert.equal(hit[0].line, 4);
});

test("dataMin on a bar axis is bar-baseline", () => {
  const report = audit(
    "Tight.tsx",
    "export function Tight() { return <BarChart><YAxis domain={['dataMin', 'dataMax']} /><Bar dataKey=\"n\" /></BarChart>; }\n",
  );
  assert.equal(bars(report.findings).length, 1);
});

test("a bar axis at zero is allowed", () => {
  const report = audit(
    "Zero.tsx",
    "export function Zero() { return <BarChart><YAxis domain={[0, 100]} /><Bar dataKey=\"n\" /></BarChart>; }\n",
  );
  assert.equal(bars(report.findings).length, 0);
});

test("a bar chart with no domain is allowed", () => {
  const report = audit(
    "Plain.tsx",
    "export function Plain() { return <BarChart><YAxis /><Bar dataKey=\"n\" /></BarChart>; }\n",
  );
  assert.equal(bars(report.findings).length, 0);
});

test("a line chart may start above zero", () => {
  const report = audit(
    "Trend.tsx",
    "export function Trend() { return <LineChart><YAxis domain={[40, 100]} /><Line dataKey=\"n\" /></LineChart>; }\n",
  );
  assert.equal(bars(report.findings).length, 0);
});

test("ads-audit-ignore skips one bar axis", () => {
  const report = audit(
    "Skip.tsx",
    "export function Skip() { return <BarChart><YAxis domain={[40, 100]} /> {/* ads-audit-ignore */}</BarChart>; }\n",
  );
  assert.equal(bars(report.findings).length, 0);
});
