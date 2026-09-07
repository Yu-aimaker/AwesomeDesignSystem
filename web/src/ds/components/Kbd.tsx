import type { HTMLAttributes } from "react";
import { cx } from "../cx";

export interface KbdProps extends HTMLAttributes<HTMLElement> {
  /** Render a key combination, e.g. ["⌘", "K"]. Each key gets its own cap. */
  keys?: string[];
}

// A key cap: mono 12px on surface-sunken with a hairline, 4px radius, 20px tall.
// Combinations render each key as its own cap separated by a thin gap.
export function Kbd({ keys, className, children, ...rest }: KbdProps) {
  const cap = "inline-flex h-5 min-w-5 items-center justify-center rounded-xs border border-hairline bg-surface-sunken px-1.5 font-mono text-xs leading-none text-ink-secondary";
  if (keys && keys.length > 0) {
    return (
      <span className={cx("inline-flex items-center gap-1 align-middle", className)} {...rest}>
        {keys.map((k, i) => (
          <kbd key={`${k}-${i}`} className={cap}>
            {k}
          </kbd>
        ))}
      </span>
    );
  }
  return (
    <kbd className={cx(cap, "align-middle", className)} {...rest}>
      {children}
    </kbd>
  );
}
