// GitHub Pages serves 404.html for unknown paths. Copying index.html there
// lets the SPA router handle deep links. .nojekyll keeps Pages from ignoring
// files that start with an underscore.
import { copyFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const dist = resolve(dirname(fileURLToPath(import.meta.url)), "../dist");
copyFileSync(resolve(dist, "index.html"), resolve(dist, "404.html"));
writeFileSync(resolve(dist, ".nojekyll"), "");
console.log("postbuild: wrote dist/404.html and dist/.nojekyll");
