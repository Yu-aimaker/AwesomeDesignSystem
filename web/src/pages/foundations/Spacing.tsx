import { PageHeader, Section } from "../../layout/Page";
import { breakpoints, spaceScale, tokens } from "../../lib/tokens";
import { Table } from "../../ds/components/Table";

export function Spacing() {
  return (
    <div>
      <PageHeader title="スペーシング" lead={`4px 基準。コンテナ ${tokens.layout.container.$value}、本文幅 ${tokens.layout.measure.$value}。`} />
      <Section id="scale" title="スケール">
        <ul className="flex flex-col gap-2">
          {spaceScale.map((s) => (
            <li key={s.step} className="flex items-center gap-4">
              <span className="t-mono w-20 text-ink-muted">space-{s.step}</span>
              <span aria-hidden className="h-4 rounded-xs bg-accent" style={{ width: s.px }} />
              <span className="t-mono tabular text-ink">{s.px}px</span>
            </li>
          ))}
        </ul>
      </Section>
      <Section id="breakpoints" title="ブレークポイント">
        <Table
          columns={[
            { key: "name", header: "名前", render: (r) => <code>{r.name}</code> },
            { key: "value", header: "min-width", align: "right", render: (r) => r.value },
          ]}
          rows={breakpoints}
          rowKey={(r) => r.name}
        />
      </Section>
    </div>
  );
}
