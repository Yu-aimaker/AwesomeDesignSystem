import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { evaluateFreshness, loadReferenceRecords } from "../packages/content/src/index.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentRoot = path.join(root, "content");
const references = await loadReferenceRecords(contentRoot);
const now = new Date();

const rows = references.map((ref) => {
  const result = evaluateFreshness({
    lastVerifiedDate: ref.lastVerifiedDate,
    reviewCadenceDays: ref.reviewCadenceDays,
    now,
    previousHash: ref.contentHash,
    currentHash: ref.contentHash,
  });
  return { id: ref.id, title: ref.title, ...result, recordedState: ref.freshnessState };
});

const report = {
  generatedAt: now.toISOString(),
  summary: rows.reduce((acc, row) => {
    acc[row.state] = (acc[row.state] ?? 0) + 1;
    return acc;
  }, {}),
  rows,
};

await mkdir(path.join(root, "reports"), { recursive: true });
await writeFile(path.join(root, "reports/freshness.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report.summary, null, 2));
