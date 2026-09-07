import { useMemo, useState } from "react";
import { demoGroups, demos, libraries, type DemoEntry } from "../demos/registry";
import { Playground } from "../layout/Playground";
import { ErrorBoundary } from "../layout/ErrorBoundary";
import { DataNote, FilterBar, FilterChip, GalleryHeader, SearchBox, SectionTitle, Tag } from "../layout/Gallery";
import { EmptyState } from "../ds/components/EmptyState";
import { cx } from "../ds/cx";

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
  }, [group, lib, q]);
  const shown = sections.reduce((n, s) => n + s.items.length, 0);

  return (
    <div>
      <GalleryHeader title="モーション" lead="duration と easing を動かして、目で決める。重いものは押すまで読み込まない。" stat={demos.length} statLabel="デモ">
        {reduced && <p className="t-caption mt-3 text-ink-secondary">OS の「視差効果を減らす」が有効です。デモは移動を省き、フェードだけを残します。</p>}
      </GalleryHeader>

      <FilterBar>
        <FilterChip selected={group === "all"} onSelect={() => setGroup("all")} count={demos.length}>
          すべて
        </FilterChip>
        {demoGroups.map((g) => (
          <FilterChip key={g.id} selected={group === g.id} onSelect={() => setGroup(g.id)} count={demos.filter((d) => d.group === g.id).length}>
            {g.label}
          </FilterChip>
        ))}
        <span aria-hidden className="mx-1 hidden h-5 w-px bg-hairline sm:block" />
        <div role="radiogroup" aria-label="ライブラリ" className="flex flex-wrap gap-1">
          {(["all", ...libraries.map((l) => l.id)] as Lib[]).map((id) => {
            const on = lib === id;
            const label = id === "all" ? "全ライブラリ" : libraries.find((l) => l.id === id)?.label;
            return (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setLib(id)}
                className={cx("t-caption h-8 rounded-full px-3 transition-colors duration-instant", on ? "bg-surface-sunken text-ink" : "text-ink-secondary hover:text-ink")}
              >
                {label}
              </button>
            );
          })}
        </div>
        <SearchBox value={q} onChange={setQ} placeholder="デモを検索" />
      </FilterBar>

      {shown === 0 ? (
        <div className="mt-12">
          <EmptyState title="見つかりません" description="ライブラリの絞り込みを外すか、別の語で検索してください。" />
        </div>
      ) : (
        sections.map(({ group: g, items }) => (
          <section key={g.id} className="mt-12" aria-labelledby={`demo-${g.id}`}>
            <SectionTitle id={`demo-${g.id}`} count={items.length}>
              {g.label}
            </SectionTitle>
            <div className="mt-6 grid gap-6 xl:grid-cols-2">
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
                          {d.avoid && <span className="t-caption text-ink-muted">避ける: {d.avoid}</span>}
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
        既定は 200ms、ease-out、移動 4〜8px。無限ループはローディングだけ。すべて prefers-reduced-motion を尊重します。詳細は AwesomeDS/foundations/motion.md。
      </DataNote>
    </div>
  );
}
