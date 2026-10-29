import { cx } from "../cx";
import { useT } from "../../i18n/context";
import { dsMessages } from "../../i18n/messages/dsComponents";

export interface SkeletonProps {
  className?: string;
}

// A progress indicator is the one thing allowed to loop. The pulse stays on
// opacity only so it reads under prefers-reduced-motion as a static block.
export function Skeleton({ className }: SkeletonProps) {
  return <div aria-hidden className={cx("animate-pulse rounded-md bg-surface-sunken", className)} />;
}

export function SkeletonCard() {
  const m = useT(dsMessages);
  return (
    <div className="rounded-lg border border-hairline bg-surface p-6" aria-busy="true" aria-label={m.loading}>
      <Skeleton className="h-5 w-2/5" />
      <Skeleton className="mt-3 h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-4/5" />
      <div className="mt-6 flex gap-2">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  );
}
