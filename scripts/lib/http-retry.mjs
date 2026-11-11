// Bounded GitHub HTTP retries. Never logs tokens, URLs, or response bodies.

export const DEFAULT_BUDGET_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 4;

function header(headers, name) {
  if (!headers) return "";
  if (typeof headers.get === "function") return headers.get(name) || "";
  const key = Object.keys(headers).find((item) => item.toLowerCase() === name.toLowerCase());
  return key ? String(headers[key]) : "";
}

export function classifyResponse({ status, headers }) {
  const remaining = header(headers, "x-ratelimit-remaining");
  const retryAfter = header(headers, "retry-after");
  if (status === 429) return { retry: true, kind: "rate" };
  if (status === 403 && (remaining === "0" || retryAfter)) return { retry: true, kind: "quota" };
  if (status >= 500 && status <= 599) return { retry: true, kind: "server" };
  if (status >= 200 && status < 300) return { retry: false, kind: "ok" };
  return { retry: false, kind: "permanent" };
}

export function waitMs({ headers, attempt, now, budgetLeftMs }) {
  let wait = 0;
  const retryAfter = header(headers, "retry-after");
  if (retryAfter) {
    const seconds = Number(retryAfter);
    if (Number.isFinite(seconds)) wait = seconds * 1000;
    else {
      const date = Date.parse(retryAfter);
      if (Number.isFinite(date)) wait = date - now;
    }
  }
  if (wait <= 0) {
    const reset = Number(header(headers, "x-ratelimit-reset"));
    if (Number.isFinite(reset) && reset > 0) {
      const resetMs = reset * 1000 - now;
      if (resetMs > 0) wait = resetMs + 1000;
    }
  }
  if (wait <= 0) wait = Math.min(30_000, 1000 * 2 ** attempt);
  const positive = Math.max(1, wait);
  const left = Math.max(0, budgetLeftMs);
  if (positive > left) return { waitMs: positive, exceeds: true };
  return { waitMs: positive, exceeds: false };
}

function networkMessage(attempt) {
  return `network error after ${attempt} attempts`;
}

export async function githubRequest(path, options = {}) {
  const fetchImpl = options.fetchImpl ?? fetch;
  const sleep = options.sleep ?? ((ms) => new Promise((resolve) => setTimeout(resolve, ms)));
  const now = options.now ?? (() => Date.now());
  const budgetMs = options.budgetMs ?? DEFAULT_BUDGET_MS;
  const timeoutMs = options.timeoutMs ?? 20_000;
  const maxAttempts = options.maxAttempts ?? MAX_ATTEMPTS;
  const log = options.log ?? (() => {});
  const token = options.token ?? "";
  const started = now();

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const budgetLeft = budgetMs - (now() - started);
    if (budgetLeft <= 0) throw new Error(`retry budget exhausted after ${Math.round(budgetMs / 1000)}s`);

    let res;
    try {
      const headers = {
        Accept: "application/vnd.github+json",
        "User-Agent": "awesomeds-growth",
        "X-GitHub-Api-Version": "2022-11-28",
      };
      if (token) headers.Authorization = `Bearer ${token}`;
      res = await fetchImpl(`https://api.github.com${path}`, {
        headers,
        signal: AbortSignal.timeout(timeoutMs),
      });
    } catch {
      if (attempt === maxAttempts - 1) throw new Error(networkMessage(attempt + 1));
      const wait = waitMs({ headers: {}, attempt, now: now(), budgetLeftMs: budgetLeft });
      if (wait.exceeds) {
        throw new Error(`network error; retry after ${Math.ceil(wait.waitMs / 1000)}s exceeds budget ${Math.round(budgetMs / 1000)}s`);
      }
      log(`network error; retry in ${Math.ceil(wait.waitMs / 1000)}s`);
      await sleep(wait.waitMs);
      continue;
    }

    if (res.ok) return res.json();
    await res.text().catch(() => "");
    const decision = classifyResponse({ status: res.status, headers: res.headers });
    if (!decision.retry || attempt === maxAttempts - 1) {
      const error = new Error(`GitHub API status ${res.status}`);
      error.status = res.status;
      error.kind = decision.kind;
      throw error;
    }
    const wait = waitMs({ headers: res.headers, attempt, now: now(), budgetLeftMs: budgetLeft });
    if (wait.exceeds) {
      throw new Error(`status ${res.status}; retry after ${Math.ceil(wait.waitMs / 1000)}s exceeds budget ${Math.round(budgetMs / 1000)}s`);
    }
    log(`status ${res.status}; retry in ${Math.ceil(wait.waitMs / 1000)}s`);
    await sleep(wait.waitMs);
  }
  throw new Error(`retry budget exhausted after ${Math.round(budgetMs / 1000)}s`);
}
