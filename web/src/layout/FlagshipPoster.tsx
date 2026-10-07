import type { ReactNode } from "react";
import { cx } from "../ds/cx";
import type { DesignSystemRef } from "../lib/design-systems";
import { useResolvedTheme } from "../lib/theme";

/**
 * Brand mark for flagship DS cards. Text lives in the HTML card, not in the
 * artwork: SVG <text> cannot load site fonts, and #000/#fff invert under
 * `color-scheme: dark` (the Vercel black-on-black failure).
 */
export function FlagshipPoster({
  system,
  variant = "ogp",
  className,
}: {
  system: DesignSystemRef;
  variant?: "ogp" | "thumb";
  className?: string;
}) {
  const theme = useResolvedTheme();
  const invert = Boolean(system.poster.invertInDark) && theme === "dark";
  const bg = invert ? "#fafafa" : system.poster.bg;
  const fg = invert ? "#0a0a0a" : system.poster.fg;
  const accent = system.poster.accent;

  return (
    <div
      className={cx("relative isolate size-full overflow-hidden", className)}
      style={{ backgroundColor: bg, color: fg, colorScheme: invert ? "dark" : "light" }}
      aria-hidden
    >
      <svg
        viewBox="0 0 1200 630"
        className="absolute inset-0 size-full max-w-full"
        preserveAspectRatio={variant === "thumb" ? "xMidYMid slice" : "xMidYMid meet"}
        overflow="hidden"
      >
        <rect width="1200" height="630" fill={bg} />
        {mark(system.id, { bg, fg, accent })}
      </svg>
    </div>
  );
}

function mark(id: string, c: { bg: string; fg: string; accent: string }): ReactNode {
  switch (id) {
    case "apple-hig":
      return (
        <g fill="none" stroke={c.fg} strokeWidth="10">
          <rect x="470" y="145" width="260" height="340" rx="48" />
          <rect x="560" y="165" width="80" height="10" rx="5" fill={c.fg} stroke="none" />
          <path d="M600 250c-10 0-28 12-33 28s-8 36 3 54c9 15 23 25 30 25s21-10 30-25c11-18 8-38 3-54s-23-28-33-28z" fill={c.fg} stroke="none" />
        </g>
      );
    case "material-design":
      return (
        <g>
          <rect x="340" y="165" width="210" height="210" rx="32" fill="#1a73e8" />
          <rect x="500" y="215" width="210" height="210" rx="32" fill="#188038" />
          <rect x="420" y="255" width="210" height="210" rx="32" fill="#e37400" />
        </g>
      );
    case "vercel-design":
      return <polygon points="600,175 745,430 455,430" fill={c.fg} />;
    case "shadcn-ui":
      return (
        <g transform="translate(600,315)">
          <rect x="-70" y="-86" width="140" height="52" rx="10" fill="none" stroke={c.fg} strokeWidth="6" />
          <rect x="-70" y="-18" width="140" height="52" rx="10" fill={c.fg} />
          <rect x="-110" y="50" width="220" height="52" rx="10" fill="none" stroke={c.accent} strokeWidth="6" strokeDasharray="10 8" />
        </g>
      );
    case "goodpatch":
      return (
        <g>
          <circle cx="600" cy="315" r="120" fill={c.accent} />
          <rect x="545" y="260" width="110" height="110" rx="8" fill={c.bg} />
        </g>
      );
    case "duolingo":
      return (
        <g>
          <circle cx="600" cy="315" r="128" fill={c.accent} />
          <ellipse cx="600" cy="328" rx="78" ry="86" fill={c.bg} />
          <circle cx="572" cy="312" r="18" fill="#1a7f37" />
          <circle cx="628" cy="312" r="18" fill="#1a7f37" />
          <circle cx="575" cy="314" r="8" fill={c.fg} />
          <circle cx="631" cy="314" r="8" fill={c.fg} />
          <ellipse cx="600" cy="358" rx="18" ry="10" fill="#c47b00" />
        </g>
      );
    case "digital-agency-jp":
      return (
        <g>
          <rect x="534" y="140" width="16" height="350" fill={c.accent} />
          <rect x="568" y="140" width="16" height="350" fill={c.accent} opacity="0.55" />
          <rect x="602" y="140" width="16" height="350" fill={c.accent} opacity="0.28" />
          <rect x="650" y="288" width="220" height="6" fill={c.accent} opacity="0.45" />
          <rect x="650" y="318" width="140" height="6" fill={c.accent} opacity="0.28" />
        </g>
      );
    default:
      return <circle cx="600" cy="315" r="72" fill={c.fg} />;
  }
}
