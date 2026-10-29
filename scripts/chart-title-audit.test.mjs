// Charts were hard to read. A title that only names the columns is one case.
// Source: https://www.datawrapper.de/academy/annotate-tab (opened 2026-10-14).
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
  const dir = mkdtempSync(join(tmpdir(), "ads-title-"));
  writeFileSync(join(dir, name), body);
  const out = execFileSync(process.execPath, [AUDIT, dir, "--json"], { encoding: "utf8" });
  return JSON.parse(out);
}

function hits(findings) {
  return findings.filter((f) => f.rule === "column-title");
}

test("a heading that is the column plus の推移 is column-title", () => {
  const report = audit(
    "Trend.tsx",
    [
      "export function Trend() {",
      "  return (",
      "    <section>",
      "      <h2>入金の推移</h2>",
      "      <LineChart data={rows}>",
      "        <Line dataKey=\"入金\" />",
      "      </LineChart>",
      "    </section>",
      "  );",
      "}",
      "",
    ].join("\n"),
  );
  const hit = hits(report.findings);
  assert.equal(hit.length, 1);
  assert.equal(hit[0].sev, 2);
  assert.equal(hit[0].line, 5);
});

test("a claim in the heading is allowed", () => {
  const report = audit(
    "Claim.tsx",
    [
      "export function Claim() {",
      "  return (",
      "    <h2>3月の入金は前年の2倍</h2>",
      "    <LineChart>",
      "      <Line dataKey=\"入金\" />",
      "    </LineChart>",
      "  );",
      "}",
      "",
    ].join("\n"),
  );
  assert.equal(hits(report.findings).length, 0);
});

test("title on the chart tag that equals dataKey is column-title", () => {
  const report = audit(
    "Tag.tsx",
    "export function Tag() { return <BarChart title=\"revenue\"><Bar dataKey=\"revenue\" /></BarChart>; }\n",
  );
  assert.equal(hits(report.findings).length, 1);
});

test("a chart with no title is not column-title", () => {
  const report = audit(
    "Bare.tsx",
    "export function Bare() { return <LineChart><Line dataKey=\"入金\" /></LineChart>; }\n",
  );
  assert.equal(hits(report.findings).length, 0);
});

test("two column names joined with と is column-title", () => {
  const report = audit(
    "Pair.tsx",
    [
      "export function Pair() {",
      "  return (",
      "    <h2>入金と支出</h2>",
      "    <ComposedChart>",
      "      <Bar dataKey=\"入金\" />",
      "      <Line dataKey=\"支出\" />",
      "    </ComposedChart>",
      "  );",
      "}",
      "",
    ].join("\n"),
  );
  assert.equal(hits(report.findings).length, 1);
});

test("a pie title that is the slice name plus の内訳 is column-title", () => {
  const report = audit(
    "Share.tsx",
    "export function Share() { return <PieChart title=\"入金の内訳\"><Pie data={[{ name: \"入金\" }]} /></PieChart>; }\n",
  );
  assert.equal(hits(report.findings).length, 1);
});

test("english over time suffix is column-title", () => {
  const report = audit(
    "En.tsx",
    "export function En() { return <AreaChart aria-label=\"revenue over time\"><Area dataKey=\"revenue\" /></AreaChart>; }\n",
  );
  assert.equal(hits(report.findings).length, 1);
});

test("ads-audit-ignore on the opening tag skips the chart", () => {
  const report = audit(
    "Skip.tsx",
    [
      "export function Skip() {",
      "  return (",
      "    <h2>入金の推移</h2>",
      "    <LineChart> {/* ads-audit-ignore */}",
      "      <Line dataKey=\"入金\" />",
      "    </LineChart>",
      "  );",
      "}",
      "",
    ].join("\n"),
  );
  assert.equal(hits(report.findings).length, 0);
});

test("a heading more than 8 lines above is not this finding", () => {
  const gap = Array.from({ length: 9 }, () => "      <span />").join("\n");
  const report = audit(
    "Far.tsx",
    ["export function Far() {", "  return (", "    <h2>入金の推移</h2>", gap, "    <LineChart>", "      <Line dataKey=\"入金\" />", "    </LineChart>", "  );", "}", ""].join("\n"),
  );
  assert.equal(hits(report.findings).length, 0);
});
