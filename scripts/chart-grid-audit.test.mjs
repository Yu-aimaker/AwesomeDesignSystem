// Sir 2026-10-11: charts were hard to read. Vertical grid lines are one case.
// Source: https://clauswilke.com/dataviz/balance-data-context.html#background-grids (opened 2026-10-14).
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
  const dir = mkdtempSync(join(tmpdir(), "ads-grid-"));
  writeFileSync(join(dir, name), body);
  const out = execFileSync(process.execPath, [AUDIT, dir, "--json"], { encoding: "utf8" });
  return JSON.parse(out);
}

function grids(findings) {
  return findings.filter((f) => f.rule === "vertical-grid");
}

test("a default CartesianGrid on a column chart is vertical-grid", () => {
  const report = audit(
    "Sales.tsx",
    [
      "export function Sales() {",
      "  return (",
      "    <BarChart data={rows}>",
      "      <CartesianGrid />",
      "      <Bar dataKey=\"n\" />",
      "    </BarChart>",
      "  );",
      "}",
      "",
    ].join("\n"),
  );
  const hit = grids(report.findings);
  assert.equal(hit.length, 1);
  assert.equal(hit[0].sev, 2);
  assert.equal(hit[0].line, 4);
});

test("vertical={true} on a column chart is vertical-grid", () => {
  const report = audit(
    "On.tsx",
    "export function On() { return <BarChart><CartesianGrid vertical={true} /><Bar dataKey=\"n\" /></BarChart>; }\n",
  );
  assert.equal(grids(report.findings).length, 1);
});

test("vertical={false} on a column chart is allowed", () => {
  const report = audit(
    "Off.tsx",
    "export function Off() { return <BarChart><CartesianGrid vertical={false} /><Bar dataKey=\"n\" /></BarChart>; }\n",
  );
  assert.equal(grids(report.findings).length, 0);
});

test("a column chart with no grid is allowed", () => {
  const report = audit(
    "Plain.tsx",
    "export function Plain() { return <BarChart><Bar dataKey=\"n\" /></BarChart>; }\n",
  );
  assert.equal(grids(report.findings).length, 0);
});

test("a line chart with a full grid is vertical-grid", () => {
  const report = audit(
    "Trend.tsx",
    "export function Trend() { return <LineChart><CartesianGrid stroke=\"#ccc\" /><Line dataKey=\"n\" /></LineChart>; }\n",
  );
  assert.equal(grids(report.findings).length, 1);
});

test("a horizontal bar chart may keep vertical lines", () => {
  const report = audit(
    "Wide.tsx",
    "export function Wide() { return <BarChart layout=\"vertical\"><CartesianGrid /><Bar dataKey=\"n\" /></BarChart>; }\n",
  );
  assert.equal(grids(report.findings).length, 0);
});

test("a scatter plot may keep both grid directions", () => {
  const report = audit(
    "Dots.tsx",
    "export function Dots() { return <ScatterChart><CartesianGrid /><Scatter data={rows} /></ScatterChart>; }\n",
  );
  assert.equal(grids(report.findings).length, 0);
});

test("ads-audit-ignore skips one grid", () => {
  const report = audit(
    "Skip.tsx",
    "export function Skip() { return <BarChart><CartesianGrid /> {/* ads-audit-ignore */}</BarChart>; }\n",
  );
  assert.equal(grids(report.findings).length, 0);
});
