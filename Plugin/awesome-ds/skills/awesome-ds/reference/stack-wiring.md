# Wiring AwesomeDS tokens per stack

Copy the two token files from `${CLAUDE_PLUGIN_ROOT}/ds/tokens/` into the project. Add this header to each copy:

```css
/* Synced from AwesomeDS v0.1.0 (Plugin/awesome-ds/ds/tokens). Edit via the DS, not here. */
```

## Tailwind v4

`src/styles/globals.css` (or the file that already has `@import "tailwindcss"`):

```css
@import "tailwindcss";
@import "./tokens.css";
@import "./tailwind.css"; /* AwesomeDS @theme inline block */
```

Use: `bg-canvas text-ink border border-hairline rounded-lg p-6`, `text-ink-secondary text-sm`, `duration-200 ease-out-ds`, `shadow-3` for dialogs. Arbitrary values (`bg-[#fff]`, `p-[13px]`) are forbidden; if a value is missing, add a token.

## Tailwind v3

Import `tokens.css` in the global CSS, then map colors in `tailwind.config.ts`:

```ts
import type { Config } from "tailwindcss";
const v = (n: string) => `var(--ds-${n})`;
export default {
  content: ["./src/**/*.{ts,tsx,html}"],
  theme: {
    extend: {
      colors: {
        canvas: v("canvas"), "canvas-soft": v("canvas-soft"),
        surface: v("surface"), "surface-sunken": v("surface-sunken"),
        ink: v("ink"), "ink-secondary": v("ink-secondary"), "ink-muted": v("ink-muted"),
        hairline: v("hairline"), "hairline-strong": v("hairline-strong"),
        accent: v("accent"), "accent-soft": v("accent-soft"),
        primary: v("primary"), "on-primary": v("on-primary"),
        success: v("success"), warning: v("warning"), danger: v("danger"),
      },
      fontFamily: { sans: ["var(--ds-font-sans)"], mono: ["var(--ds-font-mono)"] },
      borderRadius: { md: "8px", lg: "12px", xl: "16px" },
      boxShadow: { 2: "var(--ds-shadow-2)", 3: "var(--ds-shadow-3)" },
      transitionTimingFunction: { "out-ds": "cubic-bezier(0.16, 1, 0.3, 1)" },
    },
  },
} satisfies Config;
```

## Next.js (App Router)

`app/layout.tsx`:

```tsx
import "./tokens.css";
import "./globals.css";
import { GeistSans, GeistMono } from "geist/font";           // npm i geist
import { Noto_Sans_JP } from "next/font/google";

const notoJP = Noto_Sans_JP({ subsets: ["latin"], weight: "variable", display: "swap", variable: "--font-noto-jp", preload: false });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${GeistSans.variable} ${GeistMono.variable} ${notoJP.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

Then in `tokens.css` copy, set:

```css
:root { --ds-font-sans: var(--font-geist-sans), var(--font-noto-jp), system-ui, sans-serif; --ds-font-mono: var(--font-geist-mono), ui-monospace, monospace; }
```

Set `lang` to the primary language of the site. For a Japanese product it is `ja`, not `en`.

## Vite (React, Vue, Svelte)

`src/main.tsx`:

```ts
import "@fontsource-variable/geist";           // npm i @fontsource-variable/geist @fontsource-variable/noto-sans-jp @fontsource-variable/geist-mono
import "@fontsource-variable/noto-sans-jp";
import "@fontsource-variable/geist-mono";
import "./styles/tokens.css";
import "./styles/globals.css";
```

The fontsource family names are `"Geist Variable"`, `"Noto Sans JP Variable"`, `"Geist Mono Variable"`. Update `--ds-font-sans` in the copy accordingly.

## Plain HTML / CSS

```html
<html lang="ja">
<head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400..700&family=Geist+Mono:wght@400..600&family=Noto+Sans+JP:wght@400..700&display=swap">
  <link rel="stylesheet" href="./tokens.css">
  <link rel="stylesheet" href="./styles.css">
</head>
```

Component CSS uses only `var(--ds-*)`:

```css
.button { height: var(--ds-control-md); padding: 0 var(--ds-space-4); border-radius: var(--ds-radius-md);
  background: var(--ds-primary); color: var(--ds-on-primary); font: var(--ds-weight-medium) var(--ds-text-sm)/1.2 var(--ds-font-sans);
  transition: background var(--ds-duration-instant) var(--ds-ease-out); }
.button:hover { background: var(--ds-primary-hover); }
.button:disabled { background: var(--ds-ink-disabled); cursor: not-allowed; }
```

## shadcn/ui variable bridge

shadcn components read their own CSS variables. Bridge them once in `globals.css` so every installed component uses AwesomeDS roles:

```css
:root, [data-theme="dark"] {
  --background: var(--ds-canvas);
  --foreground: var(--ds-ink);
  --card: var(--ds-surface);
  --card-foreground: var(--ds-ink);
  --popover: var(--ds-surface);
  --popover-foreground: var(--ds-ink);
  --primary: var(--ds-primary);
  --primary-foreground: var(--ds-on-primary);
  --secondary: var(--ds-surface-sunken);
  --secondary-foreground: var(--ds-ink);
  --muted: var(--ds-surface-sunken);
  --muted-foreground: var(--ds-ink-secondary);
  --accent: var(--ds-accent-soft);
  --accent-foreground: var(--ds-ink);
  --destructive: var(--ds-danger);
  --destructive-foreground: #ffffff;
  --border: var(--ds-hairline);
  --input: var(--ds-hairline-strong);
  --ring: var(--ds-focus-ring);
  --radius: var(--ds-radius-md);
}
```

shadcn `accent` is a hover/selected surface, not the brand accent. Keep that mapping (accent-soft), do not map it to `--ds-accent`.

Then fix component defaults that conflict with AwesomeDS:

- `Button`: `h-10` (40px), `rounded-md`, `font-medium text-sm`. Remove `shadow-sm` from variants.
- `Card`: `rounded-lg border border-hairline shadow-none p-6`.
- `Input`: `h-10 rounded-md border-hairline-strong`, `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`.
- `Dialog`: `rounded-xl shadow-3`.
- `Badge`: `rounded-full bg-surface-sunken text-ink-secondary text-xs font-normal`.

## Theme toggle

```ts
document.documentElement.dataset.theme = "dark"; // or "light"; delete it to follow the OS
```

Persist the choice in `localStorage` and apply it in a blocking inline script before paint to avoid a flash.
