import { Link } from "../i18n/router";
import { PageHeader, Section } from "../layout/Page";
import { CodeBlock } from "../layout/Preview";
import { Table } from "../ds/components/Table";
import { repoUrl } from "../lib/nav";

const dirs = [
  { dir: "AwesomeDS/", body: "デザインシステムの正本。DESIGN.md、tokens（CSS、Tailwind v4 テーマ、W3C DTCG JSON、アクセント / 角丸 / 書体の代替）、foundations（24 の観点の理由と出典）、components、CHANGELOG。" },
  { dir: "AwesomeDS/data/", body: "実測データ。261 社のブランド配色、24 の選定パレット、34 書体と使用数、23 層のスタック、OSS ランキング。scripts/ が生成し、CI が検証、毎週月曜に自動更新。" },
  { dir: "Knowledge/", body: "参考にしたスキル、OSS、デザインシステム、ガイドライン、記事の要約。カテゴリ別のフォルダに Markdown で置き、frontmatter に出典 URL を持ちます。" },
  { dir: "Reference/", body: "Knowledge が参照した外部リンクの一覧。scripts/build-reference.mjs が frontmatter から生成します。" },
  { dir: "Plugin/awesome-ds/", body: "Claude Code プラグイン。5 つのスキル、Cursor 用ルール、AwesomeDS の同期コピー、キャプチャと監査のスクリプト。" },
  { dir: "web/", body: "このサイト。Vite、React、Tailwind v4。48 部品と 35 デモはサイトの実装そのもの。全ルートを Playwright で描画し、エラーとはみ出しがないことを CI が確認します。" },
];

const skills = [
  { name: "awesome-ds", what: "開発中の UI に AwesomeDS を適用する。トークンを配線し、shadcn/ui を再スタイルし、出荷前チェックリストを通す。", how: "UI を作る指示で自動的に使われる。明示するなら /awesome-ds:awesome-ds" },
  { name: "ds-creator", what: "1 問ずつ聞き取りながら、AwesomeDS を土台にそのプロダクト専用の DESIGN.md、tokens、preview.html を作る。", how: "/awesome-ds:ds-creator <プロダクト名>" },
  { name: "design-verifier", what: "390、768、1280 幅とライト、ダークでキャプチャを撮り、DS 準拠、ブランド反映、人にとっての使いやすさを採点する。", how: "/awesome-ds:design-verifier <URL>" },
  { name: "design-thinking", what: "ペルソナ、ユーザーストーリー、ジャーニーマップ、ページフロー、画面ウォークスルーで UX を設計し直す。", how: "/awesome-ds:design-thinking <機能名>" },
  { name: "knowledge-curator", what: "Knowledge にエントリを追加し、Reference を再生成し、AwesomeDS への変更を CHANGELOG 付きで提案する。", how: "/awesome-ds:knowledge-curator（毎週のリサーチ用）" },
];

export function About() {
  return (
    <div>
      <PageHeader
        title="このサイトについて"
        lead="AwesomeDS は GitHub リポジトリを正本とし、このサイトはその内容を人が読める形で表示しています。ここではリポジトリの構成、プラグインの入れ方、更新の流れを説明します。"
      />

      <Section id="structure" title="リポジトリの構成">
        <dl className="divide-y divide-hairline border-y border-hairline">
          {dirs.map((d) => (
            <div key={d.dir} className="grid gap-1 py-4 sm:grid-cols-[12rem_1fr] sm:gap-6">
              <dt className="t-mono text-ink">{d.dir}</dt>
              <dd className="t-body-sm text-ink-secondary">{d.body}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section id="install" title="プラグインの入れ方">
        <div className="flex flex-col gap-8">
          <div>
            <h3 className="t-h4 text-ink">Claude Code</h3>
            <CodeBlock className="mt-3 max-w-[65ch]" code={"/plugin marketplace add Yu-aimaker/Awesome-Design-Systems-Claude\n/plugin install awesome-ds@awesome-design-systems"} />
            <p className="t-body-sm mt-3 max-w-[65ch] text-ink-secondary">
              リポジトリを clone してローカルで試すときは <code>claude --plugin-dir ./Plugin/awesome-ds</code> を使います。
            </p>
          </div>
          <div>
            <h3 className="t-h4 text-ink">Cursor</h3>
            <CodeBlock className="mt-3 max-w-[65ch]" code={"cp Plugin/awesome-ds/cursor/*.mdc .cursor/rules/"} />
            <p className="t-body-sm mt-3 max-w-[65ch] text-ink-secondary">
              スキルの要点を Cursor のルール形式に写したものです。tsx、css、html を編集するときに参照されます。
            </p>
          </div>
        </div>
      </Section>

      <Section id="skills" title="スキル">
        <Table
          columns={[
            { key: "name", header: "スキル", render: (r) => <code>{r.name}</code> },
            { key: "what", header: "何をするか", wrap: true, render: (r) => r.what },
            { key: "how", header: "呼び方", wrap: true, render: (r) => <span className="t-mono">{r.how}</span> },
          ]}
          rows={skills}
          rowKey={(r) => r.name}
        />
      </Section>

      <Section id="update" title="更新の流れ" lead="AwesomeDS は固定の仕様ではなく、毎週の調査で育てます。">
        <ol className="prose t-body list-decimal pl-6 text-ink">
          <li>毎週月曜に GitHub Actions が「Weekly research」Issue を開きます。確認先は shadcn/ui、Radix、Motion、GSAP、Tailwind、Apple HIG、Material、WCAG、新しいデザインシステムです。</li>
          <li>
            <code>knowledge-curator</code> スキルで新しい知見を Knowledge に追加し、<code>node scripts/build-reference.mjs</code> で Reference と Knowledge の索引を再生成します。
          </li>
          <li>AwesomeDS を変える根拠が出たら DESIGN.md、tokens、foundations を更新し、CHANGELOG にバージョンを追記します。値の変更は minor、誤記は patch、役割の追加削除は major です。</li>
          <li>プラグイン内のコピーを同期して PR を出します。CI が Reference の再生成、プラグインの同期、このサイトのビルドを確認します。</li>
        </ol>
      </Section>

      <Section id="links" title="関連リンク">
        <ul className="t-body flex flex-col gap-2 text-ink">
          <li>
            <a href={repoUrl} target="_blank" rel="noreferrer">
              GitHub リポジトリ
            </a>
          </li>
          <li>
            <a href={`${repoUrl}/blob/main/AwesomeDS/DESIGN.md`} target="_blank" rel="noreferrer">
              AwesomeDS/DESIGN.md
            </a>
          </li>
          <li>
            <a href={`${repoUrl}/blob/main/AwesomeDS/CHANGELOG.md`} target="_blank" rel="noreferrer">
              CHANGELOG
            </a>
          </li>
          <li>
            <Link to="/knowledge">ナレッジ</Link>、<Link to="/sources">ガイドライン・出典</Link>
          </li>
        </ul>
      </Section>
    </div>
  );
}
