import { useId, useState, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";
import { cx } from "../ds/cx";
import { useT } from "../i18n/context";
import { shellMessages } from "../i18n/messages/shell";

export interface PreviewProps {
  id?: string;
  title: string;
  rule?: ReactNode;
  code?: string;
  codeLabel?: string;
  children: ReactNode;
  /** Height class for the preview pane. */
  className?: string;
  /** Extra panes after the code tab, e.g. usage notes. */
  notes?: ReactNode;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const t = useT(shellMessages);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1500);
        } catch {
          // clipboard unavailable
        }
      }}
      className="t-caption inline-flex h-7 items-center gap-1 rounded-sm px-2 text-ink-secondary transition-colors duration-instant hover:bg-surface-sunken hover:text-ink"
    >
      {copied ? <Check className="size-3.5" strokeWidth={1.75} aria-hidden /> : <Copy className="size-3.5" strokeWidth={1.75} aria-hidden />}
      {copied ? t.copied : t.copy}
    </button>
  );
}

// Preview pane with a "Preview / Code" tab. The code tab shows the real
// component source, imported with Vite's ?raw so it can never drift.
export function Preview({ id, title, rule, code, codeLabel, children, className, notes }: PreviewProps) {
  const [tab, setTab] = useState<"preview" | "code" | "notes">("preview");
  const m = useT(shellMessages);
  const base = useId();
  const tabs: Array<{ key: "preview" | "code" | "notes"; label: string }> = [{ key: "preview", label: m.preview }];
  if (code) tabs.push({ key: "code", label: codeLabel ?? m.code });
  if (notes) tabs.push({ key: "notes", label: m.notes });

  return (
    <article id={id} className="scroll-mt-20 rounded-lg border border-hairline bg-surface">
      <header className="flex flex-col gap-3 border-b border-hairline p-4 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div className="min-w-0">
          <h3 className="t-h4 text-ink">{title}</h3>
          {rule && <p className="t-body-sm mt-1 text-ink-secondary">{rule}</p>}
        </div>
        {tabs.length > 1 && (
          <div role="tablist" aria-label={m.viewOf(title)} className="flex shrink-0 gap-1 rounded-md bg-surface-sunken p-0.5">
            {tabs.map((t) => (
              <button
                key={t.key}
                role="tab"
                id={`${base}-${t.key}`}
                aria-selected={tab === t.key}
                onClick={() => setTab(t.key)}
                className={cx(
                  "t-label h-7 rounded-sm px-3 transition-colors duration-instant ease-out-ds",
                  tab === t.key ? "bg-surface text-ink shadow-2" : "text-ink-secondary hover:text-ink",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}
      </header>
      {tab === "preview" && (
        <div role="tabpanel" aria-labelledby={`${base}-preview`} className={cx("overflow-x-auto p-6 sm:p-8", className)}>
          {children}
        </div>
      )}
      {tab === "code" && code && (
        <div role="tabpanel" aria-labelledby={`${base}-code`}>
          <div className="flex justify-end border-b border-hairline bg-canvas-soft px-2 py-1">
            <CopyButton text={code} />
          </div>
          <div className="code-pane">
            <pre>
              <code>{code}</code>
            </pre>
          </div>
        </div>
      )}
      {tab === "notes" && notes && (
        <div role="tabpanel" aria-labelledby={`${base}-notes`} className="prose p-6 sm:p-8">
          {notes}
        </div>
      )}
    </article>
  );
}

export function CodeBlock({ code, className }: { code: string; className?: string }) {
  return (
    <div className={cx("overflow-hidden rounded-md border border-hairline bg-canvas-soft", className)}>
      <div className="flex justify-end border-b border-hairline px-2 py-1">
        <CopyButton text={code} />
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed text-ink">
        <code>{code}</code>
      </pre>
    </div>
  );
}
