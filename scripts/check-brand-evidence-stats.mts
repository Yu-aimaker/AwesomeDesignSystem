import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const countJson = async (relative: string) =>
  (await readdir(path.join(root, relative))).filter((name) => name.endsWith(".json"))
    .length;

const [references, rules] = await Promise.all([
  countJson("content/references"),
  countJson("content/canon"),
]);
const readmes = (await readdir(root)).filter(
  (name) => /^README(?:\.[^.]+)?\.md$/.test(name),
);
const failures: string[] = [];

for (const readme of readmes) {
  const text = await readFile(path.join(root, readme), "utf8");
  if (!text.includes(`Reference_Atlas-${references}-`)) {
    failures.push(`${readme}: Reference Atlas badge is not ${references}`);
  }
  if (!text.includes(`canon_rules-${rules}-`)) {
    failures.push(`${readme}: canon rules badge is not ${rules}`);
  }
}

const banner = await readFile(path.join(root, "assets/banner.svg"), "utf8");
if (!banner.includes(`${references} cited sources`)) {
  failures.push(`assets/banner.svg: cited source count is not ${references}`);
}
if (!banner.includes(`${rules} rules`)) {
  failures.push(`assets/banner.svg: rule count is not ${rules}`);
}

const formalEvidenceFiles = [
  {
    path: "docs/completion-audit.md",
    references: `${references} versioned records`,
    rules: `${rules} rules`,
  },
  {
    path: "docs/qa-report.md",
    references: `${references} refs / ${rules} rules`,
    rules: `${references} refs / ${rules} rules`,
  },
] as const;

for (const evidence of formalEvidenceFiles) {
  const text = await readFile(path.join(root, evidence.path), "utf8");
  if (!text.includes(evidence.references)) {
    failures.push(
      `${evidence.path}: Reference Atlas evidence is not ${references}`,
    );
  }
  if (!text.includes(evidence.rules)) {
    failures.push(`${evidence.path}: canon rule evidence is not ${rules}`);
  }
}

if (failures.length) {
  failures.forEach((failure) => console.error(failure));
  process.exitCode = 1;
} else {
  console.log(
    `verified brand evidence stats across ${readmes.length} READMEs, banner, and formal QA evidence: ${references} references, ${rules} rules`,
  );
}
