import type { ReactNode } from "react";
import { CircleAlert } from "lucide-react";

export interface ErrorStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

// Danger color with an icon and a heading; the message says what to do next.
export function ErrorState({ title, description, action }: ErrorStateProps) {
  return (
    <div role="alert" className="flex items-start gap-3 rounded-lg border border-danger/40 bg-danger-soft p-4 text-ink">
      <CircleAlert className="mt-0.5 size-5 shrink-0 text-danger" strokeWidth={1.75} aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="t-label text-ink">{title}</p>
        {description && <p className="t-body-sm mt-1 text-ink-secondary">{description}</p>}
        {action && <div className="mt-3">{action}</div>}
      </div>
    </div>
  );
}
