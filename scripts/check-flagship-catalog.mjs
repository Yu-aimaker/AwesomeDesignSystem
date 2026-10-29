#!/usr/bin/env node
// Fail when a /sources flagship card claims a share image it does not name,
// or uses the poster without a written reason. No network.
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { flagshipProblems, parseFlagshipSystems } from "./lib/flagship-catalog.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const file = join(root, "web/src/lib/design-systems.ts");
const source = readFileSync(file, "utf8");
const problems = flagshipProblems(source, (knowledge) => existsSync(join(root, "Knowledge", `${knowledge}.md`)));
if (problems.length) {
  console.error(`check-flagship-catalog: ${problems.length}\n  ` + problems.join("\n  "));
  process.exit(1);
}
console.log(`check-flagship-catalog: OK (${parseFlagshipSystems(source).length} cards)`);
