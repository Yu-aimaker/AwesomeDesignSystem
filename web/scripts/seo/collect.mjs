// Route list for sitemap, llms.txt and prerender.
// Static paths come from web/src/App.tsx. Knowledge URLs use the same slug
// rules as web/src/lib/knowledge.ts so a new markdown file appears on its own.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

export function slugify(input) {
  return (
    input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9぀-ヿ一-鿿]+/g, "-")
      .replace(/^-+|-+$/g, "") || "entry"
  );
}

function unquote(raw) {
  const s = raw.trim();
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) return s.slice(1, -1);
  return s;
}

function scalar(raw) {
  const s = raw.trim();
  if (s === "true") return true;
  if (s === "false") return false;
  if (/^-?\d+(\.\d+)?$/.test(s)) return Number(s);
  return unquote(s);
}

function inlineArray(raw) {
  const inner = raw.trim().slice(1, -1).trim();
  if (!inner) return [];
  return inner.split(",").map((value) => scalar(value));
}

function indentOf(line) {
  return line.length - line.trimStart().length;
}

export function parseFrontmatter(source) {
  const text = source.replace(/^﻿/, "");
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(text);
  if (!match) return { data: {}, content: text };
  const lines = match[1].split(/\r?\n/);
  const data = {};
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim() || line.trim().startsWith("#")) {
      i += 1;
      continue;
    }
    const kv = /^([A-Za-z0-9_-]+):(?:\s+(.*))?$/.exec(line);
    if (!kv) {
      i += 1;
      continue;
    }
    const key = kv[1];
    const rest = (kv[2] ?? "").trim();
    if (rest && rest !== "|" && rest !== ">") {
      data[key] = rest.startsWith("[") && rest.endsWith("]") ? inlineArray(rest) : scalar(rest);
      i += 1;
      continue;
    }
    const block = [];
    i += 1;
    while (i < lines.length && (indentOf(lines[i]) > 0 || !lines[i].trim())) {
      block.push(lines[i]);
      i += 1;
    }
    const nonEmpty = block.filter((item) => item.trim());
    if (!nonEmpty.length) {
      data[key] = "";
      continue;
    }
    if (rest === "|" || rest === ">") {
      const base = indentOf(nonEmpty[0]);
      data[key] = nonEmpty.map((item) => item.slice(base)).join(rest === "|" ? "\n" : " ");
      continue;
    }
    if (nonEmpty[0].trim().startsWith("- ")) {
      const items = [];
      let current = null;
      for (const item of nonEmpty) {
        const t = item.trim();
        if (t.startsWith("- ")) {
          const body = t.slice(2).trim();
          const objKv = /^([A-Za-z0-9_-]+):(?:\s+(.*))?$/.exec(body);
          if (objKv) {
            current = { [objKv[1]]: scalar(objKv[2] ?? "") };
            items.push(current);
          } else {
            current = null;
            items.push(scalar(body));
          }
        } else if (current) {
          const objKv = /^([A-Za-z0-9_-]+):(?:\s+(.*))?$/.exec(t);
          if (objKv) current[objKv[1]] = scalar(objKv[2] ?? "");
        }
      }
      data[key] = items;
      continue;
    }
    const obj = {};
    for (const item of nonEmpty) {
      const objKv = /^([A-Za-z0-9_-]+):(?:\s+(.*))?$/.exec(item.trim());
      if (objKv) obj[objKv[1]] = scalar(objKv[2] ?? "");
    }
    data[key] = obj;
  }
  return { data, content: text.slice(match[0].length) };
}

function asString(value, fallback = "") {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return fallback;
}

function firstHeading(body) {
  return /^#\s+(.+)$/m.exec(body)?.[1]?.trim();
}

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, acc);
    else if (name.endsWith(".md")) acc.push(path);
  }
  return acc;
}

function build(rel, raw, origin, file) {
  let parsed;
  try {
    parsed = parseFrontmatter(raw);
  } catch {
    parsed = { data: {}, content: raw };
  }
  const segments = rel.split("/");
  const fileName = segments[segments.length - 1] ?? "";
  const fileSlug = fileName.replace(/\.md$/i, "");
  if (fileSlug.toLowerCase() === "readme" && origin === "knowledge") return null;
  const folder = origin === "awesomeds" ? "awesomeds" : segments[segments.length - 2];
  const category =
    origin === "awesomeds"
      ? "awesomeds"
      : slugify(asString(parsed.data.category, folder && folder !== "Knowledge" ? folder : "general"));
  const slug = slugify(fileSlug);
  const title = asString(parsed.data.title) || firstHeading(parsed.content) || fileSlug;
  return {
    category,
    slug,
    title,
    updated: asString(parsed.data.updated),
    body: parsed.content.trim(),
    file,
    id: `${category}/${slug}`,
  };
}

export function loadEntries(repo) {
  const out = [];
  for (const file of walk(join(repo, "Knowledge"))) {
    const rel = relative(repo, file).split(sep).join("/");
    const entry = build(rel, readFileSync(file, "utf8"), "knowledge", file);
    if (entry) out.push(entry);
  }
  for (const file of walk(join(repo, "AwesomeDS", "foundations"))) {
    const rel = relative(repo, file).split(sep).join("/");
    const entry = build(rel, readFileSync(file, "utf8"), "awesomeds", file);
    if (entry) out.push(entry);
  }
  const seen = new Map();
  for (const entry of out) {
    const n = seen.get(entry.id) ?? 0;
    if (n > 0) {
      entry.slug = `${entry.slug}-${n + 1}`;
      entry.id = `${entry.category}/${entry.slug}`;
    }
    seen.set(`${entry.category}/${slugify(entry.slug.replace(/-\d+$/, ""))}`, n + 1);
  }
  return out;
}

/** One Route per line, matching web/src/App.tsx. */
export function parseAppRoutes(source) {
  const pages = [];
  const redirects = [];
  if (/<Route\s+index\b/.test(source)) pages.push("/");
  for (const line of source.split(/\r?\n/)) {
    const match = /<Route\s+path="([^"]+)"/.exec(line);
    if (!match) continue;
    const path = match[1];
    if (path === "*" || path.includes(":")) continue;
    const url = `/${path}`;
    if (line.includes("<Navigate")) redirects.push({ from: url, to: /to="([^"]+)"/.exec(line)?.[1] ?? "/motion" });
    else pages.push(url);
  }
  return { pages, redirects };
}
