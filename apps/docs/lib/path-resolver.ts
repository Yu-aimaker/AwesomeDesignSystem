import fs from "node:fs";
import path from "node:path";

export function findRepoRoot(): string {
  const candidates = [
    process.cwd(),
    path.join(/*turbopackIgnore: true*/ process.cwd(), ".."),
    path.join(/*turbopackIgnore: true*/ process.cwd(), "../.."),
    path.join(/*turbopackIgnore: true*/ process.cwd(), "../../.."),
  ];

  for (const dir of candidates) {
    const resolved = path.resolve(dir);
    if (
      fs.existsSync(path.join(resolved, "pnpm-workspace.yaml")) ||
      (fs.existsSync(path.join(resolved, "design-system")) &&
       fs.existsSync(path.join(resolved, "content")))
    ) {
      return resolved;
    }
  }

  throw new Error(
    `Failed to resolve repository root from process.cwd() candidates: ${candidates.map((c) => path.resolve(c)).join(", ")}`
  );
}

export function getContentRoot(): string {
  const root = findRepoRoot();
  const contentRoot = path.join(root, "content");
  if (!fs.existsSync(contentRoot)) {
    throw new Error(`Required source directory 'content' is missing at: ${contentRoot}`);
  }
  return contentRoot;
}

export function getDesignSystemRoot(): string {
  const root = findRepoRoot();
  const dsRoot = path.join(root, "design-system");
  if (!fs.existsSync(dsRoot)) {
    throw new Error(`Required source directory 'design-system' is missing at: ${dsRoot}`);
  }
  return dsRoot;
}

export function getReportsRoot(): string {
  const root = findRepoRoot();
  const reportsRoot = path.join(root, "reports");
  if (!fs.existsSync(reportsRoot)) {
    throw new Error(`Required source directory 'reports' is missing at: ${reportsRoot}`);
  }
  return reportsRoot;
}
