import { PageHeader, Prose } from "../layout/Page";
import { CodeBlock } from "../layout/Preview";
import { repoUrl } from "../lib/nav";

export function About() {
  return (
    <div>
      <PageHeader title="このリポジトリについて" />
      <Prose>
        <ul>
          <li><code>AwesomeDS/</code> デザインシステム本体。DESIGN.md、tokens、foundations、components。</li>
          <li><code>Knowledge/</code> 調査ノート。frontmatter にソース URL を持つ Markdown。</li>
          <li><code>Reference/</code> 参照資料。</li>
          <li><code>Plugin/</code> Claude Code プラグインのスキルとコマンド。</li>
          <li><code>web/</code> このサイト。</li>
        </ul>
        <p>インストール:</p>
      </Prose>
      <CodeBlock className="mt-4 max-w-[65ch]" code="/plugin marketplace add Yu-aimaker/Awesome-Design-Systems-Claude" />
      <Prose className="mt-8">
        <p>Knowledge は週 1 回の調査で更新されます。</p>
        <p>
          <a href={repoUrl} target="_blank" rel="noreferrer">GitHub リポジトリ</a>
        </p>
      </Prose>
    </div>
  );
}
