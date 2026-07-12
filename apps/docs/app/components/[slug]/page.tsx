import { notFound } from "next/navigation";
import Link from "next/link";
import { Callout, Card } from "@awesome-ds/react";
import { componentCatalog, getComponent } from "../../../lib/components-catalog";
import { ComponentLive } from "../../../components/component-live";
import { getDictionary, localizePathname } from "../../../lib/i18n";
import { getRequestLocale } from "../../../lib/i18n-server";

export function generateStaticParams() {
  return componentCatalog.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getComponent(slug);
  return { title: item?.name ?? "Component" };
}

export default async function ComponentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getComponent(slug);
  if (!item) notFound();
  const locale = await getRequestLocale();
  const dictionary = getDictionary(locale);
  const d = dictionary.componentDetail;
  return (
    <article className="ads-motion-enter">
      <p className="meta"><Link href={localizePathname("/components", locale)}>{d.breadcrumb}</Link> / {item.family}</p>
      <h1>{item.name}</h1>
      {locale === "ja" ? <p className="translation-notice" lang="ja">{dictionary.canon.fallbackNotice}</p> : null}
      <p className="muted" lang="en">{item.description}</p>
      <p className="meta">{d.rules}: {item.ruleIds.join(", ")}</p>
      <h2>{d.stateMatrix}</h2>
      <div className="state-matrix">
        {item.states.map((state) => (
          <div className="state-chip" key={state}>
            <strong>{state}</strong>
            <span className="meta">{d.required}</span>
          </div>
        ))}
      </div>
      <h2>{d.anatomy}</h2>
      <ul lang="en">{item.anatomy.map((part) => <li key={part}>{part}</li>)}</ul>
      <h2>{d.keyboard}</h2>
      <p lang="en">{item.keyboard}</p>
      <h2>{d.screenReader}</h2>
      <p lang="en">{item.screenReader}</p>
      <h2>{d.contentRules}</h2>
      <ul lang="en">{item.contentRules.map((rule) => <li key={rule}>{rule}</li>)}</ul>
      <h2>{d.publicApi}</h2>
      <div className="table-scroll"><table><thead><tr><th>{d.prop}</th><th>{d.type}</th><th>{d.required}</th><th>{d.description}</th></tr></thead><tbody>
        {item.publicApi.map((api) => <tr key={api.name}><td><code>{api.name}</code></td><td><code>{api.type}</code></td><td>{api.required ? d.required : "—"}</td><td lang="en">{api.description}</td></tr>)}
      </tbody></table></div>
      <h2>{d.adaptation}</h2>
      <dl className="contract-definitions" lang="en">
        <div><dt lang={locale}>{d.rtl}</dt><dd>{item.rtl}</dd></div>
        <div><dt lang={locale}>{d.highContrast}</dt><dd>{item.highContrast}</dd></div>
        <div><dt lang={locale}>{d.reducedMotion}</dt><dd>{item.reducedMotion}</dd></div>
      </dl>
      <h2>{d.tests}</h2>
      <p className="meta">{item.testIds.join(", ")}</p>
      <h2>{d.live}</h2>
      <Card title={d.live}>
        <ComponentLive slug={slug} />
      </Card>
      <h2>{d.copyable}</h2>
      <pre className="code">{item.example}</pre>
      <Callout title={d.implementation}>
        {d.importPrefix} <code>{item.importName}</code> {d.importMiddle} <code>@awesome-ds/react</code>. {d.importSuffix}
      </Callout>
    </article>
  );
}
