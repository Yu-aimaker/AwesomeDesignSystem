import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { flagshipProblems, parseFlagshipSystems } from "../lib/flagship-catalog.mjs";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

function catalog(entries) {
  return `export const flagshipSystems: DesignSystemRef[] = [\n${entries.join(",\n")}\n];\n`;
}

function card(body) {
  return `  {\n${body}\n  }`;
}

const okCard = card(`    id: "apple-hig",
    url: "https://developer.apple.com/design/human-interface-guidelines",
    image: "/ogp/apple-hig.jpg",
    category: "platform",
    ogp: {
      status: "ok",
      image: "/ogp/apple-hig.jpg",
      sourceUrl: "https://developer.apple.com/tutorials/developer-og.jpg",
    },
    absorption: { level: "adopted", knowledge: "platform-guidelines/apple-hig", takeaway: { ja: "a", en: "b" } },`);

const posterCard = card(`    id: "uswds",
    url: "https://designsystem.digital.gov/",
    image: "",
    category: "government",
    ogp: {
      status: "missing",
      note: "公式 og:image は 200x200 ロゴのためポスターを表示。",
    },
    absorption: { level: "reference", knowledge: "platform-guidelines/uswds", takeaway: { ja: "a", en: "b" } },`);

test("parses an ok card and a poster card", () => {
  const entries = parseFlagshipSystems(catalog([okCard, posterCard]));
  assert.equal(entries.length, 2);
  assert.equal(entries[0].sourceUrl, "https://developer.apple.com/tutorials/developer-og.jpg");
  assert.equal(entries[1].note.includes("ポスター"), true);
  assert.deepEqual(flagshipProblems(catalog([okCard, posterCard])), []);
});

test("rejects a card that claims ok without the committed image path", () => {
  const broken = okCard.replace('image: "/ogp/apple-hig.jpg",\n    category', 'image: "",\n    category');
  assert.deepEqual(flagshipProblems(catalog([broken])), ["apple-hig: image"]);
});

test("rejects a poster without a written reason", () => {
  const broken = posterCard.replace(/\n      note: "[^"]+",/, "");
  assert.deepEqual(flagshipProblems(catalog([broken])), ["uswds: note"]);
});

test("rejects a poster that still names a share image", () => {
  const broken = posterCard.replace('image: ""', 'image: "/ogp/uswds.jpg"');
  assert.deepEqual(flagshipProblems(catalog([broken])), ["uswds: poster"]);
});

test("reads a sourceUrl that is wrapped onto the next line", () => {
  const wrapped = okCard.replace(
    'sourceUrl: "https://developer.apple.com/tutorials/developer-og.jpg",',
    'sourceUrl:\n        "https://example.com/og.jpg",',
  );
  assert.equal(parseFlagshipSystems(catalog([wrapped]))[0].sourceUrl, "https://example.com/og.jpg");
});

test("the committed catalog satisfies the contract and each knowledge file exists", () => {
  const source = readFileSync(join(repoRoot, "web/src/lib/design-systems.ts"), "utf8");
  const problems = flagshipProblems(source, (knowledge) => {
    try {
      readFileSync(join(repoRoot, "Knowledge", `${knowledge}.md`));
      return true;
    } catch {
      return false;
    }
  });
  assert.deepEqual(problems, []);
  assert.equal(parseFlagshipSystems(source).length, 27);
});
