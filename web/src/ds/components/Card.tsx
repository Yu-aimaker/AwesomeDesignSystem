import type { HTMLAttributes } from "react";
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
