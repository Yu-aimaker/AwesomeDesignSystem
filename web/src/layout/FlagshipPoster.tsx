import { useState } from "react";
import { cx } from "../ds/cx";
import type { DesignSystemRef } from "../lib/design-systems";

/**
 * Artwork for flagship DS cards. Prefers the committed og:image copy.
 * The AwesomeDS poster is the fallback when no official share image is usable.
 */
export function FlagshipArt({
  system,
  variant = "ogp",
  className,
}: {
  system: DesignSystemRef;
  variant?: "ogp" | "thumb";
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const src = system.ogp.status === "ok" ? system.ogp.image : undefined;
  if (src && !failed) {
    return (
      <div className={cx("relative isolate size-full overflow-hidden bg-canvas-soft", className)} aria-hidden>
        <img
          src={src}
          alt=""
          decoding="async"
          className="size-full max-w-full object-cover"
          onError={() => setFailed(true)}
        />
      </div>
    );
  }
  return <FlagshipPoster system={system} variant={variant} className={className} />;
}

/**
 * Fallback card in AwesomeDS colors only: canvas, ink and the accent, set in the
 * site fonts. Same layout for every source, so it reads as a deliberate
 * placeholder and not as a fake brand mark. Sizes use container units so the
 * poster keeps the proportions of a 1200x630 share image at any card width.
 */
export function FlagshipPoster({
  system,
  variant = "ogp",
  className,
}: {
  system: DesignSystemRef;
  variant?: "ogp" | "thumb";
  className?: string;
}) {
  if (variant === "thumb") {
    return (
      <div
        className={cx("@container relative isolate grid size-full place-items-center overflow-hidden bg-canvas-soft text-ink", className)}
        aria-hidden
      >
        <span className="font-display text-[48cqw] leading-none font-semibold">{system.name.charAt(0)}</span>
        <span className="absolute inset-x-0 bottom-0 h-[8cqw] bg-accent" />
      </div>
    );
  }
  return (
    <div
      className={cx("@container relative isolate size-full overflow-hidden bg-canvas-soft text-ink", className)}
      aria-hidden
    >
      <span className="absolute -right-[4cqw] -bottom-[14cqw] font-display text-[56cqw] leading-none font-semibold text-accent-soft select-none">
        {system.name.charAt(0)}
      </span>
      <div className="absolute inset-0 flex flex-col justify-between p-[6cqw]">
        <span className="min-w-0 truncate font-mono text-[3.2cqw] leading-none text-ink-secondary">{system.domain}</span>
        <div className="flex min-w-0 max-w-[78%] flex-col gap-[3cqw]">
          <span className="block h-[1.2cqw] w-[12cqw] rounded-full bg-accent" />
          <span
            lang="en"
            className="font-display text-[8.5cqw] leading-[1.05] font-semibold tracking-[-0.03em] text-ink"
            style={{ overflowWrap: "anywhere" }}
          >
            {system.name}
          </span>
        </div>
      </div>
    </div>
  );
}
