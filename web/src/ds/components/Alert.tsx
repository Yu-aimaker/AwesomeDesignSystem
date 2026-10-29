import { type ReactNode } from "react";
import { CheckCircle2, CircleAlert, Info, TriangleAlert, X } from "lucide-react";
import { cx } from "../cx";
import { useT } from "../../i18n/context";
import { dsMessages } from "../../i18n/messages/dsComponents";

export type AlertTone = "neutral" | "info" | "success" | "warning" | "danger";

export interface AlertProps {
  tone?: AlertTone;
  title: string;
  children?: ReactNode;
  /** One action, ghost or secondary, shown under the text. */
  action?: ReactNode;
  onDismiss?: () => void;
  className?: string;
}

// An inline banner. Each tone carries an icon and a title, so color is never the
// only message. danger is role="alert" (interrupts), the rest role="status".
const tones: Record<AlertTone, { box: string; icon: string; Icon: typeof Info }> = {
  neutral: { box: "border-hairline bg-surface", icon: "text-ink-secondary", Icon: Info },
  info: { box: "border-accent/40 bg-accent-soft", icon: "text-accent", Icon: Info },
  success: { box: "border-success/40 bg-success-soft", icon: "text-success", Icon: CheckCircle2 },
  warning: { box: "border-warning/40 bg-warning-soft", icon: "text-warning", Icon: TriangleAlert },
  danger: { box: "border-danger/40 bg-danger-soft", icon: "text-danger", Icon: CircleAlert },
};

export function Alert({ tone = "neutral", title, children, action, onDismiss, className }: AlertProps) {
  const m = useT(dsMessages);
  const t = tones[tone];
  return (
    <div role={tone === "danger" ? "alert" : "status"} className={cx("flex items-start gap-3 rounded-lg border p-4 text-ink", t.box, className)}>
      <t.Icon aria-hidden strokeWidth={1.75} className={cx("mt-0.5 size-5 shrink-0", t.icon)} />
      <div className="min-w-0 flex-1">
        <p className="t-label text-ink">{title}</p>
        {children && <div className="t-body-sm mt-1 text-ink-secondary">{children}</div>}
        {action && <div className="mt-3">{action}</div>}
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label={m.close}
          className="-m-1 rounded-sm p-1 text-ink-muted transition-colors duration-instant hover:bg-surface-sunken hover:text-ink"
        >
          <X className="size-4" strokeWidth={1.75} />
        </button>
      )}
    </div>
  );
}
