#!/usr/bin/env node
// Write author records for a commit range. Prints the count only, never an address.
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { authorFromLog } from "./lib/growth.mjs";
import { lookupCommitTrust } from "./lib/github-trust.mjs";

function arg(name) {
  const index = process.argv.indexOf(name);
  return index === -1 ? "" : process.argv[index + 1] ?? "";
}

const base = arg("--base");
const head = arg("--head");
const out = arg("--out");
if (!base || !head || !out) {
  console.error("collect-commit-authors: missing base, head, or out");
  process.exit(1);
}
let raw = "";
try {
  raw = execFileSync("git", ["log", "--format=%H%x1f%an%x1f%ae%x1f%cn%x1f%ce%x1f%B%x1e", `${base}..${head}`], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
} catch {
  console.error("collect-commit-authors: missing range");
  process.exit(1);
}
const authors = raw.split("\x1e").map((chunk) => chunk.trim()).filter(Boolean).map((chunk) => {
  const [sha, authorName, authorEmail, committerName, committerEmail, body] = chunk.split("\x1f");
  const record = authorFromLog({ authorName, authorEmail, committerName, committerEmail, body });
  const trust = lookupCommitTrust(sha);
  return { ...record, login: trust.login, association: trust.association };
});
writeFileSync(out, JSON.stringify(authors));
console.log(`collect-commit-authors: ${authors.length}`);
