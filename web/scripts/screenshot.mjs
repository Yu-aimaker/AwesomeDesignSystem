#!/usr/bin/env node
// Builds are previewed with `vite preview`, then every route is captured at
// 390 and 1280 px wide, in light and dark. PNGs land in web/.screenshots/.
// Browsers come from /opt/pw-browsers (set PLAYWRIGHT_BROWSERS_PATH); do not
// run `playwright install` here.
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

process.env.PLAYWRIGHT_BROWSERS_PATH ??= "/opt/pw-browsers";

const webRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = resolve(webRoot, ".screenshots");
mkdirSync(outDir, { recursive: true });

const PORT = 4173;
const BASE = (process.env.SITE_BASE ?? "/").replace(/\/$/, "");
// --check: no PNGs, exit 1 on any horizontal overflow or console error (used in CI).
const CHECK = process.argv.includes("--check");
const routes = [
  "/",
  "/foundations",
  "/foundations/typography",
  "/foundations/color",
  "/foundations/spacing",
  "/foundations/radius",
  "/foundations/elevation",
  "/foundations/motion",
  "/fonts",
  "/palettes",
  "/components",
  "/motion",
  "/stack",
  "/rankings",
  "/knowledge",
  "/sources",
  "/about",
  "/missing-page",
  // English (STA-51). Same pages under the /en prefix.
  "/en",
  "/en/foundations",
  "/en/foundations/typography",
  "/en/foundations/motion",
  "/en/components",
  "/en/motion",
  "/en/knowledge",
  "/en/knowledge/awesomeds/feedback",
  "/en/sources",
  "/en/about",
];
const only = process.argv.slice(2).filter((a) => !a.startsWith("-"));
const targets = only.length ? routes.filter((r) => only.includes(r)) : routes;

const widths = [390, 1280];
const themes = ["light", "dark"];
const fullPage = process.env.FULL !== "0";

function startPreview() {
  const child = spawn("pnpm", ["exec", "vite", "preview", "--port", String(PORT), "--strictPort"], {
    cwd: webRoot,
    stdio: ["ignore", "pipe", "inherit"],
  });
  return new Promise((resolveReady, reject) => {
    const timer = setTimeout(() => reject(new Error("vite preview did not start")), 20000);
    child.stdout.on("data", (buf) => {
      const text = buf.toString();
      if (text.includes("http://") || text.includes("Local:")) {
        clearTimeout(timer);
        resolveReady(child);
      }
    });
    child.on("exit", (code) => reject(new Error(`vite preview exited with ${code}`)));
  });
}

const server = await startPreview();
// CHROMIUM_PATH lets a machine without /opt/pw-browsers use an installed Chrome.
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const problems = [];

try {
  for (const theme of themes) {
    for (const width of widths) {
      const context = await browser.newContext({
        viewport: { width, height: width < 768 ? 844 : 800 },
        deviceScaleFactor: 1,
        colorScheme: theme,
        locale: "ja-JP",
      });
      await context.addInitScript((t) => localStorage.setItem("ds-theme", t), theme);
      const page = await context.newPage();
      page.on("pageerror", (err) => problems.push(`${theme} ${width} pageerror: ${err.message}`));
      page.on("console", (msg) => {
        if (msg.type() === "error") problems.push(`${theme} ${width} console: ${msg.text()}`);
      });
      for (const route of targets) {
        const url = `http://localhost:${PORT}${BASE}${route}`;
        await page.goto(url, { waitUntil: "networkidle" });
        await page.waitForTimeout(400);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        if (overflow > 0) problems.push(`${theme} ${width} ${route}: horizontal overflow ${overflow}px`);
        const lang = await page.evaluate(() => document.documentElement.lang);
        const wantLang = route === "/en" || route.startsWith("/en/") ? "en" : "ja";
        if (lang !== wantLang) problems.push(`${theme} ${width} ${route}: <html lang="${lang}">, expected "${wantLang}"`);
        const name = `${route === "/" ? "home" : route.slice(1).replace(/\//g, "-")}-${width}-${theme}.png`;
        if (CHECK) continue;
        await page.screenshot({ path: resolve(outDir, name), fullPage });
        console.log("saved", name);
      }
      await context.close();
    }
  }
} finally {
  await browser.close();
  server.kill();
}

if (problems.length) {
  console.log("\nProblems:");
  for (const p of problems) console.log(" -", p);
  process.exitCode = 1;
} else {
  console.log(`\nNo overflow or console errors. (${targets.length} routes × ${widths.length} widths × ${themes.length} themes)`);
}
