// Copies the AwesomeDS token files into web/src/ds/tokens so the site builds
// without reaching outside the Vite root. Runs before `dev` and `build`.
import { copyFileSync, mkdirSync, readdirSync } from "node:fs";
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
