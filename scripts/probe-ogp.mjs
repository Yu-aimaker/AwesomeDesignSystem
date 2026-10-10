#!/usr/bin/env node
// Report whether flagship pages still expose an og:image. Writes a report only.
// node scripts/probe-ogp.mjs --out ogp-probe.json
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const text = readFileSync(join(root, "web/src/lib/design-systems.ts"), "utf8");
const blocks = text.split(/\n  \{/).slice(1);
const targets = [];
for (const block of blocks) {
  const id = block.match(/id: "([^"]+)"/)?.[1];
  const url = block.match(/\n\s+url: "(https:\/\/[^"]+)"/)?.[1];
  if (id && url) targets.push({ id, url });
}

function arg(name) {
  const i = process.argv.indexOf(name);
  return i === -1 ? "" : process.argv[i + 1];
}

function attr(html, name) {
  const re = new RegExp(`<meta[^>]+(?:property|name)=["']${name}["'][^>]+content=["']([^"']+)["']`, "i");
  const re2 = new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${name}["']`, "i");
  return html.match(re)?.[1] || html.match(re2)?.[1] || null;
}

const rows = [];
for (const target of targets) {
  try {
    const res = await fetch(target.url, {
      headers: { "User-Agent": "awesomeds-growth", Accept: "text/html" },
      redirect: "follow",
      signal: AbortSignal.timeout(15000),
    });
    const html = (await res.text()).slice(0, 200_000);
    const og = attr(html, "og:image") || attr(html, "og:image:url") || attr(html, "twitter:image");
    rows.push({ id: target.id, http: res.status, ogImage: Boolean(og) });
  } catch (e) {
    rows.push({ id: target.id, error: String(e).slice(0, 200), ogImage: false });
  }
}
const report = { checked: rows.length, withImage: rows.filter((r) => r.ogImage).length, rows };
const out = arg("--out");
if (out) writeFileSync(out, JSON.stringify(report, null, 2) + "\n");
console.log(`probe-ogp: ${report.withImage}/${report.checked} pages expose an image (report only)`);
