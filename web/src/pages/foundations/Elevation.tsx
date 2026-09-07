import { PageHeader, Section, SourceList, Why } from "../../layout/Page";
import { CodeBlock } from "../../layout/Preview";
import { Table } from "../../ds/components/Table";
import { Button } from "../../ds/components/Button";
import { colorValue } from "../../lib/tokens";

const levels = [
  { level: "0", treatment: "なし", use: "ページ、セクション、テーブル、リストの行" },
  { level: "1", treatment: "1px solid hairline", use: "カード、入力欄、インラインのパネル、コードブロック" },
  { level: "2", treatment: "border + 0 4px 12px -2px rgb(10 10 10 / 0.08)", use: "ポップオーバー、ドロップダウン、ツールチップ、トースト" },
  { level: "3", treatment: "border + 0 16px 48px -12px rgb(10 10 10 / 0.18)", use: "ダイアログ、シート、コマンドメニュー、ドラッグ中の要素" },
];

const darkLadder = ["canvas", "canvas-soft", "surface", "surface-raised"] as const;

function Sample({ className, label, sub }: { className: string; label: string; sub: string }) {
  return (
    <div className={`flex h-32 flex-col justify-end rounded-lg bg-surface p-4 ${className}`}>
      <p className="t-label text-ink">{label}</p>
      <p className="t-mono text-ink-muted">{sub}</p>
    </div>
  );
}

export function Elevation() {
  return (
    <div>
      <PageHeader title="奥行き" lead="面は 1px の線で区切ります。影は浮いているものにだけ使い、段階は 3 つです。" />

      <Section id="rule" title="結論">
        <div className="prose t-body text-ink">
          <p>
            ページの上にあるものは境界線で区切り、ページから浮くものだけに影を付けます。影は黒ではなく文字色（ink）を薄くした色で、上から光が当たるように縦方向にだけずらします。ダーク背景では影が見えないので、面を段階的に明るくして高さを表します。
          </p>
        </div>
        <CodeBlock
          className="mt-6 max-w-[65ch]"
          code={"--ds-shadow-1: none;                     /* 1px solid var(--ds-hairline) */\n--ds-shadow-2: 0 4px 12px -2px rgb(10 10 10 / 0.08);\n--ds-shadow-3: 0 16px 48px -12px rgb(10 10 10 / 0.18);"}
        />
      </Section>

      <Section id="levels" title="3 段階" lead="右上のテーマ切替でダークにすると、影の代わりに面の明るさが変わるのが分かります。">
        <div className="grid gap-6 rounded-lg bg-canvas-soft p-6 sm:p-8 md:grid-cols-3">
          <Sample className="border border-hairline" label="Level 1" sub="border" />
          <Sample className="border border-hairline shadow-2" label="Level 2" sub="border + shadow-2" />
          <Sample className="border border-hairline shadow-3" label="Level 3" sub="border + shadow-3" />
        </div>
        <Table
          className="mt-8"
          columns={[
            { key: "level", header: "段階", render: (r) => r.level },
            { key: "treatment", header: "表現", render: (r) => <code>{r.treatment}</code> },
            { key: "use", header: "使う場所", wrap: true, render: (r) => r.use },
          ]}
          rows={levels}
          rowKey={(r) => r.level}
        />
      </Section>

      <Section id="border-vs-shadow" title="境界線か影か" lead="同じカードを 2 通りで組みました。左が AwesomeDS の既定です。">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg bg-canvas-soft p-6 sm:p-8">
            <div className="rounded-lg border border-hairline bg-surface p-6">
              <p className="t-h4 text-ink">今月の請求</p>
              <p className="t-body-sm mt-1 text-ink-secondary">3 件、合計 1,677,800 円</p>
              <div className="mt-4">
                <Button variant="secondary" size="sm">
                  明細を見る
                </Button>
              </div>
            </div>
            <p className="t-caption mt-4 text-ink-secondary">境界線 1px。輪郭が 1 本の線で決まり、中身の文字だけが目に入ります。</p>
          </div>
          <div className="rounded-lg bg-canvas-soft p-6 sm:p-8">
            <div className="rounded-lg bg-surface p-6" style={{ boxShadow: "0 8px 24px rgb(0 0 0 / 0.25)" }}>
              <p className="t-h4 text-ink">今月の請求</p>
              <p className="t-body-sm mt-1 text-ink-secondary">3 件、合計 1,677,800 円</p>
              <div className="mt-4">
                <Button variant="secondary" size="sm">
                  明細を見る
                </Button>
              </div>
            </div>
            <p className="t-caption mt-4 text-ink-secondary">避ける: 黒い影。ページの上にあるだけのカードが浮いて見え、背景が灰色に濁ります。</p>
          </div>
        </div>
      </Section>

      <Section id="tint" title="影の色" lead="影は ink を薄めた色です。純粋な黒を使うと、白い背景では灰色の縁取りに見えます。">
        <div className="grid gap-6 rounded-lg bg-canvas-soft p-6 sm:p-8 md:grid-cols-2">
          <div>
            <div className="h-24 rounded-lg border border-hairline bg-surface shadow-3" />
            <p className="t-mono mt-3 text-ink-secondary">rgb(10 10 10 / 0.18), y 16px, spread -12px</p>
          </div>
          <div>
            <div className="h-24 rounded-lg border border-hairline bg-surface" style={{ boxShadow: "0 16px 48px rgb(0 0 0 / 0.5)" }} />
            <p className="t-mono mt-3 text-ink-secondary">避ける: rgb(0 0 0 / 0.5), spread 0</p>
          </div>
        </div>
      </Section>

      <Section id="dark" title="ダークモードの高さ" lead="黒に近い背景では影のコントラストが出ません。面を 1 段ごとに少し明るくし、区切り線を強めます。">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {darkLadder.map((role, i) => (
            <div key={role} className="flex flex-col gap-2">
              <div
                className="flex h-20 items-end rounded-md border p-3"
                style={{ background: colorValue("dark", role), borderColor: colorValue("dark", i === 0 ? "hairline" : "hairline") }}
              >
                <span className="t-caption" style={{ color: colorValue("dark", "ink-secondary") }}>
                  {i}
                </span>
              </div>
              <span className="t-mono text-ink">{role}</span>
              <span className="t-caption text-ink-muted">{colorValue("dark", role)}</span>
            </div>
          ))}
        </div>
      </Section>

      <Why>
        <p>
          影は柔らかい縁を持つため、目がそれを解像するコストがかかります。1px の線は 1 本の輪郭で済みます。Nielsen Norman Group
          の「美的で最小限のデザイン」は、余分な要素が本来必要な要素と競合すると述べています。
        </p>
        <p>
          計測した現場でも同じです。Linear は面の明るさの段階と細い線だけで奥行きを作り、Vercel のカードは細い線と弱い光沢で置かれ、Apple
          のマーケティングページの枠には影がありません。カードごとの重い影は、いまではテンプレート UI の印になっています。
        </p>
        <p>
          3 段階にするのは、「ページの上」「ページより上」「すべての上」の 3 つを区別できれば足りるからです。Material 3 は 6 段階を定義しますが、利用者が見分けられる差は
          3 つまでで、4 つ目の段階には控えめに見せられる視覚差が残っていません。
        </p>
        <p>
          ダーク背景で面を明るくする方法は Material のダークテーマと Apple のダークモードが共に採用しています。Apple
          は「高い面ほど明るくなり、前景が前に出て見える」と説明しています。AwesomeDS は Material のようにオーバーレイをブランド色で着色しません。純粋なグレーの規則を守り、ブランドのアクセントと衝突させないためです。
        </p>
      </Why>

      <SourceList
        sources={[
          { title: "Material 3: Elevation", url: "https://m3.material.io/styles/elevation/overview", note: "ダークテーマでのトーナルな高さ表現" },
          { title: "Apple HIG: Dark Mode", url: "https://developer.apple.com/design/human-interface-guidelines/dark-mode", note: "base と elevated の背景色" },
          { title: "Josh W. Comeau: Designing Beautiful Shadows in CSS", url: "https://www.joshwcomeau.com/css/designing-shadows/", note: "色付きの影、光源の方向、描画コスト" },
          { title: "NN/g: Aesthetic and Minimalist Design", url: "https://www.nngroup.com/articles/aesthetic-minimalist-design/", note: "余分な要素は必要な要素と競合する" },
          { title: "NN/g: Common Region", url: "https://www.nngroup.com/articles/common-region/", note: "境界があればまとまりは伝わる" },
          { title: "voltagent/awesome-design-md", url: "https://github.com/voltagent/awesome-design-md", note: "Linear、Vercel、Apple、Stripe の影の実測" },
        ]}
      />
    </div>
  );
}
