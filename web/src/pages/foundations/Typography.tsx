import { PageHeader, Section, SourceList, Spec, Why } from "../../layout/Page";
import { typeRoles, tokens } from "../../lib/tokens";

const jaSample = "文字の大きさと太さで階層をつくる。色や飾りは後。";
const enSample = "Hierarchy comes from size and weight, not from color.";

const paragraphJa =
  "本文は 16px を基準にします。日本語は漢字と仮名で字面の密度が変わるため、行間を 1.8 まで広げると行の切れ目が読み取りやすくなります。行の長さは全角 40 文字前後を上限にし、それより長い場合は段組みか余白で区切ります。";

const sources = [
  { title: "Geist Font", url: "https://vercel.com/font", note: "Vercel。OFL ライセンス、可変フォント、タブラー数字" },
  { title: "Noto Sans JP", url: "https://fonts.google.com/noto/specimen/Noto+Sans+JP", note: "Google Fonts。可変、JIS 第 1 から第 4 水準まで収録" },
  { title: "Requirements for Japanese Text Layout (JLReq)", url: "https://www.w3.org/TR/jlreq/", note: "W3C。禁則、行間、字間の基礎" },
  { title: "WCAG 2.2 Understanding 1.4.12 Text Spacing", url: "https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html", note: "行間 1.5 倍、段落間 2 倍まで壊れないこと" },
  { title: "Practical Typography: Line length", url: "https://practicaltypography.com/line-length.html", note: "1 行 45 から 90 文字" },
  { title: "MDN: font-variant-numeric", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-numeric", note: "tabular-nums" },
];

export function Typography() {
  return (
    <div>
      <PageHeader title="文字" lead="Geist と Noto Sans JP、8 段階のサイズ、3 つの太さ。階層は文字だけで作ります。" />

      <Section id="roles" title="タイプロール" lead="tokens.json に定義された 11 のロール。日本語と欧文の実寸を並べています。">
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
                <p className="t-caption mt-2 text-ink-secondary">{r.use}</p>
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

      <Section id="stack" title="フォントスタック" lead="欧文は Geist、日本語は Noto Sans JP。両方とも可変フォントで、x ハイトが近いので混植しても段差が出ません。">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-hairline bg-surface p-6">
            <p className="t-mono text-ink-muted">--ds-font-sans</p>
            <p className="t-mono mt-2 text-ink" style={{ overflowWrap: "anywhere" }}>
              {tokens.font.family.sans.$value.map((f) => (f.includes(" ") ? `"${f}"` : f)).join(", ")}
            </p>
            <p className="mt-6 text-ink" style={{ fontSize: 28, lineHeight: 1.4, fontWeight: 600, letterSpacing: "-0.015em" }}>
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
          このサイトでは fontsource パッケージから自前配信しています。Noto Sans JP は 120 個の unicode-range サブセットに分割され、ページに現れた文字の分だけ読み込まれます。
        </p>
      </Section>

      <Section id="japanese" title="日本語組版の規則" lead="同じ文章を行間 1.5 と 1.8 で並べています。右のほうが行の切れ目を追いやすいはずです。">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-hairline bg-surface p-6">
            <p className="t-mono text-ink-muted">line-height: 1.5（欧文向けの値）</p>
            <p lang="ja" className="mt-4 text-ink" style={{ lineHeight: 1.5 }}>
              {paragraphJa}
            </p>
          </div>
          <div className="rounded-lg border border-hairline bg-surface p-6">
            <p className="t-mono text-ink-muted">line-height: 1.8（--ds-leading-body-ja）</p>
            <p lang="ja" className="mt-4 text-ink" style={{ lineHeight: 1.8 }}>
              {paragraphJa}
            </p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-hairline bg-surface p-6">
            <p className="t-mono text-ink-muted">見出しのみ palt（プロポーショナル詰め）</p>
            <p className="mt-3 text-ink" style={{ fontSize: 28, fontWeight: 600, lineHeight: 1.5, fontFeatureSettings: '"palt" 1' }}>
              「引用」と（括弧）の間隔。
            </p>
            <p className="mt-1 text-ink" style={{ fontSize: 28, fontWeight: 600, lineHeight: 1.5, fontFeatureSettings: '"palt" 0' }}>
              「引用」と（括弧）の間隔。
            </p>
            <p className="t-caption mt-2 text-ink-secondary">上が palt あり、下がなし。本文で詰めると行のリズムが崩れるので見出しだけに使います。</p>
          </div>
          <div className="rounded-lg border border-hairline bg-surface p-6">
            <p className="t-mono text-ink-muted">tabular-nums で数字を揃える</p>
            <div className="mt-3 grid grid-cols-2 gap-4 text-ink">
              <div>
                <p className="t-caption text-ink-muted">proportional</p>
                <p style={{ fontVariantNumeric: "proportional-nums" }}>1,111,111 円<br />9,999,999 円</p>
              </div>
              <div>
                <p className="t-caption text-ink-muted">tabular</p>
                <p className="tabular">1,111,111 円<br />9,999,999 円</p>
              </div>
            </div>
          </div>
        </div>
        <ul className="t-body-sm mt-6 grid gap-2 text-ink-secondary md:grid-cols-2">
          <li><code>line-break: strict</code> で行頭の句読点を禁止する。</li>
          <li><code>overflow-wrap: anywhere</code> で長い URL やトークン名をはみ出させない。</li>
          <li>字間は 0 から 0.02em。日本語に負の字間は使わない。</li>
          <li>見出しの行間は 1.4 から 1.5。欧文の 1.2 では詰まりすぎる。</li>
        </ul>
      </Section>

      <Section id="why" title="なぜこの選択か">
        <Why>
          <p>
            Geist はスクリーン表示のために設計され、OFL で配布されています。可変フォントなので 400、500、600 の 3 ウェイトを 1 ファイルで賄えます。タブラー数字を持つため、表や価格の桁が揃います。
          </p>
          <p>
            Noto Sans JP は日本語フォントの中で最も収録字数が多く、こちらも可変です。Geist と x ハイトが近く、混植したときに欧文が浮いたり沈んだりしません。DESIGN.md §3 はこう書いています。「Latin と Japanese は 2 つのサブセットとして読み込む。5 MB のファイルを 1 つで配ってはいけない」。
          </p>
          <p>
            サイズは 12、14、16、18、20、28、36、56 の 8 段階に絞っています。段階が多いと、似た大きさの文字が同じ画面に並び、階層が読めなくなります。12px 未満は使いません。太さは本文 400、ラベル 500、見出し 600 に固定し、700 以上は display 以外で使いません。
          </p>
          <p>
            行間は欧文 1.6、日本語 1.8。日本語は文字の上下いっぱいまで字面があるため、同じ行間だと行がくっついて見えます。行長の上限は欧文 65ch、日本語は全角 40 字です。長すぎる行は視線が戻る位置を見失います。
          </p>
        </Why>
        <SourceList sources={sources} />
      </Section>
    </div>
  );
}
