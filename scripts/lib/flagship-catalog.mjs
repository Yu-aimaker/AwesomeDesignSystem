// STA-35: /sources flagship cards are committed share images, or a poster with a written reason.
// This checks the catalog text. It does not fetch pages or change the site.

const CATEGORIES = new Set(["platform", "component-library", "company", "government", "cookbook"]);

function sliceSystems(source) {
  const start = source.indexOf("export const flagshipSystems");
  if (start < 0) return "";
  const from = source.slice(start);
  const end = from.indexOf("\n];");
  if (end < 0) return "";
  return from.slice(0, end);
}

function quoted(block, name) {
  const match = block.match(new RegExp(`^    ${name}: "([^"]*)"`, "m"));
  return match ? match[1] : null;
}

function ogpField(ogp, name) {
  const match = ogp.match(new RegExp(`${name}:\\s*(?:\\n\\s*)?"([^"]*)"`));
  return match ? match[1] : "";
}

export function parseFlagshipSystems(source) {
  const body = sliceSystems(source);
  if (!body) return [];
  return body
    .split(/\n  \{\n/)
    .slice(1)
    .map((block) => {
      const ogpStart = block.indexOf("\n    ogp:");
      const absorptionStart = block.indexOf("\n    absorption:");
      const ogp = ogpStart >= 0 ? block.slice(ogpStart, absorptionStart >= 0 ? absorptionStart : undefined) : "";
      return {
        id: quoted(block, "id") ?? "",
        url: quoted(block, "url") ?? "",
        image: quoted(block, "image") ?? "",
        category: quoted(block, "category") ?? "",
        knowledge: block.match(/knowledge: "([^"]+)"/)?.[1] ?? "",
        status: ogpField(ogp, "status"),
        ogpImage: ogpField(ogp, "image"),
        sourceUrl: ogpField(ogp, "sourceUrl"),
        note: ogpField(ogp, "note"),
      };
    });
}

export function flagshipProblems(source, knowledgeExists = () => true) {
  const entries = parseFlagshipSystems(source);
  const problems = [];
  if (entries.length === 0) problems.push("catalog: empty");
  const seen = new Set();
  for (const entry of entries) {
    const id = entry.id || "(no id)";
    if (!entry.id || seen.has(entry.id)) problems.push(`${id}: id`);
    if (entry.id) seen.add(entry.id);
    if (!entry.url.startsWith("https://")) problems.push(`${id}: url`);
    if (!CATEGORIES.has(entry.category)) problems.push(`${id}: category`);
    if (!entry.knowledge || !knowledgeExists(entry.knowledge)) problems.push(`${id}: knowledge`);
    if (entry.status === "ok") {
      const expected = `/ogp/${entry.id}.jpg`;
      if (entry.image !== expected || entry.ogpImage !== expected) problems.push(`${id}: image`);
      if (!entry.sourceUrl.startsWith("https://")) problems.push(`${id}: sourceUrl`);
    } else if (entry.status === "missing") {
      if (entry.image !== "" || entry.ogpImage !== "") problems.push(`${id}: poster`);
      if (!entry.note.trim()) problems.push(`${id}: note`);
    } else {
      problems.push(`${id}: status`);
    }
  }
  return problems;
}
