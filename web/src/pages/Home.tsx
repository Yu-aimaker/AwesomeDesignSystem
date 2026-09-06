import { useState } from "react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "../ds/components/Button";
import { Input } from "../ds/components/Input";
import { Card, CardDescription, CardTitle } from "../ds/components/Card";
import { Badge } from "../ds/components/Badge";
import { Switch } from "../ds/components/Switch";
import { CodeBlock } from "../layout/Preview";
import { tokens } from "../lib/tokens";

const links = [
  { to: "/foundations/typography", label: "システム", body: "文字、色、余白、角丸、影、動き。値と理由。" },
  { to: "/components", label: "コンポーネント", body: "トークンだけで組んだ部品の一覧。実装コード付き。" },
  { to: "/knowledge", label: "ナレッジ", body: "調査で集めた根拠。毎週更新。" },
];

const cheatSheet: Array<[string, string]> = [
  ["canvas / ink", `${tokens.color.light.canvas.$value} / ${tokens.color.light.ink.$value}`],
  ["accent", `${tokens.color.light.accent.$value}（リンク、フォーカス、選択のみ）`],
  ["sans / mono", "Geist + Noto Sans JP / Geist Mono"],
  ["body", `${tokens.font.size.base.$value} / ${tokens.font.lineHeight.body.$value}（日本語 ${tokens.font.lineHeight["body-ja"].$value}）`],
  ["space", "4 8 12 16 24 32 48 64 96"],
  ["radius", `${tokens.radius.md.$value} 操作部 / ${tokens.radius.lg.$value} カード / ${tokens.radius.xl.$value} ダイアログ`],
  ["motion", `${tokens.duration.base.$value} cubic-bezier(${tokens.easing.out.$value.join(", ")})`],
];

export function Home() {
  const [notify, setNotify] = useState(true);
  return (
    <div>
      <section className="max-w-[65ch]">
        <h1 className="t-h1 text-ink">AwesomeDS</h1>
        <p className="t-body-lg mt-4 text-ink-secondary">
          白いキャンバスに黒い文字、アクセントは 1 色。Claude Code が UI を生成するときの既定のデザインシステムです。
          このサイトは、その値がなぜそうなっているかを説明し、実物を触って確かめるための場所です。
        </p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-3">
          {links.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                className="group flex h-full flex-col rounded-lg border border-hairline bg-surface p-4 text-ink no-underline transition-colors duration-instant ease-out-ds hover:border-hairline-strong hover:bg-canvas-soft"
              >
                <span className="t-label flex items-center justify-between">
                  {l.label}
                  <ArrowRight className="size-4 text-ink-muted transition-transform duration-fast ease-out-ds group-hover:translate-x-1" strokeWidth={1.75} aria-hidden />
                </span>
                <span className="t-caption mt-1 text-ink-secondary">{l.body}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="specimen-title" className="mt-16">
        <h2 id="specimen-title" className="t-h2 text-ink">
          トークンの見本
        </h2>
        <p className="t-body mt-3 max-w-[65ch] text-ink-secondary">
          下のカードは飾りではなく、実際のコンポーネントです。色、角丸、余白、書体、動きはすべて tokens.css の値を参照しています。
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
                <Button variant="ghost">
                  請求履歴を見る
                </Button>
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
              出典: <code>AwesomeDS/tokens/tokens.json</code>。詳しい理由は各ファウンデーションのページにあります。
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="install-title" className="mt-16 max-w-[65ch]">
        <h2 id="install-title" className="t-h2 text-ink">
          Claude Code で使う
        </h2>
        <p className="t-body mt-3 text-ink-secondary">
          プラグインを追加すると、Claude Code が UI を書くときにこのシステムの値と規則を参照します。
        </p>
        <CodeBlock className="mt-6" code="/plugin marketplace add Yu-aimaker/Awesome-Design-Systems-Claude" />
        <p className="t-body-sm mt-3 text-ink-secondary">
          仕組みと更新頻度は <Link to="/about">このリポジトリについて</Link> に書いています。
        </p>
      </section>
    </div>
  );
}
