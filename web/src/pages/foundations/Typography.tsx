import { PageHeader, Section, SourceList, Spec, Why } from "../../layout/Page";
import { typeRoles, tokens } from "../../lib/tokens";
import { useLocale, useT } from "../../i18n/context";
import { typographyMessages, type TypographyMessages } from "../../i18n/messages/typography";

const jaSample = "文字の大きさと太さで階層をつくる。色や飾りは後。";
const enSample = "Hierarchy comes from size and weight, not from color.";

const paragraphJa =
  "本文は 16px を基準にします。日本語は漢字と仮名で字面の密度が変わるため、行間を 1.8 まで広げると行の切れ目が読み取りやすくなります。行の長さは全角 40 文字前後を上限にし、それより長い場合は段組みか余白で区切ります。";

const sources = (n: TypographyMessages["sourceNotes"]) => [
  { title: "Geist Font", url: "https://vercel.com/font", note: n.geist },
  { title: "Noto Sans JP", url: "https://fonts.google.com/noto/specimen/Noto+Sans+JP", note: n.noto },
  { title: "Requirements for Japanese Text Layout (JLReq)", url: "https://www.w3.org/TR/jlreq/", note: n.jlreq },
  { title: "WCAG 2.2 Understanding 1.4.12 Text Spacing", url: "https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html", note: n.wcag },
  { title: "Practical Typography: Line length", url: "https://practicaltypography.com/line-length.html", note: n.lineLength },
  { title: "MDN: font-variant-numeric", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-numeric", note: n.numeric },
];

export function Typography() {
  const { locale } = useLocale();
  const t = useT(typographyMessages);
  return (
    <div>
      <PageHeader title={t.title} lead={t.lead} />

      <Section id="roles" title={t.rolesTitle} lead={t.rolesLead}>
        <div className="flex flex-col divide-y divide-hairline rounded-lg border border-hairline bg-surface">
          {typeRoles.map((r) => (
            <div key={r.name} className="grid gap-4 p-6 lg:grid-cols-[200px_minmax(0,1fr)]">
              <div>
                <p className="t-mono text-ink">{r.name}</p>
                <Spec
                  items={[
                    ["size", r.size],
                    ["weight", String(r.weight)],
                    ["line-height", String(r.lineHeight)],
                    ["tracking", r.tracking],
                  ]}
                />
                <p className="t-caption mt-2 text-ink-secondary">{r.use[locale]}</p>
              </div>
              <div className="min-w-0 overflow-hidden">
                <p
                  lang="ja"
                  className="text-ink"
                  style={{
                    fontFamily: r.family === "mono" ? "var(--ds-font-mono)" : "var(--ds-font-sans)",
                    fontSize: r.size,
                    fontWeight: r.weight,
                    lineHeight: r.lineHeight,
                    letterSpacing: r.tracking,
                    overflowWrap: "anywhere",
                  }}
                >
                  {r.family === "mono" ? "--ds-radius-md: 8px; /* 角丸 */" : jaSample}
                </p>
                <p
                  lang="en"
                  className="mt-2 text-ink-secondary"
                  style={{
                    fontFamily: r.family === "mono" ? "var(--ds-font-mono)" : "var(--ds-font-sans)",
                    fontSize: r.size,
                    fontWeight: r.weight,
                    lineHeight: r.lineHeight,
                    letterSpacing: r.tracking,
                    overflowWrap: "anywhere",
                  }}
                >
                  {r.family === "mono" ? "const ratio = contrast(ink, canvas);" : enSample}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="stack" title={t.stackTitle} lead={t.stackLead}>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-hairline bg-surface p-6">
            <p className="t-mono text-ink-muted">--ds-font-sans</p>
            <p className="t-mono mt-2 text-ink" style={{ overflowWrap: "anywhere" }}>
              {tokens.font.family.sans.$value.map((f) => (f.includes(" ") ? `"${f}"` : f)).join(", ")}
            </p>
            <p lang="ja" className="mt-6 text-ink" style={{ fontSize: 28, lineHeight: 1.4, fontWeight: 600, letterSpacing: "-0.015em" }}>
              Geist と日本語 0123456789
            </p>
          </div>
          <div className="rounded-lg border border-hairline bg-surface p-6">
            <p className="t-mono text-ink-muted">--ds-font-mono</p>
            <p className="t-mono mt-2 text-ink" style={{ overflowWrap: "anywhere" }}>
              {tokens.font.family.mono.$value.map((f) => (f.includes(" ") ? `"${f}"` : f)).join(", ")}
            </p>
            <p className="mt-6 font-mono text-ink" style={{ fontSize: 20, lineHeight: 1.6 }}>
              {"{ radius: 8, weight: 600 } il1 O0"}
            </p>
          </div>
        </div>
        <p className="t-body-sm mt-4 max-w-[65ch] text-ink-secondary">
          {t.stackNote}
        </p>
      </Section>

      <Section id="japanese" title={t.japaneseTitle} lead={t.japaneseLead}>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-hairline bg-surface p-6">
            <p className="t-mono text-ink-muted">{t.leading15}</p>
            <p lang="ja" className="mt-4 text-ink" style={{ lineHeight: 1.5 }}>
              {paragraphJa}
            </p>
          </div>
          <div className="rounded-lg border border-hairline bg-surface p-6">
            <p className="t-mono text-ink-muted">{t.leading18}</p>
            <p lang="ja" className="mt-4 text-ink" style={{ lineHeight: 1.8 }}>
              {paragraphJa}
            </p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-hairline bg-surface p-6">
            <p className="t-mono text-ink-muted">{t.paltTitle}</p>
            <p lang="ja" className="mt-3 text-ink" style={{ fontSize: 28, fontWeight: 600, lineHeight: 1.5, fontFeatureSettings: '"palt" 1' }}>
              「引用」と（括弧）の間隔。
            </p>
            <p lang="ja" className="mt-1 text-ink" style={{ fontSize: 28, fontWeight: 600, lineHeight: 1.5, fontFeatureSettings: '"palt" 0' }}>
              「引用」と（括弧）の間隔。
            </p>
            <p className="t-caption mt-2 text-ink-secondary">{t.paltCaption}</p>
          </div>
          <div className="rounded-lg border border-hairline bg-surface p-6">
            <p className="t-mono text-ink-muted">{t.tabularTitle}</p>
            <div className="mt-3 grid grid-cols-2 gap-4 text-ink">
              <div>
                <p className="t-caption text-ink-muted">proportional</p>
                <p style={{ fontVariantNumeric: "proportional-nums" }}>{t.amounts[0]}<br />{t.amounts[1]}</p>
              </div>
              <div>
                <p className="t-caption text-ink-muted">tabular</p>
                <p className="tabular">{t.amounts[0]}<br />{t.amounts[1]}</p>
              </div>
            </div>
          </div>
        </div>
        <ul className="t-body-sm mt-6 grid gap-2 text-ink-secondary md:grid-cols-2">
          {t.rules.map(([code, text]) => (
            <li key={text}>
              {code && <code>{code}</code>}
              {text}
            </li>
          ))}
        </ul>
      </Section>

      <Section id="why" title={t.whyTitle}>
        <Why>
          {t.why.map((para) => (
            <p key={para}>{para}</p>
          ))}
        </Why>
        <SourceList sources={sources(t.sourceNotes)} />
      </Section>
    </div>
  );
}
