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
  const source = String(text);
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
