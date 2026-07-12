import { cx } from "@awesome-ds/core";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { getComponentMetadata } from "../contracts";

export const linkMetadata = getComponentMetadata("link");

export function Link({ className, children, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement> & { children: ReactNode }) {
  return <a className={cx("ads-link", className)} {...rest}>{children}</a>;
}
Link.metadata = linkMetadata;
