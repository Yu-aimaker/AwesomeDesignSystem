// robots.txt for the production host.
// Cloudflare may prepend a managed block (Bot Preference Sync) that already
// has `User-agent: *` / `Allow: /` plus Disallow groups for some training
// crawlers. This file does not add a second `User-agent: *` group, so it
// does not fight that Allow. Agents omitted here stay allowed by default
// (RFC 9309) when the managed block is absent.
//
// Training agents that the managed block also disallows are repeated with
// the same Disallow. That is the same directive, not an Allow/Disallow clash.

export const ORIGIN = "https://awesomeds.yumaker.studio";

/** Training-only crawlers. Primary docs checked November 2026. */
export const TRAINING = [
  { agent: "GPTBot", doc: "https://platform.openai.com/docs/bots" },
  { agent: "ClaudeBot", doc: "https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler" },
  { agent: "Google-Extended", doc: "https://developers.google.com/search/docs/crawling-indexing/overview-google-crawlers" },
  { agent: "Applebot-Extended", doc: "https://support.apple.com/en-us/119829" },
  { agent: "CCBot", doc: "https://commoncrawl.org/ccbot" },
  { agent: "meta-externalagent", doc: "https://developers.facebook.com/docs/sharing/webmasters/web-crawlers/" },
  { agent: "Bytespider", doc: "https://zhanzhang.toutiao.com/" },
];

/**
 * Search crawlers and user-triggered fetchers.
 * PerplexityBot / Perplexity-User are included because Perplexity's docs say
 * PerplexityBot surfaces pages in search and is not used to train foundation
 * models, and Perplexity-User fetches pages for a user's question and is not
 * used for training: https://docs.perplexity.ai/docs/resources/perplexity-crawlers
 * DuckAssistBot is DuckDuckGo's AI-answer crawler and the help page says the
 * data is not used to train models:
 * https://duckduckgo.com/duckduckgo-help-pages/results/duckassistbot
 */
export const SEARCH = [
  { agent: "Googlebot", doc: "https://developers.google.com/search/docs/crawling-indexing/overview-google-crawlers" },
  { agent: "Bingbot", doc: "https://www.bing.com/webmasters/help/which-crawlers-does-bing-use-8c184ec0" },
  { agent: "OAI-SearchBot", doc: "https://platform.openai.com/docs/bots" },
  { agent: "ChatGPT-User", doc: "https://platform.openai.com/docs/bots" },
  { agent: "Claude-SearchBot", doc: "https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler" },
  { agent: "Claude-User", doc: "https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler" },
  { agent: "Applebot", doc: "https://support.apple.com/en-us/119829" },
  { agent: "DuckDuckBot", doc: "https://duckduckgo.com/duckduckgo-help-pages/results/duckduckbot" },
  { agent: "DuckAssistBot", doc: "https://duckduckgo.com/duckduckgo-help-pages/results/duckassistbot" },
  { agent: "PerplexityBot", doc: "https://docs.perplexity.ai/docs/resources/perplexity-crawlers" },
  { agent: "Perplexity-User", doc: "https://docs.perplexity.ai/docs/resources/perplexity-crawlers" },
];

export function renderRobots() {
  const lines = [
    "# AwesomeDS. Training crawlers are disallowed. Search and user-triggered fetchers are allowed.",
    "# This file does not name the wildcard agent. Cloudflare may prepend a managed block that already allows every other agent.",
    "# Agents not named in this file are allowed by default.",
    "",
  ];
  for (const bot of TRAINING) {
    lines.push(`User-agent: ${bot.agent}`, "Disallow: /", "");
  }
  for (const bot of SEARCH) {
    lines.push(`User-agent: ${bot.agent}`, "Allow: /", "");
  }
  lines.push(`Sitemap: ${ORIGIN}/sitemap.xml`, "");
  return lines.join("\n");
}

/** robots.txt groups. Blank lines and comments separate nothing else; rules attach to the open group. */
export function parseGroups(text) {
  const groups = [];
  let current = null;
  for (const raw of String(text).split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const ua = /^user-agent\s*:\s*(.+)$/i.exec(line);
    if (ua) {
      if (!current || current.rules.length) {
        current = { agents: [], rules: [] };
        groups.push(current);
      }
      current.agents.push(ua[1].trim());
      continue;
    }
    if (!current) continue;
    const rule = /^(allow|disallow)\s*:\s*(.*)$/i.exec(line);
    if (rule) current.rules.push({ type: rule[1].toLowerCase(), path: rule[2].trim() });
  }
  return groups;
}

export function starDisallowsAll(text) {
  return parseGroups(text).some(
    (group) => group.agents.some((agent) => agent === "*") && group.rules.some((rule) => rule.type === "disallow" && rule.path === "/"),
  );
}

export function agentRule(text, agent) {
  const hits = rootRules(text, agent);
  const disallowAll = hits.includes("disallow");
  const allowAll = hits.includes("allow");
  if (disallowAll && allowAll) return "conflict";
  if (!hits.length) return null;
  if (disallowAll) return "disallow";
  if (allowAll) return "allow";
  return "other";
}

/** Allow/Disallow for `/` across every group that names this agent. */
export function rootRules(text, agent) {
  const name = agent.toLowerCase();
  const hits = [];
  for (const group of parseGroups(text)) {
    if (!group.agents.some((value) => value.toLowerCase() === name)) continue;
    for (const rule of group.rules) {
      if (rule.path === "/") hits.push(rule.type);
    }
  }
  return hits;
}
