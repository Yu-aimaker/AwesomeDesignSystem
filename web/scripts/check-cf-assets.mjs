#!/usr/bin/env node
// Hosting contract for the assets-only Worker. Exit 1 when any of these drift:
// no Worker script (no `main`), SPA fallback, noindex and HSTS in dist/_headers,
// dist under the Workers Free file count and per-file size, og-image 1200x630.
// Removing not_found_handling must fail this script.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const webRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const MAX_FILES = 20_000;
const MAX_BYTES = 25 * 1024 * 1024;

function stripJsonc(text) {
  let out = "";
  let i = 0;
  let quote = null;
  while (i < text.length) {
    const c = text[i];
    const next = text[i + 1];
    if (quote) {
      out += c;
      if (c === "\\" && i + 1 < text.length) {
        out += text[i + 1];
        i += 2;
        continue;
      }
      if (c === quote) quote = null;
      i++;
      continue;
    }
    if (c === '"' || c === "'") {
      quote = c;
      out += c;
      i++;
      continue;
    }
    if (c === "/" && next === "/") {
      i += 2;
      while (i < text.length && text[i] !== "\n") i++;
      continue;
    }
    if (c === "/" && next === "*") {
      i += 2;
      while (i < text.length && !(text[i] === "*" && text[i + 1] === "/")) i++;
      i += 2;
      continue;
    }
    out += c;
    i++;
  }
  return out.replace(/,(\s*[}\]])/g, "$1");
}

const problems = [];

let config = {};
try {
  config = JSON.parse(stripJsonc(readFileSync(join(webRoot, "wrangler.jsonc"), "utf8")));
} catch (error) {
  problems.push(`wrangler.jsonc is not valid JSONC: ${error.message}`);
}

if (Object.prototype.hasOwnProperty.call(config, "main")) {
  problems.push("wrangler.jsonc must not set main (assets-only Worker)");
}
if (config.assets?.not_found_handling !== "single-page-application") {
  problems.push(
    `assets.not_found_handling must be "single-page-application" (got ${JSON.stringify(config.assets?.not_found_handling ?? null)})`,
  );
}
if (config.assets?.directory !== "./dist") {
  problems.push(`assets.directory must be "./dist" (got ${JSON.stringify(config.assets?.directory ?? null)})`);
}
if (config.previews == null || typeof config.previews !== "object" || Array.isArray(config.previews)) {
  problems.push("wrangler.jsonc must set previews to an object (wrangler preview requires it; empty is fine)");
}
if (config.routes != null || config.previews?.routes != null) {
  problems.push("wrangler.jsonc must not set routes (cutover is a later PR)");
}

const dist = join(webRoot, "dist");
let headers = "";
try {
  headers = readFileSync(join(dist, "_headers"), "utf8");
} catch {
  problems.push("dist/_headers is missing (Vite should copy web/public/_headers)");
}
if (headers && !/^\/\*\s*$/m.test(headers)) {
  problems.push("dist/_headers must include a /* rule");
}
if (headers && !/X-Robots-Tag:\s*noindex,\s*nofollow/i.test(headers)) {
  problems.push('dist/_headers must set "X-Robots-Tag: noindex, nofollow"');
}
// Vercel sends this HSTS today; keep it identical so the cutover changes no header.
if (headers && !/Strict-Transport-Security:\s*max-age=63072000\s*$/im.test(headers)) {
  problems.push('dist/_headers must set "Strict-Transport-Security: max-age=63072000" (same as Vercel)');
}
let assetsIgnore = "";
try {
  assetsIgnore = readFileSync(join(dist, ".assetsignore"), "utf8");
} catch {
  problems.push("dist/.assetsignore is missing (postbuild copies web/.assetsignore; Wrangler only reads it from the assets directory)");
}
if (assetsIgnore && !/(^|\n)\.nojekyll(\r?\n|$)/.test(assetsIgnore)) {
  problems.push("dist/.assetsignore must exclude .nojekyll");
}

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    const st = statSync(path);
    if (st.isDirectory()) walk(path, acc);
    else acc.push({ path, size: st.size });
  }
  return acc;
}

let files = [];
try {
  files = walk(dist);
} catch {
  problems.push("dist/ is missing. Run pnpm build first.");
}
if (files.length >= MAX_FILES) {
  problems.push(`dist has ${files.length} files; Workers Free allows fewer than ${MAX_FILES}`);
}
for (const file of files) {
  if (file.size >= MAX_BYTES) {
    problems.push(`${relative(webRoot, file.path)} is ${file.size} bytes; each file must be under 25MiB`);
  }
}

const ogPath = join(dist, "og-image.png");
try {
  const og = readFileSync(ogPath);
  const png = og.length > 24 && og.readUInt32BE(0) === 0x89504e47;
  if (!png) problems.push("dist/og-image.png is not a PNG");
  else {
    const w = og.readUInt32BE(16);
    const h = og.readUInt32BE(20);
    if (w !== 1200 || h !== 630) problems.push(`dist/og-image.png is ${w}x${h}, want 1200x630`);
  }
} catch {
  problems.push("dist/og-image.png is missing");
}

if (problems.length) {
  console.error(problems.map((line) => `cf-assets: ${line}`).join("\n"));
  process.exit(1);
}
console.log(
  `cf-assets ok: ${files.length} files, no main, previews={}, not_found_handling=single-page-application, noindex, HSTS, og-image 1200x630`,
);
