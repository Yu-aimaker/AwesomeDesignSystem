#!/usr/bin/env node
// PostToolUse hook: audit the one UI file Claude just wrote, and return S1/S2 findings as
// additionalContext so Claude fixes them in the same turn. Never blocks, never fails the tool:
// any error or an out-of-scope file ends with exit 0 and no output.
// Off switch: AWESOME_DS_HOOK=off. Reuses skills/design-verifier/scripts/static-audit.mjs.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, extname, join, sep } from "node:path";
import { fileURLToPath } from "node:url";

const UI_EXT = new Set([".css", ".scss", ".html", ".tsx", ".jsx", ".vue", ".svelte", ".astro"]);
const SKIP_DIR = /[\\/](node_modules|dist|build|\.next|out|coverage|design-review)[\\/]/;
const MAX_LINES = 8;
const here = dirname(fileURLToPath(import.meta.url));
const AUDIT = join(here, "..", "skills", "design-verifier", "scripts", "static-audit.mjs");

export function inScope(file) {
  if (!file || !UI_EXT.has(extname(file))) return false;
  if (SKIP_DIR.test(file)) return false;
  // The plugin's own files (ds/ copy, templates) are reference material, not the user's UI.
  if (file.startsWith(join(here, "..") + sep)) return false;
  return existsSync(file);
}

export function summarize(file, report) {
  const top = report.findings.filter((f) => f.sev <= 2);
  if (!top.length) return null;
  const lines = top.slice(0, MAX_LINES).map((f) => `- S${f.sev} ${f.rule} line ${f.line}: ${f.text}\n  fix: ${f.fix}`);
  const more = top.length > MAX_LINES ? `\n(+${top.length - MAX_LINES} more; run the design-verifier static audit for the full list)` : "";
  return `AwesomeDS static audit of ${file}: ${top.length} S1/S2 finding(s). Fix them now unless the user asked otherwise.\n${lines.join("\n")}${more}`;
}

function main() {
  if (process.env.AWESOME_DS_HOOK === "off") return;
  let input;
  try {
    input = JSON.parse(readFileSync(0, "utf8"));
  } catch {
    return;
  }
  const file = input?.tool_input?.file_path;
  if (!inScope(file)) return;
  let out;
  try {
    out = execFileSync(process.execPath, [AUDIT, file, "--json"], { encoding: "utf8", timeout: 10000 });
  } catch (err) {
    // static-audit exits 1 when it finds S1 issues; its JSON is still on stdout.
    out = err?.stdout;
  }
  let report;
  try {
    report = JSON.parse(out);
  } catch {
    return;
  }
  const text = summarize(file, report);
  if (!text) return;
  process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: "PostToolUse", additionalContext: text } }));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    main();
  } catch {
    // Advisory hook: swallow everything.
  }
  process.exit(0);
}
