#!/usr/bin/env node
// Validates every Knowledge/**/*.md file (except README.md) against the contract
// described in CONTRIBUTING.md: frontmatter shape, required section headings,
// no em dash in the body, no duplicate titles, and well-formed source URLs.
// Run: node scripts/validate-knowledge.mjs
// Exits 1 and prints a readable list of problems if anything fails.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const knowledgeDir = join(root, "Knowledge");

const VALID_TYPES = ["repo", "library", "skill", "article", "product", "guideline", "design-system"];
const REQUIRED_HEADINGS = ["## 概要", "## 要点", "## AwesomeDS への反映", "## 出典"];
const EM_DASH = "—";
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (name.endsWith(".md") && name !== "README.md") out.push(p);
  }
  return out;
}

// Minimal YAML frontmatter parser for the fixed shape used in this repo
// (same contract as scripts/build-reference.mjs), kept intentionally strict
// about what it accepts so malformed frontmatter surfaces as an error rather
// than being silently coerced.
function parseFrontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { fm: null, body: text, raw: null };
  const raw = m[1];
  const body = text.slice(m[0].length);
  const fm = { sources: [], tags: [] };
  const lines = raw.split(/\r?\n/);
  let cur = null;
  for (const line of lines) {
    let mm;
    if ((mm = line.match(/^([A-Za-z_]+):\s*(.*)$/))) {
      const [, key, value] = mm;
      cur = key;
      if (key === "sources") continue;
      if (key === "tags") {
        fm.tagsRaw = value;
        fm.tags = value
          .replace(/^\[|\]$/g, "")
          .split(",")
          .map((s) => s.trim().replace(/^["']|["']$/g, ""))
          .filter(Boolean);
        continue;
      }
      fm[key] = value.trim().replace(/^["']|["']$/g, "");
      continue;
    }
    if ((mm = line.match(/^\s+-\s+url:\s*(.*)$/)) && cur === "sources") {
      fm.sources.push({ url: mm[1].trim().replace(/^["']|["']$/g, ""), title: null });
      continue;
    }
    if ((mm = line.match(/^\s+title:\s*(.*)$/)) && cur === "sources" && fm.sources.length) {
      fm.sources[fm.sources.length - 1].title = mm[1].trim().replace(/^["']|["']$/g, "");
      continue;
    }
    if ((mm = line.match(/^\s+-\s+(.*)$/)) && cur === "tags") {
      fm.tags.push(mm[1].trim().replace(/^["']|["']$/g, ""));
    }
  }
  return { fm, body, raw };
}

function isWellFormedUrl(u) {
  if (typeof u !== "string" || !u) return false;
  try {
    const parsed = new URL(u);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function validateFile(file) {
  const problems = [];
  const rel = relative(root, file);
  const text = readFileSync(file, "utf8");
  const { fm, body, raw } = parseFrontmatter(text);

  if (!fm) {
    problems.push("frontmatter がありません（--- ... --- が見つかりません）");
    return { rel, problems, title: null };
  }

  // title
  if (typeof fm.title !== "string" || fm.title.length === 0) {
    problems.push("title が文字列で存在する必要があります");
  }

  // category
  const expectedCategory = basename(dirname(file));
  if (typeof fm.category !== "string" || fm.category.length === 0) {
    problems.push("category が存在する必要があります");
  } else if (fm.category !== expectedCategory) {
    problems.push(`category (\"${fm.category}\") がフォルダ名 (\"${expectedCategory}\") と一致しません`);
  }

  // type
  if (typeof fm.type !== "string" || !VALID_TYPES.includes(fm.type)) {
    problems.push(`type は次のいずれかである必要があります: ${VALID_TYPES.join(" | ")} (実際: ${fm.type ?? "なし"})`);
  }

  // sources
  if (!Array.isArray(fm.sources) || fm.sources.length === 0) {
    problems.push("sources が少なくとも 1 件必要です");
  } else {
    fm.sources.forEach((s, i) => {
      if (!isWellFormedUrl(s.url)) {
        problems.push(`sources[${i}].url が http(s) の正しい URL ではありません: ${s.url ?? "(なし)"}`);
      }
      if (typeof s.title !== "string" || s.title.length === 0) {
        problems.push(`sources[${i}].title が存在する必要があります`);
      }
    });
  }

  // tags
  if (!Array.isArray(fm.tags) || fm.tags.length === 0) {
    problems.push("tags が配列で、少なくとも 1 件必要です");
  }

  // updated
  if (typeof fm.updated !== "string" || !DATE_RE.test(fm.updated)) {
    problems.push(`updated は YYYY-MM-DD 形式である必要があります (実際: ${fm.updated ?? "なし"})`);
  }

  // required section headings
  for (const heading of REQUIRED_HEADINGS) {
    if (!body.includes(heading)) {
      problems.push(`必須の見出しがありません: ${heading}`);
    }
  }

  // em dash anywhere in the body (frontmatter is exempt: source titles may
  // legitimately quote an upstream name, but the written body must not use it)
  if (body.includes(EM_DASH)) {
    const lineNo = body.slice(0, body.indexOf(EM_DASH)).split(/\r?\n/).length;
    problems.push(`本文に em dash (U+2014) が含まれています（本文 ${lineNo} 行目付近）`);
  }
  if (raw && raw.includes(EM_DASH)) {
    problems.push("frontmatter に em dash (U+2014) が含まれています");
  }

  return { rel, problems, title: fm.title ?? null };
}

const files = walk(knowledgeDir).sort();
if (files.length === 0) {
  console.error("Knowledge/**/*.md が見つかりません");
  process.exit(1);
}

const results = files.map(validateFile);
const titleCounts = new Map();
for (const r of results) {
  if (!r.title) continue;
  titleCounts.set(r.title, (titleCounts.get(r.title) || []).concat(r.rel));
}
for (const [title, filesWithTitle] of titleCounts) {
  if (filesWithTitle.length > 1) {
    for (const rel of filesWithTitle) {
      const r = results.find((x) => x.rel === rel);
      r.problems.push(`title が重複しています ("${title}"): ${filesWithTitle.filter((f) => f !== rel).join(", ")}`);
    }
  }
}

const failed = results.filter((r) => r.problems.length > 0);

console.log(`Knowledge/**/*.md: ${files.length} 件を検証`);
if (failed.length === 0) {
  console.log("問題なし。");
  process.exit(0);
}

console.error(`\n${failed.length} 件のファイルに問題があります:\n`);
for (const r of failed) {
  console.error(`- ${r.rel}`);
  for (const p of r.problems) console.error(`    - ${p}`);
}
console.error("");
process.exit(1);
