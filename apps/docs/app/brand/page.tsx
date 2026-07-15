import Link from "next/link";
import { docsForDomain } from "../../lib/markdown";
import { Prose } from "../../components/prose";
import { ProofDiagram } from "../../components/proof-diagram";
import { formatMessage, getDictionary, localizePathname } from "../../lib/i18n";
import { getBrandPersonality } from "../../lib/brand-content";
import { getRequestLocale } from "../../lib/i18n-server";

import { createLocalizedMetadata } from "../../lib/metadata";
import { PageHeader } from "../../components/page-header";
export const generateMetadata = () => createLocalizedMetadata("/brand", (dictionary) => dictionary.brand.title, (dictionary) => dictionary.brand.intro);

export default async function DomainPage() {
  const locale = await getRequestLocale();
  const docs = await docsForDomain("brand", locale);
  const featured = docs[0];
  const dictionary = getDictionary(locale);
  const d = dictionary.brand;
  const personality = getBrandPersonality(locale);
  const contract = [
    { label: d.purposeLabel, body: d.purpose },
    { label: d.toneLabel, body: d.tone },
    { label: d.constraintsLabel, body: d.constraints },
    { label: d.differentiationLabel, body: d.differentiation },
  ];
  return (
    <div className="ads-motion-enter route-page">
      <PageHeader eyebrow={locale === "ja" ? "言葉・形・動きの一貫性" : "Coherence across words, form, and motion"} title={d.title} description={formatMessage(d.intro, { count: docs.length })} meta={<code>{docs.length} modules · brand/</code>} />

      {/* Localized brand contract — the main doctrine reads natively in each locale,
          so the page no longer leans on a whole-page "untranslated" fallback notice. */}
      <section className="brand-contract" aria-labelledby="brand-contract-title">
        <p className="eyebrow">{d.contractEyebrow}</p>
        <h2 id="brand-contract-title">{d.contractTitle}</h2>
        <p className="brand-contract__intent" role="note">{d.localeIntent}</p>
        <dl className="brand-contract__grid">
          {contract.map((item) => (
            <div key={item.label}>
              <dt>{item.label}</dt>
              <dd>{item.body}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Localized personality — the traits, range, voice, and anti-personas read
          natively per locale (not a caption, not machine-translated), so /ja/brand
          delivers real Japanese-first brand content. */}
      <section className="brand-personality" aria-labelledby="brand-personality-title">
        <p className="eyebrow">{personality.eyebrow}</p>
        <h2 id="brand-personality-title">{personality.title}</h2>
        <p className="brand-personality__lede">{personality.lede}</p>
        <dl className="brand-personality__grid">
          <div>
            <dt>{personality.traitsLabel}</dt>
            <dd>
              <ul className="brand-personality__chips">
                {personality.traits.map((trait) => (
                  <li key={trait}>{trait}</li>
                ))}
              </ul>
            </dd>
          </div>
          <div>
            <dt>{personality.rangeLabel}</dt>
            <dd>{personality.range}</dd>
          </div>
          <div>
            <dt>{personality.voiceLabel}</dt>
            <dd>
              <ul className="brand-personality__chips">
                {personality.voice.map((quality) => (
                  <li key={quality}>{quality}</li>
                ))}
              </ul>
            </dd>
          </div>
          <div>
            <dt>{personality.antiLabel}</dt>
            <dd>
              <ul className="brand-personality__list">
                {personality.anti.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>
      </section>

      {/* Proof grammar, drawn — the same static SVGs the README reuses. */}
      <section className="brand-diagrams" aria-labelledby="brand-diagrams-title">
        <h2 id="brand-diagrams-title">{d.diagramsTitle}</h2>
        <ProofDiagram id="evidence-loop" caption={d.diagramLoopCaption} locale={locale} />
        <ProofDiagram id="canon-to-verify" caption={d.diagramBuildCaption} locale={locale} />
      </section>

      <Link className="hero-cta" href={localizePathname("/brand/workbench", locale)}>{d.workbench} <span aria-hidden="true">↗</span></Link>
      <div className="grid-cards" style={{ marginBottom: "var(--space-8)" }}>
        {docs.map((doc) => (
          <Link key={doc.slug} className="card-link" href={localizePathname("/canon/" + doc.slug, locale)}>
            <strong>{doc.title}</strong>
            <p className="meta">{doc.excerpt || doc.slug}</p>
          </Link>
        ))}
      </div>
      {featured ? (
        <section>
          <h2>{d.featured}: {featured.title}</h2>
          {locale === "ja" ? <p className="translation-notice" role="note" lang="ja">{d.sourceNotice}</p> : null}
          <div lang="en"><Prose html={featured.html} /></div>
        </section>
      ) : (
        <p>{d.empty}</p>
      )}
    </div>
  );
}
