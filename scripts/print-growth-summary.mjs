#!/usr/bin/env node
// Print a step summary or a pull request body. Withholds the report when it leaks.
import { appendFileSync, readFileSync, writeFileSync } from "node:fs";
import { leakageFindings } from "./lib/redact.mjs";

function arg(name) {
  const index = process.argv.indexOf(name);
  return index === -1 ? "" : process.argv[index + 1] ?? "";
}

let body = "レポートはありません。";
try {
  const text = readFileSync(".growth/report.md", "utf8");
  body = leakageFindings(text).length ? "レポートは公開できません。" : text.trim();
} catch {
  body = "レポートはありません。";
}
const action = process.env.ACTION || "";
const dryRun = process.env.DRY_RUN || "";
const summary = ["## 週次更新", "", `- action: ${action}`, `- dry_run: ${dryRun}`, "", body, ""].join("\n");
const out = arg("--out");
if (out) writeFileSync(out, summary);
else if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
else process.stdout.write(summary);
