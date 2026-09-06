import type { ReactNode } from "react";
import { ExternalLink } from "lucide-react";
import { cx } from "../ds/cx";

export function PageHeader({ title, lead, children }: { title: string; lead?: ReactNode; children?: ReactNode }) {
  return (
    <header className="mb-12 max-w-[65ch]">
      <h1 className="t-h1 text-ink">{title}</h1>
      {lead && <p className="t-body-lg mt-4 text-ink-secondary">{lead}</p>}
      {children}
    </header>
  );
}

export function Section({ id, title, lead, children, className }: { id: string; title: string; lead?: ReactNode; children?: ReactNode; className?: string }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cx("mb-16 scroll-mt-20 lg:mb-24", className)}>
      <h2 id={`${id}-title`} className="t-h2 text-ink">
        <a href={`#${id}`} className="text-inherit no-underline hover:underline">
          {title}
        </a>
      </h2>
      {lead && <p className="t-body mt-3 max-w-[65ch] text-ink-secondary">{lead}</p>}
      <div className="mt-8">{children}</div>
    </section>
  );
}

export function Prose({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx("prose t-body text-ink", className)}>{children}</div>;
}

export interface SourceLink {
  title: string;
  url: string;
  note?: string;
}

export function SourceList({ sources, title = "ソース" }: { sources: SourceLink[]; title?: string }) {
  return (
    <section aria-label={title} className="mt-8 rounded-lg border border-hairline bg-canvas-soft p-6">
      <h3 className="t-h4 text-ink">{title}</h3>
      <ul className="mt-3 flex flex-col gap-2">
        {sources.map((s) => (
          <li key={s.url} className="t-body-sm flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-2">
            <a href={s.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1">
              {s.title}
              <ExternalLink className="size-3.5 shrink-0" strokeWidth={1.75} aria-hidden />
            </a>
            {s.note && <span className="text-ink-muted">{s.note}</span>}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Why({ children }: { children: ReactNode }) {
  return (
    <section aria-label="理由" className="mt-8 max-w-[65ch]">
      <h3 className="t-h3 text-ink">なぜこうするのか</h3>
      <div className="prose mt-4 text-ink">{children}</div>
    </section>
  );
}

export function Spec({ items }: { items: Array<[string, string]> }) {
  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
      {items.map(([k, v]) => (
        <div key={k} className="contents">
          <dt className="t-mono text-ink-muted">{k}</dt>
          <dd className="t-mono text-ink">{v}</dd>
        </div>
      ))}
    </dl>
  );
}
