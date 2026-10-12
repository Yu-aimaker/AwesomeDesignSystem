#!/usr/bin/env node
// Print propose | dry-run | noop | fail. Exit 1 only for fail.
// node scripts/weekly-growth-decide.mjs --guard guard.json --dry-run true --authors a@b.c
import { appendFileSync, readFileSync } from "node:fs";
import { decide, foreignAuthors } from "./lib/growth.mjs";

function arg(name, fallback = "") {
  const i = process.argv.indexOf(name);
  return i === -1 ? fallback : process.argv[i + 1];
}

const guard = JSON.parse(readFileSync(arg("--guard"), "utf8"));
const result = decide({
  guard,
  dryRun: arg("--dry-run", "true"),
  humanAuthors: foreignAuthors(arg("--authors", "").split(",").map((s) => s.trim()).filter(Boolean)),
});
const output = process.env.GITHUB_OUTPUT;
if (output) appendFileSync(output, `action=${result.action}\nreason=${result.reason}\n`);
console.log(result.action);
process.exit(result.action === "fail" ? 1 : 0);
