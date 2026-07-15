import { cx } from "@awesome-ds/core/runtime";
import type { HTMLAttributes, ReactNode } from "react";
import { getComponentMetadata } from "@awesome-ds/core/metadata";

export const layoutMetadata = getComponentMetadata("stack");
export type BoxProps = HTMLAttributes<HTMLDivElement> & { children?: ReactNode };
export type StackProps = BoxProps & { gap?: 1 | 2 | 3 | 4 | 6 | 8 };
export function Stack({ className, gap = 4, children, ...rest }: StackProps) {
  return <div className={cx("ads-stack", className)} data-gap={gap} {...rest}>{children}</div>;
}
export function Cluster({ className, children, ...rest }: BoxProps) {
  return <div className={cx("ads-cluster", className)} {...rest}>{children}</div>;
}
export function Grid({ className, children, ...rest }: BoxProps) {
  return <div className={cx("ads-grid", className)} {...rest}>{children}</div>;
}
export function Container({ className, children, ...rest }: BoxProps) {
  return <div className={cx("ads-container", className)} {...rest}>{children}</div>;
}
export function VisuallyHidden({ children }: { children: ReactNode }) {
  return <span className="ads-visually-hidden">{children}</span>;
}
Stack.metadata = layoutMetadata;
Cluster.metadata = getComponentMetadata("cluster");
Grid.metadata = getComponentMetadata("grid");
Container.metadata = getComponentMetadata("container");
VisuallyHidden.metadata = getComponentMetadata("visually-hidden");
