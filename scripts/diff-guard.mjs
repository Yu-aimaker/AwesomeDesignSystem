#!/usr/bin/env node
// Compare the working tree with a git ref. Exit 1 when the weekly guard fails.
// Run: node scripts/diff-guard.mjs --git origin/main --out guard.json
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { diffGuard } from "./lib/growth.mjs";

function arg(name, fallback) {
  const i = process.argv.indexOf(name);
  return i === -1 ? fallback : process.argv[i + 1];
}

function gitJson(ref, path) {
  try {
    return JSON.parse(execFileSync("git", ["show", `${ref}:${path}`], { encoding: "utf8" }));
  } catch {
    return null;
  }
}

const ref = arg("--git", "origin/main");
const base = {
  repos: gitJson(ref, "AwesomeDS/data/repos.json") ?? { repos: [] },
  brands: gitJson(ref, "AwesomeDS/data/brands.json") ?? { brands: [] },
  candidates: gitJson(ref, "AwesomeDS/data/candidates.json") ?? { candidates: [] },
  curated: gitJson(ref, "AwesomeDS/data/sources/curated-repos.json") ?? {},
};
const read = (path, empty) => (existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : empty);
const head = {
  repos: read("AwesomeDS/data/repos.json", { repos: [] }),
  brands: read("AwesomeDS/data/brands.json", { brands: [] }),
  candidates: read("AwesomeDS/data/candidates.json", { candidates: [] }),
  curated: read("AwesomeDS/data/sources/curated-repos.json", {}),
};
let changedPaths = [];
try {
  changedPaths = execFileSync("git", ["diff", "--name-only", ref], { encoding: "utf8" }).split("\n").filter(Boolean);
} catch {
  changedPaths = [];
}
const fileBytes = {};
for (const path of changedPaths) {
  if (existsSync(path) && statSync(path).isFile()) fileBytes[path] = statSync(path).size;
}
const guard = diffGuard({
  base,
  head,
  changedPaths,
  fileBytes,
  fetchErrors: head.repos?.meta?.fetchErrors ?? [],
});
const out = arg("--out", "");
if (out) writeFileSync(out, JSON.stringify(guard, null, 2) + "\n");
console.log(JSON.stringify({ ok: guard.ok, meaningful: guard.meaningful, reasons: guard.reasons, stats: guard.stats }, null, 2));
process.exit(guard.ok ? 0 : 1);
