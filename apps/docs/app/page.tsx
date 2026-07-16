import Link from "next/link";
import { Badge, Button, Callout, Input, Progress, Toast } from "@awesome-ds/react";
import { AdsCharacter } from "../components/ads-character";
import { CmyMark } from "../components/cmy-mark";
import { MotionDemo } from "../components/motion-demo";
import { componentCatalog } from "../lib/components-catalog";
import { getAtlas } from "../lib/content";
import { getHomeContent } from "../lib/home-content";
import { localizePathname } from "../lib/i18n";
import { getRequestLocale } from "../lib/i18n-server";

const featuredReferenceIds = [
  "ref.w3c.wcag-22",
  "ref.vercel.web-interface-guidelines",
  "ref.apple.hig",
] as const;

export default async function HomePage() {
  const { references, rules, validation } = await getAtlas();
  const locale = await getRequestLocale();
  const c = getHomeContent(locale);

  const featuredReferences = featuredReferenceIds
    .map((id) => references.find((reference) => reference.id === id))
    .filter((reference): reference is NonNullable<typeof reference> => Boolean(reference));

  const unimplemented = new Set(
    validation.issues
      .filter((issue) => issue.code === "unimplemented-rule")
      .map((issue) => issue.id),
  );
  const implementationCoverage = rules.length
    ? Math.round(((rules.length - unimplemented.size) / rules.length) * 100)
    : 100;

  const scaleValues = [
    rules.length,
    references.length,
    componentCatalog.length,
    implementationCoverage,
  ];

  return (
    <div className="home-page ads-motion-enter">
      {/* ── HERO ───────────────────────────────────────────── */}
      <section className="lp-hero" aria-labelledby="home-title">
        <div className="lp-hero__grid" aria-hidden="true" />
        <div className="lp-hero__copy">
          <p className="lp-kicker">
            <CmyMark size={18} breathe={false} />
            <span translate="no">{c.hero.kicker}</span>
          </p>
          <h1 id="home-title">
            <span className="lp-hero__line">{c.hero.title}</span>
            <span className="lp-hero__accent">{c.hero.titleAccent}</span>
            <span className="lp-hero__line lp-hero__line--trail">{c.hero.titleTrail}</span>
          </h1>
          <p className="lp-hero__lede">{c.hero.description}</p>
          <div className="action-row">
            <Link
              className="primary-link"
              href={localizePathname(c.hero.primaryHref, locale)}
            >
              {c.hero.primaryAction}
              <span aria-hidden="true">→</span>
            </Link>
            <Link className="text-link" href={c.hero.secondaryHref}>
              {c.hero.secondaryAction}
              <span aria-hidden="true">↓</span>
            </Link>
          </div>

          <dl className="lp-hero__stats" aria-label={c.hero.liveLabel}>
            <div>
              <dt>{c.hero.rulesLabel}</dt>
              <dd translate="no">{rules.length}</dd>
            </div>
            <div>
              <dt>{c.hero.sourcesLabel}</dt>
              <dd translate="no">{references.length}</dd>
            </div>
            <div>
              <dt>{c.hero.componentsLabel}</dt>
              <dd translate="no">{componentCatalog.length}</dd>
            </div>
            <div>
              <dt>{c.hero.skillsLabel}</dt>
              <dd translate="no">5</dd>
            </div>
          </dl>
          <p className="lp-hero__health" data-healthy={validation.ok ? "true" : "false"}>
            <i aria-hidden="true" />
            {validation.ok ? c.hero.graphHealthy : c.hero.graphNeedsReview}
          </p>
        </div>

        <div className="lp-hero__stage">
          <AdsCharacter
            mood="wave"
            size={200}
            label={locale === "ja" ? "Dotto（AwesomeDSのマスコット）" : "Dotto, the AwesomeDS mascot"}
          />
          <div className="lp-hero__spectrum" aria-hidden="true">
            <span /><span /><span /><span /><span /><span /><span /><span />
          </div>
        </div>
      </section>

      {/* ── WHY ────────────────────────────────────────────── */}
      <section className="home-section promise-section" aria-labelledby="promise-title">
        <header className="editorial-heading">
          <p className="eyebrow">{c.promise.eyebrow}</p>
          <h2 id="promise-title">{c.promise.title}</h2>
          <p>{c.promise.body}</p>
        </header>
        <ul className="promise-grid">
          {c.promise.cards.map((card) => (
            <li key={card.tag}>
              <article className="promise-card">
                <em translate="no">{card.tag}</em>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
                <Link href={localizePathname(card.href, locale)}>
                  {card.action}
                  <span aria-hidden="true">→</span>
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </section>

      {/* ── CHARACTER ──────────────────────────────────────── */}
      <section className="home-section character-section" aria-labelledby="character-title">
        <div className="character-section__copy">
          <p className="eyebrow">{c.character.eyebrow}</p>
          <h2 id="character-title">{c.character.title}</h2>
          <p>{c.character.body}</p>
        </div>
        <ul className="character-moods">
          {c.character.moods.map((item) => (
            <li key={item.mood}>
              <AdsCharacter mood={item.mood} size={120} label={item.label} />
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ── HOW ────────────────────────────────────────────── */}
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
              <div className="process-step__mark">
                <span>{step.key}</span>
                <em translate="no">{step.tag}</em>
              </div>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
              <p className="process-step__meta" translate="no">
                {step.meta}
              </p>
              <Link href={localizePathname(step.href, locale)}>
                {step.action}
                <span aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* ── SCALE ──────────────────────────────────────────── */}
      <section className="scale-band" aria-labelledby="scale-title">
        <div className="scale-band__intro">
          <p className="eyebrow">{c.scale.eyebrow}</p>
          <h2 id="scale-title">
            {c.scale.lead}
            <span> {c.scale.leadEmphasis}</span>
          </h2>
          <p>{c.scale.description}</p>
        </div>
        <dl className="scale-metrics">
          {c.scale.metrics.map((metric, index) => (
            <div className="scale-metric" key={metric.label}>
              <dt>
                <span className="scale-metric__value" translate="no">
                  {scaleValues[index]}
                  <i>{"suffix" in metric ? metric.suffix : ""}</i>
                </span>
              </dt>
              <dd>
                <strong>{metric.label}</strong>
                <span>{metric.sub}</span>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ── SPECTRUM / BRAND ───────────────────────────────── */}
      <section className="home-section spectrum-section" aria-labelledby="spectrum-title">
        <header className="split-heading">
          <div>
            <p className="eyebrow">{c.spectrum.eyebrow}</p>
            <h2 id="spectrum-title">{c.spectrum.title}</h2>
          </div>
          <div>
            <p>{c.spectrum.body}</p>
            <Link className="text-link" href={localizePathname("/brand", locale)}>
              {c.spectrum.openBrand}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </header>
        <div className="spectrum-stage">
          <CmyMark size={96} />
          <div className="spectrum-bar" aria-hidden="true">
            <span /><span /><span /><span /><span /><span /><span /><span />
          </div>
          <ul className="cmy-swatches" aria-label="CMY primaries">
            <li data-ink="cyan"><i /><span>Cyan</span><code>#15C7DE</code></li>
            <li data-ink="magenta"><i /><span>Magenta</span><code>#FF2EA6</code></li>
            <li data-ink="yellow"><i /><span>Yellow</span><code>#FFD400</code></li>
          </ul>
        </div>
      </section>

      {/* ── COMPONENTS ─────────────────────────────────────── */}
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
              <div>
                <span className="status-dot" />
                <strong>{c.build.actionCard}</strong>
              </div>
              <Badge tone="accent">@awesome-ds/react</Badge>
            </div>
            <Input
              id="home-design-intent"
              label={c.build.fieldLabel}
              hint={c.build.fieldHint}
              placeholder={c.build.fieldPlaceholder}
            />
            <div className="component-stage__buttons">
              <Button>{c.build.primary}</Button>
              <Button variant="secondary">{c.build.secondary}</Button>
              <Button variant="ghost" loading>
                {c.build.loading}
              </Button>
            </div>
          </section>
          <section className="component-stage__status" aria-label={c.build.statusTitle}>
            <Toast>{c.build.statusTitle}</Toast>
            <Callout title={c.build.statusTitle}>{c.build.statusBody}</Callout>
            <div className="coverage-meter">
              <div>
                <span>{c.build.progress}</span>
                <strong>{implementationCoverage}%</strong>
              </div>
              <Progress value={implementationCoverage} label={c.build.progress} />
            </div>
          </section>
        </div>
        <Link className="section-link" href={localizePathname("/components", locale)}>
          {c.build.browse}
          <span aria-hidden="true">→</span>
        </Link>
      </section>

      {/* ── MOTION ─────────────────────────────────────────── */}
      <section className="home-section" aria-labelledby="motion-title">
        <header className="split-heading">
          <div>
            <p className="eyebrow">{c.motion.eyebrow}</p>
            <h2 id="motion-title">{c.motion.title}</h2>
          </div>
          <p>{c.motion.description}</p>
        </header>
        <MotionDemo
          items={c.motion.demos}
          replayLabel={c.motion.replay}
          replayedLabel={c.motion.replayed}
        />
        <Link className="section-link" href={localizePathname("/motion", locale)}>
          {c.motion.browse}
          <span aria-hidden="true">→</span>
        </Link>
      </section>

      {/* ── INSTALL ────────────────────────────────────────── */}
      <section className="home-section install-section" id="install" aria-labelledby="install-title">
        <header className="editorial-heading">
          <p className="eyebrow">{c.install.eyebrow}</p>
          <h2 id="install-title">{c.install.title}</h2>
          <p>{c.install.tip}</p>
        </header>
        <div className="install-grid">
          <pre className="install-code" tabIndex={0}>
            <code>{c.install.code}</code>
          </pre>
          <ul className="skill-list">
            {c.install.skills.map((skill) => (
              <li key={skill.name}>
                <code translate="no">{skill.name}</code>
                <span>{skill.use}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="meta">{c.install.note}</p>
      </section>

      {/* ── ATLAS ──────────────────────────────────────────── */}
      <section className="home-section atlas-showcase" aria-labelledby="atlas-title">
        <header className="editorial-heading">
          <p className="eyebrow">{c.atlas.eyebrow}</p>
          <h2 id="atlas-title">{c.atlas.title}</h2>
          <p>{c.atlas.description}</p>
        </header>
        <div className="atlas-list">
          {featuredReferences.map((reference) => (
            <Link
              className="atlas-row"
              href={localizePathname(`/references/${encodeURIComponent(reference.id)}`, locale)}
              key={reference.id}
            >
              <div className="atlas-row__source">
                <code>{reference.id}</code>
                <strong>{reference.title}</strong>
                <span>{reference.owner}</span>
              </div>
              <dl>
                <div>
                  <dt>{c.atlas.verified}</dt>
                  <dd>
                    <time dateTime={reference.lastVerifiedDate}>
                      {reference.lastVerifiedDate}
                    </time>
                  </dd>
                </div>
                <div>
                  <dt>{c.atlas.freshness}</dt>
                  <dd>
                    <span
                      className={`freshness-state freshness-state--${reference.freshnessState}`}
                    >
                      <i />
                      {reference.freshnessState}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt>{c.atlas.linkedRules}</dt>
                  <dd>{reference.linkedRuleIds.length}</dd>
                </div>
              </dl>
              <span aria-hidden="true">↗</span>
            </Link>
          ))}
        </div>
        <Link className="section-link" href={localizePathname("/references", locale)}>
          {c.atlas.browse}
          <span aria-hidden="true">→</span>
        </Link>
      </section>

      {/* ── CLOSING ────────────────────────────────────────── */}
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
