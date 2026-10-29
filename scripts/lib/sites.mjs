// Intake criteria for AwesomeDS/data/sites.json (recommended sites).
// Pure functions only. The CLI is scripts/sites.mjs; the rules are written
// out in Knowledge/research/recommended-sites.md.

export const CATEGORIES = ["component-library", "animation", "loading", "gallery", "resource", "skill"];
/** Categories whose entries are installable code: they need a repository and a license. */
export const CODE_CATEGORIES = ["component-library", "animation", "loading", "skill"];
/**
 * Fields that would say how or by whom an entry was found (a timeline, saves, likes).
 * The dataset is public, so they are rejected by name: neither the intake nor the
 * weekly refresh may write them back.
 */
export const PROVENANCE_KEYS = ["via", "source_post", "sourcePost", "bookmark", "bookmarked", "like", "liked", "savedBy", "foundBy", "provenance"];
export const MAX_AGE_MONTHS = 12;
export const MIN_STARS = 1000;
export const MAX_DESCRIPTION = 80;

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const REPO_RE = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/;
const JA_RE = /[\u3040-\u30ff\u3400-\u9fff]/;
// Hosts that are not a primary source: link shorteners and social posts.
const SECONDARY_HOSTS = ["t.co", "bit.ly", "x.com", "twitter.com", "lnkd.in", "buff.ly", "goo.gl", "tinyurl.com"];
const UNKNOWN_LICENSES = ["", "NOASSERTION", "NONE", "OTHER"];
/** Every field an entry may carry. Anything else (a note, who saved it) fails the check. */
export const ENTRY_KEYS = ["id", "name", "url", "category", "description", "repo", "license", "licenseUrl", "publisher", "stars", "lastUpdated", "source", "addedAt", "archived", "deprecated"];
const DEPRECATED_RE = /\b(deprecated|unmaintained|no longer maintained|not maintained)\b/i;

/** Lower-case host without www, path without a trailing slash, no query or hash. */
export function normalizeUrl(url) {
  try {
    const u = new URL(url);
    const path = u.pathname.replace(/\/+$/, "");
    return `${u.hostname.replace(/^www\./, "").toLowerCase()}${path.toLowerCase()}`;
  } catch {
    return String(url).toLowerCase();
  }
}

export function slugify(name) {
  return String(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** The date `months` months before `date` (YYYY-MM-DD). */
export function monthsBefore(date, months) {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCMonth(d.getUTCMonth() - months);
  return d.toISOString().slice(0, 10);
}

function isHttps(url) {
  try {
    return new URL(url).protocol === "https:";
  } catch {
    return false;
  }
}

function host(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

export function licenseKnown(license) {
  return typeof license === "string" && !UNKNOWN_LICENSES.includes(license.trim().toUpperCase());
}

/** SPDX short id (MIT, Apache-2.0, AGPL-3.0). Anything else needs an https licenseUrl. */
const SPDX_ID_RE = /^[A-Za-z0-9][A-Za-z0-9.+-]*$/;
export function licenseHasUrlIfNeeded(license, licenseUrl) {
  if (!licenseKnown(license)) return false;
  if (SPDX_ID_RE.test(license.trim())) return true;
  return isHttps(licenseUrl);
}

/**
 * Problems with one entry, checked without the network.
 * `checkedAt` is the date the dataset was last checked live (meta.updated);
 * freshness is measured from that date so the result does not depend on today.
 */
export function entryProblems(e, { checkedAt } = {}) {
  const p = [];
  const id = e?.id ?? "?";
  const need = (k) => {
    if (e[k] === undefined || e[k] === null || e[k] === "") p.push(`${id}: ${k} missing`);
  };
  ["id", "name", "url", "category", "description", "source", "addedAt"].forEach(need);
  if (e.id && e.id !== slugify(e.id)) p.push(`${id}: id must be lower-case kebab`);
  if (e.category && !CATEGORIES.includes(e.category)) p.push(`${id}: category ${e.category} is not one of ${CATEGORIES.join(", ")}`);
  for (const k of ["url", "source"]) {
    if (e[k] && !isHttps(e[k])) p.push(`${id}: ${k} is not an https URL`);
  }
  for (const k of ["url", "source"]) {
    if (e[k] && SECONDARY_HOSTS.includes(host(e[k]))) p.push(`${id}: ${k} ${host(e[k])} is not a primary source`);
  }
  for (const k of Object.keys(e ?? {})) {
    if (PROVENANCE_KEYS.includes(k)) p.push(`${id}: provenance field ${k} is not allowed`);
    else if (!ENTRY_KEYS.includes(k)) p.push(`${id}: unknown field ${k}`);
  }
  if (e.description) {
    if (!JA_RE.test(e.description)) p.push(`${id}: description is not Japanese`);
    if (e.description.length > MAX_DESCRIPTION) p.push(`${id}: description longer than ${MAX_DESCRIPTION} characters`);
    if (/[—\n]/.test(e.description)) p.push(`${id}: description has an em dash or a line break`);
    if (/@[A-Za-z0-9_]{2,}/.test(e.description)) p.push(`${id}: description mentions an account handle`);
  }
  if (e.addedAt && !DATE_RE.test(e.addedAt)) p.push(`${id}: addedAt is not YYYY-MM-DD`);
  if (e.lastUpdated && !DATE_RE.test(e.lastUpdated)) p.push(`${id}: lastUpdated is not YYYY-MM-DD`);

  const code = CODE_CATEGORIES.includes(e.category);
  if (e.repo !== null && e.repo !== undefined && !REPO_RE.test(e.repo)) p.push(`${id}: repo is not owner/name`);
  if (code && !e.repo) p.push(`${id}: ${e.category} needs a GitHub repo`);
  if (code && !licenseKnown(e.license)) p.push(`${id}: license unknown`);
  else if (e.license && !licenseKnown(e.license)) p.push(`${id}: license ${e.license} is not a known license`);
  else if (e.license && !licenseHasUrlIfNeeded(e.license, e.licenseUrl)) p.push(`${id}: non-SPDX license needs licenseUrl`);
  if (e.licenseUrl && !isHttps(e.licenseUrl)) p.push(`${id}: licenseUrl is not an https URL`);
  if (e.archived) p.push(`${id}: repository is archived`);
  if (e.deprecated) p.push(`${id}: marked deprecated`);

  if (e.repo) {
    if (typeof e.stars !== "number" || e.stars < 0) p.push(`${id}: stars missing`);
    else if (e.stars < MIN_STARS && !e.publisher) p.push(`${id}: fewer than ${MIN_STARS} stars and no publisher`);
    if (!e.lastUpdated) p.push(`${id}: lastUpdated missing`);
    else if (checkedAt && e.lastUpdated < monthsBefore(checkedAt, MAX_AGE_MONTHS)) p.push(`${id}: last updated ${e.lastUpdated}, older than ${MAX_AGE_MONTHS} months before ${checkedAt}`);
  } else if (!e.publisher) {
    p.push(`${id}: a site without a repo needs a publisher`);
  }
  return p;
}

/** Problems with the whole dataset (shape, every entry, duplicates). */
export function datasetProblems(doc) {
  const p = [];
  if (!doc?.meta) return ["meta missing"];
  for (const k of ["description", "updated", "sources", "license", "criteria"]) if (!doc.meta[k]) p.push(`meta.${k} missing`);
  if (doc.meta.updated && !DATE_RE.test(doc.meta.updated)) p.push("meta.updated is not YYYY-MM-DD");
  if (!Array.isArray(doc.sites)) return [...p, "sites is not an array"];
  if (JSON.stringify(doc.meta.categories) !== JSON.stringify(CATEGORIES)) p.push(`meta.categories must be ${CATEGORIES.join(", ")}`);
  for (const c of CATEGORIES) {
    const n = doc.sites.filter((e) => e.category === c).length;
    if (doc.meta.counts?.[c] !== n) p.push(`meta.counts.${c} is ${doc.meta.counts?.[c]}, the rows have ${n}`);
  }
  const seen = { id: new Map(), url: new Map(), repo: new Map() };
  for (const e of doc.sites) {
    p.push(...entryProblems(e, { checkedAt: doc.meta.updated }));
    const keys = { id: e.id, url: e.url && normalizeUrl(e.url), repo: e.repo && e.repo.toLowerCase() };
    for (const [k, v] of Object.entries(keys)) {
      if (!v) continue;
      if (seen[k].has(v)) p.push(`${e.id}: duplicate ${k} (same as ${seen[k].get(v)})`);
      else seen[k].set(v, e.id);
    }
  }
  return p;
}

/**
 * Parse the paste-in candidate format. One candidate per line:
 *   category | url | name | 一行説明 | key=value ...
 * Blank lines and lines starting with # are ignored. Optional keys:
 * repo, license, licenseUrl, publisher, source. Anything else is rejected,
 * so a handoff cannot smuggle in extra (personal) fields.
 */
export const CANDIDATE_KEYS = ["repo", "license", "licenseUrl", "publisher", "source"];
export function parseCandidates(text) {
  const out = [];
  const errors = [];
  // Keys whose values may contain underscores that are not spaces (URLs, repo ids).
  const rawKeys = new Set(["repo", "licenseUrl", "source"]);
  text.split(/\r?\n/).forEach((raw, i) => {
    const line = raw.trim();
    if (!line || line.startsWith("#")) return;
    const cells = line.split("|").map((c) => c.trim());
    if (cells.length < 4) {
      errors.push(`line ${i + 1}: expected "category | url | name | description", got ${cells.length} fields`);
      return;
    }
    const [category, url, name, description, ...rest] = cells;
    const c = { line: i + 1, category, url, name, description };
    let rejected = false;
    for (const kv of rest.join(" ").split(/\s+/).filter(Boolean)) {
      const m = kv.match(/^([A-Za-z_]+)=(.+)$/);
      if (m && PROVENANCE_KEYS.includes(m[1])) {
        errors.push(`line ${i + 1}: provenance field ${m[1]} is not allowed`);
        rejected = true;
        continue;
      }
      if (!m || !CANDIDATE_KEYS.includes(m[1])) {
        errors.push(`line ${i + 1}: unknown option ${kv}`);
        rejected = true;
        continue;
      }
      c[m[1]] = rawKeys.has(m[1]) ? m[2] : m[2].replace(/_/g, " ");
    }
    if (rejected) return;
    if (!c.repo) {
      const gh = url.match(/^https:\/\/github\.com\/([^/\s]+\/[^/\s#?]+)/);
      if (gh) c.repo = gh[1].replace(/\.git$/, "");
    }
    out.push(c);
  });
  return { candidates: out, errors };
}

/**
 * Build a dataset entry from a candidate and what the live check found.
 * `gh`: GitHub repo JSON or null.
 */
export function buildEntry(c, { today, gh }) {
  const repo = gh ? gh.full_name : c.repo ?? null;
  const spdx = gh?.license?.spdx_id ?? null;
  // A license written in the candidate wins: GitHub reports "MIT + Commons Clause" as NOASSERTION or MIT.
  const license = c.license ?? (licenseKnown(spdx) ? spdx : null);
  const e = {
    id: entryId(c),
    name: c.name,
    url: c.url,
    category: c.category,
    description: c.description,
    repo,
    license,
    ...(c.licenseUrl ? { licenseUrl: c.licenseUrl } : {}),
    ...(c.publisher ? { publisher: c.publisher } : {}),
    stars: gh ? gh.stargazers_count : null,
    lastUpdated: gh?.pushed_at ? gh.pushed_at.slice(0, 10) : null,
    source: c.source ?? (repo ? `https://github.com/${repo}` : c.url),
    addedAt: today,
  };
  if (gh?.archived) e.archived = true;
  if (gh?.description && DEPRECATED_RE.test(gh.description)) e.deprecated = true;
  return e;
}

/** Id from the name; a name with no Latin letters falls back to host and path, so two pages on one host differ. */
export function entryId(c) {
  if (slugify(c.name)) return slugify(c.name);
  try {
    const u = new URL(c.url);
    return slugify(`${u.hostname.replace(/^www\./, "")}${u.pathname}`);
  } catch {
    return slugify(c.url);
  }
}

/** Problems found by the live check, beyond the offline rules. */
export function liveProblems(c, { live, gh, ghError, licenseLive }) {
  const p = [];
  const id = slugify(c.name ?? c.url);
  if (!live || live.error) p.push(`${id}: url did not load (${live?.error ?? "no response"})`);
  else if (live.status !== 200) p.push(`${id}: url answered ${live.status}, expected 200`);
  else if (live.finalUrl && host(live.finalUrl) !== host(c.url)) p.push(`${id}: url moved to ${live.finalUrl}; use the new address`);
  if (c.licenseUrl && licenseLive) {
    if (licenseLive.error) p.push(`${id}: licenseUrl did not load (${licenseLive.error})`);
    else if (licenseLive.status !== 200) p.push(`${id}: licenseUrl answered ${licenseLive.status}, expected 200`);
  }
  if (c.repo && ghError) p.push(`${id}: GitHub repo ${c.repo} not readable (${ghError})`);
  if (gh && c.repo && gh.full_name.toLowerCase() !== c.repo.toLowerCase()) p.push(`${id}: repo ${c.repo} is now ${gh.full_name}; use the new name`);
  return p;
}

// Errors that say nothing about the site itself: timeouts, resets, DNS retry.
const NET_TRANSIENT = "timeout|TimeoutError|aborted|UND_ERR_CONNECT_TIMEOUT|UND_ERR_HEADERS_TIMEOUT|UND_ERR_BODY_TIMEOUT|UND_ERR_ABORTED|UND_ERR_SOCKET|ETIMEDOUT|ECONNRESET|EAI_AGAIN";
const TRANSIENT_RE = new RegExp(
  // A site: bot walls, rate limits, 5xx. GitHub: also 401 (our token, not the repo).
  `answered (403|429|5\\d\\d)|did not load \\([^)]*(${NET_TRANSIENT})|not readable \\((401|403|429|5\\d\\d|[^)]*(${NET_TRANSIENT}))`,
);
/**
 * True when a failure may pass on the next run (rate limits, timeouts, 5xx, a bad GitHub token).
 * A dead host (ENOTFOUND, ECONNREFUSED, a bad certificate) is a real failure.
 */
export function isTransient(problem) {
  return TRANSIENT_RE.test(problem);
}
