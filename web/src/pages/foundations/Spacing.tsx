import { PageHeader, Section, SourceList, Why } from "../../layout/Page";
import { CodeBlock } from "../../layout/Preview";
import { Table } from "../../ds/components/Table";
import { Button } from "../../ds/components/Button";
import { breakpoints, spaceScale, tokens } from "../../lib/tokens";

const uses: Record<string, string> = {
  "1": "アイコンとラベルの間、バッジの内側",
  "2": "小さな部品の内側、リスト項目の間",
  "3": "入力欄の左右、ゴーストボタンの左右",
  "4": "ボタンの左右、モバイルのカード間",
  "5": "フォーム項目の間で 16 が詰まるとき",
  "6": "カードの内側、デスクトップのガター",
  "8": "グループの間",
  "10": "操作部品の高さ、モバイルのセクション余白",
  "12": "大きなグループの間、大きい部品の高さ",
  "16": "モバイルのセクション間",
  "20": "タブレットのセクション間",
  "24": "デスクトップのセクション間",
  "32": "大画面でヒーローから最初のセクションまで",
};

const bands = [
  { name: "内側", range: "8 から 16", meaning: "1 つの部品を構成する要素", example: "ラベルと入力欄 8、ボタンの左右 16" },
  { name: "要素間", range: "16 から 24", meaning: "関係のある要素", example: "フォーム項目 16、カード同士 24" },
  { name: "グループ間", range: "32 から 48", meaning: "同じセクション内の別グループ", example: "見出しと本文 32、フォームの区切り 32" },
  { name: "セクション間", range: "64 から 96", meaning: "ページのセクション", example: "モバイル 64、タブレット 80、デスクトップ 96" },
];

const bpUse: Record<string, string> = {
  sm: "フォームを 2 列に、ボタンを横並びに",
  md: "サイドバーとメインの 2 カラム",
  lg: "サイドバーを常時表示、3 カラムのカード",
  xl: "コンテナ 1200px が左右に余白を持つ",
  "2xl": "変化なし。文字を大きくしない",
};

export function Spacing() {
  return (
    <div>
      <PageHeader
        title="余白とレイアウト"
        lead={`4px を単位にし、距離の意味を 4 段階に固定します。コンテナ ${tokens.layout.container.$value}、本文の幅 ${tokens.layout.measure.$value}。`}
      />

      <Section id="rule" title="結論">
        <div className="prose t-body text-ink">
          <p>
            余白はすべて 4 の倍数を使います。同じ関係には同じ距離を使い、隣り合う段階を同じ意味で混ぜません。部品の内側は 8 から 16、関係のある要素の間は
            16 から 24、グループの間は 32 から 48、セクションの間は 64 から 96 です。
          </p>
        </div>
        <CodeBlock
          className="mt-6 max-w-[65ch]"
          code={"--ds-space-1: 4px;    --ds-space-2: 8px;    --ds-space-3: 12px;\n--ds-space-4: 16px;   --ds-space-6: 24px;   --ds-space-8: 32px;\n--ds-space-12: 48px;  --ds-space-16: 64px;  --ds-space-24: 96px;\n--ds-container: 1200px;\n--ds-measure: 65ch;"}
        />
      </Section>

      <Section id="scale" title="スケール" lead="13 段階。長さは実寸です。">
        <ul className="flex flex-col gap-2">
          {spaceScale.map((s) => (
            <li key={s.step} className="grid grid-cols-[5rem_minmax(0,1fr)] items-center gap-4 sm:grid-cols-[5rem_12rem_minmax(0,1fr)]">
              <span className="t-mono text-ink-muted">space-{s.step}</span>
              <span className="flex items-center gap-3">
                <span aria-hidden className="h-4 shrink-0 rounded-xs bg-primary" style={{ width: s.px }} />
                <span className="t-mono tabular text-ink">{s.px}px</span>
              </span>
              <span className="t-caption hidden text-ink-secondary sm:block">{uses[s.step]}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="bands" title="4 つの距離" lead="距離は関係の強さとして読まれます。下のカードは実際の値で組んであり、注記は各余白の幅を指しています。">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="rounded-lg border border-hairline bg-canvas-soft p-6 sm:p-8">
            <div className="rounded-lg border border-hairline bg-surface p-6">
              <p className="t-h4 text-ink">プロジェクトを作成</p>
              <p className="t-body-sm mt-2 text-ink-secondary">名前は後から変更できます。</p>
              <div className="mt-6 flex flex-col gap-4">
                <label className="flex flex-col gap-2">
                  <span className="t-label text-ink">名前</span>
                  <span className="flex h-10 items-center rounded-md border border-hairline-strong bg-surface px-3 text-sm text-ink-muted">新しいプロジェクト</span>
                </label>
                <label className="flex flex-col gap-2">
                  <span className="t-label text-ink">説明</span>
                  <span className="flex h-10 items-center rounded-md border border-hairline-strong bg-surface px-3 text-sm text-ink-muted">任意</span>
                </label>
              </div>
              <div className="mt-8 flex gap-2">
                <Button>作成</Button>
                <Button variant="secondary">キャンセル</Button>
              </div>
            </div>
          </div>
          <dl className="grid grid-cols-[4rem_1fr] gap-x-4 gap-y-3 self-center text-sm">
            <dt className="t-mono text-ink-muted">8px</dt>
            <dd className="text-ink">ラベルと入力欄の間。1 つの部品の内側</dd>
            <dt className="t-mono text-ink-muted">16px</dt>
            <dd className="text-ink">入力欄と入力欄の間。関係のある要素</dd>
            <dt className="t-mono text-ink-muted">24px</dt>
            <dd className="text-ink">カードの内側の余白。外の余白と同じ値でリズムをそろえる</dd>
            <dt className="t-mono text-ink-muted">32px</dt>
            <dd className="text-ink">フォームとボタン列の間。別のグループ</dd>
          </dl>
        </div>
        <Table
          className="mt-8"
          columns={[
            { key: "name", header: "帯", render: (r) => r.name },
            { key: "range", header: "px", render: (r) => <code>{r.range}</code> },
            { key: "meaning", header: "意味", wrap: true, render: (r) => r.meaning },
            { key: "example", header: "例", wrap: true, render: (r) => r.example },
          ]}
          rows={bands}
          rowKey={(r) => r.name}
        />
      </Section>

      <Section id="grid" title="コンテナとグリッド" lead="幅 1200px、12 カラム、ガターはデスクトップ 24px、モバイル 16px。文章は 65ch で止めます。">
        <div className="rounded-lg border border-hairline bg-canvas-soft p-4 sm:p-6">
          <div className="grid grid-cols-4 gap-4 sm:grid-cols-12 sm:gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="flex h-16 items-center justify-center rounded-xs border border-dashed border-hairline-strong text-xs text-ink-muted tabular">
                {i + 1}
              </div>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-4 gap-4 sm:grid-cols-12 sm:gap-6">
            <div className="col-span-4 rounded-md border border-hairline bg-surface p-4 sm:col-span-8">
              <p className="t-label text-ink">本文 8 カラム</p>
              <p className="t-caption mt-1 text-ink-secondary">文章はこの中でも 65ch で止まります。</p>
            </div>
            <div className="col-span-4 rounded-md border border-hairline bg-surface p-4 sm:col-span-4">
              <p className="t-label text-ink">補足 4 カラム</p>
              <p className="t-caption mt-1 text-ink-secondary">モバイルでは下に落ちます。</p>
            </div>
          </div>
        </div>
        <CodeBlock
          className="mt-6 max-w-[65ch]"
          code={".container {\n  max-width: var(--ds-container);\n  margin-inline: auto;\n  padding-inline: var(--ds-space-4);\n}\n.grid {\n  display: grid;\n  grid-template-columns: repeat(12, minmax(0, 1fr));\n  gap: var(--ds-space-6);\n}\n.prose { max-width: var(--ds-measure); }"}
        />
      </Section>

      <Section id="breakpoints" title="ブレークポイント">
        <Table
          columns={[
            { key: "name", header: "名前", render: (r) => <code>{r.name}</code> },
            { key: "value", header: "min-width", align: "right", render: (r) => r.value },
            { key: "use", header: "主な変化", wrap: true, render: (r) => bpUse[r.name] ?? "" },
          ]}
          rows={breakpoints}
          rowKey={(r) => r.name}
        />
      </Section>

      <Section id="targets" title="押せる大きさ" lead="デスクトップは 24px 以上、タッチは 44px 以上。見た目より当たり判定を広げてもかまいません。">
        <div className="flex flex-wrap items-end gap-8">
          <div className="flex flex-col items-start gap-2">
            <span className="flex size-6 items-center justify-center rounded-xs border border-hairline-strong bg-surface text-xs text-ink">24</span>
            <span className="t-caption text-ink-secondary">デスクトップの最小 (WCAG 2.5.8)</span>
          </div>
          <div className="flex flex-col items-start gap-2">
            <span className="flex h-10 w-24 items-center justify-center rounded-md bg-primary text-sm font-medium text-on-primary">40</span>
            <span className="t-caption text-ink-secondary">ボタンの既定の高さ</span>
          </div>
          <div className="flex flex-col items-start gap-2">
            <span className="flex size-11 items-center justify-center rounded-md border border-hairline-strong bg-surface text-xs text-ink">44</span>
            <span className="t-caption text-ink-secondary">タッチの最小 (Apple HIG)</span>
          </div>
          <div className="flex flex-col items-start gap-2">
            <span className="flex size-12 items-center justify-center rounded-md border border-hairline-strong bg-surface text-xs text-ink">48</span>
            <span className="t-caption text-ink-secondary">Material 3 の推奨</span>
          </div>
        </div>
      </Section>

      <Section id="good-bad" title="良い例と避ける例">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-hairline bg-surface p-6">
            <p className="t-label text-ink">同じ関係に同じ距離</p>
            <ul className="mt-4 flex flex-col gap-4">
              {["請求書を送信しました", "支払いを確認しました", "領収書を発行しました"].map((t) => (
                <li key={t} className="flex items-center gap-3 rounded-md border border-hairline p-3 text-sm text-ink">
                  <span aria-hidden className="size-2 rounded-full bg-success" />
                  {t}
                </li>
              ))}
            </ul>
            <p className="t-caption mt-4 text-ink-secondary">項目の間隔は 16 で統一。内側は 12。</p>
          </div>
          <div className="rounded-lg border border-hairline bg-surface p-6">
            <p className="t-label text-ink">避ける: 隣り合う段階を混ぜる</p>
            <ul className="mt-4 flex flex-col">
              <li className="flex items-center gap-3 rounded-md border border-hairline p-3 text-sm text-ink">
                <span aria-hidden className="size-2 rounded-full bg-success" />
                請求書を送信しました
              </li>
              <li className="mt-3 flex items-center gap-2 rounded-md border border-hairline px-4 py-2 text-sm text-ink">
                <span aria-hidden className="size-2 rounded-full bg-success" />
                支払いを確認しました
              </li>
              <li className="mt-5 flex items-center gap-4 rounded-md border border-hairline p-3.5 text-sm text-ink">
                <span aria-hidden className="size-2 rounded-full bg-success" />
                領収書を発行しました
              </li>
            </ul>
            <p className="t-caption mt-4 text-ink-secondary">12、20、14 が混ざると、同じ種類の項目が別物に見えます。</p>
          </div>
        </div>
      </Section>

      <Why>
        <p>
          4px を単位にすると、8、16、24、40、48 という部品とアイコンの寸法にすべて割り切れます。Apple のレイアウト指針は 8、16、32 の刻みを使い、Tailwind
          v4 の spacing も 4px 単位です。本文 16px に行間 1.6 をかけた 25.6px は 24 と 28 の間に落ちるため、ブロックの高さは 4 の倍数に丸めます。
        </p>
        <p>
          距離を 4 つの帯に分けるのは、ゲシュタルトの近接の法則によります。近いものは同じグループとして読まれるため、「同じ関係には同じ距離」を守るだけで、線や枠を足さずにまとまりが伝わります。Nielsen
          Norman Group は要素の間に 1 単位、グループの間にその 2 倍を置く目安を示しています。
        </p>
        <p>
          コンテナ 1200px は、計測した Linear、Vercel、Notion、Stripe のコンテナ幅が 1120 から 1280 に集まっていることから選びました。12 カラムは 2、3、4、6
          に割れる唯一の一般的な列数です。
        </p>
        <p>
          押せる大きさは WCAG 2.2 の 2.5.8（24px）を最低とし、タッチでは Apple の 44pt と Material の 48dp に合わせます。Fitts
          の法則が示す通り、目標が小さいほど到達に時間がかかり、誤操作が増えます。
        </p>
      </Why>

      <SourceList
        sources={[
          { title: "WCAG 2.2: 2.5.8 Target Size (Minimum)", url: "https://www.w3.org/TR/WCAG22/#target-size-minimum", note: "24px の最小サイズ" },
          { title: "Apple HIG: Layout", url: "https://developer.apple.com/design/human-interface-guidelines/layout", note: "8、16、32 の刻み、44pt の目標" },
          { title: "Material 3: Layout", url: "https://m3.material.io/foundations/layout/understanding-layout/overview", note: "48dp のタッチ目標" },
          { title: "NN/g: Proximity Principle in Visual Design", url: "https://www.nngroup.com/articles/gestalt-proximity/", note: "距離は関係として読まれる" },
          { title: "NN/g: Fitts's Law", url: "https://www.nngroup.com/articles/fitts-law/", note: "目標の大きさと到達時間" },
          { title: "Tailwind CSS v4: Theme variables", url: "https://tailwindcss.com/docs/theme", note: "4px 単位の spacing" },
          { title: "voltagent/awesome-design-md", url: "https://github.com/voltagent/awesome-design-md", note: "Linear、Vercel、Notion、Stripe のコンテナ幅の実測" },
        ]}
      />
    </div>
  );
}
