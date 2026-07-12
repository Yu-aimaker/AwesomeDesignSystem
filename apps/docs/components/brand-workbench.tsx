"use client";

import { lintProductCopy, type ProductLexicon } from "@awesome-ds/brand";
import { useMemo, useState } from "react";

const demoLexicon: ProductLexicon = [
  { term: "workspace", definition: "A shared project area", status: "preferred", locales: ["en"], owner: "Content design" },
  { term: "work zone", definition: "Legacy product name", status: "deprecated", replacement: "workspace", locales: ["en"], owner: "Content design" },
  { term: "guaranteed", definition: "An unsupported absolute claim", status: "forbidden", locales: ["en"], owner: "Legal" },
];

const contracts = [
  ["Identity", "marks · color · type · imagery"],
  ["Language", "narrative · voice · tone · lexicon"],
  ["Expression", "illustration · character · motion · sound"],
  ["Operations", "assets · rights · owner · versions"],
] as const;

export function BrandWorkbench() {
  const [copy, setCopy] = useState("A guaranteed result in every work zone.");
  const issues = useMemo(() => lintProductCopy(copy, demoLexicon, "en"), [copy]);
  return (
    <div className="workbench-grid">
      <section className="workbench-panel">
        <p className="eyebrow">Brand manifest</p>
        <h2>One personality. Every medium.</h2>
        <div className="contract-list">
          {contracts.map(([title, detail], index) => <div key={title}><span>{String(index + 1).padStart(2, "0")}</span><strong>{title}</strong><p>{detail}</p></div>)}
        </div>
      </section>
      <section className="workbench-panel workbench-panel--dark">
        <p className="eyebrow">Product Lexicon · live contract</p>
        <label className="ads-field">
          <span className="ads-label">Interface copy</span>
          <textarea className="ads-textarea" value={copy} onChange={(event) => setCopy(event.target.value)} rows={5} />
        </label>
        <div aria-live="polite" aria-atomic="true" className="lint-results" data-copy={copy}>
          {issues.length === 0 ? <p className="lint-pass">No lexicon violations.</p> : issues.map((issue) => <div key={issue.term} className={`lint-issue lint-issue--${issue.severity}`}><strong>{issue.severity}</strong><span>{issue.message}{issue.replacement ? ` Use “${issue.replacement}”.` : ""}</span></div>)}
        </div>
      </section>
    </div>
  );
}
