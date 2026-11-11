#!/usr/bin/env node
// Print propose | dry-run | noop | fail. Exit 1 only for fail.
// node scripts/weekly-growth-decide.mjs --guard guard.json --dry-run true --discover discover.json
import { appendFileSync, readFileSync } from "node:fs";
import { decide, foreignAuthors } from "./lib/growth.mjs";

function arg(name, fallback = "") {
  const i = process.argv.indexOf(name);
  return i === -1 ? fallback : process.argv[i + 1];
}

const guard = JSON.parse(readFileSync(arg("--guard"), "utf8"));
let discovery = null;
const discoverPath = arg("--discover", "");
if (discoverPath) {
  try {
    const doc = JSON.parse(readFileSync(discoverPath, "utf8"));
    discovery = {
      partial: Boolean(doc.partial || doc.failed),
      failed: Boolean(doc.failed),
      fresh: Array.isArray(doc.fresh) ? doc.fresh.length : 0,
    };
  } catch {
    discovery = { partial: true, failed: true, fresh: 0 };
  }
}
let authors = [];
const authorsPath = arg("--authors-file", "");
if (authorsPath) {
  try {
    const parsed = JSON.parse(readFileSync(authorsPath, "utf8"));
    authors = Array.isArray(parsed) ? parsed : [];
  } catch {
    authors = ["unreadable"];
  }
} else if (arg("--authors", "")) {
  authors = arg("--authors", "").split(",").map((item) => item.trim()).filter(Boolean);
}
const result = decide({
  guard,
  dryRun: arg("--dry-run", "true"),
  humanAuthors: foreignAuthors(authors),
  discovery,
});
const output = process.env.GITHUB_OUTPUT;
if (output) appendFileSync(output, `action=${result.action}\nreason=${result.reason}\n`);
console.log(result.action);
process.exit(result.action === "fail" ? 1 : 0);
