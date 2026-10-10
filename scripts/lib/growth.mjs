// Pure decisions for the weekly growth pipeline. No network, no filesystem.
// Scripts in scripts/ call these so tests can use fixtures.

export const BOT_EMAIL = "41898282+github-actions[bot]@users.noreply.github.com";
export const ALLOW_PREFIXES = ["AwesomeDS/data/", "Plugin/awesome-ds/ds/data/"];
export const MAX_FILE_BYTES = 1_000_000;
const OGP_W = 1200;
const OGP_H = 630;

export function topicQuery(now = new Date()) {
  const since = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
  const day = since.toISOString().slice(0, 10);
  return `topic:design-system stars:>500 pushed:>${day}`;
}

export function filterTopicRepos(items, blocklist) {
  const blocked = new Set((blocklist ?? []).map((s) => s.toLowerCase()));
  return (items ?? []).filter((it) => !blocked.has(String(it.full_name ?? "").toLowerCase()));
}

function repoKey(repo) {
  return `${repo.owner}/${repo.name}`.toLowerCase();
}

export function stripNoise(value, parentKey) {
  if (Array.isArray(value)) return value.map((v) => stripNoise(v, parentKey));
  if (value && typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      if (k === "fetchedAt" || k === "lastSeen") continue;
      if (parentKey === "meta" && (k === "updated" || k === "counts")) continue;
      out[k] = stripNoise(v, k);
    }
    return out;
  }
  return value;
}

function stable(value) {
  return JSON.stringify(stripNoise(value));
}

export function diffGuard({ base, head, changedPaths = [], fileBytes = {}, fetchErrors = [] }) {
  const reasons = [];
  const baseRepos = base?.repos?.repos ?? [];
  const headRepos = head?.repos?.repos ?? [];
  const baseBrands = base?.brands?.brands ?? [];
  const headBrands = head?.brands?.brands ?? [];
  const curatedCount = Object.keys(base?.curated ?? {}).length;

  if (headRepos.length < 50) reasons.push(`repos below 50 (${headRepos.length})`);
  if (baseRepos.length > 0 && (baseRepos.length - headRepos.length) / baseRepos.length >= 0.05) {
    reasons.push(`repos dropped by 5% or more (${baseRepos.length} -> ${headRepos.length})`);
  }
  if (baseBrands.length - headBrands.length >= 5) {
    reasons.push(`brands dropped by ${baseBrands.length - headBrands.length}`);
  }

  const headCurated = new Set(Object.keys(head?.curated ?? {}).map((k) => k.toLowerCase()));
  for (const key of Object.keys(base?.curated ?? {})) {
    if (!headCurated.has(key.toLowerCase())) reasons.push(`curated entry removed: ${key}`);
  }
  const headRepoKeys = new Set(headRepos.map(repoKey));
  for (const key of headCurated) {
    if (!headRepoKeys.has(key)) reasons.push(`curated repo missing from ranking: ${key}`);
  }

  const headByKey = new Map(headRepos.map((r) => [repoKey(r), r]));
  for (const prev of baseRepos) {
    const next = headByKey.get(repoKey(prev));
    if (!next) continue;
    if (typeof prev.stars === "number" && prev.stars > 0 && typeof next.stars === "number" && next.stars <= prev.stars * 0.5) {
      reasons.push(`stars dropped by 50% or more: ${repoKey(prev)} ${prev.stars} -> ${next.stars}`);
    }
  }

  for (const p of changedPaths) {
    if (!ALLOW_PREFIXES.some((prefix) => p.startsWith(prefix))) reasons.push(`path outside data: ${p}`);
  }
  for (const [p, bytes] of Object.entries(fileBytes)) {
    if (bytes > MAX_FILE_BYTES) reasons.push(`file over 1MB: ${p} (${bytes} bytes)`);
  }

  if (curatedCount > 0 && fetchErrors.length / curatedCount > 0.1) {
    reasons.push(`fetch errors ${fetchErrors.length}/${curatedCount} exceed 10%`);
  }

  const meaningful = ["repos", "brands", "candidates"].some((name) => stable(base?.[name]) !== stable(head?.[name]))
    || stable(base?.curated) !== stable(head?.curated);

  return {
    ok: reasons.length === 0,
    meaningful,
    reasons,
    stats: {
      reposBase: baseRepos.length,
      reposHead: headRepos.length,
      brandsBase: baseBrands.length,
      brandsHead: headBrands.length,
      fetchErrors: fetchErrors.length,
    },
  };
}

export function isDryRun(input) {
  return String(input).toLowerCase() !== "false";
}

export function decide({ guard, dryRun, humanAuthors = [] }) {
  if (humanAuthors.length) return { action: "fail", reason: "human-edited-bot-branch" };
  if (!guard.ok) return { action: "fail", reason: guard.reasons[0] ?? "guard" };
  if (!guard.meaningful) return { action: "noop", reason: "no-meaningful-change" };
  if (isDryRun(dryRun)) return { action: "dry-run", reason: "dry-run" };
  return { action: "propose", reason: "changes" };
}

export function foreignAuthors(emails) {
  return (emails ?? []).filter((email) => email && email !== BOT_EMAIL);
}

function candidateId(kind, url) {
  return `${kind}:${url}`;
}

export function planDiscoveries({
  today,
  previous = [],
  curatedKeys = [],
  blocklist = [],
  flagshipUrls = [],
  ossItems = [],
  guidelines = [],
  releases = [],
  minStars = 300,
}) {
  const curated = new Set(curatedKeys.map((k) => k.toLowerCase()));
  const blocked = new Set(blocklist.map((k) => k.toLowerCase()));
  const flagship = new Set(flagshipUrls);
  const prevById = new Map(previous.map((c) => [c.id, c]));
  const prevByUrl = new Map(previous.map((c) => [c.url, c]));
  const excluded = { known: 0, rejected: 0, noOg: 0, small: 0, http: 0, stars: 0 };
  const incoming = [];

  const skipExisting = (url) => {
    const prev = prevByUrl.get(url);
    if (prev?.status === "rejected" || prev?.status === "accepted") {
      excluded.rejected++;
      return true;
    }
    return false;
  };

  for (const api of ossItems) {
    const full = String(api.full_name ?? "").toLowerCase();
    const url = api.html_url;
    if (!url || blocked.has(full) || curated.has(full)) {
      excluded.known++;
      continue;
    }
    if (skipExisting(url)) continue;
    if (api.archived || (api.stargazers_count ?? 0) <= minStars) {
      excluded.stars++;
      continue;
    }
    const prev = prevByUrl.get(url);
    const stars = api.stargazers_count ?? null;
    incoming.push({
      id: candidateId("oss", url),
      kind: "oss",
      url,
      title: api.full_name,
      description: api.description ?? null,
      stars,
      firstSeen: prev?.firstSeen ?? today,
      lastSeen: today,
      signals: {
        license: api.license?.spdx_id ?? null,
        archived: false,
        starsDelta: prev && typeof prev.stars === "number" && typeof stars === "number" ? stars - prev.stars : null,
      },
      status: prev?.status ?? "new",
      note: prev?.note ?? "",
    });
  }

  for (const g of guidelines) {
    if (flagship.has(g.url) || curated.has(g.url)) {
      excluded.known++;
      continue;
    }
    if (skipExisting(g.url)) continue;
    if (g.http < 200 || g.http >= 400) {
      excluded.http++;
      continue;
    }
    if (g.ogWidth == null || g.ogHeight == null) {
      excluded.noOg++;
      continue;
    }
    const aspect = g.ogWidth / g.ogHeight;
    const target = OGP_W / OGP_H;
    if (g.ogWidth < 1000 || g.ogHeight < 500 || Math.abs(aspect - target) / target > 0.12) {
      excluded.small++;
      continue;
    }
    const prev = prevByUrl.get(g.url);
    incoming.push({
      id: candidateId("guideline", g.url),
      kind: "guideline",
      url: g.url,
      title: g.title ?? g.url,
      description: g.description ?? null,
      stars: null,
      firstSeen: prev?.firstSeen ?? today,
      lastSeen: today,
      signals: { ogWidth: g.ogWidth, ogHeight: g.ogHeight },
      status: prev?.status ?? "new",
      note: prev?.note ?? "",
    });
  }

  for (const rel of releases) {
    const url = rel.url;
    if (!url || skipExisting(url)) continue;
    const prev = prevByUrl.get(url);
    if (prev?.signals?.tag === rel.tag) continue;
    incoming.push({
      id: candidateId("release", url),
      kind: "release",
      url,
      title: rel.title ?? rel.repo,
      description: rel.repo ?? null,
      stars: null,
      firstSeen: prev?.firstSeen ?? today,
      lastSeen: today,
      signals: { tag: rel.tag, repo: rel.repo },
      status: prev?.status && prev.status !== "new" ? prev.status : "new",
      note: prev?.note ?? "",
    });
  }

  const merged = new Map(previous.map((c) => [c.id, { ...c, signals: { ...c.signals } }]));
  for (const item of incoming) {
    const prev = prevById.get(item.id);
    if (prev?.status === "rejected" || prev?.status === "accepted") continue;
    merged.set(item.id, item);
  }
  const candidates = [...merged.values()].sort((a, b) => a.id.localeCompare(b.id));
  return { candidates, excluded };
}

export function readImageSize(buf) {
  const jpeg = readJpegSize(buf);
  if (jpeg) return jpeg;
  if (buf.length > 24 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }
  return null;
}

export function readJpegSize(buf) {
  if (!buf || buf.length < 4 || buf[0] !== 0xff || buf[1] !== 0xd8) return null;
  let i = 2;
  while (i < buf.length - 8) {
    if (buf[i] !== 0xff) {
      i++;
      continue;
    }
    const marker = buf[i + 1];
    if (marker === 0xc0 || marker === 0xc1 || marker === 0xc2) {
      return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
    }
    if (marker === 0xd8 || marker === 0xd9 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      i += 2;
      continue;
    }
    const len = buf.readUInt16BE(i + 2);
    if (!len) break;
    i += 2 + len;
  }
  return null;
}

export function checkOgpFile({ name, referenced, exists, width, height, bytes }) {
  const problems = [];
  const ext = String(name ?? "").split(".").pop()?.toLowerCase();
  if (referenced && !exists) problems.push("missing");
  if (!referenced && exists) problems.push("unreferenced");
  if (referenced && exists) {
    if (!["jpg", "jpeg", "svg"].includes(ext)) problems.push("type");
    if (ext === "svg") return problems;
    if (width == null || height == null || Math.abs(width - OGP_W) > 2 || Math.abs(height - OGP_H) > 2) problems.push("dimensions");
    if (bytes > 200 * 1024) problems.push("size");
  }
  return problems;
}

export function workflowFindings(text) {
  const findings = [];
  if (/git push[^\n]*\bmain\b/.test(text) || /HEAD:\s*main\b/.test(text)) findings.push("push-main");
  if (text.includes("ANTHROPIC_API_KEY")) findings.push("ANTHROPIC_API_KEY");
  if (text.includes("claude-code-action")) findings.push("claude-code-action");
  return findings;
}

export function renderReport({ date, guard, excluded, newCandidates }) {
  const lines = [
    `# 週次更新 ${date}`,
    "",
    guard.meaningful ? "データに意味のある差分があります。" : "日付と集計以外の差分はありません。",
    "",
    "## diff-guard",
    "",
    `- repos: ${guard.stats.reposBase} -> ${guard.stats.reposHead}`,
    `- brands: ${guard.stats.brandsBase} -> ${guard.stats.brandsHead}`,
    `- fetch errors: ${guard.stats.fetchErrors}`,
    guard.ok ? "- 判定: 通過" : `- 判定: 失敗 (${guard.reasons.join("; ")})`,
    "",
    "## 新しい候補",
    "",
  ];
  if (!newCandidates?.length) lines.push("なし");
  else for (const c of newCandidates) lines.push(`- [ ] ${c.kind} ${c.title} ${c.url}`);
  lines.push("", "## 候補から外した件数", "");
  lines.push(`- og:image なし: ${excluded?.noOg ?? 0}`);
  lines.push(`- 画像が小さい、または比率が合わない: ${excluded?.small ?? 0}`);
  lines.push(`- HTTP エラー: ${excluded?.http ?? 0}`);
  lines.push(`- 既知または却下済み: ${(excluded?.known ?? 0) + (excluded?.rejected ?? 0)}`);
  lines.push("");
  return lines.join("\n");
}

const CANDIDATE_STATUSES = new Set(["new", "accepted", "rejected", "watching"]);
const CANDIDATE_KINDS = new Set(["oss", "guideline", "release"]);

export function candidateProblems(doc) {
  const problems = [];
  if (!doc?.meta) problems.push("meta missing");
  else {
    for (const k of ["description", "updated", "sources", "license"]) if (!doc.meta[k]) problems.push(`meta.${k} missing`);
    if (doc.meta?.updated && !/^\d{4}-\d{2}-\d{2}$/.test(doc.meta.updated)) problems.push("meta.updated");
  }
  if (!Array.isArray(doc?.candidates)) {
    problems.push("candidates missing");
    return problems;
  }
  const seen = new Set();
  for (const c of doc.candidates) {
    if (!c.id || seen.has(c.id)) problems.push(`id ${c.id ?? "?"}`);
    if (c.id) seen.add(c.id);
    if (!CANDIDATE_KINDS.has(c.kind)) problems.push(`${c.id}: kind`);
    if (!/^https:\/\/[^\s]+$/.test(c.url ?? "")) problems.push(`${c.id}: url`);
    if (!c.title) problems.push(`${c.id}: title`);
    if (c.stars !== null && typeof c.stars !== "number") problems.push(`${c.id}: stars`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(c.firstSeen ?? "") || !/^\d{4}-\d{2}-\d{2}$/.test(c.lastSeen ?? "")) problems.push(`${c.id}: dates`);
    if (!c.signals || typeof c.signals !== "object") problems.push(`${c.id}: signals`);
    if (!CANDIDATE_STATUSES.has(c.status)) problems.push(`${c.id}: status`);
    if (typeof c.note !== "string") problems.push(`${c.id}: note`);
  }
  return problems;
}

export function sourceProblems(curated, blocklist) {
  const problems = [];
  if (!curated || typeof curated !== "object" || Array.isArray(curated)) problems.push("curated-repos.json: object map required");
  else {
    for (const [key, category] of Object.entries(curated)) {
      if (!/^[^/\s]+\/[^/\s]+$/.test(key)) problems.push(`curated key ${key}`);
      if (typeof category !== "string" || !category) problems.push(`curated category ${key}`);
    }
  }
  const repos = blocklist?.repos;
  if (!Array.isArray(repos)) problems.push("blocklist.json: repos array required");
  else {
    const seen = new Set();
    for (const name of repos) {
      if (!/^[^/\s]+\/[^/\s]+$/.test(name)) problems.push(`blocklist entry ${name}`);
      const id = String(name).toLowerCase();
      if (seen.has(id)) problems.push(`blocklist duplicate ${name}`);
      seen.add(id);
    }
  }
  return problems;
}
