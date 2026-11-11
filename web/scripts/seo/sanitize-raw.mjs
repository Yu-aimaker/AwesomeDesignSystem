// The browser bundle imports Knowledge markdown through Vite's raw query.
// Sanitize that module before it is bundled. The files in the repo stay intact.
import { readFileSync } from "node:fs";
import { publishKnowledge } from "./hygiene.mjs";

function rawMarkdownPath(id) {
  const queryAt = id.indexOf("?");
  if (queryAt < 0) return "";
  const file = id.slice(0, queryAt);
  const params = new URLSearchParams(id.slice(queryAt + 1));
  if (!params.has("raw") || !file.endsWith(".md")) return "";
  const normalized = file.replaceAll("\\", "/");
  if (!normalized.includes("/Knowledge/") && !normalized.includes("/AwesomeDS/foundations/")) return "";
  return file;
}

export function sanitizeKnowledgeRaw() {
  return {
    name: "sanitize-knowledge-raw",
    enforce: "pre",
    load(id) {
      const file = rawMarkdownPath(id);
      if (!file) return null;
      return `export default ${JSON.stringify(publishKnowledge(readFileSync(file, "utf8")))}`;
    },
  };
}
