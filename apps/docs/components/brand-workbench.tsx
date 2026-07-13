"use client";

import { lintProductCopy, type ProductLexicon } from "@awesome-ds/brand";
import { useMemo, useState } from "react";
import type { Dictionary, Locale } from "../lib/i18n";

const demoLexicons: Record<Locale, ProductLexicon> = {
  en: [
    { term: "workspace", definition: "A shared project area", status: "preferred", locales: ["en"], owner: "Content design" },
    { term: "work zone", definition: "Legacy product name", status: "deprecated", replacement: "workspace", locales: ["en"], owner: "Content design" },
    { term: "guaranteed", definition: "An unsupported absolute claim", status: "forbidden", locales: ["en"], owner: "Legal" },
  ],
  ja: [
    { term: "ワークスペース", definition: "共有プロジェクト領域", status: "preferred", locales: ["ja"], owner: "コンテンツデザイン" },
    { term: "作業場", definition: "旧プロダクト名", status: "deprecated", replacement: "ワークスペース", locales: ["ja"], owner: "コンテンツデザイン" },
    { term: "必ず", definition: "根拠のない絶対表現", status: "forbidden", locales: ["ja"], owner: "法務" },
  ],
};

const initialCopy: Record<Locale, string> = {
  en: "A guaranteed result in every work zone.",
  ja: "すべての作業場で必ず成果が出ます。",
};

function message(template: string, values: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? `{${key}}`);
}

export function BrandWorkbench({ locale, labels }: { locale: Locale; labels: Dictionary["workbench"] }) {
  const [copy, setCopy] = useState(initialCopy[locale]);
  const issues = useMemo(() => lintProductCopy(copy, demoLexicons[locale], locale), [copy, locale]);
  const contracts = [
    [labels.identity, labels.identityDetail],
    [labels.language, labels.languageDetail],
    [labels.expression, labels.expressionDetail],
    [labels.operations, labels.operationsDetail],
  ] as const;
  return (
    <div className="workbench-grid">
      <section className="workbench-panel">
        <p className="eyebrow">{labels.manifest}</p>
        <h2>{labels.manifestTitle}</h2>
        <div className="contract-list">
          {contracts.map(([title, detail], index) => <div key={title}><span>{String(index + 1).padStart(2, "0")}</span><strong>{title}</strong><p>{detail}</p></div>)}
        </div>
      </section>
      <section className="workbench-panel workbench-panel--dark">
        <p className="eyebrow">{labels.lexicon}</p>
        <label className="ads-field">
          <span className="ads-label">{labels.interfaceCopy}</span>
          <textarea className="ads-textarea" value={copy} onChange={(event) => setCopy(event.target.value)} rows={5} />
        </label>
        <div aria-live="polite" aria-atomic="true" className="lint-results" data-copy={copy}>
          {issues.length === 0 ? <p className="lint-pass">{labels.noViolations}</p> : issues.map((issue) => (
            <div key={issue.term} className={`lint-issue lint-issue--${issue.severity}`}>
              <strong>{labels[issue.severity]}</strong>
              <span>
                {message(issue.severity === "error" ? labels.forbidden : labels.deprecated, { term: issue.term })}
                {issue.replacement ? ` ${message(labels.replacement, { replacement: issue.replacement })}` : ""}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
