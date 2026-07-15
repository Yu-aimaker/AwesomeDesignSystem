import { cx } from "@awesome-ds/core/runtime";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { getComponentMetadata } from "@awesome-ds/core/metadata";

export const linkMetadata = getComponentMetadata("link");

export type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string; children: ReactNode };

export function Link({ className, children, ...rest }: LinkProps) {
  return <a className={cx("ads-link", className)} {...rest}>{children}</a>;
}
Link.metadata = linkMetadata;
