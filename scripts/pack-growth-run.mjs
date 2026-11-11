#!/usr/bin/env node
// Always write a sanitized pack summary. Archive only files that exist and
// do not contain leaked secrets. Exit 0 so a missing file does not hide the
// step that actually failed.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { leakageFindings } from "./lib/redact.mjs";

const EXPECTED = [
  "AwesomeDS/data",
  "Plugin/awesome-ds/ds/data",
  ".growth/guard.json",
  ".growth/discover.json",
  ".growth/ogp-probe.json",
  ".growth/report.md",
];

function walk(path, out = []) {
  if (!existsSync(path)) return out;
  const stat = statSync(path);
  if (stat.isFile()) {
    out.push(path);
    return out;
  }
  if (!stat.isDirectory()) return out;
  for (const name of readdirSync(path)) walk(join(path, name), out);
  return out;
}

export function packPlan(present) {
  const have = new Set(present);
  return {
    complete: EXPECTED.every((path) => have.has(path)),
    present: EXPECTED.filter((path) => have.has(path)),
    missing: EXPECTED.filter((path) => !have.has(path)),
    excluded: [],
  };
}

function leaked(path) {
  const files = walk(path).filter((file) => statSync(file).isFile() && statSync(file).size < 2_000_000);
  for (const file of files) {
    if (!/\.(json|md|txt)$/i.test(file)) continue;
    try {
      if (leakageFindings(readFileSync(file, "utf8")).length) return true;
    } catch {
      return true;
    }
  }
  return false;
}

const present = EXPECTED.filter((path) => existsSync(path));
const plan = packPlan(present);
const safe = [];
for (const path of plan.present) {
  if (leaked(path)) plan.excluded.push(path);
  else safe.push(path);
}
plan.complete = plan.complete && plan.excluded.length === 0;
const summary = {
  complete: plan.complete,
  present: safe,
  missing: plan.missing,
  excluded: plan.excluded,
};
mkdirSync(".growth", { recursive: true });
writeFileSync(".growth/pack-summary.json", JSON.stringify(summary, null, 2) + "\n");
console.log(`pack-growth-run: complete=${summary.complete} files=${safe.length} missing=${summary.missing.length} excluded=${summary.excluded.length}`);
if (!safe.length) process.exit(0);
try {
  execFileSync("tar", ["-czf", "growth-payload.tgz", ...safe], { stdio: "pipe" });
} catch {
  console.error("pack-growth-run: archive skipped");
}
process.exit(0);
