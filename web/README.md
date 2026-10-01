# AwesomeDS web

The documentation and gallery site for AwesomeDS. Built with the system itself:
every color, radius, spacing, font and duration comes from `AwesomeDS/tokens`.

## Commands

```sh
pnpm install
pnpm dev          # copies tokens, starts Vite at http://localhost:5173
pnpm build        # tsc --noEmit, vite build, writes dist/404.html
pnpm preview      # serves dist/ at / (build with SITE_BASE=/path/ to test a sub-path)
pnpm screenshot   # Playwright: every route at 390 and 1280, light and dark -> .screenshots/
node scripts/screenshot.mjs --check   # same routes, no PNGs, exit 1 on console errors or overflow (CI)
pnpm typecheck
```

Node 22 and pnpm 10.

## How it is wired

- `scripts/sync-tokens.mjs` copies `../AwesomeDS/tokens/*.{css,json}` into `src/ds/tokens/`
  and `../AwesomeDS/data/*.json` into `src/ds/data/` before `dev` and `build`. Both copies
  are gitignored; the source of truth stays in `AwesomeDS/`. `src/lib/data.ts` types them.
- `src/ds/registry.tsx` (48 components) and `src/demos/registry.tsx` (35 motion demos) drive
  the /components and /motion pages and the ⌘K search. Add an entry there, not a page.
- Site knobs (`data-accent`, `data-radius`, `data-font`, `data-density` on `<html>`) live in
  `src/lib/knobs.tsx` and `src/knobs.css`; `/palettes` can set any hex as a custom accent.
- `src/styles.css` imports Tailwind v4, resets its default palette, then imports
  the token files. Only AwesomeDS roles exist as utilities (`bg-canvas`,
  `text-ink`, `border-hairline`, `rounded-md`, `shadow-2`, `ease-out-ds`,
  `duration-base`). Because `src/ds/tokens` is gitignored, Tailwind's automatic
  source detection skips `src/ds`; `styles.css` lists the source folders with
  `@source`. Add a new folder there if you create one.
- `src/lib/knowledge.ts` loads `Knowledge/**/*.md` and `AwesomeDS/foundations/*.md`
  with `import.meta.glob` and parses the frontmatter (`title`, `category`,
  `type`, `sources[{url,title}]`, `tags[]`, `updated`).
- `vite.config.ts` uses `base` `/` (override with `SITE_BASE`). The router reads `import.meta.env.BASE_URL`.
- `scripts/postbuild.mjs` copies `index.html` to `404.html` so deep links work
  on Vercel.

## Screenshots

`pnpm screenshot` expects Playwright browsers at `/opt/pw-browsers`
(`PLAYWRIGHT_BROWSERS_PATH`). Pass route paths to limit the run:
`pnpm screenshot / /components`.

## デプロイ (Deploy)

- Vercel で配信します。Root Directory は `web` です。
- `vercel.json` がビルド設定、SPA の書き換え、`X-Robots-Tag: noindex` ヘッダーを持ちます。
- `base` の既定は `/` です。別のパスで配信するときだけ `SITE_BASE=/path/ pnpm build` を使います。

Vercel hosts the site from Root Directory `web`; see `vercel.json` for build, rewrite and noindex settings.
