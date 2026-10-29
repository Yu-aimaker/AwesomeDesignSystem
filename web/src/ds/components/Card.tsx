import { forwardRef, type AnchorHTMLAttributes, type HTMLAttributes, type ReactNode } from "react";
import { cx } from "../cx";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Level 1 (border only) is the default. Level 2 adds the popover shadow. */
  elevation?: 1 | 2;
  padding?: "none" | "md";
}

// Cards are level 1: a 1px hairline, 12px radius, 24px padding. No shadow.
export function Card({ elevation = 1, padding = "md", className, ...rest }: CardProps) {
  return (
    <div
      className={cx(
        "rounded-lg border border-hairline bg-surface text-ink",
        elevation === 2 && "shadow-2",
        padding === "md" && "p-6",
        className,
      )}
      {...rest}
    />
  );
}

export function CardTitle({ className, ...rest }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cx("t-h3 text-ink", className)} {...rest} />;
}

export function CardDescription({ className, ...rest }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cx("t-body-sm mt-1 text-ink-secondary", className)} {...rest} />;
}

export interface CardMediaProps {
  src?: string;
  alt?: string;
  /** CSS aspect ratio, e.g. "16 / 9". Space is reserved so nothing shifts while loading. */
  ratio?: string;
  /** Rendered instead of an image (a gradient-free placeholder, an SVG, a video). */
  children?: ReactNode;
  className?: string;
}

// Media sits flush at the top of a card. The inner radius is the card radius minus
// the inset (12 - 0 = 12 at the top, square at the bottom where the body starts).
export function CardMedia({ src, alt = "", ratio = "16 / 9", children, className }: CardMediaProps) {
  return (
    <div className={cx("relative w-full overflow-hidden rounded-t-[inherit] bg-surface-sunken", className)} style={{ aspectRatio: ratio }}>
      {src ? <img src={src} alt={alt} loading="lazy" className="absolute inset-0 size-full object-cover" /> : children}
    </div>
  );
}

export function CardBody({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("p-6", className)} {...rest} />;
}

export function CardFooter({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("flex flex-wrap items-center justify-end gap-2 border-t border-hairline px-6 py-4", className)} {...rest} />;
}

export interface MediaCardProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "title" | "media"> {
  title: string;
  description?: string;
  /** Small text above the title: a category or a date in caption size. */
  eyebrow?: string;
  media?: ReactNode;
  footer?: ReactNode;
  /** When set the whole card is one link: hover raises to shadow-2 and the border strengthens. */
  href?: string;
}

// A summary that links to detail. The whole card is the target, so nothing inside
// it is interactive. Hover raises one level in 150ms; the focus ring sits on the card.
export const MediaCard = forwardRef<HTMLAnchorElement, MediaCardProps>(function MediaCard(
  { title, description, eyebrow, media, footer, href, className, ...rest },
  ref,
) {
  const body = (
    <>
      {media}
      <div className="flex min-w-0 flex-1 flex-col p-5">
        {eyebrow && <p className="t-caption text-ink-muted">{eyebrow}</p>}
        <h3 className={cx("t-h4 min-w-0 text-ink", eyebrow && "mt-1")} style={{ overflowWrap: "anywhere" }}>
          {title}
        </h3>
        {description && (
          <p className="t-body-sm mt-1 min-w-0 text-ink-secondary" style={{ overflowWrap: "anywhere" }}>
            {description}
          </p>
        )}
      </div>
      {footer && <div className="flex min-w-0 items-center justify-between gap-3 px-5 pb-5 text-ink-secondary">{footer}</div>}
    </>
  );
  const frame = "flex min-w-0 max-w-full flex-col overflow-hidden rounded-lg border border-hairline bg-surface text-ink";
  if (href) {
    return (
      <a
        ref={ref}
        href={href}
        className={cx(
          frame,
          "no-underline transition-[box-shadow,border-color,transform] duration-fast ease-out-ds",
          "hover:border-hairline-strong hover:shadow-2 active:translate-y-px",
          "focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none",
          className,
        )}
        {...rest}
      >
        {body}
      </a>
    );
  }
  return <article className={cx(frame, className)}>{body}</article>;
});
