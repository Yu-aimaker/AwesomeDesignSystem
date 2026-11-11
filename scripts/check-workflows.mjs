#!/usr/bin/env node
// Fail when a workflow pushes to main or wires a billed Claude path.
import { readdirSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { weeklyChainProblems, workflowFindings } from "./lib/growth.mjs";

const dir = join(dirname(fileURLToPath(import.meta.url)), "..", ".github", "workflows");
const problems = [];
const texts = {};
for (const name of readdirSync(dir)) {
  if (!name.endsWith(".yml") && !name.endsWith(".yaml")) continue;
  const text = readFileSync(join(dir, name), "utf8");
  texts[name] = text;
  for (const finding of workflowFindings(text)) problems.push(`${name}: ${finding}`);
}
for (const finding of weeklyChainProblems({
  weekly: texts["weekly-growth.yml"] ?? "",
  settle: texts["weekly-growth-settle.yml"] ?? "",
  check: texts["check.yml"] ?? "",
})) problems.push(`weekly-chain: ${finding}`);
if (problems.length) {
  console.error("check-workflows:\n  " + problems.join("\n  "));
  process.exit(1);
}
console.log("check-workflows: OK");
