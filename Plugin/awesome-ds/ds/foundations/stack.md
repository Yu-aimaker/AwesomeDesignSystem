# Stack

AwesomeDS is framework-agnostic at the token level (plain CSS variables) but recommends
one stack so agents stop re-deciding. This file lists the recommendation, the reason for
each part, and a table of when to deviate.

## Recommended stack

| Layer | Choice | Reason |
|---|---|---|
| Language | TypeScript | Types catch the prop mistakes that break component states (a `variant` typo, a missing `aria-label`). Tooling and refactors depend on it. |
| UI runtime | React 19 | Stable Server Components, Actions, `ref` as a prop, native document metadata. shadcn/ui, Radix, Base UI and Motion all target it. |
| App framework | Next.js App Router for sites and full-stack apps; Vite for a pure SPA | App Router gives RSC, streaming, `next/font` with zero layout shift. Vite is faster to start for an SPA that has no server. |
| Styling | Tailwind CSS v4 | `@theme` maps tokens to utilities in CSS, no config file. `tokens/tailwind.css` already provides `bg-canvas`, `text-ink`, `rounded-md`, `duration-base`. |
| Components | shadcn/ui, Base UI primitives (default since July 2026), Radix accepted | Components are copied into the project and restyled with tokens; both primitive libraries ship keyboard, focus and ARIA behaviour. |
| Motion | Motion (`motion/react`) | Declarative springs, `AnimatePresence`, `layout`, `useReducedMotion`. See motion.md for GSAP, Lottie, three.js exceptions. |
| Icons | Lucide (`lucide-react`) | Ships with shadcn/ui; see iconography.md. |
| Fonts | Geist and Noto Sans JP via `next/font` (Next.js) or `@fontsource-variable/*` (Vite) | Self-hosted, subset, `size-adjust` fallbacks. |
| Toasts | Sonner | Accessible, promise-aware, integrated into shadcn/ui. |
| Command menu | cmdk | Filtering, keyboard navigation and combobox semantics; used by shadcn's Command. |
| Visual checks | Playwright `toHaveScreenshot()` | Pixel comparison per breakpoint and theme; waits for fonts and animations to settle. |
| Component workshop | Storybook 9 (optional) | Isolated states, Vitest-based interaction and a11y tests. Optional because Playwright plus a `/dev/components` route covers small teams. |
| Lint and format | Biome; or ESLint + Prettier when the repo already has them | One tool, one config, fast. ESLint + Prettier remain fine and are the Next.js default. |

## Setup order for a new project

1. `create-next-app` (TypeScript, App Router, Tailwind) or `npm create vite@latest -- --template react-ts`.
2. Copy `AwesomeDS/DESIGN.md` to the project root. Import `tokens/tokens.css` then
   `tokens/tailwind.css` in the global stylesheet after `@import "tailwindcss";`.
3. `npx shadcn@latest init`, then add components as needed. Replace shadcn's color
   variables with the `--ds-*` tokens in `globals.css`.
4. Fonts: `next/font/google` for Geist and Noto Sans JP with `display: "swap"`, or install
   `@fontsource-variable/geist` and `@fontsource-variable/noto-sans-jp`.
5. `npm i motion lucide-react sonner cmdk`.
6. `npm i -D @playwright/test @biomejs/biome`. Add a screenshot test for the home page at
   390, 768 and 1280 px in light and dark.
7. Run `components/checklist.md` before the first commit.

## Rules

- Server Components render layout; anything using Motion, scroll or pointer state is a
  leaf with `"use client"`.
- Never store continuous values (scroll, pointer) in React state. Use motion values.
- Check `package.json` before importing a library; print the install command if missing.
- One component library, one icon family, one animation library per page.
- Do not import a pre-styled kit (MUI, Chakra, Mantine) alongside shadcn; pick one.

## When to deviate

| Situation | Deviation | Keep |
|---|---|---|
| Brief names Material, Fluent, Carbon, Polaris, GOV.UK, USWDS | Use that official package; do not recreate it. | AwesomeDS principles and checklist still apply to copy, layout, motion. |
| Existing project on Tailwind v3 | Stay on v3; map tokens via `theme.extend` using the `--ds-*` variables. | Token values unchanged. |
| Existing project on Vue, Svelte, Solid | Drop React-specific parts; keep `tokens.css`, use the framework's headless library (Radix Vue, Bits UI, Kobalte). | Tokens, foundations, checklist. |
| Static marketing site with no interactivity | Astro or plain HTML with `tokens.css`; CSS transitions only. | Everything except the React stack. |
| Heavy scrollytelling page | Add GSAP ScrollTrigger in isolated components. | Motion for UI state; never both on one tree. |
| 3D product | react-three-fiber in a client leaf. | Everything else. |
| Team already on ESLint + Prettier | Keep them. | Same rules; Biome is a preference, not a requirement. |
| Storybook exists | Use it for state coverage and a11y addon. | Playwright still owns page-level screenshots. |
| Public-sector Japan | Consider the Digital Agency design system tokens and components alongside AwesomeDS typography rules. | Japanese typography rules. |
| Brand needs a serif, pill buttons, or a tinted palette | Run `ds-creator`; produce a brand DESIGN.md that overrides tokens. | Structure, roles, checklist. |

## Alternatives considered

| Alternative | Why not the default |
|---|---|
| Radix Themes (pre-styled) | Good, but it brings its own tokens and fights the `--ds-*` roles. |
| MUI / Chakra / Mantine | Pre-styled kits look like themselves; restyling is more work than owning shadcn code. |
| CSS Modules or vanilla-extract instead of Tailwind | Valid; Tailwind chosen because agents produce it reliably and `@theme` maps tokens directly. |
| Framer Motion name | Same library, renamed Motion; import from `motion/react`. |
| Remix / TanStack Start | Fine choices; Next.js chosen for `next/font` and the largest shadcn install base. |
| Jest + RTL for visual checks | Cannot see rendering; Playwright screenshots do. |

## Sources

- https://www.typescriptlang.org/docs/handbook/intro.html : TypeScript handbook.
- https://react.dev/blog/2024/04/25/react-19-upgrade-guide : React 19 features and upgrade path.
- https://react.dev/versions : current React versions (19.x).
- https://nextjs.org/docs/app : App Router documentation.
- https://nextjs.org/docs/app/getting-started/fonts : `next/font` self-hosting, zero layout shift.
- https://dev.to/tak089/vite-for-react-spa-3do9 : Vite for React SPAs (`create vite` template); secondary source, official docs were not reachable in this session.
- https://tailwindcss.com/docs/theme : `@theme` variables in Tailwind v4.
- https://tailwindcss.com/docs/functions-and-directives : `@theme`, `@import` directives.
- https://ui.shadcn.com/docs/changelog/2026-07-base-ui-default : Base UI as shadcn default; Radix still supported.
- https://ui.shadcn.com/docs/changelog/2026-01-base-ui : Base UI documentation launch.
- https://www.radix-ui.com/primitives : Radix Primitives.
- https://motion.dev/docs/react-transitions : Motion for React.
- https://lucide.dev/guide/packages/lucide-react : Lucide React.
- https://fontsource.org/fonts/geist/install : Fontsource Geist.
- https://www.npmjs.com/package/@fontsource-variable/noto-sans-jp : Fontsource Noto Sans JP variable.
- https://github.com/emilkowalski/sonner : Sonner toasts.
- https://ui.shadcn.com/docs/components/radix/sonner : Sonner in shadcn.
- https://www.npmjs.com/package/cmdk : cmdk command menu.
- https://playwright.dev/docs/test-snapshots : `toHaveScreenshot()` visual comparisons.
- https://storybook.js.org/docs/writing-tests/visual-testing : Storybook visual tests.
- https://storybook.js.org/announce/sb9 : Storybook 9 and Vitest integration.
- https://biomejs.dev/ : Biome formatter and linter.
- https://github.com/digital-go-jp/design-system-example-components-react : Digital Agency React components.
- https://github.com/Leonxlnx/taste-skill : official-package rule, RSC isolation, dependency verification.
