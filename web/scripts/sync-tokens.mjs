#!/usr/bin/env node
// Copies the AwesomeDS token files into web/src/ds/tokens and the data sets
// (AwesomeDS/data/*.json) into web/src/ds/data so the site builds without
// reaching outside the Vite root. Runs before `dev` and `build`.
import { copyFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const source = resolve(here, "../../AwesomeDS/tokens");
const target = resolve(here, "../src/ds/tokens");

mkdirSync(target, { recursive: true });
const files = readdirSync(source).filter((f) => f.endsWith(".css") || f.endsWith(".json"));
for (const file of files) {
  copyFileSync(join(source, file), join(target, file));
}
console.log(`sync-tokens: copied ${files.join(", ")} -> src/ds/tokens`);

// Data sets rendered by the site (brands, fonts, palettes, stack, libraries, repos).
const dataSource = resolve(here, "../../AwesomeDS/data");
const dataTarget = resolve(here, "../src/ds/data");
mkdirSync(dataTarget, { recursive: true });
const dataFiles = existsSync(dataSource) ? readdirSync(dataSource).filter((f) => f.endsWith(".json")) : [];
for (const file of dataFiles) {
  copyFileSync(join(dataSource, file), join(dataTarget, file));
}
console.log(`sync-tokens: copied ${dataFiles.join(", ") || "(no data files)"} -> src/ds/data`);
