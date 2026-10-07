import { useMemo, useState } from "react";
import { components, componentsByGroup, groups, type ComponentGroup } from "../ds/registry";
import { Playground } from "../layout/Playground";
import { ErrorBoundary } from "../layout/ErrorBoundary";
import { DataNote, FilterBar, FilterChip, GalleryHeader, SearchBox, SectionTitle, Tag } from "../layout/Gallery";
import { EmptyState } from "../ds/components/EmptyState";
import { repoUrl } from "../lib/nav";
import { useT } from "../i18n/context";
import { componentsMessages } from "../i18n/messages/components";

// Entries that need the full row: tables, navigation, anything with a wide layout.
const wide = new Set(["table", "data-table", "nav-bar", "stepper", "timeline", "media-card", "calendar", "command-menu", "breadcrumb", "pagination", "file-upload", "tabs", "accordion"]);

export function Components() {
  const t = useT(componentsMessages);
  const [group, setGroup] = useState<ComponentGroup | "all">("all");
  const [q, setQ] = useState("");

  const sections = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return componentsByGroup()
      .filter((s) => group === "all" || s.group.id === group)
      .map((s) => ({ ...s, items: s.items.filter((c) => !needle || `${c.name} ${c.caption} ${c.id}`.toLowerCase().includes(needle)) }))
      .filter((s) => s.items.length > 0);
  }, [group, q]);

  const shown = sections.reduce((n, s) => n + s.items.length, 0);

  return (
    <div>
      <GalleryHeader title={t.title} lead={t.lead} stat={components.length} statLabel={t.statLabel} />

      <FilterBar>
        <FilterChip selected={group === "all"} onSelect={() => setGroup("all")} count={components.length}>
          {t.all}
        </FilterChip>
        {groups.map((g) => (
          <FilterChip key={g.id} selected={group === g.id} onSelect={() => setGroup(g.id)} count={components.filter((c) => c.group === g.id).length}>
            {g.label}
          </FilterChip>
        ))}
        <SearchBox value={q} onChange={setQ} placeholder={t.searchPlaceholder} />
      </FilterBar>

      {shown === 0 ? (
        <div className="mt-12">
          <EmptyState title={t.notFoundTitle} description={t.notFoundBody} />
        </div>
      ) : (
        sections.map(({ group: g, items }) => (
          <section key={g.id} className="mt-12" aria-labelledby={`group-${g.id}`}>
            <SectionTitle id={`group-${g.id}`} count={items.length}>
              {g.label}
            </SectionTitle>
            <div className="mt-6 grid gap-6 xl:grid-cols-2">
              {items.map((c) => (
                <div key={c.id} className={wide.has(c.id) ? "xl:col-span-2" : undefined}>
                  <ErrorBoundary compact>
                    <Playground
                      id={c.id}
                      title={c.name}
                      caption={c.caption}
                      controls={c.controls}
                      initial={c.initial}
                      code={c.code}
                      source={c.source}
                      footer={
                        <span className="flex flex-wrap gap-1.5">
                          {c.states?.map((s) => <Tag key={s}>{s}</Tag>)}
                          {c.tokens?.slice(0, 4).map((t) => (
                            <Tag key={t} className="text-accent">
                              {t}
                            </Tag>
                          ))}
                        </span>
                      }
                    >
                      {(s) => c.render(s)}
                    </Playground>
                  </ErrorBoundary>
                </div>
              ))}
            </div>
          </section>
        ))
      )}

      <DataNote>
        {t.noteBefore}{" "}
        <a href={`${repoUrl}/tree/main/web/src/ds/components`} target="_blank" rel="noreferrer">
          web/src/ds/components
        </a>
        {t.noteAfter}
      </DataNote>
    </div>
  );
}
