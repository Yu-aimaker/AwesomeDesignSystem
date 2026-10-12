#!/usr/bin/env node
// Fail when a workflow pushes to main or wires a billed Claude path.
import { readdirSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { workflowFindings } from "./lib/growth.mjs";

const dir = join(dirname(fileURLToPath(import.meta.url)), "..", ".github", "workflows");
const problems = [];
for (const name of readdirSync(dir)) {
  if (!name.endsWith(".yml") && !name.endsWith(".yaml")) continue;
  const text = readFileSync(join(dir, name), "utf8");
  for (const finding of workflowFindings(text)) problems.push(`${name}: ${finding}`);
}
if (problems.length) {
  console.error("check-workflows:\n  " + problems.join("\n  "));
  process.exit(1);
}
console.log("check-workflows: OK");
