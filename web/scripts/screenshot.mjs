#!/usr/bin/env node
// Builds are previewed with `vite preview`, then every route is captured at
// 390 and 1280 px wide, in light and dark. PNGs land in web/.screenshots/.
// Browsers come from /opt/pw-browsers (set PLAYWRIGHT_BROWSERS_PATH); do not
// run `playwright install` here. Locally set CHROMIUM_PATH=/path/to/chrome instead.
//
// --check also fails (exit 1) on:
//   - any broken <img> (not complete, naturalWidth 0, or an image request that
//     answers 4xx/5xx or fails), after scrolling the page to trigger lazy images
//   - missing share metadata in the raw served HTML of "/": og:title,
//     og:description, og:image, og:url, twitter:card=summary_large_image;
//     og:image must start with https://awesomeds.yumaker.studio/ and its file
//     must exist in dist/ and be 1200x630 (PNG or JPEG header is read)
// On /sources it prints how many flagship cards show a real raster image,
// a geometric fallback poster, or a broken image.
//
// --simulate-broken-image: answers 404 for the first flagship image
// (/ogp/apple-hig.jpg) through Playwright routing, to prove the gate fails.
// No source or dist file is changed.
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
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
const SIMULATE_BROKEN = process.argv.includes("--simulate-broken-image");
const SITE_ORIGIN = "https://awesomeds.yumaker.studio/";
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

// Scroll to the bottom in steps (lazy images), then wait until every <img> settles.
async function scrollAndCollectImages(page) {
  await page.evaluate(async () => {
    const step = Math.max(200, Math.floor(window.innerHeight * 0.8));
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });
  await page
    .waitForFunction(() => [...document.images].every((i) => !i.currentSrc || i.complete), null, { timeout: 5000 })
    .catch(() => {});
  return page.evaluate(() => {
    const broken = [...document.images]
      .filter((i) => i.currentSrc && !(i.complete && i.naturalWidth > 0))
      .map((i) => i.currentSrc);
    const cards = [...document.querySelectorAll("section[aria-labelledby=flagship] article")];
    let real = 0;
    let fallback = 0;
    let brokenCards = 0;
    for (const card of cards) {
      const img = card.querySelector("img");
      if (!img) fallback++;
      else if (img.complete && img.naturalWidth > 0) real++;
      else brokenCards++;
    }
    return { broken, flagship: { total: cards.length, real, fallback, broken: brokenCards } };
  });
}

function imageSize(buf) {
  if (buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47) return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i + 9 < buf.length) {
      if (buf[i] !== 0xff) { i++; continue; }
      const marker = buf[i + 1];
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return { w: buf.readUInt16BE(i + 7), h: buf.readUInt16BE(i + 5) };
      }
      i += 2 + buf.readUInt16BE(i + 2);
    }
  }
  return null;
}

// Raw HTML of "/" (not the DOM): share metadata must be present for crawlers.
async function checkShareMeta() {
  const out = [];
  const res = await fetch(`http://localhost:${PORT}${BASE}/`);
  const html = await res.text();
  const meta = {};
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    const key = tag.match(/\b(?:property|name)=["']([^"']+)["']/i)?.[1];
    const content = tag.match(/\bcontent=["']([^"']*)["']/i)?.[1];
    if (key && content !== undefined) meta[key] = content;
  }
  for (const key of ["og:title", "og:description", "og:image", "og:url"]) {
    if (!meta[key]) out.push(`share meta: ${key} missing in served HTML`);
  }
  if (meta["twitter:card"] !== "summary_large_image") out.push(`share meta: twitter:card is "${meta["twitter:card"] ?? ""}", want summary_large_image`);
  const image = meta["og:image"];
  if (image) {
    if (!image.startsWith(SITE_ORIGIN)) out.push(`share meta: og:image must start with ${SITE_ORIGIN} (got ${image})`);
    else {
      const file = resolve(webRoot, "dist", image.slice(SITE_ORIGIN.length).split(/[?#]/)[0]);
      if (!existsSync(file)) out.push(`share meta: og:image file not in dist/: ${file}`);
      else {
        const size = imageSize(readFileSync(file));
        if (!size) out.push(`share meta: og:image is not a readable PNG/JPEG: ${file}`);
        else if (size.w !== 1200 || size.h !== 630) out.push(`share meta: og:image is ${size.w}x${size.h}, want 1200x630`);
      }
    }
  }
  if (!out.length) console.log(`share meta ok: og:title/description/image/url, twitter:card, og:image 1200x630`);
  return out;
}

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
let flagshipReported = false;

try {
  if (CHECK) problems.push(...(await checkShareMeta()));
  for (const theme of themes) {
    for (const width of widths) {
      const context = await browser.newContext({
        viewport: { width, height: width < 768 ? 844 : 800 },
        deviceScaleFactor: 1,
        colorScheme: theme,
        locale: "ja-JP",
      });
      await context.addInitScript((t) => localStorage.setItem("ds-theme", t), theme);
      if (SIMULATE_BROKEN) await context.route("**/ogp/apple-hig.jpg", (route) => route.fulfill({ status: 404, body: "not found" }));
      const page = await context.newPage();
      let imageErrors = [];
      page.on("response", (res) => {
        if (res.request().resourceType() === "image" && res.status() >= 400) imageErrors.push(`${res.status()} ${res.url()}`);
      });
      page.on("requestfailed", (req) => {
        if (req.resourceType() === "image") imageErrors.push(`failed ${req.url()}`);
      });
      page.on("pageerror", (err) => problems.push(`${theme} ${width} pageerror: ${err.message}`));
      page.on("console", (msg) => {
        if (msg.type() === "error") problems.push(`${theme} ${width} console: ${msg.text()}`);
      });
      for (const route of targets) {
        const url = `http://localhost:${PORT}${BASE}${route}`;
        imageErrors = [];
        await page.goto(url, { waitUntil: "networkidle" });
        await page.waitForTimeout(400);
        const imgs = await scrollAndCollectImages(page);
        const broken = [...new Set([...imgs.broken, ...imageErrors])];
        for (const src of broken) problems.push(`${theme} ${width} ${route}: broken image ${src}`);
        if (route === "/sources") {
          const f = imgs.flagship;
          if (!flagshipReported) {
            console.log(`/sources flagship images: ${f.real}/${f.total} real, ${f.fallback} fallback, ${broken.length} broken`);
            flagshipReported = true;
          }
        }
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
