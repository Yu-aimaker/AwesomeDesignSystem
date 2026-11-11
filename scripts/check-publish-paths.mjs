#!/usr/bin/env node
// Fail when the weekly diff touches anything outside Knowledge, Reference,
// and the generated plugin Knowledge mirror.
import { execFileSync } from "node:child_process";
import { publishPathProblems } from "./lib/growth.mjs";

function arg(name, fallback) {
  const index = process.argv.indexOf(name);
  return index === -1 ? fallback : process.argv[index + 1];
}

function gitLines(args) {
  let text;
  try {
    text = execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  } catch {
    console.error("check-publish-paths: could not list the diff");
    process.exit(1);
  }
  return text.split("\n").filter(Boolean);
}

const ref = arg("--git", "origin/main");
const changed = [...new Set([
  ...gitLines(["diff", "--name-only", ref]),
  ...gitLines(["diff", "--name-only", "--cached", ref]),
  ...gitLines(["ls-files", "--others", "--exclude-standard"]),
])];
const problems = publishPathProblems(changed);
if (problems.length) {
  console.error("check-publish-paths: refusing paths outside Knowledge and Reference");
  for (const path of problems) console.error(`  ${path}`);
  process.exit(1);
}
console.log(`check-publish-paths: ${changed.length} paths`);
