import { useEffect, useMemo, useState } from "react";
import { ExternalLink } from "lucide-react";
import { fonts, fontsMeta, fontCategoryLabel, type FontCategory, type FontEntry } from "../lib/data";
import { loadSpecimenFonts } from "../lib/fontLoader";
import { DataNote, FilterBar, FilterChip, GalleryHeader, SearchBox, SectionTitle } from "../layout/Gallery";
import { Badge } from "../ds/components/Badge";
import { EmptyState } from "../ds/components/EmptyState";
import { cx } from "../ds/cx";
import { useLocale, useT } from "../i18n/context";
import { fontsMessages } from "../i18n/messages/fonts";

type Cat = FontCategory | "all";
type Sort = "usage" | "name";

const fallback: Record<FontCategory, string> = {
  sans: "system-ui, sans-serif",
  serif: "Georgia, serif",
  mono: "ui-monospace, monospace",
  "jp-sans": '"Hiragino Sans", "Yu Gothic", sans-serif',
  "jp-serif": '"Hiragino Mincho ProN", "Yu Mincho", serif',
};

function family(f: FontEntry): string {
  return f.cssFamily ? `"${f.cssFamily}", ${fallback[f.category]}` : fallback[f.category];
}
const isJp = (f: FontEntry) => f.category.startsWith("jp");

function Specimen({ font, size = 56, className }: { font: FontEntry; size?: number; className?: string }) {
  return (
    <p className={cx("shrink-0 leading-none whitespace-nowrap text-ink", className)} style={{ fontFamily: family(font), fontSize: size, fontWeight: 600, letterSpacing: font.category === "mono" ? 0 : "-0.02em" }} aria-hidden>
      {font.category === "mono" ? "0O il1" : isJp(font) ? "永あ" : "Ag"}
    </p>
  );
}

const sample = {
  en: "Design is how it works.",
  jp: "余白は関係の強さを表す。近いものは似ている。",
  mono: "const radius = 8; // px",
};

export function Fonts() {
  const { locale } = useLocale();
  const t = useT(fontsMessages);
  const licenseLabel = t.license;
  const [cat, setCat] = useState<Cat>("all");
  const [sort, setSort] = useState<Sort>("usage");
  const [q, setQ] = useState("");
  const [tryId, setTryId] = useState(fonts.find((f) => f.id === "geist")?.id ?? fonts[0]?.id);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    loadSpecimenFonts().then(() => alive && setLoaded(true));
    return () => {
      alive = false;
    };
  }, []);

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return fonts
      .filter((f) => (cat === "all" || f.category === cat) && (!needle || `${f.name} ${f.foundry} ${f.designer} ${f.note} ${f.usedBy.map((u) => u.name).join(" ")}`.toLowerCase().includes(needle)))
      .sort((a, b) => (sort === "usage" ? b.usedByCount - a.usedByCount || a.name.localeCompare(b.name) : a.name.localeCompare(b.name)));
  }, [cat, sort, q]);

  const trying = fonts.find((f) => f.id === tryId) ?? fonts[0];
  const jp = fonts.find((f) => f.id === "noto-sans-jp");
  const top = useMemo(() => [...fonts].sort((a, b) => b.usedByCount - a.usedByCount).filter((f) => f.usedByCount > 0).slice(0, 12), []);
  const max = top[0]?.usedByCount ?? 1;
  const brandsScanned = (fontsMeta as { counts?: { brandsScanned?: number } }).counts?.brandsScanned ?? 0;

  if (!trying) return <EmptyState title={t.emptyTitle} description={t.emptyBody} />;

  return (
    <div>
      <GalleryHeader title={t.title} lead={t.lead} stat={fonts.length} statLabel={t.statLabel} />

      {/* Try-on stage: the selected font at display size, paired with Noto Sans JP. */}
      <section aria-label={t.tryOn} className="overflow-hidden rounded-lg border border-hairline bg-surface">
        <div className="grid gap-6 p-6 sm:p-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-end">
          <div className="min-w-0">
            <p className="t-caption text-ink-muted">
              {trying.name}
              {!isJp(trying) && jp ? ` + ${jp.name}` : ""}
              {trying.loaded ? "" : trying.license === "system" ? t.ifInstalled : t.privateFallback}
            </p>
            <p lang={isJp(trying) ? "ja" : undefined} className="mt-4 text-ink" style={{ fontFamily: family(trying), fontSize: "clamp(48px, 9vw, 128px)", lineHeight: 0.95, fontWeight: 600, letterSpacing: trying.category === "mono" ? 0 : "-0.035em" }}>
              {trying.category === "mono" ? sample.mono : isJp(trying) ? "美しい余白" : "Aa Design"}
            </p>
          </div>
          <div className="min-w-0 border-t border-hairline pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
            <p lang={isJp(trying) ? "ja" : "en"} className="text-ink" style={{ fontFamily: family(trying), fontSize: 22, lineHeight: 1.4 }}>
              {isJp(trying) ? sample.jp : sample.en}
            </p>
            <p lang={isJp(trying) ? "en" : "ja"} className="mt-3 text-ink-secondary" style={{ fontFamily: isJp(trying) ? family(trying) : jp ? `${family(trying)}, ${family(jp)}` : family(trying), fontSize: 16, lineHeight: 1.7 }}>
              {isJp(trying) ? sample.en : sample.jp}
            </p>
            <dl className="t-caption mt-6 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-ink-secondary">
              <dt className="text-ink-muted">{t.designer}</dt>
              <dd>{trying.designer}</dd>
              <dt className="text-ink-muted">{t.distribution}</dt>
              <dd>
                {trying.foundry} · {trying.year} · {licenseLabel[trying.license]}
              </dd>
              <dt className="text-ink-muted">{t.pairs}</dt>
              <dd>{trying.pairs.map((p) => fonts.find((f) => f.id === p)?.name ?? p).join(" / ")}</dd>
            </dl>
          </div>
        </div>
      </section>

      {/* Measured usage across the brands data set. */}
      {top.length > 0 && (
        <section className="mt-12 lg:mt-16" aria-labelledby="usage">
          <SectionTitle id="usage">{t.usageTitle}</SectionTitle>
          <p className="t-body-sm mt-2 measure text-ink-secondary">{t.usageLead(brandsScanned)}</p>
          <ol className="mt-6 grid gap-2">
            {top.map((f) => (
              <li key={f.id} className="grid grid-cols-[minmax(0,10rem)_1fr_auto] items-center gap-3 sm:grid-cols-[minmax(0,14rem)_1fr_auto]">
                <button type="button" onClick={() => setTryId(f.id)} className="truncate text-left text-sm text-ink hover:text-accent" style={{ fontFamily: family(f) }}>
                  {f.name}
                </button>
                <span className="h-6 overflow-hidden rounded-xs bg-surface-sunken">
                  <span className="block h-full rounded-xs bg-ink transition-[width] duration-slow ease-out-ds" style={{ width: `${(f.usedByCount / max) * 100}%` }} />
                </span>
                <span className="t-mono tabular w-8 text-right text-ink-secondary">{f.usedByCount}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      <section className="mt-12 lg:mt-16" aria-labelledby="wall">
        <SectionTitle id="wall" count={list.length}>
          {t.allTitle}
        </SectionTitle>
        <FilterBar className="mt-4">
          <FilterChip selected={cat === "all"} onSelect={() => setCat("all")} count={fonts.length}>
            {t.all}
          </FilterChip>
          {(Object.keys(fontCategoryLabel) as FontCategory[]).map((c) => (
            <FilterChip key={c} selected={cat === c} onSelect={() => setCat(c)} count={fonts.filter((f) => f.category === c).length}>
              {fontCategoryLabel[c][locale]}
            </FilterChip>
          ))}
          <span aria-hidden className="mx-1 hidden h-5 w-px bg-hairline sm:block" />
          <div role="radiogroup" aria-label={t.sortOrder} className="flex gap-1">
            {(["usage", "name"] as Sort[]).map((s) => (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={sort === s}
                onClick={() => setSort(s)}
                className={cx("t-caption h-8 pointer-coarse:h-11 rounded-full px-3 transition-colors duration-instant", sort === s ? "bg-surface-sunken text-ink" : "text-ink-secondary hover:text-ink")}
              >
                {s === "usage" ? t.sortUsage : t.sortName}
              </button>
            ))}
          </div>
          <SearchBox value={q} onChange={setQ} placeholder={t.searchPlaceholder} />
        </FilterBar>

        {list.length === 0 ? (
          <div className="mt-10">
            <EmptyState title={t.notFoundTitle} description={t.notFoundBody} />
          </div>
        ) : (
          <ul className="mt-6 grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(280px, 100%), 1fr))" }}>
            {list.map((f) => {
              const on = f.id === tryId;
              return (
                <li key={f.id} id={f.id} className="flex scroll-mt-32 flex-col">
                  <button
                    type="button"
                    onClick={() => setTryId(f.id)}
                    aria-pressed={on}
                    className={cx(
                      "flex w-full flex-1 flex-col rounded-lg border bg-surface text-left transition-[transform,box-shadow,border-color] duration-fast ease-out-ds hover:-translate-y-0.5 hover:shadow-2",
                      on ? "border-ink" : f.loaded ? "border-hairline" : "border-dashed border-hairline-strong",
                    )}
                  >
                    <div className="flex h-36 items-end justify-between gap-3 overflow-hidden border-b border-hairline p-5">
                      <Specimen font={f} />
                      <span className="t-caption text-right text-ink-muted">
                        {fontCategoryLabel[f.category][locale]}
                        <br />
                        {f.loaded ? (loaded ? "" : t.loading) : f.license === "system" ? t.systemFont : t.fallbackShown}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col gap-2 p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="t-h4 truncate text-ink">{f.name}</p>
                          <p className="t-caption truncate text-ink-secondary">
                            {f.foundry} · {f.year}
                          </p>
                        </div>
                        <Badge tone={f.license === "OFL" ? "success" : f.license === "system" ? "neutral" : "warning"}>{licenseLabel[f.license]}</Badge>
                      </div>
                      <p className="t-body-sm text-ink-secondary" lang="ja">
                        {f.note}
                      </p>
                      <p className="t-caption mt-auto text-ink-muted">
                        {f.usedByCount > 0 ? (
                          <>
                            <span className="tabular text-ink">{t.companies(f.usedByCount)}</span> · {f.usedBy.slice(0, 4).map((u) => u.name).join(", ")}
                            {f.usedByCount > 4 ? t.andMore : ""}
                          </>
                        ) : (
                          t.noUsage
                        )}
                      </p>
                    </div>
                  </button>
                  <a href={f.url} target="_blank" rel="noreferrer" className="t-caption mt-0.5 inline-flex min-h-6 items-center gap-1 self-start px-1 pointer-coarse:min-h-11">
                    {t.source} <ExternalLink className="size-3" strokeWidth={1.75} aria-hidden />
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <DataNote updated={fontsMeta.updated}>
        {t.dataNote}
      </DataNote>
    </div>
  );
}
