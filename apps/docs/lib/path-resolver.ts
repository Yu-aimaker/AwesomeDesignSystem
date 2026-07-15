import fs from "node:fs";
import path from "node:path";

export function findRepoRoot(): string {
  const cwd = process.cwd();
  const docsSuffix = `${path.sep}apps${path.sep}docs`;
  const root = cwd.endsWith(docsSuffix)
    ? path.join(/*turbopackIgnore: true*/ cwd, "../..")
    : path.join(/*turbopackIgnore: true*/ cwd, ".");

  const workspaceManifest = path.join(
    /*turbopackIgnore: true*/ root,
    "pnpm-workspace.yaml",
  );
  const designSystem = path.join(
    /*turbopackIgnore: true*/ root,
    "design-system",
  );
  const content = path.join(/*turbopackIgnore: true*/ root, "content");
  if (
    fs.existsSync(workspaceManifest) ||
    (fs.existsSync(designSystem) && fs.existsSync(content))
  ) {
    return root;
  }

  throw new Error(`Failed to resolve repository root from process.cwd(): ${cwd}`);
}

export function getContentRoot(): string {
  const root = findRepoRoot();
  const contentRoot = path.join(/*turbopackIgnore: true*/ root, "content");
  if (!fs.existsSync(contentRoot)) {
    throw new Error(`Required source directory 'content' is missing at: ${contentRoot}`);
  }
  return contentRoot;
}

export function getDesignSystemRoot(): string {
  const root = findRepoRoot();
  const dsRoot = path.join(/*turbopackIgnore: true*/ root, "design-system");
  if (!fs.existsSync(dsRoot)) {
    throw new Error(`Required source directory 'design-system' is missing at: ${dsRoot}`);
  }
  return dsRoot;
}

export function getReportsRoot(): string {
  const root = findRepoRoot();
  const reportsRoot = path.join(/*turbopackIgnore: true*/ root, "reports");
  if (!fs.existsSync(reportsRoot)) {
    throw new Error(`Required source directory 'reports' is missing at: ${reportsRoot}`);
  }
  return reportsRoot;
}
