#!/usr/bin/env node
// Copies the AwesomeDS token files into web/src/ds/tokens and the data sets
// (AwesomeDS/data/*.json) into web/src/ds/data so the site builds without
// reaching outside the Vite root. Runs before `dev` and `build`.
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
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

// Knob swatches: light --ds-accent from each :root[data-accent] block in accents.css.
{
  const accentsCss = readFileSync(join(source, "accents.css"), "utf8");
  const seen = new Set();
  const chips = ["/* generated from accents.css — do not edit */"];
  for (const m of accentsCss.matchAll(/:root\[data-accent="([^"]+)"\]\s*\{([^}]+)\}/g)) {
    const id = m[1];
    if (seen.has(id)) continue;
    seen.add(id);
    const accent = m[2].match(/--ds-accent:\s*(#[0-9a-fA-F]{6})/);
    if (accent) chips.push(`[data-accent-chip="${id}"] { background: ${accent[1]}; }`);
  }
  writeFileSync(join(target, "accent-chips.css"), `${chips.join("\n")}\n`);
  console.log(`sync-tokens: wrote accent-chips.css (${seen.size} swatches)`);
}

// Data sets rendered by the site (brands, fonts, palettes, stack, libraries, repos).
const dataSource = resolve(here, "../../AwesomeDS/data");
const dataTarget = resolve(here, "../src/ds/data");
mkdirSync(dataTarget, { recursive: true });
const dataFiles = existsSync(dataSource) ? readdirSync(dataSource).filter((f) => f.endsWith(".json")) : [];
for (const file of dataFiles) {
  copyFileSync(join(dataSource, file), join(dataTarget, file));
}
console.log(`sync-tokens: copied ${dataFiles.join(", ") || "(no data files)"} -> src/ds/data`);
