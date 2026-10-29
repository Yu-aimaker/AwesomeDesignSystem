#!/usr/bin/env node
// GitHub Pages serves 404.html for unknown paths. Copying index.html there
// lets the SPA router handle deep links. .nojekyll keeps Pages from ignoring
// files that start with an underscore.
import { copyFileSync, existsSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const webRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(webRoot, "dist");
copyFileSync(resolve(dist, "index.html"), resolve(dist, "404.html"));
writeFileSync(resolve(dist, ".nojekyll"), "");
// Wrangler reads .assetsignore from the assets directory (dist), not the project root.
const assetsIgnore = resolve(webRoot, ".assetsignore");
if (existsSync(assetsIgnore)) copyFileSync(assetsIgnore, resolve(dist, ".assetsignore"));
console.log("postbuild: wrote dist/404.html, dist/.nojekyll, and dist/.assetsignore");
