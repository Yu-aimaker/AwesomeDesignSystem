import { cx } from "@awesome-ds/core";
import type { HTMLAttributes, ReactNode } from "react";
import { getComponentMetadata } from "../contracts";

export const badgeMetadata = getComponentMetadata("badge");

export function Badge({ tone = "neutral", className, children, ...rest }: HTMLAttributes<HTMLSpanElement> & { tone?: "neutral" | "accent"; children: ReactNode }) {
  return <span className={cx("ads-badge", tone === "accent" && "ads-badge--accent", className)} {...rest}>{children}</span>;
}
Badge.metadata = badgeMetadata;
