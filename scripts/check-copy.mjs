#!/usr/bin/env node
// Flags generated-copy tells in web/src/i18n/messages.
// Keys whose names contain "bad" or "before" are the intentional counterexamples
// on /anti-slop, /report, and /slides, so they are skipped.
// Rules match foundations/content-and-tone.md. Sentence length is not checked
// here: UI stays at 60 characters and long form at 100, and both need a human pass.
// Run: node scripts/check-copy.mjs
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const MESSAGES = join(root, "web/src/i18n/messages");

const RULES = [
  { id: "empty-ability", re: /ことができます/ },
  { id: "forbidden-ja", re: /シームレス|革新的|次世代|を実現/ },
  { id: "forbidden-en", re: /\b(?:unleash|seamless|elevate|empower)\b/i },
  { id: "em-dash", re: /—/ },
  { id: "exclamation", re: /[!！]/ },
];

const STRING_RE =
  /(?:(\w+)\s*:\s*)?(?:"((?:\\.|[^"\\])*)"|'((?:\\.|[^'\\])*)'|`((?:\\.|[^`\\])*)`)/g;

export function isCounterexampleKey(key) {
  const name = key || "";
  const re = /(?:^|(?<=[^A-Za-z])|(?<=[a-z]))(?:bad|Bad|before|Before)(?![a-z])/;
  return re.test(name);
}

function unescapeString(text) {
  return text.replace(/\\(["'\\])/g, "$1");
}

function matchIsQuoted(text, index, length) {
  const before = text.slice(0, index);
  const openJa = before.lastIndexOf("「");
  const closeJa = before.lastIndexOf("」");
  if (openJa > closeJa && text.indexOf("」", index + length) !== -1) return true;
  let quote = false;
  for (let i = 0; i < index; i += 1) {
    if (text[i] === '"') quote = !quote;
  }
  if (!quote) return false;
  return text.indexOf('"', index + length) !== -1;
}

export function findingsInSource(source, file = "fixture") {
  const findings = [];
  let key = "";
  for (const match of source.matchAll(STRING_RE)) {
    if (match[1]) key = match[1];
    const raw = match[2] ?? match[3] ?? match[4] ?? "";
    const text = unescapeString(raw);
    if (!text || isCounterexampleKey(key)) continue;
    for (const rule of RULES) {
      rule.re.lastIndex = 0;
      const hit = rule.re.exec(text);
      if (hit && !matchIsQuoted(text, hit.index, hit[0].length)) {
        findings.push({ file, key, rule: rule.id, text });
      }
    }
  }
  return findings;
}

function walk(dir) {
  const files = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) files.push(...walk(path));
    else if (name.endsWith(".ts")) files.push(path);
  }
  return files;
}

export function findingsInMessages(dir = MESSAGES) {
  const findings = [];
  for (const file of walk(dir)) {
    findings.push(...findingsInSource(readFileSync(file, "utf8"), file));
  }
  return findings;
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  const findings = findingsInMessages();
  if (findings.length === 0) {
    console.log("check-copy: 0 tells in web/src/i18n/messages");
  } else {
    for (const f of findings) {
      console.error(`${f.rule}\t${f.key}\t${f.file}\t${f.text}`);
    }
    process.exit(1);
  }
}
