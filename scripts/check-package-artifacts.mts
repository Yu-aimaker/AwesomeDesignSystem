import { access, readFile } from "node:fs/promises";
import path from "node:path";

const packages = ["brand", "content", "core", "motion", "react", "tokens"];
for (const name of packages) {
  const packageRoot = path.resolve("packages", name);
  const manifest = JSON.parse(await readFile(path.join(packageRoot, "package.json"), "utf8")) as { exports: Record<string, string | Record<string, string>> };
  for (const [subpath, target] of Object.entries(manifest.exports)) {
    const targets = typeof target === "string" ? [target] : Object.values(target);
    for (const relative of new Set(targets)) {
      const resolved = path.resolve(packageRoot, relative);
      await access(resolved);
      if (relative.endsWith(".css") || relative.endsWith(".json")) {
        if (!(await readFile(resolved, "utf8")).trim()) throw new Error(`${name} export ${subpath} is empty`);
      }
    }
    const importTarget = typeof target === "string" ? target : target.import;
    if (importTarget?.endsWith(".js")) await import(path.resolve(packageRoot, importTarget));
  }
}

const react = await import(path.resolve("packages/react/dist/index.js"));
const coreContracts = await import(path.resolve("packages/core/dist/component-contracts.js"));
for (const contract of coreContracts.componentCatalog as Array<{ importName: string; name: string }>) {
  if (!(contract.importName in react)) throw new Error(`@awesome-ds/react is missing public export ${contract.importName}`);
  const metadata = react[contract.importName]?.metadata;
  if (metadata?.name !== contract.name) throw new Error(`${contract.importName} distribution metadata does not match its core contract`);
}

console.log(`verified ${packages.length} package artifact sets`);
