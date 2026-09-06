// Minimal YAML frontmatter parser. Supports the subset the Knowledge files use:
// scalars, inline arrays [a, b], block arrays of scalars, and block arrays of
// flat objects (- url: ...\n  title: ...). Anything else is kept as a string.

export type Scalar = string | number | boolean;
export type FrontmatterValue = Scalar | Scalar[] | Record<string, Scalar>[] | Record<string, Scalar>;
export type Frontmatter = Record<string, FrontmatterValue>;

export interface Parsed {
  data: Frontmatter;
  content: string;
}

function unquote(raw: string): string {
  const s = raw.trim();
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    return s.slice(1, -1);
  }
  return s;
}

function scalar(raw: string): Scalar {
  const s = raw.trim();
  if (s === "true") return true;
  if (s === "false") return false;
  if (/^-?\d+(\.\d+)?$/.test(s)) return Number(s);
  return unquote(s);
}

function inlineArray(raw: string): Scalar[] {
  const inner = raw.trim().slice(1, -1).trim();
  if (!inner) return [];
  return inner.split(",").map((v) => scalar(v));
}

function indentOf(line: string): number {
  return line.length - line.trimStart().length;
}

export function parseFrontmatter(source: string): Parsed {
  const text = source.replace(/^﻿/, "");
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(text);
  if (!match) return { data: {}, content: text };

  const lines = match[1].split(/\r?\n/);
  const data: Frontmatter = {};
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim() || line.trim().startsWith("#")) {
      i++;
      continue;
    }
    const kv = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line);
    if (!kv) {
      i++;
      continue;
    }
    const key = kv[1];
    const rest = kv[2].trim();

    if (rest && rest !== "|" && rest !== ">") {
      data[key] = rest.startsWith("[") && rest.endsWith("]") ? inlineArray(rest) : scalar(rest);
      i++;
      continue;
    }

    // Block value: collect indented lines.
    const block: string[] = [];
    i++;
    while (i < lines.length && (indentOf(lines[i]) > 0 || !lines[i].trim())) {
      block.push(lines[i]);
      i++;
    }
    const nonEmpty = block.filter((l) => l.trim());
    if (!nonEmpty.length) {
      data[key] = "";
      continue;
    }

    if (rest === "|" || rest === ">") {
      const base = indentOf(nonEmpty[0]);
      data[key] = nonEmpty.map((l) => l.slice(base)).join(rest === "|" ? "\n" : " ");
      continue;
    }

    if (nonEmpty[0].trim().startsWith("- ")) {
      const items: (Scalar | Record<string, Scalar>)[] = [];
      let current: Record<string, Scalar> | null = null;
      for (const l of nonEmpty) {
        const t = l.trim();
        if (t.startsWith("- ")) {
          const body = t.slice(2).trim();
          const objKv = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(body);
          if (objKv) {
            current = { [objKv[1]]: scalar(objKv[2]) };
            items.push(current);
          } else {
            current = null;
            items.push(scalar(body));
          }
        } else if (current) {
          const objKv = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(t);
          if (objKv) current[objKv[1]] = scalar(objKv[2]);
        }
      }
      const allObjects = items.every((it) => typeof it === "object");
      data[key] = allObjects ? (items as Record<string, Scalar>[]) : (items as Scalar[]);
      continue;
    }

    // Nested flat object.
    const obj: Record<string, Scalar> = {};
    for (const l of nonEmpty) {
      const objKv = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(l.trim());
      if (objKv) obj[objKv[1]] = scalar(objKv[2]);
    }
    data[key] = obj;
  }

  return { data, content: text.slice(match[0].length) };
}
