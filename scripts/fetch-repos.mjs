#!/usr/bin/env node
// Refreshes AwesomeDS/data/repos.json: GitHub star ranking of design / AI-frontend open source.
//   - a curated list of repositories (below) with a category each
//   - plus the top 20 results of the GitHub search API for topic:design-system sorted by stars
// Run: node scripts/fetch-repos.mjs [--seed <file.json>] [--no-fetch]
//   GITHUB_TOKEN / GH_TOKEN  raise the rate limit from 60/h to 5000/h.
//   --seed <file>            merge an array of GitHub API repository objects as if fetched (offline bootstrap).
//   --no-fetch               do not touch the network (use with --seed).
// Robustness: any failure keeps the previous entry from the existing file and is recorded in meta.fetchErrors.
// The file is only written when every curated repo has an entry (fetched, seeded or previous), so the site never
// receives a partial list.
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(root, "AwesomeDS/data/repos.json");
const args = process.argv.slice(2);
const seedPath = args.includes("--seed") ? args[args.indexOf("--seed") + 1] : null;
const NO_FETCH = args.includes("--no-fetch");
const TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || "";
const TOPIC_QUERY = "topic:design-system";
const TOPIC_TOP = 20;
const MAX_WAIT_MS = 15 * 60 * 1000;

// owner/name -> category. Categories are the site's facets.
export const CURATED = {
  // component libraries
  "shadcn-ui/ui": "component-library", "radix-ui/themes": "component-library", "mantinedev/mantine": "component-library",
  "chakra-ui/chakra-ui": "component-library", "mui/material-ui": "component-library", "ant-design/ant-design": "component-library",
  "cschroeter/park-ui": "component-library", "saadeghi/daisyui": "component-library", "themesberg/flowbite": "component-library",
  "heroui-inc/heroui": "component-library", "tremorlabs/tremor": "component-library", "nuxt/ui": "component-library",
  "huntabyte/shadcn-svelte": "component-library", "unovue/shadcn-vue": "component-library", "primer/css": "component-library",
  "carbon-design-system/carbon": "component-library", "material-components/material-web": "component-library",
  // headless
  "radix-ui/primitives": "headless", "mui/base-ui": "headless", "adobe/react-spectrum": "headless", "chakra-ui/ark": "headless",
  "tailwindlabs/headlessui": "headless", "dip/cmdk": "headless", "emilkowalski/sonner": "headless", "emilkowalski/vaul": "headless",
  "TanStack/table": "headless", "TanStack/form": "headless", "react-hook-form/react-hook-form": "headless", "colinhacks/zod": "headless",
  // animation
  "motiondivision/motion": "animation", "greensock/GSAP": "animation", "juliangarnier/anime": "animation", "airbnb/lottie-web": "animation",
  "LottieFiles/dotlottie-web": "animation", "rive-app/rive-wasm": "animation", "theatre-js/theatre": "animation",
  "formkit/auto-animate": "animation", "pmndrs/react-spring": "animation", "Wombosvideo/tw-animate-css": "animation",
  // animated component collections
  "magicuidesign/magicui": "animated-components", "DavidHDev/react-bits": "animated-components", "ibelick/motion-primitives": "animated-components",
  "codse/animata": "animated-components", "nolly-studio/cult-ui": "animated-components",
  // 3d
  "mrdoob/three.js": "3d", "pmndrs/react-three-fiber": "3d", "pmndrs/drei": "3d", "pmndrs/uikit": "3d",
  // icons
  "lucide-icons/lucide": "icons", "phosphor-icons/homepage": "icons", "tabler/tabler-icons": "icons", "hugeicons/hugeicons": "icons",
  "radix-ui/icons": "icons", "tailwindlabs/heroicons": "icons", "iconoir-icons/iconoir": "icons",
  // data viz
  "recharts/recharts": "dataviz", "airbnb/visx": "dataviz", "plouc/nivo": "dataviz", "observablehq/plot": "dataviz", "d3/d3": "dataviz",
  // styling
  "tailwindlabs/tailwindcss": "styling", "chakra-ui/panda": "styling", "vanilla-extract-css/vanilla-extract": "styling",
  "joe-bell/cva": "styling", "heroui-inc/tailwind-variants": "styling",
  // design tokens
  "style-dictionary/style-dictionary": "design-tokens", "tokens-studio/figma-plugin": "design-tokens", "design-tokens/community-group": "design-tokens",
  "figma/code-connect": "design-tokens",
  // fonts
  "vercel/geist-font": "fonts", "rsms/inter": "fonts", "notofonts/noto-cjk": "fonts", "JetBrains/JetBrainsMono": "fonts",
  "tonsky/FiraCode": "fonts", "eigilnikolajsen/commit-mono": "fonts", "google/fonts": "fonts", "fontsource/fontsource": "fonts",
  // design-md and skills for agents
  "voltagent/awesome-design-md": "agent-skills", "kzhrknt/awesome-design-md-jp": "agent-skills", "Leonxlnx/taste-skill": "agent-skills",
  "ibelick/ui-skills": "agent-skills", "anthropics/skills": "agent-skills", "anthropics/claude-code": "agent-skills",
  "mattpocock/skills": "agent-skills", "obra/superpowers": "agent-skills", "vercel-labs/agent-skills": "agent-skills",
  "vercel-labs/design-systems-to-agent-skills": "agent-skills", "tt-a1i/archify": "agent-skills",
  "GLips/Figma-Context-MCP": "agent-skills", "modelcontextprotocol/servers": "agent-skills",
  // AI UI
  "assistant-ui/assistant-ui": "ai-ui", "vercel/ai-elements": "ai-ui", "CopilotKit/CopilotKit": "ai-ui", "vercel/ai": "ai-ui",
  // design tools
  "excalidraw/excalidraw": "design-tools", "tldraw/tldraw": "design-tools", "penpot/penpot": "design-tools", "storybookjs/storybook": "design-tools",
  // framework and tooling used by the stack map
  "vercel/next.js": "framework", "vitejs/vite": "framework", "withastro/astro": "framework", "TanStack/router": "framework",
  "TanStack/query": "framework", "pmndrs/zustand": "framework", "biomejs/biome": "tooling", "oxc-project/oxc": "tooling",
  "microsoft/playwright": "tooling", "vitest-dev/vitest": "tooling", "aidenybai/react-scan": "tooling",
};

const lower = (s) => s.toLowerCase();
const existing = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : { repos: [] };
const previous = new Map((existing.repos || []).map((r) => [lower(`${r.owner}/${r.name}`), r]));
const fetchErrors = [];
let stopAll = false;

function toEntry(api, category) {
  return {
    owner: api.owner?.login ?? api.full_name.split("/")[0],
    name: api.name ?? api.full_name.split("/")[1],
    url: api.html_url,
    description: api.description ?? null,
    stars: api.stargazers_count ?? null,
    forks: api.forks_count ?? null,
    language: api.language ?? null,
    topics: api.topics ?? [],
    pushedAt: api.pushed_at ?? api.updated_at ?? null,
    license: api.license?.spdx_id ?? null,
    archived: Boolean(api.archived),
    category,
    fetchedAt: new Date().toISOString().slice(0, 10),
  };
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function gh(path) {
  const headers = { Accept: "application/vnd.github+json", "User-Agent": "awesomeds-data", "X-GitHub-Api-Version": "2022-11-28" };
  if (TOKEN) headers.Authorization = `Bearer ${TOKEN}`;
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(`https://api.github.com${path}`, { headers });
    if (res.ok) return res.json();
    const body = await res.text();
    const remaining = res.headers.get("x-ratelimit-remaining");
    const reset = Number(res.headers.get("x-ratelimit-reset")) * 1000;
    if ((res.status === 403 || res.status === 429) && remaining === "0" && reset) {
      const wait = reset - Date.now() + 2000;
      if (wait > MAX_WAIT_MS) throw new Error(`rate limit exhausted; resets in ${Math.round(wait / 60000)} min`);
      console.log(`fetch-repos: rate limited, sleeping ${Math.round(wait / 1000)}s`);
      await sleep(wait);
      continue;
    }
    if (res.status === 403 && /not enabled for this session/i.test(body)) {
      stopAll = true;
      throw new Error("GitHub API blocked in this environment");
    }
    if (res.status === 404) throw new Error("404 not found");
    if (res.status >= 500 || res.status === 429) { await sleep(1500 * (attempt + 1)); continue; }
    throw new Error(`${res.status} ${body.slice(0, 120)}`);
  }
  throw new Error("gave up after 3 attempts");
}

const seeded = new Map();
if (seedPath) {
  const arr = JSON.parse(readFileSync(seedPath, "utf8"));
  for (const api of arr) seeded.set(lower(api.full_name), api);
  console.log(`fetch-repos: seeded ${seeded.size} repositories from ${seedPath}`);
}

const result = new Map(); // key -> entry
let fetched = 0, kept = 0;

// 1. curated list
for (const [full, category] of Object.entries(CURATED)) {
  const key = lower(full);
  const prev = previous.get(key);
  if (seeded.has(key)) { result.set(key, toEntry(seeded.get(key), category)); continue; }
  if (NO_FETCH || stopAll) {
    if (prev) { result.set(key, { ...prev, category }); kept++; }
    else { result.set(key, { owner: full.split("/")[0], name: full.split("/")[1], url: `https://github.com/${full}`, description: null, stars: null, forks: null, language: null, topics: [], pushedAt: null, license: null, archived: false, category, fetchedAt: null, note: "not fetched yet" }); }
    if (!NO_FETCH) fetchErrors.push(`${full}: skipped (API unavailable)`);
    continue;
  }
  try {
    const api = await gh(`/repos/${full}`);
    result.set(key, toEntry(api, category));
    fetched++;
    if (!TOKEN) await sleep(300);
  } catch (e) {
    fetchErrors.push(`${full}: ${e.message}`);
    if (prev) { result.set(key, { ...prev, category }); kept++; }
    else result.set(key, { owner: full.split("/")[0], name: full.split("/")[1], url: `https://github.com/${full}`, description: null, stars: null, forks: null, language: null, topics: [], pushedAt: null, license: null, archived: false, category, fetchedAt: null, note: `fetch failed: ${e.message}` });
  }
}

// 2. topic search (top 20 by stars). Seeded objects tagged with `_topic: true` count as search results.
let topicNames = [];
if (!NO_FETCH && !stopAll) {
  try {
    const res = await gh(`/search/repositories?q=${encodeURIComponent(TOPIC_QUERY)}&sort=stars&order=desc&per_page=${TOPIC_TOP}`);
    for (const api of res.items || []) {
      const key = lower(api.full_name);
      topicNames.push(key);
      if (!result.has(key)) result.set(key, toEntry(api, "topic:design-system"));
      else result.get(key).topics = api.topics ?? result.get(key).topics;
    }
    fetched += (res.items || []).length;
  } catch (e) {
    fetchErrors.push(`search ${TOPIC_QUERY}: ${e.message}`);
  }
}
if (topicNames.length === 0) {
  // fall back to seed entries marked as topic results, then to the previous file's topic entries
  for (const [key, api] of seeded) if (api._topic && !result.has(key)) { result.set(key, toEntry(api, "topic:design-system")); topicNames.push(key); }
  if (topicNames.length === 0) for (const [key, r] of previous) if (r.category === "topic:design-system" && !result.has(key)) { result.set(key, r); topicNames.push(key); kept++; }
}
for (const key of topicNames) {
  const r = result.get(key);
  if (r && !r.inTopicTop) r.inTopicTop = true;
}

const repos = [...result.values()].sort((a, b) => (b.stars ?? -1) - (a.stars ?? -1) || a.name.localeCompare(b.name));
const missing = repos.filter((r) => r.stars === null).length;
if (repos.length < Object.keys(CURATED).length) {
  console.error("fetch-repos: internal error, fewer entries than curated list; not writing");
  process.exit(1);
}
const out = {
  meta: {
    description: "GitHub star ranking of design and AI-frontend open source: a curated list (component libraries, headless, animation, icons, tokens, fonts, agent skills, AI UI, tools) plus the top 20 GitHub search results for topic:design-system. Stars, forks, language, topics and pushedAt come from the GitHub REST API. Entries with stars: null could not be fetched yet.",
    updated: new Date().toISOString().slice(0, 10),
    sources: ["https://api.github.com/repos/{owner}/{name}", `https://api.github.com/search/repositories?q=${TOPIC_QUERY}&sort=stars`],
    license: "Repository metadata is public GitHub data; each repository keeps its own license (see `license`).",
    generator: "scripts/fetch-repos.mjs",
    counts: { total: repos.length, curated: Object.keys(CURATED).length, topicTop: topicNames.length, fetched, keptFromPrevious: kept, missing },
    categories: [...new Set(repos.map((r) => r.category))].sort(),
    fetchErrors,
  },
  repos,
};
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(out, null, 2) + "\n");
console.log(`fetch-repos: wrote ${repos.length} repos (${fetched} fetched, ${kept} kept, ${missing} without stars, ${fetchErrors.length} errors) -> ${OUT}`);
if (fetchErrors.length) console.log("fetch-repos: errors:\n  " + fetchErrors.slice(0, 20).join("\n  ") + (fetchErrors.length > 20 ? `\n  ...${fetchErrors.length - 20} more` : ""));
