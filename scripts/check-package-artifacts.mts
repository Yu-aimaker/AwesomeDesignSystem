import { access } from "node:fs/promises";
import path from "node:path";

const packages = ["brand", "content", "core", "motion", "react", "tokens"];
for (const name of packages) {
  const root = path.resolve("packages", name, "dist");
  await Promise.all([access(path.join(root, "index.js")), access(path.join(root, "index.d.ts"))]);
  await import(path.join(root, "index.js"));
}

const react = await import(path.resolve("packages/react/dist/index.js"));
for (const required of ["Button", "Dialog", "AlertDialog", "Tabs", "Popover", "Stack"]) {
  if (!(required in react)) throw new Error(`@awesome-ds/react is missing public export ${required}`);
}

console.log(`verified ${packages.length} package artifact sets`);
