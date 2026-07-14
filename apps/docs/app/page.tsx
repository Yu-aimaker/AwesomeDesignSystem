import Link from "next/link";
import { getAtlas } from "../lib/content";
import { formatMessage, getDictionary, localizePathname } from "../lib/i18n";
import { getRequestLocale } from "../lib/i18n-server";

export default async function HomePage() {
  const { references, rules, validation, freshness } = await getAtlas();
  const locale = await getRequestLocale();
  const d = getDictionary(locale).home;
  return (
    <div className="ads-motion-enter">
      <section className="hero">
        <div className="hero-kicker"><span className="signal-dot" /> {d.kicker}</div>
        <div className="hero-layout">
          <div>
            <h1>{d.title}<br /><em>{d.titleEmphasis}</em></h1>
            <p className="hero-lede">
              {d.lede}
            </p>
            <div className="hero-actions">
              <Link className="hero-cta" href={localizePathname("/canon", locale)}>{d.canonCta} <span aria-hidden="true">↗</span></Link>
              <Link className="hero-secondary" href={localizePathname("/references", locale)}>{formatMessage(d.sourcesCta, { count: references.length })}</Link>
            </div>
          </div>
          <aside className="hero-proof" aria-label={d.repositoryProof}>
            <div><strong>{rules.length}</strong><span>{d.rules}</span></div>
            <div><strong>{references.length}</strong><span>{d.sources}</span></div>
            <div><strong>{freshness.healthy}</strong><span>{d.fresh}</span></div>
            <div><strong>{validation.ok ? d.pass : d.check}</strong><span>{d.graph}</span></div>
          </aside>
        </div>
      </section>
      <section className="portal-section">
        <div className="section-heading"><p className="eyebrow">{d.entryEyebrow}</p><h2>{d.entryTitle}</h2></div>
        <div className="portal-grid">
          <Link className="portal-card portal-card--wide" href={localizePathname("/references", locale)}><span className="portal-index">01</span><strong>{d.atlasTitle}</strong><p>{d.atlasBody}</p><span className="portal-meta">{formatMessage(d.atlasMeta, { count: references.length })}</span></Link>
          <Link className="portal-card" href={localizePathname("/components", locale)}><span className="portal-index">02</span><strong>{d.componentsTitle}</strong><p>{d.componentsBody}</p></Link>
          <Link className="portal-card" href={localizePathname("/motion", locale)}><span className="portal-index">03</span><strong>{d.motionTitle}</strong><p>{d.motionBody}</p></Link>
          <Link className="portal-card portal-card--dark" href={localizePathname("/playground", locale)}><span className="portal-index">04</span><strong>{d.playgroundTitle}</strong><p>{d.playgroundBody}</p></Link>
        </div>
      </section>
      <section className="rule-stream">
        <div className="section-heading"><p className="eyebrow">{d.liveCanon}</p><h2>{d.liveCanonTitle}</h2></div>
        <ol>
          {rules.slice(0, 8).map((rule, index) => (
            <li key={rule.id}><span>{String(index + 1).padStart(2, "0")}</span><div><code>{rule.id}</code><strong>{rule.title}</strong></div></li>
          ))}
        </ol>
      </section>
    </div>
  );
}
