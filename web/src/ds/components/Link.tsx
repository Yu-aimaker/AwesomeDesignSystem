import { forwardRef, type AnchorHTMLAttributes } from "react";
import { ArrowUpRight } from "lucide-react";
import { cx } from "../cx";

export type LinkVariant = "inline" | "standalone" | "muted";

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: LinkVariant;
  /** Opens in a new tab with rel="noreferrer" and an arrow glyph. */
  external?: boolean;
}

// The accent's one job is links, focus and selection. Inline links keep the
// underline (color alone is not a signal); standalone links drop it and use
// weight instead; muted links sit in ink-secondary for footers and metadata.
const variants: Record<LinkVariant, string> = {
  inline: "text-accent underline decoration-accent/40 underline-offset-[0.15em] hover:text-accent-hover hover:decoration-current",
  standalone: "t-label text-accent no-underline hover:text-accent-hover hover:underline",
  muted: "text-ink-secondary no-underline hover:text-ink hover:underline",
};

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { variant = "inline", external = false, className, children, ...rest },
  ref,
) {
  return (
    <a
      ref={ref}
      target={external ? "_blank" : rest.target}
      rel={external ? "noreferrer" : rest.rel}
      className={cx(
        "inline-flex items-center gap-0.5 rounded-xs transition-colors duration-instant ease-out-ds",
        "aria-disabled:pointer-events-none aria-disabled:text-ink-disabled",
        variants[variant],
        className,
      )}
      {...rest}
    >
      {children}
      {external && <ArrowUpRight aria-hidden strokeWidth={1.75} className="size-4 shrink-0" />}
    </a>
  );
});
