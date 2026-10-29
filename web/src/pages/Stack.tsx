import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { stackLayers, stackMeta } from "../lib/data";
import { DataNote, GalleryHeader } from "../layout/Gallery";
import { cx } from "../ds/cx";
import { useT } from "../i18n/context";
import { stackMessages } from "../i18n/messages/stack";

/**
 * The 2026 stack as a layer map: one pick per layer on the left, its
 * alternatives as chips on the right. A chip opens the one line that says
 * when the alternative wins. No prose beyond that.
 */
export function Stack() {
  const t = useT(stackMessages);
  const [open, setOpen] = useState<string | null>(null);
  const total = stackLayers.reduce((n, l) => n + 1 + l.alternatives.length, 0);

  return (
    <div>
      <GalleryHeader title={t.title} lead={t.lead} stat={stackLayers.length} statLabel={t.statLabel} />

      <ol className="overflow-hidden rounded-lg border border-hairline bg-surface">
        {stackLayers.map((l, i) => (
          <li key={l.id} id={l.id} className={cx("grid gap-x-6 gap-y-3 px-5 py-5 sm:grid-cols-[9rem_minmax(0,1fr)] lg:grid-cols-[10rem_minmax(0,18rem)_minmax(0,1fr)]", i > 0 && "border-t border-hairline")}>
            <div className="flex items-baseline gap-3 sm:block">
              <span className="t-mono tabular text-ink-muted">{String(i + 1).padStart(2, "0")}</span>
              <p className="t-label text-ink sm:mt-1" lang="ja">
                {l.layer}
              </p>
            </div>

            <div className="min-w-0">
              <a
                href={l.pick.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 max-w-full items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-on-primary no-underline transition-colors duration-instant hover:bg-primary-hover"
              >
                <span className="truncate">{l.pick.name}</span>
                <ExternalLink className="size-3.5 shrink-0 opacity-70" strokeWidth={1.75} aria-hidden />
              </a>
              <p className="t-body-sm mt-2 measure text-ink-secondary" lang="ja">
                {l.pick.why}
              </p>
            </div>

            <div className="min-w-0 sm:col-start-2 lg:col-start-3">
              <div className="flex flex-wrap gap-1.5">
                {l.alternatives.map((a) => {
                  const key = `${l.id}:${a.name}`;
                  const on = open === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      aria-expanded={on}
                      onClick={() => setOpen(on ? null : key)}
                      className={cx(
                        "inline-flex h-8 pointer-coarse:h-11 items-center rounded-full border px-3 text-sm transition-colors duration-instant",
                        on ? "border-ink bg-surface-sunken text-ink" : "border-hairline-strong text-ink-secondary hover:text-ink",
                      )}
                    >
                      {a.name}
                    </button>
                  );
                })}
              </div>
              {l.alternatives.map((a) => {
                const key = `${l.id}:${a.name}`;
                if (open !== key) return null;
                return (
                  <p key={key} className="t-body-sm mt-3 flex flex-wrap items-baseline gap-x-3 rounded-md bg-canvas-soft px-3 py-2 text-ink">
                    <span className="text-ink-muted">{t.when}</span>
                    <span lang="ja">{a.when}</span>
                    <a href={a.url} target="_blank" rel="noreferrer" className="t-caption ml-auto">
                      {t.official}
                    </a>
                  </p>
                );
              })}
            </div>
          </li>
        ))}
      </ol>

      <DataNote updated={stackMeta.updated}>
        {t.dataNote(stackLayers.length, total)}
      </DataNote>
    </div>
  );
}
