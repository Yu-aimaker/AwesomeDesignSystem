import { useState } from "react";
import { Link } from "react-router";
import { MotionConfig } from "motion/react";
import { PageHeader, Section, SourceList, Why } from "../../layout/Page";
import { CodeBlock } from "../../layout/Preview";
import { Table } from "../../ds/components/Table";
import { Button } from "../../ds/components/Button";
import { Switch } from "../../ds/components/Switch";
import { SpringDragDemo } from "../../demos/MotionDemos";
import { durations, easings, tokens } from "../../lib/tokens";

const durationUse: Record<string, string> = {
  instant: "ホバーの色、フォーカスリング",
  fast: "小さな移動。チェック、スイッチのつまみ、タブの下線",
  base: "入りの既定。ポップオーバー、ドロップダウン、ツールチップ、トースト",
  slow: "ダイアログ、シート、セクションの表示",
  slower: "ページ全体の遷移。まれ",
};

const easingUse: Record<string, string> = {
  out: "入りと、ユーザー操作への応答すべて",
  in: "出だけ。対応する入りより短く",
  "in-out": "画面内の別の位置へ移動する要素",
};

const curves = [
  { name: "ease-out (token)", value: "var(--ds-ease-out)", note: "すぐ動き、静かに止まる" },
  { name: "ease (CSS 既定)", value: "ease", note: "出だしが遅れて 200ms が 250ms に感じる" },
  { name: "linear", value: "linear", note: "機械的。進捗バー以外では使わない" },
];

const libraries = [
  { tool: "CSS transition / animation", when: "色、不透明度、8px までの移動、開閉", not: "連続した物理挙動、スクロール連動のピン留め" },
  { tool: "Motion (motion/react)", when: "React の要素の出入り、layout の並べ替え、ドラッグ、スプリング", not: "スクロールに合わせた長いシーケンス" },
  { tool: "GSAP ScrollTrigger", when: "ピン留め、スクラブ、複数要素のタイムライン", not: "ホバーやクリックの応答。CSS で足りる" },
  { tool: "Lottie / dotLottie", when: "デザイナーが After Effects で作ったイラストの再生", not: "UI 部品の状態遷移" },
  { tool: "three.js (react-three-fiber)", when: "3D がプロダクトの主題のとき", not: "装飾。描画コストが最も高い" },
];

function HoverDemo() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <div className="flex flex-col gap-2">
        <Button variant="secondary">100ms で色が変わる</Button>
        <span className="t-caption text-ink-secondary">duration-instant, ease-out</span>
      </div>
      <div className="flex flex-col gap-2">
        <button
          type="button"
          className="t-label h-10 rounded-md border border-hairline-strong bg-surface px-4 text-ink hover:bg-surface-sunken"
          style={{ transition: "background-color 600ms ease" }}
        >
          600ms で色が変わる
        </button>
        <span className="t-caption text-ink-secondary">避ける: 押した感触より遅れて色が追いつく</span>
      </div>
    </div>
  );
}

function AsymmetryDemo() {
  const [openA, setOpenA] = useState(true);
  const [openB, setOpenB] = useState(true);
  const panel = "rounded-lg border border-hairline bg-surface p-4 text-sm text-ink";
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <Button variant="secondary" size="sm" onClick={() => setOpenA((v) => !v)}>
          {openA ? "閉じる" : "開く"}
        </Button>
        <div
          className={`${panel} mt-3`}
          style={{
            opacity: openA ? 1 : 0,
            transform: openA ? "none" : "translateY(4px)",
            transition: openA
              ? `opacity ${tokens.duration.base.$value} var(--ds-ease-out), transform ${tokens.duration.base.$value} var(--ds-ease-out)`
              : `opacity 130ms var(--ds-ease-in), transform 130ms var(--ds-ease-in)`,
          }}
        >
          入り 200ms ease-out、出 130ms ease-in。移動は 4px。
        </div>
        <p className="t-caption mt-3 text-ink-secondary">AwesomeDS の既定。出は入りの 3 分の 2 の長さです。</p>
      </div>
      <div>
        <Button variant="secondary" size="sm" onClick={() => setOpenB((v) => !v)}>
          {openB ? "閉じる" : "開く"}
        </Button>
        <div
          className={`${panel} mt-3`}
          style={{
            opacity: openB ? 1 : 0,
            transform: openB ? "none" : "translateY(24px) scale(0.8)",
            transition: "opacity 500ms ease, transform 500ms ease",
          }}
        >
          入りも出も 500ms ease。移動は 24px、拡大は 0.8 から。
        </div>
        <p className="t-caption mt-3 text-ink-secondary">避ける: 出が遅いと次の操作を待たせます。24px の移動は物が飛んでくるように見えます。</p>
      </div>
    </div>
  );
}

function EasingDemo() {
  const [key, setKey] = useState(0);
  return (
    <div>
      <Button variant="secondary" size="sm" onClick={() => setKey((k) => k + 1)}>
        再生
      </Button>
      <div key={key} className="mt-4 grid gap-4 md:grid-cols-3">
        {curves.map((c) => (
          <div key={c.name} className="rounded-lg border border-hairline bg-surface p-4">
            <p className="t-mono text-ink">{c.name}</p>
            <div className="mt-4 h-10 w-full rounded-md bg-surface-sunken" style={{ containerType: "inline-size" }}>
              <div className="h-10 w-10 rounded-md bg-primary" style={{ animation: `demo-slide 800ms ${c.value} both` }} />
            </div>
            <p className="t-caption mt-3 text-ink-secondary">{c.note}</p>
          </div>
        ))}
      </div>
      <style>{`@keyframes demo-slide { from { transform: translateX(0); } to { transform: translateX(calc(100cqw - 100%)); } }`}</style>
    </div>
  );
}

export function Motion() {
  const [reduced, setReduced] = useState(false);
  return (
    <MotionConfig reducedMotion={reduced ? "always" : "user"}>
      <div data-reduced-motion={reduced ? "true" : undefined}>
        <PageHeader title="モーション" lead="動きは操作への応答です。短く、ease-out で、移動は数ピクセル。いつでも止められるようにします。" />

        <Section id="rule" title="結論">
          <div className="prose t-body text-ink">
            <p>
              入りは 200ms、<code>cubic-bezier(0.16, 1, 0.3, 1)</code> で、4 から 8px だけ動かします。出は入りより短く、ease-in
              にします。ドラッグやジェスチャにはスプリングを使い、ループする動きは進捗表示以外に置きません。<code>prefers-reduced-motion</code>{" "}
              では移動を止め、不透明度の変化だけを残します。
            </p>
          </div>
          <CodeBlock
            className="mt-6 max-w-[65ch]"
            code={"--ds-duration-instant: 100ms;\n--ds-duration-fast: 150ms;\n--ds-duration-base: 200ms;\n--ds-duration-slow: 300ms;\n--ds-duration-slower: 500ms;\n--ds-ease-out: cubic-bezier(0.16, 1, 0.3, 1);\n--ds-ease-in: cubic-bezier(0.7, 0, 0.84, 0);\n/* spring: stiffness 400 / damping 30 (gesture), 170 / 26 (layout) */"}
          />
        </Section>

        <Section id="tokens" title="トークン">
          <Table
            columns={[
              { key: "name", header: "duration", render: (r) => <code>{r.name}</code> },
              { key: "value", header: "値", align: "right", render: (r) => r.value },
              { key: "use", header: "使う場所", wrap: true, render: (r) => durationUse[r.name] ?? "" },
            ]}
            rows={durations}
            rowKey={(r) => r.name}
          />
          <Table
            className="mt-4"
            columns={[
              { key: "name", header: "easing", render: (r) => <code>{r.name}</code> },
              { key: "css", header: "値", render: (r) => <code>{r.css}</code> },
              { key: "use", header: "使う場所", wrap: true, render: (r) => easingUse[r.name] ?? "" },
            ]}
            rows={easings}
            rowKey={(r) => r.name}
          />
        </Section>

        <Section id="reduced" title="動きを減らす" lead="OS の設定に従うのが既定です。ここではページ内の動きだけを切り替えて、違いを確かめられます。">
          <Switch label="このページのモーションを減らす" checked={reduced} onChange={setReduced} />
        </Section>

        <Section id="hover" title="ホバーは 100ms" lead="色の変化は押した感触の一部です。長いと、応答が遅れたように感じます。">
          <HoverDemo />
        </Section>

        <Section id="easing" title="イージングの比較" lead="同じ 800ms で 3 つの曲線を並べました。実際の UI では 200ms ですが、違いを見るために長くしています。">
          <EasingDemo />
        </Section>

        <Section id="asymmetry" title="入りと出、距離" lead="入りは見せる動き、出は片付ける動きです。出は短く、移動は 8px までにします。">
          <AsymmetryDemo />
        </Section>

        <Section id="spring" title="スプリング" lead="ドラッグには時間ではなくスプリングを使います。放した瞬間の速度を引き継いで止まるからです。stiffness 400、damping 30。">
          <SpringDragDemo />
        </Section>

        <Section id="libraries" title="ライブラリの選び方" lead="上から順に検討し、下に行くほど理由が要ります。プロダクト内で Motion と GSAP を同じ要素に混ぜません。">
          <Table
            columns={[
              { key: "tool", header: "手段", render: (r) => r.tool },
              { key: "when", header: "使うとき", wrap: true, render: (r) => r.when },
              { key: "not", header: "使わないとき", wrap: true, render: (r) => r.not },
            ]}
            rows={libraries}
            rowKey={(r) => r.tool}
          />
          <p className="t-body-sm mt-4 text-ink-secondary">
            それぞれの動くサンプルは <Link to="/animation">アニメーション</Link> のページにあります。
          </p>
        </Section>

        <Why>
          <p>
            Nielsen Norman Group の応答時間の研究では、0.1 秒以下は即時、1 秒以下なら思考の流れが途切れません。UI のアニメーションは 100 から 500ms
            に収め、単純なフィードバックは 100ms 付近にする、というのが同グループの目安です。Emil Kowalski はクリック後のモーダルは 200ms
            以内に出し、出は入りより速くするよう勧めています。利用者はすでに次の操作を待っているからです。
          </p>
          <p>
            ease-out は最初に速く動いて静かに止まります。応答がすぐ見え、終わりが落ち着きます。CSS 既定の <code>ease</code>{" "}
            はほぼ対称で出だしが遅れ、誰も曲線を選んでいない印になります。<code>linear</code>{" "}
            は加速がなく機械的に見えるため、一定速度そのものが意味を持つ進捗バーだけに使います。Material 3 の emphasized decelerate
            も同じ考え方です。
          </p>
          <p>
            移動は 4 から 8px で方向が伝わります。24px 以上は物が飛んでくるように見え、目を中身から引き離し、長い時間を要します。拡大は 0.98
            から始めると要素の正体が終始分かります。0.8 からの「ポップ」はテンプレート UI の印です。
          </p>
          <p>
            <code>prefers-reduced-motion</code> は WCAG 2.3.3 の対象で、動きで体調を崩す利用者のための設定です。移動と拡大を止め、不透明度だけ残すと、状態の変化は伝わったまま揺れがなくなります。
          </p>
        </Why>

        <SourceList
          sources={[
            { title: "NN/g: Executing UX Animations: Duration and Motion Characteristics", url: "https://www.nngroup.com/articles/animation-duration/", note: "100 から 500ms の目安" },
            { title: "NN/g: Response Times: The 3 Important Limits", url: "https://www.nngroup.com/articles/response-times-3-important-limits/", note: "0.1 秒、1 秒、10 秒" },
            { title: "Emil Kowalski: Great Animations", url: "https://emilkowal.ski/ui/great-animations", note: "ease-out の既定、200ms、出は速く" },
            { title: "Material 3: Easing and duration", url: "https://m3.material.io/styles/motion/easing-and-duration", note: "emphasized と standard の曲線" },
            { title: "Apple HIG: Motion", url: "https://developer.apple.com/design/human-interface-guidelines/motion", note: "目的のある動き、Reduce Motion" },
            { title: "MDN: prefers-reduced-motion", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion", note: "メディア特性" },
            { title: "Motion: Transitions", url: "https://motion.dev/docs/react-transitions", note: "spring の stiffness と damping" },
            { title: "GSAP: ScrollTrigger", url: "https://gsap.com/docs/v3/Plugins/ScrollTrigger/", note: "pin と scrub" },
          ]}
        />
      </div>
    </MotionConfig>
  );
}
