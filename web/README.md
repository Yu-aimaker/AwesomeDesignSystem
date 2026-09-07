# AwesomeDS web

The documentation and gallery site for AwesomeDS. Built with the system itself:
every color, radius, spacing, font and duration comes from `AwesomeDS/tokens`.

## Commands

```sh
pnpm install
pnpm dev          # copies tokens, starts Vite at http://localhost:5173
pnpm build        # tsc --noEmit, vite build, writes dist/404.html
pnpm preview      # serves dist/ under /Awesome-Design-Systems-Claude/
pnpm screenshot   # Playwright: every route at 390 and 1280, light and dark -> .screenshots/
pnpm typecheck
```

Node 22 and pnpm 10.

## How it is wired

- `scripts/sync-tokens.mjs` copies `../AwesomeDS/tokens/{tokens.css,tailwind.css,tokens.json}`
  into `src/ds/tokens/` before `dev` and `build`. The copy is gitignored; the
  source of truth stays in `AwesomeDS/`.
- `src/styles.css` imports Tailwind v4, resets its default palette, then imports
  the token files. Only AwesomeDS roles exist as utilities (`bg-canvas`,
  `text-ink`, `border-hairline`, `rounded-md`, `shadow-2`, `ease-out-ds`,
  `duration-base`). Because `src/ds/tokens` is gitignored, Tailwind's automatic
  source detection skips `src/ds`; `styles.css` lists the source folders with
  `@source`. Add a new folder there if you create one.
- `src/lib/knowledge.ts` loads `Knowledge/**/*.md` and `AwesomeDS/foundations/*.md`
  with `import.meta.glob` and parses the frontmatter (`title`, `category`,
  `type`, `sources[{url,title}]`, `tags[]`, `updated`).
- `vite.config.ts` sets `base` to `/Awesome-Design-Systems-Claude/` for builds
  and `/` for dev. The router reads `import.meta.env.BASE_URL`.
- `scripts/postbuild.mjs` copies `index.html` to `404.html` so deep links work
  on GitHub Pages.

## GitHub Pages

`.github/workflows/deploy-pages.yml` builds on push to `main` and deploys with
`actions/deploy-pages`. In the repository, set Settings → Pages → Source to
"GitHub Actions" once.

## Screenshots

`pnpm screenshot` expects Playwright browsers at `/opt/pw-browsers`
(`PLAYWRIGHT_BROWSERS_PATH`). Pass route paths to limit the run:
`pnpm screenshot / /components`.
