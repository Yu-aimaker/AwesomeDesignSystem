import { copyFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const check = process.argv.includes("--check");
const names = ["diagram-evidence-loop.svg", "diagram-canon-to-verify.svg"] as const;
const publicDir = path.join(root, "apps/docs/public");

await mkdir(publicDir, { recursive: true });

for (const name of names) {
  const source = path.join(root, "assets", name);
  const destination = path.join(publicDir, name);

  if (check) {
    const [sourceBytes, publicBytes] = await Promise.all([
      readFile(source),
      readFile(destination).catch(() => null),
    ]);
    if (!publicBytes || !sourceBytes.equals(publicBytes)) {
      throw new Error(`${destination} is missing or differs from ${source}`);
    }
  } else {
    await copyFile(source, destination);
  }
}

console.log(
  check
    ? `verified ${names.length} public brand diagrams match canonical assets`
    : `synced ${names.length} canonical brand diagrams into apps/docs/public`,
);
