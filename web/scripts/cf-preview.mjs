#!/usr/bin/env node
// Workers Builds preview command. Patches wrangler's assets-only no-op worker,
// then runs `wrangler preview`. Production deploy does not upload that file.
import { readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const webRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const template = resolve(webRoot, "node_modules/wrangler/templates/no-op-worker.js");
const fallback = resolve(webRoot, "scripts/preview-spa-fallback.js");
const original = readFileSync(template);
writeFileSync(template, readFileSync(fallback));
const result = spawnSync("pnpm", ["exec", "wrangler", "preview"], {
  cwd: webRoot,
  stdio: "inherit",
});
writeFileSync(template, original);
process.exit(result.status === null ? 1 : result.status);
