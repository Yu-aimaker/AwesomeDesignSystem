import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { synchronizeEvidenceBacklinks } from "./lib/evidence-backlinks.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const referencesDir = path.join(root, "content/references");
const rulesDir = path.join(root, "content/canon");
const artifactsPath = path.join(root, "content/artifacts/claims.json");

async function readRecords(directory) {
  const files = (await readdir(directory)).filter((file) => file.endsWith(".json")).sort();
  return Promise.all(files.map(async (file) => ({ file: path.join(directory, file), value: JSON.parse(await readFile(path.join(directory, file), "utf8")) })));
}

const referenceFiles = await readRecords(referencesDir);
const ruleFiles = await readRecords(rulesDir);
const artifacts = JSON.parse(await readFile(artifactsPath, "utf8"));
const synchronized = synchronizeEvidenceBacklinks({
  references: referenceFiles.map((entry) => entry.value),
  rules: ruleFiles.map((entry) => entry.value),
  artifacts,
});
const output = (value) => `${JSON.stringify(value, null, 2)}\n`;

if (process.argv.includes("--check")) {
  const drift = [
    ...referenceFiles.map((entry, index) => [entry.file, entry.value, synchronized.references[index]]),
    ...ruleFiles.map((entry, index) => [entry.file, entry.value, synchronized.rules[index]]),
    [artifactsPath, artifacts, synchronized.artifacts],
  ].filter(([, before, after]) => output(before) !== output(after));
  if (drift.length) {
    throw new Error(`Evidence backlinks are stale in ${drift.map(([file]) => path.relative(root, file)).join(", ")}. Run pnpm evidence:sync.`);
  }
  console.log(`verified backlinks for ${referenceFiles.length} references, ${ruleFiles.length} rules, and ${artifacts.length} artifacts`);
  process.exit(0);
}

await Promise.all([
  ...referenceFiles.map(({ file }, index) => writeFile(file, output(synchronized.references[index]))),
  ...ruleFiles.map(({ file }, index) => writeFile(file, output(synchronized.rules[index]))),
  writeFile(artifactsPath, output(synchronized.artifacts)),
]);

console.log(`synchronized ${referenceFiles.length} references, ${ruleFiles.length} rules, and ${artifacts.length} artifacts`);
