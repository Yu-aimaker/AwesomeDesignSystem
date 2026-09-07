import { PageHeader, Section, SourceList, Why } from "../../layout/Page";
import { CodeBlock } from "../../layout/Preview";
import { Table } from "../../ds/components/Table";
import { Button } from "../../ds/components/Button";
import { Badge } from "../../ds/components/Badge";
import { radiusScale } from "../../lib/tokens";

const uses: Record<string, string> = {
  xs: "チェックボックス、インラインコード",
  sm: "選択中のセル、ごく小さなボタン",
  md: "ボタン、入力欄、セレクト、タブ、メニュー項目",
  lg: "カード、ポップオーバー、ドロップダウン、トースト",
  xl: "ダイアログ、シート、大きな画像",
  "2xl": "全幅の画像ブロック",
  pill: "バッジ、アバター、スイッチ",
};

const measured = [
  { system: "Linear", ladder: "4 / 6 / 8 / 12 / 16", note: "カード 12px。ピルは使わない" },
  { system: "Vercel", ladder: "4 / 6 / 8 / 12 / 16", note: "アプリ内ボタン 6px、マーケティング CTA はピル" },
  { system: "Stripe", ladder: "4 / 6 / 8 / 12 / 16", note: "ボタンはピル" },
  { system: "Notion", ladder: "4 / 6 / 8 / 12 / 16", note: "大きなタイルに 20、24 を追加" },
  { system: "Raycast", ladder: "4 / 6 / 8 / 10 / 16", note: "ダーク背景でカード 10px" },
  { system: "Apple", ladder: "5 / 8 / 11 / 18", note: "Store のカードは 18px" },
  { system: "Material 3", ladder: "4 / 8 / 12 / 16 / 28", note: "extra-small から extra-large" },
  { system: "shadcn/ui", ladder: "--radius 10px から算出", note: "1 変数、テーマで 0 から 16px" },
];

export function Radius() {
  return (
    <div>
      <PageHeader title="角丸" lead="操作部品 8px、カード 12px、ダイアログ 16px、バッジとアバターはピル。1 つのプロダクトに 1 つの系列。" />

      <Section id="rule" title="結論">
        <div className="prose t-body text-ink">
          <p>
            角丸は 4、6、8、12、16、24、ピルの 7 段階です。ボタンと入力欄は 8px、カードとメニューは 12px、ダイアログとシートは 16px。入れ子にするときは外側の角丸からパディングを引いた値を内側に使います。境界線は
            1px で、2px はフォーカスリングにだけ使います。
          </p>
        </div>
        <CodeBlock
          className="mt-6 max-w-[65ch]"
          code={"--ds-radius-xs: 4px;  --ds-radius-sm: 6px;  --ds-radius-md: 8px;\n--ds-radius-lg: 12px; --ds-radius-xl: 16px; --ds-radius-2xl: 24px;\n--ds-radius-pill: 9999px;"}
        />
      </Section>

      <Section id="scale" title="スケール">
        <ul className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-7">
          {radiusScale.map((r) => (
            <li key={r.name} className="flex flex-col gap-2">
              <span aria-hidden className="size-16 border border-hairline-strong bg-surface-sunken" style={{ borderRadius: r.value }} />
              <span className="t-mono text-ink">
                {r.name} <span className="text-ink-muted">{r.value}</span>
              </span>
              <span className="t-caption text-ink-secondary">{uses[r.name]}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="usage" title="使い分け" lead="同じ画面に 3 つの値が並んでも、大きさの順に角丸が増えるので違和感が出ません。">
        <div className="rounded-lg border border-hairline bg-canvas-soft p-6 sm:p-8">
          <div className="rounded-xl border border-hairline bg-surface p-6 shadow-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="t-h4 text-ink">メンバーを招待</p>
                <p className="t-body-sm mt-1 text-ink-secondary">ダイアログ 16px</p>
              </div>
              <Badge>ピル</Badge>
            </div>
            <div className="mt-6 rounded-lg border border-hairline bg-canvas-soft p-4">
              <p className="t-label text-ink">カード 12px</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="flex h-10 flex-1 items-center rounded-md border border-hairline-strong bg-surface px-3 text-sm text-ink-muted">入力欄 8px</span>
                <Button>ボタン 8px</Button>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section id="nested" title="入れ子の角丸" lead="内側の角丸 = 外側の角丸 − パディング。中心を共有させると角の隙間が均一になります。">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <div className="inline-block rounded-lg border border-hairline-strong bg-surface p-1">
              <div className="flex h-28 w-full min-w-56 items-center justify-center rounded-md bg-surface-sunken text-sm text-ink-secondary">12 − 4 = 8</div>
            </div>
            <p className="t-caption mt-3 text-ink-secondary">外側 12px、パディング 4px、内側 8px。隙間は角でも辺でも 4px。</p>
          </div>
          <div>
            <div className="inline-block rounded-lg border border-hairline-strong bg-surface p-1">
              <div className="flex h-28 w-full min-w-56 items-center justify-center rounded-lg bg-surface-sunken text-sm text-ink-secondary">12 と 12</div>
            </div>
            <p className="t-caption mt-3 text-ink-secondary">避ける: 内外を同じ 12px にすると、角の隙間だけが太く見えます。</p>
          </div>
        </div>
        <CodeBlock className="mt-6 max-w-[65ch]" code={".card { border-radius: var(--ds-radius-lg); padding: 4px; }\n.card > img { border-radius: calc(var(--ds-radius-lg) - 4px); }"} />
      </Section>

      <Section id="family" title="1 つの系列" lead="角の丸さは同じ役割の印として読まれます。系列が混ざると、同じ種類の部品が別物に見えます。">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-hairline bg-surface p-6">
            <p className="t-label text-ink">同じ系列</p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Button>保存</Button>
              <Button variant="secondary">キャンセル</Button>
              <span className="flex h-10 items-center rounded-md border border-hairline-strong px-3 text-sm text-ink-muted">検索</span>
            </div>
          </div>
          <div className="rounded-lg border border-hairline bg-surface p-6">
            <p className="t-label text-ink">避ける: 角丸の混在</p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="flex h-10 items-center rounded-full bg-primary px-4 text-sm font-medium text-on-primary">保存</span>
              <span className="flex h-10 items-center rounded-none border border-hairline-strong px-4 text-sm text-ink">キャンセル</span>
              <span className="flex h-10 items-center rounded-md border border-hairline-strong px-3 text-sm text-ink-muted">検索</span>
            </div>
          </div>
        </div>
      </Section>

      <Section id="measured" title="実測した系列" lead="awesome-design-md に記録された各社の rounded スケール。11 のうち 7 が 4 / 6 / 8 / 12 / 16 を共有しています。">
        <Table
          columns={[
            { key: "system", header: "システム", render: (r) => r.system },
            { key: "ladder", header: "スケール (px)", render: (r) => <code>{r.ladder}</code> },
            { key: "note", header: "備考", wrap: true, render: (r) => r.note },
          ]}
          rows={measured}
          rowKey={(r) => r.system}
        />
      </Section>

      <Why>
        <p>
          高さ 40px のボタンに 8px の角丸を付けると、弧は高さの 5 分の 1 です。丸みは伝わりますがピルにはならないので、ピルを「バッジ」や「スイッチ」の印として残せます。6px
          は 12px のカードの中で鋭く見え、10px はカードと張り合います。
        </p>
        <p>
          カードは 24px のパディングの中に 8px の部品を収めます。入れ子の式から、外側は 8 + パディング以上なら何でもよく、12px は中身より柔らかく見える最小の値です。ダイアログはカードの上に浮くので次の段階の
          16px を使います。16px を超えると角が中身を侵食し、余計なパディングが要ります。
        </p>
        <p>
          系列を 1 つに絞るのはゲシュタルトの類同の法則によります。同じ形は同じ役割として読まれるので、丸いボタンと四角いボタンが並ぶと、押せるものの見え方が揺れます。
        </p>
      </Why>

      <SourceList
        sources={[
          { title: "voltagent/awesome-design-md", url: "https://github.com/voltagent/awesome-design-md", note: "各社の rounded スケールの実測" },
          { title: "Material 3: Shape scale", url: "https://m3.material.io/styles/shape/corner-radius-scale", note: "4、8、12、16、28、full" },
          { title: "Cloud Four: The Math Behind Nesting Rounded Corners", url: "https://cloudfour.com/thinks/the-math-behind-nesting-rounded-corners/", note: "引き算の式" },
          { title: "CSS-Tricks: Careful with your nested border-radii", url: "https://css-tricks.com/public-service-announcement-careful-with-your-nested-border-radii/", note: "同じ値だと角が太く見える" },
          { title: "NN/g: Similarity Principle in Visual Design", url: "https://www.nngroup.com/articles/gestalt-similarity/", note: "同じ形は同じ役割" },
          { title: "shadcn/ui: Theming", url: "https://ui.shadcn.com/docs/theming", note: "--radius 1 変数の運用" },
        ]}
      />
    </div>
  );
}
