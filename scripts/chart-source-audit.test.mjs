// Sir 2026-10-11: charts were hard to read. A figure with no source is one case.
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
  const dir = mkdtempSync(join(tmpdir(), "ads-source-"));
  writeFileSync(join(dir, name), body);
  const out = execFileSync(process.execPath, [AUDIT, dir, "--json"], { encoding: "utf8" });
  return JSON.parse(out);
}

function hits(findings) {
  return findings.filter((f) => f.rule === "chart-source");
}

test("a bar chart with no footer source is chart-source", () => {
  const report = audit(
    "Bars.tsx",
    [
      "export function Bars() {",
      "  return (",
      "    <BarChart data={rows}>",
      "      <Bar dataKey=\"n\" />",
      "    </BarChart>",
      "  );",
      "}",
      "",
    ].join("\n"),
  );
  const hit = hits(report.findings);
  assert.equal(hit.length, 1);
  assert.equal(hit[0].sev, 2);
  assert.equal(hit[0].line, 3);
});

test("a line chart with 出典 and a URL under it is allowed", () => {
  const report = audit(
    "Trend.tsx",
    [
      "export function Trend() {",
      "  return (",
      "    <LineChart data={rows}>",
      "      <Line dataKey=\"a\" />",
      "    </LineChart>",
      "    <p>出典: 総務省 <a href=\"https://www.stat.go.jp/\">統計</a></p>",
      "  );",
      "}",
      "",
    ].join("\n"),
  );
  assert.equal(hits(report.findings).length, 0);
});

test("an English source label and URL under an area chart is allowed", () => {
  const report = audit(
    "Area.tsx",
    "export function AreaView() { return (<><AreaChart><Area dataKey=\"a\" /></AreaChart><p>Source: OECD https://www.oecd.org/</p></>); }\n",
  );
  assert.equal(hits(report.findings).length, 0);
});

test("a source name without a URL is chart-source", () => {
  const report = audit(
    "Named.tsx",
    "export function Named() { return (<><PieChart><Pie data={rows} /></PieChart><p>出典: 内閣府</p></>); }\n",
  );
  assert.equal(hits(report.findings).length, 1);
});

test("a URL without a source name is chart-source", () => {
  const report = audit(
    "Link.tsx",
    "export function Link() { return (<><ComposedChart><Bar dataKey=\"n\" /></ComposedChart><a href=\"https://example.com/\">詳細</a></>); }\n",
  );
  assert.equal(hits(report.findings).length, 1);
});

test("a source more than 12 lines under the chart is chart-source", () => {
  const gap = Array.from({ length: 13 }, () => "      <p>注</p>").join("\n");
  const report = audit(
    "Far.tsx",
    [
      "export function Far() {",
      "  return (",
      "    <BarChart><Bar dataKey=\"n\" /></BarChart>",
      gap,
      "    <p>出典: 総務省 https://www.stat.go.jp/</p>",
      "  );",
      "}",
      "",
    ].join("\n"),
  );
  assert.equal(hits(report.findings).length, 1);
});

test("two charts report only the one missing a source", () => {
  const report = audit(
    "Pair.tsx",
    [
      "export function Pair() {",
      "  return (",
      "    <>",
      "      <BarChart><Bar dataKey=\"n\" /></BarChart>",
      "      <LineChart><Line dataKey=\"a\" /></LineChart>",
      "      <p>出典: 総務省 https://www.stat.go.jp/</p>",
      "    </>",
      "  );",
      "}",
      "",
    ].join("\n"),
  );
  const hit = hits(report.findings);
  assert.equal(hit.length, 1);
  assert.equal(hit[0].line, 4);
});

test("ads-audit-ignore on the chart skips it", () => {
  const report = audit(
    "Skip.tsx",
    "export function Skip() { return <PieChart>{/* ads-audit-ignore */}</PieChart>; }\n",
  );
  assert.equal(hits(report.findings).length, 0);
});

test("a file with no chart is quiet", () => {
  const report = audit("Quiet.tsx", "export function Quiet() { return <p>出典なし</p>; }\n");
  assert.equal(hits(report.findings).length, 0);
});
