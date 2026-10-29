#!/usr/bin/env node
// Generates Reference/REFERENCE.md and Knowledge/README.md from the frontmatter of
// Knowledge/**/*.md. Run: node scripts/build-reference.mjs
// Frontmatter contract: title, category, type, sources[{url,title}], tags[], updated.
import { readdirSync, readFileSync, writeFileSync, statSync, mkdirSync } from "node:fs";
import { join, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const knowledgeDir = join(root, "Knowledge");

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (name.endsWith(".md") && name !== "README.md") out.push(p);
  }
  return out;
}

// Minimal YAML frontmatter parser for the fixed shape used in this repo.
function parseFrontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  const fm = { sources: [], tags: [] };
  const lines = m[1].split(/\r?\n/);
  let cur = null;
  for (const line of lines) {
    let mm;
    if ((mm = line.match(/^(\w+):\s*(.*)$/))) {
      const [, key, raw] = mm;
      cur = key;
      if (key === "sources") continue;
      if (key === "tags") {
        fm.tags = raw.replace(/^\[|\]$/g, "").split(",").map((s) => s.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
        continue;
      }
      fm[key] = raw.trim().replace(/^["']|["']$/g, "");
    } else if ((mm = line.match(/^\s+-\s+url:\s*(.*)$/)) && cur === "sources") {
      fm.sources.push({ url: mm[1].trim().replace(/^["']|["']$/g, ""), title: "" });
    } else if ((mm = line.match(/^\s+title:\s*(.*)$/)) && cur === "sources" && fm.sources.length) {
      fm.sources[fm.sources.length - 1].title = mm[1].trim().replace(/^["']|["']$/g, "");
    } else if ((mm = line.match(/^\s+-\s+(.*)$/)) && cur === "tags") {
      fm.tags.push(mm[1].trim().replace(/^["']|["']$/g, ""));
    }
  }
  return fm;
}

const entries = [];
for (const file of walk(knowledgeDir)) {
  const fm = parseFrontmatter(readFileSync(file, "utf8"));
  if (!fm || !fm.title) {
    console.warn(`skip (no frontmatter): ${relative(root, file)}`);
    continue;
  }
  entries.push({ ...fm, path: relative(root, file).split("\\").join("/") });
}
entries.sort((a, b) => (a.category + a.title).localeCompare(b.category + b.title, "ja"));

// Knowledge/README.md, and the same index for the plugin's copy of Knowledge.
function knowledgeIndex(intro) {
  const byCat = new Map();
  for (const e of entries) {
    if (!byCat.has(e.category)) byCat.set(e.category, []);
    byCat.get(e.category).push(e);
  }
  let md = `# Knowledge\n\n${intro}\n\n件数: ${entries.length}\n\n`;
  for (const [cat, list] of [...byCat.entries()].sort()) {
    md += `## ${cat}\n\n| エントリ | 種別 | タグ | 更新 |\n|---|---|---|---|\n`;
    for (const e of list) {
      const rel = e.path.replace(/^Knowledge\//, "");
      md += `| [${e.title}](${rel}) | ${e.type ?? ""} | ${e.tags.join(", ")} | ${e.updated ?? ""} |\n`;
    }
    md += "\n";
  }
  return md;
}
writeFileSync(
  join(knowledgeDir, "README.md"),
  knowledgeIndex(
    "AI コーディングエージェントがデザインシステムを作る・適用する・検証するときに参照する知見の集積です。各エントリは出典リンク付きの要約で、末尾に「AwesomeDS への反映」を必ず持ちます。\n\n追加方法は [CONTRIBUTING.md](../CONTRIBUTING.md) と Plugin の `knowledge-curator` スキルを参照してください。この一覧と [Reference/REFERENCE.md](../Reference/REFERENCE.md) は `node scripts/build-reference.mjs` で生成されます。手で編集しないでください。",
  ),
);
// The plugin copy has no repo root next to it, so this index links only inside knowledge/.
const pluginKnowledgeDir = join(root, "Plugin", "awesome-ds", "knowledge");
mkdirSync(pluginKnowledgeDir, { recursive: true });
writeFileSync(
  join(pluginKnowledgeDir, "README.md"),
  knowledgeIndex(
    "AwesomeDS リポの `Knowledge/` の写しです。UI を作る前に、関係するカテゴリのエントリを読んでください。各エントリは出典 URL 付きの要約で、末尾に「AwesomeDS への反映」があります。\n\n正本はリポの `Knowledge/` です。この一覧は `node scripts/build-reference.mjs`、エントリは `Plugin/awesome-ds/scripts/sync-ds.sh` で生成します。手で編集しないでください。",
  ),
);

// Reference/REFERENCE.md
{
  const byUrl = new Map();
  for (const e of entries) {
    for (const s of e.sources) {
      if (!s.url) continue;
      if (!byUrl.has(s.url)) byUrl.set(s.url, { title: s.title, citedBy: [] });
      const rec = byUrl.get(s.url);
      if (!rec.title && s.title) rec.title = s.title;
      rec.citedBy.push(e);
    }
  }
  const byDomain = new Map();
  for (const [url, rec] of byUrl) {
    let host = url;
    try { host = new URL(url).hostname.replace(/^www\./, ""); } catch {}
    if (!byDomain.has(host)) byDomain.set(host, []);
    byDomain.get(host).push({ url, ...rec });
  }
  let md = `# Reference\n\nKnowledge と AwesomeDS が参照した外部リンクの一覧です。ドメイン別に並べ、各リンクに概要と引用元エントリを付けています。\n\n\`node scripts/build-reference.mjs\` で Knowledge/**/*.md の frontmatter から生成されます。手で編集しないでください。\n\nリンク数: ${byUrl.size}  /  ドメイン数: ${byDomain.size}\n\n`;
  for (const [host, list] of [...byDomain.entries()].sort()) {
    md += `## ${host}\n\n`;
    for (const item of list.sort((a, b) => a.url.localeCompare(b.url))) {
      const cites = [...new Set(item.citedBy.map((e) => `[${e.title}](../${e.path})`))].join(", ");
      md += `- [${item.title || item.url}](${item.url})  \n  引用: ${cites}\n`;
    }
    md += "\n";
  }
  mkdirSync(join(root, "Reference"), { recursive: true });
  writeFileSync(join(root, "Reference", "REFERENCE.md"), md);
}
console.log(`entries: ${entries.length}`);
