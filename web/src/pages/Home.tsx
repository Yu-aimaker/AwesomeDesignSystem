import { useState } from "react";
import { Link } from "react-router";
import { Button } from "../ds/components/Button";
import { Input } from "../ds/components/Input";
import { Card, CardDescription, CardTitle } from "../ds/components/Card";
import { Badge } from "../ds/components/Badge";
import { Switch } from "../ds/components/Switch";
import { CodeBlock } from "../layout/Preview";
import { tokens } from "../lib/tokens";

const light = tokens.color.light;

const facts: Array<{ term: string; body: string; to: string }> = [
  {
    term: "文字",
    body: `Geist と Noto Sans JP。本文 ${tokens.font.size.base.$value}、行間 ${tokens.font.lineHeight.body.$value}（日本語 ${tokens.font.lineHeight["body-ja"].$value}）。見出しは太さと大きさだけで階層を作ります。`,
    to: "/foundations/typography",
  },
  {
    term: "色",
    body: `白地 ${light.canvas.$value}、黒 ${light.ink.$value}。アクセント ${light.accent.$value} はリンク、フォーカス、選択にだけ使い、主ボタンは黒地に白文字です。`,
    to: "/foundations/color",
  },
  {
    term: "余白と形",
    body: `4px 単位。角丸は操作部品 ${tokens.radius.md.$value}、カード ${tokens.radius.lg.$value}、ダイアログ ${tokens.radius.xl.$value}。区切りは 1px の線で、影は浮いているものにだけ使います。`,
    to: "/foundations/spacing",
  },
  {
    term: "動き",
    body: `${tokens.duration.fast.$value} から ${tokens.duration.base.$value}、cubic-bezier(${tokens.easing.out.$value.join(", ")})。移動は 4 から 8px。ユーザーの操作への応答にだけ動かします。`,
    to: "/foundations/motion",
  },
];

const cheatSheet: Array<[string, string]> = [
  ["canvas / ink", `${light.canvas.$value} / ${light.ink.$value}`],
  ["secondary / muted", `${light["ink-secondary"].$value} / ${light["ink-muted"].$value}`],
  ["accent", `${light.accent.$value}`],
  ["hairline / input", `${light.hairline.$value} / ${light["hairline-strong"].$value}`],
  ["sans / mono", "Geist + Noto Sans JP / Geist Mono"],
  ["body", `${tokens.font.size.base.$value} / ${tokens.font.lineHeight.body.$value}（ja ${tokens.font.lineHeight["body-ja"].$value}）`],
  ["space", "4 8 12 16 24 32 48 64 96"],
  ["radius", `${tokens.radius.md.$value} / ${tokens.radius.lg.$value} / ${tokens.radius.xl.$value}`],
  ["motion", `${tokens.duration.base.$value} cubic-bezier(${tokens.easing.out.$value.join(", ")})`],
];

export function Home() {
  const [notify, setNotify] = useState(true);
  return (
    <div>
      <section className="max-w-[65ch]">
        <h1 className="t-h1 text-ink">AwesomeDS</h1>
        <p className="t-body-lg mt-4 text-ink-secondary">
          ブランドをまだ持たないプロダクトが、そのまま使えるデザインシステムです。白地に黒文字、アクセント 1
          色、Geist と Noto Sans JP、4px の余白単位。値にはすべて理由と出典があります。
        </p>
        <p className="t-body mt-4 text-ink-secondary">
          Claude Code や Cursor が UI を書くときの既定値として使うために作りました。このサイト自身も同じトークンだけで組んでいます。
        </p>
      </section>

      <section aria-labelledby="specimen-title" className="mt-16">
        <h2 id="specimen-title" className="t-h2 text-ink">
          実物
        </h2>
        <p className="t-body mt-3 max-w-[65ch] text-ink-secondary">
          下のフォームは飾りではなく、実際に動くコンポーネントです。右上のテーマ切替でライトとダークを行き来し、余白、角丸、フォーカスリング、ボタンの状態を確かめてください。
        </p>
        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <Card>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle>請求先の設定</CardTitle>
                <CardDescription>毎月 1 日に登録メールへ請求書を送ります。</CardDescription>
              </div>
              <Badge tone="success">有効</Badge>
            </div>
            <form className="mt-6 flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
              <Input label="請求書の送付先" type="email" placeholder="billing@example.co.jp" helper="複数の宛先はカンマで区切ります。" />
              <Switch label="支払い完了時に通知する" checked={notify} onChange={setNotify} />
              <div className="flex flex-wrap gap-2 pt-2">
                <Button type="submit">保存</Button>
                <Button variant="secondary">キャンセル</Button>
                <Button variant="ghost">請求履歴を見る</Button>
              </div>
            </form>
          </Card>
          <div className="rounded-lg border border-hairline bg-canvas-soft p-6">
            <h3 className="t-h4 text-ink">早見表</h3>
            <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
              {cheatSheet.map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="t-mono text-ink-muted">{k}</dt>
                  <dd className="t-mono text-ink">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="t-caption mt-4 text-ink-muted">
              出典: <code>AwesomeDS/tokens/tokens.json</code>
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="facts-title" className="mt-16 max-w-[65ch]">
        <h2 id="facts-title" className="t-h2 text-ink">
          要点
        </h2>
        <dl className="mt-6 divide-y divide-hairline border-y border-hairline">
          {facts.map((f) => (
            <div key={f.term} className="grid gap-1 py-5 sm:grid-cols-[7rem_1fr] sm:gap-6">
              <dt className="t-label text-ink">
                <Link to={f.to} className="text-ink no-underline hover:underline">
                  {f.term}
                </Link>
              </dt>
              <dd className="t-body-sm text-ink-secondary">{f.body}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="install-title" className="mt-16 max-w-[65ch]">
        <h2 id="install-title" className="t-h2 text-ink">
          使い方
        </h2>
        <ol className="mt-6 flex flex-col gap-8">
          <li>
            <h3 className="t-h4 text-ink">1. Claude Code に入れる</h3>
            <p className="t-body-sm mt-2 text-ink-secondary">
              マーケットプレイスを追加してプラグインを入れると、UI を書く指示のたびにこのシステムの値と規則が参照されます。ブランド専用の
              DS を作る、デザインを検証する、UX を設計するスキルも同じプラグインに入っています。
            </p>
            <CodeBlock className="mt-3" code={"/plugin marketplace add Yu-aimaker/Awesome-Design-Systems-Claude\n/plugin install awesome-ds@awesome-design-systems"} />
          </li>
          <li>
            <h3 className="t-h4 text-ink">2. プラグインなしで使う</h3>
            <p className="t-body-sm mt-2 text-ink-secondary">
              <code>AwesomeDS/DESIGN.md</code> をプロジェクトの直下に置き、<code>tokens/tokens.css</code>{" "}
              を読み込みます。Tailwind v4 なら <code>tokens/tailwind.css</code> も読み込むと <code>bg-canvas</code> や{" "}
              <code>text-ink</code> のようなクラスが使えます。
            </p>
            <CodeBlock className="mt-3" code={'@import "tailwindcss";\n@import "./AwesomeDS/tokens/tokens.css";\n@import "./AwesomeDS/tokens/tailwind.css";'} />
          </li>
        </ol>
        <p className="t-body-sm mt-8 text-ink-secondary">
          スキルの一覧と更新の流れは <Link to="/about">このサイトについて</Link> にあります。部品は{" "}
          <Link to="/components">コンポーネント</Link>、動きのライブラリは <Link to="/animation">アニメーション</Link>
          、根拠は <Link to="/knowledge">ナレッジ</Link> を見てください。
        </p>
      </section>
    </div>
  );
}
