import Link from "next/link";
import { Badge, Button, Callout, Input, Progress, Toast } from "@awesome-ds/react";
import { componentCatalog } from "../lib/components-catalog";
import { getAtlas } from "../lib/content";
import { getHomeContent } from "../lib/home-content";
import { localizePathname } from "../lib/i18n";
import { getRequestLocale } from "../lib/i18n-server";
import { MotionDemo } from "../components/motion-demo";
import { ProofCalibrator, type EvidenceTrace } from "../components/proof-calibrator";

const featuredRuleIds = [
  "rule.governance.evidence-first",
  "rule.foundations.semantic-tokens",
  "rule.components.state-matrix",
  "rule.ai.generative-boundaries",
] as const;

const featuredReferenceIds = [
  "ref.w3c.wcag-22",
  "ref.vercel.web-interface-guidelines",
  "ref.apple.hig",
] as const;

export default async function HomePage() {
  const { references, rules, artifacts, validation } = await getAtlas();
  const locale = await getRequestLocale();
  const c = getHomeContent(locale);

  const featuredRules = featuredRuleIds
    .map((id) => rules.find((rule) => rule.id === id))
    .filter((rule): rule is NonNullable<typeof rule> => Boolean(rule));
  const featuredReferences = featuredReferenceIds
    .map((id) => references.find((reference) => reference.id === id))
    .filter((reference): reference is NonNullable<typeof reference> => Boolean(reference));

  const evidenceTraces = featuredRules
    .map((rule, index): EvidenceTrace | null => {
      const reference = references.find((item) => rule.referenceIds.includes(item.id));
      const artifact = artifacts.find(
        (item) => rule.artifactIds.includes(item.id) || item.ruleIds.includes(rule.id),
      );
      if (!reference || !artifact) return null;
      return {
        id: rule.id,
        intent: c.calibrator.intents[index] ?? c.calibrator.intents[0],
        reference: {
          title: reference.title,
          href: localizePathname(`/references/${encodeURIComponent(reference.id)}`, locale),
        },
        rule: {
          id: rule.id,
          title: rule.title,
          href: localizePathname(`/rules/${encodeURIComponent(rule.id)}`, locale),
        },
        artifact: {
          title: artifact.title,
          href: localizePathname(`/artifacts/${encodeURIComponent(artifact.id)}`, locale),
        },
      };
    })
    .filter((trace): trace is EvidenceTrace => Boolean(trace));

  const unimplemented = new Set(
    validation.issues
      .filter((issue) => issue.code === "unimplemented-rule")
      .map((issue) => issue.id),
  );
  const implementationCoverage = rules.length
    ? Math.round(((rules.length - unimplemented.size) / rules.length) * 100)
    : 100;

  const scaleValues = [rules.length, references.length, componentCatalog.length, implementationCoverage];

  return (
    <div className="home-page ads-motion-enter">
      {/* 1 — HERO: the signature claim + live proof instrument. */}
      <section className="product-hero" aria-labelledby="home-title">
        <div className="product-hero__copy">
          <p className="hero-registration" translate="no">{c.hero.registration}</p>
          <p className="eyebrow">{c.hero.eyebrow}</p>
          <h1 id="home-title" aria-label={`${c.hero.titleLead} ${c.hero.titleWord}${c.hero.titleTrail}`}>
            <span aria-hidden="true">{c.hero.titleLead}</span>
            <span aria-hidden="true" className="hero-word" translate="no">{c.hero.titleWord}{c.hero.titleTrail}</span>
          </h1>
          <p className="product-hero__lede">{c.hero.description}</p>
          <div className="action-row">
            <Link className="primary-link" href={localizePathname(c.hero.primaryHref, locale)}>
              {c.hero.primaryAction}<span aria-hidden="true">→</span>
            </Link>
            <Link className="text-link" href={c.hero.secondaryHref}>
              {c.hero.secondaryAction}<span aria-hidden="true">↓</span>
            </Link>
          </div>
        </div>

        <ProofCalibrator
          labels={c.calibrator}
          traces={evidenceTraces}
          healthy={validation.ok}
        />

      </section>

      {/* 2 — START HERE: Read → Build → Prove spine. */}
      <section className="home-section how-section" id="how-it-works" aria-labelledby="how-title">
        <header className="split-heading">
          <div>
            <p className="eyebrow">{c.how.eyebrow}</p>
            <h2 id="how-title">{c.how.title}</h2>
          </div>
          <p>{c.how.description}</p>
        </header>
        <ol className="process-spine">
          {c.how.steps.map((step) => (
            <li className="process-step" key={step.key}>
              <div className="process-step__mark"><span>{step.key}</span><em translate="no">{step.tag}</em></div>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
              <p className="process-step__meta" translate="no">{step.meta}</p>
              <Link href={localizePathname(step.href, locale)}>{step.action}<span aria-hidden="true">→</span></Link>
            </li>
          ))}
        </ol>
      </section>

      {/* 3 — SCALE BAND: aesthetics with receipts, at industrial scale. */}
      <section className="scale-band" aria-labelledby="scale-title">
        <div className="scale-band__intro">
          <p className="eyebrow">{c.scale.eyebrow}</p>
          <h2 id="scale-title">{c.scale.lead}<span> {c.scale.leadEmphasis}</span></h2>
          <p>{c.scale.description}</p>
        </div>
        <dl className="scale-metrics">
          {c.scale.metrics.map((metric, index) => (
            <div className="scale-metric" key={metric.label}>
              <dt><span className="scale-metric__value" translate="no">{scaleValues[index]}<i>{"suffix" in metric ? metric.suffix : ""}</i></span></dt>
              <dd><strong>{metric.label}</strong><span>{metric.sub}</span></dd>
            </div>
          ))}
        </dl>
      </section>

      {/* 4 — BUILD: executable components. */}
      <section className="home-section component-showcase" aria-labelledby="components-title">
        <header className="split-heading">
          <div>
            <p className="eyebrow">{c.build.eyebrow}</p>
            <h2 id="components-title">{c.build.title}</h2>
          </div>
          <p>{c.build.description}</p>
        </header>
        <div className="component-stage">
          <section className="component-stage__actions" aria-label={c.build.actionCard}>
            <div className="component-stage__title">
              <div><span className="status-dot" /><strong>{c.build.actionCard}</strong></div>
              <Badge tone="accent">@awesome-ds/react</Badge>
            </div>
            <Input id="home-design-intent" label={c.build.fieldLabel} hint={c.build.fieldHint} placeholder={c.build.fieldPlaceholder} />
            <div className="component-stage__buttons">
              <Button>{c.build.primary}</Button>
              <Button variant="secondary">{c.build.secondary}</Button>
              <Button variant="ghost" loading>{c.build.loading}</Button>
            </div>
          </section>
          <section className="component-stage__status" aria-label={c.build.statusTitle}>
            <Toast>{c.build.statusTitle}</Toast>
            <Callout title={c.build.statusTitle}>{c.build.statusBody}</Callout>
            <div className="coverage-meter">
              <div><span>{c.build.progress}</span><strong>{implementationCoverage}%</strong></div>
              <Progress value={implementationCoverage} label={c.build.progress} />
            </div>
          </section>
        </div>
        <Link className="section-link" href={localizePathname("/components", locale)}>{c.build.browse}<span aria-hidden="true">→</span></Link>
      </section>

      {/* 5 — THE CANON: the dark ledger. */}
      <section className="home-section canon-showcase" aria-labelledby="canon-title">
        <header className="split-heading">
          <div>
            <p className="eyebrow">{c.canon.eyebrow}</p>
            <h2 id="canon-title">{c.canon.title}</h2>
          </div>
          <div>
            <p>{c.canon.description}</p>
            <Link className="text-link" href={localizePathname("/canon", locale)}>{c.canon.browse}<span aria-hidden="true">→</span></Link>
          </div>
        </header>
        <div className="canon-ledger">
          <div className="canon-ledger__legend" aria-hidden="true">
            <span>{c.canon.guidance}</span><span>{c.canon.evidence}</span><span>{c.canon.implementation}</span><span>{c.canon.verification}</span>
          </div>
          {featuredRules.map((rule, index) => (
            <Link className="canon-row" href={localizePathname(`/rules/${encodeURIComponent(rule.id)}`, locale)} key={rule.id}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div><code>{rule.id}</code><strong lang="en">{rule.title}</strong></div>
              <span className="canon-row__signals" aria-label={`${rule.referenceIds.length} references, ${rule.artifactIds.length} artifacts`}>
                <i /><i /><i className={rule.referenceIds.length ? "is-on" : ""} /><i className={rule.artifactIds.length ? "is-on" : ""} />
              </span>
              <span aria-hidden="true">↗</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 6 — FOUNDATIONS. */}
      <section className="home-section" aria-labelledby="foundations-title">
        <header className="editorial-heading">
          <p className="eyebrow">{c.foundations.eyebrow}</p>
          <h2 id="foundations-title">{c.foundations.title}</h2>
          <p>{c.foundations.description}</p>
        </header>
        <div className="foundation-grid">
          <article className="foundation-panel foundation-panel--color">
            <div>
              <p className="panel-label">01 · COLOR</p>
              <h3>{c.foundations.colorTitle}</h3>
              <p>{c.foundations.colorBody}</p>
            </div>
            <ol className="token-ramp">
              {c.foundations.tokenLabels.map((label, index) => (
                <li key={label} className={`token-ramp__item token-ramp__item--${index + 1}`}><span /><small>{label}</small></li>
              ))}
            </ol>
          </article>
          <article className="foundation-panel foundation-panel--type">
            <div>
              <p className="panel-label">02 · TYPOGRAPHY</p>
              <h3>{c.foundations.typeTitle}</h3>
              <p>{c.foundations.typeBody}</p>
            </div>
            <div className="type-specimen">
              <p lang="en">{c.foundations.typeSample}</p>
              <p lang="ja">{c.foundations.typeSampleJa}</p>
              <span translate="no">Newsreader · IBM Plex Sans · Native Japanese UI</span>
            </div>
          </article>
        </div>
        <Link className="section-link" href={localizePathname("/foundations", locale)}>{c.foundations.openFoundations}<span aria-hidden="true">→</span></Link>
      </section>

      {/* 7 — MOTION. */}
      <section className="home-section" aria-labelledby="motion-title">
        <header className="split-heading">
          <div>
            <p className="eyebrow">{c.motion.eyebrow}</p>
            <h2 id="motion-title">{c.motion.title}</h2>
          </div>
          <p>{c.motion.description}</p>
        </header>
        <MotionDemo items={c.motion.demos} replayLabel={c.motion.replay} replayedLabel={c.motion.replayed} />
        <Link className="section-link" href={localizePathname("/motion", locale)}>{c.motion.browse}<span aria-hidden="true">→</span></Link>
      </section>

      {/* 8 — REFERENCE ATLAS. */}
      <section className="home-section atlas-showcase" aria-labelledby="atlas-title">
        <header className="editorial-heading">
          <p className="eyebrow">{c.atlas.eyebrow}</p>
          <h2 id="atlas-title">{c.atlas.title}</h2>
          <p>{c.atlas.description}</p>
        </header>
        <div className="atlas-list">
          {featuredReferences.map((reference) => (
            <Link className="atlas-row" href={localizePathname(`/references/${encodeURIComponent(reference.id)}`, locale)} key={reference.id}>
              <div className="atlas-row__source"><code>{reference.id}</code><strong>{reference.title}</strong><span>{reference.owner}</span></div>
              <dl>
                <div><dt>{c.atlas.verified}</dt><dd><time dateTime={reference.lastVerifiedDate}>{reference.lastVerifiedDate}</time></dd></div>
                <div><dt>{c.atlas.freshness}</dt><dd><span className={`freshness-state freshness-state--${reference.freshnessState}`}><i />{reference.freshnessState}</span></dd></div>
                <div><dt>{c.atlas.linkedRules}</dt><dd>{reference.linkedRuleIds.length}</dd></div>
              </dl>
              <span aria-hidden="true">↗</span>
            </Link>
          ))}
        </div>
        <Link className="section-link" href={localizePathname("/references", locale)}>{c.atlas.browse}<span aria-hidden="true">→</span></Link>
      </section>

      {/* 9 — BRAND DS: signature grammar, self-proven. */}
      <section className="home-section brand-showcase" aria-labelledby="brand-title">
        <header className="split-heading">
          <div>
            <p className="eyebrow">{c.brand.eyebrow}</p>
            <h2 id="brand-title">{c.brand.title}</h2>
          </div>
          <div>
            <p>{c.brand.description}</p>
            <Link className="text-link" href={localizePathname(c.brand.href, locale)}>{c.brand.action}<span aria-hidden="true">→</span></Link>
          </div>
        </header>
        <ul className="grammar-grid">
          {c.brand.grammar.map((item) => (
            <li className={`grammar-card grammar-card--${item.mark}`} key={item.mark}>
              <span className="grammar-card__mark" aria-hidden="true" />
              <strong>{item.term}</strong>
              <p>{item.body}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* 10 — ADOPT: bound the agent. */}
      <section className="home-section agent-workflow" aria-labelledby="agents-title">
        <div className="agent-workflow__copy">
          <p className="eyebrow">{c.agents.eyebrow}</p>
          <h2 id="agents-title">{c.agents.title}</h2>
          <p>{c.agents.description}</p>
          <div className="agent-instruction">
            <span translate="no">{c.agents.codeLabel}</span>
            <code translate="no">{c.agents.code}</code>
          </div>
          <Link className="text-link" href={localizePathname("/ai-design", locale)}>{c.agents.open}<span aria-hidden="true">→</span></Link>
        </div>
        <ol className="workflow-list">
          {c.agents.steps.map((step, index) => (
            <li key={step.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div><strong>{step.title}</strong><p>{step.body}</p></div>
            </li>
          ))}
        </ol>
      </section>

      {/* 11 — CLOSING: four ways in. */}
      <section className="closing-section" aria-labelledby="closing-title">
        <header>
          <p className="eyebrow">{c.closing.eyebrow}</p>
          <h2 id="closing-title">{c.closing.title}</h2>
        </header>
        <ul className="closing-quad">
          {c.closing.quad.map((item) => (
            <li key={item.tag}>
              <Link href={localizePathname(item.href, locale)}>
                <em translate="no">{item.tag}</em>
                <strong>{item.title}</strong>
                <span aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
