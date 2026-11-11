// Drop provenance that must stay in the repo but not in public HTML or llms-full.txt.

const STATUS_URL = /https?:\/\/(?:www\.)?(?:(?:x|twitter)\.com|api\.fxtwitter\.com)\/[^\s<>"'`)\]]*\/status\/\d+[^\s<>"'`)\]]*/gi;

const CONSUMER_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "yahoo.co.jp",
  "ymail.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "msn.com",
  "proton.me",
  "protonmail.com",
  "pm.me",
  "aol.com",
]);

const ROLE_LOCAL = /^(sales|support|security|info|contact|hello|press|admin|noreply|no-reply|team|help|legal|privacy|abuse)$/i;
const EXAMPLE_DOMAINS = new Set(["example.com", "example.org", "example.net", "company.com"]);

export function publishText(text) {
  return String(text).replace(STATUS_URL, "");
}

function isStatusUrl(url) {
  return /https?:\/\/(?:www\.)?(?:(?:x|twitter)\.com|api\.fxtwitter\.com)\/[^\s<>"'`)\]]*\/status\/\d+/i.test(url);
}

function unquote(value) {
  const text = String(value ?? "").trim();
  if ((text.startsWith('"') && text.endsWith('"')) || (text.startsWith("'") && text.endsWith("'"))) return text.slice(1, -1);
  return text;
}

/** Drop a `- url:` record only when that URL is a status link. Sibling records stay. */
function dropStatusSourceRecords(yaml) {
  const lines = yaml.split("\n");
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const item = /^(\s*)- url:\s*(.*?)\s*$/.exec(lines[i]);
    if (!item) {
      out.push(lines[i]);
      i++;
      continue;
    }
    const indent = item[1].length;
    const block = [lines[i]];
    i++;
    while (i < lines.length && lines[i].trim()) {
      const nextIndent = lines[i].length - lines[i].trimStart().length;
      if (nextIndent <= indent) break;
      block.push(lines[i]);
      i++;
    }
    if (!isStatusUrl(unquote(item[2]))) out.push(...block);
  }
  return out.join("\n");
}

/**
 * Browser copy of a Knowledge or foundation note.
 * Status URLs are removed. A source record is removed only when its URL is a status link.
 * Every other source record stays. The repository file is left unchanged.
 */
export function publishKnowledge(raw) {
  const text = String(raw).replace(/^\uFEFF/, "");
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
  if (!match) return publishText(text);
  const front = dropStatusSourceRecords(match[1].replace(/\r\n/g, "\n").replace(/\r/g, "\n"));
  return publishText(`---\n${front}\n---${text.slice(match[0].length)}`);
}

function personalEmail(email) {
  const [local, domain] = email.split("@");
  if (!domain) return false;
  const host = domain.toLowerCase();
  if (host === "users.noreply.github.com" || EXAMPLE_DOMAINS.has(host)) return false;
  if (CONSUMER_DOMAINS.has(host)) return true;
  return !ROLE_LOCAL.test(local);
}

/** Problems in a generated artifact. "Pyramid / Funnel" is a category name. */
export function hygieneProblems(text, label) {
  const problems = [];
  const source = String(text).replace(/\\\//g, "/");
  if (/https?:\/\/(?:www\.)?(?:(?:x|twitter)\.com|api\.fxtwitter\.com)\/[^\s<>"']*\/status\/\d+/i.test(source)) {
    problems.push(`${label} contains an X or Twitter status URL`);
  }
  for (const email of source.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g) ?? []) {
    if (personalEmail(email)) problems.push(`${label} contains a personal email`);
  }
  const names = source.replaceAll("Pyramid / Funnel", "");
  for (const name of ["STARK", "Jarvis", "NexTie", "Sir", "Funnel"]) {
    if (new RegExp(`\\b${name}\\b`).test(names)) problems.push(`${label} contains ${name}`);
  }
  return problems;
}
