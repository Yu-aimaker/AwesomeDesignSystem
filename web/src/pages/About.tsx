import { Link } from "../i18n/router";
import { PageHeader, Section } from "../layout/Page";
import { CodeBlock } from "../layout/Preview";
import { Table } from "../ds/components/Table";
import { repoUrl } from "../lib/nav";
import { useT } from "../i18n/context";
import { aboutMessages } from "../i18n/messages/about";

const dirs = ["AwesomeDS/", "AwesomeDS/data/", "Knowledge/", "Reference/", "Plugin/awesome-ds/", "web/"] as const;
const skillNames = ["awesome-ds", "ds-creator", "design-verifier", "design-thinking", "knowledge-curator", "html-report", "slides"] as const;

export function About() {
  const t = useT(aboutMessages);
  const skills = skillNames.map((name) => ({ name, ...t.skillRows[name] }));
  return (
    <div>
      <PageHeader title={t.title} lead={t.lead} />

      <Section id="structure" title={t.structure}>
        <dl className="divide-y divide-hairline border-y border-hairline">
          {dirs.map((dir) => (
            <div key={dir} className="grid gap-1 py-4 sm:grid-cols-[12rem_1fr] sm:gap-6">
              <dt className="t-mono text-ink">{dir}</dt>
              <dd className="t-body-sm text-ink-secondary">{t.dirs[dir]}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section id="install" title={t.install}>
        <div className="flex flex-col gap-8">
          <div>
            <h3 className="t-h4 text-ink">Claude Code</h3>
            <CodeBlock className="mt-3 measure" code={"/plugin marketplace add Yu-aimaker/AwesomeDesignSystem\n/plugin install awesome-ds@awesome-design-systems"} />
            <p className="t-body-sm mt-3 measure text-ink-secondary">
              {t.localBefore}
              <code>claude --plugin-dir ./Plugin/awesome-ds</code>
              {t.localAfter}
            </p>
          </div>
          <div>
            <h3 className="t-h4 text-ink">Cursor</h3>
            <CodeBlock className="mt-3 measure" code={"cp Plugin/awesome-ds/cursor/*.mdc .cursor/rules/"} />
            <p className="t-body-sm mt-3 measure text-ink-secondary">{t.cursorNote}</p>
          </div>
        </div>
      </Section>

      <Section id="skills" title={t.skills}>
        <Table
          columns={[
            { key: "name", header: t.colSkill, render: (r) => <code>{r.name}</code> },
            { key: "what", header: t.colWhat, wrap: true, render: (r) => r.what },
            { key: "how", header: t.colHow, wrap: true, render: (r) => <span className="t-mono">{r.how}</span> },
          ]}
          rows={skills}
          rowKey={(r) => r.name}
        />
      </Section>

      <Section id="update" title={t.update} lead={t.updateLead}>
        <ol className="prose t-body list-decimal pl-6 text-ink">
          <li>{t.step1}</li>
          <li>
            <code>knowledge-curator</code>
            {t.step2a}
            <code>node scripts/build-reference.mjs</code>
            {t.step2b}
          </li>
          <li>{t.step3}</li>
          <li>{t.step4}</li>
        </ol>
      </Section>

      <Section id="links" title={t.links}>
        <ul className="t-body flex flex-col gap-2 text-ink">
          <li>
            <a href={repoUrl} target="_blank" rel="noreferrer">
              {t.repo}
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
            <Link to="/knowledge">{t.knowledge}</Link>
            {t.sep}
            <Link to="/sources">{t.sources}</Link>
          </li>
        </ul>
      </Section>
    </div>
  );
}
