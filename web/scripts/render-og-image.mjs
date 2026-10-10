#!/usr/bin/env node
// Renders web/public/og-image.png (1200x630) from the README banner.
// The banner lives in docs/assets/brand/banner-light.png (PR #10). Usage:
//   CHROMIUM_PATH=/opt/google/chrome/chrome node scripts/render-og-image.mjs <path/to/banner-light.png>
// The banner (2560x800) is scaled to 1136px wide and centred on the same dotted canvas.
import { mkdtempSync, copyFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const banner = process.argv[2];
if (!banner) {
  console.error("usage: node scripts/render-og-image.mjs <banner-light.png>");
  process.exit(2);
}
const out = resolve(dirname(fileURLToPath(import.meta.url)), "../public/og-image.png");
const dir = mkdtempSync(join(tmpdir(), "og-"));
copyFileSync(banner, join(dir, "banner.png"));
// Colours mirror AwesomeDS tokens: canvas #ffffff, the banner's dot #ececec.
writeFileSync(
  join(dir, "og.html"),
  `<!doctype html><meta charset="utf-8"><style>*{margin:0;box-sizing:border-box}html,body{width:1200px;height:630px;overflow:hidden}body{background:#ffffff;background-image:radial-gradient(#ececec 1px,transparent 1px);background-size:24px 24px;background-position:12px 12px;display:flex;align-items:center;justify-content:center}img{width:1136px;height:auto;display:block}</style><img src="banner.png" alt="">`,
);
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.goto(`file://${join(dir, "og.html")}`, { waitUntil: "load" });
await page.screenshot({ path: out, type: "png" });
await browser.close();
console.log(`wrote ${out}`);
