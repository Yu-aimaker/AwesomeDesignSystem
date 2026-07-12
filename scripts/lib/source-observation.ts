import { createHash } from "node:crypto";

export type ObservationResult = "unchanged" | "changed" | "fetch_failed";

export type SourceObservation = {
  sourceId: string;
  url: string;
  observedAt: string;
  result: ObservationResult;
  attempts: number;
  status?: number;
  contentHash?: string;
  etag?: string;
  lastModified?: string;
  errorCategory?: "http" | "network" | "timeout" | "body-too-large";
  error?: string;
  adapter?: "http" | "github";
  revision?: string;
  adapterWarning?: string;
  firstFailedAt?: string;
};

type Source = { id: string; url: string };
type Options = {
  previousHash?: string;
  previousEtag?: string;
  previousLastModified?: string;
  retries?: number;
  retryDelayMs?: number;
  timeoutMs?: number;
  maxBytes?: number;
  fetchImpl?: typeof fetch;
  githubToken?: string;
  hashMode?: "full" | "headings-links" | "status-only";
  previousFirstFailedAt?: string;
};

const DEFAULT_MAX_BYTES = 5 * 1024 * 1024;

function normalizeContent(content: string, contentType: string, hashMode: Options["hashMode"] = "full"): string {
  if (hashMode === "status-only") return "reachable";
  if (!contentType.includes("html")) return content.trim();
  const normalized = content
    .replace(/<script\b[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[\s\S]*?<\/style>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<([a-z][a-z0-9-]*)\b[^>]*>/gi, "<$1>")
    .replace(/\b\d{4}-\d{2}-\d{2}(?:[T ][0-9:.+-Z]+)?\b/g, "<timestamp>")
    .replace(/\b[0-9a-f]{8,}\b/gi, "<hex-id>")
    .replace(/\b[A-Za-z0-9_-]{20,}\b/g, "<opaque-id>")
    .replace(/\b\d{6,}\b/g, "<number-id>")
    .replace(/>\s+</g, "><")
    .replace(/\s+/g, " ")
    .trim();
  if (hashMode === "headings-links") {
    const landmarks = normalized.match(/<(?:h[1-6]|a)>[\s\S]*?<\/(?:h[1-6]|a)>/gi);
    return landmarks?.join(" ") || normalized;
  }
  return normalized;
}

function hashContent(content: string): string {
  return `sha256:${createHash("sha256").update(content).digest("hex")}`;
}

async function readLimited(response: Response, maxBytes: number): Promise<string> {
  const reader = response.body?.getReader();
  if (!reader) return "";
  const decoder = new TextDecoder();
  let total = 0;
  let output = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel();
      throw new Error("body-too-large");
    }
    output += decoder.decode(value, { stream: true });
  }
  return output + decoder.decode();
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function observeSource(source: Source, options: Options = {}): Promise<SourceObservation> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const retries = options.retries ?? 2;
  const timeoutMs = options.timeoutMs ?? 8_000;
  const retryDelayMs = options.retryDelayMs ?? 250;
  const maxBytes = options.maxBytes ?? DEFAULT_MAX_BYTES;
  let lastStatus: number | undefined;
  let lastError = "fetch failed";
  let errorCategory: SourceObservation["errorCategory"] = "network";

  for (let attempt = 1; attempt <= retries + 1; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const headers = { "user-agent": "AwesomeDS-SourceObserver/0.1 (+local-governance)" };
      const head = await fetchImpl(source.url, { method: "HEAD", redirect: "follow", signal: controller.signal, headers });
      lastStatus = head.status;
      if (!head.ok && head.status !== 405 && head.status !== 501) {
        errorCategory = "http";
        throw new Error(`HTTP ${head.status}`);
      }
      const response = await fetchImpl(source.url, { method: "GET", redirect: "follow", signal: controller.signal, headers });
      lastStatus = response.status;
      if (!response.ok) {
        errorCategory = "http";
        throw new Error(`HTTP ${response.status}`);
      }
      const body = await readLimited(response, maxBytes);
      const normalized = normalizeContent(body, response.headers.get("content-type") ?? "", options.hashMode);
      const contentHash = hashContent(normalized);
      const etag = response.headers.get("etag") ?? undefined;
      const lastModified = response.headers.get("last-modified") ?? undefined;
      const metadataUnchanged = Boolean(
        (options.previousEtag && etag && options.previousEtag === etag) ||
        (options.previousLastModified && lastModified && options.previousLastModified === lastModified),
      );
      clearTimeout(timer);
      const observation: SourceObservation = {
        sourceId: source.id,
        url: source.url,
        observedAt: new Date().toISOString(),
        result: metadataUnchanged || options.previousHash === contentHash ? "unchanged" : "changed",
        attempts: attempt,
        status: response.status,
        contentHash,
        adapter: "http",
      };
      if (etag) observation.etag = etag;
      if (lastModified) observation.lastModified = lastModified;
      return observation;
    } catch (error) {
      clearTimeout(timer);
      lastError = error instanceof Error ? error.message : String(error);
      if (lastError === "body-too-large") errorCategory = "body-too-large";
      else if (error instanceof DOMException && error.name === "AbortError") errorCategory = "timeout";
      if (attempt <= retries) await delay(retryDelayMs * attempt);
    }
  }

  const failure: SourceObservation = {
    sourceId: source.id,
    url: source.url,
    observedAt: new Date().toISOString(),
    result: "fetch_failed",
    attempts: retries + 1,
    errorCategory,
    error: lastError,
    firstFailedAt: options.previousFirstFailedAt ?? new Date().toISOString(),
  };
  if (lastStatus !== undefined) failure.status = lastStatus;
  return failure;
}

export function failureAgeDays(observation: Pick<SourceObservation, "result" | "firstFailedAt">, now = new Date()): number {
  if (observation.result !== "fetch_failed" || !observation.firstFailedAt) return 0;
  return Math.max(0, (now.getTime() - new Date(observation.firstFailedAt).getTime()) / 86_400_000);
}

export function isPersistentFailure(observation: Pick<SourceObservation, "result" | "firstFailedAt">, thresholdDays = 7, now = new Date()): boolean {
  return observation.result === "fetch_failed" && failureAgeDays(observation, now) >= thresholdDays;
}

export function isActionablePersistentFailure(
  observation: Pick<SourceObservation, "sourceId" | "result" | "firstFailedAt">,
  allowlistedSourceIds: ReadonlySet<string>,
  thresholdDays = 7,
  now = new Date(),
): boolean {
  return !allowlistedSourceIds.has(observation.sourceId) && isPersistentFailure(observation, thresholdDays, now);
}

export function parseGitHubRepository(url: string): { owner: string; repo: string } | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== "github.com") return null;
    const [owner, repo] = parsed.pathname.split("/").filter(Boolean);
    if (!owner || !repo) return null;
    return { owner, repo: repo.replace(/\.git$/, "") };
  } catch {
    return null;
  }
}

export async function observeTrackedSource(source: Source, options: Options = {}): Promise<SourceObservation> {
  const repository = parseGitHubRepository(source.url);
  if (!repository) return observeSource(source, options);
  const fetchImpl = options.fetchImpl ?? fetch;
  const headers: Record<string, string> = {
    accept: "application/vnd.github+json",
    "user-agent": "AwesomeDS-SourceObserver/0.1 (+local-governance)",
    "x-github-api-version": "2022-11-28",
  };
  if (options.githubToken) headers.authorization = `Bearer ${options.githubToken}`;
  try {
    const apiRoot = `https://api.github.com/repos/${repository.owner}/${repository.repo}`;
    const repoResponse = await fetchImpl(apiRoot, { headers });
    if (!repoResponse.ok) throw new Error(`GitHub HTTP ${repoResponse.status}`);
    const repo = await repoResponse.json() as { default_branch?: string; pushed_at?: string };
    const releaseResponse = await fetchImpl(`${apiRoot}/releases/latest`, { headers });
    const release = releaseResponse.ok ? await releaseResponse.json() as { tag_name?: string; published_at?: string } : {};
    const revision = [repo.default_branch, repo.pushed_at, release.tag_name, release.published_at].filter(Boolean).join("|");
    if (!revision) throw new Error("GitHub response omitted revision metadata");
    const contentHash = hashContent(revision);
    return {
      sourceId: source.id,
      url: source.url,
      observedAt: new Date().toISOString(),
      result: options.previousHash === contentHash ? "unchanged" : "changed",
      attempts: 1,
      status: repoResponse.status,
      contentHash,
      adapter: "github",
      revision,
    };
  } catch (error) {
    const fallback = await observeSource(source, options);
    fallback.adapterWarning = error instanceof Error ? error.message : String(error);
    return fallback;
  }
}

export async function mapWithConcurrency<T, R>(items: T[], concurrency: number, worker: (item: T) => Promise<R>): Promise<R[]> {
  const results = new Array<R>(items.length);
  let cursor = 0;
  async function run() {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await worker(items[index]!);
    }
  }
  await Promise.all(Array.from({ length: Math.min(Math.max(1, concurrency), items.length) }, run));
  return results;
}
