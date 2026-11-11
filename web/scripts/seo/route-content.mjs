// Readable no-JS content from the same files the pages already read.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { esc, escAttr, mdToHtml, safeUrl } from "./markdown.mjs";
import { publishText } from "./hygiene.mjs";

function paragraph(text) {
  const value = String(text ?? "").trim();
  return value ? `<p>${esc(value)}</p>` : "";
}

export function homeBlock(copy) {
  const lines = [
    copy.lead,
    copy.knobsHint,
    copy.specimens,
    copy.galleries,
    copy.guidelines,
    copy.guidelinesLead,
    copy.use,
    copy.useLead,
    copy.fonts,
    copy.palettes,
    copy.components,
    copy.motion,
    copy.stack,
    copy.rankings,
  ];
  return `<section>${lines.map(paragraph).join("")}</section>`;
}

export function sitesBlock(repo) {
  const data = JSON.parse(readFileSync(join(repo, "AwesomeDS/data/sites.json"), "utf8"));
  const items = data.sites.map((site) => {
    const url = safeUrl(site.url);
    const name = esc(site.description ? `${site.name}` : site.name);
    const label = url ? `<a href="${escAttr(url)}">${name}</a>` : name;
    return `<li>${label}: ${esc(site.description ?? "")}</li>`;
  });
  return `<section><h2>Sites</h2><ul>${items.join("")}</ul></section>`;
}

export function componentsBlock(webRoot) {
  const source = readFileSync(join(webRoot, "src/ds/registry.tsx"), "utf8");
  const items = [...source.matchAll(/id: "([^"]+)",\n\s*name: "([^"]+)",\n\s*group: "([^"]+)",\n\s*maturity: "([^"]+)"/g)];
  if (items.length < 40) throw new Error(`component catalog parse found ${items.length}`);
  const list = items.map((match) => `<li>${esc(match[2])} (${esc(match[1])})</li>`).join("");
  return `<section><h2>Components</h2><ul>${list}</ul></section>`;
}

function foundationBody(repo, slug) {
  const file = join(repo, "AwesomeDS/foundations", `${slug}.md`);
  if (!existsSync(file)) return "";
  const raw = readFileSync(file, "utf8").replace(/^---[\s\S]*?---\n/, "");
  return publishText(raw.replace(/^#\s+[^\n]*\n/, ""));
}

export function foundationBlock(repo, path) {
  if (path === "/foundations") {
    const dir = join(repo, "AwesomeDS/foundations");
    const items = readdirSync(dir)
      .filter((name) => name.endsWith(".md"))
      .sort()
      .map((name) => {
        const raw = readFileSync(join(dir, name), "utf8");
        const title = /^#\s+(.+)$/m.exec(raw)?.[1] ?? name.replace(/\.md$/, "");
        return `<li>${esc(title)}</li>`;
      });
    return `<section lang="en"><ul>${items.join("")}</ul></section>`;
  }
  const slug = path.startsWith("/foundations/") ? path.slice("/foundations/".length) : "";
  if (!slug || slug.includes("/")) return "";
  const body = foundationBody(repo, slug);
  return body ? `<section lang="en">${mdToHtml(body)}</section>` : "";
}

export function routeContentProblems(dist) {
  const problems = [];
  const expect = (rel, phrase) => {
    let html = "";
    try {
      html = readFileSync(join(dist, rel), "utf8");
    } catch {
      problems.push(`${rel} is missing`);
      return;
    }
    if (!html.includes(phrase)) problems.push(`${rel} missing ${JSON.stringify(phrase)}`);
  };
  expect("sites/index.html", "shadcn/ui");
  expect("en/sites/index.html", "shadcn/ui");
  expect("components/index.html", "Button (button)");
  expect("en/components/index.html", "Button (button)");
  expect("foundations/color/index.html", "Neutrals are true gray");
  expect("en/foundations/color/index.html", "Neutrals are true gray");
  expect("index.html", "白地、黒文字、アクセント 1 色。AI が書く UI の既定値。");
  expect("en/index.html", "White canvas, black ink, one accent.");
  return problems;
}
