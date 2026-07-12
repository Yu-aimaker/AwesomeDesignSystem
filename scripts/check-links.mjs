import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadReferenceRecords } from "../packages/content/src/index.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentRoot = path.join(root, "content");
const references = await loadReferenceRecords(contentRoot);

const results = [];
for (const ref of references) {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(ref.url, { method: "HEAD", redirect: "follow", signal: controller.signal });
    clearTimeout(timer);
    results.push({ id: ref.id, url: ref.url, ok: res.ok, status: res.status });
  } catch (error) {
    results.push({ id: ref.id, url: ref.url, ok: false, status: 0, error: String(error) });
  }
}

await mkdir(path.join(root, "reports"), { recursive: true });
await writeFile(path.join(root, "reports/link-check.json"), JSON.stringify({ checkedAt: new Date().toISOString(), results }, null, 2));
const failures = results.filter((r) => !r.ok);
console.log(`checked ${results.length}, failures ${failures.length}`);
// Non-blocking for flaky network in local phase: exit 0 but report failures
process.exit(0);
