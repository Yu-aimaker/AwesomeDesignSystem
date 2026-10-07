#!/usr/bin/env node
// Reports broken relative Markdown links `[text](path)` in every *.md file of the repo.
// Skips .git, node_modules, dist, .screenshots. Ignores http(s), mailto and other URL
// schemes, pure anchors (#...), and links inside fenced or inline code.
// Plugin/awesome-ds/skills/ds-creator/templates/ is exempt: its links point at files the
// skill writes into the user's project (e.g. RATIONALE.md), not at files in this repo.
// Run: node scripts/check-links.mjs   (exit 1 with a list of broken links)
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, dirname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SKIP_DIRS = new Set([".git", "node_modules", "dist", ".screenshots"]);
const EXEMPT = ["Plugin/awesome-ds/skills/ds-creator/templates/"];
const LINK_RE = /!?\[[^\]]*\]\(\s*<?([^)\s>]+)>?(?:\s+["'(][^)]*)?\)/g;

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (name.endsWith(".md")) out.push(p);
  }
  return out;
}

// Blank out code so example links in code blocks are not checked. Line count is kept.
function stripCode(text) {
  return text
    .replace(/^(```|~~~)[\s\S]*?^\1/gm, (m) => m.replace(/[^\n]/g, " "))
    .replace(/`[^`\n]*`/g, (m) => " ".repeat(m.length));
}

const files = walk(root).filter((f) => {
  const rel = relative(root, f).split(sep).join("/");
  return !EXEMPT.some((e) => rel.startsWith(e));
});

const broken = [];
let checked = 0;
for (const file of files) {
  const lines = stripCode(readFileSync(file, "utf8")).split("\n");
  lines.forEach((line, i) => {
    for (const m of line.matchAll(LINK_RE)) {
      const href = m[1];
      if (href.startsWith("#") || /^[a-z][a-z0-9+.-]*:/i.test(href)) continue;
      const path = href.split("#")[0].split("?")[0];
      if (!path) continue;
      let decoded;
      try {
        decoded = decodeURIComponent(path);
      } catch {
        decoded = path;
      }
      const target = decoded.startsWith("/") ? join(root, decoded) : resolve(dirname(file), decoded);
      checked++;
      if (!existsSync(target)) broken.push(`${relative(root, file)}:${i + 1}  ${href}`);
    }
  });
}

console.log(`*.md: ${files.length} ファイル、相対リンク ${checked} 件を確認`);
if (broken.length === 0) {
  console.log("リンク切れなし。");
  process.exit(0);
}

console.error(`\nリンク切れ ${broken.length} 件:\n`);
for (const b of broken) console.error(`- ${b}`);
console.error("");
process.exit(1);
