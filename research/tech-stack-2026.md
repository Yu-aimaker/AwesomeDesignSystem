---
title: AI-Native Modern Frontend Tech Stack (June 2026)
description: Best-practice, AI-agent-first frontend stack as of June 2026 — current versions, rationale, copy-paste setup snippets, and the AI-native angle (v0, shadcn registry, MCP).
date: 2026-06-09
tags: [frontend, react, nextjs, tailwind, shadcn, ai-native, tech-stack, 2026]
---

# AI-Native Modern Frontend Tech Stack — June 2026

A primary-source-backed snapshot of the best-practice frontend stack as of **June 2026**, written for AI agents to consume **without re-fetching**. Every layer below lists the current version, why it is best practice, and the AI-native angle. Real, copy-paste-ready code beats prose.

## TL;DR — The Recommended Default Stack

| Layer | Default choice (June 2026) | Version | Why |
|---|---|---|---|
| UI library | **React** | 19.2 | Actions, `use()`, RSC, Compiler 1.0 all stable |
| Meta-framework | **Next.js (App Router)** | 16.2 | Turbopack default, Cache Components/PPR, RSC-mature |
| Styling | **Tailwind CSS** | v4.3 | CSS-first `@theme`, oklch, Oxide engine, runtime CSS vars |
| Components | **shadcn/ui** (copy-paste) + **Base UI** or **Radix** primitives | CLI 3.x / Base UI 1.x | You own the code; AI-friendly; MCP/registry distribution |
| Accessibility primitives | **Base UI** (new default) / **React Aria** (max a11y) | 1.x / latest | Headless, full-time maintained |
| Server-state | **TanStack Query** | v5 | Suspense-first, smaller, standard |
| Client-state | **Zustand** | v5 | Zero-boilerplate, `useSyncExternalStore` |
| Build / dev | **Turbopack** (in Next) or **Vite 8 + Rolldown** (standalone) | — | Rust-fast, default |
| Package manager / runtime | **Bun** | 1.2+ | Fast installs, scripts, server bundles |
| Fonts | **`next/font`** (or Fontsource) + variable fonts | — | Self-hosted, zero CLS, GDPR-safe |
| Deployment | **Vercel** (Next-native) or **Cloudflare Workers** (cost/edge, via OpenNext) | — | Fluid Compute vs V8 isolates |
| AI generation | **v0** + **shadcn registry** + **MCP** | — | Design-system-grounded codegen |

**One-line default:** `Next.js 16 (App Router) + React 19 + Tailwind v4 + shadcn/ui (Base UI primitives) + TanStack Query + Zustand`, deployed on Vercel, generated/assisted by v0 grounded in a shadcn registry over MCP.

**Content-heavy sites:** swap Next.js for **Astro 6** (Content Layer + Server Islands). **Type-safe SPA/full-stack without Vercel lock-in:** **TanStack Start v1** or **React Router v7** (framework mode) on **Vite 8**.

---

## 1. React 19 — the foundation

**Current:** React **19.2** (Oct 2025); 19.0 stable shipped Dec 5 2024. React Compiler reached **1.0** (Oct 2025).

### Why it is best practice
React 19 collapses the old `useState + useTransition + manual error handling` boilerplate into **Actions**, makes data-fetching declarative with **`use()`**, and ships **Server Components (RSC)** + **Server Actions** as a stable, framework-backed model. The Compiler removes most manual `useMemo`/`useCallback`.

### Actions + form hooks
Async functions passed to a transition auto-manage pending state, errors, and optimistic updates.

```tsx
"use client";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

async function updateName(prev: string, formData: FormData) {
  const name = formData.get("name") as string;
  const res = await fetch("/api/name", { method: "POST", body: name });
  if (!res.ok) return "Failed to update"; // becomes the error state
  return ""; // success
}

function SubmitButton() {
  const { pending } = useFormStatus(); // reads nearest parent <form>
  return <button disabled={pending}>{pending ? "Saving…" : "Save"}</button>;
}

export function NameForm() {
  const [error, formAction, isPending] = useActionState(updateName, "");
  return (
    <form action={formAction}>
      <input name="name" />
      <SubmitButton />
      {error && <p role="alert">{error}</p>}
    </form>
  );
}
```

### `use()` — read promises/context in render
`use()` can be called conditionally and inside loops (unlike other hooks). Stable in **Server Components**; on the client it integrates with Suspense but production-stable use is in RSC.

```tsx
import { use, Suspense } from "react";

function Comments({ commentsPromise }: { commentsPromise: Promise<string[]> }) {
  const comments = use(commentsPromise); // suspends until resolved
  return <ul>{comments.map((c) => <li key={c}>{c}</li>)}</ul>;
}

export default function Page() {
  const commentsPromise = fetch("/api/comments").then((r) => r.json());
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <Comments commentsPromise={commentsPromise} />
    </Suspense>
  );
}
```

### Server Components & Server Actions
- RSC are the **default** in `app/` — zero JS shipped for them. They cannot use `useState`/`useEffect`/context; add `"use client"` for interactivity.
- `"use server"` marks **Server Actions** (functions callable from Client Components), **not** Server Components.
- Client Components cannot import Server Components (the reverse is fine).
- Caveat: RSC are stable as a *React feature*, but the *bundler APIs* do not follow semver across 19.x minors — you need a framework (Next.js is the most mature).

### Other wins
- **No more `forwardRef`** — `ref` is a normal prop on function components (codemod available).
- **React Compiler 1.0** — build-time auto-memoization; opt-in in Next via `reactCompiler: true`.
- Better hydration resilience and error reporting (`onCaughtError`, `onUncaughtError`, `onRecoverableError`).
- 19.2 adds **View Transitions**, **`useEffectEvent`**, and **`<Activity>`**.

---

## 2. Next.js — the default meta-framework

**Current:** Next.js **16.2** (Mar 18 2026); 16.0 shipped Oct 21 2025. App Router is the recommended path; Pages Router is legacy.

### Why it is best practice
The App Router is the most mature RSC implementation. Next 16 makes **Turbopack the default bundler** (2–5× faster builds, up to 10× faster Fast Refresh), introduces **Cache Components** (explicit, opt-in caching built on PPR), ships **Devtools MCP** for AI-assisted debugging, and renames `middleware.ts` → `proxy.ts`.

### Cache Components + PPR (the new caching model)
All dynamic code runs at request time by default; caching is **opt-in** via the `"use cache"` directive. **Partial Prerendering (PPR)** serves a static shell instantly and streams dynamic content via Suspense.

```ts
// next.config.ts
const nextConfig = {
  cacheComponents: true, // enables PPR + "use cache" model
  // reactCompiler: true, // optional: build-time memoization (Babel-based, slower builds)
};
export default nextConfig;
```

```tsx
// "use cache" caches a component/function; the compiler generates the cache key
async function ProductList() {
  "use cache";
  const products = await db.products.findMany();
  return <ul>{products.map((p) => <li key={p.id}>{p.name}</li>)}</ul>;
}
```

### New caching APIs (16)
```ts
import { revalidateTag, updateTag, refresh } from "next/cache";

revalidateTag("blog-posts", "max"); // SWR; profile arg now REQUIRED
// In a Server Action — read-your-writes (expire + read fresh in same request):
updateTag(`user-${id}`);
// In a Server Action — refresh uncached data only (doesn't touch cache):
refresh();
```

### proxy.ts (formerly middleware.ts)
```ts
// proxy.ts — runs on Node.js runtime, makes the network boundary explicit
import { NextRequest, NextResponse } from "next/server";
export default function proxy(request: NextRequest) {
  return NextResponse.redirect(new URL("/home", request.url));
}
```

### Minimal setup
```bash
npx create-next-app@latest    # App Router + TS + Tailwind + ESLint by default
# Upgrade an existing app:
npx @next/codemod@canary upgrade latest
```

### Key breaking changes / requirements (16)
- **Node.js 20.9+** (Node 18 dropped), **TypeScript 5.1+**, browsers Chrome/Edge/Firefox 111+, Safari 16.4+.
- `params`, `searchParams`, `cookies()`, `headers()`, `draftMode()` are now **async** — must `await`.
- `experimental.ppr` / `dynamicIO` removed → use `cacheComponents`. `next lint` removed → use ESLint/Biome.
- `images.domains` deprecated → `images.remotePatterns`; opt out of Turbopack with `next build --webpack`.

### AI-native angle
**Next.js Devtools MCP** gives AI agents routing/caching/rendering knowledge, unified browser+server logs, automatic error/stack-trace access, and active-route awareness — agents diagnose and fix inside the dev loop. `create-next-app` now scaffolds `AGENTS.md`.

---

## 3. Framework alternatives — pick by workload

| Framework | Current | Best for | Rationale |
|---|---|---|---|
| **Next.js 16** | 16.2 | App-first products, RSC, edge SSR | Most mature RSC; deep Vercel integration |
| **Astro 6** | stable since Mar 2026 | Content/marketing/docs | Ships ~zero JS by default; Content Layer; Server Islands |
| **TanStack Start v1** | v1 (GA late 2025) | Type-safe full-stack SPA | End-to-end types, server functions, Vite+Nitro, no Vercel lock-in |
| **React Router v7** | v7 | Remix successor / migration | Remix folded into RR; declarative/data/framework modes |
| **SvelteKit + Svelte 5** | SK 2.57 / Svelte 5.55 | Lean apps, smallest bundles | Runes reactivity; single-command deploy |

### Astro 6 — content-driven sites
**Content Layer** is a unified, type-safe API to load content from anywhere (Markdown, CMS, REST, assets). Markdown builds up to **5× faster**, MDX up to **2×**, memory cut **25–50%**. **Server Islands** combine static HTML with deferred dynamic components via `server:defer`. Astro can host React/Vue/Svelte/Solid islands on the same page.

```astro
---
// src/content.config.ts (v6 path; was src/content/config.ts in v5)
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/blog" }),
  schema: z.object({ title: z.string(), date: z.date() }),
});
export const collections = { blog };
---
```
```astro
<!-- Server Island: skipped on first paint, streamed in later -->
<UserAvatar server:defer>
  <Placeholder slot="fallback" />
</UserAvatar>
```
Migration note (v5→v6): Node `^22.12 || ^24`, Zod major bump (`.nonempty()` → `.min(1)`), removed `Astro.glob`, `getEntryBySlug`.

### TanStack Start v1 — type-safe full-stack
Built on TanStack Router + Vite + Nitro. **Server functions** are TypeScript functions that always run on the server but are called like normal functions from the client — no manual API contracts. Pairs natively with TanStack Query/Router/Table/Form. RSC support is experimental as of v1; choose Next.js if you need RSC today.

```ts
import { createServerFn } from "@tanstack/react-start";
const getUser = createServerFn({ method: "GET" })
  .handler(async () => db.user.findFirst()); // runs only on server
```

### React Router v7 — Remix, merged
Remix is now `react-router` (single package). v6→v7 is a non-breaking upgrade. **Framework mode** adds Vite compiler, SSR, bundle splitting, type-safe loaders/actions, and HMR. RR7 dropped React Native.

### SvelteKit + Svelte 5 runes
Four runes replace implicit reactivity: `$state`, `$derived`, `$effect`, `$props`. Reactivity now works **outside `.svelte` files** (in `.svelte.ts`). Runes mode activates the moment you use any rune — adopt file-by-file. Scaffold with the `sv` CLI; `$app/stores` is deprecated in favor of `$app/state`.

```svelte
<script>
  let count = $state(0);
  let doubled = $derived(count * 2);
  $effect(() => console.log("count is", count)); // runs after DOM update
</script>
<button onclick={() => count++}>{count} / {doubled}</button>
```

---

## 4. Styling — Tailwind CSS v4 (default)

**Current:** Tailwind **v4.3** (v4.0 shipped early 2025; v4.1 added text-shadow/mask utilities Apr 2025; first public beta Nov 2024). New **Oxide** engine (Rust + Lightning CSS).

### Why it is best practice
v4 eliminates the JS config file — all customization is **CSS-first** via `@theme`. Every design token becomes a real CSS variable at runtime, so themes can be overridden without rebuilding. The default palette moved to **oklch** for a wider gamut and perceptually-uniform lightness.

### Setup (Vite)
```bash
npm install tailwindcss @tailwindcss/vite
```
```ts
// vite.config.ts
import tailwindcss from "@tailwindcss/vite";
export default { plugins: [tailwindcss()] };
```
```css
/* app.css — single import, no @tailwind base/components/utilities */
@import "tailwindcss";
```

### CSS-first `@theme`
Theme variables both **create utilities** and **emit CSS variables** in `:root`.

```css
@import "tailwindcss";

@theme {
  /* color — oklch(L C H); generates bg-brand-500, text-brand-500, etc. */
  --color-brand-500: oklch(0.72 0.11 178);
  --color-brand-600: oklch(0.62 0.12 178);

  /* typography */
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --text-display: 3.5rem;          /* text-display */
  --font-weight-semibold: 600;

  /* spacing scale base (px-4 = calc(var(--spacing) * 4)) */
  --spacing: 0.25rem;

  /* radius, shadow, breakpoint, easing, animation namespaces */
  --radius-xl: 0.75rem;
  --shadow-card: 0 1px 3px oklch(0 0 0 / 0.1);
  --breakpoint-3xl: 120rem;        /* enables 3xl:* variants */
  --ease-snappy: cubic-bezier(0.2, 0, 0, 1);
  --animate-fade: fade 200ms var(--ease-snappy);
}
```

Theme namespaces: `--color-*`, `--font-*`, `--text-*`, `--font-weight-*`, `--tracking-*`, `--leading-*`, `--spacing-*`, `--radius-*`, `--shadow-*`, `--breakpoint-*`, `--container-*`, `--blur-*`, `--ease-*`, `--animate-*`.

### Reference tokens anywhere (the runtime-theming superpower)
```css
@layer components {
  .typography h1 {
    font-size: var(--text-display);
    font-weight: var(--font-weight-semibold);
    color: var(--color-brand-600);
  }
}
```
```html
<div style="background-color: var(--color-brand-500)"></div>
<div class="rounded-[calc(var(--radius-xl)-1px)]"></div>
```

### Dark mode & overrides
- Plain `@theme` lets a parent selector override a variable (how dark mode cascades). Use `@theme inline` only when the utility should NOT participate in the cascade.
- Clear a whole namespace with `--color-*: initial;` before redefining a custom palette.
- Gradient interpolation: `bg-linear-to-r/oklch` vs `/srgb` (oklab is default).

### Browser support
Because oklch is the default: Safari 16.4+, Chrome 111+, Firefox 128+.

### When to use CSS Modules / vanilla-extract instead
- **CSS Modules** — zero-runtime, locally-scoped class names, framework-agnostic; good when you want plain CSS without utility classes or for incremental migration.
- **vanilla-extract** — TypeScript-authored, **type-safe** zero-runtime CSS with `createTheme`/contract tokens; best when you want compile-time-checked design tokens and CSS-in-TS ergonomics without runtime cost. Pairs well with strict design-system token contracts.
- **Pick Tailwind v4** for the default — it is the AI-native choice: models are heavily trained on its utility vocabulary and v0/shadcn emit it natively.

---

## 5. Component layers — own your code

Modern UI is a **layered** stack: behavioral/accessibility **primitives** (headless) → **shadcn/ui** copy-paste components styled with Tailwind → your design system.

| Layer | Library | Current | Role |
|---|---|---|---|
| Copy-paste components | **shadcn/ui** | CLI 3.x | You own the source; Tailwind-styled; not an npm dependency |
| Headless primitives | **Base UI** (new default) | 1.x (Dec 2025) | Unstyled, accessible; render-prop composition |
| Headless primitives | **Radix UI** | mature | Original; `asChild`; ~131M weekly downloads |
| Accessibility hooks | **React Aria** (Adobe) | latest | Hooks-first; deepest a11y + i18n; most verbose |

### shadcn/ui — the AI-native distribution model
Not a library — a **code-distribution system**. `npx shadcn add button` copies the source into your repo, so you own and customize it. Upstream changes are not auto-pulled (re-run `add` or merge). Works with any framework.

```bash
npx shadcn@latest init          # writes components.json
npx shadcn@latest add button card dialog
```

**CLI 3.0 (Aug 2025)** added **namespaced registries** (`@registry/name`) and a rewritten **MCP server** (zero-config, works with any registry). Configure registries in `components.json`:

```jsonc
// components.json
{
  "registries": {
    "@acme": "https://registry.acme.com/{name}.json",
    "@v0": "https://v0.dev/r/{name}.json"
  }
}
```
```bash
npx shadcn@latest add @acme/button @v0/dashboard   # mix sources; deps auto-resolve
```

In **Dec 2025**, shadcn/ui added **Base UI** as a selectable primitive layer alongside Radix — new projects can pick either; existing Radix projects need no migration.

### Base UI vs Radix
- **Base UI** (from creators of Radix, Floating UI, Material UI) reached **1.0 in Dec 2025**, full-time MUI-backed. Single dependency `@base-ui/react` (renamed from `@base-ui-components/react`). Broader coverage (multi-select, combobox), **render-prop** composition instead of `asChild`, data-driven `Select`.
- **Radix** pioneered headless React; still huge and reliable, but momentum slowed after the WorkOS acquisition.
- **Recommendation:** new projects → **Base UI**; existing Radix-based shadcn apps → stay on Radix, no rush.

```tsx
// Base UI — explicit render prop instead of Radix's asChild
import { Dialog } from "@base-ui/react/dialog";
<Dialog.Root>
  <Dialog.Trigger render={<button className="btn" />}>Open</Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Backdrop className="fixed inset-0 bg-black/40" />
    <Dialog.Popup className="fixed inset-1/2 rounded-xl bg-white p-6">
      <Dialog.Title>Title</Dialog.Title>
    </Dialog.Popup>
  </Dialog.Portal>
</Dialog.Root>
```

### React Aria — when accessibility is contractual
Hooks (`useButton`, `useDialog`, `useTabs`) covering 40+ patterns with rigorous ARIA, i18n, RTL, and locale-aware date/number handling. More code per component, maximum control. Best for government/enterprise WAI-ARIA requirements; skip for fast v0-style prototyping.

---

## 6. State & data

Split concerns: **server-state** (async data from a backend) vs **client-state** (UI/ephemeral). Use the right tool for each.

### TanStack Query v5 — server-state
~20% smaller than v4; single-object API (overloads removed); Suspense is first-class (`useSuspenseQuery`); `cacheTime`→`gcTime`, `keepPreviousData`→`placeholderData`, `loading`→`pending`. Requires React 18+ (`useSyncExternalStore`). Comes with codemod + ESLint rule.

```tsx
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
const queryClient = new QueryClient();

function Todos() {
  const { data, isPending, error } = useQuery({
    queryKey: ["todos"],
    queryFn: () => fetch("/api/todos").then((r) => r.json()),
  });
  if (isPending) return <p>Loading…</p>;
  if (error) return <p role="alert">Error</p>;
  return <ul>{data.map((t) => <li key={t.id}>{t.title}</li>)}</ul>;
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Todos />
    </QueryClientProvider>
  );
}
```

> In Next.js App Router, prefer fetching in **Server Components / Server Actions** for initial data; use TanStack Query for client-side caching, refetching, infinite lists, and mutations.

### Zustand v5 — client-state
User-satisfaction leader in State of React 2025. Zero-boilerplate `create()`, no Provider, selector subscriptions, `useSyncExternalStore` under the hood. Middleware: `persist`, `devtools`, `immer`, `subscribeWithSelector`.

```ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type CartState = {
  items: string[];
  add: (id: string) => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      // immutable update — new array, no mutation
      add: (id) => set((s) => ({ items: [...s.items, id] })),
    }),
    { name: "cart" } // localStorage key
  )
);

// component — subscribe to a slice only
const count = useCart((s) => s.items.length);
```

**When to reach for alternatives:** Redux Toolkit for large, long-lived apps needing strict structure/debuggability; Jotai for atomic/derived graphs. For most UI-heavy apps, **Zustand + TanStack Query** covers both axes with minimal ceremony.

---

## 7. Build tooling — Rust everywhere

2026's theme: core JS tooling is rewritten in Rust/Zig. The performance ceiling rose for everyone.

| Tool | Current | Use for | Notes |
|---|---|---|---|
| **Turbopack** | stable in Next 16 | Next.js apps | Default bundler; Next-locked (no standalone yet) |
| **Vite 8 + Rolldown** | v8 (Rolldown RC) | Everything non-Next | Rolldown (Rust) replaces esbuild + Rollup; unified dev+build |
| **Rspack** | stable | webpack migrations | Fastest cold start/prod build; keeps webpack config |
| **Bun** | 1.2+ | installs, scripts, server bundles, CLIs | Zig runtime; fastest installs; complements Vite |

### Guidance
- **Pick Rspack for migrations, Turbopack for Next.js shops, Vite for everything else.** Run **Vite *with* Bun** (Bun for installs/scripts/runtime, Vite for HMR + framework plugins + prod build) rather than replacing one with the other.
- Vendor "10–30×" claims are best-case release-note numbers; independent benchmarks show HMR roughly comparable between Turbopack and Vite+Rolldown, with cold-start/prod wins varying by tool.

### Minimal Vite 8 + React + Tailwind setup
```bash
bun create vite@latest my-app -- --template react-ts
cd my-app && bun add tailwindcss @tailwindcss/vite
bun install && bun run dev
```

---

## 8. Fonts — self-hosted variable fonts

**Best practice:** self-host (privacy + GDPR + speed), prefer **variable fonts** (one file, all weights), and expose a **CSS variable** so Tailwind/CSS can consume it. `next/font` preloads at build and uses `size-adjust` fallbacks to eliminate CLS (FOIT/FOUT).

### `next/font` (default for Next.js)
```tsx
// app/layout.tsx — auto self-hosted; no request to Google at runtime
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" }); // variable font → no weights

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
```
```css
/* Tailwind v4 — wire the CSS var into the theme */
@theme { --font-sans: var(--font-sans), ui-sans-serif, system-ui; }
```

### Fontsource (framework-agnostic, version-locked)
Treats fonts as npm dependencies (version-locked, includes open-source fonts beyond Google), auto-generates fallbacks. Choose it for non-Next setups (Vite/Astro/SvelteKit) or when you want fonts pinned in `package.json`.
```bash
npm install @fontsource-variable/inter
```
```ts
import "@fontsource-variable/inter"; // self-hosted, no external request
```

---

## 9. Deployment — Vercel vs Cloudflare

| Platform | Best for | Model | Cost shape |
|---|---|---|---|
| **Vercel** | Next.js SSR, zero-config | **Fluid Compute** (warm Node, near-zero cold start, 2 vCPU/4GB) | Usage-based Pro; pricier at high traffic |
| **Cloudflare Workers** | Edge logic, global, cost | **V8 isolates**, 330+ cities, sub-5ms cold starts, full storage (KV/R2/D1/DO) | ~$5/mo 10M req, no egress fees |

- **Vercel** delivers the deepest Next.js integration; **Fluid Compute** is the recommended runtime (warm instances, ~1.2–5× faster SSR vs Workers for render-heavy apps). Lock-in is **framework-shaped** (ISR/on-demand revalidation rely on Vercel infra).
- **Cloudflare Workers** wins on cost and cold-start distribution. Run Next.js via **OpenNext** (`@opennextjs/cloudflare`), which uses the **Node.js runtime** (not Edge) and supports Next 14/15/16 (Next 14 dropped Q1 2026). Lock-in is **storage-shaped** (Durable Objects are non-portable; R2 is S3-compatible, D1 is SQLite).
- **Hybrid is the 2026 winner:** auth at the edge, SSR on Fluid Compute, CPU-heavy jobs on serverless.

```bash
# Vercel
npx vercel deploy

# Cloudflare via OpenNext
npm install @opennextjs/cloudflare
npx @opennextjs/cloudflare && npx wrangler deploy   # auto-detects Next.js config
```

---

## 10. The AI-native angle — why this exact stack

The 2026 stack is shaped by what AI models generate well and what they can be **grounded** on.

### Why models love it
- **shadcn/ui + Tailwind + Radix/Base UI** are the patterns models are most trained on. v0 uses shadcn/ui *by default* because each abstraction layer (wrapping components, overriding styles, mismatched APIs) makes output harder to predict — owning the source lets models edit real code.
- **Copy-paste, not npm**: generated code drops straight into a repo that already owns identical component source — no version drift, no wrapper guessing.

### v0 (Vercel)
AI UI generator on Vercel's frontend-tuned model (React + Tailwind + shadcn/ui). Rebranded v0.dev → **v0.app** (Jan 2026); 6M+ developers (Mar 2026). 2026 added a sandbox runtime, Git panel (branches/PRs from chat), DB integrations, and agentic workflows. Generates multi-page Next.js apps. Caveat: frontend-focused; one-click deploy is Vercel-only.

### Registry + MCP = grounding
A **shadcn registry** is a distribution spec that passes your **design system context** (components, blocks, tokens) to AI models. It supports **MCP**, so the *same* registry grounds v0, Cursor, Windsurf, Claude Code — any MCP-ready tool — in your real components and tokens.

```jsonc
// registry.json — host at /r/registry.json (root) for MCP discovery
{
  "name": "acme-ui",
  "homepage": "https://registry.acme.com",
  "items": [
    {
      "name": "button",
      "type": "registry:component",
      "files": [{ "path": "ui/button.tsx", "type": "registry:component" }],
      "registryDependencies": ["@shadcn/button"]
    }
  ]
}
```
```bash
# Debug the registry MCP server inside Claude Code
/mcp
```
**Best practices for AI-consumable registries:** accurate dependency lists, `registryDependencies` for relationships, kebab-case names, and concise descriptions so agents understand each item. The **Registry Starter** (Next.js + shadcn) ships an "Open in v0" button that deep-links a component's `/r/<name>.json` into a v0 chat. Treat the registry as the bridge between a human-maintained design system and AI codegen.

> Security: community/public MCP registries are a supply-chain target — review installed code; prefer private/internal registries for proprietary systems.

---

## 11. Recommended default — full minimal setup

```bash
# 1. Scaffold (App Router + TS + Tailwind v4 + ESLint, AGENTS.md included)
npx create-next-app@latest acme-app
cd acme-app

# 2. Components — shadcn/ui (choose Base UI primitives when prompted)
npx shadcn@latest init
npx shadcn@latest add button card dialog form

# 3. Data + client state
npm install @tanstack/react-query zustand

# 4. Enable the new caching model
#    -> set cacheComponents: true in next.config.ts

# 5. Deploy
npx vercel deploy
```

```ts
// next.config.ts — recommended defaults
const nextConfig = {
  cacheComponents: true,           // PPR + "use cache"
  // reactCompiler: true,          // enable once build-time cost is acceptable
};
export default nextConfig;
```

**Decision shortcuts**
- Marketing/docs/blog → **Astro 6** + Tailwind v4 + island components.
- No-lock-in type-safe full-stack → **TanStack Start v1** + TanStack Query on **Vite 8**.
- Migrating off Remix → **React Router v7** framework mode.
- Cost-sensitive global edge → ship Next via **OpenNext on Cloudflare Workers**.
- Contractual accessibility → **React Aria** at the primitive layer.

---

## Sources

- React v19 (official announcement, Dec 5 2024) — https://react.dev/blog/2024/12/05/react-19
- React 19.2 announcement (Oct 1 2025) — https://react.dev/blog/2025/10/01/react-19-2
- `use` API reference — https://react.dev/reference/react/use
- Next.js 16 release (Oct 21 2025) — https://nextjs.org/blog/next-16
- Next.js 16.2 / Turbopack update (Mar 2026) — https://nextjs.org/blog/next-16-2-turbopack
- Next.js Upgrading: Version 16 — https://nextjs.org/docs/app/guides/upgrading/version-16
- Tailwind CSS v4.0 (blog) — https://tailwindcss.com/blog/tailwindcss-v4
- Tailwind CSS v4.1 (blog, Apr 3 2025) — https://tailwindcss.com/blog/tailwindcss-v4-1
- Tailwind CSS Theme variables (docs) — https://tailwindcss.com/docs/theme
- shadcn/ui Registry MCP Server — https://ui.shadcn.com/docs/registry/mcp
- shadcn/ui Namespaces — https://ui.shadcn.com/docs/registry/namespace
- shadcn CLI 3.0 + MCP changelog (Aug 2025) — https://ui.shadcn.com/docs/changelog/2025-08-cli-3-mcp
- shadcn/ui Tailwind v4 — https://ui.shadcn.com/docs/tailwind-v4
- Base UI (MUI) GitHub + releases — https://github.com/mui/base-ui
- Base UI 1.0 release (InfoQ, Feb 2026) — https://www.infoq.com/news/2026/02/baseui-v1-accessible/
- shadcn/ui vs Base UI vs Radix (2026) — https://www.pkgpulse.com/guides/shadcn-ui-vs-base-ui-vs-radix-components-2026
- React Aria (Adobe) — https://react-spectrum.adobe.com/react-aria/
- TanStack Start v1 announcement — https://tanstack.com/blog/announcing-tanstack-start-v1
- TanStack Query v5 announcement — https://tanstack.com/blog/announcing-tanstack-query-v5
- TanStack Query v5 migration guide — https://tanstack.com/query/v5/docs/react/guides/migrating-to-v5
- React Router v7 (Remix blog) — https://remix.run/blog/react-router-v7
- Astro 6.0 release (Mar 10 2026) — https://astro.build/blog/astro-6/
- Astro 5.0 release — https://astro.build/blog/astro-5
- Astro Content Layer deep dive — https://astro.build/blog/content-layer-deep-dive/
- Svelte 5 runes (introducing runes) — https://svelte.dev/blog/runes
- Svelte 5 migration guide — https://svelte.dev/docs/svelte/v5-migration-guide
- Zustand (pmndrs GitHub) — https://github.com/pmndrs/zustand
- Vite team / Rolldown 10-30x (The Register, Mar 2026) — https://www.theregister.com/software/2026/03/16/vite-team-claims-10-30x-faster-builds-with-rolldown/
- Bun vs Vite (2026) — https://www.pkgpulse.com/guides/bun-vs-vite-2026
- Next.js Font Optimization (docs) — https://nextjs.org/docs/app/getting-started/fonts
- Fontsource self-host guide — https://dev.to/danwalsh/self-host-google-fonts-in-your-next-react-project-with-fontsource-1n07
- OpenNext for Cloudflare — https://opennext.js.org/cloudflare
- Next.js on Cloudflare Workers (docs) — https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/
- Cloudflare Workers vs Vercel 2026 — https://www.kunalganglani.com/blog/cloudflare-workers-vs-vercel-2026
- v0 Design systems (docs) — https://v0.app/docs/design-systems
- AI-powered prototyping with design systems (Vercel) — https://vercel.com/blog/ai-powered-prototyping-with-design-systems
- shadcn/ui Registry Starter (Vercel template) — https://vercel.com/templates/next.js/shadcn-ui-registry-starter
