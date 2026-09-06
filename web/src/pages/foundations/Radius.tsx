import { PageHeader, Section } from "../../layout/Page";
import { radiusScale } from "../../lib/tokens";

export function Radius() {
  return (
    <div>
      <PageHeader title="角丸" lead="操作部 8px、カード 12px、ダイアログ 16px。バッジとアバターはピル。" />
      <Section id="scale" title="スケール">
        <ul className="flex flex-wrap gap-4">
          {radiusScale.map((r) => (
            <li key={r.name} className="flex flex-col items-center gap-2">
              <span aria-hidden className="size-16 border border-hairline-strong bg-surface-sunken" style={{ borderRadius: r.value }} />
              <span className="t-mono text-ink">{r.name}</span>
              <span className="t-caption text-ink-muted">{r.value}</span>
            </li>
          ))}
        </ul>
      </Section>
      <Section id="nested" title="入れ子の角丸" lead="内側の角丸 = 外側の角丸 − パディング。">
        <div className="inline-block rounded-lg border border-hairline bg-surface p-1">
          <div className="flex h-32 w-64 items-center justify-center rounded-md bg-surface-sunken text-sm text-ink-secondary">12px − 4px = 8px</div>
        </div>
      </Section>
    </div>
  );
}
