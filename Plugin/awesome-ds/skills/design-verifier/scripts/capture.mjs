#!/usr/bin/env node
// Screenshot capture for design-verifier.
// node capture.mjs --urls a,b [--urls-file f] [--widths 390,768,1280] [--schemes light,dark]
//                  [--out design-review/shots] [--full-page] [--states] [--wait networkidle]
//                  [--delay 300] [--scale 1] [--theme-attr data-theme|class] [--dismiss "css"] [--timeout 30000]
// Browser: CHROMIUM_PATH (executablePath) > PLAYWRIGHT_BROWSERS_PATH (resolved by Playwright) > default cache.
// Missing browser: npx playwright install chromium

import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const argv = process.argv.slice(2);
const opt = (name, def) => {
  const i = argv.indexOf(`--${name}`);
  if (i === -1) return def;
  const v = argv[i + 1];
  return v === undefined || v.startsWith("--") ? true : v;
};
const flag = (name) => argv.includes(`--${name}`);

let urls = [];
const urlsArg = opt("urls");
if (typeof urlsArg === "string") urls = urlsArg.split(",").map((s) => s.trim()).filter(Boolean);
const urlsFile = opt("urls-file");
if (typeof urlsFile === "string") urls.push(...readFileSync(urlsFile, "utf8").split("\n").map((s) => s.trim()).filter((s) => s && !s.startsWith("#")));
if (!urls.length) {
  console.error("capture: no URLs. Use --urls http://localhost:3000,/abs/page.html or --urls-file list.txt");
  process.exit(2);
}
urls = urls.map((u) => (/^(https?|file):/.test(u) ? u : pathToFileURL(resolve(u)).href));

const widths = String(opt("widths", "390,768,1280")).split(",").map(Number).filter(Boolean);
const schemes = String(opt("schemes", "light,dark")).split(",").map((s) => s.trim()).filter(Boolean);
const out = resolve(String(opt("out", "design-review/shots")));
const fullPage = flag("full-page");
const states = flag("states");
const waitUntil = String(opt("wait", "networkidle"));
const delay = Number(opt("delay", 300));
const scale = Number(opt("scale", 1));
const themeAttr = String(opt("theme-attr", "data-theme"));
const dismiss = opt("dismiss");
const timeout = Number(opt("timeout", 30000));
const heightOverride = opt("height");

const heightFor = (w) => (heightOverride ? Number(heightOverride) : w < 600 ? 844 : w < 1024 ? 1024 : 800);

async function loadPlaywright() {
  for (const mod of ["playwright", "playwright-core"]) {
    try { return await import(mod); } catch { /* try next */ }
  }
  console.error("capture: playwright not found. Run: npm i -D playwright && npx playwright install chromium");
  process.exit(3);
}

const slug = (u) => {
  const p = new URL(u);
  const path = (p.protocol === "file:" ? p.pathname.split("/").slice(-2).join("_") : p.host + p.pathname).replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "");
  return (path || "root").toLowerCase().slice(0, 80);
};

const themeScript = (scheme, attr) => `(() => {
  const s = ${JSON.stringify(scheme)};
  const attr = ${JSON.stringify(attr)};
  const apply = () => {
    const el = document.documentElement;
    if (attr === "class") { el.classList.toggle("dark", s === "dark"); el.classList.toggle("light", s === "light"); }
    else el.setAttribute(attr, s);
  };
  apply();
  document.addEventListener("DOMContentLoaded", apply);
})();`;

const { chromium } = await loadPlaywright();
mkdirSync(out, { recursive: true });

const launch = {};
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
let browser;
try {
  browser = await chromium.launch(launch);
} catch (e) {
  console.error(`capture: could not launch Chromium. ${e.message.split("\n")[0]}`);
  console.error("Fix: npx playwright install chromium   (or set CHROMIUM_PATH / PLAYWRIGHT_BROWSERS_PATH)");
  process.exit(4);
}

const manifest = [];
const shot = async (page, file, extra = {}) => {
  const path = resolve(out, file);
  await page.screenshot({ path, ...extra });
  return path;
};

for (const url of urls) {
  for (const width of widths) {
    for (const scheme of schemes) {
      const context = await browser.newContext({
        viewport: { width, height: heightFor(width) },
        deviceScaleFactor: scale,
        colorScheme: scheme,
        reducedMotion: "no-preference",
        locale: "ja-JP",
      });
      await context.addInitScript(themeScript(scheme, themeAttr));
      const page = await context.newPage();
      const base = `${slug(url)}__${width}__${scheme}`;
      const entry = { url, width, scheme, files: {}, title: "", errors: [] };
      page.on("pageerror", (e) => entry.errors.push(String(e.message || e)));
      try {
        await page.goto(url, { waitUntil, timeout });
        if (typeof dismiss === "string") { try { await page.click(dismiss, { timeout: 2000 }); } catch { /* not present */ } }
        await page.waitForTimeout(delay);
        entry.title = await page.title();
        entry.files.viewport = await shot(page, `${base}.png`);
        if (fullPage) entry.files.full = await shot(page, `${base}__full.png`, { fullPage: true });
        if (states) {
          await page.keyboard.press("Tab");
          await page.waitForTimeout(100);
          entry.files.focus = await shot(page, `${base}__focus.png`);
          const link = page.locator("a[href], button").first();
          if (await link.count()) {
            await link.hover({ timeout: 2000 }).catch(() => {});
            await page.waitForTimeout(200);
            entry.files.hover = await shot(page, `${base}__hover.png`);
          }
          await page.emulateMedia({ reducedMotion: "reduce" });
          await page.reload({ waitUntil, timeout });
          await page.waitForTimeout(50);
          entry.files.reduced = await shot(page, `${base}__reduced.png`);
        }
        entry.html_lang = await page.evaluate(() => document.documentElement.getAttribute("lang"));
        entry.body_font_size = await page.evaluate(() => getComputedStyle(document.body).fontSize);
        entry.body_line_height = await page.evaluate(() => getComputedStyle(document.body).lineHeight);
        console.log(`ok   ${base}  lang=${entry.html_lang ?? "none"} body=${entry.body_font_size}/${entry.body_line_height}`);
      } catch (e) {
        entry.errors.push(String(e.message || e).split("\n")[0]);
        console.error(`fail ${base}  ${entry.errors.at(-1)}`);
      }
      manifest.push(entry);
      await context.close();
    }
  }
}

await browser.close();
writeFileSync(resolve(out, "manifest.json"), JSON.stringify({ generated: new Date().toISOString(), out, entries: manifest }, null, 2));
const failed = manifest.filter((m) => m.errors.length).length;
console.log(`\n${manifest.length} captures, ${failed} with errors. Manifest: ${resolve(out, "manifest.json")}`);
process.exit(failed && failed === manifest.length ? 1 : 0);
