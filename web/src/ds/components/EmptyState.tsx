import type { ReactNode } from "react";
import { Inbox } from "lucide-react";

export interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

// Centered is allowed here (DESIGN.md §4): short heading, one line, one action.
export function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-dashed border-hairline-strong px-6 py-12 text-center">
      <span className="flex size-10 items-center justify-center rounded-full bg-surface-sunken text-ink-muted">
        {icon ?? <Inbox className="size-5" strokeWidth={1.75} aria-hidden />}
      </span>
      <h3 className="t-h4 mt-4 text-ink">{title}</h3>
      {description && <p className="t-body-sm mt-1 max-w-xs text-ink-secondary">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
