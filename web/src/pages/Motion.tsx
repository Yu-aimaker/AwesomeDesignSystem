import { useMemo, useState } from "react";
import { getDemoGroups, getDemos, libraries, type DemoEntry } from "../demos/registry";
import { Playground } from "../layout/Playground";
import { ErrorBoundary } from "../layout/ErrorBoundary";
import { DataNote, FilterBar, FilterChip, GalleryHeader, SearchBox, SectionTitle, Tag } from "../layout/Gallery";
import { EmptyState } from "../ds/components/EmptyState";
import { cx } from "../ds/cx";
import { useLocale, useT } from "../i18n/context";
import { motionGalleryMessages } from "../i18n/messages/motionGallery";

type Group = DemoEntry["group"] | "all";
type Lib = DemoEntry["library"] | "all";

const libTone: Record<DemoEntry["library"], string> = {
  css: "bg-surface-sunken text-ink-secondary",
  motion: "bg-accent-soft text-accent",
  gsap: "bg-success-soft text-success",
  three: "bg-warning-soft text-warning",
  lottie: "bg-surface-sunken text-ink",
};

export function MotionGallery() {
  const t = useT(motionGalleryMessages);
  const { locale } = useLocale();
  const demos = useMemo(() => getDemos(locale), [locale]);
  const demoGroups = useMemo(() => getDemoGroups(locale), [locale]);
  const [group, setGroup] = useState<Group>("all");
  const [lib, setLib] = useState<Lib>("all");
  const [q, setQ] = useState("");
  const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const sections = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return demoGroups
      .filter((g) => group === "all" || g.id === group)
      .map((g) => ({
        group: g,
        items: demos.filter((d) => d.group === g.id && (lib === "all" || d.library === lib) && (!needle || `${d.name} ${d.caption} ${d.library}`.toLowerCase().includes(needle))),
      }))
      .filter((s) => s.items.length > 0);
  }, [group, lib, q, demos, demoGroups]);
  const shown = sections.reduce((n, s) => n + s.items.length, 0);

  return (
    <div>
      <GalleryHeader title={t.title} lead={t.lead} stat={demos.length} statLabel={t.statLabel}>
        {reduced && <p className="t-caption mt-3 text-ink-secondary">{t.reducedNote}</p>}
      </GalleryHeader>

      <FilterBar>
        <FilterChip selected={group === "all"} onSelect={() => setGroup("all")} count={demos.length}>
          {t.all}
        </FilterChip>
        {demoGroups.map((g) => (
          <FilterChip key={g.id} selected={group === g.id} onSelect={() => setGroup(g.id)} count={demos.filter((d) => d.group === g.id).length}>
            {g.label}
          </FilterChip>
        ))}
        <span aria-hidden className="mx-1 hidden h-5 w-px bg-hairline sm:block" />
        <div role="radiogroup" aria-label={t.library} className="flex flex-wrap gap-1">
          {(["all", ...libraries.map((l) => l.id)] as Lib[]).map((id) => {
            const on = lib === id;
            const label = id === "all" ? t.allLibraries : libraries.find((l) => l.id === id)?.label;
            return (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setLib(id)}
                className={cx("t-caption h-8 pointer-coarse:h-11 rounded-full px-3 transition-colors duration-instant", on ? "bg-surface-sunken text-ink" : "text-ink-secondary hover:text-ink")}
              >
                {label}
              </button>
            );
          })}
        </div>
        <SearchBox value={q} onChange={setQ} placeholder={t.searchPlaceholder} />
      </FilterBar>

      {shown === 0 ? (
        <div className="mt-12">
          <EmptyState title={t.notFoundTitle} description={t.notFoundBody} />
        </div>
      ) : (
        sections.map(({ group: g, items }) => (
          <section key={g.id} className="mt-12 lg:mt-16" aria-labelledby={`demo-${g.id}`}>
            <SectionTitle id={`demo-${g.id}`} count={items.length}>
              {g.label}
            </SectionTitle>
            <div className="mt-6 grid gap-6 xl:grid-cols-2 xl:[&>*:last-child:nth-child(odd)]:col-span-2">
              {items.map((d) => (
                <div key={d.id} className={d.group === "scroll" || d.group === "3d" ? "xl:col-span-2" : undefined}>
                  <ErrorBoundary compact>
                    <Playground
                      id={d.id}
                      title={d.name}
                      caption={d.caption}
                      controls={d.controls}
                      initial={d.initial}
                      code={d.code}
                      links={d.links}
                      paneClassName={d.paneClassName}
                      footer={
                        <span className="flex flex-wrap items-center gap-1.5">
                          <Tag className={libTone[d.library]}>{libraries.find((l) => l.id === d.library)?.label}</Tag>
                          {d.heavy && <Tag>lazy</Tag>}
                          {d.avoid && <span className="t-caption text-ink-muted">{t.avoid(d.avoid)}</span>}
                        </span>
                      }
                    >
                      {(s) => d.render(s)}
                    </Playground>
                  </ErrorBoundary>
                </div>
              ))}
            </div>
          </section>
        ))
      )}

      <DataNote>
        {t.dataNote}
      </DataNote>
    </div>
  );
}
