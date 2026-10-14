// Sir 2026-10-11: charts were hard to read. More than seven category colors is one case.
// Source: https://blog.datawrapper.de/colors/ (opened 2026-10-14).
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
  const dir = mkdtempSync(join(tmpdir(), "ads-colors-"));
  writeFileSync(join(dir, name), body);
  const out = execFileSync(process.execPath, [AUDIT, dir, "--json"], { encoding: "utf8" });
  return JSON.parse(out);
}

function hits(findings) {
  return findings.filter((f) => f.rule === "too-many-colors");
}

function lines(n, tag) {
  return Array.from({ length: n }, (_, i) => `      <${tag} dataKey="s${i + 1}" />`).join("\n");
}

test("eight line series is too-many-colors", () => {
  const report = audit(
    "Trend.tsx",
    ["export function Trend() {", "  return (", "    <LineChart data={rows}>", lines(8, "Line"), "    </LineChart>", "  );", "}", ""].join("\n"),
  );
  const hit = hits(report.findings);
  assert.equal(hit.length, 1);
  assert.equal(hit[0].sev, 2);
  assert.equal(hit[0].line, 3);
});

test("seven line series is allowed", () => {
  const report = audit(
    "Seven.tsx",
    ["export function Seven() {", "  return (", "    <LineChart>", lines(7, "Line"), "    </LineChart>", "  );", "}", ""].join("\n"),
  );
  assert.equal(hits(report.findings).length, 0);
});

test("eight bar series is too-many-colors", () => {
  const report = audit(
    "Bars.tsx",
    ["export function Bars() {", "  return <BarChart>", lines(8, "Bar"), "  </BarChart>;", "}", ""].join("\n"),
  );
  assert.equal(hits(report.findings).length, 1);
});

test("one bar color across eight rows is allowed", () => {
  const rows = Array.from({ length: 8 }, (_, i) => `{ n: ${i} }`).join(", ");
  const report = audit(
    "One.tsx",
    `export function One() { return <BarChart data={[${rows}]}><Bar dataKey="n" /></BarChart>; }\n`,
  );
  assert.equal(hits(report.findings).length, 0);
});

test("eight area series is too-many-colors", () => {
  const report = audit(
    "Areas.tsx",
    ["export function Areas() {", "  return <AreaChart>", lines(8, "Area"), "  </AreaChart>;", "}", ""].join("\n"),
  );
  assert.equal(hits(report.findings).length, 1);
});

test("a composed chart with eight marks is too-many-colors", () => {
  const report = audit(
    "Mix.tsx",
    ["export function Mix() {", "  return (", "    <ComposedChart>", lines(4, "Bar"), lines(4, "Line"), "    </ComposedChart>", "  );", "}", ""].join("\n"),
  );
  assert.equal(hits(report.findings).length, 1);
});

test("a pie with eight literal slices is too-many-colors", () => {
  const slices = Array.from({ length: 8 }, (_, i) => `{ name: "s${i}" }`).join(", ");
  const report = audit(
    "Share.tsx",
    `export function Share() { return <PieChart><Pie data={[${slices}]} /></PieChart>; }\n`,
  );
  assert.equal(hits(report.findings).length, 1);
});

test("a pie with eight Cell marks is too-many-colors", () => {
  const cells = Array.from({ length: 8 }, () => "<Cell />").join("");
  const report = audit(
    "Cells.tsx",
    `export function Cells() { return <PieChart><Pie data={rows}>${cells}</Pie></PieChart>; }\n`,
  );
  assert.equal(hits(report.findings).length, 1);
});

test("a pie whose data is a variable is not counted", () => {
  const report = audit(
    "Unknown.tsx",
    "export function Unknown() { return <PieChart><Pie data={rows} /></PieChart>; }\n",
  );
  assert.equal(hits(report.findings).length, 0);
});

test("ads-audit-ignore on the opening tag skips the chart", () => {
  const report = audit(
    "Skip.tsx",
    ["export function Skip() {", "  return (", "    <LineChart> {/* ads-audit-ignore */}", lines(8, "Line"), "    </LineChart>", "  );", "}", ""].join("\n"),
  );
  assert.equal(hits(report.findings).length, 0);
});
