# Capture playbook

`scripts/capture.mjs` drives Playwright Chromium and saves PNGs plus a `manifest.json`.

## Prerequisites

```
node --version            # 18 or newer
npx playwright --version  # any 1.40+
```

Browser binary resolution, in order:
1. `CHROMIUM_PATH` env var, used as `executablePath` when set.
2. `PLAYWRIGHT_BROWSERS_PATH` env var: Playwright resolves the browser from that folder itself.
3. Playwright's default cache (`~/.cache/ms-playwright` on Linux, `~/Library/Caches/ms-playwright` on macOS, `%LOCALAPPDATA%\ms-playwright` on Windows).

If the script prints `Executable doesn't exist`:

```
npx playwright install chromium
# or, in a project without playwright installed:
npm i -D playwright && npx playwright install chromium
# CI or containers missing system libs:
npx playwright install --with-deps chromium
```

If `import('playwright')` fails, the script tries `playwright-core`. Install one of them in the project or run from a folder where `npx playwright` works. Do not install into `${CLAUDE_PLUGIN_ROOT}`; the plugin folder is read-only in installs.

## Usage

```
node ${CLAUDE_PLUGIN_ROOT}/skills/design-verifier/scripts/capture.mjs \
  --urls http://localhost:3000,http://localhost:3000/pricing \
  --widths 390,768,1280 \
  --schemes light,dark \
  --out design-review/shots \
  --full-page \
  --states
```

Options

| Flag | Default | Meaning |
|---|---|---|
| `--urls a,b` or `--urls-file list.txt` | required | URLs or `file:///abs/path.html`. Plain paths are converted to file URLs. |
| `--widths` | `390,768,1280` | Viewport widths in CSS px. Height is 844 for 390, 1024 for 768, 800 for 1280 and above unless `--height` is given. |
| `--schemes` | `light,dark` | Emulates `prefers-color-scheme` and also sets `document.documentElement.dataset.theme` so both AwesomeDS switches fire. |
| `--out` | `design-review/shots` | Output folder, created if missing. |
| `--full-page` | off | Also saves a full-page PNG next to the first-viewport one. |
| `--states` | off | Extra shots: keyboard focus on the first focusable element (Tab), hover on the first link, and `prefers-reduced-motion: reduce`. |
| `--wait` | `networkidle` | Playwright wait state: `load`, `domcontentloaded`, `networkidle`. |
| `--delay` | `300` | Milliseconds to wait after load, for fonts and enter animations to settle. |
| `--scale` | `1` | deviceScaleFactor. Keep 1 so measurements in the PNG equal CSS px. |
| `--theme-attr` | `data-theme` | Attribute used by the site's theme switch. Set to `class` for Tailwind `dark` class strategy. |
| `--timeout` | `30000` | Per-page navigation timeout. |

File naming: `<route-slug>__<width>__<scheme>[__full|__focus|__hover|__reduced].png`. `manifest.json` lists every file with url, width, scheme, state, and the page title.

## Reading the screenshots

- Open the 390 light shots first. If the primary action is not in the first viewport there, the hero fails.
- Then 1280 light, then dark. Compare light and dark for the same route side by side: dark should show lighter surfaces as they rise, no shadows, and the accent lightened.
- Measure with the pixel grid: at `--scale 1` one PNG pixel equals one CSS pixel. A 40px button is 40 rows tall.
- Focus shot: a visible 2px ring around the first focusable element. If you see nothing, that is an S1 finding.
- Reduced-motion shot taken 50ms after load: if it looks different from the light shot (elements still hidden waiting for an animation), enter animations do not respect reduced motion.

## Dev server not running

Do not start long-running servers on your own. Ask the user to start it and give you the URL, or capture static build output (`dist/`, `out/`, `build/`) with file URLs. For Next.js, `next build && next export` output or the `.next` server both need the user to run them.

## Common failures

| Symptom | Fix |
|---|---|
| `net::ERR_CONNECTION_REFUSED` | Server not running on that port. Ask the user. |
| Blank white screenshots | SPA rendered after `networkidle`; raise `--delay 1500` or use `--wait load`. |
| Fonts look wrong | Web fonts blocked or not loaded before capture; raise `--delay`. Fallback font is itself a finding if it happens for users too. |
| Cookie banner covers the hero | Note it as a finding (banner in hero) and re-run with `--dismiss "<css selector>"` to click it away. |
| `Executable doesn't exist` | `npx playwright install chromium` (see above). |
