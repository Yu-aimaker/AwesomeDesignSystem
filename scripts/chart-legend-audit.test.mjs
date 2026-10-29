// Charts were hard to read. A color key apart from the mark is one case.
// Source: https://www.datawrapper.de/blog/text-in-data-visualizations (opened 2026-10-14).
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
  const dir = mkdtempSync(join(tmpdir(), "ads-legend-"));
  writeFileSync(join(dir, name), body);
  const out = execFileSync(process.execPath, [AUDIT, dir, "--json"], { encoding: "utf8" });
  return JSON.parse(out);
}

function keys(findings) {
  return findings.filter((f) => f.rule === "color-key");
}

test("a Legend inside a line chart is color-key", () => {
  const report = audit(
    "Trend.tsx",
    [
      "export function Trend() {",
      "  return (",
      "    <LineChart data={rows}>",
      "      <Line dataKey=\"a\" />",
      "      <Legend />",
      "    </LineChart>",
      "  );",
      "}",
      "",
    ].join("\n"),
  );
  const hit = keys(report.findings);
  assert.equal(hit.length, 1);
  assert.equal(hit[0].sev, 2);
  assert.equal(hit[0].line, 5);
});

test("a line chart with a label on the line and no Legend is allowed", () => {
  const report = audit(
    "Labeled.tsx",
    "export function Labeled() { return <LineChart><Line dataKey=\"a\" label /></LineChart>; }\n",
  );
  assert.equal(keys(report.findings).length, 0);
});

test("a Legend inside an area chart is color-key", () => {
  const report = audit(
    "Area.tsx",
    "export function AreaView() { return <AreaChart><Area dataKey=\"a\" /><Legend /></AreaChart>; }\n",
  );
  assert.equal(keys(report.findings).length, 1);
});

test("a Legend inside a pie chart is color-key", () => {
  const report = audit(
    "Share.tsx",
    "export function Share() { return <PieChart><Pie data={rows} /><Legend /></PieChart>; }\n",
  );
  assert.equal(keys(report.findings).length, 1);
});

test("a column chart may keep a Legend", () => {
  const report = audit(
    "Bars.tsx",
    "export function Bars() { return <BarChart><Bar dataKey=\"n\" /><Legend /></BarChart>; }\n",
  );
  assert.equal(keys(report.findings).length, 0);
});

test("a horizontal bar chart may keep a Legend", () => {
  const report = audit(
    "Wide.tsx",
    "export function Wide() { return <BarChart layout=\"vertical\"><Bar dataKey=\"n\" /><Legend /></BarChart>; }\n",
  );
  assert.equal(keys(report.findings).length, 0);
});

test("a Legend outside the line chart is allowed", () => {
  const report = audit(
    "Aside.tsx",
    "export function Aside() { return <><LineChart><Line dataKey=\"a\" /></LineChart><Legend /></>; }\n",
  );
  assert.equal(keys(report.findings).length, 0);
});

test("ads-audit-ignore skips one Legend", () => {
  const report = audit(
    "Skip.tsx",
    "export function Skip() { return <LineChart><Legend /> {/* ads-audit-ignore */}</LineChart>; }\n",
  );
  assert.equal(keys(report.findings).length, 0);
});
