#!/usr/bin/env node
// Broken Markdown links in every *.md file.
// Relative links must exist on disk. https links are fetched only when they match
// scripts/external-link-allowlist.txt, with retries, so other hosts cannot flake CI.
// Skips .git, node_modules, dist, .screenshots. Ignores mailto and other non-http
// schemes, pure anchors (#...), and links inside fenced or inline code.
// Plugin/awesome-ds/skills/ds-creator/templates/ is exempt: its links point at files the
// skill writes into the user's project (e.g. RATIONALE.md), not at files in this repo.
// Run: node scripts/check-links.mjs   (exit 1 with a list of broken links)
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const ALLOWLIST_PATH = join(root, "scripts/external-link-allowlist.txt");
const SKIP_DIRS = new Set([".git", "node_modules", "dist", ".screenshots"]);
const EXEMPT = ["Plugin/awesome-ds/skills/ds-creator/templates/"];
const LINK_RE = /!?\[[^\]]*\]\(\s*<?([^)\s>]+)>?(?:\s+["'(][^)]*)?\)/g;
const ATTEMPTS = 3;
const RETRY_MS = 400;
const TIMEOUT_MS = 8000;

export function stripCode(text) {
  return text
    .replace(/^(```|~~~)[\s\S]*?^\1/gm, (m) => m.replace(/[^\n]/g, " "))
    .replace(/`[^`\n]*`/g, (m) => " ".repeat(m.length));
}

export function loadAllowlist(text) {
  return text
    .split("\n")
    .map((line) => line.replace(/#.*$/, "").trim())
    .filter(Boolean);
}

export function isAllowlisted(href, entries) {
  const bare = href.split("#")[0];
  return entries.some((entry) => bare === entry || bare.startsWith(`${entry}/`));
}

function retryable(status) {
  return status === 408 || status === 429 || status >= 500;
}

export async function checkExternal(url, { fetchImpl = fetch, attempts = ATTEMPTS, delayMs = RETRY_MS } = {}) {
  let last = "network";
  for (let i = 0; i < attempts; i++) {
    if (i > 0 && delayMs > 0) await new Promise((r) => setTimeout(r, delayMs));
    try {
      let res = await fetchImpl(url, {
        method: "HEAD",
        redirect: "follow",
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      if (res.status === 405 || res.status === 501) {
        res = await fetchImpl(url, {
          method: "GET",
          redirect: "follow",
          signal: AbortSignal.timeout(TIMEOUT_MS),
        });
      }
      last = res.status;
      if (res.status >= 200 && res.status < 400) return { ok: true, status: res.status };
      if (!retryable(res.status)) return { ok: false, status: res.status };
    } catch (err) {
      last = err?.name || "network";
    }
  }
  return { ok: false, status: last };
}

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

export function brokenRelative(markdown, file, repoRoot) {
  const broken = [];
  let checked = 0;
  const lines = stripCode(markdown).split("\n");
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
      const target = decoded.startsWith("/") ? join(repoRoot, decoded) : resolve(dirname(file), decoded);
      checked++;
      if (!existsSync(target)) broken.push({ line: i + 1, href });
    }
  });
  return { checked, broken };
}

function externalHrefs(markdown) {
  const hrefs = [];
  for (const line of stripCode(markdown).split("\n")) {
    for (const m of line.matchAll(LINK_RE)) {
      const href = m[1];
      if (/^https?:\/\//i.test(href)) hrefs.push(href.split("#")[0]);
    }
  }
  return hrefs;
}

export async function main() {
  const allow = loadAllowlist(readFileSync(ALLOWLIST_PATH, "utf8"));
  const files = walk(root).filter((f) => {
    const rel = relative(root, f).split(sep).join("/");
    return !EXEMPT.some((e) => rel.startsWith(e));
  });

  const broken = [];
  let checked = 0;
  const externalSeen = new Map();
  let externalSkipped = 0;

  for (const file of files) {
    const text = readFileSync(file, "utf8");
    const relFile = relative(root, file).split(sep).join("/");
    const local = brokenRelative(text, file, root);
    checked += local.checked;
    for (const item of local.broken) broken.push(`${relFile}:${item.line}  ${item.href}`);

    for (const href of externalHrefs(text)) {
      if (!isAllowlisted(href, allow)) {
        externalSkipped++;
        continue;
      }
      if (!externalSeen.has(href)) externalSeen.set(href, checkExternal(href));
    }
  }

  const externalBroken = [];
  for (const [href, pending] of externalSeen) {
    const result = await pending;
    if (!result.ok) externalBroken.push(`${href}  (${result.status})`);
  }

  console.log(`*.md: ${files.length} ファイル、相対リンク ${checked} 件を確認`);
  console.log(
    `外部リンク: 許容リスト ${externalSeen.size} 件を確認、対象外 ${externalSkipped} 件は未取得`,
  );
  if (broken.length === 0 && externalBroken.length === 0) {
    console.log("リンク切れなし。");
    return 0;
  }

  if (broken.length) {
    console.error(`\nリンク切れ ${broken.length} 件:\n`);
    for (const b of broken) console.error(`- ${b}`);
  }
  if (externalBroken.length) {
    console.error(`\n許容リストの外部リンク失敗 ${externalBroken.length} 件:\n`);
    for (const b of externalBroken) console.error(`- ${b}`);
  }
  console.error("");
  return 1;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().then((code) => process.exit(code));
}
