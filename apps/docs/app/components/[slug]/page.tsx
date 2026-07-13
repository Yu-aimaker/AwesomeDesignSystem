import { notFound } from "next/navigation";
import Link from "next/link";
import { Callout, Card } from "@awesome-ds/react";
import { componentCatalog, getComponent } from "../../../lib/components-catalog";
import { ComponentLive } from "../../../components/component-live";
import { formatMessage, getDictionary, localizePathname } from "../../../lib/i18n";
import { getRequestLocale } from "../../../lib/i18n-server";
import { PreviewBoundary } from "../../../components/preview-boundary";
import { createLocalizedMetadata } from "../../../lib/metadata";
import { localizeComponentContract } from "../../../lib/component-localization";

export function generateStaticParams() {
  return componentCatalog.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await getRequestLocale();
  const sourceItem = getComponent(slug);
  const item = sourceItem ? localizeComponentContract(sourceItem, locale) : undefined;
  return createLocalizedMetadata(`/components/${slug}`, item?.name ?? "Component", item?.description);
}

export default async function ComponentDetailPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ preview?: string }> }) {
  const { slug } = await params;
  const previewErrorFixture = (await searchParams).preview === "error";
  const locale = await getRequestLocale();
  const sourceItem = getComponent(slug);
  if (!sourceItem) notFound();
  const item = localizeComponentContract(sourceItem, locale);
  const dictionary = getDictionary(locale);
  const d = dictionary.componentDetail;
  return (
    <article className="ads-motion-enter">
      <p className="meta"><Link href={localizePathname("/components", locale)}>{d.breadcrumb}</Link> / {item.family}</p>
      <h1>{item.name}</h1>
      <p className="muted">{item.description}</p>
      <p className="meta">{d.rules}: {item.ruleIds.map((ruleId, index) => <span key={ruleId}>{index ? ", " : ""}<Link href={localizePathname(`/rules/${encodeURIComponent(ruleId)}`, locale)}>{ruleId}</Link></span>)}</p>
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
      <ul>{item.anatomy.map((part) => <li key={part}>{part}</li>)}</ul>
      <h2>{d.keyboard}</h2>
      <p>{item.keyboard}</p>
      <h2>{d.screenReader}</h2>
      <p>{item.screenReader}</p>
      <h2>{d.contentRules}</h2>
      <ul>{item.contentRules.map((rule) => <li key={rule}>{rule}</li>)}</ul>
      <h2>{d.publicApi}</h2>
      <div className="table-scroll" role="region" tabIndex={0} aria-label={formatMessage(d.publicApiRegion, { name: item.name })}><table><thead><tr><th>{d.prop}</th><th>{d.type}</th><th>{d.required}</th><th>{d.description}</th></tr></thead><tbody>
        {item.publicApi.map((api) => <tr key={api.name}><td><code>{api.name}</code></td><td><code>{api.type}</code></td><td>{api.required ? d.required : "—"}</td><td>{api.description}</td></tr>)}
      </tbody></table></div>
      <h2>{d.adaptation}</h2>
      <dl className="contract-definitions">
        <div><dt lang={locale}>{d.rtl}</dt><dd>{item.rtl}</dd></div>
        <div><dt lang={locale}>{d.highContrast}</dt><dd>{item.highContrast}</dd></div>
        <div><dt lang={locale}>{d.reducedMotion}</dt><dd>{item.reducedMotion}</dd></div>
      </dl>
      <h2>{d.tests}</h2>
      <p className="meta">{item.testIds.join(", ")}</p>
      <h2>{d.live}</h2>
      <Card title={d.live}>
        <PreviewBoundary resetKey={`${slug}:${previewErrorFixture}`} fallback={<p role="alert">{d.previewFailed}</p>}>
          <ComponentLive slug={slug} locale={locale} forceError={previewErrorFixture} />
        </PreviewBoundary>
      </Card>
      <h2>{d.copyable}</h2>
      <pre className="code">{item.example}</pre>
      <Callout title={d.implementation}>
        {d.importPrefix} <code>{item.importName}</code> {d.importMiddle} <code>@awesome-ds/react</code>. {d.importSuffix}
      </Callout>
    </article>
  );
}
