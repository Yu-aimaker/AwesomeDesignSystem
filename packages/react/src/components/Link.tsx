import { cx } from "@awesome-ds/core";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { defineMetadata } from "../utils/metadata";

export const linkMetadata = defineMetadata({ name: "Link", ruleIds: ["rule.a11y.wcag-aa"], states: ["idle", "hover", "focus", "visited"] });

export function Link({ className, children, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement> & { children: ReactNode }) {
  return <a className={cx("ads-link", className)} {...rest}>{children}</a>;
}
Link.metadata = linkMetadata;
