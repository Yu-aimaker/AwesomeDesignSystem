#!/usr/bin/env node
// Fails when a tracked file carries a path from someone's machine: an agent scratchpad
// (/tmp/claude-...), a home folder (/home/<user>/, /Users/<user>/), a sandbox workspace
// (/workspace/), or a session-id (UUID) folder. These are not secrets, but they name a
// local setup and do not belong in a public repository. URLs are skipped, so a CDN path
// with a UUID in it is fine. Run: node scripts/check-local-paths.mjs
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// The left edge keeps "example.com/home/x" (a URL path without a scheme) from matching.
const EDGE = String.raw`(?:^|[\s"'\`(=:,\[{<])`;
const UUID = String.raw`[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}`;
export const RULES = [
  { id: "agent-scratchpad", re: new RegExp(String.raw`/tmp/claude-`) },
  { id: "home-folder", re: new RegExp(`${EDGE}~?/home/[A-Za-z0-9_.-]+/`) },
  { id: "home-folder", re: new RegExp(`${EDGE}/home/(?:box|user)\\b`) },
  { id: "home-folder", re: new RegExp(`${EDGE}/Users/[A-Za-z0-9_.-]+/`) },
  { id: "sandbox-workspace", re: new RegExp(`${EDGE}/workspace/`) },
  { id: "session-path", re: new RegExp(`/${UUID}(?:/|\\b)`) },
];
const URL_RE = /[A-Za-z][A-Za-z0-9+.-]*:\/\/[^\s"'`)<>\]]+/g;
// This checker and its test name the patterns on purpose.
const SKIP = new Set(["scripts/check-local-paths.mjs", "scripts/check-local-paths.test.mjs"]);
const BINARY = /\.(png|jpe?g|gif|webp|avif|ico|woff2?|ttf|otf|pdf|zip|gz|mp4|webm|lottie)$/i;

/** Findings in one file's text: [{ line, rule, text }]. */
export function findLocalPaths(text) {
  const out = [];
  text.split(/\r?\n/).forEach((raw, i) => {
    const line = raw.replace(URL_RE, "");
    for (const r of RULES) {
      const m = line.match(r.re);
      if (m) {
        out.push({ line: i + 1, rule: r.id, text: m[0].trim() });
        break;
      }
    }
  });
  return out;
}

export function trackedFiles(cwd = root) {
  return execFileSync("git", ["ls-files", "-z"], { cwd, encoding: "utf8" }).split("\0").filter(Boolean);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const bad = [];
  for (const f of trackedFiles()) {
    if (SKIP.has(f) || BINARY.test(f)) continue;
    let text;
    try {
      text = readFileSync(join(root, f), "utf8");
    } catch {
      continue;
    }
    for (const h of findLocalPaths(text)) bad.push(`${f}:${h.line} ${h.rule} ${h.text}`);
  }
  if (bad.length) {
    console.error(`check-local-paths: ${bad.length} local path(s) in tracked files\n  ${bad.join("\n  ")}`);
    process.exit(1);
  }
  console.log("check-local-paths: no local paths in tracked files");
}
