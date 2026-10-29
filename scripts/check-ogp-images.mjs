#!/usr/bin/env node
// Fail when a /sources card image is missing, the wrong size, or too large.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { checkOgpFile, readJpegSize } from "./lib/growth.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const ts = readFileSync(join(root, "web/src/lib/design-systems.ts"), "utf8");
const referenced = [...ts.matchAll(/image:\s*"(\/ogp\/[^"]+)"/g)].map((m) => m[1].replace("/ogp/", ""));
const unique = [...new Set(referenced)];
const dir = join(root, "web/public/ogp");
const onDisk = existsSync(dir) ? readdirSync(dir) : [];
const problems = [];
const seen = new Set(unique);
for (const name of unique) {
  const path = join(dir, name);
  const exists = existsSync(path);
  let width = null;
  let height = null;
  let bytes = 0;
  if (exists) {
    const buf = readFileSync(path);
    bytes = buf.length;
    const size = readJpegSize(buf);
    width = size?.width ?? null;
    height = size?.height ?? null;
  }
  for (const problem of checkOgpFile({ name, referenced: true, exists, width, height, bytes })) {
    problems.push(`${name}: ${problem}`);
  }
}
for (const name of onDisk) {
  if (!seen.has(name)) problems.push(`${name}: unreferenced`);
  else if (statSync(join(dir, name)).size > 200 * 1024) {
    /* size already reported */
  }
}
if (problems.length) {
  console.error(`check-ogp: ${problems.length}\n  ` + problems.join("\n  "));
  process.exit(1);
}
console.log(`check-ogp: OK (${unique.length} images)`);
