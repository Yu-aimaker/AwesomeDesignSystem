import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { componentCatalog } from "../packages/core/src/component-contracts";
import { buildComponentArtifactClaims, type ArtifactClaimRecord } from "./lib/component-artifacts";

const root = path.resolve(import.meta.dirname, "..");
const claimsPath = path.join(root, "content/artifacts/claims.json");
const canonDir = path.join(root, "content/canon");
const currentText = await readFile(claimsPath, "utf8");
const claims = JSON.parse(currentText) as ArtifactClaimRecord[];
const ruleFiles = (await readdir(canonDir)).filter((file) => file.endsWith(".json"));
const rules = await Promise.all(ruleFiles.map(async (file) => JSON.parse(await readFile(path.join(canonDir, file), "utf8")) as { id: string; referenceIds: string[] }));
const synchronized = buildComponentArtifactClaims(claims, componentCatalog, rules);
const expectedText = `${JSON.stringify(synchronized, null, 2)}\n`;
if (process.argv.includes("--check")) {
  if (currentText !== expectedText) {
    throw new Error("Component artifact claims are stale. Run pnpm evidence:sync.");
  }
  console.log(`verified ${componentCatalog.length} component artifact claims`);
} else {
  await writeFile(claimsPath, expectedText);
  console.log(`synchronized ${componentCatalog.length} component artifact claims`);
}
