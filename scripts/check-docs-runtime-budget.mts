import { spawn } from "node:child_process";
import path from "node:path";
import { chromium } from "@playwright/test";

type ResourceStat = {
  name: string;
  initiatorType: string;
  transferSize: number;
  decodedBodySize: number;
};

type Budget = {
  path: string;
  maxScriptRequests: number;
  maxScriptTransferBytes: number;
  maxScriptDecodedBytes: number;
  maxFontRequests: number;
  maxFontTransferBytes: number;
};

const budgets: Budget[] = [
  { path: "/en", maxScriptRequests: 10, maxScriptTransferBytes: 210_000, maxScriptDecodedBytes: 700_000, maxFontRequests: 2, maxFontTransferBytes: 110_000 },
  { path: "/ja", maxScriptRequests: 10, maxScriptTransferBytes: 210_000, maxScriptDecodedBytes: 700_000, maxFontRequests: 0, maxFontTransferBytes: 0 },
  { path: "/en/components/button", maxScriptRequests: 10, maxScriptTransferBytes: 215_000, maxScriptDecodedBytes: 705_000, maxFontRequests: 2, maxFontTransferBytes: 110_000 },
];

const port = Number(process.env.DOCS_PERF_PORT ?? 3499);
const origin = `http://127.0.0.1:${port}`;
const nextBin = path.resolve("apps/docs/node_modules/next/dist/bin/next");
const server = spawn(process.execPath, [nextBin, "start", "--port", String(port)], {
  cwd: path.resolve("apps/docs"),
  env: { ...process.env, NODE_ENV: "production" },
  stdio: ["ignore", "pipe", "pipe"],
});

let serverOutput = "";
server.stdout.on("data", (chunk) => { serverOutput += String(chunk); });
server.stderr.on("data", (chunk) => { serverOutput += String(chunk); });

async function waitForServer() {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    if (server.exitCode !== null) throw new Error(`docs server exited early\n${serverOutput}`);
    try {
      const response = await fetch(`${origin}/en`, { redirect: "manual" });
      if (response.status === 200) return;
    } catch {
      // Server startup races are expected here.
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`docs server did not become ready\n${serverOutput}`);
}

function total(rows: ResourceStat[], key: "transferSize" | "decodedBodySize") {
  return rows.reduce((sum, row) => sum + row[key], 0);
}

let browser: Awaited<ReturnType<typeof chromium.launch>> | undefined;
try {
  await waitForServer();
  browser = await chromium.launch({ headless: true });
  const failures: string[] = [];

  for (const budget of budgets) {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(`${origin}${budget.path}`, { waitUntil: "networkidle" });
    const resources = await page.evaluate<ResourceStat[]>(() =>
      performance.getEntriesByType("resource").map((entry) => {
        const resource = entry as PerformanceResourceTiming;
        return {
          name: resource.name,
          initiatorType: resource.initiatorType,
          transferSize: resource.transferSize,
          decodedBodySize: resource.decodedBodySize,
        };
      }),
    );
    await context.close();

    const scripts = resources.filter((resource) => resource.initiatorType === "script");
    const fonts = resources.filter((resource) => resource.name.includes(".woff2"));
    const scriptTransfer = total(scripts, "transferSize");
    const scriptDecoded = total(scripts, "decodedBodySize");
    const fontTransfer = total(fonts, "transferSize");
    const checks: Array<[string, number, number]> = [
      ["script requests", scripts.length, budget.maxScriptRequests],
      ["script transfer", scriptTransfer, budget.maxScriptTransferBytes],
      ["script decoded", scriptDecoded, budget.maxScriptDecodedBytes],
      ["font requests", fonts.length, budget.maxFontRequests],
      ["font transfer", fontTransfer, budget.maxFontTransferBytes],
    ];
    for (const [label, actual, maximum] of checks) {
      if (actual > maximum) failures.push(`${budget.path} ${label}: ${actual.toLocaleString()} exceeds ${maximum.toLocaleString()}`);
    }
    console.log(`${budget.path}: scripts ${scripts.length} / ${scriptTransfer.toLocaleString()} B transfer / ${scriptDecoded.toLocaleString()} B decoded; fonts ${fonts.length} / ${fontTransfer.toLocaleString()} B`);
  }

  if (failures.length) throw new Error(failures.join("\n"));
} finally {
  await browser?.close();
  server.kill("SIGTERM");
}
