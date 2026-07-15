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
  errorCategory?:
    | "http"
    | "network"
    | "timeout"
    | "body-too-large"
    | "empty-content"
    | "login-gate"
    | "challenge-page";
  error?: string;
  adapter?: "http" | "github";
  revision?: string;
  adapterWarning?: string;
  adapterHealth?: "healthy" | "degraded";
  adapterError?: string;
  adapterFirstFailedAt?: string;
  adapterRecoveredAt?: string;
  firstFailedAt?: string;
  lastSuccessfulHash?: string;
  lastSuccessfulEtag?: string;
  lastSuccessfulLastModified?: string;
  /** Adapter-scoped baselines prevent incomparable GitHub revision and HTML hashes from being diffed. */
  lastSuccessfulHashes?: Partial<Record<"http" | "github", string>>;
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
  previousHashes?: Partial<Record<"http" | "github", string>>;
  assumeUnchangedWithoutBaseline?: boolean;
  previousAdapterHealth?: SourceObservation["adapterHealth"];
  previousAdapterFirstFailedAt?: string;
};

const DEFAULT_MAX_BYTES = 5 * 1024 * 1024;

class InvalidSourceContentError extends Error {
  constructor(
    readonly category: "empty-content" | "login-gate" | "challenge-page",
    message: string,
  ) {
    super(message);
    this.name = "InvalidSourceContentError";
  }
}

function visibleHtmlText(content: string): string {
  return content
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--\s*[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&(?:nbsp|#160);/gi, " ")
    .replace(/&[a-z]+;|&#\d+;|&#x[0-9a-f]+;/gi, "x")
    .replace(/\s+/g, " ")
    .trim();
}

/** Reject successful HTTP responses that do not contain usable source material. */
function validateSourceContent(
  content: string,
  contentType: string,
  hashMode: Options["hashMode"] = "full",
): void {
  if (!content.trim()) {
    throw new InvalidSourceContentError(
      "empty-content",
      "Source returned an empty response body",
    );
  }
  if (!contentType.toLowerCase().includes("html")) return;

  const lower = content.toLowerCase();
  const title =
    lower
      .match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]
      ?.replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim() ?? "";
  const visibleText = visibleHtmlText(content);
  const hasPasswordField = /<input\b[^>]*\btype\s*=\s*["']?password\b/i.test(
    content,
  );
  const hasLoginForm =
    /<form\b[^>]*(?:action|id|class)\s*=\s*["'][^"']*(?:log[-_ ]?in|sign[-_ ]?in|auth|sso|saml)[^"']*["']/i.test(
      content,
    );
  const loginTitle =
    /^(?:sign in|log in|login|authentication required)(?:\s*(?:[|:\-–—]|to\b).*)?$/i.test(
      title,
    );
  const loginCue =
    /\b(?:sign in|log in|authentication required|continue with (?:google|github|apple|sso))\b/i.test(
      visibleText,
    );
  if (
    (hasPasswordField && loginCue) ||
    (loginTitle && (hasPasswordField || hasLoginForm))
  ) {
    throw new InvalidSourceContentError(
      "login-gate",
      "Source resolved to an authentication gate",
    );
  }

  const knownChallengeMarker =
    /(?:cf-chl-|\/cdn-cgi\/challenge-platform\/|g-recaptcha|h-captcha|hcaptcha|data-sitekey)/i.test(
      content,
    );
  const challengeTitle =
    /^(?:just a moment|attention required|security checkpoint|security verification)(?:[.!\s|:\-–—].*)?$/i.test(
      title,
    );
  const challengeCue =
    /\b(?:verify (?:that )?you are human|checking your browser|complete the security check|enable javascript and cookies to continue)\b/i.test(
      visibleText,
    );
  if (knownChallengeMarker && (challengeTitle || challengeCue)) {
    throw new InvalidSourceContentError(
      "challenge-page",
      "Source resolved to an automated-access challenge page",
    );
  }

  // An empty app shell can be legitimate when a first-party site renders on the
  // client. Only reject markup-only responses when there is no boot or rendered
  // media signal, avoiding false positives for React/Next/Nuxt documentation.
  if (!visibleText) {
    if (hashMode === "status-only") return;
    const hasClientBootstrap =
      /<script\b[^>]*(?:\bsrc\s*=|\btype\s*=\s*["']module["'])|__next|__nuxt|<[^>]+\bid\s*=\s*["'](?:root|app|__next)["']/i.test(
        content,
      );
    const hasRenderableMedia = /<(?:img|svg|video|canvas|iframe)\b/i.test(
      content,
    );
    if (!hasClientBootstrap && !hasRenderableMedia) {
      throw new InvalidSourceContentError(
        "empty-content",
        "Source returned HTML without usable content",
      );
    }
  }
}

function normalizeContent(
  content: string,
  contentType: string,
  hashMode: Options["hashMode"] = "full",
): string {
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
    const landmarks = normalized.match(
      /<(?:h[1-6]|a)>[\s\S]*?<\/(?:h[1-6]|a)>/gi,
    );
    return landmarks?.join(" ") || normalized;
  }
  return normalized;
}

function hashContent(content: string): string {
  return `sha256:${createHash("sha256").update(content).digest("hex")}`;
}

async function readLimited(
  response: Response,
  maxBytes: number,
): Promise<string> {
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

export async function observeSource(
  source: Source,
  options: Options = {},
): Promise<SourceObservation> {
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
      const headers = {
        "user-agent": "AwesomeDS-SourceObserver/0.1 (+local-governance)",
      };
      const head = await fetchImpl(source.url, {
        method: "HEAD",
        redirect: "follow",
        signal: controller.signal,
        headers,
      });
      lastStatus = head.status;
      if (!head.ok && head.status !== 405 && head.status !== 501) {
        errorCategory = "http";
        throw new Error(`HTTP ${head.status}`);
      }
      const response = await fetchImpl(source.url, {
        method: "GET",
        redirect: "follow",
        signal: controller.signal,
        headers,
      });
      lastStatus = response.status;
      if (!response.ok) {
        errorCategory = "http";
        throw new Error(`HTTP ${response.status}`);
      }
      const body = await readLimited(response, maxBytes);
      const contentType = response.headers.get("content-type") ?? "";
      validateSourceContent(body, contentType, options.hashMode);
      const normalized = normalizeContent(body, contentType, options.hashMode);
      const contentHash = hashContent(normalized);
      const etag = response.headers.get("etag") ?? undefined;
      const lastModified = response.headers.get("last-modified") ?? undefined;
      clearTimeout(timer);
      const observation: SourceObservation = {
        sourceId: source.id,
        url: source.url,
        observedAt: new Date().toISOString(),
        result:
          options.previousHash === contentHash ||
          (!options.previousHash && options.assumeUnchangedWithoutBaseline)
            ? "unchanged"
            : "changed",
        attempts: attempt,
        status: response.status,
        contentHash,
        adapter: "http",
        lastSuccessfulHash: contentHash,
        lastSuccessfulHashes: { ...options.previousHashes, http: contentHash },
      };
      if (etag) observation.etag = etag;
      if (lastModified) observation.lastModified = lastModified;
      if (etag) observation.lastSuccessfulEtag = etag;
      if (lastModified) observation.lastSuccessfulLastModified = lastModified;
      return observation;
    } catch (error) {
      clearTimeout(timer);
      lastError = error instanceof Error ? error.message : String(error);
      if (error instanceof InvalidSourceContentError)
        errorCategory = error.category;
      else if (lastError === "body-too-large") errorCategory = "body-too-large";
      else if (error instanceof DOMException && error.name === "AbortError")
        errorCategory = "timeout";
      else if (/^HTTP \d+$/.test(lastError)) errorCategory = "http";
      else errorCategory = "network";
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
  if (options.previousHash) failure.lastSuccessfulHash = options.previousHash;
  if (options.previousEtag) failure.lastSuccessfulEtag = options.previousEtag;
  if (options.previousLastModified)
    failure.lastSuccessfulLastModified = options.previousLastModified;
  if (options.previousHashes)
    failure.lastSuccessfulHashes = { ...options.previousHashes };
  if (lastStatus !== undefined) failure.status = lastStatus;
  return failure;
}

export function failureAgeDays(
  observation: Pick<SourceObservation, "result" | "firstFailedAt">,
  now = new Date(),
): number {
  if (observation.result !== "fetch_failed" || !observation.firstFailedAt)
    return 0;
  return Math.max(
    0,
    (now.getTime() - new Date(observation.firstFailedAt).getTime()) /
      86_400_000,
  );
}

export function isPersistentFailure(
  observation: Pick<SourceObservation, "result" | "firstFailedAt">,
  thresholdDays = 7,
  now = new Date(),
): boolean {
  return (
    observation.result === "fetch_failed" &&
    failureAgeDays(observation, now) >= thresholdDays
  );
}

export function isActionablePersistentFailure(
  observation: Pick<SourceObservation, "sourceId" | "result" | "firstFailedAt">,
  allowlistedSourceIds: ReadonlySet<string>,
  thresholdDays = 7,
  now = new Date(),
): boolean {
  return (
    !allowlistedSourceIds.has(observation.sourceId) &&
    isPersistentFailure(observation, thresholdDays, now)
  );
}

export function adapterFailureAgeDays(
  observation: Pick<
    SourceObservation,
    "adapterHealth" | "adapterFirstFailedAt"
  >,
  now = new Date(),
): number {
  if (
    observation.adapterHealth !== "degraded" ||
    !observation.adapterFirstFailedAt
  )
    return 0;
  return Math.max(
    0,
    (now.getTime() - new Date(observation.adapterFirstFailedAt).getTime()) /
      86_400_000,
  );
}

export function isActionablePersistentAdapterFailure(
  observation: Pick<
    SourceObservation,
    "sourceId" | "adapterHealth" | "adapterFirstFailedAt"
  >,
  allowlistedSourceIds: ReadonlySet<string>,
  thresholdDays = 7,
  now = new Date(),
): boolean {
  return (
    !allowlistedSourceIds.has(observation.sourceId) &&
    observation.adapterHealth === "degraded" &&
    adapterFailureAgeDays(observation, now) >= thresholdDays
  );
}

export type ObservationReviewItem = {
  sourceId: string;
  title: string;
  url: string;
  reason:
    | "upstream-content-changed"
    | "source-fetch-failed"
    | "github-adapter-failed"
    | "github-adapter-recovered";
  observedAt: string;
  firstFailedAt?: string;
  failureAgeDays: number;
  persistent: boolean;
  allowlisted: boolean;
  error?: string;
  errorCategory?: SourceObservation["errorCategory"];
};

export function buildObservationReviewItems(
  source: Source & { title?: string },
  observation: SourceObservation,
  allowlistedSourceIds: ReadonlySet<string>,
  thresholdDays = 7,
  now = new Date(),
): ObservationReviewItem[] {
  const items: ObservationReviewItem[] = [];
  const common = {
    sourceId: source.id,
    title: source.title ?? source.id,
    url: source.url,
    observedAt: observation.observedAt,
    allowlisted: allowlistedSourceIds.has(source.id),
  };
  if (observation.result === "changed") {
    items.push({
      ...common,
      reason: "upstream-content-changed",
      failureAgeDays: 0,
      persistent: false,
    });
  } else if (observation.result === "fetch_failed") {
    items.push({
      ...common,
      reason: "source-fetch-failed",
      ...(observation.firstFailedAt
        ? { firstFailedAt: observation.firstFailedAt }
        : {}),
      failureAgeDays: failureAgeDays(observation, now),
      persistent: isPersistentFailure(observation, thresholdDays, now),
      ...(observation.error ? { error: observation.error } : {}),
      ...(observation.errorCategory
        ? { errorCategory: observation.errorCategory }
        : {}),
    });
  }
  if (observation.adapterHealth === "degraded") {
    items.push({
      ...common,
      reason: "github-adapter-failed",
      ...(observation.adapterFirstFailedAt
        ? { firstFailedAt: observation.adapterFirstFailedAt }
        : {}),
      failureAgeDays: adapterFailureAgeDays(observation, now),
      persistent:
        observation.adapterHealth === "degraded" &&
        adapterFailureAgeDays(observation, now) >= thresholdDays,
      ...(observation.adapterError ? { error: observation.adapterError } : {}),
    });
  } else if (observation.adapterRecoveredAt) {
    items.push({
      ...common,
      reason: "github-adapter-recovered",
      failureAgeDays: 0,
      persistent: false,
    });
  }
  return items;
}

export function parseGitHubRepository(
  url: string,
): { owner: string; repo: string } | null {
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

export async function observeTrackedSource(
  source: Source,
  options: Options = {},
): Promise<SourceObservation> {
  const repository = parseGitHubRepository(source.url);
  if (!repository) return observeSource(source, options);
  const previousHashes = {
    ...options.previousHashes,
    ...(!options.previousHashes?.github && options.previousHash
      ? { github: options.previousHash }
      : {}),
  };
  const fetchImpl = options.fetchImpl ?? fetch;
  const headers: Record<string, string> = {
    accept: "application/vnd.github+json",
    "user-agent": "AwesomeDS-SourceObserver/0.1 (+local-governance)",
    "x-github-api-version": "2022-11-28",
  };
  if (options.githubToken)
    headers.authorization = `Bearer ${options.githubToken}`;
  try {
    const apiRoot = `https://api.github.com/repos/${repository.owner}/${repository.repo}`;
    const repoResponse = await fetchImpl(apiRoot, { headers });
    if (!repoResponse.ok) throw new Error(`GitHub HTTP ${repoResponse.status}`);
    const repo = (await repoResponse.json()) as {
      default_branch?: string;
      pushed_at?: string;
    };
    const releaseResponse = await fetchImpl(`${apiRoot}/releases/latest`, {
      headers,
    });
    const release = releaseResponse.ok
      ? ((await releaseResponse.json()) as {
          tag_name?: string;
          published_at?: string;
        })
      : {};
    const revision = [
      repo.default_branch,
      repo.pushed_at,
      release.tag_name,
      release.published_at,
    ]
      .filter(Boolean)
      .join("|");
    if (!revision) throw new Error("GitHub response omitted revision metadata");
    const contentHash = hashContent(revision);
    const previousGitHubHash = previousHashes.github;
    const observedAt = new Date().toISOString();
    return {
      sourceId: source.id,
      url: source.url,
      observedAt,
      result: previousGitHubHash === contentHash ? "unchanged" : "changed",
      attempts: 1,
      status: repoResponse.status,
      contentHash,
      lastSuccessfulHash: contentHash,
      lastSuccessfulHashes: { ...previousHashes, github: contentHash },
      adapter: "github",
      adapterHealth: "healthy",
      ...(options.previousAdapterHealth === "degraded"
        ? { adapterRecoveredAt: observedAt }
        : {}),
      revision,
    };
  } catch (error) {
    // HTML and GitHub revision hashes describe different representations. On the
    // first adapter transition, reachability is known but content equivalence is
    // not, so do not manufacture a content-change event. Subsequent HTTP
    // observations use their own baseline while the GitHub baseline is retained.
    // Drop the generic baseline before switching representations. Otherwise a
    // GitHub revision hash can leak into the HTTP content comparison.
    const fallbackOptions = { ...options };
    delete fallbackOptions.previousHash;
    const fallback = await observeSource(source, {
      ...fallbackOptions,
      ...(previousHashes.http ? { previousHash: previousHashes.http } : {}),
      previousHashes,
      assumeUnchangedWithoutBaseline: !previousHashes.http,
    });
    fallback.adapterWarning =
      error instanceof Error ? error.message : String(error);
    fallback.adapterHealth = "degraded";
    fallback.adapterError = fallback.adapterWarning;
    fallback.adapterFirstFailedAt =
      options.previousAdapterHealth === "degraded"
        ? (options.previousAdapterFirstFailedAt ?? fallback.observedAt)
        : fallback.observedAt;
    return fallback;
  }
}

export async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  worker: (item: T) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let cursor = 0;
  async function run() {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await worker(items[index]!);
    }
  }
  await Promise.all(
    Array.from(
      { length: Math.min(Math.max(1, concurrency), items.length) },
      run,
    ),
  );
  return results;
}
