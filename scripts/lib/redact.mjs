// Detect secrets and private addresses in text that may be logged or published.
// Findings are kind names only. Callers refuse the write; masking is not enough.

const EMAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/;
const RULES = [
  { kind: "email", re: EMAIL_RE },
  { kind: "credential", re: /ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|AKIA[0-9A-Z]{16}|xox[baprs]-[A-Za-z0-9-]{10,}|sk-[A-Za-z0-9]{20,}/ },
  { kind: "credential", re: /Bearer\s+[A-Za-z0-9._-]{8,}/i },
  { kind: "credential", re: /\b(?:api[_-]?key|token|secret|password)\b\s*[:=]\s*\S+/i },
  { kind: "credential", re: /https?:\/\/[^\s/]*:[^\s/@]*@/i },
  { kind: "credential", re: /[?&](?:access_token|token|api_key|client_secret)=/i },
  { kind: "local-path", re: /(?:^|[\s"'`(])(?:\/Users\/|\/home\/|[A-Za-z]:\\)/ },
  { kind: "forbidden-field", re: /(?:^|[\s,{])["']?(?:via|source_post|bookmark|like|email)["']?\s*[:=]/i },
];

export function leakageFindings(text) {
  const found = new Set();
  const value = String(text ?? "");
  for (const rule of RULES) {
    rule.re.lastIndex = 0;
    if (rule.re.test(value)) found.add(rule.kind);
  }
  return [...found];
}

export function constrainField(value, max = 120) {
  const text = String(value ?? "").replace(/\s+/g, " ").trim().slice(0, max);
  if (!text || leakageFindings(text).length) return "";
  return text;
}

export function assertClean(text, label = "text") {
  const kinds = leakageFindings(text);
  if (kinds.length) {
    const error = new Error(`${label} withheld (${kinds.join(", ")})`);
    error.kinds = kinds;
    throw error;
  }
  return text;
}
