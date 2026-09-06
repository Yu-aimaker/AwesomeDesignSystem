import type { HTMLAttributes } from "react";
import { cx } from "../cx";

export type BadgeTone = "neutral" | "accent" | "success" | "warning" | "danger";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

// Pill shape, caption size, soft background with the status color as text.
// Status badges pair with a label; the color is never the only signal.
const tones: Record<BadgeTone, string> = {
  neutral: "bg-surface-sunken text-ink-secondary",
  accent: "bg-accent-soft text-accent",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
};

export function Badge({ tone = "neutral", className, ...rest }: BadgeProps) {
  return (
    <span
      className={cx("inline-flex h-5 shrink-0 items-center gap-1 rounded-full px-2 text-xs font-medium leading-none whitespace-nowrap", tones[tone], className)}
      {...rest}
    />
  );
}
