import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const readmes = [
  "README.md",
  "README.ja.md",
  "README.es.md",
  "README.ko.md",
  "README.zh-Hans.md",
] as const;

const requiredContracts = [
  "assets/diagram-evidence-loop.svg",
  "assets/diagram-canon-to-verify.svg",
  "reports/release-readiness.json",
  "design-system/foundations/tokens.md",
  "SECURITY.md",
  "pnpm qa:core",
] as const;

const documents = await Promise.all(
  readmes.map(async (file) => ({
    file,
    text: await readFile(path.join(root, file), "utf8"),
  })),
);

const headingShape = (text: string) => {
  const headings = text.match(/^#{2,3} .+$/gm) ?? [];
  return {
    h2: headings.filter((heading) => heading.startsWith("## ")).length,
    h3: headings.filter((heading) => heading.startsWith("### ")).length,
  };
};

const canonicalShape = headingShape(documents[0].text);
const failures: string[] = [];

for (const { file, text } of documents) {
  const shape = headingShape(text);
  if (shape.h2 !== canonicalShape.h2 || shape.h3 !== canonicalShape.h3) {
    failures.push(
      `${file}: heading shape ${shape.h2} H2 / ${shape.h3} H3; expected ${canonicalShape.h2} / ${canonicalShape.h3}`,
    );
  }
  for (const contract of requiredContracts) {
    if (!text.includes(contract)) failures.push(`${file}: missing ${contract}`);
  }
  if (!/awesome-design-system\.yumaker\.studio\/(?:en|ja)\/reports/.test(text)) {
    failures.push(`${file}: missing localized public Reports URL`);
  }
  for (const peer of readmes) {
    if (peer !== file && !text.includes(peer)) {
      failures.push(`${file}: language switch is missing ${peer}`);
    }
  }
}

if (failures.length > 0) {
  throw new Error(`README localization contract failed:\n${failures.join("\n")}`);
}

console.log(
  `verified ${readmes.length} README contracts: ${canonicalShape.h2} H2 / ${canonicalShape.h3} H3, shared reports, security, tokens, diagrams, commands, and language links`,
);
