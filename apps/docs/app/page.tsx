import Link from "next/link";
import { Badge, Button, Callout, Input, Progress, Toast } from "@awesome-ds/react";
import { componentCatalog } from "../lib/components-catalog";
import { getAtlas } from "../lib/content";
import { getHomeContent } from "../lib/home-content";
import { localizePathname } from "../lib/i18n";
import { getRequestLocale } from "../lib/i18n-server";
import { MotionDemo } from "../components/motion-demo";

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
  const { references, rules, artifacts, validation, freshness } = await getAtlas();
  const locale = await getRequestLocale();
  const c = getHomeContent(locale);
  const featuredRules = featuredRuleIds
    .map((id) => rules.find((rule) => rule.id === id))
    .filter((rule): rule is NonNullable<typeof rule> => Boolean(rule));
  const featuredReferences = featuredReferenceIds
    .map((id) => references.find((reference) => reference.id === id))
    .filter((reference): reference is NonNullable<typeof reference> => Boolean(reference));
  const traceRule = featuredRules[0] ?? rules[0];
  const traceReference = references.find((reference) => traceRule?.referenceIds.includes(reference.id)) ?? references[0];
  const traceArtifact = artifacts.find(
    (artifact) => traceRule?.artifactIds.includes(artifact.id) || artifact.ruleIds.includes(traceRule?.id ?? ""),
  ) ?? artifacts[0];
  const unimplemented = new Set(
    validation.issues
      .filter((issue) => issue.code === "unimplemented-rule")
      .map((issue) => issue.id),
  );
  const implementationCoverage = rules.length
    ? Math.round(((rules.length - unimplemented.size) / rules.length) * 100)
    : 100;

  return (
    <div className="home-page ads-motion-enter">
      <section className="product-hero" aria-labelledby="home-title">
        <div className="product-hero__copy">
          <p className="eyebrow">{c.hero.eyebrow}</p>
          <h1 id="home-title">{c.hero.title}</h1>
          <p className="product-hero__lede">{c.hero.description}</p>
          <div className="action-row">
            <Link className="primary-link" href={localizePathname("/canon", locale)}>
              {c.hero.primaryAction}<span aria-hidden="true">→</span>
            </Link>
            <Link className="text-link" href={localizePathname("/references", locale)}>
              {c.hero.secondaryAction}<span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>

        <aside className="trace-console" aria-label={c.proof.eyebrow}>
          <div className="trace-console__header">
            <span>{c.proof.input}</span>
            <span className="status-label"><span className="status-dot" />{c.proof.verified}</span>
          </div>
          <p className="trace-console__intent">{c.proof.inputValue}</p>
          <ol className="trace-console__chain">
            <li>
              <span>01</span>
              <div><small>{c.proof.source}</small><strong>{traceReference?.title}</strong></div>
            </li>
            <li>
              <span>02</span>
              <div><small>{c.proof.rule}</small><code>{traceRule?.id}</code></div>
            </li>
            <li>
              <span>03</span>
              <div><small>{c.proof.output}</small><strong>{traceArtifact?.title}</strong></div>
            </li>
            <li>
              <span>04</span>
              <div><small>{c.proof.verify}</small><strong>{validation.ok ? c.hero.graphHealthy : c.hero.graphNeedsReview}</strong></div>
            </li>
          </ol>
        </aside>

        <section className="truth-strip" aria-labelledby="trust-label">
          <p id="trust-label">{c.hero.trustLabel}</p>
          <dl>
            <div><dt>{c.hero.rulesLabel}</dt><dd>{rules.length}</dd></div>
            <div><dt>{c.hero.sourcesLabel}</dt><dd>{references.length}</dd></div>
            <div><dt>{c.hero.componentsLabel}</dt><dd>{componentCatalog.length}</dd></div>
            <div><dt>{c.hero.freshnessLabel}</dt><dd>{freshness.healthy}</dd></div>
          </dl>
        </section>
      </section>

      <section className="home-section" aria-labelledby="proof-title">
        <header className="editorial-heading">
          <p className="eyebrow">{c.proof.eyebrow}</p>
          <h2 id="proof-title">{c.proof.title}</h2>
          <p>{c.proof.description}</p>
        </header>
        <div className="path-grid">
          {c.paths.items.map((item) => (
            <article className="path-card" key={item.index}>
              <span className="path-card__index">{item.index}</span>
              <p className="path-card__meta">{item.meta}</p>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
              <Link href={localizePathname(item.href, locale)}>{item.action}<span aria-hidden="true">→</span></Link>
            </article>
          ))}
        </div>
      </section>

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
              <span>Newsreader · IBM Plex Sans · Noto Sans JP</span>
            </div>
          </article>
        </div>
        <Link className="section-link" href={localizePathname("/foundations", locale)}>{c.foundations.openFoundations}<span aria-hidden="true">→</span></Link>
      </section>

      <section className="home-section component-showcase" aria-labelledby="components-title">
        <header className="split-heading">
          <div>
            <p className="eyebrow">{c.components.eyebrow}</p>
            <h2 id="components-title">{c.components.title}</h2>
          </div>
          <p>{c.components.description}</p>
        </header>
        <div className="component-stage">
          <section className="component-stage__actions" aria-label={c.components.actionCard}>
            <div className="component-stage__title">
              <div><span className="status-dot" /><strong>{c.components.actionCard}</strong></div>
              <Badge tone="accent">@awesome-ds/react</Badge>
            </div>
            <Input id="home-design-intent" label={c.components.fieldLabel} hint={c.components.fieldHint} placeholder={c.components.fieldPlaceholder} />
            <div className="component-stage__buttons">
              <Button>{c.components.primary}</Button>
              <Button variant="secondary">{c.components.secondary}</Button>
              <Button variant="ghost" loading>{c.components.loading}</Button>
            </div>
          </section>
          <section className="component-stage__status" aria-label={c.components.statusTitle}>
            <Toast>{c.components.statusTitle}</Toast>
            <Callout title={c.components.statusTitle}>{c.components.statusBody}</Callout>
            <div className="coverage-meter">
              <div><span>{c.components.progress}</span><strong>{implementationCoverage}%</strong></div>
              <Progress value={implementationCoverage} label={c.components.progress} />
            </div>
          </section>
        </div>
        <Link className="section-link" href={localizePathname("/components", locale)}>{c.components.browse}<span aria-hidden="true">→</span></Link>
      </section>

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

      <section className="home-section agent-workflow" aria-labelledby="agents-title">
        <div className="agent-workflow__copy">
          <p className="eyebrow">{c.agents.eyebrow}</p>
          <h2 id="agents-title">{c.agents.title}</h2>
          <p>{c.agents.description}</p>
          <div className="agent-instruction">
            <span>{c.agents.codeLabel}</span>
            <code>{c.agents.code}</code>
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

      <section className="closing-section" aria-labelledby="closing-title">
        <p className="eyebrow">{c.closing.eyebrow}</p>
        <h2 id="closing-title">{c.closing.title}</h2>
        <div className="action-row">
          <Link className="primary-link" href={localizePathname("/canon", locale)}>{c.closing.primary}<span aria-hidden="true">→</span></Link>
          <Link className="text-link" href={localizePathname("/status", locale)}>{c.closing.secondary}<span aria-hidden="true">↗</span></Link>
        </div>
      </section>
    </div>
  );
}
