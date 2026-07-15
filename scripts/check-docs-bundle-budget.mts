import { readFile } from "node:fs/promises";
import path from "node:path";

type RouteBundleStat = {
  route: string;
  firstLoadUncompressedJsBytes: number;
};

const statsPath = path.join(
  process.cwd(),
  "apps/docs/.next/diagnostics/route-bundle-stats.json",
);
const stats = JSON.parse(await readFile(statsPath, "utf8")) as RouteBundleStat[];
const maxBytes = 750_000;
const violations = stats
  .filter((stat) => stat.firstLoadUncompressedJsBytes > maxBytes)
  .sort((a, b) => b.firstLoadUncompressedJsBytes - a.firstLoadUncompressedJsBytes);

if (violations.length) {
  for (const violation of violations) {
    console.error(
      `${violation.route}: ${violation.firstLoadUncompressedJsBytes.toLocaleString()} B exceeds ${maxBytes.toLocaleString()} B`,
    );
  }
  process.exitCode = 1;
} else {
  const largest = [...stats].sort(
    (a, b) => b.firstLoadUncompressedJsBytes - a.firstLoadUncompressedJsBytes,
  )[0];
  console.log(
    `verified ${stats.length} route bundles; largest ${largest.route} = ${largest.firstLoadUncompressedJsBytes.toLocaleString()} B / ${maxBytes.toLocaleString()} B`,
  );
}
