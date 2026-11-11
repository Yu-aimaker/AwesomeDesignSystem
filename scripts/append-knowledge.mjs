#!/usr/bin/env node
// Append discover.json candidates onto the Knowledge ledgers. Exits 1 when a
// ledger is missing or the discover file says the collection was partial.
import { readFileSync, writeFileSync } from "node:fs";
import { appendLedger, splitCandidates } from "./lib/knowledge-append.mjs";

function arg(name) {
  const index = process.argv.indexOf(name);
  return index === -1 ? "" : process.argv[index + 1] ?? "";
}

const discoverPath = arg("--discover");
const discover = JSON.parse(readFileSync(discoverPath, "utf8"));
if (discover.partial || discover.failed) {
  console.error("append-knowledge: discovery was partial; refusing to append");
  process.exit(1);
}
const today = new Date().toISOString().slice(0, 10);
const fresh = Array.isArray(discover.fresh) ? discover.fresh : [];
const { oss, sites } = splitCandidates(fresh);
const files = [
  ["Knowledge/research/oss-candidates.md", oss],
  ["Knowledge/research/site-candidates.md", sites],
];
let added = 0;
for (const [path, rows] of files) {
  const current = readFileSync(path, "utf8");
  const next = appendLedger(current, rows, today);
  if (next.refused) console.error(`append-knowledge: withheld ${next.refused} rows from ${path}`);
  if (next.markdown !== current) writeFileSync(path, next.markdown);
  added += next.added;
}
console.log(`append-knowledge: added ${added}`);
