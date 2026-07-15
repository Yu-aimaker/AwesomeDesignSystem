import { cx } from "@awesome-ds/core/runtime";
import type { HTMLAttributes, ReactNode } from "react";
import { getComponentMetadata } from "@awesome-ds/core/metadata";

export const badgeMetadata = getComponentMetadata("badge");
export type BadgeTone = "neutral" | "accent";
export type BadgeProps = HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone; children: ReactNode };

export function Badge({ tone = "neutral", className, children, ...rest }: BadgeProps) {
  return <span className={cx("ads-badge", tone === "accent" && "ads-badge--accent", className)} {...rest}>{children}</span>;
}
Badge.metadata = badgeMetadata;
