#!/usr/bin/env node
// Write .growth/report.md from the guard and the discover file. Refuses leaked text.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { renderReport } from "./lib/growth.mjs";
import { assertClean } from "./lib/redact.mjs";

mkdirSync(".growth", { recursive: true });
const guard = JSON.parse(readFileSync(".growth/guard.json", "utf8"));
let excluded = {};
let fresh = [];
try {
  const discovered = JSON.parse(readFileSync(".growth/discover.json", "utf8"));
  excluded = discovered.excluded ?? {};
  fresh = discovered.fresh ?? [];
} catch {
  excluded = {};
  fresh = [];
}
const date = new Date().toISOString().slice(0, 10);
const report = assertClean(renderReport({ date, guard, excluded, newCandidates: fresh }), "report");
writeFileSync(".growth/report.md", report.endsWith("\n") ? report : `${report}\n`);
console.log("write-growth-report: wrote .growth/report.md");
