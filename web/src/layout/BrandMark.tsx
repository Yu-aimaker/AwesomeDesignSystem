import type { SVGProps } from "react";

// The mark from docs/assets/brand/icon.svg, drawn with tokens so it follows the site's
// [data-theme] toggle. An <img src="/favicon.svg"> would follow the OS scheme instead.
export function BrandMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" focusable="false" {...props}>
      <rect width="32" height="32" rx="8" style={{ fill: "var(--ds-ink)" }} />
      <rect x="12" y="18" width="8" height="3" style={{ fill: "var(--ds-accent)" }} />
      <path d="M9 24 14 8h4l5 16h-3.6L16 12.6 12.6 24Z" style={{ fill: "var(--ds-canvas)" }} />
    </svg>
  );
}
